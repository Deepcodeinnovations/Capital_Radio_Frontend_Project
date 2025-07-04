<template>
  <div v-if="isLoading" class="fixed inset-0 bg-white flex items-center justify-center z-50 overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0">
      <!-- Floating Music Notes -->
      <div class="absolute top-20 left-20 text-gray-200 text-4xl animate-float">♪</div>
      <div class="absolute top-40 right-32 text-gray-200 text-3xl animate-float-delay-1">♫</div>
      <div class="absolute bottom-32 left-40 text-gray-200 text-5xl animate-float-delay-2">♪</div>
      <div class="absolute bottom-20 right-20 text-gray-200 text-2xl animate-float-delay-3">♫</div>
      
      <!-- Radio Waves -->
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div class="absolute w-96 h-96 border-2 border-gray-100 rounded-full animate-ping"></div>
        <div class="absolute w-80 h-80 border-2 border-gray-150 rounded-full animate-ping" style="animation-delay: 0.5s"></div>
        <div class="absolute w-64 h-64 border-2 border-gray-200 rounded-full animate-ping" style="animation-delay: 1s"></div>
      </div>
    </div>
    
    <div class="text-center max-w-lg mx-auto px-6 relative z-10">
      <!-- Clean Logo with Subtle Glow -->
      <div class="w-64 h-64 mx-auto mb-8 relative">
        <div class="absolute inset-0 bg-[#F8CB00]/10 rounded-full blur-xl animate-pulse"></div>
        <div class="relative w-full h-full animate-bounce-custom">
          <img 
            src="/logo2.png" 
            alt="Capital FM Logo" 
            class="w-full h-full object-contain drop-shadow-lg animate-logo-glow" 
          />
        </div>
        
        <!-- Pulsing Dots Around Logo -->
        <div class="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <div class="w-3 h-3 bg-[#F8CB00] rounded-full animate-pulse"></div>
        </div>
        <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse" style="animation-delay: 0.5s"></div>
        </div>
        <div class="absolute top-1/2 -left-2 transform -translate-y-1/2">
          <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style="animation-delay: 1s"></div>
        </div>
        <div class="absolute top-1/2 -right-2 transform -translate-y-1/2">
          <div class="w-3 h-3 bg-[#F8CB00] rounded-full animate-pulse" style="animation-delay: 1.5s"></div>
        </div>
      </div>
      
      <!-- Dynamic Welcome Messages -->
      <div class="mb-8 min-h-[4rem] flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-2 animate-text-glow">
            {{ currentMessage.title }}
          </h1>
          <p class="text-xl md:text-2xl text-gray-600 font-medium animate-fade-in-up">
            {{ currentMessage.subtitle }}
          </p>
        </div>
      </div>
      
      <!-- Loading Animation Indicators -->
      <div class="flex justify-center items-center space-x-6 mb-6">
        <!-- Radio Tower Animation -->
        <div class="relative">
          <div class="w-8 h-12 bg-gray-400 animate-tower-signal rounded-sm"></div>
          <div class="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full animate-blink"></div>
        </div>
        
        <!-- Equalizer Bars -->
        <div class="flex items-end space-x-1">
          <div class="w-2 bg-[#F8CB00] rounded-sm animate-equalizer-1" style="height: 16px;"></div>
          <div class="w-2 bg-red-500 rounded-sm animate-equalizer-2" style="height: 24px;"></div>
          <div class="w-2 bg-blue-500 rounded-sm animate-equalizer-3" style="height: 20px;"></div>
          <div class="w-2 bg-[#F8CB00] rounded-sm animate-equalizer-4" style="height: 28px;"></div>
          <div class="w-2 bg-red-500 rounded-sm animate-equalizer-5" style="height: 16px;"></div>
        </div>
        
        <!-- Frequency Display -->
        <div class="text-gray-700 font-mono text-lg font-bold animate-frequency">
          91.3 FM
        </div>
      </div>
      
      <!-- Loading Dots with Sound Wave Effect -->
      <div class="flex justify-center space-x-3 mb-6">
        <div 
          v-for="(dot, index) in 5" 
          :key="index"
          class="w-3 h-3 rounded-full animate-wave"
          :class="[
            index % 3 === 0 ? 'bg-[#F8CB00]' : 
            index % 3 === 1 ? 'bg-red-500' : 'bg-blue-500'
          ]"
          :style="{ animationDelay: `${index * 0.2}s` }"
        ></div>
      </div>
      
      <!-- Capital Radio Tagline -->
      <div class="text-gray-500 text-lg font-medium animate-pulse">
        Fresh Hits for Uganda
      </div>
      
      <!-- Progress Bar -->
      <div class="mt-8 w-full max-w-md mx-auto">
        <div class="bg-gray-200 rounded-full h-1 overflow-hidden">
          <div class="h-full bg-gradient-to-r from-[#F8CB00] via-red-500 to-blue-500 rounded-full animate-progress-bar"></div>
        </div>
      </div>
      
      <!-- Error Handling -->
      <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700 mb-3">{{ error }}</p>
        <button 
          @click="retryLoading"
          class="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
        >
          Try Again
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
    title: "Welcome to Capital",
    subtitle: "Uganda's Premier Radio Station"
  },
  {
    title: "Getting Your Favorite Shows",
    subtitle: "Music, News & Entertainment"
  },
  {
    title: "Loading News and Events",
    subtitle: "Stay Updated with Fresh Content"
  },
  {
    title: "Initializing Audio Player",
    subtitle: "Almost Ready to Rock!"
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
  }, 2500); // Change message every 2.5 seconds
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
        access_link: 'https://capitalradio.co.ug',
        clientdata: JSON.stringify(clientdata.value),
      };
      console.log('Auth data:', data);
      await store.dispatch('login', data);
   

    // Step 4: Station data
    console.log('Loading station details...');
    const radioData = {
      access_link: 'https://capitalradio.co.ug'
    };
    await store.dispatch('fetch_station_details', radioData);
    
    // Connect WebSocket
    await store.dispatch('connectWebSocket');
    
    // Check station access
    if (stationData.value?.radio_access_status === false) {
      isLoading.value = false;
      router.push('/maintanance');
      return;
    }

    // Step 5: Audio player initialization
    console.log('Initializing audio player...');
    if (stationData.value) {
      await store.dispatch('loadStation', stationData.value);
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
    error.value = err.message || 'Failed to initialize Capital Radio. Please try again.';
    
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
/* Bounce Animation for Logo */
@keyframes bounce-custom {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) scale(1);
  }
  40% {
    transform: translateY(-20px) scale(1.05);
  }
  60% {
    transform: translateY(-10px) scale(1.02);
  }
}

