<template>
  <section class="relative overflow-hidden h-full" ref="sectionRef">
    <!-- Dynamic animated background -->
    <div class="absolute inset-0 overflow-hidden opacity-15 pointer-events-none">
      <!-- Floating music notes -->
      <div class="absolute top-1/4 left-1/4 w-6 h-6 text-capital-blue animate-bounce" style="animation-delay: 0s; animation-duration: 3s;">♪</div>
      <div class="absolute top-3/4 right-1/4 w-6 h-6 text-capital-yellow animate-bounce" style="animation-delay: 1s; animation-duration: 4s;">♫</div>
      <div class="absolute bottom-1/4 left-3/4 w-6 h-6 text-capital-red animate-bounce" style="animation-delay: 2s; animation-duration: 3.5s;">♪</div>
      
      <!-- Geometric shapes -->
      <div class="absolute top-10 right-10 w-20 h-20 border-2 border-capital-purple rounded-full animate-spin-slow opacity-30"></div>
      <div class="absolute bottom-10 left-10 w-16 h-16 bg-capital-cyan/20 transform rotate-45 animate-pulse"></div>
      
      <!-- Audio wave pattern -->
      <div class="absolute inset-0 flex items-center justify-center">
        <svg width="100%" height="60" viewBox="0 0 400 60" class="opacity-20">
          <path d="M0,30 Q100,10 200,30 T400,30" stroke="url(#waveGradient)" stroke-width="2" fill="none" class="animate-wave"/>
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#00a7e1"/>
              <stop offset="50%" style="stop-color:#ffea00"/>
              <stop offset="100%" style="stop-color:#ef233c"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
    
    <div class="h-full flex flex-col space-y-4">
      <!-- Current Show - Entertainment Hero -->
      <div class="relative bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-black/95 backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl shadow-capital-blue/10">
        <!-- Animated border glow -->
        <div class="absolute inset-0 bg-gradient-to-r from-capital-blue via-capital-purple to-capital-red opacity-20 blur-xl animate-pulse-slow"></div>
        <div class="absolute inset-[1px] bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-black/95 rounded-3xl"></div>
        
        <!-- Live indicator with enhanced style -->
        <div class="absolute top-4 right-4 z-30">
          <div class="relative bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-4 py-2 rounded-full shadow-lg shadow-red-500/30">
            <div class="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-ping opacity-30"></div>
            <div class="relative flex items-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
              <div class="w-2 h-2 bg-white rounded-full animate-pulse shadow-lg"></div>
              <span class="entertainment-text">{{ currentShow?.is_live ? 'LIVE NOW' : 'ON AIR' }}</span>
            </div>
          </div>
        </div>

        <!-- Equalizer visualization -->
        <div class="absolute top-4 left-4 z-20 flex items-end gap-1 opacity-70">
          <div v-for="n in 8" :key="n" 
               class="w-1 bg-gradient-to-t from-capital-blue to-capital-cyan rounded-full animate-equalize shadow-lg"
               :style="`animation-delay: ${n * 0.1}s; height: ${20 + Math.random() * 30}px`"></div>
        </div>

        <!-- Loading state with entertainment style -->
        <div v-if="!stationData" class="relative z-10 p-6">
          <div class="animate-pulse">
            <div class="flex gap-6">
              <div class="w-24 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl shadow-xl"></div>
              <div class="flex-1 space-y-4">
                <div class="h-6 bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg w-3/4"></div>
                <div class="h-8 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg w-1/2"></div>
                <div class="h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Current show content with enhanced styling -->
        <div v-else-if="currentShow" class="relative z-10 p-6">
          <div class="flex gap-6 mb-6">
            <!-- Enhanced show image -->
            <div class="relative group">
              <div class="absolute -inset-1 bg-gradient-to-r from-capital-blue via-capital-purple to-capital-red rounded-2xl blur opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div class="relative w-24 h-24 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  :src="currentShow.program.image_url || 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'" 
                  :alt="currentShow.program.title" 
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <!-- Play button overlay -->
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                    <Play class="h-4 w-4 text-black ml-0.5" />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Enhanced show info -->
            <div class="flex-1 min-w-0">
              <!-- Time and studio with glowing effect -->
              <div class="flex items-center gap-4 mb-3">
                <div class="flex items-center gap-2 bg-gradient-to-r from-capital-yellow/20 to-yellow-600/20 px-3 py-1.5 rounded-full border border-capital-yellow/30">
                  <Clock class="h-4 w-4 text-capital-yellow" />
                  <span class="text-capital-yellow font-semibold text-sm entertainment-text">
                    {{ currentShow.start_time }} - {{ currentShow.end_time }}
                  </span>
                </div>
                <div class="bg-gradient-to-r from-capital-blue/20 to-blue-600/20 px-3 py-1.5 rounded-full border border-capital-blue/30">
                  <span class="text-capital-blue font-semibold text-xs entertainment-text tracking-wider">
                    STUDIO {{ currentShow.studio }}
                  </span>
                </div>
              </div>
              
              <!-- Enhanced show title -->
              <h3 class="text-2xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent mb-2 entertainment-text">
                {{ currentShow.program.title }}
              </h3>
              
              <!-- Description with better styling -->
              <p class="text-slate-300 text-sm leading-relaxed line-clamp-2 mb-4">
                {{ currentShow.program.description }}
              </p>
            </div>
          </div>

          <!-- Enhanced hosts section -->
          <div class="flex items-center gap-4 mb-6 flex-wrap">
            <div v-for="(host, index) in getCurrentHosts().slice(0, 2)" :key="host.id" 
                 class="flex items-center gap-3 group/host">
              <div class="relative">
                <div class="absolute -inset-1 bg-gradient-to-r from-capital-blue to-capital-purple rounded-full blur opacity-40 group-hover/host:opacity-70 transition-opacity duration-300"></div>
                <div class="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                  <img 
                    :src="host.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(host.name)}&background=00a7e1&color=fff&size=40`" 
                    :alt="host.name" 
                    class="w-full h-full object-cover transition-transform duration-300 group-hover/host:scale-110" 
                  />
                </div>
                <!-- Online indicator -->
                <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-capital-green rounded-full border-2 border-slate-900 animate-pulse"></div>
              </div>
              <div>
                <p class="text-white font-semibold text-sm group-hover/host:text-capital-blue transition-colors">
                  {{ host.name }}
                </p>
                <p class="text-slate-400 text-xs entertainment-text">{{ host.role.toUpperCase() }}</p>
              </div>
            </div>
          </div>

          <!-- Enhanced listen button with premium styling -->
          <div class="relative group">
            <!-- Outer glow ring -->
            <div class="absolute -inset-1 bg-gradient-to-r from-capital-blue via-capital-purple to-capital-red rounded-2xl blur-md opacity-50 group-hover:opacity-80 transition-all duration-700 animate-pulse-slow"></div>
            
            <button @click="togglePlayPause" 
                    :disabled="isLoading || !canPlay"
                    class="relative w-full bg-gradient-to-r from-capital-blue via-capital-purple to-capital-red hover:from-capital-purple hover:via-capital-red hover:to-capital-blue text-white font-bold py-4 px-6 rounded-2xl transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-capital-blue/25 group/btn overflow-hidden">
              
              <!-- Button background animation -->
              <div class="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
              
              <!-- Button content -->
              <div class="relative flex items-center justify-center gap-3">
                <!-- Loading spinner with style -->
                <div v-if="isLoading" class="relative">
                  <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <div class="absolute inset-0 w-5 h-5 border-2 border-transparent border-t-capital-yellow rounded-full animate-spin" style="animation-duration: 0.8s; animation-direction: reverse;"></div>
                </div>
                
                <!-- Play/Pause icon with enhanced styling -->
                <div v-else class="relative">
                  <component :is="isPlaying ? Pause : Play" 
                             class="h-5 w-5 transition-all duration-300 group-hover/btn:scale-110" />
                  <div v-if="isPlaying" class="absolute -inset-2 border border-white/30 rounded-full animate-ping"></div>
                </div>
                
                <!-- Button text with entertainment styling -->
                <span class="entertainment-text text-lg tracking-wider">
                  {{ isLoading ? 'CONNECTING...' : isPlaying ? 'LIVE NOW' : 'LISTEN LIVE' }}
                </span>
                
                <!-- Listener count with style -->
                <div v-if="isPlaying && listeners > 0" 
                     class="bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
                  <div class="w-2 h-2 bg-capital-green rounded-full animate-pulse"></div>
                  <span class="text-sm font-semibold">{{ formatListeners(listeners) }}</span>
                </div>
              </div>
              
              <!-- Scanning effect -->
              <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 animate-scan"></div>
            </button>
          </div>
        </div>

        <!-- Enhanced no show fallback -->
        <div v-else class="relative z-10 p-6 text-center">
          <div class="relative mb-4">
            <div class="w-16 h-16 mx-auto bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center shadow-xl">
              <Radio class="h-8 w-8 text-slate-400" />
            </div>
            <div class="absolute -inset-2 bg-gradient-to-r from-capital-blue/20 to-capital-purple/20 rounded-2xl blur animate-pulse"></div>
          </div>
          <h3 class="text-xl font-bold text-white mb-2 entertainment-text">NON-STOP HITS</h3>
          <p class="text-slate-400">Premium music programming</p>
        </div>
      </div>

      <!-- Enhanced Up Next & Schedule Grid -->
      <div class="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Enhanced Up Next -->
        <div class="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-5 shadow-xl">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-white font-bold entertainment-text tracking-wide">UP NEXT</h4>
            <div class="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 text-xs px-3 py-1 rounded-full border border-orange-500/30 entertainment-text">
              {{ nextShow ? 'COMING SOON' : 'TBA' }}
            </div>
          </div>

          <div v-if="nextShow" class="space-y-4">
            <div class="flex gap-4 group">
              <div class="relative">
                <div class="w-16 h-16 rounded-xl overflow-hidden bg-slate-700 flex-shrink-0 shadow-lg">
                  <img 
                    :src="nextShow.program.image_url || 'https://images.unsplash.com/photo-1530288782965-fbad40327074?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'" 
                    :alt="nextShow.program.title" 
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  />
                </div>
                <div class="absolute -top-1 -right-1 w-4 h-4 bg-capital-yellow rounded-full border-2 border-slate-900 flex items-center justify-center">
                  <Clock class="h-2 w-2 text-black" />
                </div>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <div class="bg-capital-yellow/20 px-2 py-1 rounded-md border border-capital-yellow/30">
                    <span class="text-xs text-capital-yellow font-semibold entertainment-text">
                      {{ nextShow.start_time }}
                    </span>
                  </div>
                </div>
                <h5 class="text-white font-bold text-base line-clamp-1 group-hover:text-capital-yellow transition-colors entertainment-text">
                  {{ nextShow.program.title }}
                </h5>
                
                <!-- Next show hosts with enhanced styling -->
                <div v-if="getNextHosts().length > 0" class="flex items-center gap-2 mt-2">
                  <div v-for="host in getNextHosts().slice(0, 2)" :key="host.id" class="flex items-center gap-1">
                    <div class="w-5 h-5 rounded-full bg-gradient-to-br from-capital-blue to-capital-purple flex items-center justify-center shadow-md">
                      <span class="text-xs text-white font-bold">{{ host.name.charAt(0) }}</span>
                    </div>
                    <span class="text-xs text-slate-300 font-medium">{{ host.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-6">
            <div class="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl flex items-center justify-center shadow-lg">
              <Clock class="h-6 w-6 text-slate-400" />
            </div>
            <p class="text-sm text-slate-400 entertainment-text">SCHEDULE TBA</p>
          </div>
        </div>

        <!-- Enhanced Today's Schedule -->
        <div class="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/30 p-5 shadow-xl overflow-hidden">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-white font-bold entertainment-text tracking-wide">{{ getSelectedDayName().toUpperCase() }}</h4>
            <div class="bg-gradient-to-r from-capital-blue/20 to-capital-purple/20 text-capital-blue text-xs px-3 py-1 rounded-full border border-capital-blue/30 entertainment-text">
              {{ selectedDaySchedule.length }} SHOWS
            </div>
          </div>

          <!-- Enhanced day selector -->
          <div class="flex gap-1 mb-4 overflow-x-auto hide-scrollbar">
            <button 
              v-for="(day, index) in weekDays.slice(0, 7)" 
              :key="index"
              @click="setSelectedDay(getDayKey(index))"
              class="flex-shrink-0 text-xs px-3 py-2 rounded-lg transition-all duration-300 entertainment-text font-semibold"
              :class="[
                selectedDay === getDayKey(index) 
                  ? 'bg-gradient-to-r from-capital-blue to-capital-purple text-white shadow-lg scale-105' 
                  : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600/50',
                isToday(index) ? 'ring-2 ring-capital-yellow/50' : ''
              ]"
            >
              {{ day.slice(0, 3).toUpperCase() }}
            </button>
          </div>

          <!-- Enhanced shows list -->
          <div class="space-y-2 max-h-48 overflow-y-auto hide-scrollbar">
            <div 
              v-for="(show, index) in selectedDaySchedule.slice(0, 8)" 
              :key="index"
              class="flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group"
              :class="[
                isCurrentShow(show) && isSelectedDayToday 
                  ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 shadow-lg shadow-red-500/10' 
                  : isUpcomingShow(show) && isSelectedDayToday 
                  ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                  : 'hover:bg-slate-700/30 border border-transparent'
              ]"
            >
              <div class="relative">
                <div class="w-10 h-10 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0 shadow-md">
                  <img 
                    :src="show.program.image_url || 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'" 
                    :alt="show.program.title" 
                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                  />
                </div>
                <!-- Status indicator -->
                <div v-if="isCurrentShow(show) && isSelectedDayToday" 
                     class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg"></div>
                <div v-else-if="isUpcomingShow(show) && isSelectedDayToday" 
                     class="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg"></div>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs text-slate-400 font-medium">{{ show.start_time }}</span>
                  <span v-if="isCurrentShow(show) && isSelectedDayToday" 
                        class="text-xs text-red-400 font-bold entertainment-text bg-red-500/20 px-2 py-0.5 rounded-full">
                    LIVE
                  </span>
                  <span v-else-if="isUpcomingShow(show) && isSelectedDayToday" 
                        class="text-xs text-blue-400 font-bold entertainment-text bg-blue-500/20 px-2 py-0.5 rounded-full">
                    NEXT
                  </span>
                </div>
                <p class="text-sm text-white font-semibold line-clamp-1 group-hover:text-capital-yellow transition-colors">
                  {{ show.program.title }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Radio, Clock, Play, Pause } from 'lucide-vue-next';
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const isVisible = ref(false);
const sectionRef = ref(null);
const stationData = computed(() => store.getters.station);

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Audio Player State from store
const isPlaying = computed(() => store.getters.isPlaying || false);
const isLoading = computed(() => store.getters.isLoading || false);
const canPlay = computed(() => store.getters.canPlay !== false);
const listeners = computed(() => store.getters.listeners || stationData.value?.listeners || 0);
const error = computed(() => store.getters.error);

