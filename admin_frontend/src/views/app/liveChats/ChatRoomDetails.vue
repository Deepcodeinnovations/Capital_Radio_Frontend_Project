<template>
  <div class="p-6">
    <div class="mb-6">
      <router-link to="/dashboard/live-chats" class="text-indigo-600 hover:text-indigo-800 mb-2 inline-block">
        ← Back to Chat Rooms
      </router-link>
      <h1 class="text-2xl font-bold text-gray-900">{{ chatRoom ? chatRoom.name : 'Chat Room' }}</h1>
      <p class="text-gray-600">{{ chatRoom ? chatRoom.description : 'Loading...' }}</p>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <!-- Chat Header -->
      <div class="p-4 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
        <div class="flex items-center">
          <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
            <span class="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
            {{ chatRoom ? chatRoom.activeUsers : 0 }} active users
          </span>
        </div>
        <div>
          <button class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Chat Messages -->
      <div class="p-4 h-96 overflow-y-auto" ref="chatContainer">
        <div v-for="message in messages" :key="message.id" class="mb-4">
          <div class="flex items-start">
            <div class="flex-shrink-0 mr-3">
              <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold">
                {{ message.username.charAt(0).toUpperCase() }}
              </div>
            </div>
            <div>
              <div class="flex items-center">
                <span class="font-medium text-gray-900">{{ message.username }}</span>
                <span class="ml-2 text-xs text-gray-500">{{ message.time }}</span>
              </div>
              <div class="mt-1 text-gray-800 bg-gray-100 rounded-lg p-3">
                {{ message.message }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Input -->
      <div class="p-4 border-t border-gray-200">
        <form @submit.prevent="sendMessage" class="flex">
          <input 
            type="text" 
            v-model="newMessage" 
            placeholder="Type your message..." 
            class="flex-grow rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
          <button 
            type="submit" 
            class="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const store = useStore();
const route = useRoute();
const roomId = computed(() => parseInt(route.params.id));

// In a real app, you would fetch the chat room details from an API
const chatRoom = computed(() => {
  const rooms = store.getters['liveChats/chatRooms'];
  return rooms.find(room => room.id === roomId.value);
});

const messages = computed(() => store.getters['liveChats/liveChat']);
const chatContainer = ref(null);
const newMessage = ref('');

// Scroll to bottom of chat when new messages arrive
watch(messages, async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
}, { deep: true });

// Scroll to bottom on mount
onMounted(async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
});

const sendMessage = () => {
  if (newMessage.value.trim()) {
    store.dispatch('liveChats/sendChatMessage', {
      username: 'Admin', // In a real app, this would be the current user's username
      message: newMessage.value
    });
    newMessage.value = '';
  }
};
</script>