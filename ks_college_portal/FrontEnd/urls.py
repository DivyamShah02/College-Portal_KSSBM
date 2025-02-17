from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *


router = DefaultRouter()

router.register(r'login', LoginViewSet, basename='login')
router.register(r'register', UserRegisterViewSet, basename='register')
router.register(r'subjects', SubjectsViewSet, basename='subjects')
router.register(r'single-subject', SingleSubjectViewSet, basename='single-subject')


urlpatterns = [
    path('', include(router.urls)),
]

