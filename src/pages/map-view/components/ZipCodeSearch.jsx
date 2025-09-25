import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

// Main component
const ZipCodeSearch = ({ onLocationFound, onSearchError }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // UK Postcodes only - comprehensive list for UK client
  const samplePostalCodes = [
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
    { code: 'SW1W 0DT', lat: 51.4975, lng: -0.1357, name: 'London - Victoria', type: 'postcode' },
    { code: 'E1 6AN', lat: 51.5118, lng: -0.0755, name: 'London - Whitechapel', type: 'postcode' },
    { code: 'W2 1NY', lat: 51.5154, lng: -0.1755, name: 'London - Paddington', type: 'postcode' },
    { code: 'SW3 4SX', lat: 51.4925, lng: -0.1615, name: 'London - Chelsea', type: 'postcode' },
    { code: 'NW3 2QG', lat: 51.5486, lng: -0.1678, name: 'London - Hampstead', type: 'postcode' },

    // UK Postcodes - Other major cities
    { code: 'M1 4ET', lat: 53.4808, lng: -2.2426, name: 'Manchester - City Centre', type: 'postcode' },
    { code: 'M2 3WQ', lat: 53.4839, lng: -2.2446, name: 'Manchester - Northern Quarter', type: 'postcode' },
    { code: 'M3 4LZ', lat: 53.4794, lng: -2.2451, name: 'Manchester - Castlefield', type: 'postcode' },
    { code: 'B1 1AA', lat: 52.4862, lng: -1.8904, name: 'Birmingham - City Centre', type: 'postcode' },
    { code: 'B2 4QA', lat: 52.4796, lng: -1.9026, name: 'Birmingham - Jewellery Quarter', type: 'postcode' },
    { code: 'B3 1JJ', lat: 52.4862, lng: -1.8904, name: 'Birmingham - Digbeth', type: 'postcode' },
    { code: 'G1 2FF', lat: 55.8642, lng: -4.2518, name: 'Glasgow - City Centre', type: 'postcode' },
    { code: 'G2 3BZ', lat: 55.8611, lng: -4.2570, name: 'Glasgow - Merchant City', type: 'postcode' },
    { code: 'G3 7DA', lat: 55.8689, lng: -4.2827, name: 'Glasgow - Finnieston', type: 'postcode' },
    { code: 'LS1 4DY', lat: 53.8008, lng: -1.5491, name: 'Leeds - City Centre', type: 'postcode' },
    { code: 'LS2 7HZ', lat: 53.8008, lng: -1.5491, name: 'Leeds - University Area', type: 'postcode' },
    { code: 'LS3 1AB', lat: 53.8008, lng: -1.5491, name: 'Leeds - Burley', type: 'postcode' },
    { code: 'BS1 6HL', lat: 51.4545, lng: -2.5879, name: 'Bristol - Harbourside', type: 'postcode' },
    { code: 'BS2 0JA', lat: 51.4545, lng: -2.5879, name: 'Bristol - Old Market', type: 'postcode' },
    { code: 'BS3 4NA', lat: 51.4545, lng: -2.5879, name: 'Bristol - Southville', type: 'postcode' },
    { code: 'CF10 1EP', lat: 51.4816, lng: -3.1791, name: 'Cardiff - Bay', type: 'postcode' },
    { code: 'CF11 9AB', lat: 51.4816, lng: -3.1791, name: 'Cardiff - Canton', type: 'postcode' },
    { code: 'CF24 0DE', lat: 51.4816, lng: -3.1791, name: 'Cardiff - Roath', type: 'postcode' },
    { code: 'NE1 7RU', lat: 54.9783, lng: -1.6174, name: 'Newcastle - Quayside', type: 'postcode' },
    { code: 'NE2 1AB', lat: 54.9783, lng: -1.6174, name: 'Newcastle - Jesmond', type: 'postcode' },
    { code: 'NE4 5TG', lat: 54.9783, lng: -1.6174, name: 'Newcastle - Benwell', type: 'postcode' },
    { code: 'L1 8JQ', lat: 53.4084, lng: -2.9916, name: 'Liverpool - Albert Dock', type: 'postcode' },
    { code: 'L2 2DZ', lat: 53.4084, lng: -2.9916, name: 'Liverpool - Cavern Quarter', type: 'postcode' },
    { code: 'L3 4AA', lat: 53.4084, lng: -2.9916, name: 'Liverpool - Pier Head', type: 'postcode' },
    { code: 'EH1 1YZ', lat: 55.9533, lng: -3.1883, name: 'Edinburgh - Old Town', type: 'postcode' },
    { code: 'EH2 2BY', lat: 55.9533, lng: -3.1883, name: 'Edinburgh - New Town', type: 'postcode' },
    { code: 'EH3 6SS', lat: 55.9533, lng: -3.1883, name: 'Edinburgh - Stockbridge', type: 'postcode' },
    { code: 'OX1 1PT', lat: 51.7520, lng: -1.2577, name: 'Oxford - City Centre', type: 'postcode' },
    { code: 'OX2 6GG', lat: 51.7520, lng: -1.2577, name: 'Oxford - Jericho', type: 'postcode' },
    { code: 'OX4 1DA', lat: 51.7520, lng: -1.2577, name: 'Oxford - Cowley', type: 'postcode' },
    
    // Additional UK cities
    { code: 'CB1 1PT', lat: 52.2053, lng: 0.1218, name: 'Cambridge - City Centre', type: 'postcode' },
    { code: 'CB2 3QZ', lat: 52.2053, lng: 0.1218, name: 'Cambridge - University Area', type: 'postcode' },
    { code: 'CB4 0WS', lat: 52.2053, lng: 0.1218, name: 'Cambridge - Chesterton', type: 'postcode' },
    { code: 'BN1 1AL', lat: 50.8225, lng: -0.1372, name: 'Brighton - City Centre', type: 'postcode' },
    { code: 'BN2 1JJ', lat: 50.8225, lng: -0.1372, name: 'Brighton - Kemptown', type: 'postcode' },
    { code: 'BN3 1AN', lat: 50.8225, lng: -0.1372, name: 'Brighton - Hove', type: 'postcode' },
    { code: 'S1 2HE', lat: 53.3811, lng: -1.4701, name: 'Sheffield - City Centre', type: 'postcode' },
    { code: 'S2 4SU', lat: 53.3811, lng: -1.4701, name: 'Sheffield - Heeley', type: 'postcode' },
    { code: 'S10 2TN', lat: 53.3811, lng: -1.4701, name: 'Sheffield - Broomhill', type: 'postcode' },
    { code: 'NG1 5DT', lat: 52.9548, lng: -1.1581, name: 'Nottingham - City Centre', type: 'postcode' },
    { code: 'NG2 3AA', lat: 52.9548, lng: -1.1581, name: 'Nottingham - West Bridgford', type: 'postcode' },
    { code: 'NG7 2RD', lat: 52.9548, lng: -1.1581, name: 'Nottingham - Lenton', type: 'postcode' }
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
    setSearchQuery(suggestion?.postcode);
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
        const errorMessage = `Could not find location for postcode: ${searchQuery}`;
        onSearchError?.(errorMessage);
      }
    } catch (error) {
      console.error('Postal code search error:', error);
      const errorMessage = `Could not find location for postcode: ${searchQuery}`;
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
                        <span>{suggestion?.code}</span>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                          UK
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