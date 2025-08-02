<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900 dark:text-white">Hosts & DJs</h1>
        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">Manage your radio hosts and DJs</p>
      </div>
      
      <div class="flex items-center gap-3">
        <button 
          @click="showAddHostModal = true" 
          :disabled="loading === 'create_host'"
          class="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium disabled:opacity-50"
        >
          <LoaderIcon v-if="loading === 'create_host'" class="h-4 w-4 animate-spin" />
          <UserPlusIcon v-else class="h-4 w-4" />
          {{ loading === 'create_host' ? 'Creating...' : 'Add Host' }}
        </button>
      </div>
    </div>

    <!-- Hosts Grid with Skeleton Loader -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <!-- Skeleton Loading Cards -->
      <div v-if="loading === 'fetch_hosts'" v-for="n in 8" :key="`skeleton-${n}`" class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden animate-pulse">
        <div class="h-48 bg-slate-200 dark:bg-slate-700"></div>
        <div class="p-4 space-y-3">
          <div class="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          <div class="space-y-2">
            <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
          </div>
          <div class="flex justify-between items-center pt-2">
            <div class="flex space-x-2">
              <div class="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div class="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div class="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
            <div class="flex space-x-2">
              <div class="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div class="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Actual Host Cards -->
      <div v-else v-for="host in hosts.data" :key="host.id" class="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow">
        <div class="relative">
          <img 
            :src="host.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(host.name)}&background=6366f1&color=fff&size=400`" 
            :alt="`${host.name} profile`" 
            class="w-full h-48 object-cover" 
          />
          <div v-if="host.on_air_status" class="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <div class="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
            LIVE
          </div>
          <button 
            @click="toggleHostStatus(host)"
            :disabled="loading === 'toggle_host_status'"
            :class="[
              'absolute top-2 left-2 text-xs px-2 py-1 rounded-full disabled:opacity-50',
              host.status ? 'bg-green-600 text-white' : 'bg-slate-600 text-white'
            ]"
          >
            <LoaderIcon v-if="loading === 'toggle_host_status'" class="w-3 h-3 animate-spin" />
            <span v-else>{{ host.status ? 'Active' : 'Inactive' }}</span>
          </button>
        </div>
        
        <div class="p-4">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{{ host.name }}</h3>
          <p class="text-indigo-600 dark:text-indigo-400 text-sm mb-2">{{ host.role || 'Radio Host' }}</p>
          <p class="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{{ host.bio || 'No bio available' }}</p>
          
          <div class="flex justify-between items-center">
            <div class="flex space-x-2">
              <button 
                v-if="host.phone" 
                class="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                :title="host.phone"
              >
                <PhoneIcon class="h-5 w-5" />
              </button>
              <button 
                v-if="host.email" 
                class="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                :title="host.email"
              >
                <MailIcon class="h-5 w-5" />
              </button>
              <button 
                class="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                title="Schedule"
              >
                <CalendarIcon class="h-5 w-5" />
              </button>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="editHost(host)" 
                :disabled="loading === 'update_host'"
                class="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-50"
              >
                <EditIcon v-if="loading !== 'update_host'" class="h-5 w-5" />
                <LoaderIcon v-else class="h-5 w-5 animate-spin" />
              </button>
              <button 
                @click="deleteHost(host)" 
                :disabled="loading === 'delete_host'"
                class="text-slate-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50"
              >
                <TrashIcon v-if="loading !== 'delete_host'" class="h-5 w-5" />
                <LoaderIcon v-else class="h-5 w-5 animate-spin" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Host Modal -->
    <div v-if="showAddHostModal || editingHost" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
              {{ editingHost ? 'Edit Host' : 'Add New Host' }}
            </h2>
            <button @click="closeModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <XIcon class="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div class="p-6 space-y-4">
          <!-- Profile Image Upload -->
          <div class="flex items-center space-x-4">
            <div class="relative">
              <img 
                :src="hostForm.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(hostForm.name || 'Host')}&background=6366f1&color=fff&size=150`" 
                alt="Host profile" 
                class="w-20 h-20 rounded-full object-cover border-2 border-slate-200 dark:border-slate-600"
              />
              <button 
                @click="triggerImageUpload"
                :disabled="loading === 'update_host_profile_image'"
                class="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-1.5 rounded-full disabled:opacity-50"
              >
                <LoaderIcon v-if="loading === 'update_host_profile_image'" class="w-3 h-3 animate-spin" />
                <CameraIcon v-else class="w-3 h-3" />
              </button>
              <input 
                ref="imageInput" 
                type="file" 
                accept="image/*" 
                @change="handleImageUpload" 
                class="hidden"
              />
            </div>
            <div>
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Profile Picture</p>
              <p class="text-xs text-slate-500 dark:text-slate-400">Click the camera icon to upload</p>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
              <input 
                type="text" 
                v-model="hostForm.name" 
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
                placeholder="Enter host name" 
                required
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Role/Title</label>
              <input 
                type="text" 
                v-model="hostForm.role" 
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
                placeholder="e.g. Morning Show Host" 
              />
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
              <input 
                type="email" 
                v-model="hostForm.email" 
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
                placeholder="host@example.com" 
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone</label>
              <input 
                type="tel" 
                v-model="hostForm.phone" 
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
                placeholder="+1 (555) 123-4567" 
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bio</label>
            <textarea 
              v-model="hostForm.bio" 
              rows="3" 
              class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
              placeholder="Tell us about this host..."
            ></textarea>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Social Media</label>
              <input 
                type="url" 
                v-model="hostForm.social_media" 
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
                placeholder="https://twitter.com/host" 
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Experience Years</label>
              <input 
                type="number" 
                v-model="hostForm.experience_years" 
                class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white" 
                placeholder="5" 
              />
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <div class="flex items-center">
              <input 
                type="checkbox" 
                v-model="hostForm.status" 
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-600 rounded"
              />
              <label class="ml-2 text-sm text-slate-700 dark:text-slate-300">Active Host</label>
            </div>
            
            <div class="flex items-center">
              <input 
                type="checkbox" 
                v-model="hostForm.on_air_status" 
                class="h-4 w-4 text-red-600 focus:ring-red-500 border-slate-300 dark:border-slate-600 rounded"
              />
              <label class="ml-2 text-sm text-slate-700 dark:text-slate-300">Currently On Air</label>
            </div>
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
            @click="saveHost" 
            :disabled="loading === 'create_host' || loading === 'update_host'"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-md text-sm font-medium disabled:opacity-50"
          >
            <span v-if="loading === 'create_host' || loading === 'update_host'">
              {{ editingHost ? 'Updating...' : 'Creating...' }}
            </span>
            <span v-else>
              {{ editingHost ? 'Update' : 'Create' }}
            </span>
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
  UserPlus as UserPlusIcon,
  Calendar as CalendarIcon,  
  Phone as PhoneIcon,
  Mail as MailIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  X as XIcon,
  Loader as LoaderIcon,
  Camera as CameraIcon
} from 'lucide-vue-next';

