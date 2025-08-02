<template>
  <section class="relative min-h-screen overflow-hidden" ref="sectionRef">
    <!-- Fixed Background Image - Only for this section -->
    <div class="absolute inset-0 z-0">
      <!-- <img 
        src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
        alt="Radio Station Background" 
        class="w-full h-full object-cover fixed inset-0"
      /> -->
      <!-- White overlay for light theme -->
      <div class="absolute inset-0 bg-white/95"></div>
      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-white/70 via-white/60 to-white/90"></div>
    </div>

    <!-- Floating background elements -->
    <div class="absolute inset-0 overflow-hidden opacity-10 pointer-events-none z-10">
      <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-[#F8CB00] rounded-full blur-2xl animate-float"></div>
      <div class="absolute bottom-1/3 right-1/4 w-40 h-40 bg-red-500 rounded-full blur-3xl animate-float" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/2 w-24 h-24 bg-blue-500 rounded-full blur-xl animate-pulse-slow"></div>
    </div>
    
    <div class="relative z-20 py-20 min-h-screen flex items-center">
      <div class="container mx-auto px-4">
        <!-- Section Header -->
        <div class="mb-16 text-center animate__animated" :class="{'animate__fadeInDown': isVisible}">
          <div class="inline-flex items-center justify-center mb-6">
            <span class="h-px w-12 bg-[#F8CB00]"></span>
            <span class="mx-4 text-gray-800 font-bold tracking-wider text-sm uppercase">The Station</span>
            <span class="h-px w-12 bg-[#F8CB00]"></span>
          </div>
          <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            About <span class="text-[#F8CB00]">Capital FM</span>
          </h2>
          <p class="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Uganda's leading radio station dedicated to bringing you fresh hits and entertainment since 1993
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
                  <div class="ml-4 flex-1 h-px bg-gradient-to-r from-[#F8CB00] to-transparent animate__animated" :class="{'animate__fadeInLeft': isVisible}" style="animation-delay: 0.7s;"></div>
                </h3>
                
                <div class="space-y-6 text-gray-700 leading-relaxed text-lg">
                  <p class="animate__animated" :class="{'animate__fadeIn': isVisible}" style="animation-delay: 0.6s;">
                    Founded in December 1993, Capital FM has been at the forefront of entertainment in Uganda, bringing the freshest hits, engaging talk shows, and the latest news to our listeners across the country.
                  </p>
                  <p class="animate__animated" :class="{'animate__fadeIn': isVisible}" style="animation-delay: 0.8s;">
                    Our commitment to excellence has made us the voice of Uganda's youth and urban population. We pride ourselves on delivering quality content that entertains, informs, and connects communities across the nation.
                  </p>
                  <p class="animate__animated" :class="{'animate__fadeIn': isVisible}" style="animation-delay: 1s;">
                    Broadcasting on 91.3 MHz in Kampala and across multiple frequencies nationwide, Capital FM reaches millions of listeners daily. We continue to evolve with the times while staying true to our core mission.
                  </p>
                </div>
              </div>
              
              <!-- Stats Grid -->
              <div class="grid grid-cols-3 gap-6">
                <div class="relative group/stat">
                  <div class="absolute -inset-1 bg-gradient-to-r from-[#F8CB00] to-red-500 rounded-xl blur opacity-0 group-hover/stat:opacity-20 transition duration-300"></div>
                  <div class="relative bg-white/60 backdrop-blur-sm p-6 rounded-xl text-center border border-gray-200 hover:border-[#F8CB00]/50 transition-all duration-300 transform hover:scale-105">
                    <span class="block text-3xl font-bold text-[#F8CB00] mb-2 group-hover/stat:animate-pulse">30+</span>
                    <span class="text-sm text-gray-600 font-medium">Years</span>
                  </div>
                </div>
                
                <div class="relative group/stat">
                  <div class="absolute -inset-1 bg-gradient-to-r from-blue-500 to-[#F8CB00] rounded-xl blur opacity-0 group-hover/stat:opacity-20 transition duration-300"></div>
                  <div class="relative bg-white/60 backdrop-blur-sm p-6 rounded-xl text-center border border-gray-200 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105">
                    <span class="block text-3xl font-bold text-blue-600 mb-2 group-hover/stat:animate-pulse">1M+</span>
                    <span class="text-sm text-gray-600 font-medium">Listeners</span>
                  </div>
                </div>
                
                <div class="relative group/stat">
                  <div class="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-xl blur opacity-0 group-hover/stat:opacity-20 transition duration-300"></div>
                  <div class="relative bg-white/60 backdrop-blur-sm p-6 rounded-xl text-center border border-gray-200 hover:border-red-500/50 transition-all duration-300 transform hover:scale-105">
                    <span class="block text-3xl font-bold text-red-500 mb-2 group-hover/stat:animate-pulse">24/7</span>
                    <span class="text-sm text-gray-600 font-medium">Live</span>
                  </div>
                </div>
              </div>
              
        
            </div>
          </div>
          
          <!-- Right Image - Height matches left content -->
          <div class="animate__animated" :class="{'animate__fadeInRight': isVisible}" style="animation-duration: 1.2s;">
            <div class="relative group h-full">
              <!-- Decorative elements -->
              <div class="absolute -inset-4 bg-gradient-to-r from-[#F8CB00] via-red-500 to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              
              <!-- Main image container -->
              <div class="relative bg-white/60 rounded-2xl overflow-hidden border border-gray-200 h-full">
                <div class="h-full overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Capital FM Radio Station" 
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                
                </div>
              </div>
     

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