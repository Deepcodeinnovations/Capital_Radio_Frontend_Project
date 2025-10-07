<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-gray-900 border-b border-gray-800" style="margin-top: -5rem !important; padding-top: 5rem;">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center max-w-3xl mx-auto">
          <div class="inline-flex items-center justify-center mb-4">
            <Calendar class="text-[#F8CB00] mr-2" :size="24" />
            <span class="text-[#F8CB00] font-semibold uppercase tracking-wider text-sm">Live Events</span>
          </div>
          <h1 class="text-4xl sm:text-5xl font-bold text-white mb-4">
            Capital FM Events
          </h1>
          <p class="text-lg text-gray-300">
            Experience the best live events, concerts, and entertainment in Uganda
          </p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
          <div class="text-center">
            <div class="text-3xl font-bold text-[#F8CB00]">{{ eventStats.upcoming_events }}</div>
            <div class="text-sm text-gray-400 mt-1">Upcoming</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-[#F8CB00]">{{ eventStats.this_month }}</div>
            <div class="text-sm text-gray-400 mt-1">This Month</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-[#F8CB00]">{{ events?.total || 0 }}</div>
            <div class="text-sm text-gray-400 mt-1">Total Events</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-[#F8CB00] flex items-center justify-center gap-2">
              {{ eventStats.featured_events }}
              <div v-if="eventStats.featured_events > 0" class="w-2 h-2 bg-[#F8CB00] rounded-full animate-pulse"></div>
            </div>
            <div class="text-sm text-gray-400 mt-1">Featured</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white border-b border-gray-200 sticky top-20 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center space-x-4 w-full sm:w-auto">
            <button
              v-for="filter in filters"
              :key="filter.value"
              @click="activeFilter = filter.value"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                activeFilter === filter.value
                  ? 'bg-[#F8CB00] text-black'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              {{ filter.label }}
            </button>
          </div>

          <div class="relative w-full sm:w-64">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="18" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search events..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F8CB00] focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Events Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-white rounded-xl overflow-hidden shadow-sm">
          <div class="h-48 bg-gray-200 animate-pulse"></div>
          <div class="p-6 space-y-3">
            <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div class="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Events List -->
      <div v-else-if="filteredEvents.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="event in filteredEvents"
          :key="event.id"
          @click="viewEventDetails(event)"
          class="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
        >
          <!-- Event Image -->
          <div class="relative h-48 overflow-hidden">
            <img
              :src="event.featured_image_url || '/api/placeholder/400/300'"
              :alt="event.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div v-if="event.is_featured" class="absolute top-3 right-3">
              <span class="bg-[#F8CB00] text-black px-3 py-1 rounded-full text-xs font-bold uppercase">
                Featured
              </span>
            </div>
            <div class="absolute bottom-3 left-3">
              <span :class="getEventStatus(event).class" class="px-3 py-1 rounded-full text-xs font-bold uppercase">
                {{ getEventStatus(event).label }}
              </span>
            </div>
          </div>

          <!-- Event Info -->
          <div class="p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#F8CB00] transition-colors">
              {{ event.title }}
            </h3>

            <p class="text-sm text-gray-600 mb-4 line-clamp-2">
              {{ event.excerpt || event.description }}
            </p>

            <div class="space-y-2">
              <div class="flex items-center text-sm text-gray-500">
                <Calendar :size="14" class="mr-2" />
                <span>{{ formatDate(event.event_date) }}</span>
              </div>
              <div class="flex items-center text-sm text-gray-500">
                <Clock :size="14" class="mr-2" />
                <span>{{ event.event_time }}</span>
              </div>
              <div v-if="event.venue" class="flex items-center text-sm text-gray-500">
                <MapPin :size="14" class="mr-2" />
                <span class="line-clamp-1">{{ event.venue }}</span>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t flex items-center justify-between">
              <div class="flex items-center space-x-2 text-sm text-gray-500">
                <Users :size="14" />
                <span>{{ event.attendees_count || 0 }} interested</span>
              </div>
              <ChevronRight :size="18" class="text-gray-400 group-hover:text-[#F8CB00] transition-colors" />
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <Calendar :size="48" class="mx-auto text-gray-300 mb-4" />
        <h3 class="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
        <p class="text-gray-600">Try adjusting your filters or check back later for new events.</p>
      </div>

      <!-- Pagination -->
      <div v-if="events?.last_page > 1" class="mt-12 flex justify-center">
        <div class="flex items-center space-x-2">
          <button
            @click="changePage(events.current_page - 1)"
            :disabled="events.current_page === 1"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div class="flex items-center space-x-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                page === events.current_page
                  ? 'bg-[#F8CB00] text-black'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
              ]"
            >
              {{ page }}
            </button>
          </div>
          <button
            @click="changePage(events.current_page + 1)"
            :disabled="events.current_page === events.last_page"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { Calendar, Clock, MapPin, Users, Search, ChevronRight } from 'lucide-vue-next';

const store = useStore();
const router = useRouter();

const loading = ref(true);
const activeFilter = ref('all');
const searchQuery = ref('');

const filters = [
  { label: 'All Events', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'This Month', value: 'this_month' },
  { label: 'Featured', value: 'featured' },
];

const events = computed(() => store.getters.events);

const eventStats = computed(() => {
  const allEvents = events.value?.data || [];
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  return {
    upcoming_events: allEvents.filter(e => new Date(e.event_date) >= now).length,
    this_month: allEvents.filter(e => {
      const eventDate = new Date(e.event_date);
      return eventDate.getMonth() === thisMonth && eventDate.getFullYear() === thisYear;
    }).length,
    featured_events: allEvents.filter(e => e.is_featured).length,
  };
});

const filteredEvents = computed(() => {
  let result = events.value?.data || [];
  const now = new Date();

  // Apply filter
  if (activeFilter.value === 'upcoming') {
    result = result.filter(e => new Date(e.event_date) >= now);
  } else if (activeFilter.value === 'this_month') {
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    result = result.filter(e => {
      const eventDate = new Date(e.event_date);
      return eventDate.getMonth() === thisMonth && eventDate.getFullYear() === thisYear;
    });
  } else if (activeFilter.value === 'featured') {
    result = result.filter(e => e.is_featured);
  }

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(e =>
      e.title.toLowerCase().includes(query) ||
      e.description?.toLowerCase().includes(query) ||
      e.venue?.toLowerCase().includes(query)
    );
  }

  return result;
});

