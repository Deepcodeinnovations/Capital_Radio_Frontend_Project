<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative min-h-[70vh] flex items-center justify-center overflow-hidden" style="margin-top: 5rem !important;">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Community Discussion" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/60"></div>
      </div>


      <!-- Hero Content -->
      <div class="relative z-10 container mx-auto px-6 text-center">
        <!-- Hero Badge -->
        <div class="inline-block bg-red-600 text-white px-6 py-2 mb-8 transform -rotate-1">
          <span class="font-black text-sm tracking-widest uppercase">COMMUNITY</span>
        </div>

        <!-- Main Heading -->
        <h1 class="text-6xl  font-black text-white mb-6 leading-none">
          BEAT
          <span class="block text-red-600">FORUMS</span>
        </h1>

        <!-- Subtitle -->
        <p class="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
          Join the discussion and connect with fellow Beat FM listeners across Uganda
        </p>

        <!-- Live Stats Row -->
        <!-- <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
          <div class="bg-red-600 border-4 border-red-600 p-4 text-center transform hover:scale-105 transition-transform">
            <div class="text-3xl font-black text-white mb-1">{{ forumStats.total_topics }}</div>
            <div class="text-xs font-bold text-white uppercase tracking-wider">TOPICS</div>
          </div>
          <div class="bg-white/90 backdrop-blur-sm border-4 border-white p-4 text-center transform hover:scale-105 transition-transform">
            <div class="text-3xl font-black text-black mb-1">{{ forumStats.total_replies }}</div>
            <div class="text-xs font-bold text-black uppercase tracking-wider">REPLIES</div>
          </div>
          <div class="bg-black/80 backdrop-blur-sm border-4 border-black p-4 text-center transform hover:scale-105 transition-transform">
            <div class="text-3xl font-black text-white mb-1">{{ forumStats.active_users }}</div>
            <div class="text-xs font-bold text-white uppercase tracking-wider">USERS</div>
          </div>
          <div class="bg-white/90 backdrop-blur-sm border-4 border-red-600 p-4 text-center transform hover:scale-105 transition-transform">
            <div class="text-3xl font-black text-red-600 mb-1 flex items-center justify-center gap-2">
              {{ forumStats.online_now }}
              <div class="w-2 h-2 bg-red-600 animate-pulse"></div>
            </div>
            <div class="text-xs font-bold text-red-600 uppercase tracking-wider">ONLINE</div>
          </div>
        </div> -->

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
            @click="scrollToForums"
            class="bg-white/10 backdrop-blur-md border-4 border-white text-white font-black px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
          >
            <span class="tracking-widest text-sm">BROWSE TOPICS</span>
          </button>
        </div>
      </div>

      <!-- Sharp Bottom Divider -->
      <div class="absolute bottom-0 left-0 w-full overflow-hidden" style="transform: translateY(1px);">
        <svg class="w-full h-auto" preserveAspectRatio="none" viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="forumWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#DC2626;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#000000;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#DC2626;stop-opacity:1" />
            </linearGradient>
          </defs>
          <path d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z" fill="url(#forumWaveGradient)"></path>
          <path d="M0,80 C300,40 600,100 900,80 C1000,70 1100,90 1200,80 L1200,120 L0,120 Z" fill="rgb(249 250 251)" opacity="0.9"></path>
        </svg>
      </div>
    </section>

    <!-- Main Content -->
    <div class="bg-gray-50 relative" id="forums-content">
      <div class="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <!-- Search Bar -->
        <div class="mb-12">
          <div class="relative max-w-2xl mx-auto">
            <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              v-model="searchQuery"
              @input="debounceSearch"
              type="text"
              placeholder="SEARCH FORUM DISCUSSIONS..."
              class="w-full pl-12 pr-4 py-4 bg-white border-4 border-black text-black placeholder-gray-500 focus:outline-none focus:border-red-600 font-bold uppercase tracking-wider"
            />
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="w-12 h-12 border-4 border-gray-300 border-t-red-600 animate-spin"></div>
        </div>

        <!-- Forums Content -->
        <div v-else-if="forums && forums.data && forums.data.length > 0">
          <!-- Results Info -->
          <div class="flex items-center justify-between mb-8">
            <div class="text-black font-black uppercase tracking-wider">
              {{ searchQuery ? `SEARCH: "${searchQuery}"` : 'ALL DISCUSSIONS' }} - 
              {{ forums.data.length }} OF {{ forums.total }}
            </div>
            <div class="text-black font-black uppercase tracking-wider">
              PAGE {{ forums.current_page }} / {{ forums.total_pages }}
            </div>
          </div>

          <!-- Pinned Topics -->
          <div v-if="pinnedTopics.length > 0" class="mb-12">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-12 h-12 bg-red-600 flex items-center justify-center">
                <Pin class="w-6 h-6 text-white" />
              </div>
              <h2 class="text-3xl font-black text-black uppercase tracking-wider">PINNED DISCUSSIONS</h2>
              <div class="flex-1 h-1 bg-red-600"></div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div 
                v-for="topic in pinnedTopics" 
                :key="topic.id"
                class="bg-white border-4 border-black p-6 transition-all hover:border-red-600 group cursor-pointer transform hover:scale-105"
                @click="$router.push({name: 'forum_details', params: {id: topic.slug}})"
              >
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center space-x-2">
                    <span class="bg-red-600 text-white px-3 py-1 text-xs font-black tracking-wider uppercase">
                      PINNED
                    </span>
                    <span v-if="topic.is_hot" class="bg-black text-white px-3 py-1 text-xs font-black tracking-wider uppercase flex items-center gap-1">
                      <Flame class="w-3 h-3" />
                      HOT
                    </span>
                  </div>
                  
                  <div class="flex items-center space-x-4 text-sm text-gray-600 font-bold">
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
                
                <h3 class="text-xl font-black text-black mb-3 group-hover:text-red-600 transition-colors line-clamp-2 uppercase tracking-wide">
                  {{ topic.title }}
                </h3>
                
                <p class="text-gray-600 mb-4 line-clamp-2 text-sm">
                  {{ topic.body }}
                </p>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <div class="w-10 h-10 border-2 border-black bg-red-600 flex items-center justify-center">
                      <User class="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p class="text-sm font-black text-black uppercase">
                        {{ topic.creator?.name || 'ANONYMOUS' }}
                      </p>
                      <p class="text-xs text-gray-600 font-bold">
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
            <div class="flex items-center gap-4 mb-8">
              <div class="w-12 h-12 bg-black flex items-center justify-center">
                <MessageCircle class="w-6 h-6 text-white" />
              </div>
              <h2 class="text-3xl font-black text-black uppercase tracking-wider">ALL DISCUSSIONS</h2>
              <div class="flex-1 h-1 bg-black"></div>
            </div>
            
            <div 
              v-for="topic in regularTopics" 
              :key="topic.id"
              class="bg-white border-2 border-black p-6 transition-all hover:border-red-600 group cursor-pointer transform hover:scale-105"
              @click="$router.push({name: 'forum_details', params: {id: topic.slug}})"
            >
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0 mt-1">
                  <div class="w-12 h-12 border-2 border-black flex items-center justify-center"
                       :class="topic.is_hot ? 'bg-red-600 text-white' : 'bg-white text-black'">
                    <MessageCircle class="w-6 h-6" />
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3 mb-2">
                    <span class="bg-gray-200 text-black px-3 py-1 text-xs font-black tracking-wider uppercase">
                      GENERAL
                    </span>
                    
                    <span v-if="topic.is_hot" class="bg-red-600 text-white px-3 py-1 text-xs font-black tracking-wider uppercase flex items-center gap-1">
                      <Flame class="w-3 h-3" />
                      HOT
                    </span>
                  </div>
                  
                  <h3 class="text-lg font-black text-black mb-2 group-hover:text-red-600 transition-colors line-clamp-2 uppercase tracking-wide">
                    {{ topic.title }}
                  </h3>
                  
                  <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                    {{ topic.body }}
                  </p>
                  
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <div class="w-8 h-8 border border-black bg-red-600 flex items-center justify-center">
                        <User class="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p class="text-sm font-black text-black uppercase">
                          {{ topic.creator?.name || 'ANONYMOUS' }}
                        </p>
                        <p class="text-xs text-gray-600 font-bold">
                          {{ formatDate(topic.created_at) }}
                        </p>
                      </div>
                    </div>
                    
                    <div class="flex items-center space-x-4 text-sm text-gray-600 font-bold">
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
                :class="page === forums.current_page 
                  ? 'bg-red-600 text-white border-red-600' 
                  : 'bg-white border-black text-black hover:bg-black hover:text-white'"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="changePage(forums.current_page + 1)"
              :disabled="forums.current_page >= forums.total_pages"
              class="px-6 py-3 bg-white border-2 border-black text-black font-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-all uppercase tracking-wider"
            >
              NEXT
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div class="w-20 h-20 bg-gray-200 border-4 border-black flex items-center justify-center mx-auto mb-6">
            <MessageCircle class="w-10 h-10 text-gray-400" />
          </div>
          <h3 class="text-2xl font-black text-black mb-4 uppercase tracking-wider">NO DISCUSSIONS FOUND</h3>
          <p class="text-gray-600 mb-6 font-bold">
            {{ searchQuery ? `NO RESULTS FOR "${searchQuery}"` : 'BE THE FIRST TO START A DISCUSSION!' }}
          </p>
          <button 
            @click="createTopic"
            class="px-8 py-4 bg-red-600 text-white font-black hover:bg-red-700 transition-all border-4 border-red-600 uppercase tracking-wider"
          >
            START NEW DISCUSSION
          </button>
        </div>

        <!-- Floating Create Button -->
        <div class="fixed bottom-8 right-8">
          <button 
            @click="createTopic"
            class="w-16 h-16 bg-red-600 border-4 border-red-600 flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 hover:bg-red-700"
          >
            <Plus class="w-8 h-8" />
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
  Search, MessageCircle, Eye, Pin, Flame, Plus, Users, TrendingUp, User, Volume2, Play
} from 'lucide-vue-next';

const store = useStore();
const forums = computed(() => store.getters.forums);
const station = computed(() => store.getters.station);
const isPlaying = computed(() => store.getters.isPlaying);
const isLoading = ref(false);

// Search state
const searchQuery = ref('');
const searchTimeout = ref(null);

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
  console.log('Create new topic');
};

const scrollToForums = () => {
  document.getElementById('forums-content').scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
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
button, div, input {
  border-radius: 0 !important;
}
</style>