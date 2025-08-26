<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section
      class="relative min-h-[98vh] flex items-center justify-center overflow-hidden"
      style="margin-top: 5rem !important"
    >
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Radio Shows"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/60"></div>
      </div>

      <!-- Clean geometric background -->
      <div class="absolute inset-0 opacity-10">
        <div
          class="absolute top-20 left-10 w-20 h-20 bg-red-600 transform rotate-45"
        ></div>
        <div class="absolute bottom-40 right-20 w-16 h-16 bg-white"></div>
        <div class="absolute top-1/2 left-1/4 w-12 h-12 bg-red-600"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 container mx-auto px-6 text-center">
        <!-- Hero Badge -->
        <div
          class="inline-block bg-red-600 text-white px-6 py-2 my-8 transform -rotate-1"
        >
          <span class="font-black text-sm tracking-widest uppercase"
            >RADIO PROGRAMS</span
          >
        </div>

        <!-- Main Heading -->
        <h1 class="text-6xl font-black text-white mb-6 leading-none">
          RADIO
          <span class="block text-red-600">SHOWS</span>
        </h1>

        <!-- Subtitle -->
        <p
          class="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Listen to recorded radio programs from
          {{ station?.name || "Beat FM" }}
        </p>

        <!-- Live Stats Row -->
        <div
          class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto"
        >
          <div
            class="bg-red-600 border-4 border-red-600 p-4 text-center transform hover:scale-105 transition-transform"
          >
            <div class="text-3xl font-black text-white mb-1">
              {{ sessionRecordings?.total || 0 }}
            </div>
            <div class="text-xs font-bold text-white uppercase tracking-wider">
              EPISODES
            </div>
          </div>
          <div
            class="bg-white/90 backdrop-blur-sm border-4 border-white p-4 text-center transform hover:scale-105 transition-transform"
          >
            <div class="text-3xl font-black text-black mb-1">
              {{ uniquePrograms.length }}
            </div>
            <div class="text-xs font-bold text-black uppercase tracking-wider">
              PROGRAMS
            </div>
          </div>
          <div
            class="bg-black/80 backdrop-blur-sm border-4 border-black p-4 text-center transform hover:scale-105 transition-transform"
          >
            <div class="text-3xl font-black text-white mb-1">
              {{ totalDuration }}
            </div>
            <div class="text-xs font-bold text-white uppercase tracking-wider">
              HOURS
            </div>
          </div>
          <div
            class="bg-white/90 backdrop-blur-sm border-4 border-red-600 p-4 text-center transform hover:scale-105 transition-transform"
          >
            <div
              class="text-3xl font-black text-red-600 mb-1 flex items-center justify-center gap-2"
            >
              {{ todayEpisodes }}
              <div
                v-if="todayEpisodes > 0"
                class="w-2 h-2 bg-red-600 animate-pulse"
              ></div>
            </div>
            <div
              class="text-xs font-bold text-red-600 uppercase tracking-wider"
            >
              TODAY
            </div>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div
          class="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            @click="togglePlayPause"
            :disabled="isLoading"
            class="bg-red-600 hover:bg-red-700 text-white font-black px-12 py-4 transition-all duration-300 transform hover:scale-105 shadow-lg border-4 border-red-600"
          >
            <div class="flex items-center justify-center space-x-3">
              <div
                v-if="isLoading"
                class="w-5 h-5 border-2 border-white border-t-transparent animate-spin"
              ></div>
              <Volume2
                v-else-if="isPlaying"
                :size="20"
                class="animate-bounce"
              />
              <Play v-else :size="20" />
              <span class="tracking-widest text-sm" v-if="isLoading"
                >CONNECTING</span
              >
              <span class="tracking-widest text-sm" v-else-if="isPlaying"
                >LIVE NOW</span
              >
              <span class="tracking-widest text-sm" v-else>LISTEN LIVE</span>
            </div>
          </button>

          <button
            @click="scrollToShows"
            class="bg-white/10 backdrop-blur-md border-4 border-white text-white font-black px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105"
          >
            <span class="tracking-widest text-sm">BROWSE SHOWS</span>
          </button>
        </div>
      </div>

      <!-- Sharp Bottom Divider -->
      <div
        class="absolute bottom-0 left-0 w-full overflow-hidden"
        style="transform: translateY(1px)"
      >
        <svg
          class="w-full h-auto"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="showWaveGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" style="stop-color: #dc2626; stop-opacity: 1" />
              <stop offset="50%" style="stop-color: #000000; stop-opacity: 1" />
              <stop
                offset="100%"
                style="stop-color: #dc2626; stop-opacity: 1"
              />
            </linearGradient>
          </defs>
          <path
            d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z"
            fill="url(#showWaveGradient)"
          ></path>
          <path
            d="M0,80 C300,40 600,100 900,80 C1000,70 1100,90 1200,80 L1200,120 L0,120 Z"
            fill="rgb(249 250 251)"
            opacity="0.9"
          ></path>
        </svg>
      </div>
    </section>

    <!-- Main Content -->
    <div class="bg-gray-50 relative" id="shows-content">
      <div class="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <!-- Search and Filters Section -->
        <div class="mb-12">
          <div
            class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto"
          >
            <!-- Search Programs -->
            <div class="relative">
              <Search
                class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
              <input
                v-model="searchQuery"
                @input="debounceSearch"
                type="text"
                placeholder="SEARCH PROGRAMS..."
                class="w-full pl-12 pr-4 py-4 bg-white border-4 border-black text-black placeholder-gray-500 focus:outline-none focus:border-red-600 font-bold uppercase tracking-wider"
              />
            </div>

            <!-- Date Filter -->
            <div class="relative">
              <Calendar
                class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
              <input
                v-model="selectedDate"
                @change="filterByDate"
                type="date"
                class="w-full pl-12 pr-4 py-4 bg-white border-4 border-black text-black focus:outline-none focus:border-red-600 font-bold"
              />
            </div>

            <!-- Program Filter -->
            <div class="relative">
              <select
                v-model="selectedProgram"
                @change="filterByProgram"
                class="w-full px-4 py-4 bg-white border-4 border-black text-black focus:outline-none focus:border-red-600 font-bold uppercase tracking-wider appearance-none"
              >
                <option value="">ALL PROGRAMS</option>
                <option
                  v-for="program in uniquePrograms"
                  :key="program.id"
                  :value="program.id"
                >
                  {{ program.title.toUpperCase() }}
                </option>
              </select>
              <ChevronDown
                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none"
              />
            </div>
          </div>

          <!-- Quick Filters -->
          <div class="flex flex-wrap justify-center gap-3 mb-8">
            <button
              @click="setQuickFilter('today')"
              :class="
                quickFilter === 'today'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-black border-black hover:bg-black hover:text-white'
              "
              class="px-6 py-3 font-black transition-all border-4 uppercase tracking-wider"
            >
              TODAY'S SHOWS
            </button>
            <button
              @click="setQuickFilter('yesterday')"
              :class="
                quickFilter === 'yesterday'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-black border-black hover:bg-black hover:text-white'
              "
              class="px-6 py-3 font-black transition-all border-4 uppercase tracking-wider"
            >
              YESTERDAY
            </button>
            <button
              @click="setQuickFilter('week')"
              :class="
                quickFilter === 'week'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-black border-black hover:bg-black hover:text-white'
              "
              class="px-6 py-3 font-black transition-all border-4 uppercase tracking-wider"
            >
              THIS WEEK
            </button>
            <button
              @click="clearFilters"
              class="px-6 py-3 bg-white border-4 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-black transition-all uppercase tracking-wider flex items-center gap-2"
            >
              <X class="w-4 h-4" />
              CLEAR
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div
          v-if="isLoadingShows"
          class="flex justify-center items-center py-20"
        >
          <div
            class="w-12 h-12 border-4 border-gray-300 border-t-red-600 animate-spin"
          ></div>
        </div>

        <!-- Shows Content -->
        <div v-else-if="filteredShows.length > 0">
          <!-- Results Info -->
          <div class="flex items-center justify-between mb-8">
            <div class="text-black font-black uppercase tracking-wider">
              {{ getResultsText() }} - {{ filteredShows.length }} EPISODES
            </div>
            <div class="text-black font-black uppercase tracking-wider">
              PAGE {{ sessionRecordings?.current_page || 1 }} / {{ totalPages }}
            </div>
          </div>

          <!-- Featured Shows -->
          <div v-if="featuredShows.length > 0" class="mb-12">
            <div class="flex items-center gap-4 mb-8">
              <div
                class="w-12 h-12 bg-red-600 flex items-center justify-center"
              >
                <Radio class="w-6 h-6 text-white" />
              </div>
              <h2
                class="text-3xl font-black text-black uppercase tracking-wider"
              >
                FEATURED SHOWS
              </h2>
              <div class="flex-1 h-1 bg-red-600"></div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div
                v-for="show in featuredShows.slice(0, 2)"
                :key="show.id"
                class="bg-white border-4 border-black overflow-hidden transition-all hover:border-red-600 group cursor-pointer transform hover:scale-105"
              >
                <div class="relative h-48 overflow-hidden">
                  <img
                    :src="
                      show.program?.image_url ||
                      getDefaultShowImage(show.program?.title)
                    "
                    :alt="show.program?.title"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 filter grayscale group-hover:grayscale-0"
                  />

                  <!-- Play Button Overlay -->
                  <div
                    class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <button
                      @click="playShow(show)"
                      class="w-16 h-16 bg-red-600 border-4 border-red-600 flex items-center justify-center text-white hover:scale-110 transition-transform"
                    >
                      <Pause
                        v-if="
                          currentlyPlaying?.id === show.id && isAudioPlaying
                        "
                        class="w-8 h-8"
                      />
                      <Play v-else class="w-8 h-8 ml-1" />
                    </button>
                  </div>

                  <!-- Status Badge -->
                  <div class="absolute top-4 right-4">
                    <span
                      v-if="show.recording_status === 'completed'"
                      class="bg-red-600 text-white px-3 py-1 text-xs font-black tracking-wider uppercase"
                    >
                      AVAILABLE
                    </span>
                    <span
                      v-else
                      class="bg-black text-white px-3 py-1 text-xs font-black tracking-wider uppercase"
                    >
                      {{ show.recording_status.toUpperCase() }}
                    </span>
                  </div>

                  <!-- Duration Badge -->
                  <div class="absolute bottom-4 left-4">
                    <span
                      class="bg-white text-black px-3 py-1 text-xs font-black tracking-wider uppercase border-2 border-black"
                    >
                      {{ show.duration_minutes }}MIN
                    </span>
                  </div>
                </div>

                <div class="p-6">
                  <div class="flex items-center gap-2 mb-3">
                    <span
                      class="bg-red-600 text-white px-3 py-1 text-xs font-black tracking-wider uppercase"
                    >
                      {{ show.program?.title || "RADIO SHOW" }}
                    </span>
                    <span
                      class="text-gray-600 text-xs font-bold flex items-center gap-1 uppercase"
                    >
                      <Calendar class="w-3 h-3" />
                      {{ formatShowDate(show.session_date) }}
                    </span>
                  </div>

                  <h3
                    class="text-xl font-black text-black mb-3 group-hover:text-red-600 transition-colors line-clamp-2 uppercase tracking-wide"
                  >
                    {{ show.program?.title }} -
                    {{ formatShowDate(show.session_date) }}
                  </h3>

                  <p class="text-gray-600 mb-4 line-clamp-2 text-sm">
                    {{
                      show.program?.description ||
                      show.session_notes ||
                      "Listen to this recorded radio session."
                    }}
                  </p>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <div class="flex -space-x-1">
                        <div
                          v-for="host in show.hosts?.slice(0, 3)"
                          :key="host.id"
                          class="w-8 h-8 border-2 border-black bg-red-600 flex items-center justify-center overflow-hidden"
                        >
                          <img
                            v-if="host.image_url"
                            :src="host.image_url"
                            :alt="host.name"
                            class="w-full h-full object-cover"
                          />
                          <span v-else class="text-xs font-black text-white">{{
                            host.name.charAt(0)
                          }}</span>
                        </div>
                      </div>
                      <span class="text-sm font-black text-black uppercase">{{
                        getHostsText(show.hosts)
                      }}</span>
                    </div>

                    <div
                      class="flex items-center space-x-4 text-sm text-gray-600 font-bold"
                    >
                      <div class="flex items-center space-x-1">
                        <HardDrive class="w-4 h-4" />
                        <span>{{ show.file_size_mb }}MB</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- All Shows List -->
          <div class="space-y-4 mb-8">
            <div class="flex items-center gap-4 mb-8">
              <div class="w-12 h-12 bg-black flex items-center justify-center">
                <Radio class="w-6 h-6 text-white" />
              </div>
              <h2
                class="text-3xl font-black text-black uppercase tracking-wider"
              >
                ALL EPISODES
              </h2>
              <div class="flex-1 h-1 bg-black"></div>
            </div>

            <div
              v-for="show in paginatedShows"
              :key="show.id"
              class="bg-white border-2 border-black p-6 transition-all hover:border-red-600 group cursor-pointer transform hover:scale-105"
            >
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div
                    class="w-24 h-24 border-2 border-black overflow-hidden relative group/play"
                  >
                    <img
                      :src="
                        show.program?.image_url ||
                        getDefaultShowImage(show.program?.title)
                      "
                      :alt="show.program?.title"
                      class="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                    <!-- Play overlay -->
                    <div
                      class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <button
                        @click="playShow(show)"
                        class="w-12 h-12 bg-red-600 flex items-center justify-center text-white hover:scale-110 transition-transform"
                      >
                        <Pause
                          v-if="
                            currentlyPlaying?.id === show.id && isAudioPlaying
                          "
                          class="w-5 h-5"
                        />
                        <Play v-else class="w-5 h-5 ml-0.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3 mb-2">
                    <span
                      class="bg-red-600 text-white px-3 py-1 text-xs font-black tracking-wider uppercase"
                    >
                      {{ show.program?.title || "RADIO SHOW" }}
                    </span>

                    <span
                      class="text-xs text-gray-600 font-bold flex items-center gap-1 uppercase"
                    >
                      <Calendar class="w-3 h-3" />
                      {{ formatShowDate(show.session_date) }}
                    </span>

                    <span
                      class="text-xs text-gray-600 font-bold flex items-center gap-1 uppercase"
                    >
                      <Clock class="w-3 h-3" />
                      {{ formatTime(show.actual_start_time) }} -
                      {{ formatTime(show.actual_end_time) }}
                    </span>

                    <span
                      class="text-xs text-gray-600 font-bold flex items-center gap-1 uppercase"
                    >
                      <Timer class="w-3 h-3" />
                      {{ show.duration_minutes }}MIN
                    </span>

                    <span
                      v-if="show.recording_status === 'completed'"
                      class="text-xs px-2 py-1 bg-red-600 text-white font-black uppercase tracking-wider"
                    >
                      AVAILABLE
                    </span>
                    <span
                      v-else
                      class="text-xs px-2 py-1 bg-black text-white font-black uppercase tracking-wider"
                    >
                      {{ show.recording_status.toUpperCase() }}
                    </span>
                  </div>

                  <h3
                    class="text-lg font-black text-black mb-2 group-hover:text-red-600 transition-colors line-clamp-2 uppercase tracking-wide"
                  >
                    {{ show.program?.title }} -
                    {{ formatShowDate(show.session_date) }}
                  </h3>

                  <p class="text-gray-600 text-sm mb-4 line-clamp-2">
                    {{
                      show.program?.description ||
                      show.session_notes ||
                      "Listen to this recorded radio session."
                    }}
                  </p>

                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                      <div class="flex -space-x-1">
                        <div
                          v-for="host in show.hosts?.slice(0, 3)"
                          :key="host.id"
                          class="w-6 h-6 border border-black bg-red-600 flex items-center justify-center overflow-hidden"
                        >
                          <img
                            v-if="host.image_url"
                            :src="host.image_url"
                            :alt="host.name"
                            class="w-full h-full object-cover"
                          />
                          <span v-else class="text-xs font-black text-white">{{
                            host.name.charAt(0)
                          }}</span>
                        </div>
                      </div>
                      <span class="text-sm font-black text-black uppercase">{{
                        getHostsText(show.hosts)
                      }}</span>
                    </div>

                    <div
                      class="flex items-center space-x-4 text-sm text-gray-600 font-bold"
                    >
                      <div class="flex items-center space-x-1">
                        <HardDrive class="w-4 h-4" />
                        <span>{{ show.file_size_mb }}MB</span>
                      </div>
                      <button
                        @click="downloadShow(show)"
                        class="flex items-center space-x-1 hover:text-red-600 transition-colors font-black uppercase"
                      >
                        <Download class="w-4 h-4" />
                        <span>DOWNLOAD</span>
                      </button>
                      <button
                        @click="shareShow(show)"
                        class="flex items-center space-x-1 hover:text-red-600 transition-colors font-black uppercase"
                      >
                        <Share2 class="w-4 h-4" />
                        <span>SHARE</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Audio Progress Bar (when playing) -->
              <div
                v-if="currentlyPlaying?.id === show.id"
                class="mt-4 pt-4 border-t-4 border-black"
              >
                <div class="flex items-center space-x-4">
                  <button
                    @click="playShow(show)"
                    class="w-12 h-12 bg-red-600 border-2 border-black flex items-center justify-center text-white hover:bg-red-700 transition-colors"
                  >
                    <Pause v-if="isAudioPlaying" class="w-5 h-5" />
                    <Play v-else class="w-5 h-5 ml-0.5" />
                  </button>

                  <div class="flex-1">
                    <div
                      class="flex items-center justify-between text-xs text-black font-black mb-1 uppercase"
                    >
                      <span>{{ formatAudioTime(currentTime) }}</span>
                      <span>{{ formatAudioTime(duration) }}</span>
                    </div>
                    <div class="w-full bg-gray-200 border-2 border-black h-4">
                      <div
                        class="bg-red-600 h-full transition-all duration-300"
                        :style="{ width: audioProgress + '%' }"
                      ></div>
                    </div>
                  </div>

                  <div class="flex items-center space-x-2">
                    <Volume2 class="w-5 h-5 text-black" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      :value="volume"
                      @input="setVolume($event.target.value)"
                      class="w-20 h-4 bg-gray-200 border-2 border-black appearance-none slider"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div
            v-if="totalPages > 1"
            class="flex justify-center items-center gap-2 mt-12"
          >
            <button
              @click="changePage(sessionRecordings?.current_page - 1)"
              :disabled="!sessionRecordings?.has_prev"
              class="px-6 py-3 bg-white border-4 border-black text-black font-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-all uppercase tracking-wider"
            >
              PREVIOUS
            </button>

            <div class="flex items-center gap-1">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="changePage(page)"
                class="w-12 h-12 transition-all font-black border-4"
                :class="
                  page === (sessionRecordings?.current_page || 1)
                    ? 'bg-red-600 text-white border-red-600'
                    : 'bg-white border-black text-black hover:bg-black hover:text-white'
                "
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="changePage(sessionRecordings?.current_page + 1)"
              :disabled="!sessionRecordings?.has_next"
              class="px-6 py-3 bg-white border-4 border-black text-black font-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-all uppercase tracking-wider"
            >
              NEXT
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div
            class="w-20 h-20 bg-gray-200 border-4 border-black flex items-center justify-center mx-auto mb-6"
          >
            <Radio class="w-10 h-10 text-gray-400" />
          </div>
          <h3
            class="text-2xl font-black text-black mb-4 uppercase tracking-wider"
          >
            NO SHOWS FOUND
          </h3>
          <p class="text-gray-600 mb-6 font-bold">
            {{ getEmptyStateText().toUpperCase() }}
          </p>
          <button
            @click="clearFilters"
            class="px-8 py-4 bg-red-600 text-white font-black hover:bg-red-700 transition-all border-4 border-red-600 uppercase tracking-wider"
          >
            SHOW ALL EPISODES
          </button>
        </div>
      </div>
    </div>

    <!-- Hidden Audio Element -->
    <audio
      ref="audioPlayer"
      @timeupdate="updateProgress"
      @loadedmetadata="setDuration"
      @ended="onAudioEnded"
      class="hidden"
    >
      <source :src="currentlyPlaying?.recording_file_url" type="audio/mpeg" />
    </audio>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import {
  Search,
  Calendar,
  ChevronDown,
  X,
  Play,
  Volume2,
  Radio,
  Clock,
  Timer,
  Download,
  Share2,
  Pause,
  HardDrive,
} from "lucide-vue-next";

