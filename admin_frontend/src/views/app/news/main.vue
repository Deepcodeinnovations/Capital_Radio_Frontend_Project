<template>
    <div class="flex h-screen">
      <div class="flex-1 gap-6 h-full overflow-y-scroll scrollbar-hide">
        <div class="min-h-screen">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">News Management</h1>
            <p class="text-gray-600 dark:text-gray-400">Manage articles and categories</p>
          </div>
          <router-view />
        </div>
      </div>
      <div class="ml-5 sticky top-0 h-screen overflow-y-scroll scrollbar-hide">
        <NewsAside />
      </div>
    </div>
  </template>
  
  <script setup>
  import NewsAside from './comps/NewsAside.vue';
  </script>
  
  <style scoped>
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  </style>