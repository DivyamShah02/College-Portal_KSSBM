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
            return render(request, "dashboard.html")
        return redirect('login-list')

class SubjectsViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_authenticated:
            if request.user.role == 'teacher':
                return render(request, "Teacher/subjects.html")
            elif request.user.role == 'student':
                return render(request, "Student/subjects.html")
        return redirect('dashboard-list')

class SubjectDetailViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_authenticated:
            if request.user.role == 'teacher':
                return render(request, "Teacher/subject-detail.html")
            elif request.user.role == 'student':
                return render(request, "Student/subject-detail.html")
        return redirect('dashboard-list')

class PlacementViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_authenticated:
            if request.user.year == 'fifth_year':
                if request.user.role == 'teacher':
                    return render(request, "Teacher/placements.html")
                elif request.user.role == 'student':
                    return render(request, "Student/placements.html")
        return redirect('dashboard-list')

class PlacementDetailViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_authenticated:
            if request.user.year == 'fifth_year':
                if request.user.role == 'teacher':
                    return render(request, "Teacher/placement-detail.html")
                elif request.user.role == 'student':
                    return render(request, "Student/placement-detail.html")
        return redirect('dashboard-list')
