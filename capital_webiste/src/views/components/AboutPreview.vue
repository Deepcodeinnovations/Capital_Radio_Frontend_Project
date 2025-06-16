<template>
  <section class="py-16 relative overflow-hidden" ref="sectionRef">
    <!-- Background decoration with parallax effect -->
    <div class="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
      <div class="absolute top-1/3 left-0 w-64 h-64 bg-capital-blue rounded-full blur-3xl animate-float" ref="parallaxBg1"></div>
      <div class="absolute bottom-1/4 right-0 w-64 h-64 bg-capital-yellow rounded-full blur-3xl animate-float" style="animation-delay: 1.5s;" ref="parallaxBg2"></div>
      <div class="absolute top-3/4 left-1/4 w-48 h-48 bg-capital-purple rounded-full blur-3xl animate-pulse-slow" ref="parallaxBg3"></div>
      
      <!-- Radio wave animation -->
      <div class="absolute top-1/4 right-1/4">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none" class="opacity-20">
          <circle cx="100" cy="100" r="30" stroke="white" stroke-width="2" class="animate-ping" style="animation-duration: 3s;" />
          <circle cx="100" cy="100" r="50" stroke="white" stroke-width="1.5" class="animate-ping" style="animation-duration: 4s;" />
          <circle cx="100" cy="100" r="70" stroke="white" stroke-width="1" class="animate-ping" style="animation-duration: 5s;" />
        </svg>
      </div>
    </div>
    
    <div class="container mx-auto px-4 relative">
      <div class="mb-12 text-center animate__animated" :class="{'animate__fadeInDown': isVisible}">
        <div class="inline-flex items-center justify-center mb-4">
          <span class="h-px w-10 bg-capital-blue"></span>
          <span class="mx-4 text-capital-blue font-semibold tracking-wider text-sm">THE STATION</span>
          <span class="h-px w-10 bg-capital-blue"></span>
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">About <span class="text-capital-blue">Capital FM</span></h2>
        <p class="text-slate-300 max-w-2xl mx-auto">Uganda's leading radio station dedicated to bringing you fresh hits and entertainment</p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- About info -->
        <div class="card h-full flex flex-col justify-between animate__animated" :class="{'animate__fadeInLeft': isVisible}" style="animation-duration: 1.2s;">
          <!-- Decorative radio mic icon -->
          <div class="absolute -top-5 -right-5 w-14 h-14 bg-capital-blue rounded-full flex items-center justify-center transform -rotate-12 shadow-lg hidden lg:flex">
            <div class="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center">
              <Radio class="w-5 h-5 text-capital-blue" />
            </div>
          </div>
          
          <div>
            <h3 class="text-xl font-bold text-white mb-6 flex items-center">
              <span class="animate__animated" :class="{'animate__fadeIn': isVisible}" style="animation-delay: 0.5s;">Our Story</span>
              <div class="ml-2 w-10 h-px bg-capital-blue animate__animated" :class="{'animate__fadeInLeft': isVisible}" style="animation-delay: 0.7s;"></div>
            </h3>
            <p class="text-slate-300 mb-6 animate__animated" :class="{'animate__fadeIn': isVisible}" style="animation-delay: 0.6s;">
              Founded in December 1993, Capital FM has been at the forefront of entertainment in Uganda, bringing the freshest hits, engaging talk shows, and the latest news to our listeners across the country.
            </p>
            <p class="text-slate-300 mb-6 animate__animated" :class="{'animate__fadeIn': isVisible}" style="animation-delay: 0.8s;">
              With a team of passionate DJs and presenters including Gaetano Kagwa, Lucky Mbabazi, and Flavia Tumusiime, we aim to create an immersive radio experience that connects with our audience and celebrates the vibrant culture of Uganda.
            </p>
            <p class="text-slate-300 mb-6 animate__animated" :class="{'animate__fadeIn': isVisible}" style="animation-delay: 1s;">
              Broadcasting on 91.3 MHz in Kampala, and across other regions on multiple frequencies, Capital FM has become Uganda's most trusted voice in English-language radio.
            </p>
          </div>
          
          <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-lg text-center transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-capital-yellow/10 group/stat">
              <span class="block text-2xl font-bold text-capital-yellow mb-1 group-hover/stat:animate-pulse">30+</span>
              <span class="text-sm text-slate-400">Years on Air</span>
            </div>
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-lg text-center transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-capital-blue/10 group/stat">
              <span class="block text-2xl font-bold text-capital-blue mb-1 group-hover/stat:animate-pulse">1M+</span>
              <span class="text-sm text-slate-400">Daily Listeners</span>
            </div>
            <div class="bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-lg text-center transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-capital-red/10 group/stat">
              <span class="block text-2xl font-bold text-capital-red mb-1 group-hover/stat:animate-pulse">24/7</span>
              <span class="text-sm text-slate-400">Broadcasting</span>
            </div>
          </div>
          
          <button class="btn btn-primary w-full hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-capital-blue/20 group">
            <span>Learn More About Us</span>
            <ArrowRight class="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
        
        <!-- Team preview -->
        <div class="card overflow-hidden h-full flex flex-col animate__animated" :class="{'animate__fadeInRight': isVisible}" style="animation-duration: 1.2s;">
          <h3 class="text-xl font-bold text-white mb-6 flex items-center">
            <span>Meet Our Team</span>
            <div class="ml-2 w-10 h-px bg-capital-blue"></div>
          </h3>
          
          <div class="grid grid-cols-2 gap-6 mb-6 flex-grow">
            <div v-for="(member, index) in teamMembers" :key="index" 
                class="bg-slate-800/70 rounded-xl overflow-hidden group hover:bg-slate-700/70 transition-all duration-300 opacity-0"
                :class="{'animate-fade-in': isVisible}"
                :style="`animation-delay: ${0.8 + index * 0.2}s`">
              <div class="h-48 overflow-hidden relative">
                <img :src="member.image" :alt="member.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <!-- Gradient overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-40"></div>
                <!-- Social links that appear on hover -->
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900/50">
                  <div class="flex gap-2">
                    <a href="#" class="text-white hover:text-capital-blue transition-colors p-2 bg-slate-900/50 rounded-full hover:scale-110 transform transition-transform">
                      <Twitter class="h-4 w-4" />
                    </a>
                    <a href="#" class="text-white hover:text-capital-blue transition-colors p-2 bg-slate-900/50 rounded-full hover:scale-110 transform transition-transform">
                      <Instagram class="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
              <div class="p-4">
                <h4 class="font-semibold text-white mb-1 group-hover:text-capital-blue transition-colors">{{ member.name }}</h4>
                <p class="text-sm text-slate-400 mb-3">{{ member.role }}</p>
                <div class="flex items-center gap-1">
                  <div v-for="n in 5" :key="n" class="w-4 h-0.5 bg-slate-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          <button class="btn btn-secondary w-full hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-capital-yellow/20 group">
            <span>View All Team Members</span>
            <Users class="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
      
    
    </div>
  </section>
