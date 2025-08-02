<template>
    <aside class="w-80 h-fit bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col sticky top-10 h-screen overflow-y-auto rounded-lg">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <NewspaperIcon class="h-5 w-5 mr-2 text-blue-600" />
          News Management
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage articles and categories</p>
      </div>
  
      <!-- Navigation Menu -->
      <div class="flex-1 p-4 space-y-2">
        <router-link 
          :to="{ name: 'News' }" 
          class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="$route.name === 'News' 
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
        >
          <FileTextIcon class="h-4 w-4 mr-3" />
          All Articles
          <ChevronRightIcon class="h-4 w-4 ml-auto opacity-50" />
        </router-link>
  
        <router-link 
          :to="{ name: 'NewNews' }" 
          class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="$route.name === 'NewNews' 
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
        >
          <PlusCircleIcon class="h-4 w-4 mr-3" />
          Create New Article
          <ChevronRightIcon class="h-4 w-4 ml-auto opacity-50" />
        </router-link>
  
        <router-link 
          :to="{ name: 'NewsCategories' }" 
          class="group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="$route.name === 'NewsCategories' 
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800' 
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
        >
          <FolderIcon class="h-4 w-4 mr-3" />
          Manage Categories
          <ChevronRightIcon class="h-4 w-4 ml-auto opacity-50" />
        </router-link>
      </div>
  
      <!-- Quick Stats -->
      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <div class="space-y-3">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400 flex items-center">
              <FileTextIcon class="h-4 w-4 mr-2" />
              Total Articles
            </span>
            <span class="font-medium text-gray-900 dark:text-white">{{ totalArticles }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400 flex items-center">
              <EyeIcon class="h-4 w-4 mr-2" />
              Published
            </span>
            <span class="font-medium text-green-600 dark:text-green-400">{{ publishedArticles }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400 flex items-center">
              <ClockIcon class="h-4 w-4 mr-2" />
              Drafts
            </span>
            <span class="font-medium text-orange-600 dark:text-orange-400">{{ draftArticles }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600 dark:text-gray-400 flex items-center">
              <FolderIcon class="h-4 w-4 mr-2" />
              Categories
            </span>
            <span class="font-medium text-blue-600 dark:text-blue-400">{{ totalCategories }}</span>
          </div>
        </div>
      </div>
  
  
    </aside>
  </template>
  
  <script setup>
  import { computed, onMounted } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { 
    Newspaper as NewspaperIcon,
    FileText as FileTextIcon,
    PlusCircle as PlusCircleIcon,
    Folder as FolderIcon,
    ChevronRight as ChevronRightIcon,
    Eye as EyeIcon,
    Clock as ClockIcon,
    Edit as EditIcon,
    Zap as ZapIcon,
    Download as DownloadIcon
  } from 'lucide-vue-next';
  
  const store = useStore();
  const router = useRouter();
  
  const totalArticles = computed(() => store.getters.totalArticles || 0);
  const publishedArticles = computed(() => store.getters.publishedArticles || 0);
  const draftArticles = computed(() => store.getters.draftArticles || 0);
  const totalCategories = computed(() => store.getters.totalCategories || 0);
  
  const createQuickDraft = () => {
    router.push({ name: 'NewNews' });
  };
  
  const viewBreakingNews = () => {
    router.push({ name: 'News', query: { filter: 'breaking' } });
  };
  
  const exportArticles = () => {
    console.log('Exporting articles...');
  };
  
  onMounted(() => {
    if (!store.getters.articles) {
      store.dispatch('fetchArticleStats');
    }
    if (!store.getters.categories) {
      store.dispatch('fetchCategories');
    }
  });
  </script>