<template>
  <section class="py-20 bg-white relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 right-0 w-72 h-72 bg-[#F8CB00] rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
    </div>
    
    <div class="container mx-auto px-6 relative">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center justify-center mb-6">
          <div class="h-px w-12 bg-[#F8CB00]"></div>
          <span class="mx-4 text-gray-800 font-bold tracking-wider text-sm uppercase">Community</span>
          <div class="h-px w-12 bg-[#F8CB00]"></div>
        </div>
        <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Join Our Community <span class="text-[#F8CB00]">Discussions</span>
        </h2>
        <p class="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Connect with fellow Capital FM listeners, share your thoughts, and be part of Uganda's most vibrant radio community
        </p>
      </div>
      
      <!-- Main Forum Card -->
      <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-12">
        <div class="grid grid-cols-1 lg:grid-cols-3">
          <!-- Community Stats -->
          <div class="bg-gray-50 p-8 lg:p-10 relative">
            <div class="text-center mb-8">
              <div class="w-16 h-16 bg-[#F8CB00]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users class="w-8 h-8 text-[#F8CB00]" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-2">Community Stats</h3>
              <p class="text-gray-600">Growing every day</p>
            </div>
            
            <!-- Loading State -->
            <div v-if="isLoading" class="grid grid-cols-2 gap-4 mb-8">
              <div v-for="i in 4" :key="i" class="animate-pulse">
                <div class="h-20 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
            
            <!-- Stats Grid -->
            <div v-else class="grid grid-cols-2 gap-4 mb-8">
              <div class="text-center p-4 bg-white rounded-xl border border-gray-200 hover:border-[#F8CB00]/50 transition-all group transform hover:scale-105">
                <div class="text-2xl font-bold text-[#F8CB00] mb-1 group-hover:animate-pulse">
                  {{ formatNumber(forumStats.total_topics) }}
                </div>
                <div class="text-sm text-gray-600">Topics</div>
                <div class="text-xs text-green-600 mt-1">
                  +{{ getWeeklyGrowth(forumStats.total_topics) }} this week
                </div>
              </div>
              
              <div class="text-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-500/50 transition-all group transform hover:scale-105">
                <div class="text-2xl font-bold text-blue-600 mb-1 group-hover:animate-pulse">
                  {{ formatNumber(forumStats.total_replies) }}
                </div>
                <div class="text-sm text-gray-600">Replies</div>
                <div class="text-xs text-green-600 mt-1">
                  +{{ getWeeklyGrowth(forumStats.total_replies) }} this week
                </div>
              </div>
              
              <div class="text-center p-4 bg-white rounded-xl border border-gray-200 hover:border-red-500/50 transition-all group transform hover:scale-105">
                <div class="text-2xl font-bold text-red-500 mb-1 group-hover:animate-pulse">
                  {{ formatNumber(forumStats.active_users) }}
                </div>
                <div class="text-sm text-gray-600">Active Users</div>
                <div class="text-xs text-green-600 mt-1">
                  +{{ getWeeklyGrowth(forumStats.active_users) }} this week
                </div>
              </div>
              
              <div class="text-center p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-500/50 transition-all group transform hover:scale-105">
                <div class="text-2xl font-bold text-orange-600 mb-1 group-hover:animate-pulse">
                  {{ formatNumber(forumStats.online_now) }}
                </div>
                <div class="text-sm text-gray-600">Online Now</div>
                <div class="flex items-center justify-center mt-1">
                  <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                  <div class="text-xs text-green-600">Live</div>
                </div>
              </div>
            </div>
            
            <button 
              @click="navigateToForums"
              class="relative group w-full overflow-hidden"
            >
              <div class="absolute -inset-1 bg-gradient-to-r from-[#F8CB00] via-red-500 to-blue-500 rounded-xl blur opacity-50 group-hover:opacity-70 transition duration-300"></div>
              <div class="relative bg-gradient-to-r from-[#F8CB00] to-red-500 px-6 py-3 rounded-xl text-white font-bold flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105">
                <MessageSquare class="w-5 h-5" />
                <span>Join Community</span>
              </div>
            </button>
          </div>
          
          <!-- Hot Discussions -->
          <div class="lg:col-span-2 p-8 lg:p-10">
            <div class="flex items-center justify-between mb-8">
              <div>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Hot Discussions</h3>
                <p class="text-gray-600">Trending topics in our community</p>
              </div>
              
              <div class="flex items-center space-x-2">
                <button 
                  @click="prevTopic"
                  :disabled="currentTopicIndex === 0"
                  class="p-2 rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft class="w-5 h-5" />
                </button>
                <button 
                  @click="nextTopic"
                  :disabled="currentTopicIndex >= hotTopics.length - 3"
                  class="p-2 rounded-lg hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight class="w-5 h-5" />
                </button>
                <button 
                  @click="navigateToForums"
                  class="flex items-center space-x-2 text-[#F8CB00] hover:text-red-500 font-medium ml-4 transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight class="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <!-- Loading State -->
            <div v-if="isLoading" class="space-y-4">
              <div v-for="i in 3" :key="i" class="animate-pulse">
                <div class="h-32 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
            
            <!-- Hot Topics List -->
            <div v-else-if="hotTopics.length > 0" class="space-y-4">
              <div 
                v-for="(topic, index) in visibleTopics" 
                :key="topic.id"
                class="group p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#F8CB00]/50 transition-all cursor-pointer transform hover:scale-[1.02]"
                @click="navigateToTopic(topic)"
              >
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center space-x-3">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                          :class="getCategoryStyle(topic.category || 'GENERAL')">
                      {{ topic.category || 'General Discussion' }}
                    </span>
                    <span v-if="topic.is_hot" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                      <Flame class="w-3 h-3 mr-1" />
                      Hot
                    </span>
                  </div>
                  
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
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
                
                <h4 class="text-lg font-semibold text-gray-900 mb-3 group-hover:text-[#F8CB00] transition-colors line-clamp-2">
                  {{ topic.title }}
                </h4>
                
                <p class="text-gray-600 mb-4 line-clamp-2">
                  {{ topic.body }}
                </p>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex items-center space-x-2">
                      <div class="w-8 h-8 rounded-full overflow-hidden border-2 border-white">
                        <img 
                          v-if="topic.creator?.image_url" 
                          :src="topic.creator.image_url" 
                          :alt="topic.creator.name" 
                          class="w-full h-full object-cover"
                        />
                        <div v-else class="w-full h-full bg-gray-300 flex items-center justify-center">
                          <User class="w-4 h-4 text-gray-500" />
                        </div>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">
                          {{ topic.creator?.name || 'Anonymous' }}
                        </p>
                        <p class="text-xs text-gray-500">
                          {{ topic.creator?.role || 'Member' }}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="text-right">
                    <p class="text-sm text-gray-900">{{ formatDate(topic.created_at) }}</p>
                    <p class="text-xs text-gray-500">
                      Last reply {{ formatDate(topic.updated_at) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-else class="text-center py-12">
              <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare class="w-8 h-8 text-gray-400" />
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No Hot Discussions Yet</h3>
              <p class="text-gray-600">Be the first to start a trending conversation!</p>
            </div>
            
            <div class="mt-8 pt-6 border-t border-gray-200">
              <button 
                @click="navigateToForums"
                class="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-6 rounded-xl transition-all transform hover:scale-105"
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

// Community events
const communityEvents = ref([
  {
    day: '18',
    month: 'Jun',
    title: 'AMA with Capital FM Hosts',
    description: 'Join us for a live Q&A session with your favorite morning show hosts',
    time: '10:00 AM - 12:00 PM',
    bgColor: 'bg-[#F8CB00]/20',
    textColor: 'text-[#F8CB00]'
  },
  {
    day: '25',
    month: 'Jun',
    title: 'Music Discussion Panel',
    description: 'Discuss the latest trends in Ugandan music with industry experts',
    time: '4:00 PM - 6:00 PM',
    bgColor: 'bg-red-500/20',
    textColor: 'text-red-500'
  },
  {
    day: '02',
    month: 'Jul',
    title: 'Community Feedback Session',
    description: 'Share your thoughts on our app and suggest improvements',
    time: 'All Day Event',
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-500'
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
    'MUSIC': 'bg-red-100 text-red-600',
    'EVENTS': 'bg-blue-100 text-blue-600',
    'TECHNOLOGY': 'bg-[#F8CB00]/20 text-[#F8CB00]',
    'GENERAL': 'bg-gray-100 text-gray-600',
    'ANNOUNCEMENTS': 'bg-green-100 text-green-600'
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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>