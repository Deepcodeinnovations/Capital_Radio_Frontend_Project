<template>
  <div class="min-h-screen p-6">
    <!-- Header Section -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">News Articles</h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2">Manage and organize your news content</p>
      </div>
      <router-link :to="{ name: 'NewNews' }">
        <button class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
          <PlusIcon class="w-5 h-5" />
          Create Article
        </button>
      </router-link>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <NewspaperIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Articles</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ articles.data?.length || 0 }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
            <CheckCircleIcon class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ publishedCount }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <StarIcon class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Featured</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ featuredCount }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
            <ZapIcon class="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Breaking News</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ breakingCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="flex items-center gap-2">
          <FilterIcon class="w-5 h-5 text-gray-500" />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
        </div>
        
        <button 
          @click="setFilter('all')"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            filter === 'all' 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          ]"
        >
          All Articles
        </button>
        
        <button 
          @click="setFilter('published')"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            filter === 'published' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          ]"
        >
          Published
        </button>
        
        <button 
          @click="setFilter('featured')"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            filter === 'featured' 
              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          ]"
        >
          Featured
        </button>
        
        <button 
          @click="setFilter('breaking')"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            filter === 'breaking' 
              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          ]"
        >
          Breaking News
        </button>
        
        <button 
          @click="setFilter('draft')"
          :class="[
            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            filter === 'draft' 
              ? 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          ]"
        >
          Draft
        </button>
      </div>
    </div>

    <!-- Articles Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="article in filteredArticles" 
        :key="article.id" 
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 group"
      >
        <!-- Image Container -->
        <div class="relative">
          <img 
            v-if="article.featured_image_url" 
            :src="article.featured_image_url" 
            class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200" 
            :alt="article.title"
          />
          <div 
            v-else 
            class="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center"
          >
            <NewspaperIcon class="w-12 h-12 text-gray-400" />
          </div>
          
          <!-- Status Badges -->
          <div class="absolute top-3 left-3 flex flex-wrap gap-2">
            <span 
              v-if="article.is_breaking" 
              class="inline-flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full"
            >
              <ZapIcon class="w-3 h-3" />
              Breaking
            </span>
            
            <span 
              v-if="article.is_featured" 
              class="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full"
            >
              <StarIcon class="w-3 h-3" />
              Featured
            </span>
            
            <span 
              v-if="article.is_published" 
              class="inline-flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full"
            >
              <CheckCircleIcon class="w-3 h-3" />
              Published
            </span>
            
            <span 
              v-else 
              class="inline-flex items-center gap-1 px-2 py-1 bg-gray-500 text-white text-xs font-medium rounded-full"
            >
              <ClockIcon class="w-3 h-3" />
              Draft
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <router-link :to="{ name: 'NewNews', params: { id: article.id } }">
              <button class="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <EditIcon class="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </button>
            </router-link>
            
            <button 
              @click="deleteArticle(article.id, article.title)"
              class="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <TrashIcon class="w-4 h-4 text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6">
          <div class="flex items-start justify-between mb-3">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {{ article.title }}
            </h3>
          </div>
          
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
            {{ article.excerpt || article.summary }}
          </p>
          
          <!-- Tags -->
          <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-1 mb-4">
            <span 
              v-for="tag in article.tags.slice(0, 3)" 
              :key="tag" 
              class="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full"
            >
              {{ tag }}
            </span>
            <span 
              v-if="article.tags.length > 3" 
              class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
            >
              +{{ article.tags.length - 3 }}
            </span>
          </div>
          
          <!-- Stats and Meta -->
          <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-1">
                <EyeIcon class="h-4 w-4" />
                {{ article.views_count || 0 }}
              </div>
              <div class="flex items-center gap-1">
                <HeartIcon class="h-4 w-4" />
                {{ article.likes_count || 0 }}
              </div>
              <div class="flex items-center gap-1">
                <ShareIcon class="h-4 w-4" />
                {{ article.shares_count || 0 }}
              </div>
            </div>
            <div class="flex flex-col items-end">
              <span class="text-xs">{{ formatDate(article.published_at || article.created_at) }}</span>
              <span v-if="article.category" class="text-xs text-blue-600 dark:text-blue-400">{{ article.category.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Articles Message -->
    <div v-if="filteredArticles.length === 0" class="text-center py-12">
      <NewspaperIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No articles found</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">
        {{ filter === 'all' ? 'Get started by creating your first article.' : `No articles match the "${filter}" filter.` }}
      </p>
      <router-link :to="{ name: 'NewNews' }" v-if="filter === 'all'">
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors">
          <PlusIcon class="w-5 h-5" />
          Create Article
        </button>
      </router-link>
    </div>

    <!-- Loading State -->
    <div v-if="loading === 'fetcharticles'" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { 
  PlusIcon, 
  EyeIcon, 
  HeartIcon, 
  ShareIcon,
  EditIcon,
  TrashIcon,
  StarIcon,
  ZapIcon,
  CheckCircleIcon,
  ClockIcon,
  NewspaperIcon,
  FilterIcon
} from 'lucide-vue-next';

const store = useStore();

// Computed properties
const articles = computed(() => store.getters.articles || { data: [] });
const loading = computed(() => store.getters.loading);

// Reactive data
const currentPage = ref(1);
const per_page = ref(20);
const filter = ref('all');

// Computed stats
const publishedCount = computed(() => 
  articles.value.data?.filter(article => article.is_published).length || 0
);

const featuredCount = computed(() => 
  articles.value.data?.filter(article => article.is_featured).length || 0
);

const breakingCount = computed(() => 
  articles.value.data?.filter(article => article.is_breaking).length || 0
);

// Filtered articles
const filteredArticles = computed(() => {
  if (!articles.value.data) return [];
  
  switch (filter.value) {
    case 'published':
      return articles.value.data.filter(article => article.is_published);
    case 'featured':
      return articles.value.data.filter(article => article.is_featured);
    case 'breaking':
      return articles.value.data.filter(article => article.is_breaking);
    case 'draft':
      return articles.value.data.filter(article => !article.is_published);
    default:
      return articles.value.data;
  }
});

// Methods
const fetchTrendingArticles = async () => {
  try {
    let data = {
      per_page: per_page.value,
    }
    let page = currentPage.value;
    await store.dispatch('fetcharticles', { data, page });
  } catch (error) {
    console.error('Error fetching trending articles:', error);
    store.dispatch('template_play_error_file', 'Failed to load articles');
  }
};

const setFilter = (newFilter) => {
  filter.value = newFilter;
};

const deleteArticle = async (articleId, articleTitle) => {
  if (confirm(`Are you sure you want to delete "${articleTitle}"? This action cannot be undone.`)) {
    try {
      await store.dispatch('deletearticle', articleId);
      store.dispatch('template_play_success_file', 'Article deleted successfully');
      // Refresh the articles list
      await fetchTrendingArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      store.dispatch('template_play_error_file', 'Failed to delete article');
    }
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Lifecycle
onMounted(() => {
  fetchTrendingArticles();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>