<template>
  <section class="relative overflow-hidden bg-white">
    <!-- Background decoration -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 right-0 w-72 h-72 bg-capital-pink rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-capital-pink-light rounded-full blur-3xl"></div>
    </div>
    


    <div class="container mx-auto px-4 md:px-6 relative z-20 py-12">
      <!-- Section Header -->
      <div class="mb-8">
        <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          Upcoming <span class="text-capital-pink">Events</span>
        </h2>
      </div>

      <!-- Main Events Container -->
      <div class="relative">
        <!-- Navigation Header -->
        <div class="flex items-center justify-end mb-4" v-if="upcomingEvents.length > 0">
          <div class="flex items-center gap-2">
            <button 
              @click="previousSlide"
              :disabled="currentSlide === 0"
              class="p-1.5 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronLeft class="h-4 w-4" />
            </button>
            <span class="text-xs text-gray-500 px-2">
              {{ currentSlide + 1 }}/{{ Math.ceil(upcomingEvents.length / itemsPerSlide) }}
            </span>
            <button 
              @click="nextSlide"
              :disabled="currentSlide >= Math.ceil(upcomingEvents.length / itemsPerSlide) - 1"
              class="p-1.5 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoadingEvents" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="i in 3" :key="i" class="animate-pulse">
            <div class="h-80 bg-gray-100 rounded-lg"></div>
          </div>
        </div>

        <!-- Events Carousel -->
        <div v-else-if="upcomingEvents.length > 0" class="relative">
          <div class="overflow-hidden">
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
                    class="relative group cursor-pointer"
                    @click="viewEventDetails(event)"
                  >
                    <div class="relative bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:border-capital-pink hover:shadow-md h-full">
                      
                      <!-- Event Image -->
                      <div class="relative h-40 overflow-hidden">
                        <img 
                          :src="event.featured_image_url || '/placeholder-event.jpg'" 
                          :alt="event.title"
                          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          @error="$event.target.src = '/placeholder-event.jpg'"
                        />
                        <!-- Date Badge -->
                        <div class="absolute top-2 left-2">
                          <div class="bg-white rounded px-2 py-1 text-center">
                            <div class="text-xs text-capital-pink font-bold">{{ formatMonth(event.start_date) }}</div>
                            <div class="text-lg text-gray-900 font-bold">{{ formatDay(event.start_date) }}</div>
                          </div>
                        </div>
                        
                        <!-- Event Type Badge -->
                        <div class="absolute top-2 right-2">
                          <span v-if="event.event_type === 'paid'" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500 text-white">
                            Paid
                          </span>
                          <span v-else-if="event.is_virtual" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-capital-blue text-white">
                            Virtual
                          </span>
                          <span v-else class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-capital-pink text-white">
                            Free
                          </span>
                        </div>
                      </div>
                      
                      <!-- Event Info -->
                      <div class="p-3">
                        <div class="mb-2">
                          <h4 class="text-sm font-bold text-gray-900 mb-1 group-hover:text-capital-pink transition-all duration-200 line-clamp-1">
                            {{ event.title }}
                          </h4>
                          
                          <p class="text-xs text-gray-600 mb-2 line-clamp-2">
                            {{ event.description || 'An exciting event you won\'t want to miss!' }}
                          </p>
                        </div>

                        <!-- Event Details -->
                        <div class="space-y-1.5 mb-3">
                          <div class="flex items-center gap-1.5 text-xs text-gray-600">
                            <MapPin class="h-3 w-3 text-gray-400" />
                            <span>{{ event.venue_name || 'Venue TBA' }}</span>
                          </div>
                          
                          <div class="flex items-center gap-1.5 text-xs text-gray-600">
                            <Clock class="h-3 w-3 text-gray-400" />
                            <span>{{ formatTime(event.start_time) }}</span>
                          </div>
                        </div>

                        <!-- Action Button -->
                        <button 
                          @click.stop="viewEventDetails(event)"
                          class="w-full bg-capital-pink hover:bg-capital-pink-dark text-white text-xs font-medium px-3 py-1.5 rounded transition-all duration-200"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Carousel Indicators -->
          <div v-if="Math.ceil(upcomingEvents.length / itemsPerSlide) > 1" class="flex justify-center mt-6 space-x-2">
            <button
              v-for="slideIndex in Math.ceil(upcomingEvents.length / itemsPerSlide)"
              :key="slideIndex"
              @click="goToSlide(slideIndex - 1)"
              :class="[
                'h-1.5 rounded-full transition-all duration-200',
                currentSlide === (slideIndex - 1)
                  ? 'bg-capital-pink w-6' 
                  : 'bg-gray-300 hover:bg-gray-400 w-1.5'
              ]"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Calendar class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">No Events Available</h3>
          <p class="text-sm text-gray-600">Check back soon for upcoming events</p>
        </div>
      </div>

    </div>

  </section>
</template>

<script setup>
import { computed, onMounted, ref, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { MapPin, Clock, Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-vue-next';

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
    'concert': 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-600 border border-pink-200',
    'festival': 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-600 border border-red-200',
    'workshop': 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-600 border border-blue-200',
    'conference': 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-600 border border-purple-200',
    'comedy': 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600 border border-green-200',
    'sports': 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-600 border border-orange-200'
  };
  return styles[category] || 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-600 border border-gray-200';
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
button:hover, .group:hover {
  transform: translateY(-2px);
}

/* Professional shadows */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(244, 114, 182, 0.25);
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