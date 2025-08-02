<template>
    <div v-if="show" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white dark:bg-slate-800 p-6 border-b border-gray-200 dark:border-slate-700 rounded-t-2xl">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Update Recording
            </h2>
            <button @click="closeModal" class="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
              <XIcon class="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>
  
        <form @submit.prevent="updateRecording" class="p-6 space-y-6">
          <!-- Recording Status -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Recording Status</label>
            <select v-model="formData.recording_status" class="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all">
              <option value="scheduled">Scheduled</option>
              <option value="recording">Recording</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
  
          <!-- Session Notes -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Session Notes</label>
            <textarea v-model="formData.session_notes" rows="3" placeholder="Add notes about this recording session..." class="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all resize-none"></textarea>
          </div>
  
          <!-- Duration -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Duration (minutes)</label>
            <input v-model.number="formData.duration_minutes" type="number" min="0" placeholder="Duration in minutes" class="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all" />
          </div>
  
          <!-- Error Message (for failed recordings) -->
          <div v-if="formData.recording_status === 'failed'" class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Error Message</label>
            <textarea v-model="formData.error_message" rows="2" placeholder="Describe the error..." class="w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 transition-all resize-none"></textarea>
          </div>
  
          <!-- Recording File Upload -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300">Replace Recording File</label>
            <div class="border-2 border-dashed border-gray-200 dark:border-slate-600 rounded-xl p-6 text-center hover:border-purple-400 dark:hover:border-purple-500 transition-colors">
              <input ref="fileInput" type="file" accept="audio/*" @change="handleFileSelect" class="hidden" />
              <div v-if="!selectedFile" @click="$refs.fileInput.click()" class="cursor-pointer space-y-2">
                <UploadIcon class="w-8 h-8 mx-auto text-gray-400" />
                <p class="text-sm text-gray-600 dark:text-gray-400">Click to upload new recording file</p>
                <p class="text-xs text-gray-500">MP3, WAV, AAC files supported</p>
              </div>
              <div v-else class="space-y-2">
                <FileAudioIcon class="w-8 h-8 mx-auto text-green-500" />
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedFile.name }}</p>
                <p class="text-xs text-gray-500">{{ formatFileSize(selectedFile.size) }}</p>
                <button type="button" @click="removeFile" class="text-red-500 hover:text-red-600 text-sm font-medium">Remove</button>
              </div>
            </div>
          </div>
  
          <!-- Current File Info -->
          <div v-if="recording?.recording_file_url && !selectedFile" class="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
            <div class="flex items-center gap-3">
              <FileAudioIcon class="w-6 h-6 text-blue-500" />
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">Current Recording</p>
                <p class="text-xs text-gray-500">{{ recording.file_size_mb }}MB • {{ recording.audio_format?.toUpperCase() }} • {{ recording.audio_quality }}</p>
              </div>
              <a :href="recording.recording_file_url" target="_blank" class="text-blue-500 hover:text-blue-600 text-sm font-medium">View</a>
            </div>
          </div>
  
          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4">
            <button type="button" @click="closeModal" class="flex-1 px-6 py-3 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </button>
            <button type="submit" :disabled="loading" class="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl">
              <Loader2Icon v-if="loading" class="w-5 h-5 mr-2 animate-spin" />
              {{ loading ? 'Updating...' : 'Update Recording' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, watch, computed } from 'vue';
  import { useStore } from 'vuex';
  import { 
    X as XIcon, 
    Upload as UploadIcon, 
    FileAudio as FileAudioIcon,
    Loader2 as Loader2Icon 
  } from 'lucide-vue-next';
  
  const props = defineProps({
    show: { type: Boolean, default: false },
    recording: { type: Object, default: null }
  });
  
  const emit = defineEmits(['close', 'updated']);
  
  const store = useStore();
  const loading = computed(() => store.getters.loading === 'update_session_recording');
  
  const fileInput = ref(null);
  const selectedFile = ref(null);
  
  const formData = reactive({
    recording_status: '',
    session_notes: '',
    duration_minutes: null,
    error_message: ''
  });
  
  watch(() => props.recording, (newRecording) => {
    if (newRecording) {
      formData.recording_status = newRecording.recording_status || 'scheduled';
      formData.session_notes = newRecording.session_notes || '';
      formData.duration_minutes = newRecording.duration_minutes || null;
      formData.error_message = newRecording.error_message || '';
    }
  }, { immediate: true });
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      selectedFile.value = file;
    }
  };
  
  const removeFile = () => {
    selectedFile.value = null;
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  };
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const updateRecording = async () => {
    try {
      const data = new FormData();
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          data.append(key, formData[key]);
        }
      });
      
      // Append file if selected
      if (selectedFile.value) {
        data.append('recording_file', selectedFile.value);
      }
      
      await store.dispatch('update_session_recording', {
        data: data,
        id: props.recording.id
      });
      
      store.dispatch('template_play_success_file', 'Recording updated successfully');
      emit('updated');
      closeModal();
      
    } catch (error) {
      console.error('Failed to update recording:', error);
      store.dispatch('template_play_error_file', 'Failed to update recording');
    }
  };
  
  const closeModal = () => {
    selectedFile.value = null;
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    emit('close');
  };
  </script>