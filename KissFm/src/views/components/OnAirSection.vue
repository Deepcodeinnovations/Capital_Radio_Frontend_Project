<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-pink-50" ref="sectionRef">
    <!-- Top Fade to White -->
    <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white via-white/80 to-transparent z-15"></div>
    
    <!-- Background decoration with KIIS colors -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto px-4 md:px-6 relative z-20 pt-32 pb-20">
      <!-- Section Header with KIIS Styling -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center justify-center mb-6">
          <div class="h-px w-12 bg-gradient-to-r from-pink-500 to-purple-500"></div>
          <span class="mx-4 text-gray-800 font-bold tracking-wider text-sm uppercase">Weekly Schedule</span>
          <div class="h-px w-12 bg-gradient-to-r from-purple-500 to-pink-500"></div>
        </div>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
          Our <span class="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Daily Shows</span>
        </h2>
        <p class="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Discover your favorite shows and never miss the entertainment that keeps Uganda listening
        </p>
      </div>

      <!-- Day Navigation with Curved Buttons -->
      <div class="mb-12">
        <div class="flex justify-center items-center mb-8">
          <div class="flex gap-2 overflow-x-auto hide-scrollbar justify-center items-center w-full">
            <button 
              v-for="(day, index) in weekDays" 
              :key="index"
              @click="setSelectedDay(index)"
              class="relative flex-shrink-0 px-4 py-3 rounded-2xl transition-all duration-500 font-bold min-w-[90px] group overflow-hidden"
              :class="[
                selectedDayIndex === index 
                  ? 'text-white transform scale-105 shadow-lg shadow-pink-500/25' 
                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border border-pink-200/50 hover:border-pink-300',
                isToday(index) ? 'ring-2 ring-pink-400/50' : ''
              ]"
            >
              <!-- Active button gradient background -->
              <div v-if="selectedDayIndex === index" class="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl"></div>
              <div v-if="selectedDayIndex === index" class="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl blur opacity-60"></div>
              
              <div class="relative z-10 text-center">
                <div class="text-sm font-black">{{ day.slice(0, 3).toUpperCase() }}</div>
                <div class="text-xs opacity-80">{{ getDayDate(index) }}</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Shows Carousel -->
      <div class="relative">
        <!-- Carousel Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-2xl font-black text-gray-900 mb-2">
              {{ getSelectedDayName() }} Shows
            </h3>
            <p class="text-gray-600">{{ selectedDayShows.length }} programs scheduled</p>
          </div>
          
          <div class="flex items-center gap-3">
            <button 
              @click="prevShow"
              :disabled="currentPage === 0"
              class="p-3 rounded-2xl bg-white/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 border border-pink-200/50"
            >
              <ChevronLeft class="h-5 w-5" />
            </button>
            <span class="text-sm text-gray-600 px-3 py-2 bg-white/60 backdrop-blur-sm rounded-xl font-semibold">
              {{ currentPage + 1 }} / {{ totalPages }}
            </span>
            <button 
              @click="nextShow"
              :disabled="currentPage >= totalPages - 1"
              class="p-3 rounded-2xl bg-white/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 border border-pink-200/50"
            >
              <ChevronRight class="h-5 w-5" />
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="animate-pulse">
            <div class="h-96 bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl"></div>
          </div>
        </div>

        <!-- Shows Grid -->
        <div v-else-if="selectedDayShows.length > 0" class="relative">
          <!-- Carousel Container -->
          <div class="overflow-hidden rounded-3xl">
            <div 
              class="flex transition-transform duration-500 ease-in-out"
              :style="{ transform: `translateX(-${currentPage * 100}%)` }"
            >
              <!-- Show Cards Pages -->
              <div 
                v-for="page in totalPages" 
                :key="page"
                class="flex-shrink-0 w-full grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
              >
                <div 
                  v-for="(show, index) in getShowsForPage(page - 1)" 
                  :key="`${page}-${index}`"
                  class="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-pink-200/30 overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 group cursor-pointer h-full"
                  @click="selectShow(show)"
                >
                  <!-- Gradient Border Effect -->
                  <div class="absolute -inset-0.5 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                  
                  <div class="relative bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden h-full">
                    <!-- Show Image -->
                    <div class="h-64 overflow-hidden relative">
                      <img 
                        :src="show.image || 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'" 
                        :alt="show.title" 
                        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <!-- Gradient Overlay -->
                      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      
                      <!-- Status Badge -->
                      <div v-if="isCurrentShow(show)" class="absolute top-4 right-4">
                        <div class="bg-gradient-to-r from-pink-500 to-purple-600 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                          <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <span class="text-white text-xs font-black tracking-wide">LIVE NOW</span>
                        </div>
                      </div>
                      <div v-else-if="isUpcomingShow(show)" class="absolute top-4 right-4">
                        <div class="bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                          <Clock class="w-3 h-3 text-white" />
                          <span class="text-white text-xs font-black tracking-wide">UP NEXT</span>
                        </div>
                      </div>

                      <!-- Time Badge -->
                      <div class="absolute bottom-4 left-4">
                        <div class="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-pink-200/50">
                          <span class="text-gray-900 text-sm font-black">{{ show.time }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Show Info -->
                    <div class="p-6">
                      <div class="mb-4">
                        <h4 class="text-lg font-black text-gray-900 mb-2 group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-1">
                          {{ show.title }}
                        </h4>
                        <p class="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                          {{ show.description }}
                        </p>
                      </div>

                      <!-- Hosts -->
                      <div v-if="show.hosts && show.hosts.length > 0" class="mb-4">
                        <div class="flex items-center gap-3">
                          <div v-for="host in show.hosts.slice(0, 2)" :key="host.id" 
                               class="flex items-center gap-2">
                            <div class="w-8 h-8 rounded-full overflow-hidden border-2 border-pink-200">
                              <img 
                                v-if="host.image_url" 
                                :src="host.image_url" 
                                :alt="host.name" 
                                class="w-full h-full object-cover"
                              />
                              <div v-else class="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                                <span class="text-white text-xs font-bold">{{ host.name.charAt(0) }}</span>
                              </div>
                            </div>
                            <span class="text-gray-700 text-sm font-semibold">{{ host.name }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Listen Button -->
                      <button 
                        v-if="isCurrentShow(show)"
                        @click.stop="togglePlayPause"
                        class="w-full relative group/btn overflow-hidden"
                      >
                        <div class="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-60 group-hover/btn:opacity-100 transition duration-300"></div>
                        <div class="relative bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-3 rounded-2xl text-white font-black flex items-center justify-center space-x-2 transition-all duration-300">
                          <component :is="isPlaying ? Pause : Play" class="h-4 w-4" />
                          <span class="tracking-wide">{{ isPlaying ? 'LIVE NOW' : 'LISTEN LIVE' }}</span>
                        </div>
                      </button>
                      <button 
                        v-else
                        @click.stop="selectShow(show)"
                        class="w-full bg-white/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100 text-gray-900 font-bold py-3 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105 border border-pink-200/50"
                      >
                        <div class="flex items-center justify-center space-x-2">
                          <Info class="w-4 h-4" />
                          <span>View Details</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Calendar class="w-10 h-10 text-pink-400" />
          </div>
          <h3 class="text-2xl font-black text-gray-900 mb-4">No Shows Scheduled</h3>
          <p class="text-gray-600">Check back for updates to our {{ getSelectedDayName() }} programming schedule</p>
        </div>

        <!-- Carousel Indicators -->
        <div v-if="totalPages > 1" class="flex justify-center mt-8 space-x-3">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page - 1)"
            :class="[
              'h-3 rounded-full transition-all duration-300',
              currentPage === (page - 1)
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 w-8 shadow-lg' 
                : 'bg-gray-300 hover:bg-pink-300 w-3'
            ]"
          />
        </div>
      </div>

      <!-- Show Details Modal -->
      <div v-if="selectedShow" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click="closeShowDetails">
        <div class="relative bg-white/95 backdrop-blur-xl rounded-3xl border border-pink-200/50 p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl" @click.stop>
          <!-- Gradient Border Effect -->
          <div class="absolute -inset-0.5 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl opacity-20 blur-sm"></div>
          
          <div class="relative">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-2xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">{{ selectedShow.title }}</h3>
              <button @click="closeShowDetails" class="text-gray-400 hover:text-pink-500 transition-colors duration-300">
                <X class="h-6 w-6" />
              </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img 
                  :src="selectedShow.image || 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'" 
                  :alt="selectedShow.title" 
                  class="w-full aspect-square object-cover rounded-2xl border border-pink-200/50" 
                />
              </div>
              
              <div>
                <div class="mb-4">
                  <span class="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600 px-4 py-2 rounded-full text-sm font-black border border-pink-200/50">
                    {{ selectedShow.time }}
                  </span>
                </div>
                
                <p class="text-gray-700 mb-6 leading-relaxed">{{ selectedShow.description }}</p>
                
                <div v-if="selectedShow.hosts && selectedShow.hosts.length > 0" class="mb-6">
                  <h4 class="text-gray-900 font-black mb-3">Hosts</h4>
                  <div class="space-y-3">
                    <div v-for="host in selectedShow.hosts" :key="host.id" 
                         class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-200">
                        <img 
                          v-if="host.image_url" 
                          :src="host.image_url" 
                          :alt="host.name" 
                          class="w-full h-full object-cover"
                        />
                        <div v-else class="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                          <span class="text-white font-bold">{{ host.name.charAt(0) }}</span>
                        </div>
                      </div>
                      <div>
                        <p class="text-gray-900 font-semibold">{{ host.name }}</p>
                        <p class="text-gray-600 text-sm">{{ host.role }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button 
                  v-if="isCurrentShow(selectedShow)"
                  @click="togglePlayPause" 
                  class="w-full relative group overflow-hidden"
                >
                  <div class="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
                  <div class="relative bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-300">
                    <component :is="isPlaying ? Pause : Play" class="h-5 w-5" />
                    <span class="tracking-wide">{{ isPlaying ? 'LIVE NOW' : 'LISTEN LIVE' }}</span>
                  </div>
                </button>
                <div v-else class="text-center py-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-200/50">
                  <span class="text-gray-600 font-semibold">Show airs {{ selectedShow.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Curved Border -->
    <div class="absolute bottom-0 left-0 w-full overflow-hidden z-10">
      <svg class="w-full h-auto" preserveAspectRatio="none" viewBox="0 0 1200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 L1200,80 L0,80 Z" fill="url(#bottomWave1)" opacity="0.3"/>
        <path d="M0,50 C300,10 500,70 800,30 C900,10 1100,60 1200,35 L1200,80 L0,80 Z" fill="url(#bottomWave2)" opacity="0.2"/>
        <path d="M0,60 C250,20 450,80 700,45 C850,25 1050,75 1200,55 L1200,80 L0,80 Z" fill="white"/>
        
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
        </defs>
      </svg>
    </div>
  </section>
</template>

<script setup>
import { ChevronLeft, ChevronRight, Clock, Play, Pause, Calendar, Info, X } from 'lucide-vue-next';
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const sectionRef = ref(null);
const selectedShow = ref(null);
const selectedDayIndex = ref(0);
const currentPage = ref(0);
const itemsPerPage = ref(4);
const isLoading = ref(true);

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Get data from store
const stationData = computed(() => store.getters.station);
const scheduleData = computed(() => stationData.value?.schedule?.sessions || {});

// Audio Player State from store
const isPlaying = computed(() => store.getters.isPlaying || false);

// Computed properties
const selectedDayShows = computed(() => {
  const dayKey = weekDays[selectedDayIndex.value].toLowerCase();
  const shows = scheduleData.value[dayKey] || [];
  
  return shows.map(show => ({
    ...show,
    title: show.program?.title || 'Untitled Show',
    description: show.program?.description || 'No description available',
    image: show.program?.image_url,
    time: `${show.start_time} - ${show.end_time}`,
    hosts: getShowHosts(show)
  }));
});

const totalPages = computed(() => {
  return Math.ceil(selectedDayShows.value.length / itemsPerPage.value);
});

// Get current time in HH:MM format
const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

// Check if a time is between start and end time
const isTimeBetween = (currentTime, startTime, endTime) => {
  const current = currentTime.replace(':', '');
  const start = startTime.replace(':', '');
  const end = endTime.replace(':', '');
  
  if (end < start) {
    return current >= start || current <= end;
  }
  
  return current >= start && current <= end;
};

// Get hosts for a show
const getShowHosts = (show) => {
  if (!show?.hosts || !show?.program?.hosts) return [];
  
  return show.hosts.map(hostId => {
    const host = show.program.hosts.find(h => h.id === hostId);
    return host || { id: hostId, name: 'Unknown Host', role: 'Host' };
  });
};

// Get shows for specific page
const getShowsForPage = (pageIndex) => {
  const startIndex = pageIndex * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return selectedDayShows.value.slice(startIndex, endIndex);
};

// Methods
const setSelectedDay = (index) => {
  selectedDayIndex.value = index;
  currentPage.value = 0;
};

const prevShow = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
  }
};

const nextShow = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
  }
};

