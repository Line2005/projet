from django.test import TestCase

# Create your tests here.
from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from .models import (
    User, Entrepreneur, Investor, Organization, Project, ProjectDocument,
    HelpRequest, FinancialRequest, TechnicalRequest, FinancialProposal,
    TechnicalProposal, Contract, Collaboration, EventRegistration,
    Announcement, Event, Conversation, Message
)
from datetime import datetime, timedelta

User = get_user_model()

class UserModelTest(TestCase):
    def test_create_user(self):
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            phone='1234567890',
            role='entrepreneur'
        )
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.phone, '1234567890')
        self.assertEqual(user.role, 'entrepreneur')
        self.assertTrue(user.check_password('testpass123'))

    def test_create_superuser(self):
        admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass123',
            phone='0987654321',
            role='admin'
        )
        self.assertEqual(admin_user.username, 'admin')
        self.assertTrue(admin_user.is_superuser)
        self.assertTrue(admin_user.is_staff)

class EntrepreneurModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='entrepreneur_user',
            email='entrepreneur@example.com',
            password='testpass123',
            phone='1234567890',
            role='entrepreneur'
        )

    def test_create_entrepreneur(self):
        entrepreneur = Entrepreneur.objects.create(
            user=self.user,
            first_name='John',
            last_name='Doe',
            bio='A passionate entrepreneur.'
        )
        self.assertEqual(entrepreneur.first_name, 'John')
        self.assertEqual(entrepreneur.user.username, 'entrepreneur_user')

class InvestorModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='investor_user',
            email='investor@example.com',
            password='testpass123',
            phone='1234567890',
            role='investor'
        )

    def test_create_investor(self):
        investor = Investor.objects.create(
            user=self.user,
            first_name='Jane',
            last_name='Doe',
            bio='An experienced investor.'
        )
        self.assertEqual(investor.first_name, 'Jane')
        self.assertEqual(investor.user.username, 'investor_user')

class OrganizationModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='org_user',
            email='org@example.com',
            password='testpass123',
            phone='1234567890',
            role='ONG-Association'
        )

    def test_create_organization(self):
        organization = Organization.objects.create(
            user=self.user,
            organization_name='Test Org',
            registration_number='12345',
            founded_year=2000,
            mission_statement='To test organizations.',
            website_url='https://example.com',
            bio='A test organization.'
        )
        self.assertEqual(organization.organization_name, 'Test Org')
        self.assertEqual(organization.user.username, 'org_user')

class ProjectModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='project_user',
            email='project@example.com',
            password='testpass123',
            phone='1234567890',
            role='entrepreneur'
        )
        # Create an Entrepreneur object for the user
        self.entrepreneur = Entrepreneur.objects.create(
            user=self.user,
            first_name='John',
            last_name='Doe',
            bio='A passionate entrepreneur.'
        )

    def test_create_project(self):
        project = Project.objects.create(
            user=self.user,
            entrepreneur=self.entrepreneur,
            project_name='Test Project',
            sector='technology',
            description='A test project.',
            target_audience='Developers',
            estimated_budget=10000.00,
            financing_plan='Self-funded'
        )
        self.assertEqual(project.project_name, 'Test Project')
        self.assertEqual(project.status, 'pending')

    def test_project_save_method(self):
        project = Project(
            user=self.user,
            project_name='Test Project',
            sector='technology',
            description='A test project.',
            target_audience='Developers',
            estimated_budget=10000.00,
            financing_plan='Self-funded'
        )
        project.save()  # This should automatically set the entrepreneur
        self.assertEqual(project.entrepreneur, self.entrepreneur)

class ProjectDocumentModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='doc_user',
            email='doc@example.com',
            password='testpass123',
            phone='1234567890',
            role='entrepreneur'
        )
        self.entrepreneur = Entrepreneur.objects.create(
            user=self.user,
            first_name='John',
            last_name='Doe',
            bio='A passionate entrepreneur.'
        )
        self.project = Project.objects.create(
            user=self.user,
            entrepreneur=self.entrepreneur,
            project_name='Test Project',
            sector='technology',
            description='A test project.',
            target_audience='Developers',
            estimated_budget=10000.00,
            financing_plan='Self-funded'
        )

    def test_create_project_document(self):
        document = ProjectDocument.objects.create(
            project=self.project,
            document_type='id_card',
            file='documents/id_card.pdf',
            is_required=True
        )
        self.assertEqual(document.document_type, 'id_card')
        self.assertEqual(document.project.project_name, 'Test Project')

class HelpRequestModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='help_user',
            email='help@example.com',
            password='testpass123',
            phone='1234567890',
            role='entrepreneur'
        )
        self.entrepreneur = Entrepreneur.objects.create(
            user=self.user,
            first_name='John',
            last_name='Doe',
            bio='A passionate entrepreneur.'
        )
        self.project = Project.objects.create(
            user=self.user,
            entrepreneur=self.entrepreneur,
            project_name='Test Project',
            sector='technology',
            description='A test project.',
            target_audience='Developers',
            estimated_budget=10000.00,
            financing_plan='Self-funded'
        )

    def test_create_help_request(self):
        help_request = HelpRequest.objects.create(
            project=self.project,
            entrepreneur=self.entrepreneur,
            request_type='technical',
            specific_need='Need technical expertise',
            description='We need help with our project.',
            status='pending'
        )
        self.assertEqual(help_request.specific_need, 'Need technical expertise')
        self.assertEqual(help_request.status, 'pending')

class FinancialRequestModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='finance_user',
            email='finance@example.com',
            password='testpass123',
            phone='1234567890',
            role='entrepreneur'
        )
        self.entrepreneur = Entrepreneur.objects.create(
            user=self.user,
            first_name='John',
            last_name='Doe',
            bio='A passionate entrepreneur.'
        )
        self.project = Project.objects.create(
            user=self.user,
            entrepreneur=self.entrepreneur,
            project_name='Test Project',
            sector='technology',
            description='A test project.',
            target_audience='Developers',
            estimated_budget=10000.00,
            financing_plan='Self-funded'
        )
        self.help_request = HelpRequest.objects.create(
            project=self.project,
            entrepreneur=self.entrepreneur,
            request_type='financial',
            specific_need='Need financial support',
            description='We need funding for our project.',
            status='pending'
        )

    def test_create_financial_request(self):
        financial_request = FinancialRequest.objects.create(
            help_request=self.help_request,
            amount_requested=5000.00,
            interest_rate=5.00,
            duration_months=12
        )
        self.assertEqual(financial_request.amount_requested, 5000.00)
        self.assertEqual(financial_request.interest_rate, 5.00)
        self.assertEqual(financial_request.duration_months, 12)

    def test_calculate_monthly_payment(self):
        financial_request = FinancialRequest.objects.create(
            help_request=self.help_request,
            amount_requested=5000.00,
            interest_rate=5.00,
            duration_months=12
        )
        monthly_payment = financial_request.calculate_monthly_payment()
        self.assertAlmostEqual(monthly_payment, 428.04, places=2)

    def test_calculate_total_repayment(self):
        financial_request = FinancialRequest.objects.create(
            help_request=self.help_request,
            amount_requested=5000.00,
            interest_rate=5.00,
            duration_months=12
        )
        total_repayment = financial_request.calculate_total_repayment()
        self.assertAlmostEqual(total_repayment, 5136.48, places=2)

    def test_calculate_total_interest(self):
        financial_request = FinancialRequest.objects.create(
            help_request=self.help_request,
            amount_requested=5000.00,
            interest_rate=5.00,
            duration_months=12
        )
        total_interest = financial_request.calculate_total_interest()
        self.assertAlmostEqual(total_interest, 136.48, places=2)

class TechnicalRequestModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='tech_user',
            email='tech@example.com',
            password='testpass123',
            phone='1234567890',
            role='entrepreneur'
        )
        self.entrepreneur = Entrepreneur.objects.create(
            user=self.user,
            first_name='John',
            last_name='Doe',
            bio='A passionate entrepreneur.'
        )
        self.project = Project.objects.create(
            user=self.user,
            entrepreneur=self.entrepreneur,
            project_name='Test Project',
            sector='technology',
            description='A test project.',
            target_audience='Developers',
            estimated_budget=10000.00,
            financing_plan='Self-funded'
        )
        self.help_request = HelpRequest.objects.create(
            project=self.project,
            entrepreneur=self.entrepreneur,
            request_type='technical',
            specific_need='Need technical expertise',
            description='We need help with our project.',
            status='pending'
        )

    def test_create_technical_request(self):
        technical_request = TechnicalRequest.objects.create(
            help_request=self.help_request,
            expertise_needed='Django development',
            estimated_duration=30
        )
        self.assertEqual(technical_request.expertise_needed, 'Django development')
        self.assertEqual(technical_request.estimated_duration, 30)

class FinancialProposalModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='finance_prop_user',
            email='finance_prop@example.com',
            password='testpass123',
            phone='1234567890',
            role='investor'
        )
        self.investor = Investor.objects.create(
            user=self.user,
            first_name='Jane',
            last_name='Doe',
            bio='An experienced investor.'
        )
        self.entrepreneur_user = User.objects.create_user(
            username='entrepreneur_prop_user',
            email='entrepreneur_prop@example.com',
            password='testpass123',
            phone='0987654321',
            role='entrepreneur'
        )
        self.entrepreneur = Entrepreneur.objects.create(
            user=self.entrepreneur_user,
            first_name='John',
            last_name='Doe',
            bio='A passionate entrepreneur.'
        )
        self.project = Project.objects.create(
            user=self.entrepreneur_user,
            entrepreneur=self.entrepreneur,
            project_name='Test Project',
            sector='technology',
            description='A test project.',
            target_audience='Developers',
            estimated_budget=10000.00,
            financing_plan='Self-funded'
        )
        self.help_request = HelpRequest.objects.create(
            project=self.project,
            entrepreneur=self.entrepreneur,
            request_type='financial',
            specific_need='Need financial support',
            description='We need funding for our project.',
            status='pending'
        )
        self.financial_request = FinancialRequest.objects.create(
            help_request=self.help_request,
            amount_requested=5000.00,
            interest_rate=5.00,
            duration_months=12
        )

    def test_create_financial_proposal(self):
        financial_proposal = FinancialProposal.objects.create(
            help_request=self.help_request,
            investor=self.investor,
            investment_amount=2000.00,
            investment_type='equity',
            payment_schedule='monthly',
            expected_return='10% ROI',
            timeline='12 months',
            additional_terms='No additional terms.'
        )
        self.assertEqual(financial_proposal.investment_amount, 2000.00)
        self.assertEqual(financial_proposal.investment_type, 'equity')

    def test_financial_proposal_save_method(self):
        financial_proposal = FinancialProposal(
            help_request=self.help_request,
            investor=self.investor,
            investment_amount=6000.00,
            investment_type='equity',
            payment_schedule='monthly',
            expected_return='10% ROI',
            timeline='12 months',
            additional_terms='No additional terms.',
            status='accepted'
        )
        with self.assertRaises(ValidationError):
            financial_proposal.save()

class TechnicalProposalModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='tech_prop_user',
            email='tech_prop@example.com',
            password='testpass123',
            phone='1234567890',
            role='investor'
        )
        self.investor = Investor.objects.create(
            user=self.user,
            first_name='Jane',
            last_name='Doe',
            bio='An experienced investor.'
        )
        self.entrepreneur_user = User.objects.create_user(
            username='entrepreneur_prop_user',
            email='entrepreneur_prop@example.com',
            password='testpass123',
            phone='0987654321',
            role='entrepreneur'
        )
        self.entrepreneur = Entrepreneur.objects.create(
            user=self.entrepreneur_user,
            first_name='John',
            last_name='Doe',
            bio='A passionate entrepreneur.'
        )
        self.project = Project.objects.create(
            user=self.entrepreneur_user,
            entrepreneur=self.entrepreneur,
            project_name='Test Project',
            sector='technology',
            description='A test project.',
            target_audience='Developers',
            estimated_budget=10000.00,
            financing_plan='Self-funded'
        )
        self.help_request = HelpRequest.objects.create(
            project=self.project,
            entrepreneur=self.entrepreneur,
            request_type='technical',
            specific_need='Need technical expertise',
            description='We need help with our project.',
            status='pending'
        )
        self.technical_request = TechnicalRequest.objects.create(
            help_request=self.help_request,
            expertise_needed='Django development',
            estimated_duration=30
        )

    def test_create_technical_proposal(self):
        technical_proposal = TechnicalProposal.objects.create(
            help_request=self.help_request,
            investor=self.investor,
            expertise='Django and React development',
            experience_level='expert',
            availability='Full-time',
            support_duration='6 months',
            support_type='mentoring',
            proposed_approach='We will provide weekly mentoring sessions.',
            expected_outcomes='Improved project quality and faster development.'
        )
        self.assertEqual(technical_proposal.expertise, 'Django and React development')
        self.assertEqual(technical_proposal.experience_level, 'expert')


    class CollaborationModelTest(TestCase):
        def setUp(self):
                self.user = User.objects.create_user(
                    username='collab_user',
                    email='collab@example.com',
                    password='testpass123',
                    phone='1234567890',
                    role='entrepreneur'
                )
                self.entrepreneur = Entrepreneur.objects.create(
                    user=self.user,
                    first_name='John',
                    last_name='Doe',
                    bio='A passionate entrepreneur.'
                )
                self.investor_user = User.objects.create_user(
                    username='investor_collab_user',
                    email='investor_collab@example.com',
                    password='testpass123',
                    phone='0987654321',
                    role='investor'
                )
                self.investor = Investor.objects.create(
                    user=self.investor_user,
                    first_name='Jane',
                    last_name='Doe',
                    bio='An experienced investor.'
                )
                self.project = Project.objects.create(
                    user=self.user,
                    entrepreneur=self.entrepreneur,
                    project_name='Test Project',
                    sector='technology',
                    description='A test project.',
                    target_audience='Developers',
                    estimated_budget=10000.00,
                    financing_plan='Self-funded'
                )
                self.help_request = HelpRequest.objects.create(
                    project=self.project,
                    entrepreneur=self.entrepreneur,
                    request_type='financial',
                    specific_need='Need financial support',
                    description='We need funding for our project.',
                    status='pending'
                )
                self.financial_request = FinancialRequest.objects.create(
                    help_request=self.help_request,
                    amount_requested=5000.00,
                    interest_rate=5.00,
                    duration_months=12
                )
                self.financial_proposal = FinancialProposal.objects.create(
                    help_request=self.help_request,
                    investor=self.investor,
                    investment_amount=2000.00,
                    investment_type='equity',
                    payment_schedule='monthly',
                    expected_return='10% ROI',
                    timeline='12 months',
                    additional_terms='No additional terms.'
                )
                self.contract = Contract.objects.create(
                    financial_proposal=self.financial_proposal,
                    contract_type='financial',
                    pdf_file='contracts/financial_contract.pdf',
                    html_content='<html><body>Contract Content</body></html>'
                )

        def test_create_collaboration(self):
                collaboration = Collaboration.objects.create(
                    entrepreneur=self.entrepreneur,
                    investor=self.investor,
                    project=self.project,
                    contract=self.contract,
                    collaboration_type='financial'
                )
                self.assertEqual(collaboration.entrepreneur.first_name, 'John')
                self.assertEqual(collaboration.investor.first_name, 'Jane')
                self.assertEqual(collaboration.project.project_name, 'Test Project')
                self.assertEqual(collaboration.collaboration_type, 'financial')

        class ContractModelTest(TestCase):
            def setUp(self):
                self.user = User.objects.create_user(
                    username='contract_user',
                    email='contract@example.com',
                    password='testpass123',
                    phone='1234567890',
                    role='investor'
                )
                self.investor = Investor.objects.create(
                    user=self.user,
                    first_name='Jane',
                    last_name='Doe',
                    bio='An experienced investor.'
                )
                self.entrepreneur_user = User.objects.create_user(
                    username='entrepreneur_contract_user',
                    email='entrepreneur_contract@example.com',
                    password='testpass123',
                    phone='0987654321',
                    role='entrepreneur'
                )
                self.entrepreneur = Entrepreneur.objects.create(
                    user=self.entrepreneur_user,
                    first_name='John',
                    last_name='Doe',
                    bio='A passionate entrepreneur.'
                )
                self.project = Project.objects.create(
                    user=self.entrepreneur_user,
                    entrepreneur=self.entrepreneur,
                    project_name='Test Project',
                    sector='technology',
                    description='A test project.',
                    target_audience='Developers',
                    estimated_budget=10000.00,
                    financing_plan='Self-funded'
                )
                self.help_request = HelpRequest.objects.create(
                    project=self.project,
                    entrepreneur=self.entrepreneur,
                    request_type='financial',
                    specific_need='Need financial support',
                    description='We need funding for our project.',
                    status='pending'
                )
                self.financial_request = FinancialRequest.objects.create(
                    help_request=self.help_request,
                    amount_requested=5000.00,
                    interest_rate=5.00,
                    duration_months=12
                )
                self.financial_proposal = FinancialProposal.objects.create(
                    help_request=self.help_request,
                    investor=self.investor,
                    investment_amount=2000.00,
                    investment_type='equity',
                    payment_schedule='monthly',
                    expected_return='10% ROI',
                    timeline='12 months',
                    additional_terms='No additional terms.'
                )

            def test_create_contract(self):
                contract = Contract.objects.create(
                    financial_proposal=self.financial_proposal,
                    contract_type='financial',
                    pdf_file='contracts/financial_contract.pdf',
                    html_content='<html><body>Contract Content</body></html>'
                )
                self.assertEqual(contract.contract_type, 'financial')
                self.assertEqual(contract.financial_proposal.investment_amount, 2000.00)
                self.assertEqual(contract.pdf_file.name, 'contracts/financial_contract.pdf')

            def test_contract_clean_method(self):
                # Test validation when both financial_proposal and technical_proposal are set
                contract = Contract(
                    financial_proposal=self.financial_proposal,
                    technical_proposal=None,
                    contract_type='financial',
                    pdf_file='contracts/financial_contract.pdf',
                    html_content='<html><body>Contract Content</body></html>'
                )
                contract.clean()  # Should not raise an error

                # Test validation when neither financial_proposal nor technical_proposal is set
                contract = Contract(
                    financial_proposal=None,
                    technical_proposal=None,
                    contract_type='financial',
                    pdf_file='contracts/financial_contract.pdf',
                    html_content='<html><body>Contract Content</body></html>'
                )
                with self.assertRaises(ValidationError):
                    contract.clean()

                # Test validation when contract_type does not match proposal type
                contract = Contract(
                    financial_proposal=self.financial_proposal,
                    technical_proposal=None,
                    contract_type='technical',  # Mismatch
                    pdf_file='contracts/financial_contract.pdf',
                    html_content='<html><body>Contract Content</body></html>'
                )
                with self.assertRaises(ValidationError):
                    contract.clean()

            def test_get_proposal_method(self):
                contract = Contract.objects.create(
                    financial_proposal=self.financial_proposal,
                    contract_type='financial',
                    pdf_file='contracts/financial_contract.pdf',
                    html_content='<html><body>Contract Content</body></html>'
                )
                proposal = contract.get_proposal()
                self.assertEqual(proposal, self.financial_proposal)

                # Test with a technical proposal
                technical_proposal = TechnicalProposal.objects.create(
                    help_request=self.help_request,
                    investor=self.investor,
                    expertise='Django and React development',
                    experience_level='expert',
                    availability='Full-time',
                    support_duration='6 months',
                    support_type='mentoring',
                    proposed_approach='We will provide weekly mentoring sessions.',
                    expected_outcomes='Improved project quality and faster development.'
                )
                contract = Contract.objects.create(
                    technical_proposal=technical_proposal,
                    contract_type='technical',
                    pdf_file='contracts/technical_contract.pdf',
                    html_content='<html><body>Contract Content</body></html>'
                )
                proposal = contract.get_proposal()
                self.assertEqual(proposal, technical_proposal)

            class EventRegistrationModelTest(TestCase):
                def setUp(self):
                    self.user = User.objects.create_user(
                        username='event_reg_user',
                        email='event_reg@example.com',
                        password='testpass123',
                        phone='1234567890',
                        role='entrepreneur'
                    )
                    self.organization_user = User.objects.create_user(
                        username='org_event_user',
                        email='org_event@example.com',
                        password='testpass123',
                        phone='0987654321',
                        role='ONG-Association'
                    )
                    self.organization = Organization.objects.create(
                        user=self.organization_user,
                        organization_name='Test Org',
                        registration_number='12345',
                        founded_year=2000,
                        mission_statement='To test organizations.',
                        website_url='https://example.com',
                        bio='A test organization.'
                    )
                    self.event = Event.objects.create(
                        organization=self.organization,
                        title='Test Event',
                        status='published',
                        type='workshop',
                        description='A test event.',
                        date=datetime.now().date() + timedelta(days=10),
                        time=datetime.now().time(),
                        location='Test Location',
                        capacity=100,
                        registration_deadline=datetime.now().date() + timedelta(days=5)
                    )

                def test_create_event_registration(self):
                    event_registration = EventRegistration.objects.create(
                        event=self.event,
                        user=self.user,
                        status='pending',
                        message='I would like to attend this event.'
                    )
                    self.assertEqual(event_registration.event.title, 'Test Event')
                    self.assertEqual(event_registration.user.username, 'event_reg_user')
                    self.assertEqual(event_registration.status, 'pending')

            class AnnouncementModelTest(TestCase):
                def setUp(self):
                    self.user = User.objects.create_user(
                        username='announcement_user',
                        email='announcement@example.com',
                        password='testpass123',
                        phone='1234567890',
                        role='ONG-Association'
                    )
                    self.organization = Organization.objects.create(
                        user=self.user,
                        organization_name='Test Org',
                        registration_number='12345',
                        founded_year=2000,
                        mission_statement='To test organizations.',
                        website_url='https://example.com',
                        bio='A test organization.'
                    )

                def test_create_announcement(self):
                    announcement = Announcement.objects.create(
                        organization=self.organization,
                        title='Test Announcement',
                        type='funding',
                        description='A test announcement.',
                        location='Test Location',
                        deadline=datetime.now().date() + timedelta(days=30),
                        budget=10000.00,
                        contact_email='test@example.com',
                        status='published'
                    )
                    self.assertEqual(announcement.title, 'Test Announcement')
                    self.assertEqual(announcement.type, 'funding')
                    self.assertEqual(announcement.status, 'published')

            class EventModelTest(TestCase):
                def setUp(self):
                    self.user = User.objects.create_user(
                        username='event_user',
                        email='event@example.com',
                        password='testpass123',
                        phone='1234567890',
                        role='ONG-Association'
                    )
                    self.organization = Organization.objects.create(
                        user=self.user,
                        organization_name='Test Org',
                        registration_number='12345',
                        founded_year=2000,
                        mission_statement='To test organizations.',
                        website_url='https://example.com',
                        bio='A test organization.'
                    )

                def test_create_event(self):
                    event = Event.objects.create(
                        organization=self.organization,
                        title='Test Event',
                        status='published',
                        type='workshop',
                        description='A test event.',
                        date=datetime.now().date() + timedelta(days=10),
                        time=datetime.now().time(),
                        location='Test Location',
                        capacity=100,
                        registration_deadline=datetime.now().date() + timedelta(days=5)
                    )
                    self.assertEqual(event.title, 'Test Event')
                    self.assertEqual(event.status, 'published')
                    self.assertEqual(event.type, 'workshop')

                def test_is_draft_property(self):
                    event = Event.objects.create(
                        organization=self.organization,
                        title='Draft Event',
                        status='draft',
                        type='workshop',
                        description='A draft event.',
                        date=datetime.now().date() + timedelta(days=10),
                        time=datetime.now().time(),
                        location='Test Location',
                        capacity=100,
                        registration_deadline=datetime.now().date() + timedelta(days=5)
                    )
                    self.assertTrue(event.is_draft)

            class ConversationModelTest(TestCase):
                def setUp(self):
                    self.user = User.objects.create_user(
                        username='conversation_user',
                        email='conversation@example.com',
                        password='testpass123',
                        phone='1234567890',
                        role='entrepreneur'
                    )
                    self.entrepreneur = Entrepreneur.objects.create(
                        user=self.user,
                        first_name='John',
                        last_name='Doe',
                        bio='A passionate entrepreneur.'
                    )
                    self.project = Project.objects.create(
                        user=self.user,
                        entrepreneur=self.entrepreneur,
                        project_name='Test Project',
                        sector='technology',
                        description='A test project.',
                        target_audience='Developers',
                        estimated_budget=10000.00,
                        financing_plan='Self-funded'
                    )
                    self.help_request = HelpRequest.objects.create(
                        project=self.project,
                        entrepreneur=self.entrepreneur,
                        request_type='technical',
                        specific_need='Need technical expertise',
                        description='We need help with our project.',
                        status='pending'
                    )
                    self.investor_user = User.objects.create_user(
                        username='investor_conversation_user',
                        email='investor_conversation@example.com',
                        password='testpass123',
                        phone='0987654321',
                        role='investor'
                    )
                    self.investor = Investor.objects.create(
                        user=self.investor_user,
                        first_name='Jane',
                        last_name='Doe',
                        bio='An experienced investor.'
                    )

                def test_create_conversation(self):
                    conversation = Conversation.objects.create(
                        help_request=self.help_request,
                        investor=self.investor
                    )
                    self.assertEqual(conversation.help_request.specific_need, 'Need technical expertise')
                    self.assertEqual(conversation.investor.first_name, 'Jane')

            class MessageModelTest(TestCase):
                def setUp(self):
                    self.user = User.objects.create_user(
                        username='message_user',
                        email='message@example.com',
                        password='testpass123',
                        phone='1234567890',
                        role='entrepreneur'
                    )
                    self.entrepreneur = Entrepreneur.objects.create(
                        user=self.user,
                        first_name='John',
                        last_name='Doe',
                        bio='A passionate entrepreneur.'
                    )
                    self.project = Project.objects.create(
                        user=self.user,
                        entrepreneur=self.entrepreneur,
                        project_name='Test Project',
                        sector='technology',
                        description='A test project.',
                        target_audience='Developers',
                        estimated_budget=10000.00,
                        financing_plan='Self-funded'
                    )
                    self.help_request = HelpRequest.objects.create(
                        project=self.project,
                        entrepreneur=self.entrepreneur,
                        request_type='technical',
                        specific_need='Need technical expertise',
                        description='We need help with our project.',
                        status='pending'
                    )
                    self.investor_user = User.objects.create_user(
                        username='investor_message_user',
                        email='investor_message@example.com',
                        password='testpass123',
                        phone='0987654321',
                        role='investor'
                    )
                    self.investor = Investor.objects.create(
                        user=self.investor_user,
                        first_name='Jane',
                        last_name='Doe',
                        bio='An experienced investor.'
                    )
                    self.conversation = Conversation.objects.create(
                        help_request=self.help_request,
                        investor=self.investor
                    )

                def test_create_message(self):
                    message = Message.objects.create(
                        conversation=self.conversation,
                        sender=self.user,
                        content='Hello, I need help with my project.'
                    )
                    self.assertEqual(message.content, 'Hello, I need help with my project.')
                    self.assertEqual(message.sender.username, 'message_user')
                    self.assertFalse(message.is_read)