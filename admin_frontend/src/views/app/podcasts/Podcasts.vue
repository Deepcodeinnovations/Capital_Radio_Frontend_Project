<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Podcasts</h1>
      <button class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center">
        <PlusIcon class="h-5 w-5 mr-2" />
        Add Podcast
      </button>
    </div>

    <!-- Podcasts Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="podcast in podcasts" :key="podcast.id" class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="relative">
          <img :src="podcast.image" alt="Podcast cover" class="w-full h-48 object-cover" />
          <div class="absolute top-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
            {{ podcast.episodes }} episodes
          </div>
        </div>
        <div class="p-4">
          <h3 class="text-lg font-semibold">{{ podcast.title }}</h3>
          <p class="text-gray-600 text-sm mb-2">Host: {{ podcast.host }}</p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">{{ podcast.listeners }} listeners</span>
            <div class="flex space-x-2">
              <button class="text-gray-600 hover:text-indigo-600">
                <PlayIcon class="h-5 w-5" />
              </button>
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
import { Plus as PlusIcon, Edit as EditIcon, Trash as TrashIcon, Play as PlayIcon } from 'lucide-vue-next';

const podcasts = ref([
  {
    id: 1,
    title: 'Morning Talk Show',
    host: 'Sarah Johnson',
    episodes: 45,
    listeners: 8700,
    image: 'https://placehold.co/600x400/indigo/white?text=Morning+Talk+Show'
  },
  {
    id: 2,
    title: 'Tech Insights',
    host: 'Michael Chen',
    episodes: 32,
    listeners: 6500,
    image: 'https://placehold.co/600x400/purple/white?text=Tech+Insights'
  },
  {
    id: 3,
    title: 'Health & Wellness',
    host: 'Dr. Lisa Adams',
    episodes: 28,
    listeners: 5200,
    image: 'https://placehold.co/600x400/blue/white?text=Health+%26+Wellness'
  },
  {
    id: 4,
    title: 'Business Hour',
    host: 'Robert Miller',
    episodes: 50,
    listeners: 7300,
    image: 'https://placehold.co/600x400/green/white?text=Business+Hour'
  },
  {
    id: 5,
    title: 'Music Spotlight',
    host: 'DJ Maxwell',
    episodes: 65,
    listeners: 9100,
    image: 'https://placehold.co/600x400/red/white?text=Music+Spotlight'
  }
]);
</script>