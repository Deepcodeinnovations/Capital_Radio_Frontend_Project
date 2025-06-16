<template>
  <div class="min-h-screen bg-gray-50 dark:bg-slate-900 px-6">
    <div class="max-w-9xl mx-auto space-y-6">
      <!-- Back Button -->
      <button
        @click="$router.go(-1)"
        class="flex items-center text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
      >
        <ArrowLeftIcon class="w-5 h-5 mr-2" />
        Back to Forums
      </button>

      <!-- Loading State -->
      <div v-if="loading === 'fetchForum'" class="flex justify-center py-12">
        <LoaderIcon class="w-8 h-8 animate-spin text-purple-600" />
      </div>

      <!-- Forum Details -->
      <div v-else-if="forum" class="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        <!-- Forum Header -->
        <div class="p-6 border-b border-gray-200 dark:border-slate-600">
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ forum.title }}</h1>
                <span
                  :class="forum.status ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'"
                  class="px-3 py-1 rounded-full text-sm font-medium"
                >
                  {{ forum.status ? 'Active' : 'Inactive' }}
                </span>
              </div>
              
              <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <div class="flex items-center">
                  <RadioIcon class="w-4 h-4 mr-1" />
                  {{ forum.station?.name || 'Unknown Station' }}
                </div>
                <div class="flex items-center">
                  <UserIcon class="w-4 h-4 mr-1" />
                  {{ forum.creator?.name || 'Unknown Creator' }}
                </div>
                <div class="flex items-center">
                  <CalendarIcon class="w-4 h-4 mr-1" />
                  {{ formatDate(forum.created_at) }}
                </div>
                <div class="flex items-center">
                  <MessageSquareIcon class="w-4 h-4 mr-1" />
                  {{ comments?.data?.length || 0 }} Comments
                </div>
              </div>
              
              <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ forum.body }}</p>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 ml-6">
              <button
                @click="toggleForumStatus"
                :disabled="loading === 'updateForum'"
                class="p-2 rounded-lg transition-colors"
                :class="forum.status 
                  ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900' 
                  : 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900'"
                :title="forum.status ? 'Deactivate Forum' : 'Activate Forum'"
              >
                <ToggleLeftIcon v-if="!forum.status" class="w-5 h-5" />
                <ToggleRightIcon v-else class="w-5 h-5" />
              </button>

              <button
                @click="openEditModal"
                class="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                title="Edit Forum"
              >
                <EditIcon class="w-5 h-5" />
              </button>

              <button
                @click="confirmDeleteForum"
                class="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                title="Delete Forum"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Comments Section -->
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
              Comments ({{ comments?.data?.length || 0 }})
            </h2>
            <button
              @click="refreshComments"
              :disabled="loading === 'fetchComments'"
              class="flex items-center text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
            >
              <RefreshCwIcon :class="loading === 'fetchComments' ? 'animate-spin' : ''" class="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>

          <!-- Chat Container -->
          <div class="border border-gray-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-700 flex flex-col h-[70vh]">
            <!-- Comments List - Scrollable Area -->
            <div 
              ref="commentsContainer"
              class="flex-1 overflow-y-auto p-4 space-y-3"
            >
              <!-- Loading State -->
              <div v-if="loading === 'fetchComments'" class="flex justify-center py-8">
                <LoaderIcon class="w-6 h-6 animate-spin text-purple-600" />
              </div>

              <!-- Comments -->
              <div v-else-if="comments?.data?.length">
                <div
                  v-for="comment in comments.data"
                  :key="comment.id"
                  class="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-200 dark:border-slate-600 shadow-sm mb-2"
                >
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-2">
                        <div class="w-6 h-6 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                          <UserIcon class="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span class="font-medium text-sm text-gray-900 dark:text-white">
                          Admin
                        </span>
                        <span class="text-xs text-gray-500 dark:text-gray-400">
                          {{ formatDateTime(comment.created_at) }}
                        </span>
                        <span
                          v-if="comment.status !== undefined"
                          :class="comment.status ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'"
                          class="px-2 py-0.5 rounded-full text-xs font-medium"
                        >
                          {{ comment.status ? 'Approved' : 'Pending' }}
                        </span>
                      </div>
                      <p class="text-gray-700 dark:text-gray-300 text-sm">{{ comment.content || comment.body }}</p>
                    </div>

                    <!-- Comment Actions -->
                    <div class="flex items-center gap-1 ml-2">
                      <button
                        v-if="comment.status !== undefined"
                        @click="toggleCommentStatus(comment)"
                        :disabled="loading === 'updateComment'"
                        class="p-1 rounded transition-colors"
                        :class="comment.status 
                          ? 'text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900' 
                          : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900'"
                        :title="comment.status ? 'Mark as Pending' : 'Approve Comment'"
                      >
                        <CheckIcon v-if="!comment.status" class="w-3 h-3" />
                        <ClockIcon v-else class="w-3 h-3" />
                      </button>

                      <button
                        @click="confirmDeleteComment(comment)"
                        class="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                        title="Delete Comment"
                      >
                        <TrashIcon class="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- No Comments -->
              <div v-else class="flex flex-col items-center justify-center h-full text-center py-8">
                <MessageSquareIcon class="w-8 h-8 text-gray-400 mb-2" />
                <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-1">No comments yet</h3>
                <p class="text-xs text-gray-600 dark:text-gray-400">Start the conversation below</p>
              </div>
            </div>

            <!-- Add Comment Form - Fixed at Bottom -->
            <div class="border-t border-gray-200 dark:border-slate-600 p-4 bg-white dark:bg-slate-800">
              <form @submit.prevent="createComment" class="space-y-3">
                <!-- Comment and Submit Row -->
                <div class="flex gap-2">
                  <textarea
                    v-model="commentForm.content"
                    required
                    rows="2"
                    class="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    placeholder="Write your comment..."
                    @keydown.enter.ctrl="createComment"
                  ></textarea>
                  <button
                    type="submit"
                    :disabled="loading === 'createComment'"
                    class="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center self-end"
                  >
                    <LoaderIcon v-if="loading === 'createComment'" class="w-4 h-4 animate-spin" />
                    <SendIcon v-else class="w-4 h-4" />
                  </button>
                </div>

                <!-- Status Toggle -->
                <div class="flex items-center justify-between">
                  <label class="flex items-center text-sm">
                    <input
                      v-model="commentForm.status"
                      type="checkbox"
                      class="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
                    />
                    <span class="text-gray-700 dark:text-gray-300">Auto-approve comment</span>
                  </label>
                  <span class="text-xs text-gray-500 dark:text-gray-400">Ctrl+Enter to submit</span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Forum Not Found -->
      <div v-else class="text-center py-12">
        <AlertTriangleIcon class="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Forum not found</h3>
        <p class="text-gray-600 dark:text-gray-400">The forum you're looking for doesn't exist or has been removed</p>
      </div>
    </div>

    <!-- Edit Forum Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="closeEditModal"
    >
      <div
        @click.stop
        class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md mx-4"
      >
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-slate-600">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Edit Forum</h3>
          <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600">
            <XIcon class="w-6 h-6" />
          </button>
        </div>

        <form @submit.prevent="updateForum" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
            <input
              v-model="editForm.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
            <textarea
              v-model="editForm.body"
              required
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="closeEditModal"
              class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading === 'updateForum'"
              class="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center"
            >
              <LoaderIcon v-if="loading === 'updateForum'" class="w-4 h-4 mr-2 animate-spin" />
              Update Forum
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Forum Confirmation Modal -->
    <div
      v-if="showDeleteForumModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showDeleteForumModal = false"
    >
      <div
        @click.stop
        class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md mx-4"
      >
        <div class="p-6">
          <div class="flex items-center mb-4">
            <AlertTriangleIcon class="w-6 h-6 text-red-600 mr-3" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Delete Forum</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Are you sure you want to delete "{{ forum?.title }}"? This will also delete all comments. This action cannot be undone.
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="showDeleteForumModal = false"
              class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              @click="deleteForum"
              :disabled="loading === 'deleteForum'"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <LoaderIcon v-if="loading === 'deleteForum'" class="w-4 h-4 mr-2 animate-spin" />
              Delete Forum
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Comment Confirmation Modal -->
    <div
      v-if="showDeleteCommentModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click="showDeleteCommentModal = false"
    >
      <div
        @click.stop
        class="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md mx-4"
      >
        <div class="p-6">
          <div class="flex items-center mb-4">
            <AlertTriangleIcon class="w-6 h-6 text-red-600 mr-3" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Delete Comment</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Are you sure you want to delete this comment? This action cannot be undone.
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="showDeleteCommentModal = false"
              class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              @click="deleteComment"
              :disabled="loading === 'deleteComment'"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <LoaderIcon v-if="loading === 'deleteComment'" class="w-4 h-4 mr-2 animate-spin" />
              Delete Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import {
  ArrowLeft as ArrowLeftIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  X as XIcon,
  Loader as LoaderIcon,
  MessageSquare as MessageSquareIcon,
  AlertTriangle as AlertTriangleIcon,
  ToggleLeft as ToggleLeftIcon,
  ToggleRight as ToggleRightIcon,
  User as UserIcon,
  Calendar as CalendarIcon,
  Radio as RadioIcon,
  RefreshCw as RefreshCwIcon,
  Check as CheckIcon,
  Clock as ClockIcon,
  Send as SendIcon
} from 'lucide-vue-next';

