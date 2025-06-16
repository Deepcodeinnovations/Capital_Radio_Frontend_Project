export const namespaced = true
import { useToast } from 'vue-toastification'
import { comp_play_error_file, comp_play_success_file } from './utils';
const toast = useToast()

export default {
    state: {
        adverts: [],
        advert: null,
        stationAdverts: {}
    },

    getters: {
        adverts: (state) => state.adverts,
        advert: (state) => state.advert,
        stationAdverts: (state) => state.stationAdverts
    },

    mutations: {
        setAdverts: (state, adverts) => (state.adverts = adverts),
        setAdvert: (state, advert) => (state.advert = advert),
        setStationAdverts: (state, { stationId, adverts }) => (state.stationAdverts[stationId] = adverts),
        addAdvert: (state, advert) => {
            if (state.adverts.data) {
                state.adverts.data.unshift(advert)
            }
        },
        updateAdvert: (state, updatedAdvert) => {
            if (state.adverts.data) {
                const index = state.adverts.data.findIndex(a => a.id === updatedAdvert.id)
                if (index !== -1) {
                    state.adverts.data.splice(index, 1, updatedAdvert)
                }
            }
            if (state.advert && state.advert.id === updatedAdvert.id) {
                state.advert = updatedAdvert
            }
        },
        removeAdvert: (state, id) => {
            if (state.adverts.data) {
                state.adverts.data = state.adverts.data.filter(a => a.id !== id)
            }
            if (state.advert && state.advert.id === id) {
                state.advert = null
            }
        }
    },

    actions: {
        async fetchAdverts({ commit }, filters = {}) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetchAdverts', { root: true })
            return new Promise((resolve, reject) => {
                axios.post("/admin/adverts", filters)
                .then(response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('setAdverts', response.data.data)
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response?.data?.msg) {
                        commit('seterror', error.response.data.msg, { root: true })
                        toast.error(error.response.data.msg)
                    }
                    await comp_play_error_file('Error During Fetching Adverts')
                    reject(error)
                })
            })
        },

        async fetchAdvert({ commit }, id) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetchAdvert', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/adverts/${id}`)
                .then(response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('setAdvert', response.data.data)
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response?.data?.msg) {
                        commit('seterror', error.response.data.msg, { root: true })
                        toast.error(error.response.data.msg)
                    }
                    await comp_play_error_file('Error During Fetching Advert')
                    reject(error)
                })
            })
        },

        async createAdvert({ commit }, data) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'createAdvert', { root: true })
            return new Promise((resolve, reject) => {
                // Create FormData for file upload
                const formData = new FormData()
                Object.keys(data).forEach(key => {
                    if (data[key] !== null && data[key] !== undefined) {
                        formData.append(key, data[key])
                    }
                })

                axios.post("/admin/adverts/create", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(async response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('addAdvert', response.data.data)
                        toast.success(response.data.msg)
                        await comp_play_success_file('Advert Created Successfully')
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response?.data?.msg) {
                        commit('seterror', error.response.data.msg, { root: true })
                        toast.error(error.response.data.msg)
                    }
                    await comp_play_error_file('Error During Creating Advert')
                    reject(error)
                })
            })
        },

        async updateAdvert({ commit }, { id, data }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'updateAdvert', { root: true })
            return new Promise((resolve, reject) => {
                // Create FormData for file upload
                const formData = new FormData()
                Object.keys(data).forEach(key => {
                    if (data[key] !== null && data[key] !== undefined) {
                        formData.append(key, data[key])
                    }
                })

                axios.post(`/admin/adverts/update/${id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(async response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('updateAdvert', response.data.data)
                        toast.success(response.data.msg)
                        await comp_play_success_file('Advert Updated Successfully')
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response?.data?.msg) {
                        commit('seterror', error.response.data.msg, { root: true })
                        toast.error(error.response.data.msg)
                    }
                    await comp_play_error_file('Error During Updating Advert')
                    reject(error)
                })
            })
        },

        async updateAdvertStatus({ commit }, { id, status }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'updateAdvertStatus', { root: true })
            return new Promise((resolve, reject) => {
                const formData = new FormData()
                formData.append('status', status)

                axios.post(`/admin/adverts/status/${id}`, formData)
                .then(async response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('updateAdvert', response.data.data)
                        toast.success(response.data.msg)
                        await comp_play_success_file('Advert Status Updated Successfully')
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response?.data?.msg) {
                        commit('seterror', error.response.data.msg, { root: true })
                        toast.error(error.response.data.msg)
                    }
                    await comp_play_error_file('Error During Updating Advert Status')
                    reject(error)
                })
            })
        },

        async deleteAdvert({ commit }, id) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'deleteAdvert', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/adverts/delete/${id}`)
                .then(async response => {
                    commit('setloader', false, { root: true })
                    commit('removeAdvert', id)
                    toast.success(response.data.msg)
                    await comp_play_success_file('Advert Deleted Successfully')
                    resolve(response)
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response?.data?.msg) {
                        commit('seterror', error.response.data.msg, { root: true })
                        toast.error(error.response.data.msg)
                    }
                    await comp_play_error_file('Error During Deleting Advert')
                    reject(error)
                })
            })
        },

        async fetchAdvertsByStation({ commit }, stationId) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetchAdvertsByStation', { root: true })
            return new Promise((resolve, reject) => {
                const formData = new FormData()
                formData.append('station_id', stationId)

                axios.post("/admin/adverts", formData)
                .then(response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('setStationAdverts', { stationId, adverts: response.data.data })
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response?.data?.msg) {
                        commit('seterror', error.response.data.msg, { root: true })
                        toast.error(error.response.data.msg)
                    }
                    await comp_play_error_file('Error During Fetching Station Adverts')
                    reject(error)
                })
            })
        }
    }
}