import unittest

from pydantic import ValidationError

from app.schemas.item import ItemCreate, ItemUpdate


class ItemAvailabilityTests(unittest.TestCase):
    def setUp(self):
        self.data = dict(serie_number="SN-001", location="0106100810", insertion_date="2026-11-03")

    def test_edit_serializes_both_availability_states(self):
        for available in (True, False):
            with self.subTest(available=available):
                data = ItemUpdate(**self.data, availlable=available).model_dump()
                self.assertIs(data["availlable"], available)

    def test_edit_requires_explicit_availability(self):
        with self.assertRaises(ValidationError):
            ItemUpdate(**self.data)

    def test_create_still_defaults_to_available(self):
        self.assertIs(ItemCreate(**self.data).availlable, True)
