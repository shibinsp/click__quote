import React, { useState, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const PostcodeSearch = ({ onLocationFound, onSearchError }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Sample UK postcodes with coordinates for demo purposes
  const samplePostcodes = [
    { postcode: 'M1 4ET', lat: 53.4808, lng: -2.2426, name: 'Manchester City Centre' },
    { postcode: 'B1 1AA', lat: 52.4862, lng: -1.8904, name: 'Birmingham Jewellery Quarter' },
    { postcode: 'G1 2FF', lat: 55.8642, lng: -4.2518, name: 'Glasgow City Centre' },
    { postcode: 'E14 5AB', lat: 51.5074, lng: -0.1278, name: 'London Canary Wharf' },
    { postcode: 'LS1 4DY', lat: 53.8008, lng: -1.5491, name: 'Leeds City Centre' },
    { postcode: 'BS1 6HL', lat: 51.4545, lng: -2.5879, name: 'Bristol Harbourside' },
    { postcode: 'CF10 1EP', lat: 51.4816, lng: -3.1791, name: 'Cardiff Bay' },
    { postcode: 'NE1 7RU', lat: 54.9783, lng: -1.6174, name: 'Newcastle Quayside' },
    { postcode: 'L1 8JQ', lat: 53.4084, lng: -2.9916, name: 'Liverpool Albert Dock' },
    { postcode: 'EH1 1YZ', lat: 55.9533, lng: -3.1883, name: 'Edinburgh Castle Hill' },
    { postcode: 'S1 2HE', lat: 53.3811, lng: -1.4701, name: 'Sheffield City Centre' },
    { postcode: 'PL1 2AB', lat: 50.3755, lng: -4.1427, name: 'Plymouth Barbican' },
    { postcode: 'NG1 5DT', lat: 52.9548, lng: -1.1581, name: 'Nottingham Market Square' },
    { postcode: 'BA1 1LN', lat: 51.3758, lng: -2.3599, name: 'Bath Abbey' },
    { postcode: 'PO1 3AX', lat: 50.8198, lng: -1.0880, name: 'Portsmouth Historic Dockyard' },
    { postcode: 'PR1 2HE', lat: 53.7632, lng: -2.7031, name: 'Preston Railway Station' },
    { postcode: 'CT1 2JD', lat: 51.2802, lng: 1.0789, name: 'Canterbury Cathedral' },
    { postcode: 'OX1 1HP', lat: 51.752, lng: -1.2577, name: 'Oxford Carfax Tower' },
    { postcode: 'CV1 5FB', lat: 52.4068, lng: -1.5197, name: 'Coventry Cathedral' },
    { postcode: 'BN1 1UB', lat: 50.8225, lng: -0.1372, name: 'Brighton Pier' }
  ];

  // Handle search query changes and show suggestions
  const handleSearchChange = useCallback((e) => {
    const value = e?.target?.value?.toUpperCase();
    setSearchQuery(value);

    if (value?.length >= 2) {
      const filtered = samplePostcodes?.filter(item =>
        item?.postcode?.includes(value) || 
        item?.name?.toLowerCase()?.includes(value?.toLowerCase())
      )?.slice(0, 5);
      
      setSuggestions(filtered);
      setShowSuggestions(filtered?.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  // Handle suggestion selection
  const handleSuggestionClick = useCallback((suggestion) => {
    setSearchQuery(suggestion?.postcode);
    setShowSuggestions(false);
    setSuggestions([]);
    
    onLocationFound?.({
      lat: suggestion?.lat,
      lng: suggestion?.lng,
      name: suggestion?.name,
      postcode: suggestion?.postcode
    });
  }, [onLocationFound]);

  // Handle search submission
  const handleSearch = useCallback(async (e) => {
    e?.preventDefault();
    
    if (!searchQuery?.trim()) return;

    setIsLoading(true);
    setShowSuggestions(false);

    try {
      // First try to find exact match in sample data
      const exactMatch = samplePostcodes?.find(item =>
        item?.postcode?.toLowerCase() === searchQuery?.toLowerCase() ||
        item?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );

      if (exactMatch) {
        onLocationFound?.({
          lat: exactMatch?.lat,
          lng: exactMatch?.lng,
          name: exactMatch?.name,
          postcode: exactMatch?.postcode
        });
      } else {
        // For a real implementation, you would use a geocoding API here
        // Example: Nominatim API for OpenStreetMap
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&countrycodes=gb&q=${encodeURIComponent(searchQuery)}&limit=1`
        );
        
        if (!response?.ok) {
          throw new Error('Search service unavailable');
        }

        const data = await response?.json();
        
        if (data?.length > 0) {
          const result = data?.[0];
          onLocationFound?.({
            lat: parseFloat(result?.lat),
            lng: parseFloat(result?.lon),
            name: result?.display_name,
            postcode: searchQuery
          });
        } else {
          onSearchError?.(`No results found for "${searchQuery}"`);
        }
      }
    } catch (error) {
      console.error('Postcode search error:', error);
      onSearchError?.('Unable to search at this time. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, onLocationFound, onSearchError]);

  // Handle input focus
  const handleFocus = useCallback(() => {
    if (suggestions?.length > 0) {
      setShowSuggestions(true);
    }
  }, [suggestions]);

  // Handle input blur with delay to allow suggestion clicks
  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  }, []);

  return (
    <div className="relative w-full max-w-sm">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search postcode (e.g. M1 4ET)"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="pr-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            disabled={isLoading}
          />
          
          <button
            type="submit"
            disabled={isLoading || !searchQuery?.trim()}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Icon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <Icon name="Search" size={16} />
            )}
          </button>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions?.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
            {suggestions?.map((suggestion, index) => (
              <button
                key={`${suggestion?.postcode}-${index}`}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:bg-gray-50 focus:outline-none"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900">
                      {suggestion?.postcode}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {suggestion?.name}
                    </div>
                  </div>
                  <Icon name="MapPin" size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                </div>
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Search Tips */}
      <div className="mt-2 text-xs text-gray-500">
        Try: M1 4ET, B1 1AA, or city names like Manchester
      </div>
    </div>
  );
};

export default PostcodeSearch;