<template>
  <div class="min-h-screen  p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div class="space-y-2">
          <h1 class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Session Recordings
          </h1>
          <p class="text-gray-600 dark:text-gray-400">Monitor and manage radio session recordings in real-time</p>
          <div class="flex items-center gap-4 text-sm">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-gray-500 dark:text-gray-400">Auto-refreshing every minute</span>
            </div>
            <div class="flex items-center gap-2">
              <RadioIcon class="w-4 h-4 text-purple-600" />
              <span class="text-gray-500 dark:text-gray-400">{{ sessionRecordings?.data?.length || 0 }} recordings</span>
            </div>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-3">
          <button
          v-if="RecordingStatus"
            @click="toggleRecordingStatus"
            :disabled="loading === 'start_recording_sessions' || loading === 'stop_recording_sessions'"
            class="flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="RecordingStatus.service_running == false 
              ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700' 
              : 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700'"
          >
            <MicOffIcon v-if="RecordingStatus.service_running == false" class="w-5 h-5 mr-2" />
            <MicIcon v-else class="w-5 h-5 mr-2" />
            {{ RecordingStatus.service_running == false ? 'Start Recording Service' : 'Stop Recording Service' }}
          </button>

          <button
            @click="fetchSessionRecordings"
            :disabled="loading === 'fetch_session_recordings'"
            class="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50"
          >
            <RadioIcon class="w-5 h-5 mr-2" :class="{ 'animate-spin': loading === 'fetch_session_recordings' }" />
            Refresh Now
          </button>
        </div>
      </div>
    </div>

    <!-- Service Status Card -->
    <div class="mb-6">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4" v-if="RecordingStatus">
            <div :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center',
              RecordingStatus.service_running 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            ]">
              <RadioIcon class="w-6 h-6" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Recording Service Status</h3>
              <p :class="[
                'text-sm font-medium',
                RecordingStatus.service_running 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              ]">
                {{ RecordingStatus.service_running ? 'Active & Monitoring' : 'Inactive' }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ sessionRecordings?.data?.filter(r => r.recording_status === 'recording').length || 0 }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Active Recordings</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="mb-6">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Station</label>
            <select
              v-model="filters.station_id"
              @change="applyFilters"
              class="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="">All Stations</option>
              <option v-for="station in stations?.data" :key="station.id" :value="station.id">
                {{ station.name }}
              </option>
            </select>
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Program</label>
            <select
              v-model="filters.program_id"
              @change="applyFilters"
              class="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="">All Programs</option>
              <option v-for="program in programs?.data" :key="program.id" :value="program.id">
                {{ program.title }}
              </option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select
              v-model="filters.recording_status"
              @change="applyFilters"
              class="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="recording">Recording</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Day</label>
            <select
              v-model="filters.day_of_week"
              @change="applyFilters"
              class="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
            <input
              v-model="filters.session_date"
              @change="applyFilters"
              type="date"
              class="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            @click="resetFilters"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Recordings Grid -->
    <div class="space-y-4">
      <!-- Loading State -->
      <div v-if="loading === 'fetch_session_recordings'" class="grid gap-4">
        <div v-for="n in 5" :key="n" class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-6 animate-pulse">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-xl"></div>
              <div class="space-y-2">
                <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
              </div>
            </div>
            <div class="h-6 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
          </div>
        </div>
      </div>

      <!-- Data Cards -->
      <div v-else-if="sessionRecordings?.data?.length" class="grid gap-4">
        <div v-for="recording in sessionRecordings.data" :key="recording.id" 
             class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <!-- Recording Info -->
            <div class="flex items-center gap-4 flex-1">
              <div class="relative">
                <div :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center shadow-lg',
                  getRecordingStatusColor(recording.recording_status)
                ]">
                  <MicIcon class="w-6 h-6 text-white" />
                </div>
                <div v-if="recording.recording_status === 'recording'" 
                     class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>
              </div>
              
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {{ recording.station?.name || 'Unknown Station' }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 truncate">
                  {{ recording.program?.title || 'Unknown Program' }}
                </p>
                <div class="flex items-center gap-4 mt-2">
                  <span class="px-3 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full capitalize">
                    {{ recording.day_of_week }}
                  </span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(recording.session_date) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Schedule Info -->
            <div class="flex-1 lg:max-w-xs">
              <div class="space-y-2">
                <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <ClockIcon class="w-4 h-4 mr-2" />
                  {{ recording.scheduled_start_time ? formatTime(recording.scheduled_start_time) : 'N/A' }} - 
                  {{ recording.scheduled_end_time ? formatTime(recording.scheduled_end_time) : 'N/A' }}
                </div>
                <div v-if="recording.actual_start_time" class="text-sm text-green-600 dark:text-green-400">
                  Started: {{ formatTime(recording.actual_start_time) }}
                </div>
                <div v-if="recording.duration_minutes" class="text-sm text-blue-600 dark:text-blue-400">
                  Duration: {{ recording.duration_minutes }}m
                </div>
              </div>
            </div>

            <!-- Status Badge -->
            <div class="flex-shrink-0">
              <span :class="[
                'inline-flex px-4 py-2 text-sm font-semibold rounded-xl shadow-sm',
                getRecordingStatusBadge(recording.recording_status)
              ]">
                {{ recording.recording_status || 'Unknown' }}
              </span>
              <div v-if="recording.error_message" class="text-xs text-red-500 mt-2 max-w-xs truncate">
                {{ recording.error_message }}
              </div>
            </div>

            <!-- File Info & Controls -->
            <div v-if="recording" class="flex-1 lg:max-w-md">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ recording.file_size_mb ? `${recording.file_size_mb} MB` : 'File available' }}
                  </span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ recording.audio_format?.toUpperCase() || 'MP3' }} • {{ recording.audio_quality || '128kbps' }}
                  </span>
                </div>
                
                <!-- Audio Player Controls -->
                <div class="flex items-center gap-3">
                  <button
                    @click="togglePlayback(recording)"
                    :class="[
                      'flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105',
                      currentPlayingId === recording.id && isPlaying
                        ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    ]"
                  >
                    <PlayIcon v-if="currentPlayingId !== recording.id || !isPlaying" class="w-5 h-5 ml-0.5" />
                    <PauseIcon v-else class="w-5 h-5" />
                  </button>
                  
                  <a 
                    :href="recording.recording_file_url" 
                    download
                    class="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <DownloadIcon class="w-5 h-5" />
                  </a>

                  <button
                    @click="deleteRecording(recording)"
                    class="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>

                <!-- Audio Progress (when playing) -->
                <div v-if="currentPlayingId === recording.id" class="space-y-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
                  <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{{ formatAudioTime(currentTime) }}</span>
                    <span>{{ formatAudioTime(duration) }}</span>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2 cursor-pointer" @click="seekAudio($event)">
                    <div 
                      class="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-300" 
                      :style="{ width: `${audioProgress}%` }"
                    ></div>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <button @click="changeVolume(volume - 0.1)" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <VolumeXIcon v-if="volume === 0" class="w-4 h-4" />
                        <Volume1Icon v-else-if="volume < 0.5" class="w-4 h-4" />
                        <Volume2Icon v-else class="w-4 h-4" />
                      </button>
                      <input
                        type="range" min="0" max="1" step="0.1" :value="volume" @input="changeVolume($event.target.value)"
                        class="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600"
                      />
                      <button @click="changeVolume(volume + 0.1)" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <Volume2Icon class="w-4 h-4" />
                      </button>
                    </div>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ Math.round(volume * 100) }}%</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="flex-1 lg:max-w-md">
              <div class="text-center py-8 text-gray-400 dark:text-gray-500">
                <MicOffIcon class="w-8 h-8 mx-auto mb-2" />
                <p class="text-sm">No recording file available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-12 text-center">
        <MicIcon class="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No recordings found</h3>
        <p class="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Session recordings will appear here when programs are scheduled and the recording service is active.
        </p>
      </div>

      <!-- Pagination -->
      <div v-if="sessionRecordings?.pagination" class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            Showing {{ sessionRecordings.pagination.from }} to {{ sessionRecordings.pagination.to }} of {{ sessionRecordings.pagination.total }} results
          </div>
          <div class="flex gap-2">
            <button
              @click="changePage(sessionRecordings.pagination.current_page - 1)"
              :disabled="!sessionRecordings.pagination.has_prev"
              class="px-4 py-2 text-sm bg-gray-100 dark:bg-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              Previous
            </button>
            
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'px-4 py-2 text-sm rounded-lg transition-colors',
                page === sessionRecordings.pagination.current_page
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600'
              ]"
            >
              {{ page }}
            </button>
            
            <button
              @click="changePage(sessionRecordings.pagination.current_page + 1)"
              :disabled="!sessionRecordings.pagination.has_next"
              class="px-4 py-2 text-sm bg-gray-100 dark:bg-slate-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              Next
            </button>
          </div>
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
  MicOff as MicOffIcon,
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
const RecordingStatus = computed(() => store.getters.recordingStatus);

