import unittest

from pydantic import ValidationError

from app.schemas.user import AdminCreateUserRequest


class CreateUserRoleTests(unittest.TestCase):
    def test_all_supported_roles_are_accepted(self):
        for role in ("user", "responsible", "admin"):
            with self.subTest(role=role):
                request = AdminCreateUserRequest(username="new-user", password="test-password", role=role)
                self.assertEqual(request.role, role)

    def test_default_role_is_user(self):
        request = AdminCreateUserRequest(username="new-user", password="test-password")
        self.assertEqual(request.role, "user")

    def test_invalid_role_is_rejected(self):
        with self.assertRaises(ValidationError):
            AdminCreateUserRequest(username="new-user", password="test-password", role="superadmin")


if __name__ == "__main__":
    unittest.main()
