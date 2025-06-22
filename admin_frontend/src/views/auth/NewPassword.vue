<template>
    <div class="max-w-md w-full space-y-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-10 rounded-xl shadow-2xl border border-purple-200 dark:border-slate-700">
      <!-- Header -->
      <div class="text-center">
        <div class="mx-auto w-12 h-12 bg-gradient-to-r from-purple-600 to-orange-500 rounded-full flex items-center justify-center mb-4">
          <LockIcon class="w-6 h-6 text-white" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Set New Password</h2>
        <p class="text-gray-600 dark:text-gray-300 mt-1 max-w-sm mx-auto">
          Create a strong password for your account. Make sure it's at least 8 characters long.
        </p>
      </div>
  
      <!-- Success Message -->
      <div v-if="passwordUpdated" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div class="flex items-start">
          <CheckCircleIcon class="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h4 class="font-medium text-green-900 dark:text-green-200 mb-1">Password updated successfully!</h4>
            <p class="text-sm text-green-700 dark:text-green-300">
              Your password has been changed. You can now sign in with your new password.
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
  
      <!-- Password Form (hidden after success) -->        
      <form v-if="!passwordUpdated" class="space-y-5" @submit.prevent="handleUpdatePassword">
        <!-- New Password Field -->
        <div>
          <label for="password" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            New Password
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon class="h-5 w-5 text-purple-400 dark:text-purple-300" />
            </div>
            <input
              id="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              required
              v-model="form.password"
              @input="validatePassword"
              class="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your new password"
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
          
          <!-- Password Strength Indicator -->
          <div class="mt-3">
            <div class="flex items-center space-x-2 mb-2">
              <div class="flex-1 bg-gray-200 dark:bg-slate-600 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-300"
                  :class="passwordStrengthColor"
                  :style="{ width: passwordStrengthWidth }"
                ></div>
              </div>
              <span class="text-xs font-medium" :class="passwordStrengthTextColor">
                {{ passwordStrengthText }}
              </span>
            </div>
            
            <!-- Password Requirements -->
            <div class="space-y-1">
              <div class="flex items-center space-x-2 text-xs">
                <CheckCircleIcon v-if="passwordValidation.length" class="w-3 h-3 text-green-500" />
                <XIcon v-else class="w-3 h-3 text-gray-400" />
                <span :class="passwordValidation.length ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'">
                  At least 8 characters
                </span>
              </div>
              <div class="flex items-center space-x-2 text-xs">
                <CheckCircleIcon v-if="passwordValidation.uppercase" class="w-3 h-3 text-green-500" />
                <XIcon v-else class="w-3 h-3 text-gray-400" />
                <span :class="passwordValidation.uppercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'">
                  One uppercase letter
                </span>
              </div>
              <div class="flex items-center space-x-2 text-xs">
                <CheckCircleIcon v-if="passwordValidation.lowercase" class="w-3 h-3 text-green-500" />
                <XIcon v-else class="w-3 h-3 text-gray-400" />
                <span :class="passwordValidation.lowercase ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'">
                  One lowercase letter
                </span>
              </div>
              <div class="flex items-center space-x-2 text-xs">
                <CheckCircleIcon v-if="passwordValidation.number" class="w-3 h-3 text-green-500" />
                <XIcon v-else class="w-3 h-3 text-gray-400" />
                <span :class="passwordValidation.number ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'">
                  One number
                </span>
              </div>
              <div class="flex items-center space-x-2 text-xs">
                <CheckCircleIcon v-if="passwordValidation.special" class="w-3 h-3 text-green-500" />
                <XIcon v-else class="w-3 h-3 text-gray-400" />
                <span :class="passwordValidation.special ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'">
                  One special character (!@#$%^&*)
                </span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Confirm Password Field -->
        <div>
          <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Confirm New Password
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon class="h-5 w-5 text-purple-400 dark:text-purple-300" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              autocomplete="new-password"
              required
              v-model="form.confirmPassword"
              class="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': form.confirmPassword && !passwordsMatch }"
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-400 dark:text-purple-300 hover:text-purple-600 dark:hover:text-purple-100 transition-colors"
            >
              <EyeIcon v-if="!showConfirmPassword" class="h-5 w-5" />
              <EyeOffIcon v-else class="h-5 w-5" />
            </button>
          </div>
          
          <!-- Password Match Indicator -->
          <div v-if="form.confirmPassword" class="mt-2">
            <div class="flex items-center space-x-2 text-xs">
              <CheckCircleIcon v-if="passwordsMatch" class="w-3 h-3 text-green-500" />
              <XIcon v-else class="w-3 h-3 text-red-500" />
              <span :class="passwordsMatch ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ passwordsMatch ? 'Passwords match' : 'Passwords do not match' }}
              </span>
            </div>
          </div>
        </div>
   
        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading || !isFormValid"
          class="relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <LoaderIcon v-if="isLoading" class="w-5 h-5 mr-2 animate-spin" />
          <LockIcon v-else class="w-5 h-5 mr-2" />
          {{ isLoading ? 'Updating password...' : 'Update Password' }}
        </button>
      </form>
  
      <!-- Success State Actions -->
      <div v-if="passwordUpdated" class="space-y-4">
        <button
          @click="goToLogin"
          class="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <LogInIcon class="w-5 h-5 mr-2" />
          <span>Continue to Sign In</span>
        </button>
      </div>
  
      <!-- Security Notice -->
      <div class="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div class="flex">
          <InfoIcon class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div class="ml-3">
            <h4 class="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">Security Tips</h4>
            <ul class="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Use a unique password you haven't used before</li>
              <li>• Consider using a password manager</li>
              <li>• Don't share your password with anyone</li>
              <li>• Update your password regularly</li>
            </ul>
          </div>
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
  import { ref, reactive, computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter, useRoute } from 'vue-router';
  import { 
    Lock as LockIcon,
    Eye as EyeIcon,
    EyeOff as EyeOffIcon,
    CheckCircle as CheckCircleIcon,
    X as XIcon,
    AlertCircle as AlertCircleIcon,
    Loader as LoaderIcon,
    LogIn as LogInIcon,
    Info as InfoIcon
  } from 'lucide-vue-next';
   
  const store = useStore();
  const router = useRouter();
  const route = useRoute();
  
  // Form state
  const form = reactive({
    password: '',
    confirmPassword: ''
  });
  
  // Component state
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  const isLoading = ref(false);
  const passwordUpdated = ref(false);
  const errorMessage = ref('');
  
  // Get token and email from URL params
  const token = ref(route.query.token || '');
  const email = ref(route.query.email || '');
  const admin_id = ref(route.query.admin_id || '');
  
  // Password validation
  const passwordValidation = reactive({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  
  // Computed properties
  const passwordsMatch = computed(() => {
    return form.password && form.confirmPassword && form.password === form.confirmPassword;
  });
  
  const passwordStrength = computed(() => {
    const criteria = Object.values(passwordValidation);
    const metCriteria = criteria.filter(Boolean).length;
    return metCriteria;
  });
  
  const passwordStrengthWidth = computed(() => {
    return `${(passwordStrength.value / 5) * 100}%`;
  });
  
  const passwordStrengthColor = computed(() => {
    const strength = passwordStrength.value;
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 2) return 'bg-orange-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  });
  
  const passwordStrengthText = computed(() => {
    const strength = passwordStrength.value;
    if (strength <= 1) return 'Weak';
    if (strength <= 2) return 'Fair';
    if (strength <= 3) return 'Good';
    if (strength <= 4) return 'Strong';
    return 'Excellent';
  });
  
  const passwordStrengthTextColor = computed(() => {
    const strength = passwordStrength.value;
    if (strength <= 1) return 'text-red-600 dark:text-red-400';
    if (strength <= 2) return 'text-orange-600 dark:text-orange-400';
    if (strength <= 3) return 'text-yellow-600 dark:text-yellow-400';
    if (strength <= 4) return 'text-blue-600 dark:text-blue-400';
    return 'text-green-600 dark:text-green-400';
  });
  
  const isFormValid = computed(() => {
    return Object.values(passwordValidation).every(Boolean) && passwordsMatch.value;
  });
  
  // Methods
  const validatePassword = () => {
    const password = form.password;
    
    passwordValidation.length = password.length >= 8;
    passwordValidation.uppercase = /[A-Z]/.test(password);
    passwordValidation.lowercase = /[a-z]/.test(password);
    passwordValidation.number = /\d/.test(password);
    passwordValidation.special = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  };
  
  const handleUpdatePassword = async () => {
    if (!isFormValid.value) {
      errorMessage.value = 'Please ensure all password requirements are met and passwords match.';
      return;
    }
  
    try {
      isLoading.value = true;
      errorMessage.value = '';
  
      const data = {
        email: email.value,
        password: form.password,
        admin_id: admin_id.value
      };
  
      // Call the reset admin password API directly
      await store.dispatch('resetAdminPassword', data);
  
      // Show success state
      passwordUpdated.value = true;
  
    } catch (error) {
      console.error('Update password error:', error);
      
      // Get error from store or use default message
      errorMessage.value = store.getters.error || error.message || 'Failed to update password. Please try again.';
      
    } finally {
      isLoading.value = false;
    }
  };
  
  const goToLogin = () => {
    router.push({ name: 'Login' });
  };
  
  // Check if we have required params on mount
  onMounted(() => {
    if (!token.value || !email.value) {
      router.push({ name: 'ResetPassword' });
    }
  });
  </script>