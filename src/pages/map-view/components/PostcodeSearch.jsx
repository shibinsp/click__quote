import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import { 
  autocompletePostcode, 
  lookupPostcode, 
  formatPostcode, 
  validatePostcode,
  getNearestPostcodes,
  getRandomPostcode 
} from '../../../utils/postcodeService';

// Main component
const PostcodeSearch = ({ onLocationFound, onSearchError }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [showNearbyPostcodes, setShowNearbyPostcodes] = useState(false);
  const [nearbyPostcodes, setNearbyPostcodes] = useState([]);

  // Debounced autocomplete function
  const debouncedAutocomplete = useCallback(async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const results = await autocompletePostcode(query);
      const formattedSuggestions = results.map(postcode => ({
        code: postcode,
        postcode: formatPostcode(postcode),
        type: 'postcode'
      }));
      setSuggestions(formattedSuggestions);
      setShowSuggestions(formattedSuggestions.length > 0);
    } catch (error) {
      console.error('Autocomplete error:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e?.target?.value || '';
    setSearchQuery(value);

    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer for debounced search
    const newTimer = setTimeout(() => {
      debouncedAutocomplete(value);
    }, 300);

    setDebounceTimer(newTimer);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Handle suggestion click
  const handleSuggestionClick = async (suggestion) => {
    setSearchQuery(suggestion?.postcode || suggestion?.code);
    setShowSuggestions(false);
    setSuggestions([]);
    
    try {
      setIsLoading(true);
      const postcodeData = await lookupPostcode(suggestion?.code || suggestion?.postcode);
      
      // Get nearby postcodes for enhanced functionality
      try {
        const nearby = await getNearestPostcodes(postcodeData.postcode, 5);
        setNearbyPostcodes(nearby);
        setShowNearbyPostcodes(nearby.length > 0);
      } catch (nearbyError) {
        console.warn('Could not fetch nearby postcodes:', nearbyError);
        setNearbyPostcodes([]);
        setShowNearbyPostcodes(false);
      }
      
      // Trigger location found callback with real API data
      onLocationFound?.({
        lat: postcodeData.latitude,
        lng: postcodeData.longitude,
        postcode: postcodeData.postcode,
        region: postcodeData.region,
        admin_district: postcodeData.admin_district,
        admin_county: postcodeData.admin_county,
        admin_ward: postcodeData.admin_ward,
        parish: postcodeData.parish,
        parliamentary_constituency: postcodeData.parliamentary_constituency,
        type: 'postcode'
      });
    } catch (error) {
      console.error('Postcode lookup error:', error);
      onSearchError?.(`Could not find location data for postcode: ${suggestion?.code || suggestion?.postcode}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search submission
  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery?.trim()) return;

    setIsLoading(true);
    setShowSuggestions(false);

    try {
      // Validate postcode format first
      const isValid = await validatePostcode(searchQuery);
      if (!isValid) {
        throw new Error('Invalid postcode format');
      }

      const postcodeData = await lookupPostcode(searchQuery);
      
      // Get nearby postcodes for enhanced functionality
      try {
        const nearby = await getNearestPostcodes(postcodeData.postcode, 5);
        setNearbyPostcodes(nearby);
        setShowNearbyPostcodes(nearby.length > 0);
      } catch (nearbyError) {
        console.warn('Could not fetch nearby postcodes:', nearbyError);
        setNearbyPostcodes([]);
        setShowNearbyPostcodes(false);
      }
      
      onLocationFound?.({
        lat: postcodeData.latitude,
        lng: postcodeData.longitude,
        postcode: postcodeData.postcode,
        region: postcodeData.region,
        admin_district: postcodeData.admin_district,
        admin_county: postcodeData.admin_county,
        admin_ward: postcodeData.admin_ward,
        parish: postcodeData.parish,
        parliamentary_constituency: postcodeData.parliamentary_constituency,
        type: 'postcode'
      });
    } catch (error) {
      console.error('Postcode search error:', error);
      let errorMessage = `Could not find location for postcode: ${searchQuery}`;
      
      if (error.message === 'Postcode not found') {
        errorMessage = `Postcode "${searchQuery}" not found. Please check the postcode and try again.`;
      } else if (error.message === 'Invalid postcode format') {
        errorMessage = `"${searchQuery}" is not a valid UK postcode format. Please enter a valid postcode (e.g., SW1A 1AA).`;
      } else if (error.message.includes('API Error')) {
        errorMessage = 'Postcode service temporarily unavailable. Please try again later.';
      }
      
      onSearchError?.(errorMessage);
      setNearbyPostcodes([]);
      setShowNearbyPostcodes(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle random postcode search
  const handleRandomSearch = async () => {
    try {
      setIsLoading(true);
      const randomPostcode = await getRandomPostcode();
      setSearchQuery(randomPostcode.postcode);
      
      // Get nearby postcodes
      try {
        const nearby = await getNearestPostcodes(randomPostcode.postcode, 5);
        setNearbyPostcodes(nearby);
        setShowNearbyPostcodes(nearby.length > 0);
      } catch (nearbyError) {
        console.warn('Could not fetch nearby postcodes:', nearbyError);
        setNearbyPostcodes([]);
        setShowNearbyPostcodes(false);
      }
      
      onLocationFound?.({
        lat: randomPostcode.latitude,
        lng: randomPostcode.longitude,
        postcode: randomPostcode.postcode,
        region: randomPostcode.region,
        admin_district: randomPostcode.admin_district,
        admin_county: randomPostcode.admin_county,
        admin_ward: randomPostcode.admin_ward,
        parish: randomPostcode.parish,
        parliamentary_constituency: randomPostcode.parliamentary_constituency,
        type: 'postcode'
      });
    } catch (error) {
      console.error('Random postcode error:', error);
      onSearchError?.('Could not fetch random postcode. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle nearby postcode click
  const handleNearbyPostcodeClick = async (nearbyPostcode) => {
    setSearchQuery(nearbyPostcode.postcode);
    setShowNearbyPostcodes(false);
    
    onLocationFound?.({
      lat: nearbyPostcode.latitude,
      lng: nearbyPostcode.longitude,
      postcode: nearbyPostcode.postcode,
      region: nearbyPostcode.region,
      admin_district: nearbyPostcode.admin_district,
      admin_county: nearbyPostcode.admin_county,
      admin_ward: nearbyPostcode.admin_ward,
      parish: nearbyPostcode.parish,
      parliamentary_constituency: nearbyPostcode.parliamentary_constituency,
      type: 'postcode'
    });
  };

  // Handle input focus
  const handleFocus = () => {
    if (suggestions?.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Handle input blur (with delay to allow suggestion clicks)
  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="flex space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder="Search postcode (e.g. SW1A 1AA, M1 4ET)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            disabled={isLoading}
          />
          
          {/* Search Suggestions */}
          {showSuggestions && suggestions?.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              {suggestions?.map((suggestion, index) => (
                  <button
                    type="button"
                    key={`${suggestion?.code}-${index}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:bg-blue-50 focus:outline-none"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 flex items-center space-x-2">
                          <span>{suggestion?.postcode || suggestion?.code}</span>
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                            UK
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatPostcode(suggestion?.code || suggestion?.postcode)}
                        </div>
                      </div>
                      <Icon name="MapPin" size={16} className="text-gray-400" />
                    </div>
                  </button>
              ))}
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !searchQuery?.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm font-medium"
        >
          {isLoading ? (
            <Icon name="Loader2" size={16} className="animate-spin" />
          ) : (
            <Icon name="Search" size={16} />
          )}
          <span>{isLoading ? 'Searching...' : 'Search'}</span>
        </button>
        

      </form>
      
      {/* Nearby Postcodes */}
      {showNearbyPostcodes && nearbyPostcodes?.length > 0 && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="MapPin" size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Nearby Postcodes ({nearbyPostcodes.length})
            </span>
            <button
              onClick={() => setShowNearbyPostcodes(false)}
              className="ml-auto text-blue-600 hover:text-blue-800"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {nearbyPostcodes.slice(0, 6).map((nearby, index) => (
              <button
                key={`nearby-${nearby.postcode}-${index}`}
                onClick={() => handleNearbyPostcodeClick(nearby)}
                className="px-2 py-1 text-xs bg-white border border-blue-200 rounded hover:bg-blue-100 hover:border-blue-300 transition-colors text-left"
              >
                <div className="font-medium text-blue-800">{nearby.postcode}</div>
                <div className="text-blue-600 truncate">
                  {nearby.admin_district || nearby.admin_county || 'Unknown'}
                </div>
              </button>
            ))}
          </div>
          {nearbyPostcodes.length > 6 && (
            <div className="mt-2 text-xs text-blue-600">
              +{nearbyPostcodes.length - 6} more nearby postcodes
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostcodeSearch;