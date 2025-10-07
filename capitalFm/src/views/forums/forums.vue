<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Header Section -->
    <div class="relative bg-black border-b border-gray-800 overflow-hidden" style="margin-top: -5rem !important; padding-top: 5rem;">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Community Discussion"
          class="w-full h-full object-cover opacity-40"
        />
        <div class="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center max-w-3xl mx-auto">
          <div class="inline-flex items-center justify-center mb-4">
            <MessageCircle class="text-[#F8CB00] mr-2" :size="24" />
            <span class="text-[#F8CB00] font-semibold uppercase tracking-wider text-sm">Community</span>
          </div>
          <h1 class="text-4xl sm:text-5xl font-bold text-white mb-4">
            Community Forums
          </h1>
          <p class="text-lg text-gray-300">
            Join the discussion and connect with fellow Capital FM listeners
          </p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
          <div class="text-center">
            <div class="text-3xl font-bold text-[#F8CB00]">{{ forumStats.total_topics }}</div>
            <div class="text-sm text-gray-400 mt-1">Total Topics</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-[#F8CB00]">{{ forumStats.total_replies }}</div>
            <div class="text-sm text-gray-400 mt-1">Total Replies</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-[#F8CB00]">{{ forumStats.active_users }}</div>
            <div class="text-sm text-gray-400 mt-1">Active Users</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-[#F8CB00] flex items-center justify-center gap-2">
              {{ forumStats.online_now }}
              <div class="w-2 h-2 bg-[#F8CB00] rounded-full animate-pulse"></div>
            </div>
            <div class="text-sm text-gray-400 mt-1">Online Now</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="bg-gray-50 relative" id="forums-content">

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        <!-- Search Bar -->
        <div class="mb-8 md:mb-12">
          <div class="relative max-w-2xl mx-auto">
            <Search
              class="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5"
            />
            <input
              v-model="searchQuery"
              @input="debounceSearch"
              type="text"
              placeholder="Search forum discussions..."
              class="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 bg-white border border-gray-300 rounded-lg md:rounded-xl text-sm md:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F8CB00] focus:border-transparent shadow-sm"
            />
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-12 md:py-20">
          <div
            class="w-8 h-8 md:w-12 md:h-12 border-4 border-gray-300 border-t-[#F8CB00] rounded-full animate-spin"
          ></div>
        </div>

        <!-- Forums Content -->
        <div v-else-if="forums && forums.data && forums.data.length > 0">
          <!-- Results Info -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 gap-2">
            <div class="text-sm md:text-base text-gray-600">
              {{
                searchQuery
                  ? `Search results for "${searchQuery}"`
                  : "All Discussions"
              }}
              - Showing {{ forums.data.length }} of {{ forums.total }}
            </div>
            <div class="text-xs md:text-sm text-gray-500">
              Page {{ forums.current_page }} of {{ forums.total_pages }}
            </div>
          </div>

          <!-- Pinned Topics -->
          <div v-if="pinnedTopics.length > 0" class="mb-8 md:mb-12">
            <div class="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
              <div
                class="w-8 h-8 md:w-9 md:h-9 bg-[#F8CB00]/20 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <Pin class="w-4 h-4 md:w-5 md:h-5 text-[#F8CB00]" />
              </div>
              <h2 class="text-xl md:text-2xl font-bold text-gray-900">
                Pinned Discussions
              </h2>
              <div
                class="flex-1 h-px bg-gray-200"
              ></div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              <div
                v-for="topic in pinnedTopics"
                :key="topic.id"
                class="bg-white rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-[#F8CB00] transition-all group cursor-pointer relative"
                @click="
                  $router.push({
                    name: 'forum_details',
                    params: { id: topic.slug },
                  })
                "
              >

                <div class="relative">
                  <div class="flex items-start justify-between mb-3 md:mb-4">
                    <div class="flex items-center flex-wrap gap-1.5 md:gap-2">
                      <span
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium bg-[#F8CB00]/20 text-[#F8CB00]"
                      >
                        <Pin class="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />
                        Pinned
                      </span>
                      <span
                        v-if="topic.is_hot"
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium bg-red-100 text-red-700"
                      >
                        <Flame class="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />
                        Hot
                      </span>
                    </div>

                    <div
                      class="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500 flex-shrink-0"
                    >
                      <div class="flex items-center gap-1">
                        <Eye class="w-3 h-3 md:w-4 md:h-4" />
                        <span>{{ topic.views_count || 0 }}</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <MessageCircle class="w-3 h-3 md:w-4 md:h-4" />
                        <span>{{ topic.comments_count || 0 }}</span>
                      </div>
                    </div>
                  </div>

                  <h3
                    class="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3 group-hover:text-[#F8CB00] transition-colors line-clamp-2"
                  >
                    {{ topic.title }}
                  </h3>

                  <p class="text-sm md:text-base text-gray-600 mb-3 md:mb-4 line-clamp-2">
                    {{ topic.body }}
                  </p>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <div
                        class="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"
                      >
                        <User class="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500" />
                      </div>
                      <div class="min-w-0">
                        <p class="text-xs md:text-sm font-medium text-gray-900 truncate">
                          {{ topic.creator?.name || "Anonymous" }}
                        </p>
                        <p class="text-[10px] md:text-xs text-gray-500">
                          {{ formatDate(topic.created_at) }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Regular Topics -->
          <div class="space-y-3 md:space-y-4 mb-6 md:mb-8">
            <div class="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
              <div
                class="w-8 h-8 md:w-9 md:h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <MessageCircle class="w-4 h-4 md:w-5 md:h-5 text-gray-900" />
              </div>
              <h2 class="text-xl md:text-2xl font-bold text-gray-900">All Discussions</h2>
              <div
                class="flex-1 h-px bg-gray-200"
              ></div>
            </div>

            <div
              v-for="topic in regularTopics"
              :key="topic.id"
              class="bg-white rounded-lg md:rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-[#F8CB00] transition-all group cursor-pointer relative"
              @click="
                $router.push({
                  name: 'forum_details',
                  params: { id: topic.slug },
                })
              "
            >

              <div class="relative">
                <div class="flex items-start gap-3 md:gap-4">
                  <div class="flex-shrink-0 mt-1">
                    <div
                      class="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center"
                      :class="
                        topic.is_hot
                          ? 'bg-red-100 text-red-600'
                          : 'bg-gray-100 text-gray-600'
                      "
                    >
                      <MessageCircle class="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center flex-wrap gap-1.5 md:gap-2 mb-2">
                      <span
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        General Discussion
                      </span>

                      <span
                        v-if="topic.is_hot"
                        class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium bg-red-100 text-red-700"
                      >
                        <Flame class="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />
                        Hot
                      </span>
                    </div>

                    <h3
                      class="text-base md:text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#F8CB00] transition-colors line-clamp-2"
                    >
                      {{ topic.title }}
                    </h3>

                    <p class="text-gray-600 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2">
                      {{ topic.body }}
                    </p>

                    <div class="flex items-center justify-between gap-3">
                      <div class="flex items-center gap-2 min-w-0">
                        <div
                          class="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"
                        >
                          <User class="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500" />
                        </div>
                        <div class="min-w-0">
                          <p class="text-xs md:text-sm font-medium text-gray-900 truncate">
                            {{ topic.creator?.name || "Anonymous" }}
                          </p>
                          <p class="text-[10px] md:text-xs text-gray-500">
                            {{ formatDate(topic.created_at) }}
                          </p>
                        </div>
                      </div>

                      <div
                        class="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500 flex-shrink-0"
                      >
                        <div class="flex items-center gap-1">
                          <Eye class="w-3 h-3 md:w-4 md:h-4" />
                          <span class="hidden sm:inline">{{ topic.views_count || 0 }}</span>
                        </div>
                        <div class="flex items-center gap-1">
                          <MessageCircle class="w-3 h-3 md:w-4 md:h-4" />
                          <span>{{ topic.comments_count || 0 }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div
            v-if="forums.total_pages > 1"
            class="flex justify-center items-center gap-1.5 md:gap-2 mt-8 md:mt-12"
          >
            <button
              @click="changePage(forums.current_page - 1)"
              :disabled="forums.current_page <= 1"
              class="px-3 md:px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm md:text-base"
            >
              <span class="hidden sm:inline">Previous</span>
              <span class="sm:hidden">Prev</span>
            </button>

            <div class="flex items-center gap-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                class="w-8 h-8 md:w-10 md:h-10 rounded-lg transition-colors font-medium text-sm md:text-base"
                :class="
                  page === forums.current_page
                    ? 'bg-[#F8CB00] text-black'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                "
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="changePage(forums.current_page + 1)"
              :disabled="forums.current_page >= forums.total_pages"
              class="px-3 md:px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm md:text-base"
            >
              Next
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12 md:py-20 px-4">
          <div
            class="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4"
          >
            <MessageCircle class="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
          </div>
          <h3 class="text-lg md:text-xl font-semibold text-gray-900 mb-2">
            No Discussions Found
          </h3>
          <p class="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
            {{
              searchQuery
                ? `No results found for "${searchQuery}"`
                : "Be the first to start a discussion!"
            }}
          </p>
          <button
            @click="createTopic"
            class="px-5 md:px-6 py-2.5 md:py-3 bg-[#F8CB00] text-black rounded-lg hover:bg-yellow-500 transition-colors font-medium text-sm md:text-base"
          >
            Start New Discussion
          </button>
        </div>

        <!-- Floating Create Button -->
        <div class="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40">
          <button
            @click="createTopic"
            class="w-12 h-12 md:w-14 md:h-14 bg-[#F8CB00] rounded-full flex items-center justify-center text-black shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 hover:bg-yellow-500"
          >
            <Plus class="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      <!-- Bottom wave for potential next section -->
      <div class="absolute bottom-0 left-0 w-full transform translate-y-1">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          class="w-full h-16"
        >
          <path
            fill="rgb(248 250 252)"
            d="M0,120 Q300,80 600,100 T1200,90 L1200,120 Z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import {
  Search,
  MessageCircle,
  Eye,
  Pin,
  Flame,
  Plus,
  Users,
  TrendingUp,
  User,
  Volume2,
  Play,
} from "lucide-vue-next";

const store = useStore();
const forums = computed(() => store.getters.forums);
const station = computed(() => store.getters.station);
const isPlaying = computed(() => store.getters.isPlaying);
const isLoading = ref(false);

// Search state
const searchQuery = ref("");
const searchTimeout = ref(null);

const togglePlayPause = async () => {
  isLoading.value = true;
  try {
    await store.dispatch("togglePlayPause");
  } catch (err) {
    console.error("Failed to toggle playback:", err);
  } finally {
    isLoading.value = false;
  }
};

const filters = ref({
  search: "",
  station_id: station.value?.id || 1,
  page: 1,
  per_page: 12,
});

// Forum stats from API response
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
    total_topics: 0,
    total_replies: 0,
    active_users: 0,
    online_now: 0,
  };
});

// Computed properties for topics
const pinnedTopics = computed(() => {
  if (!forums.value?.data) return [];
  return forums.value.data.filter((topic) => topic.is_pinned);
});

const regularTopics = computed(() => {
  if (!forums.value?.data) return [];
  return forums.value.data.filter((topic) => !topic.is_pinned);
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
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
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
    await store.dispatch("fetch_user_forums", filters.value);
  } catch (err) {
    console.error("Failed to fetch filtered forums:", err);
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
    await store.dispatch("fetch_user_forums", data);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    console.error("Failed to fetch forums:", err);
  } finally {
    isLoading.value = false;
  }
};

const createTopic = () => {
  console.log("Create new topic");
};

const scrollToForums = () => {
  document.getElementById("forums-content").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const getForums = async () => {
  isLoading.value = true;
  const data = {
    ...filters.value,
    station_id: station.value?.id || 1,
  };

  try {
    await store.dispatch("fetch_user_forums", data);
  } catch (err) {
    console.error("Failed to fetch forums:", err);
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

/* Floating animation */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Smooth animations */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Hover effects */
.group:hover .group-hover\:text-blue-600 {
  color: rgb(37 99 235);
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
</style>
