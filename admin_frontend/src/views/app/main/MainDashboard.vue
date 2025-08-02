<template>
  <div class="">
    <!-- Header Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-4">
      <!-- Stations Overview -->
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Total Stations</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ statistics?.overview?.total_stations || 0 }}</p>
            <p class="text-sm text-green-600 flex items-center mt-1">
              <ArrowUpIcon class="w-4 h-4 mr-1" />
              {{ statistics?.overview?.live_stations || 0 }} Live
            </p>
          </div>
          <div class="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <RadioIcon class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <!-- Programs -->
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Total Programs</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ statistics?.overview?.total_programs || 0 }}</p>
            <p class="text-sm text-purple-600 flex items-center mt-1">
              <PlayIcon class="w-4 h-4 mr-1" />
              Active Shows
            </p>
          </div>
          <div class="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <HeadphonesIcon class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      <!-- News Articles -->
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">News Articles</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ statistics?.content?.news?.total || 0 }}</p>
            <p class="text-sm text-green-600 flex items-center mt-1">
              <CircleDotIcon class="w-4 h-4 mr-1" />
              {{ statistics?.content?.news?.published || 0 }} Published
            </p>
          </div>
          <div class="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <NewspaperIcon class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      <!-- Users -->
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
            <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ statistics?.users?.total_users || 0 }}</p>
            <p class="text-sm text-orange-600 flex items-center mt-1">
              <UserIcon class="w-4 h-4 mr-1" />
              {{ statistics?.users?.active_users || 0 }} Active
            </p>
          </div>
          <div class="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
            <UsersIcon class="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Content Overview & Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 py-4 gap-6">
      <!-- Content Statistics -->
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content Overview</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">News Articles</span>
            <div class="flex items-center space-x-2">
              <span class="text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                {{ statistics?.content?.news?.featured || 0 }} Featured
              </span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ statistics?.content?.news?.total || 0 }}</span>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">Events</span>
            <div class="flex items-center space-x-2">
              <span class="text-sm bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-2 py-1 rounded">
                {{ statistics?.content?.events?.upcoming || 0 }} Upcoming
              </span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ statistics?.content?.events?.total || 0 }}</span>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">Forum Posts</span>
            <div class="flex items-center space-x-2">
              <span class="text-sm bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 px-2 py-1 rounded">
                {{ statistics?.content?.forums?.pinned || 0 }} Pinned
              </span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ statistics?.content?.forums?.total || 0 }}</span>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">Advertisements</span>
            <div class="flex items-center space-x-2">
              <span class="text-sm bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 px-2 py-1 rounded">
                {{ statistics?.content?.adverts?.active || 0 }} Active
              </span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ statistics?.content?.adverts?.total || 0 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          <ArrowRightIcon class="w-5 h-5 text-gray-400" />
        </div>
        <div class="space-y-3 max-h-80 overflow-y-auto">
          <div 
            v-for="activity in statistics?.recent_activity?.slice(0, 6)" 
            :key="activity.title + activity.timestamp"
            class="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50"
          >
            <div class="p-1 rounded-full" :class="getActivityIconBg(activity.type)">
              <component :is="getActivityIcon(activity.type)" class="w-4 h-4" :class="getActivityIconColor(activity.type)" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                {{ activity.title }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ activity.user }} {{ activity.action }} • {{ formatDate(activity.timestamp) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Performing Content -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Articles -->
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Articles</h3>
        <div class="space-y-3">
          <div 
            v-for="(article, index) in statistics?.content?.news?.top_articles?.slice(0, 5)" 
            :key="article.title + index"
            class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50"
          >
            <div class="flex-1 min-w-0 mr-3">
              <p class="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                {{ article.title }}
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <ShareIcon class="w-4 h-4 text-gray-400" />
              <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ article.views }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- User Statistics -->
      <div class="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Statistics</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">Total Users</span>
            <span class="text-2xl font-bold text-gray-900 dark:text-white">{{ statistics?.users?.total_users || 0 }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">Active Users</span>
            <span class="text-xl font-semibold text-green-600">{{ statistics?.users?.active_users || 0 }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-600 dark:text-gray-400">Recent Active</span>
            <span class="text-lg font-medium text-blue-600">{{ statistics?.users?.recent_active || 0 }}</span>
          </div>
          <div class="pt-2 border-t border-gray-200 dark:border-slate-600">
            <h4 class="text-sm font-medium text-gray-900 dark:text-white mb-2">By Role</h4>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Admins</span>
                <span class="font-medium">{{ statistics?.users?.by_role?.admin || 0 }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Editors</span>
                <span class="font-medium">{{ statistics?.users?.by_role?.editor || 0 }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600 dark:text-gray-400">Presenters</span>
                <span class="font-medium">{{ statistics?.users?.by_role?.presenter || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import {
  Radio as RadioIcon,
  Headphones as HeadphonesIcon,
  Newspaper as NewspaperIcon,
  Users as UsersIcon,
  ArrowUp as ArrowUpIcon,
  ArrowRight as ArrowRightIcon,
  CircleDot as CircleDotIcon,
  User as UserIcon,
  Play as PlayIcon,
  MessageSquare as MessageSquareIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Calendar as CalendarIcon,
  Zap as ZapIcon
} from 'lucide-vue-next';

const store = useStore();

const statistics = computed(() => store.getters.adminStats);

const fetchStatistics = async () => {
  try {
    await store.dispatch('AdminStatistics');
  } catch (error) {
    console.error('Failed to fetch statistics:', error);
  }
};

const getActivityIcon = (type) => {
  switch (type) {
    case 'news': return NewspaperIcon;
    case 'event': return CalendarIcon;
    case 'forum': return MessageSquareIcon;
    case 'user': return UserIcon;
    default: return ZapIcon;
  }
};

const getActivityIconBg = (type) => {
  switch (type) {
    case 'news': return 'bg-blue-100 dark:bg-blue-900/20';
    case 'event': return 'bg-green-100 dark:bg-green-900/20';
    case 'forum': return 'bg-purple-100 dark:bg-purple-900/20';
    case 'user': return 'bg-orange-100 dark:bg-orange-900/20';
    default: return 'bg-gray-100 dark:bg-gray-900/20';
  }
};

const getActivityIconColor = (type) => {
  switch (type) {
    case 'news': return 'text-blue-600 dark:text-blue-400';
    case 'event': return 'text-green-600 dark:text-green-400';
    case 'forum': return 'text-purple-600 dark:text-purple-400';
    case 'user': return 'text-orange-600 dark:text-orange-400';
    default: return 'text-gray-600 dark:text-gray-400';
  }
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return 'Yesterday';
  return date.toLocaleDateString();
};

onMounted(() => {
  fetchStatistics();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>