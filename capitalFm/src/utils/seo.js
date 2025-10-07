export const SEO = {
  siteUrl: 'https://capitalradio.co.ug',
  siteName: 'Capital Radio',
  defaultTitle: '91.3 Capital FM - Fresh Hits for Kampala',
  defaultDescription:
    "91.3 Capital FM - Uganda's #1 Radio Station playing the freshest hits for Kampala.",
  defaultKeywords:
    'capital radio, capital fm, uganda radio, kampala, music, news, entertainment, events',
  defaultImage: '/logo.png',
  twitterHandle: '@CapitalFMUg', // set to empty string if unknown
  themeColor: '#E30613',

  organizationJsonLd() {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Capital Radio',
      url: this.siteUrl,
      logo: `${this.siteUrl}/logo.png`,
      sameAs: [
        'https://www.facebook.com/capitalfmuganda',
        'https://twitter.com/CapitalFMUg',
        'https://www.instagram.com/capitalfmuganda/'
      ]
    }
  },

  websiteJsonLd() {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.siteName,
      url: this.siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${this.siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    }
  }
}
