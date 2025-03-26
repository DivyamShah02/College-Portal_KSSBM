from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *


router = DefaultRouter()

router.register(r'teacher-dashboard-api', TeacherDashboardViewSet, basename='teacher-dashboard-api')
router.register(r'student-dashboard-api', StudentDashboardViewSet, basename='student-dashboard-api')
router.register(r'student-dashboard-pending-assignment-count-api', StudentDashboardPendingAssignmentCountViewSet, basename='student-dashboard-pending-assignment-count-api')

router.register(r'teacher-subjects-api', TeacherSubjectViewSet, basename='teacher-subjects-api')
router.register(r'student-subjects-api', StudentSubjectViewSet, basename='student-subjects-api')

router.register(r'subject-detail-api', SubjectDetailViewSet, basename='subject-detail-api')

router.register(r'announcements-api', AnnouncementViewSet, basename='announcements-api')
router.register(r'comment-api', CommentViewSet, basename='comment-api')

router.register(r'assignments-api', AssignmentViewSet, basename='assignments-api')
router.register(r'submit-assignments-api', SubmittedAssignmentViewSet, basename='submit-assignments-api')
router.register(r'all-assignments-submitted-api', AllSubmittedAssignmentViewSet, basename='all-assignments-submitted-api')

router.register(r'attendance-api', AttendanceViewSet, basename='attendance-api')


urlpatterns = [
    path('', include(router.urls)),
]

