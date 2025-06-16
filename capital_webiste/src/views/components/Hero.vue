<template>
  <section class="relative overflow-hidden min-h-screen" ref="heroSection">
    <!-- Enhanced dynamic background with multiple layers -->
    <div class="absolute inset-0 z-0">
      <!-- Primary gradient background -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black" ref="gradientBg"></div>
      
      <!-- Animated overlay gradients -->
      <div class="absolute inset-0 bg-gradient-to-r from-capital-blue/10 via-transparent to-capital-red/10 animate-gradient-shift"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-capital-purple/5 to-transparent animate-gradient-pulse"></div>
    </div>
    
    <!-- Enhanced geometric background -->
    <div class="absolute inset-0 z-0 opacity-15 hero-geometric-bg overflow-hidden">
      <!-- Music note symbols floating -->
      <div class="absolute top-20 left-20 text-6xl text-capital-blue/30 animate-musical-float" style="animation-delay: 0s;">♪</div>
      <div class="absolute top-40 right-32 text-4xl text-capital-yellow/30 animate-musical-float" style="animation-delay: 2s;">♫</div>
      <div class="absolute bottom-32 left-40 text-5xl text-capital-red/30 animate-musical-float" style="animation-delay: 4s;">♪</div>
      <div class="absolute bottom-20 right-20 text-3xl text-capital-purple/30 animate-musical-float" style="animation-delay: 6s;">♬</div>
      
      <!-- Geometric shapes with entertainment flair -->
      <div class="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-capital-blue/20 rounded-full animate-spin-slow"></div>
      <div class="absolute bottom-1/3 right-1/4 w-24 h-24 bg-capital-yellow/10 transform rotate-45 animate-pulse-glow"></div>
      <div class="absolute top-1/2 right-1/3 w-20 h-20 border-2 border-capital-red/20 transform rotate-12 animate-float-rotate"></div>
    </div>
    
    <!-- Enhanced particle system -->
    <div class="absolute inset-0 z-1 opacity-30 particle-container" ref="particleContainer"></div>
    
    <!-- Radio wave patterns -->
    <div class="absolute inset-0 z-0 opacity-10">
      <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path ref="wavePath1" d="M0,50 Q25,30 50,50 T100,50" stroke="url(#waveGradient1)" stroke-width="0.8" fill="none" />
        <path ref="wavePath2" d="M0,50 Q25,70 50,50 T100,50" stroke="url(#waveGradient2)" stroke-width="0.6" fill="none" />
        <path ref="wavePath3" d="M0,50 Q25,40 50,50 T100,50" stroke="url(#waveGradient3)" stroke-width="0.4" fill="none" />
        <defs>
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#00a7e1"/>
            <stop offset="100%" style="stop-color:#9d4edd"/>
          </linearGradient>
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#ffea00"/>
            <stop offset="100%" style="stop-color:#ef233c"/>
          </linearGradient>
          <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#ef233c"/>
            <stop offset="100%" style="stop-color:#00a7e1"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
    
    <!-- Enhanced floating elements -->
    <div class="absolute inset-0 z-5 overflow-hidden pointer-events-none">
      <div ref="floatingShape1" class="absolute top-[15%] left-[10%] w-40 h-40 bg-gradient-to-br from-capital-blue/20 to-capital-purple/20 rounded-full blur-2xl"></div>
      <div ref="floatingShape2" class="absolute bottom-[25%] right-[15%] w-48 h-48 bg-gradient-to-br from-capital-yellow/20 to-capital-red/20 rounded-full blur-2xl"></div>
      <div ref="floatingShape3" class="absolute top-[45%] right-[20%] w-32 h-32 bg-gradient-to-br from-capital-red/20 to-capital-purple/20 rounded-full blur-xl"></div>
    </div>
    
    <div class="container mx-auto px-4 py-10 md:py-32 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <!-- Enhanced Main Hero Content -->
        <div class="lg:col-span-7 space-y-8">
          <!-- Enhanced header with premium ON AIR badge -->
          <div class="flex items-center gap-6 mb-8">
            <div class="relative group">
              <!-- Glow effect -->
              <div class="absolute -inset-1 bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-xl blur opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div class="relative bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 rounded-xl flex items-center gap-3 shadow-xl">
                <div class="relative">
                  <div class="w-3 h-3 bg-white rounded-full animate-pulse shadow-lg"></div>
                  <div class="absolute inset-0 w-3 h-3 bg-white rounded-full animate-ping opacity-30"></div>
                </div>
                <span class="text-sm font-bold text-white uppercase entertainment-text tracking-wider">ON AIR NOW</span>
              </div>
            </div>
            
            <div class="h-px flex-grow bg-gradient-to-r from-gray-700 via-gray-600 to-transparent"></div>
            
         
          </div>
          
          <!-- Enhanced station brand and headline -->
          <div class="mb-10">
            <div class="relative mb-6">
              <h1 class="font-heading relative z-10">
                <div class="text-7xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-white leading-none tracking-tight entertainment-text">
                  <span class="inline-block text-gradient-entertainment" ref="stationFrequency">{{ stationData?.frequency || '91.3' }}</span>
                  <span class="inline-block ml-4">{{ getStationShortName() }}</span>
                </div>
              </h1>
              <!-- Text glow effect -->
              <div class="absolute inset-0 text-7xl md:text-9xl font-black text-capital-blue/20 blur-xl entertainment-text transform scale-105">
                {{ stationData?.frequency || '91.3' }} {{ getStationShortName() }}
              </div>
            </div>
            
            <!-- Enhanced accent bar -->
            <div class="relative mb-6">
              <div class="h-2 w-40 bg-gradient-to-r from-capital-blue via-capital-yellow to-capital-red rounded-full shadow-lg"></div>
              <div class="absolute inset-0 h-2 w-40 bg-gradient-to-r from-capital-blue via-capital-yellow to-capital-red rounded-full blur opacity-50 animate-pulse-glow"></div>
            </div>
            
            <p class="text-3xl text-slate-300 font-light max-w-2xl leading-relaxed">
              {{ stationData?.tagline || "Uganda's Premier Entertainment Destination" }}
            </p>
          </div>
          
          <!-- Enhanced show info card -->
          <div class="relative group">
            <!-- Card glow effect -->
            <div class="absolute -inset-1 bg-gradient-to-r from-capital-blue/30 via-capital-purple/30 to-capital-red/30 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div class="relative bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-black/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
              <div class="flex gap-6">
                <!-- Enhanced show image -->
                <div class="relative">
                  <div class="w-24 h-24 rounded-xl overflow-hidden shadow-xl border-2 border-slate-700/50 group-hover:border-capital-blue/50 transition-colors duration-300">
                    <img :src="currentProgram?.image_url || selectedProgram?.image_url || 'https://images.unsplash.com/photo-1521856729154-7118f7181af9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'" 
                         :alt="currentProgram?.title || selectedProgram?.title || 'Current Show'" 
                         class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <!-- Live indicator on image -->
                  <div class="absolute -top-2 -right-2 w-6 h-6 bg-capital-red rounded-full border-2 border-slate-900 flex items-center justify-center animate-pulse">
                    <div class="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <!-- Enhanced show details -->
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="font-bold text-xl text-white entertainment-text tracking-wide">
                      {{ (currentProgram?.title || selectedProgram?.title || 'LIVE SHOW').toUpperCase() }}
                    </h3>
                    <div class="bg-gradient-to-r from-capital-blue/20 to-capital-purple/20 border border-capital-blue/30 text-capital-blue text-xs px-3 py-1.5 rounded-full entertainment-text font-bold">
                      {{ getCurrentTimeSlot() }}
                    </div>
                  </div>
                  <h4 class="font-bold text-capital-yellow text-lg mb-3 entertainment-text">{{ getDisplayHosts() }}</h4>
                  <p class="text-slate-300 text-sm leading-relaxed line-clamp-2">
                    {{ currentProgram?.description || selectedProgram?.description || 'Premium music and entertainment programming delivering the freshest hits and engaging content for our valued listeners.' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Enhanced control buttons -->
          <div class="flex flex-wrap gap-6">
            <!-- Premium Listen Live Button -->
            <div class="relative group">
              <!-- Outer energy ring -->
              <div class="absolute -inset-2 rounded-2xl blur-md opacity-40 group-hover:opacity-70 transition-all duration-700"
                   :class="isPlaying ? 'bg-gradient-to-r from-capital-green via-capital-blue to-capital-green animate-spin-slow' : 'bg-gradient-to-r from-capital-blue via-capital-purple to-capital-blue animate-spin-slow'"></div>
              
              <button @click="togglePlayPause" 
                      :disabled="isLoading || !canPlay"
                      class="relative btn-animated group/btn overflow-hidden transform hover:scale-105 disabled:hover:scale-100"
                      :class="[
                        isPlaying 
                          ? 'bg-gradient-to-r from-capital-green via-capital-blue to-capital-green text-white' 
                          : 'bg-gradient-to-r from-capital-blue via-capital-purple to-capital-blue text-white',
                        (isLoading || !canPlay) ? 'opacity-50 cursor-not-allowed' : ''
                      ]">
                
                <!-- Inner shimmer effect -->
                <div class="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                
                <!-- Button content -->
                <span class="relative z-10 flex items-center gap-3 px-8 py-4">
                  <!-- Enhanced loading spinner -->
                  <div v-if="isLoading" class="relative">
                    <div class="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <div class="absolute inset-0 w-6 h-6 border-2 border-transparent border-t-capital-yellow rounded-full animate-spin-reverse"></div>
                  </div>
                  
                  <!-- Play/Pause with glow -->
                  <div v-else class="relative">
                    <component :is="isPlaying ? Pause : Play" class="h-6 w-6 transition-all duration-300 group-hover/btn:scale-110" />
                    <div v-if="isPlaying" class="absolute -inset-2 border border-white/30 rounded-full animate-ping"></div>
                  </div>
                  
                  <span class="font-bold text-lg entertainment-text tracking-wider">
                    {{ isLoading ? 'CONNECTING...' : isPlaying ? 'LIVE NOW' : 'LISTEN LIVE' }}
                  </span>
                  
                  <!-- Listener count -->
                  <div v-if="isPlaying && stationData?.listeners" 
                       class="bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 flex items-center gap-2">
                    <div class="w-2 h-2 bg-capital-green rounded-full animate-pulse"></div>
                    <span class="text-sm font-bold">{{ formatListeners(stationData.listeners) }}</span>
                  </div>
                </span>
                
                <!-- Scanning effect -->
                <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 animate-scan"></div>
              </button>
            </div>
            
            <!-- Enhanced Download App Button -->
            <div class="relative group">
              <div class="absolute -inset-1 bg-gradient-to-r from-capital-yellow via-yellow-500 to-capital-yellow rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              <button class="relative btn-animated group/download bg-gradient-to-r from-capital-yellow to-yellow-500 hover:from-yellow-500 hover:to-capital-yellow text-black font-bold transform hover:scale-105 overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover/download:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                <span class="relative z-10 flex items-center gap-3 px-8 py-4">
                  <Download class="h-6 w-6 group-hover/download:animate-bounce" />
                  <span class="entertainment-text tracking-wider">DOWNLOAD APP</span>
                </span>
              </button>
            </div>
          </div>
          
          <!-- Enhanced stats grid -->
          <div class="grid grid-cols-3 gap-6">
            <div class="group relative">
              <div class="absolute -inset-1 bg-gradient-to-br from-capital-blue/30 to-capital-purple/30 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div class="relative bg-slate-800/70 backdrop-blur-xl p-6 rounded-xl text-center border border-slate-700/50 hover:border-capital-blue/30 transition-colors duration-300">
                <div class="text-4xl font-black text-capital-yellow mb-2 entertainment-text">{{ formatListeners(stationData?.listeners) || '1M+' }}</div>
                <div class="text-xs text-gray-400 uppercase entertainment-text tracking-wider font-bold">Daily Listeners</div>
              </div>
            </div>
            
            <div class="group relative">
              <div class="absolute -inset-1 bg-gradient-to-br from-capital-yellow/30 to-capital-red/30 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div class="relative bg-slate-800/70 backdrop-blur-xl p-6 rounded-xl text-center border border-slate-700/50 hover:border-capital-yellow/30 transition-colors duration-300">
                <div class="text-4xl font-black text-capital-yellow mb-2 entertainment-text">24/7</div>
                <div class="text-xs text-gray-400 uppercase entertainment-text tracking-wider font-bold">Broadcasting</div>
              </div>
            </div>
            
            <div class="group relative">
              <div class="absolute -inset-1 bg-gradient-to-br from-capital-red/30 to-capital-purple/30 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div class="relative bg-slate-800/70 backdrop-blur-xl p-6 rounded-xl text-center border border-slate-700/50 hover:border-capital-red/30 transition-colors duration-300">
                <div class="text-4xl font-black text-capital-yellow mb-2 entertainment-text">{{ stationData?.frequency || '91.3' }}</div>
                <div class="text-xs text-gray-400 uppercase entertainment-text tracking-wider font-bold">MHz</div>
              </div>
            </div>
          </div>
          
          <!-- Enhanced frequency grid -->
          <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
            <div v-for="(freq, index) in frequencies" :key="index" 
                 class="group relative">
              <div class="absolute -inset-1 bg-gradient-to-br from-capital-blue/20 to-capital-purple/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="relative bg-slate-800/50 backdrop-blur-sm p-3 rounded-lg text-center border border-slate-700/30 hover:border-capital-blue/50 transition-all duration-300 transform hover:scale-105">
                <div class="text-lg font-bold text-capital-yellow entertainment-text">{{ freq.freq }}</div>
                <div class="text-xs text-slate-400 font-medium">{{ freq.location }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Enhanced Right side: Visual now playing + schedule -->
        <div class="lg:col-span-5 space-y-6">
          <!-- Enhanced Now playing visualizer -->
          <div class="relative group">
            <!-- Outer glow -->
            <div class="absolute -inset-2 bg-gradient-to-r from-capital-blue/30 via-capital-purple/30 to-capital-red/30 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            
            <div class="relative h-80 rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
              <!-- Background image with enhanced overlay -->
              <div class="absolute inset-0">
                <img :src="(selectedProgram?.image_url || currentProgram?.image_url || nowPlaying.artwork)" 
                     :alt="(selectedProgram?.title || currentProgram?.title || nowPlaying.title)" 
                     class="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>
              </div>
              
        
              
              <!-- Enhanced bottom content -->
              <div class="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-sm bg-gradient-to-t from-black/90 to-transparent">
                <div class="text-2xl font-bold text-white mb-2 entertainment-text">
                  {{ selectedProgram?.title || currentProgram?.title || nowPlaying.title }}
                </div>
                
                
                <!-- Enhanced progress bar -->
                <div class="relative">
                  <div class="h-2 w-full bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                    <div class="h-full bg-gradient-to-r from-capital-blue via-capital-purple to-capital-red transition-all duration-300 rounded-full" 
                         :style="{ width: nowPlaying.progress }"></div>
                  </div>
                 
                </div>
              </div>
            </div>
          </div>
          
          <!-- Enhanced Today's schedule -->
          <div class="relative group">
            <div class="absolute -inset-1 bg-gradient-to-br from-capital-purple/20 to-capital-blue/20 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div class="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-xl">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-2xl font-bold text-white entertainment-text tracking-wide">TODAY'S Programs</h3>
                
              </div>
              
              <div class="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                <div v-for="(session, index) in getTodaySchedule()" :key="index" 
                     @click="selectProgram(session)"
                     class="flex items-center p-3 rounded-xl transition-all duration-300 cursor-pointer group/session transform hover:scale-[1.02]"
                     :class="[
                       isCurrentSession(session) 
                         ? 'bg-gradient-to-r from-capital-red/20 to-red-600/20 border-l-4 border-capital-red shadow-lg shadow-capital-red/10' 
                         : selectedProgram?.id === session.program_id 
                         ? 'bg-gradient-to-r from-capital-yellow/20 to-yellow-600/20 border border-capital-yellow/30 shadow-lg shadow-capital-yellow/10'
                         : 'hover:bg-slate-700/50 border border-transparent hover:border-slate-600/30'
                     ]">
                  
                  <!-- Time display -->
                  <div class="w-20 text-right mr-4">
                    <span class="text-sm font-bold entertainment-text" 
                          :class="isCurrentSession(session) ? 'text-capital-yellow' : 'text-gray-400'">
                      {{ session.start_time }}
                    </span>
                  </div>
                  
                  <!-- Show details -->
                  <div class="flex-1">
                    <p class="font-bold text-sm entertainment-text" 
                       :class="isCurrentSession(session) ? 'text-white' : 'text-gray-300 group-hover/session:text-white'">
                      {{ session.program?.title || 'Live Show' }}
                    </p>
                    <p class="text-xs text-gray-500 font-medium">{{ getSessionHosts(session) }}</p>
                  </div>
                  
                  <!-- Status indicators -->
                  <div class="flex items-center gap-2">
                    <div v-if="isCurrentSession(session)" class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-capital-red rounded-full animate-pulse shadow-lg"></div>
                      <span class="text-xs text-capital-red font-bold entertainment-text">LIVE</span>
                    </div>
                    <div v-else-if="isUpcoming(session)" class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-capital-blue rounded-full animate-pulse"></div>
                      <span class="text-xs text-capital-blue font-bold entertainment-text">NEXT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Enhanced wave divider -->
    <div class="absolute bottom-0 left-0 w-full overflow-hidden" style="transform: translateY(1px);">
      <svg class="w-full h-auto" preserveAspectRatio="none" viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path ref="dividerWave" d="M0,60 C400,120 800,0 1200,60 L1200,120 L0,120 Z" fill="url(#waveFooterGradient)"></path>
        <defs>
          <linearGradient id="waveFooterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#0f172a"/>
            <stop offset="50%" style="stop-color:#1e293b"/>
            <stop offset="100%" style="stop-color:#0f172a"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  </section>
</template>

<script setup>
import { Radio, Download, Play, Pause } from 'lucide-vue-next';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import anime from 'animejs';
import { 
  floatingAnimation, 
  lineDrawing, 
  textAnimation, 
  tiltEffect,
  gradientWave,
  createTimeline,
  textScramble,
  svgGeometricBackground,
  createParticleSystem,
  createAudioVisualizer,
  magneticEffect
} from '@/utils/animations';

const store = useStore();

const heroSection = ref(null);
const gradientBg = ref(null);
const wavePath1 = ref(null);
const wavePath2 = ref(null);
const wavePath3 = ref(null);
const dividerWave = ref(null);
const stationFrequency = ref(null);
const particleContainer = ref(null);
const audioVisualizer = ref(null);
const audioElement = ref(null);

// Floating shapes
const floatingShape1 = ref(null);
const floatingShape2 = ref(null);
const floatingShape3 = ref(null);


// Computed properties from store
const stationData = computed(() => store.getters.station);
const isPlaying = computed(() => store.getters.isPlaying);
const isLoading = computed(() => store.getters.isLoading);
const canPlay = computed(() => store.getters.canPlay);
const currentTime = computed(() => new Date());

// Selected program for now playing display
const selectedProgram = ref(null);

// Current track info
const nowPlaying = ref({
  title: "Unstoppable",
  artist: "Sia",
  album: "This Is Acting",
  artwork: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  currentTime: "1:25",
  duration: "3:42",
  progress: "38%"
});

const frequencies = [
  { freq: '91.3', location: 'Kampala' },
  { freq: '90.9', location: 'Mbale' },
  { freq: '88.7', location: 'Mbarara' },
  { freq: '89.4', location: 'Fort Portal' },
  { freq: '96.9', location: 'Gulu' },
  { freq: '92.7', location: 'Arua' },
];

// Format listeners count
const formatListeners = (count) => {
  if (!count) return '1M+';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
};

// Computed properties for schedule
const currentProgram = computed(() => {
  const todaySchedule = getTodaySchedule();
  const now = getCurrentTimeString();
  
  const current = todaySchedule.find(session => {
    return now >= session.start_time && now <= session.end_time;
  });
  
  return current?.program || null;
});

// Methods
const getCurrentDay = () => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
};

