<template>
  <div>
    <!-- Main Radio Player -->
    <transition
      enter-active-class="transform transition ease-out duration-500"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transform transition ease-in duration-300"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <div
        v-if="isVisible"
        class="fixed bottom-0 left-0 right-0 z-50 shadow-2xl"
        :class="{ 'h-20': isMinimized, 'h-auto': !isMinimized }"
      >
        <!-- Background with Glass Morphism -->
        <div class="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-800/90 to-slate-700/85 backdrop-blur-xl border-t border-slate-600/30"></div>
        
        <!-- Animated Background Pattern -->
        <div class="absolute inset-0 opacity-10 pointer-events-none">
          <div class="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-capital-blue to-transparent"></div>
          <div v-if="isPlaying" class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-capital-blue via-capital-yellow to-capital-red animate-pulse"></div>
        </div>

        <!-- Minimized View -->
        <div v-if="isMinimized" class="relative h-full px-4 flex items-center justify-between">
          <!-- Left Section -->
          <div class="flex items-center gap-4">
            <button
              @click="isMinimized = false"
              class="p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-300 group"
            >
              <ChevronUp class="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </button>
            
            <div class="flex items-center gap-3">
              <!-- Station Logo/Now Playing Art -->
              <div class="relative">
                <div class="w-12 h-12 rounded-lg overflow-hidden bg-slate-700 border border-slate-600/50">
                  <img
                    :src="currentStation?.logo_url || stationArtwork"
                    :alt="currentStation?.name || 'Capital FM'"
                    class="w-full h-full object-cover"
                  />
                </div>
                <!-- Live Indicator -->
                <div v-if="isPlaying" class="absolute -top-1 -right-1 w-3 h-3 bg-capital-red rounded-full animate-pulse border-2 border-white shadow-lg" />
                <!-- Loading Indicator -->
                <div v-else-if="isLoading" class="absolute -top-1 -right-1 w-3 h-3 border border-capital-blue border-t-transparent rounded-full animate-spin" />
              </div>
              
              <!-- Station Info -->
              <div>
                <p class="text-white font-semibold text-sm">
                  {{ currentStation?.name || 'Capital FM' }}
                </p>
                <p class="text-slate-400 text-xs flex items-center gap-1">
                  <span>{{ currentStation?.frequency || '91.3' }} MHz</span>
                  <div v-if="isPlaying" class="w-1 h-1 bg-capital-green rounded-full animate-pulse"></div>
                  <span v-if="isPlaying" class="text-capital-green">LIVE</span>
                  <span v-else-if="isLoading" class="text-capital-yellow">Connecting...</span>
                  <span v-else class="text-slate-400">{{ currentStation?.tagline || 'Fresh Hits' }}</span>
                </p>
              </div>
            </div>
          </div>
          
          <!-- Center Section - Controls -->
          <div class="flex items-center gap-3">
            <!-- Volume Control (Minimized) -->
            <div class="flex items-center gap-2">
              <button @click="toggleMute" class="p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors">
                <VolumeX v-if="isMuted" class="w-4 h-4 text-slate-400" />
                <Volume2 v-else class="w-4 h-4 text-slate-400" />
              </button>
              <div class="w-16 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div class="h-full bg-capital-blue rounded-full transition-all duration-300" 
                     :style="{ width: `${volume * 100}%` }" />
              </div>
            </div>
            
            <!-- Main Play/Pause Button -->
            <button
              @click="togglePlayPause"
              :disabled="isLoading || !canPlay"
              class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 relative overflow-hidden group"
              :class="[
                isPlaying 
                  ? 'bg-gradient-to-r from-capital-green to-capital-blue hover:shadow-lg hover:shadow-capital-green/30' 
                  : 'bg-gradient-to-r from-capital-blue to-capital-purple hover:shadow-lg hover:shadow-capital-blue/30',
                (isLoading || !canPlay) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              ]"
            >
              <!-- Button Background Effect -->
              <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <!-- Loading Spinner -->
              <div v-if="isLoading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <!-- Play/Pause Icons -->
              <Pause v-else-if="isPlaying" class="w-5 h-5 text-white relative z-10" />
              <Play v-else class="w-5 h-5 text-white ml-0.5 relative z-10" />
            </button>
            
            <!-- Listener Count -->
            <div v-if="listeners > 0" class="text-xs text-slate-400 flex items-center gap-1">
              <Users class="w-3 h-3" />
              <span>{{ formatListeners(listeners) }}</span>
            </div>
          </div>
          
          <!-- Right Section -->
          <div class="flex items-center gap-3">
            <!-- Connection Status -->
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full" 
                   :class="{
                     'bg-capital-green animate-pulse': isConnected && isPlaying,
                     'bg-capital-yellow animate-pulse': isLoading,
                     'bg-capital-red': error,
                     'bg-slate-500': !isConnected && !isLoading && !error
                   }"></div>
              <span class="text-xs text-slate-400">
                {{ connectionStatusText }}
              </span>
            </div>
            
            <button
              @click="hidePlayer"
              class="p-2 rounded-lg hover:bg-slate-700/50 transition-colors group"
            >
              <X class="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>
        
        <!-- Expanded View -->
        <div v-else class="relative p-6">
          <!-- Header -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-lg overflow-hidden bg-slate-700 border border-slate-600/50">
                <img
                  :src="currentStation?.logo_url || stationArtwork"
                  :alt="currentStation?.name || 'Capital FM'"
                  class="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 class="text-white text-xl font-bold">{{ currentStation?.name || 'Capital FM' }}</h2>
                <p class="text-slate-400 text-sm">{{ currentStation?.frequency || '91.3' }} MHz • {{ currentStation?.tagline || 'Fresh Hits for Uganda' }}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <button
                @click="isMinimized = true"
                class="p-2 rounded-lg hover:bg-slate-700/50 transition-colors group"
              >
                <ChevronDown class="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </button>
              <button
                @click="hidePlayer"
                class="p-2 rounded-lg hover:bg-slate-700/50 transition-colors group"
              >
                <X class="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
          
          <!-- Error Message -->
          <div v-if="error" class="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg flex items-center gap-3">
            <AlertCircle class="w-5 h-5 text-red-400" />
            <div class="flex-1">
              <p class="text-red-300 text-sm">{{ error }}</p>
            </div>
            <button @click="retryConnection" class="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors">
              Retry
            </button>
          </div>
          
          <!-- Player Content -->
          <div class="grid md:grid-cols-3 gap-6">
            <!-- Now Playing / Station Info -->
            <div class="md:col-span-2">
              <div class="flex items-start gap-6">
                <!-- Station Artwork -->
                <div class="relative group">
                  <div class="w-32 h-32 rounded-xl overflow-hidden bg-slate-700 border border-slate-600/50">
                    <img
                      :src="currentStation?.banner_url || stationArtwork"
                      :alt="currentStation?.name || 'Capital FM'"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  
                  <!-- Overlay Play Button -->
                  <div class="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      @click="togglePlayPause"
                      :disabled="isLoading || !canPlay"
                      class="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
                    >
                      <div v-if="isLoading" class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <Pause v-else-if="isPlaying" class="w-8 h-8 text-white" />
                      <Play v-else class="w-8 h-8 text-white ml-1" />
                    </button>
                  </div>
                  
                  <!-- Live Indicator -->
                  <div v-if="isPlaying" class="absolute -top-2 -right-2 px-2 py-1 bg-capital-red rounded-full text-white text-xs font-bold animate-pulse">
                    LIVE
                  </div>
                </div>
                
                <!-- Station Details -->
                <div class="flex-1">
                  <h3 class="text-white text-2xl font-bold mb-1">{{ currentStation?.name || 'Capital FM' }}</h3>
                  <p class="text-slate-300 text-lg mb-2">{{ currentStation?.frequency || '91.3' }} MHz</p>
                  <p class="text-slate-400 mb-4">{{ currentStation?.about || 'Uganda\'s Premier Radio Station' }}</p>
                  
                  <!-- Stream Quality Indicator -->
                  <div class="mb-4">
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-sm text-slate-400">Stream Quality:</span>
                      <div class="flex gap-1">
                        <div v-for="n in 5" :key="n" 
                             class="w-1 h-3 rounded-full transition-colors"
                             :class="isPlaying && n <= 4 ? 'bg-capital-green' : 'bg-slate-600'"></div>
                      </div>
                      <span class="text-xs text-slate-400">{{ isPlaying ? 'HD' : 'Offline' }}</span>
                    </div>
                  </div>
                  
                  <!-- Main Controls -->
                  <div class="flex items-center gap-4 mb-6">
                    <button
                      @click="togglePlayPause"
                      :disabled="isLoading || !canPlay"
                      class="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg relative overflow-hidden group"
                      :class="[
                        isPlaying 
                          ? 'bg-gradient-to-r from-capital-green to-capital-blue hover:shadow-capital-green/30' 
                          : 'bg-gradient-to-r from-capital-blue to-capital-purple hover:shadow-capital-blue/30',
                        (isLoading || !canPlay) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                      ]"
                    >
                      <!-- Button Background Effect -->
                      <div class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div v-if="isLoading" class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <Pause v-else-if="isPlaying" class="w-6 h-6 text-white relative z-10" />
                      <Play v-else class="w-6 h-6 text-white ml-0.5 relative z-10" />
                    </button>
                    
                    <!-- Additional Controls -->
                    <div class="flex items-center gap-2">
                      <button @click="toggleMute" class="p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
                        <VolumeX v-if="isMuted" class="w-5 h-5 text-slate-400" />
                        <Volume2 v-else class="w-5 h-5 text-slate-400" />
                      </button>
                      
                      <button class="p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
                        <Heart class="w-5 h-5 text-slate-400 hover:text-capital-red transition-colors" />
                      </button>
                      
                      <button class="p-3 rounded-lg hover:bg-slate-700/50 transition-colors">
                        <Share class="w-5 h-5 text-slate-400 hover:text-capital-blue transition-colors" />
                      </button>
                    </div>
                  </div>
                  
                  <!-- Volume Control -->
                  <div class="flex items-center gap-4">
                    <Volume2 class="w-5 h-5 text-slate-400" />
                    <div class="flex-1 relative">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        :value="volume"
                        @input="setVolume($event.target.value)"
                        class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    <span class="text-xs text-slate-400 w-8">{{ Math.round(volume * 100) }}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Station Programs / Schedule -->
            <div>
              <div class="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                <h4 class="text-white font-semibold mb-4 flex items-center gap-2">
                  <Radio class="w-5 h-5 text-capital-blue" />
                  Current Program
                </h4>
                
                <!-- Current Show -->
                <div v-if="currentShow" class="bg-capital-blue/10 border border-capital-blue/20 rounded-lg p-3 mb-4">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-lg overflow-hidden bg-slate-700">
                      <img
                        :src="currentShow.image_url || defaultShowImage"
                        :alt="currentShow.title"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div class="flex-1">
                      <p class="text-white font-medium">{{ currentShow.title }}</p>
                      <p class="text-xs text-capital-blue mt-1">
                        {{ currentShow.hosts?.map(h => h.name).join(' & ') || 'Radio Host' }}
                      </p>
                      <p class="text-xs text-slate-400">{{ currentShow.duration || 60 }} minutes</p>
                    </div>
                  </div>
                </div>
                
                <!-- Upcoming Programs -->
                <h5 class="text-white font-medium mb-3 text-sm">Station Programs</h5>
                <div class="space-y-2 max-h-32 overflow-y-auto">
                  <div
                    v-for="(program, index) in stationPrograms"
                    :key="index"
                    class="flex items-center gap-3 p-2 rounded hover:bg-slate-700/30 transition-colors"
                  >
                    <div class="w-8 h-8 rounded overflow-hidden bg-slate-700 flex-shrink-0">
                      <img
                        :src="program.image_url || defaultShowImage"
                        :alt="program.title"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm text-white truncate">{{ program.title }}</p>
                      <p class="text-xs text-slate-400">{{ program.type || 'Live Show' }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Listeners Count -->
                <div v-if="listeners > 0" class="mt-4 pt-3 border-t border-slate-700/50">
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-slate-400">Listeners</span>
                    <div class="flex items-center gap-1 text-capital-green">
                      <Users class="w-4 h-4" />
                      <span class="font-medium">{{ formatListeners(listeners) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- Floating Button -->
    <div v-if="!isVisible" class="fixed z-50">
      <button
        @click="showPlayer"
        class="floating-button"
        :class="getFloatingButtonPosition()"
      >
        <!-- Button Background -->
        <div class="absolute inset-0 rounded-full transition-all duration-300"
             :class="isPlaying ? 'bg-gradient-to-r from-capital-green to-capital-blue' : 'bg-gradient-to-r from-capital-blue to-capital-purple'"></div>
        
        <!-- Icon -->
        <Radio class="w-6 h-6 text-white relative z-10" />
        
        <!-- Live Indicator -->
        <div v-if="isPlaying" class="absolute -top-1 -right-1 w-3 h-3 bg-capital-red rounded-full animate-pulse border-2 border-white shadow-lg" />
        
        <!-- Loading Indicator -->
        <div v-else-if="isLoading" class="absolute -top-1 -right-1 w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import {
  Play, Pause, ChevronUp, ChevronDown, Volume2, VolumeX, Heart, Share, Radio, X, Users, AlertCircle
} from 'lucide-vue-next';

const store = useStore();

// Local State (only UI state, not audio state)
const isVisible = ref(false);
const isMinimized = ref(true);
const floatingButtonPosition = ref('bottom-right');

// Audio Controller State from Vuex Store (direct getters like in Navbar)
const isPlaying = computed(() => store.getters.isPlaying);
const isLoading = computed(() => store.getters.isLoading);
const canPlay = computed(() => store.getters.canPlay);
const volume = computed(() => store.getters.volume);
const isMuted = computed(() => store.getters.isMuted);
const currentStation = computed(() => store.getters.currentStation);
const currentShow = computed(() => store.getters.currentShow);
const listeners = computed(() => store.getters.listeners);
const error = computed(() => store.getters.error);
const isConnected = computed(() => store.getters.isConnected);
const connectionStatus = computed(() => store.getters.connectionStatus);

// Auto-show player when playback starts
watch(isPlaying, (newVal) => {
  if (newVal) {
    isVisible.value = true;
  }
});

// Computed Properties
const connectionStatusText = computed(() => {
  if (isLoading.value) return 'Connecting...';
  if (error.value) return 'Error';
  if (isPlaying.value) return 'Live';
  if (isConnected.value) return 'Ready';
  return 'Offline';
});

const stationPrograms = computed(() => {
  return currentStation.value?.programs || [];
});

// Default Images
const stationArtwork = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=600&fit=crop';
const defaultShowImage = 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=100&h=100&fit=crop';

// Methods - calling store actions directly like in Navbar
const togglePlayPause = async () => {
  try {
    await store.dispatch('togglePlayPause');
  } catch (err) {
    console.error('Failed to toggle playback:', err);
  }
};

const setVolume = (value) => {
  store.dispatch('setVolume', parseFloat(value));
};

const toggleMute = () => {
  store.dispatch('toggleMute');
};

const retryConnection = () => {
  if (currentStation.value) {
    store.dispatch('loadStation', currentStation.value);
  }
};

const formatListeners = (count) => {
  if (count > 1000000) return (count / 1000000).toFixed(1) + 'M';
  if (count > 1000) return (count / 1000).toFixed(1) + 'K';
  return count.toString();
};

const showPlayer = () => {
  isVisible.value = true;
};

const hidePlayer = () => {
  isVisible.value = false;
};

const getFloatingButtonPosition = () => {
  const positions = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-center': 'bottom-6 left-1/2 transform -translate-x-1/2',
    'center-right': 'top-1/2 right-6 transform -translate-y-1/2'
  };
  return positions[floatingButtonPosition.value];
};
</script>

<style scoped>
.floating-button {
  @apply w-14 h-14 rounded-full flex items-center justify-center 
         shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300
         relative;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Custom Slider Styles */
.slider::-webkit-slider-thumb {
  appearance: none;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: linear-gradient(to right, #00a7e1, #9d4edd);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider::-webkit-slider-track {
  height: 8px;
  border-radius: 4px;
  background: #334155;
}

.slider::-webkit-slider-thumb:hover {
  box-shadow: 0 4px 8px rgba(0, 167, 225, 0.3);
}
</style>