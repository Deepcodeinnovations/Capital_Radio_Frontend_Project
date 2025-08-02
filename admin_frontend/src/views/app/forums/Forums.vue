<template>
  <div class="">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Forums Management</h2>
      <button
        @click="openCreateModal"
        class="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center"
      >
        <PlusIcon class="w-5 h-5 mr-2" />
        Create Forum
      </button>
    </div>

    <!-- Filters -->
    <div class="mb-6 flex flex-wrap gap-4">
      <select
        v-model="filters.station_id"
        @change="fetchForums"
        class="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="">All Stations</option>
        <option v-for="station in stations" :key="station.id" :value="station.id">{{ station.name }}</option>
      </select>

      <select
        v-model="filters.status"
        @change="fetchForums"
        class="px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="">All Status</option>
        <option value="1">Active</option>
        <option value="0">Inactive</option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="loading === 'fetchForums'" class="flex justify-center py-8">
      <LoaderIcon class="w-8 h-8 animate-spin text-purple-600" />
    </div>

    <!-- Forums List -->
    <div v-else-if="forums?.data?.length" class="space-y-4">
      <div
        v-for="forum in forums.data"
        :key="forum.id"
        class="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <router-link :to="{ name: 'ForumDetails', params: { id: forum.id } }" class="flex items-center gap-3 mb-2">
              <h3 class="font-semibold text-gray-900 dark:text-white">{{ forum.title }}</h3>
              <span
                :class="forum.status ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ forum.status ? 'Active' : 'Inactive' }}
              </span>
              <span class="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                {{ getStationName(forum.station_id) }}
              </span>
            </router-link>
            <p class="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{{ forum.body }}</p>
            <div class="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Created: {{ formatDate(forum.created_at) }}</span>
              <span>Comments: {{ forum.comments_count || 0 }}</span>
            </div>
          </div>
          
          <div class="flex items-center gap-2 ml-4">
            <!-- Status Toggle -->
            <button
              @click="toggleStatus(forum)"
              :disabled="loading === 'updateForum'"
              class="p-2 rounded-lg transition-colors"
              :class="forum.status 
                ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900' 
                : 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900'"
            >
              <ToggleLeftIcon v-if="!forum.status" class="w-5 h-5" />
              <ToggleRightIcon v-else class="w-5 h-5" />
            </button>

            <!-- Edit Button -->
            <button
              @click="openEditModal(forum)"
              class="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
            >
              <EditIcon class="w-5 h-5" />
            </button>

            <!-- Delete Button -->
            <button
              @click="confirmDelete(forum)"
              class="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
            >
              <TrashIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="forums.total > forums.per_page" class="flex justify-center mt-6">
        <nav class="flex items-center gap-2">
          <button
            v-for="page in paginationPages"
            :key="page"
            @click="changePage(page)"
            :disabled="page === forums.current_page"
            class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="page === forums.current_page 
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
      <MessageSquareIcon class="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No forums found</h3>
      <p class="text-gray-600 dark:text-gray-400">Create your first forum to get started</p>
    </div>

    <!-- Create/Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="closeModal"
      >
        <div
          @click.stop
          class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md mx-4"
        >
          <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-600">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ editingForum ? 'Edit Forum' : 'Create Forum' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <XIcon class="w-6 h-6" />
            </button>
          </div>

          <form @submit.prevent="submitForm" class="p-6 space-y-4">
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
                placeholder="Enter forum title"
              />
            </div>

            <!-- Body -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                v-model="form.body"
                required
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter forum description"
              ></textarea>
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

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading === 'createForum' || loading === 'updateForum'"
                class="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center"
              >
                <LoaderIcon v-if="loading === 'createForum' || loading === 'updateForum'" class="w-4 h-4 mr-2 animate-spin" />
                {{ editingForum ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        @click="closeDeleteModal"
      >
        <div
          @click.stop
          class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md mx-4"
        >
          <div class="p-6">
            <div class="flex items-center mb-4">
              <AlertTriangleIcon class="w-6 h-6 text-red-600 mr-3" />
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Delete Forum</h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete "{{ forumToDelete?.title }}"? This action cannot be undone.
            </p>
            <div class="flex justify-end gap-3">
              <button
                @click="closeDeleteModal"
                class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                @click="deleteForum"
                :disabled="loading === 'deleteForum'"
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <LoaderIcon v-if="loading === 'deleteForum'" class="w-4 h-4 mr-2 animate-spin" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useStore } from 'vuex';
import {
  Plus as PlusIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  X as XIcon,
  Loader as LoaderIcon,
  MessageSquare as MessageSquareIcon,
  AlertTriangle as AlertTriangleIcon,
  ToggleLeft as ToggleLeftIcon,
  ToggleRight as ToggleRightIcon
} from 'lucide-vue-next';

const store = useStore();

// Reactive data
const showModal = ref(false);
const showDeleteModal = ref(false);
const editingForum = ref(null);
const forumToDelete = ref(null);
const filters = ref({
  station_id: '',
  status: '',
  page: 1
});

const form = ref({
  title: '',
  body: '',
  station_id: '',
  status: true
});

// Computed properties
const forums = computed(() => store.getters.forums);
const loading = computed(() => store.getters.loading);
const stations = computed(() => store.getters.stations || []);
const paginationPages = computed(() => {
  if (!forums.value?.last_page) return [];
  const pages = [];
  for (let i = 1; i <= forums.value.last_page; i++) {
    pages.push(i);
  }
  return pages;
});

// Methods
const getStationName = (stationId) => {
  const station = stations.value.find(s => s.id === stationId);
  return station ? station.name : 'Unknown Station';
};

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

const fetchForums = async () => {
  await store.dispatch('fetchForums', filters.value);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const openCreateModal = () => {
  editingForum.value = null;
  form.value = {
    title: '',
    body: '',
    station_id: '',
    status: true
  };
  showModal.value = true;
};

const openEditModal = (forum) => {
  editingForum.value = forum;
  form.value = {
    title: forum.title,
    body: forum.body,
    station_id: forum.station_id,
    status: forum.status
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingForum.value = null;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  forumToDelete.value = null;
};

const submitForm = async () => {
  try {
    if (editingForum.value) {
      await store.dispatch('updateForum', {
        id: editingForum.value.id,
        data: form.value
      });
    } else {
      await store.dispatch('createForum', form.value);
    }
    
    // Use nextTick to ensure DOM updates are complete
    await nextTick();
    closeModal();
    await fetchForums();
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};

const toggleStatus = async (forum) => {
  try {
    await store.dispatch('updateForum', {
      id: forum.id,
      data: { ...forum, status: !forum.status }
    });
    await fetchForums();
  } catch (error) {
    console.error('Error toggling status:', error);
  }
};

const confirmDelete = (forum) => {
  forumToDelete.value = forum;
  showDeleteModal.value = true;
};

const deleteForum = async () => {
  try {
    await store.dispatch('deleteForum', forumToDelete.value.id);
    await nextTick();
    closeDeleteModal();
    await fetchForums();
  } catch (error) {
    console.error('Error deleting forum:', error);
  }
};

const changePage = async (page) => {
  filters.value.page = page;
  await fetchForums();
};

// Lifecycle
onMounted(() => {
  fetchForums();
  fetchStations();
});
</script>