<template>
  <div class="relative bg-gray-50">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0">
        <div
          v-for="(slide, index) in carouselItems"
          :key="slide?.id || index"
          :class="[
            'absolute inset-0 transition-opacity duration-1000',
            index === currentSlide ? 'opacity-100' : 'opacity-0',
          ]"
        >
          <img
            :src="slide?.image_url || slide?.featured_image_url || '/api/placeholder/1920/1080'"
            :alt="slide?.title || 'Background'"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
        </div>
      </div>

      <!-- Content -->
      <div class="relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 lg:py-40">
          <div class="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <!-- Left Content -->
            <div class="text-white space-y-8 lg:col-span-7">
              <!-- Live Badge -->
              <div v-scroll-reveal="{ animation: 'fade', delay: 0 }" class="inline-flex items-center space-x-2 bg-red-600 px-4 py-2 rounded-full">
                <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span class="text-xs font-bold uppercase tracking-wider">
                  {{ currentSlideData?.type === 'news' ? 'Breaking News' : 'Live Now' }}
                </span>
              </div>

              <!-- Headline -->
              <h1 v-scroll-reveal="{ animation: 'fade-up', delay: 100 }" class="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight line-clamp-1">
                {{ currentSlideData?.title || "Uganda's Premier Radio Station" }}
              </h1>

              <!-- Description -->
              <p v-scroll-reveal="{ animation: 'fade-up', delay: 200 }" class="text-lg sm:text-xl text-gray-200 leading-relaxed">
                {{ truncateText(currentSlideData?.description || currentSlideData?.excerpt || "Fresh Hits, Breaking News & Quality Entertainment 24/7", 150) }}
              </p>

              <!-- Buttons -->
              <div v-scroll-reveal="{ animation: 'fade-up', delay: 300 }" class="flex flex-col sm:flex-row gap-4">
                <button
                  @click="togglePlayPause"
                  :disabled="isLoading"
                  :class="[
                    'px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-3 rounded-full',
                    isPlaying
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-[#F8CB00] hover:bg-yellow-500 text-black',
                  ]"
                >
                  <div v-if="isLoading" class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <Volume2 v-else-if="isPlaying" :size="20" />
                  <Play v-else :size="20" />
                  <span>{{ isLoading ? 'Connecting...' : isPlaying ? 'Listening Live' : 'Listen Live' }}</span>
                </button>

                <button
                  v-if="currentSlideData?.type === 'news'"
                  @click="handleDetailsClick(currentSlideData)"
                  class="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                >
                  <span>Read Story</span>
                  <ChevronRight :size="18" />
                </button>

                <button
                  v-else-if="currentSlideData?.type === 'advert' && currentSlideData?.target_url"
                  @click="handleAdvertClick"
                  class="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center space-x-2"
                >
                  <span>{{ currentSlideData?.button_title || 'Learn More' }}</span>
                  <ExternalLink :size="18" />
                </button>
              </div>

              <!-- Stats -->
              <div v-scroll-reveal="{ animation: 'fade-up', delay: 400 }" class="grid grid-cols-3 gap-8 pt-8">
                <div>
                  <div class="text-3xl font-bold text-[#F8CB00]">91.3</div>
                  <div class="text-sm text-gray-300">FM</div>
                </div>
                <div>
                  <div class="text-3xl font-bold text-[#F8CB00]">24/7</div>
                  <div class="text-sm text-gray-300">Live</div>
                </div>
                <div>
                  <div class="text-3xl font-bold text-[#F8CB00]">{{ currentStation?.listeners || '10K' }}+</div>
                  <div class="text-sm text-gray-300">Listeners</div>
                </div>
              </div>
            </div>

            <!-- Right Content - On Air Card -->
            <div v-if="getTodaySchedule().length > 0" v-scroll-reveal="{ animation: 'fade-left', delay: 200 }" class="bg-white rounded-2xl shadow-2xl p-8 space-y-6 lg:col-span-5">
              <!-- On Air Header -->
              <div class="flex items-center justify-between border-b pb-4">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                  <span class="text-red-600 font-bold text-sm uppercase">On Air Now</span>
                </div>
                <span class="text-gray-500 text-sm">{{ getCurrentTime() }}</span>
              </div>

              <!-- Current Show -->
              <div>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">
                  {{ currentShow?.program?.title || 'Live Show' }}
                </h3>
                <p class="text-gray-600 mb-3">
                  with {{ getCurrentSessionHosts(currentShow) }}
                </p>
                <div class="flex items-center text-sm text-gray-500">
                  <Clock :size="14" class="mr-1.5" />
                  {{ currentShow?.start_time || '00:00' }} - {{ currentShow?.end_time || '00:00' }}
                </div>
              </div>

              <!-- Listen Button -->
              <button
                @click="togglePlayPause"
                :disabled="isLoading"
                :class="[
                  'w-full px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center space-x-2',
                  isPlaying
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-[#F8CB00] hover:bg-yellow-500 text-black',
                ]"
              >
                <Volume2 v-if="isPlaying" :size="16" />
                <Play v-else :size="16" />
                <span>{{ isPlaying ? 'Live Now' : 'Tune In' }}</span>
              </button>

              <!-- Today's Schedule -->
              <div class="border-t pt-6">
                <h4 class="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Today's Schedule</h4>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                  <div
                    v-for="(session, index) in getTodaySchedule().slice(0, 6)"
                    :key="index"
                    :class="[
                      'flex items-center justify-between p-3 rounded-lg transition-all',
                      isCurrentSession(session) ? 'bg-yellow-50 border-l-4 border-[#F8CB00]' : 'hover:bg-gray-50',
                    ]"
                  >
                    <div class="flex-1">
                      <div :class="isCurrentSession(session) ? 'text-gray-900 font-semibold' : 'text-gray-700'" class="text-sm">
                        {{ session.program?.title || 'Live Show' }}
                      </div>
                      <div class="text-xs text-gray-500">{{ getSessionHosts(session) }}</div>
                    </div>
                    <div class="text-xs font-mono text-gray-500">
                      {{ session.start_time }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Carousel Indicators -->
        <div v-if="carouselItems && carouselItems.length > 1" class="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div class="flex items-center space-x-2">
            <button
              v-for="(slide, index) in carouselItems"
              :key="slide?.id || index"
              @click="setCurrentSlide(index)"
              :class="[
                'transition-all rounded-full',
                index === currentSlide ? 'w-8 h-2 bg-[#F8CB00]' : 'w-2 h-2 bg-white/50 hover:bg-white/80',
              ]"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Frequencies Section -->
    <div class="bg-white border-t">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div v-scroll-reveal="{ animation: 'fade-up', delay: 0 }" class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Broadcasting Across Uganda</h2>
          <p class="text-gray-600 mt-2">Tune in to your nearest frequency</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          <div
            v-for="(freq, index) in frequencies"
            :key="index"
            class="text-center p-6 rounded-xl border border-gray-200 hover:border-[#F8CB00] hover:shadow-md transition-all group"
          >
            <div class="text-3xl font-bold text-gray-900 group-hover:text-[#F8CB00] transition-colors">
              {{ freq.freq }}
            </div>
            <div class="text-sm text-gray-500 mt-1">{{ freq.location }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Play, Volume2, Clock, ExternalLink, ChevronRight } from "lucide-vue-next";

