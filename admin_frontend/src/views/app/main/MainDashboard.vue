<template>
  <div class="space-y-6">
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-radio-purple-600">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Total Stations</p>
            <p class="text-2xl font-bold text-gray-900">5</p>
          </div>
          <div class="p-3 bg-radio-purple-100 rounded-full">
            <RadioIcon class="h-6 w-6 text-radio-purple-600" />
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center">
            <ArrowUpIcon class="h-4 w-4 text-green-500 mr-1" />
            <span class="text-xs font-medium text-green-500">12% increase</span>
            <span class="text-xs text-gray-500 ml-2">from last month</span>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-radio-orange-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Total Podcasts</p>
            <p class="text-2xl font-bold text-gray-900">28</p>
          </div>
          <div class="p-3 bg-radio-orange-100 rounded-full">
            <HeadphonesIcon class="h-6 w-6 text-radio-orange-500" />
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center">
            <ArrowUpIcon class="h-4 w-4 text-green-500 mr-1" />
            <span class="text-xs font-medium text-green-500">8% increase</span>
            <span class="text-xs text-gray-500 ml-2">from last month</span>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">News Articles</p>
            <p class="text-2xl font-bold text-gray-900">42</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-full">
            <NewspaperIcon class="h-6 w-6 text-blue-500" />
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center">
            <ArrowUpIcon class="h-4 w-4 text-green-500 mr-1" />
            <span class="text-xs font-medium text-green-500">15% increase</span>
            <span class="text-xs text-gray-500 ml-2">from last month</span>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-500">Active Hosts</p>
            <p class="text-2xl font-bold text-gray-900">12</p>
          </div>
          <div class="p-3 bg-green-100 rounded-full">
            <UsersIcon class="h-6 w-6 text-green-500" />
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center">
            <ArrowUpIcon class="h-4 w-4 text-green-500 mr-1" />
            <span class="text-xs font-medium text-green-500">2 new</span>
            <span class="text-xs text-gray-500 ml-2">this month</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Live Now Section -->
    <div class="bg-gradient-to-r from-radio-purple-800 to-radio-purple-900 rounded-xl shadow-lg p-6 text-white">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold flex items-center">
          <CircleDotIcon class="h-5 w-5 text-red-500 mr-2 animate-pulse" />
          Live Now
        </h2>
        <router-link to="/dashboard/live-broadcast" class="text-sm text-radio-orange-300 hover:text-radio-orange-200 flex items-center">
          View All <ArrowRightIcon class="h-4 w-4 ml-1" />
        </router-link>
      </div>
      
      <div class="bg-radio-purple-700/50 rounded-lg p-4 backdrop-blur-sm">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div class="flex items-center mb-4 md:mb-0">
            <div class="h-16 w-16 rounded-full bg-radio-orange-500 flex items-center justify-center text-white font-bold text-xl mr-4">
              UV
            </div>
            <div>
              <h3 class="font-bold text-lg">{{ liveNow.title }}</h3>
              <p class="text-radio-purple-200">Urban Vibe FM</p>
              <div class="flex items-center mt-1">
                <UserIcon class="h-4 w-4 mr-1 text-radio-purple-300" />
                <span class="text-sm text-radio-purple-300">{{ liveNow.host }}</span>
              </div>
            </div>
          </div>
          
          <div class="flex flex-col items-end">
            <div class="flex items-center space-x-2 mb-2">
              <span class="text-sm bg-radio-purple-600 px-2 py-1 rounded">On Air</span>
              <span class="text-sm">{{ liveNow.time }}</span>
            </div>
            <div class="flex space-x-2">
              <button class="bg-radio-orange-500 hover:bg-radio-orange-600 p-2 rounded-full transition-colors">
                <PlayIcon class="h-5 w-5" />
              </button>
              <button class="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                <MessageSquareIcon class="h-5 w-5" />
              </button>
              <button class="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                <ShareIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recent Content Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Podcasts -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900">Recent Podcasts</h2>
          <router-link to="/dashboard/podcasts" class="text-sm text-radio-purple-600 hover:text-radio-purple-800 flex items-center">
            View All <ArrowRightIcon class="h-4 w-4 ml-1" />
          </router-link>
        </div>
        
        <div class="space-y-4">
          <div v-for="(track, index) in recentlyPlayed" :key="track.id" class="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div class="h-12 w-12 rounded-lg bg-gradient-to-br from-radio-purple-500 to-radio-orange-500 flex items-center justify-center text-white mr-4">
              <HeadphonesIcon class="h-6 w-6" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-gray-900 truncate">{{ track.title }}</h3>
              <p class="text-xs text-gray-500">{{ track.artist }} • {{ track.time }}</p>
            </div>
            <div class="flex space-x-2">
              <button class="text-gray-400 hover:text-radio-purple-600">
                <PlayIcon class="h-5 w-5" />
              </button>
              <button class="text-gray-400 hover:text-radio-purple-600">
                <DownloadIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Live Chat Section -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900">Live Chat</h2>
          <router-link to="/dashboard/live-chats" class="text-sm text-radio-purple-600 hover:text-radio-purple-800 flex items-center">
            View All <ArrowRightIcon class="h-4 w-4 ml-1" />
          </router-link>
        </div>
        
        <div class="space-y-4 max-h-64 overflow-y-auto mb-4">
          <div v-for="message in liveChat" :key="message.id" class="bg-gray-50 rounded-lg p-3">
            <div class="flex items-center gap-2 mb-1">
              <div class="w-6 h-6 rounded-full bg-radio-purple-100 flex items-center justify-center text-xs font-bold text-radio-purple-600">
                {{ message.username.charAt(0).toUpperCase() }}
              </div>
              <span class="font-medium">{{ message.username }}</span>
              <span class="text-xs text-gray-500">{{ message.time }}</span>
            </div>
            <p class="text-sm">{{ message.message }}</p>
          </div>
        </div>
        
        <div class="flex gap-2">
          <input 
            v-model="newMessage" 
            type="text" 
            placeholder="Type a message..." 
            class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-radio-purple-500 focus:border-transparent"
            @keyup.enter="sendMessage"
          >
          <button 
            @click="sendMessage" 
            class="bg-radio-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-radio-purple-700 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
    
    <!-- Upcoming Sessions -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-bold text-gray-900">Upcoming Shows</h2>
        <router-link to="/dashboard/sessions" class="text-sm text-radio-purple-600 hover:text-radio-purple-800 flex items-center">
          View Schedule <ArrowRightIcon class="h-4 w-4 ml-1" />
        </router-link>
      </div>
      
      <div class="space-y-4">
        <div v-for="show in upcomingShows" :key="show.id" class="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div class="flex items-center mb-2 md:mb-0">
            <div class="h-10 w-10 rounded-full bg-radio-purple-100 flex items-center justify-center text-radio-purple-700 font-medium text-sm mr-3">
              {{ show.host.charAt(0) }}{{ show.host.split(' ')[1]?.charAt(0) || '' }}
            </div>
            <div>
              <h3 class="font-medium">{{ show.title }}</h3>
              <p class="text-sm text-gray-600">with {{ show.host }} - {{ show.genre }}</p>
            </div>
          </div>
          <div class="md:text-right">
            <p class="text-lg font-semibold text-radio-purple-700">{{ show.time }}</p>
            <span v-if="show.status" class="text-xs bg-radio-orange-100 text-radio-orange-800 px-2 py-1 rounded">{{ show.status }}</span>
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
  Headphones as HeadphonesIcon,
  Newspaper as NewspaperIcon,
  Users as UsersIcon,
  ArrowUp as ArrowUpIcon,
  ArrowRight as ArrowRightIcon,
  CircleDot as CircleDotIcon,
  User as UserIcon,
  Play as PlayIcon,
  MessageSquare as MessageSquareIcon,
  Share as ShareIcon,
  Download as DownloadIcon
} from 'lucide-vue-next';

