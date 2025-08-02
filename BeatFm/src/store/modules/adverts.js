export const namespaced = true

export default {
    state: {
        adverts: null,
    },
    
    getters: {
        adverts: (state) => state.adverts,
    },

    mutations: {
        setadverts: (state, adverts) => (state.adverts = adverts),
    },

    actions: {

        async fetch_adverts({ commit }, data) {
            commit('seterror', '')
            commit('setmsg', '')
            commit('setloader', 'fetch_adverts')
            return new Promise((resolve, reject) => {
                axios.post(`/adverts`, data).then(async response => {
                        commit('setloader', false)
                        if (response.data.data) {
                            commit('setadverts', response.data.data)
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