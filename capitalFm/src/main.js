import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import router from './router'
import store from './store'
import './axios'
import Toast from 'vue-toastification'
import "vue-toastification/dist/index.css";
import { initAnalytics, attachRouterTracking } from '@/utils/analytics'

const app = createApp(App);

// Initialize Google Analytics (GA4) in production if configured
const GA_ID = 'G-VRTBZR5T5W'
if (import.meta.env.PROD && GA_ID) {
  initAnalytics(GA_ID)
  attachRouterTracking(router)
}

// Global scroll reveal directive
app.directive('scroll-reveal', {
  mounted(el, binding) {
    const delay = binding.value?.delay || 0;
    const animation = binding.value?.animation || 'fade-up';
    
    // Animation class mapping
    const animations = {
      'fade-up': 'opacity-0 translate-y-8',
      'fade-down': 'opacity-0 -translate-y-8',
      'fade-left': 'opacity-0 translate-x-8',
      'fade-right': 'opacity-0 -translate-x-8',
      'fade': 'opacity-0',
      'scale': 'opacity-0 scale-95'
    };
    
    // Add initial hidden state
    el.classList.add(...animations[animation].split(' '), 'transition-all', 'duration-700');
    el.style.transitionDelay = `${delay}ms`;
    
    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Remove hidden classes and add visible state
            setTimeout(() => {
              el.classList.remove(...animations[animation].split(' '));
              el.classList.add('opacity-100', 'translate-y-0', 'translate-x-0', 'scale-100');
            }, 50);
            
            // Unobserve after animation
            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
    
    observer.observe(el);
    
    // Store observer for cleanup
    el._scrollObserver = observer;
  },
  unmounted(el) {
    if (el._scrollObserver) {
      el._scrollObserver.disconnect();
    }
  }
});

app.use(router).use(store).use(Toast).mount('#app')