// Sample data for upcoming shows
const upcomingShows = [
  {
    id: 1,
    title: 'Morning Drive',
    host: 'DJ Smiley',
    genre: 'Talk & Music',
    time: '8:00 AM - 10:00 AM',
    status: 'Live Now'
  },
  {
    id: 2,
    title: 'Lunch Hour Mix',
    host: 'MC Kat',
    genre: 'Dance',
    time: '12:00 PM - 1:00 PM',
    status: 'Upcoming'
  },
  {
    id: 3,
    title: 'Evening Chill',
    host: 'DJ Smooth',
    genre: 'R&B',
    time: '6:00 PM - 8:00 PM'
  }
];

// Sample data for live now
const liveNow = {
  title: 'Morning Drive',
  host: 'DJ Smiley',
  time: '8:00 AM - 10:00 AM',
  listeners: 1245
};

// Sample data for recently played
const recentlyPlayed = [
  {
    id: 1,
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    time: '5 mins ago'
  },
  {
    id: 2,
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    time: '12 mins ago'
  },
  {
    id: 3,
    title: 'Levitating',
    artist: 'Dua Lipa',
    time: '18 mins ago'
  },
  {
    id: 4,
    title: 'Stay',
    artist: 'The Kid LAROI, Justin Bieber',
    time: '25 mins ago'
  },
  {
    id: 5,
    title: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    time: '32 mins ago'
  }
];

// Sample data for live chat
const liveChat = [
  {
    id: 1,
    username: 'musiclover',
    message: 'Loving the new track!',
    time: '2 mins ago'
  },
  {
    id: 2,
    username: 'radiofan',
    message: 'Can you play some Drake next?',
    time: '5 mins ago'
  },
  {
    id: 3,
    username: 'dj_fan',
    message: 'DJ Smiley is the best!',
    time: '8 mins ago'
  }
];

// New message input
const newMessage = ref('');

// Send message function
const sendMessage = () => {
  if (newMessage.value.trim()) {
    liveChat.unshift({
      id: liveChat.length + 1,
      username: 'you',
      message: newMessage.value,
      time: 'Just now'
    });
    newMessage.value = '';
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>