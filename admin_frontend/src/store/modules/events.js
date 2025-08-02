export const namespaced = true

export default {
    state: {
        events: [],
        event: null,
    },
    
    getters: {
        events: (state) => state.events,
        event: (state) => state.event,
    },

    mutations: {
        setevents: (state, events) => (state.events = events),
        setevent: (state, event) => (state.event = event),
        removeevent: (state, id) => {
            state.events = state.events.data.filter(event => event.id !== id);
        },
        updateeventstatus: (state, { id, status }) => {
            const event = state.events.data.find(e => e.id === id);
            if (event) {
                event.status = status;
            }
        },
        updateeventfeatured: (state, { id, is_featured }) => {
            const event = state.events.data.find(e => e.id === id);
            if (event) {
                event.is_featured = is_featured;
            }
        },
        updateeventpublished: (state, { id, is_published }) => {
            const event = state.events.data.find(e => e.id === id);
            if (event) {
                event.is_published = is_published;
            }
        },
        updateeventimage: (state, { id, featured_image_url, featured_image_path }) => {
            const event = state.events.data.find(e => e.id === id);
            if (event) {
                event.featured_image_url = featured_image_url;
                event.featured_image_path = featured_image_path;
            }
        },
    },

    actions: {
        async fetch_events({ commit }, {data, page}) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetch_events', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/events?page=` + page, data).then(async response => {
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

        async fetch_event({ commit }, { data, id}) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetch_event', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/events/details/${id}`, { params: data }).then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('setevent', response.data.data)
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

        async create_event({ commit }, data) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'create_event', { root: true })
            return new Promise((resolve, reject) => {
                axios.post("/admin/events/create", data).then(async response => {
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

        async update_event({ commit }, { eventId, data }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'update_event', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/events/update/${eventId}`, data).then(async response => {
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

        async delete_event({ commit }, { data, id}) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'delete_event', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/events/delete/${id}`, { data }).then(async response => {
                        commit('setloader', false, { root: true })
                        commit('removeevent', id)
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

        async toggle_event_status({ commit }, { data, id }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'toggle_event_status', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/events/status/${id}`, data).then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('updateeventstatus', { id, status: response.data.data.status })
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

        async toggle_event_featured({ commit }, { data, id }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'toggle_event_featured', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/events/featured/${id}`, data).then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('updateeventfeatured', { id, is_featured: response.data.data.is_featured })
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

        async publish_event({ commit }, { data, id }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'publish_event', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/events/publish/${id}`, data).then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('updateeventpublished', { id, is_published: response.data.data.is_published })
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

        async unpublish_event({ commit }, { data, id }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'unpublish_event', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/events/unpublish/${id}`, data).then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('updateeventpublished', { id, is_published: response.data.data.is_published })
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

        async duplicate_event({ commit }, { data, id }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'duplicate_event', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/events/duplicate/${id}`, data).then(async response => {
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
    },
}