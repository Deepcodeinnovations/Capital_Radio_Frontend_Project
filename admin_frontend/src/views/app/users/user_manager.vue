<template>
    <div class="min-h-screen">
      <!-- Header -->
      <div class="mx-auto mb-8">
        <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">Admin Users</h1>
            <p class="text-slate-600 dark:text-slate-300 mt-1">Manage admin users and their permissions</p>
          </div>
          
          <!-- Filters and Actions -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            <!-- Filters Row -->
            <div class="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/60 dark:border-slate-700/60">
              <!-- Search -->
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400 dark:text-purple-300" />
                <input 
                  v-model="filters.search" 
                  @input="debouncedSearch" 
                  type="text" 
                  placeholder="Search users..." 
                  class="pl-9 pr-3 py-2 w-48 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                />
              </div>
              
              <!-- Role Filter -->
              <div class="relative">
                <select 
                  v-model="filters.role" 
                  @change="fetchUsers" 
                  class="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm appearance-none cursor-pointer pr-8 text-slate-900 dark:text-white"
                >
                  <option value="">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="presenter">Presenter</option>
                </select>
                <ChevronDown class="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
              </div>
              
              <!-- Status Filter -->
              <div class="relative">
                <select 
                  v-model="filters.status" 
                  @change="fetchUsers" 
                  class="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm appearance-none cursor-pointer pr-8 text-slate-900 dark:text-white"
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
                <ChevronDown class="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-slate-400 pointer-events-none" />
              </div>
              
              <!-- Clear Filters -->
              <button 
                v-if="hasActiveFilters"
                @click="clearFilters" 
                class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                title="Clear filters"
              >
                <X class="h-4 w-4" />
              </button>
            </div>
            
            <!-- Add Admin Button -->
            <button 
              @click="openCreateModal" 
              class="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-xl hover:from-purple-700 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl text-sm font-medium transform hover:-translate-y-0.5"
            >
              <UserPlus class="h-4 w-4 mr-2" />
              Add Admin User
            </button>
          </div>
        </div>
      </div>
  
      <div class=" mx-auto space-y-8">
        <!-- Metrics Section -->
        <div v-if="metrics" class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/60 dark:border-slate-700/60">
          <h3 class="text-xl font-semibold text-slate-800 dark:text-white mb-6">User Statistics</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <!-- Total Users -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 rounded-xl p-6 border border-blue-200/50 dark:border-blue-700/50">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-blue-600 dark:text-blue-400">Total Users</p>
                  <p class="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">{{ metrics.total_users || 0 }}</p>
                </div>
                <div class="p-3 bg-blue-200/50 dark:bg-blue-800/50 rounded-xl">
                  <Users class="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
            
            <!-- Admins -->
            <div class="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/40 dark:to-red-800/40 rounded-xl p-6 border border-red-200/50 dark:border-red-700/50">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-red-600 dark:text-red-400">Admins</p>
                  <p class="text-3xl font-bold text-red-900 dark:text-red-100 mt-1">{{ metrics.users_by_role?.admin || 0 }}</p>
                </div>
                <div class="p-3 bg-red-200/50 dark:bg-red-800/50 rounded-xl">
                  <Shield class="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </div>
            
            <!-- Editors -->
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40 rounded-xl p-6 border border-purple-200/50 dark:border-purple-700/50">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-purple-600 dark:text-purple-400">Editors</p>
                  <p class="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-1">{{ metrics.users_by_role?.editor || 0 }}</p>
                </div>
                <div class="p-3 bg-purple-200/50 dark:bg-purple-800/50 rounded-xl">
                  <Edit class="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
            
            <!-- Presenters -->
            <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40 rounded-xl p-6 border border-green-200/50 dark:border-green-700/50">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-green-600 dark:text-green-400">Presenters</p>
                  <p class="text-3xl font-bold text-green-900 dark:text-green-100 mt-1">{{ metrics.users_by_role?.presenter || 0 }}</p>
                </div>
                <div class="p-3 bg-green-200/50 dark:bg-green-800/50 rounded-xl">
                  <Mic class="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
            
            <!-- Active Users -->
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/40 dark:to-orange-800/40 rounded-xl p-6 border border-orange-200/50 dark:border-orange-700/50">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-orange-600 dark:text-orange-400">Active Users</p>
                  <p class="text-3xl font-bold text-orange-900 dark:text-orange-100 mt-1">{{ metrics.active_users || 0 }}</p>
                </div>
                <div class="p-3 bg-orange-200/50 dark:bg-orange-800/50 rounded-xl">
                  <CheckCircle class="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Active Filters Display -->
          <div v-if="hasActiveFilters" class="flex items-center gap-3 mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
            <span class="text-sm text-slate-600 dark:text-slate-400 font-medium">Active filters:</span>
            <div class="flex items-center gap-3 flex-wrap">
              <span v-if="filters.search" class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-800 dark:text-blue-200 text-sm rounded-full border border-blue-200 dark:border-blue-700">
                Search: "{{ filters.search }}"
                <button @click="filters.search = ''; fetchUsers()" class="ml-2 hover:text-blue-900 dark:hover:text-blue-100">
                  <X class="h-3 w-3" />
                </button>
              </span>
              <span v-if="filters.role" class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 text-purple-800 dark:text-purple-200 text-sm rounded-full border border-purple-200 dark:border-purple-700">
                Role: {{ filters.role }}
                <button @click="filters.role = ''; fetchUsers()" class="ml-2 hover:text-purple-900 dark:hover:text-purple-100">
                  <X class="h-3 w-3" />
                </button>
              </span>
              <span v-if="filters.status" class="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 text-green-800 dark:text-green-200 text-sm rounded-full border border-green-200 dark:border-green-700">
                Status: {{ filters.status === 'true' ? 'Active' : 'Inactive' }}
                <button @click="filters.status = ''; fetchUsers()" class="ml-2 hover:text-green-900 dark:hover:text-green-100">
                  <X class="h-3 w-3" />
                </button>
              </span>
            </div>
          </div>
        </div>
  
        <!-- Users List -->
        <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 dark:border-slate-700/60 overflow-hidden">
          <div v-if="loading" class="flex items-center justify-center py-20">
            <div class="text-center">
              <Loader2 class="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
              <p class="text-slate-600 dark:text-slate-300">Loading users...</p>
            </div>
          </div>
  
          <div v-else-if="adminList.length === 0" class="text-center py-20">
            <Users class="h-16 w-16 text-slate-400 mx-auto mb-6" />
            <h3 class="text-xl font-medium text-slate-900 dark:text-white mb-2">No users found</h3>
            <p class="text-slate-500 dark:text-slate-400">Try adjusting your search criteria or add a new user</p>
          </div>
  
          <div v-else>
            <!-- Header Row -->
            <div class="px-8 py-5 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200/50 dark:border-slate-700/50">
              <div class="grid grid-cols-12 gap-6 text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                <div class="col-span-4">User</div>
                <div class="col-span-2">Role & Status</div>
                <div class="col-span-2">Contact</div>
                <div class="col-span-2">Last Activity</div>
                <div class="col-span-2 text-center">Actions</div>
              </div>
            </div>
  
            <!-- User Rows -->
            <div class="divide-y divide-slate-200/30 dark:divide-slate-700/30">
              <div 
                v-for="user in adminList" 
                :key="user.id" 
                class="px-8 py-6 hover:bg-white/60 dark:hover:bg-slate-700/50 transition-all duration-200 group"
              >
                <div class="grid grid-cols-12 gap-6 items-center">
                  <!-- User Info (4 columns) -->
                  <div class="col-span-4">
                    <div class="flex items-center space-x-4">
                      <div class="relative flex-shrink-0">
                        <img 
                          v-if="user.image_url" 
                          :src="user.image_url" 
                          :alt="user.name" 
                          class="h-12 w-12 rounded-2xl object-cover shadow-lg ring-2 ring-white dark:ring-slate-700"
                        />
                        <div 
                          v-else 
                          class="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center text-white font-semibold text-lg shadow-lg ring-2 ring-white dark:ring-slate-700"
                        >
                          {{ user.name?.charAt(0)?.toUpperCase() || 'U' }}
                        </div>
                        <div 
                          class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 shadow-sm" 
                          :class="user.status ? 'bg-green-500' : 'bg-red-500'"
                        ></div>
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="text-lg font-semibold text-slate-800 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{{ user.name || 'N/A' }}</div>
                        <div class="text-sm text-slate-500 dark:text-slate-400 truncate">{{ user.email || 'N/A' }}</div>
                        <div v-if="user.about" class="text-sm text-slate-600 dark:text-slate-300 truncate mt-1">{{ user.about }}</div>
                      </div>
                    </div>
                  </div>
  
                  <!-- Role & Status (2 columns) -->
                  <div class="col-span-2">
                    <div class="space-y-2">
                      <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full" :class="getRoleBadgeClass(user.role)">
                        {{ user.role || 'N/A' }}
                      </span>
                      <div class="flex items-center space-x-2">
                        <span class="inline-flex px-2 py-1 text-xs font-medium rounded-full" :class="user.status ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200'">
                          {{ user.status ? 'Active' : 'Inactive' }}
                        </span>
                        <span v-if="user.allow_login" class="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200">
                          Login Allowed
                        </span>
                      </div>
                    </div>
                  </div>
  
                  <!-- Contact (2 columns) -->
                  <div class="col-span-2">
                    <div class="space-y-1">
                      <div v-if="user.phone" class="text-sm text-slate-600 dark:text-slate-300">{{ user.phone }}</div>
                      <div v-if="user.address" class="text-sm text-slate-500 dark:text-slate-400 truncate">{{ user.address }}</div>
                      <div class="flex items-center space-x-1 mt-2">
                        <div v-if="user.email_verified_at" class="w-2 h-2 bg-green-500 rounded-full" title="Email Verified"></div>
                        <div v-if="user.phone_verified_at" class="w-2 h-2 bg-blue-500 rounded-full" title="Phone Verified"></div>
                      </div>
                    </div>
                  </div>
  
                  <!-- Last Activity (2 columns) -->
                  <div class="col-span-2">
                    <div class="space-y-1">
                      <div class="text-sm text-slate-600 dark:text-slate-300">
                        {{ user.last_seen ? formatDate(user.last_seen) : 'Never' }}
                      </div>
                      <div v-if="user.last_device" class="text-xs text-slate-500 dark:text-slate-400">{{ user.last_device }}</div>
                      <div class="text-xs text-slate-400 dark:text-slate-500">
                        Joined {{ formatDate(user.created_at) }}
                      </div>
                    </div>
                  </div>
  
                  <!-- Actions (2 columns) -->
                  <div class="col-span-2">
                    <div class="flex items-center justify-center space-x-2">
                      <button 
                        @click="viewUser(user)" 
                        class="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/40 transition-all" 
                        title="View User"
                      >
                        <Eye class="h-5 w-5" />
                      </button>
                      <button 
                        @click="editUser(user)" 
                        class="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/40 transition-all" 
                        title="Edit User"
                      >
                        <Edit class="h-5 w-5" />
                      </button>
                      <button 
                        @click="deleteUser(user)" 
                        :disabled="user.id === authuser?.id" 
                        class="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all" 
                        title="Delete User"
                      >
                        <Trash2 class="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Pagination -->
          <div v-if="pagination && pagination.last_page > 1" class="px-8 py-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-t border-slate-200/50 dark:border-slate-700/50">
            <div class="flex items-center justify-between">
              <div class="text-sm text-slate-600 dark:text-slate-400">
                Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} results
              </div>
              <div class="flex items-center space-x-3">
                <button 
                  @click="changePage(pagination.current_page - 1)" 
                  :disabled="!pagination.has_prev" 
                  class="px-4 py-2 text-sm rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                >
                  Previous
                </button>
                <span class="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 bg-gradient-to-r from-purple-100 to-orange-100 dark:from-purple-900/40 dark:to-orange-900/40 rounded-xl border border-purple-200 dark:border-purple-700">
                  Page {{ pagination.current_page }} of {{ pagination.last_page }}
                </span>
                <button 
                  @click="changePage(pagination.current_page + 1)" 
                  :disabled="!pagination.has_next" 
                  class="px-4 py-2 text-sm rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Create/Edit Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] shadow-2xl border border-white/40 dark:border-slate-700/40 flex flex-col">
          <!-- Modal Header -->
          <div class="px-8 py-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <div class="flex items-center justify-between">
              <h3 class="text-2xl font-semibold text-slate-900 dark:text-white">
                {{ isEditing ? 'Edit Admin User' : 'Create Admin User' }}
              </h3>
              <button @click="closeModal" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
                <X class="h-6 w-6" />
              </button>
            </div>
          </div>
  
          <!-- Modal Content -->
          <div class="flex-1 overflow-y-auto p-8">
            <form @submit.prevent="saveUser" class="space-y-6">
              <!-- Avatar Section -->
              <div class="flex items-center space-x-6 pb-6 border-b border-slate-200/50 dark:border-slate-700/50">
                <div class="relative">
                  <div class="h-20 w-20 rounded-3xl overflow-hidden bg-gradient-to-br from-purple-100 to-orange-100 dark:from-purple-900 dark:to-orange-900 shadow-xl ring-4 ring-white dark:ring-slate-700">
                    <img 
                      v-if="avatarPreview || formData.image_url" 
                      :src="avatarPreview || formData.image_url" 
                      :alt="formData.name || 'User'" 
                      class="h-full w-full object-cover"
                    />
                    <div 
                      v-else 
                      class="h-full w-full bg-gradient-to-br from-purple-600 to-orange-500 flex items-center justify-center text-white font-bold text-2xl"
                    >
                      {{ formData.name ? formData.name.charAt(0).toUpperCase() : 'U' }}
                    </div>
                  </div>
                  <input type="file" ref="avatarInput" @change="handleAvatarChange" accept="image/*" class="hidden">
                  <button 
                    type="button" 
                    @click="$refs.avatarInput.click()" 
                    class="absolute -bottom-2 -right-2 bg-gradient-to-r from-purple-600 to-orange-500 text-white p-2 rounded-xl hover:from-purple-700 hover:to-orange-600 shadow-lg transition-all"
                  >
                    <Camera class="h-4 w-4" />
                  </button>
                </div>
                <div>
                  <p class="text-lg font-medium text-slate-900 dark:text-white">Profile Photo</p>
                  <p class="text-sm text-slate-500 dark:text-slate-400">Upload a profile picture for the user</p>
                  <button 
                    type="button" 
                    @click="removeAvatar" 
                    v-if="avatarPreview || formData.image_url" 
                    class="text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 mt-2 transition-colors"
                  >
                    Remove Photo
                  </button>
                </div>
              </div>
  
              <!-- Basic Information -->
              <div>
                <h4 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">Basic Information</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name *</label>
                    <input 
                      v-model="formData.name" 
                      type="text" 
                      required 
                      class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email *</label>
                    <input 
                      v-model="formData.email" 
                      type="email" 
                      required 
                      class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone</label>
                    <input 
                      v-model="formData.phone" 
                      type="tel" 
                      class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Role *</label>
                    <select 
                      v-model="formData.role" 
                      required 
                      class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select Role</option>
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="presenter">Presenter</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Address</label>
                    <input 
                      v-model="formData.address" 
                      type="text" 
                      class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter address"
                    />
                  </div>
                </div>
              </div>
  
              <!-- Password Fields (create only) -->
              <div v-if="!isEditing">
                <h4 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">Security</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password *</label>
                    <div class="relative">
                      <input 
                        v-model="formData.password" 
                        :type="showPassword ? 'text' : 'password'" 
                        required 
                        class="w-full px-4 py-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Enter password"
                      />
                      <button 
                        type="button" 
                        @click="showPassword = !showPassword"
                        class="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        <Eye v-if="!showPassword" class="h-5 w-5" />
                        <EyeOff v-else class="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm Password *</label>
                    <div class="relative">
                      <input 
                        v-model="formData.confirm_password" 
                        :type="showConfirmPassword ? 'text' : 'password'" 
                        required 
                        class="w-full px-4 py-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Confirm password"
                      />
                      <button 
                        type="button" 
                        @click="showConfirmPassword = !showConfirmPassword"
                        class="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        <Eye v-if="!showConfirmPassword" class="h-5 w-5" />
                        <EyeOff v-else class="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Additional Information -->
              <div>
                <h4 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">Additional Information</h4>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">About</label>
                    <textarea 
                      v-model="formData.about" 
                      rows="3" 
                      placeholder="Brief description about the user..." 
                      class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>
  
              <!-- Settings -->
              <div>
                <h4 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">Account Settings</h4>
                <div class="flex flex-col sm:flex-row sm:items-center gap-6">
                  <label class="flex items-center">
                    <input 
                      v-model="formData.status" 
                      type="checkbox" 
                      class="rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 w-5 h-5"
                    />
                    <span class="ml-3 text-slate-700 dark:text-slate-300 font-medium">Active Status</span>
                  </label>
                  <label class="flex items-center">
                    <input 
                      v-model="formData.allow_login" 
                      type="checkbox" 
                      class="rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500 w-5 h-5"
                    />
                    <span class="ml-3 text-slate-700 dark:text-slate-300 font-medium">Allow Login</span>
                  </label>
                </div>
              </div>
            </form>
          </div>
  
          <!-- Modal Footer -->
          <div class="px-8 py-6 border-t border-slate-200/50 dark:border-slate-700/50 bg-slate-50/60 dark:bg-slate-700/60">
            <div class="flex items-center justify-end gap-4">
              <button 
                @click="closeModal" 
                type="button" 
                class="px-6 py-3 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-all font-medium"
              >
                Cancel
              </button>
              <button 
                @click="saveUser" 
                type="button" 
                :disabled="submitting" 
                class="px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-xl hover:from-purple-700 hover:to-orange-600 disabled:opacity-50 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
              >
                <Loader2 v-if="submitting" class="h-4 w-4 animate-spin mr-2" />
                {{ submitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update User' : 'Create User') }}
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Delete Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl border border-white/40 dark:border-slate-700/40">
          <div class="p-8">
            <div class="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/40 dark:to-orange-900/40 rounded-2xl">
              <AlertTriangle class="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 class="text-xl font-semibold text-center text-slate-900 dark:text-white mb-3">Delete User</h3>
            <p class="text-slate-600 dark:text-slate-300 text-center mb-8">
              Are you sure you want to delete <strong class="text-slate-900 dark:text-white">{{ userToDelete?.name }}</strong>? This action cannot be undone.
            </p>
            <div class="flex items-center justify-center gap-4">
              <button 
                @click="closeDeleteModal" 
                class="px-6 py-3 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all font-medium"
              >
                Cancel
              </button>
              <button 
                @click="confirmDelete" 
                :disabled="deleting" 
                class="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl hover:from-red-700 hover:to-orange-600 disabled:opacity-50 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
              >
                <Loader2 v-if="deleting" class="h-4 w-4 animate-spin mr-2" />
                {{ deleting ? 'Deleting...' : 'Delete User' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';
  
  import { 
    Users, 
    UserPlus, 
    Search, 
    Eye, 
    EyeOff,
    Edit, 
    Trash2, 
    X, 
    Loader2, 
    AlertTriangle, 
    Camera, 
    ChevronDown,
    Shield,
    CheckCircle,
    XCircle,
    Mic
  } from 'lucide-vue-next';
  
  // Store and router
  const router = useRouter();
  const store = useStore();
  
  // Reactive data
  const loading = ref(false);
  const submitting = ref(false);
  const deleting = ref(false);
  const showModal = ref(false);
  const showDeleteModal = ref(false);
  const isEditing = ref(false);
  const userToDelete = ref(null);
  const searchTimeout = ref(null);
  const avatarPreview = ref(null);
  const avatarInput = ref(null);
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  
  // Computed properties
  const adminList = computed(() => store.getters.adminList.data || []);
  const pagination = computed(() => store.getters.adminPagination);
  const metrics = computed(() => store.getters.adminStats);
  const authuser = computed(() => store.getters.authuser);
  
  const hasActiveFilters = computed(() => {
    return filters.value.search || filters.value.role || filters.value.status;
  });
  
  // Form data based on User model
  const formData = ref({
    name: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    confirm_password: '',
    address: '',
    about: '',
    status: true,
    allow_login: true,
    image_url: null,
    avatar: null
  });
  
  // Filters
  const filters = ref({
    search: '',
    role: '',
    status: '',
    page: 1,
    per_page: 10
  });
  
  // Avatar handling methods
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        store.commit('seterror', 'Please select a valid image file', { root: true });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        store.commit('seterror', 'Image size must be less than 5MB', { root: true });
        return;
      }
  
      const reader = new FileReader();
      reader.onload = (e) => {
        avatarPreview.value = e.target.result;
        formData.value.avatar = file;
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeAvatar = () => {
    avatarPreview.value = null;
    formData.value.avatar = null;
    formData.value.image_url = null;
    if (avatarInput.value) {
      avatarInput.value.value = '';
    }
  };
  
  // API methods
  const fetchUsers = async () => {
    loading.value = true;
    try {
      await store.dispatch('getAdminList', {
        ...filters.value,
        include_total: true
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      store.commit('seterror', 'Failed to fetch users', { root: true });
    } finally {
      loading.value = false;
    }
  };
  
  const debouncedSearch = () => {
    clearTimeout(searchTimeout.value);
    searchTimeout.value = setTimeout(() => {
      filters.value.page = 1;
      fetchUsers();
    }, 500);
  };
  
  const clearFilters = () => {
    filters.value = {
      search: '',
      role: '',
      status: '',
      page: 1,
      per_page: 10
    };
    fetchUsers();
  };
  
  const changePage = (page) => {
    if (page >= 1 && page <= pagination.value?.last_page) {
      filters.value.page = page;
      fetchUsers();
    }
  };
  
  // Form methods
  const resetForm = () => {
    formData.value = {
      name: '',
      email: '',
      phone: '',
      role: '',
      password: '',
      confirm_password: '',
      address: '',
      about: '',
      status: true,
      allow_login: true,
      image_url: null,
      avatar: null
    };
    avatarPreview.value = null;
    showPassword.value = false;
    showConfirmPassword.value = false;
    if (avatarInput.value) {
      avatarInput.value.value = '';
    }
  };
  
  const openCreateModal = () => {
    resetForm();
    isEditing.value = false;
    showModal.value = true;
  };
  
  const editUser = (user) => {
    isEditing.value = true;
    formData.value = {
      id: user.id,
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || '',
      address: user.address || '',
      about: user.about || '',
      status: user.status !== undefined ? user.status : true,
      allow_login: user.allow_login !== undefined ? user.allow_login : true,
      image_url: user.image_url || null,
      avatar: null
    };
    avatarPreview.value = user.image_url || null;
    showModal.value = true;
  };
  
  const viewUser = (user) => {
    alert('You Now Allowed to View this Information')
  };
  
  const deleteUser = (user) => {
    userToDelete.value = user;
    showDeleteModal.value = true;
  };
  
  const closeModal = () => {
    showModal.value = false;
    resetForm();
  };
  
  const closeDeleteModal = () => {
    showDeleteModal.value = false;
    userToDelete.value = null;
  };
  
  // Form validation
  const validateForm = () => {
    // Clear previous errors
    store.commit('seterror', '', { root: true });
  
    if (!formData.value.name?.trim()) {
      store.commit('seterror', 'Name is required', { root: true });
      return false;
    }
    
    if (!formData.value.email?.trim()) {
      store.commit('seterror', 'Email is required', { root: true });
      return false;
    }
    
    if (!formData.value.role) {
      store.commit('seterror', 'Role is required', { root: true });
      return false;
    }
  
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.value.email)) {
      store.commit('seterror', 'Please enter a valid email address', { root: true });
      return false;
    }
  
    // Password validation for new users
    if (!isEditing.value) {
      if (!formData.value.password) {
        store.commit('seterror', 'Password is required', { root: true });
        return false;
      }
      
      if (formData.value.password !== formData.value.confirm_password) {
        store.commit('seterror', 'Passwords do not match', { root: true });
        return false;
      }
      
      if (formData.value.password.length < 8) {
        store.commit('seterror', 'Password must be at least 8 characters long', { root: true });
        return false;
      }
    }
  
    // Phone validation (if provided)
    if (formData.value.phone && formData.value.phone.trim()) {
      const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(formData.value.phone)) {
        store.commit('seterror', 'Please enter a valid phone number', { root: true });
        return false;
      }
    }
  
    return true;
  };
  
  // CRUD operations
  const saveUser = async () => {
    if (!validateForm()) return;
    
    submitting.value = true;
    try {
      const data = new FormData();
      
      // Add basic fields based on User model
      const fields = ['name', 'email', 'phone', 'role', 'address', 'about', 'status', 'allow_login'];
      
      fields.forEach(field => {
        if (formData.value[field] !== null && formData.value[field] !== undefined && formData.value[field] !== '') {
          data.append(field, formData.value[field]);
        }
      });
  
      // Add password for new users only
      if (!isEditing.value && formData.value.password) {
        data.append('password', formData.value.password);
      }
  
      // Add image file if selected
      if (formData.value.avatar instanceof File) {
        data.append('image', formData.value.avatar);
      }
  
      let response;
      if (isEditing.value) {
        response = await store.dispatch('updateAdmin', {
          adminId: formData.value.id,
          data: data
        });
        await store.dispatch('template_play_success_file', 'User updated successfully', { root: true });
      } else {
        response = await store.dispatch('createAdmin', data);
        await store.dispatch('template_play_success_file', 'User created successfully', { root: true });
      }
      
      closeModal();
      await fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      const errorMsg = error.response?.data?.msg || error.message || 'Failed to save user';
      store.commit('seterror', errorMsg, { root: true });
      await store.dispatch('template_play_error_file', errorMsg, { root: true });
    } finally {
      submitting.value = false;
    }
  };
  
  const confirmDelete = async () => {
    if (!userToDelete.value) return;
    
    deleting.value = true;
    try {
      await store.dispatch('deleteAdmin', {
        adminId: userToDelete.value.id,
        hardDelete: false
      });
      
      await store.dispatch('template_play_delete_file', 'User deleted successfully', { root: true });
      closeDeleteModal();
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMsg = error.response?.data?.msg || error.message || 'Failed to delete user';
      store.commit('seterror', errorMsg, { root: true });
      await store.dispatch('template_play_error_file', errorMsg, { root: true });
    } finally {
      deleting.value = false;
    }
  };
  
  // Utility methods
  const getRoleBadgeClass = (role) => {
    const classes = {
      'admin': 'bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700',
      'editor': 'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 text-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-700',
      'presenter': 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700'
    };
    return classes[role] || 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900/40 dark:to-gray-800/40 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700';
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };
  
  const formatNumber = (num) => {
    if (!num || isNaN(num)) return 0;
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };
  
  // Keyboard shortcuts
  const handleKeydown = (event) => {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'n':
          event.preventDefault();
          openCreateModal();
          break;
        case 'f':
          event.preventDefault();
          document.querySelector('input[placeholder="Search users..."]')?.focus();
          break;
      }
    }
    
    if (event.key === 'Escape') {
      if (showModal.value) {
        closeModal();
      } else if (showDeleteModal.value) {
        closeDeleteModal();
      }
    }
  };
  
  // Auto-save form data to localStorage (draft functionality)
  let autoSaveTimeout = null;
  const saveFormDraft = () => {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      if (showModal.value) {
        localStorage.setItem('admin_user_form_draft', JSON.stringify({
          ...formData.value,
          avatar: null, // Don't save file object
          timestamp: new Date().toISOString()
        }));
      }
    }, 1000);
  };
  
  const loadFormDraft = () => {
    try {
      const draft = localStorage.getItem('admin_user_form_draft');
      if (draft) {
        const draftData = JSON.parse(draft);
        const draftAge = new Date() - new Date(draftData.timestamp);
        
        // Only load draft if it's less than 1 hour old
        if (draftAge < 3600000) {
          const shouldLoad = confirm('You have unsaved changes from a previous session. Would you like to restore them?');
          if (shouldLoad) {
            Object.assign(formData.value, draftData);
            delete formData.value.timestamp;
          }
        }
        localStorage.removeItem('admin_user_form_draft');
      }
    } catch (error) {
      console.error('Error loading form draft:', error);
    }
  };
  
  const clearFormDraft = () => {
    localStorage.removeItem('admin_user_form_draft');
  };
  
  // Watch form changes for auto-save
  import { watch } from 'vue';
  watch(formData, saveFormDraft, { deep: true });
  
  // Lifecycle hooks
  onMounted(async () => {
    document.addEventListener('keydown', handleKeydown);
    
    // Load initial data
    await fetchUsers();
    
    // Load draft if opening create modal
    if (showModal.value && !isEditing.value) {
      loadFormDraft();
    }
  });
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
    
    // Clear timeouts
    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value);
    }
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
  });
  
  // Cleanup on route change
  import { onBeforeRouteLeave } from 'vue-router';
  onBeforeRouteLeave(() => {
    clearFormDraft();
  });
  
  // Export functions for testing (optional)
  defineExpose({
    fetchUsers,
    openCreateModal,
    editUser,
    deleteUser,
    validateForm,
    saveUser,
    confirmDelete
  });
  </script>