const store = useStore();
const station = computed(() => store.getters.station);
const sessionRecordings = computed(() => store.getters.sessionRecordings || {});
const isPlaying = computed(() => store.getters.isPlaying);
const isLoadingShows = ref(false);
const isLoading = ref(false);

// Audio player refs and state
const audioPlayer = ref(null);
const currentlyPlaying = ref(null);
const isAudioPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(70);

// Search and filter states
const searchQuery = ref("");
const selectedDate = ref("");
const selectedProgram = ref("");
const quickFilter = ref("");
const searchTimeout = ref(null);

// Computed properties
const recordingsData = computed(() => sessionRecordings.value?.data || []);

const uniquePrograms = computed(() => {
  const programs = new Map();
  recordingsData.value.forEach((recording) => {
    if (recording.program && !programs.has(recording.program.id)) {
      programs.set(recording.program.id, recording.program);
    }
  });
  return Array.from(programs.values());
});

const totalDuration = computed(() => {
  const total = recordingsData.value.reduce(
    (sum, recording) => sum + (recording.duration_minutes || 0),
    0
  );
  return Math.round(total / 60) + "H";
});

const todayEpisodes = computed(() => {
  const today = new Date().toISOString().split("T")[0];
  return recordingsData.value.filter(
    (recording) => recording.session_date?.split("T")[0] === today
  ).length;
});

