<template>
  <div class="">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Session Recordings</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Manage radio session recordings and playback</p>
        </div>
        <div class="flex gap-2">
          <button
            @click="fetchSessionRecordings"
            class="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RadioIcon class="w-5 h-5 mr-2" />
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Station</label>
          <select
            v-model="filters.station_id"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Stations</option>
            <option v-for="station in stations?.data" :key="station.id" :value="station.id">
              {{ station.name }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Program</label>
          <select
            v-model="filters.program_id"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Programs</option>
            <option v-for="program in programs?.data" :key="program.id" :value="program.id">
              {{ program.title }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recording Status</label>
          <select
            v-model="filters.recording_status"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="recording">Recording</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Day</label>
          <select
            v-model="filters.day_of_week"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Days</option>
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
            <option value="saturday">Saturday</option>
            <option value="sunday">Sunday</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Session Date</label>
          <input
            v-model="filters.session_date"
            @change="applyFilters"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
      
      <div class="flex justify-end mt-4">
        <button
          @click="resetFilters"
          class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          Reset Filters
        </button>
      </div>
    </div>

    <!-- Recordings Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Session Info</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Schedule</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recording Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">File Info</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
            <!-- Loading State -->
            <tr v-if="loading === 'fetch_session_recordings'" v-for="n in 5" :key="n" class="animate-pulse">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
                  <div class="ml-4">
                    <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32 mb-2"></div>
                    <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-2"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
              </td>
              <td class="px-6 py-4">
                <div class="h-6 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
              </td>
              <td class="px-6 py-4">
                <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <div class="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  <div class="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded"></div>
                </div>
              </td>
            </tr>

            <!-- Data Rows -->
            <tr v-else-if="sessionRecordings?.data?.length" v-for="recording in sessionRecordings.data" :key="recording.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="relative">
                    <div :class="[
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      getRecordingStatusColor(recording.recording_status)
                    ]">
                      <MicIcon class="w-5 h-5 text-white" />
                    </div>
                    <div v-if="recording.recording_status === 'recording'" class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ recording.station?.name || 'Unknown Station' }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ recording.program?.title || 'Unknown Program' }}
                    </div>
                    <div class="text-xs text-purple-600 dark:text-purple-400 capitalize">
                      {{ recording.day_of_week }}
                    </div>
                  </div>
                </div>
              </td>
              
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white">
                  {{ formatDate(recording.session_date) }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  <ClockIcon class="w-3 h-3 inline mr-1" />
                  {{ recording.scheduled_start_time ? formatTime(recording.scheduled_start_time) : 'N/A' }} - 
                  {{ recording.scheduled_end_time ? formatTime(recording.scheduled_end_time) : 'N/A' }}
                </div>
                <div v-if="recording.actual_start_time" class="text-xs text-green-600 dark:text-green-400">
                  Started: {{ formatTime(recording.actual_start_time) }}
                </div>
              </td>

              <td class="px-6 py-4">
                <span :class="[
                  'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  getRecordingStatusBadge(recording.recording_status)
                ]">
                  {{ recording.recording_status || 'Unknown' }}
                </span>
                <div v-if="recording.error_message" class="text-xs text-red-500 mt-1">
                  {{ recording.error_message }}
                </div>
                <div v-if="recording.duration_minutes" class="text-xs text-gray-500 mt-1">
                  Duration: {{ recording.duration_minutes }}m
                </div>
              </td>

              <td class="px-6 py-4">
                <div v-if="recording.recording_file_url" class="space-y-2">
                  <div class="text-sm text-gray-900 dark:text-white">
                    {{ recording.file_size_mb ? `${recording.file_size_mb} MB` : 'File available' }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ recording.audio_format?.toUpperCase() || 'MP3' }} • {{ recording.audio_quality || '128kbps' }}
                  </div>
                  
                  <!-- Audio Player Controls -->
                  <div class="flex items-center gap-2">
                    <button
                      @click="togglePlayback(recording)"
                      :class="[
                        'flex items-center justify-center w-8 h-8 rounded-full transition-colors',
                        currentPlayingId === recording.id && isPlaying
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      ]"
                      :title="currentPlayingId === recording.id && isPlaying ? 'Pause' : 'Play'"
                    >
                      <PlayIcon v-if="currentPlayingId !== recording.id || !isPlaying" class="w-4 h-4 ml-0.5" />
                      <PauseIcon v-else class="w-4 h-4" />
                    </button>
                    
                    <a 
                      :href="recording.recording_file_url" 
                      download
                      class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                      title="Download"
                    >
                      <DownloadIcon class="w-4 h-4" />
                    </a>
                  </div>

                  <!-- Audio Progress Bar (shown when playing this recording) -->
                  <div v-if="currentPlayingId === recording.id" class="space-y-1">
                    <div class="flex items-center justify-between text-xs text-gray-500">
                      <span>{{ formatAudioTime(currentTime) }}</span>
                      <span>{{ formatAudioTime(duration) }}</span>
                    </div>
                    <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 cursor-pointer" @click="seekAudio($event)">
                      <div 
                        class="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                        :style="{ width: `${audioProgress}%` }"
                      ></div>
                    </div>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <button
                          @click="changeVolume(volume - 0.1)"
                          class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          <VolumeXIcon v-if="volume === 0" class="w-4 h-4" />
                          <Volume1Icon v-else-if="volume < 0.5" class="w-4 h-4" />
                          <Volume2Icon v-else class="w-4 h-4" />
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          :value="volume"
                          @input="changeVolume($event.target.value)"
                          class="w-16 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                        />
                        <button
                          @click="changeVolume(volume + 0.1)"
                          class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          <Volume2Icon class="w-4 h-4" />
                        </button>
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ Math.round(volume * 100) }}%
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-sm text-gray-400">
                  No file available
                </div>
              </td>

              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button
                    @click="toggleRecordingStatus(recording)"
                    :class="[
                      'p-2 rounded-lg transition-colors',
                      recording.status 
                        ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' 
                        : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                    ]"
                    :title="recording.status ? 'Deactivate' : 'Activate'"
                  >
                    <RadioIcon class="w-4 h-4" />
                  </button>
                  
                  <button
                    @click="deleteRecording(recording)"
                    class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete Recording"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-else>
              <td colspan="5" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                <MicIcon class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p class="text-lg font-medium">No session recordings found</p>
                <p class="mt-2">Recordings will appear here when sessions are scheduled</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="sessionRecordings?.pagination" class="px-6 py-3 bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Showing {{ sessionRecordings.pagination.from }} to {{ sessionRecordings.pagination.to }} of {{ sessionRecordings.pagination.total }} results
        </div>
        <div class="flex gap-2">
          <button
            @click="changePage(sessionRecordings.pagination.current_page - 1)"
            :disabled="!sessionRecordings.pagination.has_prev"
            class="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            Previous
          </button>
          
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-1 text-sm border rounded',
              page === sessionRecordings.pagination.current_page
                ? 'bg-purple-600 text-white border-purple-600'
                : 'hover:bg-gray-100 dark:hover:bg-gray-600'
            ]"
          >
            {{ page }}
          </button>
          
          <button
            @click="changePage(sessionRecordings.pagination.current_page + 1)"
            :disabled="!sessionRecordings.pagination.has_next"
            class="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue';
