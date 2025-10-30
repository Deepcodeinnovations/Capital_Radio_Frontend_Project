<template>
  <div>
    <!-- Minimalist Header -->
    <header 
      class="bg-black shadow-lg fixed top-0 left-0 right-0 z-50 transition-transform duration-300"
      :class="headerVisible ? 'translate-y-0' : '-translate-y-full'"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Top Bar -->
        <div class="border-b border-gray-800 py-2 hidden lg:block">
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center space-x-6 text-gray-400">
              <a href="tel:+256414215100" class="hover:text-[#F8CB00] transition-colors flex items-center space-x-1.5">
                <Phone :size="12" />
                <span>+256 414 215 100</span>
              </a>
              <a href="mailto:info@capitalfm.co.ug" class="hover:text-[#F8CB00] transition-colors flex items-center space-x-1.5">
                <Mail :size="12" />
                <span>info@capitalfm.co.ug</span>
              </a>
            </div>
            <div class="flex items-center space-x-3">
              <button
                @click="showAdvertiseModal = true"
                class="text-gray-400 hover:text-[#F8CB00] transition-colors font-medium"
              >
                Advertise With Us
              </button>
              <span class="text-gray-700">|</span>
              <a
                v-for="(social, index) in socialLinks"
                :key="index"
                :href="social.href"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-500 hover:text-[#F8CB00] transition-colors"
              >
                <component :is="social.icon" :size="14" />
              </a>
            </div>
          </div>
        </div>

        <!-- Main Navigation -->
        <div class="flex items-center justify-between h-20">
          <!-- Logo -->
          <router-link :to="{ name: 'welcome' }" class="flex items-center space-x-3">
            <img src="/logo2.png" alt="Capital FM" class="h-12 sm:h-14 w-auto" />
            <div class="hidden sm:block">
              <div class="font-bold text-xl text-white">CAPITAL FM</div>
              <div class="text-[#F8CB00] text-xs font-medium">91.3 MHz</div>
            </div>
          </router-link>

          <!-- Desktop Navigation -->
          <nav class="hidden lg:flex items-center space-x-8">
            <router-link
              v-for="(item, index) in navItems"
              :key="index"
              :to="{ name: item.to }"
              :class="$route.name === item.to ? 'text-[#F8CB00] font-semibold' : 'text-gray-300 hover:text-[#F8CB00]'"
              class="text-sm font-medium transition-colors"
            >
              {{ item.label }}
            </router-link>
          </nav>

          <!-- Actions -->
          <div class="flex items-center space-x-4">
            <!-- Listen Live Button -->
            <button
              @click="togglePlayPause"
              :disabled="isLoading"
              :class="[
                'px-6 py-2.5 text-sm font-semibold transition-all flex items-center space-x-2 rounded-full',
                isPlaying
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-[#F8CB00] text-black hover:bg-yellow-500',
              ]"
            >
              <div v-if="isLoading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <Volume2 v-else-if="isPlaying" :size="16" />
              <Play v-else :size="16" />
              <span class="hidden sm:inline">{{ isPlaying ? 'LIVE' : 'LISTEN LIVE' }}</span>
            </button>

            <!-- Mobile Menu Toggle -->
            <button @click="toggleMenu" class="lg:hidden p-2 text-gray-300 hover:text-[#F8CB00]">
              <Menu v-if="!isOpen" :size="24" />
              <X v-else :size="24" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div v-if="isOpen" class="lg:hidden bg-black border-b border-gray-800 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-6 space-y-4">
          <router-link
            v-for="(item, index) in navItems"
            :key="index"
            :to="{ name: item.to }"
            @click="toggleMenu"
            :class="$route.name === item.to ? 'text-[#F8CB00] font-semibold' : 'text-gray-300'"
            class="block py-2 text-base font-medium hover:text-[#F8CB00] transition-colors"
          >
            {{ item.label }}
          </router-link>

          <div class="pt-4 border-t border-gray-800 space-y-3">
            <a href="tel:+256414215100" class="flex items-center space-x-2 text-sm text-gray-400 hover:text-[#F8CB00]">
              <Phone :size="14" />
              <span>+256 414 215 100</span>
            </a>
            <div class="flex items-center space-x-3">
              <a
                v-for="(social, index) in socialLinks"
                :key="index"
                :href="social.href"
                target="_blank"
                class="text-gray-500 hover:text-[#F8CB00]"
              >
                <component :is="social.icon" :size="18" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Advertise With Us Modal -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showAdvertiseModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="showAdvertiseModal = false">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Modal Header -->
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-[#F8CB00]/20 flex items-center justify-center">
                <Megaphone :size="20" class="text-[#F8CB00]" />
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-900">Advertise With Us</h2>
                <p class="text-sm text-gray-600">Reach millions across Uganda</p>
              </div>
            </div>
            <button @click="showAdvertiseModal = false" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X :size="20" class="text-gray-600" />
            </button>
          </div>

          <!-- Modal Content -->
          <div class="p-6">
            <p class="text-gray-700 mb-6">
              Partner with Capital FM and reach our vast audience across Uganda. Choose from our advertising options:
            </p>

            <!-- Advertising Options -->
            <div class="space-y-4">
              <!-- Radio Adverts -->
              <div class="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-[#F8CB00] transition-all cursor-pointer group">
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-lg bg-[#F8CB00]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#F8CB00]/30 transition-colors">
                    <Radio :size="24" class="text-[#F8CB00]" />
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#F8CB00] transition-colors">Radio Adverts</h3>
                    <p class="text-gray-600 text-sm mb-4">
                      Broadcast your message to millions of listeners across Uganda. Our radio spots reach audiences during peak times with high engagement rates.
                    </p>
                    <ul class="space-y-2 text-sm text-gray-700">
                      <li class="flex items-center gap-2">
                        <div class="w-1.5 h-1.5 rounded-full bg-[#F8CB00]"></div>
                        30-second and 60-second spots available
                      </li>
                      <li class="flex items-center gap-2">
                        <div class="w-1.5 h-1.5 rounded-full bg-[#F8CB00]"></div>
                        Prime time and off-peak options
                      </li>
                      <li class="flex items-center gap-2">
                        <div class="w-1.5 h-1.5 rounded-full bg-[#F8CB00]"></div>
                        Professional production services
                      </li>
                      <li class="flex items-center gap-2">
                        <div class="w-1.5 h-1.5 rounded-full bg-[#F8CB00]"></div>
                        Campaign analytics and reporting
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Website Adverts -->
              <div class="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-[#F8CB00] transition-all cursor-pointer group">
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 rounded-lg bg-[#F8CB00]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#F8CB00]/30 transition-colors">
                    <Monitor :size="24" class="text-[#F8CB00]" />
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#F8CB00] transition-colors">Website Adverts</h3>
                    <p class="text-gray-600 text-sm mb-4">
                      Display your brand on our high-traffic website. Reach engaged online audiences with targeted digital advertising.
                    </p>
                    <ul class="space-y-2 text-sm text-gray-700">
                      <li class="flex items-center gap-2">
                        <div class="w-1.5 h-1.5 rounded-full bg-[#F8CB00]"></div>
                        Banner ads and display placements
                      </li>
                      <li class="flex items-center gap-2">
                        <div class="w-1.5 h-1.5 rounded-full bg-[#F8CB00]"></div>
                        Sponsored content opportunities
                      </li>
                      <li class="flex items-center gap-2">
                        <div class="w-1.5 h-1.5 rounded-full bg-[#F8CB00]"></div>
                        Video pre-roll and mid-roll ads
                      </li>
                      <li class="flex items-center gap-2">
                        <div class="w-1.5 h-1.5 rounded-full bg-[#F8CB00]"></div>
                        Detailed performance metrics
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="mt-6 bg-[#F8CB00]/10 rounded-xl p-6 border border-[#F8CB00]/30">
              <h4 class="font-bold text-gray-900 mb-3">Get Started Today</h4>
              <p class="text-sm text-gray-700 mb-4">
                Contact our advertising team to discuss your campaign needs and get a customized quote.
              </p>
              <div class="flex flex-col sm:flex-row gap-3">
                <a href="tel:+256414215100" class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#F8CB00] text-black rounded-lg hover:bg-yellow-500 transition-colors font-medium text-sm">
                  <Phone :size="16" />
                  <span>+256 414 215 100</span>
                </a>
                <a href="mailto:sales@capitalfm.co.ug" class="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
                  <Mail :size="16" />
                  <span> sales@capitalfm-ug.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Header Spacer -->
    <div class="h-20 lg:h-[108px]"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import { Menu, X, Play, Volume2, Facebook, Twitter, Instagram, Linkedin, Phone, Mail, Radio, Monitor, Megaphone } from "lucide-vue-next";

const store = useStore();
const isOpen = ref(false);
const showAdvertiseModal = ref(false);
const headerVisible = ref(true);
let lastScrollY = 0;
const scrollThreshold = 10;

const isPlaying = computed(() => store.getters.isPlaying);
const isLoading = computed(() => store.getters.isLoading);

const navItems = [
  { label: "Home", to: "welcome" },
  { label: "Shows", to: "radio_shows" },
  { label: "News", to: "news" },
  { label: "Events", to: "events" },
  { label: "Forums", to: "forums" },
  { label: "About", to: "about_us" },
];

const socialLinks = [
  { icon: Facebook, href: "#" },
  { icon: Twitter, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Linkedin, href: "#" },
];

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const togglePlayPause = async () => {
  try {
    await store.dispatch("togglePlayPause");
  } catch (err) {
    console.error("Failed to toggle playback:", err);
  }
};

const handleScroll = () => {
  const currentScrollY = window.scrollY;
  
  // Show header when at top of page
  if (currentScrollY < 50) {
    headerVisible.value = true;
  }
  // Show header when scrolling up
  else if (currentScrollY < lastScrollY - scrollThreshold) {
    headerVisible.value = true;
  }
  // Hide header when scrolling down
  else if (currentScrollY > lastScrollY + scrollThreshold && currentScrollY > 100) {
    headerVisible.value = false;
  }
  
  lastScrollY = currentScrollY;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
