<template>
  <footer class="bg-slate-900 border-t border-slate-800 pt-16 pb-24 mt-12 relative overflow-hidden">
    <!-- Background elements -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute -bottom-20 -right-20 w-96 h-96 bg-capital-blue rounded-full filter blur-3xl"></div>
      <div class="absolute -top-20 -left-20 w-96 h-96 bg-capital-yellow rounded-full filter blur-3xl"></div>
    </div>
    
    <!-- Floating elements - reduced for cleaner look -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="w-2 h-2 bg-capital-blue absolute top-1/4 left-1/4 rounded-full animate-ping" style="animation-duration: 3s;"></div>
      <div class="w-2 h-2 bg-capital-yellow absolute top-1/2 left-3/4 rounded-full animate-ping" style="animation-duration: 4s;"></div>
    </div>
    
    <!-- Wave separator at the top -->
    <div class="absolute top-0 left-0 w-full transform -translate-y-99%">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="w-full h-16">
        <path fill="rgb(15 23 42)" d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,31,17,94.98,30.44c64.64,13.91,93.29,29.88,150.17,38.07,65.88,9.2,165.63,17.05,240.88,12.55Z" />
      </svg>
    </div>
    
    <div class="container mx-auto px-4 relative z-10">
      <!-- Station information section -->
      <div class="flex flex-col lg:flex-row items-start justify-between gap-10 mb-16">
        <div class="lg:w-1/3">
          <div class="flex items-center gap-3 mb-6">
            <div class="text-capital-yellow">
              <Radio class="h-10 w-10" />
            </div>
            <div>
              <div class="font-heading font-bold text-2xl text-white">Capital <span class="text-capital-yellow">FM</span></div>
              <div class="text-sm text-slate-400">91.3 | Fresh Hits for Uganda</div>
            </div>
          </div>
          
          <p class="text-slate-400 mb-6 font-light">
            Capital FM is Uganda's premier radio station, broadcasting from the heart of Kampala. Since 1993, we've been setting the standard for radio broadcasting with a commitment to quality entertainment, education and information.
          </p>
          
          <div class="flex flex-wrap gap-4 mb-8">
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 rounded-full bg-capital-blue/10 flex items-center justify-center mb-2">
                <Mic class="h-5 w-5 text-capital-blue" />
              </div>
              <span class="text-xs text-slate-400">Quality<br/>Content</span>
            </div>
            
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 rounded-full bg-capital-yellow/10 flex items-center justify-center mb-2">
                <Music class="h-5 w-5 text-capital-yellow" />
              </div>
              <span class="text-xs text-slate-400">Fresh<br/>Hits</span>
            </div>
            
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 rounded-full bg-capital-red/10 flex items-center justify-center mb-2">
                <RadioTower class="h-5 w-5 text-capital-red" />
              </div>
              <span class="text-xs text-slate-400">Wide<br/>Coverage</span>
            </div>
            
            <div class="flex flex-col items-center">
              <div class="w-12 h-12 rounded-full bg-capital-purple/10 flex items-center justify-center mb-2">
                <Users class="h-5 w-5 text-capital-purple" />
              </div>
              <span class="text-xs text-slate-400">Community<br/>Focused</span>
            </div>
          </div>
          
          <div class="mt-6">
            <h4 class="text-white font-semibold mb-3 entertainment-text">Listen on</h4>
            <div class="flex flex-wrap gap-3">
              <a href="#" class="bg-slate-800 px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 transition-colors">
                <AppleIcon class="h-5 w-5 text-white" />
                <span class="text-sm text-white">Apple</span>
              </a>
              <a href="#" class="bg-slate-800 px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 transition-colors">
                <SpotifyIcon class="h-5 w-5 text-white" />
                <span class="text-sm text-white">Spotify</span>
              </a>
              <a href="#" class="bg-slate-800 px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 transition-colors">
                <YoutubeIcon class="h-5 w-5 text-white" />
                <span class="text-sm text-white">YouTube</span>
              </a>
            </div>
          </div>
        </div>
        
        <div class="lg:w-2/3">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <!-- Quick links section -->
            <div>
              <h3 class="font-heading text-white font-semibold text-xl mb-6 pb-2 border-b border-slate-800">Navigate</h3>
              <ul class="space-y-3">
                <li><a href="#home" class="text-slate-400 hover:text-capital-yellow transition-colors hover:translate-x-1 inline-flex items-center gap-2 transform">
                  <ChevronRight class="h-4 w-4" /> Home
                </a></li>
                <li><a href="#radio" class="text-slate-400 hover:text-capital-yellow transition-colors hover:translate-x-1 inline-flex items-center gap-2 transform">
                  <ChevronRight class="h-4 w-4" /> Radio Shows
                </a></li>
                <li><a href="#news" class="text-slate-400 hover:text-capital-yellow transition-colors hover:translate-x-1 inline-flex items-center gap-2 transform">
                  <ChevronRight class="h-4 w-4" /> News & Updates
                </a></li>
                <li><a href="#advertisements" class="text-slate-400 hover:text-capital-yellow transition-colors hover:translate-x-1 inline-flex items-center gap-2 transform">
                  <ChevronRight class="h-4 w-4" /> Advertisers
                </a></li>
                <li><a href="#forum" class="text-slate-400 hover:text-capital-yellow transition-colors hover:translate-x-1 inline-flex items-center gap-2 transform">
                  <ChevronRight class="h-4 w-4" /> Community Forum
                </a></li>
                <li><a href="#about" class="text-slate-400 hover:text-capital-yellow transition-colors hover:translate-x-1 inline-flex items-center gap-2 transform">
                  <ChevronRight class="h-4 w-4" /> About Us
                </a></li>
              </ul>
            </div>
            
            <!-- Contact info section -->
            <div>
              <h3 class="font-heading text-white font-semibold text-xl mb-6 pb-2 border-b border-slate-800">Get in Touch</h3>
              <ul class="space-y-5">
                <li class="flex gap-3 group">
                  <div class="w-8 h-8 rounded-full bg-capital-red/10 flex items-center justify-center flex-shrink-0">
                    <MapPin class="h-4 w-4 text-capital-red" />
                  </div>
                  <div>
                    <p class="text-sm text-white font-medium">Our Studio</p>
                    <p class="text-slate-400 text-sm">Plot 1A, Cooper Road, Kisementi,<br/> Kampala, Uganda</p>
                  </div>
                </li>
                <li class="flex gap-3 group">
                  <div class="w-8 h-8 rounded-full bg-capital-yellow/10 flex items-center justify-center flex-shrink-0">
                    <Phone class="h-4 w-4 text-capital-yellow" />
                  </div>
                  <div>
                    <p class="text-sm text-white font-medium">Call Us</p>
                    <p class="text-slate-400 text-sm">Hotline: +256 703 766257<br/>Studio: +256 414 257300</p>
                  </div>
                </li>
                <li class="flex gap-3 group">
                  <div class="w-8 h-8 rounded-full bg-capital-blue/10 flex items-center justify-center flex-shrink-0">
                    <Mail class="h-4 w-4 text-capital-blue" />
                  </div>
                  <div>
                    <p class="text-sm text-white font-medium">Email Us</p>
                    <p class="text-slate-400 text-sm">info@capitalfm.co.ug<br/>studio@capitalfm.co.ug</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <!-- Newsletter & Social section -->
            <div>
              <h3 class="font-heading text-white font-semibold text-xl mb-6 pb-2 border-b border-slate-800">Connect With Us</h3>
              <p class="text-slate-400 mb-5 text-sm">Stay updated with exclusive content, contests, and station news.</p>
              
              <div class="space-y-3 mb-5">
                <div class="relative">
                  <input type="email" placeholder="Your email address" class="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-capital-blue focus:border-transparent transition-all" />
                  <button class="absolute right-1 top-1 bottom-1 px-2 bg-capital-blue text-white rounded-md hover:bg-blue-600 transition-colors">
                    <Send class="h-4 w-4" />
                  </button>
                </div>
                <p class="text-xs text-slate-500">We respect your privacy and will never share your information.</p>
              </div>
              
              <div>
                <h4 class="text-white font-medium mb-3 text-sm">Follow Us</h4>
                <div class="flex items-center gap-3">
                  <a href="#" class="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-capital-blue/20 text-slate-400 hover:text-capital-blue transition-all">
                    <Facebook class="h-5 w-5" />
                  </a>
                  <a href="#" class="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-capital-blue/20 text-slate-400 hover:text-capital-blue transition-all">
                    <Twitter class="h-5 w-5" />
                  </a>
                  <a href="#" class="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-capital-blue/20 text-slate-400 hover:text-capital-blue transition-all">
                    <Instagram class="h-5 w-5" />
                  </a>
                  <a href="#" class="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-capital-blue/20 text-slate-400 hover:text-capital-blue transition-all">
                    <Youtube class="h-5 w-5" />
                  </a>
                  <a href="#" class="w-9 h-9 flex items-center justify-center rounded-full bg-slate-800 hover:bg-capital-blue/20 text-slate-400 hover:text-capital-blue transition-all">
                    <TiktokIcon class="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Frequency band visualization -->
      <div class="mb-10 px-4 py-6 bg-slate-800/30 rounded-xl backdrop-blur-sm">
        <div class="mb-4 text-center">
          <h4 class="entertainment-text text-white font-semibold mb-1">Broadcasting Across Uganda</h4>
          <p class="text-slate-400 text-sm">Tune in to Capital FM on these frequencies</p>
        </div>
        
        <div class="flex justify-between items-center gap-2 mt-4">
          <div v-for="(freq, index) in frequencies" :key="index" class="text-center flex-1">
            <div class="text-lg font-bold text-capital-pink mb-0">{{ freq.freq }}</div>
            <div class="text-xs text-slate-400">{{ freq.location }}</div>
            <div class="mt-2 h-10 flex items-end justify-center">
              <div class="w-1 mx-px bg-capital-pink frequency-bar" 
                   :style="{ height: getRandomHeight() }"></div>
              <div class="w-1 mx-px bg-capital-pink frequency-bar" 
                   :style="{ height: getRandomHeight(), animationDelay: '0.1s' }"></div>
              <div class="w-1 mx-px bg-capital-pink frequency-bar" 
                   :style="{ height: getRandomHeight(), animationDelay: '0.2s' }"></div>
              <div class="w-1 mx-px bg-capital-pink frequency-bar" 
                   :style="{ height: getRandomHeight(), animationDelay: '0.3s' }"></div>
              <div class="w-1 mx-px bg-capital-pink frequency-bar" 
                   :style="{ height: getRandomHeight(), animationDelay: '0.4s' }"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- App promo section -->
      <div class="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800/50 rounded-xl overflow-hidden backdrop-blur-sm">
        <div class="p-6 flex flex-col justify-center">
          <h3 class="text-2xl font-bold text-white mb-2 font-heading">Download Our App</h3>
          <p class="text-slate-300 mb-4">Listen to Capital FM on the go. Get exclusive content, notifications for your favorite shows, and more.</p>
          <div class="flex gap-4 mt-2">
            <a href="#" class="bg-black flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors">
              <AppleIcon class="h-6 w-6 text-white" />
              <div class="text-left">
                <div class="text-xs text-gray-400">Download on the</div>
                <div class="text-sm font-semibold text-white">App Store</div>
              </div>
            </a>
            <a href="#" class="bg-black flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors">
              <GooglePlayIcon class="h-6 w-6 text-white" />
              <div class="text-left">
                <div class="text-xs text-gray-400">GET IT ON</div>
                <div class="text-sm font-semibold text-white">Google Play</div>
              </div>
            </a>
          </div>
        </div>
        <div class="hidden md:block relative p-6">
          <div class="absolute top-1/2 right-6 transform -translate-y-1/2">
            <img src="https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                 alt="Capital FM Mobile App" class="max-h-48 rounded-xl shadow-2xl" />
          </div>
          <div class="absolute top-1/4 right-24 transform -translate-y-1/2 -rotate-6">
            <img src="https://images.unsplash.com/photo-1585399000684-d2f72660f092?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                 alt="Capital FM Mobile App" class="max-h-40 rounded-xl shadow-2xl" />
          </div>
        </div>
      </div>
      
      <!-- Bottom section with copyright and links -->
      <div class="mt-10 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-slate-500 text-sm">© {{ currentYear }} Capital FM Uganda. All rights reserved.</p>
        
        <div class="flex flex-wrap justify-center gap-6">
          <a href="#" class="text-slate-500 hover:text-slate-300 text-sm transition-colors">Privacy Policy</a>
          <a href="#" class="text-slate-500 hover:text-slate-300 text-sm transition-colors">Terms of Service</a>
          <a href="#" class="text-slate-500 hover:text-slate-300 text-sm transition-colors">Cookie Policy</a>
          <a href="#" class="text-slate-500 hover:text-slate-300 text-sm transition-colors">Advertise With Us</a>
          <a href="#" class="text-slate-500 hover:text-slate-300 text-sm transition-colors">Careers</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';
