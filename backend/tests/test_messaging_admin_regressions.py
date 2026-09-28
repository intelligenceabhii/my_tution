"""Regressions from the local end-user audit; all data is isolated."""
import unittest
from unittest.mock import patch
from sqlalchemy.orm import Session
from sqlalchemy import text
import test_user_journey as journey
from app.models import User, TutorProfile, ParentRequirement, TutorApplication, Conversation, Message, Favorite, Review, LearningSession, DoubtQuery, Report

class MessagingAdminTests(unittest.TestCase):
    setUp = journey.UserJourneyTests.setUp
    tearDown = journey.UserJourneyTests.tearDown
    request = journey.UserJourneyTests.request

    def account(self, role):
        return self.request('POST','/auth/register',data={'email':f'{role}@example.invalid','password':'TestPassword123!','role':role})

    def admin(self):
        return self.request('POST','/auth/login',data={'email':'admin@example.invalid','password':'TestPassword123!'})['access_token']

    def fixture(self):
        parent=self.account('parent');tutor=self.account('tutor');p=parent['access_token'];t=tutor['access_token']
        profile=self.request('PUT','/tutors/profile',t,{'full_name':'Audit Teacher','qualification':'BSc','subjects':['Mathematics'],'classes_handled':['10'],'board':'CBSE','teaching_mode':'online'})
        self.request('PUT',f"/admin/tutors/{profile['id']}/approve",self.admin())
        req=self.request('POST','/parents/requirements',p,{'child_class':'10','subjects_needed':['Mathematics'],'board':'CBSE','teaching_mode':'online'})
        application=self.request('POST',f"/apply/{req['id']}",t,{})
        self.request('PUT',f"/applications/{application['id']}/status",p,{'status':'accepted'})
        return parent,tutor,profile,req

    def test_conversation_membership_is_exact(self):
        with Session(self.engine) as db:
            db.add_all([User(id=i,email=f'user{i}@example.invalid',password_hash='unused',role='parent') for i in (10,11)])
            db.add(Conversation(participant_ids=[10,11],subject='Private'));db.commit()
        admin=self.admin()
        self.assertEqual(self.request('GET','/conversations',admin),[])
        self.request('PUT','/conversations/1/read',admin,status=403)

    def test_message_timestamp_validation_and_reuse(self):
        parent=self.account('parent');tutor=self.account('tutor');p=parent['access_token'];t=tutor['access_token']
        c=self.request('POST','/conversations',p,{'receiver_id':tutor['user_id']})['id']
        self.request('POST',f'/conversations/{c}/messages',p,{'conversation_id':c,'message':'  '},status=422)
        self.request('POST',f'/conversations/{c}/messages',p,{'conversation_id':c+1,'message':'Wrong room'},status=400)
        sent=self.request('POST',f'/conversations/{c}/messages',p,{'conversation_id':c,'message':'Hello'})
        listed=self.request('GET','/conversations',t)
        self.assertEqual(listed[0]['last_message_at'],sent['created_at'])
        self.assertEqual(listed[0]['unread_count'],1)
        with Session(self.engine) as db:db.get(Conversation,c).last_message_at=None;db.commit()
        self.assertEqual(self.request('GET','/conversations',t)[0]['last_message_at'],sent['created_at'])
        self.request('PUT',f'/conversations/{c}/read',t)
        self.assertTrue(self.request('GET',f'/conversations/{c}/messages',p)[0]['is_read'])
        self.assertEqual(self.request('POST','/conversations',t,{'receiver_id':parent['user_id']})['id'],c)

    def test_disabled_admin_and_self_deactivation(self):
        admin=self.admin()
        self.request('PUT','/admin/users/1/deactivate',admin,status=400)
        with Session(self.engine) as db:db.get(User,1).is_active=False;db.commit()
        self.request('GET','/admin/stats',admin,status=401)

    def test_context_before_sessions_and_provider_error(self):
        parent,tutor,profile,req=self.fixture();p=parent['access_token']
        self.assertEqual(self.request('GET','/sessions/recent-context',p)['requirement_id'],req['id'])
        with patch('app.routers.learning_router.generate_content',side_effect=RuntimeError('private detail')):
            self.request('POST','/doubt',p,{'requirement_id':req['id'],'question':'Explain fractions'},status=503)
        self.assertEqual(self.request('GET','/doubt-history',p),[])

    def test_admin_delete_cleans_dependencies(self):
        parent,tutor,profile,req=self.fixture();p=parent['access_token'];t=tutor['access_token'];tid=profile['id'];rid=req['id']
        self.request('POST',f'/favorites/{tid}',p)
        self.request('POST','/reviews/',p,{'tutor_id':tid,'rating':4,'comment':'Audit'})
        self.request('POST','/reports',p,{'tutor_id':tid,'reason':'Audit'})
        self.request('POST','/sessions',t,{'requirement_id':rid,'subject':'Mathematics','topics_covered':['Fractions'],'duration_minutes':30})
        with patch('app.routers.learning_router.generate_content',return_value='Answer'):
            self.request('POST','/doubt',p,{'requirement_id':rid,'question':'Explain fractions'})
        c=self.request('POST','/conversations',p,{'receiver_id':tutor['user_id']})['id']
        self.request('POST',f'/conversations/{c}/messages',p,{'conversation_id':c,'message':'Audit'})
        with self.engine.connect() as con:con.execute(text('PRAGMA foreign_keys=ON'))
        self.request('DELETE',f"/admin/users/{parent['user_id']}",self.admin())
        self.assertEqual(self.request('GET','/my-applications',t),[])
        self.assertEqual(self.request('GET','/tutor/my-accepted-requirements',t),[])
        self.assertEqual(self.request('GET','/conversations',t),[])
        with Session(self.engine) as db:
            for model in (ParentRequirement,TutorApplication,Message,Conversation,Favorite,Review,LearningSession,DoubtQuery,Report):
                self.assertEqual(db.query(model).count(),0,model.__name__)
        self.assertEqual(self.request('GET',f'/tutors/{tid}')['rating'],0)

    def test_admin_decline_preserves_links_and_real_stats(self):
        parent,tutor,profile,req=self.fixture();p=parent['access_token'];t=tutor['access_token'];tid=profile['id']
        self.request('POST','/reviews/',p,{'tutor_id':tid,'rating':4})
        stats=self.request('GET','/admin/stats',self.admin())
        self.assertEqual(stats['total_reviews'],1);self.assertEqual(stats['avg_rating'],4)
        self.request('PUT',f'/admin/tutors/{tid}/decline',self.admin())
        with Session(self.engine) as db:self.assertIsNotNone(db.get(TutorProfile,tid))
        self.request('GET',f'/tutors/{tid}',status=404)
        self.request('GET','/my-applications',t,status=401)

    def test_disabled_tutor_hidden_and_cannot_receive_new_messages(self):
        parent,tutor,profile,req=self.fixture();p=parent['access_token'];tid=profile['id']
        self.request('PUT',f"/admin/users/{tutor['user_id']}/deactivate",self.admin())
        self.assertEqual(self.request('GET','/tutors'),[])
        self.request('GET',f'/tutors/{tid}',status=404)
        self.assertEqual(self.request('GET','/users/search?q=tutor',p),[])
        self.request('POST','/conversations',p,{'receiver_id':tutor['user_id']},status=404)
        self.request('PUT',f"/admin/users/{tutor['user_id']}/activate",self.admin())
        self.assertEqual(len(self.request('GET','/tutors')),1)

    def test_delete_tutor_cleans_links_but_preserves_parent_requirement(self):
        parent,tutor,profile,req=self.fixture();p=parent['access_token'];t=tutor['access_token'];tid=profile['id']
        self.request('POST',f'/favorites/{tid}',p)
        self.request('POST','/reviews/',p,{'tutor_id':tid,'rating':5})
        self.request('POST','/reports',p,{'tutor_id':tid,'reason':'Audit'})
        self.request('POST','/sessions',t,{'requirement_id':req['id'],'subject':'Math','topics_covered':['Fractions']})
        with self.engine.connect() as con:con.execute(text('PRAGMA foreign_keys=ON'))
        self.request('DELETE',f"/admin/users/{tutor['user_id']}",self.admin())
        self.assertEqual(self.request('GET','/favorites',p),[])
        self.assertEqual(self.request('GET','/sessions',p),[])
        self.assertEqual(self.request('GET',f"/parents/requirements/{req['id']}/applications",p),[])
        self.assertEqual(len(self.request('GET','/parents/requirements/mine',p)),1)

    def test_invalid_sessions_do_not_save(self):
        parent,tutor,profile,req=self.fixture();t=tutor['access_token']
        valid={'requirement_id':req['id'],'subject':'Math','topics_covered':['Fractions'],'duration_minutes':30}
        for changes in ({'subject':' '},{'topics_covered':[]},{'duration_minutes':-1}):
            self.request('POST','/sessions',t,{**valid,**changes},status=422)
        self.assertEqual(self.request('GET','/sessions',t),[])
