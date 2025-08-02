<template>
  <footer class="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
    <!-- Background Elements -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
      <div class="absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
    </div>

    <!-- Top Wave Divider -->
    <div class="absolute top-0 left-0 w-full">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="w-full h-16 fill-current text-white">
        <path d="M0,120 C400,40 800,80 1200,20 L1200,0 L0,0 Z"></path>
      </svg>
    </div>

    <div class="relative z-10 pt-24 pb-12">
      <div class="container mx-auto px-6">
        
        <!-- Main Footer Content -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">
          
          <!-- Station Info -->
          <div class="lg:col-span-1">
            <div class="flex items-center mb-6">
              <div class="h-[80px] md:h-[130px] pt-[10px] md:pt-[20px]">
                <img src="/logokiis.png" alt="KIIS FM 100.9 Logo" class="w-full h-full object-contain">
              </div>
            </div>
            
            <p class="text-gray-300 mb-6 leading-relaxed">
              KIIS 100.9 - Uganda's Contemporary Hit Radio Station that plays the HOTTEST MUSIC. Less Talk, More Music, No Clutter. Bringing you fresh hits for Uganda.
            </p>
            
            <!-- Social Media -->
            <div class="flex space-x-4">
              <a 
                v-for="(social, index) in socialLinks" 
                :key="index"
                :href="social.href" 
                class="group relative"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div class="absolute -inset-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full blur opacity-0 group-hover:opacity-60 transition duration-300"></div>
                <div class="relative w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <component :is="social.icon" class="w-5 h-5" />
                </div>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-xl font-bold mb-6 text-white">Quick Links</h3>
            <ul class="space-y-3">
              <li v-for="(item, index) in navItems" :key="index">
                <router-link 
                  :to="{ name: item.to }" 
                  class="text-gray-300 hover:text-pink-400 transition-colors flex items-center group"
                >
                  <ChevronRight class="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {{ item.label }}
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div>
            <h3 class="text-xl font-bold mb-6 text-white">Get in Touch</h3>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin class="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <p class="text-white font-medium">Studio Location</p>
                  <p class="text-gray-300 text-sm">Plot 1A, Cooper Road<br/>Kisementi, Kololo, Kampala<br/>P.O. Box 7638, Uganda</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Phone class="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p class="text-white font-medium">Call Us</p>
                  <p class="text-gray-300 text-sm">
                    <a href="tel:+256323501200" class="hover:text-pink-400 transition-colors">
                      Studio: +256 323 501200
                    </a><br/>
                    <a href="tel:+256414543672" class="hover:text-pink-400 transition-colors">
                      Office: +256 414 543672
                    </a>
                  </p>
                </div>
              </div>
              
              <div class="flex items-start space-x-3">
                <div class="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Mail class="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p class="text-white font-medium">Email Us</p>
                  <p class="text-gray-300 text-sm">
                    <a href="mailto:info@kiis1009.co.ug" class="hover:text-pink-400 transition-colors">
                      info@kiis1009.co.ug
                    </a><br/>
                    <a href="mailto:rolaboro@capitalfm-ug.com" class="hover:text-pink-400 transition-colors">
                      rolaboro@capitalfm-ug.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Frequency & Newsletter -->
          <div>
            <h3 class="text-xl font-bold mb-6 text-white">Tune In</h3>
            <div class="mb-8">
              <div class="bg-gradient-to-r from-pink-500/20 to-purple-600/20 rounded-2xl p-6 text-center hover:from-pink-500/30 hover:to-purple-600/30 transition-all group cursor-pointer border border-pink-400/30">
                <div class="text-3xl font-black text-transparent bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text group-hover:scale-110 transition-transform">
                  100.9 FM
                </div>
                <div class="text-sm text-gray-300 mt-1">Kampala, Uganda</div>
                <div class="text-xs text-pink-400 mt-2 font-semibold">Contemporary Hit Radio</div>
              </div>
            </div>

            <!-- Newsletter Signup -->
            <div class="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
              <h4 class="text-white font-semibold mb-3">Stay Updated</h4>
              <p class="text-gray-300 text-sm mb-4">Get the latest music updates, show schedules, and exclusive content.</p>
              <div class="flex gap-2">
                <input 
                  v-model="newsletterEmail"
                  type="email" 
                  placeholder="Your email" 
                  class="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                  @keyup.enter="subscribeNewsletter"
                />
                <button 
                  @click="subscribeNewsletter"
                  :disabled="!newsletterEmail || subscribing"
                  class="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-pink-400/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div v-if="subscribing" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <Send v-else class="w-4 h-4" />
                </button>
              </div>
              <div v-if="subscriptionMessage" class="mt-2 text-sm" :class="subscriptionSuccess ? 'text-green-400' : 'text-red-400'">
                {{ subscriptionMessage }}
              </div>
            </div>
          </div>
        </div>

        <!-- Live Status Bar -->
        <div class="bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl p-6 mb-12 border border-pink-400/30">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                <span class="text-pink-400 font-bold text-sm uppercase">ON AIR NOW</span>
              </div>
              <div class="text-white">
                <span class="font-semibold">{{ currentShow?.program?.title || 'Live Show' }}</span>
                <span class="text-gray-300 ml-2">with {{ getCurrentShowHosts() }}</span>
              </div>
            </div>
            <button 
              @click="togglePlayPause"
              :disabled="isLoading"
              class="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div v-if="isLoading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <Volume2 v-else-if="isPlaying" class="w-4 h-4 animate-bounce" />
              <Play v-else class="w-4 h-4" />
              <span>{{ isLoading ? 'Connecting...' : isPlaying ? 'On Air Live' : 'Listen Live' }}</span>
            </button>
          </div>
        </div>

        <!-- Bottom Section -->
        <div class="border-t border-gray-700/50 pt-8">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="text-gray-400 text-sm text-center md:text-left">
              <p>&copy; {{ currentYear }} KIIS FM 100.9 Uganda. All rights reserved.</p>
              <p class="mt-1">Contemporary Hit Radio - Less Talk, More Music, No Clutter</p>
              <p class="mt-2 flex items-center justify-center md:justify-start gap-2">
                <span>Powered by</span>
                <a 
                  href="https://deepcodeinnovations.com/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-pink-400 hover:text-purple-400 transition-colors font-semibold flex items-center gap-1 group"
                >
                  <Code class="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span>Deepcode Innovations</span>
                  <ExternalLink class="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                </a>
              </p>
            </div>
            
            <div class="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <a href="#" class="text-gray-400 hover:text-pink-400 transition-colors">Privacy Policy</a>
              <a href="#" class="text-gray-400 hover:text-pink-400 transition-colors">Terms of Service</a>
              <a href="#" class="text-gray-400 hover:text-pink-400 transition-colors">Advertise With Us</a>
              <a href="#" class="text-gray-400 hover:text-pink-400 transition-colors">Careers</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Elements -->
    <div class="absolute top-1/4 left-10 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-60"></div>
    <div class="absolute top-1/2 right-20 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-60" style="animation-delay: 1s;"></div>
    <div class="absolute bottom-1/4 left-1/3 w-2 h-2 bg-pink-500 rounded-full animate-ping opacity-60" style="animation-delay: 2s;"></div>

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
          class="fixed bottom-4 right-4 z-50 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-xl max-w-sm"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center"
                 :class="toast.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'">
              <Check v-if="toast.type === 'success'" class="h-4 w-4" />
              <AlertCircle v-else class="h-4 w-4" />
            </div>
            <div>
              <p class="text-white font-medium">{{ toast.message }}</p>
            </div>
            <button @click="hideToast" class="text-gray-400 hover:text-white">
              <X class="h-4 w-4" />
            </button>
          </div>
        </div>
      </transition>
    </teleport>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { 
  Radio, Facebook, Twitter, Instagram, Youtube, ChevronRight,
  MapPin, Phone, Mail, Send, Play, Volume2, Check, AlertCircle, X, Code, ExternalLink
} from 'lucide-vue-next';

