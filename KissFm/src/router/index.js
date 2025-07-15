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
 const pageTitle = to.meta.title || 'Fresh Hits for Uganda'
 const appName = to.meta.appName || '100.9 KIIS FM'
 const description = to.meta.description || '100.9 KIIS FM - Uganda\'s Premium Hit Station playing the freshest hits, latest music, and live shows. Listen live now!'
 const keywords = to.meta.keywords || 'KIIS FM, Uganda radio, 100.9 FM, fresh hits, music, live radio, Uganda entertainment, hit songs, radio station'
 
 // Set document title
 if (to.meta.appendAppName === false) {
   document.title = pageTitle
 } else {
   document.title = `${pageTitle} | ${appName}`
 }
 
 // Update meta description
 updateMetaTag('description', description)
 
 // Update meta keywords
 updateMetaTag('keywords', keywords)
 
 // Update Open Graph meta tags
 const ogTitle = to.meta.ogTitle || `${pageTitle} | ${appName}`
 const ogDescription = to.meta.ogDescription || description
 const ogImage = to.meta.ogImage || 'https://kiisfm.ug/og-image.jpg'
 
 updateMetaTag('og:title', ogTitle)
 updateMetaTag('og:description', ogDescription)
 updateMetaTag('og:image', ogImage)
 updateMetaTag('og:url', window.location.origin + to.fullPath)
 
 // Update Twitter Card meta tags
 const twitterTitle = to.meta.twitterTitle || ogTitle
 const twitterDescription = to.meta.twitterDescription || ogDescription
 const twitterImage = to.meta.twitterImage || 'https://kiisfm.ug/twitter-image.jpg'
 
 updateMetaTag('twitter:title', twitterTitle)
 updateMetaTag('twitter:description', twitterDescription)
 updateMetaTag('twitter:image', twitterImage)
 updateMetaTag('twitter:url', window.location.origin + to.fullPath)
 
 // Set canonical URL
 if (to.meta.canonical !== false) {
   updateLinkTag('canonical', window.location.origin + to.fullPath)
 }
 
 // Update structured data for radio station
 updateStructuredData(pageTitle, description, to.fullPath)
 
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

// Helper function to update structured data
function updateStructuredData(pageTitle, description, path) {
 let script = document.querySelector('script[type="application/ld+json"]')
 
 if (!script) {
   script = document.createElement('script')
   script.type = 'application/ld+json'
   document.head.appendChild(script)
 }
 
 const structuredData = {
   "@context": "https://schema.org",
   "@type": "RadioStation",
   "name": "KIIS FM",
   "alternateName": "100.9 KIIS FM",
   "description": description,
   "url": `https://kiisfm.ug${path}`,
   "logo": "https://kiisfm.ug/logokiis.png",
   "image": "https://kiisfm.ug/og-image.jpg",
   "broadcastFrequency": "100.9 FM",
   "address": {
     "@type": "PostalAddress",
     "addressCountry": "UG",
     "addressLocality": "Kampala"
   },
   "sameAs": [
     "https://facebook.com/KIISFMUganda",
     "https://twitter.com/KIISFMUganda",
     "https://instagram.com/KIISFMUganda"
   ]
 }
 
 script.textContent = JSON.stringify(structuredData)
}

export default router