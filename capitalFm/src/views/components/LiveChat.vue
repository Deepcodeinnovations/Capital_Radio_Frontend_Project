<template>
  <!-- to revert to former design, bouncer and pulser, -->
  <!-- Floating Chat Container -->
  <div class="fixed right-4 md:right-6 bottom-4 md:bottom-6 z-50">
    <!-- Chat Toggle Button (when minimized) -->
    <button
      v-if="!isExpanded"
      @click="toggleChat"
      class="relative w-14 h-14 md:w-16 md:h-16 bg-[#F8CB00] hover:bg-yellow-500 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl group"
      :title="`Live Chat - ${stattionData.listeners} listeners online`"
    >
      <!-- Live indicator -->
      <div
        class="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center animate-pulse"
      >
        <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
      </div>

      <!-- Chat icon -->
      <div class="flex items-center justify-center h-full">
        <MessageCircle class="w-6 h-6 md:w-7 md:h-7 text-black" />
      </div>

      <!-- Notification badge -->
      <div
        v-if="unreadCount > 0"
        class="absolute -top-2 -left-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
      >
        {{ unreadCount > 9 ? "9+" : unreadCount }}
      </div>

      <!-- Tooltip -->
      <div
        class="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none"
      >
        <div class="font-medium">💬 Live Chat</div>
        <div class="text-gray-300 text-[10px] mt-0.5">{{ stattionData.listeners }} online</div>
      </div>
    </button>

    <!-- Expanded Chat Window -->
    <div
      v-if="isExpanded"
      class="w-80 md:w-96 h-[500px] md:h-[600px] bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col shadow-xl"
    >
      <!-- Chat header -->
      <div class="px-4 md:px-6 py-4 bg-black border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 bg-[#F8CB00] rounded-full animate-pulse"></div>
            <div>
              <h3 class="font-bold text-base text-white">Live Chat</h3>
              <p class="text-xs text-gray-400">{{ stattionData.listeners }} online</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <div class="bg-[#F8CB00] text-black text-xs px-2 py-1 rounded-lg font-bold flex items-center gap-1">
              <span>👥</span>
              {{ stattionData.listeners }}
            </div>
            <button
              @click="toggleChat"
              class="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800"
            >
              <X class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Chat messages -->
      <div
        ref="chatContainer"
        class="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 bg-gray-50"
        @click="handleChatClick"
      >
        <!-- Welcome message if no messages -->
        <div v-if="!messages || messages.length === 0" class="text-center py-8">
          <div class="text-4xl mb-2">💬</div>
          <p class="text-gray-500 text-sm">Welcome to Capital FM Live Chat!</p>
          <p class="text-gray-400 text-xs mt-1">
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
            <div class="text-xs text-gray-600 bg-gray-100 rounded-full px-4 py-2 border border-gray-200 font-medium">
              <span class="mr-1">ℹ️</span>{{ message.message }}
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
                class="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200"
              >
                <img
                  v-if="message.user.image_url"
                  :src="message.user.image_url"
                  :alt="message.user.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center bg-[#F8CB00] text-black font-bold text-xs uppercase"
                >
                  {{ message.user.name.charAt(0).toUpperCase() }}
                </div>
              </div>
              <!-- Online indicator -->
              <div
                class="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white"
                title="Online"
              ></div>
            </div>

            <!-- Message bubble -->
            <div class="relative max-w-[75%] group/message">
              <div
                :class="[
                  message.user.id === currentUser.id
                    ? 'bg-[#F8CB00]/20 text-gray-900 border-[#F8CB00]'
                    : 'bg-white text-gray-800 border-gray-200',
                  'rounded-2xl px-3 py-2 border',
                ]"
              >
                <!-- Username for other users -->
                <div
                  v-if="message.user.id !== currentUser.id"
                  class="flex items-center gap-2 mb-1"
                >
                  <span
                    class="text-xs font-bold uppercase tracking-wider"
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

            </div>

            <!-- Avatar for current user -->
            <div
              v-if="message.user.id === currentUser.id"
              class="relative group"
            >
              <div
                class="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-[#F8CB00]"
              >
                <img
                  v-if="currentUser.image_url"
                  :src="currentUser.image_url"
                  :alt="currentUser.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center bg-[#F8CB00] text-black font-bold text-xs uppercase"
                >
                  {{ currentUser.name.charAt(0).toUpperCase() }}
                </div>
              </div>
              <!-- You indicator -->
              <div
                class="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[#F8CB00] rounded-full border border-white"
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
            class="w-6 h-6 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200"
          >
            <div
              class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600 font-bold text-xs"
            >
              💬
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-medium">Someone is typing</span>
            <div class="flex gap-1">
              <span
                class="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
              ></span>
              <span
                class="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                style="animation-delay: 0.2s"
              ></span>
              <span
                class="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                style="animation-delay: 0.4s"
              ></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat input -->
      <div class="relative p-3 md:p-4 border-t border-gray-200 bg-white">
        <div class="relative flex gap-2">
          <!-- Emoji picker button -->
          <button
            @click="showEmojiPicker = !showEmojiPicker"
            class="flex-shrink-0 p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Add emoji"
          >
            😊
          </button>

          <div class="flex-1 relative group">
            <input
              ref="messageInput"
              v-model="newMessage"
              type="text"
              placeholder="Type your message..."
              class="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#F8CB00] focus:border-[#F8CB00] placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              @keyup.enter="sendMessage"
              @click="handleInputClick"
              maxlength="500"
            />
          </div>

          <button
            @click="sendMessage"
            :disabled="!canSendMessage || !newMessage.trim()"
            class="bg-[#F8CB00] hover:bg-yellow-500 text-black font-bold p-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send message"
          >
            <Send class="h-5 w-5" />
          </button>
        </div>

        <!-- Emoji picker -->
        <div
          v-if="showEmojiPicker"
          class="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg border border-gray-200 shadow-xl p-3 max-h-40 overflow-y-auto"
        >
          <div class="grid grid-cols-8 gap-2">
            <button
              v-for="emoji in commonEmojis"
              :key="emoji"
              @click="addEmoji(emoji)"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors text-lg"
            >
              {{ emoji }}
            </button>
          </div>
        </div>

        <!-- Info text -->
        <div class="mt-2 flex items-start gap-2 px-1">
          <Info class="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
          <span class="text-xs text-gray-500">
            <span v-if="!canSendMessage" class="text-red-600">
              Complete your profile to join the conversation
            </span>
            <span v-else>
              {{ stattionData.listeners }} listeners online • Be respectful
            </span>
          </span>
        </div>
      </div>
    </div>

    <!-- User Profile Modal -->
    <div
      v-if="showUserModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div
        class="relative bg-white rounded-2xl p-6 w-full max-w-sm mx-4 border border-gray-200 shadow-xl"
      >
        <div class="relative">
          <div class="text-center mb-6">
            <div
              class="w-14 h-14 mx-auto mb-4 bg-[#F8CB00] rounded-xl flex items-center justify-center"
            >
              <MessageCircle class="h-7 w-7 text-black" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              Join Live Chat
            </h3>
            <p class="text-gray-600 text-sm">
              Enter your details to chat with {{ stattionData.listeners }} listeners
            </p>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                v-model="userForm.name"
                type="text"
                required
                class="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F8CB00] focus:border-[#F8CB00] transition-all"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                v-model="userForm.email"
                type="email"
                required
                class="w-full bg-white border border-gray-200 rounded-lg py-2.5 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F8CB00] focus:border-[#F8CB00] transition-all"
                placeholder="Enter your email"
              />
              <div v-if="emailError" class="text-red-600 text-xs mt-1.5">
                {{ emailError }}
              </div>
            </div>

            <div class="flex gap-3 pt-4">
              <button
                @click="updateUserProfile"
                :disabled="isUpdating || !isFormValid"
                class="flex-1 bg-[#F8CB00] hover:bg-yellow-500 text-black font-bold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isUpdating ? "Joining..." : "Join Chat" }}
              </button>
              <button
                @click="closeModal"
                class="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg text-gray-700 font-medium border border-gray-200"
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
    "text-red-500",
    "text-red-600",
    "text-yellow-600",
    "text-red-700",
    "text-yellow-700",
    "text-red-400",
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

    // Close modal and reset form on success
    showUserModal.value = false;
    userForm.value = { name: "", email: "" };
    emailError.value = "";
    
    // Focus on message input after successful join
    nextTick(() => {
      if (messageInput.value) {
        messageInput.value.focus();
      }
    });
  } catch (error) {
    console.error("Failed to update profile:", error);
    emailError.value = "Failed to update profile. Please try again.";
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

  // Update online users count periodically

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
