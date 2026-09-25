"""Run from backend with: python -m unittest discover -s tests."""
import os
import unittest
from unittest.mock import patch

os.environ['DATABASE_URL'] = 'sqlite://'

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool
from app.database import Base, get_db
from app.models import TutorProfile
from app.main import app


class PublicRouterTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine('sqlite://', connect_args={'check_same_thread': False}, poolclass=StaticPool)
        Base.metadata.create_all(self.engine)
        with Session(self.engine) as db:
            for name, subject, fee, experience, approved in [
                ('Alice', 'Mathematics', 600, 2, True),
                ('Bob', 'Physics', 400, 7, True),
                ('Hidden', 'Mathematics', 100, 10, False),
            ]:
                db.add(TutorProfile(user_id=len(db.new) + 1, full_name=name,
                    qualification='BSc', subjects=[subject], classes_handled=['10'],
                    board='CBSE', teaching_mode='online', expected_fee=fee,
                    experience_years=experience, is_approved=approved))
            db.commit()
        def database():
            with Session(self.engine) as db:
                yield db
        app.dependency_overrides[get_db] = database
        self.client = TestClient(app)

    def tearDown(self):
        app.dependency_overrides.clear()
        self.client.close()
        self.engine.dispose()

    def names(self, **params):
        response = self.client.get('/api/tutors', params=params)
        self.assertEqual(response.status_code, 200, response.text)
        return [item['full_name'] for item in response.json()]

    def test_sqlite_subject_and_text_search(self):
        self.assertEqual(self.names(subject='Mathematics'), ['Alice'])
        self.assertEqual(self.names(search='physics'), ['Bob'])
        self.assertEqual(self.names(search='alice'), ['Alice'])
        self.assertEqual(self.names(subject='Unknown'), [])

    def test_fee_sort_names_and_legacy_aliases(self):
        for sort in ('fee_asc', 'fee_low'):
            self.assertEqual(self.names(sort=sort), ['Bob', 'Alice'])
        for sort in ('fee_desc', 'fee_high'):
            self.assertEqual(self.names(sort=sort), ['Alice', 'Bob'])

    def test_experience_filter(self):
        self.assertEqual(self.names(min_experience=5), ['Bob'])
        self.assertEqual(self.client.get('/api/tutors', params={'min_experience': -1}).status_code, 422)

    def test_contact_delivery_result(self):
        form = dict(name='Parent', email='parent@example.com', subject='Enquiry', message='Hello')
        for sent, status in ((False, 503), (True, 200)):
            with patch('app.routers.public_router.send_contact_email', return_value=sent):
                self.assertEqual(self.client.post('/api/contact', json=form).status_code, status)

    def test_slash_alias_uses_same_filters_and_response(self):
        for params in ({}, {'subject': 'Mathematics'}, {'search': 'no-match'},
                       {'min_experience': 5}, {'sort': 'fee_asc'}, {'skip': 1, 'limit': 1}):
            canonical = self.client.get('/api/tutors', params=params)
            alias = self.client.get('/api/tutors/', params=params)
            self.assertEqual(alias.status_code, 200, alias.text)
            self.assertEqual(alias.json(), canonical.json())
            self.assertEqual(alias.headers['x-total-count'], canonical.headers['x-total-count'])

    def test_class_filter_matches_array_items(self):
        self.assertEqual(set(self.names(class_level='10')), {'Alice', 'Bob'})
        self.assertEqual(self.names(class_level='1'), [])

    def test_pagination_total_and_public_approval_filter(self):
        first = self.client.get('/api/tutors', params={'limit': 1, 'sort': 'fee_asc'})
        second = self.client.get('/api/tutors', params={'limit': 1, 'skip': 1, 'sort': 'fee_asc'})
        self.assertEqual(first.headers['x-total-count'], '2')
        self.assertEqual(second.headers['x-total-count'], '2')
        self.assertEqual(first.json()[0]['full_name'], 'Bob')
        self.assertEqual(second.json()[0]['full_name'], 'Alice')
        self.assertEqual(self.names(skip=2), [])
        self.assertNotIn('Hidden', self.names(approved_only='false'))

    def test_total_header_is_exposed_to_frontend(self):
        response = self.client.get('/api/tutors', headers={'Origin': 'https://my-tution.vercel.app'})
        self.assertIn('X-Total-Count', response.headers['access-control-expose-headers'])

    def test_profile_route_is_still_protected(self):
        self.assertEqual(self.client.get('/api/tutors/profile/mine').status_code, 401)
