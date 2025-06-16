<template>
    <div class="min-h-screen bg-slate-900 pt-20">
      <!-- Hero Section -->
      <div class="bg-gradient-to-r from-slate-800 to-slate-900 py-12">
        <div class="container mx-auto px-4">
          <div class="text-center">
            <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
              Latest <span class="text-capital-yellow">News</span>
            </h1>
            <p class="text-slate-300 text-lg">Stay updated with the latest news and updates from Capital FM</p>
          </div>
        </div>
      </div>
  
      <div class="container mx-auto px-4 py-8">
        <!-- Search and Filters -->
        <div class="mb-8">
          <div class="flex flex-col md:flex-row gap-4 mb-6">
            <!-- Search Bar -->
            <div class="relative flex-1">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                v-model="searchQuery"
                @input="debounceSearch"
                type="text"
                placeholder="Search news articles..."
                class="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-capital-blue focus:border-transparent"
              />
            </div>
            
            <!-- Filter Toggle -->
            <button
              @click="showFilters = !showFilters"
              class="px-6 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <Filter class="w-5 h-5" />
              Filters
              <ChevronDown class="w-4 h-4 transition-transform" :class="{ 'rotate-180': showFilters }" />
            </button>
          </div>
  
          <!-- Filters Panel -->
          <div v-if="showFilters" class="bg-slate-800/50 rounded-lg p-6 mb-6 border border-slate-700">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <!-- Category Filter -->
              <div>
                <label class="block text-sm font-medium text-white mb-2">Category</label>
                <select
                  v-model="filters.category_id"
                  @change="applyFilters"
                  class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-capital-blue"
                >
                  <option value="">All Categories</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
  
              <!-- Order By -->
              <div>
                <label class="block text-sm font-medium text-white mb-2">Sort By</label>
                <select
                  v-model="filters.order_by"
                  @change="applyFilters"
                  class="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-capital-blue"
                >
                  <option value="created_at">Latest</option>
                  <option value="published_at">Published Date</option>
                  <option value="views">Most Viewed</option>
                  <option value="priority">Priority</option>
                </select>
              </div>
  
              <!-- Featured/Breaking Toggles -->
              <div>
                <label class="block text-sm font-medium text-white mb-2">Type</label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      v-model="filters.is_featured"
                      @change="applyFilters"
                      type="checkbox"
                      class="w-4 h-4 text-capital-blue bg-slate-700 border-slate-600 rounded focus:ring-capital-blue"
                    />
                    <span class="ml-2 text-white text-sm">Featured Only</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="filters.is_breaking"
                      @change="applyFilters"
                      type="checkbox"
                      class="w-4 h-4 text-capital-red bg-slate-700 border-slate-600 rounded focus:ring-capital-red"
                    />
                    <span class="ml-2 text-white text-sm">Breaking News</span>
                  </label>
                </div>
              </div>
  
              <!-- Clear Filters -->
              <div class="flex items-end">
                <button
                  @click="clearFilters"
                  class="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
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
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-capital-blue"></div>
        </div>
  
        <!-- News Content -->
        <div v-else-if="news && news.data && news.data.length > 0">
          <!-- Results Info -->
          <div class="flex items-center justify-between mb-6">
            <div class="text-slate-400">
              Showing {{ news.data.length }} of {{ news.total }} articles
            </div>
            <div class="text-slate-400">
              Page {{ news.page }} of {{ news.pages }}
            </div>
          </div>
  
          <!-- Featured/Breaking News Section -->
          <div v-if="featuredNews.length > 0" class="mb-12">
            <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <span class="w-2 h-2 bg-capital-red rounded-full animate-pulse"></span>
              Breaking & Featured News
            </h2>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <article 
                v-for="article in featuredNews.slice(0, 2)" 
                :key="article.id"
                class="bg-slate-800/70 rounded-xl overflow-hidden hover:bg-slate-800 transition-all duration-300 group cursor-pointer"
              >
                <div class="relative">
                  <img 
                    :src="article.featured_image_url" 
                    :alt="article.title"
                    class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                  
                  <!-- Breaking Badge -->
                  <div v-if="article.is_breaking" class="absolute top-4 left-4">
                    <span class="bg-capital-red px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                      <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                      Breaking
                    </span>
                  </div>
                  
                  <!-- Featured Badge -->
                  <div v-if="article.is_featured" class="absolute top-4 right-4">
                    <span class="bg-capital-yellow px-3 py-1 rounded-full text-xs font-bold text-black uppercase tracking-wider">
                      Featured
                    </span>
                  </div>
  
                  <!-- Article Info Overlay -->
                  <div class="absolute bottom-0 left-0 right-0 p-6">
                    <div class="flex items-center gap-4 mb-3 text-sm text-slate-300">
                      <span class="bg-slate-800/80 px-2 py-1 rounded text-xs backdrop-blur" :style="{ color: article.category?.color || '#64748b' }">
                        {{ article.category?.name || 'News' }}
                      </span>
                      <span class="flex items-center gap-1">
                        <Calendar class="w-3 h-3" />
                        {{ formatDate(article.published_at) }}
                      </span>
                      <span class="flex items-center gap-1">
                        <Clock class="w-3 h-3" />
                        {{ article.reading_time }}min
                      </span>
                    </div>
                    
                    <router-link :to="{name: 'news_details', params: {id: article.slug}}" class="text-xl font-bold text-white mb-3 group-hover:text-capital-blue transition-colors line-clamp-2">
                      {{ article.title }}
                    </router-link>
                    
                    <p class="text-slate-300 mb-4 line-clamp-2">{{ article.excerpt }}</p>
                    
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <img :src="article.author?.image_url" :alt="article.author?.name" class="w-8 h-8 rounded-full">
                        <span class="text-sm text-slate-300">{{ article.author?.name }}</span>
                      </div>
                      
                      <div class="flex items-center gap-4 text-sm text-slate-400">
                        <span class="flex items-center gap-1">
                          <Eye class="w-4 h-4" />
                          {{ article.views_count }}
                        </span>
                        <span class="flex items-center gap-1">
                          <Heart class="w-4 h-4" />
                          {{ article.likes_count }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
  
          <!-- All News Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <article 
              v-for="article in news.data" 
              :key="article.id"
              class="bg-slate-800/50 rounded-xl overflow-hidden hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 group cursor-pointer"
            >
              <div class="relative">
                <img 
                  :src="article.featured_image_url" 
                  :alt="article.title"
                  class="w-full h-48 object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                
                <!-- Badges -->
                <div class="absolute top-3 left-3 flex gap-2">
                  <span v-if="article.is_breaking" class="bg-capital-red px-2 py-1 rounded text-xs font-bold text-white uppercase">
                    Breaking
                  </span>
                  <span v-if="article.is_featured" class="bg-capital-yellow px-2 py-1 rounded text-xs font-bold text-black uppercase">
                    Featured
                  </span>
                </div>
  
                <!-- Quick Actions -->
                <div class="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button class="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70">
                    <Bookmark class="w-4 h-4" />
                  </button>
                  <button class="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70">
                    <Share2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div class="p-4">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-xs px-2 py-1 rounded" 
                        :style="{ 
                          backgroundColor: (article.category?.color || '#64748b') + '20', 
                          color: article.category?.color || '#64748b' 
                        }">
                    {{ article.category?.name || 'News' }}
                  </span>
                  <span class="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar class="w-3 h-3" />
                    {{ formatDate(article.published_at) }}
                  </span>
                </div>
                
                <router-link :to="{name: 'news_details', params: {id: article.slug}}" class="text-lg font-bold text-white mb-2 group-hover:text-capital-blue transition-colors line-clamp-2">
                  {{ article.title }}
                </router-link>
                
                <p class="text-slate-300 text-sm mb-3 line-clamp-2">{{ article.excerpt }}</p>
                
                <div class="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <div class="flex items-center gap-2">
                    <img :src="article.author?.image_url" :alt="article.author?.name" class="w-6 h-6 rounded-full">
                    <span>{{ article.author?.name }}</span>
                  </div>
                  
                  <div class="flex items-center gap-3">
                    <span class="flex items-center gap-1">
                      <Eye class="w-3 h-3" />
                      {{ article.views_count }}
                    </span>
                    <span class="flex items-center gap-1">
                      <Clock class="w-3 h-3" />
                      {{ article.reading_time }}min
                    </span>
                  </div>
                </div>
                
                <!-- Tags -->
                <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-1">
                  <span 
                    v-for="tag in article.tags.slice(0, 3)" 
                    :key="tag"
                    class="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded hover:bg-slate-600 cursor-pointer"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>
            </article>
          </div>
  
          <!-- Pagination -->
          <div v-if="news.pages > 1" class="flex justify-center items-center gap-4 mt-8">
            <button 
              @click="changePage(news.page - 1)"
              :disabled="news.page <= 1"
              class="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
            >
              Previous
            </button>
            
            <div class="flex items-center gap-2">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                class="w-10 h-10 rounded-lg transition-colors"
                :class="page === news.page ? 'bg-capital-blue text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="changePage(news.page + 1)"
              :disabled="news.page >= news.pages"
              class="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
  
        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <Newspaper class="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 class="text-xl font-bold text-white mb-2">No News Available</h3>
          <p class="text-slate-400">
            {{ searchQuery ? `No results found for "${searchQuery}"` : 'Check back later for the latest updates.' }}
          </p>
          <button 
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="mt-4 px-4 py-2 bg-capital-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useStore } from 'vuex';
  import { 
    Search, Filter, Calendar, Clock, Eye, Heart, Share2, Bookmark, 
    ChevronDown, X, Newspaper, User 
  } from 'lucide-vue-next';
  
  const store = useStore();
  const news = computed(() => store.getters.news);
  const station = computed(() => store.getters.station);
  const isLoading = ref(false);
  const showFilters = ref(false);
  
  // Search and filter states
  const searchQuery = ref('');
  const searchTimeout = ref(null);
  
  const filters = ref({
    search: '',
    category_id: '',
    author_id: '',
    station_id: station.value.id,
    is_featured: false,
    is_breaking: false,
    order_by: 'created_at',
    page: 1,
    per_page: 12
  });
  
  // Mock categories - replace with actual data from your store
  const categories = ref([
    { id: '1', name: 'Politics', color: '#ef4444' },
    { id: '2', name: 'Entertainment', color: '#f59e0b' },
    { id: '3', name: 'Sports', color: '#10b981' },
    { id: '4', name: 'Technology', color: '#3b82f6' }
  ]);
  
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
    
    // Show first page, current page and surrounding pages, last page
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  });
  
  // Methods
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
      station_id: station.value.id,
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
    let data = {
        ...filters.value,
        station_id: station.value.id,
    }
    try {
      await store.dispatch('fetch_user_news', data);
      // Scroll to top of news section
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to fetch news:', err);
    } finally {
      isLoading.value = false;
    }
  };
  
  const get_user_news = async () => {
    isLoading.value = true;
    let data ={
        ...filters.value,
        station_id: station.value.id,
    }
    try {
      await store.dispatch('fetch_user_news', data);
    } catch (err) {
      console.error('Failed to fetch user news:', err);
    } finally {
      isLoading.value = false;
    }
  };
  
  onMounted(() => {
    get_user_news();
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