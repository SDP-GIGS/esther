from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Student

User = get_user_model()

class StudentModelTest(TestCase):

    def test_create_student(self):
        user = User.objects.create_user(
            username="jerry",
            password="test123"
        )

        student = Student.objects.create(
            user=user,
            registration_number="25/U/001",
            department="Computer Science",
            course="Bachelor of Information Technology",
            year_of_study=3,
            internship_place="ABC Technologies",
            supervisor_name="   Esther Chrisine",
            supervisor_email="esther@example.com",
            phone_number="0769960848"
        )

        self.assertEqual(student.registration_number, "25/U/001")


