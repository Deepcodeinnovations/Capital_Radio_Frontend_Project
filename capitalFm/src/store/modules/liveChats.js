export const namespaced = true

export default {
    state: {
        livechatmessages: null,
    },
    
    getters: {
        livechatmessages: (state) => state.livechatmessages,
    },

    mutations: {
        setlivechatmessages: (state, livechatmessages) => (state.livechatmessages = livechatmessages),
        pushtolivechatmessages: (state, newlivechatmessages) => {
            const exists = state.livechatmessages.some(msg => 
                msg.id === newlivechatmessages.id || 
                (msg.message === newlivechatmessages.message && msg.user_id === newlivechatmessages.user_id && msg.created_at === newlivechatmessages.created_at)
            );
            if (!exists) {
                state.livechatmessages.push(newlivechatmessages);
            }
        },
        removefromlivechatmessages: (state, messageToRemove) => {
            state.livechatmessages = state.livechatmessages.filter(msg => 
                msg.id !== messageToRemove.id &&
                !(msg.message === messageToRemove.message && 
                  msg.user_id === messageToRemove.user_id && 
                  msg.created_at === messageToRemove.created_at)
            );
        }
    },

    actions: {

        async fetch_livechat({ commit }, data) {
            commit('seterror', '')
            commit('setmsg', '')
            commit('setloader', 'fetch_station')
            return new Promise((resolve, reject) => {
                axios.post(`/station/livechat`, data).then(async response => {
                        commit('setloader', false)
                        if (response.data.data) {
                            commit('setlivechatmessages', response.data.data)
                        }
                        resolve(response)
                    })
                    .catch(async error => {
                        commit('setloader', false)
                        if (error.response) {
                            if (error.response.data) {
                                if (error.response.data.msg) {
                                    commit('seterror', error.response.data.msg)
                                } else if (error.response.data.message) {
                                    commit('seterrors', error.response.data.message)
                                }
                            }
                        }
                        reject(error)
                    });
            });
        },
        
        async send_livechat({ commit }, data) {
            commit('seterror', '')
            commit('setmsg', '')
            commit('setloader', 'fetch_station')
            return new Promise((resolve, reject) => {
                axios.post(`/station/livechat/create`, data).then(async response => {
                        commit('setloader', false)
                        resolve(response)
                    })
                    .catch(async error => {
                        commit('setloader', false)
                        if (error.response) {
                            if (error.response.data) {
                                if (error.response.data.msg) {
                                    commit('seterror', error.response.data.msg)
                                } else if (error.response.data.message) {
                                    commit('seterrors', error.response.data.message)
                                }
                            }
                        }
                        reject(error)
                    });
            });
        },

        async delete_livechat({ commit }, data) {
            commit('seterror', '')
            commit('setmsg', '')
            commit('setloader', 'fetch_station')
            return new Promise((resolve, reject) => {
                axios.post(`/station/livechat`, data).then(async response => {
                        commit('setloader', false)
                        if (response.data.data) {
                            commit('setlivechatmessages', response.data.data)
                        }
                        resolve(response)
                    })
                    .catch(async error => {
                        commit('setloader', false)
                        if (error.response) {
                            if (error.response.data) {
                                if (error.response.data.msg) {
                                    commit('seterror', error.response.data.msg)
                                } else if (error.response.data.message) {
                                    commit('seterrors', error.response.data.message)
                                }
                            }
                        }
                        reject(error)
                    });
            });
        },



    }
}