from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from rest_framework.exceptions import NotFound, ParseError

from django.conf import settings
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import authenticate, login, logout

from .serializers import *
from .models import *

import os
import random
import string
from datetime import datetime, timedelta


logger = None


class TeacherPlacementViewSet(viewsets.ViewSet):
    def create(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": True,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            user_role = user.role
            if user_role != 'teacher':
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": True,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            company_name = request.data.get('company_name')
            description = request.data.get('description')
            website = request.data.get('website')
            job_role = request.data.get('job_role')
            notes = request.data.get('notes')
            internship_duration = request.data.get('internship_duration')
            internship_stipend = request.data.get('internship_stipend')
            estimated_package = request.data.get('estimated_package')

            if (company_name == None) or (description == None) or (website == None)\
                or (job_role == None) or (notes == None) or (internship_duration == None)\
                or (internship_stipend == None) or (estimated_package == None):
                    return Response(
                            {
                                "success": False,
                                "user_not_logged_in": False,
                                "user_unauthorized": False,                            
                                "data": None,
                                "error": 'Details not provided.'
                            },
                            status=status.HTTP_400_BAD_REQUEST
                        )

            company_id = self.generate_company_id()
            new_subject = Company(
                        company_id=company_id,
                        teacher_id=user,
                        company_name=company_name,
                        description=description,
                        website=website,
                        job_role=job_role,
                        notes=notes,
                        internship_duration=internship_duration,
                        internship_stipend=internship_stipend,
                        estimated_package=estimated_package
                    )
            new_subject.save()

            return Response(
                    {
                        "success": True,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data": None,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )

        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": str(ex)
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

    def generate_company_id(self):
        while True:
            company_id = ''.join(random.choices(string.digits, k=10))
            if not Company.objects.filter(company_id=company_id).exists():
                return company_id

    def list(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": True,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            user_role = user.role
            if user_role != 'teacher':
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": True,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            all_companies_obj = Company.objects.filter(teacher_id=user)
            all_companies = CompanySerializer(all_companies_obj, many=True).data

            data = {
                'all_companies': all_companies[::-1],
                'total_companies': len(all_companies),
            }
            return Response(
                    {
                        "success": True,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data":data,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )

        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": str(ex)
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

class StudentPlacementViewSet(viewsets.ViewSet):
    def list(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": True,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            user_role = user.role
            if user_role != 'student' or request.user.year != 'fifth_year':
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": True,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            all_companies_obj = Company.objects.all()
            all_companies = StudentCompanySerializer(all_companies_obj, many=True, context={'student_id': user}).data

            data = {
                'all_companies': all_companies[::-1],
                'total_companies': len(all_companies),
            }
            return Response(
                    {
                        "success": True,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data":data,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )

        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": str(ex)
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

class CompanyAnnouncementViewSet(viewsets.ViewSet):
    def list(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": True,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            company_id = request.GET.get('company_id')
            if not company_id:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": "Company Announcement Id required."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            if user.role == 'teacher':
                company_data_obj = Company.objects.filter(company_id=company_id, teacher_id=user).exists()
                if not company_data_obj:
                    return Response(
                            {
                                "success": False,
                                "user_not_logged_in": False,
                                "user_unauthorized": False,                            
                                "data": None,
                                "error": "Company Id is not valid or you are not authorized to get information."
                            },
                            status=status.HTTP_400_BAD_REQUEST
                        )

            elif user.role == 'student':
                check_user_registered = PlacmentRegistration.objects.filter(company_id=company_id, student_id=user).exists()
                if not check_user_registered:
                    return Response(
                            {
                                "success": False,
                                "user_not_logged_in": False,
                                "user_unauthorized": False,                            
                                "data": None,
                                "error": "Company Id is not valid or you are not authorized to get information."
                            },
                            status=status.HTTP_400_BAD_REQUEST
                        )

            company_data_obj = Company.objects.filter(company_id=company_id).first()
            company_data = CompanySerializer(company_data_obj).data

            all_company_announcements_obj = CompanyAnnouncement.objects.filter(company_id=company_id)
            all_company_announcements = CompanyAnnouncementSerializer(all_company_announcements_obj, many=True).data

            user_registered = True
            all_registered_students = []

            if user.role == 'student':
                user_registered = PlacmentRegistration.objects.filter(company_id=company_id, student_id=user).exists()
            
            elif user.role == 'teacher':
                all_registered_students_obj = PlacmentRegistration.objects.filter(company_id=company_id)
                all_registered_students = PlacmentRegistrationSerializer(all_registered_students_obj, many=True).data

            data = {
                'all_company_announcements': all_company_announcements[::-1],
                'total_company_announcements': len(all_company_announcements),
                'company_data': company_data,
                'all_registered_students': all_registered_students,
                'user_registered': user_registered,
            }

            return Response(
                    {
                        "success": True,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data":data,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )

        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": str(ex)
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

    def create(self, request):
        try:
            user = request.user

            if not user.is_authenticated:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": True,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            user_role = user.role
            if user_role != 'teacher':
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": True,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
                       
            announcement_content = request.data.get('announcement_content')
            if not announcement_content:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": "Text Content not provided."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            company_id = request.data.get('company_id')
            if not company_id:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": "Company Id required."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            company_announcement_id = self.generate_company_announcement_id()

            new_company_announcements = CompanyAnnouncement(
                company_announcement_id=company_announcement_id,
                company_id=company_id,
                announcement_content=announcement_content
            )
            new_company_announcements.save()
           
            return Response(
                    {
                        "success": True,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data": None,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )
        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": str(ex)
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

    def generate_company_announcement_id(self):
        while True:
            company_announcement_id = ''.join(random.choices(string.digits, k=10))
            if not CompanyAnnouncement.objects.filter(company_announcement_id=company_announcement_id).exists():
                return company_announcement_id

class PlacementRegistrationViewSet(viewsets.ViewSet):
    def list(self, request):
        try:
            user = request.user
            if not user.is_authenticated:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": True,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            company_id = request.GET.get('company_id')
            if not company_id:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": "Company Announcement Id required."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            all_placement_registrations_obj = PlacmentRegistration.objects.filter(company_id=company_id)
            all_placement_registrations = PlacmentRegistrationSerializer(all_placement_registrations_obj, many=True).data

            data = {
                'all_placement_registrations': all_placement_registrations[::-1],
                'total_placement_registrations': len(all_placement_registrations),
            }

            return Response(
                    {
                        "success": True,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data":data,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )

        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": str(ex)
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

    def create(self, request):
        try:
            user = request.user

            if not user.is_authenticated:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": True,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            user_role = user.role
            if user_role != 'student':
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": True,                            
                            "data": None,
                            "error": None
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            company_id = request.data.get('company_id')
            if not company_id:
                return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": "Company Id required."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

            user_registered = PlacmentRegistration.objects.filter(company_id=company_id, student_id=user).exists()
            if user_registered:
                return Response(
                    {
                        "success": False,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data": None,
                        "error": 'Student already registered to this company.'
                    },
                    status=status.HTTP_200_OK
                )

            registration_id = self.generate_registration_id()

            new_placement_registrations = PlacmentRegistration(
                registration_id=registration_id,
                company_id=company_id,
                student_id=user
            )
            new_placement_registrations.save()
           
            return Response(
                    {
                        "success": True,
                        "user_not_logged_in": False,
                        "user_unauthorized": False,                        
                        "data": None,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )
        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "user_not_logged_in": False,
                            "user_unauthorized": False,                            
                            "data": None,
                            "error": str(ex)
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

    def generate_registration_id(self):
        while True:
            registration_id = ''.join(random.choices(string.digits, k=10))
            if not PlacmentRegistration.objects.filter(registration_id=registration_id).exists():
                return registration_id

