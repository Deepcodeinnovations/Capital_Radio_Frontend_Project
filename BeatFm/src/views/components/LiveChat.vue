<template>
  <!-- Floating Chat Container -->
  <div class="fixed right-4 md:right-6 bottom-4 md:bottom-6 z-50">
    <!-- Chat Toggle Button (when minimized) -->
    <button
      v-if="!isExpanded"
      @click="toggleChat"
      class="relative w-16 h-16 bg-red-600 hover:bg-red-700 rounded-xl border-2 border-red-700 transition-all duration-300 transform hover:scale-110 group overflow-hidden shadow-lg"
      :title="`Live Chat - ${stattionData.listeners} listeners online`"
    >
      <!-- Live indicator -->
      <div
        class="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center animate-pulse shadow-md"
      >
        <div class="w-2 h-2 bg-white rounded-full"></div>
      </div>

      <!-- Chat icon -->
      <div class="relative z-10 flex items-center justify-center h-full">
        <MessageCircle class="w-7 h-7 text-white animate-bouncer" />
      </div>

      <!-- Notification badge -->
      <div
        v-if="unreadCount > 0"
        class="absolute -top-2 -left-2 bg-yellow-400 rounded-full border-2 border-white text-red-600 text-xs font-bold w-6 h-6 flex items-center justify-center animate-bouncer"
      >
        {{ unreadCount > 9 ? "9+" : unreadCount }}
      </div>

      <!-- Enhanced Tooltip -->
      <div
        class="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 rounded-lg text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none"
      >
        <div class="animate-pulse font-bold text-yellow-300">
          💬 Chat with {{ stattionData.listeners }} listeners!
        </div>
        <div class="text-gray-300 mt-1">Click to join the conversation</div>
        <div
          class="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"
        ></div>
      </div>
    </button>

    <!-- Blinking Chat Invitation Text (when minimized) -->
    <!-- Blinking Chat Invitation Text (when minimized) -->
    <div
      v-if="!isExpanded && showInviteText"
      class="absolute bottom-full right-0 mb-4 bg-gradient-to-r from-red-500 to-red-600 rounded-lg w-[200px] text-white text-xs font-bold px-3 py-2 animate-bouncer shadow-lg"
    >
      <div class="relative">
        <div class="animate-pulse font-bold">💬 Chat with other listeners!</div>
        <div class="text-xs opacity-90 mt-1">
          {{ stattionData.listeners }} online now
        </div>

        <!-- Close button -->
        <button
          @click.stop="closeInviteText"
          class="absolute top-0 right-0 p-1 text-white/80 hover:text-white hover:bg-white/20 rounded-md transition"
          title="Hide"
        >
          <X class="w-3 h-3" />
        </button>

        <!-- Arrow pointing to button -->
        <div
          class="absolute -bottom-2 right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"
        ></div>
      </div>
    </div>

    <!-- Expanded Chat Window -->
    <div
      v-if="isExpanded"
      class="w-80 md:w-96 h-[500px] md:h-[600px] bg-white/95 backdrop-blur-sm rounded-xl border border-red-200 overflow-hidden flex flex-col shadow-2xl"
    >
      <!-- Enhanced Chat header -->
      <div
        class="relative px-4 md:px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 border-b border-red-300"
      >
        <div class="relative flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- Enhanced live indicator -->
            <div class="relative">
              <div
                class="w-3 h-3 bg-yellow-400 rounded-full animate-pulse border border-yellow-500"
              ></div>
              <div
                class="absolute inset-0 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-30"
              ></div>
            </div>

            <div>
              <h3 class="font-bold text-lg text-white tracking-wide">
                LIVE CHAT
              </h3>
              <p class="text-xs text-white/90 font-medium">
                {{ stattionData.listeners }} listeners online 👥
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Online counter with users icon -->
            <div
              class="bg-yellow-400/90 text-red-600 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1"
            >
              <span class="text-xs">👥</span>
              {{ stattionData.listeners }}
            </div>

            <!-- Close button -->
            <button
              @click="toggleChat"
              class="text-white/80 hover:text-white transition-all duration-300 p-2 rounded-lg hover:bg-white/20 group"
            >
              <X
                class="h-5 w-5 group-hover:rotate-90 transition-transform duration-300"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Chat messages -->
      <div
        ref="chatContainer"
        class="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 bg-white scrollbar-thin scrollbar-thumb-red-400 scrollbar-track-gray-100"
        @click="handleChatClick"
      >
        <!-- Welcome message if no messages -->
        <div v-if="!messages || messages.length === 0" class="text-center py-8">
          <div class="text-4xl mb-2">💬</div>
          <p class="text-gray-800 text-sm font-bold">
            Welcome to Beat FM Live Chat!
          </p>
          <p class="text-gray-600 text-xs mt-1 font-medium">
            Be the first to start the conversation
          </p>
        </div>

        <div
          v-for="(message, index) in messages"
          :key="message.id || index"
          class="message-item"
          :class="message.type === 'system' ? 'text-center' : ''"
        >
          <!-- System message -->
          <div v-if="message.type === 'system'" class="relative inline-block">
            <div
              class="text-xs text-red-600 bg-red-50 rounded-full px-3 py-2 border border-red-200 font-medium"
            >
              <span class="mr-1">🔔</span>{{ message.message }}
            </div>
          </div>

          <!-- User message -->
          <div
            v-else
            class="flex items-start gap-2"
            :class="message.user.id === currentUser.id ? 'justify-end' : ''"
          >
            <!-- Avatar for other users -->
            <div
              v-if="message.user.id !== currentUser.id"
              class="relative group"
            >
              <div
                class="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-gray-200 group-hover:border-red-400 transition-all duration-300"
              >
                <img
                  v-if="message.user.image_url"
                  :src="message.user.image_url"
                  :alt="message.user.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 text-white font-bold text-xs"
                >
                  {{ message.user.name.charAt(0).toUpperCase() }}
                </div>
              </div>
              <!-- Online indicator -->
              <div
                class="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white animate-pulse"
                title="Online listener"
              ></div>
            </div>

            <!-- Message bubble -->
            <div class="relative max-w-[75%] group/message">
              <div
                :class="[
                  message.user.id === currentUser.id
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                    : 'bg-gray-100 text-gray-800 border border-gray-200',
                  'rounded-2xl px-3 py-2 transition-all duration-300 group-hover/message:scale-[1.02] shadow-sm',
                ]"
              >
                <!-- Username for other users -->
                <div
                  v-if="message.user.id !== currentUser.id"
                  class="flex items-center gap-2 mb-1"
                >
                  <span
                    class="text-xs font-bold"
                    :class="getUsernameColor(message.user.name)"
                  >
                    {{ message.user.name }}
                  </span>
                  <span class="text-xs text-gray-400">🎧</span>
                </div>

                <!-- Message content -->
                <p class="text-sm break-words leading-relaxed">
                  {{ message.message }}
                </p>

                <!-- Timestamp -->
                <div class="flex items-center justify-end mt-1">
                  <span class="text-xs opacity-60 font-medium">{{
                    message.created_at
                  }}</span>
                </div>
              </div>

              <!-- Message tail -->
              <div
                v-if="message.user.id !== currentUser.id"
                class="absolute top-3 -left-1 w-3 h-3 bg-gray-100 transform rotate-45 border-l border-b border-gray-200"
              ></div>
              <div
                v-else
                class="absolute top-3 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 transform rotate-45"
              ></div>
            </div>

            <!-- Avatar for current user -->
            <div
              v-if="message.user.id === currentUser.id"
              class="relative group"
            >
              <div
                class="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-red-300 group-hover:border-red-500 transition-all duration-300"
              >
                <img
                  v-if="currentUser.image_url"
                  :src="currentUser.image_url"
                  :alt="currentUser.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-500 text-red-600 font-bold text-xs"
                >
                  {{ currentUser.name.charAt(0).toUpperCase() }}
                </div>
              </div>
              <!-- You indicator -->
              <div
                class="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"
                title="You"
              ></div>
            </div>
          </div>
        </div>

        <!-- Typing indicator -->
        <div
          v-if="isTyping"
          class="flex items-center gap-2 text-gray-600 text-sm"
        >
          <div
            class="w-6 h-6 rounded-lg overflow-hidden flex-shrink-0 shadow-sm border border-gray-200"
          >
            <div
              class="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 text-white font-bold text-xs"
            >
              DJ
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-medium">Someone is typing</span>
            <div class="flex gap-1">
              <span
                class="w-1 h-1 bg-red-500 rounded-full animate-bounce"
              ></span>
              <span
                class="w-1 h-1 bg-red-400 rounded-full animate-bounce"
                style="animation-delay: 0.2s"
              ></span>
              <span
                class="w-1 h-1 bg-red-300 rounded-full animate-bounce"
                style="animation-delay: 0.4s"
              ></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat input -->
      <div
        class="relative p-3 md:p-4 border-t border-red-200 bg-gradient-to-r from-red-50 to-yellow-50"
      >
        <div class="relative flex gap-2">
          <!-- Emoji picker button -->
          <button
            @click="showEmojiPicker = !showEmojiPicker"
            class="flex-shrink-0 p-3 bg-yellow-400 hover:bg-yellow-500 text-red-600 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-sm"
            title="Add emoji"
          >
            😊
          </button>

          <div class="flex-1 relative group">
            <input
              ref="messageInput"
              v-model="newMessage"
              type="text"
              placeholder="Share your thoughts... 💭"
              class="w-full bg-white border border-red-200 rounded-lg py-3 px-4 pr-10 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group-hover:border-red-300"
              @keyup.enter="sendMessage"
              @click="handleInputClick"
              maxlength="500"
            />
            <div
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-gray-600 transition-colors"
            >
              <div class="w-2 h-2 bg-current rounded-full opacity-50"></div>
            </div>
          </div>

          <button
            @click="sendMessage"
            :disabled="!canSendMessage || !newMessage.trim()"
            class="relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold p-3 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg hover:shadow-red-500/30 group overflow-hidden"
            title="Send message"
          >
            <Send
              class="h-5 w-5 relative z-10 group-hover:translate-x-0.5 transition-transform duration-300"
            />
          </button>
        </div>

        <!-- Emoji picker -->
        <div
          v-if="showEmojiPicker"
          class="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg border border-red-200 shadow-xl p-4 max-h-40 overflow-y-auto"
        >
          <div class="grid grid-cols-8 gap-2">
            <button
              v-for="emoji in commonEmojis"
              :key="emoji"
              @click="addEmoji(emoji)"
              class="p-2 hover:bg-red-50 rounded-lg transition-colors text-lg"
            >
              {{ emoji }}
            </button>
          </div>
        </div>

        <!-- Info text -->
        <div class="mt-2 flex items-center gap-2 px-1">
          <Info class="h-3 w-3 text-gray-500" />
          <span class="text-xs text-gray-600 font-medium">
            <span v-if="!canSendMessage" class="text-red-600"
              >Complete your profile to join the conversation 👆</span
            >
            <span v-else
              >Chat with {{ stattionData.listeners }} listeners • Keep it
              friendly 🎵</span
            >
          </span>
        </div>
      </div>
    </div>

    <!-- User Profile Modal -->
    <div
      v-if="showUserModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div
        class="relative bg-white rounded-xl border border-red-200 p-6 w-full max-w-sm mx-4 shadow-2xl"
      >
        <div class="relative">
          <div class="text-center mb-6">
            <div
              class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg"
            >
              <MessageCircle class="h-8 w-8 text-white" />
            </div>
            <h3 class="text-xl font-bold text-red-600 mb-2 tracking-wide">
              JOIN THE CHAT 💬
            </h3>
            <p class="text-gray-600 text-sm font-medium">
              Complete your profile to start chatting with
              {{ stattionData.listeners }} other listeners
            </p>
          </div>

          <div class="space-y-4">
            <div>
              <label
                class="block text-sm font-bold text-red-600 mb-2 tracking-wide"
                >FULL NAME</label
              >
              <input
                v-model="userForm.name"
                type="text"
                required
                class="w-full bg-red-50 border border-red-200 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-300"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label
                class="block text-sm font-bold text-red-600 mb-2 tracking-wide"
                >EMAIL ADDRESS</label
              >
              <input
                v-model="userForm.email"
                type="email"
                required
                class="w-full bg-red-50 border border-red-200 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all duration-300"
                placeholder="Enter your email address"
              />
              <div
                v-if="emailError"
                class="text-red-500 text-xs mt-2 font-medium"
              >
                {{ emailError }}
              </div>
            </div>

            <div class="flex gap-3 pt-4">
              <button
                @click="updateUserProfile"
                :disabled="isUpdating || !isFormValid"
                class="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg hover:shadow-red-500/30 tracking-wide"
              >
                {{ isUpdating ? "UPDATING..." : "JOIN CHAT 🚀" }}
              </button>
              <button
                @click="closeModal"
                class="px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-all duration-300 rounded-lg text-gray-700 font-medium border border-gray-200 hover:border-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed, watch, onUnmounted } from "vue";
