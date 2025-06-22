<template>
    <footer class="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-20 w-64 h-64 bg-[#F8CB00] rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-20 right-20 w-72 h-72 bg-red-500 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
        <div class="absolute top-1/2 left-1/2 w-48 h-48 bg-blue-500 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
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
                    <img src="/logo2.png" alt="Capital FM Logo" class="w-full h-full object-contain">
                </div>
               </div>
              
              <p class="text-gray-300 mb-6 leading-relaxed">
                Uganda's premier radio station delivering fresh hits, breaking news, and quality entertainment since 1993. Connecting communities across the nation.
              </p>
              
              <!-- Social Media -->
              <div class="flex space-x-4">
                <a href="#" class="group relative">
                  <div class="absolute -inset-2 bg-gradient-to-r from-[#F8CB00] to-red-500 rounded-full blur opacity-0 group-hover:opacity-60 transition duration-300"></div>
                  <div class="relative w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <Facebook class="w-5 h-5" />
                  </div>
                </a>
                <a href="#" class="group relative">
                  <div class="absolute -inset-2 bg-gradient-to-r from-blue-500 to-[#F8CB00] rounded-full blur opacity-0 group-hover:opacity-60 transition duration-300"></div>
                  <div class="relative w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <Twitter class="w-5 h-5" />
                  </div>
                </a>
                <a href="#" class="group relative">
                  <div class="absolute -inset-2 bg-gradient-to-r from-red-500 to-blue-500 rounded-full blur opacity-0 group-hover:opacity-60 transition duration-300"></div>
                  <div class="relative w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <Instagram class="w-5 h-5" />
                  </div>
                </a>
                <a href="#" class="group relative">
                  <div class="absolute -inset-2 bg-gradient-to-r from-red-600 to-[#F8CB00] rounded-full blur opacity-0 group-hover:opacity-60 transition duration-300"></div>
                  <div class="relative w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <Youtube class="w-5 h-5" />
                  </div>
                </a>
              </div>
            </div>
  
            <!-- Quick Links -->
            <div>
              <h3 class="text-xl font-bold mb-6 text-white">Quick Links</h3>
              <ul class="space-y-3">
                <li><a href="#" class="text-gray-300 hover:text-[#F8CB00] transition-colors flex items-center group">
                  <ChevronRight class="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Home
                </a></li>
                <li><a href="#" class="text-gray-300 hover:text-[#F8CB00] transition-colors flex items-center group">
                  <ChevronRight class="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Live Shows
                </a></li>
                <li><a href="#" class="text-gray-300 hover:text-[#F8CB00] transition-colors flex items-center group">
                  <ChevronRight class="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  News & Updates
                </a></li>
                <li><a href="#" class="text-gray-300 hover:text-[#F8CB00] transition-colors flex items-center group">
                  <ChevronRight class="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Schedule
                </a></li>
                <li><a href="#" class="text-gray-300 hover:text-[#F8CB00] transition-colors flex items-center group">
                  <ChevronRight class="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  About Us
                </a></li>
                <li><a href="#" class="text-gray-300 hover:text-[#F8CB00] transition-colors flex items-center group">
                  <ChevronRight class="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact
                </a></li>
              </ul>
            </div>
  
            <!-- Contact Info -->
            <div>
              <h3 class="text-xl font-bold mb-6 text-white">Get in Touch</h3>
              <div class="space-y-4">
                <div class="flex items-start space-x-3">
                  <div class="w-10 h-10 bg-[#F8CB00]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin class="w-5 h-5 text-[#F8CB00]" />
                  </div>
                  <div>
                    <p class="text-white font-medium">Studio Location</p>
                    <p class="text-gray-300 text-sm">Plot 1A, Cooper Road<br/>Kisementi, Kampala, Uganda</p>
                  </div>
                </div>
                
                <div class="flex items-start space-x-3">
                  <div class="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Phone class="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p class="text-white font-medium">Call Us</p>
                    <p class="text-gray-300 text-sm">Hotline: +256 703 766257<br/>Studio: +256 414 257300</p>
                  </div>
                </div>
                
                <div class="flex items-start space-x-3">
                  <div class="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Mail class="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p class="text-white font-medium">Email Us</p>
                    <p class="text-gray-300 text-sm">info@capitalfm.co.ug<br/>studio@capitalfm.co.ug</p>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Frequencies & Newsletter -->
            <div>
              <h3 class="text-xl font-bold mb-6 text-white">Broadcasting Frequencies</h3>
              <div class="grid grid-cols-2 gap-3 mb-8">
                <div v-for="(freq, index) in frequencies" :key="index" 
                     class="bg-gray-800/50 rounded-lg p-3 text-center hover:bg-gray-700/50 transition-colors">
                  <div class="text-lg font-bold text-[#F8CB00]">{{ freq.freq }}</div>
                  <div class="text-xs text-gray-400">{{ freq.location }}</div>
                </div>
              </div>
  
              <!-- Newsletter Signup -->
              <div class="bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50">
                <h4 class="text-white font-semibold mb-3">Stay Updated</h4>
                <p class="text-gray-300 text-sm mb-4">Get the latest news, show updates, and exclusive content.</p>
                <div class="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    class="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F8CB00] focus:border-transparent"
                  />
                  <button class="bg-gradient-to-r from-[#F8CB00] to-red-500 text-black font-semibold px-4 py-2 rounded-lg hover:shadow-lg hover:shadow-[#F8CB00]/30 transition-all">
                    <Send class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Live Status Bar -->
          <div class="bg-gradient-to-r from-red-500/20 via-[#F8CB00]/20 to-blue-500/20 rounded-2xl p-6 mb-12 border border-gray-700/30">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span class="text-red-400 font-bold text-sm uppercase">ON AIR NOW</span>
                </div>
                <div class="text-white">
                  <span class="font-semibold">Morning Drive Show</span>
                  <span class="text-gray-300 ml-2">with Gaetano & Lucky</span>
                </div>
              </div>
              <button class="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center space-x-2">
                <Play class="w-4 h-4" />
                <span>Listen Live</span>
              </button>
            </div>
          </div>
  
          <!-- Bottom Section -->
          <div class="border-t border-gray-700/50 pt-8">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
              <div class="text-gray-400 text-sm text-center md:text-left">
                <p>&copy; {{ currentYear }} Capital FM Uganda. All rights reserved.</p>
                <p class="mt-1">Broadcasting excellence since 1993</p>
              </div>
              
              <div class="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
                <a href="#" class="text-gray-400 hover:text-[#F8CB00] transition-colors">Privacy Policy</a>
                <a href="#" class="text-gray-400 hover:text-[#F8CB00] transition-colors">Terms of Service</a>
                <a href="#" class="text-gray-400 hover:text-[#F8CB00] transition-colors">Advertise With Us</a>
                <a href="#" class="text-gray-400 hover:text-[#F8CB00] transition-colors">Careers</a>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Floating Elements -->
      <div class="absolute top-1/4 left-10 w-2 h-2 bg-[#F8CB00] rounded-full animate-ping opacity-60"></div>
      <div class="absolute top-1/2 right-20 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-60" style="animation-delay: 1s;"></div>
      <div class="absolute bottom-1/4 left-1/3 w-2 h-2 bg-blue-500 rounded-full animate-ping opacity-60" style="animation-delay: 2s;"></div>
    </footer>
  </template>
  
  <script setup>
  import { 
    Radio, Facebook, Twitter, Instagram, Youtube, ChevronRight,
    MapPin, Phone, Mail, Send, Play
  } from 'lucide-vue-next';
  import { computed } from 'vue';
  
  const currentYear = computed(() => new Date().getFullYear());
  
  const frequencies = [
    { freq: '91.3', location: 'Kampala' },
    { freq: '90.9', location: 'Mbale' },
    { freq: '88.7', location: 'Mbarara' },
    { freq: '89.4', location: 'Fort Portal' },
    { freq: '96.9', location: 'Gulu' },
    { freq: '92.7', location: 'Arua' },
  ];
  </script>