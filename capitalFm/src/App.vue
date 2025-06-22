<template>
  <div v-if="isLoading" class="fixed inset-0 bg-white flex items-center justify-center z-50">
    <div class="text-center max-w-sm mx-auto px-6">
      <!-- Logo -->
      <div class="w-64 h-64 mx-auto mb-6">
        <img src="/logo2.png" alt="Capital FM Logo" class="w-full h-full object-contain" />
      </div>
      
     
      <!-- Loading Message -->
      <div class="mb-6">
        <p class="text-gray-600">{{ loadingMessage }}</p>
      </div>
      
      <!-- Loading Progress -->
      <div class="w-64 mx-auto mb-6">
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="h-full bg-[#F8CB00] transition-all duration-500 ease-out rounded-full" 
               :style="{ width: `${loadingProgress}%` }">
          </div>
        </div>
        <div class="text-sm text-gray-500 mt-2 text-center">
          {{ loadingProgress }}%
        </div>
      </div>
      
      <!-- Loading Dots -->
      <div class="flex justify-center space-x-2">
        <div class="w-2 h-2 bg-[#F8CB00] rounded-full animate-bounce"></div>
        <div class="w-2 h-2 bg-[#F8CB00] rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        <div class="w-2 h-2 bg-[#F8CB00] rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
      </div>
    </div>
  </div>
  
  <router-view v-else />
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useStore();
const isLoading = ref(true);
const loadingMessage = ref('Initializing Capital Radio...');
const loadingProgress = ref(0);
const error = ref(null);
const currentTipIndex = ref(0);

// Loading tips that rotate
const loadingTips = [
  'Connecting to Uganda\'s premier radio station...',
  'Tuning into 91.3 FM frequency...',
  'Loading fresh hits and entertainment...',
  'Preparing your personalized experience...',
  'Almost ready to rock your world!'
];

// Computed properties
const clientdata = computed(() => store.getters.clientdata);
const device_fingerprint = computed(() => store.getters.device_fingerprint);
const authuser = computed(() => store.getters.authuser);
const stationData = computed(() => store.getters.station);

// Helper functions
const getclientlocationanddevicedata = () => {
  return store.dispatch('getclientlocationanddevicedata');
};

const getdevicefingerprint = () => {
  return store.dispatch('getdevicefingerprint');
};

const calculate10daysfromaccesstime = () => {
  if (!clientdata.value?.access_time) return new Date();
  
  const access_time = clientdata.value.access_time;
  const access_time_date = new Date(access_time);
  const access_time_date_10days = new Date(access_time_date.getTime() + 10 * 24 * 60 * 60 * 1000);
  return access_time_date_10days;
};

// Update loading progress
const updateProgress = (progress, message) => {
  loadingProgress.value = progress;
  loadingMessage.value = message;
  
  // Update tip index based on progress
  const tipIndex = Math.floor((progress / 100) * loadingTips.length);
  currentTipIndex.value = Math.min(tipIndex, loadingTips.length - 1);
};

// Main loading function
const initializeApp = async () => {
  try {
    error.value = null;
    
    // Step 1: Client data (20%)
    updateProgress(10, 'Checking device data...');
    if (clientdata.value) {
      if (calculate10daysfromaccesstime() < new Date()) {
        await getclientlocationanddevicedata();
      }
    } else {
      await getclientlocationanddevicedata();
    }
    updateProgress(20, 'Device data loaded');

    // Step 2: Device fingerprint (40%)
    updateProgress(30, 'Generating device fingerprint...');
    if (!device_fingerprint.value) {
      await getdevicefingerprint();
    }
    updateProgress(40, 'Device fingerprint ready');

    // Step 3: Authentication (60%)
    updateProgress(50, 'Authenticating user...');
    if (!authuser.value && device_fingerprint.value && clientdata.value) {
      const data = {
        device_fingerprint: device_fingerprint.value,
        access_link: 'https://capitalradio.co.ug',
        clientdata: JSON.stringify(clientdata.value),
      };
      await store.dispatch('login', data);
    }
    updateProgress(60, 'User authenticated');

    // Step 4: Station data (80%)
    updateProgress(70, 'Loading station details...');
    const radioData = {
      access_link: 'https://capitalradio.co.ug'
    };
    await store.dispatch('fetch_station_details', radioData);
    updateProgress(80, 'Station details loaded');
    await store.dispatch('connectWebSocket');
    if (stationData.value?.radio_access_status === false) {
      isLoading.value = false;
      router.push('/maintanance');
    }
    // Step 5: Audio player initialization (100%)
    updateProgress(90, 'Initializing audio player...');
    if (stationData.value) {
      await store.dispatch('loadStation', stationData.value);
    }
    await store.dispatch('fetch_livechat', {
      station_id: stationData.value.id
    });
    updateProgress(100, 'Ready to go!');
     if(router.currentRoute.value.name === 'maintanance') {
      router.push('/');
    }
    // Final delay for smooth transition
    setTimeout(() => {
      isLoading.value = false;
    }, 800);

  } catch (err) {
    console.error('Loading error:', err);
    error.value = err.message || 'Failed to initialize Capital Radio. Please try again.';
    loadingMessage.value = 'Loading failed';
  }
};

// Retry function
const retryLoading = () => {
  error.value = null;
  loadingProgress.value = 0;
  currentTipIndex.value = 0;
  loadingMessage.value = 'Retrying...';
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
</script>

<style scoped>
.animate-bounce {
  animation: bounce 1.4s ease-in-out infinite;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
}
</style>