import { useStore } from "vuex";
import { MessageCircle, Send, Info, X } from "lucide-vue-next";

const store = useStore();

// State

const showInviteText = ref(true);
const isExpanded = ref(false);
const chatContainer = ref(null);
const messageInput = ref(null);
const newMessage = ref("");
const isTyping = ref(false);
const onlineUsers = computed(() => store.getters.station.listeners);
const unreadCount = ref(0);
const showUserModal = ref(false);
const isUpdating = ref(false);
const emailError = ref("");
const showEmojiPicker = ref(false);
const previousMessageCount = ref(0);

// User form data
const userForm = ref({
  name: "",
  email: "",
});

// Common emojis for quick access
const commonEmojis = [
  "😊",
  "😂",
  "❤️",
  "👍",
  "👎",
  "🔥",
  "🎵",
  "🎶",
  "🎧",
  "📻",
  "🎤",
  "🎸",
  "🥳",
  "😍",
  "🤔",
  "😮",
  "👏",
  "🙌",
  "💯",
  "✨",
  "⭐",
  "🌟",
  "💫",
  "🎯",
  "🚗",
  "☕",
  "🌅",
  "🌃",
  "🏙️",
  "🎪",
  "🎭",
  "🎨",
];

// Computed properties
const currentUser = computed(
  () => store.getters.authuser || { name: "Guest123", avatar: "" }
);
const messages = computed(() => store.getters.livechatmessages || []);
const stattionData = computed(() => store.getters.station);

