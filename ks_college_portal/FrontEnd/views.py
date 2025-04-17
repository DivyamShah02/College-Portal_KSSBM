from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from rest_framework.exceptions import NotFound, ParseError
from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse, JsonResponse

class HomeViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_authenticated:            
            return redirect('dashboard-list')
        return redirect('login-list')

class UserRegisterViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_staff:
            return render(request, "Admin/user_registration.html")
        return redirect('dashboard-list')

class LoginViewSet(viewsets.ViewSet):
    def list(self, request):
        return render(request, "login.html")

class DashboardViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_authenticated:
            if request.user.role == 'teacher':
                return render(request, "Teacher/dashboard.html")
            elif request.user.role == 'student':
                return render(request, "Student/dashboard.html")
            elif request.user.role == 'admin':
                return render(request, "Admin/dashboard.html")
        return redirect('login-list')

class SubjectsViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_authenticated:
            if request.user.role == 'teacher':
                return render(request, "Teacher/subjects.html")
            elif request.user.role == 'student':
                return render(request, "Student/subjects.html")
            elif request.user.role == 'admin':
                return render(request, "Admin/subjects.html")
        return redirect('dashboard-list')

class SubjectDetailViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_authenticated:
            if request.user.role == 'teacher':
                return render(request, "Teacher/subject-detail.html")
            elif request.user.role == 'student':
                return render(request, "Student/subject-detail.html")
            elif request.user.role == 'admin':
                return render(request, "Admin/subject-detail.html")
        return redirect('dashboard-list')

class PlacementViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_authenticated:
            if request.user.role == 'teacher':
                return render(request, "Teacher/placements.html")
            if request.user.role == 'student':
                if request.user.year == 'fifth_year':
                    return render(request, "Student/placements.html")
        return redirect('dashboard-list')

class PlacementDetailViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_authenticated:
            if request.user.role == 'teacher':
                return render(request, "Teacher/placement-detail.html")
            if request.user.role == 'student':
                if request.user.year == 'fifth_year':
                    return render(request, "Student/placement-detail.html")
        return redirect('dashboard-list')

class AnnouncementsViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_authenticated:
            if request.user.role == 'teacher':
                return render(request, "Teacher/announcements.html")
            elif request.user.role == 'student':
                return render(request, "Student/announcements.html")
        return redirect('dashboard-list')

class AssignmentsViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_authenticated:
            if request.user.role == 'student':
                return render(request, "Student/assignments.html")
        return redirect('dashboard-list')

class StudentsDataViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_authenticated:
            if request.user.role == 'teacher':
                return render(request, "Teacher/students.html")
            elif request.user.role == 'admin':
                return render(request, "Admin/students.html")
        return redirect('dashboard-list')

class TeachersDataViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_authenticated:            
            if request.user.role == 'admin':
                return render(request, "Admin/teachers.html")
        return redirect('dashboard-list')

class EventViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_authenticated:
            if request.user.role == 'teacher':
                return render(request, "Teacher/events.html")
            if request.user.role == 'student':
                return render(request, "Student/events.html")
        return redirect('dashboard-list')

class EventDetailViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_authenticated:
            if request.user.role == 'teacher':
                return render(request, "Teacher/event-detail.html")
            if request.user.role == 'student':
                if request.user.year == 'fifth_year':
                    return render(request, "Student/event-detail.html")
        return redirect('dashboard-list')