const getTodaySchedule = () => {
  if (!stationData.value?.schedule?.sessions) return [];
  const today = getCurrentDay();
  return stationData.value.schedule.sessions[today] || [];
};

const getCurrentTimeString = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

const getCurrentTimeSlot = () => {
  const current = getTodaySchedule().find(session => isCurrentSession(session));
  return current ? `${current.start_time} - ${current.end_time}` : '24/7 LIVE';
};

const getStationShortName = () => {
  if (!stationData.value?.name) return 'Capital FM';
  return stationData.value.name;
};

const getDisplayHosts = () => {
  const program = selectedProgram.value || currentProgram.value;
  if (!program) return 'Live Presenters';
  
  const session = getTodaySchedule().find(s => s.program_id === program.id);
  return getSessionHosts(session);
};

const getSessionHosts = (session) => {
  if (!session?.program?.hosts) return 'Live Presenters';
  
  const sessionHostIds = session.hosts || [];
  const hosts = session.program.hosts.filter(host => sessionHostIds.includes(host.id));
  return hosts.length > 0 ? hosts.map(h => h.name).join(' & ') : 'Live Presenters';
};

const isCurrentSession = (session) => {
  const now = getCurrentTimeString();
  return now >= session.start_time && now <= session.end_time;
};

const isUpcoming = (session) => {
  const now = getCurrentTimeString();
  return now < session.start_time;
};

