<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Settings</h1>
    
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Settings Tabs -->
      <div class="flex border-b border-gray-200">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-3 text-sm font-medium',
            activeTab === tab.id ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          {{ tab.name }}
        </button>
      </div>
      
      <!-- Account Settings -->
      <div v-if="activeTab === 'account'" class="p-6">
        <h2 class="text-lg font-semibold mb-4">Account Settings</h2>
        
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" v-model="accountSettings.name" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" v-model="accountSettings.email" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select v-model="accountSettings.role" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="admin">Administrator</option>
              <option value="editor">Content Editor</option>
              <option value="host">Radio Host</option>
            </select>
          </div>
          
          <div>
            <button class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save Changes</button>
          </div>
        </div>
      </div>
      
      <!-- Station Settings -->
      <div v-if="activeTab === 'station'" class="p-6">
        <h2 class="text-lg font-semibold mb-4">Station Settings</h2>
        
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Station Name</label>
            <input type="text" v-model="stationSettings.name" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
            <input type="text" v-model="stationSettings.frequency" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
            <input type="text" v-model="stationSettings.tagline" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="stationSettings.description" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
          </div>
          
          <div>
            <button class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save Changes</button>
          </div>
        </div>
      </div>
      
      <!-- Notification Settings -->
      <div v-if="activeTab === 'notifications'" class="p-6">
        <h2 class="text-lg font-semibold mb-4">Notification Settings</h2>
        
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">Email Notifications</h3>
              <p class="text-sm text-gray-500">Receive email updates about your account</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="notificationSettings.email" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">SMS Notifications</h3>
              <p class="text-sm text-gray-500">Receive text messages for important updates</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="notificationSettings.sms" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium">Browser Notifications</h3>
              <p class="text-sm text-gray-500">Receive notifications in your browser</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="notificationSettings.browser" class="sr-only peer" />
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div class="pt-4">
            <button class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save Preferences</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeTab = ref('account');

const tabs = [
  { id: 'account', name: 'Account' },
  { id: 'station', name: 'Station' },
  { id: 'notifications', name: 'Notifications' },
  { id: 'security', name: 'Security' },
  { id: 'integrations', name: 'Integrations' }
];

const accountSettings = ref({
  name: 'Admin User',
  email: 'admin@capitalfm.com',
  role: 'admin'
});

const stationSettings = ref({
  name: 'Capital FM',
  frequency: '98.4 MHz',
  tagline: 'The Best Hits All Day',
  description: 'Capital FM is your premier destination for the latest hits, engaging talk shows, and exclusive interviews with top artists.'
});

const notificationSettings = ref({
  email: true,
  sms: false,
  browser: true
});
</script>