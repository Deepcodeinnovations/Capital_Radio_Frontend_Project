<template>
  <div class="min-h-screen">
    <!-- Action Button -->
    <div class="mb-6">
      <router-link :to="{ name: 'NewNews' }">
        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <PlusIcon class="w-5 h-5" />
          Create Article
        </button>
      </router-link>
    </div>

    <!-- Trending News Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="article in articles.data" :key="article.id" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden p-4">
        <img v-if="article.featured_image_url" :src="article.featured_image_url" class="w-full h-48 object-cover" />
        <router-link :to="{ name: 'NewNews', params: { id: article.id } }" class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ article.title }}</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">{{ article.excerpt }}</p>
          <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-1">
                <EyeIcon class="h-4 w-4" />
                {{ article.views_count }}
              </div>
              <div class="flex items-center gap-1">
                <HeartIcon class="h-4 w-4" />
                {{ article.likes_count }}
              </div>
            </div>
            <span>{{ formatDate(article.published_at) }}</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { PlusIcon, EyeIcon, HeartIcon } from 'lucide-vue-next';

const store = useStore();

// Computed properties
const articles = computed(() => store.getters.articles || []);

//ref
const currentPage = ref(1);
const per_page = ref(20);

// Methods
const fetchTrendingArticles = async () => {
  try {
    let data ={
      page_page: per_page.value,
    }
    let page = currentPage.value
    await store.dispatch('fetcharticles', data);
  } catch (error) {
    console.error('Error fetching trending articles:', error);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

// Lifecycle
onMounted(() => {
  fetchTrendingArticles();
});
</script>