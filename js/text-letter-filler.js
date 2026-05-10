// =====================
// Text Letter Filler - Framer Inspired
// =====================

class TextLetterFiller {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            text: "Let's Make WOW ...",
            fontSize: 80,
            textAlign: 'center',
            preset: 'custom',
            colors: {
                fillColor: '#FFFFFF',
                outlineColor: 'rgba(255, 255, 255, 0.35)',
                glowColor: '#FFFFFF'
            },
            strokeGlow: {
                strokeWidth: 1.5,
                glow: false
            },
            animation: {
                trigger: 'onView',
                direction: 'ltr',
                staggerDelay: 0.07,
                fillDuration: 0.6,
                loopPause: 2
            },
            glowRadius: 8,
            hoverEffect: 'none',
            ...options
        };
        
        this.characters = [];
        this.filledSet = new Set();
        this.isInView = false;
        this.animationKey = 0;
        this.timerRefs = [];
        
        this.init();
    }
    
    init() {
        if (!this.container) {
            console.error('TextLetterFiller: Container not found');
            return;
        }
        
        this.setupText();
        this.bindEvents();
        this.startAnimation();
    }
    
    setupText() {
        this.characters = this.options.text.split('');
        this.render();
    }
    
    getStaggerOrder() {
        const len = this.characters.length;
        switch (this.options.animation.direction) {
            case 'rtl':
                return Array.from({length: len}, (_, i) => len - 1 - i);
            case 'random':
                return this.shuffleIndices(len);
            default:
                return Array.from({length: len}, (_, i) => i);
        }
    }
    
    shuffleIndices(length) {
        const indices = Array.from({length}, (_, i) => i);
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        return indices;
    }
    
    clearTimers() {
        this.timerRefs.forEach(clearTimeout);
        this.timerRefs = [];
    }
    
    runFillSequence() {
        this.clearTimers();
        this.filledSet.clear();
        
        const staggerOrder = this.getStaggerOrder();
        const { staggerDelay, fillDuration } = this.options.animation;
        
        staggerOrder.forEach((charIndex, orderIndex) => {
            const delay = orderIndex * staggerDelay * 1000;
            const timer = setTimeout(() => {
                this.filledSet.add(charIndex);
                this.updateCharFill(charIndex, true);
            }, delay);
            this.timerRefs.push(timer);
        });
        
        return staggerOrder.length * staggerDelay * 1000 + fillDuration * 1000;
    }
    
    resetAnimation() {
        this.clearTimers();
        this.filledSet.clear();
        this.render();
    }
    
    updateCharFill(charIndex, filled) {
        const charElement = this.container.querySelector(`[data-char-index="${charIndex}"]`);
        if (charElement) {
            if (filled) {
                charElement.classList.add('filled');
            } else {
                charElement.classList.remove('filled');
            }
        }
    }
    
    render() {
        const { fontSize, textAlign, preset, colors, strokeGlow, glowRadius } = this.options;
        const justifyContent = textAlign === 'left' ? 'flex-start' : 
                          textAlign === 'right' ? 'flex-end' : 'center';
        
        this.container.className = `text-letter-filler-container preset-${preset}`;
        this.container.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            justify-content: ${justifyContent};
            align-items: center;
            width: 100%;
            position: relative;
            overflow: visible;
            cursor: default;
            isolation: isolate;
        `;
        
        this.container.innerHTML = this.characters.map((char, i) => {
            const isSpace = char === ' ';
            if (isSpace) {
                return `<span class="text-letter-space" style="display: inline-block; width: ${fontSize * 0.3}px;"></span>`;
            }
            
            const filled = this.filledSet.has(i);
            return `
                <span class="text-letter ${filled ? 'filled animate-in' : ''}" 
                      data-char-index="${i}"
                      style="display: inline-block; position: relative; overflow: visible;">
                    <span class="text-letter-outline" style="
                        display: inline-block;
                        color: transparent;
                        -webkit-text-stroke: ${strokeGlow.strokeWidth}px ${colors.outlineColor};
                        text-stroke: ${strokeGlow.strokeWidth}px ${colors.outlineColor};
                        font-family: 'Stara', sans-serif;
                        font-weight: 600;
                        font-size: ${fontSize}px;
                        line-height: 1.2;
                        letter-spacing: 0.02em;
                    ">${char}</span>
                    <span class="text-letter-fill" style="
                        display: inline-block;
                        position: absolute;
                        top: 0;
                        left: 0;
                        color: ${colors.fillColor};
                        -webkit-text-stroke: ${strokeGlow.strokeWidth}px ${colors.fillColor};
                        text-stroke: ${strokeGlow.strokeWidth}px ${colors.fillColor};
                        font-family: 'Stara', sans-serif;
                        font-weight: 600;
                        font-size: ${fontSize}px;
                        line-height: 1.2;
                        letter-spacing: 0.02em;
                        clip-path: ${filled ? 'inset(0% 0 0 0)' : 'inset(100% 0 0 0)'};
                        transition: clip-path ${this.options.animation.fillDuration}s cubic-bezier(0.22, 1, 0.36, 1);
                        will-change: clip-path;
                    ">${char}</span>
                    ${strokeGlow.glow ? `
                        <span class="text-letter-glow" style="
                            display: inline-block;
                            position: absolute;
                            top: 0;
                            left: 0;
                            color: ${colors.glowColor};
                            -webkit-text-stroke: 0.5px ${colors.glowColor};
                            text-stroke: 0.5px ${colors.glowColor};
                            text-shadow: 0 0 ${glowRadius}px ${colors.glowColor}, 0 0 ${glowRadius * 2}px ${colors.glowColor}, 0 0 ${glowRadius * 3.5}px ${colors.glowColor};
                            pointer-events: none;
                            z-index: -1;
                            will-change: opacity;
                            opacity: ${filled ? 1 : 0};
                            transition: opacity ${this.options.animation.fillDuration * 0.8}s ease ${filled ? this.options.animation.fillDuration * 0.25 : 0}s;
                        ">${char}</span>
                    ` : ''}
                </span>
            `;
        }).join('');
    }
    
    bindEvents() {
        // Intersection Observer for view trigger
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.isInView = true;
                    if (this.options.animation.trigger === 'onView') {
                        this.runFillSequence();
                    }
                } else {
                    this.isInView = false;
                }
            });
        }, { threshold: 0.4 });
        
        observer.observe(this.container);
        
        // Hover effects
        if (this.options.animation.trigger === 'onHover' || this.options.hoverEffect !== 'none') {
            this.container.addEventListener('mouseenter', () => {
                if (this.options.animation.trigger === 'onHover') {
                    this.runFillSequence();
                }
            });
            
            this.container.addEventListener('mouseleave', () => {
                if (this.options.animation.trigger === 'onHover') {
                    this.resetAnimation();
                }
            });
        }
        
        // Loop animation
        if (this.options.animation.trigger === 'loop') {
            this.startLoop();
        }
    }
    
    startLoop() {
        let cancelled = false;
        const loopCycle = () => {
            if (cancelled) return;
            
            const totalDuration = this.runFillSequence();
            const waitTimer = setTimeout(() => {
                if (cancelled) return;
                this.resetAnimation();
                const restartTimer = setTimeout(() => {
                    if (cancelled) return;
                    this.animationKey++;
                    loopCycle();
                }, 500);
                this.timerRefs.push(restartTimer);
            }, totalDuration + this.options.animation.loopPause * 1000);
            this.timerRefs.push(waitTimer);
        };
        
        loopCycle();
        
        return () => {
            cancelled = true;
            this.clearTimers();
        };
    }
    
    startAnimation() {
        if (this.options.animation.trigger === 'onView' && this.isInView) {
            this.runFillSequence();
        }
    }
    
    // Public methods
    updateText(newText) {
        this.options.text = newText;
        this.setupText();
    }
    
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        this.setupText();
    }
    
    destroy() {
        this.clearTimers();
        // Clean up event listeners and observers if needed
    }
}

// Auto-initialize - DISABLED to allow TextPressure to work
// document.addEventListener('DOMContentLoaded', () => {
//     const heroTitleElement = document.getElementById('hero-title-pressure');
//     if (heroTitleElement) {
//         // Replace the existing element with our new text letter filler
//         const newContainer = document.createElement('div');
//         newContainer.id = 'hero-text-letter-filler';
//         newContainer.style.cssText = `
//             min-height: 50vh;
//             width: 100%;
//             max-width: 1400px;
//             margin: 0 auto 2rem;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             position: relative;
//             z-index: 2;
//         `;
//         
//         heroTitleElement.parentNode.replaceChild(newContainer, heroTitleElement);
//         
//         // Initialize with custom settings
//         new TextLetterFiller('hero-text-letter-filler', {
//             text: "Let's Make WOW ...",
//             fontSize: 80,
//             textAlign: 'center',
//             preset: 'custom',
//             colors: {
//                 fillColor: '#FFFFFF',
//                 outlineColor: 'rgba(255, 255, 255, 0.35)',
//                 glowColor: '#FFFFFF'
//             },
//             strokeGlow: {
//                 strokeWidth: 1.5,
//                 glow: true
//             },
//             animation: {
//                 trigger: 'onView',
//                 direction: 'ltr',
//                 staggerDelay: 0.07,
//                 fillDuration: 0.6
//             },
//             glowRadius: 8,
//             hoverEffect: 'glow'
//         });
//     }
// });

// Export for global access
window.TextLetterFiller = TextLetterFiller;
