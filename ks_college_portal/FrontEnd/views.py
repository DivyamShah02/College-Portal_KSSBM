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

class SingleSubjectViewSet(viewsets.ViewSet):
    def list(self, request):
        if request.user.is_authenticated:
            if request.user.role == 'teacher':
                return render(request, "Teacher/single_subject.html")
            elif request.user.role == 'student':
                return render(request, "Student/student_dashboard.html")
        return HttpResponse('Not Authorised')
