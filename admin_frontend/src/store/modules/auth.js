export const namespaced = true

export default {
   state: {
       authuser: '',
       authlocation: '',
       isAuth: '',
       userip: '',
       clientlocation: '',
       clientdevice: '',
       user_reset_email: null,
       clientdata: null,
       userSessionTimerStatus: false,
   },
   
   getters: {
       authuser: (state) => state.authuser,
       authlocation: (state) => state.authlocation,
       isAuth: state => !!state.authuser && !!localStorage.getItem('capital_radio_token' + state.authuser.id),
       userip: (state) => state.userip,
       clientlocation: (state) => state.clientlocation,
       clientdevice: (state) => state.clientdevice,
       user_reset_email: (state) => state.user_reset_email,
       clientdata: state => state.clientdata,
       userSessionTimerStatus: (state) => state.userSessionTimerStatus,

   },

   mutations: {
       setauthuser: (state, authuser) => (state.authuser = authuser),
       setauthlocation: (state, authlocation) => (state.authlocation = authlocation),
       setisAuth: (state, isAuth) => (state.isAuth = isAuth),
       setuserip: (state, userip) => (state.userip = userip),
       setclientlocation: (state, clientlocation) => (state.clientlocation = clientlocation),
       setclientdevice: (state, clientdevice) => (state.clientdevice = clientdevice),
       setuser_reset_email: (state, user_reset_email) => (state.user_reset_email = user_reset_email),
       setclientdata: (state, clientdata) => (state.clientdata = clientdata),
       setuserSessionTimerStatus: (state, userSessionTimerStatus) => (state.userSessionTimerStatus = userSessionTimerStatus),
   },

   actions: {
       async getclientlocationanddevicedata({ commit }) {
           return new Promise((resolve, reject) => {
               fetch('https://ipwho.is/')
                   .then(response => {
                       if (!response.ok) throw new Error('Failed to fetch location data');
                       return response.json();
                   })
                   .then(locationData => {
                       const clientdata = {
                           ip: locationData.ip,
                           city: locationData.city,
                           region: locationData.region,
                           country: locationData.country,
                           postal: locationData.postal,
                           latitude: locationData.latitude,
                           longitude: locationData.longitude,
                           timezone: locationData.timezone.id,
                           currency: locationData.currency || '',
                           isp: locationData.org
                       };

                       commit('setclientlocation', clientdata);

                       const userAgent = navigator.userAgent;
                       let deviceType = 'Unknown';

                       if (/mobile/i.test(userAgent)) deviceType = 'Mobile';
                       else if (/tablet/i.test(userAgent)) deviceType = 'Tablet';
                       else if (/windows|macintosh|linux/i.test(userAgent)) deviceType = 'Desktop';

                       commit('setclientdevice', deviceType);

                       const clientinfo = {
                           ...clientdata,
                           device: deviceType,
                           access_route: window.location.pathname,
                           access_time: new Date().toISOString()
                       };

                       commit('setclientdata', clientinfo);
                       resolve({ ip: locationData.ip, location: clientdata, device: deviceType });
                   })
                   .catch(error => {
                       console.error('Error fetching client data:', error);
                       reject(error);
                   })
                   .finally(() => {
                       commit('setloader', false, { root: true });
                   });
           });
       },

       async login({ commit }, data) {
           commit('clearautherrors')
           commit('seterror', '', { root: true })
           commit('setmsg', '', { root: true })
           commit('setloader', 'login', { root: true })
           return new Promise((resolve, reject) => {
               axios.post("/auth/admin/login", data)
                   .then(async response => {
                       commit('setloader', false, { root: true })
                       if (response.data.data.authtoken) {
                           localStorage.setItem('capital_radio_token' + response.data.data.user.id, response.data.data.authtoken.access_token)
                           commit('setauthuser', response.data.data.user)
                           resolve(response)
                       }
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

       async request_password_reset({ commit }, data) {
           commit('clearautherrors')
           commit('seterror', '', { root: true })
           commit('setmsg', '', { root: true })
           commit('setloader', 'request_password_reset', { root: true })
           return new Promise((resolve, reject) => {
               axios.post("/auth/admin/password_reset", data)
                   .then(async response => {
                       commit('setloader', false, { root: true })
                       commit('setuser_reset_email', data.email)
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

       async resend_otp({ commit, state }) {
           commit('clearautherrors')
           commit('seterror', '', { root: true })
           commit('setmsg', '', { root: true })
           commit('setloader', 'resend_otp', { root: true })
           return new Promise((resolve, reject) => {
               axios.post("/auth/admin/resend_otp", { email: state.user_reset_email })
                   .then(async response => {
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

       async verify_password_reset({ commit, state }, data) {
           commit('clearautherrors')
           commit('seterror', '', { root: true })
           commit('setmsg', '', { root: true })
           commit('setloader', 'verify_password_reset', { root: true })
           return new Promise((resolve, reject) => {
               axios.post("/auth/admin/verify_reset", {
                   email: state.user_reset_email,
                   otp: data.otp
               })
                   .then(async response => {
                       commit('setloader', false, { root: true })
                       if (response.data.data) {
                           commit('setauthuser', response.data.data)
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

       async update_user_password({ commit, state }, data) {
           commit('clearautherrors')
           commit('seterror', '', { root: true })
           commit('setmsg', '', { root: true })
           commit('setloader', 'update_user_password', { root: true })
           return new Promise((resolve, reject) => {
               axios.post("/auth/admin/update_password", {
                   email: state.user_reset_email,
                   password: data.newPassword,
                   password_confirmation: data.confirmPassword
               })
                   .then(async response => {
                       commit('setloader', false, { root: true })
                       if (response.data.data) {
                           commit('setauthuser', response.data.data)
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

       async update_user_profile({ commit }, data) {
           commit('clearautherrors')
           commit('seterror', '', { root: true })
           commit('setmsg', '', { root: true })
           commit('setloader', 'update_user_profile', { root: true })
           return new Promise((resolve, reject) => {
               axios.post("/auth/admin/update_profile", data)
                   .then(async response => {
                       commit('setloader', false, { root: true })
                       if (response.data.data) {
                           commit('setauthuser', response.data.data)
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

       async get_auth_user({ commit }) {
           commit('clearautherrors')
           commit('seterror', '', { root: true })
           commit('setmsg', '', { root: true })
           commit('setloader', 'get_auth_user', { root: true })
           return new Promise((resolve, reject) => {
               axios.post("/auth/admin/authuser")
                   .then(async response => {
                       commit('setloader', false, { root: true })
                       if (response.data.data) {
                           commit('setauthuser', response.data.data)
                           resolve(response)
                       }
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

       async log_out_user({ commit }) {
           commit('clearautherrors')
           commit('seterror', '', { root: true })
           commit('setmsg', '', { root: true })
           commit('setloader', 'log_out_user', { root: true })
           return new Promise((resolve, reject) => {
               axios.post("/auth/admin/logout")
                   .then(async response => {
                       commit('setloader', false, { root: true })
                       commit('setauthuser', '')
                       localStorage.clear()
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
                       localStorage.clear()
                       reject(error)
                   });
           });
       }
   }
}