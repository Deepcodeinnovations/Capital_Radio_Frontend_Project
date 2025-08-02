import anime from 'animejs';

// Advanced text animation similar to the one on anime.js website
export const textAnimation = (selector, options = {}) => {
  const defaultOptions = {
    targets: `${selector} .letter`,
    translateY: ["1.1em", 0],
    translateX: ["0.55em", 0],
    translateZ: 0,
    rotateZ: [180, 0],
    duration: 750,
    easing: "easeOutExpo",
    delay: (el, i) => 50 * i,
    ...options
  };
  
  return anime(defaultOptions);
};

// Create motion path animation (inspired by anime.js site)
export const createMotionPath = (path) => {
  const pathEl = document.querySelector(path);
  if (!pathEl) return null;
  
  return {
    translateX: (el) => {
      const path = anime.path(pathEl);
      return path('x');
    },
    translateY: (el) => {
      const path = anime.path(pathEl);
      return path('y');
    },
    rotate: (el) => {
      const path = anime.path(pathEl);
      return path('angle');
    },
    easing: 'linear',
    duration: 3000,
    loop: true
  };
};

// Staggered card animation (inspired by araari.africa)
export const staggeredCards = (selector, options = {}) => {
  const defaultOptions = {
    targets: selector,
    translateY: [60, 0],
    opacity: [0, 1],
    easing: 'easeOutExpo',
    duration: 1200,
    delay: anime.stagger(200, {start: 300}),
    ...options
  };
  
  return anime(defaultOptions);
};

// Gradient wave animation (inspired by araari.africa)
export const gradientWave = (selector) => {
  anime({
    targets: selector,
    background: [
      { value: 'linear-gradient(45deg, #00a7e1, #9d4edd, #ffea00)' },
      { value: 'linear-gradient(45deg, #ffea00, #00a7e1, #9d4edd)' },
      { value: 'linear-gradient(45deg, #9d4edd, #ffea00, #00a7e1)' }
    ],
    duration: 10000,
    easing: 'easeInOutQuad',
    direction: 'alternate',
    loop: true
  });
};

// Scroll-triggered animations
export const scrollTriggeredAnimation = (selector, callback, options = {}) => {
  const elements = document.querySelectorAll(selector);
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry.target);
        if (options.once) {
          observer.unobserve(entry.target);
        }
      }
    });
  }, {
    threshold: options.threshold || 0.1,
    rootMargin: options.rootMargin || '0px'
  });
  
  elements.forEach(el => observer.observe(el));
  
  return observer;
};

// Smooth line drawing animation (similar to anime.js demo)
export const lineDrawing = (selector) => {
  anime({
    targets: selector,
    strokeDashoffset: [anime.setDashoffset, 0],
    easing: 'easeInOutSine',
    duration: 1500,
    delay: function(el, i) { return i * 250 },
    direction: 'alternate',
    loop: true
  });
};

// 3D tilt effect (inspired by araari.africa)
export const tiltEffect = (selector) => {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(element => {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const xPercent = x / rect.width;
      const yPercent = y / rect.height;
      
      const rotateX = (0.5 - yPercent) * 10;
      const rotateY = (xPercent - 0.5) * 10;
      
      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    element.addEventListener('mouseleave', () => {
      anime({
        targets: element,
        rotateX: 0,
        rotateY: 0,
        duration: 400,
        easing: 'easeOutQuad'
      });
    });
  });
};

// Shape morphing animation
export const morphShapes = (fromSelector, toSelector) => {
  anime({
    targets: fromSelector,
    d: [
      {value: document.querySelector(fromSelector).getAttribute('d')},
      {value: document.querySelector(toSelector).getAttribute('d')}
    ],
    easing: 'easeInOutQuad',
    duration: 2000,
    loop: true,
    direction: 'alternate'
  });
};

// Floating animation for UI elements
export const floatingAnimation = (selector, options = {}) => {
  const defaultOptions = {
    targets: selector,
    translateY: ['-10px', '10px'],
    easing: 'easeInOutSine',
    duration: 3000,
    direction: 'alternate',
    loop: true,
    ...options
  };
  
  return anime(defaultOptions);
};

