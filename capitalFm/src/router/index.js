import { createRouter, createWebHistory } from 'vue-router'
import appRouter from './modules/approutes'
import { SEO } from '@/utils/seo'

// Combine all routes
const routes = [
  ...appRouter,
  // 404 fallback route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/not_found.vue'),
    meta: {
      title: 'Page Not Found',
      description: 'The page you are looking for could not be found.',
      noindex: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Navigation guard to handle page titles and meta information
router.beforeEach((to, from, next) => {
  const appName = to.meta.appName || SEO.siteName
  const pageTitle = to.meta.title || SEO.defaultTitle
  const fullTitle = to.meta.appendAppName === false ? pageTitle : `${appName} | ${pageTitle}`
  const description = to.meta.description || SEO.defaultDescription
  const keywords = to.meta.keywords || SEO.defaultKeywords

  // Compute URLs
  const pathOnly = to.path || '/'
  const canonicalUrl = `${SEO.siteUrl}${pathOnly}`

  // Set document title
  document.title = fullTitle

  // Standard meta
  updateMetaTag('description', description)
  updateMetaTag('keywords', keywords)
  updateMetaTag('robots', to.meta.noindex ? 'noindex, nofollow' : 'index, follow')

  // Open Graph defaults
  updateMetaTag('og:type', to.meta.ogType || 'website')
  updateMetaTag('og:site_name', SEO.siteName)
  updateMetaTag('og:title', to.meta.ogTitle || fullTitle)
  updateMetaTag('og:description', to.meta.ogDescription || description)
  updateMetaTag('og:image', to.meta.ogImage || SEO.defaultImage)
  updateMetaTag('og:url', canonicalUrl)

  // Twitter cards
  updateMetaTag('twitter:card', 'summary_large_image')
  if (SEO.twitterHandle) updateMetaTag('twitter:site', SEO.twitterHandle)
  updateMetaTag('twitter:title', to.meta.twitterTitle || fullTitle)
  updateMetaTag('twitter:description', to.meta.twitterDescription || description)
  updateMetaTag('twitter:image', to.meta.twitterImage || SEO.defaultImage)

  // Canonical link
  if (to.meta.canonical !== false) {
    updateLinkTag('canonical', canonicalUrl)
  }

  // Theme color (optional)
  if (SEO.themeColor) updateMetaTag('theme-color', SEO.themeColor)

  // JSON-LD Structured Data: Organization + WebSite
  injectJsonLd('seo-org-jsonld', SEO.organizationJsonLd())
  injectJsonLd('seo-website-jsonld', SEO.websiteJsonLd())

  next()
})

// Helper function to update meta tags
function updateMetaTag(name, content) {
  if (!content) return
  const isProperty = name.startsWith('og:') || name.startsWith('twitter:')
  const attribute = isProperty ? 'property' : 'name'

  let element = document.querySelector(`meta[${attribute}="${name}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

// Helper function to update link tags
function updateLinkTag(rel, href) {
  if (!href) return
  let element = document.querySelector(`link[rel="${rel}"]`)

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }

  element.setAttribute('href', href)
}

// Helper to inject or replace JSON-LD by id
function injectJsonLd(id, json) {
  if (!json) return
  let script = document.getElementById(id)
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = id
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(json)
}

export default router
