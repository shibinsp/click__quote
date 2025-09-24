import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Icon from '../../../components/AppIcon';

// Fix for default markers in Leaflet
delete L?.Icon?.Default?.prototype?._getIconUrl;
L?.Icon?.Default?.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapContainer = forwardRef(({ 
  quotations, 
  onMarkerClick, 
  onMapClick, 
  selectedLocation,
  filteredQuotations 
}, ref) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polygonsRef = useRef([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [showMarkers, setShowMarkers] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [currentPolygon, setCurrentPolygon] = useState(null);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPoint, setDragStartPoint] = useState(null);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [polygonCenter, setPolygonCenter] = useState(null);

  // Expose map methods to parent component
  useImperativeHandle(ref, () => ({
    setView: (lat, lng, zoom = 12) => {
      if (mapInstanceRef?.current) {
        mapInstanceRef?.current?.setView([lat, lng], zoom);
      }
    },
    getMap: () => mapInstanceRef?.current,
    toggleDrawingMode: () => {
      const newDrawingMode = !isDrawingMode;
      setIsDrawingMode(newDrawingMode);
      
      // Disable/enable map dragging based on drawing mode
      if (mapInstanceRef?.current) {
        if (newDrawingMode) {
          mapInstanceRef.current.dragging.disable();
        } else {
          mapInstanceRef.current.dragging.enable();
        }
      }
    },
    clearPolygons: () => {
      polygonsRef.current.forEach(polygon => {
        mapInstanceRef?.current?.removeLayer(polygon);
      });
      polygonsRef.current = [];
      setShowMarkers(false);
    },
    showAllMarkers: () => setShowMarkers(true)
  }));

  // Initialize map
  useEffect(() => {
    if (!mapRef?.current || mapInstanceRef?.current) return;

    const map = L?.map(mapRef?.current, {
      center: [54.7023, -3.2765], // UK center coordinates
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      dragging: true,
      touchZoom: true,
      boxZoom: true,
      keyboard: true
    });

    // Add tile layer
    L?.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    })?.addTo(map);

    // Handle map clicks for location selection only (not for polygon drawing in drag mode)
    map?.on('click', (e) => {
      const { lat, lng } = e?.latlng;
      
      if (!isDrawingMode) {
        onMapClick({ lat, lng });
      }
    });

    // Handle mouse down for drag polygon drawing
    map?.on('mousedown', (e) => {
      if (isDrawingMode && !isDragging) {
        console.log('Starting drag polygon drawing');
        e.originalEvent.preventDefault();
        setIsDragging(true);
        setDragStartPoint([e.latlng.lat, e.latlng.lng]);
        setPolygonPoints([]);
        
        // Clear any existing temporary markers
        if (polygonsRef.current.tempMarkers) {
          polygonsRef.current.tempMarkers.forEach(marker => {
            mapInstanceRef?.current?.removeLayer(marker);
          });
          polygonsRef.current.tempMarkers = [];
        }
      }
    });

    // Handle mouse move for drag polygon drawing
    map?.on('mousemove', (e) => {
      if (isDrawingMode && isDragging && dragStartPoint) {
        const currentPoint = [e.latlng.lat, e.latlng.lng];
        
        // Create rectangle points from drag start to current position
        const rectPoints = [
          dragStartPoint,
          [dragStartPoint[0], currentPoint[1]],
          currentPoint,
          [currentPoint[0], dragStartPoint[1]],
          dragStartPoint
        ];
        
        setPolygonPoints(rectPoints);
        
        // Remove previous temporary polygon
        if (currentPolygon) {
          mapInstanceRef?.current?.removeLayer(currentPolygon);
        }
        
        // Create new temporary polygon
        const tempPolygon = L?.polygon(rectPoints, {
          color: '#3B82F6',
          fillColor: '#3B82F6',
          fillOpacity: 0.2,
          weight: 2,
          dashArray: '5, 5'
        });
        tempPolygon?.addTo(mapInstanceRef?.current);
        setCurrentPolygon(tempPolygon);
        
        // Update marker visibility in real-time during dragging
        updateMarkerVisibility(tempPolygon);
      }
    });

    // Handle mouse up to finish polygon
    map?.on('mouseup', (e) => {
      if (isDrawingMode && isDragging) {
        console.log('Finishing drag polygon drawing');
        setIsDragging(false);
        
        if (polygonPoints.length >= 3) {
          // Complete the polygon automatically
          completePolygon();
          // Prevent the click event from firing
          e.originalEvent.stopPropagation();
        }
      }
    });

    mapInstanceRef.current = map;
    setIsMapReady(true);

    return () => {
      if (mapInstanceRef?.current) {
        mapInstanceRef?.current?.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [onMapClick, isDrawingMode, polygonPoints, currentPolygon]);

  // Create custom marker icons based on quotation status
  const createMarkerIcon = (status, count = 1) => {
    const colors = {
      draft: '#64748B',
      submitted: '#0EA5E9',
      under_review: '#D97706',
      approved: '#059669',
      rejected: '#DC2626',
      accepted: '#059669'
    };

    const color = colors?.[status] || colors?.draft;
    
    return L?.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
        ">
          ${count > 1 ? count : ''}
        </div>
      `,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -15]
    });
  };

  // Complete polygon function for drag-based drawing
  const completePolygon = () => {
    if (polygonPoints.length >= 3 && currentPolygon) {
      // Update the polygon style to be permanent (solid instead of dashed)
      currentPolygon.setStyle({
        color: '#3B82F6',
        fillColor: '#3B82F6',
        fillOpacity: 0.2,
        weight: 2,
        dashArray: null // Remove dashed style
      });
      
      // Add the completed polygon to both state and ref arrays
      setPolygons(prev => [...prev, currentPolygon]);
      polygonsRef.current.push(currentPolygon);
      
      // Calculate polygon center for confirm button positioning
      const bounds = currentPolygon.getBounds();
      const center = bounds.getCenter();
      setPolygonCenter(center);
      
      // Show the confirm button
      setShowConfirmButton(true);
      
      // Keep markers visible after polygon completion
      setShowMarkers(true);
      updateMarkerVisibility();
      
      // Reset drawing state but keep the polygon visible
      setPolygonPoints([]);
      setCurrentPolygon(null); // This is OK now because we've added it to polygonsRef
      setDragStartPoint(null);
      setIsDrawingMode(false);
    }
  };

  // Handle confirm location
  const handleConfirmLocation = () => {
    if (polygonCenter) {
      onMapClick({ lat: polygonCenter.lat, lng: polygonCenter.lng });
      setShowConfirmButton(false);
      setPolygonCenter(null);
    }
  };

  // Handle cancel confirm
  const handleCancelConfirm = () => {
    setShowConfirmButton(false);
    setPolygonCenter(null);
  };

  // Get status color function
  const getStatusColor = (status) => {
    const colors = {
      draft: '#64748B',
      submitted: '#0EA5E9',
      under_review: '#D97706',
      approved: '#059669',
      rejected: '#DC2626',
      accepted: '#059669'
    };
    return colors?.[status] || colors?.draft;
  };

  // Point-in-polygon detection function
  const isPointInPolygon = (point, polygon) => {
    const x = point.lat;
    const y = point.lng;
    const vertices = polygon.getLatLngs()[0];
    
    let inside = false;
    for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      const xi = vertices[i].lat;
      const yi = vertices[i].lng;
      const xj = vertices[j].lat;
      const yj = vertices[j].lng;
      
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }
    return inside;
  };

  // Update marker visibility based on polygon(s)
  const updateMarkerVisibility = (tempPolygon = null) => {
    if (!mapInstanceRef?.current || !isMapReady) return;

    // Clear existing markers
    markersRef?.current?.forEach(marker => {
      mapInstanceRef?.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Show markers based on different conditions
    let shouldShowMarkers = false;
    
    // Always show markers during drawing mode with temporary polygon
    if (isDrawingMode && tempPolygon) {
      shouldShowMarkers = true;
    }
    // Show markers if showMarkers toggle is enabled
    else if (showMarkers) {
      shouldShowMarkers = true;
    }
    
    if (!shouldShowMarkers) return;

    // Group quotations by location
    const locationGroups = {};
    const quotationsToShow = filteredQuotations || quotations;

    quotationsToShow?.forEach(quotation => {
      if (quotation?.location && quotation?.location?.lat && quotation?.location?.lng) {
        // Check if marker should be visible
        let shouldShow = false;
        
        // If we're in drawing mode and have a temporary polygon, only show markers inside it
        if (isDrawingMode && tempPolygon) {
          shouldShow = isPointInPolygon(quotation.location, tempPolygon);
        } 
        // If we have completed polygons, only show markers inside at least one polygon
        else if (polygonsRef.current.length > 0) {
          shouldShow = polygonsRef.current.some(polygon => isPointInPolygon(quotation.location, polygon));
        }
        // If no polygons exist and showMarkers is true, show all markers
        else if (showMarkers) {
          shouldShow = true;
        }
        
        if (shouldShow) {
          const key = `${quotation?.location?.lat?.toFixed(6)},${quotation?.location?.lng?.toFixed(6)}`;
          if (!locationGroups?.[key]) {
            locationGroups[key] = {
              location: quotation?.location,
              quotations: []
            };
          }
          locationGroups?.[key]?.quotations?.push(quotation);
        }
      }
    });

    // Create markers for each location group
    Object.values(locationGroups)?.forEach(group => {
      const { location, quotations: groupQuotations } = group;
      const primaryStatus = groupQuotations?.[0]?.status;
      const count = groupQuotations?.length;

      const marker = L?.marker([location?.lat, location?.lng], {
        icon: createMarkerIcon(primaryStatus, count)
      });

      // Create popup content
      const popupContent = `
        <div style="min-width: 250px; max-width: 300px;">
          <div style="font-weight: bold; margin-bottom: 8px; color: #0F172A;">
            ${location?.name || 'Location'}
          </div>
          <div style="font-size: 12px; color: #64748B; margin-bottom: 12px; font-family: monospace;">
            ${location?.lat?.toFixed(6)}, ${location?.lng?.toFixed(6)}
          </div>
          <div style="max-height: 200px; overflow-y: auto;">
            ${groupQuotations?.map(q => `
              <div style="
                padding: 8px;
                border: 1px solid #E2E8F0;
                border-radius: 6px;
                margin-bottom: 6px;
                background: white;
                cursor: pointer;
              " onClick="window.handleQuotationClick('${q?.id}')">
                <div style="font-weight: 500; color: #0F172A;">${q?.customerName}</div>
                <div style="font-size: 12px; color: #64748B;">ID: ${q?.id}</div>
                <div style="
                  display: inline-block;
                  padding: 2px 6px;
                  border-radius: 12px;
                  font-size: 10px;
                  font-weight: 500;
                  text-transform: uppercase;
                  background: ${getStatusColor(q?.status)};
                  color: white;
                ">
                  ${q?.status?.replace('_', ' ')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      marker?.bindPopup(popupContent);
      marker?.addTo(mapInstanceRef?.current);
      markersRef?.current?.push(marker);
    });
  };

  // Update markers when quotations change
  useEffect(() => {
    updateMarkerVisibility();
  }, [quotations, filteredQuotations, onMarkerClick, isMapReady, showMarkers, polygonsRef.current]);

  // Set up global handlers for popup interactions
  useEffect(() => {
    window.handleQuotationClick = (quotationId) => {
      onMarkerClick(quotationId, 'view');
    };

    window.handleCreateQuotation = (lat, lng) => {
      onMarkerClick(null, 'create', { lat, lng });
    };
  }, [onMarkerClick]);

  // Handle selected location marker
  useEffect(() => {
    if (!mapInstanceRef?.current || !selectedLocation) return;

    const tempMarker = L?.marker([selectedLocation?.lat, selectedLocation?.lng], {
      icon: L?.divIcon({
        html: `
          <div style="
            background-color: #F97316;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s infinite;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background: white;
              border-radius: 50%;
            "></div>
          </div>
          <style>
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); }
            }
          </style>
        `,
        className: 'temp-marker',
        iconSize: [35, 35],
        iconAnchor: [17.5, 17.5]
      })
    });

    tempMarker?.addTo(mapInstanceRef?.current);

    return () => {
      if (mapInstanceRef?.current && tempMarker) {
        mapInstanceRef?.current?.removeLayer(tempMarker);
      }
    };
  }, [selectedLocation]);

  return (
    <div className="relative w-full h-full">
      {/* Drawing Mode Indicator */}
      {isDrawingMode && (
        <div className="absolute top-4 left-4 z-[1000] bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Edit" size={16} />
            <span className="text-sm font-medium">Drawing Mode Active</span>
          </div>
          <div className="text-xs mt-1 opacity-90">
            Click and drag to create rectangular polygon
          </div>
        </div>
      )}
      
      {/* Polygon Controls */}
      <div className="absolute top-4 right-96 z-[1100] flex flex-col space-y-2">
        <button
          onClick={() => {
            console.log('Draw Polygon button clicked');
            console.log('Current isDrawingMode:', isDrawingMode);
            console.log('Map instance available:', !!mapInstanceRef?.current);
            console.log('Leaflet L object available:', !!L);
            
            const newDrawingMode = !isDrawingMode;
            setIsDrawingMode(newDrawingMode);
            
            // Reset polygon state when starting new drawing
            if (newDrawingMode) {
              // Starting to draw - reset state but don't show all markers immediately
              setPolygonPoints([]);
              setCurrentPolygon(null);
              setIsDragging(false);
              setDragStartPoint(null);
              // Clear any temporary markers
              if (polygonsRef.current.tempMarkers) {
                polygonsRef.current.tempMarkers.forEach(marker => {
                  mapInstanceRef?.current?.removeLayer(marker);
                });
                polygonsRef.current.tempMarkers = [];
              }
            } else {
              // Cancel drawing - clean up any temporary elements
              if (currentPolygon) {
                mapInstanceRef?.current?.removeLayer(currentPolygon);
              }
              setPolygonPoints([]);
              setCurrentPolygon(null);
              setIsDragging(false);
              setDragStartPoint(null);
              if (polygonsRef.current.tempMarkers) {
                polygonsRef.current.tempMarkers.forEach(marker => {
                  mapInstanceRef?.current?.removeLayer(marker);
                });
                polygonsRef.current.tempMarkers = [];
              }
            }
          }}
          className={`px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors ${
            isDrawingMode 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isDrawingMode ? 'Cancel Drawing' : 'Draw Polygon'}
        </button>
        
        {(polygonsRef.current.length > 0 || polygons.length > 0) && (
          <button
            onClick={() => {
              // Clear polygons from the map
              polygonsRef.current.forEach(polygon => {
                mapInstanceRef?.current?.removeLayer(polygon);
              });
              polygons.forEach(polygon => {
                mapInstanceRef?.current?.removeLayer(polygon);
              });
              
              // Reset all polygon-related state
              polygonsRef.current = [];
              setPolygons([]);
              setCurrentPolygon(null);
              setPolygonPoints([]);
              setIsDragging(false);
              setDragStartPoint(null);
              setShowMarkers(false);
            }}
            className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg shadow-lg text-sm font-medium transition-colors"
          >
            Clear Polygons
          </button>
        )}
        
        {quotations?.length > 0 && (
          <button
            onClick={() => setShowMarkers(!showMarkers)}
            className={`px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors ${
              showMarkers 
                ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {showMarkers ? 'Hide All Markers' : 'Show All Markers'}
          </button>
        )}
      </div>
      
       
       {/* Confirm Location Button */}
       {showConfirmButton && polygonCenter && (
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1200] bg-white rounded-lg shadow-xl border border-gray-200 p-4">
           <div className="text-center">
             <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Location</h3>
             <p className="text-sm text-gray-600 mb-4">
               Create a quote for this polygon area?
             </p>
             <div className="flex space-x-3">
               <button
                 onClick={handleConfirmLocation}
                 className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
               >
                 Confirm & Create Quote
               </button>
               <button
                 onClick={handleCancelConfirm}
                 className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg text-sm font-medium transition-colors"
               >
                 Cancel
               </button>
             </div>
           </div>
         </div>
       )}
       
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: '400px' }}
      />
      
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Icon name="Loader2" size={20} className="animate-spin" />
            <span>Loading map...</span>
          </div>
        </div>
      )}
    </div>
  );
});

MapContainer.displayName = 'MapContainer';

export default MapContainer;