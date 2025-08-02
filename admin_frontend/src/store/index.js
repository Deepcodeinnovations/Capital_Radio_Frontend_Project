import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";
import SecureLs from 'secure-ls'
const secure = new SecureLs({isCompression:false});
import auth from './modules/auth'
import utils from './modules/utils'
import news from './modules/news'
import liveChats from './modules/liveChats'
import radio_scheduler from './modules/radio_scheduler'
import stations from './modules/stations'
import hosts from './modules/hosts'
import radio_programs from './modules/radio_programs'
import forums from './modules/forums'
import adverts from './modules/adverts'
import websocket_manager from './modules/websocket_manager'
import events from './modules/events'
import station_recordings from './modules/station_recordings'

export default createStore({
  modules: {
    auth,
    utils,
    news,
    liveChats,
    radio_scheduler,
    stations,
    hosts,
    radio_programs,
    forums,
    adverts,
    websocket_manager,
    events,
    station_recordings
  },

  plugins: [createPersistedState(
    {
      key : 'systemadmin.capitalradio.co.ug',
      paths: ['auth','utils'],
      storage:{
         getItem : (key) => secure.get(key),
         setItem: (key, value) => secure.set(key, value),
         removeItem: (key) => secure.remove(key)
      }
    }
  )],
})