<template>
  <div class="w-full h-full bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-black/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden flex flex-col shadow-2xl shadow-capital-purple/10">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
      <!-- Chat bubbles floating animation -->
      <div class="absolute top-1/4 left-1/4 w-4 h-4 bg-capital-blue rounded-full animate-float" style="animation-delay: 0s;"></div>
      <div class="absolute top-3/4 right-1/4 w-3 h-3 bg-capital-yellow rounded-full animate-float" style="animation-delay: 1.5s;"></div>
      <div class="absolute bottom-1/4 left-3/4 w-5 h-5 bg-capital-red rounded-full animate-float" style="animation-delay: 3s;"></div>
      
      <!-- Chat wave pattern -->
      <div class="absolute inset-0 flex items-center justify-center">
        <svg width="100%" height="40" viewBox="0 0 300 40" class="opacity-20">
          <path d="M0,20 Q75,5 150,20 T300,20" stroke="url(#chatGradient)" stroke-width="1.5" fill="none" class="animate-chat-wave"/>
          <defs>
            <linearGradient id="chatGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#00a7e1"/>
              <stop offset="50%" style="stop-color:#9d4edd"/>
              <stop offset="100%" style="stop-color:#ef233c"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>

    <!-- User Profile Modal with enhanced styling -->
    <div v-if="showUserModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div class="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md mx-4 border border-slate-700/50 shadow-2xl shadow-capital-blue/20">
        <!-- Modal glow effect -->
        <div class="absolute -inset-1 bg-gradient-to-r from-capital-blue via-capital-purple to-capital-red opacity-20 blur-xl rounded-2xl"></div>
        <div class="relative">
          <div class="text-center mb-6">
            <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-capital-blue to-capital-purple rounded-2xl flex items-center justify-center shadow-lg">
              <Settings class="h-8 w-8 text-white" />
            </div>
            <h3 class="text-2xl font-bold text-white mb-2 entertainment-text">JOIN THE CONVERSATION</h3>
            <p class="text-slate-300 text-sm">Complete your profile to start chatting with other listeners.</p>
          </div>
          
          <form @submit.prevent="updateUserProfile" class="space-y-6">
            <div>
              <label class="block text-sm font-bold text-white mb-3 entertainment-text tracking-wider">FULL NAME</label>
              <input 
                v-model="userForm.name" 
                type="text" 
                required
                class="w-full bg-slate-700/70 border border-slate-600/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-capital-blue focus:border-capital-blue transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label class="block text-sm font-bold text-white mb-3 entertainment-text tracking-wider">EMAIL ADDRESS</label>
              <input 
                v-model="userForm.email" 
                type="email" 
                required
                class="w-full bg-slate-700/70 border border-slate-600/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-capital-blue focus:border-capital-blue transition-all duration-300 backdrop-blur-sm"
                placeholder="Enter your email address"
              />
              <div v-if="emailError" class="text-capital-red text-xs mt-2 font-medium">{{ emailError }}</div>
            </div>
            
            <div class="flex gap-4 pt-4">
              <button 
                type="submit" 
                :disabled="isUpdating || !isFormValid"
                class="flex-1 bg-gradient-to-r from-capital-blue to-capital-purple hover:from-capital-purple hover:to-capital-red text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg hover:shadow-capital-blue/30 entertainment-text"
              >
                {{ isUpdating ? 'UPDATING...' : 'JOIN CHAT' }}
              </button>
              <button 
                type="button" 
                @click="closeModal"
                class="px-6 py-3 bg-slate-700/70 hover:bg-slate-600/70 transition-all duration-300 rounded-xl text-white font-medium backdrop-blur-sm border border-slate-600/50 hover:border-slate-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Enhanced Chat header -->
    <div class="relative px-6 py-4 bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
      <!-- Header glow effect -->
      <div class="absolute inset-0 bg-gradient-to-r from-capital-blue/10 via-capital-purple/10 to-capital-red/10"></div>
      
      <div class="relative flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- Enhanced live indicator -->
          <div class="relative">
            <div class="w-3 h-3 bg-capital-green rounded-full animate-pulse shadow-lg shadow-capital-green/50"></div>
            <div class="absolute inset-0 w-3 h-3 bg-capital-green rounded-full animate-ping opacity-30"></div>
          </div>
          
          <h3 class="font-bold text-xl text-white entertainment-text tracking-wide">LIVE CHAT</h3>
          
          <!-- Enhanced online counter -->
          <div class="bg-gradient-to-r from-capital-blue/20 to-capital-purple/20 border border-capital-blue/30 text-capital-blue text-xs px-3 py-1.5 rounded-full font-bold entertainment-text tracking-wider backdrop-blur-sm">
            {{ onlineUsers }} ONLINE
          </div>
        </div>
        
        <button class="text-slate-400 hover:text-white transition-all duration-300 p-2 rounded-xl hover:bg-slate-700/50 backdrop-blur-sm group">
          <Settings class="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>
    </div>
    
    <!-- Enhanced Chat messages -->
    <div ref="chatContainer" class="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar" @click="handleChatClick">
      <div v-for="(message, index) in messages" :key="index" 
           class="message-item opacity-0 animate-fade-in" 
           :class="message.type === 'system' ? 'text-center' : ''"
           :style="`animation-delay: ${index * 0.1}s`">
        
        <!-- Enhanced System message -->
        <div v-if="message.type === 'system'" class="relative inline-block">
          <div class="text-xs text-slate-400 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-600/30 font-medium entertainment-text tracking-wide">
            {{ message.message }}
          </div>
        </div>
        
        <!-- Enhanced User message -->
        <div v-else class="flex items-start gap-3" :class="message.user.id === currentUser.id ? 'justify-end' : ''">
          <!-- Enhanced Avatar for other users -->
          <div v-if="message.user.id !== currentUser.id" class="relative group">
            <div class="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-slate-700 shadow-lg border-2 border-slate-600/50 group-hover:border-capital-blue/50 transition-all duration-300">
              <img v-if="message.user.image_url" :src="message.user.image_url" :alt="message.user.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-capital-blue to-capital-purple text-white font-bold entertainment-text">
                {{ message.user.name.charAt(0).toUpperCase() }}
              </div>
            </div>
            <!-- Online indicator -->
            <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-capital-green rounded-full border-2 border-slate-900 animate-pulse"></div>
          </div>
          
          <!-- Enhanced Message bubble -->
          <div class="relative max-w-[80%] group/message">
            <div :class="[
              message.user.id === currentUser.id 
                ? 'bg-gradient-to-r from-capital-blue/30 to-capital-purple/30 text-white border-capital-blue/30' 
                : 'bg-gradient-to-br from-slate-700/80 to-slate-800/80 text-slate-200 border-slate-600/30',
              'rounded-2xl px-4 py-3 border backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group-hover/message:scale-[1.02]'
            ]">
              <!-- Username for other users with enhanced styling -->
              <div v-if="message.user.id !== currentUser.id" class="flex items-center gap-2 mb-2">
                <span class="text-xs font-bold entertainment-text tracking-wider" :class="getUsernameColor(message.user.name)">
                  {{ message.user.name.toUpperCase() }}
                </span>
                <div class="w-1 h-1 bg-current rounded-full opacity-50"></div>
              </div>
              
              <!-- Enhanced Message content -->
              <p class="text-sm break-words leading-relaxed">{{ message.message }}</p>
              
              <!-- Enhanced timestamp -->
              <div class="flex items-center justify-end gap-2 mt-2">
                <span class="text-xs opacity-60 font-medium">{{ message.created_at }}</span>
                <div v-if="message.user.id === currentUser.id" class="w-3 h-3 rounded-full bg-current opacity-20"></div>
              </div>
            </div>
            
            <!-- Message tail -->
            <div v-if="message.user.id !== currentUser.id" 
                 class="absolute top-4 -left-2 w-4 h-4 bg-gradient-to-br from-slate-700/80 to-slate-800/80 transform rotate-45 border-l border-b border-slate-600/30"></div>
            <div v-else 
                 class="absolute top-4 -right-2 w-4 h-4 bg-gradient-to-r from-capital-blue/30 to-capital-purple/30 transform rotate-45 border-r border-t border-capital-blue/30"></div>
          </div>
          
          <!-- Enhanced Avatar for current user -->
          <div v-if="message.user.id === currentUser.id" class="relative group">
            <div class="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-slate-700 shadow-lg border-2 border-capital-purple/50 group-hover:border-capital-yellow/50 transition-all duration-300">
              <img v-if="currentUser.image_url" :src="currentUser.image_url" :alt="currentUser.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-capital-purple to-capital-red text-white font-bold entertainment-text">
                {{ currentUser.name.charAt(0).toUpperCase() }}
              </div>
            </div>
            <!-- You indicator -->
            <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-capital-yellow rounded-full border-2 border-slate-900"></div>
          </div>
        </div>
      </div>
      
      <!-- Enhanced Typing indicator -->
      <div v-if="isTyping" class="flex items-center gap-3 text-slate-400 text-sm animate-fade-in">
        <div class="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0 bg-slate-700 shadow-md border border-slate-600/50">
          <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="User typing" class="w-full h-full object-cover" />
        </div>
        <div class="flex items-center gap-2">
          <span class="font-medium">Lucky is typing</span>
          <div class="typing-dots">
            <span class="dot bg-capital-blue"></span>
            <span class="dot bg-capital-yellow"></span>
            <span class="dot bg-capital-red"></span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Enhanced Chat input -->
    <div class="relative p-6 border-t border-slate-700/50 bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-md">
      <!-- Input glow effect -->
      <div class="absolute inset-0 bg-gradient-to-r from-capital-blue/5 via-capital-purple/5 to-capital-red/5"></div>
      
      <div class="relative flex gap-3">
        <div class="flex-1 relative group">
          <input 
            v-model="newMessage" 
            type="text" 
            placeholder="Share your thoughts with fellow listeners..." 
            :disabled="!canSendMessage"
            class="w-full bg-slate-700/70 border border-slate-600/50 rounded-xl py-3 px-4 pr-12 text-white text-sm focus:outline-none focus:ring-2 focus:ring-capital-blue focus:border-capital-blue placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm group-hover:border-slate-500/70"
            @keyup.enter="sendMessage"
            @click="handleInputClick"
          />
          <!-- Input decoration -->
          <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 group-hover:text-slate-400 transition-colors">
            <div class="w-2 h-2 bg-current rounded-full opacity-50"></div>
          </div>
        </div>
        
        <button 
          @click="sendMessage" 
          :disabled="!canSendMessage"
          class="relative bg-gradient-to-r from-capital-blue to-capital-purple hover:from-capital-purple hover:to-capital-red text-white font-bold p-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg hover:shadow-capital-blue/30 group overflow-hidden"
        >
          <!-- Button shine effect -->
          <div class="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
          <Send class="h-5 w-5 relative z-10 group-hover:translate-x-0.5 transition-transform duration-300" />
        </button>
      </div>
      
      <!-- Enhanced info text -->
      <div class="mt-3 flex items-center gap-2 px-2">
        <Info class="h-3 w-3 text-slate-500" />
        <span class="text-xs text-slate-500 font-medium">
          <span v-if="!canSendMessage" class="text-capital-yellow">Complete your profile to join the conversation.</span>
          <span v-else>Keep it friendly and respectful. Broadcasting guidelines apply.</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue';
