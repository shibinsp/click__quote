import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

// Main component
const ZipCodeSearch = ({ onLocationFound, onSearchError }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Comprehensive postal codes with coordinates for demo purposes (US zip codes and UK postcodes)
  const samplePostalCodes = [
    // Major US cities and zip codes
    { code: '10001', lat: 40.7505, lng: -73.9934, name: 'New York, NY - Midtown', type: 'zipcode' },
    { code: '10002', lat: 40.7157, lng: -73.9860, name: 'New York, NY - Lower East Side', type: 'zipcode' },
    { code: '10003', lat: 40.7316, lng: -73.9890, name: 'New York, NY - East Village', type: 'zipcode' },
    { code: '90210', lat: 34.0901, lng: -118.4065, name: 'Beverly Hills, CA', type: 'zipcode' },
    { code: '90211', lat: 34.0736, lng: -118.4004, name: 'Beverly Hills, CA - South', type: 'zipcode' },
    { code: '90212', lat: 34.1030, lng: -118.4107, name: 'Beverly Hills, CA - North', type: 'zipcode' },
    { code: '60601', lat: 41.8827, lng: -87.6233, name: 'Chicago, IL - Loop', type: 'zipcode' },
    { code: '60602', lat: 41.8781, lng: -87.6298, name: 'Chicago, IL - Downtown', type: 'zipcode' },
    { code: '60603', lat: 41.8781, lng: -87.6298, name: 'Chicago, IL - Grant Park', type: 'zipcode' },

    // Florida
    { code: '33101', lat: 25.7617, lng: -80.1918, name: 'Miami, FL - Downtown', type: 'zipcode' },
    { code: '33102', lat: 25.7743, lng: -80.1937, name: 'Miami, FL - Midtown', type: 'zipcode' },
    { code: '33103', lat: 25.7907, lng: -80.1300, name: 'Miami, FL - Upper East Side', type: 'zipcode' },
    
    // Massachusetts
    { code: '02101', lat: 42.3601, lng: -71.0589, name: 'Boston, MA - Downtown', type: 'zipcode' },
    { code: '02102', lat: 42.3584, lng: -71.0598, name: 'Boston, MA - Financial District', type: 'zipcode' },
    { code: '02103', lat: 42.3584, lng: -71.0598, name: 'Boston, MA - North End', type: 'zipcode' },
    
    // Washington
    { code: '98101', lat: 47.6062, lng: -122.3321, name: 'Seattle, WA - Downtown', type: 'zipcode' },
    { code: '98102', lat: 47.6205, lng: -122.3212, name: 'Seattle, WA - Capitol Hill', type: 'zipcode' },
    { code: '98103', lat: 47.6694, lng: -122.3414, name: 'Seattle, WA - Fremont', type: 'zipcode' },

    // Texas
    { code: '75201', lat: 32.7767, lng: -96.7970, name: 'Dallas, TX - Downtown', type: 'zipcode' },
    { code: '75202', lat: 32.7831, lng: -96.8067, name: 'Dallas, TX - Arts District', type: 'zipcode' },
    { code: '75203', lat: 32.7668, lng: -96.8147, name: 'Dallas, TX - Oak Cliff', type: 'zipcode' },
    { code: '77001', lat: 29.7604, lng: -95.3698, name: 'Houston, TX - Downtown', type: 'zipcode' },
    { code: '77002', lat: 29.7633, lng: -95.3633, name: 'Houston, TX - Midtown', type: 'zipcode' },
    { code: '77003', lat: 29.7372, lng: -95.3414, name: 'Houston, TX - Third Ward', type: 'zipcode' },
    
    // Arizona
    { code: '85001', lat: 33.4484, lng: -112.0740, name: 'Phoenix, AZ - Downtown', type: 'zipcode' },
    { code: '85002', lat: 33.4734, lng: -112.0596, name: 'Phoenix, AZ - Midtown', type: 'zipcode' },
    { code: '85003', lat: 33.4255, lng: -112.0664, name: 'Phoenix, AZ - South Phoenix', type: 'zipcode' },

    // Georgia
    { code: '30301', lat: 33.7490, lng: -84.3880, name: 'Atlanta, GA - Downtown', type: 'zipcode' },
    { code: '30302', lat: 33.7537, lng: -84.3901, name: 'Atlanta, GA - Midtown', type: 'zipcode' },
    { code: '30303', lat: 33.7490, lng: -84.3880, name: 'Atlanta, GA - Capitol Hill', type: 'zipcode' },
    
    // Colorado
    { code: '80201', lat: 39.7392, lng: -104.9903, name: 'Denver, CO - Downtown', type: 'zipcode' },
    { code: '80202', lat: 39.7517, lng: -104.9903, name: 'Denver, CO - Capitol Hill', type: 'zipcode' },
    { code: '80203', lat: 39.7236, lng: -104.9542, name: 'Denver, CO - Glendale', type: 'zipcode' },

    // Pennsylvania
    { code: '19101', lat: 39.9526, lng: -75.1652, name: 'Philadelphia, PA - Center City', type: 'zipcode' },
    { code: '19102', lat: 39.9526, lng: -75.1652, name: 'Philadelphia, PA - Rittenhouse Square', type: 'zipcode' },
    { code: '19103', lat: 39.9526, lng: -75.1652, name: 'Philadelphia, PA - University City', type: 'zipcode' },
    
    // Washington DC
    { code: '20001', lat: 38.9072, lng: -77.0369, name: 'Washington, DC - Downtown', type: 'zipcode' },
    { code: '20002', lat: 38.9072, lng: -77.0369, name: 'Washington, DC - Capitol Hill', type: 'zipcode' },
    { code: '20003', lat: 38.8816, lng: -76.9947, name: 'Washington, DC - Navy Yard', type: 'zipcode' },

    // UK Postcodes - London
    { code: 'E17DB', lat: 51.5074, lng: -0.1278, name: 'London - City of London', type: 'postcode' },
    { code: 'SW1A 1AA', lat: 51.5014, lng: -0.1419, name: 'London - Buckingham Palace', type: 'postcode' },
    { code: 'W1A 0AX', lat: 51.5154, lng: -0.1447, name: 'London - Oxford Street', type: 'postcode' },
    { code: 'EC1A 1BB', lat: 51.5174, lng: -0.0967, name: 'London - Barbican', type: 'postcode' },
    { code: 'WC2N 5DU', lat: 51.5085, lng: -0.1257, name: 'London - Trafalgar Square', type: 'postcode' },
    { code: 'SE1 9GF', lat: 51.5045, lng: -0.0865, name: 'London - London Bridge', type: 'postcode' },
    { code: 'N1 9GU', lat: 51.5462, lng: -0.1059, name: 'London - Kings Cross', type: 'postcode' },
    { code: 'E14 5AB', lat: 51.5074, lng: -0.0278, name: 'London - Canary Wharf', type: 'postcode' },
    { code: 'SW7 2DD', lat: 51.4994, lng: -0.1746, name: 'London - South Kensington', type: 'postcode' },
    { code: 'NW1 6XE', lat: 51.5264, lng: -0.1381, name: 'London - Regent\'s Park', type: 'postcode' },

    // UK Postcodes - Other major cities
    { code: 'M1 4ET', lat: 53.4808, lng: -2.2426, name: 'Manchester - City Centre', type: 'postcode' },
    { code: 'B1 1AA', lat: 52.4862, lng: -1.8904, name: 'Birmingham - City Centre', type: 'postcode' },
    { code: 'G1 2FF', lat: 55.8642, lng: -4.2518, name: 'Glasgow - City Centre', type: 'postcode' },
    { code: 'LS1 4DY', lat: 53.8008, lng: -1.5491, name: 'Leeds - City Centre', type: 'postcode' },
    { code: 'BS1 6HL', lat: 51.4545, lng: -2.5879, name: 'Bristol - Harbourside', type: 'postcode' },
    { code: 'CF10 1EP', lat: 51.4816, lng: -3.1791, name: 'Cardiff - Bay', type: 'postcode' },
    { code: 'NE1 7RU', lat: 54.9783, lng: -1.6174, name: 'Newcastle - Quayside', type: 'postcode' },
    { code: 'L1 8JQ', lat: 53.4084, lng: -2.9916, name: 'Liverpool - Albert Dock', type: 'postcode' },
    { code: 'EH1 1YZ', lat: 55.9533, lng: -3.1883, name: 'Edinburgh - Old Town', type: 'postcode' },
    { code: 'OX1 1PT', lat: 51.7520, lng: -1.2577, name: 'Oxford - City Centre', type: 'postcode' }
  ];

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e?.target?.value || '';
    setSearchQuery(value);

    if (value?.length >= 2) {
      const filtered = samplePostalCodes?.filter(item =>
        item?.code?.toLowerCase()?.includes(value?.toLowerCase()) ||
        item?.name?.toLowerCase()?.includes(value?.toLowerCase())
      );
      setSuggestions(filtered?.slice(0, 8));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion?.zipcode);
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Trigger location found callback
    onLocationFound?.({
      lat: suggestion?.lat,
      lng: suggestion?.lng,
      code: suggestion?.code,
      type: suggestion?.type
    });
  };

  // Handle search submission
  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery?.trim()) return;

    setIsLoading(true);
    setShowSuggestions(false);

    try {
      // First check if it's an exact match in our sample data
      const exactMatch = samplePostalCodes?.find(item =>
        item?.code?.toLowerCase() === searchQuery?.toLowerCase() ||
        item?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );

      if (exactMatch) {
        onLocationFound?.({
          lat: exactMatch?.lat,
          lng: exactMatch?.lng,
          name: exactMatch?.name,
          code: exactMatch?.code,
          type: exactMatch?.type
        });
      } else {
        // Show error message for postal codes not found
        const errorMessage = `Could not find location for ${searchQuery?.includes(' ') || /[A-Za-z]/.test(searchQuery) ? 'postcode' : 'zip code'}: ${searchQuery}`;
        onSearchError?.(errorMessage);
      }
    } catch (error) {
      console.error('Postal code search error:', error);
      const errorMessage = `Could not find location for ${searchQuery?.includes(' ') || /[A-Za-z]/.test(searchQuery) ? 'postcode' : 'zip code'}: ${searchQuery}`;
      onSearchError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
            placeholder="Search zip code or postcode (e.g. 10001, E17DB)"
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
                        <span>{suggestion?.code}</span>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {suggestion?.type === 'postcode' ? 'UK' : 'US'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {suggestion?.name}
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
    </div>
  );
};

export default ZipCodeSearch;