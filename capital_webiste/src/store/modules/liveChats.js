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
        pushtolivechatmessages: (state, newlivechatmessages) => state.livechatmessages.push(newlivechatmessages),
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
                        console.log(response.data.data)
                        if (response.data.data) {
                            commit('pushtolivechatmessages', response.data.data)
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