// Check if user profile is complete
const canSendMessage = computed(() => {
  const user = currentUser.value;
  return user && user.name && user.email && !user.name?.includes("User - ");
});

// Form validation
const isFormValid = computed(() => {
  return (
    userForm.value.name.trim().length > 0 &&
    userForm.value.email.trim().length > 0 &&
    isValidEmail(userForm.value.email) &&
    !emailError.value
  );
});

// Watch for new messages and auto-scroll
watch(
  messages,
  (newMessages, oldMessages) => {
    if (newMessages && newMessages.length > 0) {
      // Check if new messages were added
      if (newMessages.length > previousMessageCount.value) {
        const newMessageCount = newMessages.length - previousMessageCount.value;

        // Update unread count if chat is minimized
        if (!isExpanded.value) {
          unreadCount.value += newMessageCount;
        }

        // Auto-scroll to bottom if chat is expanded
        if (isExpanded.value) {
          nextTick(() => {
            scrollToBottom();
          });
        }

        previousMessageCount.value = newMessages.length;
      }
    }
  },
  { deep: true, immediate: true }
);

// Methods
const toggleChat = () => {
  isExpanded.value = !isExpanded.value;
  if (isExpanded.value) {
    unreadCount.value = 0;
    showEmojiPicker.value = false;
    nextTick(() => {
      scrollToBottom();
      if (messageInput.value) {
        messageInput.value.focus();
      }
    });
  }
};