const filteredShows = computed(() => {
  let shows = [...recordingsData.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    shows = shows.filter(
      (show) =>
        show.program?.title?.toLowerCase().includes(query) ||
        show.program?.description?.toLowerCase().includes(query) ||
        show.session_notes?.toLowerCase().includes(query)
    );
  }

  // Apply date filter
  if (selectedDate.value) {
    shows = shows.filter(
      (show) => show.session_date?.split("T")[0] === selectedDate.value
    );
  }

  // Apply program filter
  if (selectedProgram.value) {
    shows = shows.filter((show) => show.program?.id === selectedProgram.value);
  }

  // Apply quick filters
  if (quickFilter.value) {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];
    const weekAgo = new Date(Date.now() - 7 * 86400000)
      .toISOString()
      .split("T")[0];

    switch (quickFilter.value) {
      case "today":
        shows = shows.filter(
          (show) => show.session_date?.split("T")[0] === today
        );
        break;
      case "yesterday":
        shows = shows.filter(
          (show) => show.session_date?.split("T")[0] === yesterday
        );
        break;
      case "week":
        shows = shows.filter(
          (show) => show.session_date?.split("T")[0] >= weekAgo
        );
        break;
    }
  }

  return shows.sort(
    (a, b) => new Date(b.session_date) - new Date(a.session_date)
  );
});

