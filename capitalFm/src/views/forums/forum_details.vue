
<template>
  <div class="min-h-screen bg-white">
    <section class="relative min-h-[70vh] flex items-center justify-center overflow-hidden" style="margin-top: -5rem !important;">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Community Discussion" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80"></div>
      </div>

      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden opacity-20">
        <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-[#F8CB00] rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-72 h-72 bg-red-500 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
        <div class="absolute top-1/2 right-1/3 w-48 h-48 bg-blue-500 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 container mx-auto px-6 text-center">
        <!-- Hero Badge -->
        <div class="inline-flex items-center justify-center mb-8">
          <div class="h-px w-12 bg-[#F8CB00]"></div>
          <span class="mx-4 text-[#F8CB00] font-bold tracking-wider text-sm uppercase">Community Discussion</span>
          <div class="h-px w-12 bg-[#F8CB00]"></div>
        </div>

        <!-- Main Heading -->
        <h1 class="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Forum <span class="text-[#F8CB00]">Discussion</span>
        </h1>

        <!-- Subtitle -->
        <p class="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl mx-auto leading-relaxed">
          Join the conversation with fellow Capital FM listeners
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            @click="$router.go(-1)"
            class="bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all duration-300"
          >
            <span class="tracking-wide">Back to Forums</span>
          </button>
          
          <button 
            @click="scrollToDiscussion"
            class="relative group overflow-hidden rounded-2xl"
          >
            <div class="absolute -inset-0.5 bg-gradient-to-r from-[#F8CB00] via-red-500 to-blue-500 rounded-2xl blur opacity-60 group-hover:opacity-80 transition duration-300"></div>
            <div class="relative bg-gradient-to-r from-[#F8CB00] to-red-500 px-8 py-4 rounded-2xl text-black font-bold flex items-center space-x-3 transition-all duration-300">
              <MessageCircle :size="20" />
              <span class="tracking-wide">JOIN DISCUSSION</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Bottom Wave Divider -->
      <div class="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="w-full h-16">
          <path fill="white" d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,31,17,94.98,30.44c64.64,13.91,93.29,29.88,150.17,38.07,65.88,9.2,165.63,17.05,240.88,12.55Z" />
        </svg>
      </div>
    </section>

    <!-- Clean Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-md bg-white/95">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Breadcrumb -->
        <div class="flex items-center space-x-4 mb-8">
          <button 
            @click="$router.go(-1)"
            class="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft class="w-4 h-4" />
            <span class="font-medium">Back to Forums</span>
          </button>
          
          <div class="h-6 w-px bg-gray-200"></div>
          
          <div>
            <h1 class="text-lg font-semibold text-gray-900">Discussion</h1>
            <p class="text-sm text-gray-500">Community Forum</p>
          </div>
        </div>
          
          <div class="flex items-center space-x-2">
            <button class="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <Share class="w-5 h-5" />
            </button>
            <button class="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
              <Bookmark class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="w-8 h-8 border-2 border-gray-300 border-t-[#F8CB00] rounded-full animate-spin"></div>
    </div>

    <!-- Main Content -->
    <div v-else-if="forum_details" class="max-w-4xl mx-auto px-6 py-8">
      <!-- Original Post -->
      <article id="discussion-content" class="bg-white discussion-content rounded-xl border border-gray-200 shadow-sm mb-8 overflow-hidden hover:shadow-md transition-shadow">
        <div class="p-8">
          <!-- Post Header -->
          <div class="flex items-start space-x-4 mb-6">
            <div class="relative">
              <img 
                :src="forum_details.creator?.image_url || '/default-avatar.png'" 
                :alt="forum_details.creator?.name" 
                class="w-12 h-12 rounded-full object-cover"
              />
              <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-3 mb-2">
                <h3 class="font-semibold text-gray-900">
                  {{ forum_details.creator?.name || 'Anonymous' }}
                </h3>
                <span class="text-sm text-gray-500">
                  {{ formatDate(forum_details.created_at) }}
                </span>
                
                <!-- Status Badges -->
                <div class="flex items-center space-x-2">
                  <span v-if="forum_details.is_pinned" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Pin class="w-3 h-3 mr-1" />
                    Pinned
                  </span>
                  <span v-if="forum_details.is_hot" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <Flame class="w-3 h-3 mr-1" />
                    Hot
                  </span>
                 
                </div>
              </div>
              
              <!-- Post Title -->
              <h2 class="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                {{ forum_details.title }}
              </h2>
              
              <!-- Post Content -->
              <div class="prose prose-gray max-w-none mb-6">
                <p class="text-gray-900 leading-relaxed whitespace-pre-wrap">
                  {{ forum_details.body }}
                </p>
              </div>
            </div>
          </div>

          <!-- Post Stats and Actions -->
          <div class="border-t border-gray-200 pt-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-6 text-sm text-gray-500">
                <div class="flex items-center space-x-2">
                  <Eye class="w-4 h-4" />
                  <span>{{ forum_details.views_count || 0 }}</span>
                </div>
                <div class="flex items-center space-x-2">
                  <MessageCircle class="w-4 h-4" />
                  <span>{{ forum_details.comments_count || 0 }}</span>
                </div>
                
              </div>
              
              <div class="flex items-center space-x-3">
             
                <button 
                  @click="scrollToReply"
                  class="inline-flex items-center px-4 py-2 bg-[#F8CB00] text-black rounded-lg hover:bg-[#F8CB00]/90 transition-colors text-sm font-medium"
                >
                  <MessageCircle class="w-4 h-4 mr-2" />
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- Comments Section -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
        <!-- Comments Header -->
        <div class="px-8 py-6 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageCircle class="w-5 h-5 text-blue-600" />
              </div>
              <h3 class="text-lg font-semibold text-gray-900">
                Replies ({{ mainComments.length }})
              </h3>
            </div>
            
            <select 
              v-model="sortBy"
              @change="loadComments"
              class="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#F8CB00] focus:border-transparent"
            >
              <option value="created_at">Latest First</option>
              <option value="likes">Most Liked</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <!-- Comments Loading -->
        <div v-if="commentsLoading" class="flex justify-center items-center py-12">
          <div class="w-6 h-6 border-2 border-gray-300 border-t-[#F8CB00] rounded-full animate-spin"></div>
        </div>

        <!-- Comments List -->
        <div v-else-if="mainComments.length > 0" class="divide-y divide-gray-200">
          <div 
            v-for="comment in mainComments" 
            :key="comment.id"
            class="comment-thread"
          >
            <!-- Main Comment -->
            <div class="p-8 hover:bg-gray-50 transition-colors">
              <div class="flex space-x-4">
                <div class="relative flex-shrink-0">
                  <img 
                    :src="comment.creator?.image_url || '/default-avatar.png'" 
                    :alt="comment.creator?.name" 
                    class="w-10 h-10 rounded-full object-cover"
                  />
                  <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3 mb-2">
                    <span class="font-medium text-gray-900">
                      {{ comment.creator?.name || 'Anonymous' }}
                    </span>
                    <span class="text-sm text-gray-500">
                      {{ formatDate(comment.created_at) }}
                    </span>
                  </div>
                  
                  <div class="text-gray-900 mb-4 leading-relaxed whitespace-pre-wrap">
                    {{ comment.content }}
                  </div>
                  
                  <!-- Comment Actions -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <button 
                        @click="toggleCommentLike(comment)"
                        class="flex items-center space-x-1 text-sm text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Heart class="w-4 h-4" />
                        <span>{{ comment.likes_count || 0 }}</span>
                      </button>
                      
                      <button 
                        v-if="comment.replies_count > 0"
                        @click="toggleReplies(comment.id)"
                        class="flex items-center space-x-1 text-sm text-[#F8CB00] hover:text-yellow-600 transition-colors"
                      >
                        <MessageCircle class="w-4 h-4" />
                        <span>{{ comment.replies_count }} {{ comment.replies_count === 1 ? 'reply' : 'replies' }}</span>
                        <ChevronDown 
                          class="w-4 h-4 transition-transform"
                          :class="{ 'rotate-180': showReplies[comment.id] }"
                        />
                      </button>
                      
                      <button 
                        @click="replyToComment(comment)"
                        class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        Reply
                      </button>
                    </div>
                    
                    <div class="relative" v-if="canDeleteComment(comment)">
                      <button 
                        @click="toggleCommentMenu(comment.id)"
                        class="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                      >
                        <MoreVertical class="w-4 h-4" />
                      </button>
                      
                      <div 
                        v-if="activeCommentMenu === comment.id"
                        class="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
                      >
                        <button 
                          @click="deleteComment(comment)"
                          class="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2 text-sm"
                        >
                          <Trash2 class="w-4 h-4" />
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
                class="mt-6 ml-14 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div class="flex space-x-3">
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
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#F8CB00] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    ></textarea>
                    
                    <div class="flex items-center justify-between mt-3">
                      <span class="text-xs text-gray-500">{{ replyContent.length }}/500</span>
                      <div class="flex items-center space-x-2">
                        <button 
                          @click="cancelReply"
                          class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          @click="submitReply(comment.id)"
                          :disabled="!replyContent.trim() || replyContent.length > 500 || submittingReply"
                          class="px-4 py-1.5 bg-[#F8CB00] text-black rounded-lg hover:bg-[#F8CB00]/90 disabled:opacity-50 transition-colors text-sm font-medium"
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
                class="mt-6 ml-14 space-y-4 border-l-2 border-[#F8CB00] pl-6"
              >
                <div 
                  v-for="reply in comment.replies" 
                  :key="reply.id"
                  class="p-4 bg-gray-50 rounded-lg"
                >
                  <div class="flex space-x-3">
                    <img 
                      :src="reply.creator?.image_url || '/default-avatar.png'" 
                      :alt="reply.creator?.name" 
                      class="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                    
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center space-x-2 mb-1">
                        <span class="font-medium text-gray-900 text-sm">
                          {{ reply.creator?.name || 'Anonymous' }}
                        </span>
                        <span class="text-xs text-gray-500">
                          {{ formatDate(reply.created_at) }}
                        </span>
                      </div>
                      
                      <div class="text-gray-700 text-sm whitespace-pre-wrap mb-2">
                        {{ reply.content }}
                      </div>
                      
                      <div class="flex items-center space-x-3">
                        
                        
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
                              class="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2 text-xs"
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
          <div v-if="comments?.current_page < comments?.total_pages" class="p-6 text-center border-t border-gray-200">
            <button 
              @click="loadMoreComments"
              :disabled="loadingMore"
              class="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
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
        class="mt-8 bg-white rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 bg-[#F8CB00]/20 rounded-lg flex items-center justify-center">
            <Send class="w-4 h-4 text-[#F8CB00]" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Add Your Reply</h3>
        </div>

        <div class="flex space-x-4">
          <img 
            :src="authuser?.image_url || '/default-avatar.png'" 
            :alt="authuser?.name" 
            class="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          
          <div class="flex-1">
            <textarea
              v-model="mainReplyContent"
              placeholder="Add a reply to this discussion..."
              rows="4"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#F8CB00] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
            ></textarea>
            
            <div class="flex items-center justify-between mt-4">
              <span class="text-sm text-gray-500">{{ mainReplyContent.length }}/1000</span>
              <button 
                @click="submitMainReply"
                :disabled="!mainReplyContent.trim() || mainReplyContent.length > 1000 || submittingMainReply"
                class="inline-flex items-center px-6 py-2 bg-[#F8CB00] text-black rounded-lg hover:bg-[#F8CB00]/90 disabled:opacity-50 transition-colors font-medium"
              >
                <Send class="w-4 h-4 mr-2" />
                {{ submittingMainReply ? 'Posting...' : 'Post Reply' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-20">
      <MessageCircle class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-gray-900 mb-2">Discussion Not Found</h3>
      <p class="text-gray-600 mb-6">The discussion you're looking for doesn't exist or has been removed.</p>
      <button 
        @click="$router.go(-1)"
        class="px-6 py-2 bg-[#F8CB00] text-black rounded-lg hover:bg-[#F8CB00]/90 transition-colors font-medium"
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