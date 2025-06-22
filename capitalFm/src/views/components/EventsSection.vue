<template>

<section class="py-20 bg-white relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 right-0 w-72 h-72 bg-[#F8CB00] rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
    </div>
    
  <div class="container mx-auto px-6 relative">
  <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
    <!-- Header with icon -->
    <div class="flex items-center gap-3 mb-6">
      <div class="w-10 h-10 rounded-lg bg-[#F8CB00]/20 flex items-center justify-center">
        <Calendar class="h-5 w-5 text-[#F8CB00]" />
      </div>
      <div>
        <h3 class="text-xl font-bold text-gray-900">Today's Events</h3>
        <p class="text-sm text-gray-600">Starting today</p>
      </div>
    </div>

    <!-- Events list -->
    <div class="space-y-4">
      <div v-for="(event, index) in todaysEvents" :key="event.id || index" 
           class="relative p-4 rounded-lg border border-gray-200 hover:border-[#F8CB00] transition-all duration-300 group cursor-pointer hover:shadow-sm bg-gray-50/50 hover:bg-white">
        
        <div class="flex items-start gap-4">
          <!-- Date card -->
          <div class="relative flex-shrink-0">
            <div class="bg-gradient-to-br from-[#F8CB00] to-red-500 rounded-lg p-3 w-16 text-center shadow-sm">
              <div class="text-xs text-black font-semibold uppercase tracking-wider">{{ formatMonth(event.start_date) }}</div>
              <div class="text-xl text-black font-bold">{{ formatDay(event.start_date) }}</div>
            </div>
            <!-- Featured indicator -->
            <div v-if="event.is_featured" class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
          
          <!-- Event details -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between mb-2">
              <h4 class="text-gray-900 font-semibold text-base group-hover:text-[#F8CB00] transition-colors leading-tight line-clamp-2">
                {{ event.title }}
              </h4>
              <span v-if="event.event_type === 'paid'" class="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full ml-2 flex-shrink-0">
                Paid
              </span>
              <span v-else class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full ml-2 flex-shrink-0">
                {{ formatEventType(event.event_type) }}
              </span>
            </div>
            
            <div class="space-y-1 text-sm mb-3">
              <div class="text-gray-600 flex items-center">
                <MapPin class="h-3.5 w-3.5 mr-2 text-[#F8CB00]" /> 
                {{ event.venue_name || 'Venue TBA' }}
              </div>
              <div class="text-gray-600 flex items-center">
                <Clock class="h-3.5 w-3.5 mr-2 text-red-500" /> 
                {{ event.start_time }} - {{ event.end_time }}
              </div>
              <div v-if="event.city && event.country" class="text-gray-600 flex items-center">
                <Globe class="h-3.5 w-3.5 mr-2 text-blue-500" /> 
                {{ event.city }}, {{ event.country }}
              </div>
            </div>
            
            <!-- Event category and details -->
            <div class="flex items-center justify-between">
              <span class="inline-block px-2 py-1 text-xs rounded-full" 
                    :class="getCategoryStyle(event.category)">
                {{ formatCategoryName(event.category) }}
              </span>
              <div class="flex items-center gap-2">
                <div v-if="event.is_virtual" class="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                  Virtual
                </div>
                <button @click="viewEventDetails(event)"
                        class="text-xs text-[#F8CB00] hover:text-red-500 transition-colors flex items-center gap-1 hover:gap-2">
                  <span>View Details</span>
                  <ArrowRight class="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="todaysEvents.length === 0" class="text-center py-8">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Calendar class="w-8 h-8 text-gray-400" />
      </div>
      <h4 class="text-lg font-semibold text-gray-900 mb-2">No Events Today</h4>
      <p class="text-gray-600 mb-4">Check back tomorrow for new events!</p>
      <button @click="viewAllEvents" 
              class="px-4 py-2 bg-[#F8CB00] text-black rounded-lg hover:bg-[#F8CB00]/80 transition-colors font-medium">
        View All Events
      </button>
    </div>

    <!-- Footer -->
    <div v-if="todaysEvents.length > 0" class="mt-6 pt-4 border-t border-gray-200">
      <div class="flex items-center justify-between">
        <div class="text-xs text-gray-500">
          {{ todaysEvents.length }} {{ todaysEvents.length === 1 ? 'event' : 'events' }} starting today
        </div>
        <button @click="viewAllEvents"
                class="inline-flex items-center gap-2 text-[#F8CB00] hover:text-red-500 text-sm font-medium transition-all duration-300 hover:gap-3">
          <span>See All Events</span>
          <ArrowRight class="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
</div>
</section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { MapPin, Clock, Calendar, ArrowRight, Globe } from 'lucide-vue-next';

const store = useStore();
const isLoadingEvents = ref(false);
// Get events from store
const events = computed(() => store.getters.events || {});
const eventsData = computed(() => events.value?.data || []);

// Filter events that start today
const todaysEvents = computed(() => {
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
  
  return eventsData.value.filter(event => {
    if (!event.start_date) return false;
    const eventDate = event.start_date.split('T')[0]; // Extract date part
    return eventDate === today;
  }).slice(0, 3); // Limit to first 3 events
});

// Helper functions
const formatMonth = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
};

const formatDay = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.getDate().toString();
};

const formatCategoryName = (category) => {
  if (!category) return 'Event';
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const formatEventType = (eventType) => {
  if (!eventType) return 'Event';
  return eventType.charAt(0).toUpperCase() + eventType.slice(1);
};

const getCategoryStyle = (category) => {
  const styles = {
    'concert': 'bg-[#F8CB00]/20 text-[#F8CB00]',
    'festival': 'bg-red-100 text-red-700',
    'workshop': 'bg-blue-100 text-blue-700',
    'conference': 'bg-purple-100 text-purple-700',
    'comedy': 'bg-green-100 text-green-700',
    'sports': 'bg-orange-100 text-orange-700'
  };
  return styles[category] || 'bg-gray-100 text-gray-700';
};

// Methods
const viewEventDetails = (event) => {
  console.log('Viewing event details:', event.title);
  // Here you would navigate to event details or open a modal
  // Example: router.push({ name: 'event-details', params: { id: event.id } });
};

const viewAllEvents = () => {
  console.log('Navigating to all events page');
  // Here you would navigate to the events page
  // Example: router.push({ name: 'events' });
};

const loadEvents = async (filterData = {}, page = 1) => {
    isLoadingEvents.value = true;
    try {
      await store.dispatch('fetch_events', {
        data: filterData,
        page: page
      });
    } catch (error) {
      console.error('Failed to load events:', error);
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

/* Smooth transitions */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Hover effects */
.group:hover .group-hover\:text-\[\#F8CB00\] {
  color: #F8CB00;
}

.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>