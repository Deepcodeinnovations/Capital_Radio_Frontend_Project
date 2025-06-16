<template>
  <nav class="fixed w-full top-0 z-50 transition-all duration-300" 
       :class="scrolled ? 'bg-slate-900/95 backdrop-blur-xl shadow-2xl border-b border-slate-700/50' : 'bg-slate-900/90 backdrop-blur-md'">
    
    <!-- Breaking News Ticker -->
    <div class="bg-gradient-to-r from-capital-blue via-capital-purple to-capital-blue py-1 sm:py-2 relative overflow-hidden">
      <div class=" mx-auto px-2 sm:px-2">
        <div class="flex items-center gap-2 sm:gap-2">
          
          <!-- Breaking News Label -->
          <div class="flex-shrink-0">
            <div class="bg-white/15 backdrop-blur-lg px-2 sm:px-3 py-1 rounded-md sm:rounded-lg border border-white/30">
              <div class="flex items-center gap-1 sm:gap-2">
                <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-capital-yellow rounded-full animate-pulse"></div>
                <span class="text-white font-bold text-xs sm:text-xs uppercase tracking-wider">
                  <span class="hidden sm:inline">Breaking News </span>
                  <span v-if="currentNewsItem" class="sm:hidden">{{ currentNewsItem?.category?.name }}</span>
                </span>
              </div>
            </div>
          </div>
          
          <!-- News Content -->
          <div class="flex-1 overflow-hidden h-4 sm:h-6" v-if="currentNewsItem" >
            <router-link :to="{name: 'news_details', params: {id: currentNewsItem.slug ?? 'Not Found'}}" class="ticker-wrapper h-full">
              <div class="ticker-content h-full">
                <transition-group 
                  name="news-slide" 
                  tag="div" 
                  class="relative h-full w-full">
                  <div 
                    
                    :key="currentNewsIndex"
                    class="absolute inset-0 flex items-center justify-start px-2">
                    <p class="text-white font-medium text-xs sm:text-sm truncate w-full">
                      {{ currentNewsItem.title }}
                    </p>
                  </div>
                </transition-group>
              </div>
            </router-link>
          </div>
          
        </div>
      </div>
    </div>

    <!-- Main Navigation -->
    <div class="container mx-auto px-2 sm:px-4">
      <div class="flex items-center justify-between h-14 sm:h-16">
        
        <!-- Logo -->
        <div class="flex items-center">
          <router-link :to="{name: 'welcome'}" class="flex items-center gap-2 sm:gap-3 group">
            <div class="relative">
              <div class="absolute -inset-1 bg-gradient-to-r from-capital-blue to-capital-purple rounded-lg sm:rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div class="relative p-1.5 sm:p-2 bg-slate-800 rounded-lg sm:rounded-xl border border-slate-700/50">
                <Radio class="h-5 w-5 sm:h-6 sm:w-6 text-capital-blue" />
              </div>
            </div>
            
            <div class="flex flex-col">
              <span class="font-bold text-lg sm:text-xl text-white group-hover:text-capital-blue transition-colors">
                <span class="hidden sm:inline">{{ currentStation?.name || 'Capital FM' }}</span>
                <span class="sm:hidden">{{ currentStation?.shortName || 'Capital' }}</span>
              </span>
              <div class="flex items-center gap-1 sm:gap-2 text-xs">
                <span class="text-capital-yellow font-semibold">{{ currentStation?.frequency || '91.3' }}</span>
                <div class="w-1 h-1 rounded-full bg-slate-500"></div>
                <span class="text-slate-400 hidden sm:inline">{{ currentStation?.tagline || 'Fresh Hits Uganda' }}</span>
                <span class="text-slate-400 sm:hidden">{{ currentStation?.shortTagline || 'Fresh Hits' }}</span>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden lg:flex lg:items-center lg:space-x-2">
          <NavLink 
            v-for="(item, index) in navItems" 
            :key="index" 
            :to="item.to" 
            :label="item.label" 
            :icon="item.icon"
            :active="$route.name === item.to.name" 
            @click="navigateToRoute(item.to)" 
          />
          
          <!-- Listen Live Button -->
          <div class="ml-4 xl:ml-6">
            <button @click="togglePlayPause" 
                    :disabled="isLoading"
                    class="flex items-center gap-2 px-4 xl:px-6 py-2 xl:py-3 rounded-lg xl:rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg text-sm xl:text-base"
                    :class="[
                      isPlaying 
                        ? 'bg-gradient-to-r from-capital-green to-green-600 text-white' 
                        : 'bg-gradient-to-r from-capital-blue to-capital-purple text-white',
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    ]">
              
              <div v-if="isLoading" class="w-3 h-3 xl:w-4 xl:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <component v-else :is="isPlaying ? Pause : Play" class="h-3 w-3 xl:h-4 xl:w-4" />
              
              <span class="font-bold">
                {{ isLoading ? 'Connecting...' : isPlaying ? 'Live Now' : 'Listen Live' }}
              </span>
            </button>
          </div>
        </div>

        <!-- Mobile Controls -->
        <div class="flex lg:hidden items-center gap-2 sm:gap-3">
          <!-- Mobile Play Button -->
          <button @click="togglePlayPause" 
                  :disabled="isLoading"
                  class="p-2 sm:p-3 rounded-lg transition-all duration-300"
                  :class="[
                    isPlaying 
                      ? 'bg-capital-green text-white' 
                      : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700',
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  ]">
            
            <div v-if="isLoading" class="w-4 h-4 sm:w-5 sm:h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            <component v-else :is="isPlaying ? Pause : Play" class="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          
          <!-- Menu Button -->
          <button @click="toggleMenu" class="p-2 sm:p-3 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-all">
            <Menu v-if="!isOpen" class="h-4 w-4 sm:h-5 sm:w-5" />
            <X v-else class="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-full opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-full opacity-0"
    >
      <div v-if="isOpen" class="lg:hidden bg-slate-900/98 backdrop-blur-xl border-b border-slate-700/50">
        <div class="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
          <div class="space-y-2">
            <router-link 
              v-for="(item, index) in navItems" 
              :key="index" 
              :to="item.to" 
              class="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 rounded-lg sm:rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all group"
              :class="$route.name === item.to.name ? 'text-white bg-gradient-to-r from-capital-blue/20 to-capital-purple/20 border border-capital-blue/30' : ''"
              @click="closeMenu"
            >
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all"
                   :class="$route.name === item.to.name ? 'bg-capital-blue text-white' : 'bg-slate-800 group-hover:bg-slate-700'">
                <component :is="item.icon" class="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              
              <span class="font-semibold text-base sm:text-lg">{{ item.label }}</span>
            </router-link>
            
            <!-- Mobile Listen Live Button -->
            <div class="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-700/50">
              <button @click="togglePlayPause" 
                      :disabled="isLoading"
                      class="w-full flex items-center justify-center gap-3 sm:gap-4 py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition-all shadow-xl"
                      :class="[
                        isPlaying 
                          ? 'bg-gradient-to-r from-capital-green to-green-600 text-white' 
                          : 'bg-gradient-to-r from-capital-blue to-capital-purple text-white',
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      ]">
                
                <div v-if="isLoading" class="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <component v-else :is="isPlaying ? Pause : Play" class="h-4 w-4 sm:h-5 sm:w-5" />
                
                <span>
                  {{ isLoading ? 'Connecting...' : isPlaying ? 'Live Now' : 'Listen Live' }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { Radio, Menu, X, Home, Users, Newspaper, Info, Calendar, Play, Pause } from 'lucide-vue-next';

const store = useStore();
const router = useRouter();
const route = useRoute();

const navItems = [
  { label: 'Home', to: { name: 'welcome' }, icon: Home },
  { label: 'Radio Shows', to: { name: 'radio_shows' }, icon: Users },
  { label: 'News', to: { name: 'news' }, icon: Newspaper },
  { label: 'Events', to: { name: 'events' }, icon: Calendar },
  { label: 'Forums', to: { name: 'forums' }, icon: Users },
  { label: 'About', to: { name: 'about_us' }, icon: Info }
];

const isOpen = ref(false);
const scrolled = ref(false);

// Breaking News State
const currentNewsIndex = ref(0);
const newsTimer = ref(null);

// Audio Player State
const isPlaying = computed(() => store.getters.isPlaying);
const isLoading = computed(() => store.getters.isLoading);
const currentStation = computed(() => store.getters.station);
const breaking_news = computed(() => store.getters.breakingnews);

// Simplified news items for slide-in effect
const newsItems = computed(() => {
  if (breaking_news.value?.data?.length) {
    return breaking_news.value.data;
  }
  return [
    { title: 'Capital FM - Uganda\'s premier radio station bringing you fresh hits 24/7' },
    { title: 'Stay tuned for the latest music, news and entertainment updates' },
    { title: 'Join our community and never miss your favorite shows' }
  ];
});

const currentNewsItem = computed(() => {
  return newsItems.value[currentNewsIndex.value] || newsItems.value[0];
});

// Display duration for each news item (in milliseconds)
const NEWS_DISPLAY_DURATION = 4000;

// Methods
const toggleMenu = () => isOpen.value = !isOpen.value;
const closeMenu = () => isOpen.value = false;
const handleScroll = () => scrolled.value = window.scrollY > 10;

const navigateToRoute = (routeObj) => {
  router.push(routeObj);
};

const togglePlayPause = async () => {
  try {
    await store.dispatch('togglePlayPause');
  } catch (err) {
    console.error('Failed to toggle playback:', err);
  }
};

const get_breaking_news = async () => {
  try {
    let data = {
      station_id: currentStation.value.id,
    }
    await store.dispatch('fetch_breaking_news', data);
  } catch (err) {
    console.error('Failed to fetch breaking news:', err);
  }
};

const nextNews = () => {
  if (newsItems.value.length > 1) {
    currentNewsIndex.value = (currentNewsIndex.value + 1) % newsItems.value.length;
  }
};

const startNewsTimer = () => {
  if (newsItems.value.length <= 1) return;
  
  stopNewsTimer();
  newsTimer.value = setInterval(() => {
    nextNews();
  }, NEWS_DISPLAY_DURATION);
};

const stopNewsTimer = () => {
  if (newsTimer.value) {
    clearInterval(newsTimer.value);
    newsTimer.value = null;
  }
};

// Watch for changes in news items to restart timer
watch(newsItems, (newItems) => {
  if (newItems.length > 1) {
    startNewsTimer();
  } else {
    stopNewsTimer();
  }
}, { immediate: true });

onMounted(() => {
  get_breaking_news();
  window.addEventListener('scroll', handleScroll);
  handleScroll();
  
  // Start the news cycle if we have multiple items
  if (newsItems.value.length > 1) {
    startNewsTimer();
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  stopNewsTimer();
});
</script>

<script>
export default {
  components: {
    NavLink: {
      props: { to: Object, label: String, icon: Object, active: Boolean },
      template: `
        <a href="#" class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all group"
           :class="active 
             ? 'text-white bg-gradient-to-r from-capital-blue/20 to-capital-purple/20 border border-capital-blue/50' 
             : 'text-slate-300 hover:text-white hover:bg-slate-800/50'"
           @click.prevent="$emit('click')">
          
          <component :is="icon" class="h-4 w-4" />
          <span>{{ label }}</span>
        </a>
      `
    }
  }
}
</script>

<style scoped>
/* News slide-in animation - bottom to top */
.ticker-wrapper {
  overflow: hidden;
  position: relative;
}

.ticker-content {
  display: flex;
  align-items: center;
  height: 100%;
}

/* Slide transition effects */
.news-slide-enter-active {
  transition: all 0.5s ease-out;
}

.news-slide-leave-active {
  transition: all 0.4s ease-in;
}

.news-slide-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.news-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.news-slide-enter-to,
.news-slide-leave-from {
  transform: translateY(0);
  opacity: 1;
}

/* Responsive timing adjustments */
@media (max-width: 640px) {
  .news-slide-enter-active {
    transition-duration: 0.4s;
  }
  
  .news-slide-leave-active {
    transition-duration: 0.3s;
  }
}
</style>