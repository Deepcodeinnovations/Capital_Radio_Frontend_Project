<template>
    <div class="min-h-screen">
      <!-- Header -->
      <div class="max-w-7xl mx-auto mb-8">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">My Account</h1>
            <p class="text-slate-600 dark:text-slate-300 mt-1">Manage your profile and account settings</p>
          </div>
          
          <!-- Tab Navigation -->
          <div class="flex items-center gap-2 mt-4 sm:mt-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-white/60 dark:border-slate-700/60">
            <button 
              @click="activeTab = 'profile'" 
              :class="activeTab === 'profile' ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'" 
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center"
            >
              <User class="h-4 w-4 mr-2" />
              Profile
            </button>
            <button 
              @click="activeTab = 'password'" 
              :class="activeTab === 'password' ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'" 
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center"
            >
              <Lock class="h-4 w-4 mr-2" />
              Password
            </button>
            <button 
              @click="activeTab = 'settings'" 
              :class="activeTab === 'settings' ? 'bg-gradient-to-r from-purple-600 to-orange-500 text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'" 
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center"
            >
              <Settings class="h-4 w-4 mr-2" />
              Settings
            </button>
          </div>
        </div>
      </div>
  
      <div class="max-w-7xl mx-auto">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <Loader2 class="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
            <p class="text-slate-600 dark:text-slate-300">Loading your profile...</p>
          </div>
        </div>
  
        <!-- Profile Tab -->
        <div v-else-if="activeTab === 'profile'" class="space-y-8">
          <!-- Profile Header Card -->
          <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/60 dark:border-slate-700/60">
            <div class="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              <!-- Avatar Section -->
              <div class="relative group">
                <div class="h-32 w-32 rounded-3xl overflow-hidden bg-gradient-to-br from-purple-100 to-orange-100 dark:from-purple-900 dark:to-orange-900 shadow-2xl ring-4 ring-white dark:ring-slate-700">
                  <img 
                    v-if="currentUser?.image_url" 
                    :src="currentUser.image_url" 
                    :alt="currentUser.name" 
                    class="h-full w-full object-cover"
                  />
                  <div 
                    v-else 
                    class="h-full w-full bg-gradient-to-br from-purple-600 to-orange-500 flex items-center justify-center text-white font-bold text-4xl"
                  >
                    {{ currentUser?.name?.charAt(0)?.toUpperCase() || 'U' }}
                  </div>
                </div>
                <div 
                  class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white dark:border-slate-800 shadow-lg" 
                  :class="currentUser?.status ? 'bg-green-500' : 'bg-red-500'"
                ></div>
                <div v-if="editMode" class="absolute inset-0 bg-black/20 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" @click="$refs.avatarInput?.click()">
                  <Camera class="h-8 w-8 text-white" />
                </div>
              </div>
              
              <!-- User Info -->
              <div class="flex-1 min-w-0">
                <h2 class="text-2xl font-bold text-slate-800 dark:text-white mb-2">{{ currentUser?.name || 'N/A' }}</h2>
                <p class="text-slate-600 dark:text-slate-300 mb-4">{{ currentUser?.email || 'N/A' }}</p>
                <div class="flex flex-wrap items-center gap-3 mb-4">
                  <span class="inline-flex px-4 py-2 text-sm font-semibold rounded-full shadow-sm" :class="getRoleBadgeClass(currentUser?.role)">
                    {{ currentUser?.role || 'N/A' }}
                  </span>
                  <span v-if="currentUser?.is_featured_author" class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-sm">
                    <Star class="h-4 w-4 mr-2" />
                    Featured Author
                  </span>
                </div>
                
                <!-- Stats Grid -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
                    <div class="text-sm font-medium text-blue-600 dark:text-blue-400">Articles</div>
                    <div class="text-2xl font-bold text-blue-900 dark:text-blue-100">{{ currentUser?.actual_articles_count || 0 }}</div>
                  </div>
                  <div class="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40 rounded-xl p-4 border border-green-200/50 dark:border-green-700/50">
                    <div class="text-sm font-medium text-green-600 dark:text-green-400">Views</div>
                    <div class="text-2xl font-bold text-green-900 dark:text-green-100">{{ formatNumber(currentUser?.author_stats?.total_views) || 0 }}</div>
                  </div>
                  <div class="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/40 rounded-xl p-4 border border-purple-200/50 dark:border-purple-700/50">
                    <div class="text-sm font-medium text-purple-600 dark:text-purple-400">Likes</div>
                    <div class="text-2xl font-bold text-purple-900 dark:text-purple-100">{{ formatNumber(currentUser?.author_stats?.total_likes) || 0 }}</div>
                  </div>
                  <div class="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/40 dark:to-orange-800/40 rounded-xl p-4 border border-orange-200/50 dark:border-orange-700/50">
                    <div class="text-sm font-medium text-orange-600 dark:text-orange-400">Engagement</div>
                    <div class="text-2xl font-bold text-orange-900 dark:text-orange-100">{{ (currentUser?.author_stats?.engagement_rate || 0).toFixed(1) }}%</div>
                  </div>
                </div>
              </div>
              
              <!-- Action Button -->
              <div class="lg:ml-8">
                <button 
                  @click="editMode = !editMode" 
                  class="px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-xl hover:from-purple-700 hover:to-orange-600 transition-all text-sm font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
                >
                  <Edit class="h-4 w-4 mr-2" />
                  {{ editMode ? 'Cancel Edit' : 'Edit Profile' }}
                </button>
              </div>
            </div>
          </div>
  
          <!-- Profile Form/Details -->
          <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/60 dark:border-slate-700/60">
            <!-- Edit Mode Form -->
            <form v-if="editMode" @submit.prevent="updateProfile" class="space-y-6">
              <!-- Hidden Avatar Input -->
              <input type="file" ref="avatarInput" @change="handleAvatarChange" accept="image/*" class="hidden">
              
              <!-- Basic Information -->
              <div>
                <h3 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">Basic Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name *</label>
                    <input 
                      v-model="formData.name" 
                      type="text" 
                      required 
                      class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email *</label>
                    <input 
                      v-model="formData.email" 
                      type="email" 
                      required 
                      class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Phone</label>
                    <input 
                      v-model="formData.phone" 
                      type="tel" 
                      class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Author Title</label>
                    <input 
                      v-model="formData.author_title" 
                      type="text" 
                      placeholder="e.g., Senior Political Correspondent" 
                      class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
  
              <!-- Bio Section -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bio</label>
                <textarea 
                  v-model="formData.bio" 
                  rows="4" 
                  placeholder="Tell us about yourself..." 
                  class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                ></textarea>
              </div>
  
              <!-- Professional Information -->
              <div>
                <h3 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">Professional Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Website</label>
                    <input 
                      v-model="formData.website" 
                      type="url" 
                      placeholder="https://example.com" 
                      class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Experience (Years)</label>
                    <input 
                      v-model.number="formData.years_of_experience" 
                      type="number" 
                      min="0" 
                      placeholder="5"
                      class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
  
              <!-- Specializations -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Specializations</label>
                <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600 min-h-[3rem] mb-3">
                  <div class="flex flex-wrap gap-2">
                    <span 
                      v-for="(spec, index) in formData.specialization" 
                      :key="index" 
                      class="inline-flex items-center px-3 py-1 text-sm bg-gradient-to-r from-purple-100 to-orange-100 dark:from-purple-900/40 dark:to-orange-900/40 text-purple-800 dark:text-purple-200 rounded-full border border-purple-200 dark:border-purple-700"
                    >
                      {{ spec }}
                      <button @click="removeSpecialization(index)" type="button" class="ml-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200">
                        <X class="h-3 w-3" />
                      </button>
                    </span>
                  </div>
                </div>
                <div class="flex gap-3">
                  <input 
                    v-model="newSpecialization" 
                    @keyup.enter="addSpecialization" 
                    type="text" 
                    placeholder="Add specialization..." 
                    class="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                  <button 
                    @click="addSpecialization" 
                    type="button" 
                    class="px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-xl hover:from-purple-700 hover:to-orange-600 transition-all font-medium shadow-lg"
                  >
                    Add
                  </button>
                </div>
              </div>
  
              <!-- Social Media -->
              <div>
                <h3 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">Social Media</h3>
                <div class="space-y-4">
                  <div class="flex items-center gap-4">
                    <div class="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                      <Twitter class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <input 
                      v-model="formData.social_media.twitter" 
                      type="url" 
                      placeholder="Twitter URL" 
                      class="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                      <Linkedin class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <input 
                      v-model="formData.social_media.linkedin" 
                      type="url" 
                      placeholder="LinkedIn URL" 
                      class="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
                      <Facebook class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <input 
                      v-model="formData.social_media.facebook" 
                      type="url" 
                      placeholder="Facebook URL" 
                      class="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>
  
              <!-- Form Actions -->
              <div class="flex items-center justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button 
                  @click="editMode = false" 
                  type="button" 
                  class="px-6 py-3 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  :disabled="submitting" 
                  class="px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-500 text-white rounded-xl hover:from-purple-700 hover:to-orange-600 disabled:opacity-50 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
                >
                  <Loader2 v-if="submitting" class="h-4 w-4 animate-spin mr-2" />
                  {{ submitting ? 'Updating...' : 'Update Profile' }}
                </button>
              </div>
            </form>
  
            <!-- View Mode -->
            <div v-else class="space-y-8">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Left Column -->
                <div class="space-y-6">
                  <div>
                    <h3 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">Contact Information</h3>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Email</label>
                        <p class="text-slate-900 dark:text-white">{{ currentUser?.email || 'Not provided' }}</p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Phone</label>
                        <p class="text-slate-900 dark:text-white">{{ currentUser?.phone || 'Not provided' }}</p>
                      </div>
                    </div>
                  </div>
  
                  <div v-if="currentUser?.bio">
                    <label class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Bio</label>
                    <p class="text-slate-900 dark:text-white leading-relaxed">{{ currentUser.bio }}</p>
                  </div>
                </div>
  
                <!-- Right Column -->
                <div class="space-y-6">
                  <div>
                    <h3 class="text-lg font-semibold text-slate-800 dark:text-white mb-4">Professional Details</h3>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Author Title</label>
                        <p class="text-slate-900 dark:text-white">{{ currentUser?.author_title || 'Not provided' }}</p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Website</label>
                        <p class="text-slate-900 dark:text-white">
                          <a v-if="currentUser?.website" :href="currentUser.website" target="_blank" class="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors">
                            {{ currentUser.website }}
                          </a>
                          <span v-else>Not provided</span>
                        </p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Experience</label>
                        <p class="text-slate-900 dark:text-white">{{ currentUser?.years_of_experience ? `${currentUser.years_of_experience} years` : 'Not provided' }}</p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Member Since</label>
                        <p class="text-slate-900 dark:text-white">{{ formatDate(currentUser?.created_at) }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Specializations -->
              <div v-if="currentUser?.specialization?.length">
                <label class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Specializations</label>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="spec in currentUser.specialization" 
                    :key="spec" 
                    class="px-4 py-2 text-sm bg-gradient-to-r from-purple-100 to-orange-100 dark:from-purple-900/40 dark:to-orange-900/40 text-purple-800 dark:text-purple-200 rounded-full border border-purple-200 dark:border-purple-700"
                  >
                    {{ spec }}
                  </span>
                </div>
              </div>
  
              <!-- Social Media -->
              <div v-if="hasSocialMedia">
                <label class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Social Media</label>
                <div class="flex gap-4">
                  <a v-if="currentUser?.social_media?.twitter" :href="currentUser.social_media.twitter" target="_blank" class="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors">
                    <Twitter class="h-5 w-5" />
                  </a>
                  <a v-if="currentUser?.social_media?.linkedin" :href="currentUser.social_media.linkedin" target="_blank" class="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors">
                    <Linkedin class="h-5 w-5" />
                  </a>
                  <a v-if="currentUser?.social_media?.facebook" :href="currentUser.social_media.facebook" target="_blank" class="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors">
                    <Facebook class="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Password Tab -->
        <div v-else-if="activeTab === 'password'" class="max-w-2xl mx-auto">
          <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/60 dark:border-slate-700/60">
            <div class="flex items-center mb-8">
              <div class="p-4 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 rounded-2xl mr-6">
                <Lock class="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 class="text-2xl font-semibold text-slate-800 dark:text-white">Change Password</h3>
                <p class="text-slate-600 dark:text-slate-300 mt-1">Update your password to keep your account secure</p>
              </div>
            </div>
  
            <form @submit.prevent="changePassword" class="space-y-6">
              <!-- Current Password -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Password *</label>
                <div class="relative">
                  <input 
                    v-model="passwordForm.current_password" 
                    :type="showCurrentPassword ? 'text' : 'password'" 
                    required 
                    class="w-full px-4 py-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter your current password"
                  />
                  <button 
                    type="button" 
                    @click="showCurrentPassword = !showCurrentPassword"
                    class="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    <Eye v-if="!showCurrentPassword" class="h-5 w-5" />
                    <EyeOff v-else class="h-5 w-5" />
                  </button>
                </div>
              </div>
  
              <!-- New Password -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">New Password *</label>
                <div class="relative">
                  <input 
                    v-model="passwordForm.new_password" 
                    :type="showNewPassword ? 'text' : 'password'" 
                    required 
                    @input="validatePassword"
                    class="w-full px-4 py-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter your new password"
                  />
                  <button 
                    type="button" 
                    @click="showNewPassword = !showNewPassword"
                    class="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    <Eye v-if="!showNewPassword" class="h-5 w-5" />
                    <EyeOff v-else class="h-5 w-5" />
                  </button>
                </div>
  
                <!-- Password Strength Indicator -->
                <div v-if="passwordForm.new_password" class="mt-3">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm text-slate-600 dark:text-slate-400">Password strength</span>
                    <span class="text-sm font-medium" :class="passwordStrengthTextColor">{{ passwordStrengthText }}</span>
                  </div>
                  <div class="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                    <div 
                      class="h-2 rounded-full transition-all duration-300" 
                      :class="passwordStrengthColor"
                      :style="{ width: passwordStrengthWidth }"
                    ></div>
                  </div>
                </div>
  
                <!-- Password Requirements -->
                <div v-if="passwordForm.new_password" class="mt-4 space-y-2">
                  <div class="flex items-center text-sm">
                    <CheckCircle v-if="passwordValidation.length" class="h-4 w-4 text-green-500 mr-2" />
                    <XCircle v-else class="h-4 w-4 text-slate-400 mr-2" />
                    <span :class="passwordValidation.length ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'">At least 8 characters</span>
                  </div>
                  <div class="flex items-center text-sm">
                    <CheckCircle v-if="passwordValidation.uppercase" class="h-4 w-4 text-green-500 mr-2" />
                    <XCircle v-else class="h-4 w-4 text-slate-400 mr-2" />
                    <span :class="passwordValidation.uppercase ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'">One uppercase letter</span>
                  </div>
                  <div class="flex items-center text-sm">
                    <CheckCircle v-if="passwordValidation.lowercase" class="h-4 w-4 text-green-500 mr-2" />
                    <XCircle v-else class="h-4 w-4 text-slate-400 mr-2" />
                    <span :class="passwordValidation.lowercase ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'">One lowercase letter</span>
                  </div>
                  <div class="flex items-center text-sm">
                    <CheckCircle v-if="passwordValidation.number" class="h-4 w-4 text-green-500 mr-2" />
                    <XCircle v-else class="h-4 w-4 text-slate-400 mr-2" />
                    <span :class="passwordValidation.number ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'">One number</span>
                  </div>
                  <div class="flex items-center text-sm">
                    <CheckCircle v-if="passwordValidation.special" class="h-4 w-4 text-green-500 mr-2" />
                    <XCircle v-else class="h-4 w-4 text-slate-400 mr-2" />
                    <span :class="passwordValidation.special ? 'text-green-600 dark:text-green-400' : 'text-slate-600 dark:text-slate-400'">One special character</span>
                  </div>
                </div>
              </div>
  
              <!-- Confirm Password -->
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm New Password *</label>
                <div class="relative">
                  <input 
                    v-model="passwordForm.confirm_password" 
                    :type="showConfirmPassword ? 'text' : 'password'" 
                    required 
                    class="w-full px-4 py-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm placeholder-slate-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': passwordForm.confirm_password && !passwordsMatch }"
                    placeholder="Confirm your new password"
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
                <div v-if="passwordForm.confirm_password && !passwordsMatch" class="flex items-center mt-2 text-sm text-red-600 dark:text-red-400">
                  <XCircle class="h-4 w-4 mr-2" />
                  Passwords do not match
                </div>
                <div v-else-if="passwordForm.confirm_password && passwordsMatch" class="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle class="h-4 w-4 mr-2" />
                  Passwords match
                </div>
              </div>
  
              <!-- Submit Button -->
              <div class="pt-6">
                <button 
                  type="submit" 
                  :disabled="changingPassword || !isPasswordFormValid" 
                  class="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-red-500 text-white rounded-xl hover:from-orange-700 hover:to-red-600 disabled:opacity-50 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                  <Loader2 v-if="changingPassword" class="h-5 w-5 animate-spin mr-2" />
                  {{ changingPassword ? 'Changing Password...' : 'Change Password' }}
                </button>
              </div>
            </form>
          </div>
        </div>
  
        <!-- Settings Tab -->
        <div v-else-if="activeTab === 'settings'" class="max-w-4xl mx-auto space-y-8">
          <!-- Account Information -->
          <div class="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/60 dark:border-slate-700/60">
            <div class="flex items-center mb-8">
              <div class="p-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 rounded-2xl mr-6">
                <Settings class="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 class="text-2xl font-semibold text-slate-800 dark:text-white">Account Settings</h3>
                <p class="text-slate-600 dark:text-slate-300 mt-1">Manage your account preferences and settings</p>
              </div>
            </div>
  
            <!-- Account Status Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div class="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-green-800 dark:text-green-200">Account Status</h4>
                    <p class="text-2xl font-bold text-green-900 dark:text-green-100 mt-1">
                      {{ currentUser?.status ? 'Active' : 'Inactive' }}
                    </p>
                  </div>
                  <div class="w-3 h-3 rounded-full" :class="currentUser?.status ? 'bg-green-500' : 'bg-red-500'"></div>
                </div>
              </div>
  
              <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-blue-800 dark:text-blue-200">Email Status</h4>
                    <p class="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                      {{ currentUser?.email_verified_at ? 'Verified' : 'Pending' }}
                    </p>
                  </div>
                  <div class="w-3 h-3 rounded-full" :class="currentUser?.email_verified_at ? 'bg-green-500' : 'bg-yellow-500'"></div>
                </div>
              </div>
  
              <div class="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="text-sm font-medium text-purple-800 dark:text-purple-200">Phone Status</h4>
                    <p class="text-2xl font-bold text-purple-900 dark:text-purple-100 mt-1">
                      {{ currentUser?.phone_verified_at ? 'Verified' : 'Pending' }}
                    </p>
                  </div>
                  <div class="w-3 h-3 rounded-full" :class="currentUser?.phone_verified_at ? 'bg-green-500' : 'bg-yellow-500'"></div>
                </div>
              </div>
            </div>
  
            <!-- Account Actions -->
            <div>
              <h4 class="text-lg font-semibold text-slate-800 dark:text-white mb-6">Account Actions</h4>
              <div class="space-y-4">
                <button @click="refreshProfile" class="w-full flex items-center justify-between p-6 text-left border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group">
                  <div class="flex items-center">
                    <div class="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl mr-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60 transition-colors">
                      <RefreshCw class="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div class="font-medium text-slate-800 dark:text-white">Refresh Profile</div>
                      <div class="text-sm text-slate-600 dark:text-slate-400">Reload your profile data from the server</div>
                    </div>
                  </div>
                  <ChevronRight class="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </button>
  
                <button @click="downloadData" class="w-full flex items-center justify-between p-6 text-left border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group">
                  <div class="flex items-center">
                    <div class="p-3 bg-green-100 dark:bg-green-900/40 rounded-xl mr-4 group-hover:bg-green-200 dark:group-hover:bg-green-900/60 transition-colors">
                      <Download class="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div class="font-medium text-slate-800 dark:text-white">Download My Data</div>
                      <div class="text-sm text-slate-600 dark:text-slate-400">Export all your account data in JSON format</div>
                    </div>
                  </div>
                  <ChevronRight class="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </button>
  
                <button @click="showLogoutModal = true" class="w-full flex items-center justify-between p-6 text-left border border-red-200 dark:border-red-800 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group">
                  <div class="flex items-center">
                    <div class="p-3 bg-red-100 dark:bg-red-900/40 rounded-xl mr-4 group-hover:bg-red-200 dark:group-hover:bg-red-900/60 transition-colors">
                      <LogOut class="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <div class="font-medium text-red-700 dark:text-red-400">Sign Out</div>
                      <div class="text-sm text-red-600 dark:text-red-500">Sign out from all devices and sessions</div>
                    </div>
                  </div>
                  <ChevronRight class="h-5 w-5 text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Logout Confirmation Modal -->
      <div v-if="showLogoutModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl border border-white/60 dark:border-slate-700/60">
          <div class="p-8">
            <div class="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/40 dark:to-orange-900/40 rounded-2xl">
              <LogOut class="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 class="text-xl font-semibold text-center text-slate-900 dark:text-white mb-3">Sign Out</h3>
            <p class="text-slate-600 dark:text-slate-300 text-center mb-8">
              Are you sure you want to sign out from your account? You'll need to sign in again to access your dashboard.
            </p>
            <div class="flex items-center justify-center gap-4">
              <button 
                @click="showLogoutModal = false" 
                class="px-6 py-3 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all font-medium"
              >
                Cancel
              </button>
              <button 
                @click="logout" 
                :disabled="loggingOut" 
                class="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl hover:from-red-700 hover:to-orange-600 disabled:opacity-50 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
              >
                <Loader2 v-if="loggingOut" class="h-4 w-4 animate-spin mr-2" />
                {{ loggingOut ? 'Signing Out...' : 'Sign Out' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
<script setup>
import { ref, computed, onMounted, reactive, watch, onUnmounted  } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import { 
  User,
  Lock,
  Settings,
  Edit,
  Camera,
  Star,
  Twitter,
  Linkedin,
  Facebook,
  X,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  LogOut,
  ChevronRight
} from 'lucide-vue-next';

// Store and router
const router = useRouter();
const store = useStore();

// Reactive data
const loading = ref(false);
const submitting = ref(false);
const changingPassword = ref(false);
const loggingOut = ref(false);
const editMode = ref(false);
const activeTab = ref('profile');
const showLogoutModal = ref(false);
const newSpecialization = ref('');
const avatarPreview = ref(null);
const avatarInput = ref(null);

// Password visibility toggles
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// Computed properties
const currentUser = computed(() => store.getters.currentAdmin || store.getters.authuser);
const hasSocialMedia = computed(() => {
  const social = currentUser.value?.social_media;
  return social && (social.twitter || social.linkedin || social.facebook);
});

// Form data for profile update
const formData = ref({
  name: '',
  email: '',
  phone: '',
  bio: '',
  author_title: '',
  website: '',
  years_of_experience: null,
  specialization: [],
  social_media: {
    twitter: '',
    linkedin: '',
    facebook: ''
  },
  image_url: null
});

// Password form data
const passwordForm = ref({
  current_password: '',
  new_password: '',
  confirm_password: ''
});

// Password validation reactive object
const passwordValidation = reactive({
  length: false,
  uppercase: false,
  lowercase: false,
  number: false,
  special: false
});

// Password validation computed properties
const passwordsMatch = computed(() => {
  return passwordForm.value.new_password && passwordForm.value.confirm_password && 
         passwordForm.value.new_password === passwordForm.value.confirm_password;
});

const passwordStrength = computed(() => {
  const criteria = Object.values(passwordValidation);
  return criteria.filter(Boolean).length;
});

const passwordStrengthWidth = computed(() => {
  return `${(passwordStrength.value / 5) * 100}%`;
});

const passwordStrengthColor = computed(() => {
  const strength = passwordStrength.value;
  if (strength <= 1) return 'bg-red-500';
  if (strength <= 2) return 'bg-orange-500';
  if (strength <= 3) return 'bg-yellow-500';
  if (strength <= 4) return 'bg-blue-500';
  return 'bg-green-500';
});

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value;
  if (strength <= 1) return 'Weak';
  if (strength <= 2) return 'Fair';
  if (strength <= 3) return 'Good';
  if (strength <= 4) return 'Strong';
  return 'Excellent';
});

const passwordStrengthTextColor = computed(() => {
  const strength = passwordStrength.value;
  if (strength <= 1) return 'text-red-600';
  if (strength <= 2) return 'text-orange-600';
  if (strength <= 3) return 'text-yellow-600';
  if (strength <= 4) return 'text-blue-600';
  return 'text-green-600';
});

const isPasswordFormValid = computed(() => {
  return Object.values(passwordValidation).every(Boolean) && 
         passwordsMatch.value && 
         passwordForm.value.current_password;
});


// Methods
const populateFormData = (user) => {
  formData.value = {
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    bio: user.bio || '',
    author_title: user.author_title || '',
    website: user.website || '',
    years_of_experience: user.years_of_experience || null,
    specialization: user.specialization || [],
    social_media: user.social_media || {
      twitter: '',
      linkedin: '',
      facebook: ''
    },
    image_url: user.image_url || null
  };
  avatarPreview.value = user.image_url || null;
};

// Watch for current user changes to populate form
watch(currentUser, (newUser) => {
  if (newUser) {
    populateFormData(newUser);
  }
}, { immediate: true });


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

// Specialization methods
const addSpecialization = () => {
  const spec = newSpecialization.value.trim();
  if (spec && !formData.value.specialization.includes(spec)) {
    if (formData.value.specialization.length >= 10) {
      store.commit('seterror', 'Maximum 10 specializations allowed', { root: true });
      return;
    }
    formData.value.specialization.push(spec);
    newSpecialization.value = '';
  }
};

const removeSpecialization = (index) => {
  formData.value.specialization.splice(index, 1);
};

// Password validation method
const validatePassword = () => {
  const password = passwordForm.value.new_password;
  
  passwordValidation.length = password.length >= 8;
  passwordValidation.uppercase = /[A-Z]/.test(password);
  passwordValidation.lowercase = /[a-z]/.test(password);
  passwordValidation.number = /\d/.test(password);
  passwordValidation.special = /[!@#$%^&*(),.?":{}|<>]/.test(password);
};

// Form validation
const validateProfileForm = () => {
  if (!formData.value.name?.trim()) {
    store.commit('seterror', 'Name is required', { root: true });
    return false;
  }
  
  if (!formData.value.email?.trim()) {
    store.commit('seterror', 'Email is required', { root: true });
    return false;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.value.email)) {
    store.commit('seterror', 'Please enter a valid email address', { root: true });
    return false;
  }

  // URL validation for website
  if (formData.value.website && formData.value.website.trim()) {
    try {
      new URL(formData.value.website);
    } catch {
      store.commit('seterror', 'Please enter a valid website URL', { root: true });
      return false;
    }
  }

  // URL validation for social media
  const socialFields = ['twitter', 'linkedin', 'facebook'];
  for (const field of socialFields) {
    const url = formData.value.social_media[field];
    if (url && url.trim()) {
      try {
        new URL(url);
      } catch {
        store.commit('seterror', `Please enter a valid ${field} URL`, { root: true });
        return false;
      }
    }
  }

  return true;
};

// API methods
const fetchProfile = async () => {
  loading.value = true;
  try {
    await store.dispatch('getMyProfile');
  } catch (error) {
    console.error('Error fetching profile:', error);
    store.commit('seterror', 'Failed to load profile', { root: true });
  } finally {
    loading.value = false;
  }
};

const updateProfile = async () => {
  if (!validateProfileForm()) return;
  
  submitting.value = true;
  try {
    const data = new FormData();
    
    // Basic fields
    Object.keys(formData.value).forEach(key => {
      if (key === 'specialization') {
        data.append('specialization', JSON.stringify(formData.value.specialization));
      } else if (key === 'social_media') {
        data.append('social_media', JSON.stringify(formData.value.social_media));
      } else if (key === 'avatar' && formData.value.avatar instanceof File) {
        data.append('image', formData.value.avatar);
      } else if (key !== 'avatar' && key !== 'image_url') {
        if (formData.value[key] !== null && formData.value[key] !== '') {
          data.append(key, formData.value[key]);
        }
      }
    });

    await store.dispatch('updateMyProfile', data);
    store.commit('setsuccess', 'Profile updated successfully', { root: true });
    editMode.value = false;
  } catch (error) {
    console.error('Error updating profile:', error);
    store.commit('seterror', error.message || 'Failed to update profile', { root: true });
  } finally {
    submitting.value = false;
  }
};

const changePassword = async () => {
  if (!isPasswordFormValid.value) {
    store.commit('seterror', 'Please fill all required fields and ensure passwords meet requirements', { root: true });
    return;
  }
  
  changingPassword.value = true;
  try {
    const data = new FormData();
    data.append('current_password', passwordForm.value.current_password);
    data.append('new_password', passwordForm.value.new_password);

    await store.dispatch('changeAdminPassword', data);
    store.commit('setsuccess', 'Password changed successfully', { root: true });
    
    // Clear form
    passwordForm.value = {
      current_password: '',
      new_password: '',
      confirm_password: ''
    };
    
    // Reset validation
    Object.keys(passwordValidation).forEach(key => {
      passwordValidation[key] = false;
    });
    
  } catch (error) {
    console.error('Error changing password:', error);
    store.commit('seterror', error.message || 'Failed to change password', { root: true });
  } finally {
    changingPassword.value = false;
  }
};

const refreshProfile = async () => {
  await fetchProfile();
  store.commit('setsuccess', 'Profile refreshed successfully', { root: true });
};

const downloadData = () => {
  // Create a data export
  const userData = {
    profile: currentUser.value,
    exportDate: new Date().toISOString(),
    exportType: 'user_account_data'
  };
  
  const dataStr = JSON.stringify(userData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${currentUser.value?.name || 'user'}_account_data_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  store.commit('setsuccess', 'Account data downloaded successfully', { root: true });
};

const logout = async () => {
  loggingOut.value = true;
  try {
    await store.dispatch('adminLogout');
    showLogoutModal.value = false;
    router.push({ name: 'Login' });
  } catch (error) {
    console.error('Error logging out:', error);
    store.commit('seterror', error.message || 'Failed to logout', { root: true });
  } finally {
    loggingOut.value = false;
  }
};

// Utility methods
const getRoleBadgeClass = (role) => {
  const classes = {
    'admin': 'bg-red-100 text-red-800',
    'editor': 'bg-blue-100 text-blue-800',
    'author': 'bg-green-100 text-green-800'
  };
  return classes[role] || 'bg-gray-100 text-gray-800';
};

const formatDate = (dateString) => {
  if (!dateString) return 'Not available';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

// Cancel edit mode when switching tabs
watch(activeTab, () => {
  if (editMode.value) {
    editMode.value = false;
    populateFormData(currentUser.value);
  }
});

// Keyboard shortcuts
const handleKeydown = (event) => {
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case 'e':
        if (activeTab.value === 'profile') {
          event.preventDefault();
          editMode.value = !editMode.value;
        }
        break;
      case 's':
        if (editMode.value) {
          event.preventDefault();
          updateProfile();
        }
        break;
    }
  }
  
  if (event.key === 'Escape') {
    if (showLogoutModal.value) {
      showLogoutModal.value = false;
    } else if (editMode.value) {
      editMode.value = false;
      populateFormData(currentUser.value);
    }
  }
};

// Lifecycle hooks
onMounted(async () => {
  document.addEventListener('keydown', handleKeydown);
  
  // Load profile if not already loaded
  if (!currentUser.value) {
    await fetchProfile();
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});

// Auto-save draft (optional feature)
let autoSaveTimeout = null;
watch(formData, () => {
  if (editMode.value) {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      // Save to localStorage as draft
      localStorage.setItem('profile_draft', JSON.stringify(formData.value));
    }, 2000);
  }
}, { deep: true });

// Load draft on edit mode
watch(editMode, (newValue) => {
  if (newValue) {
    const draft = localStorage.getItem('profile_draft');
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        // Only load draft if it's different from current data
        if (JSON.stringify(draftData) !== JSON.stringify(formData.value)) {
          const shouldLoadDraft = confirm('You have unsaved changes. Would you like to restore them?');
          if (shouldLoadDraft) {
            formData.value = draftData;
          }
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  } else {
    // Clear draft when exiting edit mode
    localStorage.removeItem('profile_draft');
  }
});
</script>