// Create a timeline for complex animations
export const createTimeline = (options = {}) => {
  return anime.timeline({
    easing: 'easeOutExpo',
    duration: 750,
    ...options
  });
};

// NEW ANIMATIONS (inspired by araari.africa and anime.js)

// Futuristic text scramble effect
export const textScramble = (selector, finalText) => {
  // Check if selector is a DOM element, string selector, or an invalid value
  let elements = [];
  
  if (typeof selector === 'string') {
    // If it's a string, try to use it as a CSS selector
    elements = document.querySelectorAll(selector);
  } else if (selector instanceof HTMLElement) {
    // If it's a DOM element, use it directly
    elements = [selector];
  } else {
    console.error('Invalid selector provided to textScramble:', selector);
    return;
  }
  
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  
  elements.forEach(element => {
    let frame = 0;
    const frameRate = 30;
    const originalText = finalText || element.innerText;
    let currentText = '';
    let currentLength = 0;
    
    const updateText = () => {
      currentLength = Math.floor(frame / frameRate * originalText.length);
      currentText = originalText.substring(0, currentLength);
      
      if (currentLength < originalText.length) {
        // Add scramble effect for upcoming character
        currentText += chars[Math.floor(Math.random() * chars.length)];
      }
      
      element.innerText = currentText;
      frame++;
      
      if (currentLength < originalText.length) {
        requestAnimationFrame(updateText);
      }
    };
    
    updateText();
  });
};

// SVG geometric background animation
export const svgGeometricBackground = (selector) => {
  const container = document.querySelector(selector);
  if (!container) return;
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.position = 'absolute';
  svg.style.top = '0';
  svg.style.left = '0';
  svg.style.zIndex = '-1';
  
  container.appendChild(svg);
  
  const shapes = [];
  const shapeCount = 20;
  const colors = ['#00a7e1', '#ffea00', '#ef233c', '#9d4edd', '#00b4d8'];
  
  for (let i = 0; i < shapeCount; i++) {
    const isCircle = Math.random() > 0.5;
    let shape;
    
    if (isCircle) {
      shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      const radius = Math.random() * 50 + 10;
      shape.setAttribute('r', radius);
      shape.setAttribute('cx', Math.random() * 100 + '%');
      shape.setAttribute('cy', Math.random() * 100 + '%');
    } else {
      shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      const width = Math.random() * 100 + 20;
      const height = Math.random() * 100 + 20;
      shape.setAttribute('width', width);
      shape.setAttribute('height', height);
      shape.setAttribute('x', Math.random() * 100 + '%');
      shape.setAttribute('y', Math.random() * 100 + '%');
      shape.setAttribute('rx', Math.random() * 10 + 5);
    }
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    shape.setAttribute('fill', color);
    shape.style.opacity = Math.random() * 0.1 + 0.05;
    
    svg.appendChild(shape);
    shapes.push(shape);
  }
  
  shapes.forEach(shape => {
    anime({
      targets: shape,
      translateX: () => anime.random(-100, 100) + 'px',
      translateY: () => anime.random(-100, 100) + 'px',
      scale: () => [1, anime.random(0.8, 1.2)],
      rotate: () => anime.random(-30, 30) + 'deg',
      opacity: () => [parseFloat(shape.style.opacity), parseFloat(shape.style.opacity) * 0.5],
      easing: 'easeInOutQuad',
      duration: () => anime.random(5000, 10000),
      complete: (anim) => {
        anime({
          targets: shape,
          translateX: 0,
          translateY: 0,
          scale: 1,
          rotate: '0deg',
          opacity: shape.style.opacity,
          easing: 'easeInOutQuad',
          duration: () => anime.random(5000, 10000)
        });
      },
      loop: true
    });
  });
};

