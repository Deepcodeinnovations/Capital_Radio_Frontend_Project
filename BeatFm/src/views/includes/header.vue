<template>
  <div>
    <!-- Enhanced Navigation Header -->
    <header
      class="fixed top-0 left-0 right-0 z-40 bg-red-600 border-b-2 border-red-700 shadow-lg"
    >
      <div class="container mx-auto px-4 md:px-6">
        <div class="flex items-center justify-between h-20 md:h-24 lg:h-20">
          <!-- Logo Section -->
          <div class="flex items-center">
            <div
              class="h-12 w-32 sm:h-14 sm:w-36 md:h-16 md:w-40 lg:h-18 lg:w-48"
            >
              <img
                src="/logobeat.png"
                alt="Beat FM 96.3 Logo"
                class="w-full h-full object-contain"
              />
            </div>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden lg:flex items-center space-x-8">
            <router-link
              v-for="(item, index) in navItems"
              :key="index"
              :to="{ name: item.to }"
              :class="{ 'border-b-2 border-white ': $route.name === item.to }"
              class="text-white text-sm font-bold hover:text-white hover:bg-white/10 transition-all duration-300 pb-2 pt-2 px-3 tracking-wide uppercase"
            >
              {{ item.label }}
            </router-link>
          </nav>

          <!-- Right Controls -->
          <div class="flex items-center space-x-3 md:space-x-4">
            <!-- Desktop Listen Live Button -->
            <button
              @click="togglePlayPause"
              :disabled="isLoading"
              class="hidden sm:flex relative group overflow-hidden"
            >
              <div
                :class="[
                  'bg-white hover:bg-gray-100 px-4 md:px-6 py-2 md:py-3 text-black font-bold flex items-center space-x-2 transition-all duration-300 hover:scale-105 border-2 border-red-300 shadow-lg',
                  isLoading ? 'cursor-not-allowed opacity-75' : '',
                ]"
              >
                <div
                  v-if="isLoading"
                  class="w-4 h-4 border-2 border-black border-t-transparent animate-spin z-10"
                ></div>
                <Volume2
                  v-else-if="isPlaying"
                  :size="18"
                  class="animate-pulse text-red-400"
                />
                <Play v-else :size="18" class="text-red-400 z-10" />
                <span
                  class="tracking-wider text-sm md:text-base font-black uppercase z-10"
                  v-if="isLoading"
                  >CONNECTING</span
                >
                <span
                  class="tracking-wider text-sm md:text-base font-black uppercase z-10"
                  v-else-if="isPlaying"
                  >LIVE</span
                >
                <span
                  class="tracking-wider text-sm md:text-base font-black uppercase z-10"
                  v-else
                  >LISTEN</span
                >
                <!-- Background fill animation -->
                <span
                  class="absolute inset-0 bg-red-300 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0"
                ></span>
              </div>
            </button>

            <!-- Mobile Play Button -->
            <button
              @click="togglePlayPause"
              :disabled="isLoading"
              :class="[
                'sm:hidden p-2.5 border-2 transition-all duration-300 shadow-lg',
                isPlaying
                  ? 'bg-white border-black text-black'
                  : isLoading
                  ? 'bg-gray-300 border-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-white border-black text-black hover:bg-gray-100',
              ]"
            >
              <div
                v-if="isLoading"
                class="w-5 h-5 border-2 border-gray-600 border-t-transparent animate-spin"
              ></div>
              <Pause v-else-if="isPlaying" :size="20" />
              <Play v-else :size="20" />
            </button>

            <!-- Menu Toggle -->
            <button
              @click="toggleMenu"
              class="lg:hidden p-2.5 bg-white border-2 border-black text-black hover:bg-gray-100 transition-all duration-300 shadow-lg"
            >
              <X v-if="isOpen" :size="24" />
              <Menu v-else :size="24" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Full Screen Menu -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 bg-gradient-to-br from-red-900 via-black to-red-900"
    >
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div
        class="relative container mx-auto px-4 md:px-6 h-full flex items-center justify-center"
      >
        <button
          @click="toggleMenu"
          class="absolute top-4 md:top-6 right-4 md:right-6 p-3 bg-white border-2 border-black text-black hover:bg-gray-100 transition-all duration-300"
        >
          <X :size="24" />
        </button>

        <div class="text-center max-w-4xl mx-auto">
          <!-- Logo in Menu -->
          <div class="mb-8 md:mb-12">
            <div class="flex justify-center mb-6">
              <div class="h-20 w-48 md:h-24 md:w-56">
                <img
                  src="/logobeat.png"
                  alt="Beat FM 96.3 Logo"
                  class="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          <!-- Navigation Menu -->
          <nav class="mb-8 md:mb-12">
            <ul class="space-y-4">
              <li v-for="(item, index) in navItems" :key="index">
                <router-link
                  :to="{ name: item.to }"
                  @click="toggleMenu"
                  class="block py-4 px-6 text-xl md:text-2xl font-bold text-white hover:text-black hover:bg-white transition-all duration-300 border-2 border-white/40 hover:border-white tracking-wide uppercase"
                >
                  {{ item.label }}
                </router-link>
              </li>
            </ul>
          </nav>

          <!-- Live Button in Menu -->
          <div class="mb-8 md:mb-12">
            <button
              @click="togglePlayPause"
              :disabled="isLoading"
              :class="[
                'flex items-center justify-center space-x-4 mx-auto px-8 md:px-12 py-4 md:py-6 font-black text-lg md:text-xl transition-all duration-300 transform hover:scale-105 shadow-lg border-2 tracking-wider uppercase',
                isPlaying
                  ? 'bg-white text-black border-black'
                  : isLoading
                  ? 'bg-gray-300 text-gray-600 border-gray-400 cursor-not-allowed'
                  : 'bg-white text-black border-black hover:bg-gray-100',
              ]"
            >
              <div
                v-if="isLoading"
                class="w-6 h-6 border-2 border-current border-t-transparent animate-spin"
              ></div>
              <Volume2 v-else-if="isPlaying" :size="28" class="animate-pulse" />
              <Play v-else :size="28" />

              <span v-if="isLoading">CONNECTING...</span>
              <span v-else-if="isPlaying">ON AIR • LIVE</span>
              <span v-else>LISTEN LIVE</span>
            </button>
          </div>

          <!-- Social Media -->
          <div>
            <h6
              class="text-white font-bold mb-4 md:mb-6 text-base md:text-lg uppercase tracking-wider"
            >
              Follow Beat FM
            </h6>
            <div class="flex justify-center space-x-4 md:space-x-6">
              <a
                v-for="(social, index) in socialLinks"
                :key="index"
                :href="social.href"
                class="p-3 md:p-4 bg-white border-2 border-black text-black transition-all duration-300 transform hover:scale-110 hover:bg-gray-100"
              >
                <component :is="social.icon" :size="24" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import {
  Menu,
  X,
  Play,
  Pause,
  Volume2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-vue-next";

const store = useStore();
const route = useRoute();

// State
const isOpen = ref(false);

// Computed
const isPlaying = computed(() => store.getters.isPlaying);
const isLoading = computed(() => store.getters.isLoading);

// Navigation items
const navItems = [
  { label: "Home", to: "welcome" },
  { label: "Radio Shows", to: "radio_shows" },
  { label: "News", to: "news" },
  { label: "Events", to: "events" },
  { label: "Forums", to: "forums" },
  { label: "About", to: "about_us" },
];

// Social media links
const socialLinks = [
  { icon: Facebook, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Linkedin, href: "#" },
];

// Methods
const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const togglePlayPause = async () => {
  try {
    await store.dispatch("togglePlayPause");
  } catch (err) {
    console.error("Failed to toggle playback:", err);
  }
};
</script>

<style scoped>
/* Override rounded corners for brutalist design */
* {
  border-radius: 0 !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Ensure sharp geometric shapes */
button,
div,
a {
  border-radius: 0 !important;
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

/* Pulse animation */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
