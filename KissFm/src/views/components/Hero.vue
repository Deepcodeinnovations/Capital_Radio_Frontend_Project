<template>
  <div class="relative overflow-hidden">
    <!-- Main Hero Section -->
    <div class="relative">
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
                'https://images.unsplash.com/photo-1747494750675-d1aecb8672b3?w=1500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA4fHxiZWF0JTJDJTIwbXVzaWN8ZW58MHx8MHx8fDA%3D'
              "
              :alt="slide?.title || 'Background'"
              class="w-full h-full object-cover"
            />
            <!-- Enhanced Dark Overlay for Better Text Readability -->
            <div class="absolute inset-0 bg-black/50"></div>
          </div>
        </div>
      </div>

      <!-- Hero Content -->
      <div
        class="relative z-30 flex items-center min-h-screen py-20 md:py-24"
      >
        <div
          class="container mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div class="max-w-5xl mx-auto text-center">
              <!-- Content Badge -->
              <div
                class="inline-flex items-center rounded-full space-x-2 bg-white/20 backdrop-blur-md px-4 md:px-5 py-2.5 border border-white/30 mb-5 md:mb-6"
              >
                <div
                  class="w-2.5 h-2.5 bg-capital-pink rounded-full animate-pulse shadow-lg"
                ></div>
                <span
                  class="text-white font-semibold text-sm md:text-base uppercase tracking-wider"
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
                class="font-poppins text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight text-white drop-shadow-2xl"
              >
                {{
                  truncateText(currentSlideData?.title || "KIIS 100.9", 60)
                }}
              </h1>

              <!-- Subtitle -->
              <p
                class="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 md:mb-10 leading-relaxed max-w-3xl mx-auto"
              >
                {{
                  truncateText(
                    currentSlideData?.description ??
                      currentSlideData?.excerpt ??
                      "Uganda's Premier Hit Station - Fresh Hits, Breaking News & Entertainment",
                    180
                  )
                }}
              </p>

              <!-- Action Buttons -->
              <div
                class="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <!-- Primary Action -->
                <button
                  @click="togglePlayPause"
                  :disabled="isLoading"
                  class="bg-capital-pink hover:bg-capital-pink-dark disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-xl text-white font-bold flex items-center justify-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 min-w-[200px]"
                >
                    <div
                      v-if="isLoading"
                      class="w-5 h-5 border-3 rounded-full border-white/30 border-t-white animate-spin"
                    ></div>
                    <Volume2
                      v-else-if="isPlaying"
                      :size="20"
                      class="animate-bounce"
                    />
                    <Play v-else :size="20" />
                    <span
                      class="tracking-wide text-base font-black"
                      v-if="isLoading"
                      >CONNECTING</span
                    >
                    <span
                      class="tracking-wide text-base font-black"
                      v-else-if="isPlaying"
                      >LISTENING LIVE</span
                    >
                    <span class="tracking-wide text-base font-black" v-else
                      >TUNE IN NOW</span
                    >
                </button>

                <!-- Secondary Action -->
                <button
                  v-if="
                    currentSlideData?.type === 'advert' &&
                    currentSlideData?.target_url
                  "
                  @click="handleAdvertClick"
                  class="group rounded-xl flex items-center justify-center space-x-2 px-6 md:px-8 py-3.5 md:py-4 font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-md border-2 bg-white/10 border-white/40 text-white hover:bg-white/20 hover:border-white/60"
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
                  class="group rounded-xl flex items-center justify-center space-x-2 px-6 md:px-8 py-3.5 md:py-4 font-semibold text-base transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-md border-2 bg-white/10 border-white/40 text-white hover:bg-white/20 hover:border-white/60"
                >
                  <ExternalLink
                    :size="18"
                    class="group-hover:scale-110 transition-transform duration-300"
                  />
                  <span>Read Details</span>
                </button>
              </div>
          </div>
        </div>
      </div>

      <!-- Left Carousel Control -->
      <div
        v-if="carouselItems && carouselItems.length > 1"
        class="absolute left-2 sm:left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-30"
      >
        <button
          @click="prevSlide"
          class="p-3 md:p-4 bg-black/30 backdrop-blur-md text-white hover:bg-capital-pink/80 transition-all duration-300 rounded-full border border-white/20 shadow-lg group"
        >
          <ChevronLeft
            :size="20"
            class="md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300"
          />
        </button>
      </div>

      <!-- Right Carousel Control -->
      <div
        v-if="carouselItems && carouselItems.length > 1"
        class="absolute right-2 sm:right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-30"
      >
        <button
          @click="nextSlide"
          class="p-3 md:p-4 bg-black/30 backdrop-blur-md text-white hover:bg-capital-pink/80 transition-all duration-300 rounded-full border border-white/20 shadow-lg group"
        >
          <ChevronRight
            :size="20"
            class="md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300"
          />
        </button>
      </div>

      <!-- Carousel Dots - Bottom Center -->
      <div
        v-if="carouselItems && carouselItems.length > 1"
        class="absolute bottom-6 sm:bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 z-30"
      >
        <div
          class="flex space-x-2 bg-black/20 backdrop-blur-md px-3 py-2 rounded-full border border-white/20 shadow-lg"
        >
          <button
            v-for="(slide, index) in carouselItems"
            :key="slide?.id || index"
            @click="setCurrentSlide(index)"
            :class="[
              'h-2 rounded-full transition-all duration-300',
              index === currentSlide
                ? 'bg-capital-pink w-6 shadow-lg'
                : 'bg-white/50 hover:bg-white/75 w-2',
            ]"
          />
        </div>
      </div>

      <!-- Simple Bottom Border -->
      <div class="absolute bottom-0 left-0 w-full overflow-hidden z-20">
        <svg
          class="w-full h-auto"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,60 C200,90 400,30 600,60 C800,90 1000,30 1200,60 L1200,120 L0,120 Z"
            fill="white"
          />
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
  Pause,
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
        title: "KIIS 100.9",
        description:
          "Uganda's Premier Hit Station - Fresh Hits, Breaking News & Entertainment",
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
/* Floating animations for love elements */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 1;
  }
}

@keyframes float-delayed {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-15px) rotate(-180deg);
    opacity: 0.8;
  }
}

@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0px) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-25px) scale(1.2);
    opacity: 1;
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 5s ease-in-out infinite 1s;
}

.animate-float-slow {
  animation: float-slow 6s ease-in-out infinite 2s;
}

/* Enhanced text shadows for better readability */
.drop-shadow-lg {
  filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04))
    drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
}

/* Smooth transitions */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Enhanced backdrop blur for better glass effect */
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
}

/* Custom gradient text effects */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}
</style>
