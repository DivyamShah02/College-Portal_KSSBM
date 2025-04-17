import requests
import random
import pandas as pd

API_URL = "http://127.0.0.1:8000/"

YEARS = {
    "first_year": "1",
    "second_year": "2",
    "third_year": "3",
    "fourth_year": "4",
    "fifth_year": "5"
}

DIVISIONS = ["A", "B", "C"]

first_names = [
    "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
    "Anaya", "Diya", "Myra", "Saanvi", "Aadhya", "Ira", "Meera", "Kiara", "Riya", "Tara", "Divyam"
]

last_names = [
    "Sharma", "Verma", "Mehta", "Patel", "Reddy", "Chopra", "Kapoor", "Malhotra", "Desai", "Joshi",
    "Nair", "Mishra", "Iyer", "Jain", "Choudhary", "Singh", "Khan", "Agarwal", "Bansal", "Gupta", "Shah"
]

def generate_contact():
    return "98" + "".join([str(random.randint(0, 9)) for _ in range(8)])

def generate_name():
    return f"{random.choice(first_names)} {random.choice(last_names)}"

def create_users():
    user_count = 0
    all_students = []    
    for year, year_code in YEARS.items():
        roll_start = int(f"{year_code}001")  # Start from 1001, 2001, etc.
        roll_counter = roll_start

        for division in DIVISIONS:
            for _ in range(70):  # 70 students per division
                formatted_roll = str(roll_counter)

                data = {
                    "name": generate_name(),
                    "password": "Admin@123",
                    "contact_number": generate_contact(),
                    "email": f"{formatted_roll}@kssbm.org",
                    "roll_no": formatted_roll,
                    "year": year,
                    "division": division,
                    "city": "Ahmedabad",
                    "state": "Gujarat",
                    "role": "student",
                }
                all_students.append(data)
                roll_counter += 1

    df = pd.DataFrame(all_students)
    df.to_excel("students_data.xlsx", index=False)
    

    # try:
    #     data = {
    #         "students_data": all_students,
    #     }
    #     # import pdb; pdb.set_trace()
    #     # print(data)
    #     url = API_URL + 'user/multiple-student-api/'
    #     response = requests.post(url, json=data)
    #     print(response.json())
    #     if response.status_code == 201:
    #         print(f"\n✅ Total users created: {len(all_students)}")
            
    # except Exception as e:
    #     print(f"[!] Exception for {data['roll_no']}: {e}")

    

# 🔥 Run it
create_users()
