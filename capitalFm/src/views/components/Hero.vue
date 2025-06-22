<template>
  <div class="relative overflow-hidden" >
    <!-- Main Hero Section -->
    <div class="relative" >
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
            <!-- Enhanced Overlay -->
            <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/20"></div>
          </div>
        </div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-30 flex items-center min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-2rem)]">
        <div class="container mx-auto px-4 md:px-6 mt-[calc(100vh-55rem)] md:mt-[calc(100vh-53rem)]">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            <!-- Main Content -->
            <div class="lg:col-span-8 text-center lg:text-left order-2 lg:order-1">
              
              <!-- Content Badge -->
              <div class="inline-flex items-center rounded-full space-x-2 bg-white/10 backdrop-blur-md px-3 md:px-4 py-2 border border-white/20 mb-4 md:mb-6">
                <div class="w-2 h-2 bg-[#F8CB00] animate-pulse"></div>
                <span class="text-white/90 font-medium text-xs md:text-sm uppercase tracking-wider">
                  {{ currentSlideData?.type === 'advert' ? 'Featured' : currentSlideData?.type === 'news' ? 'Breaking News' : 'Live Radio' }}
                </span>
              </div>

              <!-- Main Headline -->
              <h1 class="text-xl sm:text-md md:text-1xl lg:text-3xl xl:text-4xl font-bold mb-4 md:mb-6 leading-tight">
                <span class="bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent">
                  {{ truncateText(currentSlideData?.title || 'Capital FM 91.3', 60) }}
                </span>
              </h1>

              <!-- Subtitle -->
              <p class="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-6 md:mb-8 leading-relaxed max-w-4xl">
                {{ truncateText(currentSlideData?.description || 'Uganda\'s Premier Radio Station - Fresh Hits, Breaking News & Entertainment', 90) }}
              </p>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <!-- Primary Action -->
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

                <!-- Secondary Action for Adverts -->
                <button
                  v-if="currentSlideData?.type === 'advert' && currentSlideData?.target_url"
                  @click="handleAdvertClick"
                  class="group rounded-full flex items-center justify-center space-x-3 px-6 md:px-8 py-3 md:py-4 font-bold text-base md:text-lg transition-all duration-500 transform hover:scale-105 shadow-xl backdrop-blur-md border-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <ExternalLink :size="24" class="group-hover:scale-110 transition-transform duration-300" />
                  <span>{{ currentSlideData?.button_title || 'LEARN MORE' }}</span>
                </button>
                <button
                  v-else
                  @click="handleDetailsClick(currentSlideData)"
                  class="group rounded-full flex items-center justify-center space-x-3 px-6 md:px-8 py-3 md:py-4 font-bold text-base md:text-lg transition-all duration-500 transform hover:scale-105 shadow-xl backdrop-blur-md border-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <ExternalLink :size="24" class="group-hover:scale-110 transition-transform duration-300" />
                  <span>Read Details</span>
                </button>
              </div>

              <!-- Stats Section -->
              <div class="grid grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12 max-w-md mx-auto lg:mx-0">
                <div class="text-center lg:text-left">
                  <div class="text-2xl md:text-3xl font-bold text-white mb-1">91.3</div>
                  <div class="text-xs md:text-sm text-white/70">MHz Frequency</div>
                </div>
                <div class="text-center lg:text-left">
                  <div class="text-2xl md:text-3xl font-bold text-white mb-1">24/7</div>
                  <div class="text-xs md:text-sm text-white/70">Broadcasting</div>
                </div>
                <div class="text-center lg:text-left">
                  <div class="text-2xl md:text-3xl font-bold text-white mb-1">{{ currentStation?.listeners || '+' }}+</div>
                  <div class="text-xs md:text-sm text-white/70">Listeners</div> 
                </div>
              </div>

              <!-- Frequency Grid for Different Districts -->
              <div class="mt-8 md:mt-12">
                <h3 class="text-white font-bold text-lg md:text-xl mb-4 text-center lg:text-left">Broadcasting Across Uganda</h3>
                <div class="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
                  <div v-for="(freq, index) in frequencies" :key="index" class="group relative">
                    <div class="absolute -inset-1 bg-gradient-to-br from-yellow-500/20 to-red-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div class="relative bg-black/30 backdrop-blur-sm p-3 rounded-lg text-center border border-white/20 hover:border-yellow-400/50 transition-all duration-300 transform hover:scale-105">
                      <div class="text-lg font-bold text-yellow-400 mb-1">{{ freq.freq }}</div>
                      <div class="text-xs text-white/70 font-medium">{{ freq.location }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- On Air Card -->
            <div class="lg:col-span-4 order-1 lg:order-2 hidden lg:block">
              <div class="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 shadow-2xl max-w-md mx-auto">
                <!-- Live Indicator -->
                <div class="flex items-center space-x-3 mb-6">
                  <div class="relative">
                    <div class="w-3 h-3 bg-red-500 animate-pulse"></div>
                    <div class="absolute inset-0 w-3 h-3 bg-red-500 animate-ping"></div>
                  </div>
                  <span class="text-red-400 font-bold text-sm uppercase tracking-wider">ON AIR NOW</span>
                </div>
                
                <!-- Show Info -->
                <div class="mb-6">
                  <h3 class="text-white font-bold text-xl md:text-2xl mb-2">{{ currentShow?.program.title }}</h3>
                  <p class="text-white/80 text-base md:text-lg mb-3">with {{ getCurrentSessionHosts(currentShow) }}</p>
                  <div class="flex items-center text-white/60 text-sm">
                    <Clock :size="16" class="mr-2" />
                    <span>{{ currentShow?.start_time }} - {{ currentShow?.end_time }}</span>
                  </div>
                </div>

                <!-- Quick Actions -->
                <div class="space-y-3 mb-6">
                  <button
                @click="togglePlayPause"
                :disabled="isLoading"
                class="relative group overflow-hidden rounded-2xl w-full"
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
                </div>

                <!-- Today's Programs -->
                <div class="border-t border-white/20 pt-6">
                  <h4 class="text-white font-bold text-lg mb-4">Today's Programs</h4>
                  <div class="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                    <div v-for="(session, index) in getTodaySchedule()" :key="index" 
                         @click="selectProgram(session)"
                         class="flex items-center p-3 rounded-xl transition-all duration-300 cursor-pointer group/session transform hover:scale-[1.02]"
                         :class="[
                           isCurrentSession(session) 
                             ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 border-l-4 border-red-500 shadow-lg shadow-red-500/10' 
                             : selectedProgram?.id === session.program_id 
                             ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 shadow-lg shadow-yellow-500/10'
                             : 'hover:bg-white/10 border border-transparent hover:border-white/30'
                         ]">
                      
                      <!-- Time display -->
                      <div class="w-16 text-right mr-3">
                        <span class="text-sm font-bold" 
                              :class="isCurrentSession(session) ? 'text-yellow-400' : 'text-white/60'">
                          {{ session.start_time }}
                        </span>
                      </div>
                      
                      <!-- Show details -->
                      <div class="flex-1">
                        <p class="font-bold text-sm" 
                           :class="isCurrentSession(session) ? 'text-white' : 'text-white/80 group-hover/session:text-white'">
                          {{ session.program?.title || 'Live Show' }}
                        </p>
                        <p class="text-xs text-white/50 font-medium">{{ getSessionHosts(session) }}</p>
                      </div>
                      
                      <!-- Status indicators -->
                      <div class="flex items-center gap-2">
                        <div v-if="isCurrentSession(session)" class="flex items-center gap-2">
                          <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
                          <span class="text-xs text-red-400 font-bold">LIVE</span>
                        </div>
                        <div v-else-if="isUpcoming(session)" class="flex items-center gap-2">
                          <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          <span class="text-xs text-blue-400 font-bold">NEXT</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Carousel Controls -->
      <div v-if="carouselItems && carouselItems.length > 1" class="absolute rounded-full bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div class="flex items-center space-x-3 bg-black/20 backdrop-blur-md px-4 py-3 rounded-full border border-white/20">
          <button
            @click="prevSlide"
            class="p-2 bg-white/10 text-white hover:bg-white/20 transition-all duration-300 rounded-lg"
          >
            <ChevronLeft :size="18" />
          </button>

          <div class="flex space-x-2">
            <button
              v-for="(slide, index) in carouselItems"
              :key="slide?.id || index"
              @click="setCurrentSlide(index)"
              :class="[
                'w-2 h-2 rounded-full transition-all duration-300',
                index === currentSlide 
                  ? 'bg-white w-6' 
                  : 'bg-white/50 hover:bg-white/75'
              ]"
            />
          </div>

          <button
            @click="nextSlide"
            class="p-2 bg-white/10 text-white hover:bg-white/20 transition-all duration-300 rounded-lg"
          >
            <ChevronRight :size="18" />
          </button>
        </div>
      </div>

      <!-- Bottom Wave Divider -->
      <div class="absolute bottom-0 left-0 w-full overflow-hidden" style="transform: translateY(1px);">
        <svg class="w-full h-auto" preserveAspectRatio="none" viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,60 C400,120 800,0 1200,60 L1200,120 L0,120 Z" fill="white"></path>
        </svg>
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
  Volume2, Waves, Clock, ExternalLink
} from 'lucide-vue-next'

