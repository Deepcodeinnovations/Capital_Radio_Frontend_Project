<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="relative bg-black border-b border-gray-800 overflow-hidden" style="margin-top: -5rem !important; padding-top: 5rem;">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Radio Shows"
          class="w-full h-full object-cover opacity-40"
        />
        <div class="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center max-w-3xl mx-auto">
          <div class="inline-flex items-center justify-center mb-4">
            <Radio class="text-[#F8CB00] mr-2" :size="24" />
            <span class="text-[#F8CB00] font-semibold uppercase tracking-wider text-sm">Radio Programs</span>
          </div>
          <h1 class="text-4xl sm:text-5xl font-bold text-white mb-4">
            Radio Shows
          </h1>
          <p class="text-lg text-gray-300">
            Listen to recorded radio programs from {{ station?.name || "Capital FM" }}
          </p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
          <div class="text-center">
            <div class="text-3xl font-bold text-[#F8CB00]">{{ sessionRecordings?.total || 0 }}</div>
            <div class="text-sm text-gray-400 mt-1">Total Episodes</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-[#F8CB00]">{{ uniquePrograms.length }}</div>
            <div class="text-sm text-gray-400 mt-1">Programs</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-[#F8CB00]">{{ totalDuration }}</div>
            <div class="text-sm text-gray-400 mt-1">Total Hours</div>
          </div>
          <div class="text-center">
            <div class="text-3xl font-bold text-[#F8CB00] flex items-center justify-center gap-2">
              {{ todayEpisodes }}
              <div v-if="todayEpisodes > 0" class="w-2 h-2 bg-[#F8CB00] rounded-full animate-pulse"></div>
            </div>
            <div class="text-sm text-gray-400 mt-1">Today's Episodes</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="bg-gray-50 relative" id="shows-content">
      <div class="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <!-- Search and Filters Section -->
        <div class="mb-12">
          <div
            class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto"
          >
            <!-- Search by Program -->
            <div class="relative">
              <Search
                class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
              <input
                v-model="searchQuery"
                @input="debounceSearch"
                type="text"
                placeholder="Search programs..."
                class="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F8CB00] focus:border-transparent"
              />
            </div>

            <!-- Date Picker -->
            <div class="relative">
              <Calendar
                class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
              <input
                v-model="selectedDate"
                @change="filterByDate"
                type="date"
                class="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F8CB00] focus:border-transparent"
              />
            </div>

            <!-- Program Filter -->
            <div class="relative">
              <select
                v-model="selectedProgram"
                @change="filterByProgram"
                class="w-full px-4 py-4 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F8CB00] focus:border-transparent appearance-none"
              >
                <option value="">All Programs</option>
                <option
                  v-for="program in uniquePrograms"
                  :key="program.id"
                  :value="program.id"
                >
                  {{ program.title }}
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
              @click="setQuickFilter('today')"
              :class="
                quickFilter === 'today'
                  ? 'bg-[#F8CB00] text-black'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
              "
              class="px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Today's Shows
            </button>
            <button
              @click="setQuickFilter('yesterday')"
              :class="
                quickFilter === 'yesterday'
                  ? 'bg-[#F8CB00] text-black'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
              "
              class="px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Yesterday
            </button>
            <button
              @click="setQuickFilter('week')"
              :class="
                quickFilter === 'week'
                  ? 'bg-[#F8CB00] text-black'
                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
              "
              class="px-4 py-2 rounded-lg font-medium transition-colors"
            >
              This Week
            </button>
            <button
              @click="clearFilters"
              class="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <X class="w-4 h-4" />
              Clear
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div
          v-if="isLoadingShows"
          class="flex justify-center items-center py-20"
        >
          <div
            class="w-12 h-12 border-4 border-gray-300 border-t-[#F8CB00] rounded-full animate-spin"
          ></div>
        </div>

        <!-- Shows Content -->
        <div v-else-if="filteredShows.length > 0">
          <!-- Results Info -->
          <div class="flex items-center justify-between mb-8">
            <div class="text-gray-700 font-semibold">
              {{ getResultsText() }}
            </div>
            <div class="text-gray-600">
              {{ filteredShows.length }}
              {{ filteredShows.length === 1 ? "episode" : "episodes" }}
            </div>
          </div>

          <!-- All Shows List -->
          <div class="space-y-4 mb-8">
            <div
              v-for="show in paginatedShows"
              :key="show.id"
              class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md hover:border-[#F8CB00] transition-all group cursor-pointer relative overflow-hidden"
            >
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div
                    class="w-24 h-24 rounded-lg overflow-hidden relative group/play bg-gray-200"
                  >
                    <img
                      :src="
                        show.program?.image_url ||
                        getDefaultShowImage(show.program?.title)
                      "
                      :alt="show.program?.title"
                      class="w-full h-full object-cover"
                    />
                    <!-- Play overlay -->
                    <div
                      class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <button
                        @click="playShow(show)"
                        class="w-12 h-12 bg-[#F8CB00]/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Pause
                          v-if="
                            currentlyPlaying?.id === show.id && isAudioPlaying
                          "
                          class="w-6 h-6 text-black"
                        />
                        <Play v-else class="w-6 h-6 text-black ml-1" />
                      </button>
                    </div>
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3 mb-2">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F8CB00]/20 text-[#F8CB00]"
                    >
                      {{ show.program?.title || "Radio Show" }}
                    </span>

                    <span class="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar class="w-3 h-3" />
                      {{ formatShowDate(show.session_date) }}
                    </span>

                    <span class="text-xs text-gray-500 flex items-center gap-1">
                      <Clock class="w-3 h-3" />
                      {{ formatTime(show.actual_start_time) }} -
                      {{ formatTime(show.actual_end_time) }}
                    </span>

                    <span class="text-xs text-gray-500 flex items-center gap-1">
                      <Timer class="w-3 h-3" />
                      {{ show.duration_minutes }}min
                    </span>

                    <span
                      v-if="show.recording_status === 'completed'"
                      class="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full"
                    >
                      Available
                    </span>
                    <span
                      v-else
                      class="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full"
                    >
                      {{ show.recording_status }}
                    </span>
                  </div>

                  <h3
                    class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#F8CB00] transition-colors"
                  >
                    {{ show.program?.title }} -
                    {{ formatShowDate(show.session_date) }}
                  </h3>

                  <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                    {{
                      show.program?.description ||
                      show.session_notes ||
                      "Listen to this recorded radio session."
                    }}
                  </p>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <div class="flex -space-x-1">
                        <div
                          v-for="host in show.hosts?.slice(0, 3)"
                          :key="host.id"
                          class="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden"
                        >
                          <img
                            v-if="host.image_url"
                            :src="host.image_url"
                            :alt="host.name"
                            class="w-full h-full object-cover rounded-full"
                          />
                          <span
                            v-else
                            class="text-xs font-bold text-gray-600"
                            >{{ host.name.charAt(0) }}</span
                          >
                        </div>
                      </div>
                      <span class="text-sm text-gray-600">{{
                        getHostsText(show.hosts)
                      }}</span>
                    </div>

                    <div
                      class="flex items-center space-x-4 text-sm text-gray-500"
                    >
                      <div class="flex items-center space-x-1">
                        <HardDrive class="w-4 h-4" />
                        <span>{{ show.file_size_mb }}MB</span>
                      </div>
                      <button
                        @click="downloadShow(show)"
                        class="flex items-center space-x-1 hover:text-[#F8CB00] transition-colors"
                      >
                        <Download class="w-4 h-4" />
                        <span>Download</span>
                      </button>
                      <button
                        @click="shareShow(show)"
                        class="flex items-center space-x-1 hover:text-[#F8CB00] transition-colors"
                      >
                        <Share2 class="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Audio Progress Bar (when playing) -->
              <div
                v-if="currentlyPlaying?.id === show.id"
                class="mt-4 pt-4 border-t border-gray-200"
              >
                <div class="flex items-center space-x-4">
                  <button
                    @click="playShow(show)"
                    class="w-8 h-8 bg-[#F8CB00] rounded-full flex items-center justify-center hover:bg-[#F8CB00]/80 transition-colors"
                  >
                    <Pause v-if="isAudioPlaying" class="w-4 h-4 text-black" />
                    <Play v-else class="w-4 h-4 text-black ml-0.5" />
                  </button>

                  <div class="flex-1">
                    <div
                      class="flex items-center justify-between text-xs text-gray-500 mb-1"
                    >
                      <span>{{ formatAudioTime(currentTime) }}</span>
                      <span>{{ formatAudioTime(duration) }}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div
                        class="bg-[#F8CB00] h-2 rounded-full transition-all duration-300"
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

          <!-- Pagination -->
          <div
            v-if="totalPages > 1"
            class="flex justify-center items-center gap-2 mt-12"
          >
            <button
              @click="changePage(sessionRecordings?.current_page - 1)"
              :disabled="!sessionRecordings?.has_prev"
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
                  page === (sessionRecordings?.current_page || 1)
                    ? 'bg-[#F8CB00] text-black'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                "
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="changePage(sessionRecordings?.current_page + 1)"
              :disabled="!sessionRecordings?.has_next"
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
            <Radio class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">
            No Shows Found
          </h3>
          <p class="text-gray-600 mb-6">
            {{ getEmptyStateText() }}
          </p>
          <button
            @click="clearFilters"
            class="px-6 py-3 bg-[#F8CB00] text-black rounded-lg hover:bg-[#F8CB00]/80 transition-colors font-medium"
          >
            Show All Episodes
          </button>
        </div>
      </div>
    </div>

    <!-- Hidden Audio Element -->
    <audio
      ref="audioPlayer"
      @timeupdate="updateProgress"
      @loadedmetadata="setDuration"
      @ended="onAudioEnded"
      class="hidden"
    >
      <source :src="currentlyPlaying?.recording_file_url" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import {
  Search,
  Calendar,
  ChevronDown,
  X,
  Play,
  Volume2,
  Radio,
  Clock,
  Timer,
  Download,
  Share2,
  Pause,
  HardDrive,
} from "lucide-vue-next";

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
const searchQuery = ref("");
const selectedDate = ref("");
const selectedProgram = ref("");
const quickFilter = ref("");
const searchTimeout = ref(null);

// Pagination
const currentPage = ref(1);
const itemsPerPage = 10;

// Computed properties
const recordingsData = computed(() => sessionRecordings.value?.data || []);

const uniquePrograms = computed(() => {
  const programs = new Map();
  const recordings = recordingsData.value || [];
  recordings.forEach((recording) => {
    if (recording.program && !programs.has(recording.program.id)) {
      programs.set(recording.program.id, recording.program);
    }
  });
  return Array.from(programs.values());
});

const totalDuration = computed(() => {
  const recordings = recordingsData.value || [];
  const total = recordings.reduce(
    (sum, recording) => sum + (recording.duration_minutes || 0),
    0
  );
  return Math.round(total / 60) + "h";
});

const todayEpisodes = computed(() => {
  const recordings = recordingsData.value || [];
  const today = new Date().toISOString().split("T")[0];
  return recordings.filter(
    (recording) => recording.session_date?.split("T")[0] === today
  ).length;
});

const filteredShows = computed(() => {
  let shows = [...(recordingsData.value || [])];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    shows = shows.filter(
      (show) =>
        show.program?.title?.toLowerCase().includes(query) ||
        show.program?.description?.toLowerCase().includes(query) ||
        show.session_notes?.toLowerCase().includes(query)
    );
  }

  // Apply date filter
  if (selectedDate.value) {
    shows = shows.filter(
      (show) => show.session_date?.split("T")[0] === selectedDate.value
    );
  }

  // Apply program filter
  if (selectedProgram.value) {
    shows = shows.filter((show) => show.program?.id === selectedProgram.value);
  }

  // Apply quick filters
  if (quickFilter.value) {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];
    const weekAgo = new Date(Date.now() - 7 * 86400000)
      .toISOString()
      .split("T")[0];

    switch (quickFilter.value) {
      case "today":
        shows = shows.filter(
          (show) => show.session_date?.split("T")[0] === today
        );
        break;
      case "yesterday":
        shows = shows.filter(
          (show) => show.session_date?.split("T")[0] === yesterday
        );
        break;
      case "week":
        shows = shows.filter(
          (show) => show.session_date?.split("T")[0] >= weekAgo
        );
        break;
    }
  }

  return shows.sort(
    (a, b) => new Date(b.session_date) - new Date(a.session_date)
  );
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
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

const formatTime = (timeString) => {
  if (!timeString) return "";
  const date = new Date(timeString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatAudioTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

const getHostsText = (hosts) => {
  if (!hosts || hosts.length === 0) return "Unknown Host";
  if (hosts.length === 1) return hosts[0].name;
  if (hosts.length === 2) return `${hosts[0].name} & ${hosts[1].name}`;
  return `${hosts[0].name} & ${hosts.length - 1} others`;
};

const getDefaultShowImage = (programTitle) => {
  const images = [
    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  ];
  const hash = programTitle ? programTitle.length % images.length : 0;
  return images[hash];
};

// Methods
const togglePlayPause = async () => {
  try {
    await store.dispatch("togglePlayPause");
  } catch (err) {
    console.error("Failed to toggle playback:", err);
  }
};

const playShow = (show) => {
  if (!show.recording_file_url) {
    console.error("No audio file available for this show");
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
    const link = document.createElement("a");
    link.href = show.recording_file_url;
    link.download = `${show.program?.title || "Radio Show"} - ${formatShowDate(
      show.session_date
    )}.mp3`;
    link.click();
  }
};

const shareShow = (show) => {
  if (navigator.share) {
    navigator.share({
      title: `${show.program?.title || "Radio Show"} - ${formatShowDate(
        show.session_date
      )}`,
      text: show.program?.description || "Listen to this radio show recording",
      url: show.recording_file_url,
    });
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(show.recording_file_url);
    // You could add a toast notification here
    console.log("Show URL copied to clipboard");
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
  quickFilter.value = filter === quickFilter.value ? "" : filter;
  currentPage.value = 1;
};

const filterByDate = () => {
  currentPage.value = 1;
};

const filterByProgram = () => {
  currentPage.value = 1;
};

const clearFilters = () => {
  searchQuery.value = "";
  selectedDate.value = "";
  selectedProgram.value = "";
  quickFilter.value = "";
  currentPage.value = 1;
};

const changePage = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // Load new page data from API
    await loadSessionRecordings(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const scrollToShows = () => {
  document.getElementById("shows-content").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const getResultsText = () => {
  if (searchQuery.value) return `Search results for "${searchQuery.value}"`;
  if (selectedDate.value)
    return `Shows from ${formatShowDate(selectedDate.value)}`;
  if (selectedProgram.value) {
    const program = uniquePrograms.value.find(
      (p) => p.id === selectedProgram.value
    );
    return `Episodes of ${program?.title || "Selected Program"}`;
  }
  if (quickFilter.value) {
    switch (quickFilter.value) {
      case "today":
        return "Today's Shows";
      case "yesterday":
        return "Yesterday's Shows";
      case "week":
        return "This Week's Shows";
    }
  }
  return "All Radio Shows";
};

const getEmptyStateText = () => {
  if (searchQuery.value)
    return `No shows found matching "${searchQuery.value}"`;
  if (selectedDate.value)
    return `No shows available for ${formatShowDate(selectedDate.value)}`;
  if (selectedProgram.value) return "No episodes found for this program";
  return "No radio shows available at the moment";
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
    await store.dispatch("fetch_session_recordings", {
      data: { station_id: station.value?.id },
    });
  } catch (error) {
    console.error("Failed to load session recordings:", error);
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
  background: #f8cb00;
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
  background: #f8cb00;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
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

/* Hover effects */
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}
</style>
