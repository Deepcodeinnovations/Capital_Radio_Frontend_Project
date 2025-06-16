<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Live Broadcast</h1>
      <button class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center">
        <RadioIcon class="h-5 w-5 mr-2" />
        Start New Broadcast
      </button>
    </div>

    <!-- Current Broadcast -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex flex-col md:flex-row gap-6">
        <div class="md:w-1/3">
          <div class="relative rounded-lg overflow-hidden">
            <img src="https://placehold.co/600x400/indigo/white?text=Live+Now" alt="Live broadcast" class="w-full h-64 object-cover" />
            <div class="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <CircleIcon class="h-2 w-2 mr-1 animate-pulse" />
              LIVE
            </div>
          </div>
        </div>
        <div class="md:w-2/3">
          <h2 class="text-xl font-bold mb-2">Morning Drive with DJ Maxwell</h2>
          <div class="flex items-center text-gray-600 mb-4">
            <UsersIcon class="h-4 w-4 mr-2" />
            <span>{{ currentBroadcast.listeners.toLocaleString() }} listeners</span>
            <ClockIcon class="h-4 w-4 ml-4 mr-2" />
            <span>Started at {{ currentBroadcast.startTime }}</span>
          </div>
          <p class="text-gray-700 mb-4">{{ currentBroadcast.description }}</p>
          
          <div class="flex flex-wrap gap-2 mb-4">
            <span v-for="tag in currentBroadcast.tags" :key="tag" class="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm">
              #{{ tag }}
            </span>
          </div>
          
          <div class="flex space-x-2">
            <button class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center">
              <StopCircleIcon class="h-5 w-5 mr-2" />
              End Broadcast
            </button>
            <button class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center">
              <MessageSquareIcon class="h-5 w-5 mr-2" />
              View Chat
            </button>
            <button class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center">
              <SettingsIcon class="h-5 w-5 mr-2" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Upcoming Broadcasts -->
    <h2 class="text-xl font-bold mb-4">Upcoming Broadcasts</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="broadcast in upcomingBroadcasts" :key="broadcast.id" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="relative">
          <img :src="broadcast.image" alt="Broadcast cover" class="w-full h-48 object-cover" />
          <div class="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
            {{ broadcast.time }}
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-lg font-semibold">{{ broadcast.title }}</h3>
          <p class="text-gray-600 text-sm mb-2">Host: {{ broadcast.host }}</p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">{{ broadcast.duration }} mins</span>
            <div class="flex space-x-2">
              <button class="text-gray-600 hover:text-indigo-600">
                <EditIcon class="h-5 w-5" />
              </button>
              <button class="text-gray-600 hover:text-red-600">
                <TrashIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { 
  Radio as RadioIcon, 
  Circle as CircleIcon,
  Users as UsersIcon,
  Clock as ClockIcon,
  StopCircle as StopCircleIcon,
  MessageSquare as MessageSquareIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  Trash as TrashIcon
} from 'lucide-vue-next';

const currentBroadcast = ref({
  id: 1,
  title: 'Morning Drive with DJ Maxwell',
  host: 'DJ Maxwell',
  startTime: '07:00 AM',
  duration: 180,
  listeners: 3542,
  description: 'Wake up with the best hits and morning talk to start your day right. Taking requests and shoutouts from listeners.',
  tags: ['MorningShow', 'HitMusic', 'Requests']
});

const upcomingBroadcasts = ref([
  {
    id: 1,
    title: 'Afternoon Groove Session',
    host: 'DJ Harmony',
    time: '15:00',
    duration: 120,
    image: 'https://placehold.co/600x400/purple/white?text=Afternoon+Groove'
  },
  {
    id: 2,
    title: 'Evening Jazz',
    host: 'Sarah Lee',
    time: '19:30',
    duration: 90,
    image: 'https://placehold.co/600x400/blue/white?text=Evening+Jazz'
  },
  {
    id: 3,
    title: 'Night Drive Mix',
    host: 'DJ Pulse',
    time: '22:00',
    duration: 180,
    image: 'https://placehold.co/600x400/green/white?text=Night+Drive'
  }
]);
</script>