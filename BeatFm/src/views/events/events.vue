<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative min-h-[70vh] flex items-center justify-center overflow-hidden" style="margin-top: 5rem !important;">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Events" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/60"></div>
      </div>

      <!-- Clean geometric background -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-10 w-20 h-20 bg-red-600 transform rotate-45"></div>
        <div class="absolute bottom-40 right-20 w-16 h-16 bg-white"></div>
        <div class="absolute top-1/2 left-1/4 w-12 h-12 bg-red-600"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 container mx-auto px-6 text-center">
        <!-- Hero Badge -->
        <div class="inline-block bg-red-600 text-white px-6 py-2 mb-8 transform -rotate-1">
          <span class="font-black text-sm tracking-widest uppercase">LIVE EVENTS</span>
        </div>

        <!-- Main Heading -->
        <h1 class="text-6xl font-black text-white mb-6 leading-none">
          BEAT
          <span class="block text-red-600">EVENTS</span>
        </h1>

        <!-- Subtitle -->
        <p class="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
          Experience the hottest live events, concerts, and entertainment across Uganda
        </p>

        <!-- Live Stats Row -->
        <!-- <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
          <div class="bg-red-600 border-4 border-red-600 p-4 text-center transform hover:scale-105 transition-transform">
            <div class="text-3xl font-black text-white mb-1">{{ eventStats.upcoming_events }}</div>
            <div class="text-xs font-bold text-white uppercase tracking-wider">UPCOMING</div>
          </div>
          <div class="bg-white/90 backdrop-blur-sm border-4 border-white p-4 text-center transform hover:scale-105 transition-transform">
            <div class="text-3xl font-black text-black mb-1">{{ eventStats.this_month }}</div>
            <div class="text-xs font-bold text-black uppercase tracking-wider">THIS MONTH</div>
          </div>
          <div class="bg-black/80 backdrop-blur-sm border-4 border-black p-4 text-center transform hover:scale-105 transition-transform">
            <div class="text-3xl font-black text-white mb-1">{{ events?.total || 0 }}</div>
            <div class="text-xs font-bold text-white uppercase tracking-wider">TOTAL</div>
          </div>
          <div class="bg-white/90 backdrop-blur-sm border-4 border-red-600 p-4 text-center transform hover:scale-105 transition-transform">
            <div class="text-3xl font-black text-red-600 mb-1 flex items-center justify-center gap-2">
              {{ eventStats.featured_events }}
              <div v-if="eventStats.featured_events > 0" class="w-2 h-2 bg-red-600 animate-pulse"></div>
            </div>
            <div class="text-xs font-bold text-red-600 uppercase tracking-wider">FEATURED</div>
          </div>
        </div> -->

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            @click="togglePlayPause"
            :disabled="isLoading"
            class="bg-red-600 hover:bg-red-700 text-white font-black px-12 py-4 transition-all duration-300 transform hover:scale-105 shadow-lg border-4 border-red-600"
          >
            <div class="flex items-center justify-center space-x-3">
              <div v-if="isLoading" class="w-5 h-5 border-2 rounded-full border-white border-t-transparent animate-spin"></div>
              <Volume2 v-else-if="isPlaying" :size="20" class="animate-bounce" />
              <Play v-else :size="20" />
              <span class="tracking-widest text-sm" v-if="isLoading">CONNECTING</span>
              <span class="tracking-widest text-sm" v-else-if="isPlaying">LIVE NOW</span>
              <span class="tracking-widest text-sm" v-else>LISTEN LIVE</span>
            </div>
          </button>
          
          <button 
            @click="scrollToEvents"
            class="bg-white/10 backdrop-blur-md border-4 border-white text-white font-black px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
          >
            <span class="tracking-widest text-sm">VIEW ALL EVENTS</span>
          </button>
        </div>
      </div>

      <!-- Sharp Bottom Divider -->
      <div class="absolute bottom-0 left-0 w-full overflow-hidden" style="transform: translateY(1px);">
        <svg class="w-full h-auto" preserveAspectRatio="none" viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="eventWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#DC2626;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#000000;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#DC2626;stop-opacity:1" />
            </linearGradient>
          </defs>
          <path d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z" fill="url(#eventWaveGradient)"></path>
          <path d="M0,80 C300,40 600,100 900,80 C1000,70 1100,90 1200,80 L1200,120 L0,120 Z" fill="white" opacity="0.9"></path>
        </svg>
      </div>
    </section>

    <!-- Main Content -->
    <div class="bg-white relative" id="events-content">
      <div class="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <!-- Search and Filters Section -->
        <div class="mb-12">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
            <!-- Search Events -->
            <div class="relative">
              <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                v-model="searchQuery"
                @input="debounceSearch"
                type="text"
                placeholder="SEARCH EVENTS..."
                class="w-full pl-12 pr-4 py-4 bg-white border-4 border-black text-black placeholder-gray-500 focus:outline-none focus:border-red-600 font-bold uppercase tracking-wider"
              />
            </div>

            <!-- Date Filter -->
            <div class="relative">
              <Calendar class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                v-model="selectedDate"
                @change="filterByDate"
                type="date"
                class="w-full pl-12 pr-4 py-4 bg-white border-4 border-black text-black focus:outline-none focus:border-red-600 font-bold"
              />
            </div>

            <!-- Category Filter -->
            <div class="relative">
              <select
                v-model="selectedCategory"
                @change="filterByCategory"
                class="w-full px-4 py-4 bg-white border-4 border-black text-black focus:outline-none focus:border-red-600 font-bold uppercase tracking-wider appearance-none"
              >
                <option value="">ALL CATEGORIES</option>
                <option v-for="category in eventCategories" :key="category" :value="category">
                  {{ formatCategoryName(category).toUpperCase() }}
                </option>
              </select>
              <ChevronDown class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          <!-- Quick Filters -->
          <div class="flex flex-wrap justify-center gap-3 mb-8">
            <button
              @click="setQuickFilter('upcoming')"
              :class="quickFilter === 'upcoming' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-black border-black hover:bg-black hover:text-white'"
              class="px-6 py-3 font-black transition-all border-2 uppercase tracking-wider"
            >
              UPCOMING
            </button>
            <button
              @click="setQuickFilter('this_week')"
              :class="quickFilter === 'this_week' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-black border-black hover:bg-black hover:text-white'"
              class="px-6 py-3 font-black transition-all border-2 uppercase tracking-wider"
            >
              THIS WEEK
            </button>
            <button
              @click="setQuickFilter('featured')"
              :class="quickFilter === 'featured' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-black border-black hover:bg-black hover:text-white'"
              class="px-6 py-3 font-black transition-all border-2 uppercase tracking-wider"
            >
              FEATURED
            </button>
            <button
              @click="setQuickFilter('public')"
              :class="quickFilter === 'public' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-black border-black hover:bg-black hover:text-white'"
              class="px-6 py-3 font-black transition-all border-2 uppercase tracking-wider"
            >
              PUBLIC
            </button>
            <button
              @click="clearFilters"
              class="px-6 py-3 bg-white border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-black transition-all uppercase tracking-wider flex items-center gap-2"
            >
              <X class="w-4 h-4" />
              CLEAR
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoadingEvents" class="flex justify-center items-center py-20">
          <div class="w-12 h-12 border-4 border-gray-300 border-t-red-600 animate-spin"></div>
        </div>

        <!-- Events Content -->
        <div v-else-if="eventsData.length > 0">
          <!-- Results Info -->
          <div class="flex items-center justify-between mb-8">
            <div class="text-black font-black uppercase tracking-wider">
              {{ getResultsText() }}
            </div>
            <div class="text-black font-black uppercase tracking-wider">
              {{ events?.total || 0 }} {{ (events?.total || 0) === 1 ? 'EVENT' : 'EVENTS' }}
            </div>
          </div>

          <!-- Featured Events -->
          <div v-if="featuredEvents.length > 0" class="mb-12">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-12 h-12 bg-red-600 flex items-center justify-center">
                <Star class="w-6 h-6 text-white" />
              </div>
              <h2 class="text-3xl font-black text-black uppercase tracking-wider">FEATURED EVENTS</h2>
              <div class="flex-1 h-1 bg-red-600"></div>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div 
                v-for="event in featuredEvents.slice(0, 2)" 
                :key="event.id"
                class="bg-white border-4 border-black overflow-hidden transition-all hover:border-red-600 group cursor-pointer transform hover:scale-105"
                @click="openEventDetails(event)"
              >
                <div class="relative h-64 overflow-hidden">
                  <img 
                    :src="event.featured_image_url || getDefaultEventImage(event.category)" 
                    :alt="event.title"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 filter grayscale group-hover:grayscale-0"
                  />
                  
                  <!-- Event Type Badge -->
                  <div class="absolute top-4 right-4">
                    <span class="bg-black text-white px-3 py-1 text-xs font-black tracking-wider uppercase">
                      {{ formatEventType(event.event_type) }}
                    </span>
                  </div>

                  <!-- Date Badge -->
                  <div class="absolute bottom-4 left-4">
                    <span class="bg-white text-black px-3 py-1 text-xs font-black tracking-wider uppercase border-2 border-black">
                      {{ formatEventDate(event.start_date) }}
                    </span>
                  </div>
                </div>
                
                <div class="p-6">
                  <div class="flex items-center gap-2 mb-3">
                    <span class="bg-red-600 text-white px-3 py-1 text-xs font-black tracking-wider uppercase">
                      {{ formatCategoryName(event.category) }}
                    </span>
                    <span class="text-gray-600 text-xs font-bold flex items-center gap-1 uppercase">
                      <MapPin class="w-3 h-3" />
                      {{ event.venue_name }}
                    </span>
                  </div>
                  
                  <h3 class="text-xl font-black text-black mb-3 group-hover:text-red-600 transition-colors line-clamp-2 uppercase tracking-wide">
                    {{ event.title }}
                  </h3>
                  
                  <p class="text-gray-600 mb-4 line-clamp-2 text-sm">
                    {{ event.description }}
                  </p>
                  
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <Clock class="w-4 h-4 text-gray-400" />
                      <span class="text-sm text-gray-600 font-bold">{{ event.start_time }} - {{ event.end_time }}</span>
                    </div>
                    
                    <div class="flex items-center space-x-4 text-sm text-gray-600 font-bold">
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

          <!-- All Events List -->
          <div class="space-y-4 mb-8">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-12 h-12 bg-black flex items-center justify-center">
                <Calendar class="w-6 h-6 text-white" />
              </div>
              <h2 class="text-3xl font-black text-black uppercase tracking-wider">ALL EVENTS</h2>
              <div class="flex-1 h-1 bg-black"></div>
            </div>
            
            <div 
              v-for="event in eventsData" 
              :key="event.id"
              class="bg-white border-2 border-black p-6 transition-all hover:border-red-600 group cursor-pointer transform hover:scale-105"
              @click="openEventDetails(event)"
            >
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-24 h-24 border-2 border-black overflow-hidden">
                    <img 
                      :src="event.featured_image_url || getDefaultEventImage(event.category)" 
                      :alt="event.title" 
                      class="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3 mb-2">
                    <span class="bg-red-600 text-white px-3 py-1 text-xs font-black tracking-wider uppercase">
                      {{ formatCategoryName(event.category) }}
                    </span>
                    
                    <span class="text-xs text-gray-600 font-bold flex items-center gap-1 uppercase">
                      <Calendar class="w-3 h-3" />
                      {{ formatEventDate(event.start_date) }}
                    </span>
                    
                    <span class="text-xs text-gray-600 font-bold flex items-center gap-1 uppercase">
                      <Clock class="w-3 h-3" />
                      {{ event.start_time }} - {{ event.end_time }}
                    </span>
                    
                    <span class="text-xs text-gray-600 font-bold flex items-center gap-1 uppercase">
                      <MapPin class="w-3 h-3" />
                      {{ event.venue_name }}
                    </span>
                    
                    <span v-if="event.is_featured" class="text-xs px-2 py-1 bg-red-600 text-white font-black uppercase tracking-wider">
                      FEATURED
                    </span>
                    
                    <span v-if="event.is_virtual" class="text-xs px-2 py-1 bg-black text-white font-black uppercase tracking-wider">
                      VIRTUAL
                    </span>
                  </div>
                  
                  <h3 class="text-lg font-black text-black mb-2 group-hover:text-red-600 transition-colors line-clamp-2 uppercase tracking-wide">
                    {{ event.title }}
                  </h3>
                  
                  <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                    {{ event.description }}
                  </p>
                  
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <span class="text-sm text-gray-600 font-bold uppercase">
                        {{ event.city }}, {{ event.country }}
                      </span>
                      <span class="text-sm font-black text-black uppercase">
                        {{ formatEventType(event.event_type) }}
                      </span>
                    </div>
                    
                    <div class="flex items-center space-x-4 text-sm text-gray-600 font-bold">
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

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-12">
            <button 
              @click="changePage(events?.current_page - 1)"
              :disabled="!events?.has_prev"
              class="px-6 py-3 bg-white border-2 border-black text-black font-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-all uppercase tracking-wider"
            >
              PREVIOUS
            </button>
            
            <div class="flex items-center gap-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                class="w-12 h-12 transition-all font-black border-2"
                :class="page === (events?.current_page || 1)
                  ? 'bg-red-600 text-white border-red-600' 
                  : 'bg-white border-black text-black hover:bg-black hover:text-white'"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="changePage(events?.current_page + 1)"
              :disabled="!events?.has_next"
              class="px-6 py-3 bg-white border-2 border-black text-black font-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-all uppercase tracking-wider"
            >
              NEXT
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div class="w-20 h-20 bg-gray-200 border-4 border-black flex items-center justify-center mx-auto mb-6">
            <Calendar class="w-10 h-10 text-gray-400" />
          </div>
          <h3 class="text-2xl font-black text-black mb-4 uppercase tracking-wider">NO EVENTS FOUND</h3>
          <p class="text-gray-600 mb-6 font-bold">
            {{ getEmptyStateText() }}
          </p>
          <button 
            @click="clearFilters"
            class="px-8 py-4 bg-red-600 text-white font-black hover:bg-red-700 transition-all border-4 border-red-600 uppercase tracking-wider"
          >
            SHOW ALL EVENTS
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { 
  Search, Calendar, ChevronDown, X, Star, Clock, MapPin, 
  Share2, Bookmark, Play, Volume2, Eye
} from 'lucide-vue-next';

const store = useStore();
const events = computed(() => store.getters.events || {});
const eventsData = computed(() => events.value?.data || []);
const isLoadingEvents = ref(false);
const isLoading = computed(() => store.getters.isLoading);
const isPlaying = computed(() => store.getters.isPlaying);

// Search and filter states
const searchQuery = ref('');
const selectedDate = ref('');
const selectedCategory = ref('');
const quickFilter = ref('');
const searchTimeout = ref(null);

// Available categories from API structure
const eventCategories = ['concert', 'festival', 'workshop', 'conference', 'comedy', 'sports'];

// Event stats computed from real data
const eventStats = computed(() => {
  const data = eventsData.value || [];
  const now = new Date();
  
  return {
    upcoming_events: data.filter(e => new Date(e.start_date) > now).length,
    this_month: data.filter(e => {
      const eventDate = new Date(e.start_date);
      return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
    }).length,
    featured_events: data.filter(e => e.is_featured).length
  };
});

// Featured events
const featuredEvents = computed(() => {
  return eventsData.value.filter(event => event.is_featured);
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
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'TODAY';
  if (diffInDays === 1) return 'TOMORROW';
  if (diffInDays === -1) return 'YESTERDAY';
  if (diffInDays > 0 && diffInDays < 7) return `IN ${diffInDays} DAYS`;
  if (diffInDays < 0 && diffInDays > -7) return `${Math.abs(diffInDays)} DAYS AGO`;
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  }).toUpperCase();
};

