<template>
  <div :class="[
    `${collapsed ? 'w-16' : 'w-64'}`,
    'bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900',
    'light:bg-gradient-to-b light:from-blue-50 light:via-white light:to-blue-50',
    'text-white dark:text-slate-200 light:text-slate-800',
    'h-full overflow-y-auto transition-all duration-300 ease-in-out shadow-2xl border-r border-blue-700/30 dark:border-slate-700/30 light:border-blue-200/50'
  ]">
    <!-- Logo and Brand -->
    <div class="p-4 border-b border-blue-700/30 dark:border-slate-700/30 light:border-blue-200/50 flex  backdrop-blur-sm bg-white/5 dark:bg-black/10 light:bg-white/80">
      <div v-if="!collapsed" >
        <h1 class="text-xl uppercase font-bold bg-gradient-to-r from-white to-cyan-300 dark:from-slate-200 dark:to-cyan-300 light:from-blue-600 light:to-cyan-500 bg-clip-text text-transparent">
          Capital Radio
        </h1>
        <p class="text-xs text-blue-200 dark:text-slate-400 light:text-blue-500 font-medium">Web Manager</p>
      </div>
      <div v-else >
        <span class="text-sm font-bold bg-gradient-to-r from-white to-cyan-300 dark:from-slate-200 dark:to-cyan-300 light:from-blue-600 light:to-cyan-500 bg-clip-text text-transparent">
          CUL
        </span>
      </div>
    </div>
    
    <!-- Navigation Menu -->
    <nav class="mt-6 px-2 space-y-1">
      <!-- Dashboard - Admin & Editor only -->
      <router-link 
        v-if="canAccess('Dashboard')"
        :to="{name: 'Dashboard'}" 
        class="group flex items-center px-3 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105" 
        :class="[
          ...getActiveClasses('Dashboard'),
          !isActiveRoute('Dashboard') ? 'text-white/90 dark:text-slate-300 light:text-slate-700' : '',
          'hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-500/20',
          'dark:hover:from-slate-700/50 dark:hover:to-slate-600/50',
          'light:hover:from-blue-100 light:hover:to-cyan-100',
          'hover:text-white dark:hover:text-slate-100 light:hover:text-blue-700',
          'hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-slate-500/10 light:hover:shadow-blue-200/20',
          { 'justify-center': collapsed }
        ]"
      >
        <LayoutDashboardIcon class="h-5 w-5 group-hover:scale-110 transition-transform" :class="{ 'mr-3': !collapsed }" />
        <span v-if="!collapsed">Dashboard</span>
        <div v-if="!collapsed" class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRightIcon class="h-4 w-4" />
        </div>
      </router-link>
      
      <!-- Stations - All roles -->
      <router-link 
        v-if="canAccess('Stations')"
        :to="{ name: 'Stations' }" 
        class="group flex items-center px-3 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105" 
        :class="[
          ...getActiveClasses('Stations'),
          !isActiveRoute('Stations') ? 'text-white/90 dark:text-slate-300 light:text-slate-700' : '',
          'hover:bg-gradient-to-r hover:from-emerald-600/20 hover:to-green-500/20',
          'dark:hover:from-slate-700/50 dark:hover:to-slate-600/50',
          'light:hover:from-emerald-100 light:hover:to-green-100',
          'hover:text-white dark:hover:text-slate-100 light:hover:text-emerald-700',
          'hover:shadow-lg hover:shadow-emerald-500/10 dark:hover:shadow-slate-500/10 light:hover:shadow-emerald-200/20',
          { 'justify-center': collapsed }
        ]"
      >
        <div class="relative">
          <RadioIcon class="h-5 w-5 text-emerald-500 group-hover:scale-110 transition-transform" :class="{ 'mr-3': !collapsed }" />
          <div class="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-30"></div>
        </div>
        <span v-if="!collapsed">Station Manager</span>
        <div v-if="!collapsed" class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRightIcon class="h-4 w-4" />
        </div>
      </router-link>
      
      <!-- Podcasts - All roles -->
      <router-link  
        v-if="canAccess('Podcasts')"
        :to="{ name: 'Podcasts' }" 
        class="group w-full flex items-center px-3 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105" 
        :class="[
          ...getActiveClasses('Podcasts'),
          !isActiveRoute('Podcasts') ? 'text-white/90 dark:text-slate-300 light:text-slate-700' : '',
          'hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-500/20',
          'dark:hover:from-slate-700/50 dark:hover:to-slate-600/50',
          'light:hover:from-blue-100 light:hover:to-cyan-100',
          'hover:text-white dark:hover:text-slate-100 light:hover:text-blue-700',
          'hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-slate-500/10 light:hover:shadow-blue-200/20',
          { 'justify-center': collapsed }
        ]"
      >
        <PodcastIcon class="h-5 w-5 group-hover:scale-110 transition-transform" :class="{ 'mr-3': !collapsed }" />
        <span v-if="!collapsed" class="flex-1 text-left">Radio Sessions</span>
        <div v-if="!collapsed" class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRightIcon class="h-4 w-4" />
        </div>
      </router-link>

      <!-- Live Chats - Admin & Presenter only -->
      <router-link 
        v-if="canAccess('LiveChats')"
        :to="{ name: 'LiveChats' }" 
        class="group flex items-center px-3 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105" 
        :class="[
          ...getActiveClasses('LiveChats'),
          !isActiveRoute('LiveChats') ? 'text-white/90 dark:text-slate-300 light:text-slate-700' : '',
          'hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-500/20',
          'dark:hover:from-slate-700/50 dark:hover:to-slate-600/50',
          'light:hover:from-purple-100 light:hover:to-pink-100',
          'hover:text-white dark:hover:text-slate-100 light:hover:text-purple-700',
          'hover:shadow-lg hover:shadow-purple-500/10 dark:hover:shadow-slate-500/10 light:hover:shadow-purple-200/20',
          { 'justify-center': collapsed }
        ]"
      >
        <div class="relative">
          <MessageCircleIcon class="h-5 w-5 text-purple-500 group-hover:scale-110 transition-transform" :class="{ 'mr-3': !collapsed }" />
          <div class="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        <span v-if="!collapsed">Radio Live Chats</span>
        <div v-if="!collapsed" class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRightIcon class="h-4 w-4" />
        </div>
      </router-link>

      <!-- Events Manager - All roles -->
      <router-link 
        v-if="canAccess('Events')"
        :to="{ name: 'Events' }" 
        class="group flex items-center px-3 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105" 
        :class="[
          ...getActiveClasses('Events'),
          !isActiveRoute('Events') ? 'text-white/90 dark:text-slate-300 light:text-slate-700' : '',
          'hover:bg-gradient-to-r hover:from-amber-600/20 hover:to-orange-500/20',
          'dark:hover:from-slate-700/50 dark:hover:to-slate-600/50',
          'light:hover:from-amber-100 light:hover:to-orange-100',
          'hover:text-white dark:hover:text-slate-100 light:hover:text-amber-700',
          'hover:shadow-lg hover:shadow-amber-500/10 dark:hover:shadow-slate-500/10 light:hover:shadow-amber-200/20',
          { 'justify-center': collapsed }
        ]"
      >
        <div class="relative">
          <CalendarDaysIcon class="h-5 w-5 text-amber-500 group-hover:scale-110 transition-transform" :class="{ 'mr-3': !collapsed }" />
          <div class="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
        </div>
        <span v-if="!collapsed">Events Manager</span>
        <div v-if="!collapsed" class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRightIcon class="h-4 w-4" />
        </div>
      </router-link>
      
      <!-- News - Admin & Editor only -->
      <router-link 
        v-if="canAccess('News')"
        :to="{name: 'News'}" 
        class="group flex items-center px-3 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105" 
        :class="[
          ...getActiveClasses('News'),
          !isActiveRoute('News') ? 'text-white/90 dark:text-slate-300 light:text-slate-700' : '',
          'hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-500/20',
          'dark:hover:from-slate-700/50 dark:hover:to-slate-600/50',
          'light:hover:from-blue-100 light:hover:to-cyan-100',
          'hover:text-white dark:hover:text-slate-100 light:hover:text-blue-700',
          'hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-slate-500/10 light:hover:shadow-blue-200/20',
          { 'justify-center': collapsed }
        ]"
      >
        <NewspaperIcon class="h-5 w-5 group-hover:scale-110 transition-transform" :class="{ 'mr-3': !collapsed }" />
        <span v-if="!collapsed">Articles & News</span>
        <div v-if="!collapsed" class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRightIcon class="h-4 w-4" />
        </div>
      </router-link>
      
      <!-- Forums - Admin & Editor only -->
      <router-link 
        v-if="canAccess('Forums')"
        :to="{ name: 'Forums' }" 
        class="group flex items-center px-3 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105" 
        :class="[
          ...getActiveClasses('Forums'),
          !isActiveRoute('Forums') ? 'text-white/90 dark:text-slate-300 light:text-slate-700' : '',
          'hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-500/20',
          'dark:hover:from-slate-700/50 dark:hover:to-slate-600/50',
          'light:hover:from-blue-100 light:hover:to-cyan-100',
          'hover:text-white dark:hover:text-slate-100 light:hover:text-blue-700',
          'hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-slate-500/10 light:hover:shadow-blue-200/20',
          { 'justify-center': collapsed }
        ]"
      >
        <MessageSquareIcon class="h-5 w-5 group-hover:scale-110 transition-transform" :class="{ 'mr-3': !collapsed }" />
        <span v-if="!collapsed">Discussions/Forum</span>
        <div v-if="!collapsed" class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRightIcon class="h-4 w-4" />
        </div>
      </router-link>

      <!-- Adverts - Admin & Editor only -->
      <router-link 
        v-if="canAccess('Adverts')"
        :to="{ name: 'Adverts' }" 
        class="group flex items-center px-3 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105" 
        :class="[
          ...getActiveClasses('Adverts'),
          !isActiveRoute('Adverts') ? 'text-white/90 dark:text-slate-300 light:text-slate-700' : '',
          'hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-500/20',
          'dark:hover:from-slate-700/50 dark:hover:to-slate-600/50',
          'light:hover:from-blue-100 light:hover:to-cyan-100',
          'hover:text-white dark:hover:text-slate-100 light:hover:text-blue-700',
          'hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-slate-500/10 light:hover:shadow-blue-200/20',
          { 'justify-center': collapsed }
        ]"
      >
        <MegaphoneIcon class="h-5 w-5 group-hover:scale-110 transition-transform" :class="{ 'mr-3': !collapsed }" />
        <span v-if="!collapsed">Adverts/Sponsors</span>
        <div v-if="!collapsed" class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRightIcon class="h-4 w-4" />
        </div>
      </router-link>
      
      <!-- Sessions - All roles -->
      <router-link 
        v-if="canAccess('Sessions')"
        :to="{ name: 'Sessions' }" 
        class="group flex items-center px-3 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105" 
        :class="[
          ...getActiveClasses('Sessions'),
          !isActiveRoute('Sessions') ? 'text-white/90 dark:text-slate-300 light:text-slate-700' : '',
          'hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-500/20',
          'dark:hover:from-slate-700/50 dark:hover:to-slate-600/50',
          'light:hover:from-blue-100 light:hover:to-cyan-100',
          'hover:text-white dark:hover:text-slate-100 light:hover:text-blue-700',
          'hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-slate-500/10 light:hover:shadow-blue-200/20',
          { 'justify-center': collapsed }
        ]"
      >
        <CalendarIcon class="h-5 w-5 group-hover:scale-110 transition-transform" :class="{ 'mr-3': !collapsed }" />
        <span v-if="!collapsed">Radio Programs</span>
        <div v-if="!collapsed" class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRightIcon class="h-4 w-4" />
        </div>
      </router-link>
      
      <!-- Hosts & VJs - All roles -->
      <router-link 
        v-if="canAccess('Hosts')"
        :to="{ name: 'Hosts' }" 
        class="group flex items-center px-3 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105" 
        :class="[
          ...getActiveClasses('Hosts'),
          !isActiveRoute('Hosts') ? 'text-white/90 dark:text-slate-300 light:text-slate-700' : '',
          'hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-500/20',
          'dark:hover:from-slate-700/50 dark:hover:to-slate-600/50',
          'light:hover:from-blue-100 light:hover:to-cyan-100',
          'hover:text-white dark:hover:text-slate-100 light:hover:text-blue-700',
          'hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-slate-500/10 light:hover:shadow-blue-200/20',
          { 'justify-center': collapsed }
        ]"
      >
        <MicIcon class="h-5 w-5 group-hover:scale-110 transition-transform" :class="{ 'mr-3': !collapsed }" />
        <span v-if="!collapsed">Hosts & VJs Team</span>
        <div v-if="!collapsed" class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRightIcon class="h-4 w-4" />
        </div>
      </router-link>

      
      
      <!-- Access Users - Admin only -->
      <router-link 
        v-if="canAccess('user_manager')"
        :to="{ name: 'user_manager' }" 
        class="group flex items-center px-3 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105" 
        :class="[
          ...getActiveClasses('user_manager'),
          !isActiveRoute('user_manager') ? 'text-white/90 dark:text-slate-300 light:text-slate-700' : '',
          'hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-500/20',
          'dark:hover:from-slate-700/50 dark:hover:to-slate-600/50',
          'light:hover:from-blue-100 light:hover:to-cyan-100',
          'hover:text-white dark:hover:text-slate-100 light:hover:text-blue-700',
          'hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-slate-500/10 light:hover:shadow-blue-200/20',
          { 'justify-center': collapsed }
        ]"
      >
        <UsersIcon class="h-5 w-5 group-hover:scale-110 transition-transform" :class="{ 'mr-3': !collapsed }" />
        <span v-if="!collapsed">Access Users</span>
        <div v-if="!collapsed" class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRightIcon class="h-4 w-4" />
        </div>
      </router-link>
    </nav>
    
    <!-- Collapse Button -->
    <div class="mt-8 px-4">
      <button 
        @click="toggleCollapse" 
        class="group w-full flex items-center justify-center py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
        :class="[
          'bg-gradient-to-r from-blue-700/50 to-blue-600/50',
          'dark:from-slate-700/50 dark:to-slate-600/50',
          'light:from-blue-200/50 light:to-blue-100/50',
          'hover:from-blue-600 hover:to-blue-500',
          'dark:hover:from-slate-600 dark:hover:to-slate-500',
          'light:hover:from-blue-300 light:hover:to-blue-200',
          'text-white dark:text-slate-200 light:text-blue-700',
          'shadow-lg hover:shadow-xl',
          'backdrop-blur-sm border border-blue-500/20 dark:border-slate-600/20 light:border-blue-300/30'
        ]"
      >
        <ChevronLeftIcon v-if="!collapsed" class="h-5 w-5 group-hover:scale-110 transition-transform" />
        <ChevronRightIcon v-else class="h-5 w-5 group-hover:scale-110 transition-transform" />
        <span v-if="!collapsed" class="ml-2">Collapse</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { 
  LayoutDashboard as LayoutDashboardIcon, 
  Radio as RadioIcon, 
  Mic as MicIcon, 
  Calendar as CalendarIcon,
  CalendarDays as CalendarDaysIcon,
  Users as UsersIcon, 
  LogOut as LogOutIcon,
  ChevronDown as ChevronDownIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Podcast as PodcastIcon,
  Newspaper as NewspaperIcon,
  CircleDot as CircleDotIcon,
  MessageSquare as MessageSquareIcon,
  MessageCircle as MessageCircleIcon,
  Megaphone as MegaphoneIcon
} from 'lucide-vue-next';

