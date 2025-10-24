<template>
  <section class="relative overflow-hidden bg-white">
    <!-- Background decoration -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 right-0 w-72 h-72 bg-capital-pink rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-capital-pink-light rounded-full blur-3xl"></div>
    </div>

    <div class="container mx-auto px-4 md:px-6 relative z-20 py-20">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Community <span class="text-capital-pink">Forum</span>
        </h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          Connect with fellow KIIS 100.9 listeners, share your thoughts, and be
          part of Uganda's most vibrant radio community
        </p>
      </div>

      <!-- Community Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <!-- Loading State -->
        <template v-if="isLoading">
          <div v-for="i in 4" :key="i" class="animate-pulse">
            <div class="h-32 bg-gray-200 rounded-2xl"></div>
          </div>
        </template>

        <!-- Stats Cards -->
        <template v-else>
          <div class="bg-white p-4 rounded-lg border border-gray-200 hover:border-capital-pink text-center transition-colors duration-200">
            <div class="text-2xl font-bold text-capital-pink mb-1">
              {{ formatNumber(forumStats.total_topics) }}
            </div>
            <div class="text-xs font-medium text-gray-600 uppercase">
              Topics
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg border border-gray-200 hover:border-capital-pink text-center transition-colors duration-200">
            <div class="text-2xl font-bold text-capital-pink mb-1">
              {{ formatNumber(forumStats.total_replies) }}
            </div>
            <div class="text-xs font-medium text-gray-600 uppercase">
              Replies
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg border border-gray-200 hover:border-capital-pink text-center transition-colors duration-200">
            <div class="text-2xl font-bold text-capital-pink mb-1">
              {{ formatNumber(forumStats.active_users) }}
            </div>
            <div class="text-xs font-medium text-gray-600 uppercase">
              Active Users
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg border border-gray-200 hover:border-capital-pink text-center transition-colors duration-200">
            <div class="text-2xl font-bold text-capital-pink mb-1">
              {{ formatNumber(forumStats.online_now) }}
            </div>
            <div class="text-xs font-medium text-gray-600 uppercase">
              Online Now
            </div>
            <div class="flex items-center justify-center mt-1">
              <div class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-1"></div>
              <div class="text-xs text-green-600 font-medium">Live</div>
            </div>
          </div>
        </template>
      </div>

      <!-- Hot Discussions Section -->
      <div class="relative mb-12">
        <div class="relative bg-white rounded-lg border border-gray-200 overflow-hidden">
          <!-- Section Header -->
          <div class="bg-gray-50 px-4 sm:px-6 py-4 border-b border-gray-200">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 class="text-lg sm:text-xl font-bold text-capital-pink mb-1">
                  Hot Discussions
                </h3>
                <p class="text-gray-600 text-sm">
                  Trending topics in our community
                </p>
              </div>

              <!-- Controls -->
              <div class="flex items-center space-x-2">
                <button
                  @click="prevTopic"
                  :disabled="currentTopicIndex === 0"
                  class="p-2 rounded-lg bg-white hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 border border-gray-200"
                >
                  <ChevronLeft class="w-4 h-4" />
                </button>
                <button
                  @click="nextTopic"
                  :disabled="currentTopicIndex >= hotTopics.length - 3"
                  class="p-2 rounded-lg bg-white hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 border border-gray-200"
                >
                  <ChevronRight class="w-4 h-4" />
                </button>
                <button
                  @click="navigateToForums"
                  class="flex items-center space-x-1 bg-capital-pink hover:bg-pink-600 text-white font-medium px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
                >
                  <span>View All</span>
                  <ArrowRight class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Topics Content -->
          <div class="p-4 sm:p-6">
            <!-- Loading State -->
            <div
              v-if="isLoading"
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <div
                v-for="i in 3"
                :key="i"
                class="h-32 bg-gray-100 rounded-lg animate-pulse"
              ></div>
            </div>

            <!-- Hot Topics -->
            <div
              v-else-if="hotTopics.length > 0"
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <div
                v-for="topic in visibleTopics"
                :key="topic.id"
                class="cursor-pointer"
                @click="navigateToTopic(topic)"
              >
                <div
                  class="bg-white p-4 rounded-lg border border-gray-200 hover:border-capital-pink transition-colors duration-200"
                >
                  <!-- Topic Header -->
                  <div
                    class="flex flex-wrap items-start justify-between mb-3 gap-2"
                  >
                    <div class="flex items-center space-x-2">
                      <span
                        class="inline-flex items-center px-2 py-1 rounded text-xs font-medium uppercase"
                        :class="getCategoryStyle(topic.category || 'GENERAL')"
                      >
                        {{ topic.category || "General" }}
                      </span>
                      <span
                        v-if="topic.is_hot"
                        class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-600"
                      >
                        <Flame class="w-3 h-3 mr-1" /> HOT
                      </span>
                    </div>

                    <div
                      class="flex items-center space-x-2 text-xs text-gray-500"
                    >
                      <div class="flex items-center space-x-1">
                        <Eye class="w-3.5 h-3.5" />
                        <span class="font-medium">{{
                          formatNumber(topic.views_count || 0)
                        }}</span>
                      </div>
                      <div class="flex items-center space-x-1">
                        <MessageSquare class="w-3.5 h-3.5" />
                        <span class="font-medium">{{
                          formatNumber(topic.comments_count || 0)
                        }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Topic Content -->
                  <h4
                    class="text-base font-bold text-gray-900 mb-2 line-clamp-2"
                  >
                    {{ topic.title }}
                  </h4>
                  <p
                    class="text-gray-600 text-sm mb-3 line-clamp-2"
                  >
                    {{ topic.body }}
                  </p>

                  <!-- Footer -->
                  <div
                    class="flex items-center justify-between gap-2"
                  >
                    <div class="flex items-center space-x-2">
                      <div
                        class="w-8 h-8 rounded-full overflow-hidden border border-gray-200"
                      >
                        <img
                          v-if="topic.creator?.image_url"
                          :src="topic.creator.image_url"
                          :alt="topic.creator.name"
                          class="w-full h-full object-cover"
                        />
                        <div
                          v-else
                          class="w-full h-full bg-gray-200 flex items-center justify-center"
                        >
                          <User class="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <p class="text-xs font-medium text-gray-900">
                          {{ topic.creator?.name || "Anonymous" }}
                        </p>
                        <p class="text-xs text-gray-500">
                          {{ formatDate(topic.created_at) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12">
              <div
                class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4"
              >
                <MessageSquare class="w-8 h-8 text-gray-400" />
              </div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">
                No Discussions Yet
              </h3>
              <p class="text-gray-600 text-sm">
                Check back soon for trending topics
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>

  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import {
  Users,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Eye,
  Flame,
  User,
  Clock,
  TrendingUp,
} from "lucide-vue-next";

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
      online_now: forums.value.metrics.online_now || 0,
    };
  }
  return {
    total_topics: 1234,
    total_replies: 5678,
    active_users: 890,
    online_now: 45,
  };
});

