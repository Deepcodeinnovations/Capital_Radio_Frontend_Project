export const namespaced = true

export default {
    state: {
        recordingStatus: null,
        sessionRecordings: [],
        sessionRecording: null,
    },
    
    getters: {
        recordingStatus: (state) => state.recordingStatus,
        sessionRecordings: (state) => state.sessionRecordings,
        sessionRecording: (state) => state.sessionRecording,
    },

    mutations: {
        setrecordingStatus: (state, recordingStatus) => (state.recordingStatus = recordingStatus),
        setsessionRecordings: (state, sessionRecordings) => (state.sessionRecordings = sessionRecordings),
        setsessionRecording: (state, sessionRecording) => (state.sessionRecording = sessionRecording),
        
        // FIXED: Properly handle the nested data structure
        removesessionRecording: (state, id) => {
            if (state.sessionRecordings && state.sessionRecordings.data) {
                state.sessionRecordings.data = state.sessionRecordings.data.filter(recording => recording.id !== id);
            }
        },
        
        updatesessionRecordingstatus: (state, { id, status }) => {
            const recording = state.sessionRecordings.data.find(r => r.id === id);
            if (recording) {
                recording.status = status;
            }
        },
        updatesessionRecordingrecording_status: (state, { id, recording_status }) => {
            const recording = state.sessionRecordings.data.find(r => r.id === id);
            if (recording) {
                recording.recording_status = recording_status;
            }
        },
    },

    actions: {
        async start_recording_sessions({ commit, dispatch }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'start_recording_sessions', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/radio_sessions/start`).then(async response => {
                        commit('setloader', false, { root: true })
                        dispatch('get_recording_status')
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

        async stop_recording_sessions({ commit , dispatch}) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'stop_recording_sessions', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/radio_sessions/stop`).then(async response => {
                        commit('setloader', false, { root: true })
                        dispatch('get_recording_status')
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

        async get_recording_status({ commit }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'get_recording_status', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/radio_sessions/recording_status`).then(async response => {
                        commit('setloader', false, { root: true })
                        commit('setrecordingStatus', response.data.data)
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

        async fetch_session_recordings({ commit }, {data, page}) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetch_session_recordings', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/radio_sessions/list`, data).then(async response => {
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

        async fetch_session_recording({ commit }, { data, id}) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetch_session_recording', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/radio_sessions/get/${id}`, data).then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('setsessionRecording', response.data.data)
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


        async update_session_recording({ commit }, { data, id}) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'update_session_recording', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/radio_sessions/update/${id}`, data).then(async response => {
                        commit('setloader', false, { root: true })
                        commit('updatesessionRecording', response.data.data)
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

        async delete_session_recording({ commit }, { data, id}) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'delete_session_recording', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/radio_sessions/delete/${id}`, data).then(async response => {
                        commit('setloader', false, { root: true })
                        commit('removesessionRecording', id)
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

        async toggle_session_recording_status({ commit }, { data, id }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'toggle_session_recording_status', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/radio_sessions/toggle-status/${id}`, data).then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('updatesessionRecordingstatus', { id, status: response.data.data.status })
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

        async update_recording_status({ commit }, { data, id }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'update_recording_status', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/radio_sessions/update-recording-status/${id}`, data).then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('updatesessionRecordingrecording_status', { id, recording_status: response.data.data.recording_status })
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
    },
}