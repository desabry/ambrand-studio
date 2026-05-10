/**
 * TextPressure effect ported to Vanilla JavaScript.
 * Based on https://codepen.io/JuanFuentes/full/rgXKGQ
 * Uses variable fonts to create a "pressure" effect based on mouse distance.
 */

class TextPressure {
    constructor(element, options = {}) {
        if (!element) return;
        this.container = element;
        this.text = options.text || "Let's Make WOW ...";
        this.config = {
            minFontSize: options.minFontSize || 36,
            textColor: options.textColor || "#ffffff",
            strokeColor: options.strokeColor || "#5227FF",
            stroke: options.stroke || false,
            weight: options.weight !== undefined ? options.weight : true,
            width: options.width !== undefined ? options.width : true,
            italic: options.italic || false,
            alpha: options.alpha || false,
            flex: options.flex || false,
            maxDist: options.maxDist || 300,
            ...options
        };

        this.chars = [];
        this.rafId = null;
        this.mousePos = { x: -1000, y: -1000 };
        this.init();
    }

    init() {
        // Clear container
        this.container.innerHTML = '';
        
        // Setup container styles
        this.container.style.display = 'flex';
        this.container.style.flexWrap = 'wrap';
        this.container.style.justifyContent = 'center';
        this.container.style.alignItems = 'center';
        this.container.style.color = this.config.textColor;
        this.container.style.fontSize = `clamp(${this.config.minFontSize}px, 15vw, 400px)`;
        this.container.style.fontFamily = "'Roboto Flex', sans-serif";
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.userSelect = 'none';
        this.container.style.lineHeight = '1';

        // Create spans for each character
        const textArray = this.text.split('');
        textArray.forEach(char => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.transition = 'font-weight 0.15s ease-out, font-stretch 0.15s ease-out, opacity 0.15s ease-out';
            span.style.willChange = 'font-weight, font-stretch, opacity';
            
            if (this.config.stroke) {
                span.style.webkitTextStroke = `1px ${this.config.strokeColor}`;
                span.style.color = 'transparent';
            }
            
            if (this.config.italic) {
                span.style.fontStyle = 'italic';
            }
            
            this.container.appendChild(span);
            this.chars.push(span);
        });

        // Event Listeners
        window.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
            this.update();
        });

        window.addEventListener('touchstart', (e) => {
            if (e.touches.length > 0) {
                this.mousePos.x = e.touches[0].clientX;
                this.mousePos.y = e.touches[0].clientY;
                this.update();
            }
        });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                this.mousePos.x = e.touches[0].clientX;
                this.mousePos.y = e.touches[0].clientY;
                this.update();
            }
        });
        
        // Initial state
        this.update();
    }

    update() {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        
        this.rafId = requestAnimationFrame(() => {
            this.chars.forEach(span => {
                const rect = span.getBoundingClientRect();
                const charX = rect.left + rect.width / 2;
                const charY = rect.top + rect.height / 2;

                const dist = Math.sqrt(Math.pow(this.mousePos.x - charX, 2) + Math.pow(this.mousePos.y - charY, 2));
                const power = Math.pow(Math.max(0, 1 - dist / this.config.maxDist), 2); // Squared for more "pressure" feel

                if (this.config.weight) {
                    const weight = 100 + (power * 900); // 100 to 1000
                    span.style.fontWeight = weight;
                }

                if (this.config.width) {
                    const width = 25 + (power * 125); // 25% to 150% (wdth axis)
                    span.style.fontStretch = `${width}%`;
                }

                if (this.config.alpha) {
                    span.style.opacity = 0.3 + (power * 0.7);
                }
            });
        });
    }
}

// Global initialization helper
window.initTextPressure = function(containerId, options) {
    const container = document.getElementById(containerId);
    if (container) {
        return new TextPressure(container, options);
    }
    return null;
};