const store = useStore();
const router = useRouter();

const currentSlide = ref(0);
const carouselTimer = ref(null);
const windowWidth = ref(window.innerWidth);

const isPlaying = computed(() => store.getters.isPlaying);
const isLoading = computed(() => store.getters.isLoading);
const currentStation = computed(() => store.getters.station);
const adverts = computed(() => store.getters.adverts?.data || []);
const newsItems = computed(() => store.getters.breakingnews?.data || []);
const isMobile = computed(() => windowWidth.value < 640);

const frequencies = [
  { freq: "91.3", location: "Kampala" },
  { freq: "90.9", location: "Mbale" },
  { freq: "88.7", location: "Mbarara" },
  { freq: "89.4", location: "Fort Portal" },
  { freq: "96.9", location: "Gulu" },
  { freq: "92.7", location: "Arua" },
];

const todaySchedule = computed(() => {
  if (!currentStation.value?.schedule?.sessions) return [];
  const today = getCurrentDay();
  return currentStation.value.schedule.sessions[today] || [];
});

const getTodaySchedule = () => {
  if (!currentStation.value?.schedule?.sessions) return [];
  const today = getCurrentDay();
  return currentStation.value.schedule.sessions[today] || [];
};

const currentShow = computed(() => {
  const currentTime = getCurrentTime();
  return todaySchedule.value.find((show) =>
    isTimeBetween(currentTime, show.start_time, show.end_time)
  );
});