import { useStore } from 'vuex';
import { Settings, Send, Info } from 'lucide-vue-next';

const store = useStore();

// State for chat
const chatContainer = ref(null);
const newMessage = ref('');
const isTyping = ref(false);
const onlineUsers = ref(42);
const showUserModal = ref(false);
const isUpdating = ref(false);
const emailError = ref('');

// User form data
const userForm = ref({
  name: '',
  email: ''
});

// Current user from store
const currentUser = computed(() => store.getters.authuser || { name: 'Guest123', avatar: '' });
const messages = computed(() => store.getters.livechatmessages);

// Check if user profile is complete
const canSendMessage = computed(() => {
  const user = currentUser.value;
  return user && user.name && user.email && !user.name?.includes('User - ');
});

// Form validation
const isFormValid = computed(() => {
  return userForm.value.name.trim().length > 0 && 
         userForm.value.email.trim().length > 0 && 
         isValidEmail(userForm.value.email) &&
         !emailError.value;
});

// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Watch email input for validation
const validateEmail = () => {
  if (userForm.value.email && !isValidEmail(userForm.value.email)) {
    emailError.value = 'Please enter a valid email address';
  } else {
    emailError.value = '';
  }
};

// Handle chat area click
const handleChatClick = () => {
  if (!canSendMessage.value) {
    showUserModal.value = true;
  }
};

