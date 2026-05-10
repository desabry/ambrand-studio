import requests

BASE_URL = "http://localhost:3000"
API_CONTACT_ENDPOINT = f"{BASE_URL}/api/contact"
AUTH_TOKEN = "your_valid_bearer_token_here"  # Replace with a valid token if needed

def post_contact_form_invalid_submission():
    headers = {
        "Authorization": f"Bearer {AUTH_TOKEN}",
        "Content-Type": "application/json"
    }
    # Prepare invalid payloads with missing or invalid fields
    invalid_payloads = [
        {},  # completely empty
        {"name": "", "email": "", "phone": "", "service": "", "message": ""},  # all empty strings
        {"name": "John", "email": "invalid-email", "phone": "123456", "service": "branding", "message": "Hello"},  # invalid email
        {"name": "John", "email": "john@example.com"},  # missing required fields
        {"email": "john@example.com", "phone": "phone-number", "service": "branding", "message": "Hello"},  # missing name & invalid phone format
    ]

    for payload in invalid_payloads:
        try:
            response = requests.post(API_CONTACT_ENDPOINT, json=payload, headers=headers, timeout=30)
        except requests.RequestException as e:
            assert False, f"Request failed with exception: {e}"

        assert response.status_code == 400, f"Expected 400 status code but got {response.status_code} for payload: {payload}"
        try:
            json_resp = response.json()
        except ValueError:
            assert False, "Response is not valid JSON."

        # Check that error message explaining validation failure exists
        error_msg = json_resp.get("error") or json_resp.get("message") or json_resp.get("errors")
        assert error_msg is not None, f"Expected error message in response JSON for payload: {payload}"

post_contact_form_invalid_submission()