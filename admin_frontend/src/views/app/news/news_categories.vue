<template>
    <div class="space-y-6">
      <!-- Header with Create Button -->
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Categories Management</h2>
        <button
          @click="openCreateModal"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <PlusIcon class="w-5 h-5" />
          Add Category
        </button>
      </div>
  
      <!-- Categories Table -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Color</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div v-if="category.icon" class="mr-3">{{ category.icon }}</div>
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ category.name }}</div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center">
                    <div 
                      class="w-4 h-4 rounded mr-2 border border-gray-300 dark:border-gray-600"
                      :style="{ backgroundColor: category.color }"
                    ></div>
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ category.color }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                  {{ category.description || 'No description' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {{ category.sort_order }}
                </td>
                <td class="px-6 py-4 text-right text-sm font-medium">
                  <div class="flex justify-end gap-2">
                    <button
                      @click="openEditModal(category)"
                      class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <EditIcon class="h-4 w-4" />
                    </button>
                    <button
                      @click="deleteCategory(category.id)"
                      class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <TrashIcon class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="categories.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No categories found. Create your first category to get started.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Create/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="closeModal">
        <div class="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white dark:bg-gray-800" @click.stop>
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {{ isEditing ? 'Edit Category' : 'Create Category' }}
            </h3>
            <form @submit.prevent="submitForm">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                  <input
                    v-model="formData.name"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter category name"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    v-model="formData.description"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter category description"
                  ></textarea>
                </div>
  
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
                  <div class="flex items-center gap-3">
                    <input
                      v-model="formData.color"
                      type="color"
                      class="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
                    />
                    <input
                      v-model="formData.color"
                      type="text"
                      class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
  
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon (Optional)</label>
                  <input
                    v-model="formData.icon"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="📰"
                  />
                </div>
  
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort Order</label>
                  <input
                    v-model.number="formData.sort_order"
                    type="number"
                    min="0"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
  
              <div class="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="loading === 'createcategory' || loading === 'updatecategory'"
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  <LoaderIcon v-if="loading === 'createcategory' || loading === 'updatecategory'" class="w-4 h-4 animate-spin" />
                  {{ isEditing ? 'Update' : 'Create' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { 
    PlusIcon, 
    EditIcon, 
    TrashIcon,
    LoaderIcon
  } from 'lucide-vue-next';
  
  const store = useStore();
  
  // Computed properties
  const categories = computed(() => store.getters.categories || []);
  const loading = computed(() => store.getters.loading);
  
  // Reactive data
  const showModal = ref(false);
  const isEditing = ref(false);
  const editingId = ref(null);
  
  const formData = ref({
    name: '',
    description: '',
    color: '#3B82F6',
    icon: '',
    sort_order: 0
  });
  
  // Methods
  const fetchCategories = async () => {
    try {
      await store.dispatch('fetchcategories');
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  const openCreateModal = () => {
    isEditing.value = false;
    editingId.value = null;
    formData.value = {
      name: '',
      description: '',
      color: '#3B82F6',
      icon: '',
      sort_order: 0
    };
    showModal.value = true;
  };
  
  const openEditModal = (category) => {
    isEditing.value = true;
    editingId.value = category.id;
    formData.value = {
      name: category.name || '',
      description: category.description || '',
      color: category.color || '#3B82F6',
      icon: category.icon || '',
      sort_order: category.sort_order || 0
    };
    showModal.value = true;
  };
  
  const closeModal = () => {
    showModal.value = false;
    isEditing.value = false;
    editingId.value = null;
    formData.value = {
      name: '',
      description: '',
      color: '#3B82F6',
      icon: '',
      sort_order: 0
    };
  };
  
  const submitForm = async () => {
    try {
      if (isEditing.value) {
        await store.dispatch('updatecategory', { 
          id: editingId.value, 
          data: formData.value 
        });
      } else {
        await store.dispatch('createcategory', formData.value);
      }
      closeModal();
      await fetchCategories();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
  
  const deleteCategory = async (id) => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        await store.dispatch('removecategory', id);
        await fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };
  
  // Lifecycle
  onMounted(() => {
    fetchCategories();
  });
  </script>