
export default [
    {
      path: '/',
      component: () => import('@/views/main.vue'),
      children: [
        {
          path: '',
          name: 'welcome',
          component: () => import('@/views/dashboard.vue'),
          meta: {
            title: 'Welcome',
            description: 'Welcome to Capital Radio',
            keywords: 'capital radio, welcome, sign in, admin portal, authentication',
            ogTitle: 'Capital Radio - Welcome',
            ogDescription: 'Welcome to Capital Radio',
          }
        },
        {
          path: 'news',
          component: () => import('@/views/news/main.vue'),
          children: [
            {
              path: '',
              name: 'news',
              component: () => import('@/views/news/news.vue'),
              meta: {
                title: 'News',
                description: 'News and updates from Capital Radio',
                keywords: 'capital radio, news, updates, capital fm',
                ogTitle: 'Capital Radio - News',
                ogDescription: 'News and updates from Capital Radio',
              },
            },
            {
              path: '/:id',
              name: 'news_details',
              component: () => import('@/views/news/news_details.vue'),
              props: true,
              meta: {
                  title: 'News Details',
                  description: 'News details from Capital Radio',
                  keywords: 'capital radio, news, updates, capital fm',
                  ogTitle: 'Capital Radio - News Details',
                  ogDescription: 'News details from Capital Radio',
                }
              }
            ]
          },

          {
            path: 'events',
            component: () => import('@/views/events/main.vue'),
            children: [
              {
                path: '',
                name: 'events',
                component: () => import('@/views/events/events.vue'),
                meta: {
                  title: 'Events',
                  description: 'Events and updates from Capital Radio',
                  keywords: 'capital radio, events, updates, capital fm',
                  ogTitle: 'Capital Radio - Events',
                  ogDescription: 'Events and updates from Capital Radio',
                },
              },
              {
                path: '/:id',
                name: 'events_details',
                component: () => import('@/views/events/events_details.vue'),
                props: true,
                meta: {
                    title: 'Events Details',
                    description: 'Events details from Capital Radio',
                    keywords: 'capital radio, events, updates, capital fm',
                    ogTitle: 'Capital Radio - Events Details',
                    ogDescription: 'Events details from Capital Radio',
                  }
                }
              ]
            },
            {
              path: 'forums',
              component: () => import('@/views/forums/main.vue'),
              children: [
                {
                  path: '',
                  name: 'forums',
                  component: () => import('@/views/forums/forums.vue'),
                  meta: {
                    title: 'Forums',
                    description: 'Forums and updates from Capital Radio',
                    keywords: 'capital radio, forums, updates, capital fm',
                    ogTitle: 'Capital Radio - Forums',
                    ogDescription: 'Forums and updates from Capital Radio',
                  },
                },
                {
                  path: ':id',
                  name: 'forum_details',
                  component: () => import('@/views/forums/forum_details.vue'),
                  props: true,
                  meta: {
                      title: 'Forums Details',
                      description: 'Forums details from Capital Radio',
                      keywords: 'capital radio, forums, updates, capital fm',
                      ogTitle: 'Capital Radio - Forums Details',
                      ogDescription: 'Forums details from Capital Radio',
                    }
                  }
                ]
              },
              {
                path: 'radio-shows',
                name: 'radio_shows',
                component: () => import('@/views/radio_shows.vue'),
                meta: {
                  title: 'Radio Shows',
                  description: 'Radio Shows and updates from Capital Radio',
                  keywords: 'capital radio, radio shows, updates, capital fm',
                  ogTitle: 'Capital Radio - Radio Shows',
                  ogDescription: 'Radio Shows and updates from Capital Radio',
                },
              },
              {
                path: 'about-us',
                name: 'about_us',
                component: () => import('@/views/about_us.vue'),
                meta: {
                  title: 'About Us',
                  description: 'About Us and updates from Capital Radio',
                  keywords: 'capital radio, about us, updates, capital fm',
                  ogTitle: 'Capital Radio - About Us',
                  ogDescription: 'About Us and updates from Capital Radio',
                },
              },
         
      ] 
    }
   ]