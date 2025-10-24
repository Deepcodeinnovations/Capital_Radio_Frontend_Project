<template>
  <div v-if="isLoading" class="fixed inset-0 bg-white flex items-center justify-center z-50">
    <div class="text-center">
      <!-- Logo/Brand -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">
          KIIS <span class="text-capital-pink">100.9</span>
        </h1>
        <p class="text-sm text-gray-600">HOT HITS FOR KAMPALA</p>
      </div>
      
      <!-- Windows-style Loading Spinner -->
      <div class="flex justify-center mb-6">
        <div class="windows-loader"></div>
      </div>
      
      <!-- Loading Text -->
      <p class="text-sm text-gray-600">Loading...</p>
      
      <!-- Error Handling -->
      <div v-if="error" class="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
        <p class="text-red-600 text-sm mb-3">{{ error }}</p>
        <button 
          @click="retryLoading"
          class="bg-capital-pink hover:bg-pink-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          Retry
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

// Store computed properties
const clientdata = computed(() => store.getters.clientdata);
const device_fingerprint = computed(() => store.getters.device_fingerprint);
const authuser = computed(() => store.getters.authuser);
const stationData = computed(() => store.getters.station);

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

// Main loading function
const initializeApp = async () => {
  try {
    error.value = null;
    
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
      isLoading.value = false;
    }, 500);

  } catch (err) {
    console.error('Loading error:', err);
    error.value = err.message || 'Failed to load. Please try again.';
  }
};

// Retry function
const retryLoading = () => {
  error.value = null;
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
/* Windows-style loader */
.windows-loader {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #ec4899;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
