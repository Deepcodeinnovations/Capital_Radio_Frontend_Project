<template>
  <footer class="bg-black text-white">
    <!-- Main Footer Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <!-- Brand Section -->
        <div class="space-y-6">
          <img src="/logo2.png" alt="Capital FM" class="h-16 w-auto" />
          <p class="text-gray-400 leading-relaxed text-sm">
            Uganda's premier radio station delivering fresh hits, breaking news, and quality entertainment since 1993.
          </p>
          <div class="flex space-x-4">
            <a
              v-for="(social, index) in socialLinks"
              :key="index"
              :href="social.href"
              target="_blank"
              class="w-10 h-10 bg-gray-900 hover:bg-[#F8CB00] text-gray-400 hover:text-black flex items-center justify-center transition-all rounded-lg"
            >
              <component :is="social.icon" :size="18" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="font-bold text-white mb-6 text-sm uppercase tracking-wider">Quick Links</h3>
          <ul class="space-y-3">
            <li v-for="(item, index) in navItems" :key="index">
              <router-link
                :to="{ name: item.to }"
                class="text-gray-400 hover:text-[#F8CB00] text-sm transition-colors"
              >
                {{ item.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="font-bold text-white mb-6 text-sm uppercase tracking-wider">Contact</h3>
          <ul class="space-y-4 text-sm">
            <li>
              <div class="text-gray-500 text-xs mb-1">Phone</div>
              <a href="tel:+256414215100" class="text-gray-300 hover:text-[#F8CB00] transition-colors">
                +256 414 215 100
              </a>
            </li>
            <li>
              <div class="text-gray-500 text-xs mb-1">Whatsapp Number</div>
              <a href="tel:+256752345913" class="text-gray-300 hover:text-[#F8CB00] transition-colors">
                +256 752 345 913
              </a>
            </li>
            <li>
              <div class="text-gray-500 text-xs mb-1">Email Us</div>
              <a href="mailto:sales@capitalfm.co.ug" class="text-gray-300 hover:text-[#F8CB00] transition-colors">
                sales@capitalfm.co.ug
              </a><br/>
              <a href="mailto:promotions@capitalfm.co.ug" class="text-gray-300 hover:text-[#F8CB00] transition-colors">
                 Promotions@capitalfm-ug.com
              </a><br/>
              <a href="mailto:technical@capitalfm-ug.com" class="text-gray-300 hover:text-[#F8CB00] transition-colors">
                  technical@capitalfm-ug.com 
              </a>
               
            </li>
            <li>
              <div class="text-gray-500 text-xs mb-1">Address</div>
              <p class="text-gray-300">
                Plot 1A, Cooper Road<br />
                Kisementi, Kampala, Uganda
              </p>
            </li>
          </ul>
        </div>

        <!-- Frequencies & Newsletter -->
        <div>
          <h3 class="font-bold text-white mb-6 text-sm uppercase tracking-wider">Tune In</h3>
          <div class="grid grid-cols-2 gap-3 mb-8">
            <div
              v-for="(freq, index) in frequencies"
              :key="index"
              class="bg-gray-900 hover:bg-gray-800 p-3 text-center transition-all rounded-lg"
            >
              <div class="text-[#F8CB00] font-bold text-lg">{{ freq.freq }}</div>
              <div class="text-gray-500 text-xs">{{ freq.location }}</div>
            </div>
          </div>

          <!-- Newsletter -->
          <div>
            <h4 class="text-white font-semibold text-xs uppercase mb-3">Newsletter</h4>
            <div class="flex gap-2">
              <input
                v-model="newsletterEmail"
                type="email"
                placeholder="Your email"
                class="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#F8CB00] transition-colors"
                @keyup.enter="subscribeNewsletter"
              />
              <button
                @click="subscribeNewsletter"
                :disabled="!newsletterEmail || subscribing"
                class="bg-[#F8CB00] hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold transition-all disabled:opacity-50"
              >
                <div v-if="subscribing" class="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <Send v-else :size="16" />
              </button>
            </div>
            <p v-if="subscriptionMessage" class="mt-2 text-xs" :class="subscriptionSuccess ? 'text-green-400' : 'text-red-400'">
              {{ subscriptionMessage }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- On Air Bar -->
    <div class="border-t border-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              <span class="text-red-600 font-bold text-xs uppercase">On Air</span>
            </div>
            <div class="text-white text-sm font-semibold">
              {{ currentShow?.program?.title || 'Live Show' }}
            </div>
            <div class="hidden md:block text-gray-400 text-sm">
              with {{ getCurrentShowHosts() }}
            </div>
          </div>
          <button
            @click="togglePlayPause"
            :disabled="isLoading"
            :class="[
              'px-6 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2',
              isPlaying ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-[#F8CB00] hover:bg-yellow-500 text-black',
            ]"
          >
            <Volume2 v-if="isPlaying" :size="14" />
            <Play v-else :size="14" />
            <span>{{ isPlaying ? 'Live' : 'Listen' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-gray-900 bg-black">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div class="text-gray-500 text-center md:text-left">
            <p>&copy; {{ currentYear }} Capital FM Uganda. All rights reserved.</p>
          </div>
          <div class="flex flex-wrap justify-center md:justify-end gap-6 text-xs">
            <a href="#" class="text-gray-500 hover:text-[#F8CB00] transition-colors">Privacy</a>
            <a href="#" class="text-gray-500 hover:text-[#F8CB00] transition-colors">Terms</a>
            <a href="#" class="text-gray-500 hover:text-[#F8CB00] transition-colors">Advertise</a>
            <a
              href="https://deepcodeinnovations.com/"
              target="_blank"
              class="text-gray-500 hover:text-[#F8CB00] transition-colors flex items-center gap-1"
            >
              Deepcode
              <ExternalLink :size="10" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { Facebook, Twitter, Instagram, Youtube, Send, Play, Volume2, ExternalLink } from "lucide-vue-next";

const store = useStore();

const newsletterEmail = ref("");
const subscribing = ref(false);
const subscriptionMessage = ref("");
const subscriptionSuccess = ref(false);

const currentYear = computed(() => new Date().getFullYear());
const isPlaying = computed(() => store.getters.isPlaying);
const isLoading = computed(() => store.getters.isLoading);
const currentStation = computed(() => store.getters.station);

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
  { icon: Youtube, href: "#" },
];

const frequencies = [
  { freq: "91.3", location: "Kampala" },
  { freq: "90.9", location: "Mbale" },
  { freq: "88.7", location: "Mbarara" },
  { freq: "89.4", location: "Fort Portal" },
  { freq: "96.9", location: "Gulu" },
  { freq: "92.7", location: "Arua" },
];

const currentShow = computed(() => {
  if (!currentStation.value?.schedule?.sessions) return null;
  const today = getCurrentDay();
  const todaySchedule = currentStation.value.schedule.sessions[today] || [];
  const currentTime = getCurrentTime();
  return todaySchedule.find((show) => isTimeBetween(currentTime, show.start_time, show.end_time));
});

const getCurrentDay = () => {
  const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return days[new Date().getDay()];
};

const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
};

const isTimeBetween = (currentTime, startTime, endTime) => {
  const current = currentTime.replace(":", "");
  const start = startTime.replace(":", "");
  const end = endTime.replace(":", "");
  if (end < start) return current >= start || current <= end;
  return current >= start && current <= end;
};

const getCurrentShowHosts = () => {
  if (!currentShow.value?.program?.hosts) return "Live Presenters";
  const sessionHostIds = currentShow.value.hosts || [];
  const hosts = currentShow.value.program.hosts.filter((host) => sessionHostIds.includes(host.id));
  return hosts.length > 0 ? hosts.map((h) => h.name).join(" & ") : "Live Presenters";
};

const togglePlayPause = async () => {
  try {
    await store.dispatch("togglePlayPause");
  } catch (err) {
    console.error("Failed to toggle playback:", err);
  }
};

const subscribeNewsletter = async () => {
  if (!newsletterEmail.value || subscribing.value) return;
  subscribing.value = true;
  subscriptionMessage.value = "";

  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    subscriptionSuccess.value = true;
    subscriptionMessage.value = "Subscribed successfully!";
    newsletterEmail.value = "";
  } catch (err) {
    subscriptionSuccess.value = false;
    subscriptionMessage.value = "Failed to subscribe. Try again.";
  } finally {
    subscribing.value = false;
    setTimeout(() => {
      subscriptionMessage.value = "";
    }, 5000);
  }
};
</script>
