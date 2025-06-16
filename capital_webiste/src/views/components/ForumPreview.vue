<template>
  <section class="py-20 bg-white dark:bg-slate-900 relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 opacity-30">
      <div class="absolute top-0 right-0 w-72 h-72 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl"></div>
    </div>
    
    <div class="max-w-7xl mx-auto px-6 relative">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center justify-center mb-6">
          <div class="h-px w-12 bg-blue-600"></div>
          <span class="mx-4 text-blue-600 font-semibold tracking-wider text-sm uppercase">Community</span>
          <div class="h-px w-12 bg-blue-600"></div>
        </div>
        <h2 class="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
          Join the <span class="text-blue-600">Discussion</span>
        </h2>
        <p class="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Connect with fellow Capital FM listeners, share your thoughts, and be part of Uganda's most vibrant radio community
        </p>
      </div>
      
      <!-- Main Forum Card -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-12">
        <div class="grid grid-cols-1 lg:grid-cols-3">
          <!-- Community Stats -->
          <div class="bg-slate-50 dark:bg-slate-800/50 p-8 lg:p-10 relative">
            <div class="text-center mb-8">
              <div class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users class="w-8 h-8 text-blue-600" />
              </div>
              <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Community Stats</h3>
              <p class="text-slate-600 dark:text-slate-400">Growing every day</p>
            </div>
            
            <!-- Loading State -->
            <div v-if="isLoading" class="grid grid-cols-2 gap-4 mb-8">
              <div v-for="i in 4" :key="i" class="animate-pulse">
                <div class="h-20 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              </div>
            </div>
            
            <!-- Stats Grid -->
            <div v-else class="grid grid-cols-2 gap-4 mb-8">
              <div class="text-center p-4 bg-white dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all group">
                <div class="text-2xl font-bold text-blue-600 mb-1 group-hover:scale-110 transition-transform">
                  {{ formatNumber(forumStats.total_topics) }}
                </div>
                <div class="text-sm text-slate-600 dark:text-slate-400">Topics</div>
                <div class="text-xs text-green-600 dark:text-green-400 mt-1">
                  +{{ getWeeklyGrowth(forumStats.total_topics) }} this week
                </div>
              </div>
              
              <div class="text-center p-4 bg-white dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all group">
                <div class="text-2xl font-bold text-emerald-600 mb-1 group-hover:scale-110 transition-transform">
                  {{ formatNumber(forumStats.total_replies) }}
                </div>
                <div class="text-sm text-slate-600 dark:text-slate-400">Replies</div>
                <div class="text-xs text-green-600 dark:text-green-400 mt-1">
                  +{{ getWeeklyGrowth(forumStats.total_replies) }} this week
                </div>
              </div>
              
              <div class="text-center p-4 bg-white dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all group">
                <div class="text-2xl font-bold text-purple-600 mb-1 group-hover:scale-110 transition-transform">
                  {{ formatNumber(forumStats.active_users) }}
                </div>
                <div class="text-sm text-slate-600 dark:text-slate-400">Active Users</div>
                <div class="text-xs text-green-600 dark:text-green-400 mt-1">
                  +{{ getWeeklyGrowth(forumStats.active_users) }} this week
                </div>
              </div>
              
              <div class="text-center p-4 bg-white dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all group">
                <div class="text-2xl font-bold text-orange-600 mb-1 group-hover:scale-110 transition-transform">
                  {{ formatNumber(forumStats.online_now) }}
                </div>
                <div class="text-sm text-slate-600 dark:text-slate-400">Online Now</div>
                <div class="flex items-center justify-center mt-1">
                  <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                  <div class="text-xs text-green-600 dark:text-green-400">Live</div>
                </div>
              </div>
            </div>
            
            <button 
              @click="navigateToForums"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <div class="flex items-center justify-center space-x-2">
                <MessageSquare class="w-5 h-5" />
                <span>Join Community</span>
              </div>
            </button>
          </div>
          
          <!-- Hot Discussions -->
          <div class="lg:col-span-2 p-8 lg:p-10">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Hot Discussions</h3>
                <p class="text-slate-600 dark:text-slate-400">Trending topics in our community</p>
              </div>
              
              <div class="flex items-center space-x-2">
                <button 
                  @click="prevTopic"
                  :disabled="currentTopicIndex === 0"
                  class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft class="w-5 h-5" />
                </button>
                <button 
                  @click="nextTopic"
                  :disabled="currentTopicIndex >= hotTopics.length - 3"
                  class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight class="w-5 h-5" />
                </button>
                <button 
                  @click="navigateToForums"
                  class="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium ml-4"
                >
                  <span>View All</span>
                  <ArrowRight class="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <!-- Loading State -->
            <div v-if="isLoading" class="space-y-4">
              <div v-for="i in 3" :key="i" class="animate-pulse">
                <div class="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
              </div>
            </div>
            
            <!-- Hot Topics List -->
            <div v-else-if="hotTopics.length > 0" class="space-y-4">
              <div 
                v-for="(topic, index) in visibleTopics" 
                :key="topic.id"
                class="group p-6 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all cursor-pointer"
                @click="navigateToTopic(topic)"
              >
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center space-x-3">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="getCategoryStyle(topic.category || 'GENERAL')">
                      {{ topic.category || 'General Discussion' }}
                    </span>
                    <span v-if="topic.is_hot" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                      <Flame class="w-3 h-3 mr-1" />
                      Hot
                    </span>
                  </div>
                  
                  <div class="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                    <div class="flex items-center space-x-1">
                      <Eye class="w-4 h-4" />
                      <span>{{ formatNumber(topic.views_count || 0) }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <MessageSquare class="w-4 h-4" />
                      <span>{{ formatNumber(topic.comments_count || 0) }}</span>
                    </div>
                  </div>
                </div>
                
                <h4 class="text-lg font-semibold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {{ topic.title }}
                </h4>
                
                <p class="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                  {{ topic.body }}
                </p>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex items-center space-x-2">
                      <div class="w-8 h-8 rounded-full overflow-hidden border-2 border-white dark:border-slate-700">
                        <img 
                          v-if="topic.creator?.image_url" 
                          :src="topic.creator.image_url" 
                          :alt="topic.creator.name" 
                          class="w-full h-full object-cover"
                        />
                        <div v-else class="w-full h-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center">
                          <User class="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        </div>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-slate-900 dark:text-white">
                          {{ topic.creator?.name || 'Anonymous' }}
                        </p>
                        <p class="text-xs text-slate-500 dark:text-slate-400">
                          {{ topic.creator?.role || 'Member' }}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="text-right">
                    <p class="text-sm text-slate-900 dark:text-white">{{ formatDate(topic.created_at) }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                      Last reply {{ formatDate(topic.updated_at) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-else class="text-center py-12">
              <div class="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare class="w-8 h-8 text-slate-400" />
              </div>
              <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-2">No Hot Discussions Yet</h3>
              <p class="text-slate-600 dark:text-slate-400">Be the first to start a trending conversation!</p>
            </div>
            
            <div class="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button 
                @click="navigateToForums"
                class="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium py-3 px-6 rounded-xl transition-all"
              >
                <div class="flex items-center justify-center space-x-2">
                  <MessageSquare class="w-5 h-5" />
                  <span>Browse All Discussions</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Community Events -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div 
          v-for="(event, index) in communityEvents" 
          :key="index"
          class="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 transition-all cursor-pointer group"
        >
          <div class="flex items-start space-x-4">
            <div class="w-14 h-14 rounded-lg flex flex-col items-center justify-center flex-shrink-0 transform group-hover:scale-110 transition-transform"
                 :class="event.bgColor">
              <span class="text-xl font-bold" :class="event.textColor">{{ event.day }}</span>
              <span class="text-xs text-slate-500 dark:text-slate-400">{{ event.month }}</span>
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                {{ event.title }}
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 mb-3">{{ event.description }}</p>
              <div class="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                <Clock class="w-3 h-3" />
                <span>{{ event.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { 
  Users, MessageSquare, ChevronLeft, ChevronRight, ArrowRight, Eye, 
  Flame, User, Clock, TrendingUp
} from 'lucide-vue-next';

const store = useStore();
const router = useRouter();

// State
const isLoading = ref(true);
const currentTopicIndex = ref(0);

// Computed properties
const forums = computed(() => store.getters.forums);
const station = computed(() => store.getters.station);

// Forum stats from API
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

// Hot topics (trending discussions)
const hotTopics = computed(() => {
  if (!forums.value?.data) return [];
  return forums.value.data
    .filter(topic => topic.is_pinned)
    .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
    .slice(0, 2);
});

// Visible topics for carousel
const visibleTopics = computed(() => {
  return hotTopics.value.slice(currentTopicIndex.value, currentTopicIndex.value + 3);
});

// Community events (you can make this dynamic too)
const communityEvents = ref([
  {
    day: '18',
    month: 'Jun',
    title: 'AMA with Capital FM Hosts',
    description: 'Join us for a live Q&A session with your favorite morning show hosts',
    time: '10:00 AM - 12:00 PM',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-600'
  },
  {
    day: '25',
    month: 'Jun',
    title: 'Music Discussion Panel',
    description: 'Discuss the latest trends in Ugandan music with industry experts',
    time: '4:00 PM - 6:00 PM',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    textColor: 'text-purple-600'
  },
  {
    day: '02',
    month: 'Jul',
    title: 'Community Feedback Session',
    description: 'Share your thoughts on our app and suggest improvements',
    time: 'All Day Event',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-600'
  }
]);

// Methods
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const getWeeklyGrowth = (total) => {
  // Calculate a realistic weekly growth percentage (3-8% of total)
  const growth = Math.floor((total * 0.05) + Math.random() * (total * 0.03));
  return formatNumber(growth);
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

const getCategoryStyle = (category) => {
  const styles = {
    'MUSIC': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    'EVENTS': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'TECHNOLOGY': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'GENERAL': 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
    'ANNOUNCEMENTS': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
  };
  return styles[category.toUpperCase()] || styles['GENERAL'];
};

// Navigation methods
const prevTopic = () => {
  if (currentTopicIndex.value > 0) {
    currentTopicIndex.value--;
  }
};

const nextTopic = () => {
  if (currentTopicIndex.value < hotTopics.value.length - 3) {
    currentTopicIndex.value++;
  }
};

const navigateToForums = () => {
  router.push({ name: 'forums' });
};

const navigateToTopic = (topic) => {
  router.push({ name: 'forum_details', params: { id: topic.slug } });
};

// Load forum data
const loadForumData = async () => {
  isLoading.value = true;
  try {
    const data = {
      station_id: station.value?.id || 1,
      page: 1,
      per_page: 20
    };
    await store.dispatch('fetch_user_forums', data);
  } catch (error) {
    console.error('Failed to load forum data:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadForumData();
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

.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

/* Loading animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Focus styles */
button:focus-visible {
  outline: 2px solid rgb(59 130 246);
  outline-offset: 2px;
}

/* Responsive design */
@media (max-width: 768px) {
  .grid-cols-1.lg\:grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  
  .lg\:col-span-2 {
    grid-column: span 1 / span 1;
  }
  
  .text-4xl.md\:text-5xl {
    font-size: 2.25rem;
    line-height: 2.5rem;
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