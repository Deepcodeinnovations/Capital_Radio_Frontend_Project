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
            // Close existing window if open
            if (state.proxyIframe && state.proxyIframe.popupWindow && !state.proxyIframe.popupWindow.closed) {
                state.proxyIframe.popupWindow.close()
            }

            if (!state.streamUrl) {
                commit('setError', 'No stream URL available')
                return
            }

            try {
                // Create a popup window instead of iframe
                const windowFeatures = 'width=450,height=400,scrollbars=no,resizable=yes,status=no,toolbar=no,menubar=no,location=no'
                const popupWindow = window.open('', 'radioStream', windowFeatures)
                
                if (!popupWindow) {
                    throw new Error('Failed to open window. Please allow pop-ups for this site.')
                }

                // Create a simple HTML page with audio player
                const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>${state.currentStation?.name || 'Radio Stream'}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            box-sizing: border-box;
        }
        .player-container {
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            text-align: center;
            width: 100%;
            max-width: 350px;
        }
        .station-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        .stream-info {
            font-size: 12px;
            margin-bottom: 20px;
            opacity: 0.8;
            word-break: break-all;
        }
        audio {
            width: 100%;
            margin: 20px 0;
            border-radius: 10px;
        }
        .controls {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
        }
        button {
            padding: 10px 20px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .play-btn {
            background: #4CAF50;
            color: white;
        }
        .play-btn:hover {
            background: #45a049;
            transform: scale(1.05);
        }
        .stop-btn {
            background: #f44336;
            color: white;
        }
        .stop-btn:hover {
            background: #da190b;
            transform: scale(1.05);
        }
        .status {
            margin-top: 15px;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
        }
        .status.playing {
            background: rgba(76, 175, 80, 0.3);
            border: 1px solid #4CAF50;
        }
        .status.loading {
            background: rgba(255, 193, 7, 0.3);
            border: 1px solid #FFC107;
        }
        .status.error {
            background: rgba(244, 67, 54, 0.3);
            border: 1px solid #f44336;
        }
        .wave-animation {
            display: inline-block;
            margin-left: 10px;
        }
        .wave {
            display: inline-block;
            width: 4px;
            height: 20px;
            background: #4CAF50;
            margin: 0 1px;
            border-radius: 2px;
            animation: wave 1s ease-in-out infinite;
        }
        .wave:nth-child(2) { animation-delay: 0.1s; }
        .wave:nth-child(3) { animation-delay: 0.2s; }
        .wave:nth-child(4) { animation-delay: 0.3s; }
        @keyframes wave {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(0.3); }
        }
    </style>
</head>
<body>
    <div class="player-container">
        <div class="station-name">${state.currentStation?.name || 'Radio Stream'}</div>
        <div class="stream-info">Now Playing Live</div>
        
        <audio id="audioPlayer" controls autoplay>
            <source src="${state.streamUrl}" type="audio/mpeg">
            <source src="${state.streamUrl}" type="audio/ogg">
            <source src="${state.streamUrl}" type="audio/wav">
            Your browser does not support the audio element.
        </audio>
        
        <div class="controls">
            <button class="play-btn" onclick="playStream()">▶ Play</button>
            <button class="stop-btn" onclick="stopStream()">⏹ Stop</button>
        </div>
        
        <div id="status" class="status loading">
            Loading stream...
            <div class="wave-animation">
                <div class="wave"></div>
                <div class="wave"></div>
                <div class="wave"></div>
                <div class="wave"></div>
            </div>
        </div>
    </div>

    <script>
        const audio = document.getElementById('audioPlayer');
        const statusDiv = document.getElementById('status');
        
        function updateStatus(message, type) {
            statusDiv.className = 'status ' + type;
            if (type === 'playing') {
                statusDiv.innerHTML = message + '<div class="wave-animation"><div class="wave"></div><div class="wave"></div><div class="wave"></div><div class="wave"></div></div>';
            } else {
                statusDiv.textContent = message;
            }
        }
        
        function playStream() {
            audio.play().catch(err => {
                updateStatus('Failed to play: ' + err.message, 'error');
            });
        }
        
        function stopStream() {
            audio.pause();
            audio.currentTime = 0;
        }
        
        // Send events to parent window
        audio.addEventListener('loadstart', () => {
            updateStatus('Loading stream...', 'loading');
            if (window.opener) {
                window.opener.postMessage({type: 'loadstart'}, '*');
            }
        });
        
        audio.addEventListener('canplay', () => {
            updateStatus('Ready to play', 'playing');
            if (window.opener) {
                window.opener.postMessage({type: 'canplay'}, '*');
            }
        });
        
        audio.addEventListener('playing', () => {
            updateStatus('🎵 Playing Live', 'playing');
            if (window.opener) {
                window.opener.postMessage({type: 'playing'}, '*');
            }
        });
        
        audio.addEventListener('pause', () => {
            updateStatus('Paused', '');
            if (window.opener) {
                window.opener.postMessage({type: 'pause'}, '*');
            }
        });
        
        audio.addEventListener('ended', () => {
            updateStatus('Stream ended', '');
            if (window.opener) {
                window.opener.postMessage({type: 'ended'}, '*');
            }
        });
        
        audio.addEventListener('error', (e) => {
            updateStatus('Connection failed - Try refreshing', 'error');
            if (window.opener) {
                window.opener.postMessage({type: 'error', message: 'Stream connection failed'}, '*');
            }
        });
        
        audio.addEventListener('waiting', () => {
            updateStatus('Buffering...', 'loading');
            if (window.opener) {
                window.opener.postMessage({type: 'waiting'}, '*');
            }
        });
        
        audio.addEventListener('stalled', () => {
            updateStatus('Stream stalled...', 'loading');
            if (window.opener) {
                window.opener.postMessage({type: 'stalled'}, '*');
            }
        });
        
        // Handle window close
        window.addEventListener('beforeunload', () => {
            if (window.opener) {
                window.opener.postMessage({type: 'windowClosed'}, '*');
            }
        });
        
        // Try to start playing automatically
        setTimeout(() => {
            if (audio.paused) {
                playStream();
            }
        }, 1000);
    </script>
