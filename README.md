# Ambrand Studio - Landing Page

Professional landing page for Ambrand Studio, a branding and design agency specializing in visual identity and brand development.

## 🌟 Key Features

✅ **Single Page Landing Site** - Complete website in one seamless page
✅ **Smooth Navigation** - Click navigation links to smoothly scroll to sections
✅ **Responsive Design** - Works perfectly on all devices (mobile, tablet, desktop)
✅ **Interactive Animations** - Elements fade, zoom, and slide as you scroll for a polished look
✅ **Complete Portfolio** - 9 real projects with filtering capabilities and realistic placeholder images from Unsplash (as sourced via Google searches)
✅ **Services Section** - 12 detailed services with descriptions
✅ **Team Showcase** - Meet our creative team
✅ **Client Testimonials** - Real feedback from satisfied clients
✅ **FAQ Section** - Common questions answered
✅ **Contact Form** - Easy way to reach out
✅ **Professional Design** - Modern UI with smooth animations

## 📋 Page Sections

1. **Hero** - Eye-catching introduction with call-to-action
2. **Services** - Featured services and detailed service list (12 services)
3. **Portfolio** - Gallery of 9 projects with category filtering
4. **About** - Company information and team members
5. **Testimonials** - Client success stories
6. **Statistics** - Key metrics and achievements
7. **Logo Showcase** - Gallery of 12 logo designs
8. **FAQ** - Frequently asked questions
9. **Contact** - Contact form and information
10. **Footer** - Quick links and company info

## 🛠️ Technical Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Styling:** Custom CSS with Flexbox & Grid
- **Icons:** Font Awesome 6.4.0
- **Backend:** Node.js + Express (optional API)
- **Design:** Mobile-first responsive approach
- **Colors:** 
  - Primary: #1a1a1a (Black)
  - Accent: #d4af37 (Gold)
  - Light: #f5f5f5 (Light Gray)

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Visit in browser
http://localhost:3000
```

### File Structure

```
ambrand-studio/
├── index.html                 # Main landing page (all sections)
├── css/
│   └── styles.css            # All styling (2000+ lines)
├── js/
│   └── script.js             # Functionality (smooth scroll, filters, etc)
├── images/
│   ├── work-1.jpg to work-9.jpg   # Portfolio projects
│   ├── logo-1.jpg to logo-12.jpg  # Logo showcase
│   ├── team-1.jpg to team-6.jpg   # Team members
│   └── ... (other images)
├── server.js                  # Node.js backend (optional)
├── package.json               # Dependencies
└── README.md                 # This file
```

## 📝 Customization

### Changing Colors

Edit the CSS variables in `css/styles.css`:

```css
:root {
    --primary-color: #1a1a1a;      /* Main black */
    --secondary-color: #d4af37;    /* Gold accent */
    --accent-color: #f5f5f5;       /* Light gray */
}
```

### Adding a New Project

1. Add your project image to the `images/` folder
2. Scroll to the Portfolio section in `index.html`
3. Add a new gallery-item:

```html
<div class="gallery-item" data-category="brand">
    <div class="gallery-image">
        <img src="images/work-10.jpg" alt="Project Name">
        <div class="gallery-overlay">
            <h3>Your Project Name</h3>
            <span class="category-badge">Category</span>
            <a href="#" class="view-btn">View Details</a>
        </div>
    </div>
</div>
```

### Navigation Links

All navigation uses anchor links (`#services`, `#works`, `#contact`, etc.). Smooth scrolling is automatic!

```html
<a href="#services">Services</a>  <!-- Scrolls to Services section -->
<a href="#contact">Contact</a>    <!-- Scrolls to Contact section -->
```

## 📊 Features Breakdown

### Smooth Scroll Navigation
- Click any nav link to smoothly scroll to that section
- Active nav links highlight as you scroll

### Project Filtering
- Filter portfolio by category (All, Brand, Logo, Packaging, etc.)
- Dynamic filtering with smooth transitions

### Responsive Mobile Menu
- Hamburger menu on mobile devices
- Auto-closes when clicking a link

### Contact Form
- Functional form with validation
- Ready for backend integration

### FAQ Section
- Common questions with answers
- Can be made collapsible with CSS

## 🎨 Design Features

- Professional color scheme with gold accents
- Smooth animations and transitions
- Card-based layouts for better organization
- Grid layouts for responsive design
- Font Awesome icons throughout
- Custom hover effects

## 📱 Responsive Breakpoints

- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: Below 768px

## 🔗 Navigation Links

All navigation is internal with anchor links:
- `#home` - Hero section
- `#services` - Services sections
- `#works` - Portfolio/Works
- `#about` - About & Team
- `#contact` - Contact form

## 📧 Contact Information

**Email:** info@ambrand.studio  
**Phone:** +1 (555) 123-4567  
**Address:** 123 Design Street, Creative City, CD 12345

## 🔄 Future Enhancements

- [ ] Add backend API for contact form
- [ ] Integrate email notifications
- [ ] Add project detail pages
- [ ] Implement blog section
- [ ] Add live chat support
- [ ] SEO optimization
- [ ] Analytics integration
- [ ] Dark mode toggle

## 💡 Tips

- Replace placeholder images with real photography
- Update contact information with actual details
- Customize team member information
- Add real client testimonials
- Update service descriptions as needed
- Add actual project details/links

## 📄 License

© 2026 Ambrand Studio. All rights reserved.

---

**Built with ❤️ for creative agencies and design studios**
