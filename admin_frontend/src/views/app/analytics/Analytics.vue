<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Analytics Dashboard</h1>
    
    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="stat in overviewStats" :key="stat.title" class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full" :class="stat.bgColor">
            <component :is="stat.icon" class="h-6 w-6" :class="stat.iconColor" />
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">{{ stat.title }}</p>
            <div class="flex items-center">
              <p class="text-2xl font-bold">{{ stat.value }}</p>
              <span class="ml-2 text-xs font-medium" :class="stat.changeColor">
                {{ stat.change }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Listeners Chart -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold mb-4">Listeners Over Time</h2>
        <div class="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <!-- Placeholder for chart -->
          <div class="text-center">
            <BarChartIcon class="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-500">Listeners chart visualization</p>
            <p class="text-sm text-gray-400">Daily listener count for the past 30 days</p>
          </div>
        </div>
      </div>
      
      <!-- Popular Content -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold mb-4">Popular Content</h2>
        <div class="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <!-- Placeholder for chart -->
          <div class="text-center">
            <PieChartIcon class="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p class="text-gray-500">Content popularity visualization</p>
            <p class="text-sm text-gray-400">Distribution of listeners across content types</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Detailed Stats -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Top Shows -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="bg-indigo-600 text-white px-4 py-2">
          <h2 class="font-bold">Top Shows</h2>
        </div>
        <div class="p-4">
          <div v-for="(show, index) in topShows" :key="show.id" class="flex items-center py-3 border-b border-gray-100 last:border-0">
            <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mr-3">
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <h3 class="font-medium">{{ show.title }}</h3>
              <p class="text-sm text-gray-600">{{ show.host }}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold">{{ show.listeners.toLocaleString() }}</p>
              <p class="text-xs text-gray-500">listeners</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Listener Demographics -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="bg-indigo-600 text-white px-4 py-2">
          <h2 class="font-bold">Listener Demographics</h2>
        </div>
        <div class="p-4">
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>Age Groups</span>
                <span>Percentage</span>
              </div>
              <div v-for="group in demographics.age" :key="group.label" class="mb-2">
                <div class="flex justify-between text-sm mb-1">
                  <span>{{ group.label }}</span>
                  <span>{{ group.percentage }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-indigo-600 h-2 rounded-full" :style="{ width: group.percentage + '%' }"></div>
                </div>
              </div>
            </div>
            
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span>Gender</span>
                <span>Percentage</span>
              </div>
              <div v-for="group in demographics.gender" :key="group.label" class="mb-2">
                <div class="flex justify-between text-sm mb-1">
                  <span>{{ group.label }}</span>
                  <span>{{ group.percentage }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-indigo-600 h-2 rounded-full" :style="{ width: group.percentage + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Listening Platforms -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="bg-indigo-600 text-white px-4 py-2">
          <h2 class="font-bold">Listening Platforms</h2>
        </div>
        <div class="p-4">
          <div v-for="platform in platforms" :key="platform.name" class="mb-3 last:mb-0">
            <div class="flex justify-between items-center mb-1">
              <div class="flex items-center">
                <component :is="platform.icon" class="h-4 w-4 mr-2 text-gray-600" />
                <span>{{ platform.name }}</span>
              </div>
              <span class="text-sm font-medium">{{ platform.percentage }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div :class="platform.color" class="h-2 rounded-full" :style="{ width: platform.percentage + '%' }"></div>
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
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Users as UsersIcon,
  Radio as RadioIcon,
  Headphones as HeadphonesIcon,
  TrendingUp as TrendingUpIcon,
  Smartphone as SmartphoneIcon,
  Laptop as LaptopIcon,
  Speaker as SpeakerIcon,
  Car as CarIcon
} from 'lucide-vue-next';

const overviewStats = ref([
  {
    title: 'Total Listeners',
    value: '45.2K',
    change: '+12.5%',
    icon: UsersIcon,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
    changeColor: 'text-green-500'
  },
  {
    title: 'Avg. Session Duration',
    value: '24m',
    change: '+3.2%',
    icon: TrendingUpIcon,
    bgColor: 'bg-green-100',
    iconColor: 'text-green-600',
    changeColor: 'text-green-500'
  },
  {
    title: 'Live Listeners Now',
    value: '3.8K',
    change: '-2.1%',
    icon: RadioIcon,
    bgColor: 'bg-red-100',
    iconColor: 'text-red-600',
    changeColor: 'text-red-500'
  },
  {
    title: 'Podcast Downloads',
    value: '18.6K',
    change: '+24.3%',
    icon: HeadphonesIcon,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-600',
    changeColor: 'text-green-500'
  }
]);

const topShows = ref([
  { id: 1, title: 'Morning Drive', host: 'DJ Maxwell', listeners: 12450 },
  { id: 2, title: 'Afternoon Groove', host: 'DJ Harmony', listeners: 9320 },
  { id: 3, title: 'Evening Jazz', host: 'Sarah Lee', listeners: 7840 },
  { id: 4, title: 'Tech Talk', host: 'Michael Chen', listeners: 6250 },
  { id: 5, title: 'Night Drive Mix', host: 'DJ Pulse', listeners: 5780 }
]);

const demographics = ref({
  age: [
    { label: '18-24', percentage: 22 },
    { label: '25-34', percentage: 38 },
    { label: '35-44', percentage: 25 },
    { label: '45-54', percentage: 10 },
    { label: '55+', percentage: 5 }
  ],
  gender: [
    { label: 'Male', percentage: 52 },
    { label: 'Female', percentage: 47 },
    { label: 'Other', percentage: 1 }
  ]
});

const platforms = ref([
  { name: 'Mobile App', percentage: 42, icon: SmartphoneIcon, color: 'bg-indigo-600' },
  { name: 'Website', percentage: 28, icon: LaptopIcon, color: 'bg-purple-600' },
  { name: 'Smart Speakers', percentage: 15, icon: SpeakerIcon, color: 'bg-blue-600' },
  { name: 'Car Radio', percentage: 10, icon: CarIcon, color: 'bg-green-600' },
  { name: 'Other', percentage: 5, icon: RadioIcon, color: 'bg-gray-600' }
]);
</script>