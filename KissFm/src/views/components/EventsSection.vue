<template>
  <section class="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50">
    <!-- Background decoration with KIIS colors -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full blur-3xl"></div>
    </div>
    


    <div class="container mx-auto px-4 md:px-6 relative z-20 pt-16 pb-20">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <div class="inline-flex items-center justify-center mb-6">
          <div class="h-px w-12 bg-gradient-to-r from-pink-500 to-purple-500"></div>
          <span class="mx-4 text-gray-800 font-bold tracking-wider text-sm uppercase">What's Coming Up</span>
          <div class="h-px w-12 bg-gradient-to-r from-purple-500 to-pink-500"></div>
        </div>
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
          Exciting <span class="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Events</span>
        </h2>
        <p class="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Don't miss out on Uganda's hottest entertainment events - from concerts to festivals, we've got it all
        </p>
      </div>

      <!-- Main Events Container -->
      <div class="relative">
        <!-- Navigation Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-2xl font-black text-gray-900 mb-2">
              Featured Events
            </h3>
            <p class="text-gray-600">{{ upcomingEvents.length }} events you won't want to miss</p>
          </div>
          
          <!-- Carousel Controls -->
          <div v-if="upcomingEvents.length > 0" class="flex items-center gap-3">
            <button 
              @click="previousSlide"
              :disabled="currentSlide === 0"
              class="p-3 rounded-2xl bg-white/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 border border-pink-200/50 shadow-lg"
            >
              <ChevronLeft class="h-5 w-5" />
            </button>
            <span class="text-sm text-gray-600 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl font-semibold border border-pink-200/50">
              {{ currentSlide + 1 }} / {{ Math.ceil(upcomingEvents.length / itemsPerSlide) }}
            </span>
            <button 
              @click="nextSlide"
              :disabled="currentSlide >= Math.ceil(upcomingEvents.length / itemsPerSlide) - 1"
              class="p-3 rounded-2xl bg-white/80 backdrop-blur-sm hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-600 hover:text-white text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 border border-pink-200/50 shadow-lg"
            >
              <ChevronRight class="h-5 w-5" />
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoadingEvents" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 3" :key="i" class="animate-pulse">
            <div class="h-96 bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl"></div>
          </div>
        </div>

        <!-- Events Carousel -->
        <div v-else-if="upcomingEvents.length > 0" class="relative">
          <div class="overflow-hidden rounded-3xl">
            <div 
              class="flex transition-transform duration-500 ease-in-out"
              :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
            >
              <div 
                v-for="slideIndex in Math.ceil(upcomingEvents.length / itemsPerSlide)" 
                :key="slideIndex"
                class="w-full flex-shrink-0"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div 
                    v-for="(event, index) in getSlideEvents(slideIndex - 1)" 
                    :key="event.id || index"
                    class="relative group cursor-pointer"
                    @click="viewEventDetails(event)"
                  >
                    <!-- Gradient Border Effect -->
                    <div class="absolute -inset-0.5 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                    
                    <div class="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-pink-200/30 overflow-hidden transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 h-full">
                      
                      <!-- Event Image -->
                      <div class="relative h-48 overflow-hidden">
                        <img 
                          :src="event.featured_image_url || '/placeholder-event.jpg'" 
                          :alt="event.title"
                          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          @error="$event.target.src = '/placeholder-event.jpg'"
                        />
                        <!-- Gradient Overlay -->
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                        
                        <!-- Date Badge -->
                        <div class="absolute top-4 left-4">
                          <div class="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl p-3 text-center shadow-lg border border-pink-300/30">
                            <div class="text-xs text-white font-black tracking-wider">{{ formatMonth(event.start_date) }}</div>
                            <div class="text-xl text-white font-black">{{ formatDay(event.start_date) }}</div>
                          </div>
                        </div>
                        
                        <!-- Event Type Badge -->
                        <div class="absolute top-4 right-4">
                          <span v-if="event.event_type === 'paid'" class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
                            <span class="mr-1">💰</span>
                            PAID EVENT
                          </span>
                          <span v-else-if="event.is_virtual" class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg">
                            <span class="mr-1">🌐</span>
                            VIRTUAL
                          </span>
                          <span v-else class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg">
                            <span class="mr-1">🎉</span>
                            FREE EVENT
                          </span>
                        </div>
                        
                        <!-- Featured Indicator -->
                        <div v-if="event.is_featured" class="absolute bottom-4 left-4">
                          <div class="bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                            <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <span class="text-black text-xs font-black tracking-wide">FEATURED</span>
                          </div>
                        </div>
                        
                        <!-- Days Until Event -->
                        <div class="absolute bottom-4 right-4">
                          <div class="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-pink-200/50">
                            <span v-if="getDaysUntilEvent(event.start_date) === 0" class="text-red-600 text-xs font-black">
                              TODAY
                            </span>
                            <span v-else-if="getDaysUntilEvent(event.start_date) === 1" class="text-orange-600 text-xs font-black">
                              TOMORROW
                            </span>
                            <span v-else class="text-gray-900 text-xs font-black">
                              {{ getDaysUntilEvent(event.start_date) }} DAYS
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Event Info -->
                      <div class="p-6">
                        <div class="mb-4">
                          <h4 class="text-lg md:text-xl font-black text-gray-900 mb-3 group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 line-clamp-2">
                            {{ event.title }}
                          </h4>
                          
                          <p class="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                            {{ event.description || 'An exciting event you won\'t want to miss!' }}
                          </p>
                        </div>

                        <!-- Event Details -->
                        <div class="space-y-3 mb-4">
                          <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                              <MapPin class="h-4 w-4 text-pink-600" />
                            </div>
                            <div>
                              <p class="text-sm font-bold text-gray-900">{{ event.venue_name || 'Venue TBA' }}</p>
                              <p class="text-xs text-gray-500">{{ event.city || 'Location' }}, {{ event.country || 'Uganda' }}</p>
                            </div>
                          </div>
                          
                          <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                              <Clock class="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <p class="text-sm font-bold text-gray-900">{{ formatTime(event.start_time) }} - {{ formatTime(event.end_time) }}</p>
                              <p class="text-xs text-gray-500">Event Duration</p>
                            </div>
                          </div>
                        </div>

                        <!-- Category Badge -->
                        <div class="mb-4">
                          <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider"
                                :class="getCategoryStyle(event.category)">
                            {{ formatCategoryName(event.category) }}
                          </span>
                        </div>

                        <!-- Action Button -->
                        <button 
                          @click.stop="viewEventDetails(event)"
                          class="w-full relative group/btn overflow-hidden"
                        >
                          <div class="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-60 group-hover/btn:opacity-100 transition duration-500"></div>
                          <div class="relative bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black px-4 py-3 rounded-2xl transition-all duration-300 transform hover:scale-105">
                            <div class="flex items-center justify-center space-x-2">
                              <span class="tracking-wide">VIEW EVENT</span>
                              <ArrowRight class="w-4 h-4" />
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Carousel Indicators -->
          <div v-if="Math.ceil(upcomingEvents.length / itemsPerSlide) > 1" class="flex justify-center mt-8 space-x-3">
            <button
              v-for="slideIndex in Math.ceil(upcomingEvents.length / itemsPerSlide)"
              :key="slideIndex"
              @click="goToSlide(slideIndex - 1)"
              :class="[
                'h-3 rounded-full transition-all duration-300',
                currentSlide === (slideIndex - 1)
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 w-8 shadow-lg' 
                  : 'bg-gray-300 hover:bg-pink-300 w-3'
              ]"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Calendar class="w-10 h-10 text-pink-400" />
          </div>
          <h3 class="text-2xl font-black text-gray-900 mb-4">No Events Scheduled Yet</h3>
          <p class="text-gray-600 mb-6">Stay tuned for amazing events coming your way!</p>
          <button 
            @click="viewAllEvents"
            class="relative group overflow-hidden"
          >
            <div class="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-500"></div>
            <div class="relative bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105">
              <div class="flex items-center space-x-2">
                <span class="tracking-wide">EXPLORE ALL EVENTS</span>
                <ArrowRight class="w-5 h-5" />
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Call to Action Section -->
      <div class="text-center mt-16">
        <div class="relative inline-block group">
          <div class="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-60 group-hover:opacity-100 transition duration-500"></div>
          <button 
            @click="viewAllEvents"
            class="relative bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-black px-12 py-6 rounded-3xl transition-all duration-500 transform hover:scale-105 shadow-2xl"
          >
            <div class="flex items-center space-x-3">
              <Calendar class="w-6 h-6" />
              <span class="text-lg tracking-wide">VIEW ALL EVENTS</span>
              <ArrowRight class="w-6 h-6" />
            </div>
          </button>
        </div>
        
        <p class="text-gray-600 mt-4 font-medium">
          Discover {{ upcomingEvents.length }}+ exciting events happening in Uganda
        </p>
      </div>
    </div>

    <!-- Bottom Curved Border -->
    <div class="absolute bottom-0 left-0 w-full overflow-hidden z-10">
      <svg class="w-full h-auto" preserveAspectRatio="none" viewBox="0 0 1200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,40 C200,80 400,0 600,40 C800,80 1000,0 1200,40 L1200,80 L0,80 Z" fill="url(#bottomWave1)" opacity="0.3"/>
        <path d="M0,50 C300,10 500,70 800,30 C900,10 1100,60 1200,35 L1200,80 L0,80 Z" fill="url(#bottomWave2)" opacity="0.2"/>
        <path d="M0,60 C250,20 450,80 700,45 C850,25 1050,75 1200,55 L1200,80 L0,80 Z" fill="white"/>
        
        <defs>
          <linearGradient id="bottomWave1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#ff6b9d;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#8b5cf6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ff6b9d;stop-opacity:1" />
          </linearGradient>
          <linearGradient id="bottomWave2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#a78bfa;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f472b6;stop-opacity:1" />
          </linearGradient>
        </defs>
      </svg>
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