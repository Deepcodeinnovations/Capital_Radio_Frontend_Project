<template>
  <section class="py-20 bg-white relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 right-0 w-72 h-72 bg-red-600 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-black rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-red-600 rounded-full blur-3xl"></div>
    </div>
    
    <div class="container mx-auto px-6 relative">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center mb-6">
          <div class="h-px w-12 bg-red-600"></div>
          <span class="mx-4 text-black font-bold tracking-wider text-sm uppercase">Events</span>
          <div class="h-px w-12 bg-red-600"></div>
        </div>
        <h2 class="text-4xl md:text-5xl font-bold text-black mb-6">
          Upcoming <span class="text-red-600">Events</span>
        </h2>
        <p class="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Don't miss out on the hottest events, concerts, and music experiences across Uganda
        </p>
      </div>

      <!-- Main Events Card -->
      <div class="bg-white  border border-gray-200 shadow-lg overflow-hidden">
        <!-- Header with navigation -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12  bg-red-600/20 flex items-center justify-center">
              <Calendar class="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 class="text-2xl font-bold text-black">Beat FM Events</h3>
              <p class="text-gray-600">{{ upcomingEvents.length }} events coming up</p>
            </div>
          </div>

          <!-- Carousel Navigation -->
          <div v-if="upcomingEvents.length > 0" class="flex items-center gap-2">
            <button 
              @click="previousSlide"
              :disabled="currentSlide === 0"
              class="p-2 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft class="h-5 w-5 text-gray-600" />
            </button>
            <span class="text-sm text-gray-500 px-3">
              {{ currentSlide + 1 }} / {{ Math.ceil(upcomingEvents.length / itemsPerSlide) }}
            </span>
            <button 
              @click="nextSlide"
              :disabled="currentSlide >= Math.ceil(upcomingEvents.length / itemsPerSlide) - 1"
              class="p-2 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight class="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        <!-- Events Content -->
        <div class="p-6">
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
                <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  <div 
                    v-for="(event, index) in getSlideEvents(slideIndex - 1)" 
                    :key="event.id || index"
                    class="group bg-gray-50 rounded-2xl border border-gray-200 hover:border-red-600/30 transition-all duration-300 cursor-pointer overflow-hidden hover:shadow-lg"
                    @click="viewEventDetails(event)"
                  >
                    <!-- Event Image -->
                    <div class="relative overflow-hidden">
                      <div class="aspect-video w-full bg-gray-100">
                        <img 
                          :src="event.featured_image_url || '/placeholder-event.jpg'" 
                          :alt="event.title"
                          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          @error="$event.target.src = '/placeholder-event.jpg'"
                        />
                      </div>
                      
                      <!-- Date Badge -->
                      <div class="absolute top-4 left-4">
                        <div class="bg-red-600 rounded-xl p-3 text-center shadow-lg">
                          <div class="text-xs text-white font-medium uppercase tracking-wider">{{ formatMonth(event.start_date) }}</div>
                          <div class="text-xl text-white font-bold">{{ formatDay(event.start_date) }}</div>
                        </div>
                      </div>
                      
                      <!-- Event Type Badge -->
                      <div class="absolute top-4 right-4">
                        <span v-if="event.event_type === 'paid'" class="px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                          Paid Event
                        </span>
                        <span v-else-if="event.is_virtual" class="px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                          Virtual
                        </span>
                        <span v-else class="px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full">
                          {{ formatEventType(event.event_type) }}
                        </span>
                      </div>

                      <!-- Featured indicator -->
                      <div v-if="event.is_featured" class="absolute bottom-4 right-4">
                        <div class="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-lg"></div>
                      </div>
                    </div>
                    
                    <!-- Event Details -->
                    <div class="p-6">
                      <!-- Event Title -->
                      <h4 class="text-black font-bold text-lg group-hover:text-red-600 transition-colors leading-tight mb-3 line-clamp-2">
                        {{ event.title }}
                      </h4>
                      
                      <!-- Event Description -->
                      <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                        {{ event.description || 'Join us for an amazing event experience' }}
                      </p>
                      
                      <!-- Event Info -->
                      <div class="space-y-2 mb-4">
                        <div class="flex items-center text-sm text-gray-600">
                          <MapPin class="h-4 w-4 mr-3 text-red-600 flex-shrink-0" /> 
                          <span class="truncate">{{ event.venue_name || 'Venue TBA' }}</span>
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                          <Clock class="h-4 w-4 mr-3 text-black flex-shrink-0" /> 
                          <span>{{ formatTime(event.start_time) }} - {{ formatTime(event.end_time) }}</span>
                        </div>
                        <div v-if="event.city && event.country" class="flex items-center text-sm text-gray-600">
                          <Globe class="h-4 w-4 mr-3 text-red-600 flex-shrink-0" /> 
                          <span class="truncate">{{ event.city }}, {{ event.country }}</span>
                        </div>
                      </div>
                      
                      <!-- Days Until Event -->
                      <div class="mb-4">
                        <span v-if="getDaysUntilEvent(event.start_date) === 0" class="inline-block px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full font-semibold">
                          Today
                        </span>
                        <span v-else-if="getDaysUntilEvent(event.start_date) === 1" class="inline-block px-3 py-1 text-xs bg-black/10 text-black rounded-full font-semibold">
                          Tomorrow
                        </span>
                        <span v-else class="inline-block px-3 py-1 text-xs bg-red-600/10 text-red-600 rounded-full font-semibold">
                          In {{ getDaysUntilEvent(event.start_date) }} days
                        </span>
                      </div>
                      
                      <!-- Footer -->
                      <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                        <span class="inline-block px-3 py-1 text-xs rounded-full font-medium" 
                              :class="getCategoryStyle(event.category)">
                          {{ formatCategoryName(event.category) }}
                        </span>
                        <button class="text-sm text-red-600 hover:text-black font-medium transition-colors flex items-center gap-1 hover:gap-2">
                          <span>View Details</span>
                          <ArrowRight class="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Slide Indicators -->
            <div v-if="Math.ceil(upcomingEvents.length / itemsPerSlide) > 1" class="flex justify-center mt-6 gap-2">
              <button 
                v-for="slideIndex in Math.ceil(upcomingEvents.length / itemsPerSlide)" 
                :key="slideIndex"
                @click="goToSlide(slideIndex - 1)"
                class="w-3 h-3 rounded-full transition-all duration-300"
                :class="currentSlide === slideIndex - 1 ? 'bg-red-600 w-8' : 'bg-gray-300 hover:bg-gray-400'"
              ></button>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="!isLoadingEvents" class="text-center py-12">
            <div class="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Calendar class="w-10 h-10 text-gray-400" />
            </div>
            <h4 class="text-2xl font-bold text-black mb-4">No Upcoming Events</h4>
            <p class="text-gray-600 mb-6">Check back soon for exciting new events and concerts!</p>
            <button @click="viewAllEvents" 
                    class="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium">
              View All Events
            </button>
          </div>

          <!-- Loading State -->
          <div v-else class="text-center py-12">
            <div class="w-8 h-8 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-gray-600">Loading events...</p>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="upcomingEvents.length > 0" class="px-6 pb-6">
          <div class="flex items-center justify-between pt-4 border-t border-gray-200">
            <div class="text-sm text-gray-500">
              {{ upcomingEvents.length }} upcoming {{ upcomingEvents.length === 1 ? 'event' : 'events' }} found
            </div>
            <button @click="viewAllEvents"
                    class="inline-flex items-center gap-2 text-red-600 hover:text-black text-sm font-medium transition-all duration-300 hover:gap-3">
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
  if (window.innerWidth < 1024) {
    itemsPerSlide.value = 1;
  } else if (window.innerWidth < 1280) {
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
  if (!eventType) return 'Live';
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
    'concert': 'bg-red-600/20 text-red-600',
    'festival': 'bg-red-100 text-red-700',
    'workshop': 'bg-black/10 text-black',
    'conference': 'bg-red-600/10 text-red-600',
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

/* Loading animation */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>