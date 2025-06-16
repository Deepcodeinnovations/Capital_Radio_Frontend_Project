<template>
    <div class="max-w-md w-full space-y-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-10 rounded-xl shadow-2xl border border-purple-200 dark:border-slate-700">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto w-12 h-12 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full flex items-center justify-center mb-4">
          <ShieldCheckIcon class="w-6 h-6 text-white" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Verify OTP</h2>
        <p class="text-gray-600 dark:text-gray-300 mt-1">Enter the 6-digit code sent to your email</p>
      </div>
   
      <!-- Error Alert -->
      <div v-if="verifyError" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div class="flex items-center">
          <AlertCircleIcon class="h-5 w-5 text-red-500 mr-2" />
          <span class="text-sm text-red-700 dark:text-red-400">{{ verifyError }}</span>
        </div>
      </div>
          
      <form class="space-y-6" @submit.prevent="verifyOTP">
        <!-- OTP Input Fields -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">
            Verification Code
          </label>
          <div class="flex justify-center space-x-3">
            <input
              v-for="(digit, index) in otpDigits"
              :key="index"
              :ref="el => otpInputs[index] = el"
              v-model="otpDigits[index]"
              @input="handleInput(index, $event)"
              @keydown="handleKeydown(index, $event)"
              @paste="handlePaste($event)"
              type="text"
              maxlength="1"
              class="w-12 h-12 text-center text-xl font-bold border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              :class="{ 'border-red-300 focus:ring-red-500': verifyError }"
            />
          </div>
        </div>
   
        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading || !isOTPComplete"
          class="relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <LoaderIcon v-if="loading" class="w-5 h-5 mr-2 animate-spin" />
          <ShieldCheckIcon v-else class="w-5 h-5 mr-2" />
          {{ loading ? 'Verifying...' : 'Verify Code' }}
        </button>
   
        <!-- Resend Code -->
        <div class="text-center space-y-2">
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Didn't receive the code?
          </p>
          <button
            type="button"
            @click="resendOTP"
            :disabled="resendLoading || countdown > 0"
            class="text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="resendLoading">Sending...</span>
            <span v-else-if="countdown > 0">Resend in {{ countdown }}s</span>
            <span v-else>Resend Code</span>
          </button>
        </div>
   
        <!-- Back to Reset -->
        <div class="text-center">
          <router-link 
            :to="{ name: 'ResetPassword' }" 
            class="text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
          >
            Back to Reset Password
          </router-link>
        </div>
      </form>
    </div>
   </template>
   
   <script setup>
   import { ref, computed, onMounted, onUnmounted } from 'vue';
   import { useStore } from 'vuex';
   import { useRouter } from 'vue-router';
   import { 
    Loader as LoaderIcon, 
    ShieldCheck as ShieldCheckIcon,
    AlertCircle as AlertCircleIcon
   } from 'lucide-vue-next';
   
   const store = useStore();
   const router = useRouter();
   const loading = ref(false);
   const resendLoading = ref(false);
   const otpDigits = ref(['', '', '', '', '', '']);
   const otpInputs = ref([]);
   const countdown = ref(0);
   let countdownInterval = null;
   
   const verifyError = computed(() => store.state.auth.verifyError);
   const isOTPComplete = computed(() => otpDigits.value.every(digit => digit !== ''));
   
   const handleInput = (index, event) => {
    const value = event.target.value.replace(/[^0-9]/g, '');
    otpDigits.value[index] = value;
    
    if (value && index < 5) {
      otpInputs.value[index + 1]?.focus();
    }
   };
   
   const handleKeydown = (index, event) => {
    if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
      otpInputs.value[index - 1]?.focus();
    }
   };
   
   const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    
    for (let i = 0; i < pastedData.length; i++) {
      otpDigits.value[i] = pastedData[i];
    }
    
    if (pastedData.length > 0) {
      otpInputs.value[Math.min(pastedData.length - 1, 5)]?.focus();
    }
   };
   
   const verifyOTP = async () => {
    loading.value = true;
    try {
      const otp = otpDigits.value.join('');
      await store.dispatch('auth/verifyOTP', { otp });
      router.push('/new-password');
    } catch (error) {
      console.error('OTP verification failed:', error);
    } finally {
      loading.value = false;
    }
   };
   
   const resendOTP = async () => {
    resendLoading.value = true;
    try {
      await store.dispatch('auth/resendOTP');
      startCountdown();
    } catch (error) {
      console.error('Resend failed:', error);
    } finally {
      resendLoading.value = false;
    }
   };
   
   const startCountdown = () => {
    countdown.value = 60;
    countdownInterval = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(countdownInterval);
      }
    }, 1000);
   };
   
   onMounted(() => {
    otpInputs.value[0]?.focus();
    startCountdown();
   });
   
   onUnmounted(() => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
   });
   </script>