// Dynamic particle system (inspired by modern websites)
export const createParticleSystem = (selector, options = {}) => {
  const container = document.querySelector(selector);
  if (!container) return;
  
  const defaultOptions = {
    particleCount: 30,
    colors: ['#00a7e1', '#ffea00', '#ef233c', '#9d4edd'],
    sizeRange: [3, 8],
    speedRange: [1, 3],
    connectDistance: 150,
    ...options
  };
  
  const canvas = document.createElement('canvas');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '0';
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  
  window.addEventListener('resize', () => {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  });
  
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * (defaultOptions.sizeRange[1] - defaultOptions.sizeRange[0]) + defaultOptions.sizeRange[0];
      this.speed = Math.random() * (defaultOptions.speedRange[1] - defaultOptions.speedRange[0]) + defaultOptions.speedRange[0];
      this.direction = Math.random() * Math.PI * 2;
      this.color = defaultOptions.colors[Math.floor(Math.random() * defaultOptions.colors.length)];
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    
    update() {
      this.x += Math.cos(this.direction) * this.speed;
      this.y += Math.sin(this.direction) * this.speed;
      
      if (this.x < 0 || this.x > canvas.width) this.direction = Math.PI - this.direction;
      if (this.y < 0 || this.y > canvas.height) this.direction = -this.direction;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + Math.floor(this.alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
    }
  }
  
  const particles = Array.from({ length: defaultOptions.particleCount }, () => new Particle());
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    // Connect particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < defaultOptions.connectDistance) {
          const opacity = 1 - (distance / defaultOptions.connectDistance);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.2})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
};

// Audio visualizer (for radio stations)
export const createAudioVisualizer = (selector, audioElement, options = {}) => {
  const container = document.querySelector(selector);
  const audio = document.querySelector(audioElement);
  if (!container || !audio) return;
  
  const defaultOptions = {
    barCount: 64,
    barColor: '#00a7e1',
    barGradient: ['#00a7e1', '#9d4edd'],
    barWidth: 2,
    barSpacing: 1,
    barHeight: 100,
    ...options
  };
  
  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  container.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  canvas.width = container.offsetWidth;
  canvas.height = container.offsetHeight;
  
  window.addEventListener('resize', () => {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  });
  
  // Create audio context and analyzer
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyzer = audioContext.createAnalyser();
  const source = audioContext.createMediaElementSource(audio);
  
  source.connect(analyzer);
  analyzer.connect(audioContext.destination);
  
  analyzer.fftSize = 128;
  const bufferLength = analyzer.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  
  function createGradient(ctx, width, height) {
    const gradient = ctx.createLinearGradient(0, height, 0, 0);
    gradient.addColorStop(0, defaultOptions.barGradient[0]);
    gradient.addColorStop(1, defaultOptions.barGradient[1]);
    return gradient;
  }
  
  function animate() {
    requestAnimationFrame(animate);
    
    analyzer.getByteFrequencyData(dataArray);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = defaultOptions.barWidth;
    const barSpacing = defaultOptions.barSpacing;
    const totalBarWidth = barWidth + barSpacing;
    
    const gradient = createGradient(ctx, canvas.width, canvas.height);
    
    for (let i = 0; i < defaultOptions.barCount; i++) {
      const index = Math.floor(i * (bufferLength / defaultOptions.barCount));
      const value = dataArray[index] / 255;
      
      const barHeight = value * defaultOptions.barHeight;
      const x = i * totalBarWidth;
      const y = canvas.height - barHeight;
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);
    }
  }
  
  audio.addEventListener('play', () => {
    // Resume audio context if suspended
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    animate();
  });
};

// Magnetic effect for buttons (inspired by modern UI)
export const magneticEffect = (selector, strength = 0.5) => {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(element => {
    const originalTransform = element.style.transform || '';
    
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      const radius = Math.max(rect.width, rect.height) * 1.5;
      
      if (distance < radius) {
        const power = (1 - distance / radius) * strength;
        const moveX = distanceX * power;
        const moveY = distanceY * power;
        
        element.style.transform = `${originalTransform} translate(${moveX}px, ${moveY}px)`;
      } else {
        element.style.transform = originalTransform;
      }
    });
    
    element.addEventListener('mouseleave', () => {
      anime({
        targets: element,
        translateX: 0,
        translateY: 0,
        duration: 400,
        easing: 'easeOutElastic(1, .5)'
      });
    });
  });
};

export default {
  textAnimation,
  createMotionPath,
  staggeredCards,
  gradientWave,
  scrollTriggeredAnimation,
  lineDrawing,
  tiltEffect,
  morphShapes,
  floatingAnimation,
  createTimeline,
  // New exports
  textScramble,
  svgGeometricBackground,
  createParticleSystem,
  createAudioVisualizer,
  magneticEffect
}; 