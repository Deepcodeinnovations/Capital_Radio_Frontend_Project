<template>
  <section class="py-16 relative">
    <!-- Background decoration - more subtle -->
    <div class="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
      <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-capital-yellow rounded-full blur-3xl"></div>
      <div class="absolute -top-80 -right-20 w-[500px] h-[500px] bg-capital-red/20 rounded-full blur-3xl"></div>
    </div>
    
    <!-- Section connector - top curve -->
    <div class="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-slate-900 to-transparent -z-10"></div>
    
    <div class="container mx-auto px-4 relative">
      <div class="mb-10">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-heading text-3xl md:text-4xl font-bold text-white mb-2">Latest <span class="text-capital-yellow">News & Updates</span></h2>
            <div class="h-1 w-20 bg-gradient-to-r from-capital-blue via-capital-yellow to-capital-red"></div>
          </div>
          
          <div class="hidden md:flex items-center space-x-4">
            <div class="flex items-center space-x-1">
              <button 
                v-for="(category, index) in newsCategories" 
                :key="index"
                @click="setActiveCategory(category.id)"
                class="px-3 py-1.5 rounded-full text-sm transition-colors"
                :class="activeCategory === category.id ? 'bg-capital-blue text-white' : 'bg-slate-800/70 text-slate-400 hover:text-white'"
              >
                {{ category.name }}
              </button>
            </div>
            
            <a href="#all-news" class="text-capital-blue hover:text-capital-yellow text-sm font-medium transition-colors flex items-center gap-1">
              View All 
              <ArrowRight class="h-3 w-3" />
            </a>
          </div>
        </div>
        <p class="text-slate-400 mt-4 max-w-2xl font-light">
          Stay up-to-date with the latest entertainment news, music releases, events, and updates from Capital FM and the Ugandan music scene.
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
        <!-- Main featured news item -->
        <div class="md:col-span-7 lg:col-span-8">
          <div class="bg-gradient-to-r p-[1px] from-capital-blue via-capital-yellow to-capital-red rounded-xl overflow-hidden">
            <div class="h-full bg-slate-800/95 rounded-xl overflow-hidden relative group">
              <!-- Featured news image with overlay -->
              <div class="aspect-[16/9] md:aspect-auto md:h-[400px] overflow-hidden relative">
                <img 
                  :src="featuredNews.imageUrl" 
                  :alt="featuredNews.title" 
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent"></div>
              </div>
              
              <!-- Content overlay -->
              <div class="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div class="flex items-center gap-3 mb-3">
                  <span class="bg-capital-red/90 px-3 py-1 rounded-md text-xs font-bold text-white uppercase entertainment-text tracking-wider flex items-center gap-1">
                    <span class="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    Breaking
                  </span>
                  <span class="text-slate-300 text-sm flex items-center gap-1">
                    <Calendar class="h-3.5 w-3.5" />
                    {{ featuredNews.date }}
                  </span>
                </div>
                
                <h3 class="text-2xl md:text-3xl font-bold text-white mb-3 font-heading">
                  {{ featuredNews.title }}
                </h3>
                
                <p class="text-slate-300 mb-5 line-clamp-2">{{ featuredNews.excerpt }}</p>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <img :src="featuredNews.authorImage" alt="Author" class="w-8 h-8 rounded-full">
                    <span class="text-capital-yellow font-medium text-sm">{{ featuredNews.author }}</span>
                  </div>
                  
                  <a :href="featuredNews.url" class="px-4 py-2 bg-capital-blue/20 hover:bg-capital-blue/40 transition-colors text-capital-blue rounded-lg text-sm font-medium flex items-center gap-2">
                    Read Full Story
                    <ArrowRight class="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Latest news list -->
        <div class="md:col-span-5 lg:col-span-4 flex flex-col">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="font-heading text-xl font-bold text-white flex items-center gap-2">
              <Clock class="h-5 w-5 text-capital-yellow" />
              Latest Updates
            </h3>
            
            <!-- Mobile category filter -->
            <div class="md:hidden">
              <button class="px-3 py-1.5 bg-slate-800 rounded-lg text-slate-300 flex items-center gap-2">
                <Filter class="h-4 w-4" />
                Filter
              </button>
            </div>
          </div>
          
          <div class="divide-y divide-slate-700/50 flex-1 bg-slate-800/50 rounded-xl overflow-hidden">
            <div 
              v-for="(item, index) in filteredNewsItems.slice(0, 4)" 
              :key="index" 
              class="p-4 hover:bg-slate-700/20 transition-colors flex gap-4"
            >
              <div class="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                <img :src="item.imageUrl" :alt="item.title" class="w-full h-full object-cover">
              </div>
              
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs px-2 py-0.5 rounded-full" 
                        :class="getCategoryColor(item.category)">
                    {{ item.category }}
                  </span>
                  <span class="text-slate-400 text-xs">{{ item.date }}</span>
                </div>
                
                <h4 class="text-white font-medium text-sm line-clamp-2 mb-1 hover:text-capital-yellow transition-colors">
                  {{ item.title }}
                </h4>
                
                <a href="#" class="text-capital-blue hover:text-capital-yellow text-xs transition-colors">Read more</a>
              </div>
            </div>
          </div>
          
          <div class="mt-4">
            <a href="#all-news" class="block w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 transition-colors rounded-lg text-center text-white text-sm">
              View All News & Updates
            </a>
          </div>
        </div>
      </div>
      
      <!-- News categories with stories -->
      <div class="mb-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(category, idx) in newsCategories.slice(1)" :key="idx" class="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/30">
            <div class="h-40 relative overflow-hidden">
              <img :src="category.imageUrl" :alt="category.name" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
              <div class="absolute bottom-0 left-0 p-4">
                <h3 class="text-lg font-bold text-white">{{ category.name }}</h3>
                <p class="text-xs text-slate-300">{{ category.description }}</p>
              </div>
            </div>
            
            <div class="p-4 space-y-3">
              <div v-for="(story, storyIdx) in category.stories" :key="storyIdx" class="border-b border-slate-700/30 last:border-0 pb-3 last:pb-0">
                <a href="#" class="text-sm text-white hover:text-capital-yellow transition-colors line-clamp-2">
                  {{ story }}
                </a>
              </div>
            </div>
            
            <div class="px-4 pb-4">
              <a :href="`#${category.id}`" class="text-xs text-capital-blue hover:text-capital-yellow transition-colors flex items-center gap-1">
                More {{ category.name }} News
                <ArrowRight class="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Newsletter signup - improved design -->
      <div class="rounded-xl overflow-hidden">
        <div class="bg-gradient-to-br from-slate-800/80 to-slate-900/95 backdrop-blur-sm p-8 border border-slate-700/40">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div class="md:col-span-7">
              <h3 class="font-heading text-2xl font-bold text-white mb-2">Stay Connected with Capital FM</h3>
              <p class="text-slate-300 mb-4">Get exclusive news, event updates, contest notifications, and behind-the-scenes content delivered straight to your inbox. Never miss a beat!</p>
              
              <div class="flex flex-col sm:flex-row gap-3">
                <div class="relative flex-1">
                  <input type="email" placeholder="Your email address" class="w-full bg-slate-700/50 border border-slate-600 rounded-lg py-3 px-4 text-white pr-12 focus:outline-none focus:ring-2 focus:ring-capital-blue focus:border-transparent transition-all" />
                  <Mail class="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
                <button class="py-3 px-6 bg-gradient-to-r from-capital-blue to-capital-purple rounded-lg text-white font-medium whitespace-nowrap hover:shadow-lg hover:shadow-capital-blue/20 transition-all duration-300">
                  Subscribe Now
                </button>
              </div>
              
              <p class="text-xs text-slate-500 mt-3">By subscribing, you agree to our <a href="#" class="text-capital-blue hover:text-capital-yellow">Privacy Policy</a> and consent to receive updates from Capital FM.</p>
            </div>
            
            <div class="md:col-span-5 relative h-full min-h-[180px] hidden md:block">
              <!-- Visual element for newsletter -->
              <div class="absolute top-1/2 right-0 transform -translate-y-1/2 w-full h-full">
                <div class="relative w-full h-full">
                  <img src="https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80" alt="Newsletter" class="absolute right-0 top-1/2 transform -translate-y-1/2 w-48 h-48 object-cover rounded-xl shadow-xl rotate-3 z-10">
                  <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" alt="Newsletter" class="absolute right-20 top-1/2 transform -translate-y-1/2 -rotate-6 w-40 h-40 object-cover rounded-xl shadow-xl">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section connector - bottom curve -->
    <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900 to-transparent -z-10"></div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ArrowRight, Calendar, Clock, Filter, Mail } from 'lucide-vue-next';