const carouselItems = computed(() => {
  const items = [];

  if (adverts.value && Array.isArray(adverts.value)) {
    adverts.value.forEach((advert) => {
      if (advert) {
        items.push({ ...advert, type: "advert" });
      }
    });
  }

  if (newsItems.value && Array.isArray(newsItems.value)) {
    newsItems.value.forEach((news) => {
      if (news && news.status && news.state) {
        items.push({ ...news, type: "news" });
      }
    });
  }

  if (items.length === 0) {
    return [
      {
        id: "fallback",
        title: "Capital FM 91.3",
        description: "Uganda's Premier Radio Station - Fresh Hits, Breaking News & Quality Entertainment",
        type: "default",
      },
    ];
  }

  return items;
});

const currentSlideData = computed(() => {
  if (!carouselItems.value || carouselItems.value.length === 0) return null;
  return carouselItems.value[currentSlide.value] || null;
});

const getCurrentSessionHosts = (session) => {
  if (!session?.program?.hosts) return "Live Presenters";
  const sessionHostIds = session.hosts || [];
  const hosts = session.program.hosts.filter((host) => sessionHostIds.includes(host.id));
  return hosts.length > 0 ? hosts.map((h) => h.name).join(" & ") : "Live Presenters";
};

const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
};

const isTimeBetween = (currentTime, startTime, endTime) => {
  const current = currentTime.replace(":", "");
  const start = startTime.replace(":", "");
  const end = endTime.replace(":", "");
  if (end < start) return current >= start || current <= end;
  return current >= start && current <= end;
};

const getCurrentDay = () => {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return days[new Date().getDay()];
};

const isCurrentSession = (session) => {
  const now = getCurrentTime();
  return isTimeBetween(now, session.start_time, session.end_time);
};

const getSessionHosts = (session) => {
  if (!session?.program?.hosts) return "Live Presenters";
  const sessionHostIds = session.hosts || [];
  const hosts = session.program.hosts.filter((host) => sessionHostIds.includes(host.id));
  return hosts.length > 0 ? hosts.map((h) => h.name).join(" & ") : "Live Presenters";
};

const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const togglePlayPause = async () => {
  try {
    await store.dispatch("togglePlayPause");
  } catch (err) {
    console.error("Failed to toggle playback:", err);
  }
};

const handleAdvertClick = () => {
  if (currentSlideData.value?.target_url) {
    if (currentSlideData.value.id) {
      store.dispatch("trackAdvertClick", currentSlideData.value.id);
    }
    window.open(currentSlideData.value.target_url, "_blank");
  }
};

const handleDetailsClick = (slideData) => {
  router.push({ name: "news_details", params: { id: slideData.slug } });
};

const setCurrentSlide = (index) => {
  if (!carouselItems.value || index >= carouselItems.value.length) return;
  currentSlide.value = index;
  resetCarouselTimer();
};

const startCarouselTimer = () => {
  if (!carouselItems.value || carouselItems.value.length <= 1) return;
  carouselTimer.value = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % carouselItems.value.length;
  }, 7000);
};

const stopCarouselTimer = () => {
  if (carouselTimer.value) {
    clearInterval(carouselTimer.value);
    carouselTimer.value = null;
  }
};

const resetCarouselTimer = () => {
  stopCarouselTimer();
  startCarouselTimer();
};

onMounted(() => {
  if (carouselItems.value && carouselItems.value.length > 1) {
    startCarouselTimer();
  }
  window.addEventListener('resize', () => {
    windowWidth.value = window.innerWidth;
  });
});

onUnmounted(() => {
  stopCarouselTimer();
  window.removeEventListener('resize', () => {
    windowWidth.value = window.innerWidth;
  });
});
</script>

<style scoped>
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #F8CB00;
  border-radius: 4px;
}
</style>
