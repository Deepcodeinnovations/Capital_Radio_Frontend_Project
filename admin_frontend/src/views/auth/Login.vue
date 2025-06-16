<template>
  <div class="max-w-md w-full space-y-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-10 rounded-xl shadow-2xl border border-purple-200 dark:border-slate-700">
    <!-- Header -->
    <div class="text-center">

      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
      <p class="text-gray-600 dark:text-gray-300 mt-1">Please sign in to your account</p>
    </div>
 
    <!-- Error Alert -->
    <div v-if="loginError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div class="flex items-center">
        <AlertCircleIcon class="h-5 w-5 text-red-500 mr-2" />
        <span class="text-sm text-red-700 dark:text-red-400">{{ loginError }}</span>
      </div>
    </div>
        
    <form class="space-y-6" @submit.prevent="login">
      <div class="space-y-5">
        <!-- Email Field -->
        <div>
          <label for="email-address" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MailIcon class="h-5 w-5 text-purple-400 dark:text-purple-300" />
            </div>
            <input
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              v-model="credentials.email"
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              :class="{ 'border-red-300 focus:ring-red-500': loginError }"
              placeholder="Enter your email address"
            />
          </div>
        </div>
 
        <!-- Password Field -->
        <div>
          <label for="password" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon class="h-5 w-5 text-purple-400 dark:text-purple-300" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              v-model="credentials.password"
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              :class="{ 'border-red-300 focus:ring-red-500': loginError }"
              placeholder="Enter your password"
            />
          </div>
        </div>
      </div>
 
      <!-- Remember Me & Forgot Password -->
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700"
          />
          <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Remember me
          </label>
        </div>
 
        <router-link 
          :to="{ name: 'ResetPassword' }" 
          class="text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
        >
          Forgot password?
        </router-link>
      </div>
 
      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="loading"
        class="relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <LoaderIcon v-if="loading" class="w-5 h-5 mr-2 animate-spin" />
        <LogInIcon v-else class="w-5 h-5 mr-2" />
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>
  </div>
 </template>
 
 <script setup>
 import { ref, computed } from 'vue';
 import { useStore } from 'vuex';
 import { useRouter } from 'vue-router';
 import { 
  Lock as LockIcon, 
  Loader as LoaderIcon, 
  LogIn as LogInIcon,
  Mail as MailIcon,
  AlertCircle as AlertCircleIcon 
 } from 'lucide-vue-next';
 
 const store = useStore();
 const router = useRouter();
 const loading = ref(false);
 const credentials = ref({
  email: '',
  password: ''
 });
 
 const loginError = computed(() => store.getters.error);
 
 const login = async () => {
  loading.value = true;
  try {
    await store.dispatch('login', credentials.value).then(()=>{
      router.push({name: 'Dashboard'});
    })
  } catch (error) {
    console.error('Login failed:', error);
  } finally {
    loading.value = false;
  }
 };
 </script>