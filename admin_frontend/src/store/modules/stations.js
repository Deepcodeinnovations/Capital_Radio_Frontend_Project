export const namespaced = true

export default {
    state: {
        stations: [],
        station: null,
    },
    
    getters: {
        stations: (state) => state.stations,
        station: (state) => state.station,
    },

    mutations: {
        setstations: (state, stations) => (state.stations = stations),
        setstation: (state, station) => (state.station = station),
    },

    actions: {
        async fetch_stations({ commit }, {data, page}) {
            commit('seterror', '')
            commit('setmsg', '')
            commit('setloader', 'fetch_stations')
            return new Promise((resolve, reject) => {
                axios.post(`/admin/stations?page=` + page, data).then(async response => {
                        commit('setloader', false)
                        if (response.data.data) {
                            commit('setstations', response.data.data)
                        }
                        resolve(response)
                    })
                    .catch(async error => {
                        commit('setloader', false)
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

        async create_station({ commit }, data) {
            commit('seterror', '')
            commit('setmsg', '')
            commit('setloader', 'create_station')
            return new Promise((resolve, reject) => {
                axios.post("/admin/stations/create", data).then(async response => {
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

        async update_station({ commit }, { stationId, data }) {
            commit('seterror', '')
            commit('setmsg', '')
            commit('setloader', 'update_station')
            return new Promise((resolve, reject) => {
                axios.post(`/admin/stations/update/${stationId}`, data).then(async response => {
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

        async delete_station({ commit }, { data, id}) {
            commit('seterror', '')
            commit('setmsg', '')
            commit('setloader', 'delete_station')
            return new Promise((resolve, reject) => {
                axios.post(`/admin/stations/delete/${id}`, data).then(async response => {
                        commit('setloader', false)
                        commit('removestation', id)
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

        async toggle_streaming_status({ commit }, { data, id }) {
            commit('seterror', '')
            commit('setmsg', '')
            commit('setloader', 'toggle_streaming_status')
            return new Promise((resolve, reject) => {
                axios.post(`/admin/stations/streaming_status/${id}`, data).then(async response => {
                        commit('setloader', false)
                        commit('updatestreamingstatus', { id, status })
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

        async toggle_radio_access({ commit }, { data, id }) {
            commit('seterror', '')
            commit('setmsg', '')
            commit('setloader', 'toggle_radio_access')
            return new Promise((resolve, reject) => {
                axios.post(`/admin/stations/radio_access/${id}`, data).then(async response => {
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


    }
}