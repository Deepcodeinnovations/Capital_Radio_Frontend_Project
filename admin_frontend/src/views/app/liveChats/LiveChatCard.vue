<template>
  <div class="bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-black/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden flex flex-col shadow-2xl h-[75vh]">
    <!-- Chat header -->
    <div class="px-4 py-3 bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- Live indicator -->
          <div class="relative">
            <div class="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
            <div class="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping opacity-30"></div>
          </div>
          
          <div>
            <h3 class="font-bold text-sm text-white">{{ stationData.name }}</h3>
            <p class="text-xs text-slate-400">{{ stationData.frequency || stationData.description }}</p>
          </div>
        </div>
        
        <!-- Online counter -->
        <div class="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-600/30 text-blue-400 text-xs px-2 py-1 rounded-full font-medium">
          {{ stationData.listeners }} online
        </div>
      </div>
    </div>
    
    <!-- Chat messages -->
    <div ref="chatContainer" class="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
      <div v-for="(message, index) in filteredMessages" :key="message.id" 
           class="message-item opacity-0 animate-fade-in group" 
           :style="`animation-delay: ${index * 0.05}s`">
        
        <!-- System message -->
        <div v-if="message.message_type === 'system'" class="text-center">
          <div class="text-xs text-slate-400 bg-slate-800/60 backdrop-blur-sm rounded-full px-3 py-1 border border-slate-600/30 inline-block">
            {{ message.message }}
          </div>
        </div>
        
        <!-- Moderator message -->
        <div v-else-if="message.message_type === 'moderator'" class="text-center relative">
          <div class="text-xs text-yellow-400 bg-yellow-900/20 backdrop-blur-sm rounded-full px-3 py-1 border border-yellow-600/30 inline-block">
            <span class="font-bold">MOD:</span> {{ message.message }}
          </div>
          <!-- Delete button for moderator messages -->
          <button
            @click="deleteMessage(message.id)"
            class="absolute -right-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
          >
            <XIcon class="h-3 w-3" />
          </button>
        </div>
        
        <!-- User message -->
        <div v-else :class="[
          'flex items-start gap-2 relative',
          isCurrentUserMessage(message) ? 'flex-row-reverse' : ''
        ]">
          <!-- Avatar -->
          <div class="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 bg-slate-700 border border-slate-600/50">
            <img v-if="message.user?.image_url" :src="message.user.image_url" :alt="message.user.name" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-bold">
              {{ getUserInitials(message.user?.name) }}
            </div>
          </div>
          
          <!-- Message content -->
          <div class="flex-1 min-w-0" :class="isCurrentUserMessage(message) ? 'mr-2' : ''">
            <div :class="[
              'rounded-lg px-3 py-2 backdrop-blur-sm',
              isCurrentUserMessage(message) 
                ? 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 border border-blue-500/30 ml-8' 
                : 'bg-slate-700/60 border border-slate-600/30'
            ]">
              <div :class="[
                'flex items-center gap-2 mb-1',
                isCurrentUserMessage(message) ? 'justify-end' : ''
              ]">
                <span class="text-xs font-medium" :class="[
                  getUsernameColor(message.user?.name),
                  isCurrentUserMessage(message) ? 'text-blue-200' : ''
                ]">
                  {{ isCurrentUserMessage(message) ? 'You' : (message.user?.name || 'Anonymous') }}
                </span>
                <span class="text-xs text-slate-500">{{ formatTimestamp(message.created_at) }}</span>
              </div>
              <p :class="[
                'text-xs break-words leading-relaxed',
                isCurrentUserMessage(message) ? 'text-white text-right' : 'text-slate-200'
              ]">{{ message.message }}</p>
            </div>
          </div>
          
          <!-- Delete button for user messages -->
          <button
            @click="deleteMessage(message.id)"
            :class="[
              'opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-600 hover:bg-red-700 text-white rounded-full p-1',
              isCurrentUserMessage(message) ? 'mr-2' : 'ml-2'
            ]"
          >
            <XIcon class="h-3 w-3" />
          </button>
        </div>
      </div>
      
      <!-- Typing indicator -->
      <div v-if="isTyping" class="flex items-center gap-2 text-slate-400 text-xs">
        <div class="w-6 h-6 rounded-lg overflow-hidden flex-shrink-0 bg-slate-700">
          <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-500 text-white text-xs">
            T
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-medium">Someone is typing</span>
          <div class="typing-dots">
            <span class="dot bg-blue-500"></span>
            <span class="dot bg-yellow-500"></span>
            <span class="dot bg-red-500"></span>
          </div>
        </div>
      </div>

      <!-- Empty messages state -->
      <div v-if="filteredMessages.length === 0" class="text-center py-8">
        <div class="text-slate-500 text-xs">
          <MessageCircleIcon class="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No messages yet. Be the first to start the conversation!</p>
        </div>
      </div>
    </div>
    
    <!-- Chat input -->
    <div class="p-3 border-t border-slate-700/50 bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80">
      <div class="flex gap-2">
        <textarea 
          v-model="newMessage" 
          placeholder="Type a message..." 
          rows="1"
          class="flex-1 bg-slate-700/70 border border-slate-600/50 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400 transition-all duration-300 resize-none min-h-[44px] max-h-32 leading-relaxed"
          @keydown.enter.exact.prevent="sendMessage"
          @keydown.enter.shift.exact="handleNewLine"
          @input="handleInputResize"
        ></textarea>
        
        <button 
          @click="sendMessage" 
          :disabled="!canSendMessage"
          class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-red-600 text-white font-medium px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 text-sm self-end"
        >
          <SendIcon class="h-4 w-4" />
        </button>
      </div>
      
      <!-- Info text -->
      <div class="mt-2 flex items-center gap-1">
        <InfoIcon class="h-3 w-3 text-slate-500" />
        <span class="text-xs text-slate-500">
          {{ canSendMessage ? 'Press Enter to send, Shift+Enter for new line' : 'Login required to chat' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useStore } from 'vuex';
import { Send as SendIcon, Info as InfoIcon, MessageCircle as MessageCircleIcon, X as XIcon } from 'lucide-vue-next';

// Props
const props = defineProps({
  stationData: {
    type: Object,
    required: true
  }
});

// Store
const store = useStore();

// Local state
const chatContainer = ref(null);
const newMessage = ref('');
const isTyping = ref(false);
const typingTimeout = ref(null);
const onlineUsers = ref(0);

// Computed - Filter messages for this specific station
const filteredMessages = computed(() => {
  const allMessages = store.getters.livechatmessages || [];
  return allMessages
    .filter(message => message.station_id === props.stationData.id && message.is_visible)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .slice(-50); // Keep last 50 messages for performance
});

// Current user
const currentUser = computed(() => store.getters.authuser);

// Check if user can send messages
const canSendMessage = computed(() => {
  return currentUser.value && currentUser.value.id && newMessage.value.trim().length > 0;
});

// Check if message is from current user
const isCurrentUserMessage = (message) => {
  return currentUser.value && message.user_id === currentUser.value.id;
};

// Handle input resize
const handleInputResize = (event) => {
  const target = event.target;
  target.style.height = 'auto';
  target.style.height = Math.min(target.scrollHeight, 128) + 'px';
  handleTyping();
};

// Handle new line
const handleNewLine = (event) => {
  // Allow default behavior for Shift+Enter (new line)
};

// Delete message function
const deleteMessage = async (messageId) => {
  try {
    let data = {
      message_id:messageId
    }
    await store.dispatch('deleteLiveChatMessage', data);
    store.dispatch('template_play_delete_file', 'Message deleted');
  } catch (error) {
    console.error('Failed to delete message:', error);
    store.dispatch('template_play_error_file', 'Failed to delete message');
  }
};

// Send message function
const sendMessage = async () => {
  if (!canSendMessage.value) return;
  
  const messageData = {
    station_id: props.stationData.id,
    message: newMessage.value.trim(),
    user_id: currentUser.value.id,
    message_type: 'user'
  };
  
  try {
    // Dispatch to store to send message
    await store.dispatch('sendLiveChatMessage', messageData);
    newMessage.value = '';
    
    nextTick(() => {
      scrollToBottom();
    });
  } catch (error) {
    console.error('Failed to send message:', error);
    store.dispatch('template_play_error_file', 'Failed to send message');
  }
};

// Handle typing indicator
const handleTyping = () => {
  if (!currentUser.value) return;
  
  // Clear existing timeout
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value);
  }
  
  // Start typing indicator
  isTyping.value = true;
  
  // Set timeout to stop typing
  typingTimeout.value = setTimeout(() => {
    isTyping.value = false;
  }, 2000);
};