const featuredShows = computed(() => {
  return filteredShows.value
    .filter((show) => show.is_featured || show.recording_status === "completed")
    .slice(0, 4);
});

const totalPages = computed(() => {
  return sessionRecordings.value?.total_pages || 1;
});

const paginatedShows = computed(() => {
  return filteredShows.value;
});

const visiblePages = computed(() => {
  const pages = [];
  const current = sessionRecordings.value?.current_page || 1;
  const total = totalPages.value;

  const start = Math.max(1, current - 2);
  const end = Math.min(total, current + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const audioProgress = computed(() => {
  if (duration.value === 0) return 0;
  return (currentTime.value / duration.value) * 100;
});

// Helper functions
const formatShowDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "TODAY";
  if (diffInDays === 1) return "YESTERDAY";
  if (diffInDays < 7) return `${diffInDays} DAYS AGO`;

  return date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })
    .toUpperCase();
};

const formatTime = (timeString) => {
  if (!timeString) return "";
  const date = new Date(timeString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatAudioTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

const getHostsText = (hosts) => {
  if (!hosts || hosts.length === 0) return "UNKNOWN HOST";
  if (hosts.length === 1) return hosts[0].name.toUpperCase();
  if (hosts.length === 2)
    return `${hosts[0].name.toUpperCase()} & ${hosts[1].name.toUpperCase()}`;
  return `${hosts[0].name.toUpperCase()} & ${hosts.length - 1} OTHERS`;
};

const getDefaultShowImage = (programTitle) => {
  const images = [
    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  ];
  const hash = programTitle ? programTitle.length % images.length : 0;
  return images[hash];
};

// Methods
const togglePlayPause = async () => {
  isLoading.value = true;
  try {
    await store.dispatch("togglePlayPause");
  } catch (err) {
    console.error("Failed to toggle playback:", err);
  } finally {
    isLoading.value = false;
  }
};

const playShow = (show) => {
  if (!show.recording_file_url) {
    console.error("No audio file available for this show");
    return;
  }

  if (currentlyPlaying.value?.id === show.id) {
    // Toggle play/pause for current show
    if (isAudioPlaying.value) {
      audioPlayer.value.pause();
      isAudioPlaying.value = false;
    } else {
      audioPlayer.value.play();
      isAudioPlaying.value = true;
    }
  } else {
    // Play new show
    currentlyPlaying.value = show;
    isAudioPlaying.value = true;
  }
};

const downloadShow = (show) => {
  if (show.recording_file_url) {
    const link = document.createElement("a");
    link.href = show.recording_file_url;
    link.download = `${show.program?.title || "Radio Show"} - ${formatShowDate(
      show.session_date
    )}.mp3`;
    link.click();
  }
};

const shareShow = (show) => {
  if (navigator.share) {
    navigator.share({
      title: `${show.program?.title || "Radio Show"} - ${formatShowDate(
        show.session_date
      )}`,
      text: show.program?.description || "Listen to this radio show recording",
      url: show.recording_file_url,
    });
  } else {
    navigator.clipboard.writeText(show.recording_file_url);
    console.log("Show URL copied to clipboard");
  }
};

const debounceSearch = () => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }

  searchTimeout.value = setTimeout(() => {
    // Filter will automatically update due to reactive searchQuery
  }, 500);
};

