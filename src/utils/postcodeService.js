/**
 * Postcode Service - Utility for UK postcode lookup and validation
 * Uses the free Postcodes.io API for accurate UK postcode data
 */

const POSTCODES_API_BASE = 'https://api.postcodes.io';

// Rate limiting and retry configuration
const RATE_LIMIT_DELAY = 100; // ms between requests
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

/**
 * Sleep utility for rate limiting
 * @param {number} ms - Milliseconds to sleep
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry wrapper for API calls with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} retries - Number of retries remaining
 * @returns {Promise} Result of the function call
 */
const withRetry = async (fn, retries = MAX_RETRIES) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0 && (error.message.includes('API Error') || error.message.includes('Network'))) {
      console.warn(`API call failed, retrying... (${retries} attempts left)`);
      await sleep(RETRY_DELAY * (MAX_RETRIES - retries + 1)); // Exponential backoff
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
};

/**
 * Enhanced error handler for API responses
 * @param {Response} response - Fetch response object
 * @param {string} context - Context for error reporting
 */
const handleApiError = async (response, context = 'API call') => {
  if (!response.ok) {
    let errorMessage = `${context} failed`;
    
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (parseError) {
      // If we can't parse the error response, use status-based messages
      switch (response.status) {
        case 400:
          errorMessage = 'Invalid postcode format';
          break;
        case 404:
          errorMessage = 'Postcode not found';
          break;
        case 429:
          errorMessage = 'Too many requests - please try again later';
          break;
        case 500:
          errorMessage = 'Postcode service temporarily unavailable';
          break;
        case 503:
          errorMessage = 'Postcode service temporarily unavailable';
          break;
        default:
          errorMessage = `API Error: ${response.status}`;
      }
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * Lookup postcode details using Postcodes.io API
 * @param {string} postcode - The postcode to lookup
 * @returns {Promise<Object>} Postcode data with coordinates and location info
 */
export const lookupPostcode = async (postcode) => {
  if (!postcode || typeof postcode !== 'string') {
    throw new Error('Invalid postcode: must be a non-empty string');
  }

  return withRetry(async () => {
    try {
      const cleanPostcode = postcode.replace(/\s+/g, '').toUpperCase();
      
      // Basic format validation before API call
      if (!isValidPostcodeFormat(cleanPostcode)) {
        throw new Error('Invalid postcode format');
      }

      await sleep(RATE_LIMIT_DELAY); // Rate limiting

      const response = await fetch(`${POSTCODES_API_BASE}/postcodes/${cleanPostcode}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Click&Quote-App/1.0'
        }
      });

      await handleApiError(response, 'Postcode lookup');

      const data = await response.json();

      if (data.status === 200 && data.result) {
        return {
          postcode: data.result.postcode,
          latitude: data.result.latitude,
          longitude: data.result.longitude,
          country: data.result.country,
          region: data.result.region,
          admin_district: data.result.admin_district,
          admin_county: data.result.admin_county,
          admin_ward: data.result.admin_ward,
          parish: data.result.parish,
          parliamentary_constituency: data.result.parliamentary_constituency,
          ccg: data.result.ccg,
          nuts: data.result.nuts,
          codes: data.result.codes
        };
      }

      throw new Error('Invalid response format from postcode service');
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error - please check your internet connection');
      }
      throw error;
    }
  });
};

/**
 * Validate postcode using Postcodes.io API
 * @param {string} postcode - The postcode to validate
 * @returns {Promise<boolean>} True if valid, false otherwise
 */
export const validatePostcode = async (postcode) => {
  if (!postcode || typeof postcode !== 'string') {
    return false;
  }

  return withRetry(async () => {
    try {
      const cleanPostcode = postcode.replace(/\s+/g, '').toUpperCase();
      
      // Basic format check first
      if (!isValidPostcodeFormat(cleanPostcode)) {
        return false;
      }

      await sleep(RATE_LIMIT_DELAY);

      const response = await fetch(`${POSTCODES_API_BASE}/postcodes/${cleanPostcode}/validate`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Click&Quote-App/1.0'
        }
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.result === true;
    } catch (error) {
      console.warn('Postcode validation error:', error.message);
      return false;
    }
  });
};

/**
 * Get postcode autocomplete suggestions
 * @param {string} query - Partial postcode to search for
 * @returns {Promise<Array>} Array of postcode suggestions
 */
export const autocompletePostcode = async (query) => {
  if (!query || typeof query !== 'string') {
    return [];
  }

  return withRetry(async () => {
    try {
      const cleanQuery = query.replace(/\s+/g, '').toUpperCase();

      if (cleanQuery.length < 2) {
        return [];
      }

      await sleep(RATE_LIMIT_DELAY);

      const response = await fetch(`${POSTCODES_API_BASE}/postcodes/${cleanQuery}/autocomplete`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Click&Quote-App/1.0'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          return []; // No suggestions found
        }
        throw new Error(`Autocomplete API Error: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 200 && Array.isArray(data.result)) {
        return data.result.slice(0, 10); // Limit to 10 suggestions
      }

      return [];
    } catch (error) {
      console.warn('Postcode autocomplete error:', error.message);
      return [];
    }
  });
};

/**
 * Bulk lookup multiple postcodes
 * @param {Array<string>} postcodes - Array of postcodes to lookup
 * @returns {Promise<Array>} Array of postcode data
 */
export const bulkLookupPostcodes = async (postcodes) => {
  if (!Array.isArray(postcodes) || postcodes.length === 0) {
    throw new Error('Invalid input: postcodes must be a non-empty array');
  }

  if (postcodes.length > 100) {
    throw new Error('Too many postcodes: maximum 100 postcodes per request');
  }

  return withRetry(async () => {
    try {
      const cleanPostcodes = postcodes
        .filter(pc => pc && typeof pc === 'string')
        .map(pc => pc.replace(/\s+/g, '').toUpperCase())
        .filter(pc => isValidPostcodeFormat(pc));

      if (cleanPostcodes.length === 0) {
        throw new Error('No valid postcodes provided');
      }

      await sleep(RATE_LIMIT_DELAY);

      const response = await fetch(`${POSTCODES_API_BASE}/postcodes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Click&Quote-App/1.0'
        },
        body: JSON.stringify({ postcodes: cleanPostcodes })
      });

      await handleApiError(response, 'Bulk postcode lookup');

      const data = await response.json();

      if (data.status === 200 && Array.isArray(data.result)) {
        return data.result.map(item => {
          if (item.result) {
            return {
              postcode: item.result.postcode,
              latitude: item.result.latitude,
              longitude: item.result.longitude,
              country: item.result.country,
              region: item.result.region,
              admin_district: item.result.admin_district,
              admin_county: item.result.admin_county,
              admin_ward: item.result.admin_ward,
              parish: item.result.parish,
              parliamentary_constituency: item.result.parliamentary_constituency,
              ccg: item.result.ccg,
              nuts: item.result.nuts,
              codes: item.result.codes
            };
          }
          return null;
        }).filter(Boolean);
      }

      throw new Error('Invalid response format from bulk lookup service');
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error - please check your internet connection');
      }
      throw error;
    }
  });
};

/**
 * Reverse geocoding - find nearest postcode to coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} Nearest postcode data
 */
export const reverseGeocode = async (lat, lng) => {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    throw new Error('Invalid coordinates: latitude and longitude must be numbers');
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw new Error('Invalid coordinates: latitude must be between -90 and 90, longitude between -180 and 180');
  }

  return withRetry(async () => {
    try {
      await sleep(RATE_LIMIT_DELAY);
      
      const response = await fetch(`${POSTCODES_API_BASE}/postcodes?lon=${lng}&lat=${lat}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Click&Quote-App/1.0'
        }
      });
      
      await handleApiError(response, 'Reverse geocoding');
      
      const data = await response.json();
      
      if (data.status === 200 && Array.isArray(data.result) && data.result.length > 0) {
        const nearest = data.result[0];
        return {
          postcode: nearest.postcode,
          latitude: nearest.latitude,
          longitude: nearest.longitude,
          distance: nearest.distance,
          country: nearest.country,
          region: nearest.region,
          admin_district: nearest.admin_district,
          admin_county: nearest.admin_county,
          admin_ward: nearest.admin_ward,
          parish: nearest.parish,
          parliamentary_constituency: nearest.parliamentary_constituency,
          ccg: nearest.ccg,
          nuts: nearest.nuts,
          codes: nearest.codes
        };
      }
      
      throw new Error('No postcodes found for the given coordinates');
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error - please check your internet connection');
      }
      throw error;
    }
  });
};

