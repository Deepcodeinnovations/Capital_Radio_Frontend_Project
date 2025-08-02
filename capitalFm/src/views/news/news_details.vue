<template>
  <div class="min-h-screen bg-white">
    <!-- Hero Section -->
    <section class="relative min-h-[70vh] flex items-center justify-center overflow-hidden" style="margin-top: -5rem !important;">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0">
        <img 
          :src="newsDetails?.featured_image_url || 'https://images.unsplash.com/photo-1587691592099-24045742c181?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'" 
          :alt="newsDetails?.title || 'News Article'" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"></div>
      </div>

      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden opacity-20">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-[#F8CB00] rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-72 h-72 bg-red-500 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
        <div class="absolute top-1/2 right-1/3 w-48 h-48 bg-blue-500 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 container mx-auto px-6 text-center">
        <!-- Breaking News Badge -->
        <div v-if="newsDetails?.is_breaking" class="inline-flex items-center justify-center mb-8">
          <div class="bg-red-500/90 px-4 py-2 rounded-full flex items-center gap-2">
            <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span class="text-white font-bold tracking-wider text-sm uppercase">Breaking News</span>
          </div>
        </div>

        <!-- Category Badge -->
        <div v-else class="inline-flex items-center justify-center mb-8">
          <div class="h-px w-12 bg-[#F8CB00]"></div>
          <span class="mx-4 text-[#F8CB00] font-bold tracking-wider text-sm uppercase">{{ newsDetails?.category?.name || 'News Update' }}</span>
          <div class="h-px w-12 bg-[#F8CB00]"></div>
        </div>

        <!-- Main Heading -->
        <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-5xl mx-auto">
          {{ newsDetails?.title || 'Loading News Article...' }}
        </h1>

        <!-- Subtitle -->
        <p class="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
          {{ newsDetails?.excerpt || 'Stay informed with the latest updates from Capital FM' }}
        </p>

        <!-- Article Meta -->
        <div v-if="newsDetails" class="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-300 mb-8">
          <div class="flex items-center gap-2">
            <img 
              :src="newsDetails.author?.image_url || '/default-avatar.png'" 
              :alt="newsDetails.author?.name"
              class="w-8 h-8 rounded-full object-cover"
            />
            <span class="font-medium">{{ newsDetails.author?.name || 'Capital FM Team' }}</span>
          </div>
          
          <div class="flex items-center gap-1">
            <Calendar class="h-4 w-4" />
            <span>{{ formatDate(newsDetails.published_at) }}</span>
          </div>
          
          <div class="flex items-center gap-1">
            <Clock class="h-4 w-4" />
            <span>{{ newsDetails.reading_time || 5 }} min read</span>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            @click="$router.go(-1)"
            class="bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300"
          >
            <span class="tracking-wide">Back to News</span>
          </button>
          
          <button 
            @click="scrollToArticle"
            class="relative group overflow-hidden rounded-2xl"
          >
            <div class="absolute -inset-0.5 bg-gradient-to-r from-[#F8CB00] via-red-500 to-blue-500 rounded-2xl blur opacity-60 group-hover:opacity-80 transition duration-300"></div>
            <div class="relative bg-gradient-to-r from-[#F8CB00] to-red-500 px-8 py-4 rounded-2xl text-black font-bold flex items-center space-x-3 transition-all duration-300">
              <Eye :size="20" />
              <span class="tracking-wide">READ ARTICLE</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Bottom Wave Divider -->
      <div class="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="w-full h-16">
          <path fill="white" d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,31,17,94.98,30.44c64.64,13.91,93.29,29.88,150.17,38.07,65.88,9.2,165.63,17.05,240.88,12.55Z" />
        </svg>
      </div>
    </section>

    <!-- Clean Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-md bg-white/95">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Breadcrumb -->
          <div class="flex items-center space-x-4">
            <button 
              @click="$router.go(-1)"
              class="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft class="w-4 h-4" />
              <span class="font-medium">Back to News</span>
            </button>
            
            <div class="h-6 w-px bg-gray-200"></div>
            
            <div>
              <h1 class="text-lg font-semibold text-gray-900">{{ newsDetails?.category?.name || 'News Article' }}</h1>
              <p class="text-sm text-gray-500">{{ newsDetails?.station?.name || 'Capital FM' }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <button 
              @click="shareArticle"
              class="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Share class="w-5 h-5" />
            </button>
            <button 
              @click="toggleBookmark"
              class="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bookmark class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="w-8 h-8 border-2 border-gray-300 border-t-[#F8CB00] rounded-full animate-spin"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <AlertCircle class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Article Not Found</h3>
      <p class="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
      <button 
        @click="$router.go(-1)"
        class="px-6 py-2 bg-[#F8CB00] text-black rounded-lg hover:bg-[#F8CB00]/90 transition-colors font-medium"
      >
        Go Back
      </button>
    </div>

    <!-- Main Content -->
    <div v-else-if="newsDetails" class="max-w-4xl mx-auto px-6 py-8">
      <!-- Original Article -->
      <article id="article-content" class="bg-white rounded-xl border border-gray-200 shadow-sm mb-8 overflow-hidden hover:shadow-md transition-shadow">
        <div class="p-8">
          <!-- Article Header -->
          <div class="mb-6">
            <!-- Status Badges -->
            <div class="flex items-center space-x-2 mb-4">
              <span v-if="newsDetails.is_breaking" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                <AlertCircle class="w-3 h-3 mr-1" />
                Breaking
              </span>
              <span v-if="newsDetails.is_featured" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                <Star class="w-3 h-3 mr-1" />
                Featured
              </span>
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :style="{ backgroundColor: newsDetails.category?.color + '20', color: newsDetails.category?.color }"
              >
                {{ newsDetails.category?.name }}
              </span>
            </div>
            
            <!-- Article Title -->
            <h2 class="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {{ newsDetails.title }}
            </h2>
            
            <!-- Article Meta -->
            <div class="flex items-center space-x-6 text-sm text-gray-500 mb-6">
              <div class="flex items-center space-x-2">
                <img 
                  :src="newsDetails.author?.image_url || '/default-avatar.png'" 
                  :alt="newsDetails.author?.name"
                  class="w-6 h-6 rounded-full object-cover"
                />
                <span class="font-medium">{{ newsDetails.author?.name }}</span>
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
                class="text-gray-900 leading-relaxed"
              ></div>
            </div>

            <!-- Gallery Section -->
            <div v-if="newsDetails.gallery_images?.length" class="mt-8">
              <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Image class="h-5 w-5 text-[#F8CB00]" />
                Photo Gallery
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="(image, index) in newsDetails.gallery_images" 
                  :key="image.id"
                  class="relative group cursor-pointer overflow-hidden rounded-lg"
                  @click="openGallery(index)"
                >
                  <img 
                    :src="image.url" 
                    :alt="image.alt || `Gallery image ${index + 1}`"
                    class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn class="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div v-if="newsDetails.tags?.length" class="mt-8 pt-6 border-t border-gray-200">
              <h4 class="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Hash class="h-4 w-4 text-[#F8CB00]" />
                Tags
              </h4>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="tag in newsDetails.tags" 
                  :key="tag"
                  class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
          </div>

          <!-- Article Stats and Actions -->
          <div class="border-t border-gray-200 pt-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-6 text-sm text-gray-500">
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
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  :class="{ 'bg-red-50 border-red-300 text-red-600': isLiked }"
                >
                  <Heart class="w-4 h-4 mr-1" :class="{ 'fill-current': isLiked }" />
                  {{ isLiked ? 'Liked' : 'Like' }}
                </button>
                
                <button 
                  @click="shareArticle"
                  class="inline-flex items-center px-4 py-2 bg-[#F8CB00] text-black rounded-lg hover:bg-[#F8CB00]/90 transition-colors text-sm font-medium"
                >
                  <Share class="w-4 h-4 mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- Station Info Card -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-8 h-8 bg-[#F8CB00]/20 rounded-lg flex items-center justify-center">
            <Radio class="w-4 h-4 text-[#F8CB00]" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Listen to {{ newsDetails.station?.name || 'Capital FM' }}</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Station Info -->
          <div class="md:col-span-2">
            <div class="flex items-center gap-4 mb-4">
              <div class="w-16 h-16 bg-gradient-to-br from-[#F8CB00] to-orange-500 rounded-lg flex items-center justify-center">
                <Radio class="h-8 w-8 text-white" />
              </div>
              <div>
                <p class="text-gray-900 font-semibold">{{ newsDetails.station?.frequency || '91.3' }} FM</p>
                <p class="text-gray-500 text-sm">{{ newsDetails.station?.tagline || 'Fresh Hits for Uganda' }}</p>
              </div>
            </div>
            
            <p class="text-gray-600 text-sm mb-4">
              Stay updated with the latest news, music, and entertainment from Uganda's premier radio station.
            </p>
            
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-1 text-green-600">
                <div class="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                <span>{{ formatNumber(newsDetails.station?.listeners || 15000) }} listeners</span>
              </div>
              <div class="text-gray-400">{{ newsDetails.station?.streaming_status || 'Live' }}</div>
            </div>
          </div>
          
          <!-- Listen Live Button -->
          <div class="flex items-center">
            <button 
              @click="togglePlayPause"
              :disabled="audioLoading"
              class="w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-[#F8CB00] to-orange-500 text-white hover:shadow-lg disabled:opacity-50"
            >
              <div v-if="audioLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <component v-else :is="isPlaying ? Pause : Play" class="h-4 w-4" />
              <span>{{ audioLoading ? 'Connecting...' : isPlaying ? 'Live Now' : 'Listen Live' }}</span>
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
            class="max-w-full max-h-full object-contain rounded-lg"
          />
          
          <!-- Close button -->
          <button 
            @click="closeGallery"
            class="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X class="h-6 w-6" />
          </button>
          
          <!-- Navigation buttons -->
          <button 
            v-if="currentGalleryIndex > 0"
            @click.stop="previousImage"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ChevronLeft class="h-6 w-6" />
          </button>
          <button 
            v-if="currentGalleryIndex < newsDetails.gallery_images.length - 1"
            @click.stop="nextImage"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ChevronRight class="h-6 w-6" />
          </button>

          <!-- Image counter -->
          <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
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
          class="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-lg p-4 shadow-xl max-w-sm"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center"
                 :class="toast.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
              <Check v-if="toast.type === 'success'" class="h-4 w-4" />
              <AlertCircle v-else class="h-4 w-4" />
            </div>
            <div>
              <p class="text-gray-900 font-medium">{{ toast.message }}</p>
            </div>
            <button @click="hideToast" class="text-gray-400 hover:text-gray-600">
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
  });
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
      showToast('Link copied to clipboard!');
    }
  } catch (err) {
    console.error('Failed to share:', err);
    showToast('Failed to share article', 'error');
  }
};

