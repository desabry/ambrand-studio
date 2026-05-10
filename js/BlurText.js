// =====================
// BlurText Component - Custom Implementation
// =====================

class BlurText {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            text: "Let's Make WOW...",
            delay: 200,
            animateBy: 'words', // 'words', 'letters', 'chars'
            direction: 'top', // 'top', 'bottom', 'left', 'right', 'center'
            onAnimationComplete: null,
            className: '',
            ...options
        };
        
        this.words = [];
        this.animationCompleted = false;
        
        this.init();
    }
    
    init() {
        if (!this.container) {
            console.error('BlurText: Container not found');
            return;
        }
        
        this.setupText();
        this.animate();
    }
    
    setupText() {
        const text = this.options.text;
        const animateBy = this.options.animateBy;
        
        let elements = [];
        
        if (animateBy === 'words') {
            elements = text.split(' ').map(word => ({ text: word, type: 'word' }));
        } else if (animateBy === 'letters') {
            elements = text.split('').map(char => ({ text: char, type: 'letter' }));
        } else if (animateBy === 'chars') {
            // Handle spaces and special characters
            elements = text.split(/(\s+)/).map(char => ({ 
                text: char, 
                type: char.trim() === '' ? 'space' : 'char' 
            }));
        }
        
        this.words = elements;
        this.render();
    }
    
    render() {
        const { className } = this.options;
        
        this.container.className = `blur-text-container ${className}`;
        this.container.style.cssText = `
            display: inline-block;
            font-family: 'Stara', sans-serif;
            font-weight: 700;
            font-size: 4rem;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            color: var(--text-light);
        `;
        
        this.container.innerHTML = this.words.map((word, index) => {
            if (word.type === 'space') {
                return '<span class="blur-space"> </span>';
            }
            
            return `
                <span class="blur-element" data-index="${index}" style="
                    display: inline-block;
                    opacity: 0;
                    filter: blur(10px);
                    transform: ${this.getInitialTransform()};
                    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                ">
                    ${word.text}
                </span>
                ${word.type === 'word' && index < this.words.length - 1 ? '<span class="blur-space"> </span>' : ''}
            `;
        }).join('');
    }
    
    getInitialTransform() {
        const { direction } = this.options;
        
        switch (direction) {
            case 'top':
                return 'translateY(-30px)';
            case 'bottom':
                return 'translateY(30px)';
            case 'left':
                return 'translateX(-30px)';
            case 'right':
                return 'translateX(30px)';
            case 'center':
                return 'scale(0.8) translateY(-20px)';
            default:
                return 'translateY(-30px)';
        }
    }
    
    animate() {
        const { delay, animateBy, onAnimationComplete } = this.options;
        const elements = this.container.querySelectorAll('.blur-element');
        
        elements.forEach((element, index) => {
            const elementDelay = animateBy === 'words' ? delay : delay / 2;
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.filter = 'blur(0px)';
                element.style.transform = 'translateY(0) translateX(0) scale(1)';
                
                // Check if this is the last element
                if (index === elements.length - 1) {
                    setTimeout(() => {
                        this.animationCompleted = true;
                        if (onAnimationComplete && typeof onAnimationComplete === 'function') {
                            onAnimationComplete();
                        }
                        console.log('Animation completed!');
                    }, 800); // Wait for the transition to complete
                }
            }, index * elementDelay);
        });
    }
    
    // Public methods
    updateText(newText) {
        this.options.text = newText;
        this.setupText();
        this.animate();
    }
    
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        this.setupText();
        this.animate();
    }
    
    reset() {
        this.animationCompleted = false;
        this.setupText();
    }
    
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
            this.container.className = '';
        }
    }
}

// Auto-initialize for hero section
document.addEventListener('DOMContentLoaded', () => {
    const heroTextElement = document.getElementById('hero-blur-text');
    if (heroTextElement) {
        const handleAnimationComplete = () => {
            console.log('Animation completed!');
        };
        
        new BlurText('hero-blur-text', {
            text: "Let's Make WOW...",
            delay: 200,
            animateBy: 'words',
            direction: 'top',
            onAnimationComplete: handleAnimationComplete,
            className: 'text-2xl mb-8'
        });
    }
});

// Export for global access
window.BlurText = BlurText;
