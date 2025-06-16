<template>
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 pt-28">
      <!-- Clean Header -->
      <div class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-50">
        <div class="mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <button 
                @click="$router.go(-1)"
                class="flex items-center space-x-2 px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft class="w-4 h-4" />
                <span class="font-medium">Back to Forums</span>
              </button>
              
              <div class="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
              
              <div>
                <h1 class="text-lg font-semibold text-slate-900 dark:text-white">Discussion</h1>
                <p class="text-sm text-slate-500 dark:text-slate-400">Community Forum</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <button class="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <Share class="w-5 h-5" />
              </button>
              <button class="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <Bookmark class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="w-8 h-8 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
  
      <!-- Main Content -->
      <div v-else-if="forum_details" class="max-w-5xl mx-auto px-6 py-8">
        <!-- Original Post -->
        <article class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
          <div class="p-8">
            <!-- Post Header -->
            <div class="flex items-start space-x-4 mb-6">
              <div class="relative">
                <img 
                  :src="forum_details.creator?.image_url || '/default-avatar.png'" 
                  :alt="forum_details.creator?.name" 
                  class="w-12 h-12 rounded-full object-cover"
                />
                <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center space-x-3 mb-2">
                  <h3 class="font-semibold text-slate-900 dark:text-white">
                    {{ forum_details.creator?.name || 'Anonymous' }}
                  </h3>
                  <span class="text-sm text-slate-500 dark:text-slate-400">
                    {{ formatDate(forum_details.created_at) }}
                  </span>
                  
                  <!-- Status Badges -->
                  <div class="flex items-center space-x-2">
                    <span v-if="forum_details.is_pinned" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                      <Pin class="w-3 h-3 mr-1" />
                      Pinned
                    </span>
                    <span v-if="forum_details.is_hot" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                      <Flame class="w-3 h-3 mr-1" />
                      Hot
                    </span>
                    <span v-if="forum_details.is_locked" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                      <Lock class="w-3 h-3 mr-1" />
                      Locked
                    </span>
                  </div>
                </div>
                
                <!-- Post Title -->
                <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                  {{ forum_details.title }}
                </h2>
                
                <!-- Post Content -->
                <div class="prose prose-slate dark:prose-invert max-w-none mb-6">
                  <p class="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {{ forum_details.body }}
                  </p>
                </div>
              </div>
            </div>
  
            <!-- Post Stats and Actions -->
            <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
                  <div class="flex items-center space-x-2">
                    <Eye class="w-4 h-4" />
                    <span>{{ forum_details.views_count || 0 }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <MessageCircle class="w-4 h-4" />
                    <span>{{ forum_details.comments_count || 0 }}</span>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Heart class="w-4 h-4" />
                    <span>{{ forum_details.likes_count || 0 }}</span>
                  </div>
                </div>
                
                <div class="flex items-center space-x-3">
                  <button 
                    @click="toggleLike"
                    class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    :class="isLiked 
                      ? 'text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30' 
                      : 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'"
                  >
                    <Heart class="w-4 h-4 mr-2" :class="{ 'fill-current': isLiked }" />
                    {{ isLiked ? 'Liked' : 'Like' }}
                  </button>
                  
                  <button 
                    v-if="!forum_details.is_locked"
                    @click="scrollToReply"
                    class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
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
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <!-- Comments Header -->
          <div class="px-8 py-6 border-b border-slate-200 dark:border-slate-700">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                Replies ({{ mainComments.length }})
              </h3>
              
              <select 
                v-model="sortBy"
                @change="loadComments"
                class="px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="created_at">Latest First</option>
                <option value="likes">Most Liked</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
  
          <!-- Comments Loading -->
          <div v-if="commentsLoading" class="flex justify-center items-center py-12">
            <div class="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
  
          <!-- Comments List -->
          <div v-else-if="mainComments.length > 0" class="divide-y divide-slate-200 dark:divide-slate-700">
            <div 
              v-for="comment in mainComments" 
              :key="comment.id"
              class="comment-thread"
            >
              <!-- Main Comment -->
              <div class="p-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div class="flex space-x-4">
                  <div class="relative flex-shrink-0">
                    <img 
                      :src="comment.creator?.image_url || '/default-avatar.png'" 
                      :alt="comment.creator?.name" 
                      class="w-10 h-10 rounded-full object-cover"
                    />
                    <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center space-x-3 mb-2">
                      <span class="font-medium text-slate-900 dark:text-white">
                        {{ comment.creator?.name || 'Anonymous' }}
                      </span>
                      <span class="text-sm text-slate-500 dark:text-slate-400">
                        {{ formatDate(comment.created_at) }}
                      </span>
                    </div>
                    
                    <div class="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed whitespace-pre-wrap">
                      {{ comment.content }}
                    </div>
                    
                    <!-- Comment Actions -->
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-4">
                        <button 
                          @click="toggleCommentLike(comment)"
                          class="flex items-center space-x-1 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
                        >
                          <Heart class="w-4 h-4" />
                          <span>{{ comment.likes_count || 0 }}</span>
                        </button>
                        
                        <button 
                          v-if="comment.replies_count > 0"
                          @click="toggleReplies(comment.id)"
                          class="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors"
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
                          class="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
                        >
                          Reply
                        </button>
                      </div>
                      
                      <div class="relative" v-if="canDeleteComment(comment)">
                        <button 
                          @click="toggleCommentMenu(comment.id)"
                          class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded transition-colors"
                        >
                          <MoreVertical class="w-4 h-4" />
                        </button>
                        
                        <div 
                          v-if="activeCommentMenu === comment.id"
                          class="absolute right-0 top-8 w-32 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg z-20"
                        >
                          <button 
                            @click="deleteComment(comment)"
                            class="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center space-x-2 text-sm"
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
                  class="mt-6 ml-14 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700"
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
                        class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                      ></textarea>
                      
                      <div class="flex items-center justify-between mt-3">
                        <span class="text-xs text-slate-500 dark:text-slate-400">{{ replyContent.length }}/500</span>
                        <div class="flex items-center space-x-2">
                          <button 
                            @click="cancelReply"
                            class="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                          <button 
                            @click="submitReply(comment.id)"
                            :disabled="!replyContent.trim() || replyContent.length > 500 || submittingReply"
                            class="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
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
                  class="mt-6 ml-14 space-y-4 border-l-2 border-slate-200 dark:border-slate-700 pl-6"
                >
                  <div 
                    v-for="reply in comment.replies" 
                    :key="reply.id"
                    class="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-lg"
                  >
                    <div class="flex space-x-3">
                      <img 
                        :src="reply.creator?.image_url || '/default-avatar.png'" 
                        :alt="reply.creator?.name" 
                        class="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center space-x-2 mb-1">
                          <span class="font-medium text-slate-900 dark:text-white text-sm">
                            {{ reply.creator?.name || 'Anonymous' }}
                          </span>
                          <span class="text-xs text-slate-500 dark:text-slate-400">
                            {{ formatDate(reply.created_at) }}
                          </span>
                        </div>
                        
                        <div class="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap mb-2">
                          {{ reply.content }}
                        </div>
                        
                        <div class="flex items-center space-x-3">
                          <button 
                            @click="toggleCommentLike(reply)"
                            class="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
                          >
                            <Heart class="w-3 h-3" />
                            <span>{{ reply.likes_count || 0 }}</span>
                          </button>
                          
                          <div class="relative" v-if="canDeleteComment(reply)">
                            <button 
                              @click="toggleCommentMenu(reply.id)"
                              class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded transition-colors"
                            >
                              <MoreVertical class="w-3 h-3" />
                            </button>
                            
                            <div 
                              v-if="activeCommentMenu === reply.id"
                              class="absolute right-0 top-6 w-32 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg z-20"
                            >
                              <button 
                                @click="deleteComment(reply)"
                                class="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center space-x-2 text-xs"
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
            <div v-if="comments?.current_page < comments?.total_pages" class="p-6 text-center border-t border-slate-200 dark:border-slate-700">
              <button 
                @click="loadMoreComments"
                :disabled="loadingMore"
                class="px-6 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg transition-colors disabled:opacity-50 text-sm font-medium"
              >
                {{ loadingMore ? 'Loading...' : 'Load More Replies' }}
              </button>
            </div>
          </div>
  
          <!-- No Comments -->
          <div v-else class="p-12 text-center">
            <MessageCircle class="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-2">No replies yet</h3>
            <p class="text-slate-500 dark:text-slate-400">Be the first to share your thoughts!</p>
          </div>
        </div>
  
        <!-- Main Reply Form -->
        <div 
          v-if="!forum_details.is_locked" 
          ref="replyForm" 
          class="mt-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6"
        >
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
                class="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
              ></textarea>
              
              <div class="flex items-center justify-between mt-4">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ mainReplyContent.length }}/1000</span>
                <button 
                  @click="submitMainReply"
                  :disabled="!mainReplyContent.trim() || mainReplyContent.length > 1000 || submittingMainReply"
                  class="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
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
        <MessageCircle class="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">Discussion Not Found</h3>
        <p class="text-slate-600 dark:text-slate-400 mb-6">The discussion you're looking for doesn't exist or has been removed.</p>
        <button 
          @click="$router.go(-1)"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .dark\:bg-slate-900 {
    background-color: rgb(15 23 42);
  }
  
  .dark\:bg-slate-800 {
    background-color: rgb(30 41 59);
  }
  
  .dark\:bg-slate-700 {
    background-color: rgb(51 65 85);
  }
  
  .dark\:text-white {
    color: rgb(255 255 255);
  }
  
  .dark\:text-slate-300 {
    color: rgb(203 213 225);
  }
  
  .dark\:text-slate-400 {
    color: rgb(148 163 184);
  }
  
  .dark\:border-slate-700 {
    border-color: rgb(51 65 85);
  }
  
  .dark\:border-slate-600 {
    border-color: rgb(71 85 105);
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgb(148 163 184);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgb(100 116 139);
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
  outline: 2px solid rgb(59 130 246);
  outline-offset: 2px;
}

