import { createRouter, createWebHistory } from 'vue-router'
import appRouter from './modules/approutes'

// Combine all routes
const routes = [
...appRouter,
]

const router = createRouter({
history: createWebHistory(import.meta.env.BASE_URL),
routes
})

// Navigation guard to handle page titles and meta information
router.beforeEach((to, from, next) => {
const pageTitle = to.meta.title || 'Dashboard'
const appName = to.meta.appName || 'Beat FM 96.3'
const description = to.meta.description || 'Beat FM 96.3 - Ekintabuli Ky\'Omuziki | Uganda\'s premier radio station playing the hottest beats and entertainment 24/7'
const keywords = to.meta.keywords || 'beat fm, 96.3 fm, uganda radio, ekintabuli ky omuziki, music, entertainment, news, live radio, kampala radio'

// Set document title
if (to.meta.appendAppName === false) {
  document.title = pageTitle
} else {
  document.title = `${appName} | ${pageTitle}`
}

// Update meta description
updateMetaTag('description', description)

// Update meta keywords
updateMetaTag('keywords', keywords)

// Update Open Graph meta tags
if (to.meta.ogTitle) {
  updateMetaTag('og:title', to.meta.ogTitle)
} else {
  updateMetaTag('og:title', `${appName} | ${pageTitle}`)
}

if (to.meta.ogDescription) {
  updateMetaTag('og:description', to.meta.ogDescription)
} else {
  updateMetaTag('og:description', description)
}

if (to.meta.ogImage) {
  updateMetaTag('og:image', to.meta.ogImage)
} else {
  updateMetaTag('og:image', `${window.location.origin}/logobeat.png`)
}

// Update Twitter Card meta tags
if (to.meta.twitterTitle) {
  updateMetaTag('twitter:title', to.meta.twitterTitle)
} else {
  updateMetaTag('twitter:title', `${appName} | ${pageTitle}`)
}

if (to.meta.twitterDescription) {
  updateMetaTag('twitter:description', to.meta.twitterDescription)
} else {
  updateMetaTag('twitter:description', description)
}

if (to.meta.twitterImage) {
  updateMetaTag('twitter:image', to.meta.twitterImage)
} else {
  updateMetaTag('twitter:image', `${window.location.origin}/logobeat.png`)
}

// Update additional Beat FM specific meta tags
updateMetaTag('theme-color', '#DC2626')
updateMetaTag('apple-mobile-web-app-title', 'Beat FM')
updateMetaTag('application-name', 'Beat FM 96.3')

// Set canonical URL
if (to.meta.canonical !== false) {
  updateLinkTag('canonical', window.location.origin + to.fullPath)
}

// Update Open Graph URL
updateMetaTag('og:url', window.location.origin + to.fullPath)
updateMetaTag('twitter:url', window.location.origin + to.fullPath)

next()
})

// Helper function to update meta tags
function updateMetaTag(name, content) {
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
let element = document.querySelector(`link[rel="${rel}"]`)

if (!element) {
  element = document.createElement('link')
  element.setAttribute('rel', rel)
  document.head.appendChild(element)
}

element.setAttribute('href', href)
}

export default router