const closeInviteText = () => {
  showInviteText.value = false;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateEmail = () => {
  if (userForm.value.email && !isValidEmail(userForm.value.email)) {
    emailError.value = "Please enter a valid email address";
  } else {
    emailError.value = "";
  }
};

const handleChatClick = () => {
  if (!canSendMessage.value) {
    showUserModal.value = true;
  }
  showEmojiPicker.value = false;
};

const handleInputClick = () => {
  if (!canSendMessage.value) {
    showUserModal.value = true;
  }
  showEmojiPicker.value = false;
};

const addEmoji = (emoji) => {
  newMessage.value += emoji;
  showEmojiPicker.value = false;
  if (messageInput.value) {
    messageInput.value.focus();
  }
};

const sendMessage = () => {
  if (newMessage.value.trim() === "" || !canSendMessage.value) return;

  let data = {
    message: newMessage.value,
    user_id: currentUser.value.id,
    station_id: store.getters.station.id,
  };
  store.dispatch("send_livechat", data);
  newMessage.value = "";
  showEmojiPicker.value = false;

  nextTick(() => {
    scrollToBottom();
  });
};

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const getUsernameColor = (username) => {
  const colors = [
    "text-red-600",
    "text-gray-700",
    "text-red-500",
    "text-gray-800",
    "text-red-700",
    "text-gray-600",
  ];

  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = (hash << 5) - hash + username.charCodeAt(i);
    hash |= 0;
  }

  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
};