/* Hover animations */
button:hover:not(:disabled) {
  transform: translateY(-1px);
}

button:active:not(:disabled) {
  transform: translateY(0);
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

/* Responsive design */
@media (max-width: 640px) {
  .max-w-5xl {
    max-width: 100%;
  }
  
  .px-6 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .p-8 {
    padding: 1.5rem;
  }
  
  .text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }
  
  .text-lg {
    font-size: 1rem;
    line-height: 1.5rem;
  }
}

/* Prose styling for content */
.prose {
  max-width: none;
}

.prose p {
  margin-bottom: 1rem;
}

.prose-slate {
  --tw-prose-body: rgb(51 65 85);
  --tw-prose-headings: rgb(15 23 42);
  --tw-prose-lead: rgb(100 116 139);
  --tw-prose-links: rgb(59 130 246);
  --tw-prose-bold: rgb(15 23 42);
  --tw-prose-counters: rgb(100 116 139);
  --tw-prose-bullets: rgb(203 213 225);
  --tw-prose-hr: rgb(226 232 240);
  --tw-prose-quotes: rgb(15 23 42);
  --tw-prose-quote-borders: rgb(226 232 240);
  --tw-prose-captions: rgb(100 116 139);
  --tw-prose-code: rgb(15 23 42);
  --tw-prose-pre-code: rgb(226 232 240);
  --tw-prose-pre-bg: rgb(15 23 42);
  --tw-prose-th-borders: rgb(203 213 225);
  --tw-prose-td-borders: rgb(226 232 240);
}

