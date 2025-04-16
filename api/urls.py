
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'products', views.ProductViewSet)
router.register(r'comments', views.CommentViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'purchases', views.PurchaseViewSet)
router.register(r'shipping-addresses', views.ShippingAddressViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('csrf/', views.get_csrf, name='csrf'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('auth/register/', views.register_view, name='register'),
    path('upload-image/', views.upload_image, name='upload-image'),
    path('shipping-addresses/<int:pk>/set-default/', views.set_default_shipping_address, name='set-default-shipping-address'),
]

# Add this to serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
