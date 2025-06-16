<template>
  <div v-if="isLoading" class="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
    <div class="text-center">
      <div class="relative mb-6">
        <!-- Radio Icon with Glow Effect -->
        <div class="w-20 h-20 mx-auto bg-gradient-to-r from-capital-blue to-capital-purple rounded-full flex items-center justify-center mb-4 animate-pulse">
          <Radio class="h-10 w-10 text-white" />
        </div>
      </div>
      
      <h1 class="text-3xl font-bold text-white mb-2 font-heading">Capital Radio</h1>
      <p class="text-capital-yellow text-lg animate-pulse entertainment-text">{{ loadingMessage }}</p>
      
      <!-- Loading Dots -->
      <div class="flex justify-center mt-6 space-x-2">
        <div class="w-3 h-3 bg-capital-blue rounded-full animate-bounce"></div>
        <div class="w-3 h-3 bg-capital-yellow rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        <div class="w-3 h-3 bg-capital-red rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
      </div>
      
      <!-- Progress Bar -->
      <div class="w-64 mx-auto mt-6 bg-slate-800 rounded-full h-1 overflow-hidden">
        <div class="h-full bg-gradient-to-r from-capital-blue to-capital-yellow transition-all duration-300" 
             :style="{ width: `${loadingProgress}%` }"></div>
      </div>
      
      <!-- Error Message -->
      <div v-if="error" class="mt-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg">
        <p class="text-red-300 text-sm">{{ error }}</p>
        <button @click="retryLoading" class="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors">
          Retry
        </button>
      </div>
    </div>
  </div>
  
  <router-view v-else />
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { Radio } from 'lucide-vue-next';

const store = useStore();
const isLoading = ref(true);
const loadingMessage = ref('Initializing Capital Radio...');
const loadingProgress = ref(0);
const error = ref(null);

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
    // Step 5: Audio player initialization (100%)
    updateProgress(90, 'Initializing audio player...');
    if (stationData.value) {
      await store.dispatch('loadStation', stationData.value);
    }
    await store.dispatch('fetch_livechat', {
      station_id: stationData.value.id
    });
    updateProgress(100, 'Ready to go!');

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
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translateY(0);
  }
  40%, 43% {
    transform: translateY(-8px);
  }
  70% {
    transform: translateY(-4px);
  }
  90% {
    transform: translateY(-2px);
  }
}

.animate-bounce {
  animation: bounce 1.4s ease-in-out infinite;
}
</style>