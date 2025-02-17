from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *


router = DefaultRouter()
router.register(r'user', UserCreationViewSet, basename='user')
router.register(r'login-api', LoginApiViewSet, basename='login-api')
router.register(r'logout-api', LogoutApiViewSet, basename='logout-api')

urlpatterns = [
    path('', include(router.urls)),
    
    path('custom-admin/login_to_account', login_to_account, name='login_to_account'),
]
