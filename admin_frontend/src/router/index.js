import { createRouter, createWebHistory } from 'vue-router'
import authRouter from './modules/authRoutes'
import appRouter from './modules/appRoutes'

// Combine all routes
const routes = [
 ...authRouter,
 ...appRouter
]

const router = createRouter({
 history: createWebHistory(import.meta.env.BASE_URL),
 routes
})

// Navigation guard to handle page titles and meta information
router.beforeEach((to, from, next) => {
 const pageTitle = to.meta.title || 'Dashboard'
 const appName = to.meta.appName || 'Capital Radio'
 const description = to.meta.description || 'Capital Radio - Uganda\'s Premier Radio Network'
 const keywords = to.meta.keywords || 'capital radio, uganda radio, music, news, entertainment'
 
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
 }
 
 if (to.meta.ogDescription) {
   updateMetaTag('og:description', to.meta.ogDescription)
 }
 
 if (to.meta.ogImage) {
   updateMetaTag('og:image', to.meta.ogImage)
 }
 
 // Update Twitter Card meta tags
 if (to.meta.twitterTitle) {
   updateMetaTag('twitter:title', to.meta.twitterTitle)
 }
 
 if (to.meta.twitterDescription) {
   updateMetaTag('twitter:description', to.meta.twitterDescription)
 }
 
 if (to.meta.twitterImage) {
   updateMetaTag('twitter:image', to.meta.twitterImage)
 }
 
 // Set canonical URL
 if (to.meta.canonical !== false) {
   updateLinkTag('canonical', window.location.origin + to.fullPath)
 }
 
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