const store = useStore()
const router = useRouter()

// State
const currentSlide = ref(0)
const carouselTimer = ref(null)
const selectedProgram = ref(null)

// Computed
const isPlaying = computed(() => store.getters.isPlaying)
const isLoading = computed(() => store.getters.isLoading)
const currentStation = computed(() => store.getters.station)
const adverts = computed(() => store.getters.adverts?.data || [])
const newsItems = computed(() => store.getters.breakingnews?.data || [])

// Frequency data
const frequencies = [
  { freq: '91.3', location: 'Kampala' },
  { freq: '90.9', location: 'Mbale' },
  { freq: '88.7', location: 'Mbarara' },
  { freq: '89.4', location: 'Fort Portal' },
  { freq: '96.9', location: 'Gulu' },
  { freq: '92.7', location: 'Arua' },
]

// Today's schedule
const todaySchedule = computed(() => {
  if (!currentStation.value?.schedule?.sessions) return [];
  const today = getCurrentDay();
  return currentStation.value.schedule.sessions[today] || [];
});

const getTodaySchedule = () => {
  if (!currentStation.value?.schedule?.sessions) return [];
  const today = getCurrentDay();
  return currentStation.value.schedule.sessions[today] || [];
};

// Current show
const currentShow = computed(() => {
  const currentTime = getCurrentTime();
  return todaySchedule.value.find(show => 
    isTimeBetween(currentTime, show.start_time, show.end_time)
  );
});

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
      title: 'Capital FM 91.3',
      description: 'Uganda\'s Premier Radio Station - Fresh Hits, Breaking News & Entertainment',
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
const getCurrentHosts = () => {
  if (!currentShow.value?.program?.hosts) return [];
  
  return currentShow.value.program.hosts.map(hostId => {
    const host = currentShow.value.program.hosts.find(h => h.id === hostId);
    return host || { id: hostId, name: 'Unknown Host', role: 'Host' };
  });
};

