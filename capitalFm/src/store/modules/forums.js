export const namespaced = true

export default {
    state: {
        forums: null,
        forum_details: '',
        comments: null,
    },
    
    getters: {
        forums: (state) => state.forums,
        forum_details: (state) => state.forum_details,
        comments: (state) => state.comments,
    },

    mutations: {
        setforums: (state, forums) => (state.forums = forums),
        setforum_details: (state, forum_details) => (state.forum_details = forum_details),
        setcomments: (state, comments) => (state.comments = comments),
    },

    actions: {
        async fetch_user_forums({ commit }, data) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetch_user_forums', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/forums`, data).then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('setforums', response.data.data)
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

        async fetch_forum_details_by_slug({ commit }, slug) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetch_forum_details_by_slug', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/forums/details`, {slug: slug}).then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('setforum_details', response.data.data)
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

        async fetch_forum_comments({ commit }, data) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetch_forum_comments', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/forums/comments`, data).then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('setcomments', response.data.data)
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

        async create_forum_comment({ commit }, data) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'create_forum_comment', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/forums/comments/create`, data).then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('setmsg', 'Comment created successfully', { root: true })
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

        async delete_forum_comment({ commit }, data) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'delete_forum_comment', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/forums/comments/delete`, data).then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('setmsg', 'Comment deleted successfully', { root: true })
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