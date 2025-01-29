from rest_framework import serializers

# Create your serializers here.
from django.conf import settings
from rest_framework import serializers
from .models import User, Entrepreneur, Organization, Investor, Project, ProjectDocument, TechnicalRequest, HelpRequest, \
    FinancialRequest, FinancialProposal, TechnicalProposal, Collaboration, Contract


class EntrepreneurSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email')
    phone = serializers.CharField(source='user.phone')
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = Entrepreneur
        fields = ['first_name', 'last_name', 'email', 'phone', 'password', 'confirm_password']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return data

class InvestorSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email')
    phone = serializers.CharField(source='user.phone')
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = Investor
        fields = ['first_name', 'last_name', 'email', 'phone', 'password', 'confirm_password']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return data

class OrganizationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email')
    phone = serializers.CharField(source='user.phone')
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = Organization
        fields = ['organization_name', 'registration_number', 'founded_year',
                 'mission_statement', 'website_url', 'email', 'phone',
                 'password', 'confirm_password']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return data

# Admin handling users
class UserListSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'name', 'status', 'is_active', 'created_at']

    def get_name(self, obj):
        if obj.role == 'ONG-Association':
            org = Organization.objects.filter(user=obj).first()
            return org.organization_name if org else ''

        if obj.role == 'entrepreneur':
            entrepreneur = Entrepreneur.objects.filter(user=obj).first()
            if entrepreneur:
                return f"{entrepreneur.first_name} {entrepreneur.last_name}"

        if obj.role == 'investor':
            investor = Investor.objects.filter(user=obj).first()
            if investor:
                return f"{investor.first_name} {investor.last_name}"

        return ''

    def get_status(self, obj):
        if not obj.is_active:
            return 'Inactif'
        return 'Actif'

# Admin handling users
class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    # Additional fields for entrepreneur
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    # Additional fields for organization
    organization_name = serializers.CharField(required=False)
    registration_number = serializers.CharField(required=False)
    founded_year = serializers.IntegerField(required=False)
    mission_statement = serializers.CharField(required=False, allow_blank=True)
    website_url = serializers.URLField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['email', 'phone', 'role', 'password', 'confirm_password',
                  'first_name', 'last_name', 'organization_name',
                  'registration_number', 'founded_year', 'mission_statement',
                  'website_url']

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")

        # Validate required fields based on role
        if data['role'] == 'ONG-Association':
            required_fields = ['organization_name', 'registration_number']
            for field in required_fields:
                if not data.get(field):
                    raise serializers.ValidationError(f"{field} is required for ONG-Association")
        else:
            required_fields = ['first_name', 'last_name']
            for field in required_fields:
                if not data.get(field):
                    raise serializers.ValidationError(f"{field} is required for {data['role']}")

        return data

    def create(self, validated_data):
        role = validated_data['role']
        # Remove confirm_password from validated_data
        validated_data.pop('confirm_password')

        # Extract user-specific data
        user_data = {
            'email': validated_data['email'],
            'phone': validated_data['phone'],
            'role': validated_data['role'],
            'username': validated_data['email'],  # Using email as username
        }

        password = validated_data.pop('password')

        # Create user instance
        user = User.objects.create(**user_data)
        user.set_password(password)
        user.save()

        # Create associated profile based on role
        if role == 'ONG-Association':
            Organization.objects.create(
                user=user,
                organization_name=validated_data.get('organization_name'),
                registration_number=validated_data.get('registration_number'),
                founded_year=validated_data.get('founded_year'),
                mission_statement=validated_data.get('mission_statement', ''),
                website_url=validated_data.get('website_url', '')
            )
        elif role == 'entrepreneur':
            Entrepreneur.objects.create(
                user=user,
                first_name=validated_data.get('first_name'),
                last_name=validated_data.get('last_name')
            )
        else:
            Investor.objects.create(
                user=user,
                first_name=validated_data.get('first_name'),
                last_name=validated_data.get('last_name')
            )

        return user

class UserEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'phone', 'role']

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['is_active', 'is_blocked']