const getCurrentSessionHosts = (session) => {
 if (!session?.program?.hosts) return 'Live Presenters';
 
 const sessionHostIds = session.hosts || [];
 const hosts = session.program.hosts.filter(host => sessionHostIds.includes(host.id));
 return hosts.length > 0 ? hosts.map(h => h.name).join(' & ') : 'Live Presenters';
};

const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

const isTimeBetween = (currentTime, startTime, endTime) => {
  const current = currentTime.replace(':', '');
  const start = startTime.replace(':', '');
  const end = endTime.replace(':', '');
  
  if (end < start) {
    return current >= start || current <= end;
  }
  
  return current >= start && current <= end;
};

const getCurrentDay = () => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
};

const selectProgram = (session) => {
 selectedProgram.value = session.program;
};

const isCurrentSession = (session) => {
 const now = getCurrentTime();
 return isTimeBetween(now, session.start_time, session.end_time);
};

const isUpcoming = (session) => {
 const now = getCurrentTime();
 return now < session.start_time;
};

const getSessionHosts = (session) => {
 if (!session?.program?.hosts) return 'Live Presenters';
 
 const sessionHostIds = session.hosts || [];
 const hosts = session.program.hosts.filter(host => sessionHostIds.includes(host.id));
 return hosts.length > 0 ? hosts.map(h => h.name).join(' & ') : 'Live Presenters';
};

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
/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
 display: none;
}

/* Custom scrollbar for schedule */
.custom-scrollbar {
 scrollbar-width: thin;
 scrollbar-color: rgba(239, 68, 68, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
 width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
 background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
 background: linear-gradient(to bottom, #ef4444, #dc2626);
 border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
 background: linear-gradient(to bottom, #dc2626, #b91c1c);
}

/* Ensure smooth transitions */
* {
 -webkit-font-smoothing: antialiased;
 -moz-osx-font-smoothing: grayscale;
}
</style>