const updateUserProfile = async () => {
  validateEmail();
  if (!isFormValid.value) return;

  isUpdating.value = true;

  try {
    const profileData = {
      name: userForm.value.name.trim(),
      email: userForm.value.email.trim(),
    };

    await store.dispatch("update_user_profile", profileData);

    showUserModal.value = false;
    userForm.value = { name: "", email: "" };
  } catch (error) {
    console.error("Failed to update profile:", error);
  } finally {
    isUpdating.value = false;
  }
};

const closeModal = () => {
  showUserModal.value = false;
  userForm.value = { name: "", email: "" };
  emailError.value = "";
};

// Close emoji picker when clicking outside
const handleClickOutside = (event) => {
  if (showEmojiPicker.value && !event.target.closest(".emoji-picker")) {
    showEmojiPicker.value = false;
  }
};

onMounted(() => {
  scrollToBottom();

  // Initialize previous message count
  if (messages.value) {
    previousMessageCount.value = messages.value.length;
  }

  // Simulate typing indicator occasionally
  const typingInterval = setInterval(() => {
    if (isExpanded.value && Math.random() > 0.9) {
      isTyping.value = true;
      setTimeout(() => {
        isTyping.value = false;
      }, 3000);
    }
  }, 25000);

  // Add click outside listener
  document.addEventListener("click", handleClickOutside);

  const emailInput = document.querySelector('input[type="email"]');
  if (emailInput) {
    emailInput.addEventListener("input", validateEmail);
  }

  // Clean up intervals
  onUnmounted(() => {
    clearInterval(typingInterval);
    document.removeEventListener("click", handleClickOutside);
  });
});
</script>

<style scoped>
/* Custom scrollbar for better design */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-red-400 {
  scrollbar-color: #f87171 #f3f4f6;
}

.scrollbar-track-gray-100 {
  scrollbar-color: #f87171 #f3f4f6;
}

/* Webkit scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #f87171;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #ef4444;
}

/* Animations */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
