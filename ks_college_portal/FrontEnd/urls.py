from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *


router = DefaultRouter()

router.register(r'', HomeViewSet, basename='home')

router.register(r'register', UserRegisterViewSet, basename='register')
router.register(r'login', LoginViewSet, basename='login')

router.register(r'dashboard', DashboardViewSet, basename='dashboard')

router.register(r'subjects', SubjectsViewSet, basename='subjects')
router.register(r'subject-detail', SubjectDetailViewSet, basename='subject-detail')

router.register(r'placements', PlacementViewSet, basename='placements')
router.register(r'placement-detail', PlacementDetailViewSet, basename='placement-detail')

router.register(r'announcements', AnnouncementsViewSet, basename='announcements')

router.register(r'assignments', AssignmentsViewSet, basename='assignments')

router.register(r'students', StudentsDataViewSet, basename='students')
router.register(r'teachers', TeachersDataViewSet, basename='teachers')

router.register(r'events', EventViewSet, basename='events')
router.register(r'event-detail', EventDetailViewSet, basename='event-detail')

urlpatterns = [
    path('', include(router.urls)),
]

