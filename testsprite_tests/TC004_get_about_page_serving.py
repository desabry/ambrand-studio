import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

def test_get_about_page_serving():
    url = f"{BASE_URL}/about"
    # No auth header required for this public route
    try:
        response = requests.get(url, timeout=TIMEOUT)
        assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
        content = response.text
        # Removed incorrect assertion about 'about.html' string in content
        # Basic check that the response contains keywords indicating the about page (e.g., "about", "studio", "team")
        assert any(
            kw in content.lower() for kw in ["about", "studio", "team", "branding"]
        ), "Response content does not appear to contain expected about page content"
    except requests.RequestException as e:
        assert False, f"Request to /about failed: {e}"

test_get_about_page_serving()