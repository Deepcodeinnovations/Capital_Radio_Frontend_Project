<template>
  <div class="max-w-md w-full space-y-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-10 rounded-xl shadow-2xl border border-purple-200 dark:border-slate-700">
    <!-- Header -->
    <div class="text-center">
      <div class="mx-auto w-12 h-12 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full flex items-center justify-center mb-4">
        <ShieldIcon class="w-6 h-6 text-white" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Admin Portal</h2>
      <p class="text-gray-600 dark:text-gray-300 mt-1">Sign in to access your admin dashboard</p>
    </div>
 
    <!-- Error Alert -->
    <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div class="flex items-center">
        <AlertCircleIcon class="h-5 w-5 text-red-500 mr-2" />
        <span class="text-sm text-red-700 dark:text-red-400">{{ errorMessage }}</span>
      </div>
    </div>
        
    <form class="space-y-6" @submit.prevent="handleAdminLogin">
      <div class="space-y-5">
        <!-- Email Field -->
        <div>
          <label for="email-address" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Admin Email
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
              v-model="form.email"
              @input="clearError"
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              :class="{ 'border-red-300 focus:ring-red-500': errorMessage }"
              placeholder="Enter your admin email"
            />
          </div>
        </div>
 
        <!-- Password Field -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label for="password" class="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Password
            </label>
            <router-link 
              :to="{ name: 'ResetPassword' }" 
              class="text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
            >
              Forgot password?
            </router-link>
          </div>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon class="h-5 w-5 text-purple-400 dark:text-purple-300" />
            </div>
            <input
              id="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              required
              v-model="form.password"
              @input="clearError"
              class="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              :class="{ 'border-red-300 focus:ring-red-500': errorMessage }"
              placeholder="Enter your password"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-400 dark:text-purple-300 hover:text-purple-600 dark:hover:text-purple-100 transition-colors"
            >
              <EyeIcon v-if="!showPassword" class="h-5 w-5" />
              <EyeOffIcon v-else class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
 
      <!-- Remember Me -->
      <div class="flex items-center">
        <input
          id="remember-me"
          name="remember-me"
          type="checkbox"
          v-model="form.remember"
          class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700"
        />
        <label for="remember-me" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Keep me signed in for 30 days
        </label>
      </div>

      <!-- Hidden Device Fingerprint -->
      <input v-model="form.device_fingerprint" type="hidden" />
 
      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isLoading || !isFormValid"
        class="relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <LoaderIcon v-if="isLoading" class="w-5 h-5 mr-2 animate-spin" />
        <ShieldIcon v-else class="w-5 h-5 mr-2" />
        {{ isLoading ? 'Signing in...' : 'Sign in to Admin' }}
      </button>
    </form>

    <!-- Security Notice -->
    <div class="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
      <div class="flex">
        <AlertTriangleIcon class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div class="ml-3">
          <h4 class="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">Admin Access Only</h4>
          <p class="text-xs text-amber-700 dark:text-amber-300">
            This portal is restricted to authorized administrators only. All login attempts are logged and monitored.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { 
  Lock as LockIcon, 
  Loader as LoaderIcon, 
  Mail as MailIcon,
  AlertCircle as AlertCircleIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  Shield as ShieldIcon,
  AlertTriangle as AlertTriangleIcon
} from 'lucide-vue-next';
 
const store = useStore();
const router = useRouter();

const form = reactive({
  email: '',
  password: '',
  remember: false,
  device_fingerprint: ''
});

const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');

// Generate device fingerprint on mount
onMounted(() => {
  generateDeviceFingerprint();
});

const generateDeviceFingerprint = () => {
  const fingerprint = btoa(
    navigator.userAgent + 
    screen.width + 
    screen.height + 
    new Date().getTimezoneOffset()
  ).substring(0, 32);
  form.device_fingerprint = fingerprint;
};

// Computed properties
const isFormValid = computed(() => {
  return form.email.trim() && 
         form.password.length >= 6 && 
         form.email.includes('@');
});

// Clear error message when user types
const clearError = () => {
  if (errorMessage.value) {
    errorMessage.value = '';
  }
};

// Watch for form changes to clear errors
watch([() => form.email, () => form.password], clearError);

// Handle admin login
const handleAdminLogin = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    // Validate admin email format
    if (!form.email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }
    
    // Validate password strength
    if (form.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    
    // Create login credentials object
    const loginData = {
      email: form.email.trim().toLowerCase(),
      password: form.password,
      remember: form.remember,
      device_fingerprint: form.device_fingerprint
    };
    
    // Dispatch admin login action using the new store structure
    await store.dispatch('adminLogin', loginData);
    
    // If successful, redirect to dashboard
    router.push({ name: 'Dashboard' });
    
  } catch (error) {
    console.error('Admin login error:', error);
    
    // Set specific error messages based on response
    if (error.response?.status === 401) {
      errorMessage.value = 'Invalid admin credentials. Please check your email and password.';
    } else if (error.response?.status === 403) {
      errorMessage.value = 'Access denied. You do not have admin privileges.';
    } else if (error.response?.status === 429) {
      errorMessage.value = 'Too many login attempts. Please try again later.';
    } else {
      // Get error from store or use default message
      errorMessage.value = store.getters.error || error.message || 'Login failed. Please try again.';
    }
    
    // Clear password field on error
    form.password = '';
    
  } finally {
    isLoading.value = false;
  }
};
</script>