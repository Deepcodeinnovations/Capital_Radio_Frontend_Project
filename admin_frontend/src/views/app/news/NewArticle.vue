<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ isEdit ? 'Edit News Article' : 'Add News Article' }}
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ isEdit ? 'Update your news article' : 'Create a new news article for your network' }}
        </p>
      </div>
      <router-link :to="{name:'News'}" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center">
        <ArrowLeftIcon class="h-4 w-4 mr-1" />
        Back to News
      </router-link>
    </div>
    
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <form @submit.prevent="saveArticle" class="space-y-6">
        <!-- Basic Information -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Article Information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Article Title*</label>
              <input
                id="title"
                v-model="article.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. New Music Festival Coming This Summer"
              />
            </div>
            
            <div>
              <label for="category_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select
                id="category_id"
                v-model="article.category_id"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div>
              <label for="station_id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Station</label>
              <select
                id="station_id"
                v-model="article.station_id"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a station</option>
                <option v-for="station in stations" :key="station.id" :value="station.id">
                  {{ station.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Article Content -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Article Content</h2>
          
          <div>
            <label for="summary" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Summary</label>
            <textarea
              id="summary"
              v-model="article.summary"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="A brief summary of the article..."
            ></textarea>
          </div>

          <div>
            <label for="excerpt" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Excerpt</label>
            <textarea
              id="excerpt"
              v-model="article.excerpt"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Short excerpt for article previews..."
            ></textarea>
          </div>
          
          <div>
            <label for="content" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Content*</label>
            <div class="border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
              <SummernoteEditor
                v-model="article.content"
                :config="summernoteConfig"
                class="summernote-editor"
                @input="handleContentChange"
              />
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Use the rich text editor to format your article content</p>
          </div>
        </div>

        <!-- SEO Section -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">SEO Settings</h2>
          
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label for="meta_title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meta Title</label>
              <input
                id="meta_title"
                v-model="article.meta_title"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="SEO title (defaults to article title)"
              />
            </div>
            
            <div>
              <label for="meta_description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meta Description</label>
              <textarea
                id="meta_description"
                v-model="article.meta_description"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="SEO description (defaults to summary)"
              ></textarea>
            </div>

            <div>
              <label for="meta_keywords" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Meta Keywords</label>
              <input
                id="meta_keywords"
                v-model="article.meta_keywords"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="SEO keywords, comma separated"
              />
            </div>
          </div>
        </div>
        
        <!-- Featured Image -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Featured Image</h2>
          
          <div class="flex items-center space-x-6">
            <div class="h-32 w-32 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
              <img 
                v-if="article.featured_image_url || imagePreview" 
                :src="article.featured_image_url || imagePreview" 
                class="h-full w-full object-cover rounded-lg" 
                alt="Featured image"
              />
              <NewspaperIcon v-else class="h-12 w-12 text-gray-400" />
            </div>
            
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Featured Image</label>
              <div class="flex items-center">
                <label for="featured-image" class="cursor-pointer bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none">
                  <span>Choose file</span>
                  <input id="featured-image" type="file" class="sr-only" accept="image/*" @change="handleFeaturedImageUpload" />
                </label>
                <p class="ml-3 text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 2MB (1200x630px recommended)</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Gallery Images -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Gallery Images</h2>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Gallery Images</label>
            <div class="flex items-center">
              <label for="gallery-images" class="cursor-pointer bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none">
                <span>Choose files</span>
                <input id="gallery-images" type="file" class="sr-only" accept="image/*" multiple @change="handleGalleryImagesUpload" />
              </label>
              <p class="ml-3 text-xs text-gray-500 dark:text-gray-400">Select multiple images for gallery</p>
            </div>
          </div>

          <!-- Gallery Preview -->
          <div v-if="galleryPreviews.length > 0 || (article.gallery_images && article.gallery_images.length > 0)" class="grid grid-cols-4 gap-4">
            <!-- Existing gallery images -->
            <div v-for="(image, index) in article.gallery_images || []" :key="'existing-' + index" class="relative">
              <img :src="image.url" class="h-20 w-20 object-cover rounded-lg" alt="Gallery image" />
              <button
                type="button"
                @click="removeExistingGalleryImage(image.id)"
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
            <!-- New gallery images -->
            <div v-for="(preview, index) in galleryPreviews" :key="'new-' + index" class="relative">
              <img :src="preview" class="h-20 w-20 object-cover rounded-lg" alt="Gallery preview" />
              <button
                type="button"
                @click="removeGalleryPreview(index)"
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          </div>
        </div>
        
        <!-- Publishing Details -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Publishing Details</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="priority" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <input
                id="priority"
                v-model="article.priority"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label for="source" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source</label>
              <input
                id="source"
                v-model="article.source"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Reuters, BBC, etc."
              />
            </div>

            <div class="md:col-span-2">
              <label for="source_url" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source URL</label>
              <input
                id="source_url"
                v-model="article.source_url"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/original-article"
              />
            </div>
            
            <div class="md:col-span-2 space-y-3">
              <label class="flex items-center">
                <input
                  v-model="article.is_published"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Publish this article</span>
              </label>

              <label class="flex items-center">
                <input
                  v-model="article.is_featured"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Feature this article on homepage</span>
              </label>

              <label class="flex items-center">
                <input
                  v-model="article.is_breaking"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Mark as breaking news</span>
              </label>
            </div>
          </div>
        </div>
        
        <!-- Tags -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">Tags</h2>
          
          <div>
            <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Article Tags</label>
            <input
              id="tags"
              v-model="tagsString"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. music, festival, summer (comma separated)"
            />
          </div>
        </div>
        
        <!-- Submit Buttons -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <router-link to="/dashboard/news" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Cancel
          </router-link>
          <button 
            type="submit" 
            :disabled="loading === 'createarticle' || loading === 'updatearticle'"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-500 hover:from-blue-700 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading === 'createarticle' || loading === 'updatearticle' ? 'Saving...' : (isEdit ? 'Update Article' : 'Save Article') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { ArrowLeft as ArrowLeftIcon, Newspaper as NewspaperIcon } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const store = useStore();

// Computed properties
const loading = computed(() => store.getters.loading);
const categories = computed(() => store.getters.categories || []);
const stations = computed(() => store.getters.stations || []); // Assuming you have a stations store
const isEdit = computed(() => !!route.params.id);

// Reactive data
const article = ref({
  title: '',
  summary: '',
  excerpt: '',
  content: '',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  category_id: '',
  station_id: '',
  source: '',
  source_url: '',
  priority: 0,
  is_published: false,
  is_featured: false,
  is_breaking: false,
  featured_image_url: '',
  gallery_images: []
});

const featuredImageFile = ref(null);
const galleryImageFiles = ref([]);
const imagePreview = ref('');
const galleryPreviews = ref([]);
const tagsString = ref('');

// Summernote configuration
const summernoteConfig = ref({
  height: 300,
  toolbar: [
    ['style', ['style']],
    ['font', ['bold', 'underline', 'clear']],
    ['fontname', ['fontname']],
    ['color', ['color']],
    ['para', ['ul', 'ol', 'paragraph']],
    ['table', ['table']],
    ['insert', ['link', 'picture', 'video']],
    ['view', ['fullscreen', 'codeview', 'help']]
  ],
  placeholder: 'Write your article content here...',
  fontNames: ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Helvetica', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
  fontSizes: ['8', '9', '10', '11', '12', '14', '18', '24', '36'],
  callbacks: {
    onImageUpload: function(files) {
      // Handle image upload in the editor
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // You can implement image upload to your server here
        // For now, we'll create a local URL
        const reader = new FileReader();
        reader.onload = function(e) {
          $(this).summernote('insertImage', e.target.result);
        }.bind(this);
        reader.readAsDataURL(file);
      }
    }
  }
});

// Methods
const handleFeaturedImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    featuredImageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const handleGalleryImagesUpload = (event) => {
  const files = Array.from(event.target.files);
  galleryImageFiles.value = [...galleryImageFiles.value, ...files];
  
  files.forEach(file => {
    galleryPreviews.value.push(URL.createObjectURL(file));
  });
};

const removeGalleryPreview = (index) => {
  galleryPreviews.value.splice(index, 1);
  galleryImageFiles.value.splice(index, 1);
};

const handleContentChange = (content) => {
  article.value.content = content;
};

const removeExistingGalleryImage = async (imageId) => {
  if (confirm('Are you sure you want to remove this image?')) {
    try {
      await store.dispatch('removegalleryimage', { 
        articleId: route.params.id, 
        imageId: imageId 
      });
      // Refresh article data
      await fetchArticle();
    } catch (error) {
      console.error('Error removing gallery image:', error);
    }
  }
};

const fetchArticle = async () => {
  if (isEdit.value) {
    try {
      await store.dispatch('fetcharticle', route.params.id);
      const fetchedArticle = store.getters['article'];
      
      if (fetchedArticle) {
        article.value = {
          ...fetchedArticle,
          category_id: fetchedArticle.category?.id || '',
          station_id: fetchedArticle.station?.id || ''
        };
        
        // Convert tags array to string
        if (fetchedArticle.tags) {
          tagsString.value = fetchedArticle.tags.join(', ');
        }
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      router.push({name:'News'});
    }
  }
};

const fetchCategories = async () => {
  try {
    await store.dispatch('fetchcategories');
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
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

const saveArticle = async () => {
  try {
    // Prepare form data
    const formData = new FormData();
    
    // Add text fields
    Object.keys(article.value).forEach(key => {
      if (key !== 'gallery_images' && article.value[key] !== null && article.value[key] !== '') {
        if (typeof article.value[key] === 'boolean') {
          formData.append(key, article.value[key] ? 'true' : 'false');
        } else {
          formData.append(key, article.value[key]);
        }
      }
    });

    // Add tags as JSON string
    if (tagsString.value) {
      const tagsArray = tagsString.value.split(',').map(tag => tag.trim()).filter(tag => tag);
      formData.append('tags', JSON.stringify(tagsArray));
    }

    // Add featured image
    if (featuredImageFile.value) {
      formData.append('featured_image', featuredImageFile.value);
    }

    // Add gallery images
    galleryImageFiles.value.forEach((file, index) => {
      formData.append(`gallery_image_${index}`, file);
    });

    if (isEdit.value) {
      await store.dispatch('updatearticle', { 
        id: route.params.id, 
        data: formData 
      });
    } else {
      await store.dispatch('createarticle', formData);
    }

    router.push({name:'News'});
  } catch (error) {
    console.error('Error saving article:', error);
  }
};

// Watch for meta title/description auto-fill
watch(() => article.value.title, (newTitle) => {
  if (!article.value.meta_title) {
    article.value.meta_title = newTitle;
  }
});

watch(() => article.value.summary, (newSummary) => {
  if (!article.value.meta_description) {
    article.value.meta_description = newSummary;
  }
});

// Lifecycle
onMounted(() => {
  fetchCategories();
  fetchStations();
  if (isEdit.value) {
    fetchArticle();
  }
});
</script>

<style scoped>
/* Summernote editor styling */
:deep(.note-editor) {
  border: 1px solid #d1d5db;
}

:deep(.note-toolbar) {
  background-color: #f9fafb;
  border-bottom: 1px solid #d1d5db;
}

:deep(.note-editing-area) {
  background-color: white;
}

/* Dark mode styles */
.dark :deep(.note-editor) {
  border: 1px solid #4b5563;
  background-color: #374151;
}

.dark :deep(.note-toolbar) {
  background-color: #374151;
  border-bottom: 1px solid #4b5563;
}

.dark :deep(.note-editing-area) {
  background-color: #374151;
}

.dark :deep(.note-editable) {
  background-color: #374151;
  color: #f9fafb;
}

.dark :deep(.note-btn) {
  color: #f9fafb;
  background-color: transparent;
  border-color: #4b5563;
}

.dark :deep(.note-btn:hover) {
  background-color: #4b5563;
}

.dark :deep(.dropdown-menu) {
  background-color: #374151;
  border-color: #4b5563;
}

.dark :deep(.dropdown-item) {
  color: #f9fafb;
}

.dark :deep(.dropdown-item:hover) {
  background-color: #4b5563;
}
</style>