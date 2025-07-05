<template>
  <section class="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900" ref="sectionRef">
    <!-- Top Fade to White -->
    <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white via-white/50 to-transparent z-5"></div>
    
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0">
      <div class="w-full h-full relative">
        <img 
          src="https://images.squarespace-cdn.com/content/v1/5790f413c534a51bba9cf004/1554579539137-3YJDGI1TRZUNJZUY4FOG/_DSC5797.JPG?format=1000w" 
          alt="Radio Studio Background" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-br from-black/70 via-purple-900/60 to-pink-900/70"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
      </div>
    </div>

    <!-- Floating background elements with KIIS styling -->
    <div class="absolute inset-0 overflow-hidden opacity-10 pointer-events-none z-10">
      <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-3xl animate-gentle-float"></div>
      <div class="absolute bottom-1/3 right-1/4 w-40 h-40 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl animate-gentle-float-delayed"></div>
      
      <!-- Microphone icons floating -->
      <div class="absolute top-1/3 right-1/3">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" class="opacity-20 animate-pulse">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="url(#micGradient)"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="url(#micGradient)" stroke-width="2" fill="none"/>
          <line x1="12" y1="19" x2="12" y2="23" stroke="url(#micGradient)" stroke-width="2"/>
          <line x1="8" y1="23" x2="16" y2="23" stroke="url(#micGradient)" stroke-width="2"/>
          
          <defs>
            <linearGradient id="micGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#ff6b9d;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
    
    <div class="relative z-20 py-16 pt-4 mb-20">
      <div class="mx-auto px-4">
        <!-- Section Header -->
        <div class="mb-16 text-center animate__animated" :class="{'animate__fadeInDown': isVisible}">
          <div class="inline-flex items-center justify-center mb-6">
            <span class="h-px w-12 bg-gradient-to-r from-pink-500 to-purple-500"></span>
            <span class="mx-4 text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text font-bold tracking-wider text-sm uppercase">Our Team</span>
            <span class="h-px w-12 bg-gradient-to-r from-purple-500 to-pink-500"></span>
          </div>
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-6">
            Meet Our <span class="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Presenters</span>
          </h2>
          <p class="text-white/90 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            The voices that bring KIIS 100.9 to life, entertaining and informing Uganda every day
          </p>
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoading" class="container mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            <div v-for="i in 4" :key="i" class="animate-pulse">
              <div class="bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-3xl h-96 backdrop-blur-sm"></div>
            </div>
          </div>
        </div>

        <!-- No Data State -->
        <div v-else-if="!hostsData || hostsData.length === 0" class="container mx-auto text-center py-20">
          <div class="w-20 h-20 bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 border border-pink-400/30">
            <Mic class="w-10 h-10 text-pink-400" />
          </div>
          <h3 class="text-2xl font-black text-white mb-4">No Presenters Available</h3>
          <p class="text-white/70">Check back soon for our amazing team of presenters!</p>
        </div>
        
        <!-- Carousel Container -->
        <div v-else class="relative container mx-auto">
          <!-- Carousel Wrapper -->
          <div class="relative">
            <!-- Navigation Arrows -->
            <button 
              @click="prevSlide"
              :disabled="currentSlide === 0"
              class="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 transform hover:scale-110"
            >
              <ChevronLeft class="h-6 w-6" />
            </button>
            
            <button 
              @click="nextSlide"
              :disabled="currentSlide >= totalSlides - 1"
              class="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 transform hover:scale-110"
            >
              <ChevronRight class="h-6 w-6" />
            </button>

            <!-- Carousel Content -->
            <div class="overflow-hidden rounded-3xl">
              <div 
                class="flex transition-all duration-500 ease-in-out"
                :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
              >
                <!-- Each slide shows 4 presenters -->
                <div 
                  v-for="(slide, slideIndex) in carouselSlides" 
                  :key="slideIndex"
                  class="w-full flex-shrink-0"
                >
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                    <div 
                      v-for="(host, hostIndex) in slide" 
                      :key="host.id"
                      class="relative group animate__animated animate__fadeIn"
                      :style="`animation-delay: ${hostIndex * 0.1}s`"
                    >
                      <!-- Card Background Glow -->
                      <div class="absolute -inset-1 bg-gradient-to-br from-pink-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-0 group-hover:opacity-60 transition duration-500"></div>
                      
                      <!-- Presenter Card -->
                      <div class="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden transition-all duration-500 transform hover:scale-105 h-full">
                        
                        <!-- Image Container -->
                        <div class="aspect-[4/5] overflow-hidden relative">
                          <img 
                            :src="host.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'" 
                            :alt="host.name" 
                            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <!-- Gradient Overlay -->
                          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                          
                          <!-- Live Indicator -->
                          <div v-if="host.on_air_status" class="absolute top-4 left-4 flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                            <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span class="text-white text-xs font-black tracking-wide">ON AIR</span>
                          </div>
                          
                          <!-- Experience Badge -->
                          <div class="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                            <span class="text-black text-xs font-black">{{ host.experience_years }}+ Years</span>
                          </div>
                          
                          <!-- Hover Overlay -->
                          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/70 via-purple-900/50 to-pink-900/30">
                            <div class="text-center">
                              <div class="w-16 h-16 bg-gradient-to-br from-pink-400/30 to-purple-500/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 border border-pink-300/50">
                                <Mic class="h-8 w-8 text-pink-300" />
                              </div>
                              <p class="text-white font-black text-lg">{{ host.name }}</p>
                              <p class="text-pink-300 text-sm font-semibold">{{ host.role }}</p>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Presenter Info -->
                        <div class="p-6">
                          <div class="mb-4">
                            <h3 class="text-lg font-black text-white mb-2 group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                              {{ host.name }}
                            </h3>
                            <p class="text-pink-300 text-sm font-bold mb-2">{{ host.role }}</p>
                            
                            <!-- Shows this host appears in -->
                            <div v-if="host.programs && host.programs.length > 0" class="mb-3">
                              <p class="text-white/70 text-sm mb-2 font-semibold">Shows:</p>
                              <div class="flex flex-wrap gap-1">
                                <span 
                                  v-for="program in host.programs.slice(0, 2)" 
                                  :key="program.id"
                                  class="px-2 py-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-full text-xs text-white/80 border border-pink-300/30"
                                >
                                  {{ program.title }}
                                </span>
                                <span 
                                  v-if="host.programs.length > 2"
                                  class="px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full text-xs text-white/80 border border-purple-300/30"
                                >
                                  +{{ host.programs.length - 2 }} more
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <!-- Bio -->
                          <p class="text-white/80 text-sm leading-relaxed mb-4 line-clamp-3">
                            {{ host.bio || 'Experienced radio presenter bringing entertainment and quality content to KIIS 100.9 listeners.' }}
                          </p>
                          
                          <!-- Contact Button -->
                          <button 
                            @click="openHostDetails(host)"
                            class="w-full relative group/btn overflow-hidden rounded-2xl"
                          >
                            <div class="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl opacity-60 group-hover/btn:opacity-100 transition duration-300 blur-sm"></div>
                            <div class="relative bg-gradient-to-r from-pink-500/80 to-purple-600/80 backdrop-blur-sm py-3 px-4 rounded-2xl text-white font-bold hover:from-pink-500 hover:to-purple-600 transition-all duration-300 border border-pink-300/30">
                              View Profile
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Carousel Indicators -->
          <div v-if="totalSlides > 1" class="flex justify-center mt-8 space-x-3">
            <button
              v-for="(slide, index) in totalSlides"
              :key="index"
              @click="goToSlide(index)"
              :class="[
                'h-3 rounded-full transition-all duration-300',
                currentSlide === index 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 w-8 shadow-lg shadow-pink-500/30' 
                  : 'bg-white/30 hover:bg-pink-300/50 w-3'
              ]"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Host Details Modal -->
    <div v-if="selectedHost" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" @click="closeHostDetails">
      <div class="relative bg-black/80 backdrop-blur-xl border border-pink-300/30 rounded-3xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl" @click.stop>
        <!-- Gradient Border Effect -->
        <div class="absolute -inset-0.5 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl opacity-20 blur-sm"></div>
        
        <div class="relative">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">{{ selectedHost.name }}</h3>
            <button @click="closeHostDetails" class="text-white/60 hover:text-pink-400 transition-colors duration-300 p-2">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img 
                :src="selectedHost.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'" 
                :alt="selectedHost.name" 
                class="w-full aspect-square object-cover rounded-2xl border border-pink-300/30" 
              />
            </div>
            
            <div>
              <div class="mb-4">
                <span class="bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 px-4 py-2 rounded-full text-sm font-black border border-pink-300/30 backdrop-blur-sm">
                  {{ selectedHost.role }}
                </span>
              </div>
              
              <p class="text-white/90 mb-6 leading-relaxed">{{ selectedHost.bio }}</p>
              
              <div class="mb-6">
                <div class="flex items-center gap-3 mb-4">
                  <Clock class="w-5 h-5 text-pink-400" />
                  <span class="text-white font-semibold">{{ selectedHost.experience_years }}+ years experience</span>
                </div>
              </div>
              
              <!-- Programs -->
              <div v-if="selectedHost.programs && selectedHost.programs.length > 0" class="mb-6">
                <h4 class="text-white font-black mb-3">Current Shows</h4>
                <div class="h-[200px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  <div v-for="program in selectedHost.programs" :key="program.id" 
                       class="bg-gradient-to-r from-pink-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-4 hover:from-pink-500/20 hover:to-purple-500/20 transition-all duration-300 border border-pink-300/20">
                    <p class="text-white font-bold">{{ program.title }}</p>
                    <p class="text-white/70 text-sm leading-relaxed">{{ program.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Curved Border -->
    <div class="absolute bottom-0 left-0 w-full overflow-hidden z-10">
      <svg class="w-full h-auto" preserveAspectRatio="none" viewBox="0 0 1200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,50 C200,100 400,0 600,50 C800,100 1000,0 1200,50 L1200,100 L0,100 Z" fill="url(#bottomWave1)" opacity="0.4"/>
        <path d="M0,60 C300,10 500,90 800,40 C900,20 1100,80 1200,45 L1200,100 L0,100 Z" fill="url(#bottomWave2)" opacity="0.3"/>
        <path d="M0,70 C250,30 450,100 700,55 C850,35 1050,95 1200,65 L1200,100 L0,100 Z" fill="white"/>
        
        <!-- Sparkle Effects -->
        <circle cx="200" cy="35" r="2" fill="url(#bottomSparkle)" opacity="0.8">
          <animate attributeName="r" values="1;3;1" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="700" cy="25" r="3" fill="url(#bottomSparkle)" opacity="0.6">
          <animate attributeName="r" values="2;4;2" dur="3.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="1050" cy="40" r="2.5" fill="url(#bottomSparkle)" opacity="0.7">
          <animate attributeName="r" values="1.5;3.5;1.5" dur="2.8s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.5;1;0.5" dur="2.8s" repeatCount="indefinite"/>
        </circle>
        
        <defs>
          <linearGradient id="bottomWave1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#ff6b9d;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ff6b9d;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="bottomWave2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#a78bfa;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f472b6;stop-opacity:1" />
          </linearGradient>
          <radialGradient id="bottomSparkle" cx="50%" cy="50%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
            <stop offset="70%" style="stop-color:#ff6b9d;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  </section>
</template>

<script setup>
import { ChevronLeft, ChevronRight, Clock, Mic, X } from 'lucide-vue-next';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const isVisible = ref(false);
const sectionRef = ref(null);
const currentSlide = ref(0);
const selectedHost = ref(null);
const isLoading = ref(true);

// Get data from store
const hosts = computed(() => store.getters.hosts);
const stationdata = computed(() => store.getters.station);

// Process hosts data
const hostsData = computed(() => {
  if (!hosts.value?.data) return [];
  return hosts.value.data.filter(host => host.status && host.state);
});

// Split hosts into slides of 4
const carouselSlides = computed(() => {
  const slides = [];
  const hostsArray = hostsData.value;
  
  for (let i = 0; i < hostsArray.length; i += 4) {
    slides.push(hostsArray.slice(i, i + 4));
  }
  
  return slides;
});

const totalSlides = computed(() => carouselSlides.value.length);

// Methods
const fetch_hosts = async () => {
  if (!stationdata.value?.id) return;
  
  isLoading.value = true;
  try {
    const data = {
      station_id: stationdata.value.id
    };
    await store.dispatch('fetch_hosts', data);
  } catch (error) {
    console.error('Error fetching hosts:', error);
  } finally {
    isLoading.value = false;
  }
};

const nextSlide = () => {
  if (currentSlide.value < totalSlides.value - 1) {
    currentSlide.value++;
  }
};

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
};

const goToSlide = (index) => {
  currentSlide.value = index;
};

const openHostDetails = (host) => {
  selectedHost.value = host;
};

const closeHostDetails = () => {
  selectedHost.value = null;
};

// Scroll-based animations
onMounted(async () => {
  await fetch_hosts();
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
  
  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
  
  onUnmounted(() => {
    if (sectionRef.value) {
      observer.unobserve(sectionRef.value);
    }
  });
});
</script>

<style scoped>
/* Gentle floating animations */
@keyframes gentle-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

@keyframes gentle-float-delayed {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}

.animate-gentle-float {
  animation: gentle-float 6s ease-in-out infinite;
}

.animate-gentle-float-delayed {
  animation: gentle-float-delayed 7s ease-in-out infinite 2s;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom gradient text effects */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Custom scrollbar for programs section */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #ff6b9d rgba(255, 255, 255, 0.1);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #ff6b9d, #8b5cf6);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #f472b6, #a78bfa);
  box-shadow: 0 2px 8px rgba(255, 107, 157, 0.3);
}

/* Smooth transitions */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Enhanced hover effects */
button:hover, .group:hover {
  transform: translateY(-2px);
}

/* Professional shadows */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(255, 107, 157, 0.25);
}

/* Enhanced glass morphism */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* Card hover glow effect */
.group:hover .absolute.-inset-1 {
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.8; }
}
</style>