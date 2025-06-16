export const namespaced = true

export default {
    state: {
        programs: [],
        program: null,
    },
    
    getters: {
        programs: (state) => state.programs,
        program: (state) => state.program,
    },

    mutations: {
        setprograms: (state, programs) => (state.programs = programs),
        setprogram: (state, program) => (state.program = program),
        removeprogram: (state, id) => {
            state.programs.data = state.programs.data.filter(program => program.id !== id);
        },
        updateprogramstatus: (state, { id, status }) => {
            const program = state.programs.data.find(p => p.id === id);
            if (program) {
                program.status = status;
            }
        },
        addprogram: (state, program) => {
            state.programs.unshift(program);
        },
        updateprogram: (state, updatedProgram) => {
            const index = state.programs.data.findIndex(p => p.id === updatedProgram.id);
            if (index !== -1) {
                state.programs.data.splice(index, 1, updatedProgram);
            }
        },
    },

    actions: {
        async fetch_programs({ commit }, {data, page}) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetch_programs', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/radio_programs?page=` + page, data).then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('setprograms', response.data.data)
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

        async fetch_program({ commit }, { data, id}) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetch_program', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/radio_programs/${id}`, data).then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('setprogram', response.data.data)
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

        async create_program({ commit }, data) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'create_program', { root: true })
            return new Promise((resolve, reject) => {
                axios.post("/admin/radio_programs/create", data).then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('addprogram', response.data.data)
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

        async update_program({ commit }, { programId, data }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'update_program', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/radio_programs/update/${programId}`, data).then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('updateprogram', response.data.data)
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

        async delete_program({ commit }, { data, id}) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'delete_program', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/radio_programs/delete/${id}`, data).then(async response => {
                        commit('setloader', false, { root: true })
                        commit('removeprogram', id)
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

        async toggle_program_status({ commit }, { data, id }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'toggle_program_status', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/radio_programs/status/${id}`, data).then(async response => {
                        commit('setloader', false, { root: true })
                        commit('updateprogramstatus', { id, status: data.status })
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