<template>
  <div v-if="isLoading" class="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 flex items-center justify-center z-50 overflow-hidden">
    <!-- Geometric Background Pattern -->
    <div class="absolute inset-0 opacity-20">
      <div class="absolute top-10 left-10 w-20 h-20 border-2 border-pink-400 rotate-45 animate-spin-slow"></div>
      <div class="absolute top-20 right-20 w-16 h-16 bg-purple-500 rounded-full animate-bounce-alt"></div>
      <div class="absolute bottom-20 left-20 w-24 h-24 border-2 border-pink-300 rounded-full animate-pulse-ring"></div>
      <div class="absolute bottom-10 right-10 w-12 h-12 bg-pink-500 transform rotate-45 animate-float-geometric"></div>
      
      <!-- Hexagonal Grid Pattern -->
      <div class="absolute inset-0 opacity-30">
        <div class="grid grid-cols-12 gap-8 h-full w-full">
          <div v-for="i in 48" :key="i" class="w-6 h-6 border border-pink-400/30 transform rotate-45" 
               :style="{ animationDelay: `${i * 0.1}s` }" 
               :class="i % 3 === 0 ? 'animate-twinkle' : ''"></div>
        </div>
      </div>
    </div>
    
    <div class="text-center max-w-2xl mx-auto px-6 relative z-10">
      <!-- Modern Logo Container -->
      <div class="relative mb-12">
        <!-- Glowing Ring -->
        <div class="absolute inset-0 w-80 h-80 mx-auto">
          <div class="w-full h-full border-4 border-pink-400/30 rounded-full animate-rotate-ring"></div>
          <div class="absolute inset-4 border-2 border-purple-400/40 rounded-full animate-rotate-ring-reverse"></div>
        </div>
        

      </div>
      
      <!-- Modern Typography -->
      <div class="mb-10 space-y-4">
        <h1 class="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
          <span class="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            {{ currentMessage.title }}
          </span>
        </h1>
        <p class="text-xl md:text-2xl text-slate-300 font-light tracking-wide">
          {{ currentMessage.subtitle }}
        </p>
      </div>
      
      <!-- Sleek Loading Bar -->
      <div class="mb-8 space-y-6">
        <div class="flex items-center justify-center space-x-8">
          <!-- Frequency Display -->
          <div class="bg-slate-800/70 backdrop-blur-sm px-6 py-3 rounded-xl border border-pink-400/30">
            <div class="text-2xl font-bold text-pink-400 font-mono">100.9</div>
            <div class="text-sm text-slate-400 uppercase tracking-widest">FM</div>
          </div>
          
          <!-- Waveform Visualization -->
          <div class="flex items-end space-x-1">
            <div class="w-1 bg-pink-500 rounded-full animate-waveform-1" style="height: 20px;"></div>
            <div class="w-1 bg-purple-500 rounded-full animate-waveform-2" style="height: 35px;"></div>
            <div class="w-1 bg-pink-400 rounded-full animate-waveform-3" style="height: 25px;"></div>
            <div class="w-1 bg-purple-400 rounded-full animate-waveform-4" style="height: 40px;"></div>
            <div class="w-1 bg-pink-500 rounded-full animate-waveform-5" style="height: 18px;"></div>
            <div class="w-1 bg-purple-500 rounded-full animate-waveform-6" style="height: 30px;"></div>
            <div class="w-1 bg-pink-400 rounded-full animate-waveform-7" style="height: 22px;"></div>
          </div>
          
          <!-- Status Indicator -->
          <div class="bg-slate-800/70 backdrop-blur-sm px-4 py-3 rounded-xl border border-purple-400/30">
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span class="text-sm text-slate-300 uppercase tracking-wide">LIVE</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Progress Section -->
      <div class="space-y-4">
        <div class="text-slate-400 text-sm uppercase tracking-widest">
          Hot Hits for Kampala
        </div>
        
        <!-- Modern Progress Bar -->
        <div class="w-full max-w-md mx-auto bg-slate-800/50 rounded-full h-2 overflow-hidden backdrop-blur-sm">
          <div class="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-progress-modern"></div>
        </div>
        
        <!-- Loading Dots -->
        <div class="flex justify-center space-x-3 mt-6">
          <div 
            v-for="(dot, index) in 3" 
            :key="index"
            class="w-2 h-2 rounded-full animate-dot-pulse"
            :class="index === 0 ? 'bg-pink-500' : index === 1 ? 'bg-purple-500' : 'bg-pink-400'"
            :style="{ animationDelay: `${index * 0.3}s` }"
          ></div>
        </div>
      </div>
      
      <!-- Error Handling -->
      <div v-if="error" class="mt-8 p-6 bg-red-900/50 backdrop-blur-sm border border-red-400/30 rounded-xl">
        <p class="text-red-200 mb-4">{{ error }}</p>
        <button 
          @click="retryLoading"
          class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Retry Connection
        </button>
      </div>
    </div>
  </div>
  
  <router-view v-else />
