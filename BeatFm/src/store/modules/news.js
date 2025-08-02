export const namespaced = true

export default {
    state: {
        news: null,
        breakingnews: null,
        news_details:'',
    },
    
    getters: {
        news: (state) => state.news,
        breakingnews: (state) => state.breakingnews,
        news_details: (state) => state.news_details,
    },

    mutations: {
        setnews: (state, news) => (state.news = news),
        setbreakingnews: (state, breakingnews) => (state.breakingnews = breakingnews),
        setnews_details: (state, news_details) => (state.news_details = news_details),
    },

    actions: {

        async fetch_user_news({ commit }, data) {
            commit('seterror', '')
            commit('setmsg', '')
            commit('setloader', 'fetch_user_news')
            return new Promise((resolve, reject) => {
                axios.post(`/news`, data).then(async response => {
                        commit('setloader', false)
                        if (response.data.data) {
                            commit('setnews', response.data.data)
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

        async fetch_breaking_news({ commit }, data) {
            commit('seterror', '')
            commit('setmsg', '')
            commit('setloader', 'fetch_breaking_news')
            return new Promise((resolve, reject) => {
                axios.post(`/news/breaking`, data).then(async response => {
                        commit('setloader', false)
                        if (response.data.data) {
                            commit('setbreakingnews', response.data.data)
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

        async fetch_news_details_by_slug({ commit }, slug) {
            commit('seterror', '')
            commit('setmsg', '')
            commit('setloader', 'fetch_news_details_by_slug')
            return new Promise((resolve, reject) => {
                axios.post(`/news/details`, {slug: slug}).then(async response => {
                        commit('setloader', false)
                        if (response.data.data) {
                            commit('setnews_details', response.data.data)
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



    }
}