const goToPage = (pageIndex) => {
  if (pageIndex >= 0 && pageIndex < totalPages.value) {
    currentPage.value = pageIndex;
  }
};

const getSelectedDayName = () => {
  return weekDays[selectedDayIndex.value];
};

const getDayDate = (index) => {
  const today = new Date();
  const targetDate = new Date(today);
  const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const dayDiff = index - currentDayIndex;
  targetDate.setDate(today.getDate() + dayDiff);
  return targetDate.getDate();
};

const isToday = (index) => {
  const today = new Date().getDay();
  const adjustedIndex = index === 6 ? 0 : index + 1;
  return today === adjustedIndex;
};

const isCurrentShow = (show) => {
  const currentTime = getCurrentTime();
  const today = new Date().getDay();
  const selectedDay = selectedDayIndex.value === 6 ? 0 : selectedDayIndex.value + 1;
  
  if (today !== selectedDay) return false;
  
  return isTimeBetween(currentTime, show.start_time, show.end_time);
};

const isUpcomingShow = (show) => {
  const currentTime = getCurrentTime();
  const today = new Date().getDay();
  const selectedDay = selectedDayIndex.value === 6 ? 0 : selectedDayIndex.value + 1;
  
  if (today !== selectedDay) return false;
  
  const currentNum = parseInt(currentTime.replace(':', ''));
  const upcomingShows = selectedDayShows.value.filter(s => {
    const startNum = parseInt(s.start_time.replace(':', ''));
    return startNum > currentNum;
  }).sort((a, b) => parseInt(a.start_time.replace(':', '')) - parseInt(b.start_time.replace(':', '')));
  
  return upcomingShows.length > 0 && upcomingShows[0].program_id === show.program_id;
};

const selectShow = (show) => {
  selectedShow.value = show;
};

const closeShowDetails = () => {
  selectedShow.value = null;
};

const togglePlayPause = async () => {
  try {
    if (store.dispatch) {
      await store.dispatch('togglePlayPause');
    }
  } catch (err) {
    console.error('Failed to toggle playback:', err);
  }
};

// Load station data
const loadStationData = async () => {
  isLoading.value = true;
  try {
    if (!stationData.value?.schedule) {
      await store.dispatch('fetch_station_data');
    }
  } catch (error) {
    console.error('Failed to load station data:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await loadStationData();
  
  // Set current day
  const today = new Date().getDay();
  selectedDayIndex.value = today === 0 ? 6 : today - 1;
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Custom gradient text effects */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Enhanced backdrop blur for better glass effect */
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(8px);
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
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
</style>