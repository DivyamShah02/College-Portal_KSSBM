import requests

base_url = 'http://127.0.0.1:8000/'
# base_url = 'https://ericsontpa.pythonanywhere.com/'

def create_user():
    url = base_url + 'user/user/'

    data = {
        'name': 'Admin',
        'password':'Admin@123',
        'contact_number': '0987654321',
        'email': 'admin@dynamiclabz.net',
        'city': 'Ahmedabad',
        'state': 'Gujarat',
        'role': 'admin',
    }

    response = requests.post(url, data=data)

    return response

def promote_student():
    url = base_url + 'user/promote-student-api/'


    response = requests.post(url)

    return response


if __name__ == '__main__':
    print('Hello')

    # create_user_respone = create_user()
    # print(create_user_respone.text)

    promote_student_respone = promote_student()
    print(promote_student_respone.text)