const selectProgram = (session) => {
  selectedProgram.value = session.program;
};

const togglePlayPause = async () => {
  try {
    await store.dispatch('togglePlayPause');
  } catch (err) {
    console.error('Failed to toggle playback:', err);
  }
};

// Get random color class for equalizer bars
const getBarColor = (index) => {
  const colors = [
    'from-capital-blue to-blue-600', 
    'from-capital-yellow to-yellow-500',
    'from-capital-red to-red-600',
    'from-capital-purple to-purple-600',
    'from-capital-cyan to-cyan-600'
  ];
  
  return colors[index % colors.length];
};

// Start equalizer animation
const animateEqualizer = () => {
  const bars = document.querySelectorAll('.equalizer-bar');
  
  const timeline = createTimeline({
    duration: 400,
    easing: 'easeInOutSine',
    loop: true
  });
  
  bars.forEach(bar => {
    timeline.add({
      targets: bar,
      height: () => `${20 + Math.random() * 60}%`,
      delay: anime.stagger(15),
    }, 0);
  });
  
  return timeline;
};

// Animate wave paths
const animateWavePaths = () => {
  if (!wavePath1.value) return;
  
  anime({
    targets: [wavePath1.value, wavePath2.value, wavePath3.value],
    d: [
      'M0,50 Q25,30 50,50 T100,50',
      'M0,50 Q25,70 50,50 T100,50',
      'M0,50 Q25,40 50,50 T100,50'
    ],
    easing: 'easeInOutSine',
    duration: 12000,
    loop: true
  });
  
  anime({
    targets: dividerWave.value,
    d: [
      'M0,60 C400,120 800,0 1200,60 L1200,120 L0,120 Z',
      'M0,60 C400,0 800,120 1200,60 L1200,120 L0,120 Z'
    ],
    easing: 'easeInOutQuad',
    duration: 18000,
    loop: true
  });
};

