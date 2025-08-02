<template>
  <div class="bg-white dark:bg-slate-800 shadow-md border-b border-gray-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between transition-colors duration-200">
    <!-- Left side: Toggle button and breadcrumb -->
    <div></div>

    <!-- Right side: Search, theme toggle, notifications, and profile -->
    <div class="flex items-center space-x-3">
      <!-- Search -->
      <div class="relative hidden lg:block">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="h-4 w-4 text-slate-400 dark:text-slate-500" />
        </div>
        <input
          type="text"
          placeholder="Search..."
          class="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
        />
      </div>

      <!-- Mobile Search Button -->
      <button class="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200">
        <SearchIcon class="h-5 w-5" />
      </button>

      <!-- Theme Toggle -->
      <button 
        @click="toggleTheme"
        class="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200"
        :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <SunIcon v-if="isDark" class="h-5 w-5" />
        <MoonIcon v-else class="h-5 w-5" />
      </button>

      <!-- Notifications -->
      <div class="relative">
        <button 
          @click="toggleNotifications" 
          class="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200 relative"
        >
          <BellIcon class="h-5 w-5" />
          <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-gradient-to-r from-purple-600 to-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {{ unreadCount > 9 ? '9+' : unreadCount }}
          </span>
        </button>
        
        <!-- Notifications dropdown -->
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="showNotifications" class="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl py-2 z-50 border border-gray-200 dark:border-slate-700">
            <div class="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
                <button class="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium">
                  Mark all read
                </button>
              </div>
            </div>
            <div class="max-h-80 overflow-y-auto">
              <div v-for="(notification, index) in notifications" :key="index" 
                   class="px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 border-b border-gray-100 dark:border-slate-700 last:border-b-0 cursor-pointer transition-colors duration-200">
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-100 to-orange-100 dark:from-purple-900 dark:to-orange-900 rounded-full flex items-center justify-center">
                    <component :is="notification.icon" class="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ notification.title }}</p>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ notification.message }}</p>
                    <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">{{ notification.time }}</p>
                  </div>
                  <div v-if="!notification.read" class="flex-shrink-0 w-2 h-2 bg-purple-600 rounded-full"></div>
                </div>
              </div>
            </div>
            <div class="px-4 py-3 border-t border-gray-200 dark:border-slate-700">
              <button class="w-full text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium text-center">
                View all notifications
              </button>
            </div>
          </div>
        </transition>
      </div>

      <!-- User Profile -->
      <div class="relative">
        <button 
          @click="toggleUserMenu" 
          class="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
        >
          <div class="h-9 w-9 rounded-full bg-gradient-to-r from-purple-600 to-orange-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
            {{ userInitials }}
          </div>
          <div class="hidden md:flex flex-col items-start">
            <span class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ authuser.name || 'Admin User' }}</span>
            <span class="text-xs text-slate-500 dark:text-slate-400">{{ authuser.role || 'Administrator' }}</span>
          </div>
          <ChevronDownIcon class="hidden md:block h-4 w-4 text-slate-500 dark:text-slate-400" />
        </button>
        
        <!-- User dropdown menu -->
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="showUserMenu" class="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl py-2 z-50 border border-gray-200 dark:border-slate-700">
            <div class="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
              <p class="text-sm font-medium text-slate-900 dark:text-slate-100">{{ authuser.name || 'Admin User' }}</p>
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ authuser.email || 'admin@capitalradio.com' }}</p>
            </div>
            
            <div class="py-1">
              <router-link 
                :to="{name:'my_accoount'}" 
                class="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
                @click="showUserMenu = false"
              >
                <UserIcon class="h-4 w-4 mr-3" />
                <span>Your Profile</span>
              </router-link>
              
              
              
              <button 
                class="flex items-center w-full px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
                @click="showUserMenu = false"
              >
                <HelpCircleIcon class="h-4 w-4 mr-3" />
                <span>Help & Support</span>
              </button>
            </div>
            
            <div class="border-t border-gray-200 dark:border-slate-700 py-1">
              <button 
                @click="logout" 
                class="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
              >
                <LogOutIcon class="h-4 w-4 mr-3" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import {
  Menu as MenuIcon,
  Bell as BellIcon,
  Search as SearchIcon,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut as LogOutIcon,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon,
  Sun as SunIcon,
  Moon as MoonIcon,
  Radio as RadioIcon,
  MessageSquare as MessageSquareIcon,
  Mic as MicIcon,
  Users as UsersIcon,
  Calendar as CalendarIcon,
  HelpCircle as HelpCircleIcon
} from 'lucide-vue-next';

// Emits
defineEmits(['toggle-sidebar']);

const route = useRoute();
const router = useRouter();
const store = useStore();

// Store getters
const authuser = computed(() => store.getters['auth/authuser'] || {});

// Theme state
const isDark = ref(false);

// Initialize theme
onMounted(() => {
  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark);
  updateTheme();
  
  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', handleSystemThemeChange);
  
  // Cleanup on unmount
  onUnmounted(() => {
    mediaQuery.removeEventListener('change', handleSystemThemeChange);
  });
});

const handleSystemThemeChange = (e) => {
  if (!localStorage.getItem('theme')) {
    isDark.value = e.matches;
    updateTheme();
  }
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  updateTheme();
  
  // Dispatch to store if needed
  store.dispatch('utils/update_user_app_theme', isDark.value ? 'dark' : 'light');
};

const updateTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Computed properties
const userInitials = computed(() => {
  const name = authuser.value.name || 'Admin User';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
});

const currentRouteName = computed(() => {
  const path = route.path.split('/');
  const routeName = path[path.length - 1];
  return routeName.charAt(0).toUpperCase() + routeName.slice(1).replace(/-/g, ' ');
});

// Dropdowns state
const showUserMenu = ref(false);
const showNotifications = ref(false);

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
  if (showUserMenu.value) showNotifications.value = false;
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value) showUserMenu.value = false;
};

// Close dropdowns when clicking outside
const closeDropdowns = (event) => {
  if (!event.target.closest('.relative')) {
    showUserMenu.value = false;
    showNotifications.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeDropdowns);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns);
});

// Sample notifications with enhanced data
const notifications = ref([
  {
    title: 'New podcast uploaded',
    message: 'Morning Show Episode 125 has been successfully uploaded',
    time: '5 minutes ago',
    icon: RadioIcon,
    read: false
  },
  {
    title: 'New comment on forum',
    message: 'John Doe commented on "Radio Programming Tips"',
    time: '1 hour ago',
    icon: MessageSquareIcon,
    read: false
  },
  {
    title: 'Live broadcast starting soon',
    message: 'Evening Drive Show starts in 30 minutes',
    time: '2 hours ago',
    icon: MicIcon,
    read: true
  },
  {
    title: 'New user registration',
    message: '5 new users registered today',
    time: '3 hours ago',
    icon: UsersIcon,
    read: true
  },
  {
    title: 'Schedule update',
    message: 'Tomorrow\'s programming schedule has been updated',
    time: '5 hours ago',
    icon: CalendarIcon,
    read: true
  }
]);

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length;
});

// Logout function
const logout = async () => {
  try {
    await store.dispatch('auth/log_out_user');
    router.push({ name: 'Login' });
  } catch (error) {
    console.error('Logout failed:', error);
    // Force logout even if API call fails
    localStorage.clear();
    router.push({ name: 'Login' });
  }
  showUserMenu.value = false;
};
</script>