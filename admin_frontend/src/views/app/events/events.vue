<template>
  <div class="">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Events Management</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Manage all events and their settings</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <PlusIcon class="w-5 h-5 mr-2" />
          Create Event
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <input
            v-model="filters.search"
            @input="debouncedSearch"
            type="text"
            placeholder="Search events..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <select
            v-model="filters.category"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Categories</option>
            <option value="concert">Concert</option>
            <option value="interview">Interview</option>
            <option value="show">Show</option>
            <option value="community">Community</option>
          </select>
        </div>
        <div>
          <select
            v-model="filters.status_filter"
            @change="applyFilters"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div class="flex gap-2">
          <button
            @click="resetFilters"
            class="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <RotateCcwIcon class="w-5 h-5" />
          </button>
          <button
            @click="fetchEvents"
            class="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <RefreshCwIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Events Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Event</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type & Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-600">
            <tr v-if="loading" v-for="n in 5" :key="n" class="animate-pulse">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg"></div>
                  <div class="ml-4">
                    <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-32 mb-2"></div>
                    <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-24"></div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-2"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
              </td>
              <td class="px-6 py-4">
                <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20 mb-2"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
              </td>
              <td class="px-6 py-4">
                <div class="h-6 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <div class="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  <div class="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  <div class="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded"></div>
                </div>
              </td>
            </tr>
            
            <tr v-else-if="events?.data?.length" v-for="event in events.data" :key="event.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="relative">
                    <img
                      v-if="event.featured_image_url"
                      :src="event.featured_image_url"
                      :alt="event.title"
                      class="w-16 h-16 rounded-lg object-cover shadow-sm"
                    />
                    <div v-else class="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                      <CalendarIcon class="w-8 h-8 text-white" />
                    </div>
                    <div v-if="event.is_featured" class="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                      <StarIcon class="w-3 h-3 text-yellow-800" />
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{{ event.title }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      <MapPinIcon class="w-3 h-3 inline mr-1" />
                      {{ event.is_virtual ? 'Virtual Event' : (event.venue_name || 'No venue') }}
                    </div>
                    <div v-if="event.category" class="text-xs text-purple-600 dark:text-purple-400 mt-1">
                      {{ event.category }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white">{{ formatDate(event.start_date) }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  <ClockIcon class="w-3 h-3 inline mr-1" />
                  {{ event.start_time }} - {{ event.end_time }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col gap-1">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    event.event_type === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    event.event_type === 'free' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  ]">
                    {{ event.event_type || 'General' }}
                  </span>
                  <div v-if="event.event_type === 'paid' && event.ticket_price" class="text-xs text-gray-600 dark:text-gray-400">
                    <DollarSignIcon class="w-3 h-3 inline mr-1" />
                    {{ event.currency || 'UGX' }} {{ event.ticket_price }}
                  </div>
                  <div v-if="event.event_type === 'paid' && event.website_url" class="mt-1">
                    <a 
                      :href="event.website_url" 
                      target="_blank"
                      class="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 rounded transition-colors"
                    >
                      <ExternalLinkIcon class="w-3 h-3 mr-1" />
                      Buy Tickets
                    </a>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col gap-1">
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    event.status ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  ]">
                    {{ event.status ? 'Active' : 'Inactive' }}
                  </span>
                  <span :class="[
                    'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                    event.is_published ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  ]">
                    {{ event.is_published ? 'Published' : 'Draft' }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button
                    @click="editEvent(event)"
                    class="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    title="Edit"
                  >
                    <EditIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="toggleEventStatus(event)"
                    :class="[
                      'p-2',
                      event.status ? 'text-gray-400 hover:text-red-600 dark:hover:text-red-400' : 'text-gray-400 hover:text-green-600 dark:hover:text-green-400'
                    ]"
                    :title="event.status ? 'Deactivate' : 'Activate'"
                  >
                    <ToggleLeftIcon v-if="event.status" class="w-4 h-4" />
                    <ToggleRightIcon v-else class="w-4 h-4" />
                  </button>
                  <button
                    @click="toggleFeatured(event)"
                    :class="[
                      'p-2',
                      event.is_featured ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-500'
                    ]"
                    title="Toggle Featured"
                  >
                    <StarIcon class="w-4 h-4" :class="{ 'fill-current': event.is_featured }" />
                  </button>
                  <button
                    @click="togglePublished(event)"
                    :class="[
                      'p-2',
                      event.is_published ? 'text-green-500 hover:text-green-600' : 'text-gray-400 hover:text-green-500'
                    ]"
                    title="Toggle Published"
                  >
                    <EyeIcon v-if="event.is_published" class="w-4 h-4" />
                    <EyeOffIcon v-else class="w-4 h-4" />
                  </button>
                  <button
                    @click="duplicateEvent(event)"
                    class="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                    title="Duplicate"
                  >
                    <CopyIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="deleteEvent(event)"
                    class="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    title="Delete"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
            
            <tr v-else>
              <td colspan="5" class="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                <CalendarIcon class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p class="text-lg font-medium">No events found</p>
                <p class="mt-2">Create your first event to get started</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="events?.pagination" class="px-6 py-3 bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Showing {{ events.pagination.from }} to {{ events.pagination.to }} of {{ events.pagination.total }} results
        </div>
        <div class="flex gap-2">
          <button
            @click="changePage(events.pagination.current_page - 1)"
            :disabled="events.pagination.current_page <= 1"
            class="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            Previous
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-1 text-sm border rounded',
              page === events.pagination.current_page
                ? 'bg-purple-600 text-white border-purple-600'
                : 'hover:bg-gray-100 dark:hover:bg-gray-600'
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="changePage(events.pagination.current_page + 1)"
            :disabled="events.pagination.current_page >= events.pagination.last_page"
            class="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">
              {{ showEditModal ? 'Edit Event' : 'Create New Event' }}
            </h2>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
              <XIcon class="w-6 h-6" />
            </button>
          </div>

          <form @submit.prevent="submitEvent" class="space-y-6">
            <!-- Featured Image Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Featured Image</label>
              <div class="flex items-center gap-4">
                <div v-if="imagePreview || eventForm.featured_image_url" class="relative">
                  <img 
                    :src="imagePreview || eventForm.featured_image_url" 
                    alt="Preview" 
                    class="w-32 h-32 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                  />
                  <button 
                    @click="removeImage" 
                    type="button" 
                    class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <XIcon class="w-4 h-4" />
                  </button>
                </div>
                <div v-else class="w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
                  <ImageIcon class="w-12 h-12 text-gray-400" />
                </div>
                <div class="flex-1">
                  <input
                    ref="imageInput"
                    @change="handleImageChange"
                    type="file"
                    accept="image/*"
                    class="hidden"
                  />
                  <button
                    @click="$refs.imageInput.click()"
                    type="button"
                    class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Choose Image
                  </button>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                <input
                  v-model="eventForm.title"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Event title"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  v-model="eventForm.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Event description"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date *</label>
                <input
                  v-model="eventForm.start_date"
                  type="date"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time *</label>
                <input
                  v-model="eventForm.start_time"
                  type="time"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                <input
                  v-model="eventForm.end_date"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                <input
                  v-model="eventForm.end_time"
                  type="time"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select
                  v-model="eventForm.category"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select category</option>
                  <option value="concert">Concert</option>
                  <option value="interview">Interview</option>
                  <option value="show">Show</option>
                  <option value="community">Community</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Type</label>
                <select
                  v-model="eventForm.event_type"
                  @change="handleEventTypeChange"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select type</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="paid">Paid</option>
                  <option value="free">Free</option>
                </select>
              </div>

              <!-- Price fields for paid events -->
              <div v-if="eventForm.event_type === 'paid'" class="md:col-span-2">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ticket Price *</label>
                    <input
                      v-model="eventForm.ticket_price"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Currency</label>
                    <select
                      v-model="eventForm.currency"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="UGX">UGX</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ticket Link *</label>
                    <input
                      v-model="eventForm.website_url"
                      type="url"
                      required
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Venue Name</label>
                <input
                  v-model="eventForm.venue_name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Venue name"
                />
              </div>

              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Venue Address</label>
                <input
                  v-model="eventForm.venue_address"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Full address"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                <input
                  v-model="eventForm.city"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="City"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                <input
                  v-model="eventForm.country"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Country"
                />
              </div>
            </div>

            <div class="flex items-center gap-4 pt-4">
              <label class="flex items-center">
                <input
                  v-model="eventForm.is_featured"
                  type="checkbox"
                  class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Featured Event</span>
              </label>

              <label class="flex items-center">
                <input
                  v-model="eventForm.is_published"
                  type="checkbox"
                  class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Publish Immediately</span>
              </label>

              <label class="flex items-center">
                <input
                  v-model="eventForm.is_virtual"
                  type="checkbox"
                  class="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Virtual Event</span>
              </label>
            </div>

            <div v-if="eventForm.is_virtual">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Virtual Link</label>
              <input
                v-model="eventForm.virtual_link"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                placeholder="https://..."
              />
            </div>

            <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-600">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center"
              >
                <LoaderIcon v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
                {{ showEditModal ? 'Update Event' : 'Create Event' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import {
  PlusIcon, CalendarIcon, EditIcon, TrashIcon, StarIcon, EyeIcon, EyeOffIcon,
  CopyIcon, ToggleLeftIcon, ToggleRightIcon, RefreshCwIcon, RotateCcwIcon,
  XIcon, LoaderIcon, ImageIcon, MapPinIcon, ClockIcon, DollarSignIcon, ExternalLinkIcon
} from 'lucide-vue-next'

const store = useStore()

// Computed
const events = computed(() => store.getters.events)
const loading = computed(() => store.getters.loading === 'fetch_events' || store.getters.loading === 'create_event' || store.getters.loading === 'update_event')
const error = computed(() => store.getters.error)

// Reactive state
const currentPage = ref(1)
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingEvent = ref(null)
const imagePreview = ref(null)
const selectedImage = ref(null)

const filters = reactive({
  search: '',
  category: '',
  status_filter: ''
})

const eventForm = reactive({
  title: '',
  description: '',
  start_date: '',
  end_date: '',
  start_time: '',
  end_time: '',
  venue_name: '',
  venue_address: '',
  city: '',
  country: '',
  category: '',
  event_type: '',
  ticket_price: '',
  currency: 'UGX',
  website_url: '',
  is_featured: false,
  is_published: false,
  is_virtual: false,
  virtual_link: '',
  featured_image_url: ''
})

// Computed pagination
const visiblePages = computed(() => {
  if (!events.value?.pagination) return []
  const current = events.value.pagination.current_page
  const last = events.value.pagination.last_page
  const pages = []
  const maxVisible = 5
  
  let start = Math.max(1, current - Math.floor(maxVisible / 2))
  let end = Math.min(last, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Debounced search
let searchTimeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchEvents()
  }, 500)
}

// Image handling methods
const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB')
      return
    }
    
    selectedImage.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  imagePreview.value = null
  selectedImage.value = null
  eventForm.featured_image_url = ''
  if (document.querySelector('input[type="file"]')) {
    document.querySelector('input[type="file"]').value = ''
  }
}

