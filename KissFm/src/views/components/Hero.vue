<template>
  <div class="relative overflow-hidden">
    <!-- Main Hero Section -->
    <div class="relative">
      <!-- Background Carousel -->
      <div class="absolute inset-0">
        <div
          v-for="(slide, index) in carouselItems"
          :key="slide?.id || index"
          :class="[
            'absolute inset-0 transition-all duration-1000 ease-in-out',
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
          ]"
        >
          <!-- Background Image -->
          <div class="absolute inset-0">
            <img
              :src="slide?.image_url || slide?.featured_image_url || '/api/placeholder/1920/1080'"
              :alt="slide?.title || 'Background'"
              class="w-full h-full object-cover"
            />
            <!-- Enhanced Dark Overlay for Better Text Readability -->
            <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/20"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-black/40 via-black/30 to-black/20"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>
        </div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-30 flex items-center min-h-[calc(115vh-4rem)] md:min-h-[calc(115vh)]">
        <div class="container mx-auto px-4 md:px-6 mt-[calc(100vh-55rem)] md:mt-[calc(100vh-53rem)]">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <!-- Main Content - Full Width -->
            <div class="lg:col-span-12 text-center">
              
              <!-- Content Badge -->
              <div class="inline-flex items-center rounded-full space-x-2 bg-white/15 backdrop-blur-md px-4 md:px-5 py-2.5 border border-white/30 mb-5 md:mb-6">
                <div class="w-2.5 h-2.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
                <span class="text-white font-semibold text-sm md:text-base uppercase tracking-wider">
                  {{ currentSlideData?.type === 'advert' ? 'Sponsored' : currentSlideData?.type === 'news' ? 'Breaking News' : 'Live Radio' }}
                </span>
              </div>

              <!-- Main Headline -->
              <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-5 md:mb-7 leading-tight">
                <span class="bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent drop-shadow-lg">
                  {{ truncateText(currentSlideData?.title || 'KIIS 100.9', 60) }}
                </span>
              </h1>

              <!-- Subtitle -->
              <p class="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/95 mb-7 md:mb-10 leading-relaxed max-w-4xl mx-auto font-medium">
                {{ truncateText(currentSlideData?.description ??  currentSlideData?.excerpt ?? 'Uganda\'s Premier Hit Station - Fresh Hits, Breaking News & Entertainment', 180) }}
              </p>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-5 justify-center items-center mb-10 md:mb-14">
                <!-- Primary Action -->
                <button
                  @click="togglePlayPause"
                  :disabled="isLoading"
                  class="relative group overflow-hidden rounded-2xl transform hover:scale-105 transition-all duration-500"
                >
                  <div class="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-70 group-hover:opacity-100 transition duration-500"></div>
                  <div class="relative bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 rounded-2xl text-white font-bold flex items-center space-x-3 transition-all duration-300 shadow-2xl">
                    <div v-if="isLoading" class="w-5 h-5 border-3 rounded-full border-white/30 border-t-white animate-spin"></div>
                    <Volume2 v-else-if="isPlaying" :size="20" class="animate-bounce" />
                    <Play v-else :size="20" />
                    <span class="tracking-wide text-base font-black" v-if="isLoading">CONNECTING</span>
                    <span class="tracking-wide text-base font-black" v-else-if="isPlaying">LISTENING LIVE</span>
                    <span class="tracking-wide text-base font-black" v-else>TUNE IN NOW</span>
                  </div>
                </button>

                <!-- Secondary Action -->
                <button
                  v-if="currentSlideData?.type === 'advert' && currentSlideData?.target_url"
                  @click="handleAdvertClick"
                  class="group rounded-2xl flex items-center justify-center space-x-3 px-7 md:px-8 py-3.5 md:py-4 font-bold text-base md:text-lg transition-all duration-500 transform hover:scale-105 shadow-2xl backdrop-blur-md border-2 bg-white/20 border-white/40 text-white hover:bg-white/30"
                >
                  <ExternalLink :size="20" class="group-hover:scale-110 transition-transform duration-300" />
                  <span>{{ currentSlideData?.button_title || 'LEARN MORE' }}</span>
                </button>
                <button
                  v-else
                  @click="handleDetailsClick(currentSlideData)"
                  class="group rounded-2xl flex items-center justify-center space-x-3 px-7 md:px-8 py-3.5 md:py-4 font-bold text-base md:text-lg transition-all duration-500 transform hover:scale-105 shadow-2xl backdrop-blur-md border-2 bg-white/20 border-white/40 text-white hover:bg-white/30"
                >
                  <ExternalLink :size="20" class="group-hover:scale-110 transition-transform duration-300" />
                  <span>Read Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Left Carousel Control -->
      <div v-if="carouselItems && carouselItems.length > 1" class="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-30">
        <button
          @click="prevSlide"
          class="p-4 bg-black/30 backdrop-blur-xl text-white hover:bg-black/50 transition-all duration-300 rounded-full border border-white/20 shadow-2xl group"
        >
          <ChevronLeft :size="24" class="group-hover:scale-110 transition-transform duration-300" />
        </button>
      </div>

      <!-- Right Carousel Control -->
      <div v-if="carouselItems && carouselItems.length > 1" class="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-30">
        <button
          @click="nextSlide"
          class="p-4 bg-black/30 backdrop-blur-xl text-white hover:bg-black/50 transition-all duration-300 rounded-full border border-white/20 shadow-2xl group"
        >
          <ChevronRight :size="24" class="group-hover:scale-110 transition-transform duration-300" />
        </button>
      </div>

      <!-- Carousel Dots - Bottom Center -->
      <div v-if="carouselItems && carouselItems.length > 1" class="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 z-30">
        <div class="flex space-x-3 bg-black/20 backdrop-blur-xl px-4 py-3 rounded-full border border-white/20 shadow-xl">
          <button
            v-for="(slide, index) in carouselItems"
            :key="slide?.id || index"
            @click="setCurrentSlide(index)"
            :class="[
              'h-2 rounded-full transition-all duration-300',
              index === currentSlide 
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 w-6 shadow-lg' 
                : 'bg-white/50 hover:bg-white/75 w-2'
            ]"
          />
        </div>
      </div>

      <!-- Elegant Layered Bottom Border -->
      <div class="absolute bottom-0 left-0 w-full overflow-hidden z-20">
        <!-- Multiple Wave Layers for Depth -->
        <svg class="w-full h-auto" preserveAspectRatio="none" viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Back Wave Layer -->
          <path d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z" fill="url(#wave1)" opacity="0.4"/>
          
          <!-- Middle Wave Layer -->
          <path d="M0,70 C300,10 500,110 800,40 C900,20 1100,80 1200,50 L1200,120 L0,120 Z" fill="url(#wave2)" opacity="0.6"/>
          
          <!-- Front Wave Layer -->
          <path d="M0,80 C250,20 450,120 700,60 C850,30 1050,100 1200,70 L1200,120 L0,120 Z" fill="white"/>
          
          <!-- Decorative Elements -->
          <circle cx="100" cy="40" r="3" fill="url(#sparkle)" opacity="0.8">
            <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="300" cy="25" r="2" fill="url(#sparkle)" opacity="0.6">
            <animate attributeName="r" values="1;3;1" dur="3s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" repeatCount="indefinite"/>
          </circle>
          <circle cx="600" cy="35" r="4" fill="url(#sparkle)" opacity="0.7">
            <animate attributeName="r" values="3;5;3" dur="2.5s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx="900" cy="20" r="2.5" fill="url(#sparkle)" opacity="0.5">
            <animate attributeName="r" values="2;4;2" dur="4s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="4s" repeatCount="indefinite"/>
          </circle>
          <circle cx="1100" cy="45" r="3" fill="url(#sparkle)" opacity="0.9">
            <animate attributeName="r" values="2;5;2" dur="1.8s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0.4;1;0.4" dur="1.8s" repeatCount="indefinite"/>
          </circle>
          
          <!-- Gradient Definitions -->
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#ff6b9d;stop-opacity:1" />
              <stop offset="25%" style="stop-color:#8b5cf6;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#06b6d4;stop-opacity:1" />
              <stop offset="75%" style="stop-color:#8b5cf6;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#ff6b9d;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
              <stop offset="33%" style="stop-color:#f472b6;stop-opacity:1" />
              <stop offset="66%" style="stop-color:#a78bfa;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#fbbf24;stop-opacity:1" />
            </linearGradient>
            <radialGradient id="sparkle" cx="50%" cy="50%">
              <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
              <stop offset="70%" style="stop-color:#fbbf24;stop-opacity:0.8" />
              <stop offset="100%" style="stop-color:#ff6b9d;stop-opacity:0" />
            </radialGradient>
          </defs>
        </svg>
        
        <!-- Floating Geometric Elements -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <!-- Triangles -->
          <div class="absolute bottom-8 left-[15%] w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-pink-400/40 animate-gentle-float"></div>
          <div class="absolute bottom-12 right-[20%] w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-purple-400/50 animate-gentle-float-delayed"></div>
          
          <!-- Diamonds -->
          <div class="absolute bottom-10 left-[60%] w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rotate-45 opacity-60 animate-gentle-float-slow"></div>
          <div class="absolute bottom-6 right-[70%] w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rotate-45 opacity-50 animate-gentle-float"></div>
          
          <!-- Stars -->
          <div class="absolute bottom-14 left-[80%] text-yellow-400 opacity-70 animate-gentle-float-delayed">✦</div>
          <div class="absolute bottom-7 left-[30%] text-pink-400 opacity-60 animate-gentle-float-slow">✧</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { 
  Play, Pause, ChevronLeft, ChevronRight,
  Volume2, ExternalLink
} from 'lucide-vue-next'

const store = useStore()
const router = useRouter()

// State
const currentSlide = ref(0)
const carouselTimer = ref(null)

// Computed
const isPlaying = computed(() => store.getters.isPlaying)
const isLoading = computed(() => store.getters.isLoading)
const currentStation = computed(() => store.getters.station)
const adverts = computed(() => store.getters.adverts?.data || [])
const newsItems = computed(() => store.getters.breakingnews?.data || [])

// Carousel items
const carouselItems = computed(() => {
  const items = []
  
  if (adverts.value && Array.isArray(adverts.value)) {
    adverts.value.forEach(advert => {
      if (advert) {
        items.push({
          ...advert,
          type: 'advert',
          image: advert.image_url
        })
      }
    })
  }
  
  if (newsItems.value && Array.isArray(newsItems.value)) {
    newsItems.value.forEach(news => {
      if (news && news.status && news.state) {
        items.push({
          ...news,
          type: 'news',
          image: news.image_url || '/api/placeholder/1920/1080'
        })
      }
    })
  }
  
  if (items.length === 0) {
    return [{
      id: 'fallback',
      title: 'KIIS 100.9',
      description: 'Uganda\'s Premier Hit Station - Fresh Hits, Breaking News & Entertainment',
      image: '/api/placeholder/1920/1080',
      type: 'default'
    }]
  }
  
  return items
})

const currentSlideData = computed(() => {
  if (!carouselItems.value || carouselItems.value.length === 0) return null
  return carouselItems.value[currentSlide.value] || null
})

// Helper methods
const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const togglePlayPause = async () => {
  try {
    await store.dispatch('togglePlayPause');
  } catch (err) {
    console.error('Failed to toggle playbook:', err);
  }
}

const handleAdvertClick = () => {
  if (currentSlideData.value?.target_url) {
    if (currentSlideData.value.id) {
      store.dispatch('trackAdvertClick', currentSlideData.value.id)
    }
    window.open(currentSlideData.value.target_url, '_blank')
  }
}

const handleDetailsClick = (slideData) => {
  let id = slideData.slug;
  router.push({name:'news_details', params:{id:id}})
  console.log(slideData)
}

const nextSlide = () => {
  if (!carouselItems.value || carouselItems.value.length === 0) return
  currentSlide.value = (currentSlide.value + 1) % carouselItems.value.length
  resetCarouselTimer()
}

const prevSlide = () => {
  if (!carouselItems.value || carouselItems.value.length === 0) return
  currentSlide.value = (currentSlide.value - 1 + carouselItems.value.length) % carouselItems.value.length
  resetCarouselTimer()
}

const setCurrentSlide = (index) => {
  if (!carouselItems.value || index >= carouselItems.value.length) return
  currentSlide.value = index
  resetCarouselTimer()
}

const startCarouselTimer = () => {
  if (!carouselItems.value || carouselItems.value.length <= 1) return
  
  carouselTimer.value = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % carouselItems.value.length
  }, 7000)
}

