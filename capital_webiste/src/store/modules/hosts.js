export const namespaced = true

export default {
    state: {
        station: null,
    },
    
    getters: {
        station: (state) => state.station,
    },

    mutations: {
        setstation: (state, station) => (state.station = station),
    },

    actions: {

        async fetch_station({ commit }, { data, id}) {
            commit('seterror', '')
            commit('setmsg', '')
            commit('setloader', 'fetch_station')
            return new Promise((resolve, reject) => {
                axios.post(`/admin/stations/${id}`, data).then(async response => {
                        commit('setloader', false)
                        if (response.data.data) {
                            commit('setstation', response.data.data)
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