// Scroll to bottom
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

// Format timestamp
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  // If less than 1 hour, show relative time
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return minutes < 1 ? 'now' : `${minutes}m`;
  }
  
  // If today, show time
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Otherwise show date
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

// Get user initials
const getUserInitials = (name) => {
  if (!name) return 'A';
  const names = name.split(' ');
  if (names.length >= 2) {
    return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
};

// Get username color
const getUsernameColor = (username) => {
  if (!username) return 'text-slate-400';
  
  const colors = [
    'text-blue-400',
    'text-yellow-400',
    'text-red-400',
    'text-green-400',
    'text-purple-400',
    'text-cyan-400',
    'text-pink-400',
    'text-orange-400'
  ];
  
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = ((hash << 5) - hash) + username.charCodeAt(i);
    hash |= 0;
  }
  
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
};

// Update online users count
const updateOnlineUsers = () => {
  // Simulate online users based on station popularity
  const baseUsers = Math.floor(Math.random() * 50) + 10;
  const messageCount = filteredMessages.value.length;
  onlineUsers.value = baseUsers + Math.floor(messageCount / 5);
};

// Watch for new messages and scroll to bottom
watch(filteredMessages, (newMessages) => {
  nextTick(() => {
    scrollToBottom();
  });
  updateOnlineUsers();
}, { deep: true });

// Mount lifecycle
onMounted(() => {
  scrollToBottom();
  updateOnlineUsers();
});
</script>

<style scoped>
/* Custom scrollbar */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(59, 130, 246, 0.5) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #7c3aed);
}

/* Typing dots animation */
.typing-dots {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  height: 1em;
}

.dot {
  width: 3px;
  height: 3px;
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

/* Fade in animation */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s forwards ease-out;
}

.message-item {
  animation-fill-mode: forwards;
}

/* Button animations */
button:not(:disabled):active {
  transform: scale(0.95);
}

/* Input focus */
input:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

/* Delete button styling */
.group:hover .opacity-0 {
  opacity: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .text-xs {
    font-size: 0.7rem;
  }
}
</style>