.prose-invert {
  --tw-prose-body: rgb(203 213 225);
  --tw-prose-headings: rgb(248 250 252);
  --tw-prose-lead: rgb(148 163 184);
  --tw-prose-links: rgb(129 140 248);
  --tw-prose-bold: rgb(248 250 252);
  --tw-prose-counters: rgb(148 163 184);
  --tw-prose-bullets: rgb(100 116 139);
  --tw-prose-hr: rgb(71 85 105);
  --tw-prose-quotes: rgb(248 250 252);
  --tw-prose-quote-borders: rgb(71 85 105);
  --tw-prose-captions: rgb(148 163 184);
  --tw-prose-code: rgb(248 250 252);
  --tw-prose-pre-code: rgb(226 232 240);
  --tw-prose-pre-bg: rgb(0 0 0 / 50%);
  --tw-prose-th-borders: rgb(71 85 105);
  --tw-prose-td-borders: rgb(51 65 85);
}

/* Button variants */
.btn-primary {
  background-color: rgb(37 99 235);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 150ms;
}

.btn-primary:hover {
  background-color: rgb(29 78 216);
}

.btn-secondary {
  background-color: rgb(241 245 249);
  color: rgb(51 65 85);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: background-color 150ms;
}

.btn-secondary:hover {
  background-color: rgb(226 232 240);
}

/* Card styling */
.card {
  background-color: white;
  border-radius: 0.75rem;
  border: 1px solid rgb(226 232 240);
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

@media (prefers-color-scheme: dark) {
  .card {
    background-color: rgb(30 41 59);
    border-color: rgb(51 65 85);
  }
}

/* Status badge styles */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-yellow {
  background-color: rgb(254 249 195);
  color: rgb(146 64 14);
}

.badge-red {
  background-color: rgb(254 226 226);
  color: rgb(153 27 27);
}

.badge-gray {
  background-color: rgb(241 245 249);
  color: rgb(51 65 85);
}

@media (prefers-color-scheme: dark) {
  .badge-yellow {
    background-color: rgb(113 63 18 / 0.2);
    color: rgb(251 191 36);
  }
  
  .badge-red {
    background-color: rgb(153 27 27 / 0.2);
    color: rgb(248 113 113);
  }
  
  .badge-gray {
    background-color: rgb(51 65 85);
    color: rgb(203 213 225);
  }
}

/* Avatar styles */
.avatar {
  display: inline-block;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-sm {
  width: 2rem;
  height: 2rem;
}

.avatar-lg {
  width: 3rem;
  height: 3rem;
}

/* Form control styles */
.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgb(209 213 219);
  border-radius: 0.5rem;
  background-color: white;
  color: rgb(17 24 39);
}

.form-control:focus {
  outline: none;
  ring: 2px;
  ring-color: rgb(59 130 246);
  border-color: transparent;
}

@media (prefers-color-scheme: dark) {
  .form-control {
    background-color: rgb(30 41 59);
    border-color: rgb(75 85 99);
    color: white;
  }
}

/* Typography improvements */
.text-muted {
  color: rgb(107 114 128);
}

@media (prefers-color-scheme: dark) {
  .text-muted {
    color: rgb(156 163 175);
  }
}

/* Interactive elements */
.interactive:hover {
  background-color: rgb(249 250 251);
}

@media (prefers-color-scheme: dark) {
  .interactive:hover {
    background-color: rgb(30 41 59 / 0.5);
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
  .card {
    border-width: 2px;
  }
  
  button {
    border: 2px solid currentColor;
  }
}
</style>