// Handle input click
const handleInputClick = () => {
  if (!canSendMessage.value) {
    showUserModal.value = true;
  }
};

// Update user profile
const updateUserProfile = async () => {
  validateEmail();
  if (!isFormValid.value) return;
  
  isUpdating.value = true;
  
  try {
    const profileData = {
      name: userForm.value.name.trim(),
      email: userForm.value.email.trim()
    };
    
    await store.dispatch('update_user_profile', profileData);
    
    showUserModal.value = false;
    userForm.value = { name: '', email: '' };
  } catch (error) {
    console.error('Failed to update profile:', error);
  } finally {
    isUpdating.value = false;
  }
};

// Close modal
const closeModal = () => {
  showUserModal.value = false;
  userForm.value = { name: '', email: '' };
  emailError.value = '';
};

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function sendMessage() {
  if (newMessage.value.trim() === '' || !canSendMessage.value) return;
  
  let data = {
    message: newMessage.value,
    user_id: currentUser.value.id,
    station_id: store.getters.station.id
  }
  store.dispatch('send_livechat', data)
  newMessage.value = '';
  nextTick(() => {
    scrollToBottom();
  });
}

function scrollToBottom() {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
}

function getUsernameColor(username) {
  const colors = [
    'text-capital-blue',
    'text-capital-yellow',
    'text-capital-red',
    'text-capital-green',
    'text-capital-purple',
    'text-capital-cyan'
  ];
  
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = ((hash << 5) - hash) + username.charCodeAt(i);
    hash |= 0;
  }
  
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
}