onMounted(() => {
  // Initialize 3D tilt effect
  if (heroSection.value) {
    tiltEffect('.tilt-card');
  }
  
  // Enhanced floating animations
  floatingAnimation(floatingShape1.value, { 
    translateY: ['-25px', '25px'],
    translateX: ['8px', '-8px'],
    duration: 8000
  });
  
  floatingAnimation(floatingShape2.value, { 
    translateY: ['15px', '-15px'],
    translateX: ['-12px', '12px'],
    duration: 10000
  });
  
  floatingAnimation(floatingShape3.value, { 
    translateY: ['-20px', '20px'],
    translateX: ['18px', '-18px'],
    duration: 9000
  });
  
  // Apply text scramble effect to the station frequency
  if (stationFrequency.value) {
    textScramble(stationFrequency.value, stationData.value?.frequency || '91.3');
  }
  
  // Gradient animation
  if (gradientBg.value) {
    gradientWave(gradientBg.value);
  }
  
  // Initialize geometric SVG background
  if (heroSection.value) {
    svgGeometricBackground('.hero-geometric-bg');
  }
  
  // Initialize particle system
  if (particleContainer.value) {
    createParticleSystem('.particle-container', {
      particleCount: 50,
      colors: ['#00a7e1', '#ffea00', '#ef233c', '#9d4edd', '#00b4d8'],
      connectDistance: 140
    });
  }
  
  // Initialize audio visualizer
  if (audioVisualizer.value && audioElement.value) {
    createAudioVisualizer('.audio-visualizer', '#audioElement', {
      barCount: 64,
      barGradient: ['#00a7e1', '#9d4edd']
    });
  }
  
  // Add magnetic effect to buttons
  magneticEffect('.btn-animated', 0.4);
  
  // Initialize wave animations
  animateWavePaths();
  
  // Equalizer animation
  const equalizerAnimation = animateEqualizer();
  
  // Clean up animations
  onUnmounted(() => {
    if (equalizerAnimation) {
      equalizerAnimation.pause();
    }
    
    anime.remove([
      floatingShape1.value,
      floatingShape2.value,
      floatingShape3.value,
      wavePath1.value,
      wavePath2.value,
      wavePath3.value,
      dividerWave.value,
      gradientBg.value
    ]);
  });
});
</script>

