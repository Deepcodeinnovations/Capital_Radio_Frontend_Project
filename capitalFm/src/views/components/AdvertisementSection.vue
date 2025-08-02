<template>
  <section class="py-16 bg-white dark:bg-slate-900">
    <div class="mx-auto px-6">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center mb-4">
          <div class="h-px w-8 bg-green-600"></div>
          <span class="mx-3 text-green-600 font-semibold text-sm uppercase tracking-wider">Sponsored Content</span>
          <div class="h-px w-8 bg-green-600"></div>
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Featured <span class="text-green-600">Advertisements</span>
        </h2>
        <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          Discover exclusive offers and promotions from our trusted advertising partners
        </p>
      </div>

      <!-- Sponsors Carousel -->
      <div class="relative">
        <!-- Carousel Container -->
        <div class="overflow-hidden rounded-2xl">
          <div 
            class="flex transition-transform duration-500 ease-in-out"
            :style="{ transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)` }"
          >
            <div 
              v-for="(sponsor, index) in sponsors" 
              :key="sponsor.id"
              class="flex-shrink-0 px-3"
              :style="{ width: `${100 / slidesToShow}%` }"
            >
              <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group h-full relative">
                <!-- Sponsored Badge -->
                <div class="absolute top-3 right-3 z-10">
                  <span class="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    Sponsored
                  </span>
                </div>
                
                <!-- Ad Image/Banner -->
                <div class="relative h-60 overflow-hidden bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600">
                  <img 
                    :src="sponsor.banner || sponsor.logo" 
                    :alt="sponsor.title || sponsor.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <!-- Ad Content -->
                <div class="p-6">
                  <!-- Category Badge -->
                  <div class="mb-3">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="getCategoryColor(sponsor.category)">
                      {{ sponsor.category }}
                    </span>
                  </div>
                  
                  <!-- Ad Title -->
                  <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                    {{ sponsor.title || sponsor.name }}
                  </h3>
                  
                  <!-- Ad Description -->
                  <p class="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                    {{ sponsor.description }}
                  </p>
                  
                  <!-- Advertiser Info -->
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-2">
                      <img 
                        :src="sponsor.logo" 
                        :alt="sponsor.advertiser || sponsor.name"
                        class="w-6 h-6 rounded-full object-cover"
                      />
                      <span class="text-xs text-slate-500 dark:text-slate-400">
                        {{ sponsor.advertiser || sponsor.name }}
                      </span>
                    </div>
                    <span v-if="sponsor.discount" class="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded">
                      {{ sponsor.discount }}
                    </span>
                  </div>
                  
                  <!-- CTA Button -->
                  <a 
                    :href="sponsor.website || sponsor.url" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="block w-full py-2.5 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-300 text-center text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    {{ sponsor.ctaText || 'Learn More' }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Arrows -->
        <button 
          @click="prevSlide"
          :disabled="currentSlide === 0"
          class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 dark:hover:bg-slate-700"
        >
          <ChevronLeft class="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
        
        <button 
          @click="nextSlide"
          :disabled="currentSlide >= maxSlide"
          class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-50 dark:hover:bg-slate-700"
        >
          <ChevronRight class="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>

        <!-- Dots Indicator -->
        <div class="flex justify-center mt-8 space-x-2">
          <button
            v-for="(_, index) in Math.ceil(sponsors.length / slidesToShow)"
            :key="index"
            @click="goToSlide(index)"
            class="w-3 h-3 rounded-full transition-all duration-300"
            :class="Math.floor(currentSlide / slidesToShow) === index 
              ? 'bg-green-600 scale-110' 
              : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'"
          ></button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

