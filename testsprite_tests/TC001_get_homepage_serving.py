import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

def test_get_homepage_serving():
    url = f"{BASE_URL}/"
    headers = {
        "Authorization": "Bearer dummy_token"
    }
    try:
        response = requests.get(url, headers=headers, timeout=TIMEOUT)
        assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
        content_type = response.headers.get("Content-Type", "")
        assert "text/html" in content_type, f"Expected Content-Type to include 'text/html', got '{content_type}'"
        # Check that index.html is served by verifying the presence of common homepage markers
        content = response.text
        assert "<html" in content.lower(), "Response does not contain HTML"
        assert "index.html" not in content.lower(), "Response body should be rendered HTML, not a filename reference"
        # Specifically check for testimonials loading script or mention since loadTestimonials may be missing
        # It may not be present, so we do not assert failure but log if missing 
        testimonials_marker = "loadTestimonials"
        # If loadTestimonials is missing, note but do not fail test as per instructions
        if testimonials_marker not in content:
            print("Warning: 'loadTestimonials' function reference not found in homepage HTML. This may affect testimonials loading.")
    except requests.RequestException as e:
        assert False, f"HTTP request failed: {e}"

test_get_homepage_serving()