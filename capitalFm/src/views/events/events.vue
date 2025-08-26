<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section
      class="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      style="margin-top: -5rem !important"
    >
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Events"
          class="w-full h-full object-cover"
        />
        <div
          class="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"
        ></div>
      </div>

      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden opacity-20">
        <div
          class="absolute top-1/4 left-1/4 w-64 h-64 bg-[#F8CB00] rounded-full blur-3xl animate-pulse"
        ></div>
        <div
          class="absolute bottom-1/4 right-1/4 w-72 h-72 bg-red-500 rounded-full blur-3xl animate-pulse"
          style="animation-delay: 1s"
        ></div>
        <div
          class="absolute top-1/2 right-1/3 w-48 h-48 bg-blue-500 rounded-full blur-3xl animate-pulse"
          style="animation-delay: 2s"
        ></div>
      </div>

      <!-- Hero Content -->
      <div
        class="relative z-10 container mx-auto py-28 md:py-0 px-6 text-center"
      >
        <!-- Hero Badge -->
        <div class="inline-flex items-center justify-center mb-8 lg:pt-14">
          <div class="h-px w-12 bg-[#F8CB00]"></div>
          <span
            class="mx-4 text-[#F8CB00] font-bold tracking-wider text-sm uppercase"
            >Live Events</span
          >
          <div class="h-px w-12 bg-[#F8CB00]"></div>
        </div>

        <!-- Main Heading -->
        <h1
          class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Capital FM <span class="text-[#F8CB00]">Events</span>
        </h1>

        <!-- Subtitle -->
        <p
          class="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed"
        >
          Experience the best live events, concerts, and entertainment in Uganda
        </p>

        <!-- Live Stats Row -->
        <div
          class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto"
        >
          <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-[#F8CB00] mb-2">
              {{ eventStats.upcoming_events }}
            </div>
            <div class="text-sm text-gray-300 uppercase tracking-wide">
              Upcoming Events
            </div>
          </div>
          <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-red-400 mb-2">
              {{ eventStats.this_month }}
            </div>
            <div class="text-sm text-gray-300 uppercase tracking-wide">
              This Month
            </div>
          </div>
          <div class="text-center">
            <div class="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
              {{ events?.total || 0 }}
            </div>
            <div class="text-sm text-gray-300 uppercase tracking-wide">
              Total Events
            </div>
          </div>
          <div class="text-center">
            <div
              class="text-3xl md:text-4xl font-bold text-green-400 mb-2 flex items-center justify-center gap-2"
            >
              {{ eventStats.featured_events }}
              <div
                v-if="eventStats.featured_events > 0"
                class="w-3 h-3 bg-green-500 rounded-full animate-pulse"
              ></div>
            </div>
            <div class="text-sm text-gray-300 uppercase tracking-wide">
              Featured Events
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
            class="relative group overflow-hidden rounded-2xl"
          >
            <div
              class="absolute -inset-0.5 bg-gradient-to-r from-[#F8CB00] via-red-500 to-blue-500 rounded-2xl blur opacity-60 group-hover:opacity-80 transition duration-300"
            ></div>
            <div
              class="relative bg-gradient-to-r from-[#F8CB00] to-red-500 px-8 py-4 rounded-2xl text-black font-bold flex items-center space-x-3 transition-all duration-300"
            >
              <div
                v-if="isLoading"
                class="w-5 h-5 border-2 rounded-full border-black border-t-transparent animate-spin"
              ></div>
              <Volume2
                v-else-if="isPlaying"
                :size="20"
                class="animate-bounce"
              />
              <Play class="text-white" v-else :size="20" />
              <span class="tracking-wide" v-if="isLoading">CONNECTING</span>
              <span class="tracking-wide" v-else-if="isPlaying"
                >LISTENING LIVE</span
              >
              <span class="tracking-wide text-white" v-else>TUNE IN NOW</span>
            </div>
          </button>

          <button
            @click="scrollToEvents"
            class="bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300"
          >
            <span class="tracking-wide">VIEW ALL EVENTS</span>
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
    <div class="bg-white relative" id="events-content">
      <!-- Floating background elements -->
      <div
        class="absolute inset-0 overflow-hidden opacity-5 pointer-events-none"
      >
        <div
          class="absolute top-1/4 left-1/5 w-32 h-32 bg-[#F8CB00] rounded-full blur-2xl animate-float"
        ></div>
        <div
          class="absolute bottom-1/3 right-1/5 w-40 h-40 bg-red-500 rounded-full blur-3xl animate-float"
          style="animation-delay: 2s"
        ></div>
        <div
          class="absolute top-1/2 left-1/2 w-24 h-24 bg-blue-500 rounded-full blur-xl animate-pulse-slow"
        ></div>
      </div>

      <div class="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <!-- Search and Filters Section -->
        <div class="mb-12">
          <div
            class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto"
          >
            <!-- Search Events -->
            <div class="relative">
              <Search
                class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
              <input
                v-model="searchQuery"
                @input="debounceSearch"
                type="text"
                placeholder="Search events..."
                class="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F8CB00] focus:border-transparent shadow-sm"
              />
            </div>

            <!-- Date Filter -->
            <div class="relative">
              <Calendar
                class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
              <input
                v-model="selectedDate"
                @change="filterByDate"
                type="date"
                class="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F8CB00] focus:border-transparent shadow-sm"
              />
            </div>

            <!-- Category Filter -->
            <div class="relative">
              <select
                v-model="selectedCategory"
                @change="filterByCategory"
                class="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F8CB00] focus:border-transparent shadow-sm appearance-none"
              >
                <option value="">All Categories</option>
                <option
                  v-for="category in eventCategories"
                  :key="category"
                  :value="category"
                >
                  {{ formatCategoryName(category) }}
                </option>
              </select>
              <ChevronDown
                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"
              />
            </div>
          </div>

          <!-- Quick Filters -->
          <div class="flex flex-wrap justify-center gap-3 mb-8">
            <button
              @click="setQuickFilter('upcoming')"
              :class="
                quickFilter === 'upcoming'
                  ? 'bg-[#F8CB00] text-black'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              "
              class="px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Upcoming Events
            </button>
            <button
              @click="setQuickFilter('this_week')"
              :class="
                quickFilter === 'this_week'
                  ? 'bg-[#F8CB00] text-black'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              "
              class="px-4 py-2 rounded-lg font-medium transition-colors"
            >
              This Week
            </button>
            <button
              @click="setQuickFilter('featured')"
              :class="
                quickFilter === 'featured'
                  ? 'bg-[#F8CB00] text-black'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              "
              class="px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Featured
            </button>
            <button
              @click="setQuickFilter('public')"
              :class="
                quickFilter === 'public'
                  ? 'bg-[#F8CB00] text-black'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              "
              class="px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Public Events
            </button>
            <button
              @click="clearFilters"
              class="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <X class="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div
          v-if="isLoadingEvents"
          class="flex justify-center items-center py-20"
        >
          <div
            class="w-12 h-12 border-4 border-gray-300 border-t-[#F8CB00] rounded-full animate-spin"
          ></div>
        </div>

        <!-- Events Content -->
        <div v-else-if="eventsData.length > 0">
          <!-- Results Info -->
          <div class="flex items-center justify-between mb-8">
            <div class="text-gray-600">
              {{ getResultsText() }}
            </div>
            <div class="text-gray-600">
              {{ events?.total || 0 }}
              {{ (events?.total || 0) === 1 ? "event" : "events" }}
            </div>
          </div>

          <!-- Featured Events -->
          <div v-if="featuredEvents.length > 0" class="mb-12">
            <div class="flex items-center gap-3 mb-8">
              <div
                class="w-8 h-8 bg-[#F8CB00]/20 rounded-lg flex items-center justify-center"
              >
                <Star class="w-5 h-5 text-[#F8CB00]" />
              </div>
              <h2 class="text-2xl font-bold text-gray-900">Featured Events</h2>
              <div
                class="flex-1 h-px bg-gradient-to-r from-[#F8CB00] to-transparent"
              ></div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div
                v-for="event in featuredEvents.slice(0, 2)"
                :key="event.id"
                class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-200 hover:border-[#F8CB00] transition-all group cursor-pointer relative"
                @click="openEventDetails(event)"
              >
                <!-- Gradient background on hover -->
                <div
                  class="absolute -inset-1 bg-gradient-to-r from-[#F8CB00] via-red-500 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-10 transition duration-300"
                ></div>

                <div class="relative">
                  <div class="relative h-64 overflow-hidden">
                    <img
                      :src="
                        event.featured_image_url ||
                        getDefaultEventImage(event.category)
                      "
                      :alt="event.title"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
                    ></div>

                    <!-- Event Type Badge -->
                    <div class="absolute top-4 right-4">
                      <span
                        class="bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium"
                      >
                        {{ formatEventType(event.event_type) }}
                      </span>
                    </div>

                    <!-- Date Badge -->
                    <div class="absolute bottom-4 left-4">
                      <span
                        class="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-gray-900 text-sm font-medium"
                      >
                        {{ formatEventDate(event.start_date) }}
                      </span>
                    </div>
                  </div>

                  <div class="p-6">
                    <div class="flex items-center gap-2 mb-3">
                      <span
                        class="bg-[#F8CB00]/20 text-[#F8CB00] px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {{ formatCategoryName(event.category) }}
                      </span>
                      <span
                        class="text-gray-500 text-sm flex items-center gap-1"
                      >
                        <MapPin class="w-3 h-3" />
                        {{ event.venue_name }}
                      </span>
                    </div>

                    <h3
                      class="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#F8CB00] transition-colors line-clamp-2"
                    >
                      {{ event.title }}
                    </h3>

                    <p class="text-gray-600 mb-4 line-clamp-2">
                      {{ event.description }}
                    </p>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-2">
                        <Clock class="w-4 h-4 text-gray-400" />
                        <span class="text-sm text-gray-600"
                          >{{ event.start_time }} - {{ event.end_time }}</span
                        >
                      </div>

                      <div
                        class="flex items-center space-x-4 text-sm text-gray-500"
                      >
                        <div class="flex items-center space-x-1">
                          <Eye class="w-4 h-4" />
                          <span>{{ event.views_count || 0 }}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                          <Share2 class="w-4 h-4" />
                          <span>{{ event.shares_count || 0 }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- All Events Grid -->
          <div class="space-y-4 mb-8">
            <div class="flex items-center gap-3 mb-8">
              <div
                class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"
              >
                <Calendar class="w-5 h-5 text-blue-600" />
              </div>
              <h2 class="text-2xl font-bold text-gray-900">All Events</h2>
              <div
                class="flex-1 h-px bg-gradient-to-r from-blue-500 to-transparent"
              ></div>
            </div>

            <div
              v-for="event in eventsData"
              :key="event.id"
              class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-[#F8CB00] transition-all group cursor-pointer relative overflow-hidden"
              @click="openEventDetails(event)"
            >
              <!-- Gradient background on hover -->
              <div
                class="absolute -inset-1 bg-gradient-to-r from-[#F8CB00] via-red-500 to-blue-500 rounded-xl blur opacity-0 group-hover:opacity-5 transition duration-300"
              ></div>

              <div class="relative">
                <div class="flex items-start space-x-4">
                  <div class="flex-shrink-0">
                    <div class="w-24 h-24 rounded-lg overflow-hidden relative">
                      <img
                        :src="
                          event.featured_image_url ||
                          getDefaultEventImage(event.category)
                        "
                        :alt="event.title"
                        class="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-3 mb-2">
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F8CB00]/20 text-[#F8CB00]"
                      >
                        {{ formatCategoryName(event.category) }}
                      </span>

                      <span
                        class="text-xs text-gray-500 flex items-center gap-1"
                      >
                        <Calendar class="w-3 h-3" />
                        {{ formatEventDate(event.start_date) }}
                      </span>

                      <span
                        class="text-xs text-gray-500 flex items-center gap-1"
                      >
                        <Clock class="w-3 h-3" />
                        {{ event.start_time }} - {{ event.end_time }}
                      </span>

                      <span
                        class="text-xs text-gray-500 flex items-center gap-1"
                      >
                        <MapPin class="w-3 h-3" />
                        {{ event.venue_name }}
                      </span>

                      <span
                        v-if="event.is_featured"
                        class="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full"
                      >
                        Featured
                      </span>

                      <span
                        v-if="event.is_virtual"
                        class="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full"
                      >
                        Virtual
                      </span>
                    </div>

                    <h3
                      class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#F8CB00] transition-colors line-clamp-2"
                    >
                      {{ event.title }}
                    </h3>

                    <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                      {{ event.description }}
                    </p>

                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-4">
                        <span class="text-sm text-gray-600">
                          <span class="font-medium"
                            >{{ event.city }}, {{ event.country }}</span
                          >
                        </span>
                        <span class="text-sm font-medium text-gray-900">
                          {{ formatEventType(event.event_type) }}
                        </span>
                      </div>

                      <div
                        class="flex items-center space-x-4 text-sm text-gray-500"
                      >
                        <div class="flex items-center space-x-1">
                          <Eye class="w-4 h-4" />
                          <span>{{ event.views_count || 0 }}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                          <Share2 class="w-4 h-4" />
                          <span>{{ event.shares_count || 0 }}</span>
                        </div>
                        <div class="flex items-center space-x-1">
                          <Bookmark class="w-4 h-4" />
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
            v-if="totalPages > 1"
            class="flex justify-center items-center gap-2 mt-12"
          >
            <button
              @click="changePage(events?.current_page - 1)"
              :disabled="!events?.has_prev"
              class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
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
                  page === (events?.current_page || 1)
                    ? 'bg-[#F8CB00] text-black'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                "
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="changePage(events?.current_page + 1)"
              :disabled="!events?.has_next"
              class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div
            class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Calendar class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            No Events Found
          </h3>
          <p class="text-gray-600 mb-6">
            {{ getEmptyStateText() }}
          </p>
          <button
            @click="clearFilters"
            class="px-6 py-3 bg-[#F8CB00] text-black rounded-lg hover:bg-[#F8CB00]/80 transition-colors font-medium"
          >
            Show All Events
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import {
  Search,
  Calendar,
  ChevronDown,
  X,
  Star,
  Clock,
  MapPin,
  Share2,
  Bookmark,
  Play,
  Volume2,
  Eye,
} from "lucide-vue-next";

const store = useStore();
const events = computed(() => store.getters.events || {});
const eventsData = computed(() => events.value?.data || []);
const isLoadingEvents = ref(false);
const isLoading = computed(() => store.getters.isLoading);
const isPlaying = computed(() => store.getters.isPlaying);

// Search and filter states
const searchQuery = ref("");
const selectedDate = ref("");
const selectedCategory = ref("");
const quickFilter = ref("");
const searchTimeout = ref(null);

// Available categories from API structure
const eventCategories = [
  "concert",
  "festival",
  "workshop",
  "conference",
  "comedy",
  "sports",
];

// Event stats computed from real data
const eventStats = computed(() => {
  const data = eventsData.value || [];
  const now = new Date();

  return {
    upcoming_events: data.filter((e) => new Date(e.start_date) > now).length,
    this_month: data.filter((e) => {
      const eventDate = new Date(e.start_date);
      return (
        eventDate.getMonth() === now.getMonth() &&
        eventDate.getFullYear() === now.getFullYear()
      );
    }).length,
    featured_events: data.filter((e) => e.is_featured).length,
  };
});

// Featured events
const featuredEvents = computed(() => {
  return eventsData.value.filter((event) => event.is_featured);
});

// Pagination
const totalPages = computed(() => {
  return events.value?.total_pages || 1;
});

const visiblePages = computed(() => {
  const pages = [];
  const current = events.value?.current_page || 1;
  const total = totalPages.value;

  const start = Math.max(1, current - 2);
  const end = Math.min(total, current + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// Helper functions
const formatEventDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Tomorrow";
  if (diffInDays === -1) return "Yesterday";
  if (diffInDays > 0 && diffInDays < 7) return `In ${diffInDays} days`;
  if (diffInDays < 0 && diffInDays > -7)
    return `${Math.abs(diffInDays)} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

const formatCategoryName = (category) => {
  if (!category) return "";
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const formatEventType = (eventType) => {
  if (!eventType) return "";
  return eventType.charAt(0).toUpperCase() + eventType.slice(1);
};

const getDefaultEventImage = (category) => {
  const images = {
    concert:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    festival:
      "https://images.unsplash.com/photo-1533174972262-ba846eca23bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    workshop:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    conference:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    comedy:
      "https://images.unsplash.com/photo-1594736797933-d0c4a5a65d96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    sports:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  };
  return images[category] || images.concert;
};

// Methods
const togglePlayPause = async () => {
  try {
    await store.dispatch("togglePlayPause");
  } catch (err) {
    console.error("Failed to toggle playback:", err);
  }
};

const debounceSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  searchTimeout.value = setTimeout(() => {
    applyFilters();
  }, 500);
};

const setQuickFilter = (filter) => {
  quickFilter.value = filter === quickFilter.value ? "" : filter;
  applyFilters();
};

const filterByDate = () => {
  applyFilters();
};

const filterByCategory = () => {
  applyFilters();
};

const clearFilters = () => {
  searchQuery.value = "";
  selectedDate.value = "";
  selectedCategory.value = "";
  quickFilter.value = "";
  applyFilters();
};

const applyFilters = async () => {
  const filterData = {};

  // Add search filter
  if (searchQuery.value) {
    filterData.search = searchQuery.value;
  }

  // Add date filter
  if (selectedDate.value) {
    filterData.event_date = selectedDate.value;
  }

  // Add category filter
  if (selectedCategory.value) {
    filterData.category = selectedCategory.value;
  }

  // Add quick filters
  if (quickFilter.value) {
    switch (quickFilter.value) {
      case "upcoming":
        filterData.time_filter = "upcoming";
        break;
      case "this_week":
        const now = new Date();
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        filterData.start_date = now.toISOString();
        filterData.end_date = weekFromNow.toISOString();
        break;
      case "featured":
        filterData.is_featured = true;
        break;
      case "public":
        filterData.event_type = "public";
        break;
    }
  }

  await loadEvents(filterData);
};

const changePage = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    await loadEvents({}, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const scrollToEvents = () => {
  document.getElementById("events-content").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const openEventDetails = (event) => {
  console.log("Opening event details:", event.title);
  // Here you would implement navigation to event details page
  // For now, just log the action
};

const getResultsText = () => {
  if (searchQuery.value) return `Search results for "${searchQuery.value}"`;
  if (selectedDate.value)
    return `Events on ${formatEventDate(selectedDate.value)}`;
  if (selectedCategory.value)
    return `${formatCategoryName(selectedCategory.value)} Events`;
  if (quickFilter.value) {
    switch (quickFilter.value) {
      case "upcoming":
        return "Upcoming Events";
      case "this_week":
        return "This Week's Events";
      case "featured":
        return "Featured Events";
      case "public":
        return "Public Events";
    }
  }
  return "All Events";
};

const getEmptyStateText = () => {
  if (searchQuery.value)
    return `No events found matching "${searchQuery.value}"`;
  if (selectedDate.value)
    return `No events scheduled for ${formatEventDate(selectedDate.value)}`;
  if (selectedCategory.value)
    return `No ${selectedCategory.value.toLowerCase()} events found`;
  return "No events available at the moment";
};

const loadEvents = async (filterData = {}, page = 1) => {
  isLoadingEvents.value = true;
  try {
    await store.dispatch("fetch_events", {
      data: filterData,
      page: page,
    });
  } catch (error) {
    console.error("Failed to load events:", error);
  } finally {
    isLoadingEvents.value = false;
  }
};

onMounted(() => {
  loadEvents();
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
