<template>
  <section class="py-8 md:py-12 lg:py-16 bg-gray-50" ref="sectionRef">
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mb-8 md:mb-12">
        <div class="flex items-center gap-2 md:gap-3 mb-4">
          <div class="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#F8CB00]/20 flex items-center justify-center flex-shrink-0">
            <Radio class="h-4 w-4 md:h-5 md:w-5 text-[#F8CB00]" />
          </div>
          <div>
            <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">About Capital FM</h2>
            <p class="text-sm md:text-base text-gray-600">Uganda's premier radio station since 1993</p>
          </div>
        </div>
      </div>
      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <!-- Left Content -->
        <div class="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 border border-gray-200 shadow-sm">
          <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Our Story</h3>
          
          <div class="space-y-4 text-gray-700 leading-relaxed text-sm md:text-base">
            <p>
              Founded in December 1993, Capital FM has been at the forefront of entertainment in Uganda, bringing the freshest hits, engaging talk shows, and the latest news to our listeners across the country.
            </p>
            <p>
              Our commitment to excellence has made us the voice of Uganda's youth and urban population. We pride ourselves on delivering quality content that entertains, informs, and connects communities across the nation.
            </p>
            <p>
              Broadcasting on 91.3 MHz in Kampala and across multiple frequencies nationwide, Capital FM reaches millions of listeners daily. We continue to evolve with the times while staying true to our core mission.
            </p>
          </div>
          
          <!-- Stats Grid -->
          <div class="grid grid-cols-3 gap-3 md:gap-4 mt-6 md:mt-8">
            <div class="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-100 text-center">
              <span class="block text-2xl md:text-3xl font-bold text-gray-900 mb-1">30+</span>
              <span class="text-xs md:text-sm text-gray-600">Years</span>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-100 text-center">
              <span class="block text-2xl md:text-3xl font-bold text-gray-900 mb-1">1M+</span>
              <span class="text-xs md:text-sm text-gray-600">Listeners</span>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-100 text-center">
              <span class="block text-2xl md:text-3xl font-bold text-gray-900 mb-1">24/7</span>
              <span class="text-xs md:text-sm text-gray-600">Live</span>
            </div>
          </div>
        </div>
        
        <!-- Right Image -->
        <div class="bg-white rounded-xl md:rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <div class="aspect-[4/3] lg:h-full overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Capital FM Radio Station" 
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
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
/* Smooth transitions */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
