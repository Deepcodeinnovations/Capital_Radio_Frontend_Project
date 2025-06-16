// schedules.js
export const namespaced = true

export default {
    state: {
        stationSchedule: null,
        scheduleConflicts: null,
        scheduleStatistics: null,
        validationResult: null,
        scheduleBackup: null,
    },
    
    getters: {
        stationSchedule: (state) => state.stationSchedule,
        scheduleConflicts: (state) => state.scheduleConflicts,
        scheduleStatistics: (state) => state.scheduleStatistics,
        validationResult: (state) => state.validationResult,
        scheduleBackup: (state) => state.scheduleBackup,
    },

    mutations: {
        setStationSchedule: (state, stationSchedule) => (state.stationSchedule = stationSchedule),
        setScheduleConflicts: (state, scheduleConflicts) => (state.scheduleConflicts = scheduleConflicts),
        setScheduleStatistics: (state, scheduleStatistics) => (state.scheduleStatistics = scheduleStatistics),
        setValidationResult: (state, validationResult) => (state.validationResult = validationResult),
        setScheduleBackup: (state, scheduleBackup) => (state.scheduleBackup = scheduleBackup),
        
        // Clear methods
        clearScheduleData: (state) => {
            state.stationSchedule = null;
            state.scheduleConflicts = null;
            state.scheduleStatistics = null;
            state.validationResult = null;
        },
    },

    actions: {
        // Get station schedule
        async get_station_schedule({ commit }, { stationId }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'get_station_schedule', { root: true })
            
            return new Promise((resolve, reject) => {
                axios.post(`/admin/station_schedule/get/${stationId}`)
                    .then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('setStationSchedule', response.data.data)
                            resolve(response)
                        }
                    })
                    .catch(async error => {
                        commit('setloader', false, { root: true })
                        if (error.response && error.response.data && error.response.data.msg) {
                            commit('seterror', error.response.data.msg, { root: true })
                        }
                        reject(error)
                    });
            });
        },

        // Update entire station schedule
        async update_station_schedule({ commit }, { stationId, sessions }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'update_station_schedule', { root: true })
            
            return new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append('sessions', JSON.stringify(sessions));
                
                axios.post(`/admin/station_schedule/update/${stationId}`, formData)
                    .then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('setStationSchedule', response.data.data)
                            commit('setmsg', response.data.msg, { root: true })
                            resolve(response)
                        }
                    })
                    .catch(async error => {
                        commit('setloader', false, { root: true })
                        if (error.response && error.response.data && error.response.data.msg) {
                            commit('seterror', error.response.data.msg, { root: true })
                        }
                        reject(error)
                    });
            });
        },

        // Add session to day
        async add_session_to_day({ commit }, { stationId, day, sessionData }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'add_session_to_day', { root: true })
            
            return new Promise((resolve, reject) => {
                const formData = new FormData();
                
                // Add session fields
                Object.keys(sessionData).forEach(key => {
                    if (key === 'hosts' && Array.isArray(sessionData[key])) {
                        formData.append('hosts', JSON.stringify(sessionData[key]));
                    } else if (sessionData[key] !== null && sessionData[key] !== undefined) {
                        formData.append(key, sessionData[key]);
                    }
                });
                
                axios.post(`/admin/station_schedule/add_session/${stationId}/${day}`, formData)
                    .then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('setStationSchedule', response.data.data)
                            commit('setmsg', response.data.msg, { root: true })
                            resolve(response)
                        }
                    })
                    .catch(async error => {
                        commit('setloader', false, { root: true })
                        if (error.response && error.response.data && error.response.data.msg) {
                            commit('seterror', error.response.data.msg, { root: true })
                        }
                        reject(error)
                    });
            });
        },

        // Update session
        async update_session({ commit }, { stationId, day, sessionIndex, sessionData }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'update_session', { root: true })
            
            return new Promise((resolve, reject) => {
                const formData = new FormData();
                
                // Add session fields
                Object.keys(sessionData).forEach(key => {
                    if (key === 'hosts' && Array.isArray(sessionData[key])) {
                        formData.append('hosts', JSON.stringify(sessionData[key]));
                    } else if (sessionData[key] !== null && sessionData[key] !== undefined) {
                        formData.append(key, sessionData[key]);
                    }
                });
                
                axios.post(`/admin/station_schedule/update_session/${stationId}/${day}/${sessionIndex}`, formData)
                    .then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('setStationSchedule', response.data.data)
                            commit('setmsg', response.data.msg, { root: true })
                            resolve(response)
                        }
                    })
                    .catch(async error => {
                        commit('setloader', false, { root: true })
                        if (error.response && error.response.data && error.response.data.msg) {
                            commit('seterror', error.response.data.msg, { root: true })
                        }
                        reject(error)
                    });
            });
        },

        // Remove session
        async remove_session({ commit }, { stationId, day, sessionIndex }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'remove_session', { root: true })
            
            return new Promise((resolve, reject) => {
                axios.post(`/admin/station_schedule/remove_session/${stationId}/${day}/${sessionIndex}`, {})
                    .then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('setStationSchedule', response.data.data)
                            commit('setmsg', response.data.msg, { root: true })
                            resolve(response)
                        }
                    })
                    .catch(async error => {
                        commit('setloader', false, { root: true })
                        if (error.response && error.response.data && error.response.data.msg) {
                            commit('seterror', error.response.data.msg, { root: true })
                        }
                        reject(error)
                    });
            });
        },

        // Clear day schedule
        async clear_day_schedule({ commit }, { stationId, day }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'clear_day_schedule', { root: true })
            
            return new Promise((resolve, reject) => {
                axios.post(`/admin/station_schedule/clear_day/${stationId}/${day}`, {})
                    .then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('setStationSchedule', response.data.data)
                            commit('setmsg', response.data.msg, { root: true })
                            resolve(response)
                        }
                    })
                    .catch(async error => {
                        commit('setloader', false, { root: true })
                        if (error.response && error.response.data && error.response.data.msg) {
                            commit('seterror', error.response.data.msg, { root: true })
                        }
                        reject(error)
                    });
            });
        },

        // Duplicate day schedule
        async duplicate_day_schedule({ commit }, { stationId, sourceDay, targetDay }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'duplicate_day_schedule', { root: true })
            
            return new Promise((resolve, reject) => {
                axios.post(`/admin/station_schedule/duplicate_day/${stationId}/${sourceDay}/${targetDay}`, {})
                    .then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('setStationSchedule', response.data.data)
                            commit('setmsg', response.data.msg, { root: true })
                            resolve(response)
                        }
                    })
                    .catch(async error => {
                        commit('setloader', false, { root: true })
                        if (error.response && error.response.data && error.response.data.msg) {
                            commit('seterror', error.response.data.msg, { root: true })
                        }
                        reject(error)
                    });
            });
        },

        // Get schedule conflicts
        async get_schedule_conflicts({ commit }, { stationId }) {
            commit('seterror', '', { root: true })
            commit('setloader', 'get_schedule_conflicts', { root: true })
            
            return new Promise((resolve, reject) => {
                axios.post(`/admin/station_schedule/conflicts/${stationId}`, {})
                    .then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('setScheduleConflicts', response.data.data)
                            resolve(response)
                        }
                    })
                    .catch(async error => {
                        commit('setloader', false, { root: true })
                        if (error.response && error.response.data && error.response.data.msg) {
                            commit('seterror', error.response.data.msg, { root: true })
                        }
                        reject(error)
                    });
            });
        },

        // Get schedule statistics
        async get_schedule_statistics({ commit }, { stationId }) {
            commit('seterror', '', { root: true })
            commit('setloader', 'get_schedule_statistics', { root: true })
            
            return new Promise((resolve, reject) => {
                axios.post(`/admin/station_schedule/statistics/${stationId}`, {})
                    .then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('setScheduleStatistics', response.data.data)
                            resolve(response)
                        }
                    })
                    .catch(async error => {
                        commit('setloader', false, { root: true })
                        if (error.response && error.response.data && error.response.data.msg) {
                            commit('seterror', error.response.data.msg, { root: true })
                        }
                        reject(error)
                    });
            });
        },

        // Validate schedule
        async validate_schedule({ commit }, { stationId, sessions = null }) {
            commit('seterror', '', { root: true })
            commit('setloader', 'validate_schedule', { root: true })
            
            return new Promise((resolve, reject) => {
                const formData = new FormData();
                if (sessions) {
                    formData.append('sessions', JSON.stringify(sessions));
                }
                
                axios.post(`/admin/station_schedule/validate/${stationId}`, formData)
                    .then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('setValidationResult', response.data.data)
                            resolve(response)
                        }
                    })
                    .catch(async error => {
                        commit('setloader', false, { root: true })
                        if (error.response && error.response.data && error.response.data.msg) {
                            commit('seterror', error.response.data.msg, { root: true })
                        }
                        reject(error)
                    });
            });
        },

        // Backup schedule
        async backup_schedule({ commit }, { stationId }) {
            commit('seterror', '', { root: true })
            commit('setloader', 'backup_schedule', { root: true })
            
            return new Promise((resolve, reject) => {
                axios.post(`/admin/station_schedule/backup/${stationId}`, {})
                    .then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('setScheduleBackup', response.data.data)
                            commit('setmsg', response.data.msg, { root: true })
                            resolve(response)
                        }
                    })
                    .catch(async error => {
                        commit('setloader', false, { root: true })
                        if (error.response && error.response.data && error.response.data.msg) {
                            commit('seterror', error.response.data.msg, { root: true })
                        }
                        reject(error)
                    });
            });
        },

        // Restore schedule
        async restore_schedule({ commit }, { stationId, backupData }) {
            commit('seterror', '', { root: true })
            commit('setmsg', '', { root: true })
            commit('setloader', 'restore_schedule', { root: true })
            
            return new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append('backup_data', JSON.stringify(backupData));
                
                axios.post(`/admin/station_schedule/restore/${stationId}`, formData)
                    .then(async response => {
                        commit('setloader', false, { root: true })
                        if (response.data.data) {
                            commit('setStationSchedule', response.data.data)
                            commit('setmsg', response.data.msg, { root: true })
                            resolve(response)
                        }
                    })
                    .catch(async error => {
                        commit('setloader', false, { root: true })
                        if (error.response && error.response.data && error.response.data.msg) {
                            commit('seterror', error.response.data.msg, { root: true })
                        }
                        reject(error)
                    });
            });
        },

        // Clear all schedule data
        async clear_schedule_data({ commit }) {
            commit('clearScheduleData')
        },

        // Helper action to get sessions for a specific day
        get_day_sessions({ state }, { day }) {
            if (!state.stationSchedule || !state.stationSchedule.sessions) {
                return [];
            }
            return state.stationSchedule.sessions[day] || [];
        },

        // Helper action to count total sessions
        get_total_sessions({ state }) {
            if (!state.stationSchedule || !state.stationSchedule.sessions) {
                return 0;
            }
            
            let total = 0;
            Object.values(state.stationSchedule.sessions).forEach(daySessions => {
                total += daySessions.length;
            });
            return total;
        },

        // Helper action to check if schedule has conflicts
        has_schedule_conflicts({ state }) {
            return state.scheduleConflicts && 
                   (state.scheduleConflicts.has_conflicts || 
                    state.scheduleConflicts.total_issues > 0);
        }
    }
}