const handleEventTypeChange = () => {
  if (eventForm.event_type !== 'paid') {
    eventForm.ticket_price = ''
    eventForm.website_url = ''
  }
}

// Methods
const fetchEvents = async () => {
  let data = {
    search: filters.search,
    category: filters.category,
    status_filter: filters.status_filter
  }
  let page = currentPage.value
  try {
    await store.dispatch('fetch_events', {data, page});
  } catch (error) {
    console.error('Failed to fetch events:', error);
    store.dispatch('template_play_error_file', 'Failed to load events');
  }
}

const changePage = (page) => {
  if (page >= 1 && page <= events.value.pagination.last_page) {
    currentPage.value = page
    fetchEvents()
  }
}

const applyFilters = () => {
  currentPage.value = 1
  fetchEvents()
}

const resetFilters = () => {
  filters.search = ''
  filters.category = ''
  filters.status_filter = ''
  currentPage.value = 1
  fetchEvents()
}

const resetForm = () => {
  Object.keys(eventForm).forEach(key => {
    if (typeof eventForm[key] === 'boolean') {
      eventForm[key] = false
    } else {
      eventForm[key] = key === 'currency' ? 'UGX' : ''
    }
  })
  imagePreview.value = null
  selectedImage.value = null
}

const editEvent = (event) => {
  editingEvent.value = event
  Object.keys(eventForm).forEach(key => {
    eventForm[key] = event[key] || (typeof eventForm[key] === 'boolean' ? false : (key === 'currency' ? 'UGX' : ''))
  })
  imagePreview.value = event.featured_image_url || null
  showEditModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingEvent.value = null
  resetForm()
}

