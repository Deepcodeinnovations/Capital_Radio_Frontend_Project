<template> 
  <div class="min-h-screen bg-gray-50">
        <!-- Hero Section -->
        <section class="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <!-- Background Image with Overlay -->
          <div class="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Radio Shows" 
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-black/80"></div>
          </div>
    
          <!-- Floating background elements -->
          <div class="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
            <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500 rounded-full blur-3xl animate-gentle-float"></div>
            <div class="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-600 rounded-full blur-3xl animate-gentle-float-delayed"></div>
            <div class="absolute top-1/2 right-1/3 w-48 h-48 bg-pink-400 rounded-full blur-3xl animate-gentle-float"></div>
          </div>
    
          <!-- Hero Content -->
          <div class="relative z-10 container mx-auto px-6 text-center">
            <!-- Hero Badge -->
            <div class="inline-flex items-center justify-center mb-8">
              <div class="h-px w-12 bg-pink-500"></div>
              <span class="mx-4 text-pink-400 font-bold tracking-wider text-sm uppercase">Radio Programs</span>
              <div class="h-px w-12 bg-purple-600"></div>
            </div>
    
            <!-- Main Heading -->
            <h1 class="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Radio <span class="text-pink-500">Shows</span>
            </h1>
    
            <!-- Subtitle -->
            <p class="text-xl md:text-2xl text-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
              Listen to recorded radio programs from KIIS 100.9 - Uganda's hottest music station
            </p>
    
            <!-- Live Stats Row -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-4xl mx-auto">
              <div class="text-center">
                <div class="text-3xl md:text-4xl font-black text-pink-500 mb-2">{{ sessionRecordings?.total || 0 }}</div>
                <div class="text-sm text-white/80 uppercase tracking-wide font-semibold">Total Episodes</div>
              </div>
              <div class="text-center">
                <div class="text-3xl md:text-4xl font-black text-purple-600 mb-2">{{ uniquePrograms.length }}</div>
                <div class="text-sm text-white/80 uppercase tracking-wide font-semibold">Programs</div>
              </div>
              <div class="text-center">
                <div class="text-3xl md:text-4xl font-black text-pink-500 mb-2">{{ totalDuration }}</div>
                <div class="text-sm text-white/80 uppercase tracking-wide font-semibold">Total Hours</div>
              </div>
              <div class="text-center">
                <div class="text-3xl md:text-4xl font-black text-purple-600 mb-2 flex items-center justify-center gap-2">
                  {{ todayEpisodes }}
                  <div v-if="todayEpisodes > 0" class="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                </div>
                <div class="text-sm text-white/80 uppercase tracking-wide font-semibold">Today's Episodes</div>
              </div>
            </div>
    
            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                @click="scrollToShows"
                class="bg-pink-500 hover:bg-pink-600 px-8 py-4 rounded-2xl text-white font-black flex items-center space-x-3 transition-all duration-300 transform hover:scale-105"
              >
                <Radio :size="20" />
                <span class="tracking-wide">BROWSE SHOWS</span>
              </button>
              
              <button 
                @click="togglePlayPause"
                class="bg-white/10 backdrop-blur-xl border-2 border-white/20 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <span class="tracking-wide flex items-center gap-2">
                  <Volume2 v-if="isPlaying" :size="20" />
                  <Play v-else :size="20" />
                  {{ isPlaying ? 'LISTENING LIVE' : 'LISTEN LIVE' }}
                </span>
              </button>
            </div>
          </div>
    
          <!-- Bottom Wave Divider -->
          <div class="absolute bottom-0 left-0 w-full">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="w-full h-16">
              <path fill="white" d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,31,17,94.98,30.44c64.64,13.91,93.29,29.88,150.17,38.07,65.88,9.2,165.63,17.05,240.88,12.55Z" />
            </svg>
          </div>
        </section>
    
        <!-- Main Content -->
        <div class="relative overflow-hidden bg-white" id="shows-content">
          <!-- Background decoration -->
          <div class="absolute inset-0 opacity-5">
            <div class="absolute top-0 right-0 w-72 h-72 bg-pink-500 rounded-full blur-3xl"></div>
            <div class="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
            <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-400 rounded-full blur-3xl"></div>
          </div>
    
          <div class="container mx-auto px-4 md:px-6 relative z-20 py-20">
            <!-- Section Header -->
            <div class="text-center mb-16">
              <div class="inline-flex items-center justify-center mb-6">
                <div class="h-px w-12 bg-pink-500"></div>
                <span class="mx-4 text-gray-800 font-bold tracking-wider text-sm uppercase">Recorded Shows</span>
                <div class="h-px w-12 bg-purple-600"></div>
              </div>
              <h2 class="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6">
                Listen to <span class="text-pink-500">Past Shows</span>
              </h2>
              <p class="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Catch up on your favorite KIIS 100.9 programs with our extensive archive of recorded shows
              </p>
            </div>
    
            <!-- Search and Filters Section -->
            <div class="mb-12">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
                <!-- Search by Program -->
                <div class="relative">
                  <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-500 w-5 h-5" />
                  <input
                    v-model="searchQuery"
                    @input="debounceSearch"
                    type="text"
                    placeholder="Search programs..."
                    class="w-full pl-12 pr-4 py-4 bg-white border-2 border-pink-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
                  />
                </div>
    
                <!-- Date Picker -->
                <div class="relative">
                  <Calendar class="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-600 w-5 h-5" />
                  <input
                    v-model="selectedDate"
                    @change="filterByDate"
                    type="date"
                    class="w-full pl-12 pr-4 py-4 bg-white border-2 border-purple-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600 transition-all duration-300"
                  />
                </div>
    
                <!-- Program Filter -->
                <div class="relative">
                  <select
                    v-model="selectedProgram"
                    @change="filterByProgram"
                    class="w-full px-4 py-4 bg-white border-2 border-pink-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 appearance-none"
                  >
                    <option value="">All Programs</option>
                    <option v-for="program in uniquePrograms" :key="program.id" :value="program.id">
                      {{ program.title }}
                    </option>
                  </select>
                  <ChevronDown class="absolute right-4 top-1/2 transform -translate-y-1/2 text-pink-500 w-5 h-5 pointer-events-none" />
                </div>
              </div>
    
              <!-- Quick Filters -->
              <div class="flex flex-wrap justify-center gap-3 mb-8">
                <button
                  @click="setQuickFilter('today')"
                  :class="quickFilter === 'today' ? 'bg-pink-500 text-white' : 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-pink-200'"
                  class="px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105"
                >
                  Today's Shows
                </button>
                <button
                  @click="setQuickFilter('yesterday')"
                  :class="quickFilter === 'yesterday' ? 'bg-pink-500 text-white' : 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-pink-200'"
                  class="px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105"
                >
                  Yesterday
                </button>
                <button
                  @click="setQuickFilter('week')"
                  :class="quickFilter === 'week' ? 'bg-pink-500 text-white' : 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-pink-200'"
                  class="px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105"
                >
                  This Week
                </button>
                <button
                  @click="clearFilters"
                  class="px-6 py-3 bg-white hover:bg-gray-50 text-red-600 rounded-2xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 border-2 border-red-200"
                >
                  <X class="w-4 h-4" />
                  Clear
                </button>
              </div>
            </div>
    
            <!-- Loading State -->
            <div v-if="isLoadingShows" class="flex justify-center items-center py-20">
              <div class="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
            </div>
    
            <!-- Shows Content -->
            <div v-else-if="filteredShows.length > 0">
              <!-- Results Info -->
              <div class="flex items-center justify-between mb-8">
                <div class="text-gray-600 font-semibold">
                  {{ getResultsText() }}
                </div>
                <div class="text-gray-600 font-semibold">
                  {{ filteredShows.length }} {{ filteredShows.length === 1 ? 'episode' : 'episodes' }}
                </div>
              </div>
    
              <!-- All Shows List -->
              <div class="space-y-6 mb-8">
                <div 
                  v-for="show in paginatedShows" 
                  :key="show.id"
                  class="relative group cursor-pointer"
                >
                  <!-- Border Effect -->
                  <div class="absolute -inset-0.5 bg-pink-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                  
                  <div class="relative bg-white rounded-3xl p-6 border-2 border-pink-100 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 transform hover:scale-[1.02] overflow-hidden">
                    <div class="flex items-start space-x-4">
                      <div class="flex-shrink-0">
                        <div class="w-24 h-24 rounded-2xl overflow-hidden relative group/play bg-pink-50">
                          <img 
                            :src="show.program?.image_url || getDefaultShowImage(show.program?.title)" 
                            :alt="show.program?.title" 
                            class="w-full h-full object-cover"
                          />
                          <!-- Play overlay -->
                          <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              @click="playShow(show)"
                              class="w-12 h-12 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                            >
                              <Pause v-if="currentlyPlaying?.id === show.id && isAudioPlaying" class="w-6 h-6 text-white" />
                              <Play v-else class="w-6 h-6 text-white ml-1" />
                            </button>
                          </div>
                        </div>
                      </div>
    
                      <div class="flex-1 min-w-0">
                        <div class="flex flex-wrap items-center gap-3 mb-3">
                          <span class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-black bg-pink-100 text-pink-600 border border-pink-200">
                            {{ show.program?.title || 'Radio Show' }}
                          </span>
                          
                          <span class="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                            <Calendar class="w-3 h-3" />
                            {{ formatShowDate(show.session_date) }}
                          </span>
                          
                          <span class="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                            <Clock class="w-3 h-3" />
                            {{ formatTime(show.actual_start_time) }} - {{ formatTime(show.actual_end_time) }}
                          </span>
                          
                          <span class="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                            <Timer class="w-3 h-3" />
                            {{ show.duration_minutes }}min
                          </span>
                          
                          <span v-if="show.recording_status === 'completed'" class="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold border border-green-200">
                            Available
                          </span>
                          <span v-else class="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-bold border border-yellow-200">
                            {{ show.recording_status }}
                          </span>
                        </div>
                        
                        <h3 class="text-lg font-black text-gray-900 mb-2 group-hover:text-pink-500 transition-all duration-300">
                          {{ show.program?.title }} - {{ formatShowDate(show.session_date) }}
                        </h3>
                        
                        <p class="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                          {{ show.program?.description || show.session_notes || 'Listen to this recorded radio session.' }}
                        </p>
                        
                        <div class="flex items-center justify-between">
                          <div class="flex items-center space-x-2">
                            <div class="flex -space-x-1">
                              <div v-for="host in show.hosts?.slice(0, 3)" :key="host.id" 
                                   class="w-8 h-8 rounded-full border-2 border-white bg-pink-100 flex items-center justify-center overflow-hidden">
                                <img v-if="host.image_url" :src="host.image_url" :alt="host.name" class="w-full h-full object-cover rounded-full">
                                <span v-else class="text-xs font-bold text-pink-600">{{ host.name.charAt(0) }}</span>
                              </div>
                            </div>
                            <span class="text-sm text-gray-600 font-semibold">{{ getHostsText(show.hosts) }}</span>
                          </div>
                          
                          <div class="flex items-center space-x-4 text-sm text-gray-500">
                            <div class="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full">
                              <HardDrive class="w-4 h-4" />
                              <span class="font-semibold">{{ show.file_size_mb }}MB</span>
                            </div>
                            <button 
                              @click="downloadShow(show)"
                              class="flex items-center space-x-1 hover:text-pink-500 transition-colors bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 font-semibold"
                            >
                              <Download class="w-4 h-4" />
                              <span>Download</span>
                            </button>
                            <button 
                              @click="shareShow(show)"
                              class="flex items-center space-x-1 hover:text-purple-600 transition-colors bg-gray-100 px-3 py-1 rounded-full hover:bg-gray-200 font-semibold"
                            >
                              <Share2 class="w-4 h-4" />
                              <span>Share</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
    
                    <!-- Audio Progress Bar (when playing) -->
                    <div v-if="currentlyPlaying?.id === show.id" class="mt-6 pt-6 border-t border-pink-200">
                      <div class="flex items-center space-x-4">
                        <button 
                          @click="playShow(show)"
                          class="w-10 h-10 bg-pink-500 hover:bg-pink-600 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 shadow-lg"
                        >
                          <Pause v-if="isAudioPlaying" class="w-5 h-5 text-white" />
                          <Play v-else class="w-5 h-5 text-white ml-0.5" />
                        </button>
                        
                        <div class="flex-1">
                          <div class="flex items-center justify-between text-xs text-gray-500 mb-1 font-semibold">
                            <span>{{ formatAudioTime(currentTime) }}</span>
                            <span>{{ formatAudioTime(duration) }}</span>
                          </div>
                          <div class="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              class="bg-pink-500 h-2 rounded-full transition-all duration-300" 
                              :style="{ width: audioProgress + '%' }"
                            ></div>
                          </div>
                        </div>
                        
                        <div class="flex items-center space-x-2">
                          <Volume2 class="w-4 h-4 text-gray-400" />
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            :value="volume" 
                            @input="setVolume($event.target.value)"
                            class="w-20 h-2 bg-gray-200 rounded-lg appearance-none slider"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
    
              <!-- Pagination -->
              <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-12">
                <button 
                  @click="changePage(sessionRecordings?.current_page - 1)"
                  :disabled="!sessionRecordings?.has_prev"
                  class="px-6 py-3 bg-white border-2 border-pink-200 text-gray-700 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-50 hover:border-pink-300 transition-all duration-300 font-semibold"
                >
                  Previous
                </button>
                
                <div class="flex items-center gap-1">
                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="changePage(page)"
                    class="w-12 h-12 rounded-2xl transition-all duration-300 font-bold"
                    :class="page === (sessionRecordings?.current_page || 1)
                      ? 'bg-pink-500 text-white shadow-lg' 
                      : 'bg-white border-2 border-pink-200 text-gray-700 hover:bg-pink-50 hover:border-pink-300'"
                  >
                    {{ page }}
                  </button>
                </div>
                
                <button 
                  @click="changePage(sessionRecordings?.current_page + 1)"
                  :disabled="!sessionRecordings?.has_next"
                  class="px-6 py-3 bg-white border-2 border-pink-200 text-gray-700 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-50 hover:border-pink-300 transition-all duration-300 font-semibold"
                >
                  Next
                </button>
              </div>
            </div>
    
            <!-- Empty State -->
            <div v-else class="text-center py-20">
              <div class="w-20 h-20 bg-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Radio class="w-10 h-10 text-pink-500" />
              </div>
              <h3 class="text-2xl font-black text-gray-900 mb-4">No Shows Found</h3>
              <p class="text-gray-600 mb-6 leading-relaxed">
                {{ getEmptyStateText() }}
              </p>
              <button 
                @click="clearFilters"
                class="bg-pink-500 hover:bg-pink-600 text-white font-black px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105"
              >
                Show All Episodes
              </button>
            </div>
          </div>
        </div>
    
        <!-- Hidden Audio Element -->
        <audio ref="audioPlayer" @timeupdate="updateProgress" @loadedmetadata="setDuration" @ended="onAudioEnded" class="hidden">
          <source :src="currentlyPlaying?.recording_file_url" type="audio/mpeg">
        </audio>
      </div>
    </template>
    
    <script setup>
    import { ref, computed, onMounted, watch } from 'vue';
    import { useStore } from 'vuex';
    import { 
      Search, Calendar, ChevronDown, X, Play, Volume2, Radio, 
      Clock, Timer, Download, Share2, Pause, HardDrive
    } from 'lucide-vue-next';
    
    const store = useStore();
    const station = computed(() => store.getters.station);
    const sessionRecordings = computed(() => store.getters.sessionRecordings || {});
    const isPlaying = computed(() => store.getters.isPlaying);
    const isLoadingShows = ref(false);
    
    // Audio player refs and state
    const audioPlayer = ref(null);
    const currentlyPlaying = ref(null);
    const isAudioPlaying = ref(false);
    const currentTime = ref(0);
    const duration = ref(0);
    const volume = ref(70);
    
    // Search and filter states
    const searchQuery = ref('');
    const selectedDate = ref('');
    const selectedProgram = ref('');
    const quickFilter = ref('');
    const searchTimeout = ref(null);
    
    // Pagination
    const currentPage = ref(1);
    const itemsPerPage = 10;
    
    // Computed properties
    const recordingsData = computed(() => sessionRecordings.value?.data || []);
    
    const uniquePrograms = computed(() => {
      const programs = new Map();
      const recordings = recordingsData.value || [];
      recordings.forEach(recording => {
        if (recording.program && !programs.has(recording.program.id)) {
          programs.set(recording.program.id, recording.program);
        }
      });
      return Array.from(programs.values());
    });
    
    const totalDuration = computed(() => {
      const recordings = recordingsData.value || [];
      const total = recordings.reduce((sum, recording) => sum + (recording.duration_minutes || 0), 0);
      return Math.round(total / 60) + 'h';
    });
    
    const todayEpisodes = computed(() => {
      const recordings = recordingsData.value || [];
      const today = new Date().toISOString().split('T')[0];
      return recordings.filter(recording => 
        recording.session_date?.split('T')[0] === today
      ).length;
    });
    
    const filteredShows = computed(() => {
      let shows = [...(recordingsData.value || [])];
      
      // Apply search filter
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        shows = shows.filter(show => 
          show.program?.title?.toLowerCase().includes(query) ||
          show.program?.description?.toLowerCase().includes(query) ||
          show.session_notes?.toLowerCase().includes(query)
        );
      }
      
      // Apply date filter
      if (selectedDate.value) {
        shows = shows.filter(show => show.session_date?.split('T')[0] === selectedDate.value);
      }
      
      // Apply program filter
      if (selectedProgram.value) {
        shows = shows.filter(show => show.program?.id === selectedProgram.value);
      }
      
      // Apply quick filters
      if (quickFilter.value) {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
        
        switch (quickFilter.value) {
          case 'today':
            shows = shows.filter(show => show.session_date?.split('T')[0] === today);
            break;
          case 'yesterday':
            shows = shows.filter(show => show.session_date?.split('T')[0] === yesterday);
            break;
          case 'week':
            shows = shows.filter(show => show.session_date?.split('T')[0] >= weekAgo);
            break;
        }
      }
      
      return shows.sort((a, b) => new Date(b.session_date) - new Date(a.session_date));
    });
    
    const totalPages = computed(() => {
      return sessionRecordings.value?.total_pages || 1;
    });
    
    const paginatedShows = computed(() => {
      // Since we're getting paginated data from API, just return filtered shows
      return filteredShows.value;
    });
    
    const visiblePages = computed(() => {
      const pages = [];
      const current = sessionRecordings.value?.current_page || 1;
      const total = totalPages.value;
      
      const start = Math.max(1, current - 2);
      const end = Math.min(total, current + 2);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    });
    
    const audioProgress = computed(() => {
      if (duration.value === 0) return 0;
      return (currentTime.value / duration.value) * 100;
    });
    
    // Helper functions
    const formatShowDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const now = new Date();
      const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 7) return `${diffInDays} days ago`;
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    };
    
    const formatTime = (timeString) => {
      if (!timeString) return '';
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    };
    
    const formatAudioTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };
    
    const getHostsText = (hosts) => {
      if (!hosts || hosts.length === 0) return 'Unknown Host';
      if (hosts.length === 1) return hosts[0].name;
      if (hosts.length === 2) return `${hosts[0].name} & ${hosts[1].name}`;
      return `${hosts[0].name} & ${hosts.length - 1} others`;
    };
    
    const getDefaultShowImage = (programTitle) => {
      const images = [
        'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
      ];
      const hash = programTitle ? programTitle.length % images.length : 0;
      return images[hash];
    };
    
    // Methods
    const togglePlayPause = async () => {
      try {
        await store.dispatch('togglePlayPause');
      } catch (err) {
        console.error('Failed to toggle playback:', err);
      }
    };
    
    const playShow = (show) => {
      if (!show.recording_file_url) {
        console.error('No audio file available for this show');
        return;
      }
    
      if (currentlyPlaying.value?.id === show.id) {
        // Toggle play/pause for current show
        if (isAudioPlaying.value) {
          audioPlayer.value.pause();
          isAudioPlaying.value = false;
        } else {
          audioPlayer.value.play();
          isAudioPlaying.value = true;
        }
      } else {
        // Play new show
        currentlyPlaying.value = show;
        isAudioPlaying.value = true;
        // Audio will start playing due to reactive src change
      }
    };
    
    const downloadShow = (show) => {
      if (show.recording_file_url) {
        const link = document.createElement('a');
        link.href = show.recording_file_url;
        link.download = `${show.program?.title || 'Radio Show'} - ${formatShowDate(show.session_date)}.mp3`;
        link.click();
      }
    };
    
    const shareShow = (show) => {
      if (navigator.share) {
        navigator.share({
          title: `${show.program?.title || 'Radio Show'} - ${formatShowDate(show.session_date)}`,
          text: show.program?.description || 'Listen to this radio show recording',
          url: show.recording_file_url
        });
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(show.recording_file_url);
        // You could add a toast notification here
        console.log('Show URL copied to clipboard');
      }
    };
    
    const debounceSearch = () => {
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value);
      }
      
      searchTimeout.value = setTimeout(() => {
        currentPage.value = 1;
      }, 500);
    };
    
    const setQuickFilter = (filter) => {
      quickFilter.value = filter === quickFilter.value ? '' : filter;
      currentPage.value = 1;
    };
    
    const filterByDate = () => {
      currentPage.value = 1;
    };
    
    const filterByProgram = () => {
      currentPage.value = 1;
    };
    
    const clearFilters = () => {
      searchQuery.value = '';
      selectedDate.value = '';
      selectedProgram.value = '';
      quickFilter.value = '';
      currentPage.value = 1;
    };
    
    const changePage = async (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        // Load new page data from API
        await loadSessionRecordings(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    
    const scrollToShows = () => {
      document.getElementById('shows-content').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    };
    
    const getResultsText = () => {
      if (searchQuery.value) return `Search results for "${searchQuery.value}"`;
      if (selectedDate.value) return `Shows from ${formatShowDate(selectedDate.value)}`;
      if (selectedProgram.value) {
        const program = uniquePrograms.value.find(p => p.id === selectedProgram.value);
        return `Episodes of ${program?.title || 'Selected Program'}`;
      }
      if (quickFilter.value) {
        switch (quickFilter.value) {
          case 'today': return "Today's Shows";
          case 'yesterday': return "Yesterday's Shows";
          case 'week': return "This Week's Shows";
        }
      }
      return 'All Radio Shows';
    };
    
    const getEmptyStateText = () => {
      if (searchQuery.value) return `No shows found matching "${searchQuery.value}"`;
      if (selectedDate.value) return `No shows available for ${formatShowDate(selectedDate.value)}`;
      if (selectedProgram.value) return 'No episodes found for this program';
      return 'No radio shows available at the moment';
    };
    
    // Audio player methods
    const updateProgress = () => {
      if (audioPlayer.value) {
        currentTime.value = audioPlayer.value.currentTime;
      }
    };
    
    const setDuration = () => {
      if (audioPlayer.value) {
        duration.value = audioPlayer.value.duration;
      }
    };
    
    const setVolume = (value) => {
      volume.value = value;
      if (audioPlayer.value) {
        audioPlayer.value.volume = value / 100;
      }
    };
    
    const onAudioEnded = () => {
      isAudioPlaying.value = false;
      currentTime.value = 0;
    };
    
    const loadSessionRecordings = async () => {
      isLoadingShows.value = true;
      try {
        await store.dispatch('fetch_session_recordings', {
          data: { station_id: station.value?.id }
        });
      } catch (error) {
        console.error('Failed to load session recordings:', error);
      } finally {
        isLoadingShows.value = false;
      }
    };
    
    onMounted(async () => {
      await loadSessionRecordings();
    });
    
    // Watch for currentlyPlaying changes to update audio source
    watch(currentlyPlaying, (newShow) => {
      if (newShow && audioPlayer.value) {
        audioPlayer.value.load(); // Reload audio element with new source
        if (isAudioPlaying.value) {
          audioPlayer.value.play();
        }
      }
    });
    
    // Set initial volume
    watch(audioPlayer, (player) => {
      if (player) {
        player.volume = volume.value / 100;
      }
    });
  </script>
  
  <style scoped>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  /* Enhanced backdrop blur for better glass effect */
  .backdrop-blur-xl {
    backdrop-filter: blur(24px);
  }
  
  /* Custom slider styles */
  .slider {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
  }
  
  .slider::-webkit-slider-track {
    background: #e5e7eb;
    height: 8px;
    border-radius: 4px;
  }
  
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    background: #ec4899;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .slider::-moz-slider-track {
    background: #e5e7eb;
    height: 8px;
    border-radius: 4px;
    border: none;
  }
  
  .slider::-moz-slider-thumb {
    background: #ec4899;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
  
  /* Gentle floating animations */
  @keyframes gentle-float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
  }
  
  @keyframes gentle-float-delayed {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }
  
  .animate-gentle-float {
    animation: gentle-float 6s ease-in-out infinite;
  }
  
  .animate-gentle-float-delayed {
    animation: gentle-float-delayed 7s ease-in-out infinite 2s;
  }
  
  /* Smooth animations */
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: .5;
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
  
  /* Enhanced hover effects */
  button:hover, .group:hover {
    transform: translateY(-2px);
  }
  
  /* Professional shadows */
  .shadow-2xl {
    box-shadow: 0 25px 50px -12px rgba(244, 114, 182, 0.25);
  }
  
  /* Hover effects */
  .group:hover .group-hover\:opacity-100 {
    opacity: 1;
  }
  
  .group:hover .group-hover\:scale-110 {
    transform: scale(1.1);
  }
  </style>