const toggleBookmark = () => {
  showToast('Article bookmarked!');
};

const toggleLike = () => {
  isLiked.value = !isLiked.value;
  showToast(isLiked.value ? 'Article liked!' : 'Like removed');
};

const togglePlayPause = async () => {
  try {
    await store.dispatch('togglePlayPause');
  } catch (err) {
    console.error('Failed to toggle playback:', err);
    showToast('Failed to control audio player', 'error');
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
/* Custom prose styles for article content */
.prose :deep(p) {
  @apply mb-6 text-gray-700 leading-relaxed;
}

.prose :deep(h1) {
  @apply text-2xl font-bold text-gray-900 mb-4 mt-6;
}

.prose :deep(h2) {
  @apply text-xl font-bold text-gray-900 mb-3 mt-6;
}

.prose :deep(h3) {
  @apply text-lg font-semibold text-gray-900 mb-3 mt-4;
}

.prose :deep(blockquote) {
  @apply border-l-4 border-[#F8CB00] pl-6 py-2 italic text-gray-600 bg-gray-50 rounded-r-lg my-6;
}

.prose :deep(ul) {
  @apply list-disc list-inside space-y-2 text-gray-700 mb-6;
}

.prose :deep(ol) {
  @apply list-decimal list-inside space-y-2 text-gray-700 mb-6;
}

</style>