<template>
  <div class="max-w-md w-full space-y-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-10 rounded-xl shadow-2xl border border-purple-200 dark:border-slate-700">
    <!-- Header -->
    <div class="text-center">
      <div class="mx-auto w-12 h-12 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full flex items-center justify-center mb-4">
        <MailIcon class="w-6 h-6 text-white" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
      <p class="text-gray-600 dark:text-gray-300 mt-1">Enter your email to receive reset instructions</p>
    </div>
 
    <!-- Success Message -->
    <div v-if="emailSent" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
      <div class="flex items-center">
        <CheckCircleIcon class="h-5 w-5 text-green-500 mr-2" />
        <span class="text-sm text-green-700 dark:text-green-400">Reset instructions sent to your email</span>
      </div>
    </div>
 
    <!-- Error Alert -->
    <div v-if="resetError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div class="flex items-center">
        <AlertCircleIcon class="h-5 w-5 text-red-500 mr-2" />
        <span class="text-sm text-red-700 dark:text-red-400">{{ resetError }}</span>
      </div>
    </div>
        
    <form class="space-y-6" @submit.prevent="resetPassword">
      <!-- Email Field -->
      <div>
        <label for="email" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Email Address
        </label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MailIcon class="h-5 w-5 text-purple-400 dark:text-purple-300" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            v-model="email"
            class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            :class="{ 'border-red-300 focus:ring-red-500': resetError }"
            placeholder="Enter your email address"
          />
        </div>
      </div>
 
      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading || emailSent"
        class="relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <LoaderIcon v-if="loading" class="w-5 h-5 mr-2 animate-spin" />
        <MailIcon v-else class="w-5 h-5 mr-2" />
        {{ loading ? 'Sending...' : emailSent ? 'Email Sent' : 'Send Reset Link' }}
      </button>
 
      <!-- Back to Login -->
      <div class="text-center">
        <router-link 
          :to="{ name: 'Login' }" 
          class="text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
        >
          Back to Sign In
        </router-link>
      </div>
    </form>
  </div>
 </template>
 
 <script setup>
 import { ref, computed } from 'vue';
 import { useStore } from 'vuex';
 import { 
  Loader as LoaderIcon, 
  Mail as MailIcon,
  AlertCircle as AlertCircleIcon,
  CheckCircle as CheckCircleIcon
 } from 'lucide-vue-next';
 
 const store = useStore();
 const loading = ref(false);
 const email = ref('');
 const emailSent = ref(false);
 
 const resetError = computed(() => store.state.auth.resetError);
 
 const resetPassword = async () => {
  loading.value = true;
  try {
    await store.dispatch('auth/resetPassword', { email: email.value });
    emailSent.value = true;
  } catch (error) {
    console.error('Reset failed:', error);
  } finally {
    loading.value = false;
  }
 };
 </script>