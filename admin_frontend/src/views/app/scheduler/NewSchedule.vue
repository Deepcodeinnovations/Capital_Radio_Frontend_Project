<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add Radio Show</h1>
        <p class="text-sm text-gray-600">Schedule a new radio show for your station</p>
      </div>
      <router-link to="/dashboard/scheduler" class="text-radio-purple-600 hover:text-radio-purple-800 flex items-center">
        <ArrowLeftIcon class="h-4 w-4 mr-1" />
        Back to Scheduler
      </router-link>
    </div>
    
    <div class="bg-white rounded-xl shadow-md p-6">
      <form @submit.prevent="saveShow" class="space-y-6">
        <!-- Basic Information -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 border-b pb-2">Show Information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="md:col-span-2">
              <label for="showTitle" class="block text-sm font-medium text-gray-700 mb-1">Show Title*</label>
              <input
                id="showTitle"
                v-model="show.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radio-purple-500 focus:border-radio-purple-500"
                placeholder="e.g. Morning Drive Show"
              />
            </div>
            
            <div>
              <label for="host" class="block text-sm font-medium text-gray-700 mb-1">Host*</label>
              <input
                id="host"
                v-model="show.host"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radio-purple-500 focus:border-radio-purple-500"
                placeholder="e.g. John Smith"
              />
            </div>
            
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category*</label>
              <select
                id="category"
                v-model="show.category"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radio-purple-500 focus:border-radio-purple-500"
              >
                <option value="">Select a category</option>
                <option value="music">Music</option>
                <option value="talk">Talk Show</option>
                <option value="news">News</option>
                <option value="sports">Sports</option>
                <option value="entertainment">Entertainment</option>
                <option value="culture">Culture</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Schedule Details -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 border-b pb-2">Schedule Details</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="showDate" class="block text-sm font-medium text-gray-700 mb-1">Date*</label>
              <input
                id="showDate"
                v-model="show.date"
                type="date"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radio-purple-500 focus:border-radio-purple-500"
              />
            </div>
            
            <div class="flex space-x-4">
              <div class="flex-1">
                <label for="startTime" class="block text-sm font-medium text-gray-700 mb-1">Start Time*</label>
                <input
                  id="startTime"
                  v-model="show.startTime"
                  type="time"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radio-purple-500 focus:border-radio-purple-500"
                />
              </div>
              
              <div class="flex-1">
                <label for="endTime" class="block text-sm font-medium text-gray-700 mb-1">End Time*</label>
                <input
                  id="endTime"
                  v-model="show.endTime"
                  type="time"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radio-purple-500 focus:border-radio-purple-500"
                />
              </div>
            </div>
            
            <div class="md:col-span-2">
              <label class="flex items-center">
                <input
                  v-model="show.recurring"
                  type="checkbox"
                  class="h-4 w-4 text-radio-purple-600 focus:ring-radio-purple-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">Recurring show (weekly)</span>
              </label>
            </div>
            
            <div v-if="show.recurring" class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">Repeat on</label>
              <div class="flex flex-wrap gap-2">
                <label v-for="(day, index) in weekDays" :key="index" class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="show.repeatDays[index]"
                    class="h-4 w-4 text-radio-purple-600 focus:ring-radio-purple-500 border-gray-300 rounded mr-1"
                  />
                  <span class="text-sm text-gray-700">{{ day }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Show Content -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 border-b pb-2">Show Content</h2>
          
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description*</label>
            <textarea
              id="description"
              v-model="show.description"
              rows="3"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radio-purple-500 focus:border-radio-purple-500"
              placeholder="Describe what the show is about..."
            ></textarea>
          </div>
          
          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Producer Notes</label>
            <textarea
              id="notes"
              v-model="show.notes"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radio-purple-500 focus:border-radio-purple-500"
              placeholder="Any special instructions or notes for the production team..."
            ></textarea>
          </div>
        </div>
        
        <!-- Show Image -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 border-b pb-2">Show Image</h2>
          
          <div class="flex items-center space-x-6">
            <div class="h-32 w-32 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
              <RadioIcon class="h-12 w-12" />
            </div>
            
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Upload Show Image</label>
              <div class="flex items-center">
                <label for="image-upload" class="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                  <span>Choose file</span>
                  <input id="image-upload" type="file" class="sr-only" accept="image/*" @change="handleImageUpload" />
                </label>
                <p class="ml-3 text-xs text-gray-500">PNG, JPG, GIF up to 2MB (800x800px recommended)</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Additional Settings -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 border-b pb-2">Additional Settings</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="status"
                v-model="show.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radio-purple-500 focus:border-radio-purple-500"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            
            <div>
              <label for="color" class="block text-sm font-medium text-gray-700 mb-1">Calendar Color</label>
              <select
                id="color"
                v-model="show.color"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radio-purple-500 focus:border-radio-purple-500"
              >
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="red">Red</option>
                <option value="purple">Purple</option>
                <option value="yellow">Yellow</option>
                <option value="pink">Pink</option>
              </select>
            </div>
            
            <div class="md:col-span-2">
              <label class="flex items-center">
                <input
                  v-model="show.featured"
                  type="checkbox"
                  class="h-4 w-4 text-radio-purple-600 focus:ring-radio-purple-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">Feature this show on homepage</span>
              </label>
            </div>
          </div>
        </div>
        
        <!-- Submit Buttons -->
        <div class="flex justify-end space-x-3 pt-4 border-t">
          <router-link to="/dashboard/scheduler" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-radio-purple-500">
            Cancel
          </router-link>
          <button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-radio-purple-600 to-radio-orange-500 hover:from-radio-purple-700 hover:to-radio-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-radio-purple-500">
            Save Show
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft as ArrowLeftIcon, Radio as RadioIcon } from 'lucide-vue-next';

const router = useRouter();
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const show = ref({
  title: '',
  host: '',
  category: '',
  date: new Date().toISOString().split('T')[0], // Today's date as default
  startTime: '09:00',
  endTime: '10:00',
  recurring: false,
  repeatDays: [false, false, false, false, false, false, false],
  description: '',
  notes: '',
  image: null,
  status: 'active',
  color: 'blue',
  featured: false
});

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Here you would typically upload the file to a server
    // For now, we'll just store it locally
    show.value.image = URL.createObjectURL(file);
  }
};

const saveShow = () => {
  // Here you would typically save the show to your backend
  console.log('Saving show:', show.value);
  
  // Simulate successful save and redirect
  setTimeout(() => {
    router.push('/dashboard/scheduler');
  }, 1000);
};
</script>

<style scoped>
/* Additional styles can be added here if needed */
</style>