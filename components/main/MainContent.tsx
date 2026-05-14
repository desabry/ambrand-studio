"use client";

import { useEffect, useRef } from "react";

export function MainContent() {
  const scriptsLoaded = useRef(false);

  useEffect(() => {
    if (scriptsLoaded.current) return;
    scriptsLoaded.current = true;

    // Load scripts sequentially
    async function load() {
      const scripts = [
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2",
        "js/supabase-config.js",
        "js/text-letter-filler.js",
        "js/BlurText.js",
        "js/auth.js",
        "js/supabase-db.js",
        "js/seed-data.js",
        "js/TextPressureAdvanced.js",
      ];
      for (const src of scripts) {
        if (!document.querySelector(`script[src="${src}"]`)) {
          await new Promise<void>((res, rej) => {
            const s = document.createElement("script");
            s.src = src;
            s.onload = () => res();
            s.onerror = () => res(); // continue anyway
            document.body.appendChild(s);
          });
        }
      }

      // Now load main site scripts
      const mainScripts = [
        "js/script.js",
        "js/project-gallery.js",
      ];
      for (const src of mainScripts) {
        if (!document.querySelector(`script[src="${src}"]`)) {
          await new Promise<void>((res) => {
            const s = document.createElement("script");
            s.src = src;
            s.onload = () => res();
            s.onerror = () => res();
            document.body.appendChild(s);
          });
        }
      }

      // Init auth forms (DOMContentLoaded already fired, so manually init)
      if (typeof (window as any).initAuthForms === "function") {
        (window as any).initAuthForms();
      } else {
        initAuthFormsFallback();
      }

      // Init hero text pressure
      if (typeof (window as any).initTextPressure === "function") {
        (window as any).initTextPressure("hero-title-pressure", {
          text: "Let's Make WOW",
          flex: true,
          alpha: false,
          stroke: false,
          width: true,
          weight: true,
          italic: true,
          textColor: "#ffffff",
          strokeColor: "#5227FF",
          minFontSize: 36,
        });
      }

      // Check auth state
      if (typeof (window as any).checkAuthState === "function") {
        (window as any).checkAuthState();
      }

      // Init contact form
      initContactForm();

      // Init projects
      if (typeof (window as any).initializeApp === "function") {
        (window as any).initializeApp();
      } else if (typeof (window as any).loadProjectsFromDB === "function") {
        initProjects();
      }
    }
    load();
  }, []);

  async function initProjects() {
    const success = await (window as any).loadProjectsFromDB();
    if (success) {
      const grid = document.getElementById("projectGrid");
      if (grid && (window as any).projects?.length > 0) {
        grid.innerHTML = (window as any).projects
          .map(
            (p: any) => `
          <div class="gallery-item-minimal animate fade-in-up" data-category="${p.category?.toLowerCase() || ""}">
            <div class="gallery-image-wrapper">
              <img src="${p.cover || "https://via.placeholder.com/800x600"}" alt="${p.title}">
              <div class="eje-overlay">
                <span class="eje-category">${p.category || ""}</span>
                <h3 class="eje-title">${p.title}</h3>
              </div>
              <div class="card-glass-button">
                <a href="${p.url || "work-details.html"}" class="glass-btn">View Project</a>
              </div>
            </div>
          </div>`
          )
          .join("");
      }
    }
  }

  function initAuthFormsFallback() {
    const loginForm = document.getElementById("loginForm");
    if (loginForm && !(loginForm as any)._authBound) {
      (loginForm as any)._authBound = true;
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = (document.getElementById("loginEmail") as HTMLInputElement)?.value;
        const password = (document.getElementById("loginPassword") as HTMLInputElement)?.value;
        const result = await (window as any).signIn?.(email, password);
        if (result?.success) {
          (window as any).closeAuthModal?.();
          window.location.href = "/";
        } else {
          alert("Login failed: " + (result?.error || "Unknown error"));
        }
      });
    }
    const signupForm = document.getElementById("signupForm");
    if (signupForm && !(signupForm as any)._authBound) {
      (signupForm as any)._authBound = true;
      signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = (document.getElementById("signupName") as HTMLInputElement)?.value;
        const email = (document.getElementById("signupEmail") as HTMLInputElement)?.value;
        const password = (document.getElementById("signupPassword") as HTMLInputElement)?.value;
        const result = await (window as any).signUp?.(email, password, name);
        if (result?.success) {
          alert("Signup successful! Please check your email to verify your account.");
          (window as any).closeAuthModal?.();
        } else {
          alert("Signup failed: " + (result?.error || "Unknown error"));
        }
      });
    }
    if (typeof (window as any).switchToLogin !== "function") {
      (window as any).switchToLogin = function () {
        document.getElementById("signupForm")?.classList.add("hidden");
        document.getElementById("loginForm")?.classList.remove("hidden");
        document.getElementById("authTitle")!.textContent = "Login";
        document.getElementById("authSwitchText")!.innerHTML =
          'Don\'t have an account? <a href="#" onclick="switchToSignup()">Sign up</a>';
      };
    }
    if (typeof (window as any).switchToSignup !== "function") {
      (window as any).switchToSignup = function () {
        document.getElementById("loginForm")?.classList.add("hidden");
        document.getElementById("signupForm")?.classList.remove("hidden");
        document.getElementById("authTitle")!.textContent = "Sign Up";
        document.getElementById("authSwitchText")!.innerHTML =
          'Already have an account? <a href="#" onclick="switchToLogin()">Login</a>';
      };
    }
  }

  function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;
    const newForm = form.cloneNode(true) as HTMLFormElement;
    form.parentNode?.replaceChild(newForm, form);

    newForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = newForm.querySelector('button[type="submit"]') as HTMLButtonElement;
      const originalText = btn.textContent || "Send Message";
      btn.textContent = "Sending...";
      btn.disabled = true;

      const inputs = newForm.querySelectorAll("input, textarea");
      const msgData = {
        name: (inputs[0] as HTMLInputElement)?.value || "",
        email: (inputs[1] as HTMLInputElement)?.value || "",
        subject: (inputs[2] as HTMLInputElement)?.value || "",
        message: (inputs[3] as HTMLTextAreaElement)?.value || "",
      };

      try {
        const result = await (window as any).dbSendMessage(msgData);
        if (result?.success) {
          const toast = document.createElement("div");
          toast.id = "contact-toast";
          toast.innerHTML = `
            <div style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;
              display:flex;align-items:center;justify-content:center;
              background:#e31937;backdrop-filter:blur(8px);animation:fadeIn .3s ease">
              <div style="background:#1a1a2e;border:1px solid rgba(82,39,255,0.3);
                border-radius:16px;padding:40px;text-align:center;max-width:400px;box-shadow:0 20px 60px #e31937">
                <div style="width:64px;height:64px;border-radius:50%;
                  background:rgba(26,158,117,0.15);display:flex;align-items:center;justify-content:center;
                  margin:0 auto 20px;font-size:28px;color:#1a9e75">
                  <i class="fas fa-check-circle"></i>
                </div>
                <h3 style="color:#fff;font-size:20px;margin-bottom:8px">Message Sent!</h3>
                <p style="color:#9a9897;font-size:14px;line-height:1.6">
                  Thank you for reaching out! We'll get back to you soon.
                </p>
                <button onclick="this.closest('#contact-toast').remove()"
                  style="margin-top:20px;padding:10px 28px;border:none;background:#5227FF;
                  color:#fff;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600">
                  Got it!
                </button>
              </div>
            </div>`;
          document.body.appendChild(toast);
          newForm.reset();
        } else {
          alert("Failed to send message. Please try again.");
        }
      } catch {
        alert("Something went wrong. Please try again.");
      }

      btn.textContent = originalText;
      btn.disabled = false;
    });
  }

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="scroll-progress-bar"></div>

      {/* Scroll to Top */}
      <button id="scrollToTop" className="scroll-top" aria-label="Scroll to top">
        <i className="fas fa-angle-up"></i>
      </button>

      {/* Scroll Dot Navigation */}
      <nav className="scroll-dot-nav" id="scrollDotNav" aria-label="Page sections">
        {[
          { href: "#home", label: "Home" },
          { href: "#about", label: "About" },
          { href: "#services", label: "Services" },
          { href: "#works", label: "Portfolio" },
          { href: "#contact", label: "Contact" },
        ].map((item) => (
          <a key={item.href} href={item.href} className="dot-link active" data-section={item.href.slice(1)}>
            <span className="dot"></span>
            <span className="dot-label">{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Navbar */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-brand">
            <a href="#home" id="secretLogoTrigger">
              <img src="images/navbar-logo.png" alt="Ambrand Studio Logo" className="nav-logo" />
            </a>
          </div>
          <button className="menu-toggle" id="menuToggle" aria-label="Toggle navigation menu">
            <span></span><span></span><span></span>
          </button>
          <ul className="nav-menu" id="navMenu">
            <li><a href="#home" className="active nav-link">Home</a></li>
            <li><a href="#about" className="nav-link">About</a></li>
            <li><a href="#services" className="nav-link">Services</a></li>
            <li><a href="#works" className="nav-link">Works</a></li>
            <li><a href="#contact" className="nav-link">Contact</a></li>
            <li id="nav-login-item"><a href="#" onClick={() => (window as any).openAuthModal?.()} className="nav-link">Login</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="hero-section hero-section-custom">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        <div className="container">
          <h1 id="hero-title-pressure" className="blur-text-container text-2xl mb-8"></h1>
        </div>
      </section>




      {/* About */}
      <section id="about" className="about-section-new">
        <div className="container">
          <div className="about-hero">
            <div className="about-title-section">
              <h2 className="about-main-title">Why Us ??</h2>
            </div>
            <div className="about-content-grid">
              <div className="about-content-left">
                <div className="about-image animate slide-in-left">
                  <img src="images/about-astronauts.png" alt="Ambrand Team" />
                </div>
              </div>
              <div className="about-content-right animate slide-in-right">
                <div className="about-desc">
                  <p>We specialize in branding and development, delivering complete creative solutions that help businesses build strong, distinctive identities.</p>
                  <p>From strategy to execution, we turn ideas into clear visual systems that reflect your values and support your growth in the market.</p>
                  <p>Our services cover logo design, visual identity systems, brand strategy, and communication design. We work closely with our clients to understand their goals, then build solutions that are practical, scalable, and consistent across every touchpoint.</p>
                  <p>We believe a strong brand is not decoration — it's a business asset. That's why our focus is always on clarity, positioning, and long-term impact.</p>
                  <p>Our goal is simple: to be a reliable partner in building your brand and helping it stand out in a competitive market.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="services-section-new light-theme">
        <div className="container">
          <div className="services-header-new">
            <h2>Your brand like your<br />fingerprint. Let&apos;s Start.</h2>
          </div>
          <div className="services-grid-columns">
            {[
              {
                title: "Branding",
                items: ["Brand Strategy", "Logo Design", "Visual Identity", "Brand Guidelines"],
              },
              {
                title: "Digital",
                items: ["Web Design", "Web Development", "UX/UI Design"],
              },
              {
                title: "Motion",
                items: ["Motion Graphics", "Video Production", "Animations", "Branded Content"],
              },
              {
                title: "Strategy",
                items: ["Strategy", "Content Creation", "Community Management", "Advertising"],
              },
            ].map((col, i) => (
              <div key={col.title} className={`service-col animate fade-in-up ${i > 0 ? `delay-${i}00` : ""}`}>
                <h3>{col.title}</h3>
                <ul className="services-list">
                  {col.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Works / Portfolio */}
      <section id="works" className="works-gallery portfolio-refernce">
        <div className="container">
          <div className="section-header-works">
            <h2 className="section-title-minimal">OUR PORTFOLIO</h2>
            <div className="title-underline"></div>
          </div>
          <div className="filter-container animate fade-in-up">
            {[
              { filter: "all", label: "All" },
              { filter: "branding", label: "Brand Development" },
              { filter: "logo", label: "Logo Design" },
              { filter: "packaging", label: "Packaging Design" },
              { filter: "motion", label: "Motion Graphics" },
              { filter: "website", label: "Website Design" },
              { filter: "3d", label: "3D Design" },
            ].map((btn) => (
              <button
                key={btn.filter}
                className={`filter-btn${btn.filter === "all" ? " active" : ""}`}
                data-filter={btn.filter}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
        <div className="container-fluid portfolio-container">
          <div className="portfolio-grid" id="projectGrid">
            {/* Projects loaded dynamically by Supabase */}
          </div>
        </div>

      </section>
      {/* Services Marquee */}
      <div className="marquee-container">
        <div className="marquee-content">
          {["Branding", "Packaging", "Digital Design", "Motion Graphics", "3D Modeling", "UI/UX Design"].map((item) => (
            <div key={item} className="marquee-item">{item}</div>
          ))}
          {/* Duplicate for infinite loop */}
          {["Branding", "Packaging", "Digital Design", "Motion Graphics", "3D Modeling", "UI/UX Design"].map((item) => (
            <div key={`dup-${item}`} className="marquee-item">{item}</div>
          ))}
        </div>
      </div>
      {/* Testimonials */}
      <section className="clients-testimonials">
        <div className="container">
          <div className="testimonials-header-centered">
            <h2 className="section-title-large">Client Reviews</h2>
            <p className="section-description">
              We take pride in delivering exceptional results for our clients. Here is what they have to say about their
              experience working with Ambrand Studio.
            </p>
          </div>
          <div className="reviews-marquee">
            <div className="reviews-marquee-content">
              {testimonials.map((t, i) => (
                <div key={i} className="testimonial-card">
                  <div className="card-header">
                    <div className="client-portrait-wrapper">
                      <img src={t.img} alt={t.name} className="client-portrait grayscale" />
                    </div>
                    <div className="client-meta">
                      <h4>{t.name}</h4>
                      <span className="client-role">{t.role}</span>
                    </div>
                  </div>
                  <div className="card-divider"></div>
                  <p className="testimonial-text">{t.text}</p>
                  <div className="card-footer">
                    <span className="rating-number">5.0</span>
                    <div className="rating-stars">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Create Something Amazing?</h2>
          <p>Let&apos;s help you build a visual identity that stands out from the competition</p>
          <a href="#contact" className="btn btn-primary">Get Started Today</a>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="contact-section">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-grid">
            <div className="contact-info">
              <div className="info-box">
                <i className="fas fa-phone info-icon"></i>
                <div className="info-content">
                  <h3>Phone</h3>
                  <p>+20 (120) 2123 -666</p>
                </div>
              </div>
              <div className="info-box">
                <i className="fas fa-envelope info-icon"></i>
                <div className="info-content">
                  <h3>Email</h3>
                  <p>ambrandstudio@hotmail.com</p>
                </div>
              </div>
            </div>
            <form className="contact-form" id="contactForm">
              <div className="form-group">
                <input type="text" placeholder="Your Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email" required />
              </div>
              <div className="form-group">
                <input type="text" placeholder="Subject" />
              </div>
              <div className="form-group">
                <textarea placeholder="Your Message" rows={5} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        {/* Logo Loop */}
        <section className="logo-loop-section">
          <div className="container">
            <div className="logo-loop-container">
              <div className="logo-loop-track">
                {logos.map((logo, i) => (
                  <div key={i} className="logo-item-wrapper">
                    <img src={logo.src} alt={logo.alt} />
                  </div>
                ))}
                {/* Duplicate for infinite loop */}
                {logos.map((logo, i) => (
                  <div key={`dup-${i}`} className="logo-item-wrapper">
                    <img src={logo.src} alt={logo.alt} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="container">
          <a href="#home">
            <img src="images/navbar-logo.png" alt="Ambrand Studio Logo" className="footer-logo-img" />
          </a>
          <div className="footer-socials">
            {["facebook", "instagram", "twitter", "linkedin"].map((s) => (
              <a key={s} href="#" title={s.charAt(0).toUpperCase() + s.slice(1)} aria-label={`Visit our ${s} page`}>
                <i className={`fab fa-${s}`}></i>
              </a>
            ))}
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Ambrand Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <div id="authModal" className="auth-modal hidden">
        <div className="auth-modal-content">
          <div className="auth-modal-header">
            <h2 id="authTitle">Login</h2>
            <button className="auth-close-btn" onClick={() => (window as any).closeAuthModal?.()}>&times;</button>
          </div>
          <form id="loginForm" className="auth-form">
            <div className="form-group">
              <label htmlFor="loginEmail">Email</label>
              <input type="email" id="loginEmail" required />
            </div>
            <div className="form-group">
              <label htmlFor="loginPassword">Password</label>
              <input type="password" id="loginPassword" required />
            </div>
            <button type="submit" className="auth-btn">Login</button>
          </form>
          <form id="signupForm" className="auth-form hidden">
            <div className="form-group">
              <label htmlFor="signupName">Full Name</label>
              <input type="text" id="signupName" required />
            </div>
            <div className="form-group">
              <label htmlFor="signupEmail">Email</label>
              <input type="email" id="signupEmail" required />
            </div>
            <div className="form-group">
              <label htmlFor="signupPassword">Password</label>
              <input type="password" id="signupPassword" required minLength={6} />
            </div>
            <button type="submit" className="auth-btn">Sign Up</button>
          </form>
          <div className="auth-switch">
            <p id="authSwitchText">
              Don&apos;t have an account?{" "}
              <a href="#" onClick={() => (window as any).switchToSignup?.()}>
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

const logos = [
  { src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg", alt: "Amazon" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", alt: "Google" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", alt: "Microsoft" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", alt: "Netflix" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg", alt: "IBM" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg", alt: "Slack" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg", alt: "Spotify" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg", alt: "Tesla" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/5/58/Uber_logo_2018.svg", alt: "Uber" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg", alt: "Airbnb" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png", alt: "Tesla" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/9/96/Instagram.svg", alt: "Instagram" },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CEO, TechStart Solutions",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    text: "Ambrand Studio transformed our brand completely. Their attention to detail and creative approach resulted in a stunning visual identity.",
  },
  {
    name: "Michael Brown",
    role: "Founder, Luxury Hotels",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    text: "They understood our vision immediately and delivered results that exceeded our expectations. Highly recommended!",
  },
  {
    name: "Emma Wilson",
    role: "Marketing Director",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    text: "Professional, creative, and delivers quality work on time. They're now our go-to agency for all design needs.",
  },
];
