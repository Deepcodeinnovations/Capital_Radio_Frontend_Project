<template>
  <!-- Hero Section -->
  <div class="relative bg-black border-b border-gray-800 overflow-hidden" style="margin-top: -5rem !important; padding-top: 5rem;">
    <!-- Background Image -->
    <div class="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
        alt="About Capital FM"
        class="w-full h-full object-cover opacity-40"
      />
      <div class="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center max-w-3xl mx-auto">
        <div class="inline-flex items-center justify-center mb-4">
          <Radio class="text-[#F8CB00] mr-2" :size="24" />
          <span class="text-[#F8CB00] font-semibold uppercase tracking-wider text-sm">Our Story</span>
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold text-white mb-4">
          About Capital FM
        </h1>
        <p class="text-lg text-gray-300">
          Uganda's premier radio station, delivering fresh hits and quality entertainment since 1993
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
        <div class="text-center">
          <div class="text-3xl font-bold text-[#F8CB00]">30+</div>
          <div class="text-sm text-gray-400 mt-1">Years On Air</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-[#F8CB00]">1M+</div>
          <div class="text-sm text-gray-400 mt-1">Daily Listeners</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-[#F8CB00]">91.3</div>
          <div class="text-sm text-gray-400 mt-1">FM Frequency</div>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold text-[#F8CB00]">24/7</div>
          <div class="text-sm text-gray-400 mt-1">Broadcasting</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Content Sections -->
  <div class="bg-white shows-content">
    <AboutPreview />
    <OurTeam />
    <OnAirSection />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import {
  Search,
  Calendar,
  ChevronDown,
  X,
  Play,
  Volume2,
  Star,
  Radio,
  Clock,
  Timer,
  Headphones,
  Heart,
  Download,
  Share2,
} from "lucide-vue-next";
import { useStore } from "vuex";
import AboutPreview from "./components/AboutPreview.vue";
import OurTeam from "./components/OurTeam.vue";
import OnAirSection from "./components/OnAirSection.vue";
const isPlaying = computed(() => store.getters.isPlaying);
const isLoading = computed(() => store.getters.isLoading);
const store = useStore();
const togglePlayPause = async () => {
  try {
    await store.dispatch("togglePlayPause");
  } catch (err) {
    console.error("Failed to toggle playback:", err);
  }
};

const scrollToShows = () => {
  document.getElementById("shows-content").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};
</script>