/**
 * Get random postcode (useful for testing)
 * @returns {Promise<Object>} Random postcode data
 */
export const getRandomPostcode = async () => {
  return withRetry(async () => {
    try {
      await sleep(RATE_LIMIT_DELAY);

      const response = await fetch(`${POSTCODES_API_BASE}/random/postcodes`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Click&Quote-App/1.0'
        }
      });

      await handleApiError(response, 'Random postcode');

      const data = await response.json();

      if (data.status === 200 && data.result) {
        return {
          postcode: data.result.postcode,
          latitude: data.result.latitude,
          longitude: data.result.longitude,
          country: data.result.country,
          region: data.result.region,
          admin_district: data.result.admin_district,
          admin_county: data.result.admin_county,
          admin_ward: data.result.admin_ward,
          parish: data.result.parish,
          parliamentary_constituency: data.result.parliamentary_constituency,
          ccg: data.result.ccg,
          nuts: data.result.nuts,
          codes: data.result.codes
        };
      }

      throw new Error('Invalid response format from random postcode service');
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error - please check your internet connection');
      }
      throw error;
    }
  });
};

/**
 * Get nearest postcodes to a given postcode
 * @param {string} postcode - The postcode to find neighbors for
 * @param {number} limit - Maximum number of results (default: 10)
 * @returns {Promise<Array>} Array of nearby postcode data
 */
