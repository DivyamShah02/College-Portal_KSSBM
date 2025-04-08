from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from rest_framework.exceptions import NotFound, ParseError

from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import authenticate, login, logout

from .serializers import UserSerializer
from .models import User


import random
import string
from datetime import datetime, timedelta


logger = None


class UserCreationViewSet(viewsets.ViewSet):
    def create(self, request):
        try:
            # Extract data from the request
            name = request.data.get('name')
            password = request.data.get('password')
            contact_number = request.data.get('contact_number')
            email = request.data.get('email')
            city = request.data.get('city')
            state = request.data.get('state')
            role = request.data.get('role')
            roll_no = request.data.get('roll_no')
            year = request.data.get('year')
            division = request.data.get('division')

            role_codes = {
                'admin': 'A',
                'teacher': 'T',
                'student': 'S'
            }

            email_already_user = User.objects.filter(email=email).first()
            contact_number_already_user = User.objects.filter(contact_number=contact_number).first()

            if email_already_user or contact_number_already_user:
                return Response(
                        {
                            "success": False,                            
                            "data":None,
                            "error": "User already registered."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )


            if not name or not contact_number or not email or role not in role_codes.keys():
                return Response(
                        {
                            "success": False,                            
                            "data":None,
                            "error": "Missing required fields."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )


            user_id = self.generate_user_id(role_code=role_codes[role])

            if str(role_codes[role]) == 'A':
                user = User.objects.create_superuser(
                    user_id=user_id,
                    username = user_id,
                    password = password,
                    name=name,
                    contact_number=contact_number,
                    email=email,
                    city=city,
                    state=state,
                    role=role,
                )
            
            else:
                user = User.objects.create_user(
                    user_id=user_id,
                    username = user_id,
                    password = password,
                    name=name,
                    contact_number=contact_number,
                    email=email,
                    city=city,
                    state=state,
                    role=role,
                    roll_no=roll_no,
                    year=year,
                    division=division,
                )
            
            user_detail_serializer = UserSerializer(user)

            return Response(
                        {
                            "success": True,                         
                            "data":user_detail_serializer.data,
                            "error": None
                        },
                        status=status.HTTP_201_CREATED
                    )


        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "data":None,
                            "error": str(ex)
                        },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

    def list(self, request):
        user_id = request.query_params.get('user_id')  # Use query_params for GET requests
        if not user_id:
            return Response(
                        {
                            "success": False,                            
                            "data":None,
                            "error": "Missing user_id."
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )


        user_data_obj = get_object_or_404(User, user_id=user_id)
        user_data = UserSerializer(user_data_obj).data
        return Response(
                    {
                        "success": True,                            
                        "data":user_data,
                        "error": None
                    },
                    status=status.HTTP_200_OK
                )

    def generate_user_id(self, role_code):
        while True:
            user_id = ''.join(random.choices(string.digits, k=10))
            user_id = role_code + user_id
            if not User.objects.filter(user_id=user_id).exists():
                return user_id


class LoginApiViewSet(viewsets.ViewSet):
    def create(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {
                    "success": False,
                    "user_does_not_exist": False,
                    "wrong_password": False,
                    "error": "Email and password are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.filter(email=email).first()
            if not user:
                return Response(
                    {
                        "success": False,
                        "user_does_not_exist": True,
                        "wrong_password": False,
                        "error": None
                    },
                    status=status.HTTP_404_NOT_FOUND
                )

            authenticated_user = authenticate(request, username=user.user_id, password=password)
            if not authenticated_user:
                return Response(
                    {
                        "success": False,
                        "user_does_not_exist": False,
                        "wrong_password": True,
                        "error": None
                    },
                    status=status.HTTP_401_UNAUTHORIZED
                )

            login(request, authenticated_user)
            request.session.set_expiry(30 * 24 * 60 * 60)

            return Response(
                {
                    "success": True,
                    "user_does_not_exist": False,
                    "wrong_password": False,
                    "error": None,
                    "data": {"user_id": user.user_id}
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {
                    "success": False,
                    "user_does_not_exist": False,
                    "wrong_password": False,
                    "error": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class LogoutApiViewSet(viewsets.ViewSet):
    def list(self, request):
        try:
            logout(request)
            return redirect('dashboard-list')

        except Exception as e:
            print(e)
            return redirect('dashboard-list')


class MultipleStudentCreationViewSet(viewsets.ViewSet):
    def create(self, request):
        try:
            all_students_data = request.data.get('students_data')
            if not all_students_data:
                return Response(
                    {
                        "success": False,
                        "data": None,
                        "error": "No student data provided."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            all_student_data_perfect, reason = self.checl_all_students_data_dict(all_students_data)
            if not all_student_data_perfect:
                return Response(
                    {
                        "success": False,
                        "data": None,
                        "error": reason
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            for index,student_data in enumerate(all_students_data):
                name = student_data.get('name')
                password = student_data.get('password')
                contact_number = student_data.get('contact_number')
                email = student_data.get('email')
                city = student_data.get('city')
                state = student_data.get('state')
                role = student_data.get('role')
                roll_no = student_data.get('roll_no')
                year = student_data.get('year')
                division = student_data.get('division')

                user_id = self.generate_user_id(role_code='S')

                user = User.objects.create_user(
                    user_id=user_id,
                    username = user_id,
                    password = password,
                    name=name,
                    contact_number=contact_number,
                    email=email,
                    city=city,
                    state=state,
                    role=role,
                    roll_no=roll_no,
                    year=year,
                    division=division,
                )

                print(f"{index}) [✓] Created {name} - {roll_no}")

            return Response(
                        {
                            "success": True,                         
                            "data":"Users created successfully.",
                            "error": None
                        },
                        status=status.HTTP_201_CREATED
                    )


        except Exception as ex:
            # logger.error(ex, exc_info=True)
            print(ex)
            return Response(
                        {
                            "success": False,
                            "data":None,
                            "error": str(ex)
                        },
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

    def check_students_data_dict(self, student_data):
        required_fields = ['name', 'password', 'contact_number', 'email', 'city', 'state', 'role', 'roll_no', 'year', 'division']
        for field in required_fields:
            if field not in student_data:
                return False, f"Missing field: {field}"
            
            student_already_user = User.objects.filter(email=student_data['email']).first()
            if student_already_user:
                return False, "User already registered."
        return True, "All fields are present."

    def checl_all_students_data_dict(self, all_students_data):
        for ind,student_data in enumerate(all_students_data):
            data_perfect, reason = self.check_students_data_dict(student_data)
            if not data_perfect:
                return False, f"Data error at index {ind}: {reason}"
        return True, "All data is perfect."

    def generate_user_id(self, role_code):
        while True:
            user_id = ''.join(random.choices(string.digits, k=10))
            user_id = role_code + user_id
            if not User.objects.filter(user_id=user_id).exists():
                return user_id


def login_to_account(request):
    try:
        request_user = request.user
        username = request.GET.get('username')
        print(username)

        user = User.objects.get(username=username)

        if request_user.is_staff:
            print('Staff')
            login(request, user)

        return redirect('dashboard-list')

    except Exception as e:
        print(e)
        return redirect('dashboard-list')
