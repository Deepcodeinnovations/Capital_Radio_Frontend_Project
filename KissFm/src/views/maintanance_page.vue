<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center px-4 relative overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 opacity-20">
      <!-- Floating Orbs -->
      <div class="absolute top-20 left-20 w-32 h-32 bg-pink-500 rounded-full blur-2xl animate-float-slow"></div>
      <div class="absolute bottom-20 right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-float-delayed"></div>
      <div class="absolute top-1/2 left-10 w-24 h-24 bg-indigo-500 rounded-full blur-xl animate-bounce-gentle"></div>
      
      <!-- Geometric Shapes -->
      <div class="absolute top-40 right-40 w-16 h-16 border-2 border-pink-400 rotate-45 animate-spin-ultra-slow"></div>
      <div class="absolute bottom-40 left-40 w-20 h-20 border-2 border-purple-400 rounded-full animate-pulse-slow"></div>
      
      <!-- Grid Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="h-full w-full" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0); background-size: 20px 20px;"></div>
      </div>
    </div>

    <div class="text-center max-w-2xl mx-auto relative z-10">

      <!-- Main Content -->
      <div class="space-y-8">
        <!-- Status Badge -->
        <div class="inline-flex items-center px-6 py-3 bg-yellow-500/20 backdrop-blur-sm rounded-full border border-yellow-400/30">
          <div class="w-3 h-3 bg-yellow-400 rounded-full animate-pulse mr-3"></div>
          <span class="text-yellow-200 font-semibold uppercase tracking-wider text-sm">System Maintenance</span>
        </div>

        <!-- Main Heading -->
        <h1 class="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
          We're <span class="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Upgrading</span>
        </h1>

        <!-- Message -->
        <div class="space-y-4">
          <p class="text-xl md:text-2xl text-slate-200 font-light leading-relaxed">
            KIIS 100.9 is currently undergoing scheduled maintenance to enhance your listening experience.
          </p>
          <p class="text-lg text-slate-300">
            We're working hard behind the scenes to bring you even better hot hits and entertainment!
          </p>
        </div>

        <!-- Progress Indicator -->
        <div class="space-y-4">
          <div class="flex justify-center items-center space-x-4">
            <div class="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
            <div class="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
          </div>
          <p class="text-sm text-slate-400 font-mono">Estimated completion: Very soon</p>
        </div>

        <!-- Feature Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div class="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
              </svg>
            </div>
            <h3 class="text-white font-bold mb-2">Better Audio</h3>
            <p class="text-slate-300 text-sm">Enhanced streaming quality for crystal clear sound</p>
          </div>

          <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-white font-bold mb-2">Faster Loading</h3>
            <p class="text-slate-300 text-sm">Optimized performance for instant access</p>
          </div>

          <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h3 class="text-white font-bold mb-2">New Features</h3>
            <p class="text-slate-300 text-sm">Exciting updates to enhance your experience</p>
          </div>
        </div>

        <!-- Contact Section -->
        <div class="mt-12 p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
          <h3 class="text-white font-bold text-lg mb-4">Need Immediate Assistance?</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-center space-x-4">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <a href="tel:+256703766257" class="text-green-400 hover:text-green-300 font-semibold transition-colors">
                  +256 703 766257
                </a>
              </div>
            </div>
            <p class="text-slate-400 text-sm">
              Our support team is available 24/7 for urgent matters
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-8 text-center">
          <p class="text-slate-500 text-sm">
            Thank you for your patience • KIIS 100.9 FM • Hot Hits for Kampala
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Enhanced maintenance page with modern design
import { onMounted, ref } from 'vue'

// Optional: Add some interactive elements or timer if needed
const currentTime = ref(new Date())

onMounted(() => {
  // Update time every second if you want to show current time
  setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})
</script>

<style scoped>
/* Custom gradient text */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* Custom Animations */
@keyframes float-slow {
  0%, 100% { 
    transform: translateY(0px) translateX(0px) scale(1);
  }
  33% { 
    transform: translateY(-20px) translateX(10px) scale(1.05);
  }
  66% { 
    transform: translateY(10px) translateX(-5px) scale(0.95);
  }
}

@keyframes float-delayed {
  0%, 100% { 
    transform: translateY(0px) translateX(0px) scale(1);
  }
  50% { 
    transform: translateY(-30px) translateX(-15px) scale(1.1);
  }
}

@keyframes bounce-gentle {
  0%, 100% { 
    transform: translateY(0px) scale(1);
  }
  50% { 
    transform: translateY(-10px) scale(1.05);
  }
}

@keyframes spin-ultra-slow {
  from { 
    transform: rotate(0deg);
  }
  to { 
    transform: rotate(360deg);
  }
}

@keyframes pulse-slow {
  0%, 100% { 
    opacity: 1;
    transform: scale(1);
  }
  50% { 
    opacity: 0.6;
    transform: scale(1.1);
  }
}

@keyframes pulse-glow {
  0%, 100% { 
    opacity: 0.3;
    transform: scale(1);
  }
  50% { 
    opacity: 0.5;
    transform: scale(1.05);
  }
}

/* Apply animations */
.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 10s ease-in-out infinite;
}

.animate-bounce-gentle {
  animation: bounce-gentle 4s ease-in-out infinite;
}

.animate-spin-ultra-slow {
  animation: spin-ultra-slow 20s linear infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 4s ease-in-out infinite;
}

/* Custom focus styles */
a:focus-visible {
  outline: 2px solid #ec4899;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Hover effects */
.hover\:bg-white\/10:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Backdrop blur fallback */
@supports not (backdrop-filter: blur(12px)) {
  .backdrop-blur-sm {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .backdrop-blur-md {
    background-color: rgba(255, 255, 255, 0.15);
  }
}
</style>