import { 
  Radio, Facebook, Twitter, Instagram, Youtube, 
  MapPin, Phone, Mail, Clock, Music, ChevronRight,
  Users, Send, Mic, RadioTower 
} from 'lucide-vue-next';

// Custom icons for app stores and platforms
const AppleIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-apple"><path d="M12 20.94c1.5 0 2.75 0 4.3-.95 1.55-.94 2.74-3.12 2.74-5.58 0-2.47-1.33-3.93-2.74-4.6-1.4-.67-2.8-.22-4.3-.22-1.5 0-2.9-.45-4.3.22-1.4.67-2.74 2.13-2.74 4.6 0 2.46 1.19 4.64 2.74 5.58 1.55.95 2.8.95 4.3.95z"/><path d="M9.7 5.55c-.8-.22-1.4-.95-1.4-1.86 0-.91.6-1.64 1.4-1.86.8-.22 1.68-.04 2.3.46.62.5.23 1.03-.4 1.49-.62.45-1.1.82-1.9.77z"/><path d="M14.3 5.55c.8-.22 1.4-.95 1.4-1.86 0-.91-.6-1.64-1.4-1.86-.8-.22-1.68-.04-2.3.46-.62.5-.24 1.03.4 1.49.62.45 1.1.82 1.9.77z"/><path d="M12 8v4"/></svg>`,
};

const SpotifyIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14.5a5 5 0 0 1 8 0"/><path d="M6 10.5a9 9 0 0 1 12 0"/><path d="M12 12l4 4"/></svg>`,
};

const YoutubeIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>`,
};

const TiktokIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/><path d="M14 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/><path d="M12 15v-3a4 4 0 0 0 4-4v-1h2"/></svg>`,
};

const GooglePlayIcon = {
  template: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="4 20 20 12 4 4"/><path d="M19 12V5c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-7"/></svg>`,
};

const currentYear = new Date().getFullYear();

// Frequencies data
const frequencies = [
  { freq: '91.3', location: 'Kampala' },
  { freq: '90.9', location: 'Mbale' },
  { freq: '88.7', location: 'Mbarara' },
  { freq: '89.4', location: 'Fort Portal' },
  { freq: '96.9', location: 'Gulu' },
  { freq: '92.7', location: 'Arua' },
];

// Helper function for random equalizer heights
const getRandomHeight = () => {
  return `${30 + Math.random() * 70}%`;
};
</script>

<style scoped>
/* Animated frequency bars */
.frequency-bar {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.5); }
}
</style> 