import { useStore } from 'vuex';
import {
  Radio as RadioIcon,
  Mic as MicIcon,
  Clock as ClockIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  Download as DownloadIcon,
  Volume2 as Volume2Icon,
  Volume1 as Volume1Icon,
  VolumeX as VolumeXIcon,
  Trash as TrashIcon,
} from 'lucide-vue-next';

const store = useStore();

// Computed properties from store
const sessionRecordings = computed(() => store.getters.sessionRecordings);
const programs = computed(() => store.getters.programs);
const stations = computed(() => store.getters.stations);
const loading = computed(() => store.getters.loading);

// Reactive state
const currentPage = ref(1);
const filters = reactive({
  station_id: '',
  program_id: '',
  recording_status: '',
  day_of_week: '',
  session_date: ''
});

// Audio player state
const audioPlayer = ref(null);
const currentPlayingId = ref(null);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(0.8);
const audioProgress = computed(() => {
  return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0;
});

// Computed pagination
const visiblePages = computed(() => {
  if (!sessionRecordings.value?.pagination) return []
  const current = sessionRecordings.value.pagination.current_page
  const last = sessionRecordings.value.pagination.last_page || sessionRecordings.value.pagination.total_pages
  const pages = []
  const maxVisible = 5
  
  let start = Math.max(1, current - Math.floor(maxVisible / 2))
  let end = Math.min(last, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
});

// Methods
const fetchSessionRecordings = async () => {
  try {
    await store.dispatch('fetch_session_recordings', {
      data: {
        ...filters,
        page: currentPage.value,
        per_page: 20
      },
      page: currentPage.value
    });
  } catch (error) {
    console.error('Failed to fetch session recordings:', error);
    store.dispatch('template_play_error_file', 'Failed to load session recordings');
  }
};

const fetchPrograms = async () => {
  try {
    await store.dispatch('fetch_programs', {
      data: { per_page: 50 },
      page: 1
    });
  } catch (error) {
    console.error('Failed to fetch programs:', error);
  }
};

const fetchStations = async () => {
  try {
    await store.dispatch('fetch_stations', {
      data: { per_page: 50 },
      page: 1
    });
  } catch (error) {
    console.error('Failed to fetch stations:', error);
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= (sessionRecordings.value.pagination.last_page || sessionRecordings.value.pagination.total_pages)) {
    currentPage.value = page;
    fetchSessionRecordings();
  }
};

const applyFilters = () => {
  currentPage.value = 1;
  fetchSessionRecordings();
};

const resetFilters = () => {
  Object.keys(filters).forEach(key => {
    filters[key] = '';
  });
  currentPage.value = 1;
  fetchSessionRecordings();
};

const deleteRecording = async (recording) => {
  if (confirm(`Are you sure you want to delete this recording from ${formatDate(recording.session_date)}?`)) {
    try {
      await store.dispatch('delete_session_recording', {
        id: recording.id,
        data: {}
      });
      
      store.dispatch('template_play_delete_file', 'Recording deleted successfully');
      fetchSessionRecordings();
    } catch (error) {
      console.error('Failed to delete recording:', error);
      store.dispatch('template_play_error_file', 'Failed to delete recording');
    }
  }
};

const toggleRecordingStatus = async (recording) => {
  try {
    await store.dispatch('toggle_session_recording_status', {
      id: recording.id,
      data: {}
    });
    
    const statusText = recording.status ? 'deactivated' : 'activated';
    store.dispatch('template_play_success_file', `Recording ${statusText} successfully`);
    fetchSessionRecordings();
  } catch (error) {
    console.error('Failed to toggle recording status:', error);
    store.dispatch('template_play_error_file', 'Failed to update recording status');
  }
};

// Audio player methods
const togglePlayback = async (recording) => {
  if (currentPlayingId.value === recording.id) {
    // Toggle play/pause for current recording
    if (isPlaying.value) {
      pauseAudio();
    } else {
      playAudio();
    }
  } else {
    // Start playing new recording
    await loadAndPlayAudio(recording);
  }
};

const loadAndPlayAudio = async (recording) => {
  try {
    // Stop current audio if playing
    if (audioPlayer.value) {
      audioPlayer.value.pause();
      audioPlayer.value = null;
    }
    
    // Create new audio element
    audioPlayer.value = new Audio(recording.recording_file_url);
    currentPlayingId.value = recording.id;
    
    // Set up event listeners
    audioPlayer.value.addEventListener('loadedmetadata', () => {
      duration.value = audioPlayer.value.duration;
    });
    
    audioPlayer.value.addEventListener('timeupdate', () => {
      currentTime.value = audioPlayer.value.currentTime;
    });
    
    audioPlayer.value.addEventListener('ended', () => {
      isPlaying.value = false;
      currentTime.value = 0;
      currentPlayingId.value = null;
    });
    
    audioPlayer.value.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      store.dispatch('template_play_error_file', 'Failed to play audio file');
      isPlaying.value = false;
      currentPlayingId.value = null;
    });
    
    // Set volume and play
    audioPlayer.value.volume = volume.value;
    await audioPlayer.value.play();
    isPlaying.value = true;
    
  } catch (error) {
    console.error('Failed to load audio:', error);
    store.dispatch('template_play_error_file', 'Failed to load audio file');
    isPlaying.value = false;
    currentPlayingId.value = null;
  }
};