onMounted(() => {
  scrollToBottom();
  onlineUsers.value = Math.floor(40 + Math.random() * 15);
  
  const emailInput = document.querySelector('input[type="email"]');
  if (emailInput) {
    emailInput.addEventListener('input', validateEmail);
  }
});
</script>

<style scoped>
/* Entertainment-focused styling */


/* Custom scrollbar */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 167, 225, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #00a7e1, #9d4edd);
  border-radius: 6px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #0086b3, #7c3aed);
}

/* Enhanced typing dots */
.typing-dots {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 1em;
}

.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  animation: dot-flashing 1.2s infinite alternate;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dot-flashing {
  0% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Enhanced animations */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(15px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.4s forwards ease-out;
}

.message-item {
  animation-fill-mode: forwards;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg);
    opacity: 0.6;
  }
  50% { 
    transform: translateY(-8px) rotate(2deg);
    opacity: 1;
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

@keyframes chat-wave {
  0%, 100% { 
    d: path("M0,20 Q75,5 150,20 T300,20");
  }
  50% { 
    d: path("M0,20 Q75,35 150,20 T300,20");
  }
}

.animate-chat-wave {
  animation: chat-wave 6s ease-in-out infinite;
}

@keyframes shimmer {
  0% { 
    transform: translateX(-100%) skewX(-15deg);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% { 
    transform: translateX(200%) skewX(-15deg);
    opacity: 0;
  }
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}

/* Enhanced hover effects */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:rotate-90 {
  transform: rotate(90deg);
}

.group:hover .group-hover\:translate-x-0\.5 {
  transform: translateX(2px);
}

/* Message bubble enhancements */
.group\/message:hover {
  z-index: 10;
}

/* Button enhancements */
button:disabled {
  cursor: not-allowed;
  filter: grayscale(0.3);
}

button:not(:disabled):active {
  transform: scale(0.97);
}

/* Form enhancements */
input:focus {
  box-shadow: 0 0 0 3px rgba(0, 167, 225, 0.1);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .entertainment-text {
    font-size: 0.9em;
    letter-spacing: 0.3px;
  }
  
  .animate-float,
  .animate-chat-wave,
  .animate-shimmer {
    animation-duration: 8s;
  }
}

/* Accessibility enhancements */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-float,
  .animate-chat-wave,
  .animate-shimmer,
  .animate-pulse,
  .animate-ping {
    animation: none;
  }
  
  .transition-all,
  .transition-colors,
  .transition-transform {
    transition: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .border-slate-700\/50,
  .border-slate-600\/30 {
    border-color: rgba(148, 163, 184, 0.8);
  }
  
  .text-slate-300,
  .text-slate-400 {
    color: rgb(203, 213, 225);
  }
}
</style>