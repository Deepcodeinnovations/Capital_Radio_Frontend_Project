<template>
  <div class="relative overflow-hidden">
    <!-- Main Hero Section -->
    <div class="relative mt-6">
      <!-- Background Carousel -->
      <div class="absolute inset-0">
        <div
          v-for="(slide, index) in carouselItems"
          :key="slide?.id || index"
          :class="[
            'absolute inset-0 transition-all duration-1000 ease-in-out',
            index === currentSlide
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-110',
          ]"
        >
          <!-- Background Image -->
          <div class="absolute inset-0">
            <img
              :src="
                slide?.image_url ||
                slide?.featured_image_url ||
                'https://images.unsplash.com/photo-1538505135222-6238e66e7acc?w=2000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fGJlYXQlMkMlMjBtdXNpY3xlbnwwfHwwfHx8MA%3D%3D'
              "
              :alt="slide?.title || 'Background'"
              class="w-full h-full object-cover object-center"
            />
            <!-- Minimal overlay for text readability -->
            <div class="absolute inset-0 bg-black/70"></div>
          </div>
        </div>
      </div>

      <!-- Hero Content - Centered -->
      <div class="relative z-30 flex items-center justify-center min-h-[98vh]">
        <div class="container mx-auto px-4 md:px-6">
          <div class="max-w-4xl mx-auto text-center">
            <!-- Content Badge -->
            <div
              class="inline-flex items-center space-x-2 bg-red-600/90 backdrop-blur-md px-3 py-1.5 border border-red-500 mb-4"
            >
              <div class="w-1.5 h-1.5 bg-white animate-pulse"></div>
              <span
                class="text-white font-medium text-xs uppercase tracking-wider"
              >
                {{
                  currentSlideData?.type === "advert"
                    ? "Sponsored"
                    : currentSlideData?.type === "news"
                    ? "Breaking News"
                    : "Live Radio"
                }}
              </span>
            </div>

            <!-- Main Headline -->
            <h1
              class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-snug tracking-tight font-sans"
            >
              <span
                class="bg-gradient-to-r from-red-500 via-pink-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-sm"
              >
                {{
                  truncateText(currentSlideData?.title || "Beat FM 96.3", 60)
                }}
              </span>
            </h1>

            <!-- Subtitle -->
            <p
              class="text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-6 leading-relaxed max-w-2xl mx-auto"
            >
              {{
                truncateText(
                  currentSlideData?.description ??
                    currentSlideData?.excerpt ??
                    "Ekintabuli Ky'Omuziki - Uganda's Hottest Beats & Entertainment",
                  180
                )
              }}
            </p>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <!-- Primary Action -->
              <button
                @click="togglePlayPause"
                :disabled="isLoading"
                class="relative group overflow-hidden"
              >
                <div
                  class="absolute -inset-0.5 bg-red-600 blur opacity-60 group-hover:opacity-80 transition duration-300 z-10"
                ></div>
                <div
                  class="relative bg-red-600 px-6 py-3 text-white font-bold flex items-center justify-center space-x-2 transition-all duration-300 z-10"
                >
                  <div
                    v-if="isLoading"
                    class="w-4 h-4 border-2 border-white border-t-transparent animate-spin z-10"
                  ></div>
                  <Volume2
                    v-else-if="isPlaying"
                    :size="18"
                    class="animate-bounce z-10"
                  />
                  <Play v-else :size="18" class="z-10" />
                  <span class="tracking-wide text-sm z-10" v-if="isLoading"
                    >CONNECTING</span
                  >
                  <span class="tracking-wide text-sm z-10" v-else-if="isPlaying"
                    >LISTENING LIVE</span
                  >
                  <span
                    class="tracking-wide text-sm z-10 hover:text-black"
                    v-else
                    >TUNE IN NOW</span
                  >
                  <!-- Background fill animation -->
                  <span
                    class="absolute inset-0 bg-red-300 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0"
                  ></span>
                </div>
              </button>

              <!-- Secondary Action -->
              <button
                v-if="
                  currentSlideData?.type === 'advert' &&
                  currentSlideData?.target_url
                "
                @click="handleAdvertClick"
                class="group flex items-center justify-center space-x-2 px-6 py-3 font-bold text-sm transition-all duration-500 transform hover:scale-105 shadow-xl backdrop-blur-md border-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <ExternalLink
                  :size="18"
                  class="group-hover:scale-110 transition-transform duration-300"
                />
                <span>{{
                  currentSlideData?.button_title || "LEARN MORE"
                }}</span>
              </button>
              <button
                v-else
                @click="handleDetailsClick(currentSlideData)"
                class="group flex items-center justify-center space-x-2 px-6 py-3 font-bold text-sm transition-all duration-500 transform hover:scale-105 shadow-xl backdrop-blur-md border-2 bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                <ExternalLink
                  :size="18"
                  class="group-hover:scale-110 transition-transform duration-300"
                />
                <span>Read Details</span>
              </button>
            </div>

            <!-- Stats Section -->
            <div class="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
              <div class="text-center">
                <div class="text-2xl md:text-3xl font-bold text-white mb-1">
                  96.3
                </div>
                <div class="text-xs md:text-sm text-white/80">
                  MHz Frequency
                </div>
              </div>
              <div class="text-center">
                <div class="text-2xl md:text-3xl font-bold text-white mb-1">
                  24/7
                </div>
                <div class="text-xs md:text-sm text-white/80">Broadcasting</div>
              </div>
              <div class="text-center">
                <div class="text-2xl md:text-3xl font-bold text-white mb-1">
                  {{ currentStation?.listeners || "1M" }}+
                </div>
                <div class="text-xs md:text-sm text-white/80">Listeners</div>
              </div>
            </div>

            <!-- Frequency Grid for Different Districts -->
            <!-- Frequency Grid for Different Districts -->
            <div class="max-w-3xl mx-auto mb-12">
              <h3
                class="text-white font-bold text-lg md:text-xl mb-4 text-center"
              >
                Broadcasting Across Uganda
              </h3>
              <div class="flex justify-center">
                <div class="grid grid-cols-2 gap-3">
                  <div
                    v-for="(freq, index) in frequencies"
                    :key="index"
                    class="group relative"
                  >
                    <div
                      class="absolute -inset-1 bg-white group-hover:opacity-100 transition-opacity duration-300"
                    ></div>
                    <div
                      class="relative bg-white/20 p-3 transition-all duration-300 transform hover:scale-105"
                    >
                      <div class="text-lg font-bold text-red-600 mb-1">
                        {{ freq.freq }}
                      </div>
                      <div class="text-xs text-red-600 font-medium">
                        {{ freq.location }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Carousel Controls -->
      <!-- Carousel Controls - Left and Right -->
      <div
        v-if="carouselItems && carouselItems.length > 1"
        class="absolute inset-y-0 left-0 right-0 z-30 pointer-events-none"
      >
        <!-- Left Control -->
        <div
          class="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-auto"
        >
          <button
            @click="prevSlide"
            class="p-3 bg-red-600/80 backdrop-blur-md text-white hover:bg-red-600 transition-all duration-300 rounded-full border border-red-500/50 shadow-lg"
          >
            <ChevronLeft :size="20" />
          </button>
        </div>

        <!-- Right Control -->
        <div
          class="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-auto"
        >
          <button
            @click="nextSlide"
            class="p-3 bg-red-600/80 backdrop-blur-md text-white hover:bg-red-600 transition-all duration-300 rounded-full border border-red-500/50 shadow-lg"
          >
            <ChevronRight :size="20" />
          </button>
        </div>

        <!-- Dot Indicators - Bottom Center -->
        <div
          class="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto"
        >
          <div
            class="flex space-x-2 bg-red-600/80 backdrop-blur-md px-4 py-2 rounded-full border border-red-500/50"
          >
            <button
              v-for="(slide, index) in carouselItems"
              :key="slide?.id || index"
              @click="setCurrentSlide(index)"
              :class="[
                'w-2 h-2 rounded-full transition-all duration-300',
                index === currentSlide
                  ? 'bg-white w-6'
                  : 'bg-white/50 hover:bg-white/75',
              ]"
            />
          </div>
        </div>
      </div>

      <!-- Bottom Wave Divider -->
      <div
        class="absolute bottom-0 left-0 w-full overflow-hidden"
        style="transform: translateY(1px)"
      >
        <svg
          class="w-full h-auto"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,60 C400,120 800,0 1200,60 L1200,120 L0,120 Z"
            fill="white"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  Volume2,
  ExternalLink,
} from "lucide-vue-next";