const playAudio = async () => {
  if (audioPlayer.value) {
    try {
      await audioPlayer.value.play();
      isPlaying.value = true;
    } catch (error) {
      console.error('Failed to play audio:', error);
      store.dispatch('template_play_error_file', 'Failed to play audio');
    }
  }
};

const pauseAudio = () => {
  if (audioPlayer.value) {
    audioPlayer.value.pause();
    isPlaying.value = false;
  }
};

const seekAudio = (event) => {
  if (audioPlayer.value && duration.value > 0) {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    const seekTime = (clickX / width) * duration.value;
    
    audioPlayer.value.currentTime = seekTime;
    currentTime.value = seekTime;
  }
};

const changeVolume = (newVolume) => {
  const vol = Math.max(0, Math.min(1, parseFloat(newVolume)));
  volume.value = vol;
  
  if (audioPlayer.value) {
    audioPlayer.value.volume = vol;
  }
};

const formatAudioTime = (seconds) => {
  if (isNaN(seconds)) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return 'No date';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatTime = (timeString) => {
  if (!timeString) return 'No time';
  const date = new Date(timeString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getRecordingStatusColor = (status) => {
  switch (status) {
    case 'recording': return 'bg-red-500';
    case 'completed': return 'bg-green-500';
    case 'scheduled': return 'bg-blue-500';
    case 'failed': return 'bg-red-600';
    default: return 'bg-gray-500';
  }
};

const getRecordingStatusBadge = (status) => {
  switch (status) {
    case 'recording': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

// Initialize component
onMounted(async () => {
  try {
    await Promise.all([
      fetchSessionRecordings(),
      fetchPrograms(),
      fetchStations()
    ]);
  } catch (error) {
    console.error('Failed to initialize session recordings:', error);
    store.dispatch('template_play_error_file', 'Failed to load session recordings data');
  }
});

// Cleanup audio when component unmounts
onUnmounted(() => {
  if (audioPlayer.value) {
    audioPlayer.value.pause();
    audioPlayer.value = null;
  }
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>