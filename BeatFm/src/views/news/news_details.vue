<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="relative min-h-[70vh] flex items-center justify-center overflow-hidden" style="margin-top: 5rem !important;">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0">
        <img 
          :src="newsDetails?.featured_image_url || 'https://images.unsplash.com/photo-1587691592099-24045742c181?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'" 
          :alt="newsDetails?.title || 'News Article'" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/60"></div>
      </div>

      <!-- Clean geometric background -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-10 w-20 h-20 bg-red-600 transform rotate-45"></div>
        <div class="absolute bottom-40 right-20 w-16 h-16 bg-white"></div>
        <div class="absolute top-1/2 left-1/4 w-12 h-12 bg-red-600"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 container mx-auto px-6 text-center">
        <!-- Breaking News Badge -->
        <div v-if="newsDetails?.is_breaking" class="inline-block mb-8">
          <div class="bg-red-600 text-white px-6 py-3 border-2 border-black transform -rotate-1 flex items-center gap-2">
            <div class="w-3 h-3 bg-white animate-pulse"></div>
            <span class="font-black tracking-widest text-sm uppercase">BREAKING NEWS</span>
          </div>
        </div>

        <!-- Category Badge -->
        <div v-else class="inline-block bg-red-600 text-white px-6 py-2 mb-8 transform -rotate-1 border-2 border-black">
          <span class="font-black text-sm tracking-widest uppercase">{{ newsDetails?.category?.name || 'NEWS UPDATE' }}</span>
        </div>

        <!-- Main Heading -->
        <h1 class="text-6xl font-black text-white mb-6 leading-none max-w-5xl mx-auto">
          {{ newsDetails?.title || 'LOADING NEWS ARTICLE...' }}
        </h1>

        <!-- Subtitle -->
        <p class="text-xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
          {{ newsDetails?.excerpt || 'Stay informed with the latest updates from Beat FM' }}
        </p>

        <!-- Article Meta -->
        <div v-if="newsDetails" class="flex flex-wrap items-center justify-center gap-6 text-sm text-white mb-8 font-bold uppercase tracking-wider">
          <div class="flex items-center gap-2">
            <img 
              :src="newsDetails.author?.image_url || '/default-avatar.png'" 
              :alt="newsDetails.author?.name"
              class="w-8 h-8 object-cover border-2 border-white"
            />
            <span>{{ newsDetails.author?.name || 'BEAT FM TEAM' }}</span>
          </div>
          
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <span>{{ formatDate(newsDetails.published_at) }}</span>
          </div>
          
          <div class="flex items-center gap-1">
            <Clock class="h-4 w-4" />
            <span>{{ newsDetails.reading_time || 5 }} MIN READ</span>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            @click="$router.go(-1)"
            class="bg-white text-black font-bold px-8 py-4 border-2 border-black hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 tracking-wider uppercase"
          >
            <span>Back to News</span>
          </button>
          
          <button 
            @click="scrollToArticle"
            class="bg-red-600 text-white font-bold px-8 py-4 border-2 border-black hover:bg-red-700 transition-all duration-300 transform hover:scale-105 tracking-wider uppercase flex items-center gap-3"
          >
            <Eye :size="20" />
            <span>Read Article</span>
          </button>
        </div>
      </div>

      <!-- Sharp Bottom Divider -->
      <div class="absolute bottom-0 left-0 w-full overflow-hidden" style="transform: translateY(1px);">
        <svg class="w-full h-auto" preserveAspectRatio="none" viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="newsDetailWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#DC2626;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#000000;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#DC2626;stop-opacity:1" />
            </linearGradient>
          </defs>
          <path d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z" fill="url(#newsDetailWaveGradient)"></path>
          <path d="M0,80 C300,40 600,100 900,80 C1000,70 1100,90 1200,80 L1200,120 L0,120 Z" fill="rgb(249 250 251)" opacity="0.9"></path>
        </svg>
      </div>
    </section>

    <!-- Clean Header -->
    <div class="bg-white border-b-2 border-black sticky top-0 z-50">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Breadcrumb -->
          <div class="flex items-center space-x-4">
            <button 
              @click="$router.go(-1)"
              class="flex items-center space-x-2 px-4 py-2 text-black hover:text-red-600 border border-black hover:border-red-600 transition-colors font-bold uppercase tracking-wider"
            >
              <ArrowLeft class="w-4 h-4" />
              <span>Back to News</span>
            </button>
            
            <div class="h-6 w-px bg-black"></div>
            
            <div>
              <h1 class="text-lg font-black text-black uppercase tracking-wider">{{ newsDetails?.category?.name || 'NEWS ARTICLE' }}</h1>
              <p class="text-sm text-gray-600 font-bold uppercase tracking-wider">{{ newsDetails?.station?.name || 'BEAT FM' }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <button 
              @click="shareArticle"
              class="p-3 text-black hover:text-red-600 border border-black hover:border-red-600 transition-colors"
            >
              <Share class="w-5 h-5" />
            </button>
            <button 
              @click="toggleBookmark"
              class="p-3 text-black hover:text-red-600 border border-black hover:border-red-600 transition-colors"
            >
              <Bookmark class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="w-12 h-12 border-4 border-gray-300 border-t-red-600 animate-spin"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <div class="w-20 h-20 bg-gray-200 border-4 border-black flex items-center justify-center mx-auto mb-6">
        <AlertCircle class="w-10 h-10 text-gray-400" />
      </div>
      <h3 class="text-xl font-black text-black mb-2 uppercase tracking-wider">ARTICLE NOT FOUND</h3>
      <p class="text-gray-600 mb-6 font-bold uppercase tracking-wider">THE ARTICLE YOU'RE LOOKING FOR DOESN'T EXIST OR HAS BEEN REMOVED.</p>
      <button 
        @click="$router.go(-1)"
        class="px-6 py-3 bg-red-600 text-white border-2 border-black hover:bg-red-700 transition-colors font-black uppercase tracking-wider"
      >
        GO BACK
      </button>
    </div>

    <!-- Main Content -->
    <div v-else-if="newsDetails" class="max-w-4xl mx-auto px-6 py-8">
      <!-- Original Article -->
      <article id="article-content" class="bg-white border-2 border-black shadow-lg mb-8 overflow-hidden hover:border-red-600 transition-all">
        <div class="p-8">
          <!-- Article Header -->
          <div class="mb-6">
            <!-- Status Badges -->
            <div class="flex items-center space-x-2 mb-4">
              <span v-if="newsDetails.is_breaking" class="bg-red-600 text-white px-3 py-1 text-xs font-black tracking-wider uppercase border-2 border-black flex items-center gap-1">
                <AlertCircle class="w-3 h-3" />
                Breaking
              </span>
              <span v-if="newsDetails.is_featured" class="bg-black text-white px-3 py-1 text-xs font-black tracking-wider uppercase border-2 border-black flex items-center gap-1">
                <Star class="w-3 h-3" />
                Featured
              </span>
              <span class="bg-white text-red-600 px-3 py-1 text-xs font-black tracking-wider uppercase border-2 border-red-600">
                {{ newsDetails.category?.name }}
              </span>
            </div>
            
            <!-- Article Title -->
            <h2 class="text-3xl font-black text-black mb-4 leading-tight uppercase tracking-wide">
              {{ newsDetails.title }}
            </h2>
            
            <!-- Article Meta -->
            <div class="flex items-center space-x-6 text-sm text-black font-bold mb-6 uppercase tracking-wider">
              <div class="flex items-center space-x-2">
                <img 
                  :src="newsDetails.author?.image_url || '/default-avatar.png'" 
                  :alt="newsDetails.author?.name"
                  class="w-6 h-6 object-cover border border-black"
                />
                <span>{{ newsDetails.author?.name }}</span>
              </div>
              
              <div class="flex items-center space-x-2">
                <Calendar class="w-4 h-4" />
                <span>{{ formatDate(newsDetails.published_at) }}</span>
              </div>
              
              <div class="flex items-center space-x-2">
                <Eye class="w-4 h-4" />
                <span>{{ formatNumber(newsDetails.views_count) }}</span>
              </div>
            </div>
            
            <!-- Article Content -->
            <div class="prose prose-gray max-w-none mb-6">
              <div 
                v-html="newsDetails.content" 
                class="text-black leading-relaxed font-medium"
              ></div>
            </div>

            <!-- Gallery Section -->
            <div v-if="newsDetails.gallery_images?.length" class="mt-8">
              <h3 class="text-xl font-black text-black mb-4 flex items-center gap-3 uppercase tracking-wider">
                <div class="w-6 h-6 bg-red-600 border-2 border-black flex items-center justify-center">
                  <Image class="h-4 w-4 text-white" />
                </div>
                Photo Gallery
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="(image, index) in newsDetails.gallery_images" 
                  :key="image.id"
                  class="relative group cursor-pointer overflow-hidden border-2 border-black hover:border-red-600 transition-all"
                  @click="openGallery(index)"
                >
                  <img 
                    :src="image.url" 
                    :alt="image.alt || `Gallery image ${index + 1}`"
                    class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                  />
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div class="w-12 h-12 bg-white border-2 border-black flex items-center justify-center">
                      <ZoomIn class="h-6 w-6 text-black" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div v-if="newsDetails.tags?.length" class="mt-8 pt-6 border-t-2 border-black">
              <h4 class="text-lg font-black text-black mb-3 flex items-center gap-3 uppercase tracking-wider">
                <div class="w-5 h-5 bg-red-600 border-2 border-black flex items-center justify-center">
                  <Hash class="h-3 w-3 text-white" />
                </div>
                Tags
              </h4>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="tag in newsDetails.tags" 
                  :key="tag"
                  class="px-3 py-1 bg-white text-black border border-black hover:border-red-600 hover:text-red-600 text-sm transition-colors cursor-pointer font-bold uppercase tracking-wider"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
          </div>

          <!-- Article Stats and Actions -->
          <div class="border-t-2 border-black pt-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-6 text-sm text-black font-bold">
                <div class="flex items-center space-x-2">
                  <Eye class="w-4 h-4" />
                  <span>{{ formatNumber(newsDetails.views_count) }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <Heart class="w-4 h-4" />
                  <span>{{ formatNumber(newsDetails.likes_count) }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <Share class="w-4 h-4" />
                  <span>{{ formatNumber(newsDetails.shares_count) }}</span>
                </div>
              </div>
              
              <div class="flex items-center space-x-3">
                <button 
                  @click="toggleLike"
                  class="px-3 py-1.5 border-2 border-black hover:border-red-600 transition-colors text-sm font-black uppercase tracking-wider flex items-center gap-1"
                  :class="{ 'bg-red-600 text-white border-red-600': isLiked, 'bg-white text-black': !isLiked }"
                >
                  <Heart class="w-4 h-4" :class="{ 'fill-current': isLiked }" />
                  {{ isLiked ? 'LIKED' : 'LIKE' }}
                </button>
                
                <button 
                  @click="shareArticle"
                  class="px-4 py-2 bg-red-600 text-white border-2 border-black hover:bg-red-700 transition-colors text-sm font-black uppercase tracking-wider flex items-center gap-2"
                >
                  <Share class="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- Station Info Card -->
      <div class="bg-white border-2 border-black shadow-lg p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-8 bg-red-600 border-2 border-black flex items-center justify-center">
            <Radio class="w-4 h-4 text-white" />
          </div>
          <h3 class="text-lg font-black text-black uppercase tracking-wider">Listen to {{ newsDetails.station?.name || 'BEAT FM' }}</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Station Info -->
          <div class="md:col-span-2">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-16 h-16 bg-red-600 border-2 border-black flex items-center justify-center">
                <Radio class="h-8 w-8 text-white" />
              </div>
              <div>
                <p class="text-black font-black uppercase tracking-wider">{{ newsDetails.station?.frequency || '96.3' }} FM</p>
                <p class="text-gray-600 text-sm font-bold uppercase tracking-wider">{{ newsDetails.station?.tagline || 'FRESH BEATS FOR UGANDA' }}</p>
              </div>
            </div>
            
            <p class="text-black text-sm mb-4 font-medium">
              Stay updated with the latest news, music, and entertainment from Uganda's premier radio station.
            </p>
            
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-1 text-red-600 font-bold uppercase tracking-wider">
                <div class="w-3 h-3 bg-red-600 animate-pulse"></div>
                <span>{{ formatNumber(newsDetails.station?.listeners || 15000) }} LISTENERS</span>
              </div>
              <div class="text-black font-bold uppercase tracking-wider">{{ newsDetails.station?.streaming_status || 'LIVE' }}</div>
            </div>
          </div>
          
          <!-- Listen Live Button -->
          <div class="flex items-center">
            <button 
              @click="togglePlayPause"
              :disabled="audioLoading"
              class="w-full py-4 px-4 font-black transition-all flex items-center justify-center gap-2 bg-red-600 text-white border-2 border-black hover:bg-red-700 disabled:opacity-50 tracking-wider uppercase"
            >
              <div v-if="audioLoading" class="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
              <component v-else :is="isPlaying ? Pause : Play" class="h-4 w-4" />
              <span>{{ audioLoading ? 'CONNECTING...' : isPlaying ? 'LIVE NOW' : 'LISTEN LIVE' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Gallery Modal -->
    <teleport to="body">
      <div 
        v-if="galleryOpen" 
        class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        @click="closeGallery"
        @keydown.esc="closeGallery"
      >
        <div class="relative max-w-5xl max-h-full" @click.stop>
          <img 
            :src="newsDetails.gallery_images[currentGalleryIndex]?.url" 
            :alt="newsDetails.gallery_images[currentGalleryIndex]?.alt"
            class="max-w-full max-h-full object-contain border-2 border-white"
          />
          
          <!-- Close button -->
          <button 
            @click="closeGallery"
            class="absolute top-4 right-4 w-12 h-12 bg-white border-2 border-black flex items-center justify-center text-black hover:bg-gray-100 transition-colors"
          >
            <X class="h-6 w-6" />
          </button>
          
          <!-- Navigation buttons -->
          <button 
            v-if="currentGalleryIndex > 0"
            @click.stop="previousImage"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white border-2 border-black flex items-center justify-center text-black hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft class="h-6 w-6" />
          </button>
          <button 
            v-if="currentGalleryIndex < newsDetails.gallery_images.length - 1"
            @click.stop="nextImage"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white border-2 border-black flex items-center justify-center text-black hover:bg-gray-100 transition-colors"
          >
            <ChevronRight class="h-6 w-6" />
          </button>

          <!-- Image counter -->
          <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white border-2 border-black px-4 py-2 text-black text-sm font-black uppercase tracking-wider">
            {{ currentGalleryIndex + 1 }} / {{ newsDetails.gallery_images.length }}
          </div>
        </div>
      </div>
    </teleport>

    <!-- Toast Notification -->
    <teleport to="body">
      <transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform translate-y-2 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform translate-y-2 opacity-0"
      >
        <div 
          v-if="toast.show"
          class="fixed bottom-4 right-4 z-50 bg-white border-2 border-black p-4 shadow-xl max-w-sm"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 flex items-center justify-center border-2 border-black"
                 :class="toast.type === 'success' ? 'bg-red-600 text-white' : 'bg-white text-red-600'">
              <Check v-if="toast.type === 'success'" class="h-4 w-4" />
              <AlertCircle v-else class="h-4 w-4" />
            </div>
            <div>
              <p class="text-black font-bold uppercase tracking-wider">{{ toast.message }}</p>
            </div>
            <button @click="hideToast" class="text-black hover:text-red-600">
              <X class="h-4 w-4" />
            </button>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { 
  ArrowLeft, Calendar, Clock, Eye, Share, Bookmark, AlertCircle, Star, 
  Hash, Image, ZoomIn, X, ChevronLeft, ChevronRight, Heart, Radio, 
  Play, Pause, Check
} from 'lucide-vue-next';

const store = useStore();
const route = useRoute();
const router = useRouter();

// Reactive data
const isLoading = ref(true);
const error = ref(false);
const galleryOpen = ref(false);
const currentGalleryIndex = ref(0);
const isLiked = ref(false);
const toast = ref({ show: false, message: '', type: 'success' });

// Computed properties
const newsDetails = computed(() => store.getters.news_details);
const isPlaying = computed(() => store.getters.isPlaying || false);
const audioLoading = computed(() => store.getters.isLoading || false);

// Methods
const fetchNewsDetails = async (slug) => {
  isLoading.value = true;
  error.value = false;
  
  try {
    await store.dispatch('fetch_news_details_by_slug', slug);
    if (!newsDetails.value) {
      error.value = true;
    }
  } catch (err) {
    console.error('Error fetching news details:', err);
    error.value = true;
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).toUpperCase();
};

const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

const hideToast = () => {
  toast.value.show = false;
};

const scrollToArticle = () => {
  document.getElementById('article-content').scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
};

const shareArticle = async () => {
  try {
    if (navigator.share && newsDetails.value) {
      await navigator.share({
        title: newsDetails.value.title,
        text: newsDetails.value.excerpt,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showToast('LINK COPIED TO CLIPBOARD!');
    }
  } catch (err) {
    console.error('Failed to share:', err);
    showToast('FAILED TO SHARE ARTICLE', 'error');
  }
};

const toggleBookmark = () => {
  showToast('ARTICLE BOOKMARKED!');
};

const toggleLike = () => {
  isLiked.value = !isLiked.value;
  showToast(isLiked.value ? 'ARTICLE LIKED!' : 'LIKE REMOVED');
};

const togglePlayPause = async () => {
  try {
    await store.dispatch('togglePlayPause');
  } catch (err) {
    console.error('Failed to toggle playback:', err);
    showToast('FAILED TO CONTROL AUDIO PLAYER', 'error');
  }
};

const openGallery = (index) => {
  currentGalleryIndex.value = index;
  galleryOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeGallery = () => {
  galleryOpen.value = false;
  document.body.style.overflow = 'auto';
};

const nextImage = () => {
  if (currentGalleryIndex.value < newsDetails.value.gallery_images.length - 1) {
    currentGalleryIndex.value++;
  }
};

const previousImage = () => {
  if (currentGalleryIndex.value > 0) {
    currentGalleryIndex.value--;
  }
};

// Keyboard navigation for gallery
const handleKeydown = (event) => {
  if (galleryOpen.value) {
    if (event.key === 'ArrowRight') nextImage();
    if (event.key === 'ArrowLeft') previousImage();
    if (event.key === 'Escape') closeGallery();
  }
};

// Watch for route changes
watch(() => route.params.id, async (newSlug, oldSlug) => {
  if (newSlug && newSlug !== oldSlug) {
    await fetchNewsDetails(newSlug);
  }
}, { immediate: true });

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = 'auto';
});
</script>

<style scoped>
/* Override rounded corners for brutalist design */
* {
  border-radius: 0 !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Ensure sharp geometric shapes */
button, div, input, img {
  border-radius: 0 !important;
}

/* Custom prose styles for article content */
.prose :deep(p) {
  @apply mb-6 text-black leading-relaxed font-medium;
}

.prose :deep(h1) {
  @apply text-2xl font-black text-black mb-4 mt-6 uppercase tracking-wide;
}

.prose :deep(h3) {
  @apply text-lg font-bold text-black mb-3 mt-4 uppercase tracking-wide;
}

.prose :deep(blockquote) {
  @apply border-l-4 border-red-600 pl-6 py-2 italic text-black bg-gray-50 my-6 font-medium;
}

.prose :deep(ul) {
  @apply list-disc list-inside space-y-2 text-black mb-6 font-medium;
}

.prose :deep(ol) {
  @apply list-decimal list-inside space-y-2 text-black mb-6 font-medium;
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
  0%, 100% { 
    opacity: 1; 
  }
  50% { 
    opacity: 0.5; 
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #e5e7eb;
  border: 1px solid #000;
}

::-webkit-scrollbar-thumb {
  background: #dc2626;
  border: 1px solid #000;
}

::-webkit-scrollbar-thumb:hover {
  background: #b91c1c;
}

/* Focus styles */
button:focus-visible,
input:focus-visible {
  outline: 2px solid #dc2626;
  outline-offset: 2px;
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Gallery modal overlay */
.fixed.inset-0.z-50 {
  backdrop-filter: blur(4px);
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .p-8 {
    padding: 1.5rem;
  }
  
  .px-8 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .text-6xl {
    font-size: 2.5rem;
    line-height: 3rem;
  }
  
  .text-3xl {
    font-size: 1.75rem;
    line-height: 2.25rem;
  }
  
  .space-x-6 > :not([hidden]) ~ :not([hidden]) {
    margin-left: 1rem;
  }
}

@media (max-width: 640px) {
  .p-8 {
    padding: 1rem;
  }
  
  .px-8 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .space-x-4 > :not([hidden]) ~ :not([hidden]) {
    margin-left: 0.75rem;
  }
  
  .text-6xl {
    font-size: 2rem;
    line-height: 2.5rem;
  }
  
  .text-3xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .border-black {
    border-color: #000000;
  }
  
  button {
    border: 2px solid currentColor;
  }
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  * {
    background: white !important;
    color: black !important;
  }
  
  .border-red-600 {
    border-color: #000000 !important;
  }
  
  .bg-red-600 {
    background-color: #000000 !important;
  }
}
</style>