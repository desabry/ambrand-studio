import requests

BASE_URL = "http://localhost:3000"
API_ENDPOINT = "/api/newsletter"
AUTH_TOKEN = "your_valid_bearer_token_here"  # Replace with a valid token if required

def test_post_newsletter_valid_subscription():
    url = BASE_URL + API_ENDPOINT
    headers = {
        "Authorization": f"Bearer {AUTH_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "email": "user@example.com"
    }
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
        json_response = response.json()
        assert "success" in json_response or "message" in json_response, "Response JSON should indicate success or have a message"
        # You can adjust the key checks below based on actual API success response structure
        if "success" in json_response:
            assert json_response["success"] is True or json_response["success"] == "subscribed", \
                "Subscription success confirmation missing or not true"
        elif "message" in json_response:
            assert "subscribed" in json_response["message"].lower(), \
                "Success message does not confirm subscription"
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"
    except ValueError:
        assert False, "Response is not valid JSON"

# Run the test function
test_post_newsletter_valid_subscription()