# TestSprite AI Testing Report (MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** Ambrand Studio Site
- **Date:** 2026-05-08
- **Prepared by:** Antigravity AI
- **Test Scope:** Frontend Route Serving and Basic API Endpoints

---

## 2️⃣ Requirement Validation Summary

### Requirement: Static Page Serving
Validates that core website pages are correctly served by the Express backend.

#### Test TC001 get_homepage_serving
- **Status:** ✅ Passed
- **Analysis / Findings:** Homepage (index.html) is correctly served at the root route.

#### Test TC002 get_services_page_serving
- **Status:** ❌ Failed
- **Analysis / Findings:** Received 404. The file `services.html` is missing from the repository, but the route is defined in `server.js`.

#### Test TC003 get_works_page_serving
- **Status:** ✅ Passed
- **Analysis / Findings:** Portfolio page (works.html) is correctly served.

#### Test TC004 get_about_page_serving
- **Status:** ✅ Passed
- **Analysis / Findings:** About page (about.html) is correctly served.

#### Test TC005 get_contact_page_serving
- **Status:** ❌ Failed
- **Analysis / Findings:** Received 404. The file `contact.html` is missing from the repository, but the route is defined in `server.js`.

#### Test TC006 get_dashboard_page_serving
- **Status:** ❌ Failed
- **Analysis / Findings:** Received 404. `server.js` attempts to serve `admin.html`, which does not exist. The actual dashboard file is named `dashboard.html`.

### Requirement: API Form Submissions
Validates that contact and newsletter forms correctly handle data and return appropriate status codes.

#### Test TC007 post_contact_form_valid_submission
- **Status:** ✅ Passed
- **Analysis / Findings:** Valid contact form submissions are processed correctly (200 OK).

#### Test TC008 post_contact_form_invalid_submission
- **Status:** ❌ Failed
- **Analysis / Findings:** Received 200 OK for an invalid submission (missing service). The backend validation in `server.js` is not strict enough.

#### Test TC009 post_newsletter_valid_subscription
- **Status:** ✅ Passed
- **Analysis / Findings:** Valid newsletter subscriptions are processed correctly.

#### Test TC010 post_newsletter_invalid_subscription
- **Status:** ✅ Passed
- **Analysis / Findings:** Invalid newsletter subscriptions (invalid email) are correctly rejected with 400 Bad Request.

---

## 3️⃣ Coverage & Matching Metrics

- **60%** of tests passed (6/10)

| Requirement Group       | Total Tests | ✅ Passed | ❌ Failed  |
|-------------------------|-------------|-----------|------------|
| Static Page Serving     | 6           | 3         | 3          |
| API Form Submissions    | 4           | 3         | 1          |

---

## 4️⃣ Key Gaps / Risks

- **Critical Bug**: The admin dashboard is inaccessible via the `/dashboard` route due to a file name mismatch in `server.js` (`admin.html` vs `dashboard.html`).
- **Missing Files**: `services.html` and `contact.html` are missing from the project, causing 404 errors for visitors.
- **Incomplete Feature**: The `loadTestimonials` function is called in the dashboard but is not implemented in the JS files.
- **Security/Validation Risk**: Contact form validation is insufficient, allowing submissions with missing optional fields that might be required for business logic.
- **Database Schema Mismatch**: The dashboard calls `loadTestimonials`, but the JS code to fetch from the `testimonials` table (defined in the schema) is missing.
