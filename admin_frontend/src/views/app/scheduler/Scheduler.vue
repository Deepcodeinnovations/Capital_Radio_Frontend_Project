<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Radio Show Scheduler</h1>
        <p class="text-sm text-gray-600">Manage your radio show schedules and programming</p>
      </div>
      <button @click="openNewShowModal" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-radio-purple-600 to-radio-orange-500 hover:from-radio-purple-700 hover:to-radio-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-radio-purple-500 flex items-center">
        <PlusIcon class="h-4 w-4 mr-1" />
        Add Show
      </button>
    </div>
    
    <!-- Calendar View -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex space-x-2">
          <button @click="previousWeek" class="p-2 rounded-md hover:bg-gray-100">
            <ChevronLeftIcon class="h-5 w-5 text-gray-600" />
          </button>
          <h2 class="text-lg font-semibold">{{ currentWeekDisplay }}</h2>
          <button @click="nextWeek" class="p-2 rounded-md hover:bg-gray-100">
            <ChevronRightIcon class="h-5 w-5 text-gray-600" />
          </button>
        </div>
        <div class="flex space-x-2">
          <button @click="setView('week')" :class="{'bg-radio-purple-100 text-radio-purple-700': currentView === 'week'}" class="px-3 py-1 rounded-md text-sm font-medium">
            Week
          </button>
          <button @click="setView('day')" :class="{'bg-radio-purple-100 text-radio-purple-700': currentView === 'day'}" class="px-3 py-1 rounded-md text-sm font-medium">
            Day
          </button>
        </div>
      </div>
      
      <!-- Week View -->
      <div v-if="currentView === 'week'" class="overflow-x-auto">
        <div class="min-w-max grid grid-cols-8 gap-1">
          <!-- Time Labels -->
          <div class="col-span-1">
            <div class="h-12"></div> <!-- Empty header cell -->
            <div v-for="hour in hours" :key="hour" class="h-20 border-t border-gray-200 pr-2 flex items-start justify-end">
              <span class="text-xs text-gray-500 mt-1">{{ formatHour(hour) }}</span>
            </div>
          </div>
          
          <!-- Days of Week -->
          <div v-for="day in daysOfWeek" :key="day.date" class="col-span-1">
            <div class="h-12 flex flex-col items-center justify-center">
              <span class="text-sm font-medium">{{ day.name }}</span>
              <span class="text-xs text-gray-500">{{ formatDate(day.date) }}</span>
            </div>
            
            <!-- Time Slots -->
            <div v-for="hour in hours" :key="`${day.date}-${hour}`" class="h-20 border border-gray-100 relative group hover:bg-gray-50">
              <!-- Shows scheduled for this time slot -->
              <div 
                v-for="show in getShowsForTimeSlot(day.date, hour)" 
                :key="show.id"
                :style="{ top: `${calculateShowPosition(show, hour)}%`, height: `${calculateShowHeight(show)}%` }"
                :class="`absolute w-full px-1 rounded-sm overflow-hidden ${getShowColorClass(show.category)}`"
                @click="editShow(show)"
              >
                <div class="text-xs font-medium truncate">{{ show.title }}</div>
                <div class="text-xs truncate">{{ formatTimeRange(show.startTime, show.endTime) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Day View -->
      <div v-if="currentView === 'day'" class="overflow-x-auto">
        <div class="flex justify-center mb-4">
          <button @click="previousDay" class="p-2 rounded-md hover:bg-gray-100">
            <ChevronLeftIcon class="h-5 w-5 text-gray-600" />
          </button>
          <h3 class="text-lg font-semibold mx-4">{{ formatFullDate(selectedDate) }}</h3>
          <button @click="nextDay" class="p-2 rounded-md hover:bg-gray-100">
            <ChevronRightIcon class="h-5 w-5 text-gray-600" />
          </button>
        </div>
        
        <div class="grid grid-cols-1 gap-1">
          <div v-for="hour in hours" :key="hour" class="flex">
            <div class="w-20 pr-2 flex items-start justify-end h-24 border-t border-gray-200">
              <span class="text-xs text-gray-500 mt-1">{{ formatHour(hour) }}</span>
            </div>
            
            <div class="flex-1 h-24 border border-gray-100 relative group hover:bg-gray-50">
              <!-- Shows scheduled for this time slot -->
              <div 
                v-for="show in getShowsForTimeSlot(selectedDate, hour)" 
                :key="show.id"
                :style="{ top: `${calculateShowPosition(show, hour)}%`, height: `${calculateShowHeight(show)}%` }"
                :class="`absolute w-full px-2 rounded-sm overflow-hidden ${getShowColorClass(show.category)}`"
                @click="editShow(show)"
              >
                <div class="text-sm font-medium truncate">{{ show.title }}</div>
                <div class="text-xs truncate">{{ formatTimeRange(show.startTime, show.endTime) }}</div>
                <div class="text-xs truncate">Host: {{ show.host }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Add/Edit Show Modal -->
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">{{ editingShow ? 'Edit Show' : 'Add New Show' }}</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <XIcon class="h-5 w-5" />
        </button>
      </div>
      
      <form @submit.prevent="saveShow" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label for="showTitle" class="block text-sm font-medium text-gray-700 mb-1">Show Title*</label>
            <input
              id="showTitle"
              v-model="currentShow.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radio-purple-500 focus:border-radio-purple-500"
              placeholder="e.g. Morning Drive Show"
            />
          </div>
          
          <div>
            <label for="showHost" class="block text-sm font-medium text-gray-700 mb-1">Host*</label>
            <input
              id="showHost"
              v-model="currentShow.host"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radio-purple-500 focus:border-radio-purple-500"
              placeholder="e.g. John Smith"
            />
          </div>
          
          <div>
            <label for="showCategory" class="block text-sm font-medium text-gray-700 mb-1">Category*</label>
            <select
              id="showCategory"
              v-model="currentShow.category"
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
          
          <div>
            <label for="showDate" class="block text-sm font-medium text-gray-700 mb-1">Date*</label>
            <input
              id="showDate"
              v-model="currentShow.date"
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
                v-model="currentShow.startTime"
                type="time"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radio-purple-500 focus:border-radio-purple-500"
              />
            </div>
            
            <div class="flex-1">
              <label for="endTime" class="block text-sm font-medium text-gray-700 mb-1">End Time*</label>
              <input
                id="endTime"
                v-model="currentShow.endTime"
                type="time"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radio-purple-500 focus:border-radio-purple-500"
              />
            </div>
          </div>
          
          <div class="md:col-span-2">
            <label for="showDescription" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="showDescription"
              v-model="currentShow.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-radio-purple-500 focus:border-radio-purple-500"
              placeholder="Describe the show..."
            ></textarea>
          </div>
          
          <div class="md:col-span-2">
            <label class="flex items-center">
              <input
                v-model="currentShow.recurring"
                type="checkbox"
                class="h-4 w-4 text-radio-purple-600 focus:ring-radio-purple-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">Recurring show (weekly)</span>
            </label>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 pt-4 border-t">
          <button 
            type="button" 
            @click="closeModal" 
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-radio-purple-500"
          >
            Cancel
          </button>
          <button 
            v-if="editingShow" 
            type="button" 
            @click="deleteShow" 
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
          <button 
            type="submit" 
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-radio-purple-600 to-radio-orange-500 hover:from-radio-purple-700 hover:to-radio-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-radio-purple-500"
          >
            {{ editingShow ? 'Update Show' : 'Add Show' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { 
  Plus as PlusIcon, 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon,
  X as XIcon
} from 'lucide-vue-next';

// State
const currentView = ref('week');
const selectedDate = ref(new Date());
const showModal = ref(false);
const editingShow = ref(false);
const currentShow = ref({
  id: null,
  title: '',
  host: '',
  category: '',
  date: '',
  startTime: '',
  endTime: '',
  description: '',
  recurring: false
});

// Sample data - would be replaced with API calls in production
const shows = ref([
  {
    id: 1,
    title: 'Morning Drive Show',
    host: 'Sarah Johnson',
    category: 'music',
    date: '2023-06-05', // Monday
    startTime: '06:00',
    endTime: '09:00',
    description: 'Wake up with the latest hits and traffic updates',
    recurring: true
  },
  {
    id: 2,
    title: 'Afternoon Delight',
    host: 'Mike Thompson',
    category: 'talk',
    date: '2023-06-05', // Monday
    startTime: '14:00',
    endTime: '16:00',
    description: 'Interviews with local celebrities and call-ins',
    recurring: true
  },
  {
    id: 3,
    title: 'Evening Jazz',
    host: 'Lisa Wong',
    category: 'music',
    date: '2023-06-06', // Tuesday
    startTime: '19:00',
    endTime: '21:00',
    description: 'Smooth jazz to wind down your day',
    recurring: true
  },
  {
    id: 4,
    title: 'Sports Talk',
    host: 'David Miller',
    category: 'sports',
    date: '2023-06-07', // Wednesday
    startTime: '17:00',
    endTime: '19:00',
    description: 'Latest sports news and analysis',
    recurring: true
  },
  {
    id: 5,
    title: 'Weekend Countdown',
    host: 'Alex Rodriguez',
    category: 'music',
    date: '2023-06-09', // Friday
    startTime: '16:00',
    endTime: '18:00',
    description: 'Top 20 hits of the week',
    recurring: true
  }
]);

// Time slots
const hours = Array.from({ length: 18 }, (_, i) => i + 6); // 6am to 11pm

// Computed properties
const daysOfWeek = computed(() => {
  const days = [];
  const startOfWeek = new Date(selectedDate.value);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1); // Start from Monday
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    days.push({
      name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      date: date.toISOString().split('T')[0]
    });
  }
  
  return days;
});

const currentWeekDisplay = computed(() => {
  const startDate = daysOfWeek.value[0].date;
  const endDate = daysOfWeek.value[6].date;
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
});

// Methods
const setView = (view) => {
  currentView.value = view;
};

const previousWeek = () => {
  const newDate = new Date(selectedDate.value);
  newDate.setDate(newDate.getDate() - 7);
  selectedDate.value = newDate;
};

const nextWeek = () => {
  const newDate = new Date(selectedDate.value);
  newDate.setDate(newDate.getDate() + 7);
  selectedDate.value = newDate;
};

const previousDay = () => {
  const newDate = new Date(selectedDate.value);
  newDate.setDate(newDate.getDate() - 1);
  selectedDate.value = newDate;
};

const nextDay = () => {
  const newDate = new Date(selectedDate.value);
  newDate.setDate(newDate.getDate() + 1);
  selectedDate.value = newDate;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatFullDate = (date) => {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
};

const formatHour = (hour) => {
  return hour > 12 ? `${hour - 12}:00 PM` : hour === 12 ? '12:00 PM' : `${hour}:00 AM`;
};

const formatTimeRange = (start, end) => {
  return `${formatTime(start)} - ${formatTime(end)}`;
};

const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours, 10);
  return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
};

const getShowsForTimeSlot = (date, hour) => {
  return shows.value.filter(show => {
    if (show.date !== date) return false;
    
    const startHour = parseInt(show.startTime.split(':')[0], 10);
    const endHour = parseInt(show.endTime.split(':')[0], 10);
    
    return (hour >= startHour && hour < endHour) || 
           (startHour === hour && parseInt(show.startTime.split(':')[1], 10) === 0);
  });
};

const calculateShowPosition = (show, slotHour) => {
  const startHour = parseInt(show.startTime.split(':')[0], 10);
  const startMinute = parseInt(show.startTime.split(':')[1], 10);
  
  if (startHour === slotHour) {
    return (startMinute / 60) * 100;
  }
  
  return 0;
};

const calculateShowHeight = (show) => {
  const startHour = parseInt(show.startTime.split(':')[0], 10);
  const startMinute = parseInt(show.startTime.split(':')[1], 10);
  const endHour = parseInt(show.endTime.split(':')[0], 10);
  const endMinute = parseInt(show.endTime.split(':')[1], 10);
  
  const durationMinutes = ((endHour - startHour) * 60) + (endMinute - startMinute);
  return (durationMinutes / 60) * 100;
};

const getShowColorClass = (category) => {
  const colors = {
    music: 'bg-blue-100 text-blue-800',
    talk: 'bg-green-100 text-green-800',
    news: 'bg-yellow-100 text-yellow-800',
    sports: 'bg-red-100 text-red-800',
    entertainment: 'bg-purple-100 text-purple-800',
    culture: 'bg-pink-100 text-pink-800'
  };
  
  return colors[category] || 'bg-gray-100 text-gray-800';
};

const openNewShowModal = () => {
  editingShow.value = false;
  currentShow.value = {
    id: null,
    title: '',
    host: '',
    category: '',
    date: selectedDate.value.toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    description: '',
    recurring: false
  };
  showModal.value = true;
};

const editShow = (show) => {
  editingShow.value = true;
  currentShow.value = { ...show };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveShow = () => {
  if (editingShow.value) {
    // Update existing show
    const index = shows.value.findIndex(s => s.id === currentShow.value.id);
    if (index !== -1) {
      shows.value[index] = { ...currentShow.value };
    }
  } else {
    // Add new show
    const newId = Math.max(0, ...shows.value.map(s => s.id)) + 1;
    shows.value.push({
      ...currentShow.value,
      id: newId
    });
  }
  
  closeModal();
};

const deleteShow = () => {
  if (confirm('Are you sure you want to delete this show?')) {
    shows.value = shows.value.filter(s => s.id !== currentShow.value.id);
    closeModal();
  }
};

// Initialize
onMounted(() => {
  // In a real app, you would fetch data from an API here
});
</script>

<style scoped>
/* Additional styles can be added here if needed */
</style>