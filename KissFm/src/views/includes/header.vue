<template>
  <div class="relative">
    <!-- Main Header with Purple Background -->
    <header 
      :class="[
        'fixed top-0 left-0 right-0 z-40 bg-purple-900 overflow-visible transition-all duration-300 ease-in-out',
        {
          'transform -translate-y-full': isHidden,
          'transform translate-y-0': !isHidden,
          'bg-black/90 backdrop-blur-xl': isScrolled,
          'shadow-lg shadow-black/50': isScrolled
        }
      ]"
    >
      <!-- Curved Background with Black -->
      <div class="absolute inset-0 bg-black curved-bg" :class="{ 'opacity-80': isScrolled }"></div>
      <div class="absolute inset-0 bg-black/20 curved-bg"></div>
      
      <!-- Sliding Shine Effect -->
      <div class="absolute inset-0 bg-white/5 curved-bg animate-shine"></div>
      
      <!-- Header Content -->
      <div 
        :class="[
          'relative z-10 max-w-6xl mx-auto px-6 flex items-center justify-between transition-all duration-300',
          isScrolled ? 'h-20' : 'h-28 md:h-32'
        ]"
      >
        
        <!-- Left Menu Button -->
        <div class="flex-1 flex justify-start">
          <button 
            @click="toggleMenu" 
            :class="[
              'bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/20',
              isScrolled ? 'p-2' : 'p-3 md:p-4'
            ]"
          >
            <div class="transition-transform duration-300" :class="{ 'rotate-90': isOpen }">
              <X v-if="isOpen" :size="isScrolled ? 20 : 24" />
              <Menu v-else :size="isScrolled ? 20 : 24" />
            </div>
          </button>
        </div>

        <!-- Center Logo -->
        <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div class="relative mb-2 group">
            <div 
              :class="[
                'relative transition-all duration-500 group-hover:scale-110',
                isScrolled ? 'w-12 h-12' : 'w-20 h-20 md:w-24 md:h-24'
              ]"
            >
              <!-- Logo -->
              <router-link to="/" class="absolute animate-rotate-slow">
                <img src="/logokiis.png" alt="KIIS Logo" class="w-full h-full object-contain">
              </router-link>
              
              <!-- Shine Effect -->
              <div class="absolute inset-0 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
            </div>
          </div>
          
          <!-- Tagline -->
          <div 
            :class="[
              'text-white/90 font-semibold tracking-widest text-center transition-all duration-300',
              isScrolled ? 'text-xs opacity-0' : 'text-xs md:text-sm opacity-100'
            ]"
          >
            <span class="text-pink-200">
              FRESH HITS FOR UGANDA
            </span>
          </div>
        </div>

        <!-- Right Play Button -->
        <div class="flex-1 flex justify-end">
          <!-- Desktop Button -->
          <button 
            @click="togglePlayPause" 
            :disabled="isLoading"
            :class="[
              'hidden md:flex relative group overflow-hidden bg-pink-500 hover:bg-pink-600 rounded-2xl text-white font-bold transition-all duration-500 transform hover:scale-105 hover:shadow-lg hover:shadow-pink-500/30 disabled:opacity-50',
              isScrolled ? 'px-4 py-2 text-sm' : 'px-6 py-3'
            ]"
          >
            <div class="absolute inset-0 bg-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-sm -z-10"></div>
            <div class="flex items-center space-x-3 relative z-10">
              <div v-if="isLoading" :class="isScrolled ? 'w-4 h-4' : 'w-5 h-5'" class="border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <Volume2 v-else-if="isPlaying" :size="isScrolled ? 16 : 20" class="animate-bounce" />
              <Play v-else :size="isScrolled ? 16 : 20" />
              <span class="tracking-wide" :class="isScrolled ? 'text-xs' : 'text-sm'">
                {{ isLoading ? 'CONNECTING' : isPlaying ? 'LIVE' : 'TUNE IN' }}
              </span>
            </div>
          </button>

          <!-- Mobile Button -->
          <button 
            @click="togglePlayPause" 
            :disabled="isLoading"
            :class="[
              'md:hidden rounded-2xl backdrop-blur-xl border transition-all duration-500 transform hover:scale-105',
              isScrolled ? 'p-2' : 'p-3',
              isPlaying 
                ? 'bg-pink-500/30 border-pink-400/50 text-pink-300 shadow-lg shadow-pink-500/20' 
                : isLoading 
                ? 'bg-pink-500/20 border-pink-400/30 text-pink-300 cursor-not-allowed opacity-50' 
                : 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:shadow-lg hover:shadow-pink-500/20'
            ]"
          >
            <div v-if="isLoading" :class="isScrolled ? 'w-4 h-4' : 'w-5 h-5'" class="border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            <Pause v-else-if="isPlaying" :size="isScrolled ? 16 : 20" />
            <Play v-else :size="isScrolled ? 16 : 20" />
          </button>
        </div>
      </div>
    </header>

    <!-- Spacer to prevent content jumping -->
    <div :class="isScrolled ? 'h-20' : 'h-28 md:h-32'"></div>

    <!-- Full Screen Menu -->
    <transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="isOpen" class="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl">
        <!-- Background -->
        <div class="absolute inset-0 bg-purple-900/20"></div>
        
        <div class="relative z-10 h-full flex items-center justify-center p-6">
          
          <!-- Close Button - Fixed Position -->
          <button
            @click="toggleMenu"
            class="absolute top-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105 z-50"
          >
            <X :size="24" />
          </button>

          <!-- Menu Content -->
          <div class="text-center max-w-4xl mx-auto w-full">
            
            <!-- Menu Logo -->
            <div class="mb-12">
              <div class="flex items-center justify-center space-x-4 mb-6">
                <div class="w-16 h-16 relative">
                  <div class="absolute inset-0 bg-pink-500 rounded-full p-1">
                    <div class="w-full h-full bg-white rounded-full flex items-center justify-center shadow-inner">
                      <div class="text-center">
                        <div class="text-gray-800 font-black text-base">KIIS</div>
                        <div class="text-pink-500 font-bold text-xs">100.9</div>
                      </div>
                    </div>
                  </div>
                </div>
                <h2 class="text-3xl md:text-4xl font-black text-white tracking-tight">
                  <span class="text-pink-200">
                    KIIS 100.9
                  </span>
                </h2>
              </div>
              <p class="text-white/70 text-lg font-medium">Uganda's Premium Hit Station</p>
            </div>

            <!-- Navigation Links -->
            <nav class="mb-12">
              <div class="space-y-4">
                <router-link
                  v-for="(item, index) in navItems"
                  :key="index"
                  :to="{ name: item.to }"
                  @click="toggleMenu"
                  class="block text-2xl md:text-3xl font-light text-white/70 hover:text-white transition-all duration-500 transform hover:scale-105 uppercase tracking-widest relative group py-2"
                  :style="{ animationDelay: `${index * 0.1}s` }"
                >
                  <span class="relative z-10">{{ item.label }}</span>
                  <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-full h-0.5 bg-pink-500 transition-all duration-500"></div>
                </router-link>
              </div>
            </nav>

            <!-- Live Button -->
            <div class="mb-12">
              <button
                @click="togglePlayPause"
                :disabled="isLoading"
                :class="[
                  'group relative overflow-hidden px-8 md:px-12 py-4 md:py-6 font-bold text-lg md:text-xl transition-all duration-500 transform hover:scale-105 rounded-2xl',
                  isPlaying 
                    ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-500/30' 
                    : isLoading 
                    ? 'bg-pink-500/20 text-pink-300 cursor-not-allowed border border-pink-400/30' 
                    : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:shadow-lg hover:shadow-pink-500/20'
                ]"
              >
                <div class="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div class="flex items-center justify-center space-x-3 relative z-10">
                  <div v-if="isLoading" class="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <Volume2 v-else-if="isPlaying" :size="24" class="animate-bounce" />
                  <Play v-else :size="24" />
                  
                  <span>
                    {{ isLoading ? 'CONNECTING...' : isPlaying ? 'ON AIR • LIVE' : 'LISTEN LIVE' }}
                  </span>
                </div>
              </button>
            </div>

            <!-- Social Links -->
            <div>
              <h6 class="text-white/50 font-semibold mb-6 text-lg tracking-wide">Connect With Us</h6>
              <div class="flex justify-center space-x-6">
                <a
                  v-for="(social, index) in socialLinks"
                  :key="index"
                  :href="social.href"
                  class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 text-white/70 hover:text-white transition-all duration-500 transform hover:scale-110 hover:bg-white/20 hover:shadow-lg hover:shadow-pink-500/20"
                  :style="{ animationDelay: `${index * 0.1 + 0.8}s` }"
                >
                  <component :is="social.icon" :size="24" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { 
  Menu, X, Play, Pause, Volume2,
  Facebook, Twitter, Instagram, Linkedin
} from 'lucide-vue-next'

