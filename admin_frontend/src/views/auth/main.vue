<template>
    <div class="min-h-screen relative overflow-hidden dark:bg-slate-950 bg-slate-50">
      <!-- Background with overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 dark:from-slate-900 dark:via-purple-900 dark:to-slate-800 light:from-purple-100 light:via-blue-100 light:to-slate-100"></div>
      <div class="absolute inset-0 bg-black/20 dark:bg-black/20 light:bg-white/30"></div>
      
      <!-- Animated radio waves -->
      <div class="absolute inset-0 opacity-10 dark:opacity-10 light:opacity-20">
        <div class="absolute top-1/4 left-1/4 w-32 h-32 border border-white/20 dark:border-white/20 light:border-purple-300/60 rounded-full animate-ping"></div>
        <div class="absolute top-3/4 right-1/4 w-24 h-24 border border-white/20 dark:border-white/20 light:border-purple-300/60 rounded-full animate-ping animation-delay-1000"></div>
        <div class="absolute bottom-1/4 left-1/3 w-16 h-16 border border-white/20 dark:border-white/20 light:border-purple-300/60 rounded-full animate-ping animation-delay-2000"></div>
      </div>
      
      <!-- Content -->
      <div class="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="w-full max-w-md">
          <!-- Logo/Brand -->
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-white dark:text-white light:text-slate-800">Capital Radio</h1>
            <p class="text-purple-200 dark:text-purple-200 light:text-purple-600 mt-2">Admin Portal</p>
          </div>
          
          <router-view />
        </div>
      </div>
    </div>
   </template>
   
   <script setup>
   import { RadioIcon } from 'lucide-vue-next';
   </script>
   
   <style scoped>
   .animation-delay-1000 {
    animation-delay: 1s;
   }
   .animation-delay-2000 {
    animation-delay: 2s;
   }
   </style>