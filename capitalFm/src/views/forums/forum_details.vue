
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Header Section -->
    <div class="relative bg-black border-b border-gray-800 overflow-hidden" style="margin-top: -5rem !important; padding-top: 5rem;">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Community Discussion"
          class="w-full h-full object-cover opacity-40"
        />
        <div class="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center max-w-3xl mx-auto">
          <div class="inline-flex items-center justify-center mb-4">
            <MessageCircle class="text-[#F8CB00] mr-2" :size="24" />
            <span class="text-[#F8CB00] font-semibold uppercase tracking-wider text-sm">Discussion</span>
          </div>
          <h1 class="text-4xl sm:text-5xl font-bold text-white mb-4">
            Forum Discussion
          </h1>
          <p class="text-lg text-gray-300 mb-8">
            Join the conversation with fellow Capital FM listeners
          </p>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button 
              @click="$router.go(-1)"
              class="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
            >
              <ArrowLeft :size="18" />
              <span>Back to Forums</span>
            </button>
            
            <button 
              @click="scrollToDiscussion"
              class="inline-flex items-center gap-2 px-6 py-3 bg-[#F8CB00] text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors"
            >
              <MessageCircle :size="18" />
              <span>Join Discussion</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Clean Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-md bg-white/95">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        <div class="flex items-center justify-between">
          <!-- Breadcrumb -->
        <div class="flex items-center space-x-3 md:space-x-4">
          <button 
            @click="$router.go(-1)"
            class="flex items-center space-x-1.5 md:space-x-2 px-3 md:px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft class="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span class="font-medium text-sm md:text-base hidden sm:inline">Back to Forums</span>
            <span class="font-medium text-sm md:text-base sm:hidden">Back</span>
          </button>
          
          <div class="h-4 md:h-6 w-px bg-gray-200"></div>
          
          <div>
            <h1 class="text-base md:text-lg font-semibold text-gray-900">Discussion</h1>
            <p class="text-xs md:text-sm text-gray-500 hidden sm:block">Community Forum</p>
          </div>
        </div>
          
          <div class="flex items-center gap-1 md:gap-2">
            <button class="p-1.5 md:p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <Share class="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button class="p-1.5 md:p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <Bookmark class="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-12 md:py-20">
      <div class="w-6 h-6 md:w-8 md:h-8 border-2 border-gray-300 border-t-[#F8CB00] rounded-full animate-spin"></div>
    </div>

    <!-- Main Content -->
    <div v-else-if="forum_details" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <!-- Original Post -->
      <article id="discussion-content" class="bg-white discussion-content rounded-lg md:rounded-xl border border-gray-200 shadow-sm mb-6 md:mb-8 overflow-hidden hover:shadow-md transition-shadow">
        <div class="p-4 md:p-6 lg:p-8">
          <!-- Post Header -->
          <div class="flex items-start gap-3 md:gap-4 mb-4 md:mb-6">
            <div class="relative flex-shrink-0">
              <img 
                :src="forum_details.creator?.image_url || '/default-avatar.png'" 
                :alt="forum_details.creator?.name" 
                class="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
              />
              <div class="absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                <h3 class="font-semibold text-sm md:text-base text-gray-900">
                  {{ forum_details.creator?.name || 'Anonymous' }}
                </h3>
                <span class="text-xs md:text-sm text-gray-500">
                  {{ formatDate(forum_details.created_at) }}
                </span>
                
                <!-- Status Badges -->
                <div class="flex items-center flex-wrap gap-1.5 md:gap-2">
                  <span v-if="forum_details.is_pinned" class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium bg-[#F8CB00]/20 text-[#F8CB00]">
                    <Pin class="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />
                    Pinned
                  </span>
                  <span v-if="forum_details.is_hot" class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium bg-red-100 text-red-700">
                    <Flame class="w-2.5 h-2.5 md:w-3 md:h-3 mr-1" />
                    Hot
                  </span>
                 
                </div>
              </div>
              
              <!-- Post Title -->
              <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">
                {{ forum_details.title }}
              </h2>
              
              <!-- Post Content -->
              <div class="prose prose-gray max-w-none mb-4 md:mb-6">
                <p class="text-sm md:text-base text-gray-900 leading-relaxed whitespace-pre-wrap">
                  {{ forum_details.body }}
                </p>
              </div>
            </div>
          </div>

          <!-- Post Stats and Actions -->
          <div class="border-t border-gray-200 pt-4 md:pt-6">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div class="flex items-center gap-4 md:gap-6 text-xs md:text-sm text-gray-500">
                <div class="flex items-center gap-1.5 md:gap-2">
                  <Eye class="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span>{{ forum_details.views_count || 0 }}</span>
                </div>
                <div class="flex items-center gap-1.5 md:gap-2">
                  <MessageCircle class="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span>{{ forum_details.comments_count || 0 }}</span>
                </div>
                
              </div>
              
              <div class="flex items-center gap-2 md:gap-3">
             
                <button 
                  @click="scrollToReply"
                  class="inline-flex items-center px-4 py-2 bg-[#F8CB00] text-black rounded-lg hover:bg-yellow-500 transition-colors text-xs md:text-sm font-medium"
                >
                  <MessageCircle class="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- Comments Section -->
      <div class="bg-white rounded-lg md:rounded-xl border border-gray-200 shadow-sm">
        <!-- Comments Header -->
        <div class="px-4 md:px-6 lg:px-8 py-4 md:py-6 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 md:gap-3">
              <div class="w-7 h-7 md:w-8 md:h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <MessageCircle class="w-4 h-4 md:w-5 md:h-5 text-gray-900" />
              </div>
              <h3 class="text-base md:text-lg font-semibold text-gray-900">
                Replies ({{ mainComments.length }})
              </h3>
            </div>
            
            <select 
              v-model="sortBy"
              @change="loadComments"
              class="px-2.5 md:px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#F8CB00] focus:border-transparent"
            >
              <option value="created_at">Latest First</option>
              <option value="likes">Most Liked</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <!-- Comments Loading -->
        <div v-if="commentsLoading" class="flex justify-center items-center py-10 md:py-12">
          <div class="w-5 h-5 md:w-6 md:h-6 border-2 border-gray-300 border-t-[#F8CB00] rounded-full animate-spin"></div>
        </div>

        <!-- Comments List -->
        <div v-else-if="mainComments.length > 0" class="divide-y divide-gray-200">
          <div 
            v-for="comment in mainComments" 
            :key="comment.id"
            class="comment-thread"
          >
            <!-- Main Comment -->
            <div class="p-4 md:p-6 lg:p-8 hover:bg-gray-50 transition-colors">
              <div class="flex gap-3 md:gap-4">
                <div class="relative flex-shrink-0">
                  <img 
                    :src="comment.creator?.image_url || '/default-avatar.png'" 
                    :alt="comment.creator?.name" 
                    class="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover"
                  />
                  <div class="absolute -bottom-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
                    <span class="font-medium text-gray-900 text-sm md:text-base">
                      {{ comment.creator?.name || 'Anonymous' }}
                    </span>
                    <span class="text-xs md:text-sm text-gray-500">
                      {{ formatDate(comment.created_at) }}
                    </span>
                  </div>
                  
                  <div class="text-gray-900 text-sm md:text-base mb-3 md:mb-4 leading-relaxed whitespace-pre-wrap">
                    {{ comment.content }}
                  </div>
                  
                  <!-- Comment Actions -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3 md:gap-4">
                      <button 
                        @click="toggleCommentLike(comment)"
                        class="flex items-center gap-1 text-xs md:text-sm text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Heart class="w-3.5 h-3.5 md:w-4 md:h-4" />
                        <span>{{ comment.likes_count || 0 }}</span>
                      </button>
                      
                      <button 
                        v-if="comment.replies_count > 0"
                        @click="toggleReplies(comment.id)"
                        class="flex items-center gap-1 text-xs md:text-sm text-[#F8CB00] hover:text-yellow-600 transition-colors"
                      >
                        <MessageCircle class="w-3.5 h-3.5 md:w-4 md:h-4" />
                        <span>{{ comment.replies_count }} {{ comment.replies_count === 1 ? 'reply' : 'replies' }}</span>
                        <ChevronDown 
                          class="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform"
                          :class="{ 'rotate-180': showReplies[comment.id] }"
                        />
                      </button>
                      
                      <button 
                        @click="replyToComment(comment)"
                        class="text-xs md:text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Reply
                      </button>
                    </div>
                    
                    <div class="relative" v-if="canDeleteComment(comment)">
                      <button 
                        @click="toggleCommentMenu(comment.id)"
                        class="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                      >
                        <MoreVertical class="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                      
                      <div 
                        v-if="activeCommentMenu === comment.id"
                        class="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
                      >
                        <button 
                          @click="deleteComment(comment)"
                          class="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 text-xs md:text-sm"
                        >
                          <Trash2 class="w-3.5 h-3.5 md:w-4 md:h-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Reply Form -->
              <div 
                v-if="replyingTo === comment.id" 
                class="mt-4 md:mt-6 ml-10 md:ml-14 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div class="flex gap-3">
                  <img 
                    :src="authuser?.image_url || '/default-avatar.png'" 
                    :alt="authuser?.name" 
                    class="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  
                  <div class="flex-1">
                    <textarea
                      v-model="replyContent"
                      :placeholder="`Reply to ${comment.creator?.name}...`"
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#F8CB00] focus:border-transparent bg-white text-gray-900 placeholder-gray-500 text-sm"
                    ></textarea>
                    
                    <div class="flex items-center justify-between mt-2 md:mt-3">
                      <span class="text-xs text-gray-500">{{ replyContent.length }}/500</span>
                      <div class="flex items-center gap-2">
                        <button 
                          @click="cancelReply"
                          class="px-2.5 md:px-3 py-1.5 text-xs md:text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          @click="submitReply(comment.id)"
                          :disabled="!replyContent.trim() || replyContent.length > 500 || submittingReply"
                          class="px-3 md:px-4 py-1.5 bg-[#F8CB00] text-black rounded-lg hover:bg-yellow-500 disabled:opacity-50 transition-colors text-xs md:text-sm font-medium"
                        >
                          {{ submittingReply ? 'Posting...' : 'Reply' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Nested Replies -->
              <div 
                v-if="showReplies[comment.id] && comment.replies && comment.replies.length > 0" 
                class="mt-4 md:mt-6 ml-10 md:ml-14 space-y-3 md:space-y-4 border-l-2 border-[#F8CB00] pl-4 md:pl-6"
              >
                <div 
                  v-for="reply in comment.replies" 
                  :key="reply.id"
                  class="p-3 md:p-4 bg-gray-50 rounded-lg"
                >
                  <div class="flex gap-3">
                    <img 
                      :src="reply.creator?.image_url || '/default-avatar.png'" 
                      :alt="reply.creator?.name" 
                      class="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    
                    <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="font-medium text-gray-900 text-xs md:text-sm">
                        {{ reply.creator?.name || 'Anonymous' }}
                      </span>
                      <span class="text-[10px] md:text-xs text-gray-500">
                        {{ formatDate(reply.created_at) }}
                      </span>
                    </div>
                    
                    <div class="text-gray-700 text-xs md:text-sm whitespace-pre-wrap mb-2">
                      {{ reply.content }}
                    </div>
                    
                    <div class="flex items-center gap-3">
                        
                        
                        <div class="relative" v-if="canDeleteComment(reply)">
                          <button 
                            @click="toggleCommentMenu(reply.id)"
                            class="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                          >
                            <MoreVertical class="w-3 h-3" />
                          </button>
                          
                          <div 
                            v-if="activeCommentMenu === reply.id"
                            class="absolute right-0 top-6 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
                          >
                            <button 
                              @click="deleteComment(reply)"
                              class="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 text-xs"
                            >
                              <Trash2 class="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Load More Comments -->
          <div v-if="comments?.current_page < comments?.total_pages" class="p-4 md:p-6 text-center border-t border-gray-200">
            <button 
              @click="loadMoreComments"
              :disabled="loadingMore"
              class="px-5 md:px-6 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 rounded-lg transition-colors disabled:opacity-50 text-sm md:text-base font-medium"
            >
              {{ loadingMore ? 'Loading...' : 'Load More Replies' }}
            </button>
          </div>
        </div>

        <!-- No Comments -->
        <div v-else class="p-12 text-center">
          <MessageCircle class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">No replies yet</h3>
          <p class="text-gray-500">Be the first to share your thoughts!</p>
        </div>
      </div>

      <!-- Main Reply Form -->
      <div 
        v-if="!forum_details.is_locked" 
        ref="replyForm" 
        class="mt-6 md:mt-8 bg-white rounded-lg md:rounded-xl border border-gray-200 shadow-sm p-4 md:p-6"
      >
        <div class="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <div class="w-7 h-7 md:w-8 md:h-8 bg-[#F8CB00]/20 rounded-lg flex items-center justify-center">
            <Send class="w-4 h-4 text-[#F8CB00]" />
          </div>
          <h3 class="text-base md:text-lg font-semibold text-gray-900">Add Your Reply</h3>
        </div>

        <div class="flex gap-3 md:gap-4">
          <img 
            :src="authuser?.image_url || '/default-avatar.png'" 
            :alt="authuser?.name" 
            class="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover flex-shrink-0"
          />
          
          <div class="flex-1">
            <textarea
              v-model="mainReplyContent"
              placeholder="Add a reply to this discussion..."
              rows="4"
              class="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#F8CB00] focus:border-transparent bg-white text-gray-900 placeholder-gray-500 text-sm md:text-base"
            ></textarea>
            
            <div class="flex items-center justify-between mt-3 md:mt-4">
              <span class="text-xs md:text-sm text-gray-500">{{ mainReplyContent.length }}/1000</span>
              <button 
                @click="submitMainReply"
                :disabled="!mainReplyContent.trim() || mainReplyContent.length > 1000 || submittingMainReply"
                class="inline-flex items-center px-5 md:px-6 py-2 bg-[#F8CB00] text-black rounded-lg hover:bg-yellow-500 disabled:opacity-50 transition-colors font-medium text-sm md:text-base"
              >
                <Send class="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                {{ submittingMainReply ? 'Posting...' : 'Post Reply' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12 md:py-20 px-4">
      <MessageCircle class="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 md:mb-4" />
      <h3 class="text-lg md:text-xl font-semibold text-gray-900 mb-2">Discussion Not Found</h3>
      <p class="text-sm md:text-base text-gray-600 mb-4 md:mb-6">The discussion you're looking for doesn't exist or has been removed.</p>
      <button 
        @click="$router.go(-1)"
        class="px-5 md:px-6 py-2.5 md:py-3 bg-[#F8CB00] text-black rounded-lg hover:bg-yellow-500 transition-colors font-medium text-sm md:text-base"
      >
        Go Back
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { 
  ArrowLeft, Pin, Flame, Lock, Share, Bookmark, Eye, MessageCircle, 
  Heart, Send, MoreVertical, Trash2, ChevronDown
} from 'lucide-vue-next';

const store = useStore();
const route = useRoute();

// State
const isLoading = ref(true);
const commentsLoading = ref(false);
const loadingMore = ref(false);
const submittingReply = ref(false);
const submittingMainReply = ref(false);
const mainReplyContent = ref('');
const replyContent = ref('');
const replyingTo = ref(null);
const sortBy = ref('created_at');
const isLiked = ref(false);
const activeCommentMenu = ref(null);
const replyForm = ref(null);
const showReplies = ref({});

// Computed
const forum_details = computed(() => store.getters.forum_details);
const comments = computed(() => store.getters.comments);
const authuser = computed(() => store.getters.authuser);

// Filter main comments (replies to the forum post, not replies to comments)
const mainComments = computed(() => {
  if (!comments.value?.data) return [];
  return comments.value.data.filter(comment => comment.reply_to === null);
});

// Methods
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);
  
  if (diffInHours < 1) {
    return `${Math.floor((now - date) / (1000 * 60))}m ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}h ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
};

const loadForumDetails = async () => {
  isLoading.value = true;
  try {
    await store.dispatch('fetch_forum_details_by_slug', route.params.id);
    await loadComments();
  } catch (error) {
    console.error('Failed to load forum details:', error);
  } finally {
    isLoading.value = false;
  }
};

const loadComments = async () => {
  if (!forum_details.value?.id) return;
  
  commentsLoading.value = true;
  try {
    const data = {
      forum_id: forum_details.value.id,
      page: 1,
      per_page: 20,
      order_by: sortBy.value
    };
    await store.dispatch('fetch_forum_comments', data);
  } catch (error) {
    console.error('Failed to load comments:', error);
  } finally {
    commentsLoading.value = false;
  }
};

const loadMoreComments = async () => {
  if (!comments.value || loadingMore.value) return;
  
  loadingMore.value = true;
  try {
    const data = {
      forum_id: forum_details.value.id,
      page: comments.value.current_page + 1,
      per_page: 20,
      order_by: sortBy.value
    };
    
    const response = await store.dispatch('fetch_forum_comments', data);
    const currentComments = comments.value.data || [];
    store.commit('setcomments', {
      ...response.data.data,
      data: [...currentComments, ...response.data.data.data]
    });
  } catch (error) {
    console.error('Failed to load more comments:', error);
  } finally {
    loadingMore.value = false;
  }
};

const submitMainReply = async () => {
  if (!mainReplyContent.value.trim() || submittingMainReply.value) return;
  
  submittingMainReply.value = true;
  try {
    const data = {
      forum_id: forum_details.value.id,
      content: mainReplyContent.value.trim(),
      reply_to: null
    };
    
    await store.dispatch('create_forum_comment', data);
    mainReplyContent.value = '';
    await loadComments();
  } catch (error) {
    console.error('Failed to submit reply:', error);
  } finally {
    submittingMainReply.value = false;
  }
};

const replyToComment = (comment) => {
  replyingTo.value = comment.id;
  replyContent.value = '';
};

const cancelReply = () => {
  replyingTo.value = null;
  replyContent.value = '';
};

const submitReply = async (commentId) => {
  if (!replyContent.value.trim() || submittingReply.value) return;
  
  submittingReply.value = true;
  try {
    const data = {
      forum_id: forum_details.value.id,
      content: replyContent.value.trim(),
      reply_to: commentId
    };
    
    await store.dispatch('create_forum_comment', data);
    replyContent.value = '';
    replyingTo.value = null;
    await loadComments();
  } catch (error) {
    console.error('Failed to submit reply:', error);
  } finally {
    submittingReply.value = false;
  }
};

const toggleReplies = (commentId) => {
  showReplies.value[commentId] = !showReplies.value[commentId];
};

const toggleLike = () => {
  isLiked.value = !isLiked.value;
};

const toggleCommentLike = (comment) => {
  console.log('Toggle like for comment:', comment.id);
};

const canDeleteComment = (comment) => {
  return authuser.value && (
    authuser.value.id === comment.created_by || 
    authuser.value.role === 'admin' ||
    authuser.value.role === 'moderator'
  );
};

const toggleCommentMenu = (commentId) => {
  activeCommentMenu.value = activeCommentMenu.value === commentId ? null : commentId;
};


const scrollToDiscussion = () => {
  document.getElementById('discussion-content').scrollIntoView({ 
    behavior: 'smooth',
    block: 'start'
  });
};

const deleteComment = async (comment) => {
  if (!confirm('Are you sure you want to delete this comment?')) return;
  
  try {
    let data = {
      comment_id: comment.id,
      forum_id: forum_details.value.id
    };
    await store.dispatch('delete_forum_comment', data);
    await loadComments();
    activeCommentMenu.value = null;
  } catch (error) {
    console.error('Failed to delete comment:', error);
  }
};

const scrollToReply = () => {
  if (replyForm.value) {
    replyForm.value.scrollIntoView({ behavior: 'smooth' });
  }
};

// Close comment menu when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    activeCommentMenu.value = null;
  }
};

onMounted(() => {
  loadForumDetails();
  document.addEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.comment-thread {
  scroll-margin-top: 80px;
}

/* Floating animation */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Pulse animation */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Loading animation */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Gradient border effect */
.border-gradient-to-b {
  background: linear-gradient(to bottom, #F8CB00, #eab308);
  width: 2px;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(51, 65, 85, 0.3);
}

::-webkit-scrollbar-thumb {
  background: rgba(248, 203, 0, 0.6);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(248, 203, 0, 0.8);
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Focus styles */
button:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: 2px solid #F8CB00;
  outline-offset: 2px;
}

/* Backdrop blur fallback */
@supports not (backdrop-filter: blur(12px)) {
  .backdrop-blur-xl {
    background-color: rgba(30, 41, 59, 0.9);
  }
  
  .backdrop-blur-sm {
    background-color: rgba(30, 41, 59, 0.8);
  }
}

/* Glass morphism effect */
.glass-effect {
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(to right, #F8CB00, #eab308);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Card hover effects */
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

/* Button animations */
.btn-primary {
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn-primary:hover::before {
  left: 100%;
}

/* Status badge glow */
.badge-glow {
  box-shadow: 0 0 20px rgba(248, 203, 0, 0.3);
}

/* Typing indicator */
@keyframes typing {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-10px); }
}

.typing-indicator {
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator:nth-child(3) {
  animation-delay: 0.4s;
}

/* Loading dots */
@keyframes loading-dots {
  0%, 20% { opacity: 0; }
  50% { opacity: 1; }
  80%, 100% { opacity: 0; }
}

.loading-dots span {
  animation: loading-dots 1.4s infinite ease-in-out;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

/* Responsive design */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .p-8 {
    padding: 1.5rem;
  }
  
  .px-8 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .text-3xl {
    font-size: 1.75rem;
    line-height: 2.25rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
  
  .space-x-6 > :not([hidden]) ~ :not([hidden]) {
    margin-left: 1rem;
  }
  
  .ml-16 {
    margin-left: 2rem;
  }
}

@media (max-width: 640px) {
  .p-8 {
    padding: 1rem;
  }
  
  .px-8 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .space-x-4 > :not([hidden]) ~ :not([hidden]) {
    margin-left: 0.75rem;
  }
  
  .ml-16 {
    margin-left: 1rem;
  }
  
  .text-3xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .border-slate-700 {
    border-color: rgb(100, 116, 139);
  }
  
  button {
    border: 2px solid currentColor;
  }
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  * {
    background: white !important;
    color: black !important;
  }
}
</style>