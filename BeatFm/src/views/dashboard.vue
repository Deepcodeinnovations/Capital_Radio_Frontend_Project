<template>
<OnAirSection />
<OurTeam />
<ForumPreview />
<EventsSection />


</template>

<script setup>
import { ref, onMounted } from 'vue';
import AboutPreview from './components/AboutPreview.vue';
import OurTeam from './components/OurTeam.vue';
import RadioPlayer from './components/RadioPlayer.vue';
import OnAirSection from './components/OnAirSection.vue';
import NewsSection from './components/NewsSection.vue';
import ForumPreview from './components/ForumPreview.vue';

import AdvertisementSection from './components/AdvertisementSection.vue';
import EventsSection from './components/EventsSection.vue';

import LiveChat from './components/LiveChat.vue';
import Footer from './components/Footer.vue';
import { createParticleSystem } from '@/utils/animations';
import { BarChart2, MapPin, Radio, Users, ArrowRight, MessageSquare, Heart, MessageCircle } from 'lucide-vue-next';

onMounted(() => {
  // Initialize fade-in animations for sections
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add class to make visible when in view
        entry.target.classList.add('fade-in-visible');
        
        // Staggered animations for children
        if (entry.target.classList.contains('fade-in-section')) {
          const staggeredItems = entry.target.querySelectorAll('.staggered-item');
          staggeredItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('fade-in-visible');
            }, 100 * index);
          });
        }
        
        // Stop observing after animation is triggered
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
  
  document.querySelectorAll('.fade-in-section, .staggered-item').forEach(section => {
    // Set initial state
    section.classList.add('fade-in-initial');
    fadeObserver.observe(section);
  });
  
  // Initialize animate.css animations
  document.querySelectorAll('.animate__animated').forEach(element => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate__fadeIn');
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(element);
  });
  
  // Initialize particle background system
  createParticleSystem('#particle-background', {
    particleCount: 50,
    colors: ['#00a7e1', '#ffea00', '#ef233c', '#9d4edd', '#00b4d8'],
    sizeRange: [2, 6],
    speedRange: [0.3, 1],
    connectDistance: 150
  });
  
  // Smooth scrolling for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});
</script>

<style>
/* Import professional and entertainment fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Oswald:wght@300;400;600&family=Montserrat:wght@300;400;500;600;700&display=swap');

/* Global properties for animations */
:root {
  --visualization-intensity: 80%;
  
  /* Professional font for headings */
  --heading-font: 'Playfair Display', serif;
  
  /* Entertainment font for special elements */
  --entertainment-font: 'Oswald', sans-serif;
  
  /* Clean modern font for body text */
  --body-font: 'Montserrat', sans-serif;
}

/* Font assignments */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--heading-font);
}

body, p, a, span, div {
  font-family: var(--body-font);
}

.entertainment-text {
  font-family: var(--entertainment-font);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Webkit scrollbar customization */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.8);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #00a7e1, #9d4edd);
  border-radius: 10px;
}

/* News ticker animation */
@keyframes ticker {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-ticker {
  animation: ticker 30s linear infinite;
}

/* Fade in animations for sections */
.fade-in-initial {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.fade-in-visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

/* Wave dividers for section transitions */
.wave-divider {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' class='shape-fill' fill='%2300a7e1'%3E%3C/path%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: repeat-x;
  animation: wave-animation 20s linear infinite;
}

.wave-divider-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100%;
  transform: rotate(180deg);
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='.25' class='shape-fill' fill='%23ef233c'%3E%3C/path%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: repeat-x;
  animation: wave-animation 15s linear infinite;
}

@keyframes wave-animation {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.2;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style> 