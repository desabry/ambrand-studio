import sys
import re

file_path = r'g:\ambrand\Site\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix navbar and add Hero Section
navbar_regex = r'(<a href=\"#contact\" class=\"btn-nav-glass\">Get Started</a>\s*</div>)'
navbar_replacement = r'''\1
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero-section" style="padding-top: 150px; padding-bottom: 80px; text-align: center; min-height: 80vh; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -20%; left: -10%; width: 50%; height: 50%; background: radial-gradient(circle, rgba(138,43,226,0.15) 0%, transparent 70%); filter: blur(60px); z-index: -1;"></div>
        <div style="position: absolute; bottom: -20%; right: -10%; width: 60%; height: 60%; background: radial-gradient(circle, rgba(65,105,225,0.1) 0%, transparent 70%); filter: blur(60px); z-index: -1;"></div>
        <div class="container">
            <h1 class="hero-title" style="font-size: clamp(3rem, 8vw, 7rem); text-transform: uppercase; font-weight: 800; line-height: 1; letter-spacing: -1px; margin-bottom: 2rem;">
                <span style="color: #fff; display: block; margin-bottom: 0.2em;">Let's Make</span>
                <span style="color: transparent; -webkit-text-stroke: 2px #b088f9; text-stroke: 2px #b088f9; display: block; filter: drop-shadow(0 0 15px rgba(176,136,249,0.3));">WOW ...</span>
            </h1>
        </div>
    </section>'''

if 'id="home"' not in content:
    content = re.sub(navbar_regex, navbar_replacement, content, count=1)

# Update about text
about_text_old = r'<p>Ambrand Studio is more than just a creative agency. We are a team of passionate individuals dedicated to crafting exceptional visual identities that stand the test of time.</p>\s*<p>Our approach combines strategic thinking with creative excellence, ensuring that every project we undertake not only looks beautiful but also achieves its business objectives.</p>'

about_text_new = '''<p>We specialize in branding and development, delivering complete creative solutions that help businesses build strong, distinctive identities.</p>
                        <p>From strategy to execution, we turn ideas into clear visual systems that reflect your values and support your growth in the market.</p>
                        <p>Our services cover logo design, visual identity systems, brand strategy, and communication design. We work closely with our clients to understand their goals, then build solutions that are practical, scalable, and consistent across every touchpoint.</p>
                        <p>We believe a strong brand is not decoration — it’s a business asset. That’s why our focus is always on clarity, positioning, and long-term impact.</p>
                        <p>Our goal is simple: to be a reliable partner in building your brand and helping it stand out in a competitive market.</p>'''

content = re.sub(about_text_old, about_text_new, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')
