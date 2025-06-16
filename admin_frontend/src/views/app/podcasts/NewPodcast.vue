<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add New Podcast</h1>
        <p class="text-sm text-gray-600">Create a new podcast for your network</p>
      </div>
      <router-link to="/dashboard/podcasts" class="text-radio-purple-600 hover:text-radio-purple-800 flex items-center">
        <ArrowLeftIcon class="h-4 w-4 mr-1" />
        Back to Podcasts
      </router-link>
    </div>
    
    <div class="bg-white rounded-xl shadow-md p-6">
      <form @submit.prevent="savePodcast" class="space-y-6">
        <!-- Basic Information -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 border-b pb-2">Podcast Information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="podcastTitle" class="block text-sm font-medium text-gray-700 mb-1">Podcast Title*</label>
              <input
                id="podcastTitle"
                v-model="podcast.title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radio-purple-500 focus:border-radio-purple-500"
                placeholder="e.g. Morning Talk Show"
              />
            </div>
            
            <div>
              <label for="host" class="block text-sm font-medium text-gray-700 mb-1">Host*</label>
              <input
                id="host"
                v-model="podcast.host"
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
                v-model="podcast.category"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radio-purple-500 focus:border-radio-purple-500"
              >
                <option value="">Select a category</option>
                <option value="Talk Show">Talk Show</option>
                <option value="Music">Music</option>
                <option value="News">News</option>
                <option value="Comedy">Comedy</option>
                <option value="Education">Education</option>
                <option value="Business">Business</option>
                <option value="Technology">Technology</option>
                <option value="Health">Health</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
            
            <div>
              <label for="language" class="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                id="language"
                v-model="podcast.language"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radio-purple-500 focus:border-radio-purple-500"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Podcast Description -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 border-b pb-2">Description</h2>
          
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Podcast Description*</label>
            <textarea
              id="description"
              v-model="podcast.description"
              rows="4"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radio-purple-500 focus:border-radio-purple-500"
              placeholder="Describe your podcast..."
            ></textarea>
          </div>
        </div>
        
        <!-- Podcast Cover Art -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 border-b pb-2">Cover Art</h2>
          
          <div class="flex items-center space-x-6">
            <div class="h-32 w-32 rounded-lg bg-gradient-to-br from-radio-purple-500 to-radio-orange-500 flex items-center justify-center text-white border-2 border-dashed border-gray-300">
              <HeadphonesIcon class="h-12 w-12" />
            </div>
            
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Upload Cover Art*</label>
              <div class="flex items-center">
                <label for="cover-upload" class="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                  <span>Choose file</span>
                  <input id="cover-upload" type="file" class="sr-only" accept="image/*" @change="handleCoverUpload" />
                </label>
                <p class="ml-3 text-xs text-gray-500">PNG, JPG, GIF up to 2MB (1400x1400px recommended)</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Publishing Details -->
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 border-b pb-2">Publishing Details</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="releaseDate" class="block text-sm font-medium text-gray-700 mb-1">Release Date</label>
              <input
                id="releaseDate"
                v-model="podcast.releaseDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radio-purple-500 focus:border-radio-purple-500"
              />
            </div>
            
            <div>
              <label for="frequency" class="block text-sm font-medium text-gray-700 mb-1">Publishing Frequency</label>
              <select
                id="frequency"
                v-model="podcast.frequency"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radio-purple-500 focus:border-radio-purple-500"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-weekly">Bi-weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Irregular">Irregular</option>
              </select>
            </div>
            
            <div class="md:col-span-2">
              <label for="explicit" class="flex items-center">
                <input
                  id="explicit"
                  v-model="podcast.explicit"
                  type="checkbox"
                  class="h-4 w-4 text-radio-purple-600 focus:ring-radio-purple-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-sm text-gray-700">This podcast contains explicit content</span>
              </label>
            </div>
          </div>
        </div>
        
        <!-- Submit Buttons -->
        <div class="flex justify-end space-x-3 pt-4 border-t">
          <router-link to="/dashboard/podcasts" class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-radio-purple-500">
            Cancel
          </router-link>
          <button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-radio-purple-600 to-radio-orange-500 hover:from-radio-purple-700 hover:to-radio-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-radio-purple-500">
            Save Podcast
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ArrowLeft as ArrowLeftIcon, Headphones as HeadphonesIcon } from 'lucide-vue-next';

const router = useRouter();

const podcast = ref({
  title: '',
  host: '',
  category: '',
  language: 'English',
  description: '',
  coverArt: null,
  releaseDate: '',
  frequency: 'Weekly',
  explicit: false
});

const handleCoverUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Here you would typically upload the file to a server
    // For now, we'll just store it locally
    podcast.value.coverArt = URL.createObjectURL(file);
  }
};

const savePodcast = () => {
  // Here you would typically save the podcast to your backend
  console.log('Saving podcast:', podcast.value);
  
  // Simulate successful save and redirect
  setTimeout(() => {
    router.push('/dashboard/podcasts');
  }, 1000);
};
</script>