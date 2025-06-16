<template>
    <div class="flex h-screen bg-gray-50 dark:bg-slate-900 overflow-hidden transition-colors duration-300">
      <!-- Sidebar -->
      <SideNavigation 
        :class="[
          'transition-all duration-300 ease-in-out z-30',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0 lg:static lg:inset-0'
        ]"
      />
      
      <!-- Sidebar Overlay for mobile -->
      <div 
        v-if="sidebarOpen" 
        @click="toggleSidebar"
        class="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden transition-opacity duration-300"
      ></div>
  
      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Top Navigation -->
        <TopNavigation @toggle-sidebar="toggleSidebar" />
        
        <!-- Main Content -->
        <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
          <div class="p-4 md:p-6 lg:p-8">
            <div class="mx-auto">
         
  
              <!-- Router View with fade transition -->
              <div class="relative">
                <transition
                  name="fade"
                  mode="out-in"
                  enter-active-class="transition-opacity duration-300"
                  leave-active-class="transition-opacity duration-150"
                  enter-from-class="opacity-0"
                  enter-to-class="opacity-100"
                  leave-from-class="opacity-100"
                  leave-to-class="opacity-0"
                >
                  <router-view v-slot="{ Component, route }">
                    <component 
                      :is="Component" 
                      :key="route.path"
                      class="transition-all duration-300"
                    />
                  </router-view>
                </transition>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useRoute } from 'vue-router';
  import SideNavigation from './includes/SideNavigation.vue';
  import TopNavigation from './includes/TopNavigation.vue';
  import {
    Calendar as CalendarIcon,
    Clock as ClockIcon,
    Plus as PlusIcon,
    Radio as RadioIcon,
    ChevronRight as ChevronRightIcon
  } from 'lucide-vue-next';
  
  const route = useRoute();
  
  // Sidebar state
  const sidebarOpen = ref(false);
  
  // Time state
  const currentTime = ref('');
  let timeInterval = null;
  
  // Update time every second
  const updateTime = () => {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  onMounted(() => {
    updateTime();
    timeInterval = setInterval(updateTime, 1000);
    
    // Close sidebar on route change (mobile)
    const handleRouteChange = () => {
      if (window.innerWidth < 1024) {
        sidebarOpen.value = false;
      }
    };
    
    // Watch for route changes
    route && handleRouteChange();
  });
  
  onUnmounted(() => {
    if (timeInterval) {
      clearInterval(timeInterval);
    }
  });
  
  // Toggle sidebar
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
  };
  
  // Close sidebar when clicking outside on mobile
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      sidebarOpen.value = false;
    }
  };
  
  onMounted(() => {
    window.addEventListener('resize', handleResize);
  });
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
  
  // Computed properties
  const pageTitle = computed(() => {
    const path = route.path.split('/');
    const currentRoute = path[path.length - 1];
    
    if (currentRoute === 'dashboard' || currentRoute === '') {
      return 'Dashboard Overview';
    }
    
    // Handle special cases
    const routeTitles = {
      'live-chat': 'Live Chat Management',
      'user-management': 'User Management',
      'content-management': 'Content Management',
      'analytics': 'Analytics & Reports',
      'settings': 'System Settings',
      'profile': 'Profile Settings',
      'podcasts': 'Podcast Management',
      'schedule': 'Program Schedule',
      'forums': 'Community Forums'
    };
    
    return routeTitles[currentRoute] || currentRoute.charAt(0).toUpperCase() + currentRoute.slice(1).replace(/-/g, ' ');
  });
  
  const breadcrumbItems = computed(() => {
    const path = route.path.split('/').filter(item => item);
    return path.slice(1).map(item => {
      const routeTitles = {
        'live-chat': 'Live Chat',
        'user-management': 'Users',
        'content-management': 'Content',
        'analytics': 'Analytics',
        'settings': 'Settings',
        'profile': 'Profile',
        'podcasts': 'Podcasts',
        'schedule': 'Schedule',
        'forums': 'Forums'
      };
      
      return routeTitles[item] || item.charAt(0).toUpperCase() + item.slice(1).replace(/-/g, ' ');
    });
  });
  
  const currentDate = computed(() => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });
  </script>
  
  <style scoped>
  /* Custom fade transition */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  /* Scrollbar styling for dark mode */
  :deep(.overflow-y-auto) {
    scrollbar-width: thin;
    scrollbar-color: rgb(148 163 184) transparent;
  }
  
  :deep(.overflow-y-auto::-webkit-scrollbar) {
    width: 6px;
  }
  
  :deep(.overflow-y-auto::-webkit-scrollbar-track) {
    background: transparent;
  }
  
  :deep(.overflow-y-auto::-webkit-scrollbar-thumb) {
    background-color: rgb(148 163 184);
    border-radius: 3px;
  }
  
  .dark :deep(.overflow-y-auto::-webkit-scrollbar-thumb) {
    background-color: rgb(71 85 105);
  }
  
  :deep(.overflow-y-auto::-webkit-scrollbar-thumb:hover) {
    background-color: rgb(100 116 139);
  }
  
  .dark :deep(.overflow-y-auto::-webkit-scrollbar-thumb:hover) {
    background-color: rgb(51 65 85);
  }
  
  /* Smooth transitions for all elements */
  * {
    transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 200ms;
  }
  </style>