// Animation for section reveal
onMounted(() => {
  // Simple intersection observer to reveal section when scrolled into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Set visible instead of adding the animation class
        entry.target.classList.add('fade-in-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -100px 0px' });
  
  const sectionElements = document.querySelectorAll('.grid, .rounded-xl');
  sectionElements.forEach(section => {
    // Add initial state class
    section.classList.add('fade-in-initial');
    observer.observe(section);
  });
});

// Featured news item
const featuredNews = {
  title: 'Kampala Music Festival 2023 Announces Star-Studded Lineup with International Headliners',
  excerpt: 'The annual Kampala Music Festival has announced its star-studded lineup for 2023, featuring both international artists and top Ugandan talent including popular Capital FM presenters and DJ performances throughout the three-day event.',
  imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80',
  date: 'May 14, 2023',
  author: 'James Mukasa',
  authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
  category: 'EVENTS',
  url: '#featured-story'
};

// News categories
const newsCategories = [
  { 
    id: 'all', 
    name: 'All News',
    description: 'All news stories'
  },
  { 
    id: 'music', 
    name: 'Music',
    description: 'Latest music releases and news',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    stories: [
      'New Album: Fireboy DML Drops "Playboy" Deluxe Edition with 5 New Tracks',
      'Songwriter Awards: Ugandan Writers Receive Recognition at AFRIMA',
      'Music Charts: Local Artists Dominate Capital FM\'s Top 10 This Week'
    ]
  },
  { 
    id: 'events', 
    name: 'Events',
    description: 'Upcoming events and festivals',
    imageUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    stories: [
      'Nyege Nyege Festival Unveils New Venue and Expanded Activities',
      'Capital FM to Host Summer Concert Series at Gaba Beach',
      'Uganda Entertainment Awards Set for July at Serena Hotel'
    ]
  },
  { 
    id: 'interviews', 
    name: 'Interviews',
    description: 'Exclusive artist conversations',
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80',
    stories: [
      'One-on-One with Winnie Nwagi on Her International Collaboration',
      'Behind the Beats: Producer Interview with Ugandan Beat Master',
      'Rising Star: Capital FM Exclusive with New Voice Talent'
    ]
  }
];

