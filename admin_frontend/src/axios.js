import axios from "axios";
import Nprogress from 'nprogress';
import 'nprogress/nprogress.css';
import store from './store';

// Optimized cache implementation
const cache = new Map();
const backgroundUpdates = new Map();

const getCacheKey = (config) => {
  const { url, method, data } = config;
  return `${method}-${url}-${JSON.stringify(data || {})}`;
};

const setCacheData = (key, response, maxAge = 15 * 60 * 1000) => {
  cache.set(key, {
    data: response,
    timestamp: Date.now(),
    maxAge
  });
};

const getCacheData = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  
  const isStale = Date.now() - entry.timestamp > entry.maxAge;
  return {
    ...entry.data,
    isStale,
    fromCache: true
  };
};

const apidirecturl = window.location.href.includes('localhost')
? 'http://127.0.0.1:8000/api/v1/'
: 'https://capitalfm.deepcodegroup.com/api/v1/';

const axiosInstance = axios.create({
  baseURL:apidirecturl,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded',
    'crossDomain': true,
    'Accept-Encoding': 'gzip, deflate, br'
  }
});

// Optimized progress bar configuration
Nprogress.configure({ 
  minimum: 0.1,
  showSpinner: false,
  speed: 200,
  trickleSpeed: 100
});

let requestsCounter = 0;
let progressTimeout;

// Request interceptor with enhanced caching
axiosInstance.interceptors.request.use(
  async (config) => {
    // CRITICAL FIX: Preserve the original method and ensure it's never undefined
    // Default to POST since most API calls are POST requests (especially file uploads)
    const originalMethod = config.method || 'post';
    config.method = originalMethod.toLowerCase();
    

    if (requestsCounter === 0) {
      if (progressTimeout) clearTimeout(progressTimeout);
      progressTimeout = setTimeout(() => Nprogress.start(), 50);
    }
    requestsCounter++;

    // Token handling
    const authuser = store.getters.authuser;
    if (authuser) {
      config.headers.Authorization = 'Bearer ' + localStorage.getItem('capital_radio_token_admin' + authuser.id);
    } else {
      config.headers.Authorization = 'Bearer ';
    }

    // Add clientData to request data
    let client_Data = store.getters.clientdata;
    
    // Provide fallback if clientdata is null/undefined
    if (!client_Data || typeof client_Data !== 'object') {
      client_Data = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };
    }
    
    const clientDataString = JSON.stringify(client_Data);
    console.log('Client Data:', client_Data);
    console.log('Client Data String:', clientDataString);
    
    if (clientDataString) {
      // Handle different types of request data formats
      if (config.method === 'get') {
        // For GET requests, append to params
        config.params = config.params || {};
        config.params.clientData = clientDataString;
      } else {
        // For POST, PUT, DELETE requests
        if (config.data) {
          // If data is FormData
          if (config.data instanceof FormData) {
            console.log('Processing FormData request');
            config.data.append('clientData', clientDataString);
            // Remove Content-Type for FormData
            if (config.headers['Content-Type']) {
              delete config.headers['Content-Type'];
            }
          } 
          // If data is JSON object
          else if (typeof config.data === 'object' && !(config.data instanceof ArrayBuffer)) {
            if (typeof config.data === 'string') {
              try {
                const parsedData = JSON.parse(config.data);
                config.data = {
                  ...parsedData,
                  clientData: clientDataString
                };
              } catch (e) {
                // If not valid JSON, append as is
                config.data = config.data + '&clientData=' + clientDataString;
              }
            } else {
              // Direct object
              config.data = {
                ...config.data,
                clientData: clientDataString
              };
            }
          } 
          // Handle other data formats if needed
          else {
            console.warn('Unable to append clientData to request', config);
          }
        } else {
          console.log("no data");
          let clientData = clientDataString
          // If no data exists, create it
          config.data = { clientData };
        }
      }
    }

    // DISABLE CACHING FOR ALL REQUESTS TO AVOID CONFIG CORRUPTION
    // This is the likely source of your issue - cached configs losing their method
    /*
    if (!config.skipCache) {
      const cacheKey = getCacheKey(config);
      const cachedResponse = getCacheData(cacheKey);
      
      if (cachedResponse && !cachedResponse.isStale) {
        requestsCounter--;
        if (requestsCounter === 0) {
          if (progressTimeout) clearTimeout(progressTimeout);
          Nprogress.done();
        }
        return Promise.resolve(cachedResponse);
      }

      // If we have stale data, return it but fetch fresh data in background
      if (cachedResponse && cachedResponse.isStale && !backgroundUpdates.has(cacheKey)) {
        backgroundUpdates.set(cacheKey, true);
        
        // Clone the config for background request
        const backgroundConfig = { ...config, skipCache: true };
        
        setTimeout(() => {
          axiosInstance(backgroundConfig)
            .then(freshResponse => {
              setCacheData(cacheKey, freshResponse);
            })
            .finally(() => {
              backgroundUpdates.delete(cacheKey);
            });
        }, 0);
      }
    }
    */

    config.requestId = Math.random().toString(36).slice(7);
    
    // Final check before returning config
    if (!config.method) {
      console.error('CRITICAL: config.method is still undefined!');
      config.method = 'post'; // Default to POST
    }
    
    console.log('Final config method before return:', config.method);
    console.log('=== END AXIOS REQUEST DEBUG ===');
    
    return config;
  },
  (error) => {
    requestsCounter--;
    if (requestsCounter === 0) {
      if (progressTimeout) clearTimeout(progressTimeout);
      Nprogress.done();
    }
    return Promise.reject(error);
  }
);

