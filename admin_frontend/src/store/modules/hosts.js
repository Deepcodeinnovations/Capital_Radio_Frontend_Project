export const namespaced = true

export default {
    state: {
        hosts: [],
        host: null,
    },
    
    getters: {
        hosts: (state) => state.hosts,
        host: (state) => state.host,
    },

    mutations: {
        sethosts: (state, hosts) => (state.hosts = hosts),
        sethost: (state, host) => (state.host = host),
        removehost: (state, id) => {
            state.hosts = state.hosts.data.filter(host => host.id !== id);
        },
        updatehoststatus: (state, { id, status }) => {
            const host = state.hosts.data.find(h => h.id === id);
            if (host) {
                host.status = status;
            }
        },
        updatehostprofileimage: (state, { id, image_url, image_path }) => {
            const host = state.hosts.data.find(h => h.id === id);
            if (host) {
                host.image_url = image_url;
                host.image_path = image_path;
            }
        },
    },

    actions: {
        async fetch_hosts({ commit }, {data, page}) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetch_hosts', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/hosts?page=` + page, data).then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('sethosts', response.data.data)
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

        async fetch_host({ commit }, { data, id}) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetch_host', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/hosts/${id}`, data).then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('sethost', response.data.data)
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

        async create_host({ commit }, data) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'create_host', { root: true })
            return new Promise((resolve, reject) => {
                axios.post("/admin/hosts/create", data).then(async response => {
                        commit('setloader', false, { root: true })
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

        async update_host({ commit }, { hostId, data }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'update_host', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/hosts/update/${hostId}`, data).then(async response => {
                        commit('setloader', false, { root: true })
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

        async delete_host({ commit }, { data, id}) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'delete_host', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/hosts/delete/${id}`, data).then(async response => {
                        commit('setloader', false, { root: true })
                        commit('removehost', id)
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

        async toggle_host_status({ commit }, { data, id }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'toggle_host_status', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/hosts/status/${id}`, data).then(async response => {
                        commit('setloader', false, { root: true })
                        commit('updatehoststatus', { id, status: data.status })
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

        async update_host_profile_image({ commit }, { data, id }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'update_host_profile_image', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/hosts/profile_image/${id}`, data).then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('updatehostprofileimage', { 
                                id, 
                                image_url: response.data.data.image_url,
                                image_path: response.data.data.image_path
                            })
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