// Active category filter
const activeCategory = ref('all');

// Set active category
const setActiveCategory = (categoryId) => {
  activeCategory.value = categoryId;
};

// News items
const newsItems = [
  {
    title: 'Capital FM Celebrates 30 Years of Broadcasting Excellence in Uganda',
    category: 'ANNIVERSARY',
    date: 'May 10, 2023',
    excerpt: 'Uganda\'s premier English radio station marks three decades of bringing fresh hits and quality content to listeners across the country.',
    imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    title: 'Capital FM Wins "Radio Station of the Year" Award at National Media Excellence Awards',
    category: 'ACHIEVEMENT',
    date: 'May 5, 2023',
    excerpt: 'Capital FM recognized for broadcasting excellence at the annual Uganda Media Awards, celebrating outstanding contributions to the industry.',
    imageUrl: 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    title: 'Rising Star Shares Exclusive Interview on The Late Date Show with Capital FM',
    category: 'INTERVIEW',
    date: 'May 1, 2023',
    excerpt: 'Listen to the full interview with Uganda\'s latest musical sensation, discussing their journey and upcoming album release.',
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    title: 'Capital FM Launches New Mobile App with Enhanced Interactive Features',
    category: 'TECHNOLOGY',
    date: 'April 28, 2023',
    excerpt: 'The new app brings improved streaming quality, personalized content, and interactive features for listeners on the go.',
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    title: 'DJ Battle: Capital FM Hosts Ultimate Showdown Between Uganda\'s Top DJs',
    category: 'EVENTS',
    date: 'April 25, 2023',
    excerpt: 'Witness an epic DJ competition as top talents compete for the title of Uganda\'s Best DJ in this live broadcast event.',
    imageUrl: 'https://images.unsplash.com/photo-1571266028253-6032d7cab60c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  },
  {
    title: 'Capital FM Introduces New Morning Show Host for Drive Time Segment',
    category: 'SHOWS',
    date: 'April 20, 2023',
    excerpt: 'Meet the fresh voice joining our morning team, bringing new energy and entertainment to your daily commute.',
    imageUrl: 'https://images.unsplash.com/photo-1557682257-2f9c37a3a5f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  }
];

// Filtered news items based on active category
const filteredNewsItems = computed(() => {
  if (activeCategory.value === 'all') {
    return newsItems;
  }
  return newsItems.filter(item => item.category.toLowerCase() === activeCategory.value.toLowerCase());
});

// Get category color based on category name
const getCategoryColor = (category) => {
  const categoryMap = {
    'ANNIVERSARY': 'bg-capital-purple/20 text-capital-purple',
    'ACHIEVEMENT': 'bg-capital-blue/20 text-capital-blue',
    'INTERVIEW': 'bg-capital-yellow/20 text-capital-yellow',
    'TECHNOLOGY': 'bg-green-500/20 text-green-500',
    'EVENTS': 'bg-capital-red/20 text-capital-red',
    'SHOWS': 'bg-orange-500/20 text-orange-500',
    'MUSIC': 'bg-pink-500/20 text-pink-500'
  };
  
  return categoryMap[category] || 'bg-slate-700 text-slate-300';
};
</script>

<style scoped>
/* Hide scrollbar but keep functionality */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Fade in animation for sections */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in-initial {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.fade-in-visible {
  opacity: 1 !important;
  transform: translateY(0) !important;
}

/* Section connector styles */
section {
  position: relative;
  z-index: 1;
}
</style>