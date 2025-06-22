export const namespaced = true 
import { useToast } from 'vue-toastification'
const toast = useToast()

// Use public folder paths (more reliable)
const audioFileError = '/assets/audios/error_sound.mp3';
const audioFileSuccess = '/assets/audios/success_sound.mp3';
const audioFileDelete = '/assets/audios/delete_sound.mp3';

// Fallback audio data URLs (tiny audio files)
const fallbackAudioError = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUgBQcBjv8';
const fallbackAudioSuccess = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUgBQcBjv8';
const fallbackAudioDelete = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmeUgBQcBjv8';

// Audio permission state
let audioContext = null;
let audioPermissionGranted = null; // null = not tested, true = granted, false = denied
let audioFilesChecked = false;
let audioFilesExist = {
    error: false,
    success: false,
    delete: false
};

export default {
    state : {
        error :'',
        errors :[],
        apierror:'',
        msg :'',
        loading:'',
        pageloading:'',
        uploadPercentage:0,
    },
    
    getters : {
        error: (state )=> state.error,
        errors: (state )=> state.errors,
        apierror: (state )=> state.apierror,
        msg: (state )=> state.msg,
        loading: (state )=> state.loading,
        pageloading: (state )=> state.pageloading,
        uploadPercentage: (state )=> state.uploadPercentage,
    },

    mutations : { 
        setloader :(state,loading ) => (state.loading = loading), 
        setpageloading :(state,pageloading ) => (state.pageloading = pageloading), 
        seterror :(state,error ) => (state.error = error), 
        seterrors :(state,errors ) => (state.errors = errors), 
        setmsg :(state,msg ) => (state.msg = msg), 
        setapierror :(state,apierror ) => (state.apierror = apierror),
        setuploadPercentage :(state,uploadPercentage ) => (state.uploadPercentage = uploadPercentage),
    },

    actions : {
        async clearutils( { commit }) {
            commit('seterror', '')
            commit('setmsg', '')
            commit('setloader', '')
            commit('setapierror', '')
            commit('seterrors', '')
            commit('setpageloading', '')
        },

        async update_user_app_theme({ dispatch }, mode) {
            console.log('Changing Theme to ' + mode)
            dispatch('updateTheme', mode);
        },

        async comp_play_error_file(){
            await playAudioWithPermission('error', null, 'error');
        },

        async template_play_error_file({ commit }, msg) {
            await playAudioWithPermission('error', msg, 'error');
        },
        
        async template_play_success_file({ commit }, msg) {
            await playAudioWithPermission('success', msg, 'success');
        },
        
        async template_play_delete_file({ commit }, msg) {
            await playAudioWithPermission('delete', msg, 'warning');
        },

        async template_play_success_file_no_msg({ commit }) {
            await playAudioWithPermission('success', null, 'success');
        },
    },
}

// Helper function to check if audio files exist
async function checkAudioFiles() {
    if (audioFilesChecked) return;
    
    const files = {
        error: audioFileError,
        success: audioFileSuccess,
        delete: audioFileDelete
    };
    
    for (const [type, url] of Object.entries(files)) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            audioFilesExist[type] = response.ok;
            if (!response.ok) {
                console.warn(`Audio file not found: ${url}`);
            }
        } catch (error) {
            console.warn(`Could not check audio file: ${url}`, error);
            audioFilesExist[type] = false;
        }
    }
    
    audioFilesChecked = true;
    console.log('Audio files check:', audioFilesExist);
}

// Helper function to get audio source
function getAudioSource(type) {
    const sources = {
        error: { primary: audioFileError, fallback: fallbackAudioError },
        success: { primary: audioFileSuccess, fallback: fallbackAudioSuccess },
        delete: { primary: audioFileDelete, fallback: fallbackAudioDelete }
    };
    
    const source = sources[type];
    if (!source) return null;
    
    // Return primary if it exists, otherwise fallback
    return audioFilesExist[type] ? source.primary : source.fallback;
}

// Helper function to initialize audio context with user interaction
async function initializeAudioContext() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }
        
        return audioContext.state === 'running';
    } catch (error) {
        console.warn('AudioContext initialization failed:', error);
        return false;
    }
}

