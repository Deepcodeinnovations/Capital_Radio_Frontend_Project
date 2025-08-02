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
        connectionStatus: 'disconnected',
        listeners: 0,
        currentShow: null,
        proxyIframe: null,
        useIframePlayer: false
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
            if (state.audioPlayerController && !state.useIframePlayer) {
                state.audioPlayerController.volume = state.volume
            }
        },
        
        setIsMuted: (state, isMuted) => {
            state.isMuted = isMuted
            if (state.audioPlayerController && !state.useIframePlayer) {
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
        
        setProxyIframe: (state, iframe) => {
            state.proxyIframe = iframe
        },
        
        setUseIframePlayer: (state, useIframe) => {
            state.useIframePlayer = useIframe
        },
        
        clearError: (state) => {
            state.error = null
        }
    },

    actions: {
        createProxyIframe({ commit, state }) {
            if (state.proxyIframe) {
                document.body.removeChild(state.proxyIframe)
            }

            const iframe = document.createElement('iframe')
            iframe.style.display = 'none'
            iframe.style.position = 'absolute'
            iframe.style.left = '-9999px'
            iframe.style.width = '1px'
            iframe.style.height = '1px'
            
            // Create data URL with HTML content that allows HTTP
            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Audio Proxy</title>
</head>
<body>
    <audio id="player" preload="none" controls style="width:100px;height:30px;"></audio>
    <script>
        const audio = document.getElementById('player');
        
        // Listen for messages from parent
        window.addEventListener('message', function(event) {
            const { action, data } = event.data;
            
            try {
                switch(action) {
                    case 'load':
                        audio.src = data;
                        audio.load();
                        break;
                    case 'play':
                        audio.play().catch(err => {
                            parent.postMessage({type: 'error', message: err.message}, '*');
                        });
                        break;
                    case 'pause':
                        audio.pause();
                        break;
                    case 'volume':
                        audio.volume = data;
                        break;
                    case 'muted':
                        audio.muted = data;
                        break;
                }
            } catch(err) {
                parent.postMessage({type: 'error', message: err.message}, '*');
            }
        });
        
        // Send events to parent
        audio.addEventListener('loadstart', () => parent.postMessage({type: 'loadstart'}, '*'));
        audio.addEventListener('canplay', () => parent.postMessage({type: 'canplay'}, '*'));
        audio.addEventListener('playing', () => parent.postMessage({type: 'playing'}, '*'));
        audio.addEventListener('pause', () => parent.postMessage({type: 'pause'}, '*'));
        audio.addEventListener('ended', () => parent.postMessage({type: 'ended'}, '*'));
        audio.addEventListener('waiting', () => parent.postMessage({type: 'waiting'}, '*'));
        audio.addEventListener('stalled', () => parent.postMessage({type: 'stalled'}, '*'));
        audio.addEventListener('error', (e) => {
            parent.postMessage({type: 'error', message: 'Stream connection failed'}, '*');
        });
    </script>
</body>
</html>`

            iframe.srcdoc = htmlContent
            document.body.appendChild(iframe)
            commit('setProxyIframe', iframe)
            
            // Set up message listener
            const messageHandler = (event) => {
                if (event.source === iframe.contentWindow) {
                    switch(event.data.type) {
                        case 'loadstart':
                            commit('setIsLoading', true)
                            commit('setConnectionStatus', 'connecting')
                            commit('clearError')
                            break
                        case 'canplay':
                            commit('setIsLoading', false)
                            commit('setConnectionStatus', 'connected')
                            break
                        case 'playing':
                            commit('setIsPlaying', true)
                            commit('setIsLoading', false)
                            commit('setConnectionStatus', 'connected')
                            break
                        case 'pause':
                            commit('setIsPlaying', false)
                            break
                        case 'ended':
                            commit('setIsPlaying', false)
                            commit('setConnectionStatus', 'disconnected')
                            break
                        case 'waiting':
                            commit('setIsLoading', true)
                            break
                        case 'stalled':
                            commit('setIsLoading', true)
                            break
                        case 'error':
                            commit('setError', event.data.message)
                            commit('setIsPlaying', false)
                            commit('setIsLoading', false)
                            commit('setConnectionStatus', 'error')
                            break
                    }
                }
            }
            
            window.addEventListener('message', messageHandler)
            return iframe
        },

        async initializeAudioPlayer({ commit, state, dispatch }) {
            try {
                // For HTTP streams on HTTPS sites, use iframe approach directly
                if (state.streamUrl && state.streamUrl.startsWith('http://')) {
                    commit('setUseIframePlayer', true)
                    await dispatch('createProxyIframe')
                    return
                }

                if (state.audioPlayerController) {
                    state.audioPlayerController.pause()
                    state.audioPlayerController.src = ''
                }

                const audio = new Audio()
                audio.preload = 'none'
                audio.volume = state.volume
                audio.muted = state.isMuted

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
                    // Switch to iframe on mixed content error
                    if (e.target.error?.code === 2) {
                        commit('setUseIframePlayer', true)
                        dispatch('createProxyIframe')
                        return
                    }
                    
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
                
                if (stationData.streaming_link) {
                    commit('setStreamUrl', stationData.streaming_link)
                    
                    // For HTTP streams, use iframe approach
                    if (stationData.streaming_link.startsWith('http://')) {
                        commit('setUseIframePlayer', true)
                        if (!state.proxyIframe) {
                            await dispatch('createProxyIframe')
                        }
                        
                        // Wait for iframe to load then set source
                        setTimeout(() => {
                            if (state.proxyIframe && state.proxyIframe.contentWindow) {
                                state.proxyIframe.contentWindow.postMessage({
                                    action: 'load',
                                    data: stationData.streaming_link
                                }, '*')
                            }
                        }, 500)
                    } else {
                        // For HTTPS streams, use regular audio
                        if (!state.audioPlayerController) {
                            await dispatch('initializeAudioPlayer')
                        }
                        state.audioPlayerController.src = stationData.streaming_link
                    }
                    
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
                if (!state.streamUrl) {
                    throw new Error('No stream URL available')
                }

                commit('setIsLoading', true)
                commit('clearError')

                if (state.useIframePlayer && state.proxyIframe) {
                    state.proxyIframe.contentWindow.postMessage({
                        action: 'play'
                    }, '*')
                } else {
                    if (!state.audioPlayerController) {
                        throw new Error('Audio player not initialized')
                    }

                    const playPromise = state.audioPlayerController.play()
                    
                    if (playPromise !== undefined) {
                        await playPromise
                    }
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
            if (state.useIframePlayer && state.proxyIframe) {
                state.proxyIframe.contentWindow.postMessage({
                    action: 'pause'
                }, '*')
            } else if (state.audioPlayerController) {
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

        setVolume({ commit, state }, volume) {
            commit('setVolume', volume)
            
            if (state.useIframePlayer && state.proxyIframe) {
                state.proxyIframe.contentWindow.postMessage({
                    action: 'volume',
                    data: volume
                }, '*')
            }
        },

        toggleMute({ commit, state }) {
            commit('setIsMuted', !state.isMuted)
            
            if (state.useIframePlayer && state.proxyIframe) {
                state.proxyIframe.contentWindow.postMessage({
                    action: 'muted',
                    data: !state.isMuted
                }, '*')
            }
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
            dispatch('pause')
            commit('setCurrentStation', null)
            commit('setStreamUrl', null)
            commit('clearError')
            await dispatch('loadStation', stationData)
        },

        destroy({ commit, state }) {
            if (state.proxyIframe) {
                document.body.removeChild(state.proxyIframe)
                commit('setProxyIframe', null)
            }
            
            if (state.audioPlayerController) {
                state.audioPlayerController.pause()
                state.audioPlayerController.src = ''
                state.audioPlayerController.load()
            }
            
            commit('setAudioPlayerController', null)
            commit('setIsPlaying', false)
            commit('setIsLoading', false)
            commit('setConnectionStatus', 'disconnected')
            commit('setUseIframePlayer', false)
            commit('clearError')
        }
    }
}