// Format listeners count
const formatListeners = (count) => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

// Get current day of week
const getCurrentDay = () => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
};

const selectedDay = ref(getCurrentDay());

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

// Get today's schedule
const todaySchedule = computed(() => {
  if (!stationData.value?.schedule?.sessions) return [];
  const today = getCurrentDay();
  return stationData.value.schedule.sessions[today] || [];
});

// Get current show
const currentShow = computed(() => {
  const currentTime = getCurrentTime();
  return todaySchedule.value.find(show => 
    isTimeBetween(currentTime, show.start_time, show.end_time)
  );
});

// Get next show
const nextShow = computed(() => {
  if (!todaySchedule.value.length) return null;
  
  const currentTime = getCurrentTime();
  const upcoming = todaySchedule.value.filter(show => {
    const showStart = show.start_time.replace(':', '');
    const current = currentTime.replace(':', '');
    return showStart > current;
  });
  
  return upcoming.length > 0 ? upcoming[0] : todaySchedule.value[0];
});

// Get hosts for current show
const getCurrentHosts = () => {
  if (!currentShow.value?.hosts) return [];
  
  return currentShow.value.hosts.map(hostId => {
    const host = currentShow.value.program.hosts.find(h => h.id === hostId);
    return host || { id: hostId, name: 'Unknown Host', role: 'Host' };
  });
};

