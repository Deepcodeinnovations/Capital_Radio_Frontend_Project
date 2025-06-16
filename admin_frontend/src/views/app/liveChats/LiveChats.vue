<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Live Chats</h1>
      <p class="text-gray-600">Engage with your audience in real-time conversations</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <div v-for="room in chatRooms" :key="room.id" class="bg-white rounded-lg shadow overflow-hidden">
        <div class="p-6">
          <div class="flex justify-between items-start">
            <h2 class="text-xl font-semibold text-indigo-700">
              <router-link :to="`/dashboard/live-chats/${room.id}`" class="hover:underline">
                {{ room.name }}
              </router-link>
            </h2>
            <span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
              <span class="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              {{ room.activeUsers }} active
            </span>
          </div>
          <p class="text-gray-600 mt-2">{{ room.description }}</p>
          <div class="mt-4">
            <router-link :to="`/dashboard/live-chats/${room.id}`" class="inline-flex items-center justify-center py-2 px-4 w-full border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Join Chat
            </router-link>
          </div>
        </div>
      </div>

      <!-- Create New Chat Room Card -->
      <div class="bg-white rounded-lg shadow overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center p-6">
        <div class="text-center">
          <button @click="showNewRoomForm = true" class="text-indigo-600 hover:text-indigo-800 font-medium flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create New Chat Room</span>
          </button>
        </div>
      </div>
    </div>

    <!-- New Chat Room Modal -->
    <div v-if="showNewRoomForm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-xl font-semibold">Create New Chat Room</h2>
          <button @click="showNewRoomForm = false" class="text-gray-400 hover:text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form @submit.prevent="createChatRoom" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Room Name</label>
            <input type="text" id="name" v-model="newRoom.name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required>
          </div>
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" v-model="newRoom.description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required></textarea>
          </div>
          <div class="flex justify-end space-x-3 pt-4">
            <button type="button" @click="showNewRoomForm = false" class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancel
            </button>
            <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const chatRooms = computed(() => store.getters['liveChats/chatRooms']);

const showNewRoomForm = ref(false);
const newRoom = ref({
  name: '',
  description: ''
});

const createChatRoom = () => {
  // In a real app, this would call an API to create the chat room
  console.log('Creating chat room:', newRoom.value);
  showNewRoomForm.value = false;
  // Reset form
  newRoom.value = {
    name: '',
    description: ''
  };
};
</script>