import unittest
from uuid import uuid4

from app.schemas.item import ItemListResponse, ItemResponse


class ItemLocationResponseTests(unittest.TestCase):
    def test_list_contains_decoded_location_and_preserves_original_code(self):
        item = ItemResponse(id=uuid4(), user_id=uuid4(), serie_number="SN-001",
                            location="0106100810", insertion_date="2026-11-03")
        result = ItemListResponse(items=[item], total=1, page=1, page_size=20).model_dump(mode="json")
        self.assertEqual(result["items"][0]["location"], "0106100810")
        self.assertEqual(result["items"][0]["location_details"], {
            "zone": "01", "alee": "06", "rack": "10", "travee": "08", "niveau": "1",
        })


if __name__ == "__main__":
    unittest.main()
