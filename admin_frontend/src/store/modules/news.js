export const namespaced = true
import { useToast } from 'vue-toastification'
import { comp_play_error_file, comp_play_success_file } from './utils';
const toast = useToast()

export default {
    state: {
        articles: [],
        article: null,
        categories: [],
        category: null,
        trending_articles: [],
        public_articles: []
    },

    getters: {
        articles: (state) => state.articles,
        article: (state) => state.article,
        categories: (state) => state.categories,
        category: (state) => state.category,
        trending_articles: (state) => state.trending_articles,
        public_articles: (state) => state.public_articles
    },

    mutations: {
        setarticles: (state, articles) => (state.articles = articles),
        setarticle: (state, article) => (state.article = article),
        setcategories: (state, categories) => (state.categories = categories),
        setcategory: (state, category) => (state.category = category),
        settrending_articles: (state, trending_articles) => (state.trending_articles = trending_articles),
        setpublic_articles: (state, public_articles) => (state.public_articles = public_articles),
        addarticle: (state, article) => state.articles.data.unshift(article),
        updatearticle: (state, updatedArticle) => {
            const index = state.articles.data.findIndex(a => a.id === updatedArticle.id)
            if (index !== -1) {
                state.articles.data.splice(index, 1, updatedArticle)
            }
            if (state.article && state.article.id === updatedArticle.id) {
                state.article = updatedArticle
            }
        },
        removearticle: (state, id) => {
            state.articles.data = state.articles.data.filter(a => a.id !== id)
            if (state.article && state.article.id === id) {
                state.article = null
            }
        },
        addcategory: (state, category) => state.categories.data.unshift(category),
        updatecategory: (state, updatedCategory) => {
            const index = state.categories.data.findIndex(c => c.id === updatedCategory.id)
            if (index !== -1) {
                state.categories.data.splice(index, 1, updatedCategory)
            }
            if (state.category && state.category.id === updatedCategory.id) {
                state.category = updatedCategory
            }
        },
        removecategory: (state, id) => {
            state.categories.data = state.categories.data.filter(c => c.id !== id)
            if (state.category && state.category.id === id) {
                state.category = null
            }
        }
    },

    actions: {
        async fetcharticles({ commit }, filters = {}) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetcharticles', { root: true })
            return new Promise((resolve, reject) => {
                axios.post("/admin/news/list", filters)
                .then(response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('setarticles', response.data.data)
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response) {
                        if (error.response.data) {
                            if (error.response.data.msg) {
                                commit('seterror', error.response.data.msg, { root: true })
                                toast.error(error.response.data.msg)
                            } else if (error.response.data.message) {
                                commit('seterrors', error.response.data.message, { root: true })
                            }
                        }
                    }
                    await comp_play_error_file('Error During Fetching Articles')
                    reject(error)
                })
            })
        },

        async fetchpublicarticles({ commit }, filters = {}) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetchpublicarticles', { root: true })
            return new Promise((resolve, reject) => {
                axios.post("/admin/news/public/list", filters)
                .then(response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('setpublic_articles', response.data.data)
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response) {
                        if (error.response.data) {
                            if (error.response.data.msg) {
                                commit('seterror', error.response.data.msg, { root: true })
                                toast.error(error.response.data.msg)
                            } else if (error.response.data.message) {
                                commit('seterrors', error.response.data.message, { root: true })
                            }
                        }
                    }
                    await comp_play_error_file('Error During Fetching Public Articles')
                    reject(error)
                })
            })
        },
        
        async fetcharticle({ commit }, id) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetcharticle', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/news/get/${id}`)
                .then(response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('setarticle', response.data.data)
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response) {
                        if (error.response.data) {
                            if (error.response.data.msg) {
                                commit('seterror', error.response.data.msg, { root: true })
                                toast.error(error.response.data.msg)
                            } else if (error.response.data.message) {
                                commit('seterrors', error.response.data.message, { root: true })
                            }
                        }
                    }
                    await comp_play_error_file('Error During Fetching Article')
                    reject(error)
                })
            })
        },

        async fetcharticlebyslug({ commit }, slug) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetcharticlebyslug', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/news/slug/${slug}`)
                .then(response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('setarticle', response.data.data)
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response) {
                        if (error.response.data) {
                            if (error.response.data.msg) {
                                commit('seterror', error.response.data.msg, { root: true })
                                toast.error(error.response.data.msg)
                            } else if (error.response.data.message) {
                                commit('seterrors', error.response.data.message, { root: true })
                            }
                        }
                    }
                    await comp_play_error_file('Error During Fetching Article')
                    reject(error)
                })
            })
        },
        
        async createarticle({ commit, dispatch }, data) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'createarticle', { root: true })
            return new Promise((resolve, reject) => {
                axios.post("/admin/news/create", data)
                .then(async response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        toast.success(response.data.msg)
                        await comp_play_success_file(response.data.msg)
                        dispatch('fetcharticles', data)
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response) {
                        if (error.response.data) {
                            if (error.response.data.msg) {
                                commit('seterror', error.response.data.msg, { root: true })
                                toast.error(error.response.data.msg)
                            } else if (error.response.data.message) {
                                commit('seterrors', error.response.data.message, { root: true })
                            }
                        }
                    }
                    await comp_play_error_file('Error During Creating Article')
                    reject(error)
                })
            })
        },
        
        async updatearticle({ commit }, { id, data }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'updatearticle', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/news/update/${id}`, data)
                .then(async response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        toast.success(response.data.msg)
                        await comp_play_success_file(response.data.msg)
                        dispatch('fetcharticles', data)
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response) {
                        if (error.response.data) {
                            if (error.response.data.msg) {
                                commit('seterror', error.response.data.msg, { root: true })
                                toast.error(error.response.data.msg)
                            } else if (error.response.data.message) {
                                commit('seterrors', error.response.data.message, { root: true })
                            }
                        }
                    }
                    await comp_play_error_file('Error During Updating Article')
                    reject(error)
                })
            })
        },
        
        async deletearticle({ commit }, id) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'deletearticle', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/news/delete/${id}`)
                .then(async response => {
                    commit('setloader', false, { root: true })
                    toast.success(response.data.msg)
                    await comp_play_success_file(response.data.msg)
                    dispatch('fetcharticles', data)
                    resolve(response)
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response) {
                        if (error.response.data) {
                            if (error.response.data.msg) {
                                commit('seterror', error.response.data.msg, { root: true })
                                toast.error(error.response.data.msg)
                            } else if (error.response.data.message) {
                                commit('seterrors', error.response.data.message, { root: true })
                            }
                        }
                    }
                    await comp_play_error_file('Error During Deleting Article')
                    reject(error)
                })
            })
        },

        async updateengagement({ commit }, { id, action }) {
            return new Promise((resolve, reject) => {
                axios.post(`/admin/news/engagement/${id}`, { action })
                .then(response => {
                    if (response.data.data) {
                        commit('updatearticle', response.data.data)
                        resolve(response)
                    }
                })
                .catch(error => {
                    reject(error)
                })
            })
        },

        async fetchtrendingarticles({ commit }, limit = 10) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetchtrendingarticles', { root: true })
            return new Promise((resolve, reject) => {
                axios.post("/admin/news/trending", { limit })
                .then(response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('settrending_articles', response.data.data)
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response) {
                        if (error.response.data) {
                            if (error.response.data.msg) {
                                commit('seterror', error.response.data.msg, { root: true })
                                toast.error(error.response.data.msg)
                            } else if (error.response.data.message) {
                                commit('seterrors', error.response.data.message, { root: true })
                            }
                        }
                    }
                    await comp_play_error_file('Error During Fetching Trending Articles')
                    reject(error)
                })
            })
        },

        async updatearticleimage({ commit }, { id, data }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'updatearticleimage', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/news/update_image/${id}`, data)
                .then(async response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        toast.success(response.data.msg)
                        await comp_play_success_file(response.data.msg)
                        dispatch('fetcharticles', data)
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response) {
                        if (error.response.data) {
                            if (error.response.data.msg) {
                                commit('seterror', error.response.data.msg, { root: true })
                                toast.error(error.response.data.msg)
                            } else if (error.response.data.message) {
                                commit('seterrors', error.response.data.message, { root: true })
                            }
                        }
                    }
                    await comp_play_error_file('Error During Updating Article Image')
                    reject(error)
                })
            })
        },

        async addgalleryimages({ commit }, { id, data }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'addgalleryimages', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/news/add_gallery/${id}`, data)
                .then(async response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        toast.success(response.data.msg)
                        await comp_play_success_file(response.data.msg)
                        dispatch('fetcharticles', data)
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response) {
                        if (error.response.data) {
                            if (error.response.data.msg) {
                                commit('seterror', error.response.data.msg, { root: true })
                                toast.error(error.response.data.msg)
                            } else if (error.response.data.message) {
                                commit('seterrors', error.response.data.message, { root: true })
                            }
                        }
                    }
                    await comp_play_error_file('Error During Adding Gallery Images')
                    reject(error)
                })
            })
        },

        async removegalleryimage({ commit }, { articleId, imageId }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'removegalleryimage', { root: true })
            return new Promise((resolve, reject) => {
                axios.post(`/admin/news/remove_gallery/${articleId}/${imageId}`)
                .then(async response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        toast.success(response.data.msg)
                        await comp_play_success_file(response.data.msg)
                        dispatch('fetcharticles', data)
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response) {
                        if (error.response.data) {
                            if (error.response.data.msg) {
                                commit('seterror', error.response.data.msg, { root: true })
                                toast.error(error.response.data.msg)
                            } else if (error.response.data.message) {
                                commit('seterrors', error.response.data.message, { root: true })
                            }
                        }
                    }
                    await comp_play_error_file('Error During Removing Gallery Image')
                    reject(error)
                })
            })
        },

        // Category actions
        async fetchcategories({ commit }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'fetchcategories', { root: true })
            return new Promise((resolve, reject) => {
                axios.post("/admin/news/categories/list")
                .then(response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        commit('setcategories', response.data.data)
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response) {
                        if (error.response.data) {
                            if (error.response.data.msg) {
                                commit('seterror', error.response.data.msg, { root: true })
                                toast.error(error.response.data.msg)
                            } else if (error.response.data.message) {
                                commit('seterrors', error.response.data.message, { root: true })
                            }
                        }
                    }
                    await comp_play_error_file('Error During Fetching Categories')
                    reject(error)
                })
            })
        },

        async createcategory({ commit, dispatch }, data) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'createcategory', { root: true })
            return new Promise((resolve, reject) => {
                axios.post("/admin/news/categories/create", data)
                .then(async response => {
                    commit('setloader', false, { root: true })
                    if (response.data.data) {
                        dispatch('fetchcategories')
                        toast.success(response.data.msg)
                        await comp_play_success_file(response.data.msg)
                        resolve(response)
                    }
                })
                .catch(async error => {
                    commit('setloader', false, { root: true })
                    if (error.response) {
                        if (error.response.data) {
                            if (error.response.data.msg) {
                                commit('seterror', error.response.data.msg, { root: true })
                                toast.error(error.response.data.msg)
                            } else if (error.response.data.message) {
                                commit('seterrors', error.response.data.message, { root: true })
                            }
                        }
                    }
                    await comp_play_error_file('Error During Creating Category')
                    reject(error)
                })
            })
        },

        async updatecategory({ commit, dispatch }, {data, id}) {
          commit('seterror', '', { root: true })
          commit('setmsg', '', { root: true })
          commit('setloader', 'updatecategory', { root: true })
          return new Promise((resolve, reject) => {
              axios.post(`/admin/news/categories/update/${id}`, data)
              .then(async response => {
                  commit('setloader', false, { root: true })
                  if (response.data.data) {
                      dispatch('fetchcategories')
                      toast.success(response.data.msg)
                      await comp_play_success_file(response.data.msg)
                      resolve(response)
                  }
              })
              .catch(async error => {
                  commit('setloader', false, { root: true })
                  if (error.response) {
                      if (error.response.data) {
                          if (error.response.data.msg) {
                              commit('seterror', error.response.data.msg, { root: true })
                              toast.error(error.response.data.msg)
                          } else if (error.response.data.message) {
                              commit('seterrors', error.response.data.message, { root: true })
                          }
                      }
                  }
                  await comp_play_error_file('Error During Updating Category')
                  reject(error)
              })
          })
        },

        async removecategory({ commit, dispatch }, {data, id}) {
          commit('seterror', '', { root: true })
          commit('setmsg', '', { root: true })
          commit('setloader', 'removecategory', { root: true })
          return new Promise((resolve, reject) => {
              axios.post(`/admin/news/categories/delete/${id}`, data)
              .then(async response => {
                  commit('setloader', false, { root: true })
                  if (response.data.data) {
                      dispatch('fetchcategories')
                      toast.success(response.data.msg)
                      await comp_play_success_file(response.data.msg)
                      resolve(response)
                  }
              })
              .catch(async error => {
                  commit('setloader', false, { root: true })
                  if (error.response) {
                      if (error.response.data) {
                          if (error.response.data.msg) {
                              commit('seterror', error.response.data.msg, { root: true })
                              toast.error(error.response.data.msg)
                          } else if (error.response.data.message) {
                              commit('seterrors', error.response.data.message, { root: true })
                          }
                      }
                  }
                  await comp_play_error_file('Error During Updating Category')
                  reject(error)
              })
          })
        },
    }
}