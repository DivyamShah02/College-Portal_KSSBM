from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *


router = DefaultRouter()

router.register(r'teacher-placements-api', TeacherPlacementViewSet, basename='teacher-placements-api')
router.register(r'student-placements-api', StudentPlacementViewSet, basename='student-placements-api')
router.register(r'company-announcements-api', CompanyAnnouncementViewSet, basename='company-announcements-api')

urlpatterns = [
    path('', include(router.urls)),
]