const store = useStore();
const route = useRoute();
const router = useRouter();

// Reactive data
const showEditModal = ref(false);
const showDeleteForumModal = ref(false);
const showDeleteCommentModal = ref(false);
const commentToDelete = ref(null);
const commentsContainer = ref(null);

const editForm = ref({
  title: '',
  body: '',
  station_id: ''
});

const commentForm = ref({
  content: '',
  status: true
});

// Computed properties
const forum = computed(() => store.getters.forum);
const comments = computed(() => store.getters.comments);
const loading = computed(() => store.getters.loading);

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString();
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString();
};

const fetchForumDetails = async () => {
  await store.dispatch('fetchForum', route.params.id);
};

const fetchComments = async () => {
  await store.dispatch('fetchComments', route.params.id);
};

const refreshComments = async () => {
  await fetchComments();
};

const scrollToBottom = () => {
  if (commentsContainer.value) {
    commentsContainer.value.scrollTop = commentsContainer.value.scrollHeight;
  }
};

const createComment = async () => {
  try {
    await store.dispatch('createComment', {
      forumId: route.params.id,
      data: commentForm.value
    });
    
    // Reset form
    commentForm.value = {
      content: '',
      status: true
    };
    
    await fetchComments();
    
    // Scroll to bottom to show new comment
    setTimeout(scrollToBottom, 100);
  } catch (error) {
    console.error('Error creating comment:', error);
  }
};

