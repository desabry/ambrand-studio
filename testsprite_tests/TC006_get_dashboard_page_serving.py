import requests

def test_get_dashboard_page_serving():
    base_url = "http://localhost:3000"
    url = f"{base_url}/dashboard"
    headers = {
        "Authorization": "Bearer dummy_token"
    }
    try:
        response = requests.get(url, headers=headers, timeout=30)
        # Assert status code is 200
        assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
        # Assert the content served is the dashboard page (dashboard.html expects certain text)
        content = response.text
        assert "dashboard.html" in content or "<html" in content.lower(), "Response does not contain expected dashboard HTML content"
        # Basic check for testimonial related text to verify loading of testimonials script reference or placeholder
        assert ("testimonials" in content.lower() or "loadTestimonials" in content), "Testimonials or testimonials loader not found in dashboard page content"
    except requests.RequestException as e:
        assert False, f"Request to /dashboard failed: {e}"

test_get_dashboard_page_serving()