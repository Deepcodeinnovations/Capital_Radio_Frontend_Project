<template>
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden backgroundFixed"  style="margin-top: -5rem !important; background-image: url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" >
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70"></div>
      </div>
  
      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden opacity-20">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-[#F8CB00] rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-72 h-72 bg-red-500 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
        <div class="absolute top-1/2 right-1/3 w-48 h-48 bg-blue-500 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
      </div>
  
      <!-- Hero Content -->
      <div class="relative z-10 container mx-auto px-6 text-center">
        <!-- Hero Badge -->
        <div class="inline-flex items-center justify-center mb-8">
          <div class="h-px w-12 bg-[#F8CB00]"></div>
          <span class="mx-4 text-[#F8CB00] font-bold tracking-wider text-sm uppercase">Our Story</span>
          <div class="h-px w-12 bg-[#F8CB00]"></div>
        </div>
  
        <!-- Main Heading -->
        <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          About <span class="text-[#F8CB00]">Capital FM</span>
        </h1>
  
        <!-- Subtitle -->
        <p class="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
          Uganda's premier radio station, delivering fresh hits and quality entertainment since 1993
        </p>
  
        <!-- Stats Row -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto">
          <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-[#F8CB00] mb-2">30+</div>
            <div class="text-sm text-gray-300 uppercase tracking-wide">Years On Air</div>
          </div>
          <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-[#F8CB00] mb-2">1M+</div>
            <div class="text-sm text-gray-300 uppercase tracking-wide">Daily Listeners</div>
          </div>
          <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-[#F8CB00] mb-2">91.3</div>
            <div class="text-sm text-gray-300 uppercase tracking-wide">FM Frequency</div>
          </div>
          <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-[#F8CB00] mb-2">24/7</div>
            <div class="text-sm text-gray-300 uppercase tracking-wide">Broadcasting</div>
          </div>
        </div>
  
        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
      

            <button
              @click="togglePlayPause"
              :disabled="isLoading"
              class="relative group overflow-hidden rounded-2xl"
            >
              <div class="absolute -inset-0.5 bg-gradient-to-r from-[#F8CB00] via-red-500 to-blue-500 rounded-2xl blur opacity-60 group-hover:opacity-80 transition duration-300"></div>
              <div class="relative bg-gradient-to-r from-[#F8CB00] to-red-500 px-8 py-4 rounded-2xl text-black font-bold flex items-center space-x-3 transition-all duration-300">
                <div v-if="isLoading" class="w-5 h-5 border-2 rounded-full border-black border-t-transparent animate-spin"></div>
                <Volume2 v-else-if="isPlaying" :size="20" class="animate-bounce" />
                <Play v-else :size="20" />
                <span class="tracking-wide" v-if="isLoading">CONNECTING</span>
                <span class="tracking-wide" v-else-if="isPlaying">LISTENING LIVE</span>
                <span class="tracking-wide" v-else>TUNE IN NOW</span>
              </div>
            </button>
          
          <button @click="scrollToShows" class="bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300">
            <span class="tracking-wide">More About Us</span>
          </button>
        </div>
      </div>
  
      <!-- Scroll Indicator -->
      <div @click="scrollToShows" class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div class="flex flex-col items-center text-white/60">
          <span class="text-sm mb-2">Scroll to learn more</span>
          <div class="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div class="w-1 h-3 bg-white/60 rounded-full animate-bounce mt-2"></div>
          </div>
        </div>
      </div>
  
      <!-- Bottom Wave Divider -->
      <div class="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="w-full h-16">
          <path fill="white" d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,31,17,94.98,30.44c64.64,13.91,93.29,29.88,150.17,38.07,65.88,9.2,165.63,17.05,240.88,12.55Z" />
        </svg>
      </div>
    </section>
  
    <!-- Content Sections -->
    <div class="bg-white shows-content">
      <AboutPreview />
      <OurTeam />
      <OnAirSection />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { 
    Search, Calendar, ChevronDown, X, Play, Volume2, Star, Radio, 
    Clock, Timer, Headphones, Heart, Download, Share2
  } from 'lucide-vue-next';
  import {useStore} from 'vuex';
  import AboutPreview from './components/AboutPreview.vue';
  import OurTeam from './components/OurTeam.vue';
  import OnAirSection from './components/OnAirSection.vue';
  const isPlaying = computed(() => store.getters.isPlaying)
  const isLoading = computed(() => store.getters.isLoading)
const store = useStore();
const togglePlayPause = async () => {
    try {
        await store.dispatch('togglePlayPause')
    } catch (err) {
        console.error('Failed to toggle playback:', err)
    }
}


const scrollToShows = () => {
    document.getElementById('shows-content').scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };
  </script>