export const namespaced = true
import { comp_play_error_file, comp_play_success_file } from './utils'
export default {
    state: {
        authuser: '',
        adminLocation: '',
        isAdminAuth: '',
        adminToken: '',
        adminSessionTimerStatus: false,
        admin_reset_email: '',
        adminList: [],
        adminPagination: null,
        currentAdmin: null,
        adminStats: null
    },
    
    getters: {
        authuser: (state) => state.authuser,
        adminLocation: (state) => state.adminLocation,
        isAdminAuth: state => !!state.authuser,
        adminToken: (state) => state.adminToken,
        adminSessionTimerStatus: (state) => state.adminSessionTimerStatus,
        admin_reset_email: (state) => state.admin_reset_email,
        adminList: (state) => state.adminList,
        adminPagination: (state) => state.adminPagination,
        currentAdmin: (state) => state.currentAdmin,
        adminStats: (state) => state.adminStats
    },

    mutations: {
        setauthuser: (state, authuser) => (state.authuser = authuser),
        setAdminLocation: (state, adminLocation) => (state.adminLocation = adminLocation),
        setIsAdminAuth: (state, isAdminAuth) => (state.isAdminAuth = isAdminAuth),
        setAdminToken: (state, adminToken) => (state.adminToken = adminToken),
        setAdminSessionTimerStatus: (state, adminSessionTimerStatus) => (state.adminSessionTimerStatus = adminSessionTimerStatus),
        setAdminResetEmail: (state, admin_reset_email) => (state.admin_reset_email = admin_reset_email),
        setAdminList: (state, adminList) => (state.adminList = adminList),
        setAdminPagination: (state, adminPagination) => (state.adminPagination = adminPagination),
        setCurrentAdmin: (state, currentAdmin) => (state.currentAdmin = currentAdmin),
        setAdminStats: (state, adminStats) => (state.adminStats = adminStats),
        updateAdminInList: (state, updatedAdmin) => {
            const index = state.adminList.data.findIndex(admin => admin.id === updatedAdmin.id)
            if (index !== -1) state.adminList.data.splice(index, 1, updatedAdmin)
        },
        removeAdminFromList: (state, adminId) => {
            state.adminList.data = state.adminList.data.filter(admin => admin.id !== adminId)
        }
    },

    actions: {

    async AdminStatistics({ commit }, data) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'AdminStatistics', { root: true })
            return new Promise((resolve, reject) => {
                axios.post("/admin/statistics/analytics", data).then(async response => {
                    commit('setloader', false, { root: true })
                    if (response.data) {
                        commit('setAdminStats', response.data.data)
                        resolve(response)
                    }
                }).catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response?.data) {
                        const errorMsg = error.response.data.msg || error.response.data.message || 'Login failed'
                        commit('seterror', errorMsg, { root: true })
                        await comp_play_error_file(errorMsg)
                        reject(error)
                    }
                })
            })
        },
        
        async adminLogin({ commit }, data) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'adminLogin', { root: true })
            return new Promise((resolve, reject) => {
                axios.post("/auth/admin/login", data).then(async response => {
                    commit('setloader', false, { root: true })
                    console.log(response.data.data.authtoken.access_token)
                    if (response.data.data.authtoken) {
                        localStorage.setItem('capital_radio_token_admin' + response.data.data.admin.id, response.data.data.authtoken.access_token)
                        commit('setauthuser', response.data.data.admin)
                        commit('setAdminToken', response.data.data.authtoken.access_token)
                        const success_msg = response.data.msg || 'Admin login successful'
                        await comp_play_success_file(success_msg)
                        resolve(response)
                    }
                }).catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response?.data) {
                        const errorMsg = error.response.data.msg || error.response.data.message || 'Login failed'
                        commit('seterror', errorMsg, { root: true })
                        await comp_play_error_file(errorMsg)
                        reject(error)
                    }
                })
            })
        },

        async adminLogout({ commit }, data = {}) {
            commit('setloader', 'adminLogout', { root: true })
            return new Promise((resolve, reject) => {
                axios.post("/auth/admin/logout", data).then(async response => {
                    commit('setloader', false, { root: true })
                    const adminId = this.state.adminAuth.authuser?.id
                    if (adminId) localStorage.removeItem('capital_radio_token_admin' + adminId)
                    commit('setauthuser', '')
                    commit('setAdminList', [])
                    commit('setCurrentAdmin', null)
                    const success_msg = response.data.msg || 'Admin logout successful'
                    await comp_play_success_file(success_msg)
                    resolve(response)
                }).catch(async error => {
                    commit('setloader', false, { root: true })
                    const errorMsg = error.response?.data?.msg || 'Logout failed'
                    await comp_play_error_file(errorMsg)
                    reject(error)
                })
            })
        },

        async createAdmin({ commit }, data) {
            commit('setloader', 'createAdmin', { root: true })
            return new Promise((resolve, reject) => {
                axios.post("/auth/admin/create", data).then(async response => {
                    commit('setloader', false, { root: true })
                    const success_msg = response.data.msg || 'Admin created successfully'
                    await comp_play_success_file(success_msg)
                    resolve(response)
                }).catch(async error => {
                    commit('setloader', false, { root: true })
                    const errorMsg = error.response?.data?.msg || 'Failed to create admin'
                    commit('seterror', errorMsg, { root: true })
                    await comp_play_error_file(errorMsg)
                    reject(error)
                })
            })
        },

        async getAdminList({ commit }, params = {}) {
            commit('setloader', 'getAdminList', { root: true })
            return new Promise((resolve, reject) => {
                const queryParams = new URLSearchParams()
                if (params.page) queryParams.append('page', params.page)
                if (params.per_page) queryParams.append('per_page', params.per_page)
                
                const formData = new FormData()
                if (params.search) formData.append('search', params.search)
                if (params.role) formData.append('role', params.role)
                if (params.include_total !== undefined) formData.append('include_total', params.include_total)

                axios.post(`/auth/admin/users?${queryParams.toString()}`, formData).then(async response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('setAdminList', response.data.data || [])
                    }
                    resolve(response)
                }).catch(async error => {
                    commit('setloader', false, { root: true })
                    const errorMsg = error.response?.data?.msg || 'Failed to fetch admin list'
                    commit('seterror', errorMsg, { root: true })
                    await comp_play_error_file(errorMsg)
                    reject(error)
                })
            })
        },

        async getAdminDetails({ commit }, adminId) {
            commit('setloader', 'getAdminDetails', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/auth/admin/users/${adminId}`).then(async response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('setCurrentAdmin', response.data.data)
                    }
                    resolve(response)
                }).catch(async error => {
                    commit('setloader', false, { root: true })
                    const errorMsg = error.response?.data?.msg || 'Failed to fetch admin details'
                    commit('seterror', errorMsg, { root: true })
                    await comp_play_error_file(errorMsg)
                    reject(error)
                })
            })
        },

        async updateAdmin({ commit }, { adminId, data }) {
            commit('setloader', 'updateAdmin', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/auth/admin/users/update/${adminId}`, data).then(async response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('updateAdminInList', response.data.data)
                        commit('setCurrentAdmin', response.data.data)
                    }
                    const success_msg = response.data.msg || 'Admin updated successfully'
                    await comp_play_success_file(success_msg)
                    resolve(response)
                }).catch(async error => {
                    commit('setloader', false, { root: true })
                    const errorMsg = error.response?.data?.msg || 'Failed to update admin'
                    commit('seterror', errorMsg, { root: true })
                    await comp_play_error_file(errorMsg)
                    reject(error)
                })
            })
        },

        async deleteAdmin({ commit }, { adminId, hardDelete = false }) {
            commit('setloader', 'deleteAdmin', { root: true })
            return new Promise((resolve, reject) => {
                const formData = new FormData()
                formData.append('hard_delete', hardDelete)
                
                axios.post(`/auth/admin/users/delete/${adminId}`, formData).then(async response => {
                    commit('setloader', false, { root: true })
                    commit('removeAdminFromList', adminId)
                    const success_msg = response.data.msg || 'Admin deleted successfully'
                    await comp_play_success_file(success_msg)
                    resolve(response)
                }).catch(async error => {
                    commit('setloader', false, { root: true })
                    const errorMsg = error.response?.data?.msg || 'Failed to delete admin'
                    commit('seterror', errorMsg, { root: true })
                    await comp_play_error_file(errorMsg)
                    reject(error)
                })
            })
        },

        async forgotAdminPassword({ commit }, email) {
            commit('setloader', 'forgotPassword', { root: true })
            return new Promise((resolve, reject) => {
                const formData = new FormData()
                formData.append('email', email)
                
                axios.post("/auth/admin/users/password/forgot", formData).then(async response => {
                    commit('setloader', false, { root: true })
                    commit('setAdminResetEmail', email)
                    const success_msg = response.data.msg || 'Reset code sent to email'
                    await comp_play_success_file(success_msg)
                    resolve(response)
                }).catch(async error => {
                    commit('setloader', false, { root: true })
                    const errorMsg = error.response?.data?.msg || 'Failed to send reset code'
                    commit('seterror', errorMsg, { root: true })
                    await comp_play_error_file(errorMsg)
                    reject(error)
                })
            })
        },

        async verifyResetCode({ commit }, data) {
            commit('setloader', 'verifyCode', { root: true })
            return new Promise((resolve, reject) => {
                axios.post("/auth/admin/users/password/verify-code", data).then(async response => {
                    commit('setloader', false, { root: true })
                    const success_msg = response.data.msg || 'Code verified successfully'
                    await comp_play_success_file(success_msg)
                    resolve(response)
                }).catch(async error => {
                    commit('setloader', false, { root: true })
                    const errorMsg = error.response?.data?.msg || 'Invalid verification code'
                    commit('seterror', errorMsg, { root: true })
                    await comp_play_error_file(errorMsg)
                    reject(error)
                })
            })
        },

        async resetAdminPassword({ commit }, data) {
            commit('setloader', 'resetPassword', { root: true })
            return new Promise((resolve, reject) => {
                axios.post("/auth/admin/users/password/reset", data).then(async response => {
                    commit('setloader', false, { root: true })
                    commit('setAdminResetEmail', '')
                    const success_msg = response.data.msg || 'Password reset successfully'
                    await comp_play_success_file(success_msg)
                    resolve(response)
                }).catch(async error => {
                    commit('setloader', false, { root: true })
                    const errorMsg = error.response?.data?.msg || 'Failed to reset password'
                    commit('seterror', errorMsg, { root: true })
                    await comp_play_error_file(errorMsg)
                    reject(error)
                })
            })
        },

        async changeAdminPassword({ commit }, data) {
            commit('setloader', 'changePassword', { root: true })
            return new Promise((resolve, reject) => {
                axios.post("/auth/admin/users/password/change", data).then(async response => {
                    commit('setloader', false, { root: true })
                    const success_msg = response.data.msg || 'Password changed successfully'
                    await comp_play_success_file(success_msg)
                    resolve(response)
                }).catch(async error => {
                    commit('setloader', false, { root: true })
                    const errorMsg = error.response?.data?.msg || 'Failed to change password'
                    commit('seterror', errorMsg, { root: true })
                    await comp_play_error_file(errorMsg)
                    reject(error)
                })
            })
        },

        async getMyProfile({ commit }) {
            commit('setloader', 'getProfile', { root: true })
            return new Promise((resolve, reject) => {
                axios.post("/auth/admin/users/profile/me").then(async response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('setCurrentAdmin', response.data.data)
                        commit('setauthuser', response.data.data)
                    }
                    resolve(response)
                }).catch(async error => {
                    commit('setloader', false, { root: true })
                    const errorMsg = error.response?.data?.msg || 'Failed to fetch profile'
                    commit('seterror', errorMsg, { root: true })
                    await comp_play_error_file(errorMsg)
                    reject(error)
                })
            })
        },

        async updateMyProfile({ commit }, data) {
            commit('setloader', 'updateProfile', { root: true })
            return new Promise((resolve, reject) => {
                axios.post("/auth/admin/users/profile/update", data).then(async response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('setCurrentAdmin', response.data.data)
                        commit('setauthuser', response.data.data)
                    }
                    const success_msg = response.data.msg || 'Profile updated successfully'
                    await comp_play_success_file(success_msg)
                    resolve(response)
                }).catch(async error => {
                    commit('setloader', false, { root: true })
                    const errorMsg = error.response?.data?.msg || 'Failed to update profile'
                    commit('seterror', errorMsg, { root: true })
                    await comp_play_error_file(errorMsg)
                    reject(error)
                })
            })
        }
    }
}