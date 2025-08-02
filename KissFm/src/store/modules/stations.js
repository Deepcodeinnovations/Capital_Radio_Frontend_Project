export const namespaced = true

export default {
    state: {
        station: null,
        sessionRecordings: null,
        events: null,
    },
    
    getters: {
        station: (state) => state.station,
        sessionRecordings: (state) => state.sessionRecordings,
        events: (state) => state.events,
    },

    mutations: {
        setstation: (state, station) => (state.station = station),
        setsessionRecordings: (state, sessionRecordings) => (state.sessionRecordings = sessionRecordings),
        setevents: (state, events) => (state.events = events),
    },

    actions: {

        async fetch_station_details({ commit }, data) {
            commit('seterror', '')
            commit('setmsg', '')
            commit('setloader', 'fetch_station')
            return new Promise((resolve, reject) => {
                axios.post(`/station`, data).then(async response => {
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


        async fetch_session_recordings({ commit }, {data, page}) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetch_session_recordings', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/radio_sessions`, data).then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('setsessionRecordings', response.data.data)
                        }
                        resolve(response)
                    })
                    .catch(async error => {
                        commit('setloader', false, { root: true })
                        if (error.response) {
                            if (error.response.data) {
                                if (error.response.data.msg) {
                                    commit('seterror', error.response.data.msg, { root: true })
                                } else if (error.response.data.message) {
                                    commit('seterrors', error.response.data.message, { root: true })
                                }
                            }
                        }
                        reject(error)
                    });
            });
        },

        async fetch_events({ commit }, {data, page}) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetch_events', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/events`, data).then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('setevents', response.data.data)
                        }
                        resolve(response)
                    })
                    .catch(async error => {
                        commit('setloader', false, { root: true })
                        if (error.response) {
                            if (error.response.data) {
                                if (error.response.data.msg) {
                                    commit('seterror', error.response.data.msg, { root: true })
                                } else if (error.response.data.message) {
                                    commit('seterrors', error.response.data.message, { root: true })
                                }
                            }
                        }
                        reject(error)
                    });
            });
        },



    }
}