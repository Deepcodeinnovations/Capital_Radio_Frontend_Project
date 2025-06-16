<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">Radio Stations</h1>
        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Manage your radio stations and recordings</p>
      </div>
      
      <div class="flex items-center gap-3">
        <button 
          @click="refreshAllRecordingStatus"
          :disabled="loadingRecordingStatus"
          class="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium disabled:opacity-50"
        >
          <LoaderIcon v-if="loadingRecordingStatus" class="h-4 w-4 animate-spin" />
          <RadioIcon v-else class="h-4 w-4" />
          {{ loadingRecordingStatus ? 'Checking...' : 'Check All Recording Status' }}
        </button>
        
        <button 
          @click="showAddStationModal = true" 
          :disabled="loading === 'create_station'"
          class="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium disabled:opacity-50"
        >
          <LoaderIcon v-if="loading === 'create_station'" class="h-4 w-4 animate-spin" />
          <PlusIcon v-else class="h-4 w-4" />
          {{ loading === 'create_station' ? 'Creating...' : 'Add Station' }}
        </button>
      </div>
    </div>

    <!-- Stations Grid -->
    <div v-if="loading === 'fetch_stations'" class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Skeleton Loading Cards -->
      <div v-for="n in 4" :key="`skeleton-${n}`" class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
        <div class="h-32 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
        <div class="space-y-3">
          <div class="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div class="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div class="h-3 w-2/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Actual Stations Grid -->
    <div v-else class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div v-for="station in stations" :key="station.id" class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow">
        
        <!-- Station Header -->
        <div class="p-4 border-b border-slate-200 dark:border-slate-700">
          <div class="flex items-center justify-between">
            <router-link :to="{ name: 'StationDetails', params: { id: station.id } }" class="flex items-center">
              <div class="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold mr-3">
                {{ station.name.substring(0, 2).toUpperCase() }}
              </div>
              <div>
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{{ station.name }}</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400">{{ station.frequency }} FM</p>
              </div>
            </router-link>
            
            <div class="flex items-center gap-2">
              <!-- Streaming Status -->
              <span :class="[
                'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
                station.streaming_status === 'live' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                  : station.streaming_status === 'offline'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
              ]">
                <div :class="[
                  'w-1.5 h-1.5 rounded-full mr-1.5',
                  station.streaming_status === 'live' ? 'bg-green-500 animate-pulse' : station.streaming_status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                ]"></div>
                {{ station.streaming_status?.charAt(0).toUpperCase() + station.streaming_status?.slice(1) }}
              </span>
            </div>
          </div>
          
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-2">{{ station.tagline }}</p>
        </div>

        <!-- Station Info & Controls -->
        <div class="p-4 space-y-4">
          
          <!-- Basic Stats -->
          <div class="grid grid-cols-3 gap-4 text-center">
            <div>
              <p class="text-lg font-bold text-slate-900 dark:text-white">{{ station.listeners?.toLocaleString() || '0' }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">Listeners</p>
            </div>
            <div>
              <p class="text-lg font-bold text-slate-900 dark:text-white">
                {{ recordingStatus[station.id]?.active_recordings || 0 }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400">Active</p>
            </div>
            <div>
              <p class="text-lg font-bold text-slate-900 dark:text-white">
                {{ recordingStatus[station.id]?.scheduled_recordings || 0 }}
              </p>
              <p class="text-xs text-slate-500 dark:text-slate-400">Scheduled</p>
            </div>
          </div>

          <!-- Audio Player (if live) -->
          <div v-if="station.streaming_link && station.streaming_status === 'live'" class="bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Live Stream</span>
              <div class="flex items-center gap-2">
                <VolumeXIcon v-if="currentStation?.id === station.id && isMuted" class="h-4 w-4 text-slate-400" />
                <Volume2Icon v-else-if="currentStation?.id === station.id && !isMuted" class="h-4 w-4 text-blue-500" />
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              <button 
                @click="togglePlay(station)"
                :disabled="audioLoading === station.id"
                class="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full disabled:opacity-50 transition-colors"
              >
                <LoaderIcon v-if="audioLoading === station.id" class="h-3 w-3 animate-spin" />
                <PauseIcon v-else-if="currentStation?.id === station.id && isPlaying" class="h-3 w-3" />
                <PlayIcon v-else class="h-3 w-3" />
              </button>
              
              <div class="flex-1 bg-slate-200 dark:bg-slate-600 rounded-full h-1.5">
                <div 
                  v-if="currentStation?.id === station.id" 
                  class="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                  :style="{ width: `${volume}%` }"
                ></div>
              </div>
              
              <button 
                v-if="currentStation?.id === station.id"
                @click="toggleMute"
                class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
              >
                <VolumeXIcon v-if="isMuted" class="h-3 w-3" />
                <Volume2Icon v-else class="h-3 w-3" />
              </button>
            </div>
          </div>

          <!-- Recording Status Section -->
          <div class="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <MicIcon class="h-4 w-4" />
                Recording Status
              </h4>
              <button 
                @click="checkStationRecordingStatus(station.id)"
                :disabled="loadingStationStatus[station.id]"
                class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded flex items-center gap-1 hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50"
              >
                <LoaderIcon v-if="loadingStationStatus[station.id]" class="h-3 w-3 animate-spin" />
                <RefreshCwIcon v-else class="h-3 w-3" />
                Refresh
              </button>
            </div>

            <!-- Recording Status Display -->
            <div v-if="recordingStatus[station.id]" class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span class="text-slate-600 dark:text-slate-400">Stream Status:</span>
                <span :class="[
                  'font-medium',
                  recordingStatus[station.id].stream_status === 'active' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                ]">
                  {{ recordingStatus[station.id].stream_status?.toUpperCase() || 'UNKNOWN' }}
                </span>
              </div>
              
              <!-- Active Recordings -->
              <div v-if="recordingStatus[station.id].recordings?.length" class="mt-3">
                <p class="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Recent Recordings:</p>
                <div class="space-y-1 max-h-24 overflow-y-auto">
                  <div 
                    v-for="recording in recordingStatus[station.id].recordings.slice(0, 3)" 
                    :key="recording.id"
                    class="flex items-center justify-between text-xs bg-white dark:bg-slate-600 rounded p-2"
                  >
                    <div class="flex items-center gap-2">
                      <div :class="[
                        'w-2 h-2 rounded-full',
                        recording.recording_status === 'recording' ? 'bg-red-500 animate-pulse' :
                        recording.recording_status === 'completed' ? 'bg-green-500' :
                        recording.recording_status === 'scheduled' ? 'bg-blue-500' :
                        'bg-gray-500'
                      ]"></div>
                      <span class="font-mono">{{ recording.scheduled_start_time?.substring(11, 16) || 'N/A' }}</span>
                      <span class="text-slate-500">{{ recording.recording_status }}</span>
                    </div>
                    <div class="flex gap-1">
                      <button 
                        v-if="recording.recording_status === 'recording'"
                        @click="stopRecording(recording.id)"
                        :disabled="loadingRecordingAction[recording.id]"
                        class="text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        <StopCircleIcon class="h-3 w-3" />
                      </button>
                      <button 
                        v-if="recording.recording_status === 'scheduled'"
                        @click="startRecording(recording.id)"
                        :disabled="loadingRecordingAction[recording.id]"
                        class="text-green-600 hover:text-green-700 disabled:opacity-50"
                      >
                        <PlayCircleIcon class="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Recording Actions -->
              <div class="flex gap-2 mt-3">
                <button 
                  @click="generateStationRecordings(station.id)"
                  :disabled="loadingRecordingAction[`generate_${station.id}`]"
                  class="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1.5 rounded flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <LoaderIcon v-if="loadingRecordingAction[`generate_${station.id}`]" class="h-3 w-3 animate-spin" />
                  <CalendarIcon v-else class="h-3 w-3" />
                  Generate Today
                </button>
                
                <button 
                  @click="emergencyStopStation(station.id)"
                  :disabled="loadingRecordingAction[`stop_${station.id}`]"
                  class="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1.5 rounded flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <LoaderIcon v-if="loadingRecordingAction[`stop_${station.id}`]" class="h-3 w-3 animate-spin" />
                  <StopCircleIcon v-else class="h-3 w-3" />
                  Stop All
                </button>
              </div>
            </div>
            
            <!-- No recording status -->
            <div v-else class="text-center py-2">
              <p class="text-xs text-slate-500 dark:text-slate-400">No recording status available</p>
              <button 
                @click="checkStationRecordingStatus(station.id)"
                class="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 mt-1"
              >
                Check Status
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <a 
                v-if="station.access_link" 
                :href="station.access_link" 
                target="_blank"
                class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1"
              >
                <ExternalLinkIcon class="h-4 w-4" />
              </a>
            </div>
            
            <div class="flex items-center gap-1">
              <button 
                @click="editStation(station)" 
                :disabled="loading === 'update_station'"
                class="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <EditIcon class="h-4 w-4" />
              </button>
              <button 
                @click="deleteStation(station)" 
                :disabled="loading === 'delete_station'"
                class="text-slate-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Station Modal -->
    <div v-if="showAddStationModal || editingStation" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              {{ editingStation ? 'Edit Station' : 'Add New Station' }}
            </h2>
            <button @click="closeModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <XIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Station Name</label>
              <input 
                type="text" 
                v-model="stationForm.name" 
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
                placeholder="Enter station name" 
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Frequency</label>
              <input 
                type="text" 
                v-model="stationForm.frequency" 
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
                placeholder="e.g. 98.5 FM" 
              />
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Listeners</label>
              <input 
                type="number" 
                v-model="stationForm.listeners" 
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
                placeholder="10000" 
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Streaming Status</label>
              <select 
                v-model="stationForm.streaming_status" 
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
              >
                <option value="live">Live</option>
                <option value="offline">Offline</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tagline</label>
            <input 
              type="text" 
              v-model="stationForm.tagline" 
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
              placeholder="Station tagline" 
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Access Link</label>
            <input 
              type="url" 
              v-model="stationForm.access_link" 
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
              placeholder="https://example.com" 
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Streaming Link</label>
            <input 
              type="url" 
              v-model="stationForm.streaming_link" 
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
              placeholder="https://stream.example.com/live" 
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">About Station</label>
            <textarea 
              v-model="stationForm.about" 
              rows="3" 
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
              placeholder="Describe the station..."
            ></textarea>
          </div>
          
          <div class="flex items-center">
            <input 
              type="checkbox" 
              v-model="stationForm.radio_access_status" 
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 rounded"
            />
            <label class="ml-2 text-sm text-slate-700 dark:text-slate-300">Enable Radio Access</label>
          </div>
        </div>
        
        <div class="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
          <button 
            @click="closeModal" 
            class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
          >
            Cancel
          </button>
          <button 
            @click="saveStation" 
            :disabled="loading === 'create_station' || loading === 'update_station'"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-md text-sm font-medium disabled:opacity-50"
          >
            <span v-if="loading === 'create_station' || loading === 'update_station'">
              {{ editingStation ? 'Updating...' : 'Creating...' }}
            </span>
            <span v-else>
              {{ editingStation ? 'Update' : 'Create' }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import {
  Plus as PlusIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  X as XIcon,
  Loader as LoaderIcon,
  Play as PlayIcon,
  Pause as PauseIcon,
  Volume2 as Volume2Icon,
  VolumeX as VolumeXIcon,
  ExternalLink as ExternalLinkIcon,
  Radio as RadioIcon,
  Mic as MicIcon,
  RefreshCw as RefreshCwIcon,
  Calendar as CalendarIcon,
  StopCircle as StopCircleIcon,
  PlayCircle as PlayCircleIcon
} from 'lucide-vue-next';

const store = useStore();

// Computed properties from store
const stations = computed(() => store.getters.stations);
const loading = computed(() => store.getters.loading);

// Modal states
const showAddStationModal = ref(false);
const editingStation = ref(null);
const currentPage = ref(1);

// Recording states
const recordingStatus = ref({});
const loadingRecordingStatus = ref(false);
const loadingStationStatus = ref({});
const loadingRecordingAction = ref({});

// Audio player states
const currentStation = ref(null);
const isPlaying = ref(false);
const isMuted = ref(false);
const volume = ref(50);
const audioLoading = ref(null);
let audioElement = null;

// Form data
const stationForm = ref({
  name: '',
  frequency: '',
  tagline: '',
  access_link: '',
  streaming_link: '',
  about: '',
  listeners: 0,
  streaming_status: 'offline',
  radio_access_status: true
});

// Recording API functions
const checkStationRecordingStatus = async (stationId) => {
  loadingStationStatus.value[stationId] = true;
  try {
    const response = await store.dispatch('recording_service_status', { station_id: stationId });
    if (response.data) {
      recordingStatus.value[stationId] = response.data;
    }
  } catch (error) {
    console.error('Failed to check recording status:', error);
    store.dispatch('template_play_error_file', 'Failed to check recording status');
  } finally {
    loadingStationStatus.value[stationId] = false;
  }
};

const refreshAllRecordingStatus = async () => {
  loadingRecordingStatus.value = true;
  try {
    for (const station of stations.value) {
      await checkStationRecordingStatus(station.id);
    }
    store.dispatch('template_play_success_file', 'All recording statuses refreshed');
  } catch (error) {
    console.error('Failed to refresh all recording statuses:', error);
    store.dispatch('template_play_error_file', 'Failed to refresh recording statuses');
  } finally {
    loadingRecordingStatus.value = false;
  }
};

const startRecording = async (recordingId) => {
  loadingRecordingAction.value[recordingId] = true;
  try {
    await store.dispatch('start_recording', { recording_id: recordingId });
    store.dispatch('template_play_success_file', 'Recording started successfully');
    // Refresh the station status
    const recording = recordingStatus.value;
    for (const stationId in recording) {
      const station = recording[stationId];
      if (station.recordings?.some(r => r.id === recordingId)) {
        await checkStationRecordingStatus(stationId);
        break;
      }
    }
  } catch (error) {
    console.error('Failed to start recording:', error);
    store.dispatch('template_play_error_file', 'Failed to start recording');
  } finally {
    loadingRecordingAction.value[recordingId] = false;
  }
};

const stopRecording = async (recordingId) => {
  loadingRecordingAction.value[recordingId] = true;
  try {
    await store.dispatch('stop_recording', { recording_id: recordingId });
    store.dispatch('template_play_success_file', 'Recording stopped successfully');
    // Refresh the station status
    const recording = recordingStatus.value;
    for (const stationId in recording) {
      const station = recording[stationId];
      if (station.recordings?.some(r => r.id === recordingId)) {
        await checkStationRecordingStatus(stationId);
        break;
      }
    }
  } catch (error) {
    console.error('Failed to stop recording:', error);
    store.dispatch('template_play_error_file', 'Failed to stop recording');
  } finally {
    loadingRecordingAction.value[recordingId] = false;
  }
};

const generateStationRecordings = async (stationId) => {
  loadingRecordingAction.value[`generate_${stationId}`] = true;
  try {
    await store.dispatch('generate_station_recordings', { station_id: stationId });
    store.dispatch('template_play_success_file', 'Recordings generated successfully');
    await checkStationRecordingStatus(stationId);
  } catch (error) {
    console.error('Failed to generate recordings:', error);
    store.dispatch('template_play_error_file', 'Failed to generate recordings');
  } finally {
    loadingRecordingAction.value[`generate_${stationId}`] = false;
  }
};

const emergencyStopStation = async (stationId) => {
  if (!confirm('Are you sure you want to stop all recordings for this station?')) return;
  
  loadingRecordingAction.value[`stop_${stationId}`] = true;
  try {
    await store.dispatch('emergency_stop_station_recordings', { station_id: stationId });
    store.dispatch('template_play_delete_file', 'All recordings stopped for station');
    await checkStationRecordingStatus(stationId);
  } catch (error) {
    console.error('Failed to stop station recordings:', error);
    store.dispatch('template_play_error_file', 'Failed to stop recordings');
  } finally {
    loadingRecordingAction.value[`stop_${stationId}`] = false;
  }
};

// Audio functions
const togglePlay = async (station) => {
  audioLoading.value = station.id;
  
  try {
    if (currentStation.value?.id === station.id && isPlaying.value) {
      // Pause current
      audioElement?.pause();
      isPlaying.value = false;
    } else {
      // Stop current if different station
      if (currentStation.value?.id !== station.id) {
        audioElement?.pause();
        audioElement = null;
      }
      
      // Create or resume audio
      if (!audioElement) {
        audioElement = new Audio(station.streaming_link);
        audioElement.volume = volume.value / 100;
        audioElement.muted = isMuted.value;
        
        audioElement.addEventListener('loadstart', () => {
          audioLoading.value = station.id;
        });
        
        audioElement.addEventListener('canplay', () => {
          audioLoading.value = null;
        });
        
        audioElement.addEventListener('error', () => {
          audioLoading.value = null;
          store.dispatch('template_play_error_file', 'Failed to load audio stream');
        });
      }
      
      await audioElement.play();
      currentStation.value = station;
      isPlaying.value = true;
    }
  } catch (error) {
    console.error('Audio playback error:', error);
    store.dispatch('template_play_error_file', 'Failed to play audio stream');
  } finally {
    audioLoading.value = null;
  }
};

const toggleMute = () => {
  if (audioElement) {
    isMuted.value = !isMuted.value;
    audioElement.muted = isMuted.value;
  }
};

const updateVolume = () => {
  if (audioElement) {
    audioElement.volume = volume.value / 100;
  }
};

// Reset form
const resetForm = () => {
  stationForm.value = {
    name: '',
    frequency: '',
    tagline: '',
    access_link: '',
    streaming_link: '',
    about: '',
    listeners: 0,
    streaming_status: 'offline',
    radio_access_status: true
  };
};

// Edit station
const editStation = (station) => {
  stationForm.value = { ...station };
  editingStation.value = station;
  showAddStationModal.value = true;
};

// Close modal
const closeModal = () => {
  showAddStationModal.value = false;
  editingStation.value = null;
  resetForm();
};

// Save station (add or update)
const saveStation = async () => {
  try {
    if (editingStation.value) {
      await store.dispatch('update_station', {
        stationId: editingStation.value.id,
        data: stationForm.value
      });
    } else {
      await store.dispatch('create_station', stationForm.value);
    }
    
    await fetchStations();
    closeModal();
    
    if (editingStation.value) {
      store.dispatch('template_play_success_file', 'Station updated successfully');
    } else {
      store.dispatch('template_play_success_file', 'Station created successfully');
    }
  } catch (error) {
    console.error('Failed to save station:', error);
    store.dispatch('template_play_error_file', 'Failed to save station');
  }
};

// Delete station
const deleteStation = async (station) => {
  if (confirm(`Are you sure you want to delete ${station.name}?`)) {
    try {
      await store.dispatch('delete_station', {
        id: station.id,
        data: {}
      });
      
      await fetchStations();
      store.dispatch('template_play_delete_file', 'Station deleted successfully');
    } catch (error) {
      console.error('Failed to delete station:', error);
      store.dispatch('template_play_error_file', 'Failed to delete station');
    }
  }
};

// Fetch stations
const fetchStations = async () => {
  let data = {
    per_page: 20
  }
  let page = currentPage.value
  try {
    await store.dispatch('fetch_stations', {
      data,
      page
    });
  } catch (error) {
    console.error('Failed to fetch stations:', error);
    store.dispatch('template_play_error_file', 'Failed to load stations');
  }
};

// Auto refresh recording status every 30 seconds
let statusInterval = null;

const startStatusPolling = () => {
  statusInterval = setInterval(async () => {
    if (stations.value.length > 0) {
      for (const station of stations.value) {
        if (recordingStatus.value[station.id]) {
          await checkStationRecordingStatus(station.id);
        }
      }
    }
  }, 30000); // 30 seconds
};

const stopStatusPolling = () => {
  if (statusInterval) {
    clearInterval(statusInterval);
    statusInterval = null;
  }
};

// Cleanup on unmount
onUnmounted(() => {
  if (audioElement) {
    audioElement.pause();
    audioElement = null;
  }
  stopStatusPolling();
});

// Initialize component
onMounted(async () => {
  await fetchStations();
  // Initial recording status check for all stations
  if (stations.value.length > 0) {
    setTimeout(() => {
      refreshAllRecordingStatus();
    }, 1000);
  }
  // Start polling for status updates
  startStatusPolling();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}

/* Custom scrollbar for recording list */
.max-h-24::-webkit-scrollbar {
  width: 4px;
}

.max-h-24::-webkit-scrollbar-track {
  background: transparent;
}

.max-h-24::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.max-h-24::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>