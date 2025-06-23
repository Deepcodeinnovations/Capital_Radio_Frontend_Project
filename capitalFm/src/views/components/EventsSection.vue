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
        <!-- Header with icon and navigation -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-[#F8CB00]/20 flex items-center justify-center">
              <Calendar class="h-5 w-5 text-[#F8CB00]" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900">Upcoming Events</h3>
              <p class="text-sm text-gray-600">Next events coming up</p>
            </div>
          </div>

          <!-- Carousel Navigation -->
          <div v-if="upcomingEvents.length > 0" class="flex items-center gap-2">
            <button 
              @click="previousSlide"
              :disabled="currentSlide === 0"
              class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft class="h-4 w-4 text-gray-600" />
            </button>
            <span class="text-sm text-gray-500 px-2">
              {{ currentSlide + 1 }} / {{ Math.ceil(upcomingEvents.length / itemsPerSlide) }}
            </span>
            <button 
              @click="nextSlide"
              :disabled="currentSlide >= Math.ceil(upcomingEvents.length / itemsPerSlide) - 1"
              class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight class="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        <!-- Events Carousel -->
        <div v-if="upcomingEvents.length > 0" class="relative overflow-hidden">
          <div 
            class="flex transition-transform duration-500 ease-in-out"
            :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
          >
            <div 
              v-for="slideIndex in Math.ceil(upcomingEvents.length / itemsPerSlide)" 
              :key="slideIndex"
              class="w-full flex-shrink-0"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="(event, index) in getSlideEvents(slideIndex - 1)" 
                  :key="event.id || index"
                  class="relative p-4 rounded-lg border border-gray-200 hover:border-[#F8CB00] transition-all duration-300 group cursor-pointer hover:shadow-sm bg-gray-50/50 hover:bg-white"
                  @click="viewEventDetails(event)"
                >
                  
                  <div class="flex flex-col h-full">
                    <!-- Event Image -->
                    <div class="relative mb-4">
                      <div class="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          :src="event.featured_image_url || '/placeholder-event.jpg'" 
                          :alt="event.title"
                          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          @error="$event.target.src = '/placeholder-event.jpg'"
                        />
                      </div>
                      
                      <!-- Overlay badges -->
                      <div class="absolute top-3 left-3">
                        <div class="bg-gradient-to-br from-[#F8CB00] to-red-500 rounded-lg p-2 text-center shadow-sm">
                          <div class="text-xs text-black font-semibold uppercase tracking-wider">{{ formatMonth(event.start_date) }}</div>
                          <div class="text-lg text-black font-bold">{{ formatDay(event.start_date) }}</div>
                        </div>
                      </div>
                      
                      <!-- Featured indicator -->
                      <div v-if="event.is_featured" class="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      
                      <!-- Event type badge -->
                      <div class="absolute bottom-3 right-3">
                        <span v-if="event.event_type === 'paid'" class="text-xs px-2 py-1 bg-green-500/90 text-white rounded-full backdrop-blur-sm">
                          Paid Event
                        </span>
                        <span v-else class="text-xs px-2 py-1 bg-blue-500/90 text-white rounded-full backdrop-blur-sm">
                          {{ formatEventType(event.event_type) }} Event
                        </span>
                      </div>
                      
                      <!-- Virtual badge -->
                      <div v-if="event.is_virtual" class="absolute bottom-3 left-3">
                        <span class="text-xs px-2 py-1 bg-purple-500/90 text-white rounded-full backdrop-blur-sm">
                          Virtual
                        </span>
                      </div>
                    </div>
                    
                    <!-- Event details -->
                    <div class="flex-1">
                      <h4 class="text-gray-900 font-semibold text-base group-hover:text-[#F8CB00] transition-colors leading-tight line-clamp-2 mb-3">
                        {{ event.title }}
                      </h4>
                      
                      <!-- Description preview -->
                      <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                        {{ event.description || 'No description available' }}
                      </p>
                      
                      <div class="space-y-2 text-sm mb-4">
                        <div class="text-gray-600 flex items-center">
                          <MapPin class="h-3.5 w-3.5 mr-2 text-[#F8CB00] flex-shrink-0" /> 
                          <span class="truncate">{{ event.venue_name || 'Venue TBA' }}</span>
                        </div>
                        <div class="text-gray-600 flex items-center">
                          <Clock class="h-3.5 w-3.5 mr-2 text-red-500 flex-shrink-0" /> 
                          <span>{{ formatTime(event.start_time) }} - {{ formatTime(event.end_time) }}</span>
                        </div>
                        <div v-if="event.city && event.country" class="text-gray-600 flex items-center">
                          <Globe class="h-3.5 w-3.5 mr-2 text-blue-500 flex-shrink-0" /> 
                          <span class="truncate">{{ event.city }}, {{ event.country }}</span>
                        </div>
                      </div>
                      
                      <!-- Days until event -->
                      <div class="mb-3">
                        <span v-if="getDaysUntilEvent(event.start_date) === 0" class="inline-block px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full font-medium">
                          Today
                        </span>
                        <span v-else-if="getDaysUntilEvent(event.start_date) === 1" class="inline-block px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded-full font-medium">
                          Tomorrow
                        </span>
                        <span v-else class="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full font-medium">
                          In {{ getDaysUntilEvent(event.start_date) }} days
                        </span>
                      </div>
                    </div>
                    
                    <!-- Event category and virtual badge -->
                    <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span class="inline-block px-2 py-1 text-xs rounded-full" 
                            :class="getCategoryStyle(event.category)">
                        {{ formatCategoryName(event.category) }}
                      </span>
                      <div class="flex items-center gap-2">
                        <button class="text-xs text-[#F8CB00] hover:text-red-500 transition-colors flex items-center gap-1 hover:gap-2">
                          <span>View Details</span>
                          <ArrowRight class="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Slide indicators -->
          <div v-if="Math.ceil(upcomingEvents.length / itemsPerSlide) > 1" class="flex justify-center mt-4 gap-2">
            <button 
              v-for="slideIndex in Math.ceil(upcomingEvents.length / itemsPerSlide)" 
              :key="slideIndex"
              @click="goToSlide(slideIndex - 1)"
              class="w-2 h-2 rounded-full transition-colors"
              :class="currentSlide === slideIndex - 1 ? 'bg-[#F8CB00]' : 'bg-gray-300'"
            ></button>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else-if="!isLoadingEvents" class="text-center py-8">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar class="w-8 h-8 text-gray-400" />
          </div>
          <h4 class="text-lg font-semibold text-gray-900 mb-2">No Upcoming Events</h4>
          <p class="text-gray-600 mb-4">Check back soon for exciting new events!</p>
          <button @click="viewAllEvents" 
                  class="px-4 py-2 bg-[#F8CB00] text-black rounded-lg hover:bg-[#F8CB00]/80 transition-colors font-medium">
            View All Events
          </button>
        </div>

        <!-- Loading state -->
        <div v-else class="text-center py-8">
          <div class="w-8 h-8 border-2 border-gray-300 border-t-[#F8CB00] rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-600">Loading events...</p>
        </div>

        <!-- Footer -->
        <div v-if="upcomingEvents.length > 0" class="mt-6 pt-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-xs text-gray-500">
              {{ upcomingEvents.length }} upcoming {{ upcomingEvents.length === 1 ? 'event' : 'events' }}
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
import { computed, onMounted, ref, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { MapPin, Clock, Calendar, ArrowRight, Globe, ChevronLeft, ChevronRight } from 'lucide-vue-next';

const store = useStore();
const isLoadingEvents = ref(false);
const currentSlide = ref(0);
const itemsPerSlide = ref(3);

// Responsive items per slide
const updateItemsPerSlide = () => {
  if (window.innerWidth < 768) {
    itemsPerSlide.value = 1;
  } else if (window.innerWidth < 1024) {
    itemsPerSlide.value = 2;
  } else {
    itemsPerSlide.value = 3;
  }
  // Reset slide if current slide is out of bounds
  const maxSlides = Math.ceil(upcomingEvents.value.length / itemsPerSlide.value);
  if (currentSlide.value >= maxSlides && maxSlides > 0) {
    currentSlide.value = maxSlides - 1;
  }
};

// Get events from store
const events = computed(() => store.getters.events || {});
const eventsData = computed(() => events.value?.data || []);

// Filter and sort upcoming events
const upcomingEvents = computed(() => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  return eventsData.value
    .filter(event => {
      if (!event.start_date) return false;
      const eventDate = new Date(event.start_date);
      return eventDate >= now || event.start_date.split('T')[0] === today;
    })
    .sort((a, b) => {
      // Sort by start date (earliest first)
      const dateA = new Date(a.start_date);
      const dateB = new Date(b.start_date);
      return dateA - dateB;
    });
});

// Carousel methods
const nextSlide = () => {
  const maxSlides = Math.ceil(upcomingEvents.value.length / itemsPerSlide.value);
  if (currentSlide.value < maxSlides - 1) {
    currentSlide.value++;
  }
};

const previousSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  }
};

const goToSlide = (slideIndex) => {
  const maxSlides = Math.ceil(upcomingEvents.value.length / itemsPerSlide.value);
  if (slideIndex >= 0 && slideIndex < maxSlides) {
    currentSlide.value = slideIndex;
  }
};

const getSlideEvents = (slideIndex) => {
  const startIndex = slideIndex * itemsPerSlide.value;
  const endIndex = startIndex + itemsPerSlide.value;
  return upcomingEvents.value.slice(startIndex, endIndex);
};

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

const formatTime = (timeString) => {
  if (!timeString) return '';
  // Convert 24-hour format to 12-hour format
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

const getDaysUntilEvent = (dateString) => {
  if (!dateString) return 0;
  const eventDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  const diffTime = eventDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
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
  // Navigate to event details
};

const viewAllEvents = () => {
  console.log('Navigating to all events page');
  // Navigate to events page
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
  updateItemsPerSlide();
  window.addEventListener('resize', updateItemsPerSlide);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateItemsPerSlide);
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

/* Loading animation */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Responsive grid adjustments */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>