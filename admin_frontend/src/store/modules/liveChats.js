// liveChats.js - Live Chats store module

export default {
  namespaced: true,
  state: {
    liveChat: [
      {
        id: 1,
        username: 'MusicLover22',
        message: 'This track is amazing! Who\'s the artist?',
        time: '14:40'
      },
      {
        id: 2,
        username: 'DJFan',
        message: 'It\'s the new release from Glass Animals',
        time: '14:41'
      },
      {
        id: 3,
        username: 'RadioHead',
        message: 'I\'ve been waiting for this song all day!',
        time: '14:44'
      }
    ],
    chatRooms: [
      {
        id: 1,
        name: 'Main Chat',
        description: 'General discussion about music and broadcasts',
        activeUsers: 42
      },
      {
        id: 2,
        name: 'Morning Show',
        description: 'Chat about the morning show topics',
        activeUsers: 18
      },
      {
        id: 3,
        name: 'Song Requests',
        description: 'Request your favorite songs here',
        activeUsers: 27
      }
    ]
  },
  mutations: {
    addChatMessage(state, message) {
      state.liveChat.push(message)
    }
  },
  actions: {
    sendChatMessage({ commit }, message) {
      const newMessage = {
        id: Date.now(),
        ...message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      commit('addChatMessage', newMessage)
    }
  },
  getters: {
    liveChat: state => state.liveChat,
    chatRooms: state => state.chatRooms
  }
}