const submitEvent = async () => {
  try {
    const formData = new FormData()
    
    // Add all form fields
    Object.keys(eventForm).forEach(key => {
      if (eventForm[key] !== null && eventForm[key] !== '') {
        formData.append(key, eventForm[key])
      }
    })
    
    // Add image if selected
    if (selectedImage.value) {
      formData.append('featured_image', selectedImage.value)
    }

    if (showEditModal.value) {
      await store.dispatch('update_event', {
        eventId: editingEvent.value.id,
        data: formData
      })
      await store.dispatch('template_play_success_file', 'Event updated successfully', { root: true })
    } else {
      await store.dispatch('create_event', formData)
      await store.dispatch('template_play_success_file', 'Event created successfully', { root: true })
    }
    
    closeModal()
    fetchEvents()
  } catch (error) {
    await store.dispatch('template_play_error_file', error.response?.data?.msg || 'Operation failed', { root: true })
  }
}

const toggleEventStatus = async (event) => {
  try {
    await store.dispatch('toggle_event_status', {
      data: {},
      id: event.id
    })
    const statusText = event.status ? 'deactivated' : 'activated'
    await store.dispatch('template_play_success_file', `Event ${statusText} successfully`, { root: true })
    fetchEvents()
  } catch (error) {
    await store.dispatch('template_play_error_file', error.response?.data?.msg || 'Failed to toggle status', { root: true })
  }
}

