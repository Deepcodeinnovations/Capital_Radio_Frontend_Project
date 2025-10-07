let GA_ID = null

function insertGtagScript(id) {
  if (document.getElementById('ga4-gtag')) return
  const s1 = document.createElement('script')
  s1.async = true
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  s1.id = 'ga4-gtag'
  document.head.appendChild(s1)

  const s2 = document.createElement('script')
  s2.id = 'ga4-gtag-inline'
  s2.textContent = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());`
  document.head.appendChild(s2)
}

export function initAnalytics(id) {
  if (!id) return
  GA_ID = id
  insertGtagScript(id)
  // Disable automatic initial page_view so we control SPA navigations
  window.gtag && window.gtag('config', GA_ID, { send_page_view: false })
}

export function trackPageView(path, title) {
  if (!window.gtag || !GA_ID) return
  const url = typeof window !== 'undefined' ? window.location.href : undefined
  // GA4 page_view event
  window.gtag('event', 'page_view', {
    page_title: title || document.title,
    page_location: url,
    page_path: path
  })
}

export function attachRouterTracking(router) {
  if (!router) return
  router.afterEach((to) => {
    const path = (to.fullPath || to.path || '/').split('#')[0]
    // Defer until next tick to ensure document.title updated by router beforeEach
    setTimeout(() => trackPageView(path, document.title), 0)
  })
}