const openEditModal = () => {
  editForm.value = {
    title: forum.value.title,
    body: forum.value.body,
    station_id: forum.value.station_id
  };
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const updateForum = async () => {
  try {
    await store.dispatch('updateForum', {
      id: route.params.id,
      data: editForm.value
    });
    closeEditModal();
    await fetchForumDetails();
  } catch (error) {
    console.error('Error updating forum:', error);
  }
};

const toggleForumStatus = async () => {
  try {
    await store.dispatch('updateForum', {
      id: route.params.id,
      data: { ...forum.value, status: !forum.value.status }
    });
    await fetchForumDetails();
  } catch (error) {
    console.error('Error toggling forum status:', error);
  }
};

const confirmDeleteForum = () => {
  showDeleteForumModal.value = true;
};

const deleteForum = async () => {
  try {
    await store.dispatch('deleteForum', route.params.id);
    showDeleteForumModal.value = false;
    router.push({ name: 'Forums' });
  } catch (error) {
    console.error('Error deleting forum:', error);
  }
};

const toggleCommentStatus = async (comment) => {
  try {
    await store.dispatch('updateComment', {
      forumId: route.params.id,
      commentId: comment.id,
      data: { ...comment, status: !comment.status }
    });
    await fetchComments();
  } catch (error) {
    console.error('Error toggling comment status:', error);
  }
};

const confirmDeleteComment = (comment) => {
  commentToDelete.value = comment;
  showDeleteCommentModal.value = true;
};

const deleteComment = async () => {
  try {
    await store.dispatch('deleteComment', {
      forumId: route.params.id,
      commentId: commentToDelete.value.id
    });
    showDeleteCommentModal.value = false;
    commentToDelete.value = null;
    await fetchComments();
  } catch (error) {
    console.error('Error deleting comment:', error);
  }
};

// Lifecycle
onMounted(() => {
  fetchForumDetails();
  fetchComments();
});
</script>