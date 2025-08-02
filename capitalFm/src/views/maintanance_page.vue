<template>
    <div class="min-h-screen bg-white flex items-center justify-center px-4">
      <div class="text-center max-w-lg mx-auto">
        <!-- Logo -->
        <div class="w-64 h-64 mx-auto mb-6">
          <img src="/logo2.png" alt="Capital FM Logo" class="w-full h-full object-contain" />
        </div>
  
        <!-- Main Heading -->
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Under Maintenance
        </h1>
  
        <!-- Message -->
        <p class="text-lg text-gray-600 mb-8">
          We're making improvements to serve you better. 
          <br>We'll be back very soon!
        </p>
  
        <!-- Contact -->
        <div class="text-sm text-gray-500">
          For urgent matters: 
          <a href="tel:+256703766257" class="text-[#F8CB00] hover:underline font-medium">
            +256 703 766257
          </a>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // Simple maintenance page - no complex logic needed
  </script>
  
  <style scoped>
  /* Minimal styles */
  a:focus-visible {
    outline: 2px solid #F8CB00;
    outline-offset: 2px;
  }
  </style>