// Helper function to request audio permission with user interaction (using alert)
async function requestAudioPermissionWithAlert() {
    try {
        // Check if we already know the permission status
        if (audioPermissionGranted !== null) {
            return audioPermissionGranted;
        }

        // Check localStorage for previous permission
        const storedPermission = localStorage.getItem('capitalfmAudioPermission');
        if (storedPermission === 'granted') {
            audioPermissionGranted = true;
            return true;
        } else if (storedPermission === 'denied') {
            audioPermissionGranted = false;
            return false;
        }

        // Show alert to request permission
        const userConsent = window.confirm(
            "🔊 Capital FM Audio Notifications\n\n" +
            "Enable audio notifications for:\n" +
            "• Success confirmations 🎵\n" +
            "• Error alerts ⚠️\n" +
            "• Action feedback 📻\n\n" +
            "This enhances your experience with helpful audio feedback.\n\n" +
            "Click OK to enable audio notifications, or Cancel to continue without audio."
        );

        if (userConsent) {
            // Initialize audio context
            const contextInitialized = await initializeAudioContext();
            if (!contextInitialized) {
                console.warn('Could not initialize audio context');
                audioPermissionGranted = false;
                localStorage.setItem('capitalfmAudioPermission', 'denied');
                return false;
            }

            // Try to play a very short, quiet test sound to unlock audio
            try {
                const testAudio = new Audio();
                testAudio.volume = 0.01; // Very quiet
                
                // Use a very short beep sound
                testAudio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUgBQcBjv8';
                
                const playPromise = testAudio.play();
                if (playPromise !== undefined) {
                    await playPromise;
                }
                
                audioPermissionGranted = true;
                localStorage.setItem('capitalfmAudioPermission', 'granted');
                console.log('✅ Audio permission granted successfully');
                
                // Show success alert
                window.alert("🎵 Audio notifications enabled! You'll now hear feedback sounds for your actions.");
                
                return true;
                
            } catch (error) {
                console.warn('Audio test failed:', error);
                audioPermissionGranted = false;
                localStorage.setItem('capitalfmAudioPermission', 'denied');
                
                // Show error alert
                window.alert("⚠️ Audio couldn't be enabled. Your browser may be blocking audio autoplay. You can still use Capital FM without audio notifications.");
                
                return false;
            }
        } else {
            audioPermissionGranted = false;
            localStorage.setItem('capitalfmAudioPermission', 'denied');
            console.log('❌ User declined audio permission');
            return false;
        }
        
    } catch (error) {
        console.error('Permission request failed:', error);
        audioPermissionGranted = false;
        localStorage.setItem('capitalfmAudioPermission', 'denied');
        return false;
    }
}

// Helper function to create toast instance
const getToast = () => {
    try {
        return useToast();
    } catch (error) {
        console.warn('Toast not available:', error);
        return {
            error: (msg) => console.error(msg),
            success: (msg) => console.log(msg),
            warning: (msg) => console.warn(msg)
        };
    }
};

// Helper function to show toast notification
const showToast = (msg, type = 'success') => {
    if (!msg) return;
    
    try {
        const toastInstance = getToast();
        switch (type) {
            case 'error':
                toastInstance.error(msg);
                break;
            case 'warning':
                toastInstance.warning(msg);
                break;
            case 'success':
            default:
                toastInstance.success(msg);
                break;
        }
    } catch (error) {
        console.warn('Toast notification failed:', error);
        // Fallback to console logging
        console.log(`${type.toUpperCase()}: ${msg}`);
    }
};

// Helper function to play audio with automatic permission handling
async function playAudioWithPermission(audioType, message = null, toastType = 'success') {
    // Always show toast first - regardless of audio permission
    if (message) {
        showToast(message, toastType);
    }
    
    try {
        // Check if audio files exist first
        await checkAudioFiles();
        
        // Check stored permission first
        const storedPermission = localStorage.getItem('capitalfmAudioPermission');
        if (storedPermission === 'denied') {
            console.log('🔇 Audio permission previously denied by user');
            return;
        }
        
        // Check/request permission for audio
        if (audioPermissionGranted === null || audioPermissionGranted === false) {
            if (storedPermission !== 'granted') {
                // Request permission with alert
                const hasPermission = await requestAudioPermissionWithAlert();
                if (!hasPermission) {
                    console.log('🔇 Audio permission not granted');
                    return;
                }
            }
        }
        
        // Double-check permission status
        if (audioPermissionGranted === false) {
            console.log('🔇 Audio permission denied');
            return;
        }

        // Get the appropriate audio source
        const audioSource = getAudioSource(audioType);
        if (!audioSource) {
            console.warn(`No audio source available for type: ${audioType}`);
            return;
        }

        // Create and configure audio
        const currentAudio = new Audio();
        currentAudio.volume = 0.4; // Moderate volume
        currentAudio.preload = 'auto';
        
        // Set up error handling
        currentAudio.onerror = (error) => {
            console.warn('Audio loading error:', error);
        };
        
        // Set the source and load
        currentAudio.src = audioSource;
        currentAudio.load();
        
        // Wait for audio to be ready and play
        return new Promise((resolve) => {
            const timeoutId = setTimeout(() => {
                console.warn('⏰ Audio play timeout');
                resolve();
            }, 3000);
            
            currentAudio.oncanplaythrough = async () => {
                try {
                    clearTimeout(timeoutId);
                    const playPromise = currentAudio.play();
                    if (playPromise !== undefined) {
                        await playPromise;
                        console.log(`🔊 Audio played successfully: ${audioType}`);
                    }
                    resolve();
                } catch (playError) {
                    console.warn('Audio play error:', playError);
                    clearTimeout(timeoutId);
                    resolve();
                }
            };
            
            currentAudio.onended = () => {
                clearTimeout(timeoutId);
                resolve();
            };
        });
        
    } catch (error) {
        console.warn('Audio playback failed:', error);
        
        // Try fallback with data URL if the original failed
        try {
            const fallbackSource = getAudioSource(audioType);
            if (fallbackSource && fallbackSource.startsWith('data:')) {
                const fallbackAudio = new Audio(fallbackSource);
                fallbackAudio.volume = 0.3;
                await fallbackAudio.play();
                console.log('🔊 Fallback audio played successfully');
            }
        } catch (fallbackError) {
            console.warn('Fallback audio also failed:', fallbackError);
        }
    }
}

// Export functions for external use
export async function comp_play_error_file({ commit }, msg) {
    await playAudioWithPermission('error', msg, 'error');
}

export async function comp_play_success_file({ commit }, msg) {
    await playAudioWithPermission('success', msg, 'success');
}

export async function comp_play_delete_file({ commit }, msg) {
    await playAudioWithPermission('delete', msg, 'warning');
}