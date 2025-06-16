export const namespaced = true
import { useToast } from 'vue-toastification'
import { comp_play_error_file, comp_play_success_file, comp_play_delete_file } from '@/store/modules/utils';
const toast = useToast()

export default {
    state: {
        wsSocket: null,
        wsConnectionStatus: 'disconnected', // 'connecting', 'connected', 'disconnected', 'error'
        wsReconnectAttempts: 0,
        wsMaxReconnectAttempts: 10,
        wsReconnectDelay: 3000,
        wsMessages: [],
        wsLastMessage: null,
        wsConnectedAt: null,
        wsHeartbeatInterval: null,
    },
    
    getters: {
        wsSocket: (state) => state.wsSocket,
        wsConnectionStatus: (state) => state.wsConnectionStatus,
        wsReconnectAttempts: (state) => state.wsReconnectAttempts,
        wsIsConnected: (state) => state.wsConnectionStatus === 'connected',
        wsIsConnecting: (state) => state.wsConnectionStatus === 'connecting',
        wsMessages: (state) => state.wsMessages,
        wsLastMessage: (state) => state.wsLastMessage,
        wsConnectionStatusText: (state) => {
            switch (state.wsConnectionStatus) {
                case 'connecting': return 'Connecting...';
                case 'connected': return 'Connected';
                case 'disconnected': return 'Disconnected';
                case 'error': return 'Connection Error';
                default: return 'Unknown';
            }
        },
    },

    mutations: {
        setWsSocket: (state, socket) => (state.wsSocket = socket),
        setWsConnectionStatus: (state, status) => (state.wsConnectionStatus = status),
        setWsReconnectAttempts: (state, attempts) => (state.wsReconnectAttempts = attempts),
        incrementWsReconnectAttempts: (state) => (state.wsReconnectAttempts++),
        resetWsReconnectAttempts: (state) => (state.wsReconnectAttempts = 0),
        addWsMessage: (state, message) => {
            state.wsMessages.push({
                ...message,
                timestamp: new Date().toISOString(),
                id: Date.now() + Math.random()
            });
            // Keep only last 100 messages for performance
            if (state.wsMessages.length > 100) {
                state.wsMessages = state.wsMessages.slice(-100);
            }
        },
        setWsLastMessage: (state, message) => (state.wsLastMessage = message),
        setWsConnectedAt: (state, timestamp) => (state.wsConnectedAt = timestamp),
        setWsHeartbeatInterval: (state, interval) => (state.wsHeartbeatInterval = interval),
        clearWsMessages: (state) => (state.wsMessages = []),
    },

    actions: {
        // Initialize WebSocket connection
        async connectWebSocket({ commit, dispatch, rootGetters }) {
            try {
                const authuser = rootGetters.authuser;
                const authtoken = rootGetters.authtoken;

                console.log(authuser)

                if (!authuser || !authtoken) {
                    console.log('WebSocket: Not authenticated, skipping connection');
                    return false;
                }

                // Check if already connected
                const currentSocket = rootGetters.wsSocket;
                if (currentSocket?.readyState === WebSocket.OPEN) {
                    console.log('WebSocket: Already connected');
                    return true;
                }

                commit('setWsConnectionStatus', 'connecting');
                const isLocalhost = window.location.href.includes('localhost') || window.location.href.includes('192.168.100.10');
                const protocol = isLocalhost ? 'ws:' : 'wss:';
                const host = isLocalhost ? '127.0.0.1:8000' : 'bmrydatadispatchhost.com';
                const getWebSocketUrl = `${protocol}//${host}/api/v1/websockets/eventStream/connect`;
                const wsUrl = getWebSocketUrl + `?token=${authtoken}`;
                console.log('WebSocket: Connecting to', wsUrl);
                
                const socket = new WebSocket(wsUrl);
                commit('setWsSocket', socket);
                
                return new Promise((resolve, reject) => {
                    socket.onopen = () => {
                        console.log('WebSocket: Connected successfully');
                        commit('setWsConnectionStatus', 'connected');
                        commit('resetWsReconnectAttempts');
                        commit('setWsConnectedAt', new Date().toISOString());
                        
                        // Start heartbeat
                        dispatch('startHeartbeat');
                        resolve(true);
                    };
                    
                    socket.onmessage = (event) => {
                        try {
                            const message = JSON.parse(event.data);
                            console.log('WebSocket: Received message', message);
                            dispatch('handleWebSocketMessage', message);
                        } catch (error) {
                            console.error('WebSocket: Error parsing message', error);
                        }
                    };
                    
                    socket.onclose = (event) => {
                        console.log('WebSocket: Connection closed', event.code, event.reason);
                        commit('setWsConnectionStatus', 'disconnected');
                        commit('setWsSocket', null);
                        dispatch('stopHeartbeat');
                        
                        // Auto-reconnect if not intentionally closed
                        if (event.code !== 1000 && authuser && authtoken) {
                            dispatch('handleReconnection');
                        }
                    };
                    
                    socket.onerror = (error) => {
                        console.error('WebSocket: Connection error', error);
                        commit('setWsConnectionStatus', 'error');
                        toast.error('Connection error occurred');
                        reject(error);
                    };
                });
                
            } catch (error) {
                console.error('WebSocket: Failed to create connection', error);
                commit('setWsConnectionStatus', 'error');
                toast.error('Failed to establish connection');
                throw error;
            }
        },

        // Handle WebSocket reconnection
        async handleReconnection({ commit, dispatch, state }) {
            if (state.wsReconnectAttempts >= state.wsMaxReconnectAttempts) {
                console.log('WebSocket: Max reconnection attempts reached');
                toast.error('Connection lost. Please refresh the page.');
                return;
            }

            commit('incrementWsReconnectAttempts');
            console.log(`WebSocket: Attempting reconnection ${state.wsReconnectAttempts}/${state.wsMaxReconnectAttempts}`);
            
            setTimeout(() => {
                dispatch('connectWebSocket').catch(console.error);
            }, state.wsReconnectDelay);
        },

        // Disconnect WebSocket
        disconnectWebSocket({ commit, dispatch, state }) {
            if (state.wsSocket) {
                console.log('WebSocket: Disconnecting');
                state.wsSocket.close(1000, 'User logout');
                commit('setWsSocket', null);
                commit('setWsConnectionStatus', 'disconnected');
                commit('resetWsReconnectAttempts');
                dispatch('stopHeartbeat');
            }
        },

        // Send message through WebSocket
        sendWebSocketMessage({ state }, message) {
            if (state.wsSocket?.readyState === WebSocket.OPEN) {
                const messageStr = JSON.stringify(message);
                state.wsSocket.send(messageStr);
                console.log('WebSocket: Message sent', message);
                return true;
            }
            console.warn('WebSocket: Cannot send message, connection not open');
            return false;
        },

        // Handle incoming WebSocket messages
        handleWebSocketMessage({ commit, dispatch }, message) {
            commit('addWsMessage', message);
            commit('setWsLastMessage', message);
            
            const { type, response, user_id } = message;
            

            console.log(response)
            if(response){
                if(response.type == 'notification'){
                    console.log(response.data.data)
                   
                }
            }
        },

    

        // Start heartbeat to keep connection alive
        startHeartbeat({ commit, dispatch, state }) {
            dispatch('stopHeartbeat'); // Clear any existing interval
            
            const interval = setInterval(() => {
                if (state.wsConnectionStatus === 'connected') {
                    dispatch('sendWebSocketMessage', {
                        type: 'ping',
                        timestamp: new Date().toISOString()
                    });
                }
            }, 30000); // Send heartbeat every 30 seconds
            
            commit('setWsHeartbeatInterval', interval);
        },

        // Stop heartbeat
        stopHeartbeat({ commit, state }) {
            if (state.wsHeartbeatInterval) {
                clearInterval(state.wsHeartbeatInterval);
                commit('setWsHeartbeatInterval', null);
            }
        },

        // Get connection statistics
        getConnectionStats({ state }) {
            return {
                status: state.wsConnectionStatus,
                connectedAt: state.wsConnectedAt,
                reconnectAttempts: state.wsReconnectAttempts,
                messageCount: state.wsMessages.length,
                lastMessage: state.wsLastMessage,
            };
        },

        // Clear message history
        clearWebSocketMessages({ commit }) {
            commit('clearWsMessages');
        },

        // Force reconnection
        async forceReconnection({ dispatch }) {
            dispatch('disconnectWebSocket');
            await new Promise(resolve => setTimeout(resolve, 1000));
            return dispatch('connectWebSocket');
        },
    }
}