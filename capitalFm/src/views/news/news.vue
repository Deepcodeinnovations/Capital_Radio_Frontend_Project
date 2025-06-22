<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative min-h-[70vh] flex items-center justify-center overflow-hidden" style="margin-top: -5rem !important;">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Breaking News" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"></div>
      </div>

      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden opacity-20">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-500 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
        <div class="absolute top-1/2 right-1/3 w-48 h-48 bg-blue-500 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 container mx-auto px-6 text-center">
        <!-- Hero Badge -->
        <div class="inline-flex items-center justify-center mb-8">
          <div class="h-px w-12 bg-red-500"></div>
          <span class="mx-4 text-red-400 font-bold tracking-wider text-sm uppercase">News & Updates</span>
          <div class="h-px w-12 bg-red-500"></div>
        </div>

        <!-- Main Heading -->
        <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Latest <span class="text-yellow-400">News</span>
        </h1>

        <!-- Subtitle -->
        <p class="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
          Stay updated with breaking news, entertainment updates, and exclusive stories from Capital FM
        </p>

    

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            @click="togglePlayPause"
            :disabled="isLoading"
            class="relative group overflow-hidden rounded-2xl"
          >
            <div class="absolute -inset-0.5 bg-gradient-to-r from-[#F8CB00] via-red-500 to-blue-500 rounded-2xl blur opacity-60 group-hover:opacity-80 transition duration-300"></div>
            <div class="relative bg-gradient-to-r from-[#F8CB00] to-red-500 px-8 py-4 rounded-2xl text-black font-bold flex items-center space-x-3 transition-all duration-300">
              <div v-if="isLoading" class="w-5 h-5 border-2 rounded-full border-black border-t-transparent animate-spin"></div>
              <Volume2 v-else-if="isPlaying" :size="20" class="animate-bounce" />
              <Play v-else :size="20" />
              <span class="tracking-wide" v-if="isLoading">CONNECTING</span>
              <span class="tracking-wide" v-else-if="isPlaying">LISTENING LIVE</span>
              <span class="tracking-wide" v-else>TUNE IN NOW</span>
            </div>
          </button>
          
          <button 
            @click="scrollToNews"
            class="bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300"
          >
            <span class="tracking-wide">Browse News</span>
          </button>
        </div>
      </div>

      <!-- Bottom Wave Divider -->
      <div class="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="w-full h-16">
          <path fill="white" d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,31,17,94.98,30.44c64.64,13.91,93.29,29.88,150.17,38.07,65.88,9.2,165.63,17.05,240.88,12.55Z" />
        </svg>
      </div>
    </section>

    <!-- Main Content -->
    <div class="bg-white relative" id="news-content">
      <!-- Floating background elements -->
      <div class="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
        <div class="absolute top-1/4 left-1/5 w-32 h-32 bg-red-500 rounded-full blur-2xl animate-float"></div>
        <div class="absolute bottom-1/3 right-1/5 w-40 h-40 bg-yellow-500 rounded-full blur-3xl animate-float" style="animation-delay: 2s;"></div>
        <div class="absolute top-1/2 left-1/2 w-24 h-24 bg-blue-500 rounded-full blur-xl animate-pulse-slow"></div>
      </div>

      <div class="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <!-- Search and Filters Section -->
        <div class="mb-12">
          <div class="relative max-w-2xl mx-auto mb-8">
            <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              v-model="searchQuery"
              @input="debounceSearch"
              type="text"
              placeholder="Search news articles..."
              class="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
            />
          </div>

          <!-- Filter Toggle -->
          <div class="flex justify-center mb-6">
            <button
              @click="showFilters = !showFilters"
              class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-sm"
            >
              <Filter class="w-5 h-5" />
              Filters & Categories
              <ChevronDown class="w-4 h-4 transition-transform" :class="{ 'rotate-180': showFilters }" />
            </button>
          </div>

          <!-- Filters Panel -->
          <div v-if="showFilters" class="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200 max-w-4xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <!-- Category Filter -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  v-model="filters.category_id"
                  @change="applyFilters"
                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">All Categories</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <!-- Sort Options -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  v-model="filters.order_by"
                  @change="applyFilters"
                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="created_at">Latest</option>
                  <option value="published_at">Published Date</option>
                  <option value="views">Most Viewed</option>
                  <option value="priority">Priority</option>
                </select>
              </div>

              <!-- Type Filters -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      v-model="filters.is_featured"
                      @change="applyFilters"
                      type="checkbox"
                      class="w-4 h-4 text-red-500 bg-white border-gray-300 rounded focus:ring-red-500"
                    />
                    <span class="ml-2 text-gray-700 text-sm">Featured Only</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="filters.is_breaking"
                      @change="applyFilters"
                      type="checkbox"
                      class="w-4 h-4 text-red-500 bg-white border-gray-300 rounded focus:ring-red-500"
                    />
                    <span class="ml-2 text-gray-700 text-sm">Breaking News</span>
                  </label>
                </div>
              </div>

              <!-- Clear Filters -->
              <div class="flex items-end">
                <button
                  @click="clearFilters"
                  class="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <X class="w-4 h-4" />
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="w-12 h-12 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
        </div>

        <!-- News Content -->
        <div v-else-if="news && news.data && news.data.length > 0">
          <!-- Results Info -->
          <div class="flex items-center justify-between mb-8">
            <div class="text-gray-600">
              {{ searchQuery ? `Search results for "${searchQuery}"` : 'Latest News' }} - 
              Showing {{ news.data.length }} of {{ news.total }}
            </div>
            <div class="text-gray-600">
              Page {{ news.page }} of {{ news.pages }}
            </div>
          </div>

          <!-- Breaking & Featured News -->
          <div v-if="featuredNews.length > 0" class="mb-12">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <Zap class="w-5 h-5 text-red-600" />
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Breaking & Featured</h2>
              <div class="flex-1 h-px bg-gradient-to-r from-red-500 to-transparent"></div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <article 
                v-for="article in featuredNews.slice(0, 2)" 
                :key="article.id"
                class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-200 hover:border-red-300 transition-all group cursor-pointer relative"
                @click="$router.push({name: 'news_details', params: {id: article.slug}})"
              >
                <!-- Gradient background on hover -->
                <div class="absolute -inset-1 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-10 transition duration-300"></div>
                
                <div class="relative">
                  <div class="relative h-64 overflow-hidden">
                    <img 
                      :src="article.featured_image_url" 
                      :alt="article.title"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    
                    <!-- Badges -->
                    <div class="absolute top-4 left-4 flex gap-2">
                      <span v-if="article.is_breaking" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <Zap class="w-3 h-3 mr-1" />
                        Breaking
                      </span>
                      <span v-if="article.is_featured" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Star class="w-3 h-3 mr-1" />
                        Featured
                      </span>
                    </div>

                    <!-- Category -->
                    <div class="absolute bottom-4 left-4">
                      <span class="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-800">
                        {{ article.category?.name || 'News' }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors line-clamp-2">
                      {{ article.title }}
                    </h3>
                    
                    <p class="text-gray-600 mb-4 line-clamp-2">
                      {{ article.excerpt }}
                    </p>
                    
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User class="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p class="text-sm font-medium text-gray-900">
                            {{ article.author?.name || 'Staff Writer' }}
                          </p>
                          <p class="text-xs text-gray-500">
                            {{ formatDate(article.published_at) }}
                          </p>
                        </div>
                      </div>
                      
                      <div class="flex items-center space-x-4 text-sm text-gray-500">
                        <div class="flex items-center space-x-1">
                          <Eye class="w-4 h-4" />
                          <span>{{ article.views_count || 0 }}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                          <Clock class="w-4 h-4" />
                          <span>{{ article.reading_time || 2 }}min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <!-- All News Grid -->
          <div class="space-y-4 mb-8">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Newspaper class="w-5 h-5 text-blue-600" />
              </div>
              <h2 class="text-2xl font-bold text-gray-900">All Stories</h2>
              <div class="flex-1 h-px bg-gradient-to-r from-blue-500 to-transparent"></div>
            </div>
            
            <div 
              v-for="article in news.data" 
              :key="article.id"
              class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-red-300 transition-all group cursor-pointer relative overflow-hidden"
              @click="$router.push({name: 'news_details', params: {id: article.slug}})"
            >
              <!-- Gradient background on hover -->
              <div class="absolute -inset-1 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-5 transition duration-300"></div>
              
              <div class="relative">
                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0">
                    <div class="w-24 h-24 rounded-lg overflow-hidden">
                      <img :src="article.featured_image_url" :alt="article.title" class="w-full h-full object-cover">
                    </div>
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-3 mb-2">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {{ article.category?.name || 'News' }}
                      </span>
                      
                      <span v-if="article.is_breaking" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <Zap class="w-3 h-3 mr-1" />
                        Breaking
                      </span>
                      
                      <span v-if="article.is_featured" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Star class="w-3 h-3 mr-1" />
                        Featured
                      </span>
                      
                      <span class="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar class="w-3 h-3" />
                        {{ formatDate(article.published_at) }}
                      </span>
                    </div>
                    
                    <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                      {{ article.title }}
                    </h3>
                    
                    <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                      {{ article.excerpt }}
                    </p>
                    
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <User class="w-3 h-3 text-gray-500" />
                        </div>
                        <span class="text-sm text-gray-600">
                          {{ article.author?.name || 'Staff Writer' }}
                        </span>
                      </div>
                      
                      <div class="flex items-center space-x-4 text-sm text-gray-500">
                        <div class="flex items-center space-x-1">
                          <Eye class="w-4 h-4" />
                          <span>{{ article.views_count || 0 }}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                          <Clock class="w-4 h-4" />
                          <span>{{ article.reading_time || 2 }}min</span>
                        </div>
                        <div class="flex items-center space-x-1">
                          <Heart class="w-4 h-4" />
                          <span>{{ article.likes_count || 0 }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="news.pages > 1" class="flex justify-center items-center gap-2 mt-12">
            <button 
              @click="changePage(news.page - 1)"
              :disabled="news.page <= 1"
              class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            
            <div class="flex items-center gap-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                class="w-10 h-10 rounded-lg transition-colors font-medium"
                :class="page === news.page 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="changePage(news.page + 1)"
              :disabled="news.page >= news.pages"
              class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Newspaper class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">No News Available</h3>
          <p class="text-gray-600 mb-6">
            {{ searchQuery ? `No results found for "${searchQuery}"` : 'Check back later for the latest updates.' }}
          </p>
          <button 
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Clear Filters
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
  Search, Filter, Calendar, Clock, Eye, Heart, ChevronDown, X, 
  Newspaper, User, Play, Volume2, Zap, Star
} from 'lucide-vue-next';

const store = useStore();
const news = computed(() => store.getters.news);
const station = computed(() => store.getters.station);
const isPlaying = computed(() => store.getters.isPlaying);
const isLoading = ref(false);
const showFilters = ref(false);

// Search and filter states
const searchQuery = ref('');
const searchTimeout = ref(null);

const filters = ref({
  search: '',
  category_id: '',
  author_id: '',
  station_id: station.value?.id || 1,
  is_featured: false,
  is_breaking: false,
  order_by: 'created_at',
  page: 1,
  per_page: 12
});

// Categories
const categories = ref([
  { id: '1', name: 'Politics', color: '#ef4444' },
  { id: '2', name: 'Entertainment', color: '#f59e0b' },
  { id: '3', name: 'Sports', color: '#10b981' },
  { id: '4', name: 'Technology', color: '#3b82f6' }
]);

// News stats from API response
const newsStats = computed(() => {
  if (news.value?.metrics) {
    return {
      total_articles: news.value.metrics.total_articles || 0,
      breaking_news: news.value.metrics.breaking_news || 0,
      featured_stories: news.value.metrics.featured_stories || 0,
      views_today: news.value.metrics.views_today || 0
    };
  }
  return {
    total_articles: 0,
    breaking_news: 0,
    featured_stories: 0,
    views_today: 0
  };
});

// Computed properties
const featuredNews = computed(() => {
  if (!news.value?.data) return [];
  return news.value.data.filter(article => article.is_featured || article.is_breaking);
});

const hasActiveFilters = computed(() => {
  return filters.value.search || 
         filters.value.category_id || 
         filters.value.is_featured || 
         filters.value.is_breaking ||
         filters.value.order_by !== 'created_at';
});

const visiblePages = computed(() => {
  if (!news.value?.pages) return [];
  const current = news.value.page;
  const total = news.value.pages;
  const pages = [];
  
  const start = Math.max(1, current - 2);
  const end = Math.min(total, current + 2);
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Methods
const togglePlayPause = async () => {
  isLoading.value = true;
  try {
    await store.dispatch('togglePlayPause');
  } catch (err) {
    console.error('Failed to toggle playback:', err);
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    return `${Math.floor((now - date) / (1000 * 60))} minutes ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`;
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
};

const debounceSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  
  searchTimeout.value = setTimeout(() => {
    filters.value.search = searchQuery.value;
    filters.value.page = 1;
    applyFilters();
  }, 500);
};

const applyFilters = async () => {
  isLoading.value = true;
  try {
    await store.dispatch('fetch_user_news', filters.value);
  } catch (err) {
    console.error('Failed to fetch filtered news:', err);
  } finally {
    isLoading.value = false;
  }
};

const clearFilters = () => {
  searchQuery.value = '';
  filters.value = {
    search: '',
    category_id: '',
    author_id: '',
    station_id: station.value?.id || 1,
    is_featured: false,
    is_breaking: false,
    order_by: 'created_at',
    page: 1,
    per_page: 12
  };
  applyFilters();
};

const changePage = async (page) => {
  if (page < 1 || page > news.value.pages) return;
  
  filters.value.page = page;
  isLoading.value = true;
  const data = {
    ...filters.value,
    station_id: station.value?.id || 1,
  };
  
  try {
    await store.dispatch('fetch_user_news', data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error('Failed to fetch news:', err);
  } finally {
    isLoading.value = false;
  }
};

const scrollToNews = () => {
  document.getElementById('news-content').scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
};

const getUserNews = async () => {
  isLoading.value = true;
  const data = {
    ...filters.value,
    station_id: station.value?.id || 1,
  };
  
  try {
    await store.dispatch('fetch_user_news', data);
  } catch (err) {
    console.error('Failed to fetch user news:', err);
  } finally {
    isLoading.value = false;
  }
};
onMounted(() => {
  getUserNews();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Floating animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Smooth animations */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* Hover effects */
.group:hover .group-hover\:text-red-600 {
  color: rgb(220 38 38);
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Smooth transitions */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>