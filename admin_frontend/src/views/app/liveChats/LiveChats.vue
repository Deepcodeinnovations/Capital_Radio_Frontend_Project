<template>
  <div class=" ">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center gap-4 mb-2">
        <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <MessageCircleIcon class="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Live Chats</h1>
          <p class="text-gray-600 dark:text-gray-300">Real-time conversations across all Capital Radio stations</p>
        </div>
      </div>
    </div>

    <!-- Live Chat Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <LiveChatCard 
        v-for="station in filteredStations" 
        :key="station.id"
        :station-data="station"
        class="transform hover:scale-105 transition-all duration-300"
      />
    </div>

    <!-- Empty state -->
    <div v-if="filteredStations.length === 0" class="text-center py-16">
      <div class="w-24 h-24 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
        <RadioIcon class="h-12 w-12 text-gray-400 dark:text-slate-500" />
      </div>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {{ searchQuery ? 'No stations found' : 'No Active Stations' }}
      </h3>
      <p class="text-gray-600 dark:text-gray-400">
        {{ searchQuery ? 'Try adjusting your search terms.' : 'Radio stations will appear here when they go live.' }}
      </p>
      <button 
        v-if="!searchQuery"
        @click="fetchStations"
        class="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-red-600 text-white font-medium px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
      >
        Refresh Stations
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="h-96 bg-gray-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
    </div>

    <!-- Floating refresh button -->
    <button 
      @click="refreshAll"
      class="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-red-600 text-white rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
      :class="{ 'animate-spin': isRefreshing }"
      :disabled="isRefreshing"
    >
      <RefreshCwIcon class="h-6 w-6 group-hover:rotate-180 transition-transform duration-500" />
    </button>

    <!-- Connection status indicator -->
    <div class="fixed bottom-6 left-6 flex items-center gap-2 bg-white dark:bg-slate-800 rounded-full px-4 py-2 shadow-lg border border-gray-200 dark:border-slate-700">
      <div :class="[
        'w-2 h-2 rounded-full',
        isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
      ]"></div>
      <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
        {{ isConnected ? 'Connected' : 'Disconnected' }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';
import LiveChatCard from './LiveChatCard.vue';
import { 
  MessageCircle as MessageCircleIcon,
  Radio as RadioIcon,
  RefreshCw as RefreshCwIcon
} from 'lucide-vue-next';

const store = useStore();

// State
const loading = ref(false);
const isRefreshing = ref(false);
const messagesInterval = ref(null);
const isConnected = ref(true);
const searchQuery = ref('');
const filterType = ref('all');
const currentPage = ref(1);

// Computed properties from store
const stations = computed(() => store.getters.stations || []);
const allMessages = computed(() => store.getters.liveChatmessages || []);

// Filter stations based on search and filter type
const filteredStations = computed(() => {
  let filtered = stations.value;
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(station => 
      station.name?.toLowerCase().includes(query) ||
      station.description?.toLowerCase().includes(query) ||
      station.frequency?.toLowerCase().includes(query)
    );
  }
  
  if (filterType.value === 'active') {
    const activeStationIds = new Set(
      allMessages.value
        .filter(msg => msg.is_visible)
        .map(msg => msg.station_id)
    );
    filtered = filtered.filter(station => activeStationIds.has(station.id));
  }
  
  return filtered;
});

// Methods
const fetchStations = async () => {
  const data = { per_page: 50 };
  const page = currentPage.value;
  
  try {
    loading.value = true;
    await store.dispatch('fetch_stations', { data, page });
  } catch (error) {
    console.error('Failed to fetch stations:', error);
    store.dispatch('template_play_error_file', 'Failed to load stations');
  } finally {
    loading.value = false;
  }
};

const loadMessages = async () => {
  try {
    await store.dispatch('fetchAllMessages');
  } catch (error) {
    console.error('Failed to load messages:', error);
  }
};

const startMessagesAutoRefresh = () => {
  messagesInterval.value = setInterval(async () => {
    try {
      await loadMessages();
    } catch (error) {
      console.error('Auto-refresh messages failed:', error);
    }
  }, 4000); // Fetch messages every 4 seconds
};

const stopMessagesAutoRefresh = () => {
  if (messagesInterval.value) {
    clearInterval(messagesInterval.value);
    messagesInterval.value = null;
  }
};

const refreshAll = async () => {
  if (isRefreshing.value) return;
  
  isRefreshing.value = true;
  
  try {
    await Promise.all([
      fetchStations(),
      loadMessages()
    ]);
    
    store.dispatch('template_play_success_file_no_msg');
  } catch (error) {
    console.error('Failed to refresh:', error);
    store.dispatch('template_play_error_file', 'Failed to refresh data');
  } finally {
    isRefreshing.value = false;
  }
};

const initializeWebSocket = () => {
  store.dispatch('connectWebSocket');
};

const disconnectWebSocket = () => {
  store.dispatch('disconnectWebSocket');
};

// Watch for connection status changes
watch(() => store.getters.connectionStatus, (status) => {
  isConnected.value = status === 'connected';
});

// Clear search when changing filter type
watch(filterType, () => {
  searchQuery.value = '';
});

// Lifecycle
onMounted(async () => {
  try {
    await fetchStations();
    await loadMessages();
    initializeWebSocket();
    startMessagesAutoRefresh(); // Start auto-refresh for messages
  } catch (error) {
    console.error('Failed to initialize live chats:', error);
    store.dispatch('template_play_error_file', 'Failed to initialize live chats');
  }
});

onUnmounted(() => {
  stopMessagesAutoRefresh(); // Stop auto-refresh
  disconnectWebSocket();
});
</script>