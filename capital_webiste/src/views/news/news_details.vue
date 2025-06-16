<template>
    <div class="min-h-screen bg-slate-900">
      <!-- Loading State -->
      <div v-if="isLoading" class="container mx-auto px-4 py-16">
        <div class="animate-pulse">
          <div class="h-8 bg-slate-700 rounded w-3/4 mb-4"></div>
          <div class="h-64 bg-slate-700 rounded mb-6"></div>
          <div class="space-y-3">
            <div class="h-4 bg-slate-700 rounded"></div>
            <div class="h-4 bg-slate-700 rounded w-5/6"></div>
            <div class="h-4 bg-slate-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
   
      <!-- Error State -->
      <div v-else-if="error" class="container mx-auto px-4 py-16 text-center">
        <div class="bg-slate-800/50 rounded-xl p-8 max-w-md mx-auto">
          <AlertCircle class="h-16 w-16 text-capital-red mx-auto mb-4" />
          <h2 class="text-2xl font-bold text-white mb-2">Article Not Found</h2>
          <p class="text-slate-400 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <router-link 
            to="/news" 
            class="inline-flex items-center gap-2 px-6 py-3 bg-capital-blue rounded-lg text-white font-medium hover:bg-capital-purple transition-colors"
          >
            <ArrowLeft class="h-4 w-4" />
            Back to News
          </router-link>
        </div>
      </div>
   
      <!-- Article Content -->
      <article v-else-if="newsDetails" class="relative">
        <!-- Hero Section -->
        <div class="relative h-[70vh] overflow-hidden">
          <img 
            :src="newsDetails.featured_image_url" 
            :alt="newsDetails.title"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
          
          <!-- Article Header -->
          <div class="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div class="container mx-auto">
              <!-- Breadcrumb & Category -->
              <div class="flex items-center gap-4 mb-4">
                <router-link to="/" class="text-slate-400 hover:text-capital-blue text-sm transition-colors">
                  Home
                </router-link>
                <ChevronRight class="h-4 w-4 text-slate-500" />
                <router-link to="/news" class="text-slate-400 hover:text-capital-blue text-sm transition-colors">
                  News
                </router-link>
                <ChevronRight class="h-4 w-4 text-slate-500" />
                <span 
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :style="{ backgroundColor: newsDetails.category?.color + '20', color: newsDetails.category?.color }"
                >
                  {{ newsDetails.category?.name }}
                </span>
              </div>
   
              <!-- Breaking News Badge -->
              <div v-if="newsDetails.is_breaking" class="flex items-center gap-2 mb-4">
                <div class="bg-capital-red px-3 py-1 rounded-md flex items-center gap-2">
                  <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span class="text-xs font-bold text-white uppercase">Breaking News</span>
                </div>
              </div>
   
              <!-- Featured Badge -->
              <div v-if="newsDetails.is_featured" class="flex items-center gap-2 mb-4">
                <div class="bg-capital-yellow px-3 py-1 rounded-md flex items-center gap-2">
                  <Star class="w-3 h-3 text-slate-900" />
                  <span class="text-xs font-bold text-slate-900 uppercase">Featured</span>
                </div>
              </div>
   
              <!-- Title -->
              <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                {{ newsDetails.title }}
              </h1>
   
              <!-- Excerpt -->
              <p class="text-xl text-slate-300 mb-6 max-w-4xl">
                {{ newsDetails.excerpt }}
              </p>
   
              <!-- Article Meta -->
              <div class="flex flex-wrap items-center gap-6 text-sm">
                <div class="flex items-center gap-2">
                  <img 
                    :src="newsDetails.author?.image_url || '/placeholder-avatar.jpg'" 
                    :alt="newsDetails.author?.name"
                    class="w-8 h-8 rounded-full object-cover"
                    @error="$event.target.src = '/placeholder-avatar.jpg'"
                  />
                  <span class="text-capital-yellow font-medium">{{ newsDetails.author?.name }}</span>
                </div>
                
                <div class="flex items-center gap-1 text-slate-400">
                  <Calendar class="h-4 w-4" />
                  <span>{{ formatDate(newsDetails.published_at) }}</span>
                </div>
                
                <div class="flex items-center gap-1 text-slate-400">
                  <Clock class="h-4 w-4" />
                  <span>{{ newsDetails.reading_time }} min read</span>
                </div>
                
                <div class="flex items-center gap-1 text-slate-400">
                  <Eye class="h-4 w-4" />
                  <span>{{ formatNumber(newsDetails.views_count) }} views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
   
        <!-- Article Body -->
        <div class="bg-slate-900 relative z-10">
          <div class="container mx-auto px-4 py-12">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <!-- Main Content -->
              <div class="lg:col-span-8">
                <!-- Social Share Sticky -->
                <div class="hidden lg:block fixed left-8 top-1/2 transform -translate-y-1/2 z-20">
                  <div class="bg-slate-800/80 backdrop-blur-sm rounded-xl p-3 space-y-3">
                    <button 
                      @click="shareOnFacebook"
                      class="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors group"
                      title="Share on Facebook"
                    >
                      <Facebook class="h-5 w-5 text-white" />
                    </button>
                    <button 
                      @click="shareOnTwitter"
                      class="w-10 h-10 bg-sky-500 hover:bg-sky-600 rounded-lg flex items-center justify-center transition-colors group"
                      title="Share on Twitter"
                    >
                      <Twitter class="h-5 w-5 text-white" />
                    </button>
                    <button 
                      @click="shareOnWhatsApp"
                      class="w-10 h-10 bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center transition-colors group"
                      title="Share on WhatsApp"
                    >
                      <MessageCircle class="h-5 w-5 text-white" />
                    </button>
                    <button 
                      @click="copyLink" 
                      class="w-10 h-10 bg-slate-600 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors group"
                      title="Copy Link"
                    >
                      <Link class="h-5 w-5 text-white" />
                    </button>
                    <div class="text-center text-xs text-slate-400 mt-2">
                      {{ formatNumber(newsDetails.shares_count) }}
                    </div>
                  </div>
                </div>
   
                <!-- Article Content -->
                <div class="prose prose-lg prose-invert max-w-none">
                  <div 
                    v-html="newsDetails.content" 
                    class="text-slate-300 leading-relaxed space-y-6"
                  ></div>
                </div>
   
                <!-- Gallery Section -->
                <div v-if="newsDetails.gallery_images?.length" class="mt-12">
                  <h3 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Image class="h-6 w-6 text-capital-blue" />
                    Photo Gallery
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div 
                      v-for="(image, index) in newsDetails.gallery_images" 
                      :key="image.id"
                      class="relative group cursor-pointer overflow-hidden rounded-lg bg-slate-800"
                      @click="openGallery(index)"
                    >
                      <img 
                        :src="image.url" 
                        :alt="image.alt || `Gallery image ${index + 1}`"
                        class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                        @error="$event.target.src = '/placeholder-image.jpg'"
                      />
                      <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ZoomIn class="h-8 w-8 text-white" />
                      </div>
                      <div v-if="image.caption" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <p class="text-white text-sm">{{ image.caption }}</p>
                      </div>
                    </div>
                  </div>
                </div>
   
                <!-- Tags -->
                <div v-if="newsDetails.tags?.length" class="mt-12 pt-8 border-t border-slate-700">
                  <h4 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Hash class="h-5 w-5 text-capital-blue" />
                    Tags
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="tag in newsDetails.tags" 
                      :key="tag"
                      class="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      #{{ tag }}
                    </span>
                  </div>
                </div>
   
                <!-- Source Attribution -->
                <div v-if="newsDetails.source" class="mt-8 p-4 bg-slate-800/50 rounded-lg border-l-4 border-capital-blue">
                  <p class="text-sm text-slate-400 mb-1">Source:</p>
                  <a 
                    :href="newsDetails.source_url" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="text-capital-blue hover:text-capital-yellow transition-colors font-medium flex items-center gap-1"
                  >
                    {{ newsDetails.source }}
                    <ExternalLink class="h-4 w-4" />
                  </a>
                </div>
   
                <!-- Mobile Social Share -->
                <div class="lg:hidden mt-8 flex justify-center gap-4">
                  <button 
                    @click="shareOnFacebook"
                    class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Facebook class="h-5 w-5 text-white" />
                    <span class="text-white font-medium">Share</span>
                  </button>
                  <button 
                    @click="shareOnTwitter"
                    class="flex-1 py-3 bg-sky-500 hover:bg-sky-600 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Twitter class="h-5 w-5 text-white" />
                    <span class="text-white font-medium">Tweet</span>
                  </button>
                  <button 
                    @click="copyLink" 
                    class="px-6 py-3 bg-slate-600 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Link class="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
   
              <!-- Sidebar -->
              <div class="lg:col-span-4 space-y-8">
                <!-- Station Info -->
                <div class="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h3 class="text-xl font-bold text-white mb-4">About {{ newsDetails.station?.name }}</h3>
                  <div class="flex items-center gap-4 mb-4">
                    <div class="w-16 h-16 bg-gradient-to-br from-capital-blue to-capital-purple rounded-lg flex items-center justify-center">
                      <Radio class="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <p class="text-white font-semibold">{{ newsDetails.station?.frequency }} FM</p>
                      <p class="text-slate-400 text-sm">{{ newsDetails.station?.tagline }}</p>
                    </div>
                  </div>
                  <div class="flex items-center justify-between text-sm mb-4">
                    <div class="flex items-center gap-1 text-capital-green">
                      <div class="w-2 h-2 bg-capital-green rounded-full animate-pulse"></div>
                      <span>{{ formatNumber(newsDetails.station?.listeners) }} listeners</span>
                    </div>
                    <div class="text-slate-400 capitalize">{{ newsDetails.station?.streaming_status }}</div>
                  </div>
                  <button 
                    @click="togglePlayPause"
                    :disabled="audioLoading"
                    class="w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                    :class="[
                      isPlaying 
                        ? 'bg-gradient-to-r from-capital-green to-green-600 text-white' 
                        : 'bg-gradient-to-r from-capital-blue to-capital-purple text-white',
                      audioLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
                    ]"
                  >
                    <div v-if="audioLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <component v-else :is="isPlaying ? Pause : Play" class="h-4 w-4" />
                    <span>{{ audioLoading ? 'Connecting...' : isPlaying ? 'Live Now' : 'Listen Live' }}</span>
                  </button>
                </div>
   
                <!-- Article Stats -->
                <div class="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                  <h3 class="text-xl font-bold text-white mb-4">Article Stats</h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="text-center p-3 bg-slate-700/50 rounded-lg">
                      <Eye class="h-6 w-6 text-capital-blue mx-auto mb-2" />
                      <div class="text-xl font-bold text-white">{{ formatNumber(newsDetails.views_count) }}</div>
                      <div class="text-xs text-slate-400">Views</div>
                    </div>
                    <div class="text-center p-3 bg-slate-700/50 rounded-lg">
                      <Heart class="h-6 w-6 text-capital-red mx-auto mb-2" />
                      <div class="text-xl font-bold text-white">{{ formatNumber(newsDetails.likes_count) }}</div>
                      <div class="text-xs text-slate-400">Likes</div>
                    </div>
                    <div class="text-center p-3 bg-slate-700/50 rounded-lg">
                      <Share class="h-6 w-6 text-capital-yellow mx-auto mb-2" />
                      <div class="text-xl font-bold text-white">{{ formatNumber(newsDetails.shares_count) }}</div>
                      <div class="text-xs text-slate-400">Shares</div>
                    </div>
                    <div class="text-center p-3 bg-slate-700/50 rounded-lg">
                      <MessageSquare class="h-6 w-6 text-capital-green mx-auto mb-2" />
                      <div class="text-xl font-bold text-white">{{ formatNumber(newsDetails.comments_count) }}</div>
                      <div class="text-xs text-slate-400">Comments</div>
                    </div>
                  </div>
                </div>
   
                <!-- Newsletter Signup -->
                <div class="bg-gradient-to-br from-capital-blue/20 to-capital-purple/20 rounded-xl p-6 border border-capital-blue/30">
                  <h3 class="text-xl font-bold text-white mb-3">Stay Updated</h3>
                  <p class="text-slate-300 text-sm mb-4">Get the latest news and updates from {{ newsDetails.station?.name }}</p>
                  <div class="space-y-3">
                    <input 
                      v-model="newsletterEmail"
                      type="email" 
                      placeholder="Your email address"
                      class="w-full bg-slate-800 border border-slate-600 rounded-lg py-2 px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-capital-blue"
                    />
                    <button 
                      @click="subscribeNewsletter"
                      :disabled="!newsletterEmail || subscribing"
                      class="w-full py-2 bg-capital-blue hover:bg-capital-purple rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {{ subscribing ? 'Subscribing...' : 'Subscribe' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
   
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
            class="fixed bottom-4 right-4 z-50 bg-slate-800 border border-slate-700 rounded-lg p-4 shadow-xl max-w-sm"
          >
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full flex items-center justify-center"
                   :class="toast.type === 'success' ? 'bg-capital-green' : 'bg-capital-red'">
                <Check v-if="toast.type === 'success'" class="h-4 w-4 text-white" />
                <AlertCircle v-else class="h-4 w-4 text-white" />
              </div>
              <div>
                <p class="text-white font-medium">{{ toast.message }}</p>
              </div>
              <button @click="hideToast" class="text-slate-400 hover:text-white">
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
    ChevronRight, Calendar, Clock, Eye, Facebook, Twitter, MessageCircle, Link,
    Radio, ZoomIn, X, ChevronLeft, Star, Hash, Image, ExternalLink,
    Heart, Share, MessageSquare, Play, Pause, Check, AlertCircle, ArrowLeft
   } from 'lucide-vue-next';
   
   const store = useStore();
   const route = useRoute();
   const router = useRouter();
   
   // Reactive data
   const isLoading = ref(true);
   const error = ref(false);
   const galleryOpen = ref(false);
   const currentGalleryIndex = ref(0);
   const newsletterEmail = ref('');
   const subscribing = ref(false);
   const toast = ref({ show: false, message: '', type: 'success' });
   
   // Computed properties
   const newsDetails = computed(() => store.getters.news_details);
   const isPlaying = computed(() => store.getters.isPlaying);
   const audioLoading = computed(() => store.getters.isLoading);
   
  
   
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
   };
   
   const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toString() || '0';
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
   
   const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
      showToast('Failed to copy link', 'error');
    }
   };
   
   const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(newsDetails.value.title);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank');
   };
   
   const shareOnTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(newsDetails.value.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
   };
   
   const shareOnWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${newsDetails.value.title} - ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
   };
   
   const togglePlayPause = async () => {
    try {
      await store.dispatch('togglePlayPause');
    } catch (err) {
      console.error('Failed to toggle playback:', err);
      showToast('Failed to control audio player', 'error');
    }
   };
   
   const subscribeNewsletter = async () => {
    if (!newsletterEmail.value) return;
    
    subscribing.value = true;
    try {
      // Replace with actual newsletter subscription API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showToast('Successfully subscribed to newsletter!');
      newsletterEmail.value = '';
    } catch (err) {
      console.error('Newsletter subscription failed:', err);
      showToast('Failed to subscribe to newsletter', 'error');
    } finally {
      subscribing.value = false;
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


   watch(newsDetails, (newDetails) => {
  if (newDetails) {
    document.title = newDetails.title || 'News Details'
    
    // Update meta tags
    updateMetaTag('description', newDetails.description || 'News details from Capital Radio')
    updateMetaTag('og:title', newDetails.title || 'Capital Radio - News Details')
    updateMetaTag('og:description', newDetails.description || 'News details from Capital Radio')
  }
}, { immediate: true })

function updateMetaTag(property, content) {
  let element = document.querySelector(`meta[property="${property}"]`) || 
                document.querySelector(`meta[name="${property}"]`)
  
  if (element) {
    element.setAttribute('content', content)
  }
}
   </script>
   
   <style scoped>
   /* Custom prose styles for article content */
   .prose :deep(p) {
    @apply mb-6 text-slate-300 leading-relaxed;
   }
   
   .prose :deep(h1) {
    @apply text-3xl font-bold text-white mb-6 mt-8;
   }
   
   .prose :deep(h2) {
    @apply text-2xl font-bold text-white mb-4 mt-8;
   }
   
   .prose :deep(h3) {
    @apply text-xl font-bold text-white mb-4 mt-6;
   }
   
   .prose :deep(h4) {
    @apply text-lg font-semibold text-white mb-3 mt-4;
   }
   
   .prose :deep(blockquote) {
    @apply border-l-4 border-capital-blue pl-6 py-2 italic text-slate-400 bg-slate-800/30 rounded-r-lg my-6;
   }
   
   .prose :deep(ul) {
    @apply list-disc list-inside space-y-2 text-slate-300 mb-6;
   }
   
   .prose :deep(ol) {
    @apply list-decimal list-inside space-y-2 text-slate-300 mb-6;
   }
   
   .prose :deep(li) {
    @apply text-slate-300;
   }
   
   .prose :deep(a) {
    @apply text-capital-blue hover:text-capital-yellow transition-colors underline;
   }
   
   .prose :deep(img) {
    @apply rounded-lg shadow-lg my-8 w-full;
   }
   
   .prose :deep(strong) {
    @apply text-white font-semibold;
   }
   
   .prose :deep(em) {
    @apply text-slate-400 italic;
}
.prose :deep(code) {
@apply bg-slate-800 text-capital-yellow px-2 py-1 rounded text-sm font-mono;
}
.prose :deep(pre) {
@apply bg-slate-800 p-4 rounded-lg overflow-x-auto my-6;
}
.prose :deep(table) {
@apply w-full border-collapse border border-slate-700 my-6;
}
.prose :deep(th) {
@apply border border-slate-700 px-4 py-2 bg-slate-800 text-white font-semibold;
}
.prose :deep(td) {
@apply border border-slate-700 px-4 py-2 text-slate-300;
}
/* Smooth scrolling for anchor links */
html {
scroll-behavior: smooth;
}
/* Custom scrollbar /
.prose :deep() {
scrollbar-width: thin;
scrollbar-color: #64748b #1e293b;
}
.prose :deep(*::-webkit-scrollbar) {
width: 6px;
}
.prose :deep(*::-webkit-scrollbar-track) {
background: #1e293b;
}
.prose :deep(*::-webkit-scrollbar-thumb) {
background: #64748b;
border-radius: 3px;
}
.prose :deep(*::-webkit-scrollbar-thumb:hover) {
background: #94a3b8;
}
/* Image gallery hover effects */
.prose :deep(img) {
transition: transform 0.3s ease;
}
.prose :deep(img:hover) {
transform: scale(1.02);
cursor: pointer;
}
/* Focus styles for accessibility */
button:focus-visible,
a:focus-visible,
input:focus-visible {
outline: 2px solid #00a7e1;
outline-offset: 2px;
}
/* Loading animation for images */
img {
background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
background-size: 200% 100%;
animation: loading 1.5s infinite;
}
@keyframes loading {
0% {
background-position: 200% 0;
}
100% {
background-position: -200% 0;
}
}
img[src] {
animation: none;
}
/* Responsive video embeds */
.prose :deep(iframe) {
@apply w-full aspect-video rounded-lg my-6;
}
/* Print styles */
@media print {
.prose {
@apply text-black;
}
.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3),
.prose :deep(h4) {
@apply text-black;
}
.prose :deep(a) {
@apply text-blue-600 no-underline;
}
.prose :deep(a::after) {
content: " (" attr(href) ")";
font-size: 0.8em;
color: #666;
}
}
</style>