const store = useStore();
const router = useRouter();
const route = useRoute();

// Get current user from store
const authuser = computed(() => store.getters.authuser);
const userRole = computed(() => authuser.value?.role || 'presenter');

// Role-based access control
const rolePermissions = {
  admin: [
    'Dashboard', 'Stations', 'Podcasts', 'News', 'Forums', 
    'Adverts', 'Sessions', 'Hosts', 'LiveChats', 'Events', 'user_manager'
  ],
  editor: [
    'Dashboard', 'Stations', 'Podcasts', 'News', 'Forums', 
    'Adverts', 'Sessions', 'Hosts', 'Events'
  ],
  presenter: [
    'Stations', 'Podcasts', 'Sessions', 'Hosts', 'LiveChats', 'Events'
  ]
};

// Check if user can access a route
const canAccess = (routeName) => {
  const permissions = rolePermissions[userRole.value] || rolePermissions.presenter;
  return permissions.includes(routeName);
};

// Active route checker
const isActiveRoute = (routeName) => {
  return route.path.toLowerCase().includes(routeName.toLowerCase()) || route.name === routeName;
};

// Get active route classes
const getActiveClasses = (routeName) => {
  if (isActiveRoute(routeName)) {
    return [
      'bg-gradient-to-r from-blue-600/30 to-cyan-500/30',
      'dark:from-slate-600/40 dark:to-slate-500/40',
      'light:from-blue-200/60 light:to-cyan-200/60',
      'text-white dark:text-slate-100 light:text-blue-800',
      'shadow-lg shadow-blue-500/20 dark:shadow-slate-500/20 light:shadow-blue-300/30',
      'border border-blue-500/30 dark:border-slate-500/30 light:border-blue-300/40'
    ];
  }
  return [];
};

// Sidebar state
const collapsed = ref(false);
const expandedSections = ref({
  stations: false,
  podcasts: false,
  news: false,
  scheduler: false
});

// Toggle sidebar collapse
const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
  
  // Close all expanded sections when collapsing
  if (collapsed.value) {
    Object.keys(expandedSections.value).forEach(key => {
      expandedSections.value[key] = false;
    });
  }
};

// Toggle section expansion
const toggleSection = (section) => {
  if (!collapsed.value) {
    expandedSections.value[section] = !expandedSections.value[section];
  }
};

// Logout function
const logout = async () => {
  try {
    await store.dispatch('auth/log_out_user');
    router.push({ name: 'Login' });
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
</script>