</template>

<script setup>
import { Twitter, Instagram, Radio, ArrowRight, Users, Map } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted } from 'vue';

const isVisible = ref(false);
const sectionRef = ref(null);
const parallaxBg1 = ref(null);
const parallaxBg2 = ref(null);
const parallaxBg3 = ref(null);

const teamMembers = [
  {
    name: 'Gaetano Kagwa',
    role: 'Morning Show Host',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
  },
  {
    name: 'Lucky Mbabazi',
    role: 'Morning Show Co-Host',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
  },
  {
    name: 'Flavia Tumusiime',
    role: 'AM-PM Show Host',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
  },
  {
    name: 'Oulanyah Jimmy',
    role: 'Overdrive Show Host',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80'
  }
];

const frequencies = [
  { freq: '91.3 MHz', location: 'Kampala' },
  { freq: '90.9 MHz', location: 'Mbale' },
  { freq: '88.7 MHz', location: 'Mbarara' },
  { freq: '89.4 MHz', location: 'Fort Portal' },
  { freq: '96.9 MHz', location: 'Gulu' },
  { freq: '92.7 MHz', location: 'Arua' }
];

// Scroll-based animations
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        observer.unobserve(entry.target);
        
        // Set up individual animations for elements with animate-fade-in class
        const fadingElements = entry.target.querySelectorAll('.animate-fade-in');
        fadingElements.forEach((el, index) => {
          // Add fade-in-initial class immediately
          el.classList.add('fade-in-initial');
          // Add the visible class with a delay
          setTimeout(() => {
            el.classList.add('fade-in-visible');
          }, parseInt(el.dataset.delay || 0) * 1000 || index * 100);
        });
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
  
  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
  
  // Removing parallax effect on scroll
  /*
  // Parallax effect on scroll
  const handleScroll = () => {
    const scrollPos = window.scrollY;
    if (parallaxBg1.value) parallaxBg1.value.style.transform = `translateY(${scrollPos * 0.05}px)`;
    if (parallaxBg2.value) parallaxBg2.value.style.transform = `translateY(${-scrollPos * 0.03}px)`;
    if (parallaxBg3.value) parallaxBg3.value.style.transform = `translateY(${scrollPos * 0.02}px)`;
  };
  
  window.addEventListener('scroll', handleScroll);
  */
  
  onUnmounted(() => {
    if (sectionRef.value) {
      observer.unobserve(sectionRef.value);
    }
    // window.removeEventListener('scroll', handleScroll);
  });
});
</script>

<style scoped>
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-initial {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}

.fade-in-visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

/* Add additional professional styling */
.feature-card {
  background-image: linear-gradient(to bottom right, rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.95));
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease-in-out;
}

.feature-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-5px);
  box-shadow: 0 15px 30px -10px rgba(0, 167, 225, 0.15);
}

@keyframes shine {
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
}

.shine-effect {
  position: relative;
  overflow: hidden;
}

.shine-effect::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
  transform: rotate(30deg);
  animation: shine 3s linear infinite;
}

.grid-pattern {
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}
</style> 