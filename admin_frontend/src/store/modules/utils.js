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
const fallbackAudioDelete = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmeUgBQcBjv8';

// Audio permission state
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
        clientdata: null,
        clientlocation: null,
        clientdevice: null,
    },
    
    getters : {
        error: (state )=> state.error,
        errors: (state )=> state.errors,
        apierror: (state )=> state.apierror,
        msg: (state )=> state.msg,
        loading: (state )=> state.loading,
        pageloading: (state )=> state.pageloading,
        uploadPercentage: (state )=> state.uploadPercentage,
        clientdata: (state )=> state.clientdata,
        clientlocation: (state )=> state.clientlocation,
        clientdevice: (state )=> state.clientdevice,
    },

    mutations : { 
        setloader :(state,loading ) => (state.loading = loading), 
        setpageloading :(state,pageloading ) => (state.pageloading = pageloading), 
        seterror :(state,error ) => (state.error = error), 
        seterrors :(state,errors ) => (state.errors = errors), 
        setmsg :(state,msg ) => (state.msg = msg), 
        setapierror :(state,apierror ) => (state.apierror = apierror),
        setuploadPercentage :(state,uploadPercentage ) => (state.uploadPercentage = uploadPercentage),
        setclientdata :(state,clientdata ) => (state.clientdata = clientdata),
        setclientlocation :(state,clientlocation ) => (state.clientlocation = clientlocation),
        setclientdevice :(state,clientdevice ) => (state.clientdevice = clientdevice),
    },

    actions : {

        async getclientlocationanddevicedata({ commit }) {
            return new Promise((resolve, reject) => {
              fetch('https://ipwho.is/')
                .then(response => {
                  if (!response.ok) throw new Error('Failed to fetch location data');
                  return response.json();
                })
                .then(locationData => {
                  const clientdata = {
                    ip: locationData.ip,
                    city: locationData.city,
                    region: locationData.region,
                    country: locationData.country,
                    postal: locationData.postal,
                    latitude: locationData.latitude,
                    longitude: locationData.longitude,
                    timezone: locationData.timezone.id,
                    currency: locationData.currency || '',
                    isp: locationData.org
                  };
          
                  commit('setclientlocation', clientdata);
          
                  const userAgent = navigator.userAgent;
                  let deviceType = 'Unknown';
          
                  if (/mobile/i.test(userAgent)) deviceType = 'Mobile';
                  else if (/tablet/i.test(userAgent)) deviceType = 'Tablet';
                  else if (/windows|macintosh|linux/i.test(userAgent)) deviceType = 'Desktop';
          
                  commit('setclientdevice', deviceType);
          
                  const clientinfo = {
                    ...clientdata,
                    device: deviceType,
                    access_route: window.location.pathname,
                    access_time: new Date().toISOString()
                  };
          

                  commit('setclientdata', clientinfo);
                  resolve({ ip: locationData.ip, location: clientdata, device: deviceType });
                })
                .catch(error => {
                  console.error('Error fetching client data:', error);
                  reject(error);
                })
                .finally(() => {
                  commit('setloader', '');
                });
            });
        },

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

// Helper function to request audio permission using native browser prompt
async function requestAudioPermission() {
    try {
        // Check if we already know the permission status
        if (audioPermissionGranted !== null) {
            return audioPermissionGranted;
        }

        // Check localStorage for previous permission
        const storedPermission = localStorage.getItem('boomryAudioPermission');
        if (storedPermission === 'granted') {
            audioPermissionGranted = true;
            return true;
        } else if (storedPermission === 'denied') {
            audioPermissionGranted = false;
            return false;
        }

        // Use native browser confirm dialog
        const userConsent = confirm(
            "Boomry would like to play audio notifications for actions like success, error, and delete operations. " +
            "This enhances your user experience with audio feedback.\n\n" +
            "Click OK to allow audio notifications, or Cancel to disable them."
        );

        if (userConsent) {
            // Try to play a silent audio to unlock autoplay
            try {
                const testAudio = new Audio();
                testAudio.volume = 0; // Silent test
                testAudio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUgBQcBjv8';
                
                const playPromise = testAudio.play();
                if (playPromise !== undefined) {
                    await playPromise;
                }
                
                audioPermissionGranted = true;
                localStorage.setItem('boomryAudioPermission', 'granted');
                return true;
            } catch (error) {
                console.warn('Audio test failed:', error);
                audioPermissionGranted = false;
                localStorage.setItem('boomryAudioPermission', 'denied');
                return false;
            }
        } else {
            audioPermissionGranted = false;
            localStorage.setItem('boomryAudioPermission', 'denied');
            return false;
        }
    } catch (error) {
        console.error('Permission request failed:', error);
        audioPermissionGranted = false;
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
        
        // Check/request permission for audio
        const hasPermission = await requestAudioPermission();
        if (!hasPermission) {
            console.log('Audio permission denied by user, showing toast only');
            return; // User denied permission, but toast was already shown
        }

        // Get the appropriate audio source
        const audioSource = getAudioSource(audioType);
        if (!audioSource) {
            console.warn(`No audio source available for type: ${audioType}`);
            return;
        }

        const currentAudio = new Audio();
        currentAudio.volume = 0.5;
        
        // Set up error handling before setting source
        currentAudio.onerror = (error) => {
            console.warn('Audio loading error:', error);
        };
        
        currentAudio.oncanplaythrough = async () => {
            try {
                const playPromise = currentAudio.play();
                if (playPromise !== undefined) {
                    await playPromise;
                }
            } catch (playError) {
                console.warn('Audio play error:', playError);
            }
        };
        
        // Set the source
        currentAudio.src = audioSource;
        
        // Load the audio
        currentAudio.load();
        
        return new Promise((resolve) => {
            currentAudio.onended = resolve;
            // Fallback timeout
            setTimeout(resolve, 3000);
        });
        
    } catch (error) {
        console.warn('Audio playback failed:', error);
        
        // Try fallback with data URL if the original failed
        if (error.name === 'NotSupportedError') {
            console.log('Trying fallback audio...');
            try {
                const fallbackSource = getAudioSource(audioType);
                if (fallbackSource && fallbackSource.startsWith('data:')) {
                    const fallbackAudio = new Audio(fallbackSource);
                    fallbackAudio.volume = 0.3;
                    await fallbackAudio.play();
                }
            } catch (fallbackError) {
                console.warn('Fallback audio also failed:', fallbackError);
            }
        }
        
        // Ensure toast is shown even if there was an error
        if (message) {
            showToast(message, toastType);
        }
    }
}

export async function comp_play_error_file({ commit }, msg) {
    await playAudioWithPermission('error', msg, 'error');
}

export async function comp_play_success_file({ commit }, msg) {
    await playAudioWithPermission('success', msg, 'success');
}

export async function comp_play_delete_file({ commit }, msg) {
    await playAudioWithPermission('delete', msg, 'warning');
}