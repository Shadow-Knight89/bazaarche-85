
from rest_framework import viewsets, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie

from .models import Product, Category, Comment, Purchase, PurchaseItem
from .serializers import (
    ProductSerializer, CategorySerializer, UserSerializer, 
    CommentSerializer, PurchaseSerializer, PurchaseItemSerializer
)

@api_view(['GET'])
@ensure_csrf_cookie
def get_csrf(request):
    """
    Get CSRF token for the client
    """
    return JsonResponse({'detail': 'CSRF cookie set'})

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(request, username=username, password=password)
    
    if user is not None:
        login(request, user)
        return Response(UserSerializer(user).data)
    
    return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'detail': 'Successfully logged out'})

@api_view(['POST'])
def register_view(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = User.objects.create_user(
            username=serializer.validated_data['username'],
            email=serializer.validated_data.get('email', ''),  # Handle optional email
            password=request.data.get('password')
        )
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['customId']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        queryset = Product.objects.all()
        customId = self.request.query_params.get('customId', None)
        if customId is not None:
            queryset = queryset.filter(customId=customId)
        return queryset

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase.objects.all().prefetch_related('items', 'items__product', 'user')
    serializer_class = PurchaseSerializer
    
    def get_permissions(self):
        """
        Users can create purchases, admins can view all purchases,
        users can view their own purchases
        """
        if self.action == 'create':
            permission_classes = [IsAuthenticated]
        elif self.action == 'list':
            # For list action, we'll filter in get_queryset
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.is_staff:
            return Purchase.objects.all().prefetch_related('items', 'items__product', 'user')
        return Purchase.objects.filter(user=user).prefetch_related('items', 'items__product', 'user')
    
    def create(self, request, *args, **kwargs):
        items_data = request.data.get('items', [])
        total = request.data.get('total', 0)
        
        serializer = self.get_serializer(
            data={'total': total},
            context={'request': request, 'items': items_data}
        )
        
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_image(request):
    """
    Upload an image and return its URL
    """
    if 'file' not in request.FILES:
        return Response({'detail': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    file = request.FILES['file']
    
    # TODO: Implement actual file storage, for now, let's just return a mock URL
    # In a real implementation, you'd save the file to a storage service like AWS S3
    # and return the actual URL
    
    return Response({'url': f'https://example.com/images/{file.name}'})
