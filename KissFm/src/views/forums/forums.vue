<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section
      class="relative min-h-[105vh] flex items-center justify-center overflow-hidden"
    >
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1696041757950-62e2c030283b?w=1500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9ydW1zJTJDJTIwY29tbXVuaXR5fGVufDB8fDB8fHww"
          alt="Community Discussion"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/80"></div>
      </div>

      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden opacity-20">
        <div
          class="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500 rounded-full blur-3xl animate-pulse"
        ></div>
        <div
          class="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-600 rounded-full blur-3xl animate-pulse"
          style="animation-delay: 1s"
        ></div>
        <div
          class="absolute top-1/2 right-1/3 w-48 h-48 bg-pink-400 rounded-full blur-3xl animate-pulse"
          style="animation-delay: 2s"
        ></div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 container mx-auto px-6 text-center">
        <!-- Hero Badge -->
        <div class="inline-flex items-center justify-center mb-8">
          <div class="h-px w-12 bg-pink-500"></div>
          <span
            class="mx-4 text-pink-400 font-bold tracking-wider text-sm uppercase"
            >Community</span
          >
          <div class="h-px w-12 bg-pink-500"></div>
        </div>

        <!-- Main Heading -->
        <h1
          class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Community <span class="text-pink-500">Forums</span>
        </h1>

        <!-- Subtitle -->
        <p
          class="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed"
        >
          Join the discussion and connect with fellow KIIS 100.9 listeners
          across Uganda
        </p>

        <!-- Live Stats Row -->
        <div
          class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto"
        >
          <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-pink-500 mb-2">
              {{ forumStats.total_topics }}
            </div>
            <div class="text-sm text-gray-300 uppercase tracking-wide">
              Total Topics
            </div>
          </div>
          <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
              {{ forumStats.total_replies }}
            </div>
            <div class="text-sm text-gray-300 uppercase tracking-wide">
              Total Replies
            </div>
          </div>
          <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-pink-500 mb-2">
              {{ forumStats.active_users }}
            </div>
            <div class="text-sm text-gray-300 uppercase tracking-wide">
              Active Users
            </div>
          </div>
          <div class="text-center">
            <div
              class="text-3xl md:text-4xl font-bold text-purple-600 mb-2 flex items-center justify-center gap-2"
            >
              {{ forumStats.online_now }}
              <div class="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
            </div>
            <div class="text-sm text-gray-300 uppercase tracking-wide">
              Online Now
            </div>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div
          class="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            @click="togglePlayPause"
            :disabled="isLoading"
            class="bg-pink-500 hover:bg-pink-600 px-8 py-4 rounded-2xl text-white font-bold flex items-center space-x-3 transition-all duration-300"
          >
            <div
              v-if="isLoading"
              class="w-5 rounded-full h-5 border-2 border-white border-t-transparent animate-spin"
            ></div>
            <Volume2 v-else-if="isPlaying" :size="20" class="animate-bounce" />
            <Play v-else :size="20" />
            <span class="tracking-wide" v-if="isLoading">CONNECTING</span>
            <span class="tracking-wide" v-else-if="isPlaying"
              >LISTENING LIVE</span
            >
            <span class="tracking-wide" v-else>TUNE IN NOW</span>
          </button>

          <button
            @click="scrollToForums"
            class="bg-white/10 backdrop-blur-md border-2 border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300"
          >
            <span class="tracking-wide">Browse Topics</span>
          </button>
        </div>
      </div>

      <!-- Bottom Wave Divider -->
      <div class="absolute bottom-0 left-0 w-full">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          class="w-full h-16"
        >
          <path
            fill="white"
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,31,17,94.98,30.44c64.64,13.91,93.29,29.88,150.17,38.07,65.88,9.2,165.63,17.05,240.88,12.55Z"
          />
        </svg>
      </div>
    </section>

    <!-- Main Content -->
    <div class="bg-white relative" id="forums-content">
      <!-- Floating background elements -->
      <div
        class="absolute inset-0 overflow-hidden opacity-5 pointer-events-none"
      >
        <div
          class="absolute top-1/4 left-1/5 w-32 h-32 bg-pink-500 rounded-full blur-2xl animate-float"
        ></div>
        <div
          class="absolute bottom-1/3 right-1/5 w-40 h-40 bg-purple-600 rounded-full blur-3xl animate-float"
          style="animation-delay: 2s"
        ></div>
        <div
          class="absolute top-1/2 left-1/2 w-24 h-24 bg-pink-400 rounded-full blur-xl animate-pulse-slow"
        ></div>
      </div>

      <div class="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <!-- Search Bar -->
        <div class="mb-12">
          <div class="relative max-w-2xl mx-auto">
            <Search
              class="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-500 w-5 h-5"
            />
            <input
              v-model="searchQuery"
              @input="debounceSearch"
              type="text"
              placeholder="Search forum discussions..."
              class="w-full pl-12 pr-4 py-4 bg-white border-2 border-pink-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 shadow-sm"
            />
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div
            class="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"
          ></div>
        </div>

        <!-- Forums Content -->
        <div v-else-if="forums && forums.data && forums.data.length > 0">
          <!-- Results Info -->
          <div class="flex items-center justify-between mb-8">
            <div class="text-gray-600">
              {{
                searchQuery
                  ? `Search results for "${searchQuery}"`
                  : "All Discussions"
              }}
              - Showing {{ forums.data.length }} of {{ forums.total }}
            </div>
            <div class="text-gray-600">
              Page {{ forums.current_page }} of {{ forums.total_pages }}
            </div>
          </div>

          <!-- Pinned Topics -->
          <div v-if="pinnedTopics.length > 0" class="mb-12">
            <div class="flex items-center gap-3 mb-8">
              <div
                class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center"
              >
                <Pin class="w-5 h-5 text-yellow-600" />
              </div>
              <h2 class="text-2xl font-bold text-gray-900">
                Pinned Discussions
              </h2>
              <div class="flex-1 h-px bg-yellow-500"></div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div
                v-for="topic in pinnedTopics"
                :key="topic.id"
                class="bg-white rounded-xl p-6 border-2 border-pink-100 shadow-sm hover:shadow-md hover:border-pink-300 transition-all group cursor-pointer relative overflow-hidden"
                @click="
                  $router.push({
                    name: 'forum_details',
                    params: { id: topic.slug },
                  })
                "
              >
                <!-- Background on hover -->
                <div
                  class="absolute -inset-1 bg-pink-500 rounded-xl blur opacity-0 group-hover:opacity-10 transition duration-300"
                ></div>

                <div class="relative">
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center space-x-2">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                      >
                        <Pin class="w-3 h-3 mr-1" />
                        Pinned
                      </span>
                      <span
                        v-if="topic.is_hot"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                      >
                        <Flame class="w-3 h-3 mr-1" />
                        Hot
                      </span>
                    </div>

                    <div
                      class="flex items-center space-x-4 text-sm text-gray-500"
                    >
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

                  <h3
                    class="text-lg font-semibold text-gray-900 mb-3 group-hover:text-pink-500 transition-colors line-clamp-2"
                  >
                    {{ topic.title }}
                  </h3>

                  <p class="text-gray-600 mb-4 line-clamp-2">
                    {{ topic.body }}
                  </p>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <div
                        class="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center"
                      >
                        <User class="w-4 h-4 text-pink-500" />
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">
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
          </div>

          <!-- Regular Topics -->
          <div class="space-y-4 mb-8">
            <div class="flex items-center gap-3 mb-8">
              <div
                class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"
              >
                <MessageCircle class="w-5 h-5 text-purple-600" />
              </div>
              <h2 class="text-2xl font-bold text-gray-900">All Discussions</h2>
              <div class="flex-1 h-px bg-purple-600"></div>
            </div>

            <div
              v-for="topic in regularTopics"
              :key="topic.id"
              class="bg-white rounded-xl p-6 border-2 border-pink-100 shadow-sm hover:shadow-md hover:border-pink-300 transition-all group cursor-pointer relative overflow-hidden"
              @click="
                $router.push({
                  name: 'forum_details',
                  params: { id: topic.slug },
                })
              "
            >
              <!-- Background on hover -->
              <div
                class="absolute -inset-1 bg-pink-500 rounded-xl blur opacity-0 group-hover:opacity-8 transition duration-300"
              ></div>

              <div class="relative">
                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0 mt-1">
                    <div
                      class="w-12 h-12 rounded-full flex items-center justify-center"
                      :class="
                        topic.is_hot
                          ? 'bg-red-100 text-red-600'
                          : 'bg-pink-100 text-pink-500'
                      "
                    >
                      <MessageCircle class="w-6 h-6" />
                    </div>
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-3 mb-2">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        General Discussion
                      </span>

                      <span
                        v-if="topic.is_hot"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                      >
                        <Flame class="w-3 h-3 mr-1" />
                        Hot
                      </span>
                    </div>

                    <h3
                      class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-pink-500 transition-colors line-clamp-2"
                    >
                      {{ topic.title }}
                    </h3>

                    <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                      {{ topic.body }}
                    </p>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <div
                          class="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center"
                        >
                          <User class="w-4 h-4 text-pink-500" />
                        </div>
                        <div>
                          <p class="text-sm font-medium text-gray-900">
                            {{ topic.creator?.name || "Anonymous" }}
                          </p>
                          <p class="text-xs text-gray-500">
                            {{ formatDate(topic.created_at) }}
                          </p>
                        </div>
                      </div>

                      <div
                        class="flex items-center space-x-4 text-sm text-gray-500"
                      >
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
          </div>

          <!-- Pagination -->
          <div
            v-if="forums.total_pages > 1"
            class="flex justify-center items-center gap-2 mt-12"
          >
            <button
              @click="changePage(forums.current_page - 1)"
              :disabled="forums.current_page <= 1"
              class="px-4 py-2 bg-white border-2 border-pink-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-50 transition-colors"
            >
              Previous
            </button>

            <div class="flex items-center gap-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                class="w-10 h-10 rounded-lg transition-colors font-medium"
                :class="
                  page === forums.current_page
                    ? 'bg-pink-500 text-white'
                    : 'bg-white border-2 border-pink-200 text-gray-700 hover:bg-pink-50'
                "
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="changePage(forums.current_page + 1)"
              :disabled="forums.current_page >= forums.total_pages"
              class="px-4 py-2 bg-white border-2 border-pink-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div
            class="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <MessageCircle class="w-8 h-8 text-pink-500" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            No Discussions Found
          </h3>
          <p class="text-gray-600 mb-6">
            {{
              searchQuery
                ? `No results found for "${searchQuery}"`
                : "Be the first to start a discussion!"
            }}
          </p>
          <button
            @click="createTopic"
            class="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
          >
            Start New Discussion
          </button>
        </div>

        <!-- Floating Create Button -->
        <div class="fixed bottom-8 right-8">
          <button
            @click="createTopic"
            class="w-14 h-14 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 hover:bg-pink-600"
          >
            <Plus class="w-6 h-6" />
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
