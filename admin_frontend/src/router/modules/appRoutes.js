
export default [
  {
    path: '/',
    component: () => import('../../views/app/main.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../../views/app/main/MainDashboard.vue')
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
        path: 'podcasts/new',
        name: 'NewPodcast',
        component: () => import('../../views/app/podcasts/NewPodcast.vue')
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
        path: 'live-chats/:id',
        name: 'ChatRoomDetails',
        component: () => import('../../views/app/liveChats/ChatRoomDetails.vue'),
        props: true
      }
    ]
  }
]