const store = useStore()
const route = useRoute()

// State
const isOpen = ref(false)
const scrollY = ref(0)
const lastScrollY = ref(0)
const isHidden = ref(false)

// Computed
const isPlaying = computed(() => store.getters.isPlaying)
const isLoading = computed(() => store.getters.isLoading)
const isScrolled = computed(() => scrollY.value > 50)

// Navigation items
const navItems = [
  { label: 'Home', to: 'welcome' },
  { label: 'Radio Shows', to: 'radio_shows' },
  { label: 'News', to: 'news' },
  { label: 'Events', to: 'events' },
  { label: 'Forums', to: 'forums' },
  { label: 'About', to: 'about_us' }
]

// Social media links
const socialLinks = [
  { icon: Facebook, href: '#' },
  { icon: Twitter, href: '#' },
  { icon: Instagram, href: '#' },
  { icon: Linkedin, href: '#' }
]

// Scroll handler
const handleScroll = () => {
  scrollY.value = window.scrollY
  
  if (scrollY.value > lastScrollY.value && scrollY.value > 100) {
    isHidden.value = true
  } else {
    isHidden.value = false
  }
  
  lastScrollY.value = scrollY.value
}

// Methods
const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const togglePlayPause = async () => {
  try {
    await store.dispatch('togglePlayPause')
  } catch (err) {
    console.error('Failed to toggle playback:', err)
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

/* Font Family */
* {
  font-family: 'Inter', sans-serif;
}

/* Curved Background */
.curved-bg {
  clip-path: polygon(
    0% 0%, 
    100% 0%, 
    100% 70%, 
    62% 70%, 
    60% 72%, 
    58% 75%, 
    56% 78%, 
    54% 82%, 
    52% 86%, 
    50% 90%, 
    48% 86%, 
    46% 82%, 
    44% 78%, 
    42% 75%, 
    40% 72%, 
    38% 70%, 
    0% 70%
  );
}

/* Custom Animations */
@keyframes shine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes rotate-slow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes shimmer {
  0%, 100% { 
    opacity: 0; 
    transform: translateX(-100%) rotate(45deg); 
  }
  50% { 
    opacity: 0.3; 
    transform: translateX(100%) rotate(45deg); 
  }
}

.animate-shine {
  animation: shine 8s linear infinite;
}

.animate-rotate-slow {
  animation: rotate-slow 20s linear infinite;
}

.animate-shimmer {
  animation: shimmer 3s ease-in-out infinite;
}

/* Custom Transitions */
.nav-link {
  animation: fadeInLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Enhanced Glass Effect */
.backdrop-blur-xl {
  backdrop-filter: blur(20px);
}

/* Smooth Hover Transitions */
button, a {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Shadow Enhancement */
.shadow-inner {
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>