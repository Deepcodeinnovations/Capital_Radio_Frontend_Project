<template>
  <div class="max-w-md w-full space-y-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-10 rounded-xl shadow-2xl border border-purple-200 dark:border-slate-700">
    <!-- Header -->
    <div class="text-center">
      <div class="mx-auto w-12 h-12 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full flex items-center justify-center mb-4">
        <ShieldCheckIcon class="w-6 h-6 text-white" />
      </div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Identity</h2>
      <p class="text-gray-600 dark:text-gray-300 mt-1 max-w-sm mx-auto">
        We've sent a verification code to <strong class="text-purple-600 dark:text-purple-400">{{ maskedEmail }}</strong>. 
        Enter the code below to continue.
      </p>
    </div>

    <!-- Success Message -->
    <div v-if="verificationSuccess" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
      <div class="flex items-start">
        <CheckCircleIcon class="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <h4 class="font-medium text-green-900 dark:text-green-200 mb-1">Verification successful!</h4>
          <p class="text-sm text-green-700 dark:text-green-300">
            Your identity has been verified. Redirecting you now...
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

    <!-- Verification Form (hidden after success) -->        
    <form v-if="!verificationSuccess" class="space-y-6" @submit.prevent="handleVerifyCode">
      <!-- OTP Input Fields -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">
          Enter Verification Code
        </label>
        <div class="flex justify-center space-x-3">
          <input
            v-for="(digit, index) in verificationCode"
            :key="index"
            :ref="el => setCodeInputRef(el, index)"
            v-model="verificationCode[index]"
            type="text"
            maxlength="1"
            class="w-12 h-12 text-center text-xl font-bold border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            :class="{ 'border-red-300 focus:ring-red-500': errorMessage }"
            @input="handleCodeInput($event, index)"
            @keydown="handleKeyDown($event, index)"
            @paste="handlePaste($event, index)"
          />
        </div>
        <p class="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
          Code expires in {{ formatTime(expiryTime) }}
        </p>
      </div>
 
      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isLoading || !isCodeComplete"
        class="relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <LoaderIcon v-if="isLoading" class="w-5 h-5 mr-2 animate-spin" />
        <ShieldCheckIcon v-else class="w-5 h-5 mr-2" />
        {{ isLoading ? 'Verifying...' : 'Verify Code' }}
      </button>
    </form>

    <!-- Resend Section -->
    <div v-if="!verificationSuccess" class="space-y-4">
      <div class="text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Didn't receive the code?</p>
        
        <button
          @click="resendCode"
          :disabled="isResending || resendCooldown > 0"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 disabled:text-gray-400 dark:disabled:text-gray-500 transition-colors disabled:cursor-not-allowed"
        >
          <LoaderIcon v-if="isResending" class="animate-spin h-4 w-4 mr-2" />
          <RotateCcwIcon v-else class="w-4 h-4 mr-2" />
          <span v-if="resendCooldown > 0">
            Resend in {{ resendCooldown }}s
          </span>
          <span v-else-if="isResending">
            Sending...
          </span>
          <span v-else>
            Resend code
          </span>
        </button>
      </div>

      <!-- Help Section -->
      <div class="text-center">
        <details class="text-left">
          <summary class="text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium">
            Having trouble? View help options
          </summary>
          <div class="mt-3 text-xs text-gray-500 dark:text-gray-400 space-y-2 bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
            <p>• Check your spam or junk folder</p>
            <p>• Make sure you entered the correct email address</p>
            <p>• Codes expire after 10 minutes</p>
            <p>• Contact support if you continue having issues</p>
          </div>
        </details>
      </div>
    </div>

    <!-- Divider -->
    <div class="mt-8 mb-6">
      <div class="relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200 dark:border-slate-600"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-4 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">Need to change email?</span>
        </div>
      </div>
    </div>
 
    <!-- Navigation -->
    <div class="text-center space-y-4">
      <button 
        @click="changeEmail"
        class="inline-flex items-center text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors font-medium text-sm"
      >
        <ArrowLeftIcon class="w-4 h-4 mr-2" />
        Use different email
      </button>
      
      <div>
        <router-link 
          :to="{ name: 'Login' }" 
          class="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          Back to sign in
        </router-link>
      </div>
    </div>

    <!-- Support -->
    <div class="mt-6 text-center">
      <p class="text-xs text-gray-500 dark:text-gray-400">
        Need help? 
        <a href="mailto:support@capitalradio.co.ug" class="text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors font-medium">
          Contact support
        </a>
      </p>
    </div>
  </div>
</template>
 
<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { 
  Loader as LoaderIcon, 
  AlertCircle as AlertCircleIcon,
  CheckCircle as CheckCircleIcon,
  ShieldCheck as ShieldCheckIcon,
  RotateCcw as RotateCcwIcon,
  ArrowLeft as ArrowLeftIcon
} from 'lucide-vue-next';
 
const router = useRouter();
const route = useRoute();
const store = useStore();

// Props from URL params or passed data
const email = ref(route.query.email || '');
const verificationPurpose = ref(route.query.purpose || 'password_reset');

