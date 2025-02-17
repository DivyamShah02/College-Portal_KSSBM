from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *


router = DefaultRouter()

router.register(r'teacher-subjects-api', TeacherSubjectViewSet, basename='teacher-subjects-api')
router.register(r'student-subjects-api', StudentSubjectViewSet, basename='student-subjects-api')
router.register(r'teacher-announcements-api', TeacherAnnouncementViewSet, basename='teacher-announcements-api')



urlpatterns = [
    path('', include(router.urls)),
]

