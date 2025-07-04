<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative min-h-[70vh] flex items-center justify-center overflow-hidden" style="margin-top: 5rem !important;">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Breaking News" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/60"></div>
      </div>

      <!-- Clean geometric background -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-10 w-20 h-20 bg-red-600 transform rotate-45"></div>
        <div class="absolute bottom-40 right-20 w-16 h-16 bg-white"></div>
        <div class="absolute top-1/2 left-1/4 w-12 h-12 bg-red-600"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 container mx-auto px-6 text-center">
        <!-- Hero Badge -->
        <div class="inline-block bg-red-600 text-white px-6 py-2 mb-8 transform -rotate-1">
          <span class="font-black text-sm tracking-widest uppercase">NEWS & UPDATES</span>
        </div>

        <!-- Main Heading -->
        <h1 class="text-6xl font-black text-white mb-6 leading-none">
          LATEST
          <span class="block text-red-600">NEWS</span>
        </h1>

        <!-- Subtitle -->
        <p class="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
          Stay updated with breaking news, music updates, and exclusive stories from Beat FM
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            @click="togglePlayPause"
            :disabled="isLoading"
            class="bg-red-600 hover:bg-red-700 text-white font-black px-12 py-4 transition-all duration-300 transform hover:scale-105 shadow-lg border-4 border-red-600"
          >
            <div class="flex items-center justify-center space-x-3">
              <div v-if="isLoading" class="w-5 h-5 border-2 rounded-full border-white border-t-transparent animate-spin"></div>
              <Volume2 v-else-if="isPlaying" :size="20" class="animate-bounce" />
              <Play v-else :size="20" />
              <span class="tracking-widest text-sm" v-if="isLoading">CONNECTING</span>
              <span class="tracking-widest text-sm" v-else-if="isPlaying">LIVE NOW</span>
              <span class="tracking-widest text-sm" v-else>LISTEN LIVE</span>
            </div>
          </button>
          
          <button 
            @click="scrollToNews"
            class="bg-white/10 backdrop-blur-md border-4 border-white text-white font-black px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
          >
            <span class="tracking-widest text-sm">BROWSE NEWS</span>
          </button>
        </div>
      </div>

      <!-- Sharp Bottom Divider -->
      <div class="absolute bottom-0 left-0 w-full overflow-hidden" style="transform: translateY(1px);">
        <svg class="w-full h-auto" preserveAspectRatio="none" viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="newsWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#DC2626;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#000000;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#DC2626;stop-opacity:1" />
            </linearGradient>
          </defs>
          <path d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z" fill="url(#newsWaveGradient)"></path>
          <path d="M0,80 C300,40 600,100 900,80 C1000,70 1100,90 1200,80 L1200,120 L0,120 Z" fill="white" opacity="0.9"></path>
        </svg>
      </div>
    </section>

    <!-- Main Content -->
    <div class="bg-white relative" id="news-content">
      <div class="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <!-- Search and Filters Section -->
        <div class="mb-12">
          <div class="relative max-w-2xl mx-auto mb-8">
            <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              v-model="searchQuery"
              @input="debounceSearch"
              type="text"
              placeholder="SEARCH NEWS ARTICLES..."
              class="w-full pl-12 pr-4 py-4 bg-white border-4 border-black text-black placeholder-gray-500 focus:outline-none focus:border-red-600 font-bold uppercase tracking-wider"
            />
          </div>

          <!-- Filter Toggle -->
          <div class="flex justify-center mb-6">
            <button
              @click="showFilters = !showFilters"
              class="bg-white border-4 border-black text-black font-black px-8 py-4 hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              <Filter class="w-5 h-5" />
              <span class="tracking-widest uppercase">FILTERS & CATEGORIES</span>
              <ChevronDown class="w-4 h-4 transition-transform" :class="{ 'rotate-180': showFilters }" />
            </button>
          </div>

          <!-- Filters Panel -->
          <div v-if="showFilters" class="bg-gray-50 border-4 border-black p-6 mb-8 max-w-4xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <!-- Category Filter -->
              <div>
                <label class="block text-sm font-black text-black mb-2 uppercase tracking-wider">CATEGORY</label>
                <select
                  v-model="filters.category_id"
                  @change="applyFilters"
                  class="w-full px-3 py-2 bg-white border-2 border-black text-black focus:outline-none focus:border-red-600 font-bold uppercase appearance-none"
                >
                  <option value="">ALL CATEGORIES</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name.toUpperCase() }}
                  </option>
                </select>
              </div>

              <!-- Sort Options -->
              <div>
                <label class="block text-sm font-black text-black mb-2 uppercase tracking-wider">SORT BY</label>
                <select
                  v-model="filters.order_by"
                  @change="applyFilters"
                  class="w-full px-3 py-2 bg-white border-2 border-black text-black focus:outline-none focus:border-red-600 font-bold uppercase appearance-none"
                >
                  <option value="created_at">LATEST</option>
                  <option value="published_at">PUBLISHED DATE</option>
                  <option value="views">MOST VIEWED</option>
                  <option value="priority">PRIORITY</option>
                </select>
              </div>

              <!-- Type Filters -->
              <div>
                <label class="block text-sm font-black text-black mb-2 uppercase tracking-wider">TYPE</label>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input
                      v-model="filters.is_featured"
                      @change="applyFilters"
                      type="checkbox"
                      class="w-4 h-4 text-red-600 bg-white border-2 border-black focus:ring-red-600"
                    />
                    <span class="ml-2 text-black text-sm font-bold uppercase">FEATURED ONLY</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="filters.is_breaking"
                      @change="applyFilters"
                      type="checkbox"
                      class="w-4 h-4 text-red-600 bg-white border-2 border-black focus:ring-red-600"
                    />
                    <span class="ml-2 text-black text-sm font-bold uppercase">BREAKING NEWS</span>
                  </label>
                </div>
              </div>

              <!-- Clear Filters -->
              <div class="flex items-end">
                <button
                  @click="clearFilters"
                  class="w-full px-4 py-2 bg-white border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-black transition-all uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <X class="w-4 h-4" />
                  CLEAR ALL
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="w-12 h-12 border-4 border-gray-300 border-t-red-600 animate-spin"></div>
        </div>

        <!-- News Content -->
        <div v-else-if="news && news.data && news.data.length > 0">
          <!-- Results Info -->
          <div class="flex items-center justify-between mb-8">
            <div class="text-black font-black uppercase tracking-wider">
              {{ searchQuery ? `SEARCH: "${searchQuery.toUpperCase()}"` : 'LATEST NEWS' }} - 
              {{ news.data.length }} OF {{ news.total }}
            </div>
            <div class="text-black font-black uppercase tracking-wider">
              PAGE {{ news.page }} / {{ news.pages }}
            </div>
          </div>

          <!-- Breaking & Featured News -->
          <div v-if="featuredNews.length > 0" class="mb-12">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-12 h-12 bg-red-600 flex items-center justify-center">
                <Zap class="w-6 h-6 text-white" />
              </div>
              <h2 class="text-3xl font-black text-black uppercase tracking-wider">BREAKING & FEATURED</h2>
              <div class="flex-1 h-1 bg-red-600"></div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <article 
                v-for="article in featuredNews.slice(0, 2)" 
                :key="article.id"
                class="bg-white border-4 border-black overflow-hidden transition-all hover:border-red-600 group cursor-pointer transform hover:scale-105"
                @click="$router.push({name: 'news_details', params: {id: article.slug}})"
              >
                <div class="relative h-64 overflow-hidden">
                  <img 
                    :src="article.featured_image_url" 
                    :alt="article.title"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 filter grayscale group-hover:grayscale-0"
                  />
                  
                  <!-- Badges -->
                  <div class="absolute top-4 left-4 flex gap-2">
                    <span v-if="article.is_breaking" class="bg-red-600 text-white px-3 py-1 text-xs font-black tracking-wider uppercase flex items-center gap-1">
                      <Zap class="w-3 h-3" />
                      BREAKING
                    </span>
                    <span v-if="article.is_featured" class="bg-black text-white px-3 py-1 text-xs font-black tracking-wider uppercase flex items-center gap-1">
                      <Star class="w-3 h-3" />
                      FEATURED
                    </span>
                  </div>

                  <!-- Category -->
                  <div class="absolute bottom-4 left-4">
                    <span class="bg-white text-black px-3 py-1 text-xs font-black tracking-wider uppercase border-2 border-black">
                      {{ article.category?.name || 'NEWS' }}
                    </span>
                  </div>
                </div>
                
                <div class="p-6">
                  <h3 class="text-xl font-black text-black mb-3 group-hover:text-red-600 transition-colors line-clamp-2 uppercase tracking-wide">
                    {{ article.title }}
                  </h3>
                  
                  <p class="text-gray-600 mb-4 line-clamp-2 text-sm">
                    {{ article.excerpt }}
                  </p>
                  
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <div class="w-8 h-8 border-2 border-black bg-red-600 flex items-center justify-center">
                        <User class="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p class="text-sm font-black text-black uppercase">
                          {{ article.author?.name || 'STAFF WRITER' }}
                        </p>
                        <p class="text-xs text-gray-600 font-bold">
                          {{ formatDate(article.published_at) }}
                        </p>
                      </div>
                    </div>
                    
                    <div class="flex items-center space-x-4 text-sm text-gray-600 font-bold">
                      <div class="flex items-center space-x-1">
                        <Eye class="w-4 h-4" />
                        <span>{{ article.views_count || 0 }}</span>
                      </div>
                      <div class="flex items-center space-x-1">
                        <Clock class="w-4 h-4" />
                        <span>{{ article.reading_time || 2 }}MIN</span>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>

          <!-- All News List -->
          <div class="space-y-4 mb-8">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-12 h-12 bg-black flex items-center justify-center">
                <Newspaper class="w-6 h-6 text-white" />
              </div>
              <h2 class="text-3xl font-black text-black uppercase tracking-wider">ALL STORIES</h2>
              <div class="flex-1 h-1 bg-black"></div>
            </div>
            
            <div 
              v-for="article in news.data" 
              :key="article.id"
              class="bg-white border-2 border-black p-6 transition-all hover:border-red-600 group cursor-pointer transform hover:scale-105"
              @click="$router.push({name: 'news_details', params: {id: article.slug}})"
            >
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-24 h-24 border-2 border-black overflow-hidden">
                    <img 
                      :src="article.featured_image_url" 
                      :alt="article.title" 
                      class="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3 mb-2">
                    <span class="bg-red-600 text-white px-3 py-1 text-xs font-black tracking-wider uppercase">
                      {{ article.category?.name || 'NEWS' }}
                    </span>
                    
                    <span v-if="article.is_breaking" class="bg-red-600 text-white px-3 py-1 text-xs font-black tracking-wider uppercase flex items-center gap-1">
                      <Zap class="w-3 h-3" />
                      BREAKING
                    </span>
                    
                    <span v-if="article.is_featured" class="bg-black text-white px-3 py-1 text-xs font-black tracking-wider uppercase flex items-center gap-1">
                      <Star class="w-3 h-3" />
                      FEATURED
                    </span>
                    
                    <span class="text-xs text-gray-600 font-bold flex items-center gap-1 uppercase">
                      <Calendar class="w-3 h-3" />
                      {{ formatDate(article.published_at) }}
                    </span>
                  </div>
                  
                  <h3 class="text-lg font-black text-black mb-2 group-hover:text-red-600 transition-colors line-clamp-2 uppercase tracking-wide">
                    {{ article.title }}
                  </h3>
                  
                  <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                    {{ article.excerpt }}
                  </p>
                  
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <div class="w-6 h-6 border border-black bg-red-600 flex items-center justify-center">
                        <User class="w-3 h-3 text-white" />
                      </div>
                      <span class="text-sm font-black text-black uppercase">
                        {{ article.author?.name || 'STAFF WRITER' }}
                      </span>
                    </div>
                    
                    <div class="flex items-center space-x-4 text-sm text-gray-600 font-bold">
                      <div class="flex items-center space-x-1">
                        <Eye class="w-4 h-4" />
                        <span>{{ article.views_count || 0 }}</span>
                      </div>
                      <div class="flex items-center space-x-1">
                        <Clock class="w-4 h-4" />
                        <span>{{ article.reading_time || 2 }}MIN</span>
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

          <!-- Pagination -->
          <div v-if="news.pages > 1" class="flex justify-center items-center gap-2 mt-12">
            <button 
              @click="changePage(news.page - 1)"
              :disabled="news.page <= 1"
              class="px-6 py-3 bg-white border-2 border-black text-black font-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-all uppercase tracking-wider"
            >
              PREVIOUS
            </button>
            
            <div class="flex items-center gap-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                class="w-12 h-12 transition-all font-black border-2"
                :class="page === news.page 
                  ? 'bg-red-600 text-white border-red-600' 
                  : 'bg-white border-black text-black hover:bg-black hover:text-white'"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="changePage(news.page + 1)"
              :disabled="news.page >= news.pages"
              class="px-6 py-3 bg-white border-2 border-black text-black font-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-all uppercase tracking-wider"
            >
              NEXT
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div class="w-20 h-20 bg-gray-200 border-4 border-black flex items-center justify-center mx-auto mb-6">
            <Newspaper class="w-10 h-10 text-gray-400" />
          </div>
          <h3 class="text-2xl font-black text-black mb-4 uppercase tracking-wider">NO NEWS AVAILABLE</h3>
          <p class="text-gray-600 mb-6 font-bold">
            {{ searchQuery ? `NO RESULTS FOR "${searchQuery.toUpperCase()}"` : 'CHECK BACK LATER FOR THE LATEST UPDATES.' }}
          </p>
          <button 
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="px-8 py-4 bg-red-600 text-white font-black hover:bg-red-700 transition-all border-4 border-red-600 uppercase tracking-wider"
          >
            CLEAR FILTERS
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
    return `${Math.floor((now - date) / (1000 * 60))} MIN AGO`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} HR AGO`;
  } else if (diffInHours < 48) {
    return 'YESTERDAY';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    }).toUpperCase();
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

/* Override rounded corners for brutalist design */
* {
  border-radius: 0 !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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

/* Ensure sharp geometric shapes */
button, div, input, select {
  border-radius: 0 !important;
}
</style>