export const getNearestPostcodes = async (postcode, limit = 10) => {
  if (!postcode || typeof postcode !== 'string') {
    throw new Error('Invalid postcode: must be a non-empty string');
  }

  if (typeof limit !== 'number' || limit < 1 || limit > 100) {
    throw new Error('Invalid limit: must be a number between 1 and 100');
  }

  return withRetry(async () => {
    try {
      const cleanPostcode = postcode.replace(/\s+/g, '').toUpperCase();

      if (!isValidPostcodeFormat(cleanPostcode)) {
        throw new Error('Invalid postcode format');
      }

      await sleep(RATE_LIMIT_DELAY);

      const response = await fetch(`${POSTCODES_API_BASE}/postcodes/${cleanPostcode}/nearest?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Click&Quote-App/1.0'
        }
      });

      await handleApiError(response, 'Nearest postcodes lookup');

      const data = await response.json();

      if (data.status === 200 && Array.isArray(data.result)) {
        return data.result.map(item => ({
          postcode: item.postcode,
          latitude: item.latitude,
          longitude: item.longitude,
          distance: item.distance,
          country: item.country,
          region: item.region,
          admin_district: item.admin_district,
          admin_county: item.admin_county,
          admin_ward: item.admin_ward,
          parish: item.parish,
          parliamentary_constituency: item.parliamentary_constituency,
          ccg: item.ccg,
          nuts: item.nuts,
          codes: item.codes
        }));
      }

      throw new Error('Invalid response format from nearest postcodes service');
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error - please check your internet connection');
      }
      throw error;
    }
  });
};

/**
 * Get postcodes within a radius of coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Radius in meters (max 20000)
 * @param {number} limit - Maximum number of results (default: 10)
 * @returns {Promise<Array>} Array of postcodes within radius
 */
export const getPostcodesWithinRadius = async (lat, lng, radius = 1000, limit = 10) => {
  try {
    const response = await fetch(`${POSTCODES_API_BASE}/postcodes?lon=${lng}&lat=${lat}&radius=${radius}&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === 200 && Array.isArray(data.result)) {
      return data.result.map(item => ({
        postcode: item.postcode,
        latitude: item.latitude,
        longitude: item.longitude,
        distance: item.distance,
        country: item.country,
        region: item.region,
        admin_district: item.admin_district,
        admin_county: item.admin_county,
        admin_ward: item.admin_ward,
        parish: item.parish,
        parliamentary_constituency: item.parliamentary_constituency,
        ccg: item.ccg,
        nuts: item.nuts,
        codes: item.codes
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Postcodes within radius error:', error);
    return [];
  }
};

/**
 * Format postcode with proper spacing
 * @param {string} postcode - Postcode to format
 * @returns {string} Formatted postcode
 */
export const formatPostcode = (postcode) => {
  if (!postcode) return '';
  
  const clean = postcode.replace(/\s+/g, '').toUpperCase();
  
  // Add space before last 3 characters for proper UK postcode format
  if (clean.length >= 5 && clean.length <= 7) {
    const outward = clean.slice(0, -3);
    const inward = clean.slice(-3);
    return `${outward} ${inward}`;
  }
  
  return clean;
};

/**
 * Check if postcode format is valid (basic regex check)
 * @param {string} postcode - Postcode to check
 * @returns {boolean} True if format is valid
 */
export const isValidPostcodeFormat = (postcode) => {
  if (!postcode) return false;
  
  const clean = postcode.replace(/\s+/g, '').toUpperCase();
  
  // UK postcode regex pattern
  const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/;
  
  return ukPostcodeRegex.test(clean);
};