// Hot topics (trending discussions)
const hotTopics = computed(() => {
  if (!forums.value?.data) return [];
  return forums.value.data
    .filter((topic) => topic.is_pinned)
    .sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
    .slice(0, 6);
});

// Visible topics for carousel
const visibleTopics = computed(() => {
  return hotTopics.value.slice(
    currentTopicIndex.value,
    currentTopicIndex.value + 3
  );
});

// Methods
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};

const getWeeklyGrowth = (total) => {
  const growth = Math.floor(total * 0.05 + Math.random() * (total * 0.03));
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
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
};

const getCategoryStyle = (category) => {
  const styles = {
    MUSIC: "bg-red-50 text-red-600",
    EVENTS: "bg-blue-50 text-blue-600",
    TECHNOLOGY: "bg-yellow-50 text-yellow-600",
    GENERAL: "bg-gray-100 text-gray-600",
    ANNOUNCEMENTS: "bg-green-50 text-green-600",
  };
  return styles[category.toUpperCase()] || styles["GENERAL"];
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
  router.push({ name: "forums" });
};

const navigateToTopic = (topic) => {
  router.push({ name: "forum_details", params: { id: topic.slug } });
};

// Load forum data
const loadForumData = async () => {
  isLoading.value = true;
  try {
    const data = {
      station_id: station.value?.id || 1,
      page: 1,
      per_page: 20,
    };
    await store.dispatch("fetch_user_forums", data);
  } catch (error) {
    console.error("Failed to load forum data:", error);
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
</style>
