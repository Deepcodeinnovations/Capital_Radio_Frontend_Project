<template>
  <section class="py-20 bg-white relative overflow-hidden" ref="sectionRef">
    <!-- Background decoration -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 right-0 w-72 h-72 bg-red-600 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-black rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-red-600 rounded-full blur-3xl"></div>
    </div>
    
    <div class="container mx-auto px-6 relative">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center justify-center mb-6">
          <div class="h-px w-12 bg-red-600"></div>
          <span class="mx-4 text-black font-bold tracking-wider text-sm uppercase">Weekly Schedule</span>
          <div class="h-px w-12 bg-red-600"></div>
        </div>
        <h2 class="text-4xl md:text-5xl font-bold text-black mb-6">
          Our <span class="text-red-600">Daily Shows</span>
        </h2>
        <p class="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Discover your favorite shows and never miss the beats that keep Uganda dancing
        </p>
      </div>

      <!-- Day Navigation -->
      <div class="mb-12">
        <div class="flex justify-center items-center mb-8">
          <div class="flex gap-2 overflow-x-auto hide-scrollbar justify-center items-center w-full">
            <button 
              v-for="(day, index) in weekDays" 
              :key="index"
              @click="setSelectedDay(index)"
              class="flex-shrink-0 px-6 py-4  transition-all duration-300 font-semibold min-w-[100px]"
              :class="[
                selectedDayIndex === index 
                  ? 'bg-red-600 text-white transform scale-105 shadow-lg shadow-red-600/25' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                isToday(index) ? 'ring-2 ring-red-600/50' : ''
              ]"
            >
              <div class="text-center">
                <div class="text-sm font-bold">{{ day.slice(0, 3).toUpperCase() }}</div>
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
            <h3 class="text-2xl font-bold text-black mb-2">
              {{ getSelectedDayName() }} Shows
            </h3>
            <p class="text-gray-600">{{ selectedDayShows.length }} programs scheduled</p>
          </div>
          
          <div class="flex items-center gap-2">
            <button 
              @click="prevShow"
              :disabled="currentPage === 0"
              class="p-2 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft class="h-5 w-5" />
            </button>
            <span class="text-sm text-gray-600 px-2">
              {{ currentPage + 1 }} / {{ totalPages }}
            </span>
            <button 
              @click="nextShow"
              :disabled="currentPage >= totalPages - 1"
              class="p-2 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight class="h-5 w-5" />
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 4" :key="i" class="animate-pulse">
            <div class="h-80 bg-gray-200 "></div>
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
                class="flex-shrink-0 w-full grid gap-6"
                :class="getGridClass()"
              >
                <div 
                  v-for="(show, index) in getShowsForPage(page - 1)" 
                  :key="`${page}-${index}`"
                  class="bg-white  border border-gray-200 overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:border-red-600/20 group cursor-pointer h-full"
                  @click="selectShow(show)"
                >
                  <!-- Show Image -->
                  <div class="h-[400px] overflow-hidden relative">
                    <img 
                      :src="show.image || 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'" 
                      :alt="show.title" 
                      class="w-full h-[330px] object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <!-- Gradient Overlay -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    <!-- Status Badge -->
                    <div v-if="isCurrentShow(show)" class="absolute top-4 right-4">
                      <div class="bg-red-600 px-3 py-1 rounded-full flex items-center gap-2">
                        <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span class="text-white text-xs font-bold">LIVE NOW</span>
                      </div>
                    </div>
                    <div v-else-if="isUpcomingShow(show)" class="absolute top-4 right-4">
                      <div class="bg-black px-3 py-1 rounded-full flex items-center gap-2">
                        <Clock class="w-3 h-3 text-white" />
                        <span class="text-white text-xs font-bold">UP NEXT</span>
                      </div>
                    </div>

                    <!-- Time Badge -->
                    <div class="absolute bottom-4 left-4">
                      <div class="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span class="text-black text-sm font-bold">{{ show.time }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Show Info -->
                  <div class="p-6">
                    <div class="mb-4">
                      <h4 class="text-xl font-bold text-black mb-2 group-hover:text-red-600 transition-colors line-clamp-1">
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
                          <div class="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                            <img 
                              v-if="host.image_url" 
                              :src="host.image_url" 
                              :alt="host.name" 
                              class="w-full h-full object-cover"
                            />
                            <div v-else class="w-full h-full bg-red-600 flex items-center justify-center">
                              <span class="text-white text-xs font-bold">{{ host.name.charAt(0) }}</span>
                            </div>
                          </div>
                          <span class="text-gray-700 text-sm font-medium">{{ host.name }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Listen Button -->
                    <button 
                      v-if="isCurrentShow(show)"
                      @click.stop="togglePlayPause"
                      class="w-full bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105"
                    >
                      <component :is="isPlaying ? Pause : Play" class="h-4 w-4" />
                      <span>{{ isPlaying ? 'LIVE NOW' : 'LISTEN LIVE' }}</span>
                    </button>
                    <button 
                      v-else
                      @click.stop="selectShow(show)"
                      class="w-full bg-gray-100 hover:bg-gray-200 text-black font-medium py-3 px-4 rounded-xl transition-all transform hover:scale-105"
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

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="w-20 h-20 bg-gray-100  flex items-center justify-center mx-auto mb-6">
            <Calendar class="w-10 h-10 text-gray-400" />
          </div>
          <h3 class="text-2xl font-bold text-black mb-4">No Shows Scheduled</h3>
          <p class="text-gray-600">Check back for updates to our {{ getSelectedDayName() }} programming schedule</p>
        </div>

        <!-- Carousel Indicators -->
        <div v-if="totalPages > 1" class="flex justify-center mt-8 space-x-2">
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page - 1)"
            :class="[
              'w-3 h-3 rounded-full transition-all duration-300',
              currentPage === (page - 1)
                ? 'bg-red-600 w-8' 
                : 'bg-gray-300 hover:bg-gray-400'
            ]"
          />
        </div>
      </div>

      <!-- Show Details Modal -->
      <div v-if="selectedShow" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click="closeShowDetails">
        <div class="bg-white  border border-gray-200 p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto" @click.stop>
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-black">{{ selectedShow.title }}</h3>
            <button @click="closeShowDetails" class="text-gray-400 hover:text-gray-600">
              <X class="h-6 w-6" />
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img 
                :src="selectedShow.image || 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'" 
                :alt="selectedShow.title" 
                class="w-full aspect-square object-cover rounded-xl" 
              />
            </div>
            
            <div>
              <div class="mb-4">
                <span class="bg-red-600/10 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                  {{ selectedShow.time }}
                </span>
              </div>
              
              <p class="text-gray-700 mb-6 leading-relaxed">{{ selectedShow.description }}</p>
              
              <div v-if="selectedShow.hosts && selectedShow.hosts.length > 0" class="mb-6">
                <h4 class="text-black font-semibold mb-3">Hosts</h4>
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
                      <div v-else class="w-full h-full bg-red-600 flex items-center justify-center">
                        <span class="text-white font-bold">{{ host.name.charAt(0) }}</span>
                      </div>
                    </div>
                    <div>
                      <p class="text-black font-medium">{{ host.name }}</p>
                      <p class="text-gray-600 text-sm">{{ host.role }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <button 
                v-if="isCurrentShow(selectedShow)"
                @click="togglePlayPause" 
                class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300"
              >
                <component :is="isPlaying ? Pause : Play" class="h-5 w-5" />
                <span>{{ isPlaying ? 'LIVE NOW' : 'LISTEN LIVE' }}</span>
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
  return 'md:grid-cols-4';
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

// Update items per page
const updateItemsPerPage = () => {
  itemsPerPage.value = 4;
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