#Project
class ProjectDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectDocument
        fields = ['id', 'document_type', 'file', 'uploaded_at', 'is_required']
        extra_kwargs = {
            'file': {'required': True},
            'document_type': {'required': True}
        }

class ProjectSerializer(serializers.ModelSerializer):
    documents = ProjectDocumentSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    entrepreneur_name = serializers.SerializerMethodField()
    project_image = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'project_name', 'sector', 'description',
            'specific_objectives', 'target_audience', 'estimated_budget',
            'financing_plan', 'status', 'status_display', 'admin_comments',
            'created_at', 'updated_at', 'documents', 'entrepreneur_name',
            'project_image'
        ]
        read_only_fields = ['status', 'admin_comments', 'created_at', 'updated_at', 'user', 'entrepreneur']

    def validate(self, attrs):
        if 'request' not in self.context:
            raise serializers.ValidationError("Request context is required")
        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        if user.role != 'entrepreneur':
            raise serializers.ValidationError("Only entrepreneurs can create projects")

        try:
            entrepreneur = Entrepreneur.objects.get(user=user)
        except Entrepreneur.DoesNotExist:
            raise serializers.ValidationError("Entrepreneur profile not found")

        validated_data['user'] = user
        validated_data['entrepreneur'] = entrepreneur

        return super().create(validated_data)

    def get_entrepreneur_name(self, obj):
        return f"{obj.entrepreneur.first_name} {obj.entrepreneur.last_name}"

    def get_project_image(self, obj):
        project_image = obj.documents.filter(document_type='project_photos').first()
        if project_image and project_image.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(project_image.file.url)
            return f"{settings.MEDIA_URL}{project_image.file}"
        return None


class FinancialRequestSerializer(serializers.ModelSerializer):
    total_repayment = serializers.SerializerMethodField()
    monthly_payment = serializers.SerializerMethodField()
    total_interest = serializers.SerializerMethodField()

    class Meta:
        model = FinancialRequest
        fields = ['amount_requested', 'interest_rate', 'duration_months',
                  'total_repayment', 'monthly_payment', 'total_interest']

    def get_total_repayment(self, obj):
        return obj.calculate_total_repayment()

    def get_monthly_payment(self, obj):
        return obj.calculate_monthly_payment()

    def get_total_interest(self, obj):
        return obj.calculate_total_interest()


class TechnicalRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechnicalRequest
        fields = ['expertise_needed', 'estimated_duration']


class HelpRequestSerializer(serializers.ModelSerializer):
    financial_details = FinancialRequestSerializer(source='financialrequest', read_only=True)
    technical_details = TechnicalRequestSerializer(source='technicalrequest', read_only=True)
    entrepreneur_details = serializers.SerializerMethodField()
    project_details = serializers.SerializerMethodField()


    class Meta:
        model = HelpRequest
        fields = ['id', 'project', 'entrepreneur','entrepreneur_details', 'project_details', 'request_type', 'specific_need',
                  'description', 'status', 'financial_details', 'technical_details',
                  'created_at', 'updated_at']
        read_only_fields = ['entrepreneur', 'status']

    def get_entrepreneur_details(self, obj):
        return {
            'name': f"{obj.entrepreneur.first_name} {obj.entrepreneur.last_name}",
            'email': obj.entrepreneur.user.email,
            # Add any other entrepreneur fields you want to include
        }

    # def get_file_url(self, obj):
    #     request = self.context.get('request')
    #     return request.build_absolute_uri(obj.file.url) if request else obj.file.url

    def get_project_details(self, obj):
        if not obj.project:
            return None

        request = self.context.get('request')
        documents = []
        for doc in obj.project.documents.all():
            file_url = request.build_absolute_uri(doc.file.url) if doc.file else None
            documents.append({
                'document_type': doc.document_type,
                'uploaded_at': doc.uploaded_at,
                'file_url': file_url,

            })

        return {
            'project_name': obj.project.project_name,
            'sector': obj.project.sector,
            'description': obj.project.description,
            'specific_objectives': obj.project.specific_objectives,
            'target_audience': obj.project.target_audience,
            'estimated_budget': obj.project.estimated_budget,
            'financing_plan': obj.project.financing_plan,
            'status': obj.project.status,
            'admin_comments': obj.project.admin_comments,
            'created_at': obj.project.created_at,
            'updated_at': obj.project.updated_at,
            'documents': documents
        }


