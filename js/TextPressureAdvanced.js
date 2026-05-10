/**
 * TextPressure component ported from React Bits
 * Based on https://codepen.io/JuanFuentes/full/rgXKGQ
 * Exact vanilla JavaScript implementation of the React component
 */

const dist = (a, b) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (distance, maxDist, minVal, maxVal) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

class TextPressure {
  constructor(element, options = {}) {
    if (!element) return;
    
    this.container = element;
    this.containerRef = element;
    this.titleRef = null;
    this.spansRef = [];
    
    this.mouseRef = { x: 0, y: 0 };
    this.cursorRef = { x: 0, y: 0 };
    
    this.fontSize = options.minFontSize || 24;
    this.scaleY = 1;
    this.lineHeight = 1;
    
    this.config = {
      text: options.text || 'Compressa',
      fontFamily: options.fontFamily || 'Compressa VF',
      fontUrl: options.fontUrl || 'https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2',
      
      width: options.width !== undefined ? options.width : true,
      weight: options.weight !== undefined ? options.weight : true,
      italic: options.italic !== undefined ? options.italic : true,
      alpha: options.alpha !== undefined ? options.alpha : false,
      
      flex: options.flex !== undefined ? options.flex : true,
      stroke: options.stroke !== undefined ? options.stroke : false,
      scale: options.scale !== undefined ? options.scale : false,
      
      textColor: options.textColor || '#FFFFFF',
      strokeColor: options.strokeColor || '#FF0000',
      className: options.className || '',
      
      minFontSize: options.minFontSize || 24
    };
    
    this.chars = this.config.text.split('');
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.createElement();
    this.setSize();
    this.animate();
  }
  
  setupEventListeners() {
    const handleMouseMove = (e) => {
      this.cursorRef.x = e.clientX;
      this.cursorRef.y = e.clientY;
    };
    
    const handleTouchMove = (e) => {
      const t = e.touches[0];
      this.cursorRef.x = t.clientX;
      this.cursorRef.y = t.clientY;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    if (this.containerRef) {
      const { left, top, width, height } = this.containerRef.getBoundingClientRect();
      this.mouseRef.x = left + width / 2;
      this.mouseRef.y = top + height / 2;
      this.cursorRef.x = this.mouseRef.x;
      this.cursorRef.y = this.mouseRef.y;
    }
    
    this.cleanup = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }
  
  createElement() {
    // Clear container
    this.containerRef.innerHTML = '';
    
    // Setup container styles
    this.containerRef.style.position = 'relative';
    this.containerRef.style.width = '100%';
    this.containerRef.style.height = '100%';
    this.containerRef.style.background = 'transparent';
    
    // Create style element
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      @font-face {
        font-family: '${this.config.fontFamily}';
        src: url('${this.config.fontUrl}');
        font-style: normal;
      }
      
      .flex {
        display: flex;
        justify-content: space-between;
      }
      
      .stroke span {
        position: relative;
        color: ${this.config.textColor};
      }
      .stroke span::after {
        content: attr(data-char);
        position: absolute;
        left: 0;
        top: 0;
        color: transparent;
        z-index: -1;
        -webkit-text-stroke-width: 3px;
        -webkit-text-stroke-color: ${this.config.strokeColor};
      }
      
      .text-pressure-title {
        color: ${this.config.textColor};
      }
    `;
    this.containerRef.appendChild(styleElement);
    
    // Create title element
    this.titleRef = document.createElement('h1');
    
    const dynamicClassName = [this.config.className, this.config.flex ? 'flex' : '', this.config.stroke ? 'stroke' : ''].filter(Boolean).join(' ');
    this.titleRef.className = `text-pressure-title ${dynamicClassName}`;
    
    this.titleRef.style.fontFamily = this.config.fontFamily;
    this.titleRef.style.textTransform = 'uppercase';
    this.titleRef.style.fontSize = this.fontSize;
    this.titleRef.style.lineHeight = this.lineHeight;
    this.titleRef.style.transform = `scale(1, ${this.scaleY})`;
    this.titleRef.style.transformOrigin = 'center top';
    this.titleRef.style.margin = '0';
    this.titleRef.style.textAlign = 'center';
    this.titleRef.style.userSelect = 'none';
    this.titleRef.style.whiteSpace = 'nowrap';
    this.titleRef.style.fontWeight = '100';
    this.titleRef.style.width = '100%';
    
    // Create spans for each character
    this.chars.forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.setAttribute('data-char', char);
      span.style.display = 'inline-block';
      span.style.color = this.config.stroke ? undefined : this.config.textColor;
      
      this.titleRef.appendChild(span);
      this.spansRef[i] = span;
    });
    
    this.containerRef.appendChild(this.titleRef);
  }
  
  setSize = () => {
    if (!this.containerRef || !this.titleRef) return;
    
    const { width: containerW, height: containerH } = this.containerRef.getBoundingClientRect();
    
    let newFontSize = containerW / (this.chars.length / 2);
    newFontSize = Math.max(newFontSize, this.config.minFontSize);
    
    this.fontSize = newFontSize;
    this.scaleY = 1;
    this.lineHeight = 1;
    
    requestAnimationFrame(() => {
      if (!this.titleRef) return;
      const textRect = this.titleRef.getBoundingClientRect();
      
      if (this.config.scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;
        this.scaleY = yRatio;
        this.lineHeight = yRatio;
      }
      
      this.updateTitleStyles();
    });
  }
  
  updateTitleStyles() {
    if (!this.titleRef) return;
    
    this.titleRef.style.fontSize = `${this.fontSize}px`;
    this.titleRef.style.lineHeight = this.lineHeight;
    this.titleRef.style.transform = `scale(1, ${this.scaleY})`;
  }
  
  animate() {
    const frame = () => {
      this.mouseRef.x += (this.cursorRef.x - this.mouseRef.x) / 15;
      this.mouseRef.y += (this.cursorRef.y - this.mouseRef.y) / 15;
      
      if (this.titleRef) {
        const titleRect = this.titleRef.getBoundingClientRect();
        const maxDist = titleRect.width / 2;
        
        this.spansRef.forEach(span => {
          if (!span) return;
          
          const rect = span.getBoundingClientRect();
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2
          };
          
          const d = dist(this.mouseRef, charCenter);
          
          const wdth = this.config.width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
          const wght = this.config.weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
          const italVal = this.config.italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : 0;
          const alphaVal = this.config.alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : 1;
          
          const newFontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
          
          if (span.style.fontVariationSettings !== newFontVariationSettings) {
            span.style.fontVariationSettings = newFontVariationSettings;
          }
          if (this.config.alpha && span.style.opacity !== alphaVal) {
            span.style.opacity = alphaVal;
          }
        });
      }
      
      this.rafId = requestAnimationFrame(frame);
    };
    
    frame();
  }
  
  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.cleanup) {
      this.cleanup();
    }
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
