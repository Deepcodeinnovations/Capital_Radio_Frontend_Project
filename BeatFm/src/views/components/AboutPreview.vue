<template>
  <section class="relative min-h-screen overflow-hidden" ref="sectionRef">
    <!-- Fixed Background Image - Only for this section -->
    <div class="absolute inset-0 z-0">
      <!-- White overlay for light theme -->
      <div class="absolute inset-0 bg-white/95"></div>
      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/90"></div>
    </div>

    <!-- Floating background elements -->
    <div class="absolute inset-0 overflow-hidden opacity-5 pointer-events-none z-10">
      <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-red-600 rounded-full blur-2xl animate-float"></div>
      <div class="absolute bottom-1/3 right-1/4 w-40 h-40 bg-black rounded-full blur-3xl animate-float" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/2 w-24 h-24 bg-red-600 rounded-full blur-xl animate-pulse-slow"></div>
    </div>
    
    <div class="relative z-20 py-20 min-h-screen flex items-center">
      <div class="container mx-auto px-4">
        <!-- Section Header -->
        <div class="mb-16 text-center animate__animated" :class="{'animate__fadeInDown': isVisible}">
          <div class="inline-flex items-center justify-center mb-6">
            <span class="h-px w-12 bg-red-600"></span>
            <span class="mx-4 text-black font-bold tracking-wider text-sm uppercase">The Station</span>
            <span class="h-px w-12 bg-red-600"></span>
          </div>
          <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6">
            About <span class="text-red-600">Beat FM</span>
          </h2>
          <p class="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Uganda's premier music destination bringing you the hottest beats and freshest entertainment since 2005
          </p>
        </div>
        
        <!-- Hero Image Section -->
        <div class="mb-16 animate__animated" :class="{'animate__fadeIn': isVisible}" style="animation-duration: 1.2s;">
          <div class="relative group max-w-4xl mx-auto">
            <!-- Decorative elements -->
            <div class="absolute -inset-4 bg-red-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            
            <!-- Main image container -->
            <div class="relative bg-white/60 rounded-3xl overflow-hidden border border-gray-200 hover:border-red-600/30 transition-all duration-300 aspect-[16/9]">
              <div class="h-full overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Beat FM Radio Station" 
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                <!-- Overlay with Beat FM branding -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                  <div class="absolute bottom-8 left-8 right-8">
                    <div class="bg-red-600/90 backdrop-blur-sm rounded-2xl p-6 text-center">
                      <h4 class="text-white font-bold text-3xl mb-2">Beat FM 96.3</h4>
                      <p class="text-white/90 text-lg font-medium">Ekintabuli Ky'Omuziki</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Content Section -->
        <div class="max-w-4xl mx-auto">
          <!-- Our Story -->
          <div class="animate__animated text-center mb-16" :class="{'animate__fadeInUp': isVisible}" style="animation-duration: 1.2s;">
            <h3 class="text-3xl md:text-4xl font-bold text-black mb-8">
              <span class="animate__animated" :class="{'animate__fadeIn': isVisible}" style="animation-delay: 0.5s;">Our Story</span>
            </h3>
            
            <div class="space-y-6 text-gray-700 leading-relaxed text-lg max-w-3xl mx-auto">
              <p class="animate__animated" :class="{'animate__fadeIn': isVisible}" style="animation-delay: 0.6s;">
                Launched in 2005, Beat FM has revolutionized Uganda's music scene with our tagline "Ekintabuli Ky'Omuziki" - delivering the freshest beats, cutting-edge music, and vibrant entertainment that keeps Uganda dancing.
              </p>
              <p class="animate__animated" :class="{'animate__fadeIn': isVisible}" style="animation-delay: 0.8s;">
                Our commitment to musical excellence has made us the heartbeat of Uganda's music culture. We specialize in discovering new talent, promoting local artists, and bringing international hits to our passionate listeners.
              </p>
              <p class="animate__animated" :class="{'animate__fadeIn': isVisible}" style="animation-delay: 1s;">
                Broadcasting on 96.3 MHz in Kampala and across multiple frequencies nationwide, Beat FM reaches millions of music lovers daily. We continue to set trends and define the sound of modern Uganda.
              </p>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="animate__animated" :class="{'animate__fadeInUp': isVisible}" style="animation-delay: 0.3s;">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div class="relative group/stat">
                <div class="absolute -inset-1 bg-red-600 rounded-2xl blur opacity-0 group-hover/stat:opacity-20 transition duration-300"></div>
                <div class="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl text-center border border-gray-200 hover:border-red-600/50 transition-all duration-300 transform hover:scale-105">
                  <span class="block text-4xl font-bold text-red-600 mb-3 group-hover/stat:animate-pulse">18+</span>
                  <span class="text-gray-600 font-semibold uppercase tracking-wider">Years</span>
                </div>
              </div>
              
              <div class="relative group/stat">
                <div class="absolute -inset-1 bg-black rounded-2xl blur opacity-0 group-hover/stat:opacity-20 transition duration-300"></div>
                <div class="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl text-center border border-gray-200 hover:border-black/50 transition-all duration-300 transform hover:scale-105">
                  <span class="block text-4xl font-bold text-black mb-3 group-hover/stat:animate-pulse">2M+</span>
                  <span class="text-gray-600 font-semibold uppercase tracking-wider">Listeners</span>
                </div>
              </div>
              
              <div class="relative group/stat">
                <div class="absolute -inset-1 bg-red-600 rounded-2xl blur opacity-0 group-hover/stat:opacity-20 transition duration-300"></div>
                <div class="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl text-center border border-gray-200 hover:border-red-600/50 transition-all duration-300 transform hover:scale-105">
                  <span class="block text-4xl font-bold text-red-600 mb-3 group-hover/stat:animate-pulse">24/7</span>
                  <span class="text-gray-600 font-semibold uppercase tracking-wider">Beats</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Mission Statement -->
          <div class="animate__animated text-center mt-16" :class="{'animate__fadeIn': isVisible}" style="animation-delay: 0.5s;">
            <div class="bg-red-600/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-red-600/20">
              <h4 class="text-2xl md:text-3xl font-bold text-black mb-6">Our Mission</h4>
              <p class="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
                To be Uganda's ultimate music destination, connecting communities through the power of beats, 
                celebrating local talent, and keeping the nation dancing to the rhythm of life.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Radio, ArrowRight } from 'lucide-vue-next';
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