export const namespaced = true
import FingerprintJS from '@fingerprintjs/fingerprintjs'
export default {
   state: {
       authuser: '',
       authtoken: '',
       authlocation: '',
       isAuth: '',
       userip: '',
       clientlocation: '',
       clientdevice: '',
       user_reset_email: null,
       clientdata: null,
       userSessionTimerStatus: false,
       device_fingerprint: '',
   },
   
   getters: {
       authuser: (state) => state.authuser,
       authlocation: (state) => state.authlocation,
       authtoken: (state) => state.authtoken,
       isAuth: state => !!state.authuser && !!localStorage.getItem('capital_radio_token' + state.authuser.id),
       userip: (state) => state.userip,
       clientlocation: (state) => state.clientlocation,
       clientdevice: (state) => state.clientdevice,
       user_reset_email: (state) => state.user_reset_email,
       clientdata: state => state.clientdata,
       userSessionTimerStatus: (state) => state.userSessionTimerStatus,
       device_fingerprint: (state) => state.device_fingerprint,
   },

   mutations: {
       setauthuser: (state, authuser) => (state.authuser = authuser),
       setauthtoken: (state, authtoken) => (state.authtoken = authtoken),
       setauthlocation: (state, authlocation) => (state.authlocation = authlocation),
       setisAuth: (state, isAuth) => (state.isAuth = isAuth),
       setuserip: (state, userip) => (state.userip = userip),
       setclientlocation: (state, clientlocation) => (state.clientlocation = clientlocation),
       setclientdevice: (state, clientdevice) => (state.clientdevice = clientdevice),
       setuser_reset_email: (state, user_reset_email) => (state.user_reset_email = user_reset_email),
       setclientdata: (state, clientdata) => (state.clientdata = clientdata),
       setuserSessionTimerStatus: (state, userSessionTimerStatus) => (state.userSessionTimerStatus = userSessionTimerStatus),
       setdevice_fingerprint: (state, device_fingerprint) => (state.device_fingerprint = device_fingerprint),
       
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

       async getdevicefingerprint({ commit }) {
        commit('setloader', 'getdevicefingerprint', { root: true })
        return new Promise((resolve, reject) => {
            let deviceFingerprint = localStorage.getItem('capital_radio_device_fingerprint')
            console.log('Existing fingerprint:', deviceFingerprint)
            
            if(deviceFingerprint !== null) {
                // Device fingerprint exists, use it
                commit('setdevice_fingerprint', deviceFingerprint)
                console.log('Using existing fingerprint:', deviceFingerprint)
                resolve(deviceFingerprint)
            } else {
                // No fingerprint exists, generate new one using FingerprintJS
                FingerprintJS.load().then(fp => {
                    fp.get().then(result => {
                        commit('setdevice_fingerprint', result.visitorId)
                        localStorage.setItem('capital_radio_device_fingerprint', result.visitorId)
                        console.log('Generated new FingerprintJS fingerprint:', result.visitorId)
                        resolve(result.visitorId)
                    }).catch(error => {
                        console.error('Error generating fingerprint:', error)
                        reject(error)
                    })
                }).catch(error => {
                    console.error('Error loading FingerprintJS:', error)
                    reject(error)
                })
            }
        })
    },
    
    async generatedevice_fingerprint({commit}) {
        // Check if fingerprint already exists
        let existingFingerprint = localStorage.getItem('capital_radio_device_fingerprint')
        
        if(existingFingerprint !== null) {
            // Fingerprint already exists, use it
            commit('setdevice_fingerprint', existingFingerprint)
            console.log('Using existing fingerprint instead of generating new one:', existingFingerprint)
            return existingFingerprint
        }
        
        // No existing fingerprint, generate new one
        function generateUniqueString64(customChars = null) {
            const defaultChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
            const chars = customChars || defaultChars;
            
            let result = '';
            
            // Add timestamp for uniqueness
            const timestamp = Date.now().toString(36);
            result += timestamp;
            
            // Fill remaining with random characters
            while (result.length < 64) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            
            return result.substring(0, 64);
        }
    
        let fingerprint_data = generateUniqueString64();
        
        commit('setdevice_fingerprint', fingerprint_data);
        localStorage.setItem('capital_radio_device_fingerprint', fingerprint_data);
        console.log('Generated new custom fingerprint:', fingerprint_data);
        
        return fingerprint_data;
    },




       async login({ commit }, data) {
           commit('clearautherrors')
           commit('seterror', '', { root: true })
           commit('setmsg', '', { root: true })
           commit('setloader', 'login', { root: true })
           return new Promise((resolve, reject) => {
               axios.post("/auth/login", data)
                   .then(async response => {
                       commit('setloader', false, { root: true })
                       if (response.data.data.authtoken) {
                           localStorage.setItem('capital_radio_token' + response.data.data.user.id, response.data.data.authtoken.access_token)
                           commit('setauthtoken', response.data.data.authtoken.access_token)
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

       async update_user_profile({ commit }, data) {
           commit('clearautherrors')
           commit('seterror', '', { root: true })
           commit('setmsg', '', { root: true })
           commit('setloader', 'update_user_profile', { root: true })
           return new Promise((resolve, reject) => {
               axios.post("/auth/update_profile", data)
                   .then(async response => {
                       commit('setloader', false, { root: true })
                       if (response.data.data) {
                            localStorage.setItem('capital_radio_token' + response.data.data.user.id, response.data.data.authtoken.access_token)
                            commit('setauthtoken', response.data.data.authtoken.access_token)
                            commit('setauthuser', response.data.data.user)
                            resolve(response)
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
               axios.post("/auth/authuser")
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
               axios.post("/auth/logout")
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