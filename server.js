const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const validator = require('validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));


// Routes
// Home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Services page
app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'services.html'));
});

// Works page
app.get('/works', (req, res) => {
    res.sendFile(path.join(__dirname, 'works.html'));
});

// Community page
app.get('/community', (req, res) => {
    res.sendFile(path.join(__dirname, 'community.html'));
});

// Logo Gallery page
app.get('/logo-gallery', (req, res) => {
    res.sendFile(path.join(__dirname, 'logo-gallery.html'));
});

// Clients page
app.get('/clients', (req, res) => {
    res.sendFile(path.join(__dirname, 'clients.html'));
});

// About page
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

// Admin Dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Auth page
app.get('/auth', (req, res) => {
    res.sendFile(path.join(__dirname, 'auth.html'));
});

// Work Details page
app.get('/work-details', (req, res) => {
    res.sendFile(path.join(__dirname, 'work-details.html'));
});

// Contact page
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

// API endpoint for contact form submission
app.post('/api/contact', (req, res) => {
    const { name, email, phone, service, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // كمل البروسيس الطبيعي
    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send confirmation email to user

    console.log('New Contact Form Submission:', {
        name,
        email,
        phone,
        service,
        message,
        timestamp: new Date()
    });

    return res.status(200).json({ message: 'Success' });
});

// API endpoint for newsletter subscription
app.post('/api/newsletter', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'البريد الإلكتروني مطلوب'
        });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({
            success: false,
            message: 'البريد الإلكتروني غير صالح'
        });
    }

    console.log('New Newsletter Subscription:', {
        email,
        timestamp: new Date()
    });

    res.json({
        success: true,
        message: 'تم اشتراكك بنجاح في نشرتنا البريدية'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Ambrand Studio server is running on http://localhost:${PORT}`);
    console.log(`📧 Ready to accept contact form submissions`);
});