const store = useStore();

// Reactive data
const newsletterEmail = ref('');
const subscribing = ref(false);
const subscriptionMessage = ref('');
const subscriptionSuccess = ref(false);
const toast = ref({ show: false, message: '', type: 'success' });

// Computed properties
const currentYear = computed(() => new Date().getFullYear());
const isPlaying = computed(() => store.getters.isPlaying);
const isLoading = computed(() => store.getters.isLoading);
const currentStation = computed(() => store.getters.station);

// Navigation items (matching header)
const navItems = [
  { label: 'Home', to: 'welcome' },
  { label: 'Radio Shows', to: 'radio_shows' },
  { label: 'News', to: 'news' },
  { label: 'Events', to: 'events' },
  { label: 'Forums', to: 'forums' },
  { label: 'About', to: 'about_us' }
];

// Social media links for KIIS FM Uganda
const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/Kiis100' },
  { icon: Twitter, href: 'https://twitter.com/KIIS_FM_Uganda' },
  { icon: Instagram, href: 'https://instagram.com/kiisfmuganda' },
  { icon: Youtube, href: 'https://youtube.com/c/KIISFMUganda' }
];

// Current show computed (matching hero functionality)
const currentShow = computed(() => {
  if (!currentStation.value?.schedule?.sessions) return null;
  
  const today = getCurrentDay();
  const todaySchedule = currentStation.value.schedule.sessions[today] || [];
  const currentTime = getCurrentTime();
  
  return todaySchedule.find(show => 
    isTimeBetween(currentTime, show.start_time, show.end_time)
  );
});

