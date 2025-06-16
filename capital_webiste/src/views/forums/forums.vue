<template>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 pt-32">
      <!-- Hero Section -->
      <div class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div class="max-w-7xl mx-auto px-6 py-12">
          <div class="text-center">
            <h1 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Community <span class="text-blue-600">Forums</span>
            </h1>
            <p class="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Join the discussion and connect with fellow Capital FM listeners across Uganda
            </p>
          </div>
        </div>
      </div>
  
      <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- Search Bar -->
        <div class="mb-8">
          <div class="relative max-w-2xl mx-auto">
            <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              v-model="searchQuery"
              @input="debounceSearch"
              type="text"
              placeholder="Search forum discussions..."
              class="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>
  
        <!-- Forum Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MessageCircle class="w-6 h-6 text-blue-600" />
            </div>
            <div class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ forumStats.total_topics }}</div>
            <div class="text-sm text-slate-600 dark:text-slate-400">Total Topics</div>
          </div>
          
          <div class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users class="w-6 h-6 text-green-600" />
            </div>
            <div class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ forumStats.total_replies }}</div>
            <div class="text-sm text-slate-600 dark:text-slate-400">Total Replies</div>
          </div>
          
          <div class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp class="w-6 h-6 text-purple-600" />
            </div>
            <div class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ forumStats.active_users }}</div>
            <div class="text-sm text-slate-600 dark:text-slate-400">Active Users</div>
          </div>
          
          <div class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
            <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <div class="relative">
                <Users class="w-6 h-6 text-emerald-600" />
                <div class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div class="text-2xl font-bold text-slate-900 dark:text-white mb-1">{{ forumStats.online_now }}</div>
            <div class="text-sm text-slate-600 dark:text-slate-400">Online Now</div>
          </div>
        </div>
  
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="w-12 h-12 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
  
        <!-- Forums Content -->
        <div v-else-if="forums && forums.data && forums.data.length > 0">
          <!-- Results Info -->
          <div class="flex items-center justify-between mb-8">
            <div class="text-slate-600 dark:text-slate-400">
              {{ searchQuery ? `Search results for "${searchQuery}"` : 'All Discussions' }} - 
              Showing {{ forums.data.length }} of {{ forums.total }}
            </div>
            <div class="text-slate-600 dark:text-slate-400">
              Page {{ forums.current_page }} of {{ forums.total_pages }}
            </div>
          </div>
  
          <!-- Pinned Topics -->
          <div v-if="pinnedTopics.length > 0" class="mb-12">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                <Pin class="w-5 h-5 text-yellow-600" />
              </div>
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Pinned Discussions</h2>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div 
                v-for="topic in pinnedTopics" 
                :key="topic.id"
                class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all group cursor-pointer"
                @click="$router.push({name: 'forum_details', params: {id: topic.slug}})"
              >
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center space-x-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                      <Pin class="w-3 h-3 mr-1" />
                      Pinned
                    </span>
                    <span v-if="topic.is_hot" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                      <Flame class="w-3 h-3 mr-1" />
                      Hot
                    </span>
                  </div>
                  
                  <div class="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                    <div class="flex items-center space-x-1">
                      <Eye class="w-4 h-4" />
                      <span>{{ topic.views_count || 0 }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <MessageCircle class="w-4 h-4" />
                      <span>{{ topic.comments_count || 0 }}</span>
                    </div>
                  </div>
                </div>
                
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {{ topic.title }}
                </h3>
                
                <p class="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                  {{ topic.body }}
                </p>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <User class="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div>
                      <p class="text-sm font-medium text-slate-900 dark:text-white">
                        {{ topic.creator?.name || 'Anonymous' }}
                      </p>
                      <p class="text-xs text-slate-500 dark:text-slate-400">
                        {{ formatDate(topic.created_at) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Regular Topics -->
          <div class="space-y-4 mb-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <MessageCircle class="w-5 h-5 text-blue-600" />
              </div>
              <h2 class="text-2xl font-bold text-slate-900 dark:text-white">All Discussions</h2>
            </div>
            
            <div 
              v-for="topic in regularTopics" 
              :key="topic.id"
              class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all group cursor-pointer"
              @click="$router.push({name: 'forum_details', params: {id: topic.slug}})"
            >
              <div class="flex items-start space-x-4">
                <!-- Topic Icon -->
                <div class="flex-shrink-0 mt-1">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center"
                       :class="topic.is_hot ? 'bg-red-100 dark:bg-red-900/20 text-red-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'">
                    <MessageCircle class="w-6 h-6" />
                  </div>
                </div>
  
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3 mb-2">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                      General Discussion
                    </span>
                    
                    <span v-if="topic.is_hot" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                      <Flame class="w-3 h-3 mr-1" />
                      Hot
                    </span>
                  </div>
                  
                  <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {{ topic.title }}
                  </h3>
                  
                  <p class="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
                    {{ topic.body }}
                  </p>
                  
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <User class="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div>
                        <p class="text-sm font-medium text-slate-900 dark:text-white">
                          {{ topic.creator?.name || 'Anonymous' }}
                        </p>
                        <p class="text-xs text-slate-500 dark:text-slate-400">
                          {{ formatDate(topic.created_at) }}
                        </p>
                      </div>
                    </div>
                    
                    <div class="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                      <div class="flex items-center space-x-1">
                        <Eye class="w-4 h-4" />
                        <span>{{ topic.views_count || 0 }}</span>
                      </div>
                      <div class="flex items-center space-x-1">
                        <MessageCircle class="w-4 h-4" />
                        <span>{{ topic.comments_count || 0 }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Pagination -->
          <div v-if="forums.total_pages > 1" class="flex justify-center items-center gap-2 mt-12">
            <button 
              @click="changePage(forums.current_page - 1)"
              :disabled="forums.current_page <= 1"
              class="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Previous
            </button>
            
            <div class="flex items-center gap-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                class="w-10 h-10 rounded-lg transition-colors font-medium"
                :class="page === forums.current_page 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="changePage(forums.current_page + 1)"
              :disabled="forums.current_page >= forums.total_pages"
              class="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
  
        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div class="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle class="w-8 h-8 text-slate-400" />
          </div>
          <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Discussions Found</h3>
          <p class="text-slate-600 dark:text-slate-400 mb-6">
            {{ searchQuery ? `No results found for "${searchQuery}"` : 'Be the first to start a discussion!' }}
          </p>
          <button 
            @click="createTopic"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Start New Discussion
          </button>
        </div>
  
        <!-- Floating Create Button -->
        <div class="fixed bottom-8 right-8">
          <button 
            @click="createTopic"
            class="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 hover:bg-blue-700"
          >
            <Plus class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { 
    Search, MessageCircle, Eye, Pin, Flame, Plus, Users, TrendingUp, User
  } from 'lucide-vue-next';
  
  const store = useStore();
  const forums = computed(() => store.getters.forums);
  const station = computed(() => store.getters.station);
  const isLoading = ref(false);
  
  // Search state
  const searchQuery = ref('');
  const searchTimeout = ref(null);
  
  const filters = ref({
    search: '',
    station_id: station.value?.id || 1,
    page: 1,
    per_page: 12
  });
  
  // Forum stats from API response
  const forumStats = computed(() => {
    if (forums.value?.metrics) {
      return {
        total_topics: forums.value.metrics.total_topics || 0,
        total_replies: forums.value.metrics.total_comments || 0,
        active_users: forums.value.metrics.total_views || 0,
        online_now: forums.value.metrics.online_now || 0
      };
    }
    return {
      total_topics: 0,
      total_replies: 0,
      active_users: 0,
      online_now: 0
    };
  });
  
  // Computed properties for topics
  const pinnedTopics = computed(() => {
    if (!forums.value?.data) return [];
    return forums.value.data.filter(topic => topic.is_pinned);
  });
  
  const regularTopics = computed(() => {
    if (!forums.value?.data) return [];
    return forums.value.data.filter(topic => !topic.is_pinned);
  });
  
  const visiblePages = computed(() => {
    if (!forums.value?.total_pages) return [];
    const current = forums.value.current_page;
    const total = forums.value.total_pages;
    const pages = [];
    
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
      applySearch();
    }, 500);
  };
  
  const applySearch = async () => {
    isLoading.value = true;
    try {
      await store.dispatch('fetch_user_forums', filters.value);
    } catch (err) {
      console.error('Failed to fetch filtered forums:', err);
    } finally {
      isLoading.value = false;
    }
  };
  
  const changePage = async (page) => {
    if (page < 1 || page > forums.value.total_pages) return;
    
    filters.value.page = page;
    isLoading.value = true;
    const data = {
      ...filters.value,
      station_id: station.value?.id || 1,
    };
    
    try {
      await store.dispatch('fetch_user_forums', data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to fetch forums:', err);
    } finally {
      isLoading.value = false;
    }
  };
  
  const createTopic = () => {
    // Navigate to create topic page or show modal
    console.log('Create new topic');
  };
  
  const getForums = async () => {
    isLoading.value = true;
    const data = {
      ...filters.value,
      station_id: station.value?.id || 1,
    };
    
    try {
      await store.dispatch('fetch_user_forums', data);
    } catch (err) {
      console.error('Failed to fetch forums:', err);
    } finally {
      isLoading.value = false;
    }
  };
  
  onMounted(() => {
    getForums();
  });
  </script>
  
  <style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* Smooth transitions */
  * {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }
  
  /* Hover effects */
  .group:hover .group-hover\:text-blue-600 {
    color: rgb(37 99 235);
  }
  
  /* Focus styles */
  button:focus-visible,
  input:focus-visible {
    outline: 2px solid rgb(59 130 246);
    outline-offset: 2px;
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
  
  /* Responsive design */
  @media (max-width: 768px) {
    .grid-cols-1.lg\:grid-cols-2 {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
    
    .text-4xl.md\:text-5xl {
      font-size: 2.25rem;
      line-height: 2.5rem;
    }
    
    .px-6 {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
  
  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .dark\:bg-slate-900 {
      background-color: rgb(15 23 42);
    }
    
    .dark\:bg-slate-800 {
      background-color: rgb(30 41 59);
    }
    
    .dark\:text-white {
      color: rgb(255 255 255);
    }
    
    .dark\:text-slate-300 {
      color: rgb(203 213 225);
    }
    
    .dark\:border-slate-700 {
      border-color: rgb(51 65 85);
    }
  }
  </style>