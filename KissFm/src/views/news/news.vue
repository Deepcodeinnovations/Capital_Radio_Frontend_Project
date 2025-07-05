<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Breaking News" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/80"></div>
      </div>

      <!-- Floating background elements -->
      <div class="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500 rounded-full blur-3xl animate-gentle-float"></div>
        <div class="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-600 rounded-full blur-3xl animate-gentle-float-delayed"></div>
        <div class="absolute top-1/2 right-1/3 w-48 h-48 bg-pink-400 rounded-full blur-3xl animate-gentle-float"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 container mx-auto px-6 text-center">
        <!-- Hero Badge -->
        <div class="inline-flex items-center justify-center mb-8">
          <div class="h-px w-12 bg-pink-500"></div>
          <span class="mx-4 text-pink-400 font-bold tracking-wider text-sm uppercase">News & Updates</span>
          <div class="h-px w-12 bg-purple-600"></div>
        </div>

        <!-- Main Heading -->
        <h1 class="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
          Latest <span class="text-pink-500">News</span>
        </h1>

        <!-- Subtitle -->
        <p class="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
          Stay updated with breaking news, entertainment updates, and exclusive stories from KIIS 100.9
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            @click="togglePlayPause"
            :disabled="isLoading"
            class="bg-pink-500 hover:bg-pink-600 px-8 py-4 rounded-2xl text-white font-black flex items-center space-x-3 transition-all duration-300 transform hover:scale-105"
          >
            <div v-if="isLoading" class="w-5 h-5 border-2 rounded-full border-white border-t-transparent animate-spin"></div>
            <Volume2 v-else-if="isPlaying" :size="20" class="animate-bounce" />
            <Play v-else :size="20" />
            <span class="tracking-wide" v-if="isLoading">CONNECTING</span>
            <span class="tracking-wide" v-else-if="isPlaying">LISTENING LIVE</span>
            <span class="tracking-wide" v-else>TUNE IN NOW</span>
          </button>
          
          <button 
            @click="scrollToNews"
            class="bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          >
            <span class="tracking-wide">BROWSE NEWS</span>
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
    <div class="relative overflow-hidden bg-white" id="news-content">
      <!-- Background decoration -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute top-0 right-0 w-72 h-72 bg-pink-500 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400 rounded-full blur-3xl"></div>
      </div>

      <div class="container mx-auto px-4 md:px-6 relative z-20 py-20">
        <!-- Section Header -->
        <div class="text-center mb-16">
          <div class="inline-flex items-center justify-center mb-6">
            <div class="h-px w-12 bg-pink-500"></div>
            <span class="mx-4 text-gray-800 font-bold tracking-wider text-sm uppercase">Latest Stories</span>
            <div class="h-px w-12 bg-purple-600"></div>
          </div>
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
            Stay <span class="text-pink-500">Informed</span>
          </h2>
          <p class="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Get the latest news and updates from Uganda's premier entertainment and music hub
          </p>
        </div>

        <!-- Search and Filters Section -->
        <div class="mb-12">
          <div class="relative max-w-2xl mx-auto mb-8">
            <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-500 w-5 h-5" />
            <input
              v-model="searchQuery"
              @input="debounceSearch"
              type="text"
              placeholder="Search news articles..."
              class="w-full pl-12 pr-4 py-4 bg-white border-2 border-pink-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
            />
          </div>

          <!-- Filter Toggle -->
          <div class="flex justify-center mb-6">
            <button
              @click="showFilters = !showFilters"
              class="bg-white hover:bg-gray-50 text-gray-700 font-bold px-6 py-3 rounded-2xl transition-all duration-300 flex items-center gap-2 border-2 border-pink-200 hover:border-pink-300 transform hover:scale-105"
            >
              <Filter class="w-5 h-5 text-pink-500" />
              Filters & Categories
              <ChevronDown class="w-4 h-4 transition-transform text-pink-500" :class="{ 'rotate-180': showFilters }" />
            </button>
          </div>

          <!-- Filters Panel -->
          <div v-if="showFilters" class="relative">
            <div class="absolute -inset-0.5 bg-pink-500 rounded-3xl opacity-20 blur-sm"></div>
            
            <div class="relative bg-white rounded-3xl p-6 mb-8 border-2 border-pink-200 max-w-4xl mx-auto">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <!-- Category Filter -->
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <select
                    v-model="filters.category_id"
                    @change="applyFilters"
                    class="w-full px-3 py-2 bg-white border-2 border-pink-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
                  >
                    <option value="">All Categories</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">
                      {{ category.name }}
                    </option>
                  </select>
                </div>

                <!-- Sort Options -->
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Sort By</label>
                  <select
                    v-model="filters.order_by"
                    @change="applyFilters"
                    class="w-full px-3 py-2 bg-white border-2 border-pink-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
                  >
                    <option value="created_at">Latest</option>
                    <option value="published_at">Published Date</option>
                    <option value="views">Most Viewed</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>

                <!-- Type Filters -->
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-2">Type</label>
                  <div class="space-y-2">
                    <label class="flex items-center">
                      <input
                        v-model="filters.is_featured"
                        @change="applyFilters"
                        type="checkbox"
                        class="w-4 h-4 text-pink-500 bg-white border-pink-300 rounded focus:ring-pink-500"
                      />
                      <span class="ml-2 text-gray-700 text-sm font-semibold">Featured Only</span>
                    </label>
                    <label class="flex items-center">
                      <input
                        v-model="filters.is_breaking"
                        @change="applyFilters"
                        type="checkbox"
                        class="w-4 h-4 text-pink-500 bg-white border-pink-300 rounded focus:ring-pink-500"
                      />
                      <span class="ml-2 text-gray-700 text-sm font-semibold">Breaking News</span>
                    </label>
                  </div>
                </div>

                <!-- Clear Filters -->
                <div class="flex items-end">
                  <button
                    @click="clearFilters"
                    class="w-full px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 border-2 border-pink-200 hover:border-pink-300 font-semibold"
                  >
                    <X class="w-4 h-4" />
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
        </div>

        <!-- News Content -->
        <div v-else-if="news && news.data && news.data.length > 0">
          <!-- Results Info -->
          <div class="flex items-center justify-between mb-8">
            <div class="text-gray-600 font-semibold">
              {{ searchQuery ? `Search results for "${searchQuery}"` : 'Latest News' }} - 
              Showing {{ news.data.length }} of {{ news.total }}
            </div>
            <div class="text-gray-600 font-semibold">
              Page {{ news.page }} of {{ news.pages }}
            </div>
          </div>

          <!-- Breaking & Featured News -->
          <div v-if="featuredNews.length > 0" class="mb-12">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-10 h-10 bg-pink-100 rounded-2xl flex items-center justify-center">
                <Zap class="w-5 h-5 text-pink-500" />
              </div>
              <h3 class="text-2xl font-black text-gray-900">Breaking & Featured</h3>
              <div class="flex-1 h-px bg-pink-500"></div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <article 
                v-for="article in featuredNews.slice(0, 2)" 
                :key="article.id"
                class="relative group cursor-pointer"
                @click="$router.push({name: 'news_details', params: {id: article.slug}})"
              >
                <!-- Border Effect -->
                <div class="absolute -inset-0.5 bg-pink-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                
                <div class="relative bg-white rounded-3xl overflow-hidden border-2 border-pink-100 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 transform hover:scale-105">
                  <div class="relative h-64 overflow-hidden">
                    <img 
                      :src="article.featured_image_url" 
                      :alt="article.title"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div class="absolute inset-0 bg-black/40"></div>
                    
                    <!-- Badges -->
                    <div class="absolute top-4 left-4 flex gap-2">
                      <span v-if="article.is_breaking" class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black bg-pink-500 text-white shadow-lg">
                        <Zap class="w-3 h-3 mr-1" />
                        BREAKING
                      </span>
                      <span v-if="article.is_featured" class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black bg-yellow-500 text-white shadow-lg">
                        <Star class="w-3 h-3 mr-1" />
                        FEATURED
                      </span>
                    </div>

                    <!-- Category -->
                    <div class="absolute bottom-4 left-4">
                      <span class="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-black text-gray-800 border border-pink-200">
                        {{ article.category?.name || 'News' }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="p-6">
                    <h3 class="text-xl font-black text-gray-900 mb-3 group-hover:text-pink-500 transition-all duration-300 line-clamp-2">
                      {{ article.title }}
                    </h3>
                    
                    <p class="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {{ article.excerpt }}
                    </p>
                    
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <div class="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                          <User class="w-4 h-4 text-pink-500" />
                        </div>
                        <div>
                          <p class="text-sm font-bold text-gray-900">
                            {{ article.author?.name || 'KIIS Staff' }}
                          </p>
                          <p class="text-xs text-gray-500 font-semibold">
                            {{ formatDate(article.published_at) }}
                          </p>
                        </div>
                      </div>
                      
                      <div class="flex items-center space-x-4 text-sm text-gray-500">
                        <div class="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full">
                          <Eye class="w-4 h-4" />
                          <span class="font-semibold">{{ article.views_count || 0 }}</span>
                        </div>
                        <div class="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full">
                          <Clock class="w-4 h-4" />
                          <span class="font-semibold">{{ article.reading_time || 2 }}min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <!-- All News Grid -->
          <div class="space-y-6 mb-8">
            <div class="flex items-center gap-3 mb-8">
              <div class="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center">
                <Newspaper class="w-5 h-5 text-purple-600" />
              </div>
              <h3 class="text-2xl font-black text-gray-900">All Stories</h3>
              <div class="flex-1 h-px bg-purple-600"></div>
            </div>
            
            <div 
              v-for="article in news.data" 
              :key="article.id"
              class="relative group cursor-pointer"
              @click="$router.push({name: 'news_details', params: {id: article.slug}})"
            >
              <!-- Border Effect -->
              <div class="absolute -inset-0.5 bg-pink-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              
              <div class="relative bg-white rounded-3xl p-6 border-2 border-pink-100 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 transform hover:scale-[1.02] overflow-hidden">
                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0">
                    <div class="w-24 h-24 rounded-2xl overflow-hidden bg-pink-50">
                      <img :src="article.featured_image_url" :alt="article.title" class="w-full h-full object-cover">
                    </div>
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-3 mb-3">
                      <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black bg-gray-100 text-gray-800 border border-gray-200">
                        {{ article.category?.name || 'News' }}
                      </span>
                      
                      <span v-if="article.is_breaking" class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black bg-pink-100 text-pink-600 border border-pink-200">
                        <Zap class="w-3 h-3 mr-1" />
                        BREAKING
                      </span>
                      
                      <span v-if="article.is_featured" class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black bg-yellow-100 text-yellow-600 border border-yellow-200">
                        <Star class="w-3 h-3 mr-1" />
                        FEATURED
                      </span>
                      
                      <span class="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                        <Calendar class="w-3 h-3" />
                        <span class="font-semibold">{{ formatDate(article.published_at) }}</span>
                      </span>
                    </div>
                    
                    <h3 class="text-lg font-black text-gray-900 mb-2 group-hover:text-pink-500 transition-all duration-300 line-clamp-2">
                      {{ article.title }}
                    </h3>
                    
                    <p class="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {{ article.excerpt }}
                    </p>
                    
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <div class="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                          <User class="w-4 h-4 text-pink-500" />
                        </div>
                        <span class="text-sm text-gray-600 font-bold">
                          {{ article.author?.name || 'KIIS Staff' }}
                        </span>
                      </div>
                      
                      <div class="flex items-center space-x-4 text-sm text-gray-500">
                        <div class="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full">
                          <Eye class="w-4 h-4" />
                          <span class="font-semibold">{{ article.views_count || 0 }}</span>
                        </div>
                        <div class="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full">
                          <Clock class="w-4 h-4" />
                          <span class="font-semibold">{{ article.reading_time || 2 }}min</span>
                        </div>
                        <div class="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full">
                          <Heart class="w-4 h-4" />
                          <span class="font-semibold">{{ article.likes_count || 0 }}</span>
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
              class="px-6 py-3 bg-white border-2 border-pink-200 text-gray-700 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-50 hover:border-pink-300 transition-all duration-300 font-semibold"
            >
              Previous
            </button>
            
            <div class="flex items-center gap-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                class="w-12 h-12 rounded-2xl transition-all duration-300 font-bold"
                :class="page === news.page 
                  ? 'bg-pink-500 text-white shadow-lg' 
                  : 'bg-white border-2 border-pink-200 text-gray-700 hover:bg-pink-50 hover:border-pink-300'"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="changePage(news.page + 1)"
              :disabled="news.page >= news.pages"
              class="px-6 py-3 bg-white border-2 border-pink-200 text-gray-700 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-50 hover:border-pink-300 transition-all duration-300 font-semibold"
            >
              Next
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div class="w-20 h-20 bg-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Newspaper class="w-10 h-10 text-pink-500" />
          </div>
          <h3 class="text-2xl font-black text-gray-900 mb-4">No News Available</h3>
          <p class="text-gray-600 mb-6 leading-relaxed">
            {{ searchQuery ? `No results found for "${searchQuery}"` : 'Check back later for the latest updates from KIIS 100.9.' }}
          </p>
          <button 
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="bg-pink-500 hover:bg-pink-600 text-white font-black px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105"
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
  { id: '1', name: 'Politics', color: '#ec4899' },
  { id: '2', name: 'Entertainment', color: '#8b5cf6' },
  { id: '3', name: 'Sports', color: '#10b981' },
  { id: '4', name: 'Technology', color: '#3b82f6' },
  { id: '5', name: 'Music', color: '#f59e0b' },
  { id: '6', name: 'Lifestyle', color: '#ef4444' }
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
    total_articles: 128,
    breaking_news: 5,
    featured_stories: 12,
    views_today: 2456
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
  if (!dateString) return '';
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

/* Enhanced backdrop blur for better glass effect */
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
}

/* Gentle floating animations */
@keyframes gentle-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

@keyframes gentle-float-delayed {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}

.animate-gentle-float {
  animation: gentle-float 6s ease-in-out infinite;
}

.animate-gentle-float-delayed {
  animation: gentle-float-delayed 7s ease-in-out infinite 2s;
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

/* Enhanced hover effects */
button:hover, .group:hover {
  transform: translateY(-2px);
}

/* Professional shadows */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(244, 114, 182, 0.25);
}

/* Hover effects */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}
</style>