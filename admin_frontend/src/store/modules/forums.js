export const namespaced = true
import { useToast } from 'vue-toastification'
import { comp_play_error_file, comp_play_success_file } from './utils';
const toast = useToast()

export default {
    state: {
        forums: [],
        forum: null,
        comments: [],
    },

    getters: {
        forums: (state) => state.forums,
        forum: (state) => state.forum,
        comments: (state) => state.comments,
    },

    mutations: {
        setForums: (state, forums) => (state.forums = forums),
        setForum: (state, forum) => (state.forum = forum),
        setComments: (state, comments) => (state.comments = comments),
        addForum: (state, forum) => state.forums.data.unshift(forum),
        updateForum: (state, updatedForum) => {
            const index = state.forums.data.findIndex(f => f.id === updatedForum.id)
            if (index !== -1) {
                state.forums.data.splice(index, 1, updatedForum)
            }
            if (state.forum && state.forum.id === updatedForum.id) {
                state.forum = updatedForum
            }
        },
        removeForum: (state, id) => {
            state.forums.data = state.forums.data.filter(f => f.id !== id)
            if (state.forum && state.forum.id === id) {
                state.forum = null
            }
        },
        addComment: (state, comment) => {
            if (state.comments.data) {
                state.comments.data.unshift(comment)
            }
        },
        updateComment: (state, updatedComment) => {
            const index = state.comments.data.findIndex(c => c.id === updatedComment.id)
            if (index !== -1) {
                state.comments.data.splice(index, 1, updatedComment)
            }
        },
        removeComment: (state, id) => {
            state.comments.data = state.comments.data.filter(c => c.id !== id)
        }
    },

    actions: {
        async fetchForums({ commit }, filters = {}) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetchForums', { root: true })
            return new Promise((resolve, reject) => {
                axios.post("/admin/forums", filters)
                .then(response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('setForums', response.data.data)
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response?.data?.msg) {
                        commit('seterror', error.response.data.msg, { root: true })
                        toast.error(error.response.data.msg)
                    }
                    await comp_play_error_file('Error During Fetching Forums')
                    reject(error)
                })
            })
        },

        async fetchForum({ commit }, id) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetchForum', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/forums/${id}`)
                .then(response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('setForum', response.data.data)
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response?.data?.msg) {
                        commit('seterror', error.response.data.msg, { root: true })
                        toast.error(error.response.data.msg)
                    }
                    await comp_play_error_file('Error During Fetching Forum')
                    reject(error)
                })
            })
        },

        async createForum({ commit }, data) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'createForum', { root: true })
            return new Promise((resolve, reject) => {
                axios.post("/admin/forums/create", data)
                .then(async response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('addForum', response.data.data)
                        toast.success(response.data.msg)
                        await comp_play_success_file('Forum Created Successfully')
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response?.data?.msg) {
                        commit('seterror', error.response.data.msg, { root: true })
                        toast.error(error.response.data.msg)
                    }
                    await comp_play_error_file('Error During Creating Forum')
                    reject(error)
                })
            })
        },

        async updateForum({ commit }, { id, data }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'updateForum', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/forums/update/${id}`, data)
                .then(async response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('updateForum', response.data.data)
                        toast.success(response.data.msg)
                        await comp_play_success_file('Forum Updated Successfully')
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response?.data?.msg) {
                        commit('seterror', error.response.data.msg, { root: true })
                        toast.error(error.response.data.msg)
                    }
                    await comp_play_error_file('Error During Updating Forum')
                    reject(error)
                })
            })
        },

        async deleteForum({ commit }, id) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'deleteForum', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/forums/delete/${id}`)
                .then(async response => {
                    commit('setloader', false, { root: true })
                    commit('removeForum', id)
                    toast.success(response.data.msg)
                    await comp_play_success_file('Forum Deleted Successfully')
                    resolve(response)
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response?.data?.msg) {
                        commit('seterror', error.response.data.msg, { root: true })
                        toast.error(error.response.data.msg)
                    }
                    await comp_play_error_file('Error During Deleting Forum')
                    reject(error)
                })
            })
        },

        async fetchComments({ commit }, forumId) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetchComments', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/forums/${forumId}/comments`)
                .then(response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('setComments', response.data.data)
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response?.data?.msg) {
                        commit('seterror', error.response.data.msg, { root: true })
                        toast.error(error.response.data.msg)
                    }
                    await comp_play_error_file('Error During Fetching Comments')
                    reject(error)
                })
            })
        },

        async createComment({ commit }, { forumId, data }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'createComment', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/forums/${forumId}/comments/create`, data)
                .then(async response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('addComment', response.data.data)
                        toast.success(response.data.msg)
                        await comp_play_success_file('Comment Added Successfully')
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response?.data?.msg) {
                        commit('seterror', error.response.data.msg, { root: true })
                        toast.error(error.response.data.msg)
                    }
                    await comp_play_error_file('Error During Adding Comment')
                    reject(error)
                })
            })
        },

        async updateComment({ commit }, { forumId, commentId, data }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'updateComment', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/forums/${forumId}/comments/update/${commentId}`, data)
                .then(async response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('updateComment', response.data.data)
                        toast.success(response.data.msg)
                        await comp_play_success_file('Comment Updated Successfully')
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response?.data?.msg) {
                        commit('seterror', error.response.data.msg, { root: true })
                        toast.error(error.response.data.msg)
                    }
                    await comp_play_error_file('Error During Updating Comment')
                    reject(error)
                })
            })
        },

        async deleteComment({ commit }, { forumId, commentId }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'deleteComment', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/forums/${forumId}/comments/delete/${commentId}`)
                .then(async response => {
                    commit('setloader', false, { root: true })
                    commit('removeComment', commentId)
                    toast.success(response.data.msg)
                    await comp_play_success_file('Comment Deleted Successfully')
                    resolve(response)
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response?.data?.msg) {
                        commit('seterror', error.response.data.msg, { root: true })
                        toast.error(error.response.data.msg)
                    }
                    await comp_play_error_file('Error During Deleting Comment')
                    reject(error)
                })
            })
        }
    }
}