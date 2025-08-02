<template>
  <section class="relative min-h-screen overflow-hidden backgroundFixed" ref="sectionRef" style="background-image: url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80') ">
    <!-- Fixed Background Image -->
    <div class="absolute inset-0 z-0">
      <div class="w-full h-full relative">
        
        <div class="absolute inset-0 bg-black/60"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70"></div>
      </div>
    </div>

    <!-- Floating background elements -->
    <div class="absolute inset-0 overflow-hidden opacity-20 pointer-events-none z-10">
      <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-[#F8CB00] rounded-full blur-2xl animate-float"></div>
      <div class="absolute bottom-1/3 right-1/4 w-40 h-40 bg-red-500 rounded-full blur-3xl animate-float" style="animation-delay: 2s;"></div>
      
      <!-- Microphone icons floating -->
      <div class="absolute top-1/3 right-1/3">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" class="opacity-30 animate-pulse">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="#F8CB00"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="#F8CB00" stroke-width="2" fill="none"/>
          <line x1="12" y1="19" x2="12" y2="23" stroke="#F8CB00" stroke-width="2"/>
          <line x1="8" y1="23" x2="16" y2="23" stroke="#F8CB00" stroke-width="2"/>
        </svg>
      </div>
    </div>
    
    <div class="relative z-20 py-10">
      <div class="mx-auto px-4">
        <!-- Section Header -->
        <div class="mb-16 text-center animate__animated" :class="{'animate__fadeInDown': isVisible}">
          <div class="inline-flex items-center justify-center mb-6">
            <span class="h-px w-12 bg-[#F8CB00]"></span>
            <span class="mx-4 text-[#F8CB00] font-bold tracking-wider text-sm uppercase">Our Team</span>
            <span class="h-px w-12 bg-[#F8CB00]"></span>
          </div>
          <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Meet Our <span class="text-[#F8CB00]">Presenters</span>
          </h2>
          <p class="text-white/80 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            The voices that bring Capital FM to life, entertaining and informing Uganda every day
          </p>
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoading" class="container mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
            <div v-for="i in 4" :key="i" class="animate-pulse">
              <div class="bg-white/10 rounded-2xl h-96"></div>
            </div>
          </div>
        </div>

        <!-- No Data State -->
        <div v-else-if="!hostsData || hostsData.length === 0" class="container mx-auto text-center py-20">
          <div class="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mic class="w-10 h-10 text-white/60" />
          </div>
          <h3 class="text-2xl font-bold text-white mb-4">No Presenters Available</h3>
          <p class="text-white/60">Check back soon for our amazing team of presenters!</p>
        </div>
        
        <!-- Carousel Container -->
        <div v-else class="relative container mx-auto">
          <!-- Carousel Wrapper -->
          <div class="relative">
            <!-- Navigation Arrows -->
            <button 
              @click="prevSlide"
              :disabled="currentSlide === 0"
              class="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft class="h-6 w-6" />
            </button>
            
            <button 
              @click="nextSlide"
              :disabled="currentSlide >= totalSlides - 1"
              class="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight class="h-6 w-6" />
            </button>

            <!-- Carousel Content -->
            <div class="overflow-hidden rounded-2xl">
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
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                    <div 
                      v-for="(host, hostIndex) in slide" 
                      :key="host.id"
                      class="relative group animate__animated animate__fadeIn"
                      :style="`animation-delay: ${hostIndex * 0.1}s`"
                    >
                      <!-- Card Background Glow -->
                      <div class="absolute -inset-1 bg-gradient-to-r from-[#F8CB00] via-red-500 to-blue-500 rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500"></div>
                      
                      <!-- Presenter Card -->
                      <div class="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden transition-all duration-500 transform hover:scale-105 h-full">
                        
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
                          <div v-if="host.on_air_status" class="absolute top-4 left-4 flex items-center space-x-2 bg-red-500/90 backdrop-blur-sm rounded-full px-3 py-1">
                            <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span class="text-white text-xs font-bold">ON AIR</span>
                          </div>
                          
                          <!-- Experience Badge -->
                          <div class="absolute top-4 right-4 bg-[#F8CB00]/90 backdrop-blur-sm rounded-full px-3 py-1">
                            <span class="text-black text-xs font-bold">{{ host.experience_years }}+ Years</span>
                          </div>
                          
                          <!-- Hover Overlay -->
                          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
                            <div class="text-center">
                              <div class="w-16 h-16 bg-[#F8CB00]/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3">
                                <Mic class="h-8 w-8 text-[#F8CB00]" />
                              </div>
                              <p class="text-white font-semibold text-lg">{{ host.name }}</p>
                              <p class="text-[#F8CB00] text-sm">{{ host.role }}</p>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Presenter Info -->
                        <div class="p-6">
                          <div class="mb-4">
                            <h3 class="text-xl font-bold text-white mb-2 group-hover:text-[#F8CB00] transition-colors">
                              {{ host.name }}
                            </h3>
                            <p class="text-[#F8CB00] text-sm font-semibold mb-2">{{ host.role }}</p>
                            
                            <!-- Shows this host appears in -->
                            <div v-if="host.programs && host.programs.length > 0" class="mb-3">
                              <p class="text-white/70 text-sm mb-2">Shows:</p>
                              <div class="flex flex-wrap gap-1">
                                <span 
                                  v-for="program in host.programs.slice(0, 2)" 
                                  :key="program.id"
                                  class="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white/70 border border-white/20"
                                >
                                  {{ program.title }}
                                </span>
                                <span 
                                  v-if="host.programs.length > 2"
                                  class="px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white/70 border border-white/20"
                                >
                                  +{{ host.programs.length - 2 }} more
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <!-- Bio -->
                          <p class="text-white/80 text-sm leading-relaxed mb-4 line-clamp-3">
                            {{ host.bio || 'Experienced radio presenter bringing entertainment and quality content to Capital FM listeners.' }}
                          </p>
                          
                          <!-- Contact Button -->
                          <button 
                            @click="openHostDetails(host)"
                            class="w-full py-2 px-4 bg-gradient-to-r from-[#F8CB00]/20 to-red-500/20 backdrop-blur-sm rounded-lg text-white font-medium hover:from-[#F8CB00]/40 hover:to-red-500/40 transition-all duration-300 border border-white/20 hover:border-[#F8CB00]/50"
                          >
                            View Profile
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
                'w-3 h-3 rounded-full transition-all duration-300',
                currentSlide === index 
                  ? 'bg-[#F8CB00] w-8' 
                  : 'bg-white/30 hover:bg-white/50'
              ]"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Host Details Modal -->
    <div v-if="selectedHost" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" @click="closeHostDetails">
      <div class="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto" @click.stop>
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-white">{{ selectedHost.name }}</h3>
          <button @click="closeHostDetails" class="text-white/60 hover:text-white">
            <X class="h-6 w-6" />
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img 
              :src="selectedHost.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'" 
              :alt="selectedHost.name" 
              class="w-full aspect-square object-cover rounded-xl" 
            />
          </div>
          
          <div>
            <div class="mb-4">
              <span class="bg-[#F8CB00]/20 text-[#F8CB00] px-3 py-1 rounded-full text-sm font-semibold">
                {{ selectedHost.role }}
              </span>
            </div>
            
            <p class="text-white/80 mb-6 leading-relaxed">{{ selectedHost.bio }}</p>
            
            <div class="mb-6">
              <div class="flex items-center gap-3 mb-4">
                <Clock class="w-5 h-5 text-[#F8CB00]" />
                <span class="text-white">{{ selectedHost.experience_years }}+ years experience</span>
              </div>
            </div>
            
            <!-- Programs -->
            <div v-if="selectedHost.programs && selectedHost.programs.length > 0" class="mb-6">
              <h4 class="text-white font-semibold mb-3">Current Shows</h4>
              <div class="h-[200px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                <div v-for="program in selectedHost.programs" :key="program.id" 
                     class="bg-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors">
                  <p class="text-white font-medium">{{ program.title }}</p>
                  <p class="text-white/60 text-sm leading-relaxed">{{ program.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar for programs section */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #F8CB00 rgba(255, 255, 255, 0.1);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #F8CB00, #e6b800);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #ffdd00, #F8CB00);
  box-shadow: 0 2px 8px rgba(248, 203, 0, 0.3);
}

/* Smooth transitions */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>