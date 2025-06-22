export const namespaced = true

export default {
    state: {
        audioPlayerController: null,
        isPlaying: false,
        isLoading: false,
        volume: 0.7,
        isMuted: false,
        currentStation: null,
        streamUrl: null,
        error: null,
        connectionStatus: 'disconnected', // disconnected, connecting, connected, error
        listeners: 0,
        currentShow: null
    },
    
    getters: {
        audioPlayerController: (state) => state.audioPlayerController,
        isPlaying: (state) => state.isPlaying,
        isLoading: (state) => state.isLoading,
        volume: (state) => state.volume,
        isMuted: (state) => state.isMuted,
        currentStation: (state) => state.currentStation,
        streamUrl: (state) => state.streamUrl,
        error: (state) => state.error,
        connectionStatus: (state) => state.connectionStatus,
        listeners: (state) => state.listeners,
        currentShow: (state) => state.currentShow,
        isConnected: (state) => state.connectionStatus === 'connected',
        canPlay: (state) => state.streamUrl && !state.error && state.connectionStatus !== 'error'
    },

    mutations: {
        setAudioPlayerController: (state, audioPlayerController) => {
            state.audioPlayerController = audioPlayerController
        },
        
        setIsPlaying: (state, isPlaying) => {
            state.isPlaying = isPlaying
        },
        
        setIsLoading: (state, isLoading) => {
            state.isLoading = isLoading
        },
        
        setVolume: (state, volume) => {
            state.volume = Math.max(0, Math.min(1, volume))
            if (state.audioPlayerController) {
                state.audioPlayerController.volume = state.volume
            }
        },
        
        setIsMuted: (state, isMuted) => {
            state.isMuted = isMuted
            if (state.audioPlayerController) {
                state.audioPlayerController.muted = isMuted
            }
        },
        
        setCurrentStation: (state, station) => {
            state.currentStation = station
            state.streamUrl = station?.streaming_link || null
            state.listeners = station?.listeners || 0
        },
        
        setStreamUrl: (state, url) => {
            state.streamUrl = url
        },
        
        setError: (state, error) => {
            state.error = error
        },
        
        setConnectionStatus: (state, status) => {
            state.connectionStatus = status
        },
        
        setListeners: (state, listeners) => {
            state.listeners = listeners
        },
        
        setCurrentShow: (state, show) => {
            state.currentShow = show
        },
        
        clearError: (state) => {
            state.error = null
        }
    },

    actions: {
        async initializeAudioPlayer({ commit, state, dispatch }) {
            try {
                if (state.audioPlayerController) {
                    state.audioPlayerController.pause()
                    state.audioPlayerController.src = ''
                }

                const audio = new Audio()
                audio.preload = 'none'
                audio.crossOrigin = 'anonymous'
                
                // Set initial volume
                audio.volume = state.volume
                audio.muted = state.isMuted

                // Event listeners
                audio.addEventListener('loadstart', () => {
                    commit('setIsLoading', true)
                    commit('setConnectionStatus', 'connecting')
                    commit('clearError')
                })

                audio.addEventListener('canplay', () => {
                    commit('setIsLoading', false)
                    commit('setConnectionStatus', 'connected')
                })

                audio.addEventListener('playing', () => {
                    commit('setIsPlaying', true)
                    commit('setIsLoading', false)
                    commit('setConnectionStatus', 'connected')
                })

                audio.addEventListener('pause', () => {
                    commit('setIsPlaying', false)
                })

                audio.addEventListener('ended', () => {
                    commit('setIsPlaying', false)
                    dispatch('reconnectStream')
                })

                audio.addEventListener('error', (e) => {
                    const errorMessages = {
                        1: 'Audio loading aborted',
                        2: 'Network error occurred',
                        3: 'Audio decoding failed',
                        4: 'Audio format not supported'
                    }
                    
                    const errorMsg = errorMessages[e.target.error?.code] || 'Unknown audio error'
                    commit('setError', errorMsg)
                    commit('setIsPlaying', false)
                    commit('setIsLoading', false)
                    commit('setConnectionStatus', 'error')
                })

                audio.addEventListener('waiting', () => {
                    commit('setIsLoading', true)
                })

                audio.addEventListener('stalled', () => {
                    commit('setIsLoading', true)
                })

                audio.addEventListener('suspend', () => {
                    commit('setIsLoading', false)
                })

                commit('setAudioPlayerController', audio)
                return audio

            } catch (error) {
                commit('setError', 'Failed to initialize audio player')
                commit('setConnectionStatus', 'error')
                throw error
            }
        },

        async loadStation({ commit, dispatch, state }, stationData) {
            try {
                commit('setCurrentStation', stationData)
                
                if (!state.audioPlayerController) {
                    await dispatch('initializeAudioPlayer')
                }

                if (stationData.streaming_link) {
                    commit('setStreamUrl', stationData.streaming_link)
                    state.audioPlayerController.src = stationData.streaming_link
                    
                    // Set current show if available
                    if (stationData.programs && stationData.programs.length > 0) {
                        commit('setCurrentShow', stationData.programs[0])
                    }
                } else {
                    throw new Error('No streaming link available')
                }

            } catch (error) {
                commit('setError', error.message)
                commit('setConnectionStatus', 'error')
            }
        },

        async play({ commit, state, dispatch }) {
            try {
                if (!state.audioPlayerController) {
                    throw new Error('Audio player not initialized')
                }

                if (!state.streamUrl) {
                    throw new Error('No stream URL available')
                }

                commit('setIsLoading', true)
                commit('clearError')

                const playPromise = state.audioPlayerController.play()
                
                if (playPromise !== undefined) {
                    await playPromise
                }

            } catch (error) {
                if (error.name === 'NotAllowedError') {
                    commit('setError', 'Playback requires user interaction')
                } else if (error.name === 'NotSupportedError') {
                    commit('setError', 'Audio format not supported')
                } else {
                    commit('setError', error.message || 'Playback failed')
                }
                
                commit('setIsPlaying', false)
                commit('setIsLoading', false)
                commit('setConnectionStatus', 'error')
            }
        },

        pause({ commit, state }) {
            if (state.audioPlayerController) {
                state.audioPlayerController.pause()
                commit('setIsPlaying', false)
                commit('setConnectionStatus', 'disconnected')
            }
        },

        async togglePlayPause({ dispatch, state }) {
            if (state.isPlaying) {
                dispatch('pause')
            } else {
                await dispatch('play')
            }
        },

        setVolume({ commit }, volume) {
            commit('setVolume', volume)
        },

        toggleMute({ commit, state }) {
            commit('setIsMuted', !state.isMuted)
        },

        async reconnectStream({ dispatch, state }) {
            if (state.currentStation?.streaming_link) {
                setTimeout(() => {
                    dispatch('loadStation', state.currentStation)
                }, 3000)
            }
        },

        updateListeners({ commit }, count) {
            commit('setListeners', count)
        },

        updateCurrentShow({ commit }, show) {
            commit('setCurrentShow', show)
        },

        async switchStation({ dispatch, commit }, stationData) {
            // Stop current playback
            dispatch('pause')
            
            // Clear current state
            commit('setCurrentStation', null)
            commit('setStreamUrl', null)
            commit('clearError')
            
            // Load new station
            await dispatch('loadStation', stationData)
        },

        destroy({ commit, state }) {
            if (state.audioPlayerController) {
                state.audioPlayerController.pause()
                state.audioPlayerController.src = ''
                state.audioPlayerController.load()
            }
            
            commit('setAudioPlayerController', null)
            commit('setIsPlaying', false)
            commit('setIsLoading', false)
            commit('setConnectionStatus', 'disconnected')
            commit('clearError')
        }
    }
}