// Response interceptor with caching
axiosInstance.interceptors.response.use(
  (response) => {
    requestsCounter--;
    if (requestsCounter === 0) {
      if (progressTimeout) clearTimeout(progressTimeout);
      Nprogress.done();
    }

    // DISABLE CACHING TO AVOID CONFIG ISSUES
    /*
    if (!response.config.skipCache) {
      const cacheKey = getCacheKey(response.config);
      setCacheData(cacheKey, response);
    }
    */

    return response;
  },
  async (error) => {
    requestsCounter--;
    if (requestsCounter === 0) {
      if (progressTimeout) clearTimeout(progressTimeout);
      Nprogress.done();
    }

    if (!error.response) {
      console.error('Network Error:', error);
      throw new Error('Network error occurred. Please check your connection.');
    }

    // if (error.response.status === 401) {
    //   localStorage.clear();
    //   window.location.href = '/auth/login';
    //   return Promise.reject(error);
    // }

    // Optimized retry logic
    const { config } = error;
    if (!config || !config.retry) {
      return Promise.reject(error);
    }

    config.retryCount = config.retryCount || 0;

    if (config.retryCount >= config.retry) {
      return Promise.reject(error);
    }

    config.retryCount += 1;
    const backoffDelay = Math.min(
      config.retryDelay * Math.pow(1, config.retryCount - 1),
      30000 // Max delay of 30 seconds
    );
    
    await new Promise(resolve => setTimeout(resolve, backoffDelay));
    return axiosInstance(config);
  }
);

// Cache management methods
axiosInstance.clearCache = () => {
  cache.clear();
  backgroundUpdates.clear();
};

axiosInstance.removeCacheEntry = (config) => {
  const cacheKey = getCacheKey(config);
  cache.delete(cacheKey);
  backgroundUpdates.delete(cacheKey);
};

// Global configuration
window.axios = axiosInstance;

axiosInstance.defaults.retry = 1;
axiosInstance.defaults.retryDelay = 1000;
axiosInstance.defaults.timeoutErrorMessage = 'Request timed out. Please try again.';

const CancelToken = axios.CancelToken;
axiosInstance.cancelToken = CancelToken;

export default axiosInstance;