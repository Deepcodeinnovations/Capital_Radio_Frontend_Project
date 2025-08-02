<template>
  <div class="min-h-screen bg-gray-50">
    <section class="relative min-h-[70vh] flex items-center justify-center overflow-hidden" style="margin-top: 5rem !important;">
      <!-- Background Image with Overlay -->
      <div class="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Community Discussion" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-black/60"></div>
      </div>

      <!-- Clean geometric background -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-10 w-20 h-20 bg-red-600 transform rotate-45"></div>
        <div class="absolute bottom-40 right-20 w-16 h-16 bg-white"></div>
        <div class="absolute top-1/2 left-1/4 w-12 h-12 bg-red-600"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 container mx-auto px-6 text-center">
        <!-- Hero Badge -->
        <div class="inline-block bg-red-600 text-white px-6 py-2 mb-8 transform -rotate-1 border-2 border-black">
          <span class="font-black text-sm tracking-widest uppercase">Community Discussion</span>
        </div>

        <!-- Main Heading -->
        <h1 class="text-6xl font-black text-white mb-6 leading-none">
          FORUM
          <span class="block text-red-600">DISCUSSION</span>
        </h1>

        <!-- Subtitle -->
        <p class="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
          Join the conversation with fellow Beat FM listeners
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            @click="$router.go(-1)"
            class="bg-white text-black font-bold px-8 py-4 border-2 border-black hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 tracking-wider uppercase"
          >
            <span>Back to Forums</span>
          </button>
          
          <button 
            @click="scrollToDiscussion"
            class="bg-red-600 text-white font-bold px-8 py-4 border-2 border-black hover:bg-red-700 transition-all duration-300 transform hover:scale-105 tracking-wider uppercase flex items-center gap-3"
          >
            <MessageCircle :size="20" />
            <span>Join Discussion</span>
          </button>
        </div>
      </div>

      <!-- Sharp Bottom Divider -->
      <div class="absolute bottom-0 left-0 w-full overflow-hidden" style="transform: translateY(1px);">
        <svg class="w-full h-auto" preserveAspectRatio="none" viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="forumDetailWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color:#DC2626;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#000000;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#DC2626;stop-opacity:1" />
            </linearGradient>
          </defs>
          <path d="M0,60 C200,100 400,20 600,60 C800,100 1000,20 1200,60 L1200,120 L0,120 Z" fill="url(#forumDetailWaveGradient)"></path>
          <path d="M0,80 C300,40 600,100 900,80 C1000,70 1100,90 1200,80 L1200,120 L0,120 Z" fill="rgb(249 250 251)" opacity="0.9"></path>
        </svg>
      </div>
    </section>

    <!-- Clean Header -->
    <div class="bg-white border-b-2 border-black sticky top-0 z-50">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <!-- Breadcrumb -->
          <div class="flex items-center space-x-4 mb-8">
            <button 
              @click="$router.go(-1)"
              class="flex items-center space-x-2 px-4 py-2 text-black hover:text-red-600 border border-black hover:border-red-600 transition-colors font-bold uppercase tracking-wider"
            >
              <ArrowLeft class="w-4 h-4" />
              <span>Back to Forums</span>
            </button>
            
            <div class="h-6 w-px bg-black"></div>
            
            <div>
              <h1 class="text-lg font-black text-black uppercase tracking-wider">Discussion</h1>
              <p class="text-sm text-gray-600 font-bold uppercase tracking-wider">Community Forum</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <button class="p-3 text-black hover:text-red-600 border border-black hover:border-red-600 transition-colors">
              <Share class="w-5 h-5" />
            </button>
            <button class="p-3 text-black hover:text-red-600 border border-black hover:border-red-600 transition-colors">
              <Bookmark class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="w-12 h-12 border-4 border-gray-300 border-t-red-600 animate-spin"></div>
    </div>

    <!-- Main Content -->
    <div v-else-if="forum_details" class="max-w-4xl mx-auto px-6 py-8">
      <!-- Original Post -->
      <article id="discussion-content" class="bg-white border-2 border-black shadow-lg mb-8 overflow-hidden hover:border-red-600 transition-all">
        <div class="p-8">
          <!-- Post Header -->
          <div class="flex items-start space-x-4 mb-6">
            <div class="relative">
              <img 
                :src="forum_details.creator?.image_url || '/default-avatar.png'" 
                :alt="forum_details.creator?.name" 
                class="w-12 h-12 object-cover border-2 border-black"
              />
              <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-red-600 border-2 border-white"></div>
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-3 mb-2">
                <h3 class="font-black text-black uppercase tracking-wider">
                  {{ forum_details.creator?.name || 'Anonymous' }}
                </h3>
                <span class="text-sm text-gray-600 font-bold uppercase tracking-wider">
                  {{ formatDate(forum_details.created_at) }}
                </span>
                
                <!-- Status Badges -->
                <div class="flex items-center space-x-2">
                  <span v-if="forum_details.is_pinned" class="bg-red-600 text-white px-3 py-1 text-xs font-black tracking-wider uppercase border-2 border-black flex items-center gap-1">
                    <Pin class="w-3 h-3" />
                    Pinned
                  </span>
                  <span v-if="forum_details.is_hot" class="bg-black text-white px-3 py-1 text-xs font-black tracking-wider uppercase border-2 border-black flex items-center gap-1">
                    <Flame class="w-3 h-3" />
                    Hot
                  </span>
                </div>
              </div>
              
              <!-- Post Title -->
              <h2 class="text-2xl font-black text-black mb-4 leading-tight uppercase tracking-wide">
                {{ forum_details.title }}
              </h2>
              
              <!-- Post Content -->
              <div class="prose prose-gray max-w-none mb-6">
                <p class="text-black leading-relaxed whitespace-pre-wrap font-medium">
                  {{ forum_details.body }}
                </p>
              </div>
            </div>
          </div>

          <!-- Post Stats and Actions -->
          <div class="border-t-2 border-black pt-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-6 text-sm text-black font-bold">
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
                  class="bg-red-600 text-white px-4 py-2 border-2 border-black hover:bg-red-700 transition-colors text-sm font-black uppercase tracking-wider flex items-center gap-2"
                >
                  <MessageCircle class="w-4 h-4" />
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- Comments Section -->
      <div class="bg-white border-2 border-black shadow-lg">
        <!-- Comments Header -->
        <div class="px-8 py-6 border-b-2 border-black bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-red-600 border-2 border-black flex items-center justify-center">
                <MessageCircle class="w-5 h-5 text-white" />
              </div>
              <h3 class="text-lg font-black text-black uppercase tracking-wider">
                Replies ({{ mainComments.length }})
              </h3>
            </div>
            
            <select 
              v-model="sortBy"
              @change="loadComments"
              class="px-3 py-2 text-sm border-2 border-black bg-white text-black focus:outline-none focus:border-red-600 font-bold uppercase tracking-wider"
            >
              <option value="created_at">LATEST FIRST</option>
              <option value="likes">MOST LIKED</option>
              <option value="oldest">OLDEST FIRST</option>
            </select>
          </div>
        </div>

        <!-- Comments Loading -->
        <div v-if="commentsLoading" class="flex justify-center items-center py-12">
          <div class="w-12 h-12 border-4 border-gray-300 border-t-red-600 animate-spin"></div>
        </div>

        <!-- Comments List -->
        <div v-else-if="mainComments.length > 0" class="divide-y-2 divide-black">
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
                    class="w-10 h-10 object-cover border-2 border-black"
                  />
                  <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-red-600 border-2 border-white"></div>
                </div>
                
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-3 mb-2">
                    <span class="font-black text-black uppercase tracking-wider">
                      {{ comment.creator?.name || 'Anonymous' }}
                    </span>
                    <span class="text-sm text-gray-600 font-bold uppercase tracking-wider">
                      {{ formatDate(comment.created_at) }}
                    </span>
                  </div>
                  
                  <div class="text-black mb-4 leading-relaxed whitespace-pre-wrap font-medium">
                    {{ comment.content }}
                  </div>
                  
                  <!-- Comment Actions -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <button 
                        @click="toggleCommentLike(comment)"
                        class="flex items-center space-x-1 text-sm text-black hover:text-red-600 transition-colors font-bold uppercase tracking-wider"
                      >
                        <Heart class="w-4 h-4" />
                        <span>{{ comment.likes_count || 0 }}</span>
                      </button>
                      
                      <button 
                        v-if="comment.replies_count > 0"
                        @click="toggleReplies(comment.id)"
                        class="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 transition-colors font-bold uppercase tracking-wider"
                      >
                        <MessageCircle class="w-4 h-4" />
                        <span>{{ comment.replies_count }} {{ comment.replies_count === 1 ? 'REPLY' : 'REPLIES' }}</span>
                        <ChevronDown 
                          class="w-4 h-4 transition-transform"
                          :class="{ 'rotate-180': showReplies[comment.id] }"
                        />
                      </button>
                      
                      <button 
                        @click="replyToComment(comment)"
                        class="text-sm text-black hover:text-red-600 transition-colors font-bold uppercase tracking-wider"
                      >
                        Reply
                      </button>
                    </div>
                    
                    <div class="relative" v-if="canDeleteComment(comment)">
                      <button 
                        @click="toggleCommentMenu(comment.id)"
                        class="p-1 text-black hover:text-red-600 transition-colors"
                      >
                        <MoreVertical class="w-4 h-4" />
                      </button>
                      
                      <div 
                        v-if="activeCommentMenu === comment.id"
                        class="absolute right-0 top-8 w-32 bg-white border-2 border-black shadow-lg z-20"
                      >
                        <button 
                          @click="deleteComment(comment)"
                          class="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2 text-sm font-bold uppercase tracking-wider"
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
                class="mt-6 ml-14 p-4 bg-gray-50 border-2 border-black"
              >
                <div class="flex space-x-3">
                  <img 
                    :src="authuser?.image_url || '/default-avatar.png'" 
                    :alt="authuser?.name" 
                    class="w-8 h-8 object-cover border border-black flex-shrink-0"
                  />
                  
                  <div class="flex-1">
                    <textarea
                      v-model="replyContent"
                      :placeholder="`REPLY TO ${comment.creator?.name.toUpperCase()}...`"
                      rows="3"
                      class="w-full px-3 py-2 border-2 border-black resize-none focus:outline-none focus:border-red-600 bg-white text-black placeholder-gray-500 font-bold uppercase tracking-wider"
                    ></textarea>
                    
                    <div class="flex items-center justify-between mt-3">
                      <span class="text-xs text-black font-bold uppercase tracking-wider">{{ replyContent.length }}/500</span>
                      <div class="flex items-center space-x-2">
                        <button 
                          @click="cancelReply"
                          class="px-3 py-1.5 text-sm text-black hover:text-red-600 transition-colors font-bold uppercase tracking-wider"
                        >
                          Cancel
                        </button>
                        <button 
                          @click="submitReply(comment.id)"
                          :disabled="!replyContent.trim() || replyContent.length > 500 || submittingReply"
                          class="px-4 py-1.5 bg-red-600 text-white border-2 border-black hover:bg-red-700 disabled:opacity-50 transition-colors text-sm font-black uppercase tracking-wider"
                        >
                          {{ submittingReply ? 'POSTING...' : 'REPLY' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Nested Replies -->
              <div 
                v-if="showReplies[comment.id] && comment.replies && comment.replies.length > 0" 
                class="mt-6 ml-14 space-y-4 border-l-4 border-red-600 pl-6"
              >
                <div 
                  v-for="reply in comment.replies" 
                  :key="reply.id"
                  class="p-4 bg-gray-50 border border-black"
                >
                  <div class="flex space-x-3">
                    <img 
                      :src="reply.creator?.image_url || '/default-avatar.png'" 
                      :alt="reply.creator?.name" 
                      class="w-8 h-8 object-cover border border-black flex-shrink-0"
                    />
                    
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center space-x-2 mb-1">
                        <span class="font-black text-black text-sm uppercase tracking-wider">
                          {{ reply.creator?.name || 'Anonymous' }}
                        </span>
                        <span class="text-xs text-gray-600 font-bold uppercase tracking-wider">
                          {{ formatDate(reply.created_at) }}
                        </span>
                      </div>
                      
                      <div class="text-black text-sm whitespace-pre-wrap mb-2 font-medium">
                        {{ reply.content }}
                      </div>
                      
                      <div class="flex items-center space-x-3">
                        <div class="relative" v-if="canDeleteComment(reply)">
                          <button 
                            @click="toggleCommentMenu(reply.id)"
                            class="p-1 text-black hover:text-red-600 transition-colors"
                          >
                            <MoreVertical class="w-3 h-3" />
                          </button>
                          
                          <div 
                            v-if="activeCommentMenu === reply.id"
                            class="absolute right-0 top-6 w-32 bg-white border-2 border-black shadow-lg z-20"
                          >
                            <button 
                              @click="deleteComment(reply)"
                              class="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2 text-xs font-bold uppercase tracking-wider"
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
          <div v-if="comments?.current_page < comments?.total_pages" class="p-6 text-center border-t-2 border-black">
            <button 
              @click="loadMoreComments"
              :disabled="loadingMore"
              class="px-6 py-3 bg-white hover:bg-gray-100 text-black border-2 border-black hover:border-red-600 transition-colors disabled:opacity-50 text-sm font-black uppercase tracking-wider"
            >
              {{ loadingMore ? 'LOADING...' : 'LOAD MORE REPLIES' }}
            </button>
          </div>
        </div>

        <!-- No Comments -->
        <div v-else class="p-12 text-center">
          <div class="w-20 h-20 bg-gray-200 border-4 border-black flex items-center justify-center mx-auto mb-6">
            <MessageCircle class="w-10 h-10 text-gray-400" />
          </div>
          <h3 class="text-lg font-black text-black mb-2 uppercase tracking-wider">NO REPLIES YET</h3>
          <p class="text-gray-600 font-bold uppercase tracking-wider">BE THE FIRST TO SHARE YOUR THOUGHTS!</p>
        </div>
      </div>

      <!-- Main Reply Form -->
      <div 
        v-if="!forum_details.is_locked" 
        ref="replyForm" 
        class="mt-8 bg-white border-2 border-black shadow-lg p-6"
      >
        <div class="flex items-center gap-3 mb-6">
          <div class="w-8 h-8 bg-red-600 border-2 border-black flex items-center justify-center">
            <Send class="w-4 h-4 text-white" />
          </div>
          <h3 class="text-lg font-black text-black uppercase tracking-wider">ADD YOUR REPLY</h3>
        </div>

        <div class="flex space-x-4">
          <img 
            :src="authuser?.image_url || '/default-avatar.png'" 
            :alt="authuser?.name" 
            class="w-10 h-10 object-cover border-2 border-black flex-shrink-0"
          />
          
          <div class="flex-1">
            <textarea
              v-model="mainReplyContent"
              placeholder="ADD A REPLY TO THIS DISCUSSION..."
              rows="4"
              class="w-full px-4 py-3 border-2 border-black resize-none focus:outline-none focus:border-red-600 bg-white text-black placeholder-gray-500 font-bold"
            ></textarea>
            
            <div class="flex items-center justify-between mt-4">
              <span class="text-sm text-black font-bold uppercase tracking-wider">{{ mainReplyContent.length }}/1000</span>
              <button 
                @click="submitMainReply"
                :disabled="!mainReplyContent.trim() || mainReplyContent.length > 1000 || submittingMainReply"
                class="bg-red-600 text-white px-6 py-2 border-2 border-black hover:bg-red-700 disabled:opacity-50 transition-colors font-black uppercase tracking-wider flex items-center gap-2"
              >
                <Send class="w-4 h-4" />
                {{ submittingMainReply ? 'POSTING...' : 'POST REPLY' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-20">
      <div class="w-20 h-20 bg-gray-200 border-4 border-black flex items-center justify-center mx-auto mb-6">
        <MessageCircle class="w-10 h-10 text-gray-400" />
      </div>
      <h3 class="text-xl font-black text-black mb-2 uppercase tracking-wider">DISCUSSION NOT FOUND</h3>
      <p class="text-gray-600 mb-6 font-bold uppercase tracking-wider">THE DISCUSSION YOU'RE LOOKING FOR DOESN'T EXIST OR HAS BEEN REMOVED.</p>
      <button 
        @click="$router.go(-1)"
        class="px-6 py-3 bg-red-600 text-white border-2 border-black hover:bg-red-700 transition-colors font-black uppercase tracking-wider"
      >
        GO BACK
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
    return `${Math.floor((now - date) / (1000 * 60))}M AGO`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)}H AGO`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    }).toUpperCase();
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
/* Override rounded corners for brutalist design */
* {
  border-radius: 0 !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Ensure sharp geometric shapes */
button, div, input, select, textarea {
  border-radius: 0 !important;
}

.comment-thread {
  scroll-margin-top: 80px;
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

/* Pulse animation */
@keyframes pulse {
  0%, 100% { 
    opacity: 1; 
  }
  50% { 
    opacity: 0.5; 
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #e5e7eb;
  border: 1px solid #000;
}

::-webkit-scrollbar-thumb {
  background: #dc2626;
  border: 1px solid #000;
}

::-webkit-scrollbar-thumb:hover {
  background: #b91c1c;
}

/* Focus styles */
button:focus-visible,
textarea:focus-visible,
select:focus-visible,
input:focus-visible {
  outline: 2px solid #dc2626;
  outline-offset: 2px;
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
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
  
  .text-6xl {
    font-size: 2.5rem;
    line-height: 3rem;
  }
  
  .text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }
  
  .space-x-6 > :not([hidden]) ~ :not([hidden]) {
    margin-left: 1rem;
  }
  
  .ml-14 {
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
  
  .ml-14 {
    margin-left: 1rem;
  }
  
  .text-6xl {
    font-size: 2rem;
    line-height: 2.5rem;
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
  .border-black {
    border-color: #000000;
  }
  
  button {
    border: 2px solid currentColor;
  }
}
</style>