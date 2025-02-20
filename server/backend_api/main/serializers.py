import decimal
import json
from datetime import timezone

from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

# Create your serializers here.
from django.conf import settings
from rest_framework import serializers
from .models import User, Entrepreneur, Organization, Investor, Project, ProjectDocument, TechnicalRequest, HelpRequest, \
    FinancialRequest, FinancialProposal, TechnicalProposal, Collaboration, Contract, Announcement, Event, Conversation, \
    Message, EventRegistration


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

#User management profile
class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    phone = serializers.CharField()
    profile_image = serializers.ImageField(read_only=True)

    class Meta:
        model = User
        fields = ['email', 'phone', 'profile_image']


class EntrepreneurProfileSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer()

    class Meta:
        model = Entrepreneur
        fields = ['first_name', 'last_name', 'bio', 'user']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        # Update user fields
        if user_data:
            user_serializer = UserProfileSerializer(instance.user, data=user_data, partial=True)
            user_serializer.is_valid(raise_exception=True)
            user_serializer.save()

        # Update entrepreneur fields
        return super().update(instance, validated_data)


class InvestorProfileSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer()

    class Meta:
        model = Investor
        fields = ['first_name', 'last_name', 'bio', 'user']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        # Update user fields
        if user_data:
            user_serializer = UserProfileSerializer(instance.user, data=user_data, partial=True)
            user_serializer.is_valid(raise_exception=True)
            user_serializer.save()

        # Update investor fields
        return super().update(instance, validated_data)


class OrganizationProfileSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer()

    class Meta:
        model = Organization
        fields = ['organization_name', 'registration_number', 'founded_year',
                  'mission_statement', 'website_url', 'bio', 'user']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        # Update user fields
        if user_data:
            user_serializer = UserProfileSerializer(instance.user, data=user_data, partial=True)
            user_serializer.is_valid(raise_exception=True)
            user_serializer.save()

        # Update organization fields
        return super().update(instance, validated_data)


class PasswordUpdateSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("New passwords don't match")
        return data

#Forgot password
class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class VerifyResetCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(min_length=6, max_length=6)

class PasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(min_length=6, max_length=6)
    new_password = serializers.CharField(min_length=8)
    confirm_password = serializers.CharField(min_length=8)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
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


class UserDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed user information"""
    # Get role-specific details
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'phone', 'role', 'first_name', 'last_name', 'is_active', 'is_blocked']
        read_only_fields = ['id']

    def get_first_name(self, obj):
        if hasattr(obj, 'entrepreneur'):
            return obj.entrepreneur.first_name
        elif hasattr(obj, 'investor'):
            return obj.investor.first_name
        return None

    def get_last_name(self, obj):
        if hasattr(obj, 'entrepreneur'):
            return obj.entrepreneur.last_name
        elif hasattr(obj, 'investor'):
            return obj.investor.last_name
        return None


class OrganizationDetailSerializer(serializers.ModelSerializer):
    """Serializer for organization details"""
    email = serializers.EmailField(source='user.email')
    phone = serializers.CharField(source='user.phone')
    role = serializers.CharField(source='user.role')
    is_active = serializers.BooleanField(source='user.is_active')
    is_blocked = serializers.BooleanField(source='user.is_blocked')

    class Meta:
        model = Organization
        fields = [
            'id', 'email', 'phone', 'role', 'is_active', 'is_blocked',
            'organization_name', 'registration_number', 'founded_year',
            'mission_statement', 'website_url'
        ]
        read_only_fields = ['id']


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user information"""
    password = serializers.CharField(write_only=True, required=False)
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ['email', 'phone', 'password', 'first_name', 'last_name']

    def validate_password(self, value):
        if value:
            validate_password(value)
        return value

    def update(self, instance, validated_data):
        # Handle profile update
        profile_data = {}
        if 'first_name' in validated_data:
            profile_data['first_name'] = validated_data.pop('first_name')
        if 'last_name' in validated_data:
            profile_data['last_name'] = validated_data.pop('last_name')

        # Update user
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update profile if exists
        if profile_data:
            profile = None
            if hasattr(instance, 'entrepreneur'):
                profile = instance.entrepreneur
            elif hasattr(instance, 'investor'):
                profile = instance.investor

            if profile:
                for attr, value in profile_data.items():
                    setattr(profile, attr, value)
                profile.save()

        return instance


class OrganizationUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating organization information"""
    email = serializers.EmailField(required=False)
    phone = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Organization
        fields = [
            'email', 'phone', 'password',
            'organization_name', 'registration_number', 'founded_year',
            'mission_statement', 'website_url'
        ]

    def validate_password(self, value):
        if value:
            validate_password(value)
        return value

    def update(self, instance, validated_data):
        # Handle user data
        user_data = {}
        for field in ['email', 'phone', 'password']:
            if field in validated_data:
                user_data[field] = validated_data.pop(field)

        # Update user if necessary
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()

        # Update organization
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance

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

        # If we have project documents but no request object, return URLs without absolute paths
        for doc in obj.project.documents.all():
            file_url = request.build_absolute_uri(doc.file.url) if request and doc.file else (
                doc.file.url if doc.file else None)
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

#Organisation announcement
class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcement
        fields = '__all__'
        read_only_fields = ('organization', 'created_at', 'updated_at')

    def to_representation(self, instance):
        """
        Convert the requirements from JSON string to Python list when serializing.
        """
        representation = super().to_representation(instance)
        if isinstance(representation.get('requirements'), str):
            try:
                representation['requirements'] = json.loads(representation['requirements'])
            except (json.JSONDecodeError, TypeError):
                representation['requirements'] = []
        return representation

    def validate_requirements(self, value):
        """
        Validate the requirements field.
        """
        try:
            # If value is already a list
            if isinstance(value, list):
                # Clean and filter the requirements
                requirements = [str(req).strip() for req in value if str(req).strip()]
                return json.dumps(requirements)

            # If value is a string, try to parse it as JSON
            if isinstance(value, str):
                parsed_value = json.loads(value)
                if not isinstance(parsed_value, list):
                    raise serializers.ValidationError("Requirements must be a list")
                # Clean and filter the requirements
                requirements = [str(req).strip() for req in parsed_value if str(req).strip()]
                return json.dumps(requirements)

            raise serializers.ValidationError("Invalid requirements format")
        except json.JSONDecodeError:
            raise serializers.ValidationError("Requirements must be a valid JSON array")

    def validate(self, data):
        """
        Object-level validation.
        """
        # Validate required fields
        if self.partial:
            # For PATCH requests, only validate fields that are being updated
            required_fields = []
            if 'type' in data:
                required_fields.extend(['title', 'description'])

            for field in required_fields:
                if field not in data:
                    if not getattr(self.instance, field, None):
                        raise serializers.ValidationError({
                            field: f"{field} is required"
                        })
        else:
            # For PUT/POST requests, validate all required fields
            required_fields = ['title', 'description', 'type']
            for field in required_fields:
                if not data.get(field):
                    raise serializers.ValidationError({
                        field: f"{field} is required"
                    })

        # Type-specific validation
        announcement_type = data.get('type', getattr(self.instance, 'type', None))
        if announcement_type:
            if announcement_type == 'funding':
                budget = data.get('budget', getattr(self.instance, 'budget', None))
                if not budget and budget != 0:
                    raise serializers.ValidationError({
                        "budget": "Budget is required for funding announcements"
                    })
                try:
                    from decimal import Decimal
                    budget_value = Decimal(str(budget))
                    if budget_value <= 0:
                        raise serializers.ValidationError({
                            "budget": "Budget must be greater than 0"
                        })
                except (TypeError, ValueError, decimal.InvalidOperation):
                    raise serializers.ValidationError({
                        "budget": "Invalid budget value"
                    })

            elif announcement_type in ['training', 'partnership']:
                requirements = data.get('requirements', getattr(self.instance, 'requirements', None))
                if not requirements:
                    raise serializers.ValidationError({
                        "requirements": "Requirements are required for training and partnership announcements"
                    })

        return data

#Association events
class EventSerializer(serializers.ModelSerializer):
    """
    Enhanced serializer for Event model with comprehensive validation
    """
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'type', 'description', 'image',
            'date', 'time', 'location', 'capacity',
            'registration_deadline', 'status'
        ]
        extra_kwargs = {
            'image': {'required': False},
        }

    def validate(self, data):
        """
        Cross-field validation
        """
        # Validate registration deadline
        if 'registration_deadline' in data and 'date' in data:
            if data['registration_deadline'] >= data['date']:
                raise serializers.ValidationError({
                    'registration_deadline': 'Registration deadline must be before the event date'
                })

        # Validate capacity
        if 'capacity' in data and data['capacity'] < 1:
            raise serializers.ValidationError({
                'capacity': 'Capacity must be at least 1'
            })

        return data

#Messages
class MessageSerializer(serializers.ModelSerializer):
    is_sender = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'content', 'timestamp', 'is_sender', 'is_read']

    def get_is_sender(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            return obj.sender == request.user
        return False


#Events registration
class EventRegistrationSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    user_phone = serializers.SerializerMethodField()
    user_type = serializers.SerializerMethodField()
    event_details = serializers.SerializerMethodField()  # Add this field

    class Meta:
        model = EventRegistration
        fields = [
            'id',
            'event',
            'user',
            'status',
            'registration_date',
            'message',
            'user_name',
            'user_email',
            'user_phone',
            'user_type',
            'event_details'  # Add this to fields
        ]
        read_only_fields = ['id', 'user', 'registration_date']

    def get_user_name(self, obj):
        if obj.user.role == 'entrepreneur':
            return f"{obj.user.entrepreneur.first_name} {obj.user.entrepreneur.last_name}"
        elif obj.user.role == 'investor':
            return f"{obj.user.investor.first_name} {obj.user.investor.last_name}"
        elif obj.user.role == 'ONG-Association':
            return obj.user.organization.organization_name
        return obj.user.username

    def get_user_email(self, obj):
        return obj.user.email

    def get_user_phone(self, obj):
        return obj.user.phone

    def get_user_type(self, obj):
        return obj.user.role

    def get_event_details(self, obj):
        """Add detailed event information"""
        return {
            'id': obj.event.id,
            'title': obj.event.title,
            'description': obj.event.description,
            'date': obj.event.date,
            'time': obj.event.time,
            'location': obj.event.location,
            'type': obj.event.type,
            'capacity': obj.event.capacity,
            'registration_deadline': obj.event.registration_deadline,
            'organization_name': obj.event.organization.organization_name
        }

class EventRegistrationCreateSerializer(serializers.ModelSerializer):
    event = serializers.PrimaryKeyRelatedField(queryset=Event.objects.all())

    class Meta:
        model = EventRegistration
        fields = ['event', 'message']

    def validate_event(self, value):
        # Check if event exists and is still open for registration
        if not value:
            raise serializers.ValidationError("Event is required")

        # Check if event has space
        approved_count = EventRegistration.objects.filter(
            event=value,
            status='approved'
        ).count()

        if approved_count >= value.capacity:
            # If full, automatically set to waitlist
            self.context['waitlist'] = True

        return value.id  # Return the ID instead of the Event object

    def create(self, validated_data):
        # Get the current user from the context
        user = self.context['request'].user

        # Ensure we're working with the event ID
        event_id = validated_data['event']
        event = Event.objects.get(id=event_id)

        # Check if user already registered
        existing_registration = EventRegistration.objects.filter(
            event=event,
            user=user
        ).first()

        if existing_registration:
            raise serializers.ValidationError(
                "Vous vous êtes déjà inscrit(e) à cet événement"
            )

        # Create the registration
        registration = EventRegistration(
            user=user,
            event=event,  # Use the Event object here
            status='waitlist' if self.context.get('waitlist') else 'pending',
            message=validated_data.get('message', '')
        )
        registration.save()

        return registration


class ConversationSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    help_request = serializers.SerializerMethodField()
    investor = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'help_request', 'investor', 'last_message', 'unread_count', 'created_at', 'updated_at']

    def get_help_request(self, obj):
        return {
            'id': obj.help_request.id,
            'entrepreneur': {
                'id': obj.help_request.entrepreneur.id,
                'first_name': obj.help_request.entrepreneur.first_name,
                'last_name': obj.help_request.entrepreneur.last_name,
                'user': {
                    'id': obj.help_request.entrepreneur.user.id,
                    'first_name': obj.help_request.entrepreneur.user.first_name,
                    'last_name': obj.help_request.entrepreneur.user.last_name,
                    'profile_image': obj.help_request.entrepreneur.user.profile_image.url if obj.help_request.entrepreneur.user.profile_image else None
                }
            },
            'project': {
                'id': obj.help_request.project.id,
                'name': obj.help_request.project.project_name,  # This stays the same
                'project_name': obj.help_request.project.project_name,  # Add this line
                'sector': obj.help_request.project.sector
            }
        }

    def get_investor(self, obj):
        return {
            'id': obj.investor.id,
            'first_name': obj.investor.first_name,
            'last_name': obj.investor.last_name,
            'user': {
                'id': obj.investor.user.id,
                'first_name': obj.investor.user.first_name,
                'last_name': obj.investor.user.last_name,
                'profile_image': obj.investor.user.profile_image.url if obj.investor.user.profile_image else None
            }
        }

    def get_last_message(self, obj):
        last_message = obj.messages.last()
        if last_message:
            return MessageSerializer(last_message, context=self.context).data
        return None

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            return obj.messages.filter(is_read=False).exclude(sender=request.user).count()
        return 0