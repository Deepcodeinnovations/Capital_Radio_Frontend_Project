<template>
  <section class="relative min-h-screen overflow-hidden" ref="sectionRef">
    <!-- Fixed Background Image - Only for this section -->
    <div class="absolute inset-0 z-0">
      <!-- White overlay for light theme -->
      <div class="absolute inset-0 bg-white/95"></div>
    </div>

    <!-- Floating background elements -->
    <div class="absolute inset-0 overflow-hidden opacity-10 pointer-events-none z-10">
      <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-500 rounded-full blur-2xl animate-float"></div>
      <div class="absolute bottom-1/3 right-1/4 w-40 h-40 bg-purple-600 rounded-full blur-3xl animate-float" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/2 w-24 h-24 bg-pink-400 rounded-full blur-xl animate-pulse-slow"></div>
    </div>
    
    <div class="relative z-20 py-20 min-h-screen flex items-center">
      <div class="container mx-auto px-4">
        <!-- Section Header -->
        <div class="mb-16 text-center animate__animated" :class="{'animate__fadeInDown': isVisible}">
          <div class="inline-flex items-center justify-center mb-6">
            <span class="h-px w-12 bg-pink-500"></span>
            <span class="mx-4 text-gray-800 font-bold tracking-wider text-sm uppercase">The Station</span>
            <span class="h-px w-12 bg-pink-500"></span>
          </div>
          <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            About <span class="text-pink-500">KIIS 100.9</span>
          </h2>
          <p class="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Uganda's hottest music station bringing you the freshest hits and contemporary music since 2022
          </p>
        </div>
        
        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          <!-- Left Content -->
          <div class="animate__animated flex flex-col justify-center" :class="{'animate__fadeInLeft': isVisible}" style="animation-duration: 1.2s;">
            <div class="space-y-8">
              <div>
                <h3 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center">
                  <span class="animate__animated" :class="{'animate__fadeIn': isVisible}" style="animation-delay: 0.5s;">Our Story</span>
                  <div class="ml-4 flex-1 h-px bg-pink-500 animate__animated" :class="{'animate__fadeInLeft': isVisible}" style="animation-delay: 0.7s;"></div>
                </h3>
                
                <div class="space-y-6 text-gray-700 leading-relaxed text-lg">
                  <p class="animate__animated" :class="{'animate__fadeIn': isVisible}" style="animation-delay: 0.6s;">
                    Launched on August 29th, 2022, KIIS 100.9 FM was born from extensive research to ensure Uganda's youth get the entertainment they deserve. The station was launched on 29th August 2022 by media mogul William Pike, targeting the urban youth market.
                  </p>
                  <p class="animate__animated" :class="{'animate__fadeIn': isVisible}" style="animation-delay: 0.8s;">
                    KIIS 100.9 is a Contemporary Hit Radio Station that plays the HOTTEST MUSIC. Less Talk, More Music, No Clutter. This philosophy drives everything we do, ensuring our listeners get maximum music with minimal interruption.
                  </p>
                  <p class="animate__animated" :class="{'animate__fadeIn': isVisible}" style="animation-delay: 1s;">
                    Located at Plot 1A Cooper Road, Kisementi, Kampala, Uganda, we broadcast on 100.9 FM across Kampala and surrounding areas, serving as the ultimate destination for contemporary hits and urban music.
                  </p>
                </div>
              </div>
              
              <!-- Stats Grid -->
              <div class="grid grid-cols-3 gap-6">
                <div class="relative group/stat">
                  <div class="absolute -inset-1 bg-pink-500 rounded-xl blur opacity-0 group-hover/stat:opacity-20 transition duration-300"></div>
                  <div class="relative bg-white/60 backdrop-blur-sm p-6 rounded-xl text-center border-2 border-pink-100 hover:border-pink-300 transition-all duration-300 transform hover:scale-105">
                    <span class="block text-3xl font-bold text-pink-500 mb-2 group-hover/stat:animate-pulse">2+</span>
                    <span class="text-sm text-gray-600 font-medium">Years</span>
                  </div>
                </div>
                
                <div class="relative group/stat">
                  <div class="absolute -inset-1 bg-purple-600 rounded-xl blur opacity-0 group-hover/stat:opacity-20 transition duration-300"></div>
                  <div class="relative bg-white/60 backdrop-blur-sm p-6 rounded-xl text-center border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 transform hover:scale-105">
                    <span class="block text-3xl font-bold text-purple-600 mb-2 group-hover/stat:animate-pulse">100K+</span>
                    <span class="text-sm text-gray-600 font-medium">Listeners</span>
                  </div>
                </div>
                
                <div class="relative group/stat">
                  <div class="absolute -inset-1 bg-pink-500 rounded-xl blur opacity-0 group-hover/stat:opacity-20 transition duration-300"></div>
                  <div class="relative bg-white/60 backdrop-blur-sm p-6 rounded-xl text-center border-2 border-pink-100 hover:border-pink-300 transition-all duration-300 transform hover:scale-105">
                    <span class="block text-3xl font-bold text-pink-500 mb-2 group-hover/stat:animate-pulse">24/7</span>
                    <span class="text-sm text-gray-600 font-medium">Live</span>
                  </div>
                </div>
              </div>
              
              <!-- Mission Statement -->
              <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-pink-100 hover:border-pink-300 transition-all duration-300">
                <h4 class="text-xl font-bold text-gray-900 mb-4 text-center">Our Mission</h4>
                <p class="text-gray-700 text-center leading-relaxed">
                  Hot Hits For Kampala - We are committed to delivering the freshest contemporary hits, supporting emerging artists, and creating a vibrant music community for Uganda's urban youth.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Right Image - Height matches left content -->
          <div class="animate__animated" :class="{'animate__fadeInRight': isVisible}" style="animation-duration: 1.2s;">
            <div class="relative group h-full">
              <!-- Decorative elements -->
              <div class="absolute -inset-4 bg-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              
              <!-- Main image container -->
              <div class="relative bg-white/60 rounded-2xl overflow-hidden border-2 border-pink-200 h-full">
                <div class="h-full overflow-hidden relative">
                  <img 
                    src="https://i.ytimg.com/vi/nZHLYASeOkM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCRxL6ULdAEw2OpAjWLnAm7DEvf1A" 
                    alt="KIIS 100.9 FM Radio Station" 
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  <!-- Station Info Overlay -->
                  <div class="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-6">
                    <div class="space-y-2">
                      <h5 class="text-lg font-bold text-pink-400">KIIS 100.9 FM</h5>
                      <p class="text-sm text-gray-300">Contemporary Hit Radio</p>
                      <div class="flex items-center gap-4 text-xs text-gray-400">
                        <span>📍 Kisementi, Kampala</span>
                        <span>📻 100.9 FM</span>
                        <span>🎵 Hot Hits</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Fun Facts -->
              <div class="absolute -bottom-6 -right-6 bg-pink-500 text-white p-4 rounded-xl shadow-lg">
                <div class="text-center">
                  <div class="text-2xl font-bold">100.9</div>
                  <div class="text-xs">FM FREQUENCY</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Additional Info Section -->
        <div class="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-pink-100 hover:border-pink-300 transition-all duration-300 text-center">
            <div class="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Radio class="w-6 h-6 text-pink-500" />
            </div>
            <h5 class="font-bold text-gray-900 mb-2">Contemporary Hits</h5>
            <p class="text-sm text-gray-600">Latest and hottest music from around the world</p>
          </div>
          
          <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 text-center">
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users class="w-6 h-6 text-purple-600" />
            </div>
            <h5 class="font-bold text-gray-900 mb-2">Urban Youth</h5>
            <p class="text-sm text-gray-600">Targeting Uganda's dynamic urban youth market</p>
          </div>
          
          <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-pink-100 hover:border-pink-300 transition-all duration-300 text-center">
            <div class="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Music class="w-6 h-6 text-pink-500" />
            </div>
            <h5 class="font-bold text-gray-900 mb-2">Less Talk, More Music</h5>
            <p class="text-sm text-gray-600">Maximum music with minimal interruption</p>
          </div>
          
          <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 text-center">
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin class="w-6 h-6 text-purple-600" />
            </div>
            <h5 class="font-bold text-gray-900 mb-2">Kampala Based</h5>
            <p class="text-sm text-gray-600">Broadcasting from the heart of Uganda's capital</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Radio, Users, Music, MapPin } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted } from 'vue';

const isVisible = ref(false);
const sectionRef = ref(null);

// Scroll-based animations
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });
  
  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
  
  onUnmounted(() => {
    if (sectionRef.value) {
      observer.unobserve(sectionRef.value);
    }
  });
});
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Smooth transitions */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>