const formatCategoryName = (category) => {
  if (!category) return '';
  return category.charAt(0).toUpperCase() + category.slice(1);
};

const formatEventType = (eventType) => {
  if (!eventType) return '';
  return eventType.charAt(0).toUpperCase() + eventType.slice(1);
};

const getDefaultEventImage = (category) => {
  const images = {
    concert: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    festival: 'https://images.unsplash.com/photo-1533174972262-ba846eca23bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    workshop: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    conference: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    comedy: 'https://images.unsplash.com/photo-1594736797933-d0c4a5a65d96?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
  };
  return images[category] || images.concert;
};

// Methods
const togglePlayPause = async () => {
  try {
    await store.dispatch('togglePlayPause');
  } catch (err) {
    console.error('Failed to toggle playback:', err);
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
  quickFilter.value = filter === quickFilter.value ? '' : filter;
  applyFilters();
};

const filterByDate = () => {
  applyFilters();
};

const filterByCategory = () => {
  applyFilters();
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedDate.value = '';
  selectedCategory.value = '';
  quickFilter.value = '';
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
      case 'upcoming':
        filterData.time_filter = 'upcoming';
        break;
      case 'this_week':
        const now = new Date();
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        filterData.start_date = now.toISOString();
        filterData.end_date = weekFromNow.toISOString();
        break;
      case 'featured':
        filterData.is_featured = true;
        break;
      case 'public':
        filterData.event_type = 'public';
        break;
    }
  }
  
  await loadEvents(filterData);
};

