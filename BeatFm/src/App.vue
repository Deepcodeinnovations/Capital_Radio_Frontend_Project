<template>
  <div v-if="isLoading" class="fixed inset-0 bg-gray-50 flex items-center justify-center z-50 overflow-hidden">
    
    <div class="text-center max-w-lg mx-auto px-6 relative z-10">
      <!-- Simple Logo -->
      <div class="w-48 h-48 mx-auto mb-8 relative">
        <div class="relative w-full h-full">
          <img 
            src="/logobeat.png" 
            alt="Beat FM Logo" 
            class="w-full h-full object-contain" 
          />
        </div>
      </div>
      
      <!-- Simple Loading Message -->
      <div class="mb-8">
        <h1 class="text-3xl font-black text-black mb-4 uppercase tracking-wider">
          {{ currentMessage.title }}
        </h1>
        <p class="text-lg text-gray-600 font-bold uppercase tracking-wider">
          {{ currentMessage.subtitle }}
        </p>
      </div>
      
      <!-- Simple Loading Animation -->
      <div class="flex justify-center items-center space-x-4 mb-8">
        <!-- Simple Bars -->
        <div class="flex items-end space-x-2">
          <div class="w-4 h-4 bg-red-600 animate-pulse"></div>
          <div class="w-4 h-8 bg-black animate-pulse" style="animation-delay: 0.2s"></div>
          <div class="w-4 h-6 bg-red-600 animate-pulse" style="animation-delay: 0.4s"></div>
          <div class="w-4 h-10 bg-black animate-pulse" style="animation-delay: 0.6s"></div>
          <div class="w-4 h-4 bg-red-600 animate-pulse" style="animation-delay: 0.8s"></div>
        </div>
        
        <!-- Frequency Display -->
        <div class="text-black font-black text-xl tracking-wider uppercase">
          96.3 FM
        </div>
      </div>
      
      <!-- Simple Loading Dots -->
      <div class="flex justify-center space-x-3 mb-8">
        <div 
          v-for="(dot, index) in 3" 
          :key="index"
          class="w-4 h-4 bg-red-600 animate-bounce"
          :style="{ animationDelay: `${index * 0.2}s` }"
        ></div>
      </div>
      
      <!-- Beat FM Tagline -->
      <div class="text-gray-600 text-lg font-bold uppercase tracking-wider">
        Ekintabuli Ky'Omuziki
      </div>
      
      <!-- Simple Progress Bar -->
      <div class="mt-8 w-full max-w-md mx-auto">
        <div class="bg-gray-200 h-2 overflow-hidden border-2 border-black">
          <div class="h-full bg-red-600 animate-progress"></div>
        </div>
      </div>
      
      <!-- Error Handling -->
      <div v-if="error" class="mt-8 p-6 bg-white border-2 border-black">
        <p class="text-black mb-4 font-bold uppercase tracking-wider">{{ error }}</p>
        <button 
          @click="retryLoading"
          class="bg-red-600 text-white px-6 py-3 border-2 border-black font-black hover:bg-red-700 transition-colors uppercase tracking-wider"
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

// Simple welcome messages
const welcomeMessages = [
  {
    title: "Beat FM 96.3",
    subtitle: "Loading Your Music Experience"
  },
  {
    title: "Getting Ready",
    subtitle: "Fresh Beats Coming Up"
  },
  {
    title: "Almost There",
    subtitle: "Beat FM Is Loading"
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
  }, 2000);
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
        access_link: 'https://www.beatradio.co.ug',
        clientdata: JSON.stringify(clientdata.value),
      };
      console.log('Auth data:', data);
      await store.dispatch('login', data);
   

    // Step 4: Station data
    console.log('Loading station details...');
    const radioData = {
      access_link: 'https://www.beatradio.co.ug'
    };
    await store.dispatch('fetch_station_details', radioData);
    
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
    }, 1000);

  } catch (err) {
    console.error('Loading error:', err);
    error.value = err.message || 'Failed to initialize Beat FM. Please try again.';
    
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
/* Override rounded corners for brutalist design */
* {
  border-radius: 0 !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Ensure sharp geometric shapes */
button, div, input {
  border-radius: 0 !important;
}

/* Simple Progress Animation */
@keyframes progress {
  0% { width: 0%; }
  100% { width: 100%; }
}

.animate-progress {
  animation: progress 3s ease-out infinite;
}

/* Simple Pulse Animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Simple Bounce Animation */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Responsive design */
@media (max-width: 768px) {
  .text-3xl {
    font-size: 1.75rem;
    line-height: 2.25rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
  
  .w-48 {
    width: 10rem;
  }
  
  .h-48 {
    height: 10rem;
  }
}

@media (max-width: 640px) {
  .text-3xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }
  
  .text-lg {
    font-size: 1rem;
    line-height: 1.5rem;
  }
  
  .w-48 {
    width: 8rem;
  }
  
  .h-48 {
    height: 8rem;
  }
}
</style>