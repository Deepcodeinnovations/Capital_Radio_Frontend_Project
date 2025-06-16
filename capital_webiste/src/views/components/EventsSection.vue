<template>
    <div class="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-lg rounded-xl p-6 border border-slate-700/50 hover:border-capital-blue/30 transition-all duration-300 shadow-lg hover:shadow-capital-blue/10 group">
      <!-- Header with icon -->
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 rounded-full bg-gradient-to-r from-capital-blue to-capital-purple flex items-center justify-center">
          <Calendar class="h-5 w-5 text-white" />
        </div>
        <h3 class="text-xl font-bold text-white group-hover:text-capital-blue transition-colors">Upcoming Events</h3>
      </div>
  
      <!-- Events list -->
      <div class="space-y-4">
        <div v-for="(event, index) in upcomingEvents" :key="index" 
             class="relative p-3 rounded-lg bg-slate-900/40 border border-slate-700/30 hover:bg-slate-800/60 hover:border-capital-blue/40 transition-all duration-300 group/event cursor-pointer transform hover:scale-[1.02]">
          
          <!-- Gradient border on hover -->
          <div class="absolute inset-0 rounded-lg bg-gradient-to-r from-capital-blue/20 via-capital-purple/20 to-capital-yellow/20 opacity-0 group-hover/event:opacity-100 transition-opacity duration-300 -z-10"></div>
          
          <div class="flex items-start gap-4">
            <!-- Enhanced date card -->
            <div class="relative">
              <div class="bg-gradient-to-br from-capital-blue/20 to-capital-purple/20 rounded-lg p-3 w-16 text-center border border-capital-blue/30 group-hover/event:shadow-lg group-hover/event:shadow-capital-blue/20 transition-all duration-300">
                <div class="text-xs text-capital-blue font-semibold uppercase tracking-wider">{{ event.month }}</div>
                <div class="text-xl text-white font-bold">{{ event.day }}</div>
              </div>
              <!-- Pulse indicator for featured events -->
              <div v-if="event.featured" class="absolute -top-1 -right-1 w-3 h-3 bg-capital-red rounded-full animate-pulse"></div>
            </div>
            
            <!-- Event details -->
            <div class="flex-1">
              <div class="flex items-start justify-between mb-2">
                <h4 class="text-white font-semibold text-base group-hover/event:text-capital-yellow transition-colors leading-tight">{{ event.title }}</h4>
                <span v-if="event.price" class="text-xs px-2 py-1 bg-capital-green/20 text-capital-green rounded-full">{{ event.price }}</span>
              </div>
              
              <div class="space-y-1 text-sm mb-3">
                <div class="text-slate-400 flex items-center">
                  <MapPin class="h-3.5 w-3.5 mr-2 text-capital-blue" /> 
                  {{ event.location }}
                </div>
                <div class="text-slate-400 flex items-center">
                  <Clock class="h-3.5 w-3.5 mr-2 text-capital-purple" /> 
                  {{ event.time }}
                </div>
              </div>
              
              <!-- Event category and details link -->
              <div class="flex items-center justify-between">
                <span class="inline-block px-2 py-1 text-xs rounded-full" 
                      :class="getCategoryStyle(event.category)">
                  {{ event.category }}
                </span>
                <a :href="event.external_link" 
                   target="_blank"
                   rel="noopener noreferrer"
                   class="text-xs text-capital-blue hover:text-capital-yellow transition-colors flex items-center gap-1 hover:gap-2">
                  <span>Details</span>
                  <ExternalLink class="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Enhanced footer -->
      <div class="mt-6 pt-4 border-t border-slate-700/50">
        <div class="flex items-center justify-between">
          <div class="text-xs text-slate-500">
            {{ upcomingEvents.length }} upcoming events
          </div>
          <router-link :to="{name: 'events'}" 
                       class="inline-flex items-center gap-2 text-capital-blue hover:text-capital-yellow text-sm font-medium transition-all duration-300 hover:gap-3">
            <span>See All Events</span>
            <ArrowRight class="h-4 w-4" />
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { MapPin, Clock, Calendar, ArrowRight, ExternalLink } from 'lucide-vue-next';
  
  const upcomingEvents = ref([
    { 
      id: 1,
      title: 'Kampala Music Festival', 
      month: 'JUN', 
      day: '15', 
      location: 'Kololo Airstrip',
      time: '6:00 PM',
      category: 'Music',
      price: 'Free',
      featured: true,
      external_link: 'https://kampalamusic.festival.com'
    },
    { 
      id: 2,
      title: 'Acoustic Unplugged', 
      month: 'JUN', 
      day: '23', 
      location: 'Gatto Matto',
      time: '8:00 PM',
      category: 'Live Show',
      price: '25K UGX',
      external_link: 'https://acousticunplugged.eventbrite.com'
    },
    { 
      id: 3,
      title: 'Capital FM Live', 
      month: 'JUL', 
      day: '05', 
      location: 'Garden City',
      time: '2:00 PM',
      category: 'Broadcast',
      price: 'Free',
      external_link: 'https://capitalfm.co.ug/events/live-broadcast'
    }
  ]);
  
  const getCategoryStyle = (category) => {
    const styles = {
      'Music': 'bg-capital-blue/20 text-capital-blue',
      'Live Show': 'bg-capital-purple/20 text-capital-purple',
      'Broadcast': 'bg-capital-yellow/20 text-capital-yellow'
    };
    return styles[category] || 'bg-slate-700/50 text-slate-400';
  };
  </script>