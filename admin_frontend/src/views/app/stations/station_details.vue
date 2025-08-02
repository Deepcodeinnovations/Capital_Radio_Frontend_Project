<template>
  <div class="space-y-6 p-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">Weekly Schedule</h1>
        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {{ stationSchedule?.station?.name }} - {{ stationSchedule?.station?.frequency }} FM
        </p>
      </div>
      
      <div class="flex items-center gap-3">
        <!-- Validation Status -->
        <div v-if="scheduleConflicts" class="flex items-center gap-2">
          <div v-if="scheduleConflicts.has_conflicts" class="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangleIcon class="h-4 w-4" />
            <span class="text-sm">{{ scheduleConflicts.total_issues }} Issues</span>
          </div>
          <div v-else class="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircleIcon class="h-4 w-4" />
            <span class="text-sm">Valid</span>
          </div>
        </div>

        <!-- Quick Actions -->
        <button 
          @click="validateSchedule" 
          :disabled="loading === 'validate_schedule'"
          class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm disabled:opacity-50"
        >
          <ShieldCheckIcon class="h-4 w-4" />
          Validate
        </button>
        
        <button 
          @click="showQuickAddModal = true" 
          class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
        >
          <PlusIcon class="h-4 w-4" />
          Quick Add
        </button>
        
        <button 
          @click="refreshSchedule" 
          :disabled="loading"
          class="bg-slate-600 hover:bg-slate-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm disabled:opacity-50"
        >
          <RefreshCwIcon :class="['h-4 w-4', loading ? 'animate-spin' : '']" />
        </button>
      </div>
    </div>

    <!-- Statistics Bar -->
    <div v-if="scheduleStatistics" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div class="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
        <div class="text-2xl font-bold text-slate-900 dark:text-white">{{ scheduleStatistics.total_sessions }}</div>
        <div class="text-sm text-slate-600 dark:text-slate-400">Total Sessions</div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
        <div class="text-2xl font-bold text-slate-900 dark:text-white">{{ scheduleStatistics.total_hours }}h</div>
        <div class="text-sm text-slate-600 dark:text-slate-400">Total Hours</div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
        <div class="text-2xl font-bold text-emerald-600">{{ scheduleStatistics.live_sessions }}</div>
        <div class="text-sm text-slate-600 dark:text-slate-400">Live Shows</div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
        <div class="text-2xl font-bold text-blue-600">{{ scheduleStatistics.repeat_sessions }}</div>
        <div class="text-sm text-slate-600 dark:text-slate-400">Repeats</div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
        <div class="text-lg font-bold text-slate-900 dark:text-white">{{ scheduleStatistics.busiest_day }}</div>
        <div class="text-sm text-slate-600 dark:text-slate-400">Busiest Day</div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
        <div class="text-lg font-bold text-slate-900 dark:text-white">{{ scheduleStatistics.quietest_day }}</div>
        <div class="text-sm text-slate-600 dark:text-slate-400">Quietest Day</div>
      </div>
    </div>

    <!-- Weekly Calendar Grid -->
    <div class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <!-- Days Header -->
      <div class="grid grid-cols-7 bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
        <div v-for="day in daysOfWeek" :key="day.key" 
          class="p-4 text-center border-r border-slate-200 dark:border-slate-600 last:border-r-0">
          <div class="font-semibold text-slate-900 dark:text-white">{{ day.name }}</div>
          <div class="text-sm text-slate-600 dark:text-slate-400">
            {{ getSessions(day.key).length }} sessions
          </div>
          <button 
            @click="clearDay(day.key)"
            v-if="getSessions(day.key).length > 0"
            class="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 mt-1"
          >
            Clear Day
          </button>
        </div>
      </div>

      <!-- Time Slots and Sessions -->
      <div class="grid grid-cols-7 min-h-[600px]">
        <div v-for="day in daysOfWeek" :key="day.key" 
          class="border-r border-slate-200 dark:border-slate-600 last:border-r-0 relative">
          
          <!-- Day Column -->
          <div class="p-2 space-y-2 min-h-full"
            @drop="handleDrop($event, day.key)"
            @dragover.prevent
            @dragenter.prevent>
            
            <!-- Sessions for this day -->
            <div v-for="(session, sessionIndex) in getSessions(day.key)" :key="sessionIndex"
              :class="[
                'bg-gradient-to-r rounded-lg p-3 cursor-move shadow-sm hover:shadow-md transition-all duration-200 border-l-4',
                getSessionColor(session),
                draggedSession?.day === day.key && draggedSession?.index === sessionIndex ? 'opacity-50' : ''
              ]"
              draggable="true"
              @dragstart="handleDragStart($event, day.key, sessionIndex, session)"
              @dragend="handleDragEnd"
              @click="editSession(day.key, sessionIndex, session)">
              
              <!-- Session Header -->
              <div class="flex justify-between items-start mb-2">
                <div class="flex-1 min-w-0">
                  <h4 class="font-semibold text-slate-900 dark:text-white truncate text-sm">
                    {{ getProgram(session.program_id)?.title || 'Unknown Program' }}
                  </h4>
                  <div class="text-xs text-slate-600 dark:text-slate-300">
                    {{ session.start_time }} - {{ session.end_time }}
                  </div>
                </div>
                
                <!-- Session Actions -->
                <div class="flex items-center gap-1 ml-2">
                  <button 
                    @click.stop="duplicateSession(day.key, sessionIndex)"
                    class="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-600"
                    title="Duplicate"
                  >
                    <CopyIcon class="h-3 w-3" />
                  </button>
                  <button 
                    @click.stop="deleteSession(day.key, sessionIndex)"
                    class="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-600"
                    title="Delete"
                  >
                    <TrashIcon class="h-3 w-3" />
                  </button>
                </div>
              </div>

              <!-- Session Details -->
              <div class="space-y-1">
                <div class="flex items-center gap-2 text-xs">
                  <MicIcon class="h-3 w-3" />
                  <span>Studio {{ session.studio }}</span>
                  
                  <div class="flex items-center gap-1 ml-auto">
                    <div v-if="session.is_live" class="w-2 h-2 bg-red-500 rounded-full" title="Live"></div>
                    <div v-if="session.is_repeat" class="w-2 h-2 bg-blue-500 rounded-full" title="Repeat"></div>
                  </div>
                </div>
                
                <!-- Hosts -->
                <div v-if="session.hosts && session.hosts.length > 0" class="flex flex-wrap gap-1">
                  <span v-for="hostId in session.hosts.slice(0, 2)" :key="hostId" 
                    class="inline-block px-2 py-0.5 bg-white/20 rounded text-xs">
                    {{ getHost(hostId)?.name || 'Unknown' }}
                  </span>
                  <span v-if="session.hosts.length > 2" class="text-xs text-slate-500">
                    +{{ session.hosts.length - 2 }} more
                  </span>
                </div>

                <!-- Notes -->
                <div v-if="session.notes" class="text-xs text-slate-600 dark:text-slate-300 truncate">
                  {{ session.notes }}
                </div>
              </div>
            </div>

            <!-- Add Session Button -->
            <button 
              @click="addSession(day.key)"
              class="w-full p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group"
            >
              <PlusIcon class="h-6 w-6 mx-auto text-slate-400 group-hover:text-emerald-500" />
              <div class="text-sm text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 mt-1">
                Add Session
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Session Editor Modal -->
    <div v-if="showSessionModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
            {{ editingSession ? 'Edit Session' : 'Add Session' }}
          </h3>
          <button @click="closeSessionModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <XIcon class="h-5 w-5" />
          </button>
        </div>
        
        <!-- Modal Content -->
        <div class="p-4 space-y-4">
          <!-- Program Selection -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Program *</label>
            <select 
              v-model="sessionForm.program_id" 
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
              required
            >
              <option value="">Select program...</option>
              <option v-for="program in availablePrograms" :key="program.id" :value="program.id">
                {{ program.title }}
              </option>
            </select>
          </div>

          <!-- Time -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time *</label>
              <input 
                type="time" 
                v-model="sessionForm.start_time" 
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Time *</label>
              <input 
                type="time" 
                v-model="sessionForm.end_time" 
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                required
              />
            </div>
          </div>

          <!-- Studio and Options -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Studio</label>
              <select 
                v-model="sessionForm.studio" 
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
              >
                <option value="A">Studio A</option>
                <option value="B">Studio B</option>
                <option value="C">Studio C</option>
                <option value="D">Studio D</option>
              </select>
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="sessionForm.is_live" 
                  class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                />
                <label class="ml-2 text-sm text-slate-700 dark:text-slate-300">Live</label>
              </div>
              
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="sessionForm.is_repeat" 
                  class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                />
                <label class="ml-2 text-sm text-slate-700 dark:text-slate-300">Repeat</label>
              </div>
            </div>
          </div>

          <!-- Hosts Selection -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hosts</label>
            <div class="border border-slate-300 dark:border-slate-600 rounded-lg p-3 space-y-2">
              <!-- Selected Hosts -->
              <div v-if="sessionForm.hosts.length > 0" class="flex flex-wrap gap-1 mb-2">
                <span v-for="hostId in sessionForm.hosts" :key="hostId" 
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                  {{ getHost(hostId)?.name }}
                  <button @click="removeHost(hostId)" class="ml-1 hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-full p-0.5">
                    <XIcon class="h-3 w-3" />
                  </button>
                </span>
              </div>
              
              <!-- Add Host -->
              <select 
                v-model="selectedHostToAdd" 
                @change="addHost"
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
              >
                <option value="">Add host...</option>
                <option v-for="host in availableHosts" :key="host.id" :value="host.id">
                  {{ host.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
            <textarea 
              v-model="sessionForm.notes" 
              rows="2" 
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
              placeholder="Session notes..."
            ></textarea>
          </div>
        </div>
        
        <!-- Modal Footer -->
        <div class="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
          <button 
            @click="closeSessionModal" 
            class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="saveSession" 
            :disabled="!isSessionFormValid || saving"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-sm font-medium disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <LoaderIcon v-if="saving" class="h-4 w-4 animate-spin" />
            {{ editingSession ? 'Update' : 'Add' }} Session
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Add Modal -->
    <div v-if="showQuickAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
        <div class="p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Quick Actions</h3>
        </div>
        
        <div class="p-4 space-y-3">
          <button 
            @click="duplicateToAllDays"
            class="w-full p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <div class="font-medium text-slate-900 dark:text-white">Duplicate Monday to All Days</div>
            <div class="text-sm text-slate-600 dark:text-slate-400">Copy Monday's schedule to all other days</div>
          </button>
          
          <button 
            @click="clearAllDays"
            class="w-full p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <div class="font-medium text-red-600 dark:text-red-400">Clear All Days</div>
            <div class="text-sm text-slate-600 dark:text-slate-400">Remove all sessions from schedule</div>
          </button>
          
          <button 
            @click="backupSchedule"
            class="w-full p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <div class="font-medium text-slate-900 dark:text-white">Backup Schedule</div>
            <div class="text-sm text-slate-600 dark:text-slate-400">Create a backup of current schedule</div>
          </button>
        </div>
        
        <div class="p-4 border-t border-slate-200 dark:border-slate-700">
          <button 
            @click="showQuickAddModal = false" 
            class="w-full px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import {
  Plus as PlusIcon,
  X as XIcon,
  Loader as LoaderIcon,
  Mic as MicIcon,
  Copy as CopyIcon,
  Trash as TrashIcon,
  RefreshCw as RefreshCwIcon,
  CheckCircle as CheckCircleIcon,
  AlertTriangle as AlertTriangleIcon,
  ShieldCheck as ShieldCheckIcon
} from 'lucide-vue-next';

const store = useStore();
const route = useRoute();

// Get station ID from route
const stationId = computed(() => route.params.id);

// Computed properties from store
const stationSchedule = computed(() => store.getters.stationSchedule);
const scheduleConflicts = computed(() => store.getters.scheduleConflicts);
const scheduleStatistics = computed(() => store.getters.scheduleStatistics);
const loading = computed(() => store.getters.loading);
const programs = computed(() => store.getters.programs);
const hosts = computed(() => store.getters.hosts);

// Days of week configuration
const daysOfWeek = [
  { key: 'sunday', name: 'Sunday' },
  { key: 'monday', name: 'Monday' },
  { key: 'tuesday', name: 'Tuesday' },
  { key: 'wednesday', name: 'Wednesday' },
  { key: 'thursday', name: 'Thursday' },
  { key: 'friday', name: 'Friday' },
  { key: 'saturday', name: 'Saturday' }
];

// Modal states
const showSessionModal = ref(false);
const showQuickAddModal = ref(false);
const editingSession = ref(null);
const editingDay = ref('');
const editingIndex = ref(-1);
const saving = ref(false);
const selectedHostToAdd = ref('');

// Drag and drop state
const draggedSession = ref(null);

// Session form
const sessionForm = ref({
  program_id: '',
  start_time: '',
  end_time: '',
  studio: 'A',
  is_live: true,
  is_repeat: false,
  hosts: [],
  notes: ''
});

// Computed properties
const availablePrograms = computed(() => programs.value?.data || []);
const availableHosts = computed(() => {
  return (hosts.value?.data || []).filter(host => !sessionForm.value.hosts.includes(host.id));
});

const isSessionFormValid = computed(() => {
  return sessionForm.value.program_id && 
         sessionForm.value.start_time && 
         sessionForm.value.end_time &&
         sessionForm.value.start_time < sessionForm.value.end_time;
});

// Helper functions
const getSessions = (day) => {
  return stationSchedule.value?.sessions?.[day] || [];
};

const getProgram = (programId) => {
  return availablePrograms.value.find(p => p.id === programId);
};

const getHost = (hostId) => {
  return (hosts.value?.data || []).find(h => h.id === hostId);
};

const getSessionColor = (session) => {
  if (session.is_live) {
    return 'from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20 border-red-500';
  } else if (session.is_repeat) {
    return 'from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 border-blue-500';
  } else {
    return 'from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20 border-emerald-500';
  }
};

// Session management
const addSession = (day) => {
  editingSession.value = null;
  editingDay.value = day;
  editingIndex.value = -1;
  resetSessionForm();
  showSessionModal.value = true;
};

const editSession = (day, index, session) => {
  editingSession.value = session;
  editingDay.value = day;
  editingIndex.value = index;
  
  sessionForm.value = {
    program_id: session.program_id,
    start_time: session.start_time,
    end_time: session.end_time,
    studio: session.studio || 'A',
    is_live: session.is_live || false,
    is_repeat: session.is_repeat || false,
    hosts: session.hosts || [],
    notes: session.notes || ''
  };
  
  showSessionModal.value = true;
};

const saveSession = async () => {
  saving.value = true;
  
  try {
    if (editingSession.value) {
      // Update existing session
      await store.dispatch('update_session', {
        stationId: stationId.value,
        day: editingDay.value,
        sessionIndex: editingIndex.value,
        sessionData: sessionForm.value
      });
    } else {
      // Add new session
      await store.dispatch('add_session_to_day', {
        stationId: stationId.value,
        day: editingDay.value,
        sessionData: sessionForm.value
      });
    }
    
    closeSessionModal();
    await refreshData();
    store.dispatch('template_play_success_file', 'Session saved successfully');
  } catch (error) {
    console.error('Failed to save session:', error);
    store.dispatch('template_play_error_file', 'Failed to save session');
  } finally {
    saving.value = false;
  }
};

const deleteSession = async (day, index) => {
  if (confirm('Are you sure you want to delete this session?')) {
    try {
      await store.dispatch('remove_session', {
        stationId: stationId.value,
        day,
        sessionIndex: index
      });
      
      await refreshData();
      store.dispatch('template_play_delete_file', 'Session deleted successfully');
    } catch (error) {
      console.error('Failed to delete session:', error);
      store.dispatch('template_play_error_file', 'Failed to delete session');
    }
  }
};

const duplicateSession = async (day, index) => {
  const session = getSessions(day)[index];
  if (!session) return;
  
  try {
    await store.dispatch('add_session_to_day', {
      stationId: stationId.value,
      day,
      sessionData: { ...session }
    });
    
    await refreshData();
    store.dispatch('template_play_success_file', 'Session duplicated successfully');
  } catch (error) {
    console.error('Failed to duplicate session:', error);
    store.dispatch('template_play_error_file', 'Failed to duplicate session');
  }
};

const clearDay = async (day) => {
  if (confirm(`Are you sure you want to clear all sessions from ${day}?`)) {
    try {
      await store.dispatch('clear_day_schedule', {
        stationId: stationId.value,
        day
      });
      
      await refreshData();
      store.dispatch('template_play_delete_file', `${day} schedule cleared`);
    } catch (error) {
      console.error('Failed to clear day:', error);
      store.dispatch('template_play_error_file', 'Failed to clear day');
    }
  }
};


const handleDragStart = (event, day, index, session) => {
  draggedSession.value = { day, index, session };
  event.dataTransfer.effectAllowed = 'move';
};

const handleDragEnd = () => {
  draggedSession.value = null;
};

const handleDrop = async (event, targetDay) => {
  event.preventDefault();
  
  if (!draggedSession.value) return;
  
  const { day: sourceDay, index: sourceIndex, session } = draggedSession.value;
  
  // Don't do anything if dropped on same day
  if (sourceDay === targetDay) {
    draggedSession.value = null;
    return;
  }
  
  try {
    // Remove from source day
    await store.dispatch('remove_session', {
      stationId: stationId.value,
      day: sourceDay,
      sessionIndex: sourceIndex
    });
    
    // Add to target day
    await store.dispatch('add_session_to_day', {
      stationId: stationId.value,
      day: targetDay,
      sessionData: { ...session }
    });
    
    await refreshData();
    store.dispatch('template_play_success_file', `Session moved to ${targetDay}`);
  } catch (error) {
    console.error('Failed to move session:', error);
    store.dispatch('template_play_error_file', 'Failed to move session');
  }
  
  draggedSession.value = null;
};

// Host management
const addHost = () => {
  if (selectedHostToAdd.value && !sessionForm.value.hosts.includes(selectedHostToAdd.value)) {
    sessionForm.value.hosts.push(selectedHostToAdd.value);
    selectedHostToAdd.value = '';
  }
};

const removeHost = (hostId) => {
  sessionForm.value.hosts = sessionForm.value.hosts.filter(id => id !== hostId);
};

// Modal management
const closeSessionModal = () => {
  showSessionModal.value = false;
  editingSession.value = null;
  editingDay.value = '';
  editingIndex.value = -1;
  resetSessionForm();
};

const resetSessionForm = () => {
  sessionForm.value = {
    program_id: '',
    start_time: '',
    end_time: '',
    studio: 'A',
    is_live: true,
    is_repeat: false,
    hosts: [],
    notes: ''
  };
  selectedHostToAdd.value = '';
};

// Quick actions
const duplicateToAllDays = async () => {
  if (!confirm('This will replace all other days with Monday\'s schedule. Continue?')) {
    return;
  }
  
  try {
    const mondaySessions = getSessions('monday');
    const newSessions = { ...stationSchedule.value.sessions };
    
    // Copy Monday to all other days
    daysOfWeek.forEach(day => {
      if (day.key !== 'monday') {
        newSessions[day.key] = [...mondaySessions];
      }
    });
    
    await store.dispatch('update_station_schedule', {
      stationId: stationId.value,
      sessions: newSessions
    });
    
    showQuickAddModal.value = false;
    await refreshData();
    store.dispatch('template_play_success_file', 'Schedule duplicated to all days');
  } catch (error) {
    console.error('Failed to duplicate schedule:', error);
    store.dispatch('template_play_error_file', 'Failed to duplicate schedule');
  }
};

const clearAllDays = async () => {
  if (!confirm('This will clear ALL sessions from the schedule. This cannot be undone!')) {
    return;
  }
  
  try {
    const emptySessions = {
      sunday: [],
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: []
    };
    
    await store.dispatch('update_station_schedule', {
      stationId: stationId.value,
      sessions: emptySessions
    });
    
    showQuickAddModal.value = false;
    await refreshData();
    store.dispatch('template_play_delete_file', 'All sessions cleared');
  } catch (error) {
    console.error('Failed to clear all days:', error);
    store.dispatch('template_play_error_file', 'Failed to clear schedule');
  }
};

const backupSchedule = async () => {
  try {
    await store.dispatch('backup_schedule', {
      stationId: stationId.value
    });
    
    showQuickAddModal.value = false;
    store.dispatch('template_play_success_file', 'Schedule backup created');
  } catch (error) {
    console.error('Failed to backup schedule:', error);
    store.dispatch('template_play_error_file', 'Failed to create backup');
  }
};

// Validation and data refresh
const validateSchedule = async () => {
  try {
    await store.dispatch('validate_schedule', {
      stationId: stationId.value
    });
    
    // Also get conflicts
    await store.dispatch('get_schedule_conflicts', {
      stationId: stationId.value
    });
    
    store.dispatch('template_play_success_file', 'Schedule validation completed');
  } catch (error) {
    console.error('Failed to validate schedule:', error);
    store.dispatch('template_play_error_file', 'Failed to validate schedule');
  }
};

const refreshSchedule = async () => {
  await refreshData();
  store.dispatch('template_play_success_file', 'Schedule refreshed');
};

const refreshData = async () => {
  try {
    await Promise.all([
      store.dispatch('get_station_schedule', { stationId: stationId.value }),
      store.dispatch('get_schedule_conflicts', { stationId: stationId.value }),
      store.dispatch('get_schedule_statistics', { stationId: stationId.value })
    ]);
  } catch (error) {
    console.error('Failed to refresh data:', error);
  }
};

// Auto-save functionality
let autoSaveTimeout = null;

const scheduleAutoSave = () => {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }
  
  autoSaveTimeout = setTimeout(async () => {
    try {
      await store.dispatch('update_station_schedule', {
        stationId: stationId.value,
        sessions: stationSchedule.value.sessions
      });
      
      console.log('Auto-saved schedule');
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, 4000); // Auto-save after 2 seconds of inactivity
};

// Fetch initial data
const fetchInitialData = async () => {
  try {
    await Promise.all([
      // Fetch schedule data
      store.dispatch('get_station_schedule', { stationId: stationId.value }),
      store.dispatch('get_schedule_conflicts', { stationId: stationId.value }),
      store.dispatch('get_schedule_statistics', { stationId: stationId.value }),
      
      // Fetch reference data
      store.dispatch('fetch_programs', { data: { per_page: 100 }, page: 1 }),
      store.dispatch('fetch_hosts', { data: { per_page: 100 }, page: 1 })
    ]);
  } catch (error) {
    console.error('Failed to fetch initial data:', error);
    store.dispatch('template_play_error_file', 'Failed to load schedule data');
  }
};

// Keyboard shortcuts
const handleKeydown = (event) => {
  // Ctrl/Cmd + S to save (if modal is open)
  if ((event.ctrlKey || event.metaKey) && event.key === 's' && showSessionModal.value) {
    event.preventDefault();
    if (isSessionFormValid.value && !saving.value) {
      saveSession();
    }
  }
  
  // Escape to close modals
  if (event.key === 'Escape') {
    if (showSessionModal.value) {
      closeSessionModal();
    } else if (showQuickAddModal.value) {
      showQuickAddModal.value = false;
    }
  }
  
  // Ctrl/Cmd + R to refresh
  if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
    event.preventDefault();
    refreshSchedule();
  }
};

// Lifecycle
onMounted(async () => {
  await fetchInitialData();
  
  // Add keyboard shortcuts
  document.addEventListener('keydown', handleKeydown);
});

// Cleanup
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }
});

// Watch for changes to trigger auto-save
watch(() => stationSchedule.value?.sessions, () => {
  scheduleAutoSave();
}, { deep: true });

// Time utilities
const formatTime = (timeString) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const time = new Date();
  time.setHours(parseInt(hours), parseInt(minutes));
  return time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;
  
  return endTotalMinutes - startTotalMinutes;
};

// Session conflict detection
const hasTimeConflict = (day, newSession, excludeIndex = -1) => {
  const daySessions = getSessions(day);
  
  return daySessions.some((session, index) => {
    if (index === excludeIndex) return false;
    
    const sessionStart = session.start_time;
    const sessionEnd = session.end_time;
    const newStart = newSession.start_time;
    const newEnd = newSession.end_time;
    
    return (newStart < sessionEnd) && (sessionStart < newEnd);
  });
};

</script>