const visiblePages = computed(() => {
  if (!events.value) return [];
  const current = events.value.current_page;
  const last = events.value.last_page;
  const delta = 2;
  const range = [];
  const rangeWithDots = [];

  for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
    range.push(i);
  }

  if (current - delta > 2) {
    rangeWithDots.push(1, '...');
  } else {
    rangeWithDots.push(1);
  }

  rangeWithDots.push(...range);

  if (current + delta < last - 1) {
    rangeWithDots.push('...', last);
  } else if (last > 1) {
    rangeWithDots.push(last);
  }

  return rangeWithDots;
});

const getEventStatus = (event) => {
  const eventDate = new Date(event.event_date);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

  if (eventDay.getTime() === today.getTime()) {
    return { label: 'Today', class: 'bg-red-600 text-white' };
  } else if (eventDate > now) {
    return { label: 'Upcoming', class: 'bg-green-600 text-white' };
  } else {
    return { label: 'Past', class: 'bg-gray-600 text-white' };
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const viewEventDetails = (event) => {
  router.push({ name: 'events_details', params: { id: event.slug } });
};

const changePage = (page) => {
  if (page < 1 || page > events.value.last_page || page === '...') return;
  const currentStation = store.getters.station;
  if (!currentStation?.id) return;

  store.dispatch('fetch_events', {
    station_id: currentStation.id,
    page: page,
  });
};

onMounted(async () => {
  const currentStation = store.getters.station;
  if (currentStation?.id) {
    await store.dispatch('fetch_events', { station_id: currentStation.id });
  }
  loading.value = false;
});
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