</body>
</html>`

                popupWindow.document.write(htmlContent)
                popupWindow.document.close()
                
                // Create a proxy object that stores the popup window
                const proxyObj = {
                    popupWindow: popupWindow,
                    contentWindow: popupWindow // For compatibility
                }
                
                commit('setProxyIframe', proxyObj)
                
                // Set up message listener for the popup window
                const messageHandler = (event) => {
                    if (event.source === popupWindow) {
                        switch(event.data.type) {
                            case 'loadstart':
                                commit('setIsLoading', true);
                                commit('setConnectionStatus', 'connecting');
                                commit('clearError');
                                break;
                            case 'canplay':
                                commit('setIsLoading', false);
                                commit('setConnectionStatus', 'connected');
                                break;
                            case 'playing':
                                commit('setIsPlaying', true);
                                commit('setIsLoading', false);
                                commit('setConnectionStatus', 'connected');
                                break;
                            case 'pause':
                                commit('setIsPlaying', false);
                                break;
                            case 'ended':
                                commit('setIsPlaying', false);
                                commit('setConnectionStatus', 'disconnected');
                                break;
                            case 'waiting':
                                commit('setIsLoading', true);
                                break;
                            case 'stalled':
                                commit('setIsLoading', true);
                                break;
                            case 'error':
                                commit('setError', event.data.message);
                                commit('setIsPlaying', false);
                                commit('setIsLoading', false);
                                commit('setConnectionStatus', 'error');
                                break;
                            case 'windowClosed':
                                commit('setProxyIframe', null);
                                commit('setIsPlaying', false);
                                commit('setConnectionStatus', 'disconnected');
                                commit('setUseIframePlayer', false);
                                break;
                        }
                    }
                };
                
                window.addEventListener('message', messageHandler);
                
                // Monitor window close
                const checkWindowClosed = setInterval(() => {
                    if (popupWindow.closed) {
                        clearInterval(checkWindowClosed);
                        commit('setProxyIframe', null);
                        commit('setIsPlaying', false);
                        commit('setConnectionStatus', 'disconnected');
                        commit('setUseIframePlayer', false);
                    }
                }, 1000);
                
                return proxyObj;
                
            } catch (error) {
                commit('setError', error.message);
                commit('setConnectionStatus', 'error');
                console.error('Failed to open popup window:', error);
            }
        },

        async initializeAudioPlayer({ commit, state, dispatch }) {
            try {
                // For HTTP streams on HTTPS sites, use popup window directly
                if (state.streamUrl && state.streamUrl.startsWith('http://') && window.location.protocol === 'https:') {
                    commit('setUseIframePlayer', true);
                    await dispatch('createProxyIframe');
                    return;
                }

                if (state.audioPlayerController) {
                    state.audioPlayerController.pause();
                    state.audioPlayerController.src = '';
                }

                const audio = new Audio();
                audio.preload = 'none';
                audio.volume = state.volume;
                audio.muted = state.isMuted;

                audio.addEventListener('loadstart', () => {
                    commit('setIsLoading', true);
                    commit('setConnectionStatus', 'connecting');
                    commit('clearError');
                });

                audio.addEventListener('canplay', () => {
                    commit('setIsLoading', false);
                    commit('setConnectionStatus', 'connected');
                });

                audio.addEventListener('playing', () => {
                    commit('setIsPlaying', true);
                    commit('setIsLoading', false);
                    commit('setConnectionStatus', 'connected');
                });

                audio.addEventListener('pause', () => {
                    commit('setIsPlaying', false);
                });

                audio.addEventListener('ended', () => {
                    commit('setIsPlaying', false);
                    dispatch('reconnectStream');
                });

                audio.addEventListener('error', (e) => {
                    // Switch to popup on mixed content error
                    if (e.target.error?.code === 2) {
                        commit('setUseIframePlayer', true);
                        dispatch('createProxyIframe');
                        return;
                    }
                    
                    const errorMessages = {
                        1: 'Audio loading aborted',
                        2: 'Network error occurred',
                        3: 'Audio decoding failed',
                        4: 'Audio format not supported'
                    };
                    
                    const errorMsg = errorMessages[e.target.error?.code] || 'Unknown audio error';
                    commit('setError', errorMsg);
                    commit('setIsPlaying', false);
                    commit('setIsLoading', false);
                    commit('setConnectionStatus', 'error');
                });

                audio.addEventListener('waiting', () => {
                    commit('setIsLoading', true);
                });

                audio.addEventListener('stalled', () => {
                    commit('setIsLoading', true);
                });

                audio.addEventListener('suspend', () => {
                    commit('setIsLoading', false);
                });

                commit('setAudioPlayerController', audio);
                return audio;

            } catch (error) {
                commit('setError', 'Failed to initialize audio player');
                commit('setConnectionStatus', 'error');
                throw error;
            }
        },

        async loadStation({ commit, dispatch, state }, stationData) {
            try {
                commit('setCurrentStation', stationData);
                
                if (stationData.streaming_link) {
                    commit('setStreamUrl', stationData.streaming_link);
                    
                    // For HTTP streams on HTTPS sites, use popup window
                    if (stationData.streaming_link.startsWith('http://') && window.location.protocol === 'https:') {
                        commit('setUseIframePlayer', true);
                        await dispatch('createProxyIframe');
                    } else {
                        // For HTTPS streams, use regular audio
                        if (!state.audioPlayerController) {
                            await dispatch('initializeAudioPlayer');
                        }
                        state.audioPlayerController.src = stationData.streaming_link;
                    }
                    
                    if (stationData.programs && stationData.programs.length > 0) {
                        commit('setCurrentShow', stationData.programs[0]);
                    }
                } else {
                    throw new Error('No streaming link available');
                }

            } catch (error) {
                commit('setError', error.message);
                commit('setConnectionStatus', 'error');
            }
        },

        async play({ commit, state, dispatch }) {
            try {
                if (!state.streamUrl) {
                    throw new Error('No stream URL available');
                }

                commit('setIsLoading', true);
                commit('clearError');

                if (state.useIframePlayer && state.proxyIframe) {
                    // If using popup and window is closed, reopen it
                    if (!state.proxyIframe.popupWindow || state.proxyIframe.popupWindow.closed) {
                        await dispatch('createProxyIframe');
                    }
                    // The popup auto-plays, so we don't need to send a play message
                } else {
                    if (!state.audioPlayerController) {
                        throw new Error('Audio player not initialized');
                    }

                    const playPromise = state.audioPlayerController.play();
                    
                    if (playPromise !== undefined) {
                        await playPromise;
                    }
                }

            } catch (error) {
                if (error.name === 'NotAllowedError') {
                    commit('setError', 'Playback requires user interaction');
                } else if (error.name === 'NotSupportedError') {
                    commit('setError', 'Audio format not supported');
                } else {
                    commit('setError', error.message || 'Playback failed');
                }
                
                commit('setIsPlaying', false);
                commit('setIsLoading', false);
                commit('setConnectionStatus', 'error');
            }
        },

        pause({ commit, state }) {
            if (state.useIframePlayer && state.proxyIframe && state.proxyIframe.popupWindow && !state.proxyIframe.popupWindow.closed) {
                state.proxyIframe.popupWindow.close();
                commit('setProxyIframe', null);
                commit('setUseIframePlayer', false);
            } else if (state.audioPlayerController) {
                state.audioPlayerController.pause();
                commit('setConnectionStatus', 'disconnected');
            }
            commit('setIsPlaying', false);
        },

        async togglePlayPause({ dispatch, state }) {
            if (state.isPlaying) {
                dispatch('pause');
            } else {
                await dispatch('play');
            }
        },

        setVolume({ commit, state }, volume) {
            commit('setVolume', volume);
            // Note: Volume control not directly available for popup window
        },

        toggleMute({ commit, state }) {
            commit('setIsMuted', !state.isMuted);
            // Note: Mute control not directly available for popup window
        },

        async reconnectStream({ dispatch, state }) {
            if (state.currentStation?.streaming_link) {
                setTimeout(() => {
                    dispatch('loadStation', state.currentStation);
                }, 3000);
            }
        },

        updateListeners({ commit }, count) {
            commit('setListeners', count);
        },

        updateCurrentShow({ commit }, show) {
            commit('setCurrentShow', show);
        },

        async switchStation({ dispatch, commit }, stationData) {
            dispatch('pause');
            commit('setCurrentStation', null);
            commit('setStreamUrl', null);
            commit('clearError');
            await dispatch('loadStation', stationData);
        },

        destroy({ commit, state }) {
            if (state.proxyIframe && state.proxyIframe.popupWindow && !state.proxyIframe.popupWindow.closed) {
                state.proxyIframe.popupWindow.close();
                commit('setProxyIframe', null);
            }
            
            if (state.audioPlayerController) {
                state.audioPlayerController.pause();
                state.audioPlayerController.src = '';
                state.audioPlayerController.load();
            }
            
            commit('setAudioPlayerController', null);
            commit('setIsPlaying', false);
            commit('setIsLoading', false);
            commit('setConnectionStatus', 'disconnected');
            commit('setUseIframePlayer', false);
            commit('clearError');
        }
    }
}