// Props for customization
const props = defineProps({
  sponsors: {
    type: Array,
    default: () => [
      {
        id: 1,
        title: 'Summer Sale - Up to 50% Off Electronics',
        description: 'Get amazing discounts on the latest smartphones, laptops, and accessories. Limited time offer!',
        banner: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop',
        logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop',
        advertiser: 'TechWorld Uganda',
        website: 'https://techworld.ug',
        category: 'Electronics',
        discount: '50% OFF',
        ctaText: 'Shop Now'
      },
      {
        id: 2,
        title: 'Premium Banking Services - Zero Fees',
        description: 'Open a new account today and enjoy 6 months of zero transaction fees plus competitive interest rates.',
        banner: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop',
        logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop',
        advertiser: 'Stanbic Bank Uganda',
        website: 'https://stanbicbank.co.ug',
        category: 'Banking',
        discount: 'Free',
        ctaText: 'Apply Now'
      },
      {
        id: 3,
        title: 'Refreshing Drinks for Every Occasion',
        description: 'Quench your thirst with our range of premium beverages. Perfect for parties, events, and everyday enjoyment.',
        banner: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=200&fit=crop',
        logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100&h=100&fit=crop',
        advertiser: 'Coca-Cola Uganda',
        website: 'https://coca-cola.ug',
        category: 'Beverages',
        ctaText: 'Find Stores'
      },
      {
        id: 4,
        title: 'Unlimited Data Plans Starting at UGX 50,000',
        description: 'Stay connected with our affordable unlimited data plans. Perfect for streaming, browsing, and staying in touch.',
        banner: 'https://images.unsplash.com/photo-1516387938699-a93567ec168e?w=400&h=200&fit=crop',
        logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop',
        advertiser: 'MTN Uganda',
        website: 'https://mtn.ug',
        category: 'Telecommunications',
        discount: 'From UGX 50K',
        ctaText: 'Get Plan'
      },
      {
        id: 5,
        title: 'Luxury Weekend Getaway Package',
        description: 'Escape to paradise with our exclusive spa and dining package. Includes accommodation, meals, and spa treatments.',
        banner: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=200&fit=crop',
        logo: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=100&h=100&fit=crop',
        advertiser: 'Serena Hotels',
        website: 'https://serenahotels.com',
        category: 'Hospitality',
        discount: '30% OFF',
        ctaText: 'Book Now'
      },
      {
        id: 6,
        title: 'Quality Fuel & Rewards Program',
        description: 'Fill up with premium fuel and earn points with every purchase. Redeem points for amazing rewards and discounts.',
        banner: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop',
        logo: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
        advertiser: 'Shell Uganda',
        website: 'https://shell.ug',
        category: 'Energy',
        ctaText: 'Join Program'
      },
      {
        id: 7,
        title: 'Mobile Money Transfer - Send Money Instantly',
        description: 'Send money to family and friends instantly with our secure mobile money platform. Available 24/7 across Uganda.',
        banner: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=200&fit=crop',
        logo: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=100&h=100&fit=crop',
        advertiser: 'Airtel Money',
        website: 'https://airtel.ug',
        category: 'Financial Services',
        ctaText: 'Start Sending'
      },
      {
        id: 8,
        title: 'Fashion Week Sale - Latest Trends',
        description: 'Discover the latest fashion trends with up to 40% off on selected items. Perfect for the modern trendsetter.',
        banner: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=200&fit=crop',
        logo: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=100&h=100&fit=crop',
        advertiser: 'Fashion Hub',
        website: 'https://fashionhub.ug',
        category: 'Fashion',
        discount: '40% OFF',
        ctaText: 'Shop Collection'
      }
    ]
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  autoplayInterval: {
    type: Number,
    default: 4000
  }
});

// State
const currentSlide = ref(0);
const slidesToShow = ref(4);
const autoplayTimer = ref(null);

// Computed
const maxSlide = computed(() => {
  return Math.max(0, props.sponsors.length - slidesToShow.value);
});

// Methods
const nextSlide = () => {
  if (currentSlide.value < maxSlide.value) {
    currentSlide.value++;
  } else {
    currentSlide.value = 0; // Loop back to start
  }
};

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  } else {
    currentSlide.value = maxSlide.value; // Loop to end
  }
};

const goToSlide = (index) => {
  currentSlide.value = index * slidesToShow.value;
};

const getCategoryColor = (category) => {
  const colors = {
    'Electronics': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    'Banking': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    'Beverages': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    'Telecommunications': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    'Hospitality': 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
    'Energy': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    'Financial Services': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
    'Fashion': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
  };
  return colors[category] || 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
};

// Responsive slides
const updateSlidesToShow = () => {
  const width = window.innerWidth;
  if (width < 640) {
    slidesToShow.value = 1;
  } else if (width < 768) {
    slidesToShow.value = 2;
  } else if (width < 1024) {
    slidesToShow.value = 3;
  } else {
    slidesToShow.value = 4;
  }
};

// Autoplay functionality
const startAutoplay = () => {
  if (props.autoplay && props.sponsors.length > slidesToShow.value) {
    autoplayTimer.value = setInterval(() => {
      nextSlide();
    }, props.autoplayInterval);
  }
};

const stopAutoplay = () => {
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value);
    autoplayTimer.value = null;
  }
};

// Lifecycle
onMounted(() => {
  updateSlidesToShow();
  window.addEventListener('resize', updateSlidesToShow);
  startAutoplay();
});

onUnmounted(() => {
  window.removeEventListener('resize', updateSlidesToShow);
  stopAutoplay();
});
</script>

<style scoped>
/* Text clipping for long content */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Hover effects */
.group:hover .group-hover\:text-blue-600 {
  color: rgb(37 99 235);
}

.group:hover .group-hover\:grayscale-0 {
  filter: grayscale(0);
}

/* Focus styles */
button:focus-visible {
  outline: 2px solid rgb(59 130 246);
  outline-offset: 2px;
}

/* Custom scrollbar hide */
.overflow-hidden {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.overflow-hidden::-webkit-scrollbar {
  display: none;
}

/* Responsive design helpers */
@media (max-width: 640px) {
  .px-6 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Animation keyframes */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.6s ease-out forwards;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .dark\:bg-slate-900 {
    background-color: rgb(15 23 42);
  }
  
  .dark\:bg-slate-800 {
    background-color: rgb(30 41 59);
  }
  
  .dark\:text-white {
    color: rgb(255 255 255);
  }
  
  .dark\:text-slate-300 {
    color: rgb(203 213 225);
  }
  
  .dark\:border-slate-700 {
    border-color: rgb(51 65 85);
  }
}
</style>