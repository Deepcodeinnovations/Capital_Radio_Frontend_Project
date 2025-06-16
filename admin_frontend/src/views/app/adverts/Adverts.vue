<template>
  <div class="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Adverts Management</h1>
      <button
        @click="openCreateModal"
        class="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center"
      >
        <PlusIcon class="w-5 h-5 mr-2" />
        Create Advert
      </button>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex flex-wrap gap-4">
      <select
        v-model="filters.station_id"
        @change="fetchAdverts"
        class="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="">All Stations</option>
        <option v-for="station in stations" :key="station.id" :value="station.id">{{ station.name }}</option>
      </select>

      <select
        v-model="filters.status"
        @change="fetchAdverts"
        class="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="">All Status</option>
        <option value="1">Active</option>
        <option value="0">Inactive</option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="loading === 'fetchAdverts'" class="flex justify-center py-8">
      <LoaderIcon class="w-8 h-8 animate-spin text-purple-600" />
    </div>

    <!-- Adverts Grid -->
    <div v-else-if="adverts?.data?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="advert in adverts.data"
        :key="advert.id"
        class="bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600 overflow-hidden"
      >
        <!-- Image -->
        <div class="relative h-48 bg-gray-200 dark:bg-slate-600">
          <img
            v-if="advert.image_url"
            :src="advert.image_url"
            :alt="advert.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="flex items-center justify-center h-full">
            <ImageIcon class="w-12 h-12 text-gray-400" />
          </div>
          
          <!-- Status Badge -->
          <div class="absolute top-2 right-2">
            <span
              :class="advert.status ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'"
              class="px-2 py-1 rounded-full text-xs font-medium"
            >
              {{ advert.status ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-4">
          <div class="flex items-center gap-2 mb-2">
            <h3 class="font-semibold text-gray-900 dark:text-white truncate">{{ advert.title }}</h3>
            <span class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
              {{ getStationName(advert.station_id) }}
            </span>
          </div>
          
          <p class="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{{ advert.description }}</p>
          
          <!-- Button Preview -->
          <div v-if="advert.button_title" class="mb-3">
            <button class="bg-purple-600 text-white px-3 py-1 rounded text-xs cursor-default">
              {{ advert.button_title }}
            </button>
          </div>
          
          <!-- URL -->
          <div v-if="advert.target_url" class="mb-3">
            <a
              :href="advert.target_url"
              target="_blank"
              class="text-purple-600 hover:text-purple-800 text-xs flex items-center"
            >
              <ExternalLinkIcon class="w-3 h-3 mr-1" />
              {{ truncateUrl(advert.target_url) }}
            </a>
          </div>
          
          <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
            <span>Created: {{ formatDate(advert.created_at) }}</span>
          </div>

          <!-- Actions -->
          <div class="flex justify-between items-center">
            <!-- Status Toggle -->
            <button
              @click="toggleStatus(advert)"
              :disabled="loading === 'updateAdvert'"
              class="p-1 rounded transition-colors"
              :class="advert.status 
                ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900' 
                : 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900'"
            >
              <ToggleLeftIcon v-if="!advert.status" class="w-4 h-4" />
              <ToggleRightIcon v-else class="w-4 h-4" />
            </button>

            <div class="flex gap-1">
              <!-- Edit Button -->
              <button
                @click="openEditModal(advert)"
                class="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
              >
                <EditIcon class="w-4 h-4" />
              </button>

              <!-- Delete Button -->
              <button
                @click="confirmDelete(advert)"
                class="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="adverts.total > adverts.per_page" class="col-span-full flex justify-center mt-6">
        <nav class="flex items-center gap-2">
          <button
            v-for="page in paginationPages"
            :key="page"
            @click="changePage(page)"
            :disabled="page === adverts.current_page"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="page === adverts.current_page 
              ? 'bg-purple-600 text-white' 
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600'"
          >
            {{ page }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <MonitorIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No adverts found</h3>
      <p class="text-gray-600 dark:text-gray-400">Create your first advert to get started</p>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeModal"
    >
      <div
        @click.stop
        class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col"
      >
        <!-- Fixed Header -->
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-600 flex-shrink-0">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ editingAdvert ? 'Edit Advert' : 'Create Advert' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <XIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto">
          <form @submit.prevent="submitForm" class="p-6 space-y-6">
            <!-- Station Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Radio Station
              </label>
              <select
                v-model="form.station_id"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Station</option>
                <option v-for="station in stations" :key="station.id" :value="station.id">{{ station.name }}</option>
              </select>
            </div>

            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                v-model="form.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter advert title"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                v-model="form.description"
                required
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter advert description"
              ></textarea>
            </div>

            <!-- Target URL -->
            <div class="grid grid-cols-2 gap-2">
                <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Target URL
                </label>
                <input
                    v-model="form.target_url"
                    type="url"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com"
                />
                </div>

                <!-- Button Title -->
                <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Button Title
                </label>
                <input
                    v-model="form.button_title"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Learn More, Shop Now, etc."
                />
                </div>
            </div>

            <!-- Image Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image
              </label>
              <div class="space-y-3">
                <!-- Current Image Preview -->
                <div v-if="form.image_url || imagePreview" class="relative w-full h-48 bg-gray-100 dark:bg-slate-600 rounded-lg overflow-hidden">
                  <img
                    :src="imagePreview || form.image_url"
                    alt="Preview"
                    class="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    @click="removeImage"
                    class="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                  >
                    <XIcon class="w-4 h-4" />
                  </button>
                </div>

                <!-- File Input -->
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>
            </div>

            <!-- Status -->
            <div>
              <label class="flex items-center">
                <input
                  v-model="form.status"
                  type="checkbox"
                  class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Active</span>
              </label>
            </div>
          </form>
        </div>

        <!-- Fixed Footer -->
        <div class="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-slate-600 flex-shrink-0">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            @click="submitForm"
            :disabled="loading === 'createAdvert' || loading === 'updateAdvert'"
            class="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center"
          >
            <LoaderIcon v-if="loading === 'createAdvert' || loading === 'updateAdvert'" class="w-4 h-4 mr-2 animate-spin" />
            {{ editingAdvert ? 'Update' : 'Create' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showDeleteModal = false"
    >
      <div
        @click.stop
        class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md mx-4"
      >
        <div class="p-6">
          <div class="flex items-center mb-4">
            <AlertTriangleIcon class="w-6 h-6 text-red-600 mr-3" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Delete Advert</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Are you sure you want to delete "{{ advertToDelete?.title }}"? This action cannot be undone.
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              @click="deleteAdvert"
              :disabled="loading === 'deleteAdvert'"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <LoaderIcon v-if="loading === 'deleteAdvert'" class="w-4 h-4 mr-2 animate-spin" />
              Delete
            </button>
          </div>
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
  Monitor as MonitorIcon,
  AlertTriangle as AlertTriangleIcon,
  ToggleLeft as ToggleLeftIcon,
  ToggleRight as ToggleRightIcon,
  Image as ImageIcon,
  ExternalLink as ExternalLinkIcon
} from 'lucide-vue-next';

const store = useStore();

// Reactive data
const showModal = ref(false);
const showDeleteModal = ref(false);
const editingAdvert = ref(null);
const advertToDelete = ref(null);
const imagePreview = ref(null);
const fileInput = ref(null);

const filters = ref({
  station_id: '',
  status: '',
  page: 1
});

const form = ref({
  title: '',
  description: '',
  target_url: '',
  button_title: '',
  station_id: '',
  status: true,
  image: null,
  image_url: ''
});

// Computed properties
const adverts = computed(() => store.getters.adverts);
const loading = computed(() => store.getters.loading);
const stations = computed(() => store.getters.stations || []);

const paginationPages = computed(() => {
  if (!adverts.value?.last_page) return [];
  const pages = [];
  for (let i = 1; i <= adverts.value.last_page; i++) {
    pages.push(i);
  }
  return pages;
});

const fetchStations = async () => {
  let data = {
    per_page: 100
  }
  let page = 1
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

// Methods
const fetchAdverts = async () => {
  await store.dispatch('fetchAdverts', filters.value);
};

const getStationName = (stationId) => {
  const station = stations.value.find(s => s.id == stationId);
  return station ? station.name : 'Unknown';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const truncateUrl = (url) => {
  return url.length > 30 ? url.substring(0, 30) + '...' : url;
};

const openCreateModal = () => {
  editingAdvert.value = null;
  imagePreview.value = null;
  form.value = {
    title: '',
    description: '',
    target_url: '',
    button_title: '',
    station_id: '',
    status: true,
    image: null,
    image_url: ''
  };
  showModal.value = true;
};

const openEditModal = (advert) => {
  editingAdvert.value = advert;
  imagePreview.value = null;
  form.value = {
    title: advert.title,
    description: advert.description,
    target_url: advert.target_url,
    button_title: advert.button_title,
    station_id: advert.station_id,
    status: advert.status,
    image: null,
    image_url: advert.image_url
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingAdvert.value = null;
  imagePreview.value = null;
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.image = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  form.value.image = null;
  form.value.image_url = '';
  imagePreview.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const submitForm = async () => {
  try {
    if (editingAdvert.value) {
      await store.dispatch('updateAdvert', {
        id: editingAdvert.value.id,
        data: form.value
      });
    } else {
      await store.dispatch('createAdvert', form.value);
    }
    closeModal();
    await fetchAdverts();
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};

const toggleStatus = async (advert) => {
  try {
    await store.dispatch('updateAdvert', {
      id: advert.id,
      data: { ...advert, status: !advert.status }
    });
    await fetchAdverts();
  } catch (error) {
    console.error('Error toggling status:', error);
  }
};

const confirmDelete = (advert) => {
  advertToDelete.value = advert;
  showDeleteModal.value = true;
};

const deleteAdvert = async () => {
  try {
    await store.dispatch('deleteAdvert', advertToDelete.value.id);
    showDeleteModal.value = false;
    advertToDelete.value = null;
    await fetchAdverts();
  } catch (error) {
    console.error('Error deleting advert:', error);
  }
};

const changePage = async (page) => {
  filters.value.page = page;
  await fetchAdverts();
};

// Lifecycle
onMounted(() => {
  fetchAdverts();
  fetchStations();
});
</script>