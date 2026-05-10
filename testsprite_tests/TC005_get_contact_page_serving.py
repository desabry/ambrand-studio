import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

def test_get_contact_page_serving():
    url = f"{BASE_URL}/contact"
    headers = {
        # According to PRD, no authentication required for /contact
        # But instructions mention authType Bearer token, no token provided, so omit
        "Accept": "text/html"
    }
    try:
        response = requests.get(url, headers=headers, timeout=TIMEOUT)
        # Assert status code 200
        assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"

        content_type = response.headers.get("Content-Type", "")
        # Assert Content-Type includes text/html
        assert "text/html" in content_type, f"Expected 'text/html' in Content-Type but got {content_type}"

        # Assert the HTML page served is contact.html by checking for an indicative fragment
        # e.g. check for title or a unique string in contact.html page
        html_lower = response.text.lower()
        assert ("contact" in html_lower) or ("contact form" in html_lower), "Response body does not appear to contain contact page content"

    except requests.RequestException as e:
        assert False, f"Request to /contact failed: {e}"

test_get_contact_page_serving()