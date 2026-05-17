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
          <div class="gallery-item-minimal animate fade-in-up" data-category="${p.category?.toLowerCase() || ""}" data-slug="${(p.url || p.title || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}" style="cursor:pointer">
            <div class="gallery-image-wrapper" onclick="window.location.href='${p.url || `/work/${(p.title || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`}'">
              <img src="${p.cover || "https://via.placeholder.com/800x600"}" alt="${p.title}" style="pointer-events:none">
              <div class="eje-overlay" style="pointer-events:none">
                <span class="eje-category">${p.category || ""}</span>
                <h3 class="eje-title">${p.title}</h3>
              </div>
              <div class="card-glass-button" style="pointer-events:none">
                <span class="glass-btn">View Project</span>
              </div>
            </div>
          </div>`
          )
          .join("");

        // Apply active filter to new items
        const activeBtn = document.querySelector(".filter-btn.active");
        if (activeBtn && typeof (window as any).applyFilter === "function") {
          (window as any).applyFilter(activeBtn.getAttribute("data-filter"));
        }
      }
    }
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
        {/* Services Marquee — full width */}
        <div className="marquee-container">
          <div className="marquee-content">
            {["Branding", "Packaging", "Digital Design", "Motion Graphics", "3D Modeling", "UI/UX Design"].map((item) => (
              <div key={item} className="marquee-item">{item}</div>
            ))}
            {["Branding", "Packaging", "Digital Design", "Motion Graphics", "3D Modeling", "UI/UX Design"].map((item) => (
              <div key={`dup-${item}`} className="marquee-item">{item}</div>
            ))}
          </div>
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
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Create Something Amazing?</h2>
          <p>Let&apos;s help you build a visual identity that stands out from the competition</p>

        </div>
      </section>

      <footer id="contact" style={{ minHeight: 0, background: '#b81d28', color: 'white', position: 'relative', overflow: 'hidden' }} className="py-20">
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 25%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.5) 75%, transparent 100%)' }} />
        <div className="max-w-6xl mx-auto px-6">

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 lg:gap-16">

            <div className="relative">
              <img
                src="/images/navbar-logo.png"
                alt="Ambrand Studio"
                className="h-32 w-auto"
              />
            </div>

            <div className="md:border-l md:border-white/10 md:pl-12 lg:pl-16">
              <h3 className="text-white font-bold text-sm uppercase tracking-[0.15em] mb-6">Pages</h3>
              <ul className="space-y-3">
                {["Home", "About Us", "Services", "Portfolio", "Blog"].map((page) => (
                  <li key={page}>
                    <a
                      href="#"
                      className="text-white/60 text-sm hover:text-white transition-all duration-300 group inline-flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white/0 group-hover:bg-white transition-all duration-300" />
                      <span>{page}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:border-l md:border-white/10 md:pl-12 lg:pl-16">
              <h3 className="text-white font-bold text-sm uppercase tracking-[0.15em] mb-6">Follow Us</h3>
              <div className="flex gap-3">
                {[
                  { icon: "fab fa-twitter", label: "X" },
                  { icon: "fab fa-facebook", label: "Facebook" },
                  { icon: "fab fa-instagram", label: "Instagram" },
                  { icon: "fab fa-behance", label: "Behance" },
                  { icon: "fab fa-linkedin", label: "LinkedIn" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    title={s.label}
                    aria-label={s.label}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/80 hover:bg-white hover:text-[#b81d28] hover:border-white transition-all duration-300"
                  >
                    <i className={`${s.icon} text-center`}></i>
                  </a>
                ))}
              </div>
            </div>

          </div>

          <div className="border-t border-white/10 mt-14 pt-7">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-white/40">
                &copy; 2026 Ambrand Studio. All Rights Reserved.
              </p>
              <a
                href="#home"
                className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:text-white hover:border-white/50 hover:bg-white/10 transition-all duration-300"
                aria-label="Scroll to top"
              >
                <i className="fas fa-angle-up text-xs"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>


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