// Auto-refresh functionality
let refreshInterval = null;

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

// Auto-refresh functions
const startAutoRefresh = () => {
  refreshInterval = setInterval(async () => {
    try {
      await Promise.all([
        store.dispatch('get_recording_status'),
        store.dispatch('fetch_session_recordings', {
          data: {
            ...filters,
            page: currentPage.value,
            per_page: 20
          },
          page: currentPage.value
        })
      ]);
    } catch (error) {
      console.error('Auto-refresh failed:', error);
    }
  }, 60000); // Refresh every minute
};

const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};

const toggleRecordingStatus = async () => {
  try {
    if (RecordingStatus.value.service_running == false) {
      await store.dispatch('start_recording_sessions');
    } else {
      await store.dispatch('stop_recording_sessions');
    }
  } catch (error) {
    console.error('Failed to toggle recording status:', error);
    store.dispatch('template_play_error_file', 'Failed to toggle recording status');
  }
};

const get_recording_status = async () => {
  try {
    await store.dispatch('get_recording_status');
  } catch (error) {
    console.error('Failed to get recording status:', error);
    store.dispatch('template_play_error_file', 'Failed to get recording status');
  }
};

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
  try {
    await store.dispatch('delete_session_recording', {id: recording.id, data: {}});
  } catch (error) {
    console.error('Failed to delete recording:', error);
  }
};

