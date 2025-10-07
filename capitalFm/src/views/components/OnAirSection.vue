<template>
  <section class="py-8 md:py-12 lg:py-16 xl:py-20 bg-gray-50 relative" ref="sectionRef">
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <!-- Section Header -->
      <div v-scroll-reveal="{ animation: 'fade-up', delay: 0 }" class="mb-8 md:mb-12">
        <div class="flex items-center gap-2 md:gap-3 mb-4">
          <div class="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#F8CB00]/20 flex items-center justify-center flex-shrink-0">
            <Calendar class="h-4 w-4 md:h-5 md:w-5 text-[#F8CB00]" />
          </div>
          <div>
            <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">Our Daily Shows</h2>
            <p class="text-sm md:text-base text-gray-600">Discover your favorite programs</p>
          </div>
        </div>
      </div>

      <!-- Day Navigation (Sticky) -->
      <div class="sticky top-0 z-10 bg-gray-50 py-4 mb-6 md:mb-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div class="max-w-7xl mx-auto">
          <div class="flex gap-1.5 md:gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
            <button 
              v-for="(day, index) in weekDays" 
              :key="index"
              @click="setSelectedDay(index)"
              class="flex-shrink-0 px-3 md:px-4 lg:px-5 py-2 md:py-2.5 rounded-lg transition-all duration-300 font-medium min-w-[70px] md:min-w-[90px]"
              :class="[
                selectedDayIndex === index 
                  ? 'bg-[#F8CB00] text-black shadow-sm' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200',
                isToday(index) ? 'ring-1 ring-[#F8CB00]/50' : ''
              ]"
            >
              <div class="text-center">
                <div class="text-xs md:text-sm font-bold">{{ day.slice(0, 3).toUpperCase() }}</div>
                <div class="text-[10px] md:text-xs opacity-80">{{ getDayDate(index) }}</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Shows Carousel -->
      <div class="relative">
        <!-- Carousel Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
              {{ getSelectedDayName() }} Shows
            </h3>
            <p class="text-sm md:text-base text-gray-600">{{ selectedDayShows.length }} programs scheduled</p>
          </div>
          
          <div class="flex items-center gap-1.5 md:gap-2">
            <button 
              @click="prevShow"
              :disabled="currentPage === 0"
              class="p-1.5 md:p-2 rounded-lg bg-white hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-200"
            >
              <ChevronLeft class="h-4 w-4 md:h-5 md:w-5" />
            </button>
            <span class="text-xs md:text-sm text-gray-600 px-1 md:px-2">
              {{ currentPage + 1 }} / {{ totalPages }}
            </span>
            <button 
              @click="nextShow"
              :disabled="currentPage >= totalPages - 1"
              class="p-1.5 md:p-2 rounded-lg bg-white hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-200"
            >
              <ChevronRight class="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <div v-for="i in 4" :key="i" class="animate-pulse">
            <div class="h-72 md:h-80 bg-gray-200 rounded-xl md:rounded-2xl"></div>
          </div>
        </div>

        <!-- Shows Grid -->
        <div v-else-if="selectedDayShows.length > 0" class="relative">
          <!-- Carousel Container -->
          <div class="overflow-hidden">
            <div 
              class="flex transition-transform duration-500 ease-in-out"
              :style="{ transform: `translateX(-${currentPage * 100}%)` }"
            >
              <!-- Show Cards Pages -->
              <div 
                v-for="page in totalPages" 
                :key="page"
                class="flex-shrink-0 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
              >
                <div 
                  v-for="(show, index) in getShowsForPage(page - 1)" 
                  :key="`${page}-${index}`"
                  class="bg-white rounded-xl md:rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#F8CB00] group cursor-pointer h-full"
                  @click="selectShow(show)"
                >
                  <!-- Show Image -->
                  <div class="h-40 md:h-48 lg:h-56 overflow-hidden relative">
                    <img 
                      :src="show.image || 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'" 
                      :alt="show.title" 
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <!-- Gradient Overlay -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    <!-- Status Badge -->
                    <div v-if="isCurrentShow(show)" class="absolute top-2 md:top-3 right-2 md:right-3">
                      <div class="bg-red-600 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full flex items-center gap-1">
                        <div class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        <span class="text-white text-[10px] md:text-xs font-bold">LIVE</span>
                      </div>
                    </div>
                    <div v-else-if="isUpcomingShow(show)" class="absolute top-2 md:top-3 right-2 md:right-3">
                      <div class="bg-[#F8CB00] px-2 md:px-2.5 py-0.5 md:py-1 rounded-full flex items-center gap-1">
                        <Clock class="w-2.5 h-2.5 md:w-3 md:h-3 text-black" />
                        <span class="text-black text-[10px] md:text-xs font-bold">UP NEXT</span>
                      </div>
                    </div>

                    <!-- Time Badge -->
                    <div class="absolute bottom-2 md:bottom-3 left-2 md:left-3">
                      <div class="bg-white/95 backdrop-blur-sm px-2 md:px-2.5 py-0.5 md:py-1 rounded-full">
                        <span class="text-gray-900 text-[10px] md:text-xs font-bold">{{ show.time }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Show Info -->
                  <div class="p-3 md:p-4">
                    <div class="mb-3">
                      <h4 class="text-sm md:text-base font-bold text-gray-900 mb-1 group-hover:text-[#F8CB00] transition-colors line-clamp-1">
                        {{ show.title }}
                      </h4>
                      <p class="text-gray-600 text-xs md:text-sm line-clamp-2 leading-relaxed">
                        {{ show.description }}
                      </p>
                    </div>

                    <!-- Hosts -->
                    <div v-if="show.hosts && show.hosts.length > 0" class="mb-3">
                      <div class="flex items-center gap-2">
                        <div v-for="host in show.hosts.slice(0, 2)" :key="host.id" 
                             class="flex items-center gap-1.5">
                          <div class="w-6 h-6 md:w-7 md:h-7 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                            <img 
                              v-if="host.image_url" 
                              :src="host.image_url" 
                              :alt="host.name" 
                              class="w-full h-full object-cover"
                            />
                            <div v-else class="w-full h-full bg-[#F8CB00] flex items-center justify-center">
                              <span class="text-black text-[10px] font-bold">{{ host.name.charAt(0) }}</span>
                            </div>
                          </div>
                          <span class="text-gray-700 text-xs md:text-sm font-medium">{{ host.name }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Listen Button -->
                    <button 
                      v-if="isCurrentShow(show)"
                      @click.stop="togglePlayPause"
                      class="w-full bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg text-white text-xs md:text-sm font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <component :is="isPlaying ? Pause : Play" class="h-3 w-3 md:h-3.5 md:w-3.5" />
                      <span>{{ isPlaying ? 'LIVE' : 'LISTEN' }}</span>
                    </button>
                    <button 
                      v-else
                      @click.stop="selectShow(show)"
                      class="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-3 rounded-lg transition-all text-xs md:text-sm"
                    >
                      <div class="flex items-center justify-center gap-1.5">
                        <Info class="w-3 h-3 md:w-3.5 md:h-3.5" />
                        <span>Details</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8 md:py-12">
          <div class="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
            <Calendar class="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
          </div>
          <h3 class="text-base md:text-lg font-bold text-gray-900 mb-2 px-4">No Shows Scheduled</h3>
          <p class="text-sm text-gray-600 px-4">Check back for updates to our {{ getSelectedDayName() }} programming</p>
        </div>

        <!-- Carousel Indicators -->
        <div v-if="totalPages > 1" class="flex justify-center mt-4 md:mt-6 gap-1.5 md:gap-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page - 1)"
            :class="[
              'w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300',
              currentPage === (page - 1)
                ? 'bg-[#F8CB00]' 
                : 'bg-gray-300 hover:bg-gray-400'
            ]"
          />
        </div>
      </div>

      <!-- Show Details Modal -->
      <div v-if="selectedShow" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click="closeShowDetails">
        <div class="bg-white rounded-xl md:rounded-2xl border border-gray-200 p-4 md:p-6 lg:p-8 max-w-2xl w-full max-h-[85vh] md:max-h-[80vh] overflow-y-auto" @click.stop>
          <div class="flex items-center justify-between mb-4 md:mb-6">
            <h3 class="text-xl md:text-2xl font-bold text-gray-900">{{ selectedShow.title }}</h3>
            <button @click="closeShowDetails" class="text-gray-400 hover:text-gray-600">
              <X class="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <img 
                :src="selectedShow.image || 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'" 
                :alt="selectedShow.title" 
                class="w-full aspect-square object-cover rounded-xl" 
              />
            </div>
            
            <div>
              <div class="mb-4">
                <span class="bg-[#F8CB00]/20 text-[#F8CB00] px-3 py-1 rounded-full text-sm font-semibold">
                  {{ selectedShow.time }}
                </span>
              </div>
              
              <p class="text-gray-700 mb-6 leading-relaxed">{{ selectedShow.description }}</p>
              
              <div v-if="selectedShow.hosts && selectedShow.hosts.length > 0" class="mb-6">
                <h4 class="text-gray-900 font-semibold mb-3">Hosts</h4>
                <div class="space-y-3">
                  <div v-for="host in selectedShow.hosts" :key="host.id" 
                       class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                      <img 
                        v-if="host.image_url" 
                        :src="host.image_url" 
                        :alt="host.name" 
                        class="w-full h-full object-cover"
                      />
                      <div v-else class="w-full h-full bg-[#F8CB00] flex items-center justify-center">
                        <span class="text-black font-bold">{{ host.name.charAt(0) }}</span>
                      </div>
                    </div>
                    <div>
                      <p class="text-gray-900 font-medium">{{ host.name }}</p>
                      <p class="text-gray-600 text-sm">{{ host.role }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                v-if="isCurrentShow(selectedShow)"
                @click="togglePlayPause" 
                class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 md:py-3 rounded-full flex items-center justify-center space-x-2 transition-all"
              >
                <component :is="isPlaying ? Pause : Play" class="h-4 w-4 md:h-5 md:w-5" />
                <span class="text-sm md:text-base">{{ isPlaying ? 'LIVE NOW' : 'LISTEN LIVE' }}</span>
              </button>
              <div v-else class="text-center py-4">
                <span class="text-gray-500">Show airs {{ selectedShow.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
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
const itemsPerPage = ref(4); // Changed from default to 4
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

// Get current day key
const getCurrentDayKey = () => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
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

// Get responsive grid class
const getGridClass = () => {
  return 'md:grid-cols-4'; // Always display 4 columns
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

// Update items per page - now always 4
const updateItemsPerPage = () => {
  itemsPerPage.value = 4; // Always display 4 items
  currentPage.value = 0;
};

onMounted(async () => {
  await loadStationData();
  
  // Set current day
  const today = new Date().getDay();
  selectedDayIndex.value = today === 0 ? 6 : today - 1;
  
  updateItemsPerPage();
  window.addEventListener('resize', updateItemsPerPage);
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

* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>