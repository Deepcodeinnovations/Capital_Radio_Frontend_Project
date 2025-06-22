<template>
  <nav class="fixed w-full top-0 z-50 transition-all duration-300" :class="{'shadow-lg bg-slate-900/95 backdrop-blur-xl': scrolled, 'bg-transparent': !scrolled}">
  <div class="bg-capital-red/90 py-2 relative overflow-hidden">
          <div class="ticker-wrapper">
            <div class="ticker-content">
              <p class="text-white font-bold animate-ticker whitespace-nowrap">BREAKING NEWS: Capital FM launches new interactive website • Uganda's music scene explodes with new talent • Upcoming festival season announced • Exclusive interviews with top artists coming soon • New music releases this Friday</p>
            </div>
          </div>
        </div>
    <div class="container mx-auto ">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <div class="flex items-center">
          <a href="#" class="flex items-center gap-3 group">
            <div class="relative">
              <div class="absolute -inset-1 bg-gradient-to-r from-capital-blue via-capital-yellow to-capital-red rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
              <div class="relative text-capital-yellow flex items-center transform group-hover:scale-110 transition duration-300">
                <Radio class="h-8 w-8" />
              </div>
            </div>
            <div class="flex flex-col">
              <span class="font-bold text-xl text-white">Capital <span class="text-capital-yellow">FM</span></span>
              <span class="text-xs text-slate-400">Fresh Hits for Uganda</span>
            </div>
          </a>
        </div>

        <!-- Desktop Nav -->
        <div class="hidden md:block">
          <div class="flex items-center space-x-2">
            <NavLink v-for="(item, index) in navItems" :key="index" :to="item.to" :label="item.label" :active="activeLink === item.to" @click="setActiveLink(item.to)" />
            
            <button class="ml-4 bg-gradient-to-r from-capital-blue to-blue-600 text-white font-medium py-2 px-5 rounded-full hover:shadow-lg hover:shadow-capital-blue/20 transition-all duration-300 hover:scale-105 flex items-center gap-2">
              <Radio class="h-4 w-4" />
              <span>Listen Live</span>
            </button>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden flex items-center">
          <button 
            @click="isOpen = !isOpen"
            class="inline-flex items-center justify-center p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 focus:outline-none transition-colors"
          >
            <Menu v-if="!isOpen" class="h-6 w-6" />
            <X v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div class="md:hidden overflow-hidden transition-all duration-300" :style="`max-height: ${isOpen ? mobileMenuHeight : 0}px`">
      <div ref="mobileMenu" class="px-2 py-3 bg-slate-800/95 backdrop-blur-xl">
        <div class="flex flex-col space-y-1">
          <a 
            v-for="(item, index) in navItems" 
            :key="index" 
            :href="item.to" 
            class="px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 flex items-center gap-3"
            :class="activeLink === item.to ? 
              'text-white bg-slate-700/60 border-l-2 border-capital-yellow' : 
              'text-slate-300 hover:text-white hover:bg-slate-700/30'"
            @click.prevent="setActiveLink(item.to); isOpen = false;"
          >
            <component :is="item.icon" class="h-5 w-5" />
            {{ item.label }}
          </a>
          
          <button class="mt-4 mx-2 bg-gradient-to-r from-capital-blue to-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
            <Radio class="h-5 w-5" />
            <span>Listen Live</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Radio, Menu, X, Home, BarChart2, Users, Newspaper, Info, DollarSign } from 'lucide-vue-next';

// Navigation items
const navItems = [
  {
    label: 'Home',
    to: '#home',
    icon: Home
  },
  {
    label: 'Radio',
    to: '#radio',
    icon: BarChart2
  },
  {
    label: 'News',
    to: '#news',
    icon: Newspaper
  },
  {
    label: 'Ads',
    to: '#advertisements',
    icon: DollarSign
  },
  {
    label: 'Forums',
    to: '#forum',
    icon: Users
  },
  {
    label: 'About Us',
    to: '#about',
    icon: Info
  }
];

// Mobile menu state
const isOpen = ref(false);
const mobileMenu = ref(null);
const mobileMenuHeight = ref(0);

// Active link tracking
const activeLink = ref('#home');
const scrolled = ref(false);

// Handle scroll for navbar background
const handleScroll = () => {
  scrolled.value = window.scrollY > 10;
  
  // Removing section tracking based on scroll position
  /*
  // Update active section based on scroll position
  const sections = document.querySelectorAll('section');
  let currentActive = '#home';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= (sectionTop - 150) && window.scrollY < (sectionTop + sectionHeight - 150)) {
      if (section.id) {
        currentActive = `#${section.id}`;
      }
    }
  });
  
  activeLink.value = currentActive;
  */
};

// Set active link manually when clicked
const setActiveLink = (link) => {
  activeLink.value = link;
  
  // Smooth scroll to section
  const targetElement = document.querySelector(link);
  if (targetElement) {
    window.scrollTo({
      top: targetElement.offsetTop - 100,
      behavior: 'smooth'
    });
  }
};

// Calculate mobile menu height when it's shown
const calculateMenuHeight = () => {
  if (mobileMenu.value) {
    mobileMenuHeight.value = mobileMenu.value.scrollHeight;
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check initial scroll position
  calculateMenuHeight();
  window.addEventListener('resize', calculateMenuHeight);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', calculateMenuHeight);
});
</script>

<script>
// NavLink component
export default {
  components: {
    NavLink: {
      props: {
        to: String,
        label: String,
        active: Boolean
      },
      template: `
        <a 
          :href="to" 
          class="relative px-5 py-2 rounded-full text-base font-medium transition-all duration-300"
          :class="active ? 'text-white' : 'text-slate-300 hover:text-white'"
          @click.prevent="$emit('click')"
        >
          <span class="relative z-10">{{ label }}</span>
          <span 
            class="absolute inset-0 bg-gradient-to-r from-capital-blue to-blue-600 rounded-full opacity-0 transition-opacity duration-300" 
            :class="active ? 'opacity-100' : 'hover:opacity-10'"
          ></span>
          <span 
            class="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-capital-yellow rounded-full transition-all duration-300"
            :class="active ? 'w-6' : 'w-0'"
          ></span>
        </a>
      `
    }
  }
}
</script>

<style scoped>
/* Add any additional custom styles here */
</style> 