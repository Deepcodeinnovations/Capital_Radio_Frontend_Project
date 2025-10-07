<template>
  <div v-if="isLoading" class="fixed inset-0 bg-black flex items-center justify-center z-50">
    <div class="text-center max-w-lg mx-auto px-6">
      <!-- Logo -->
      <div class="w-48 h-48 mx-auto mb-12">
        <img 
          src="/logo2.png" 
          alt="Capital FM Logo" 
          class="w-full h-full object-contain" 
        />
      </div>
      
      <!-- Welcome Message -->
      <div class="mb-12">
        <h1 class="text-2xl md:text-3xl font-bold text-white mb-3">
          {{ currentMessage.title }}
        </h1>
        <p class="text-base text-gray-400">
          {{ currentMessage.subtitle }}
        </p>
      </div>
      
      <!-- Loading Indicator -->
      <div class="mb-8">
        <div class="text-[#F8CB00] font-mono text-xl font-bold mb-4">
          91.3 FM
        </div>
      </div>
      
      <!-- Loading Dots -->
      <div class="flex justify-center space-x-2 mb-8">
        <div 
          v-for="(dot, index) in 3" 
          :key="index"
          class="w-2 h-2 bg-[#F8CB00] rounded-full animate-pulse"
          :style="{ animationDelay: `${index * 0.15}s` }"
        ></div>
      </div>
      
      <!-- Progress Bar -->
      <div class="w-full max-w-xs mx-auto">
        <div class="bg-gray-900 rounded-full h-1 overflow-hidden">
          <div class="h-full bg-[#F8CB00] rounded-full animate-progress-bar"></div>
        </div>
      </div>
      
      <!-- Error Handling -->
      <div v-if="error" class="mt-8 p-6 border border-gray-800 rounded-lg">
        <p class="text-gray-400 mb-4 text-sm">{{ error }}</p>
        <button 
          @click="retryLoading"
          class="bg-[#F8CB00] text-black px-6 py-2 rounded-full font-semibold hover:bg-yellow-500 transition-colors"
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

/* Progress Bar Animation */
@keyframes progress-bar {
  0% { width: 0%; }
  100% { width: 100%; }
}

.animate-progress-bar {
  animation: progress-bar 3s ease-in-out infinite;
}
</style>