// Get hosts for next show
const getNextHosts = () => {
  if (!nextShow.value?.hosts) return [];
  
  return nextShow.value.hosts.map(hostId => {
    const host = nextShow.value.program.hosts.find(h => h.id === hostId);
    return host || { id: hostId, name: 'Unknown Host', role: 'Host' };
  });
};

// Get selected day's schedule
const selectedDaySchedule = computed(() => {
  if (!stationData.value?.schedule?.sessions) return [];
  return stationData.value.schedule.sessions[selectedDay.value] || [];
});

// Check if selected day is today
const isSelectedDayToday = computed(() => {
  return selectedDay.value === getCurrentDay();
});

// Set selected day
const setSelectedDay = (day) => {
  selectedDay.value = day;
};

// Get day key from index
const getDayKey = (index) => {
  const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  return dayKeys[index];
};

// Get selected day name
const getSelectedDayName = () => {
  const dayIndex = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].indexOf(selectedDay.value);
  return weekDays[dayIndex] || 'Unknown';
};

// Check if show is currently live
const isCurrentShow = (show) => {
  if (!isSelectedDayToday.value) return false;
  const currentTime = getCurrentTime();
  return isTimeBetween(currentTime, show.start_time, show.end_time);
};

// Check if show is upcoming
const isUpcomingShow = (show) => {
  if (!isSelectedDayToday.value) return false;
  const currentTime = getCurrentTime();
  const currentNum = parseInt(currentTime.replace(':', ''));
  const showStart = parseInt(show.start_time.replace(':', ''));
  
  const upcomingShows = selectedDaySchedule.value.filter(s => {
    const startNum = parseInt(s.start_time.replace(':', ''));
    return startNum > currentNum;
  }).sort((a, b) => parseInt(a.start_time.replace(':', '')) - parseInt(b.start_time.replace(':', '')));
  
  return upcomingShows.length > 0 && upcomingShows[0].program_id === show.program_id;
};

