import os

from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from django.template.loader import render_to_string
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.db.models import Count, Q  # Added Q here
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from .contract import ContractHandler
from django.utils import timezone
import pdfkit
import logging


from django.contrib.auth import get_user_model
from django.conf import settings
from .models import Organization, Entrepreneur, Investor, ProjectDocument, Project, HelpRequest, TechnicalRequest, \
    FinancialRequest, FinancialProposal, TechnicalProposal, Collaboration, Contract, User
from .permission import IsProposalOwnerOrRequestEntrepreneur
from .serializers import OrganizationSerializer, EntrepreneurSerializer, UserUpdateSerializer, UserListSerializer, \
    UserCreateSerializer, InvestorSerializer, ProjectSerializer, FinancialRequestSerializer, TechnicalRequestSerializer, \
    HelpRequestSerializer, TechnicalProposalSerializer, FinancialProposalSerializer, CollaborationSerializer, \
    ContractSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]  # Allow anyone to access this view

    @transaction.atomic
    def post(self, request):
        role = request.data.get('role')

        if role == 'ONG-Association':
            serializer = OrganizationSerializer(data=request.data)
        elif role == 'investor':
            serializer = InvestorSerializer(data=request.data)  # Create a separate serializer if needed
        else:
            serializer = EntrepreneurSerializer(data=request.data)

        if serializer.is_valid():
            # Create User instance
            user_data = {
                'email': serializer.validated_data['user']['email'],
                'phone': serializer.validated_data['user']['phone'],
                'username': serializer.validated_data['user']['email'],  # Using email as username
                'password': make_password(serializer.validated_data['password']),
                'role': role
            }
            user = User.objects.create(**user_data)

            # Create profile based on role
            if role == 'ONG-Association':
                Organization.objects.create(
                    user=user,
                    organization_name=serializer.validated_data['organization_name'],
                    registration_number=serializer.validated_data['registration_number'],
                    founded_year=serializer.validated_data['founded_year'],
                    mission_statement=serializer.validated_data.get('mission_statement', ''),
                    website_url=serializer.validated_data.get('website_url', '')
                )
            elif role == 'entrepreneur':
                Entrepreneur.objects.create(
                    user=user,
                    first_name=serializer.validated_data['first_name'],
                    last_name=serializer.validated_data['last_name']
                )
            elif role == 'investor':
                Investor.objects.create(
                    user=user,
                    first_name=serializer.validated_data['first_name'],
                    last_name=serializer.validated_data['last_name']
                )
            else:
                raise ValueError(f"Unknown role: {role}")

            return Response({
                'message': 'Registration successful',
                'user_id': user.id
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    authentication_classes = []  # Disable authentication for this endpoint
    permission_classes = [AllowAny]  # Allow access to anyone

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(username=email, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)

            return Response({
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'role': user.role,
                }
            })
        else:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

class LogoutView(APIView):
        permission_classes = (IsAuthenticated,)

        def post(self, request):
            try:
                # Get the refresh token from the request data
                refresh_token = request.data.get('refresh_token')

                if refresh_token:
                    # Get token object from refresh token
                    token = RefreshToken(refresh_token)
                    # Blacklist the token
                    token.blacklist()

                    return Response(
                        {"message": "Logout successful"},
                        status=status.HTTP_205_RESET_CONTENT
                    )
                else:
                    return Response(
                        {"error": "Refresh token is required"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            except Exception as e:
                return Response(
                    {"error": "Invalid token"},
                    status=status.HTTP_400_BAD_REQUEST
                )

#admin signup
class AdminSignupView(APIView):
    #permission_classes = [IsAdminUser]  # Only existing admins can create new admins
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')

        if not all([email, password, first_name, last_name]):
            return Response({
                'error': 'All fields are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({
                'error': 'Email already exists'
            }, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            email=email,
            username=email,
            password=make_password(password),
            first_name=first_name,
            last_name=last_name,
            is_staff=True,
            is_superuser=True,
            role='admin'
        )

        return Response({
            'message': 'Admin created successfully',
            'user_id': user.id
        }, status=status.HTTP_201_CREATED)

# Admin handling users
class UserManagementView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        """Get list of users with filtering and search"""
        users = User.objects.all()

        # Handle role filtering
        role = request.query_params.get('role')
        if role:
            users = users.filter(role=role)

        # Handle search
        search = request.query_params.get('search')
        if search:
            users = users.filter(
                Q(email__icontains=search) |
                Q(entrepreneur__first_name__icontains=search) |
                Q(entrepreneur__last_name__icontains=search) |
                Q(organization__organization_name__icontains=search)
            )

        serializer = UserListSerializer(users, many=True)
        return Response(serializer.data)

    @transaction.atomic
    def post(self, request):
        """Create a new user"""
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                return Response(UserListSerializer(user).data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(
            {'error': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    def put(self, request, user_id):
        """Update user details"""
        user = get_object_or_404(User, id=user_id)
        serializer = UserUpdateSerializer(user, data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserListSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id):
        """Delete a user"""
        user = get_object_or_404(User, id=user_id)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, user_id):
        """Update user status (active/blocked)"""
        user = get_object_or_404(User, id=user_id)
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save()

            # Update related stats in the database
            user.is_active = not user.is_blocked  # Automatically update is_active based on blocked status
            user.save()

            return Response(UserListSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        """Get user statistics"""
        total_users = User.objects.count()
        pending_validation = User.objects.filter(is_active=False).count()
        blocked_users = User.objects.filter(is_active=False, is_blocked=True).count()

        stats = {
            "total_users": total_users,
            "pending_validation": pending_validation,
            "blocked_users": blocked_users,
            "role_distribution": {
                "entrepreneur": User.objects.filter(role='entrepreneur').count(),
                "investor": User.objects.filter(role='investor').count(),
                "ong_association": User.objects.filter(role='ONG-Association').count()
            }
        }

        return Response(stats)

#Project
class ProjectAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        user = request.user
        if user.is_staff:
            projects = Project.objects.all()
        else:
            try:
                entrepreneur = Entrepreneur.objects.get(user=user)
                projects = Project.objects.filter(entrepreneur=entrepreneur)
            except Entrepreneur.DoesNotExist:
                projects = Project.objects.none()

        serializer = ProjectSerializer(projects, many=True, context={'request': request})
        data = serializer.data

        # Add debugging
        for project in data:
            if project.get('project_image'):
                print(f"Project {project['project_name']} image URL: {project['project_image']}")
            for doc in project.get('documents', []):
                if doc['document_type'] == 'project_photos':
                    print(f"Project {project['project_name']} document URL: {doc['file']}")

        return Response(data)

    def post(self, request):
        try:
            # Get the entrepreneur instance
            entrepreneur = Entrepreneur.objects.get(user=request.user)

            # Create a new project with entrepreneur and user
            serializer = ProjectSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save(user=request.user, entrepreneur=entrepreneur)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Entrepreneur.DoesNotExist:
            return Response(
                {"error": "Entrepreneur profile not found for this user"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    def put(self, request, pk):
        # Update an existing project
        project = get_object_or_404(Project, pk=pk)
        self.check_object_permissions(request, project)
        serializer = ProjectSerializer(project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        # Delete a project
        project = get_object_or_404(Project, pk=pk)
        self.check_object_permissions(request, project)
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProjectUploadDocumentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        project = get_object_or_404(Project, pk=pk)
        self.check_object_permissions(request, project)

        document_type = request.data.get('document_type')
        file = request.data.get('file')

        if not document_type or not file:
            return Response(
                {'error': 'Both document_type and file are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Validate file type for project images
            if document_type == 'project_image':
                allowed_types = ['image/jpeg', 'image/png', 'image/jpg']
                if file.content_type not in allowed_types:
                    return Response(
                        {'error': 'Only JPEG, JPG and PNG files are allowed for project images'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Remove old project image if it exists
                ProjectDocument.objects.filter(
                    project=project,
                    document_type='project_image'
                ).delete()

            if document_type in ['photo', 'project_image']:
                # Handle photos and project images
                document = ProjectDocument.objects.create(
                    project=project,
                    document_type=document_type,
                    file=file
                )
            else:
                # Update or create other document types
                document, created = ProjectDocument.objects.update_or_create(
                    project=project,
                    document_type=document_type,
                    defaults={'file': file}
                )

            return Response({
                'message': 'Document uploaded successfully',
                'document_id': document.id,
                'file_url': document.file.url if document_type == 'project_image' else None
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class ProjectUpdateStatusAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if not request.user.is_staff:
            return Response({
                'error': 'Only admin users can update project status'
            }, status=status.HTTP_403_FORBIDDEN)

        project = get_object_or_404(Project, pk=pk)
        new_status = request.data.get('status')
        comments = request.data.get('comments')

        if new_status not in dict(Project.STATUS_CHOICES):
            return Response({
                'error': 'Invalid status'
            }, status=status.HTTP_400_BAD_REQUEST)

        project.status = new_status
        project.admin_comments = comments
        project.save()

        return Response({
            'message': 'Project status updated successfully',
            'status': project.get_status_display()
        })

class HelpRequestAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk=None):
        """Get a single help request or list of help requests"""
        if pk:
            try:
                help_request = HelpRequest.objects.get(pk=pk)
                serializer = HelpRequestSerializer(help_request, context={'request': request})
                return Response(serializer.data)
            except HelpRequest.DoesNotExist:
                return Response(
                    {"error": "Help request not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

        # Filter requests based on user role
        if request.user.role == 'entrepreneur':
            help_requests = HelpRequest.objects.filter(entrepreneur__user=request.user)
        else:
            help_requests = HelpRequest.objects.all()

        serializer = HelpRequestSerializer(help_requests, many=True, context={'request': request})
        return Response(serializer.data)

    def get_accepted_amount(self, request, pk):
        """Get total accepted amount for a financial help request"""
        try:
            help_request = HelpRequest.objects.get(
                pk=pk,
                entrepreneur=request.user.entrepreneur
            )

            # Get all accepted financial proposals
            accepted_proposals = FinancialProposal.objects.filter(
                help_request=help_request,
                status='accepted'
            )

            # Calculate total accepted amount
            total_accepted = sum(
                proposal.investment_amount
                for proposal in accepted_proposals
            )

            # Get total requested amount
            total_requested = help_request.financialrequest.amount_requested

            return Response({
                'accepted_amount': float(total_accepted),
                'requested_amount': float(total_requested),
                'remaining_amount': float(total_requested - total_accepted)
            })

        except HelpRequest.DoesNotExist:
            return Response(
                {"error": "Help request not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        try:
            entrepreneur = Entrepreneur.objects.get(user=request.user)
        except Entrepreneur.DoesNotExist:
            return Response(
                {"error": "Entrepreneur profile not found"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = HelpRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        help_request = serializer.save(entrepreneur=entrepreneur)

        # Handle specific request type details
        if help_request.request_type == 'financial':
            financial_data = request.data.get('financial_details', {})
            financial_serializer = FinancialRequestSerializer(data=financial_data)
            financial_serializer.is_valid(raise_exception=True)
            financial_serializer.save(help_request=help_request)

        elif help_request.request_type == 'technical':
            technical_data = request.data.get('technical_details', {})
            technical_serializer = TechnicalRequestSerializer(data=technical_data)
            technical_serializer.is_valid(raise_exception=True)
            technical_serializer.save(help_request=help_request)

        return Response(
            HelpRequestSerializer(help_request).data,
            status=status.HTTP_201_CREATED
        )

    @transaction.atomic  # Important pour la cohérence des données
    def put(self, request, pk):
        """Update an existing help request"""
        try:
            help_request = HelpRequest.objects.get(pk=pk)

            # Check if user has permission to update
            if help_request.entrepreneur.user != request.user:
                return Response(
                    {"error": "You don't have permission to update this request"},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Update main help request data
            serializer = HelpRequestSerializer(help_request, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            updated_request = serializer.save()

            # Update financial details if present
            if updated_request.request_type == 'financial' and 'financial_details' in request.data:
                financial_details = request.data['financial_details']
                try:
                    financial_instance = FinancialRequest.objects.get(help_request=help_request)
                    financial_serializer = FinancialRequestSerializer(
                        financial_instance,
                        data=financial_details,
                        partial=True
                    )
                except FinancialRequest.DoesNotExist:
                    financial_serializer = FinancialRequestSerializer(data=financial_details)

                financial_serializer.is_valid(raise_exception=True)
                financial_serializer.save(help_request=updated_request)

            # Update technical details if present
            if updated_request.request_type == 'technical' and 'technical_details' in request.data:
                technical_details = request.data['technical_details']
                try:
                    technical_instance = TechnicalRequest.objects.get(help_request=help_request)
                    technical_serializer = TechnicalRequestSerializer(
                        technical_instance,
                        data=technical_details,
                        partial=True
                    )
                except TechnicalRequest.DoesNotExist:
                    technical_serializer = TechnicalRequestSerializer(data=technical_details)

                technical_serializer.is_valid(raise_exception=True)
                technical_serializer.save(help_request=updated_request)

            # Return updated help request with all details
            return Response(HelpRequestSerializer(updated_request).data)

        except HelpRequest.DoesNotExist:
            return Response(
                {"error": "Help request not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request, pk):
        """Delete a help request"""
        try:
            help_request = HelpRequest.objects.get(pk=pk)

            # Check if user has permission to delete
            if request.user.role != 'admin' and help_request.entrepreneur.user != request.user:
                return Response(
                    {"error": "You don't have permission to delete this request"},
                    status=status.HTTP_403_FORBIDDEN
                )

            help_request.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        except HelpRequest.DoesNotExist:
            return Response(
                {"error": "Help request not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class HelpUpdateStatusAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            help_request = HelpRequest.objects.get(pk=pk)

            # Allow both staff users and the entrepreneur who created the request
            if not (help_request.entrepreneur.user == request.user):
                return Response({
                    'error': 'You do not have permission to update this request'
                }, status=status.HTTP_403_FORBIDDEN)

            new_status = request.data.get('status')

            if new_status not in dict(HelpRequest.STATUS_CHOICES):
                return Response({
                    'error': 'Invalid status'
                }, status=status.HTTP_400_BAD_REQUEST)

            help_request.status = new_status
            help_request.save()

            return Response({
                'message': 'Help request status updated successfully',
                'status': new_status
            })

        except HelpRequest.DoesNotExist:
            return Response({
                'error': 'Help request not found'
            }, status=status.HTTP_404_NOT_FOUND)


class HelpProposalView(APIView):
    permission_classes = [IsAuthenticated, IsProposalOwnerOrRequestEntrepreneur]

    def post(self, request, proposal_type):
        try:
            investor = request.user.investor
        except Investor.DoesNotExist:
            return Response(
                {"error": "Only investors can submit proposals"},
                status=status.HTTP_403_FORBIDDEN
            )

        if proposal_type == 'financial':
            serializer = FinancialProposalSerializer(data=request.data)
        elif proposal_type == 'technical':
            serializer = TechnicalProposalSerializer(data=request.data)
        else:
            return Response(
                {"error": "Invalid proposal type"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if serializer.is_valid():
            serializer.save(investor=investor)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, proposal_type, pk=None):
        try:
            investor = request.user.investor
        except Investor.DoesNotExist:
            return Response(
                {"error": "Only investors can view proposals"},
                status=status.HTTP_403_FORBIDDEN
            )

        if proposal_type == 'financial':
            proposals = investor.financial_proposals.all()
            serializer_class = FinancialProposalSerializer
        elif proposal_type == 'technical':
            proposals = investor.technical_proposals.all()
            serializer_class = TechnicalProposalSerializer
        else:
            return Response(
                {"error": "Invalid proposal type"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if pk:
            try:
                proposal = proposals.get(pk=pk)
                serializer = serializer_class(proposal)
            except (FinancialProposal.DoesNotExist, TechnicalProposal.DoesNotExist):
                return Response(
                    {"error": "Proposal not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            serializer = serializer_class(proposals, many=True)

        return Response(serializer.data)

    def patch(self, request, proposal_type, pk):
        try:
            investor = request.user.investor
        except Investor.DoesNotExist:
            return Response(
                {"error": "Only investors can update proposals"},
                status=status.HTTP_403_FORBIDDEN
            )

        if proposal_type == 'financial':
            try:
                proposal = FinancialProposal.objects.get(pk=pk, investor=investor)
                serializer_class = FinancialProposalSerializer
            except FinancialProposal.DoesNotExist:
                return Response(
                    {"error": "Proposal not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        elif proposal_type == 'technical':
            try:
                proposal = TechnicalProposal.objects.get(pk=pk, investor=investor)
                serializer_class = TechnicalProposalSerializer
            except TechnicalProposal.DoesNotExist:
                return Response(
                    {"error": "Proposal not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            return Response(
                {"error": "Invalid proposal type"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = serializer_class(proposal, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, proposal_type, pk):
        try:
            investor = request.user.investor
        except Investor.DoesNotExist:
            return Response(
                {"error": "Only investors can delete proposals"},
                status=status.HTTP_403_FORBIDDEN
            )

        if proposal_type == 'financial':
            try:
                proposal = FinancialProposal.objects.get(pk=pk, investor=investor)
            except FinancialProposal.DoesNotExist:
                return Response(
                    {"error": "Proposal not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        elif proposal_type == 'technical':
            try:
                proposal = TechnicalProposal.objects.get(pk=pk, investor=investor)
            except TechnicalProposal.DoesNotExist:
                return Response(
                    {"error": "Proposal not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            return Response(
                {"error": "Invalid proposal type"},
                status=status.HTTP_400_BAD_REQUEST
            )

        proposal.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

logger = logging.getLogger(__name__)
class EntrepreneurProposalView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, proposal_type=None):
        """Get all proposals for entrepreneur's help requests"""
        try:
            entrepreneur = request.user.entrepreneur
        except Entrepreneur.DoesNotExist:
            return Response(
                {"error": "Only entrepreneurs can view their request proposals"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get all help requests from this entrepreneur
        help_requests = HelpRequest.objects.filter(entrepreneur=entrepreneur)

        if proposal_type == 'financial':
            proposals = FinancialProposal.objects.filter(help_request__in=help_requests)
            serializer = FinancialProposalSerializer(proposals, many=True)
        elif proposal_type == 'technical':
            proposals = TechnicalProposal.objects.filter(help_request__in=help_requests)
            serializer = TechnicalProposalSerializer(proposals, many=True)
        else:
            # If no type specified, get both types
            financial_proposals = FinancialProposal.objects.filter(help_request__in=help_requests)
            technical_proposals = TechnicalProposal.objects.filter(help_request__in=help_requests)

            response_data = {
                'financial_proposals': FinancialProposalSerializer(financial_proposals, many=True).data,
                'technical_proposals': TechnicalProposalSerializer(technical_proposals, many=True).data
            }
            return Response(response_data)

        return Response(serializer.data)

    def patch(self, request, proposal_type, pk):
        """Update proposal status and handle contract/collaboration creation"""
        logger.info(f"Processing PATCH request for {proposal_type} proposal {pk}")

        try:
            # Validate user is entrepreneur
            try:
                entrepreneur = request.user.entrepreneur
            except Entrepreneur.DoesNotExist:
                return Response(
                    {"error": "Only entrepreneurs can update proposal status"},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Validate status
            new_status = request.data.get('status')
            if not new_status:
                return Response(
                    {"error": "Status field is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if new_status not in ['accepted', 'refused']:
                return Response(
                    {"error": "Invalid status. Must be 'accepted' or 'refused'"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get the appropriate proposal model and serializer
            if proposal_type == 'financial':
                ProposalModel = FinancialProposal
                ProposalSerializer = FinancialProposalSerializer
            elif proposal_type == 'technical':
                ProposalModel = TechnicalProposal
                ProposalSerializer = TechnicalProposalSerializer
            else:
                return Response(
                    {"error": "Invalid proposal type"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            with transaction.atomic():
                # Get and validate proposal
                try:
                    proposal = ProposalModel.objects.select_for_update().get(
                        pk=pk,
                        help_request__entrepreneur=entrepreneur
                    )
                except ProposalModel.DoesNotExist:
                    return Response(
                        {"error": "Proposal not found"},
                        status=status.HTTP_404_NOT_FOUND
                    )

                # Check if proposal is already processed
                if proposal.status in ['accepted', 'refused']:
                    return Response(
                        {"error": f"Proposal is already {proposal.status}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                if new_status == 'accepted':
                    if proposal_type == 'financial':
                        # Validate total accepted amount
                        accepted_proposals = FinancialProposal.objects.filter(
                            help_request=proposal.help_request,
                            status='accepted'
                        )
                        total_accepted = sum(p.investment_amount for p in accepted_proposals)
                        total_with_current = total_accepted + proposal.investment_amount

                        if total_with_current > proposal.help_request.financialrequest.amount_requested:
                            return Response(
                                {"error": "Accepting this proposal would exceed the requested amount"},
                                status=status.HTTP_400_BAD_REQUEST
                            )
                    else:  # technical
                        # Check if there's already an accepted technical proposal
                        existing_accepted = TechnicalProposal.objects.filter(
                            help_request=proposal.help_request,
                            status='accepted'
                        ).exists()

                        if existing_accepted:
                            return Response(
                                {"error": "Another technical proposal is already accepted"},
                                status=status.HTTP_400_BAD_REQUEST
                            )

                        # Refuse other technical proposals
                        proposal.help_request.technical_proposals.exclude(pk=pk).update(status='refused')

                # Update proposal status
                proposal.status = new_status
                proposal.save()

                # If accepted, create contract and collaboration
                if new_status == 'accepted':
                    try:
                        contract, collaboration = ContractHandler.create_contract_and_collaboration(
                            proposal,
                            proposal_type
                        )
                    except Exception as e:
                        logger.error(f"Error creating contract/collaboration: {str(e)}")
                        raise ValidationError("Failed to create contract and collaboration")

                    return Response({
                        'proposal': ProposalSerializer(proposal).data,
                        'contract_id': contract.id,
                        'collaboration_id': collaboration.id,
                        'message': 'Proposal accepted. Contract and collaboration created.'
                    })

                return Response({
                    'proposal': ProposalSerializer(proposal).data,
                    'message': 'Proposal refused successfully.'
                })

        except ValidationError as e:
            logger.error(f"Validation error: {str(e)}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

#Contract and collaborations
class ContractAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, proposal_type=None, proposal_id=None):
        user = request.user
        if hasattr(user, 'entrepreneur'):
            contracts = Contract.objects.filter(
                proposal__help_request__entrepreneur=user.entrepreneur
            )
        elif hasattr(user, 'investor'):
            contracts = Contract.objects.filter(
                proposal__investor=user.investor
            )
        else:
            contracts = Contract.objects.none()

        if proposal_type and proposal_id:
            contracts = contracts.filter(proposal__type=proposal_type, id=proposal_id)

        serializer = ContractSerializer(contracts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CollaborationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if hasattr(user, 'entrepreneur'):
            collaborations = Collaboration.objects.filter(entrepreneur=user.entrepreneur)
        elif hasattr(user, 'investor'):
            collaborations = Collaboration.objects.filter(investor=user.investor)
        else:
            collaborations = Collaboration.objects.none()

        serializer = CollaborationSerializer(collaborations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
