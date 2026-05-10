import requests

BASE_URL = "http://localhost:3000"
NEWSLETTER_ENDPOINT = f"{BASE_URL}/api/newsletter"
TIMEOUT = 30
AUTH_TOKEN = "Bearer token"  # Replace with a valid token if needed

def test_post_newsletter_invalid_subscription():
    headers = {
        "Authorization": AUTH_TOKEN,
        "Content-Type": "application/json"
    }

    test_payloads = [
        {},  # missing email field
        {"email": ""},  # empty email field
        {"email": "invalid-email-format"},  # invalid email format
    ]

    for payload in test_payloads:
        try:
            response = requests.post(NEWSLETTER_ENDPOINT, json=payload, headers=headers, timeout=TIMEOUT)
        except requests.RequestException as e:
            assert False, f"Request failed: {e}"

        assert response.status_code == 400, f"Expected 400, got {response.status_code} for payload {payload}"
        try:
            data = response.json()
        except ValueError:
            assert False, "Response is not valid JSON"

        assert "error" in data or "message" in data, f"Response JSON does not contain error or message for payload {payload}"

        error_msg = data.get("error") or data.get("message")
        # Updated to check Arabic string to match returned error message
        assert "البريد" in error_msg, f"Error message does not indicate email validation issue: {error_msg}"

test_post_newsletter_invalid_subscription()
