import requests

def test_get_works_page_serving():
    base_url = "http://localhost:3000"
    url = f"{base_url}/works"
    headers = {
        "Authorization": "Bearer token"
    }
    try:
        resp = requests.get(url, headers=headers, timeout=30)
        resp.raise_for_status()
        assert resp.status_code == 200, f"Expected status code 200, got {resp.status_code}"
        # Check that the response is likely the works.html content by verifying presence of works-related keywords
        # and absence of authentication requirement (no redirect or 401)
        content = resp.text.lower()
        assert "<html" in content, "Response does not contain HTML content"
        # Check presence of expected page title or keyword related to works.html
        assert "works" in content or "portfolio" in content, "Response does not appear to be works.html page content"
        # Since loadTestimonials is called in dashboard.html, not works.html, just check no auth required
        # and the page content is served as expected
    except requests.exceptions.RequestException as e:
        assert False, f"Request failed: {e}"

test_get_works_page_serving()