import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";
import SecureLs from 'secure-ls'
const secure = new SecureLs({isCompression:false});
import auth from './modules/auth'
import utils from './modules/utils'
import news from './modules/news'
import liveChats from './modules/liveChats'
import stations from './modules/stations'
import hosts from './modules/hosts'
import forums from './modules/forums'
import adverts from './modules/adverts'
import audioplayerController from './modules/audioplayerController'
import websocket_manager from './modules/websocket_manager'

export default createStore({
  modules: {
    auth,
    utils,
    news,
    liveChats,
    stations,
    hosts,
    forums,
    adverts,
    audioplayerController,
    websocket_manager
  },

  plugins: [createPersistedState(
    {
      key : 'beatfm.capitalradio.co.ug',
      paths: ['auth','utils','stations','hosts','news','liveChats','forums','adverts'],
      storage:{
         getItem : (key) => secure.get(key),
         setItem: (key, value) => secure.set(key, value),
         removeItem: (key) => secure.remove(key)
      }
    }
  )],
})