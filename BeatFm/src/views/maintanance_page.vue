<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="text-center max-w-lg mx-auto">
      <!-- Logo -->
      <div class="w-64 h-64 mx-auto mb-8">
        <img src="/logobeat.png" alt="Beat FM Logo" class="w-full h-full object-contain" />
      </div>
       
      <!-- Main Heading -->
      <h1 class="text-4xl font-black text-black mb-6 uppercase tracking-wider">
        Under Maintenance
      </h1>
       
      <!-- Message -->
      <p class="text-lg text-gray-600 mb-8 font-bold uppercase tracking-wider">
        We're making improvements to serve you better.
        <br>We'll be back very soon!
      </p>
      
      <!-- Beat FM Branding -->
      <div class="mb-8">
        <div class="text-2xl font-black text-red-600 mb-2 uppercase tracking-wider">
          Beat FM 96.3
        </div>
        <div class="text-lg text-gray-600 font-bold uppercase tracking-wider">
          Ekintabuli Ky'Omuziki
        </div>
      </div>
       
      <!-- Contact -->
      <div class="bg-white border-2 border-black p-6">
        <div class="text-sm text-black font-bold uppercase tracking-wider mb-2">
          For urgent matters:
        </div>
        <a 
          href="tel:+256703766257" 
          class="text-red-600 hover:text-red-700 font-black text-lg uppercase tracking-wider transition-colors border-b-2 border-red-600 hover:border-red-700"
        >
          +256 703 766257
        </a>
      </div>
    </div>
  </div>
 </template>
 
 <script setup>
 // Beat FM maintenance page - no complex logic needed
 </script>
 
 <style scoped>
 /* Override rounded corners for brutalist design */
 * {
  border-radius: 0 !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
 }
 
 /* Ensure sharp geometric shapes */
 div, a {
  border-radius: 0 !important;
 }
 
 /* Focus styles */
 a:focus-visible {
  outline: 2px solid #DC2626;
  outline-offset: 2px;
 }
 
 /* Smooth transitions */
 a {
  transition-property: color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
 }
 
 /* Responsive design */
 @media (max-width: 768px) {
  .text-4xl {
    font-size: 2rem;
    line-height: 2.5rem;
  }
  
  .text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }
  
  .w-64 {
    width: 12rem;
  }
  
  .h-64 {
    height: 12rem;
  }
 }
 
 @media (max-width: 640px) {
  .text-4xl {
    font-size: 1.75rem;
    line-height: 2.25rem;
  }
  
  .text-lg {
    font-size: 1rem;
    line-height: 1.5rem;
  }
  
  .w-64 {
    width: 10rem;
  }
  
  .h-64 {
    height: 10rem;
  }
 }
 </style>