const toggleFeatured = async (event) => {
  try {
    await store.dispatch('toggle_event_featured', {
      data: {},
      id: event.id
    })
    const featuredText = event.is_featured ? 'unfeatured' : 'featured'
    await store.dispatch('template_play_success_file', `Event ${featuredText} successfully`, { root: true })
    fetchEvents()
  } catch (error) {
    await store.dispatch('template_play_error_file', error.response?.data?.msg || 'Failed to toggle featured status', { root: true })
  }
}

const togglePublished = async (event) => {
  try {
    if (event.is_published) {
      await store.dispatch('unpublish_event', {
        data: {},
        id: event.id
      })
      await store.dispatch('template_play_success_file', 'Event unpublished successfully', { root: true })
    } else {
      await store.dispatch('publish_event', {
        data: {},
        id: event.id
      })
      await store.dispatch('template_play_success_file', 'Event published successfully', { root: true })
    }
    fetchEvents()
  } catch (error) {
    await store.dispatch('template_play_error_file', error.response?.data?.msg || 'Failed to toggle publish status', { root: true })
  }
}

const duplicateEvent = async (event) => {
  if (confirm('Are you sure you want to duplicate this event?')) {
    try {
      await store.dispatch('duplicate_event', {
        data: {},
        id: event.id
      })
      await store.dispatch('template_play_success_file', 'Event duplicated successfully', { root: true })
      fetchEvents()
    } catch (error) {
      await store.dispatch('template_play_error_file', error.response?.data?.msg || 'Failed to duplicate event', { root: true })
    }
  }
}

const deleteEvent = async (event) => {
  if (confirm(`Are you sure you want to delete "${event.title}"? This action cannot be undone.`)) {
    try {
      await store.dispatch('delete_event', {
        data: {},
        id: event.id
      })
      await store.dispatch('template_play_delete_file', 'Event deleted successfully', { root: true })
      fetchEvents()
    } catch (error) {
      await store.dispatch('template_play_error_file', error.response?.data?.msg || 'Failed to delete event', { root: true })
    }
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'No date'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  fetchEvents()
})
</script>