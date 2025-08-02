<template>
  <div class="relative overflow-hidden bg-transparent">
    <Header style="background-color: transparent !important;" />
    <HeroSection style="margin-top: -4rem !important;" v-if="$route.name == 'welcome'" />
    
    <!-- Main Content -->
    <main class="relative z-10">
      <router-view />
    </main>
    
    <LiveChat />
    <Footer />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import Header from './includes/header.vue'
import Footer from './includes/footer.vue'
import HeroSection from './components/Hero.vue'
import LiveChat from './components/LiveChat.vue'

const store = useStore()
let fetchInterval = null

const fetch_initial_data = () => {
  const currentStation = store.getters.station
  if (!currentStation?.id) return
  
  const data = {
    station_id: currentStation.id,
  }
      // Connect WebSocket
  store.dispatch('connectWebSocket');
  store.dispatch('fetch_adverts', data)
  store.dispatch('fetch_breaking_news', data)
}

const fetch_station_data = async () => {
  const radioData = {
    access_link: 'https://kiis1009.co.ug'
  };
  await store.dispatch('fetch_station_details', radioData);
}

// Function to start the interval
const startFetchInterval = () => {
  // 3 minutes in milliseconds = 3 * 60 * 1000 = 180000
  fetchInterval = setInterval(fetch_station_data, 180000)
}

onMounted(async () => {
  await fetch_initial_data()
  await fetch_station_data() // Fetch immediately on mount
  startFetchInterval() // Then start the interval
})

// Clear interval when component is unmounted to prevent memory leaks
onBeforeUnmount(() => {
  if (fetchInterval) {
    clearInterval(fetchInterval)
  }
})
</script>