<style scoped>


/* Enhanced gradient text effect */
.text-gradient-entertainment {
  background: linear-gradient(45deg, #00a7e1, #ffea00, #ef233c, #9d4edd, #00a7e1);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 4s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Enhanced background animations */
@keyframes gradient-shift {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.3; }
}

.animate-gradient-shift {
  animation: gradient-shift 8s ease-in-out infinite;
}

@keyframes gradient-pulse {
  0%, 100% { opacity: 0.05; }
  50% { opacity: 0.15; }
}

.animate-gradient-pulse {
  animation: gradient-pulse 6s ease-in-out infinite;
}

/* Musical note animations */
@keyframes musical-float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  25% { 
    transform: translateY(-20px) rotate(5deg);
    opacity: 0.6;
  }
  50% { 
    transform: translateY(-10px) rotate(-3deg);
    opacity: 0.8;
  }
  75% { 
    transform: translateY(-30px) rotate(8deg);
    opacity: 0.5;
  }
}

.animate-musical-float {
  animation: musical-float 6s ease-in-out infinite;
}

/* Enhanced geometric animations */
@keyframes spin-slow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.animate-spin-slow {
  animation: spin-slow 30s linear infinite;
}

@keyframes pulse-glow {
  0%, 100% { 
    opacity: 0.1;
    transform: scale(1);
  }
  50% { 
    opacity: 0.3;
    transform: scale(1.1);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 4s ease-in-out infinite;
}

@keyframes float-rotate {
  0%, 100% { 
    transform: translateY(0px) rotate(12deg);
  }
  50% { 
    transform: translateY(-15px) rotate(25deg);
  }
}

.animate-float-rotate {
  animation: float-rotate 8s ease-in-out infinite;
}

/* Enhanced button animations */
.btn-animated {
  @apply rounded-2xl text-white shadow-2xl overflow-hidden transition-all duration-500 font-bold;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.btn-animated:hover {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
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

@keyframes spin-reverse {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(-360deg); }
}

.animate-spin-reverse {
  animation: spin-reverse 1s linear infinite;
}

/* Enhanced equalizer animation */
.equalizer-bar {
  animation: equalize-enhanced 1s ease-in-out infinite;
  filter: drop-shadow(0 0 8px currentColor);
}

@keyframes equalize-enhanced {
  0%, 100% { 
    height: 20%; 
    opacity: 0.7;
    transform: scaleY(1);
  }
  25% { 
    height: 60%; 
    opacity: 0.9;
    transform: scaleY(1.1);
  }
  50% { 
    height: 80%; 
    opacity: 1;
    transform: scaleY(1.2);
  }
  75% { 
    height: 40%; 
    opacity: 0.8;
    transform: scaleY(1.05);
  }
}

/* Custom scrollbar for schedule */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 167, 225, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #00a7e1, #9d4edd);
  border-radius: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #0086b3, #7c3aed);
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Enhanced hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:animate-bounce {
  animation: bounce 1s infinite;
}

.group\/btn:hover .group-hover\/btn\:scale-110 {
  transform: scale(1.1);
}

.group\/download:hover .group-hover\/download\:animate-bounce {
  animation: bounce 1s infinite;
}

.group\/session:hover .group-hover\/session\:text-white {
  color: white;
}

/* Button disabled states */
button:disabled {
  cursor: not-allowed;
  filter: grayscale(0.5);
  transform: none !important;
}

button:not(:disabled):active {
  transform: scale(0.95);
}

/* Enhanced focus states */
button:focus {
  outline: 2px solid rgba(0, 167, 225, 0.5);
  outline-offset: 2px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .entertainment-text {
    font-size: 0.9em;
    letter-spacing: 0.5px;
  }
  
  .text-7xl {
    font-size: 4rem;
  }
  
  .text-9xl {
    font-size: 5rem;
  }
  
  .animate-musical-float,
  .animate-spin-slow,
  .animate-pulse-glow,
  .animate-float-rotate {
    animation-duration: 8s;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .border-slate-700\/50,
  .border-slate-600\/30 {
    border-color: rgba(148, 163, 184, 0.8);
  }
  
  .text-slate-300,
  .text-slate-400 {
    color: rgb(203, 213, 225);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .animate-gradient-shift,
  .animate-gradient-pulse,
  .animate-musical-float,
  .animate-spin-slow,
  .animate-pulse-glow,
  .animate-float-rotate,
  .animate-shimmer,
  .animate-scan,
  .animate-spin-reverse,
  .equalizer-bar {
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
  button,
  .equalizer-bar {
    display: none !important;
  }
  
  .bg-gradient-to-br,
  .bg-gradient-to-r {
    background: white !important;
    color: black !important;
  }
}
</style>