const store = useStore();
const router = useRouter();

// State
const currentSlide = ref(0);
const carouselTimer = ref(null);

// Computed
const isPlaying = computed(() => store.getters.isPlaying);
const isLoading = computed(() => store.getters.isLoading);
const currentStation = computed(() => store.getters.station);
const adverts = computed(() => store.getters.adverts?.data || []);
const newsItems = computed(() => store.getters.breakingnews?.data || []);

// Beat FM Frequency data
const frequencies = [
  { freq: "96.3", location: "Kampala" },
  { freq: "91.0", location: "Masaka" },
];

// Carousel items
const carouselItems = computed(() => {
  const items = [];

  if (adverts.value && Array.isArray(adverts.value)) {
    adverts.value.forEach((advert) => {
      if (advert) {
        items.push({
          ...advert,
          type: "advert",
          image: advert.image_url,
        });
      }
    });
  }

  if (newsItems.value && Array.isArray(newsItems.value)) {
    newsItems.value.forEach((news) => {
      if (news && news.status && news.state) {
        items.push({
          ...news,
          type: "news",
          image: news.image_url || "/api/placeholder/1920/1080",
        });
      }
    });
  }

  if (items.length === 0) {
    return [
      {
        id: "fallback",
        title: "Beat FM 96.3",
        description:
          "Ekintabuli Ky'Omuziki - Uganda's Hottest Beats & Entertainment",
        image: "/api/placeholder/1920/1080",
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

// Helper methods
const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const togglePlayPause = async () => {
  try {
    await store.dispatch("togglePlayPause");
  } catch (err) {
    console.error("Failed to toggle playbook:", err);
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
  let id = slideData.slug;
  router.push({ name: "news_details", params: { id: id } });
  console.log(slideData);
};

const nextSlide = () => {
  if (!carouselItems.value || carouselItems.value.length === 0) return;
  currentSlide.value = (currentSlide.value + 1) % carouselItems.value.length;
  resetCarouselTimer();
};

const prevSlide = () => {
  if (!carouselItems.value || carouselItems.value.length === 0) return;
  currentSlide.value =
    (currentSlide.value - 1 + carouselItems.value.length) %
    carouselItems.value.length;
  resetCarouselTimer();
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
});

onUnmounted(() => {
  stopCarouselTimer();
});
</script>

<style scoped>
/* Ensure smooth transitions */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
