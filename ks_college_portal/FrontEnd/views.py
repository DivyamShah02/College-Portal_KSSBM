from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from rest_framework.exceptions import NotFound, ParseError
from django.shortcuts import get_object_or_404, render, redirect
from django.http import HttpResponse, JsonResponse

# Create your views here.
class LoginViewSet(viewsets.ViewSet):
    def list(self, request):
        return render(request, 'login.html')

class UserRegisterViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_staff:
            return render(request, "Admin/user_registration.html")
        return HttpResponse('Not Authorised')

class SubjectsViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_authenticated:
            if request.user.role == 'teacher':
                return render(request, "Teacher/subjects.html")
            elif request.user.role == 'student':
                return render(request, "Student/subjects.html")
        return HttpResponse('Not Authorised')

class SubjectDetailViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_authenticated:
            if request.user.role == 'teacher':
                return render(request, "Teacher/subject-detail.html")
            elif request.user.role == 'student':
                return render(request, "Student/subject-detail.html")
        return HttpResponse('Not Authorised')

class PlacementViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_authenticated:
            if request.user.year == 'fifth_year':
                if request.user.role == 'teacher':
                    return render(request, "Teacher/placements.html")
                elif request.user.role == 'student':
                    return render(request, "Student/placements.html")
        return HttpResponse('Not Authorised')

class PlacementDetailViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_authenticated:
            if request.user.year == 'fifth_year':
                if request.user.role == 'teacher':
                    return render(request, "Teacher/placement-detail.html")
                elif request.user.role == 'student':
                    return render(request, "Student/placement-detail.html")
        return HttpResponse('Not Authorised')
