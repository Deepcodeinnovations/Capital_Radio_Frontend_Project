<template>
  <!-- About Hero Section -->
  <section class="relative bg-white overflow-hidden" style="margin-top: 5rem !important;">
    <!-- Geometric Background Pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 left-0 w-full h-full">
        <div class="absolute top-20 left-20 w-40 h-40 bg-red-600 transform rotate-45"></div>
        <div class="absolute top-40 right-32 w-24 h-24 bg-black rounded-full"></div>
        <div class="absolute bottom-32 left-1/4 w-32 h-32 bg-red-600 rounded-full"></div>
        <div class="absolute bottom-20 right-20 w-20 h-20 bg-black transform rotate-45"></div>
        <div class="absolute top-1/2 left-1/2 w-16 h-16 bg-red-600 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
    </div>

    <!-- Hero Content -->
    <div class="relative z-10 min-h-screen flex items-center">
      <div class="container mx-auto px-6 mb-8">
        <div class="max-w-6xl mx-auto">
          
          <!-- Hero Text Section -->
          <div class="text-center mb-16">
      
            <!-- Main Title -->
            <h1 class="text-6xl md:text-8xl font-black text-black mb-8 leading-none">
              BEAT
              <span class="block text-red-600">FM</span>
            </h1>

            <!-- Frequency Display -->
            <div class="text-4xl md:text-6xl font-bold text-black/20 mb-8">
              96.3
            </div>

            <!-- Tagline -->
            <p class="text-2xl md:text-3xl text-black font-bold mb-6">
              Ekintabuli Ky'Omuziki
            </p>

            <!-- Description -->
            <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
              Uganda's premier music destination, delivering the hottest beats, freshest tracks, 
              and vibrant entertainment that keeps the nation dancing since 2005
            </p>

            <!-- Action Button -->
            <div class="mb-16">
              <button
                @click="togglePlayPause"
                :disabled="isLoading"
                class="bg-red-600 hover:bg-red-700 text-white font-bold px-12 py-4 rounded-none transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <div class="flex items-center space-x-3">
                  <div v-if="isLoading" class="w-5 h-5 border-2 rounded-full border-white border-t-transparent animate-spin"></div>
                  <Volume2 v-else-if="isPlaying" :size="20" class="animate-bounce" />
                  <Play v-else :size="20" />
                  <span class="tracking-widest" v-if="isLoading">CONNECTING</span>
                  <span class="tracking-widest" v-else-if="isPlaying">LIVE NOW</span>
                  <span class="tracking-widest" v-else>LISTEN LIVE</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div class="bg-white border-2 border-black p-6 text-center transform hover:scale-105 transition-transform">
              <div class="text-3xl font-black text-red-600 mb-2">18+</div>
              <div class="text-sm font-bold text-black uppercase tracking-wider">Years Strong</div>
            </div>
            <div class="bg-red-600 border-2 border-red-600 p-6 text-center transform hover:scale-105 transition-transform">
              <div class="text-3xl font-black text-white mb-2">2M+</div>
              <div class="text-sm font-bold text-white uppercase tracking-wider">Music Lovers</div>
            </div>
            <div class="bg-black border-2 border-black p-6 text-center transform hover:scale-105 transition-transform">
              <div class="text-3xl font-black text-white mb-2">96.3</div>
              <div class="text-sm font-bold text-white uppercase tracking-wider">Frequency</div>
            </div>
            <div class="bg-white border-2 border-red-600 p-6 text-center transform hover:scale-105 transition-transform">
              <div class="text-3xl font-black text-red-600 mb-2">24/7</div>
              <div class="text-sm font-bold text-red-600 uppercase tracking-wider">Non-Stop</div>
            </div>
          </div>

          <!-- Mission Statement -->
          <div class="bg-black text-white p-8 md:p-12 mb-16">
            <div class="max-w-4xl mx-auto text-center">
              <h2 class="text-3xl md:text-4xl font-black mb-6">OUR MISSION</h2>
              <p class="text-xl md:text-2xl leading-relaxed">
                To be Uganda's ultimate music destination, connecting communities through the power of beats, 
                celebrating local talent, and keeping the nation dancing to the rhythm of life.
              </p>
            </div>
          </div>

          <!-- Story Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <!-- Story Text -->
            <div>
              <h3 class="text-4xl md:text-5xl font-black text-black mb-8">
                OUR STORY
              </h3>
              
              <div class="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  Since 2005, Beat FM has been the heartbeat of Uganda's music scene. We started with a simple vision: 
                  to create a platform where music lovers could discover the freshest sounds, both local and international.
                </p>
                <p>
                  Today, we're proud to be at the forefront of Uganda's music revolution, championing emerging artists, 
                  breaking new sounds, and creating the soundtrack to millions of lives across the country.
                </p>
                <p>
                  From our studios in Kampala to listeners across Uganda, Beat FM continues to set the standard for 
                  music entertainment, staying true to our motto: "Ekintabuli Ky'Omuziki."
                </p>
              </div>

          
            </div>

            <!-- Story Image -->
            <div class="relative">
              <div class="bg-red-600 p-4">
                <img 
                  src="https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Beat FM Studio" 
                  class="w-full h-96 object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div class="absolute -bottom-4 -right-4 bg-black text-white p-4">
                <div class="text-center">
                  <div class="text-2xl font-black">EST.</div>
                  <div class="text-3xl font-black">2005</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation -->
          <div class="text-center pt-16">
            <button @click="scrollToMore" class="inline-flex items-center text-black hover:text-red-600 transition-colors">
              <span class="mr-2 text-lg font-bold tracking-widest">EXPLORE MORE</span>
              <div class="w-8 h-8 border-2 border-current rounded-full flex items-center justify-center">
                <ChevronDown :size="16" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Content Sections -->
  <div class="bg-gray-50" id="more-content">
    <OurTeam />
    <OnAirSection />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { 
  Search, Calendar, ChevronDown, X, Play, Volume2, Star, Radio, 
  Clock, Timer, Headphones, Heart, Download, Share2
} from 'lucide-vue-next';
import { useStore } from 'vuex';
import OurTeam from './components/OurTeam.vue';
import OnAirSection from './components/OnAirSection.vue';

const store = useStore();

const isPlaying = computed(() => store.getters.isPlaying);
const isLoading = computed(() => store.getters.isLoading);

const togglePlayPause = async () => {
  try {
    await store.dispatch('togglePlayPause');
  } catch (err) {
    console.error('Failed to toggle playback:', err);
  }
};

const scrollToMore = () => {
  document.getElementById('more-content').scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
};
</script>

<style scoped>
/* Custom animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Ensure sharp edges and bold design */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Override any rounded corners for this design */
.rounded-none {
  border-radius: 0 !important;
}
</style>