class BaseHelpProposalSerializer(serializers.ModelSerializer):
    investor_name = serializers.SerializerMethodField()
    help_request_details = serializers.SerializerMethodField()

    def get_investor_name(self, obj):
        return f"{obj.investor.first_name} {obj.investor.last_name}"

    def get_help_request_details(self, obj):
        # Get the financial details safely
        financial_details = getattr(obj.help_request, 'financialrequest', None)
        amount_requested = getattr(financial_details, 'amount_requested', 0) if financial_details else 0

        return {
            'id': obj.help_request.id,
            'specific_need': obj.help_request.specific_need,
            'request_type': obj.help_request.request_type,
            'created_at': obj.help_request.created_at,
            'project_name': obj.help_request.project.project_name,
            'amount_requested': amount_requested,
        }

class FinancialProposalSerializer(BaseHelpProposalSerializer):
    class Meta:
        model = FinancialProposal
        fields = ['id', 'help_request', 'investor', 'investor_name', 'help_request_details',
                 'status', 'investment_amount', 'investment_type', 'payment_schedule',
                 'expected_return', 'timeline', 'additional_terms',
                 'created_at', 'updated_at']
        read_only_fields = ['status', 'investor', 'created_at', 'updated_at']


class TechnicalProposalSerializer(BaseHelpProposalSerializer):
    class Meta:
        model = TechnicalProposal
        fields = ['id', 'help_request', 'investor', 'investor_name', 'help_request_details',
                 'status', 'expertise', 'experience_level', 'availability', 'support_duration',
                 'support_type', 'proposed_approach', 'additional_resources',
                 'expected_outcomes', 'created_at', 'updated_at']
        read_only_fields = ['status', 'investor', 'created_at', 'updated_at']

#Contract and collaborations
class ContractSerializer(serializers.ModelSerializer):
    contract_type = serializers.SerializerMethodField()
    proposal_details = serializers.SerializerMethodField()

    class Meta:
        model = Contract
        fields = ['id', 'contract_type', 'pdf_file', 'proposal_details']

    def get_contract_type(self, obj):
        return 'financial' if obj.financial_proposal else 'technical'

    def get_proposal_details(self, obj):
        proposal = obj.financial_proposal or obj.technical_proposal
        if proposal:
            return {
                'project_name': proposal.help_request.project.project_name,
                'investor_name': f"{proposal.investor.first_name} {proposal.investor.last_name}",
                'type': 'financial' if obj.financial_proposal else 'technical'
            }
        return None
class CollaborationSerializer(serializers.ModelSerializer):
    entrepreneur_details = serializers.SerializerMethodField()
    investor_details = serializers.SerializerMethodField()
    project_name = serializers.SerializerMethodField()
    contract_details = ContractSerializer(source='contract')



    class Meta:
        model = Collaboration
        fields = ['id', 'entrepreneur_details', 'investor_details', 'project_name',
                  'start_date', 'end_date', 'is_active', 'collaboration_type',
                  'contract_details']

    def get_project_name(self, obj):
        return obj.project.project_name

    def get_entrepreneur_details(self, obj):
        return {
            'name': f"{obj.entrepreneur.first_name} {obj.entrepreneur.last_name}",
            'email': obj.entrepreneur.user.email,
            'phone': obj.entrepreneur.user.phone,
            # Add any other entrepreneur fields you want to include
        }
    def get_investor_details(self, obj):
        return {
            'name': f"{obj.investor.first_name} {obj.investor.last_name}",
            'email': obj.investor.user.email,
            'phone': obj.investor.user.phone,
            # Add any other entrepreneur fields you want to include
        }
class CollaborationStatsSerializer(serializers.Serializer):
    total_collaborations = serializers.IntegerField()
    financial_collaborations = serializers.IntegerField()
    technical_collaborations = serializers.IntegerField()
    total_investment_amount = serializers.DecimalField(max_digits=15, decimal_places=2)