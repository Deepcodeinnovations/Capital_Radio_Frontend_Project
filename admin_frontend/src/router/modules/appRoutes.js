import store from '@/store';
const checkAuth = (to, from, next) => {
  const isAuthenticated = store.getters.authuser !== undefined && store.getters.authuser !== null && localStorage.getItem('capital_radio_token_admin' + store.getters.authuser?.id);
  if (!isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
};
export default [
  {
    path: '/',
    component: () => import('../../views/app/main.vue'),
    beforeEnter: checkAuth,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../../views/app/main/MainDashboard.vue')
      },

      {
        path: 'my-accoount',
        name: 'my_accoount',
        component: () => import('../../views/app/users/myaccount.vue')
      },

      {
        path: 'user-manager',
        name: 'user_manager',
        component: () => import('../../views/app/users/user_manager.vue')
      },


      //stations
      {
        path: 'stations',
        name: 'Stations',
        component: () => import('../../views/app/stations/Stations.vue')
      },
      {
        path: 'stations/:id',
        name: 'StationDetails',
        component: () => import('../../views/app/stations/station_details.vue')
      },

      {
        path: 'podcasts',
        name: 'Podcasts',
        component: () => import('../../views/app/podcasts/Podcasts.vue')
      }, 
      {
        path: 'news',
        component: () => import('../../views/app/news/main.vue'),
        children: [
          {
            path: '',
            name: 'News',
            component: () => import('../../views/app/news/News.vue')
          },
          {
            path: 'create_news/:id?',
            props: true,
            name: 'NewNews',
            component: () => import('../../views/app/news/NewArticle.vue')
          },
          {
            path: 'categories',
            name: 'NewsCategories',
            component: () => import('../../views/app/news/news_categories.vue')
          }
        ]
      },


      {
        path: 'forums',
        component: () => import('../../views/app/forums/main.vue'),
        children: [
           // New routes for Forums and Live Chats
          {
            path: '',
            name: 'Forums',
            component: () => import('../../views/app/forums/Forums.vue'),
          },
          {
            path: '/:id',
            name: 'ForumDetails',
            component: () => import('../../views/app/forums/ForumDetails.vue'),
            props: true
          },
        ]
      },


      {
        path: 'adverts',
        component: () => import('../../views/app/adverts/main.vue'),
        children: [
           // New routes for Forums and Live Chats
          {
            path: '',
            name: 'Adverts',
            component: () => import('../../views/app/adverts/Adverts.vue'),
          },
          {
            path: 'adverts/:id',
            name: 'AdvertDetails',
            component: () => import('../../views/app/adverts/AdvertDetails.vue'),
            props: true
          },
        ]
      },
    

      {
        path: 'radio-programs',
        name: 'Sessions',
        component: () => import('../../views/app/sessions/Sessions.vue')
      },
      {
        path: 'hosts',
        name: 'Hosts',
        component: () => import('../../views/app/hosts/Hosts.vue')
      },
      {
        path: 'scheduler',
        name: 'Scheduler',
        component: () => import('../../views/app/scheduler/Scheduler.vue')
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: () => import('../../views/app/analytics/Analytics.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../../views/app/settings/Settings.vue')
      },
     
      {
        path: 'live-chats',
        name: 'LiveChats',
        component: () => import('../../views/app/liveChats/LiveChats.vue')
      },

      {
        path: 'events',
        name: 'Events',
        component: () => import('../../views/app/events/Events.vue')
      },
      
    ]
  }
]