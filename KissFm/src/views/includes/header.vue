<template>
  <div>
    <!-- Enhanced Navigation Header -->
    <header class="relative z-40 ">
      <div class="container mx-auto px-4 md:px-6">
        <div class="flex items-center justify-between h-16 md:h-20">
          
          <!-- Logo Section -->
          <div class="flex items-center">
            <div class="flex items-center space-x-2 md:space-x-3">
              <div class="h-[90px] md:h-[130px] pt-[20px] md:pt-[40px]">
                <img src="/logo2.png" alt="Capital FM Logo" class="w-full h-full object-contain">
              </div>
            </div>
          </div>

          <nav class="hidden lg:flex items-center space-x-8 pt-10">
            <router-link 
              v-for="(item, index) in navItems" 
              :key="index" 
              :to="{name: item.to}" 
              :class="{ 'border-b-2 border-blue-400': $route.name === item.to }" 
              class="text-white text-lg font-bold hover:text-red-200 transition-colors pb-1"
            >
              {{ item.label }}
            </router-link>
          </nav>

          <!-- Right Controls -->
          <div class="flex items-center space-x-2 md:space-x-3 pt-6 md:pt-8">
            
            <!-- Desktop Listen Live Button -->
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

            <!-- Mobile Play Button -->
            <button
              @click="togglePlayPause"
              :disabled="isLoading"
              :class="[
                'md:hidden p-2.5 rounded-full backdrop-blur-md border transition-all duration-300',
                isPlaying 
                  ? 'bg-[#F8CB00]/80 border-[#F8CB00]/80 text-white' 
                  : isLoading 
                  ? 'bg-blue-500/90 border-blue-400 text-white cursor-not-allowed' 
                  : 'bg-red-500/90 border-red-400 text-white hover:bg-red-600/90'
              ]"
            >
              <div v-if="isLoading" class="w-5 h-5 border-2 border-white border-t-transparent animate-spin"></div>
              <Pause v-else-if="isPlaying" :size="20" />
              <Play v-else :size="20" />
            </button>

            <!-- Menu Toggle -->
            <button
              @click="toggleMenu"
              class="p-2.5 bg-white/10 backdrop-blur-md rounded-full text border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            >
              <X v-if="isOpen" :size="28" />
              <Menu v-else :size="28" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Full Screen Menu -->
    <div v-if="isOpen" class="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl">
      <div class="container mx-auto px-4 md:px-6 h-full flex items-center justify-center">
        
        <button
          @click="toggleMenu"
          class="absolute top-4 md:top-6 right-4 md:right-6 p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          <X :size="24" />
        </button>

        <div class="text-center max-w-4xl mx-auto">
          
          <div class="mb-8 md:mb-12">
            <div class="flex items-center justify-center space-x-3 mb-4">
              <div class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-red-500 flex items-center justify-center">
                <span class="text-white font-bold text-xl">FM</span>
              </div>
              <h2 class="text-3xl md:text-4xl font-bold text-white">Capital FM</h2>
            </div>
            <p class="text-white/60">Uganda's Premier Radio Station</p>
          </div>

          <nav class="mb-8 md:mb-12">
            <ul class="space-y-4 md:space-y-6">
              <li v-for="(item, index) in navItems" :key="index">
                <router-link
                  :to="item.to"
                  @click="toggleMenu"
                  class="block text-2xl md:text-3xl lg:text-4xl font-light text-white/80 hover:text-white transition-all duration-500 transform hover:scale-110 uppercase tracking-wider"
                >
                  {{ item.label }}
                </router-link>
              </li>
            </ul>
          </nav>

          <div class="mb-8 md:mb-12">
            <button
              @click="togglePlayPause"
              :disabled="isLoading"
              :class="[
                'flex items-center justify-center space-x-3 mx-auto px-8 md:px-12 py-4 md:py-6 font-bold text-lg md:text-xl transition-all duration-300 transform hover:scale-105 shadow-xl',
                isPlaying 
                  ? 'bg-yellow-500 text-white shadow-yellow-500/30' 
                  : isLoading 
                  ? 'bg-blue-500 text-white cursor-not-allowed' 
                  : 'bg-red-500 text-white shadow-red-500/30'
              ]"
            >
              <div v-if="isLoading" class="w-6 h-6 border-2 border-white border-t-transparent animate-spin"></div>
              <Volume2 v-else-if="isPlaying" :size="24" class="animate-bounce" />
              <Play v-else :size="24" />
              
              <span v-if="isLoading">CONNECTING...</span>
              <span v-else-if="isPlaying">ON AIR • LIVE</span>
              <span v-else>LISTEN LIVE</span>
            </button>
          </div>

          <div>
            <h6 class="text-white/60 font-semibold mb-4 md:mb-6 text-base md:text-lg">Follow Us</h6>
            <div class="flex justify-center space-x-4 md:space-x-6">
              
                <a
                v-for="(social, index) in socialLinks"
                :key="index"
                :href="social.href"
                :class="[
                  'p-3 md:p-4 bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all duration-300 transform hover:scale-110',
                  social.color
                ]"
              >
                <component :is="social.icon" :size="24" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { 
  Menu, X, Play, Pause, Volume2, Waves,
  Facebook, Twitter, Instagram, Linkedin
} from 'lucide-vue-next'

const store = useStore()
const route = useRoute()

// State
const isOpen = ref(false)

// Computed
const isPlaying = computed(() => store.getters.isPlaying)
const isLoading = computed(() => store.getters.isLoading)

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
  { icon: Facebook, href: '#', color: 'hover:bg-blue-600' },
  { icon: Twitter, href: '#', color: 'hover:bg-sky-500' },
  { icon: Instagram, href: '#', color: 'hover:bg-pink-600' },
  { icon: Linkedin, href: '#', color: 'hover:bg-blue-700' }
]

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
</script>