// Component state
const verificationCode = reactive(['', '', '', '', '', '']);
const codeInputRefs = ref([]);
const isLoading = ref(false);
const isResending = ref(false);
const verificationSuccess = ref(false);
const errorMessage = ref('');
const resendCooldown = ref(0);
const expiryTime = ref(600); // 10 minutes in seconds

let cooldownInterval = null;
let expiryInterval = null;

// Computed properties
const maskedEmail = computed(() => {
  if (!email.value) return '';
  const [username, domain] = email.value.split('@');
  const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
  return `${maskedUsername}@${domain}`;
});

const isCodeComplete = computed(() => {
  return verificationCode.every(digit => digit.length === 1);
});

// Methods
const setCodeInputRef = (el, index) => {
  if (el) {
    codeInputRefs.value[index] = el;
  }
};

const handleCodeInput = (event, index) => {
  const value = event.target.value.replace(/[^0-9]/g, '');
  verificationCode[index] = value;

  if (value && index < 5) {
    // Move to next input
    nextTick(() => {
      codeInputRefs.value[index + 1]?.focus();
    });
  }

  // Auto-submit when code is complete
  if (isCodeComplete.value) {
    nextTick(() => {
      handleVerifyCode();
    });
  }
};

const handleKeyDown = (event, index) => {
  if (event.key === 'Backspace' && !verificationCode[index] && index > 0) {
    // Move to previous input on backspace
    codeInputRefs.value[index - 1]?.focus();
  } else if (event.key === 'ArrowLeft' && index > 0) {
    codeInputRefs.value[index - 1]?.focus();
  } else if (event.key === 'ArrowRight' && index < 5) {
    codeInputRefs.value[index + 1]?.focus();
  }
};

const handlePaste = (event, index) => {
  event.preventDefault();
  const pastedData = event.clipboardData.getData('text').replace(/[^0-9]/g, '');
  
  for (let i = 0; i < Math.min(pastedData.length, 6 - index); i++) {
    verificationCode[index + i] = pastedData[i];
  }

  // Focus the last filled input or the next empty one
  const lastIndex = Math.min(index + pastedData.length - 1, 5);
  nextTick(() => {
    codeInputRefs.value[lastIndex]?.focus();
  });

  // Auto-submit if code is complete
  if (isCodeComplete.value) {
    nextTick(() => {
      handleVerifyCode();
    });
  }
};

const handleVerifyCode = async () => {
  if (!isCodeComplete.value) return;

  try {
    isLoading.value = true;
    errorMessage.value = '';

    const code = verificationCode.join('');
    
    // Call the verify reset code API directly
    const response = await store.dispatch('verifyResetCode', { 
      code: code,
      email: email.value 
    });

    verificationSuccess.value = true;
    
    // Redirect after delay
    setTimeout(() => {
      if (verificationPurpose.value === 'password_reset') {
        router.push({ 
          name: 'NewPassword', 
          query: { 
            token: code, 
            email: email.value, 
            admin_id: response.data?.data?.admin_id 
          } 
        });
      } else {
        router.push({ name: 'Login' });
      }
    }, 2000);

  } catch (error) {
    console.error('Verification error:', error);
    
    // Get error from store or use default message
    errorMessage.value = store.getters.error || error.message || 'Invalid verification code. Please try again.';
    
    // Clear the code inputs
    verificationCode.forEach((_, index) => {
      verificationCode[index] = '';
    });
    
    // Focus first input
    nextTick(() => {
      codeInputRefs.value[0]?.focus();
    });

  } finally {
    isLoading.value = false;
  }
};

const resendCode = async () => {
  try {
    isResending.value = true;
    errorMessage.value = '';

    // Call the forgot password API to resend code
    await store.dispatch('forgotAdminPassword', email.value);

    // Start cooldown
    startResendCooldown();
    
    // Reset expiry timer
    expiryTime.value = 600;

  } catch (error) {
    console.error('Resend error:', error);
    errorMessage.value = store.getters.error || error.message || 'Failed to resend code. Please try again.';
  } finally {
    isResending.value = false;
  }
};

const changeEmail = () => {
  router.push({ name: 'ResetPassword' });
};

const startResendCooldown = () => {
  resendCooldown.value = 60;
  
  cooldownInterval = setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0) {
      clearInterval(cooldownInterval);
      cooldownInterval = null;
    }
  }, 1000);
};

const startExpiryTimer = () => {
  expiryInterval = setInterval(() => {
    expiryTime.value--;
    if (expiryTime.value <= 0) {
      clearInterval(expiryInterval);
      expiryInterval = null;
      errorMessage.value = 'Verification code has expired. Please request a new one.';
    }
  }, 1000);
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Lifecycle
onMounted(() => {
  // Focus first input
  nextTick(() => {
    codeInputRefs.value[0]?.focus();
  });
  
  // Start expiry timer
  startExpiryTimer();

  // Check if email is provided
  if (!email.value) {
    router.push({ name: 'ResetPassword' });
  }
});

onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval);
  }
  if (expiryInterval) {
    clearInterval(expiryInterval);
  }
});
</script>