<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">Radio Programs</h1>
        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Create and manage your radio programs</p>
      </div>
      
      <div class="flex items-center gap-3">
        <button 
          @click="showAddProgramModal = true" 
          :disabled="loading === 'create_program'"
          class="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium disabled:opacity-50"
        >
          <LoaderIcon v-if="loading === 'create_program'" class="h-4 w-4 animate-spin" />
          <PlusIcon v-else class="h-4 w-4" />
          {{ loading === 'create_program' ? 'Creating...' : 'Create Program' }}
        </button>
      </div>
    </div>

    <!-- Programs Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Skeleton Loading Cards -->
      <div v-if="loading === 'fetch_programs'" v-for="n in 6" :key="`skeleton-${n}`" class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
        <div class="flex items-center mb-4">
          <div class="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 mr-3"></div>
          <div class="space-y-2">
            <div class="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div class="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
        <div class="space-y-3">
          <div class="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div class="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div class="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div class="flex justify-between items-center mt-4">
            <div class="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            <div class="flex gap-2">
              <div class="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div class="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actual Program Cards -->
      <div v-else v-for="program in programs.data" :key="program.id" class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow">
        <div class="p-6">
          <div class="flex items-center mb-4">
            <div class="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-lg mr-3">
              <RadioIcon class="h-6 w-6" />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{{ program.title }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ program.type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) }}</p>
            </div>
          </div>

          <!-- Station Info -->
          <div class="flex items-center text-sm text-slate-600 dark:text-slate-400 mb-3">
            <MapPinIcon class="h-4 w-4 mr-1" />
            {{ program.station?.name }} - {{ program.station?.frequency }} FM
          </div>

          <!-- Duration -->
          <div class="flex items-center text-sm text-slate-600 dark:text-slate-400 mb-3">
            <ClockIcon class="h-4 w-4 mr-1" />
            {{ formatDuration(program.duration) }} program
          </div>

          <!-- Studio Info -->
          <div class="flex items-center text-sm text-slate-600 dark:text-slate-400 mb-4">
            <MicIcon class="h-4 w-4 mr-1" />
            Studio {{ program.studio }}
          </div>

          <!-- Hosts Pills -->
          <div v-if="program.hosts && program.hosts.length > 0" class="mb-4">
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-2">Hosts:</p>
            <div class="flex flex-wrap gap-1">
              <span v-for="host in program.hosts" :key="host.id" 
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
              >
                {{ host.name }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <p v-if="program.description" class="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">{{ program.description }}</p>

          <!-- Status and Actions -->
          <div class="flex items-center justify-between">
            <button 
              @click="toggleProgramStatus(program)"
              :disabled="loading === 'toggle_program_status'"
              :class="[
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium disabled:opacity-50 transition-colors',
                program.status == 1 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50' 
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
              ]"
            >
              <LoaderIcon v-if="loading === 'toggle_program_status'" class="w-3 h-3 mr-1.5 animate-spin" />
              <div v-else
                :class="[
                  'w-1.5 h-1.5 rounded-full mr-1.5',
                  program.status == 1 ? 'bg-green-500' : 'bg-slate-400'
                ]"
              ></div>
              {{ program.status == 1 ? 'Active' : 'Inactive' }}
            </button>
            
            <div class="flex items-center gap-1">
              <button 
                @click="editProgram(program)" 
                :disabled="loading === 'update_program'"
                class="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 disabled:opacity-50 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <EditIcon class="h-4 w-4" />
              </button>
              <button 
                @click="deleteProgram(program)" 
                :disabled="loading === 'delete_program'"
                class="text-slate-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <TrashIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Program Modal -->
    <div v-if="showAddProgramModal || editingProgram" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col">
        <!-- Fixed Header -->
        <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              {{ editingProgram ? 'Edit Program' : 'Create New Program' }}
            </h2>
            <button @click="closeModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <XIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          <!-- Program Image Upload -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Program Image</label>
            <div class="flex items-center gap-4">
              <!-- Image Preview -->
              <div class="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 overflow-hidden">
                <img v-if="imagePreview" :src="imagePreview" alt="Preview" class="w-full h-full object-cover rounded-lg" />
                <ImageIcon v-else class="h-8 w-8 text-slate-400" />
              </div>
              
              <!-- Upload Button -->
              <div class="flex-1">
                <input 
                  type="file" 
                  ref="imageInput"
                  @change="handleImageUpload"
                  accept="image/*"
                  class="hidden"
                />
                <button 
                  @click="$refs.imageInput.click()"
                  type="button"
                  class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <UploadIcon class="h-4 w-4" />
                  Choose Image
                </button>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">JPG, PNG up to 2MB</p>
              </div>
            </div>
          </div>

          <!-- Program Title -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Program Title *</label>
            <input 
              type="text" 
              v-model="programForm.title" 
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm" 
              placeholder="e.g., Morning Vibes, Capital Jazz Hour"
              required
            />
          </div>

          <!-- Station and Duration -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Station *</label>
              <select 
                v-model="programForm.station_id" 
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                required
              >
                <option value="">Choose station...</option>
                <option v-for="station in stations" :key="station.id" :value="station.id">
                  {{ station.name }} FM
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duration (min) *</label>
              <input 
                type="number" 
                v-model="programForm.duration" 
                min="1" 
                max="480"
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm" 
                placeholder="60"
                required
              />
            </div>
          </div>

          <!-- Studio and Type -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Studio *</label>
              <select 
                v-model="programForm.studio" 
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                required
              >
                <option value="A">Studio A</option>
                <option value="B">Studio B</option>
                <option value="C">Studio C</option>
                <option value="D">Studio D</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type *</label>
              <select 
                v-model="programForm.type" 
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                required
              >
                <option value="live_show">Live Show</option>
                <option value="interview">Interview</option>
                <option value="podcast">Podcast</option>
                <option value="news">News</option>
                <option value="music">Music</option>
                <option value="talk_show">Talk Show</option>
                <option value="sports">Sports</option>
                <option value="special">Special</option>
              </select>
            </div>
          </div>

          <!-- Hosts Selection -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hosts</label>
            <div class="border border-slate-300 dark:border-slate-600 rounded-lg p-3 bg-slate-50 dark:bg-slate-700/50">
              <!-- Selected Hosts -->
              <div v-if="programForm.selected_hosts.length > 0" class="mb-3">
                <div class="flex flex-wrap gap-1">
                  <div v-for="hostId in programForm.selected_hosts" :key="hostId" 
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                  >
                    {{ getHostName(hostId) }}
                    <button @click="removeHost(hostId)" class="ml-1 hover:bg-indigo-200 dark:hover:bg-indigo-800 rounded-full p-0.5">
                      <XIcon class="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Add Host -->
              <select 
                v-model="selectedHostToAdd" 
                @change="addHost"
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
              >
                <option value="">Add host...</option>
                <option v-for="host in availableHosts" :key="host.id" :value="host.id">
                  {{ host.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea 
              v-model="programForm.description" 
              rows="3" 
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm" 
              placeholder="Program description..."
            ></textarea>
          </div>

          <!-- Status -->
          <div>
            <div class="flex items-center">
              <input 
                type="checkbox" 
                v-model="programForm.status" 
                :true-value="'active'"
                :false-value="'inactive'"
                class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-600 rounded"
              />
              <label class="ml-2 text-sm text-slate-700 dark:text-slate-300">Active Program</label>
            </div>
          </div>
        </div>
        
        <!-- Fixed Footer -->
        <div class="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 flex-shrink-0">
          <button 
            @click="closeModal" 
            class="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="saveProgram" 
            :disabled="loading === 'create_program' || loading === 'update_program' || !isFormValid"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            <LoaderIcon v-if="loading === 'create_program' || loading === 'update_program'" class="h-4 w-4 animate-spin" />
            {{ editingProgram ? 'Update' : 'Create' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import {
  Plus as PlusIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  X as XIcon,
  Loader as LoaderIcon,
  Radio as RadioIcon,
  MapPin as MapPinIcon,
  Mic as MicIcon,
  Clock as ClockIcon,
  Image as ImageIcon,
  Upload as UploadIcon
} from 'lucide-vue-next';

const store = useStore();

// Computed properties from store
const programs = computed(() => store.getters.programs);
const stations = computed(() => store.getters.stations);
const hosts = computed(() => store.getters.hosts);
const loading = computed(() => store.getters.loading);

// Modal states
const showAddProgramModal = ref(false);
const editingProgram = ref(null);
const selectedHostToAdd = ref('');
const imagePreview = ref('');

// Form data
const programForm = ref({
  title: '',
  station_id: '',
  duration: 60,
  studio: 'A',
  type: 'live_show',
  description: '',
  status: 'active',
  selected_hosts: [],
  image: null
});

// Form validation
const isFormValid = computed(() => {
  return programForm.value.title && 
         programForm.value.station_id && 
         programForm.value.duration > 0;
});

// Available hosts for selection
const availableHosts = computed(() => {
  return hosts.value.data.filter(host => !programForm.value.selected_hosts.includes(host.id));
});

// Helper functions
const getHostName = (hostId) => {
  const host = hosts.value.data.find(h => h.id === hostId);
  return host ? host.name : 'Unknown Host';
};

const formatDuration = (duration) => {
  if (!duration) return 'Unknown';
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      store.dispatch('template_play_error_file', 'Image size must be less than 2MB');
      return;
    }
    
    programForm.value.image = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const addHost = () => {
  if (selectedHostToAdd.value && !programForm.value.selected_hosts.includes(selectedHostToAdd.value)) {
    programForm.value.selected_hosts.push(selectedHostToAdd.value);
    selectedHostToAdd.value = '';
  }
};

const removeHost = (hostId) => {
  programForm.value.selected_hosts = programForm.value.selected_hosts.filter(id => id !== hostId);
};

// Reset form
const resetForm = () => {
  programForm.value = {
    title: '',
    station_id: '',
    duration: 60,
    studio: 'A',
    type: 'live_show',
    description: '',
    status: 'active',
    selected_hosts: [],
    image: null
  };
  selectedHostToAdd.value = '';
  imagePreview.value = '';
};

// Edit program
const editProgram = (program) => {
  programForm.value = { 
    ...program,
    selected_hosts: program.hosts ? program.hosts.map(h => h.id) : [],
    image: null
  };
  imagePreview.value = program.image_url || '';
  editingProgram.value = program;
  showAddProgramModal.value = true;
};

// Close modal
const closeModal = () => {
  showAddProgramModal.value = false;
  editingProgram.value = null;
  resetForm();
};

// Save program
const saveProgram = async () => {
  try {
    const formData = new FormData();
    
    // Append all form fields
    Object.keys(programForm.value).forEach(key => {
      if (key === 'selected_hosts') {
        formData.append('host_ids', JSON.stringify(programForm.value[key]));
      } else if (key === 'image' && programForm.value[key]) {
        formData.append('image', programForm.value[key]);
      } else if (key !== 'image' && programForm.value[key] !== null && programForm.value[key] !== undefined) {
        formData.append(key, programForm.value[key]);
      }
    });
    
    if (editingProgram.value) {
      await store.dispatch('update_program', {
        programId: editingProgram.value.id,
        data: formData
      });
    } else {
      await store.dispatch('create_program', formData);
    }
    
    await fetchPrograms();
    closeModal();
    
    if (editingProgram.value) {
      store.dispatch('template_play_success_file', 'Program updated successfully');
    } else {
      store.dispatch('template_play_success_file', 'Program created successfully');
    }
  } catch (error) {
    console.error('Failed to save program:', error);
    store.dispatch('template_play_error_file', 'Failed to save program');
  }
};

// Delete program
const deleteProgram = async (program) => {
  if (confirm(`Are you sure you want to delete "${program.title}"?`)) {
    try {
      await store.dispatch('delete_program', {
        id: program.id,
        data: {}
      });
      
      await fetchPrograms();
      store.dispatch('template_play_delete_file', 'Program deleted successfully');
    } catch (error) {
      console.error('Failed to delete program:', error);
      store.dispatch('template_play_error_file', 'Failed to delete program');
    }
  }
};

// Toggle program status
const toggleProgramStatus = async (program) => {
  try {
    const newStatus = program.status === 'active' ? 'inactive' : 'active';
    
    await store.dispatch('toggle_program_status', {
      id: program.id,
      data: { status: newStatus }
    });
    
    // Update local state
    program.status = newStatus;
    store.dispatch('template_play_success_file', 'Program status updated');
  } catch (error) {
    console.error('Failed to toggle program status:', error);
    store.dispatch('template_play_error_file', 'Failed to update program status');
  }
};

// Fetch data
const fetchPrograms = async () => {
  try {
    await store.dispatch('fetch_programs', {
      data: { per_page: 20 },
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

const fetchHosts = async () => {
  try {
    await store.dispatch('fetch_hosts', {
      data: { per_page: 50 },
      page: 1
    });
  } catch (error) {
    console.error('Failed to fetch hosts:', error);
  }
};

// Initialize component
onMounted(async () => {
  try {
    await Promise.all([
      fetchPrograms(),
      fetchStations(),
      fetchHosts()
    ]);
  } catch (error) {
    console.error('Failed to initialize radio programs:', error);
    store.dispatch('template_play_error_file', 'Failed to load radio programs data');
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