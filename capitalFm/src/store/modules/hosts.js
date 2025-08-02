export const namespaced = true

export default {
    state: {
        hosts: null,
    },
    
    getters: {
        hosts: (state) => state.hosts,
    },

    mutations: {
        sethosts: (state, hosts) => (state.hosts = hosts),
    },

    actions: {

        async fetch_hosts({ commit }, data) {
            commit('seterror', '')
            commit('setmsg', '')
            commit('setloader', 'fetch_hosts')
            return new Promise((resolve, reject) => {
                axios.post(`/hosts`, data).then(async response => {
                        commit('setloader', false)
                        if (response.data.data) {
                            commit('sethosts', response.data.data)
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