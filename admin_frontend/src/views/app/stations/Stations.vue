<template>
  <div class="min-h-screen  p-6">
    <!-- Header Section -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div class="space-y-2">
          <h1 class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Radio Stations
          </h1>
          <p class="text-gray-600 dark:text-gray-400">Manage your radio stations and recordings in real-time</p>
          <div class="flex items-center gap-4 text-sm">
            <div class="flex items-center gap-2">
              <div :class="[
                'w-2 h-2 rounded-full',
                recordingServiceStatus?.service_running ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              ]"></div>
              <span class="text-gray-500 dark:text-gray-400">
                Recording Service: {{ recordingServiceStatus?.service_running ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="flex items-center gap-2">
              <RadioIcon class="w-4 h-4 text-purple-600" />
              <span class="text-gray-500 dark:text-gray-400">{{ stations?.length || 0 }} stations</span>
            </div>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-3">
          <button 
            @click="refreshAllRecordingStatus"
            :disabled="loadingRecordingStatus"
            class="flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700"
          >
            <LoaderIcon v-if="loadingRecordingStatus" class="w-5 h-5 mr-2 animate-spin" />
            <RadioIcon v-else class="w-5 h-5 mr-2" />
            {{ loadingRecordingStatus ? 'Checking...' : 'Check All Recording Status' }}
          </button>
          
          <button 
            @click="showAddStationModal = true" 
            :disabled="loading === 'create_station'"
            class="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50"
          >
            <LoaderIcon v-if="loading === 'create_station'" class="w-5 h-5 mr-2 animate-spin" />
            <PlusIcon v-else class="w-5 h-5 mr-2" />
            {{ loading === 'create_station' ? 'Creating...' : 'Add Station' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Service Status Overview Card -->
    <div class="mb-6">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">
              {{ recordingServiceStatus?.total_stations || 0 }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Total Stations</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ recordingServiceStatus?.active_recordings || 0 }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Active Recordings</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ stations?.filter(s => s.streaming_status === 'live').length || 0 }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Live Stations</div>
          </div>
          <div class="text-center">
            <div :class="[
              'text-2xl font-bold',
              recordingServiceStatus?.service_running ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            ]">
              {{ recordingServiceStatus?.service_running ? 'Online' : 'Offline' }}
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Service Status</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stations Grid -->
    <div v-if="loading === 'fetch_stations'" class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Skeleton Loading Cards -->
      <div v-for="n in 4" :key="`skeleton-${n}`" class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-6 animate-pulse">
        <div class="h-32 bg-gray-200 dark:bg-gray-600 rounded-xl mb-4"></div>
        <div class="space-y-3">
          <div class="h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded"></div>
          <div class="h-3 w-full bg-gray-200 dark:bg-gray-600 rounded"></div>
          <div class="h-3 w-2/3 bg-gray-200 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Actual Stations Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      <div v-for="station in stations" :key="station.id" 
           class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
        
        <!-- Station Header -->
        <div class="p-6 border-b border-gray-100 dark:border-slate-700 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-slate-700 dark:to-slate-600">
          <div class="flex items-center justify-between mb-4">
            <router-link :to="{ name: 'StationDetails', params: { id: station.id } }" class="flex items-center">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mr-4 shadow-lg">
                {{ station.name.substring(0, 2).toUpperCase() }}
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ station.name }}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ station.frequency }} FM</p>
              </div>
            </router-link>
            
            <!-- Streaming Status Badge -->
            <span :class="[
              'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm',
              station.streaming_status === 'live' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                : station.streaming_status === 'offline'
                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
            ]">
              <div :class="[
                'w-2 h-2 rounded-full mr-2',
                station.streaming_status === 'live' ? 'bg-green-500 animate-pulse' : 
                station.streaming_status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
              ]"></div>
              {{ station.streaming_status?.charAt(0).toUpperCase() + station.streaming_status?.slice(1) }}
            </span>
          </div>
          
          <p class="text-gray-700 dark:text-gray-300 font-medium">{{ station.tagline }}</p>
        </div>

        <!-- Station Content -->
        <div class="p-6 space-y-6">
          
          <!-- Basic Stats -->
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3">
              <p class="text-xl font-bold text-gray-900 dark:text-white">{{ station.listeners?.toLocaleString() || '0' }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Listeners</p>
            </div>
            <div class="text-center bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3">
              <p class="text-xl font-bold text-red-600 dark:text-red-400">
                {{ getStationRecordingCount(station.id, 'active') }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Recording</p>
            </div>
            <div class="text-center bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3">
              <p class="text-xl font-bold text-blue-600 dark:text-blue-400">
                {{ getStationRecordingCount(station.id, 'total') }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Total Tasks</p>
            </div>
          </div>

          <!-- Audio Player (if live) -->
          <div v-if="station.streaming_link && station.streaming_status === 'live'" 
               class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-700 dark:to-slate-600 rounded-xl p-4">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <RadioIcon class="w-4 h-4" />
                Live Stream
              </span>
              <div class="flex items-center gap-2">
                <VolumeXIcon v-if="currentStation?.id === station.id && isMuted" class="w-4 h-4 text-gray-400" />
                <Volume2Icon v-else-if="currentStation?.id === station.id && !isMuted" class="w-4 h-4 text-blue-500" />
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <button 
                @click="togglePlay(station)"
                :disabled="audioLoading === station.id"
                class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white p-3 rounded-xl disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <LoaderIcon v-if="audioLoading === station.id" class="w-4 h-4 animate-spin" />
                <PauseIcon v-else-if="currentStation?.id === station.id && isPlaying" class="w-4 h-4" />
                <PlayIcon v-else class="w-4 h-4" />
              </button>
              
              <div class="flex-1 bg-white dark:bg-slate-600 rounded-full h-2 shadow-inner">
                <div 
                  v-if="currentStation?.id === station.id" 
                  class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${volume}%` }"
                ></div>
              </div>
              
              <button 
                v-if="currentStation?.id === station.id"
                @click="toggleMute"
                class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-white/50"
              >
                <VolumeXIcon v-if="isMuted" class="w-4 h-4" />
                <Volume2Icon v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Recording Status Section -->
          <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-700 dark:to-slate-600 rounded-xl p-4">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <MicIcon class="w-4 h-4" />
                Recording Control
              </h4>
              <button 
                @click="checkStationRecordingStatus(station.id)"
                :disabled="loadingStationStatus[station.id]"
                class="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 transition-colors"
              >
                <LoaderIcon v-if="loadingStationStatus[station.id]" class="w-3 h-3 animate-spin" />
                <RefreshCwIcon v-else class="w-3 h-3" />
                Refresh
              </button>
            </div>

            <!-- Recording Status Display -->
            <div v-if="getStationRecordingData(station.id)" class="space-y-3">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-700 dark:text-gray-300">Task Status:</span>
                <span :class="[
                  'font-medium px-2 py-1 rounded-full text-xs',
                  getStationRecordingData(station.id).task_running 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                ]">
                  {{ getStationRecordingData(station.id).task_running ? 'RUNNING' : 'STOPPED' }}
                </span>
              </div>
              
              <!-- Active Recordings List -->
              <div v-if="getStationRecordingData(station.id).recordings?.length" class="mt-3">
                <p class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Active Recordings:</p>
                <div class="space-y-2 max-h-32 overflow-y-auto">
                  <div 
                    v-for="recording in getStationRecordingData(station.id).recordings" 
                    :key="recording"
                    class="flex items-center justify-between text-xs bg-white dark:bg-slate-600 rounded-lg p-3 shadow-sm"
                  >
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span class="font-mono text-gray-800 dark:text-gray-200">{{ recording }}</span>
                    </div>
                    <button 
                      @click="stopStationRecording(station.id, recording)"
                      :disabled="loadingRecordingAction[`${station.id}_${recording}`]"
                      class="text-red-600 hover:text-red-700 disabled:opacity-50 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <StopCircleIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Recording Actions -->
              <div class="grid grid-cols-2 gap-2 mt-4">
                <button 
                  @click="startStationRecording(station.id)"
                  :disabled="loadingRecordingAction[`start_${station.id}`] || getStationRecordingData(station.id)?.task_running"
                  class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xs px-3 py-2 rounded-lg flex items-center justify-center gap-1 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <LoaderIcon v-if="loadingRecordingAction[`start_${station.id}`]" class="w-3 h-3 animate-spin" />
                  <PlayCircleIcon v-else class="w-3 h-3" />
                  Start Recording
                </button>
                
                <button 
                  @click="stopAllStationRecordings(station.id)"
                  :disabled="loadingRecordingAction[`stop_${station.id}`] || !getStationRecordingData(station.id)?.task_running"
                  class="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white text-xs px-3 py-2 rounded-lg flex items-center justify-center gap-1 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <LoaderIcon v-if="loadingRecordingAction[`stop_${station.id}`]" class="w-3 h-3 animate-spin" />
                  <StopCircleIcon v-else class="w-3 h-3" />
                  Stop All
                </button>
              </div>
            </div>
            
            <!-- No recording status -->
            <div v-else class="text-center py-4">
              <p class="text-sm text-gray-500 dark:text-gray-400">No recording status available</p>
              <button 
                @click="checkStationRecordingStatus(station.id)"
                class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 mt-2 font-medium"
              >
                Check Status
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
            <div class="flex items-center gap-3">
              <a 
                v-if="station.access_link" 
                :href="station.access_link" 
                target="_blank"
                class="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <ExternalLinkIcon class="w-4 h-4" />
              </a>
            </div>
            
            <div class="flex items-center gap-2">
              <button 
                @click="editStation(station)" 
                :disabled="loading === 'update_station'"
                class="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-gray-500 to-slate-600 text-white hover:from-gray-600 hover:to-slate-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <EditIcon class="w-4 h-4" />
              </button>
              <button 
                @click="deleteStation(station)" 
                :disabled="loading === 'delete_station'"
                class="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Station Modal -->
    <div v-if="showAddStationModal || editingStation" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 dark:border-slate-700">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ editingStation ? 'Edit Station' : 'Add New Station' }}
            </h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700">
              <XIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Station Name</label>
              <input 
                type="text" 
                v-model="stationForm.name" 
                class="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-all" 
                placeholder="Enter station name" 
              />
            </div>
            
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Frequency</label>
              <input 
                type="text" 
                v-model="stationForm.frequency" 
                class="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-all" 
                placeholder="e.g. 98.5" 
              />
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Listeners</label>
              <input 
                type="number" 
                v-model="stationForm.listeners" 
                class="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-all" 
                placeholder="10000" 
              />
            </div>
            
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Streaming Status</label>
              <select 
                v-model="stationForm.streaming_status" 
                class="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-all"
              >
                <option value="live">Live</option>
                <option value="offline">Offline</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Tagline</label>
            <input 
              type="text" 
              v-model="stationForm.tagline" 
              class="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-all" 
              placeholder="Station tagline" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Access Link</label>
            <input 
              type="url" 
              v-model="stationForm.access_link" 
              class="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-all" 
              placeholder="https://example.com" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Streaming Link</label>
            <input 
              type="url" 
              v-model="stationForm.streaming_link" 
              class="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-all" 
              placeholder="https://stream.example.com/live" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">About Station</label>
            <textarea 
              v-model="stationForm.about" 
              rows="3" 
              class="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white transition-all" 
              placeholder="Describe the station..."
            ></textarea>
          </div>
          
          <div class="flex items-center">
            <input 
              type="checkbox" 
              v-model="stationForm.radio_access_status" 
              class="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-slate-600 rounded"
            />
            <label class="ml-3 text-sm text-gray-700 dark:text-gray-300">Enable Radio Access</label>
          </div>
        </div>
        
        <div class="p-6 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3">
          <button 
            @click="closeModal" 
            class="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="saveStation" 
            :disabled="loading === 'create_station' || loading === 'update_station'"
            class="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl text-sm font-medium disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span v-if="loading === 'create_station' || loading === 'update_station'">
              {{ editingStation ? 'Updating...' : 'Creating...' }}
            </span>
            <span v-else>
              {{ editingStation ? 'Update Station' : 'Create Station' }}
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
const RecordingStatus = computed(() => store.getters.recordingStatus);

// Modal states
const showAddStationModal = ref(false);
const editingStation = ref(null);
const currentPage = ref(1);

// Recording states
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

// Helper functions for recording data
const getStationRecordingData = (stationId) => {
  return RecordingStatus.value?.stations?.[stationId] || null;
};

const getStationRecordingCount = (stationId, type) => {
  const data = getStationRecordingData(stationId);
  if (!data) return 0;
  
  if (type === 'active') {
    return data.recordings?.length || 0;
  } else if (type === 'total') {
    return data.recordings?.length || 0;
  }
  return 0;
};

const isStationRecording = (stationId) => {
  const data = getStationRecordingData(stationId);
  return data?.task_running || false;
};

// Recording API functions
const getRecordingServiceStatus = async () => {
  try {
    await store.dispatch('get_recording_status');
  } catch (error) {
    console.error('Failed to get recording service status:', error);
  }
};

const checkStationRecordingStatus = async (stationId) => {
  loadingStationStatus.value[stationId] = true;
  try {
    await getRecordingServiceStatus();
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
    await getRecordingServiceStatus();
    store.dispatch('template_play_success_file', 'Recording status refreshed');
  } catch (error) {
    console.error('Failed to refresh recording status:', error);
    store.dispatch('template_play_error_file', 'Failed to refresh recording status');
  } finally {
    loadingRecordingStatus.value = false;
  }
};

const startStationRecording = async (stationId) => {
  loadingRecordingAction.value[`start_${stationId}`] = true;
  try {
    await store.dispatch('start_recording_sessions');
    store.dispatch('template_play_success_file', 'Recording started successfully');
    await checkStationRecordingStatus(stationId);
  } catch (error) {
    console.error('Failed to start recording:', error);
    store.dispatch('template_play_error_file', 'Failed to start recording');
  } finally {
    loadingRecordingAction.value[`start_${stationId}`] = false;
  }
};

const stopAllStationRecordings = async (stationId) => {
  if (!confirm('Are you sure you want to stop all recordings for this station?')) return;
  
  loadingRecordingAction.value[`stop_${stationId}`] = true;
  try {
    await store.dispatch('stop_recording_sessions');
    store.dispatch('template_play_delete_file', 'All recordings stopped');
    await checkStationRecordingStatus(stationId);
  } catch (error) {
    console.error('Failed to stop recordings:', error);
    store.dispatch('template_play_error_file', 'Failed to stop recordings');
  } finally {
    loadingRecordingAction.value[`stop_${stationId}`] = false;
  }
};

const stopStationRecording = async (stationId, recordingId) => {
  loadingRecordingAction.value[`${stationId}_${recordingId}`] = true;
  try {
    // This would need a specific API endpoint for stopping individual recordings
    await store.dispatch('stop_recording', { recording_id: recordingId });
    store.dispatch('template_play_success_file', 'Recording stopped');
    await checkStationRecordingStatus(stationId);
  } catch (error) {
    console.error('Failed to stop recording:', error);
    store.dispatch('template_play_error_file', 'Failed to stop recording');
  } finally {
    loadingRecordingAction.value[`${stationId}_${recordingId}`] = false;
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

// Auto refresh recording status every 60 seconds
let statusInterval = null;

const startStatusPolling = () => {
  statusInterval = setInterval(async () => {
    if (stations.value.length > 0) {
      await getRecordingServiceStatus();
    }
  }, 60000); // 60 seconds
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
  await getRecordingServiceStatus();
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

/* Custom scrollbar for recording list */
.max-h-32::-webkit-scrollbar {
  width: 4px;
}

.max-h-32::-webkit-scrollbar-track {
  background: transparent;
}

.max-h-32::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.max-h-32::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>