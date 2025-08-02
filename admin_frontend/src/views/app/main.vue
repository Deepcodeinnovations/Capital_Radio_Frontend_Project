<template>
  <div class="flex h-screen bg-gray-50 dark:bg-slate-900 overflow-hidden transition-colors duration-300">
    <!-- Sidebar -->
    <SideNavigation 
      :class="[
        'fixed inset-y-0 left-0 z-30 w-64 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    />
    
    <!-- Sidebar Overlay for mobile -->
    <div 
      v-if="sidebarOpen" 
      @click="toggleSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
    ></div>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top Navigation -->
      <TopNavigation @toggle-sidebar="toggleSidebar" />
      
      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        <div class="p-4 md:p-6 lg:p-8">
          <div class="mx-auto ">
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
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import SideNavigation from './includes/SideNavigation.vue';
import TopNavigation from './includes/TopNavigation.vue';

const route = useRoute();
const sidebarOpen = ref(false);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const handleResize = () => {
  if (window.innerWidth >= 1024) {
    sidebarOpen.value = false;
  }
};

// Watch for route changes to close sidebar on mobile
watch(() => route.path, () => {
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false;
  }
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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
</style>