const changePage = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    await loadEvents({}, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const scrollToEvents = () => {
  document.getElementById('events-content').scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
};

const openEventDetails = (event) => {
  console.log('Opening event details:', event.title);
  // Here you would implement navigation to event details page
};

const getResultsText = () => {
  if (searchQuery.value) return `SEARCH: "${searchQuery.value.toUpperCase()}"`;
  if (selectedDate.value) return `EVENTS ON ${formatEventDate(selectedDate.value)}`;
  if (selectedCategory.value) return `${formatCategoryName(selectedCategory.value).toUpperCase()} EVENTS`;
  if (quickFilter.value) {
    switch (quickFilter.value) {
      case 'upcoming': return "UPCOMING EVENTS";
      case 'this_week': return "THIS WEEK'S EVENTS";
      case 'featured': return "FEATURED EVENTS";
      case 'public': return "PUBLIC EVENTS";
    }
  }
  return 'ALL EVENTS';
};

const getEmptyStateText = () => {
  if (searchQuery.value) return `NO EVENTS FOUND MATCHING "${searchQuery.value.toUpperCase()}"`;
  if (selectedDate.value) return `NO EVENTS SCHEDULED FOR ${formatEventDate(selectedDate.value)}`;
  if (selectedCategory.value) return `NO ${selectedCategory.value.toUpperCase()} EVENTS FOUND`;
  return 'NO EVENTS AVAILABLE AT THE MOMENT';
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

/* Override rounded corners for brutalist design */
* {
  border-radius: 0 !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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

/* Ensure sharp geometric shapes */
button, div, input, select {
  border-radius: 0 !important;
}
</style>