// Audio player methods
const togglePlayback = async (recording) => {
  if (currentPlayingId.value === recording.id) {
    if (isPlaying.value) {
      pauseAudio();
    } else {
      playAudio();
    }
  } else {
    await loadAndPlayAudio(recording);
  }
};

const loadAndPlayAudio = async (recording) => {
  try {
    if (audioPlayer.value) {
      audioPlayer.value.pause();
      audioPlayer.value = null;
    }
    
    audioPlayer.value = new Audio(recording.recording_file_url);
    currentPlayingId.value = recording.id;
    
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
    case 'recording': return 'bg-gradient-to-r from-red-500 to-pink-600';
    case 'completed': return 'bg-gradient-to-r from-green-500 to-emerald-600';
    case 'scheduled': return 'bg-gradient-to-r from-blue-500 to-indigo-600';
    case 'failed': return 'bg-gradient-to-r from-red-600 to-red-700';
    default: return 'bg-gradient-to-r from-gray-500 to-gray-600';
  }
};

const getRecordingStatusBadge = (status) => {
  switch (status) {
    case 'recording': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }
};

// Initialize component
onMounted(async () => {
  try {
    await Promise.all([
      get_recording_status(),
      fetchSessionRecordings(),
      fetchPrograms(),
      fetchStations()
    ]);
    
    // Start auto-refresh after initial load
    startAutoRefresh();
  } catch (error) {
    console.error('Failed to initialize session recordings:', error);
    store.dispatch('template_play_error_file', 'Failed to load session recordings data');
  }
});

// Cleanup when component unmounts
onUnmounted(() => {
  // Stop auto-refresh
  stopAutoRefresh();
  
  // Cleanup audio
  if (audioPlayer.value) {
    audioPlayer.value.pause();
    audioPlayer.value = null;
  }
});
</script>