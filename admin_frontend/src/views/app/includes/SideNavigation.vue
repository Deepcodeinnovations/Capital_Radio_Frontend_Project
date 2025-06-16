<template>
  <div :class="[
    `${collapsed ? 'w-16' : 'w-64'}`,
    'bg-gradient-to-b from-blue-900 via-blue-800 to-slate-900 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900',
    'light:bg-gradient-to-b light:from-blue-50 light:via-white light:to-blue-50',
    'text-white dark:text-slate-200 light:text-slate-800',
    'h-full overflow-y-auto transition-all duration-300 ease-in-out shadow-2xl border-r border-blue-700/30 dark:border-slate-700/30 light:border-blue-200/50'
  ]">
    <!-- Logo and Brand -->
    <div class="p-4 border-b border-blue-700/30 dark:border-slate-700/30 light:border-blue-200/50 flex items-center justify-center backdrop-blur-sm bg-white/5 dark:bg-black/10 light:bg-white/80">
      <div class="relative">
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-sm opacity-30"></div>
        <RadioIcon class="h-10 w-10 relative z-10 text-white dark:text-slate-200 light:text-blue-600" />
      </div>
      <div v-if="!collapsed" class="ml-3">
        <span class="text-xl font-bold bg-gradient-to-r from-white to-cyan-300 dark:from-slate-200 dark:to-cyan-300 light:from-blue-600 light:to-cyan-500 bg-clip-text text-transparent">
          Capital FM
        </span>
        <p class="text-xs text-blue-200 dark:text-slate-400 light:text-blue-500 font-medium">Admin Portal</p>
      </div>
    </div>
    
    <!-- Navigation Menu -->
    <nav class="mt-6 px-2 space-y-1">
      <!-- Dashboard -->
      <router-link 
        :to="{name: 'Dashboard'}" 
        class="group flex items-center px-3 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105" 
        :class="[
          'text-white/90 dark:text-slate-300 light:text-slate-700',
          'hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-500/20',
          'dark:hover:from-slate-700/50 dark:hover:to-slate-600/50',
          'light:hover:from-blue-100 light:hover:to-cyan-100',
          'hover:text-white dark:hover:text-slate-100 light:hover:text-blue-700',
          'hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-slate-500/10 light:hover:shadow-blue-200/20',
          { 'justify-center': collapsed }
        ]"
      >
        <HomeIcon class="h-5 w-5 group-hover:scale-110 transition-transform" :class="{ 'mr-3': !collapsed }" />
        <span v-if="!collapsed">Dashboard</span>
        <div v-if="!collapsed" class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRightIcon class="h-4 w-4" />
        </div>
      </router-link>
      
   
      <router-link 
        :to="{ name: 'Stations' }" 
        class="group flex items-center px-3 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105" 
        :class="[
          'text-white/90 dark:text-slate-300 light:text-slate-700',
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
      
      <!-- Podcasts Section -->
      <div class="space-y-1">
        <button 
          @click="toggleSection('podcasts')" 
          class="group w-full flex items-center px-3 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105" 
          :class="[
            'text-white/90 dark:text-slate-300 light:text-slate-700',
            'hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-500/20',
            'dark:hover:from-slate-700/50 dark:hover:to-slate-600/50',
            'light:hover:from-blue-100 light:hover:to-cyan-100',
            'hover:text-white dark:hover:text-slate-100 light:hover:text-blue-700',
            'hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-slate-500/10 light:hover:shadow-blue-200/20',
            { 'justify-center': collapsed, 'bg-blue-600/10 dark:bg-slate-700/30 light:bg-blue-100/50': expandedSections.podcasts }
          ]"
        >
          <HeadphonesIcon class="h-5 w-5 group-hover:scale-110 transition-transform" :class="{ 'mr-3': !collapsed }" />
          <span v-if="!collapsed" class="flex-1 text-left">Radio Sessions</span>
          <ChevronDownIcon 
            v-if="!collapsed" 
            class="h-4 w-4 transition-transform duration-200" 
            :class="{ 'transform rotate-180': expandedSections.podcasts }" 
          />
        </button>
        
        <div 
          v-if="!collapsed && expandedSections.podcasts" 
          class="ml-4 pl-4 border-l-2 border-blue-500/20 dark:border-slate-600/30 light:border-blue-300/40 space-y-1"
        >
          <router-link 
            :to="{ name: 'Podcasts' }" 
            class="group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
            :class="[
              'text-blue-200/80 dark:text-slate-400 light:text-slate-600',
              'hover:bg-blue-600/10 dark:hover:bg-slate-700/30 light:hover:bg-blue-50',
              'hover:text-white dark:hover:text-slate-200 light:hover:text-blue-700'
            ]"
          >
            <div class="w-2 h-2 rounded-full bg-blue-400/50 dark:bg-slate-500 light:bg-blue-400 mr-3 group-hover:bg-blue-300 transition-colors"></div>
            All Radio Sessions
          </router-link>
          <router-link 
            to="/dashboard/podcasts/new" 
            class="group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
            :class="[
              'text-blue-200/80 dark:text-slate-400 light:text-slate-600',
              'hover:bg-blue-600/10 dark:hover:bg-slate-700/30 light:hover:bg-blue-50',
              'hover:text-white dark:hover:text-slate-200 light:hover:text-blue-700'
            ]"
          >
            <div class="w-2 h-2 rounded-full bg-blue-400/50 dark:bg-slate-500 light:bg-blue-400 mr-3 group-hover:bg-blue-300 transition-colors"></div>
            Upload New
          </router-link>
        </div>
      </div>
      
  

      <router-link 
        :to="{name: 'News'}" 
        class="group flex items-center px-3 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105" 
        :class="[
          'text-white/90 dark:text-slate-300 light:text-slate-700',
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
      

      
      <!-- Forums -->
      <router-link 
        :to="{ name: 'Forums' }" 
        class="group flex items-center px-3 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105" 
        :class="[
          'text-white/90 dark:text-slate-300 light:text-slate-700',
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

      <!-- Forums -->
      <router-link 
        :to="{ name: 'Adverts' }" 
        class="group flex items-center px-3 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105" 
        :class="[
          'text-white/90 dark:text-slate-300 light:text-slate-700',
          'hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-500/20',
          'dark:hover:from-slate-700/50 dark:hover:to-slate-600/50',
          'light:hover:from-blue-100 light:hover:to-cyan-100',
          'hover:text-white dark:hover:text-slate-100 light:hover:text-blue-700',
          'hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-slate-500/10 light:hover:shadow-blue-200/20',
          { 'justify-center': collapsed }
        ]"
      >
        <MessageSquareIcon class="h-5 w-5 group-hover:scale-110 transition-transform" :class="{ 'mr-3': !collapsed }" />
        <span v-if="!collapsed">Adverts/Sponsors</span>
        <div v-if="!collapsed" class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRightIcon class="h-4 w-4" />
        </div>
      </router-link>
      
      <!-- Sessions -->
      <router-link 
        :to="{ name: 'Sessions' }" 
        class="group flex items-center px-3 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105" 
        :class="[
          'text-white/90 dark:text-slate-300 light:text-slate-700',
          'hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-500/20',
          'dark:hover:from-slate-700/50 dark:hover:to-slate-600/50',
          'light:hover:from-blue-100 light:hover:to-cyan-100',
          'hover:text-white dark:hover:text-slate-100 light:hover:text-blue-700',
          'hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-slate-500/10 light:hover:shadow-blue-200/20',
          { 'justify-center': collapsed }
        ]"
      >
        <MicIcon class="h-5 w-5 group-hover:scale-110 transition-transform" :class="{ 'mr-3': !collapsed }" />
        <span v-if="!collapsed">Radio Programs</span>
        <div v-if="!collapsed" class="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRightIcon class="h-4 w-4" />
        </div>
      </router-link>
      
      <!-- Hosts & VJs -->
      <router-link 
        :to="{ name: 'Hosts' }" 
        class="group flex items-center px-3 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105" 
        :class="[
          'text-white/90 dark:text-slate-300 light:text-slate-700',
          'hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-cyan-500/20',
          'dark:hover:from-slate-700/50 dark:hover:to-slate-600/50',
          'light:hover:from-blue-100 light:hover:to-cyan-100',
          'hover:text-white dark:hover:text-slate-100 light:hover:text-blue-700',
          'hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-slate-500/10 light:hover:shadow-blue-200/20',
          { 'justify-center': collapsed }
        ]"
      >
        <UsersIcon class="h-5 w-5 group-hover:scale-110 transition-transform" :class="{ 'mr-3': !collapsed }" />
        <span v-if="!collapsed">Hosts & VJs Team</span>
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
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { 
  Home as HomeIcon, 
  Radio as RadioIcon, 
  Mic as MicIcon, 
  Calendar as CalendarIcon, 
  Users as UsersIcon, 
  LogOut as LogOutIcon,
  ChevronDown as ChevronDownIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Headphones as HeadphonesIcon,
  Newspaper as NewspaperIcon,
  CircleDot as CircleDotIcon,
  MessageSquare as MessageSquareIcon
} from 'lucide-vue-next';

const store = useStore();
const router = useRouter();

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