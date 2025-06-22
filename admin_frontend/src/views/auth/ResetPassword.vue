<template>
  <div class="max-w-md w-full space-y-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-10 rounded-xl shadow-2xl border border-purple-200 dark:border-slate-700">
    <!-- Header -->
    <div class="text-center">
      <div class="mx-auto w-12 h-12 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full flex items-center justify-center mb-4">
        <KeyRoundIcon class="w-6 h-6 text-white" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
      <p class="text-gray-600 dark:text-gray-300 mt-1 max-w-sm mx-auto">
        Enter your admin email address and we'll send you a verification code to reset your password.
      </p>
    </div>

    <!-- Success Message -->
    <div v-if="emailSent" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
      <div class="flex items-start">
        <CheckCircleIcon class="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <h4 class="font-medium text-green-900 dark:text-green-200 mb-1">Reset code sent!</h4>
          <p class="text-sm text-green-700 dark:text-green-300">
            We've sent a password reset code to <strong>{{ form.email }}</strong>. 
            Please check your email and enter the code on the next page.
          </p>
        </div>
      </div>
    </div>
 
    <!-- Error Alert -->
    <div v-if="errorMessage" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div class="flex items-center">
        <AlertCircleIcon class="h-5 w-5 text-red-500 mr-2" />
        <span class="text-sm text-red-700 dark:text-red-400">{{ errorMessage }}</span>
      </div>
    </div>

    <!-- Form (hidden after successful submission) -->        
    <form v-if="!emailSent" class="space-y-6" @submit.prevent="handleForgotPassword">
      <!-- Email Field -->
      <div>
        <label for="email" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Admin Email Address
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
            v-model="form.email"
            @input="clearError"
            class="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            :class="{ 'border-red-300 focus:ring-red-500': errorMessage }"
            placeholder="Enter your admin email address"
          />
        </div>
        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Enter the email address associated with your admin account
        </p>
      </div>
 
      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isLoading || !form.email.trim()"
        class="relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <LoaderIcon v-if="isLoading" class="w-5 h-5 mr-2 animate-spin" />
        <SendIcon v-else class="w-5 h-5 mr-2" />
        {{ isLoading ? 'Sending...' : 'Send Reset Code' }}
      </button>
    </form>

    <!-- Success State Actions -->
    <div v-if="emailSent" class="space-y-4">
      <button
        @click="resendEmail"
        :disabled="isResending || resendCooldown > 0"
        class="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:bg-gray-100 dark:disabled:bg-slate-800 text-gray-700 dark:text-gray-300 disabled:text-gray-400 dark:disabled:text-gray-500 font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center disabled:cursor-not-allowed"
      >
        <LoaderIcon v-if="isResending" class="animate-spin h-5 w-5 mr-2" />
        <RotateCcwIcon v-else class="w-5 h-5 mr-2" />
        <span v-if="resendCooldown > 0">
          Resend in {{ resendCooldown }}s
        </span>
        <span v-else-if="isResending">
          Sending...
        </span>
        <span v-else>
          Resend email
        </span>
      </button>

      <button
        @click="goToVerifyCode"
        class="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <KeyRoundIcon class="w-5 h-5 mr-2" />
        <span>Enter Verification Code</span>
      </button>

      <div class="text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Didn't receive the email?</p>
        <ul class="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <li>• Check your spam or junk folder</li>
          <li>• Make sure you entered the correct email address</li>
          <li>• Contact IT support if you continue having issues</li>
        </ul>
      </div>
    </div>

    <!-- Divider -->
    <div class="mt-8 mb-6">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200 dark:border-slate-600"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">Remember your password?</span>
        </div>
      </div>
    </div>
 
    <!-- Back to Login -->
    <div class="text-center">
      <router-link 
        :to="{ name: 'Login' }" 
        class="inline-flex items-center text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors font-medium text-sm"
      >
        <ArrowLeftIcon class="w-4 h-4 mr-2" />
        Back to admin sign in
      </router-link>
    </div>

    <!-- Support -->
    <div class="mt-6 text-center">
      <p class="text-xs text-gray-500 dark:text-gray-400">
        Need help? 
        <a href="mailto:support@capitalradio.co.ug" class="text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors font-medium">
          Contact IT support
        </a>
      </p>
    </div>
  </div>
</template>
 
<script setup>
import { ref, reactive, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { 
  Loader as LoaderIcon, 
  Mail as MailIcon,
  AlertCircle as AlertCircleIcon,
  CheckCircle as CheckCircleIcon,
  KeyRound as KeyRoundIcon,
  Send as SendIcon,
  RotateCcw as RotateCcwIcon,
  ArrowLeft as ArrowLeftIcon
} from 'lucide-vue-next';
 
const store = useStore();
const router = useRouter();

const form = reactive({
  email: ''
});

const emailSent = ref(false);
const isLoading = ref(false);
const isResending = ref(false);
const errorMessage = ref('');
const resendCooldown = ref(0);

let cooldownInterval = null;

// Clear error message when user types
const clearError = () => {
  if (errorMessage.value) {
    errorMessage.value = '';
  }
};

const handleForgotPassword = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    
    // Validate email format
    if (!form.email.includes('@')) {
      throw new Error('Please enter a valid email address');
    }
    
    // Call the forgot admin password API directly
    await store.dispatch('forgotAdminPassword', form.email.trim());
    
    // Show success state
    emailSent.value = true;
    
  } catch (error) {
    console.error('Forgot password error:', error);
    
    // Set error message from store or default
    errorMessage.value = store.getters.error || error.message || 'Failed to send reset code. Please try again.';
    
  } finally {
    isLoading.value = false;
  }
};

const resendEmail = async () => {
  try {
    isResending.value = true;
    errorMessage.value = '';
    
    // Call the forgot password API again
    await store.dispatch('forgotAdminPassword', form.email.trim());
    
    // Start cooldown
    startResendCooldown();
    
  } catch (error) {
    console.error('Resend error:', error);
    errorMessage.value = store.getters.error || error.message || 'Failed to resend email. Please try again.';
  } finally {
    isResending.value = false;
  }
};

const goToVerifyCode = () => {
  router.push({ name: 'VerifyOTP', query: { email: form.email.trim() } });
};

const startResendCooldown = () => {
  resendCooldown.value = 60; // 60 seconds cooldown
  
  cooldownInterval = setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0) {
      clearInterval(cooldownInterval);
      cooldownInterval = null;
    }
  }, 1000);
};

// Cleanup interval on component unmount
onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval);
  }
});
</script>