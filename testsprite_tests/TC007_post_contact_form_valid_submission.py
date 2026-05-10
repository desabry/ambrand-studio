import requests

BASE_URL = "http://localhost:3000"
API_CONTACT_ENDPOINT = "/api/contact"
AUTH_TOKEN = "Bearer your_valid_token_here"  # Replace with a real Bearer token if required

def test_post_contact_form_valid_submission():
    url = BASE_URL + API_CONTACT_ENDPOINT
    headers = {
        "Authorization": AUTH_TOKEN,
        "Content-Type": "application/json"
    }
    payload = {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "123-456-7890",
        "service": "Branding",
        "message": "Looking for branding services. Please contact me."
    }
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

    assert response.status_code == 200, f"Expected 200 OK, got {response.status_code}"
    json_data = response.json()
    assert "success" in json_data or "message" in json_data, "Response missing success indication"
    if "success" in json_data:
        assert json_data["success"] == True or str(json_data["success"]).lower() == "true", "Success field is not True"
    if "message" in json_data:
        assert "submit" in json_data["message"].lower() or "success" in json_data["message"].lower(), "Message does not confirm submission"

test_post_contact_form_valid_submission()