// Helper methods (matching hero functionality)
const getCurrentDay = () => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
};

const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};

const isTimeBetween = (currentTime, startTime, endTime) => {
  const current = currentTime.replace(':', '');
  const start = startTime.replace(':', '');
  const end = endTime.replace(':', '');
  
  if (end < start) {
    return current >= start || current <= end;
  }
  
  return current >= start && current <= end;
};

const getCurrentShowHosts = () => {
  if (!currentShow.value?.program?.hosts) return 'Live Presenters';
  
  const sessionHostIds = currentShow.value.hosts || [];
  const hosts = currentShow.value.program.hosts.filter(host => sessionHostIds.includes(host.id));
  return hosts.length > 0 ? hosts.map(h => h.name).join(' & ') : 'Live Presenters';
};

// Audio control (matching header/hero functionality)
const togglePlayPause = async () => {
  try {
    await store.dispatch('togglePlayPause');
  } catch (err) {
    console.error('Failed to toggle playback:', err);
    showToast('Failed to control audio player', 'error');
  }
};

// Newsletter subscription
const subscribeNewsletter = async () => {
  if (!newsletterEmail.value || subscribing.value) return;
  
  subscribing.value = true;
  subscriptionMessage.value = '';
  
  try {
    // Replace with actual newsletter subscription API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    subscriptionSuccess.value = true;
    subscriptionMessage.value = 'Successfully subscribed to newsletter!';
    showToast('Successfully subscribed to newsletter!', 'success');
    newsletterEmail.value = '';
  } catch (err) {
    console.error('Newsletter subscription failed:', err);
    subscriptionSuccess.value = false;
    subscriptionMessage.value = 'Failed to subscribe. Please try again.';
    showToast('Failed to subscribe to newsletter', 'error');
  } finally {
    subscribing.value = false;
    setTimeout(() => {
      subscriptionMessage.value = '';
    }, 5000);
  }
};

// Toast notification
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

const hideToast = () => {
  toast.value.show = false;
};

onMounted(() => {
  // Any initialization logic can go here
});
</script>

<style scoped>
/* Custom gradient text effects */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Ensure smooth transitions */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom animations */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

/* Focus styles for accessibility */
button:focus-visible,
input:focus-visible,
a:focus-visible {
  outline: 2px solid #ec4899;
  outline-offset: 2px;
}

/* Responsive design improvements */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>