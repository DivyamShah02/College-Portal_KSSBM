from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *


router = DefaultRouter()

router.register(r'teacher-events-api', TeacherEventViewSet, basename='teacher-events-api')
router.register(r'student-events-api', StudentEventViewSet, basename='student-events-api')

router.register(r'event-announcements-api', EventAnnouncementViewSet, basename='event-announcements-api')

router.register(r'event-registrations-api', EventRegistrationViewSet, basename='event-registrations-api')

urlpatterns = [
    path('', include(router.urls)),
]

