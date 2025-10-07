<template>
  <div class="relative overflow-x-hidden w-full max-w-full bg-white">
    <Header />
    <HeroSection v-if="$route.name == 'welcome'" />

    <!-- Main Content -->
    <main class="relative z-10 w-full overflow-x-hidden bg-gray-50">
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
  store.dispatch('connectWebSocket');
  store.dispatch('fetch_adverts', data)
  store.dispatch('fetch_breaking_news', data)
}

const fetch_station_data = async () => {
  const radioData = {
    access_link: 'https://capitalradio.co.ug'
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