</template>

<script setup>
import { computed, onMounted, ref, watch, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useStore();
const isLoading = ref(true);
const error = ref(null);
const currentMessageIndex = ref(0);

// Welcome messages that cycle through
const welcomeMessages = [
  {
    title: "KIIS 100.9",
    subtitle: "Uganda's Hottest Music Station"
  },
  {
    title: "Loading Content",
    subtitle: "Preparing Your Audio Experience"
  },
  {
    title: "Connecting Live",
    subtitle: "Tuning Into The Hottest Hits"
  },
  {
    title: "Almost Ready",
    subtitle: "Get Ready To Vibe With Us"
  }
];

// Current message computed property
const currentMessage = computed(() => welcomeMessages[currentMessageIndex.value]);

// Store computed properties
const clientdata = computed(() => store.getters.clientdata);
const device_fingerprint = computed(() => store.getters.device_fingerprint);
const authuser = computed(() => store.getters.authuser);
const stationData = computed(() => store.getters.station);

let messageInterval = null;

// Helper functions
const getclientlocationanddevicedata = async () => {
  return await store.dispatch('getclientlocationanddevicedata');
};

const getdevicefingerprint = async () => {
  return await store.dispatch('getdevicefingerprint');
};

const calculate10daysfromaccesstime = () => {
  if (!clientdata.value?.access_time) return new Date();
  
  const access_time = clientdata.value.access_time;
  const access_time_date = new Date(access_time);
  const access_time_date_10days = new Date(access_time_date.getTime() + 10 * 24 * 60 * 60 * 1000);
  return access_time_date_10days;
};

// Cycle through messages
const startMessageCycle = () => {
  messageInterval = setInterval(() => {
    currentMessageIndex.value = (currentMessageIndex.value + 1) % welcomeMessages.length;
  }, 3000); // Change message every 3 seconds
};

// Main loading function
const initializeApp = async () => {
  try {
    error.value = null;
    
    // Start message cycling
    startMessageCycle();
    
    // Step 1: Client data
    console.log('Loading client data...');
    if (clientdata.value) {
      if (calculate10daysfromaccesstime() < new Date()) {
        await getclientlocationanddevicedata();
      }
    } else {
      await getclientlocationanddevicedata();
    }

    // Step 2: Device fingerprint
    console.log('Generating device fingerprint...');
    if (!device_fingerprint.value) {
      await getdevicefingerprint();
    }

    // Step 3: Authentication
    console.log('Authenticating user...');
    if(!device_fingerprint.value){
      console.log('Generating Random device fingerprint...');
      await store.dispatch('generatedevice_fingerprint');
    }
      const data = {
        device_fingerprint: device_fingerprint.value,
        access_link: 'https://kiis1009.co.ug',
        clientdata: JSON.stringify(clientdata.value),
      };
      console.log('Auth data:', data);
      await store.dispatch('login', data);
   

    // Step 4: Station data
    console.log('Loading station details...');
    const radioData = {
      access_link: 'https://kiis1009.co.ug'
    };
    await store.dispatch('fetch_station_details', radioData);
    

    // Check station access
    if (stationData.value?.radio_access_status === false) {
      isLoading.value = false;
      router.push('/maintanance');
      return;
    }


    // Load live chat
    await store.dispatch('fetch_livechat', {
      station_id: stationData.value.id
    });

    // Redirect if on maintenance page
    if (router.currentRoute.value.name === 'maintanance') {
      router.push('/');
    }

    // Final delay for smooth transition
    setTimeout(() => {
      if (messageInterval) {
        clearInterval(messageInterval);
      }
      isLoading.value = false;
    }, 1500);

  } catch (err) {
    console.error('Loading error:', err);
    error.value = err.message || 'Failed to initialize KIIS Radio. Please try again.';
    
    if (messageInterval) {
      clearInterval(messageInterval);
    }
  }
};

// Retry function
const retryLoading = () => {
  error.value = null;
  currentMessageIndex.value = 0;
  initializeApp();
};

// Watch for station data changes
watch(stationData, async (newStation) => {
  if (newStation && !store.getters.currentStation) {
    try {
      await store.dispatch('loadStation', newStation);
    } catch (err) {
      console.error('Failed to load station:', err);
    }
  }
});

onMounted(() => {
  initializeApp();
});

onUnmounted(() => {
  if (messageInterval) {
    clearInterval(messageInterval);
  }
});
</script>

<style scoped>
/* Custom gradient text */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Geometric Animations */
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes bounce-alt {
  0%, 100% { 
    transform: translateY(0px) scale(1);
  }
  50% { 
    transform: translateY(-20px) scale(1.1);
  }
}

@keyframes pulse-ring {
  0% { 
    transform: scale(1);
    opacity: 1;
  }
  100% { 
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes float-geometric {
  0%, 100% { 
    transform: translateY(0px) rotate(45deg);
  }
  50% { 
    transform: translateY(-15px) rotate(45deg);
  }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

/* Logo Animations */
@keyframes logo-breathe {
  0%, 100% { 
    transform: scale(1);
  }
  50% { 
    transform: scale(1.05);
  }
}

@keyframes rotate-ring {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes rotate-ring-reverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

/* Waveform Animations */
@keyframes waveform-1 {
  0%, 100% { height: 20px; }
  50% { height: 35px; }
}

@keyframes waveform-2 {
  0%, 100% { height: 35px; }
  50% { height: 50px; }
}

@keyframes waveform-3 {
  0%, 100% { height: 25px; }
  50% { height: 40px; }
}

@keyframes waveform-4 {
  0%, 100% { height: 40px; }
  50% { height: 60px; }
}

@keyframes waveform-5 {
  0%, 100% { height: 18px; }
  50% { height: 32px; }
}

@keyframes waveform-6 {
  0%, 100% { height: 30px; }
  50% { height: 45px; }
}

@keyframes waveform-7 {
  0%, 100% { height: 22px; }
  50% { height: 38px; }
}

/* Progress Animation */
@keyframes progress-modern {
  0% { 
    width: 0%;
    background-position: 0% 50%;
  }
  100% { 
    width: 100%;
    background-position: 100% 50%;
  }
}

/* Dot Pulse Animation */
@keyframes dot-pulse {
  0%, 100% { 
    transform: scale(1);
    opacity: 0.7;
  }
  50% { 
    transform: scale(1.3);
    opacity: 1;
  }
}

/* Apply animations */
.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

.animate-bounce-alt {
  animation: bounce-alt 3s ease-in-out infinite;
}

.animate-pulse-ring {
  animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-float-geometric {
  animation: float-geometric 4s ease-in-out infinite;
}

.animate-twinkle {
  animation: twinkle 3s ease-in-out infinite;
}

.animate-logo-breathe {
  animation: logo-breathe 4s ease-in-out infinite;
}

.animate-rotate-ring {
  animation: rotate-ring 20s linear infinite;
}

.animate-rotate-ring-reverse {
  animation: rotate-ring-reverse 15s linear infinite;
}

.animate-waveform-1 { animation: waveform-1 1.2s ease-in-out infinite; }
.animate-waveform-2 { animation: waveform-2 1.1s ease-in-out infinite; }
.animate-waveform-3 { animation: waveform-3 1.3s ease-in-out infinite; }
.animate-waveform-4 { animation: waveform-4 1.0s ease-in-out infinite; }
.animate-waveform-5 { animation: waveform-5 1.4s ease-in-out infinite; }
.animate-waveform-6 { animation: waveform-6 1.2s ease-in-out infinite; }
.animate-waveform-7 { animation: waveform-7 1.1s ease-in-out infinite; }

.animate-progress-modern {
  animation: progress-modern 4s ease-out infinite;
}

.animate-dot-pulse {
  animation: dot-pulse 1.5s ease-in-out infinite;
}
</style>