const setQuickFilter = (filter) => {
  quickFilter.value = filter === quickFilter.value ? "" : filter;
};

const filterByDate = () => {
  // Filter will automatically update due to reactive selectedDate
};

const filterByProgram = () => {
  // Filter will automatically update due to reactive selectedProgram
};

const clearFilters = () => {
  searchQuery.value = "";
  selectedDate.value = "";
  selectedProgram.value = "";
  quickFilter.value = "";
};

const changePage = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    await loadSessionRecordings(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

const scrollToShows = () => {
  document.getElementById("shows-content").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const getResultsText = () => {
  if (searchQuery.value) return `SEARCH: "${searchQuery.value.toUpperCase()}"`;
  if (selectedDate.value)
    return `SHOWS FROM ${formatShowDate(selectedDate.value)}`;
  if (selectedProgram.value) {
    const program = uniquePrograms.value.find(
      (p) => p.id === selectedProgram.value
    );
    return `${program?.title.toUpperCase() || "SELECTED PROGRAM"} EPISODES`;
  }
  if (quickFilter.value) {
    switch (quickFilter.value) {
      case "today":
        return "TODAY'S SHOWS";
      case "yesterday":
        return "YESTERDAY'S SHOWS";
      case "week":
        return "THIS WEEK'S SHOWS";
    }
  }
  return "ALL RADIO SHOWS";
};

const getEmptyStateText = () => {
  if (searchQuery.value)
    return `No shows found matching "${searchQuery.value}"`;
  if (selectedDate.value)
    return `No shows available for ${formatShowDate(selectedDate.value)}`;
  if (selectedProgram.value) return "No episodes found for this program";
  return "No radio shows available at the moment";
};

// Audio player methods
const updateProgress = () => {
  if (audioPlayer.value) {
    currentTime.value = audioPlayer.value.currentTime;
  }
};

const setDuration = () => {
  if (audioPlayer.value) {
    duration.value = audioPlayer.value.duration;
  }
};

const setVolume = (value) => {
  volume.value = value;
  if (audioPlayer.value) {
    audioPlayer.value.volume = value / 100;
  }
};

const onAudioEnded = () => {
  isAudioPlaying.value = false;
  currentTime.value = 0;
};

const loadSessionRecordings = async (page = 1) => {
  isLoadingShows.value = true;
  try {
    await store.dispatch("fetch_session_recordings", {
      data: {
        station_id: station.value?.id,
        page: page,
      },
    });
  } catch (error) {
    console.error("Failed to load session recordings:", error);
  } finally {
    isLoadingShows.value = false;
  }
};

onMounted(async () => {
  await loadSessionRecordings();
});

// Watch for currentlyPlaying changes to update audio source
watch(currentlyPlaying, (newShow) => {
  if (newShow && audioPlayer.value) {
    audioPlayer.value.load();
    if (isAudioPlaying.value) {
      audioPlayer.value.play();
    }
  }
});

// Set initial volume
watch(audioPlayer, (player) => {
  if (player) {
    player.volume = volume.value / 100;
  }
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Override rounded corners for brutalist design */
* {
  border-radius: 0 !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom slider styles */
.slider {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.slider::-webkit-slider-track {
  background: #e5e7eb;
  height: 16px;
  border: 2px solid #000;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: #dc2626;
  height: 20px;
  width: 20px;
  border: 2px solid #000;
  cursor: pointer;
}

.slider::-moz-slider-track {
  background: #e5e7eb;
  height: 16px;
  border: 2px solid #000;
}

.slider::-moz-slider-thumb {
  background: #dc2626;
  height: 20px;
  width: 20px;
  border: 2px solid #000;
  cursor: pointer;
}

/* Loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Ensure sharp geometric shapes */
button,
div,
input,
select {
  border-radius: 0 !important;
}
</style>