const stopCarouselTimer = () => {
  if (carouselTimer.value) {
    clearInterval(carouselTimer.value)
    carouselTimer.value = null
  }
}

const resetCarouselTimer = () => {
  stopCarouselTimer()
  startCarouselTimer()
}

onMounted(() => {
  if (carouselItems.value && carouselItems.value.length > 1) {
    startCarouselTimer()
  }
})

onUnmounted(() => {
  stopCarouselTimer()
})
</script>

<style scoped>
/* Floating animations for love elements */
@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
    opacity: 0.6;
  }
  50% { 
    transform: translateY(-20px) rotate(180deg); 
    opacity: 1;
  }
}

@keyframes float-delayed {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
    opacity: 0.5;
  }
  50% { 
    transform: translateY(-15px) rotate(-180deg); 
    opacity: 0.8;
  }
}

@keyframes float-slow {
  0%, 100% { 
    transform: translateY(0px) scale(1); 
    opacity: 0.7;
  }
  50% { 
    transform: translateY(-25px) scale(1.2); 
    opacity: 1;
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 5s ease-in-out infinite 1s;
}

.animate-float-slow {
  animation: float-slow 6s ease-in-out infinite 2s;
}

/* Enhanced text shadows for better readability */
.drop-shadow-lg {
  filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
}

/* Smooth transitions */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Enhanced backdrop blur for better glass effect */
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
}

/* Custom gradient text effects */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}
</style>