"""Integration smoke test using isolated data and a stubbed AI provider."""
import json
import os
import unittest
from unittest.mock import patch

os.environ['DATABASE_URL'] = 'sqlite://'

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool
from app.main import app
from app.database import Base, get_db
from app.models import User
from app.auth import hash_password


class UserJourneyTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine('sqlite://', connect_args={'check_same_thread': False}, poolclass=StaticPool)
        Base.metadata.create_all(self.engine)
        with Session(self.engine) as db:
            db.add(User(email='admin@example.invalid', password_hash=hash_password('TestPassword123!'), role='admin'))
            db.commit()
        def database():
            with Session(self.engine) as db:
                yield db
        app.dependency_overrides[get_db] = database
        self.client = TestClient(app)

    def tearDown(self):
        self.client.close()
        app.dependency_overrides.clear()
        self.engine.dispose()

    def request(self, method, path, token=None, data=None, status=200):
        response = self.client.request(method, '/api' + path,
            headers={'Authorization': f'Bearer {token}'} if token else {}, json=data)
        self.assertEqual(response.status_code, status, response.text)
        return response.json()

    def test_parent_tutor_admin_journey(self):
        accounts = {}
        for role in ('parent', 'tutor'):
            accounts[role] = self.request('POST', '/auth/register', data={
                'email': role + '@example.invalid', 'password': 'TestPassword123!', 'role': role})
        parent = accounts['parent']['access_token']
        tutor = accounts['tutor']['access_token']
        for role, token in (('parent', parent), ('tutor', tutor)):
            self.assertEqual(self.request('GET', '/auth/me', token)['role'], role)
            self.request('POST', '/auth/login', data={'email': role + '@example.invalid', 'password': 'TestPassword123!'})
        self.request('GET', '/admin/stats', parent, status=403)
        admin = self.request('POST', '/auth/login', data={'email': 'admin@example.invalid', 'password': 'TestPassword123!'})['access_token']
        profile = self.request('PUT', '/tutors/profile', tutor, {
            'full_name': 'Test Tutor', 'qualification': 'BSc', 'subjects': ['Mathematics'],
            'classes_handled': ['10'], 'board': 'CBSE', 'teaching_mode': 'online',
            'expected_fee': 500, 'experience_years': 3})
        tutor_id = profile['id']
        self.assertEqual(self.request('GET', '/tutors'), [])
        self.request('PUT', f'/admin/tutors/{tutor_id}/approve', admin)
        self.assertEqual(self.request('GET', '/tutors')[0]['id'], tutor_id)
        req = self.request('POST', '/parents/requirements', parent, {
            'child_class': '10', 'subjects_needed': ['Mathematics'], 'board': 'CBSE',
            'teaching_mode': 'online', 'budget_per_month': 600})
        req_id = req['id']
        application = self.request('POST', f'/apply/{req_id}', tutor, {'cover_note': 'Available'})
        self.request('PUT', f"/applications/{application['id']}/status", parent, {'status': 'accepted'})
        self.assertEqual(self.request('GET', '/my-applications', tutor)[0]['status'], 'accepted')
        self.request('POST', f'/favorites/{tutor_id}', parent)
        self.assertTrue(self.request('GET', f'/favorites/check/{tutor_id}', parent)['is_favorite'])
        self.request('DELETE', f'/favorites/{tutor_id}', parent)
        conversation = self.request('POST', '/conversations', parent, {'receiver_id': accounts['tutor']['user_id'], 'subject': 'Test lesson'})
        conversation_id = conversation['id']
        self.request('POST', f'/conversations/{conversation_id}/messages', parent, {'conversation_id': conversation_id, 'message': 'Test message between isolated test accounts'})
        self.assertEqual(len(self.request('GET', f'/conversations/{conversation_id}/messages', tutor)), 1)
        matches = [{'rank': 1, 'tutor_id': tutor_id, 'tutor_name': 'Test Tutor', 'match_score': 90, 'reason': 'Subject and budget fit'}]
        with patch('app.ai.match_flow.generate_content', return_value=json.dumps(matches)), patch('app.ai.match_flow.get_match_prompt_template', return_value=''):
            result = self.request('POST', f'/ai/match/{req_id}', parent)
            self.assertEqual(result['matches'][0]['tutor_id'], tutor_id)
        self.request('PUT', f'/parents/requirements/{req_id}/close', parent)
        self.assertEqual(self.request('GET', '/parents/requirements/mine', parent)[0]['status'], 'closed')