// Toggle play/pause function
const togglePlayPause = async () => {
  try {
    if (store.dispatch) {
      await store.dispatch('togglePlayPause');
    } else {
      if (stationData.value?.streaming_link) {
        window.open(stationData.value.streaming_link, '_blank');
      }
    }
  } catch (err) {
    console.error('Failed to toggle playback:', err);
    if (stationData.value?.streaming_link) {
      window.open(stationData.value.streaming_link, '_blank');
    }
  }
};

// Check if day is today
const isToday = (index) => {
  const today = new Date().getDay();
  const adjustedIndex = index === 6 ? 0 : index + 1;
  return today === adjustedIndex;
};

onMounted(() => {
  selectedDay.value = getCurrentDay();
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
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

/* Enhanced animations */
@keyframes pulse-slow {
  0%, 100% { 
    opacity: 0.4; 
    transform: scale(1);
  }
  50% { 
    opacity: 0.8; 
    transform: scale(1.05);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes equalize {
  0%, 100% { 
    height: 20px; 
    opacity: 0.6;
  }
  25% { 
    height: 35px; 
    opacity: 0.8;
  }
  50% { 
    height: 45px; 
    opacity: 1;
  }
  75% { 
    height: 30px; 
    opacity: 0.9;
  }
}

.animate-equalize {
  animation: equalize 1.2s ease-in-out infinite;
}

@keyframes spin-slow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

@keyframes wave {
  0%, 100% { 
    d: path("M0,30 Q100,10 200,30 T400,30");
  }
  50% { 
    d: path("M0,30 Q100,50 200,30 T400,30");
  }
}

.animate-wave {
  animation: wave 4s ease-in-out infinite;
}

@keyframes shimmer {
  0% { 
    transform: translateX(-100%) skewX(-15deg);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% { 
    transform: translateX(200%) skewX(-15deg);
    opacity: 0;
  }
}

.animate-shimmer {
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes scan {
  0% { 
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% { 
    transform: translateX(100%);
    opacity: 0;
  }
}

.animate-scan {
  animation: scan 2s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(0, 167, 225, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(0, 167, 225, 0.6), 0 0 60px rgba(0, 167, 225, 0.4);
  }
}

.animate-glow {
  animation: glow 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
  }
  33% { 
    transform: translateY(-10px) rotate(2deg);
  }
  66% { 
    transform: translateY(5px) rotate(-1deg);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Enhanced hover effects */
.group:hover .group-hover\:animate-spin {
  animation: spin 1s linear infinite;
}

.group\btn:hover .group-hover\/btn\:scale-110 {
  transform: scale(1.1);
}

/* Custom gradient text effects */
.text-gradient-entertainment {
  background: linear-gradient(45deg, #00a7e1, #ffea00, #ef233c, #9d4edd);
  background-size: 300% 300%;

  background-clip: text;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Enhanced button states */
button:disabled {
  cursor: not-allowed;
  filter: grayscale(0.5);
}

button:not(:disabled):active {
  transform: scale(0.98);
}

/* Custom scrollbar for webkit browsers */
.hide-scrollbar::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.hide-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
  border-radius: 4px;
}

.hide-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #00a7e1, #9d4edd);
  border-radius: 4px;
}

.hide-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #0086b3, #7c3aed);
}

/* Enhanced border animations */
@keyframes border-glow {
  0%, 100% {
    border-color: rgba(0, 167, 225, 0.3);
    box-shadow: 0 0 10px rgba(0, 167, 225, 0.2);
  }
  50% {
    border-color: rgba(0, 167, 225, 0.8);
    box-shadow: 0 0 20px rgba(0, 167, 225, 0.4);
  }
}

.animate-border-glow {
  animation: border-glow 2s ease-in-out infinite;
}

/* Music note animations */
@keyframes musical-note {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
    opacity: 0.6;
  }
  25% { 
    transform: translateY(-15px) rotate(5deg);
    opacity: 1;
  }
  50% { 
    transform: translateY(-10px) rotate(-3deg);
    opacity: 0.8;
  }
  75% { 
    transform: translateY(-20px) rotate(8deg);
    opacity: 1;
  }
}

.animate-musical-note {
  animation: musical-note 4s ease-in-out infinite;
}

/* Enhanced responsive design */
@media (max-width: 768px) {
  .entertainment-text {
    font-size: 0.9em;
    letter-spacing: 0.3px;
  }
  
  .animate-equalize {
    animation-duration: 1.5s;
  }
  
  /* Reduce animation intensity on mobile for better performance */
  .animate-pulse-slow,
  .animate-spin-slow,
  .animate-shimmer {
    animation-duration: 6s;
  }
}

/* Dark theme enhancements */
@media (prefers-color-scheme: dark) {
  .bg-gradient-to-br {
    background-image: linear-gradient(to bottom right, 
      rgba(30, 41, 59, 0.95), 
      rgba(15, 23, 42, 0.95), 
      rgba(0, 0, 0, 0.95)
    );
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .border-slate-700\/30 {
    border-color: rgba(148, 163, 184, 0.6);
  }
  
  .text-slate-300,
  .text-slate-400 {
    color: rgb(203, 213, 225);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .animate-pulse-slow,
  .animate-equalize,
  .animate-spin-slow,
  .animate-wave,
  .animate-shimmer,
  .animate-scan,
  .animate-glow,
  .animate-float,
  .animate-border-glow,
  .animate-musical-note {
    animation: none;
  }
  
  .transition-all,
  .transition-colors,
  .transition-transform,
  .transition-opacity {
    transition: none;
  }
}

/* Print styles */
@media print {
  .absolute,
  .animate-pulse,
  .animate-spin,
  button {
    display: none !important;
  }
  
  .bg-gradient-to-br,
  .bg-gradient-to-r {
    background: white !important;
    color: black !important;
  }
}
</style>