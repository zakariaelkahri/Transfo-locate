import unittest
from uuid import uuid4

from pydantic import ValidationError

from app.schemas.item import ItemCreate, ItemResponse


class ItemLocationTests(unittest.TestCase):
    def test_ten_digits_preserve_leading_zeros(self):
        for location in ("0106100810", "0106110510", "0101010610", "9999999999"):
            with self.subTest(location=location):
                item = ItemCreate(location=location, insertion_date="2026-11-03", serie_number="SN-001")
                self.assertEqual(item.model_dump()["location"], location)
                response = ItemResponse(**item.model_dump(), id=uuid4(), user_id=uuid4())
                self.assertEqual(response.model_dump(mode="json")["location"], location)

    def test_invalid_locations_are_rejected(self):
        for location in ("", "010610081", "01061008100", "01061A0810", "-106100810",
                         "01061.0810", "01061 0810", "٠١٠٦١٠٠٨١٠", 106100810):
            with self.subTest(location=location):
                with self.assertRaises(ValidationError):
                    ItemCreate(location=location, insertion_date="2026-11-03", serie_number="SN-001")


class ItemIdentifierTests(unittest.TestCase):
    def test_description_length_limit(self):
        data = dict(location="0106100810", insertion_date="2026-11-03", serie_number="SN-001")
        item = ItemCreate(**data, description="D" * 50)
        self.assertEqual(item.model_dump()["description"], "D" * 50)
        with self.assertRaises(ValidationError):
            ItemCreate(**data, description="D" * 51)

    def test_old_of_field_is_rejected(self):
        with self.assertRaises(ValidationError):
            ItemCreate(location="0106100810", insertion_date="2026-11-03", of="OF-001")

    def test_each_identifier_can_be_used_alone(self):
        for name in ("serie_number", "mp"):
            with self.subTest(name=name):
                identifiers = dict(serie_number=" ", description="", mp=None)
                identifiers[name] = " REF-001 "
                item = ItemCreate(location="0106100810", insertion_date="2026-11-03", **identifiers)
                self.assertEqual(getattr(item, name), "REF-001")
                for other in identifiers:
                    if other != name:
                        self.assertIsNone(getattr(item, other))

    def test_missing_or_multiple_identifiers_are_rejected(self):
        for identifiers in ({}, {"serie_number": " ", "description": "", "mp": None},
                            {"description": "Description"},
                            {"serie_number": "SN", "mp": "MP"},
                            {"serie_number": "SN", "description": "Description", "mp": "MP"}):
            with self.subTest(identifiers=identifiers):
                with self.assertRaises(ValidationError):
                    ItemCreate(location="0106100810", insertion_date="2026-11-03", **identifiers)

    def test_existing_records_remain_readable(self):
        response = ItemResponse(location="0106100810", insertion_date="2026-11-03",
                                serie_number="SN", description="Description", id=uuid4(), user_id=uuid4())
        self.assertEqual(response.description, "Description")

    def test_serial_number_accepts_optional_kv(self):
        for kv in (None, 0, 20):
            with self.subTest(kv=kv):
                item = ItemCreate(location="0106100810", insertion_date="2026-11-03",
                                  serie_number="SN-001", kv=kv)
                self.assertEqual(item.kv, kv)

    def test_mp_rejects_kv_but_allows_it_to_be_empty(self):
        for name in ("mp",):
            with self.subTest(identifier=name):
                data = dict(location="0106100810", insertion_date="2026-11-03", **{name: "REF-001"})
                self.assertIsNone(ItemCreate(**data).kv)
                self.assertIsNone(ItemCreate(**data, kv=None).kv)
                for kv in (0, 20):
                    with self.assertRaises(ValidationError):
                        ItemCreate(**data, kv=kv)

    def test_description_is_optional_and_independent(self):
        for identifier in ("serie_number", "mp"):
            for description in (None, "", "Description de l’article"):
                with self.subTest(identifier=identifier, description=description):
                    item = ItemCreate(location="0106100810", insertion_date="2026-11-03",
                                      description=description, **{identifier: "REF-001"})
                    self.assertEqual(item.description, description or None)


if __name__ == "__main__":
    unittest.main()
