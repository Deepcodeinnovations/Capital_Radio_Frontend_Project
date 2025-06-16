<template>
       <!-- Hero section with breaking news ticker -->
       <section id="home" class="pt-16">
          <Hero />
        </section>
        
    <!-- Main content grid layout with more dense information -->
    <div class="bg-slate-900/80 backdrop-blur-md py-6">
          <div class="container mx-auto px-4">
            <section id="on-air-live-chat" class="mb-12 fade-in-section">
              <div class="flex items-center justify-center mb-4">
                <div class="h-px w-12 bg-capital-red"></div>
                <span class="mx-4 text-capital-red font-semibold tracking-wider text-sm uppercase">On Air Now</span>
                <div class="h-px w-12 bg-capital-red"></div>
              </div>
              <h2 class="text-3xl font-bold text-white text-center mb-8">Listen & <span class="text-capital-yellow">Connect</span></h2>
              
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <!-- Live Chat - First on mobile, Second on desktop -->
              <div class="order-1 lg:order-2 lg:col-span-4">
                <div class="h-[700px]"> <!-- Fixed height container -->
                  <LiveChat />
                </div>
              </div>
              
              <!-- OnAir Section - Second on mobile, First on desktop -->
              <div class="order-2 lg:order-1 lg:col-span-8">
                <div class="h-[700px] overflow-y-auto"> <!-- Fixed height container with scroll -->
                  <OnAirSection />
                </div>
              </div>
              </div>
                <!-- Special program highlight -->
              <div class="mt-12 p-0.5 bg-gradient-to-r from-capital-blue via-capital-purple to-capital-yellow rounded-xl animate__animated" :class="{'animate__fadeIn': isVisible}" style="animation-delay: 0.8s;">
                <div class="bg-slate-900 rounded-lg p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                  <!-- Background pattern -->
                  <div class="absolute inset-0 opacity-5 pointer-events-none">
                    <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
                    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
                    <div class="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white to-transparent"></div>
                    <div class="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white to-transparent"></div>
                    <!-- Audio wave pattern -->
                    <div class="absolute inset-0 flex items-center justify-center opacity-10">
                      <svg width="100%" height="40" viewBox="0 0 1200 200">
                        <path d="M0,100 Q300,180 600,100 T1200,100" fill="none" stroke="white" stroke-width="2" />
                        <path d="M0,100 Q300,20 600,100 T1200,100" fill="none" stroke="white" stroke-width="2" />
                      </svg>
                    </div>
                  </div>
                  
                  <div class="md:w-1/4 flex-shrink-0">
                    <div class="relative">
                      <div class="animate-pulse-slow absolute -inset-1 rounded-full bg-capital-yellow/30 blur-sm"></div>
                      <div class="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-full h-32 w-32 mx-auto flex items-center justify-center group hover:shadow-xl hover:shadow-capital-yellow/20 transition-all duration-500">
                        <Mic class="h-16 w-16 text-capital-yellow group-hover:animate-wiggle" />
                      </div>
                    </div>
                  </div>
                  <div class="text-center md:text-left">
                    <span class="inline-block bg-capital-yellow/20 text-capital-yellow text-xs rounded-full px-2.5 py-0.5 mb-2">LISTENER FAVORITE</span>
                    <h3 class="text-xl font-bold text-white mb-2">The Capital Gang</h3>
                    <p class="text-slate-300 mb-4 max-w-2xl">Join our panel of political analysts and commentators every Saturday from 10AM to 12PM as they discuss the hottest topics in Ugandan politics and current affairs.</p>
                    <button class="btn btn-secondary flex items-center gap-2 mx-auto md:mx-0 hover:shadow-lg hover:shadow-capital-yellow/30 transition-all duration-300">
                      <Calendar class="h-4 w-4" />
                      <span>Tune in on Saturday</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
            
            <!-- Charts and Events Section -->
           <EventsSection />
            
            <!-- Section separator -->
            <div class="relative flex items-center justify-center my-12">
              <div class="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
              <div class="absolute bg-slate-900 px-4">
                <div class="w-8 h-8 rounded-full bg-gradient-to-r from-capital-blue to-capital-purple flex items-center justify-center">
                  <Radio class="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            <!-- News + Ads section -->
            <section id="advertisements">
                  <AdvertisementSection />
            </section>
            
            <!-- Section separator -->
            <div class="relative flex items-center justify-center my-12">
              <div class="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
              <div class="absolute bg-slate-900 px-4">
                <div class="w-8 h-8 rounded-full bg-gradient-to-r from-capital-red to-capital-yellow flex items-center justify-center">
                  <Users class="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            <!-- Forum + About -->
            <div class="grid grid-cols-1 lg:grid-cols-1 gap-6 fade-in-section">
              <section id="forum">
                <ForumPreview />
              </section>
              <section id="about">
                <AboutPreview />
              </section>
            </div>
            
            <!-- Bottom wave decoration -->
            <div class="relative h-24 mt-16 overflow-hidden opacity-20">
              <div class="wave-divider-bottom"></div>
            </div>
          </div>
        </div>  
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Header from './includes/header.vue';
import Hero from './components/Hero.vue';
import RadioPlayer from './components/RadioPlayer.vue';
import OnAirSection from './components/OnAirSection.vue';
import NewsSection from './components/NewsSection.vue';
import ForumPreview from './components/ForumPreview.vue';
import AboutPreview from './components/AboutPreview.vue';
import AdvertisementSection from './components/AdvertisementSection.vue';
import EventsSection from './components/EventsSection.vue';

import LiveChat from './components/LiveChat.vue';
import Footer from './components/Footer.vue';
import { createParticleSystem } from '@/utils/animations';
import { BarChart2, MapPin, Radio, Users, ArrowRight, MessageSquare, Heart, MessageCircle } from 'lucide-vue-next';

// Top songs this week
const topSongs = ref([
  { title: 'Unstoppable', artist: 'Sia', change: 2 },
  { title: 'Jerusalema', artist: 'Master KG ft. Nomcebo', change: 0 },
  { title: 'Essence', artist: 'Wizkid ft. Tems', change: 1 },
  { title: 'Love Nwantiti', artist: 'CKay', change: -2 },
  { title: 'Calm Down', artist: 'Rema & Selena Gomez', change: 3 }
]);

// Top albums
const topAlbums = ref([
  { title: 'Made in Lagos', artist: 'Wizkid', image: 'https://images.unsplash.com/photo-1605722243979-fe0be8158232?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  { title: 'Twice As Tall', artist: 'Burna Boy', image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  { title: 'Celia', artist: 'Tiwa Savage', image: 'https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' }
]);

// Upcoming events
const upcomingEvents = ref([
  { title: 'Kampala Music Festival', month: 'JUN', day: '15', location: 'Kololo Airstrip' },
  { title: 'Acoustic Unplugged', month: 'JUN', day: '23', location: 'Gatto Matto' },
  { title: 'Capital FM Live', month: 'JUL', day: '05', location: 'Garden City' }
]);

// Social media posts
const socialPosts = ref([
  { 
    username: 'CapitalFM', 
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    time: '2h ago',
    content: 'Tune in now for the Morning Drive with Gaetano & Lucky! Call in to share your thoughts on today\'s hot topic.',
    likes: 24,
    comments: 6
  },
  { 
    username: 'MusicUganda', 
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
    time: '5h ago',
    content: 'The Kampala Music Festival lineup is 🔥! Can\'t wait to see all these amazing artists next month!',
    likes: 37,
    comments: 12
  }
]);

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