const store = useStore();

// Computed properties from store
const hosts = computed(() => store.getters.hosts);
const loading = computed(() => store.getters.loading);
const error = computed(() => store.getters.error);

// Modal states
const showAddHostModal = ref(false);
const editingHost = ref(null);
const currentPage = ref(1);
const imageInput = ref(null);

// Form data
const hostForm = ref({
  name: '',
  role: '',
  email: '',
  phone: '',
  bio: '',
  social_media: '',
  experience_years: 0,
  status: true,
  on_air_status: false,
  image_url: '',
  image_path: '',
  imageFile: null
});

// Reset form
const resetForm = () => {
  hostForm.value = {
    name: '',
    role: '',
    email: '',
    phone: '',
    bio: '',
    social_media: '',
    experience_years: 0,
    status: true,
    on_air_status: false,
    image_url: '',
    image_path: '',
    imageFile: null
  };
  
  // Reset file input
  if (imageInput.value) {
    imageInput.value.value = '';
  }
};

// Trigger image upload
const triggerImageUpload = () => {
  imageInput.value?.click();
};

// Handle image upload
const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  // Store the binary file
  hostForm.value.imageFile = file;
  
  if (editingHost.value) {
    // For editing existing host, upload immediately
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      await store.dispatch('update_host_profile_image', {
        id: editingHost.value.id,
        data: formData
      });
      
      store.dispatch('template_play_success_file', 'Profile image updated successfully');
    } catch (error) {
      console.error('Failed to update profile image:', error);
      store.dispatch('template_play_error_file', 'Failed to update profile image');
    }
  } else {
    // For new host, show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      hostForm.value.image_url = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Edit host
const editHost = (host) => {
  hostForm.value = { ...host, imageFile: null };
  editingHost.value = host;
  showAddHostModal.value = true;
};

// Close modal
const closeModal = () => {
  showAddHostModal.value = false;
  editingHost.value = null;
  resetForm();
};

// Save host (add or update)
const saveHost = async () => {
  try {
    const formData = new FormData();
    
    // Append all form fields except imageFile
    Object.keys(hostForm.value).forEach(key => {
      if (key !== 'imageFile' && hostForm.value[key] !== null && hostForm.value[key] !== undefined) {
        if (typeof hostForm.value[key] === 'boolean') {
          formData.append(key, hostForm.value[key].toString());
        } else {
          formData.append(key, hostForm.value[key]);
        }
      }
    });
    
    // Append binary image file if exists
    if (hostForm.value.imageFile) {
      formData.append('image', hostForm.value.imageFile);
    }
    
    if (editingHost.value) {
      await store.dispatch('update_host', {
        hostId: editingHost.value.id,
        data: formData
      });
    } else {
      await store.dispatch('create_host', formData);
    }
    
    // Refresh hosts list
    await fetchHosts();
    closeModal();
    
    // Show success message
    if (editingHost.value) {
      store.dispatch('template_play_success_file', 'Host updated successfully');
    } else {
      store.dispatch('template_play_success_file', 'Host created successfully');
    }
  } catch (error) {
    console.error('Failed to save host:', error);
    store.dispatch('template_play_error_file', 'Failed to save host');
  }
};

// Delete host
const deleteHost = async (host) => {
  if (confirm(`Are you sure you want to delete ${host.name}?`)) {
    try {
      await store.dispatch('delete_host', {
        id: host.id,
        data: {}
      });
      
      // Refresh hosts list
      await fetchHosts();
      store.dispatch('template_play_delete_file', 'Host deleted successfully');
    } catch (error) {
      console.error('Failed to delete host:', error);
      store.dispatch('template_play_error_file', 'Failed to delete host');
    }
  }
};

// Toggle host status
const toggleHostStatus = async (host) => {
  try {
    const newStatus = !host.status;
    
    await store.dispatch('toggle_host_status', {
      id: host.id,
      data: { status: newStatus }
    });
    
    // Update local state
    host.status = newStatus;
    store.dispatch('template_play_success_file', 'Host status updated');
  } catch (error) {
    console.error('Failed to toggle host status:', error);
    store.dispatch('template_play_error_file', 'Failed to update host status');
  }
};

// Fetch hosts
const fetchHosts = async () => {
  let data = {
    per_page: 10
  }
  let page = currentPage.value
  try {
    await store.dispatch('fetch_hosts', {
      data,
      page
    });
  } catch (error) {
    console.error('Failed to fetch hosts:', error);
    store.dispatch('template_play_error_file', 'Failed to load hosts');
  }
};

// Initialize component
onMounted(() => {
  fetchHosts();
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