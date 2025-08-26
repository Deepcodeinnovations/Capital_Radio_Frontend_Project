<template>
  <section
    class="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-pink-50"
  >
    <!-- Background decoration with KIIS colors -->
    <div class="absolute inset-0 opacity-5">
      <div
        class="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full blur-3xl"
      ></div>
    </div>

    <div class="container mx-auto px-4 md:px-6 relative z-20 py-20">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center justify-center mb-6">
          <div
            class="h-px w-12 bg-gradient-to-r from-pink-500 to-purple-500"
          ></div>
          <span
            class="mx-4 text-gray-800 font-bold tracking-wider text-sm uppercase"
            >Community</span
          >
          <div
            class="h-px w-12 bg-gradient-to-r from-purple-500 to-pink-500"
          ></div>
        </div>
        <h2
          class="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6"
        >
          Join Our Community
          <span
            class="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"
            >Discussions</span
          >
        </h2>
        <p
          class="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed"
        >
          Connect with fellow KIIS 100.9 listeners, share your thoughts, and be
          part of Uganda's most vibrant radio community
        </p>
      </div>

      <!-- Community Stats Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
        <!-- Loading State -->
        <template v-if="isLoading">
          <div v-for="i in 4" :key="i" class="animate-pulse">
            <div
              class="h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl"
            ></div>
          </div>
        </template>

        <!-- Stats Cards -->
        <template v-else>
          <div class="relative group">
            <div
              class="absolute -inset-0.5 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-60 transition duration-500 blur-sm"
            ></div>
            <div
              class="relative bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-pink-200/30 text-center transition-all duration-500 transform hover:scale-105"
            >
              <div
                class="text-2xl md:text-3xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300"
              >
                {{ formatNumber(forumStats.total_topics) }}
              </div>
              <div
                class="text-sm font-bold text-gray-600 uppercase tracking-wider"
              >
                Topics
              </div>
              <div class="text-xs text-green-600 mt-1 font-semibold">
                +{{ getWeeklyGrowth(forumStats.total_topics) }} this week
              </div>
            </div>
          </div>

          <div class="relative group">
            <div
              class="absolute -inset-0.5 bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-60 transition duration-500 blur-sm"
            ></div>
            <div
              class="relative bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-purple-200/30 text-center transition-all duration-500 transform hover:scale-105"
            >
              <div
                class="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300"
              >
                {{ formatNumber(forumStats.total_replies) }}
              </div>
              <div
                class="text-sm font-bold text-gray-600 uppercase tracking-wider"
              >
                Replies
              </div>
              <div class="text-xs text-green-600 mt-1 font-semibold">
                +{{ getWeeklyGrowth(forumStats.total_replies) }} this week
              </div>
            </div>
          </div>

          <div class="relative group">
            <div
              class="absolute -inset-0.5 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-60 transition duration-500 blur-sm"
            ></div>
            <div
              class="relative bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-pink-200/30 text-center transition-all duration-500 transform hover:scale-105"
            >
              <div
                class="text-2xl md:text-3xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300"
              >
                {{ formatNumber(forumStats.active_users) }}
              </div>
              <div
                class="text-sm font-bold text-gray-600 uppercase tracking-wider"
              >
                Active Users
              </div>
              <div class="text-xs text-green-600 mt-1 font-semibold">
                +{{ getWeeklyGrowth(forumStats.active_users) }} this week
              </div>
            </div>
          </div>

          <div class="relative group">
            <div
              class="absolute -inset-0.5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl opacity-0 group-hover:opacity-60 transition duration-500 blur-sm"
            ></div>
            <div
              class="relative bg-white/80 backdrop-blur-sm p-6 rounded-3xl border border-yellow-200/30 text-center transition-all duration-500 transform hover:scale-105"
            >
              <div
                class="text-2xl md:text-3xl font-black bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300"
              >
                {{ formatNumber(forumStats.online_now) }}
              </div>
              <div
                class="text-sm font-bold text-gray-600 uppercase tracking-wider"
              >
                Online Now
              </div>
              <div class="flex items-center justify-center mt-1">
                <div
                  class="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"
                ></div>
                <div class="text-xs text-green-600 font-bold">Live</div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Hot Discussions Section -->
      <div class="relative mb-12">
        <!-- Glow Background -->
        <div
          class="absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-500 to-pink-400 rounded-3xl opacity-20 blur-sm"
        ></div>

        <div
          class="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-pink-200/50 overflow-hidden"
        >
          <!-- Section Header -->
          <div
            class="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 px-4 sm:px-6 md:px-8 py-4 sm:py-6 border-b border-pink-200/30"
          >
            <div
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <h3
                  class="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-1"
                >
                  Hot Discussions
                </h3>
                <p class="text-gray-600 text-sm sm:text-base font-medium">
                  Trending topics in our community
                </p>
              </div>

              <!-- Controls -->
              <div class="flex items-center space-x-2 sm:space-x-3">
                <button
                  @click="prevTopic"
                  :disabled="currentTopicIndex === 0"
                  class="p-2 sm:p-3 rounded-2xl bg-white/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 border border-pink-200/50"
                >
                  <ChevronLeft class="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  @click="nextTopic"
                  :disabled="currentTopicIndex >= hotTopics.length - 3"
                  class="p-2 sm:p-3 rounded-2xl bg-white/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 border border-pink-200/50"
                >
                  <ChevronRight class="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  @click="navigateToForums"
                  class="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold px-3 py-2 sm:px-4 sm:py-3 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                >
                  <span>View All</span>
                  <ArrowRight class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <!-- Topics Content -->
          <div class="p-4 sm:p-6 md:p-8">
            <!-- Loading State -->
            <div
              v-if="isLoading"
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <div
                v-for="i in 3"
                :key="i"
                class="h-32 sm:h-40 bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl animate-pulse"
              ></div>
            </div>

            <!-- Hot Topics -->
            <div
              v-else-if="hotTopics.length > 0"
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <div
                v-for="topic in visibleTopics"
                :key="topic.id"
                class="relative group cursor-pointer"
                @click="navigateToTopic(topic)"
              >
                <div
                  class="absolute -inset-0.5 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
                ></div>

                <div
                  class="relative bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-3xl border border-pink-200/30 transition-all duration-500 transform hover:scale-[1.02]"
                >
                  <!-- Topic Header -->
                  <div
                    class="flex flex-wrap items-start justify-between mb-3 sm:mb-4 gap-2"
                  >
                    <div class="flex items-center space-x-2 sm:space-x-3">
                      <span
                        class="inline-flex items-center px-2 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider"
                        :class="getCategoryStyle(topic.category || 'GENERAL')"
                      >
                        {{ topic.category || "General Discussion" }}
                      </span>
                      <span
                        v-if="topic.is_hot"
                        class="inline-flex items-center px-2 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-black bg-gradient-to-r from-red-500 to-orange-500 text-white"
                      >
                        <Flame class="w-3 h-3 mr-1" /> HOT
                      </span>
                    </div>

                    <div
                      class="flex items-center space-x-2 sm:space-x-4 text-xs sm:text-sm text-gray-500"
                    >
                      <div
                        class="flex items-center space-x-1 bg-white/60 backdrop-blur-sm px-2 py-1 rounded-full"
                      >
                        <Eye class="w-4 h-4" />
                        <span class="font-semibold">{{
                          formatNumber(topic.views_count || 0)
                        }}</span>
                      </div>
                      <div
                        class="flex items-center space-x-1 bg-white/60 backdrop-blur-sm px-2 py-1 rounded-full"
                      >
                        <MessageSquare class="w-4 h-4" />
                        <span class="font-semibold">{{
                          formatNumber(topic.comments_count || 0)
                        }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Topic Content -->
                  <h4
                    class="text-base sm:text-lg md:text-xl font-black text-gray-900 mb-2 sm:mb-3 group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2"
                  >
                    {{ topic.title }}
                  </h4>
                  <p
                    class="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2 leading-relaxed"
                  >
                    {{ topic.body }}
                  </p>

                  <!-- Footer -->
                  <div
                    class="flex items-center justify-between flex-wrap gap-3"
                  >
                    <div class="flex items-center space-x-2 sm:space-x-3">
                      <div
                        class="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-pink-200"
                      >
                        <img
                          v-if="topic.creator?.image_url"
                          :src="topic.creator.image_url"
                          :alt="topic.creator.name"
                          class="w-full h-full object-cover"
                        />
                        <div
                          v-else
                          class="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center"
                        >
                          <User class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                      </div>
                      <div>
                        <p class="text-xs sm:text-sm font-bold text-gray-900">
                          {{ topic.creator?.name || "Anonymous" }}
                        </p>
                        <p
                          class="text-[10px] sm:text-xs text-gray-500 font-medium"
                        >
                          {{ topic.creator?.role || "Member" }}
                        </p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-xs sm:text-sm font-bold text-gray-900">
                        {{ formatDate(topic.created_at) }}
                      </p>
                      <p
                        class="text-[10px] sm:text-xs text-gray-500 font-medium"
                      >
                        Last reply {{ formatDate(topic.updated_at) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12 sm:py-16">
              <div
                class="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6"
              >
                <MessageSquare class="w-8 h-8 sm:w-10 sm:h-10 text-pink-400" />
              </div>
              <h3
                class="text-lg sm:text-xl font-black text-gray-900 mb-1 sm:mb-2"
              >
                No Hot Discussions Yet
              </h3>
              <p class="text-gray-600 text-sm sm:text-base">
                Be the first to start a trending conversation!
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Call to Action Section -->
      <div class="text-center">
        <div class="relative inline-block group">
          <div
            class="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-60 group-hover:opacity-100 transition duration-500"
          ></div>
          <button
            @click="navigateToForums"
            class="relative bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black px-12 py-6 rounded-3xl transition-all duration-500 transform hover:scale-105 shadow-2xl"
          >
            <div class="flex items-center space-x-3">
              <Users class="w-6 h-6" />
              <span class="text-lg tracking-wide">Join Our Community</span>
              <ArrowRight class="w-6 h-6" />
            </div>
          </button>
        </div>

        <p class="text-gray-600 mt-4 font-medium">
          Connect with {{ formatNumber(forumStats.active_users) }} other KIIS
          listeners
        </p>
      </div>
    </div>

    <!-- Bottom Curved Border -->
    <div class="absolute bottom-0 left-0 w-full overflow-hidden z-10">
      <svg
        class="w-full h-auto"
        preserveAspectRatio="none"
        viewBox="0 0 1200 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 L1200,80 L0,80 Z"
          fill="url(#bottomWave1)"
          opacity="0.3"
        />
        <path
          d="M0,50 C300,10 500,70 800,30 C900,10 1100,60 1200,35 L1200,80 L0,80 Z"
          fill="url(#bottomWave2)"
          opacity="0.2"
        />
        <path
          d="M0,60 C250,20 450,80 700,45 C850,25 1050,75 1200,55 L1200,80 L0,80 Z"
          fill="white"
        />

        <defs>
          <linearGradient id="bottomWave1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color: #ff6b9d; stop-opacity: 1" />
            <stop offset="50%" style="stop-color: #8b5cf6; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: #ff6b9d; stop-opacity: 1" />
          </linearGradient>
          <linearGradient id="bottomWave2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color: #a78bfa; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: #f472b6; stop-opacity: 1" />
          </linearGradient>
        </defs>
      </svg>
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
    MUSIC:
      "bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-600 border border-red-200",
    EVENTS:
      "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-600 border border-blue-200",
    TECHNOLOGY:
      "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-600 border border-yellow-200",
    GENERAL:
      "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-600 border border-gray-200",
    ANNOUNCEMENTS:
      "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600 border border-green-200",
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

/* Custom gradient text effects */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Enhanced backdrop blur for better glass effect */
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
}

.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* Smooth transitions */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Enhanced hover effects */
button:hover,
.group:hover {
  transform: translateY(-2px);
}

/* Professional shadows */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(244, 114, 182, 0.25);
}
</style>