.animate-bounce-custom {
  animation: bounce-custom 2s ease-in-out infinite;
}

/* Logo Glow Animation */
@keyframes logo-glow {
  0%, 100% {
    filter: drop-shadow(0 0 10px rgba(248, 203, 0, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(248, 203, 0, 0.5));
  }
}

.animate-logo-glow {
  animation: logo-glow 3s ease-in-out infinite;
}

/* Text Glow Animation */
@keyframes text-glow {
  0%, 100% {
    color: #1f2937;
  }
  50% {
    color: #374151;
  }
}

.animate-text-glow {
  animation: text-glow 2s ease-in-out infinite;
}

/* Floating Animation */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}

@keyframes float-delay-1 {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(-5deg); }
}

@keyframes float-delay-2 {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-25px) rotate(15deg); }
}

@keyframes float-delay-3 {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(-10deg); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delay-1 {
  animation: float-delay-1 8s ease-in-out infinite;
}

.animate-float-delay-2 {
  animation: float-delay-2 7s ease-in-out infinite;
}

.animate-float-delay-3 {
  animation: float-delay-3 9s ease-in-out infinite;
}

/* Wave Animation for Loading Dots */
@keyframes wave {
  0%, 40%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.5;
  }
  20% {
    transform: translateY(-15px) scale(1.2);
    opacity: 1;
  }
}

.animate-wave {
  animation: wave 1.4s ease-in-out infinite;
}

/* Equalizer Animation */
@keyframes equalizer-1 {
  0%, 100% { height: 16px; }
  50% { height: 32px; }
}

@keyframes equalizer-2 {
  0%, 100% { height: 24px; }
  50% { height: 40px; }
}

@keyframes equalizer-3 {
  0%, 100% { height: 20px; }
  50% { height: 28px; }
}

@keyframes equalizer-4 {
  0%, 100% { height: 28px; }
  50% { height: 44px; }
}

@keyframes equalizer-5 {
  0%, 100% { height: 16px; }
  50% { height: 36px; }
}

.animate-equalizer-1 { animation: equalizer-1 1s ease-in-out infinite; }
.animate-equalizer-2 { animation: equalizer-2 1.2s ease-in-out infinite; }
.animate-equalizer-3 { animation: equalizer-3 0.8s ease-in-out infinite; }
.animate-equalizer-4 { animation: equalizer-4 1.1s ease-in-out infinite; }
.animate-equalizer-5 { animation: equalizer-5 0.9s ease-in-out infinite; }

/* Tower Signal Animation */
@keyframes tower-signal {
  0%, 100% { opacity: 1; transform: scaleY(1); }
  50% { opacity: 0.7; transform: scaleY(1.1); }
}

.animate-tower-signal {
  animation: tower-signal 2s ease-in-out infinite;
}

/* Blink Animation */
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.animate-blink {
  animation: blink 1s infinite;
}

/* Frequency Animation */
@keyframes frequency {
  0%, 100% { 
    transform: scale(1);
    color: #374151;
  }
  50% { 
    transform: scale(1.05);
    color: #F8CB00;
  }
}

.animate-frequency {
  animation: frequency 2s ease-in-out infinite;
}

/* Progress Bar Animation */
@keyframes progress-bar {
  0% { width: 0%; }
  100% { width: 100%; }
}

.animate-progress-bar {
  animation: progress-bar 3s ease-out infinite;
}

/* Fade In Up Animation */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out;
}

/* Capital FM Brand Colors */
.bg-capital-yellow { background-color: #F8CB00; }
.text-capital-yellow { color: #F8CB00; }

/* Gray variants for clean design */
.border-gray-150 { border-color: #f3f4f6; }
</style>