import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import QuickActionFloatingButton from '../../components/ui/QuickActionFloatingButton';
import MapContainer from './components/MapContainer';
import FilterPanel from './components/FilterPanel';
import LocationConfirmationModal from './components/LocationConfirmationModal';
import MapLegend from './components/MapLegend';
import QuotationSummaryCard from './components/QuotationSummaryCard';
import QuotationTable from './components/QuotationTable';
import ZipCodeSearch from './components/ZipCodeSearch';
import Icon from '../../components/AppIcon';

const MapView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State management
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [filteredQuotations, setFilteredQuotations] = useState(null);
  const [showTableView, setShowTableView] = useState(false);
  const [searchNotification, setSearchNotification] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    templateType: '',
    user: '',
    dateFrom: '',
    dateTo: ''
  });

  // Updated quotations data to match template structure with UK locations and pounds
  const quotations = [
    {
      serviceOrderQuotationId: "32000061311",
      serviceOrderQuotationDescription: "33kV Distribution Upgrade Manchester",
      createdOn: "20.07.2024 15:03:08",
      soldToParty: "Northern Power Networks Ltd Manchester M1 4ET",
      status: "Quote Sent to Customer",
      externalReference: "820004014",
      quotationValidFrom: "20.07.2024",
      quotationValidTo: "18.01.2025",
      location: { lat: 53.4808, lng: -2.2426, name: "Manchester City Centre" },
      id: "32000061311",
      customerName: "Northern Power Networks Ltd",
      customerEmail: "procurement@northernpower.co.uk",
      customerPhone: "+44 161 123 4567",
      templateType: "standard",
      createdBy: "James Wilson",
      createdAt: "2024-07-20T15:03:08Z",
      updatedAt: "2024-07-20T15:03:08Z",
      totalAmount: 28500,
      items: [
        { name: "500kVA Transformer", quantity: 2, unitPrice: 11400, total: 22800 },
        { name: "Installation Service", quantity: 1, unitPrice: 5700, total: 5700 }
      ]
    },
    {
      serviceOrderQuotationId: "3200056574",
      serviceOrderQuotationDescription: "Residential Panel Upgrade Birmingham",
      createdOn: "28.02.2024 10:50:14",
      soldToParty: "Midlands Electric Services Birmingham B1 1AA",
      status: "Quote Sent to Customer",
      externalReference: "820009914",
      quotationValidFrom: "27.02.2024",
      quotationValidTo: "25.08.2024",
      location: { lat: 52.4862, lng: -1.8904, name: "Birmingham Jewellery Quarter" },
      id: "3200056574",
      customerName: "Midlands Electric Services",
      customerEmail: "orders@midlandselectric.co.uk",
      customerPhone: "+44 121 234 5678",
      templateType: "standard",
      createdBy: "Sarah Thompson",
      createdAt: "2024-02-28T10:50:14Z",
      updatedAt: "2024-02-28T10:50:14Z",
      totalAmount: 7900,
      items: [
        { name: "Residential Panel Upgrade", quantity: 1, unitPrice: 5400, total: 5400 },
        { name: "Circuit Breakers", quantity: 10, unitPrice: 250, total: 2500 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059526",
      serviceOrderQuotationDescription: "LED Street Lighting Glasgow",
      createdOn: "28.02.2024 10:17:04",
      soldToParty: "Scottish Infrastructure Ltd Glasgow G1 2FF",
      status: "Quote Sent to Customer",
      externalReference: "820007005",
      quotationValidFrom: "28.02.2024",
      quotationValidTo: "26.08.2024",
      location: { lat: 55.8642, lng: -4.2518, name: "Glasgow City Centre" },
      id: "3200059526",
      customerName: "Scottish Infrastructure Ltd",
      customerEmail: "maintenance@scottishinfra.co.uk",
      customerPhone: "+44 141 345 6789",
      templateType: "standard",
      createdBy: "Michael MacDonald",
      createdAt: "2024-02-28T10:17:04Z",
      updatedAt: "2024-08-26T08:30:00Z",
      totalAmount: 17700,
      items: [
        { name: "LED Lighting System", quantity: 50, unitPrice: 285, total: 14250 },
        { name: "Smart Controls", quantity: 5, unitPrice: 690, total: 3450 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059531",
      serviceOrderQuotationDescription: "Industrial Motor Control London",
      createdOn: "29.02.2024 13:40:10",
      soldToParty: "Thames Valley Engineering London E14 5AB",
      status: "Quote Sent to Customer",
      externalReference: "820008650",
      quotationValidFrom: "29.02.2024",
      quotationValidTo: "27.08.2024",
      location: { lat: 51.5074, lng: -0.1278, name: "London Canary Wharf" },
      id: "3200059531",
      customerName: "Thames Valley Engineering",
      customerEmail: "facilities@thamesvalley.co.uk",
      customerPhone: "+44 20 456 7890",
      templateType: "standard",
      createdBy: "James Wilson",
      createdAt: "2024-02-29T13:40:10Z",
      updatedAt: "2024-02-29T13:40:10Z",
      totalAmount: 47500,
      items: [
        { name: "Industrial Motor Control", quantity: 3, unitPrice: 12670, total: 38000 },
        { name: "Safety Systems", quantity: 1, unitPrice: 9500, total: 9500 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059720",
      serviceOrderQuotationDescription: "Distribution Transformer Leeds",
      createdOn: "04.03.2024 12:32:55",
      soldToParty: "Yorkshire Power Solutions Leeds LS1 4DY",
      status: "Quote Sent to Customer",
      externalReference: "820006968",
      quotationValidFrom: "04.03.2024",
      quotationValidTo: "31.08.2024",
      location: { lat: 53.8008, lng: -1.5491, name: "Leeds City Centre" },
      id: "3200059720",
      customerName: "Yorkshire Power Solutions",
      customerEmail: "projects@yorkshirepower.co.uk",
      customerPhone: "+44 113 567 8901",
      templateType: "standard",
      createdBy: "Sarah Thompson",
      createdAt: "2024-03-04T12:32:55Z",
      updatedAt: "2024-08-31T10:45:00Z",
      totalAmount: 20300,
      items: [
        { name: "Distribution Transformer", quantity: 1, unitPrice: 15800, total: 15800 },
        { name: "Protective Equipment", quantity: 1, unitPrice: 4500, total: 4500 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059735",
      serviceOrderQuotationDescription: "Solar Panel Installation Bristol",
      createdOn: "05.03.2024 09:15:22",
      soldToParty: "Southwest Energy Systems Bristol BS1 6HL",
      status: "Quote Sent to Customer",
      externalReference: "820007890",
      quotationValidFrom: "05.03.2024",
      quotationValidTo: "02.09.2024",
      location: { lat: 51.4545, lng: -2.5879, name: "Bristol Harbourside" },
      id: "3200059735",
      customerName: "Southwest Energy Systems",
      customerEmail: "solar@swenergy.co.uk",
      customerPhone: "+44 117 678 9012",
      templateType: "standard",
      createdBy: "David Evans",
      createdAt: "2024-03-05T09:15:22Z",
      updatedAt: "2024-03-05T09:15:22Z",
      totalAmount: 15600,
      items: [
        { name: "Solar Panels", quantity: 20, unitPrice: 650, total: 13000 },
        { name: "Installation & Setup", quantity: 1, unitPrice: 2600, total: 2600 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059748",
      serviceOrderQuotationDescription: "Emergency Lighting Cardiff",
      createdOn: "06.03.2024 14:25:33",
      soldToParty: "Welsh Emergency Solutions Cardiff CF10 1EP",
      status: "Quote Sent to Customer",
      externalReference: "820008901",
      quotationValidFrom: "06.03.2024",
      quotationValidTo: "03.09.2024",
      location: { lat: 51.4816, lng: -3.1791, name: "Cardiff Bay" },
      id: "3200059748",
      customerName: "Welsh Emergency Solutions",
      customerEmail: "emergency@welshsolutions.co.uk",
      customerPhone: "+44 29 789 0123",
      templateType: "standard",
      createdBy: "Emma Davies",
      createdAt: "2024-03-06T14:25:33Z",
      updatedAt: "2024-03-06T14:25:33Z",
      totalAmount: 8900,
      items: [
        { name: "Emergency Light Units", quantity: 25, unitPrice: 280, total: 7000 },
        { name: "Battery Backup System", quantity: 1, unitPrice: 1900, total: 1900 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059752",
      serviceOrderQuotationDescription: "HVAC Control System Newcastle",
      createdOn: "07.03.2024 11:42:15",
      soldToParty: "Northern Climate Control Newcastle NE1 7RU",
      status: "Quote Sent to Customer",
      externalReference: "820009012",
      quotationValidFrom: "07.03.2024",
      quotationValidTo: "04.09.2024",
      location: { lat: 54.9783, lng: -1.6174, name: "Newcastle Quayside" },
      id: "3200059752",
      customerName: "Northern Climate Control",
      customerEmail: "controls@northernclimate.co.uk",
      customerPhone: "+44 191 890 1234",
      templateType: "standard",
      createdBy: "Robert Johnson",
      createdAt: "2024-03-07T11:42:15Z",
      updatedAt: "2024-03-07T11:42:15Z",
      totalAmount: 25400,
      items: [
        { name: "HVAC Control Unit", quantity: 1, unitPrice: 18500, total: 18500 },
        { name: "Sensor Network", quantity: 10, unitPrice: 690, total: 6900 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059766",
      serviceOrderQuotationDescription: "Fire Alarm System Liverpool",
      createdOn: "08.03.2024 16:30:45",
      soldToParty: "Merseyside Safety Systems Liverpool L1 8JQ",
      status: "Quote Sent to Customer",
      externalReference: "820010123",
      quotationValidFrom: "08.03.2024",
      quotationValidTo: "05.09.2024",
      location: { lat: 53.4084, lng: -2.9916, name: "Liverpool Albert Dock" },
      id: "3200059766",
      customerName: "Merseyside Safety Systems",
      customerEmail: "safety@merseysafety.co.uk",
      customerPhone: "+44 151 901 2345",
      templateType: "standard",
      createdBy: "Lisa Brown",
      createdAt: "2024-03-08T16:30:45Z",
      updatedAt: "2024-03-08T16:30:45Z",
      totalAmount: 12800,
      items: [
        { name: "Fire Alarm Panel", quantity: 1, unitPrice: 4500, total: 4500 },
        { name: "Smoke Detectors", quantity: 30, unitPrice: 195, total: 5850 },
        { name: "Installation Service", quantity: 1, unitPrice: 2450, total: 2450 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059771",
      serviceOrderQuotationDescription: "Wind Turbine Maintenance Edinburgh",
      createdOn: "09.03.2024 08:20:18",
      soldToParty: "Highland Renewables Edinburgh EH1 1YZ",
      status: "Quote Sent to Customer",
      externalReference: "820011234",
      quotationValidFrom: "09.03.2024",
      quotationValidTo: "06.09.2024",
      location: { lat: 55.9533, lng: -3.1883, name: "Edinburgh Castle Hill" },
      id: "3200059771",
      customerName: "Highland Renewables",
      customerEmail: "wind@highlandrenew.co.uk",
      customerPhone: "+44 131 012 3456",
      templateType: "standard",
      createdBy: "Andrew Stewart",
      createdAt: "2024-03-09T08:20:18Z",
      updatedAt: "2024-03-09T08:20:18Z",
      totalAmount: 35600,
      items: [
        { name: "Turbine Blade Inspection", quantity: 3, unitPrice: 8500, total: 25500 },
        { name: "Gearbox Service", quantity: 1, unitPrice: 10100, total: 10100 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059785",
      serviceOrderQuotationDescription: "Data Centre Cooling Sheffield",
      createdOn: "10.03.2024 13:55:30",
      soldToParty: "Yorkshire Data Solutions Sheffield S1 2HE",
      status: "Quote Sent to Customer",
      externalReference: "820012345",
      quotationValidFrom: "10.03.2024",
      quotationValidTo: "07.09.2024",
      location: { lat: 53.3811, lng: -1.4701, name: "Sheffield City Centre" },
      id: "3200059785",
      customerName: "Yorkshire Data Solutions",
      customerEmail: "cooling@yorkshiredata.co.uk",
      customerPhone: "+44 114 123 4567",
      templateType: "standard",
      createdBy: "Helen Clark",
      createdAt: "2024-03-10T13:55:30Z",
      updatedAt: "2024-03-10T13:55:30Z",
      totalAmount: 42300,
      items: [
        { name: "Precision Cooling Unit", quantity: 2, unitPrice: 16800, total: 33600 },
        { name: "Control System", quantity: 1, unitPrice: 8700, total: 8700 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059799",
      serviceOrderQuotationDescription: "Electric Vehicle Charging Plymouth",
      createdOn: "11.03.2024 10:40:12",
      soldToParty: "Southwest Mobility Plymouth PL1 2AB",
      status: "Quote Sent to Customer",
      externalReference: "820013456",
      quotationValidFrom: "11.03.2024",
      quotationValidTo: "08.09.2024",
      location: { lat: 50.3755, lng: -4.1427, name: "Plymouth Barbican" },
      id: "3200059799",
      customerName: "Southwest Mobility",
      customerEmail: "charging@swmobility.co.uk",
      customerPhone: "+44 1752 234 5678",
      templateType: "automotive",
      createdBy: "Mark Taylor",
      createdAt: "2024-03-11T10:40:12Z",
      updatedAt: "2024-03-11T10:40:12Z",
      totalAmount: 18900,
      items: [
        { name: "EV Charging Stations", quantity: 5, unitPrice: 3200, total: 16000 },
        { name: "Installation & Setup", quantity: 1, unitPrice: 2900, total: 2900 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059803",
      serviceOrderQuotationDescription: "Hospital Backup Power Nottingham",
      createdOn: "12.03.2024 15:20:55",
      soldToParty: "East Midlands Healthcare Nottingham NG1 5DT",
      status: "Quote Sent to Customer",
      externalReference: "820014567",
      quotationValidFrom: "12.03.2024",
      quotationValidTo: "09.09.2024",
      location: { lat: 52.9548, lng: -1.1581, name: "Nottingham Market Square" },
      id: "3200059803",
      customerName: "East Midlands Healthcare",
      customerEmail: "power@emhealthcare.co.uk",
      customerPhone: "+44 115 345 6789",
      templateType: "healthcare",
      createdBy: "Jennifer White",
      createdAt: "2024-03-12T15:20:55Z",
      updatedAt: "2024-03-12T15:20:55Z",
      totalAmount: 65400,
      items: [
        { name: "Emergency Generator", quantity: 1, unitPrice: 45000, total: 45000 },
        { name: "UPS System", quantity: 2, unitPrice: 8500, total: 17000 },
        { name: "Installation Service", quantity: 1, unitPrice: 3400, total: 3400 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059817",
      serviceOrderQuotationDescription: "Smart Grid Integration Bath",
      createdOn: "13.03.2024 09:10:28",
      soldToParty: "Avon Energy Networks Bath BA1 1LN",
      status: "Quote Sent to Customer",
      externalReference: "820015678",
      quotationValidFrom: "13.03.2024",
      quotationValidTo: "10.09.2024",
      location: { lat: 51.3758, lng: -2.3599, name: "Bath Abbey" },
      id: "3200059817",
      customerName: "Avon Energy Networks",
      customerEmail: "smartgrid@avonenergy.co.uk",
      customerPhone: "+44 1225 456 7890",
      templateType: "smart_grid",
      createdBy: "Paul Wilson",
      createdAt: "2024-03-13T09:10:28Z",
      updatedAt: "2024-03-13T09:10:28Z",
      totalAmount: 38700,
      items: [
        { name: "Smart Meters", quantity: 50, unitPrice: 420, total: 21000 },
        { name: "Communication Gateway", quantity: 5, unitPrice: 2800, total: 14000 },
        { name: "Software License", quantity: 1, unitPrice: 3700, total: 3700 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059821",
      serviceOrderQuotationDescription: "Marine Power Systems Portsmouth",
      createdOn: "14.03.2024 12:45:40",
      soldToParty: "South Coast Marine Portsmouth PO1 3AX",
      status: "Quote Sent to Customer",
      externalReference: "820016789",
      quotationValidFrom: "14.03.2024",
      quotationValidTo: "11.09.2024",
      location: { lat: 50.8198, lng: -1.0880, name: "Portsmouth Historic Dockyard" },
      id: "3200059821",
      customerName: "South Coast Marine",
      customerEmail: "marine@southcoastmarine.co.uk",
      customerPhone: "+44 23 567 8901",
      templateType: "marine",
      createdBy: "Simon Roberts",
      createdAt: "2024-03-14T12:45:40Z",
      updatedAt: "2024-03-14T12:45:40Z",
      totalAmount: 29500,
      items: [
        { name: "Marine Power Unit", quantity: 2, unitPrice: 12000, total: 24000 },
        { name: "Waterproof Control Panel", quantity: 1, unitPrice: 5500, total: 5500 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059835",
      serviceOrderQuotationDescription: "Railway Signal System Preston",
      createdOn: "15.03.2024 14:30:15",
      soldToParty: "Northwest Rail Systems Preston PR1 2HE",
      status: "Quote Sent to Customer",
      externalReference: "820017890",
      quotationValidFrom: "15.03.2024",
      quotationValidTo: "12.09.2024",
      location: { lat: 53.7632, lng: -2.7031, name: "Preston Railway Station" },
      id: "3200059835",
      customerName: "Northwest Rail Systems",
      customerEmail: "signals@nwrail.co.uk",
      customerPhone: "+44 1772 678 9012",
      templateType: "transport",
      createdBy: "Rachel Green",
      createdAt: "2024-03-15T14:30:15Z",
      updatedAt: "2024-03-15T14:30:15Z",
      totalAmount: 54200,
      items: [
        { name: "Signal Control Unit", quantity: 4, unitPrice: 9800, total: 39200 },
        { name: "Track Sensors", quantity: 10, unitPrice: 1200, total: 12000 },
        { name: "Installation Service", quantity: 1, unitPrice: 3000, total: 3000 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059849",
      serviceOrderQuotationDescription: "School Lighting Upgrade Canterbury",
      createdOn: "16.03.2024 11:15:50",
      soldToParty: "Kent Educational Services Canterbury CT1 2JD",
      status: "Quote Sent to Customer",
      externalReference: "820018901",
      quotationValidFrom: "16.03.2024",
      quotationValidTo: "13.09.2024",
      location: { lat: 51.2802, lng: 1.0789, name: "Canterbury Cathedral" },
      id: "3200059849",
      customerName: "Kent Educational Services",
      customerEmail: "lighting@kenteducation.co.uk",
      customerPhone: "+44 1227 789 0123",
      templateType: "lighting",
      createdBy: "Thomas Miller",
      createdAt: "2024-03-16T11:15:50Z",
      updatedAt: "2024-03-16T11:15:50Z",
      totalAmount: 13400,
      items: [
        { name: "LED Classroom Lights", quantity: 40, unitPrice: 250, total: 10000 },
        { name: "Motion Sensors", quantity: 20, unitPrice: 120, total: 2400 },
        { name: "Installation Service", quantity: 1, unitPrice: 1000, total: 1000 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059853",
      serviceOrderQuotationDescription: "Warehouse Automation Oxford",
      createdOn: "17.03.2024 16:25:35",
      soldToParty: "Thames Valley Logistics Oxford OX1 1HP",
      status: "Quote Sent to Customer",
      externalReference: "820019012",
      quotationValidFrom: "17.03.2024",
      quotationValidTo: "14.09.2024",
      location: { lat: 51.752, lng: -1.2577, name: "Oxford Carfax Tower" },
      id: "3200059853",
      customerName: "Thames Valley Logistics",
      customerEmail: "automation@tvlogistics.co.uk",
      customerPhone: "+44 1865 890 1234",
      templateType: "automation",
      createdBy: "Amy Watson",
      createdAt: "2024-03-17T16:25:35Z",
      updatedAt: "2024-03-17T16:25:35Z",
      totalAmount: 78500,
      items: [
        { name: "Automated Conveyor System", quantity: 1, unitPrice: 62000, total: 62000 },
        { name: "Control Software", quantity: 1, unitPrice: 12500, total: 12500 },
        { name: "Installation & Training", quantity: 1, unitPrice: 4000, total: 4000 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059867",
      serviceOrderQuotationDescription: "Sports Stadium Lighting Coventry",
      createdOn: "18.03.2024 13:50:20",
      soldToParty: "Midlands Sports Facilities Coventry CV1 5FB",
      status: "Quote Sent to Customer",
      externalReference: "820020123",
      quotationValidFrom: "18.03.2024",
      quotationValidTo: "15.09.2024",
      location: { lat: 52.4068, lng: -1.5197, name: "Coventry Cathedral" },
      id: "3200059867",
      customerName: "Midlands Sports Facilities",
      customerEmail: "stadium@midlandssports.co.uk",
      customerPhone: "+44 24 901 2345",
      templateType: "lighting",
      createdBy: "Kevin Jones",
      createdAt: "2024-03-18T13:50:20Z",
      updatedAt: "2024-03-18T13:50:20Z",
      totalAmount: 45800,
      items: [
        { name: "Stadium Floodlights", quantity: 8, unitPrice: 4500, total: 36000 },
        { name: "Control System", quantity: 1, unitPrice: 7800, total: 7800 },
        { name: "Installation Service", quantity: 1, unitPrice: 2000, total: 2000 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059871",
      serviceOrderQuotationDescription: "Hotel HVAC System Brighton",
      createdOn: "19.03.2024 10:35:45",
      soldToParty: "Southeast Hospitality Brighton BN1 1UB",
      status: "Quote Sent to Customer",
      externalReference: "820021234",
      quotationValidFrom: "19.03.2024",
      quotationValidTo: "16.09.2024",
      location: { lat: 50.8225, lng: -0.1372, name: "Brighton Pier" },
      id: "3200059871",
      customerName: "Southeast Hospitality",
      customerEmail: "hvac@southeasthospitality.co.uk",
      customerPhone: "+44 1273 012 3456",
      templateType: "hvac",
      createdBy: "Laura Davis",
      createdAt: "2024-03-19T10:35:45Z",
      updatedAt: "2024-03-19T10:35:45Z",
      totalAmount: 32600,
      items: [
        { name: "Central HVAC Unit", quantity: 1, unitPrice: 24000, total: 24000 },
        { name: "Zone Control System", quantity: 5, unitPrice: 1200, total: 6000 },
        { name: "Installation Service", quantity: 1, unitPrice: 2600, total: 2600 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059885",
      serviceOrderQuotationDescription: "Factory Automation Hull",
      createdOn: "20.03.2024 15:40:10",
      soldToParty: "Humberside Manufacturing Hull HU1 3DZ",
      status: "Quote Sent to Customer",
      externalReference: "820022345",
      quotationValidFrom: "20.03.2024",
      quotationValidTo: "17.09.2024",
      location: { lat: 53.7457, lng: -0.3367, name: "Hull Maritime Museum" },
      id: "3200059885",
      customerName: "Humberside Manufacturing",
      customerEmail: "automation@humbersidemanuf.co.uk",
      customerPhone: "+44 1482 123 4567",
      templateType: "automation",
      createdBy: "Peter Thompson",
      createdAt: "2024-03-20T15:40:10Z",
      updatedAt: "2024-03-20T15:40:10Z",
      totalAmount: 56700,
      items: [
        { name: "Robotic Assembly Line", quantity: 1, unitPrice: 45000, total: 45000 },
        { name: "Safety Systems", quantity: 1, unitPrice: 8700, total: 8700 },
        { name: "Programming Service", quantity: 1, unitPrice: 3000, total: 3000 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059899",
      serviceOrderQuotationDescription: "Airport Runway Lighting Luton",
      createdOn: "21.03.2024 09:25:55",
      soldToParty: "Southeast Aviation Services Luton LU2 9LY",
      status: "Quote Sent to Customer",
      externalReference: "820023456",
      quotationValidFrom: "21.03.2024",
      quotationValidTo: "18.09.2024",
      location: { lat: 51.8747, lng: -0.3683, name: "Luton Airport" },
      id: "3200059899",
      customerName: "Southeast Aviation Services",
      customerEmail: "runway@southeastaviation.co.uk",
      customerPhone: "+44 1582 234 5678",
      templateType: "aviation",
      createdBy: "Michelle Wilson",
      createdAt: "2024-03-21T09:25:55Z",
      updatedAt: "2024-03-21T09:25:55Z",
      totalAmount: 89200,
      items: [
        { name: "Runway LED System", quantity: 100, unitPrice: 680, total: 68000 },
        { name: "Control Tower Interface", quantity: 1, unitPrice: 15200, total: 15200 },
        { name: "Installation Service", quantity: 1, unitPrice: 6000, total: 6000 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059903",
      serviceOrderQuotationDescription: "Shopping Centre Security Cambridge",
      createdOn: "22.03.2024 14:15:30",
      soldToParty: "East Anglia Security Systems Cambridge CB2 1TN",
      status: "Quote Sent to Customer",
      externalReference: "820024567",
      quotationValidFrom: "22.03.2024",
      quotationValidTo: "19.09.2024",
      location: { lat: 52.2053, lng: 0.1218, name: "Cambridge King\'s College" },
      id: "3200059903",
      customerName: "East Anglia Security Systems",
      customerEmail: "security@eastsecurity.co.uk",
      customerPhone: "+44 1223 345 6789",
      templateType: "security",
      createdBy: "Daniel Brown",
      createdAt: "2024-03-22T14:15:30Z",
      updatedAt: "2024-03-22T14:15:30Z",
      totalAmount: 24800,
      items: [
        { name: "CCTV System", quantity: 20, unitPrice: 850, total: 17000 },
        { name: "Access Control", quantity: 10, unitPrice: 480, total: 4800 },
        { name: "Installation Service", quantity: 1, unitPrice: 3000, total: 3000 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059917",
      serviceOrderQuotationDescription: "Power Plant Maintenance Blackpool",
      createdOn: "23.03.2024 11:30:45",
      soldToParty: "Northwest Power Generation Blackpool FY1 4BL",
      status: "Quote Sent to Customer",
      externalReference: "820025678",
      quotationValidFrom: "23.03.2024",
      quotationValidTo: "20.09.2024",
      location: { lat: 53.8175, lng: -3.0357, name: "Blackpool Tower" },
      id: "3200059917",
      customerName: "Northwest Power Generation",
      customerEmail: "maintenance@nwpower.co.uk",
      customerPhone: "+44 1253 456 7890",
      templateType: "power_generation",
      createdBy: "Sarah Johnson",
      createdAt: "2024-03-23T11:30:45Z",
      updatedAt: "2024-03-23T11:30:45Z",
      totalAmount: 125600,
      items: [
        { name: "Turbine Overhaul", quantity: 2, unitPrice: 45000, total: 90000 },
        { name: "Control System Update", quantity: 1, unitPrice: 28600, total: 28600 },
        { name: "Testing & Commissioning", quantity: 1, unitPrice: 7000, total: 7000 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059921",
      serviceOrderQuotationDescription: "Museum Climate Control York",
      createdOn: "24.03.2024 16:20:15",
      soldToParty: "Yorkshire Heritage Trust York YO1 7HH",
      status: "Quote Sent to Customer",
      externalReference: "820026789",
      quotationValidFrom: "24.03.2024",
      quotationValidTo: "21.09.2024",
      location: { lat: 53.9590, lng: -1.0815, name: "York Minster" },
      id: "3200059921",
      customerName: "Yorkshire Heritage Trust",
      customerEmail: "climate@yorkshireheritage.co.uk",
      customerPhone: "+44 1904 567 8901",
      templateType: "heritage",
      createdBy: "Elizabeth Taylor",
      createdAt: "2024-03-24T16:20:15Z",
      updatedAt: "2024-03-24T16:20:15Z",
      totalAmount: 18400,
      items: [
        { name: "Precision Climate Control", quantity: 1, unitPrice: 12800, total: 12800 },
        { name: "Humidity Sensors", quantity: 15, unitPrice: 280, total: 4200 },
        { name: "Installation Service", quantity: 1, unitPrice: 1400, total: 1400 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059935",
      serviceOrderQuotationDescription: "Bridge Lighting System Sunderland",
      createdOn: "25.03.2024 13:45:25",
      soldToParty: "Northeast Infrastructure Sunderland SR1 3EX",
      status: "Quote Sent to Customer",
      externalReference: "820027890",
      quotationValidFrom: "25.03.2024",
      quotationValidTo: "22.09.2024",
      location: { lat: 54.9069, lng: -1.3838, name: "Sunderland Marina" },
      id: "3200059935",
      customerName: "Northeast Infrastructure",
      customerEmail: "bridges@neinfra.co.uk",
      customerPhone: "+44 191 678 9012",
      templateType: "infrastructure",
      createdBy: "Christopher Wilson",
      createdAt: "2024-03-25T13:45:25Z",
      updatedAt: "2024-03-25T13:45:25Z",
      totalAmount: 34700,
      items: [
        { name: "LED Bridge Lighting", quantity: 200, unitPrice: 125, total: 25000 },
        { name: "Control System", quantity: 1, unitPrice: 6700, total: 6700 },
        { name: "Installation Service", quantity: 1, unitPrice: 3000, total: 3000 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059949",
      serviceOrderQuotationDescription: "Waste Treatment Plant Exeter",
      createdOn: "26.03.2024 10:10:40",
      soldToParty: "Southwest Environmental Exeter EX4 3LS",
      status: "Quote Sent to Customer",
      externalReference: "820028901",
      quotationValidFrom: "26.03.2024",
      quotationValidTo: "23.09.2024",
      location: { lat: 50.7236, lng: -3.5339, name: "Exeter Cathedral" },
      id: "3200059949",
      customerName: "Southwest Environmental",
      customerEmail: "treatment@swenvironmental.co.uk",
      customerPhone: "+44 1392 789 0123",
      templateType: "environmental",
      createdBy: "Rebecca Green",
      createdAt: "2024-03-26T10:10:40Z",
      updatedAt: "2024-03-26T10:10:40Z",
      totalAmount: 67300,
      items: [
        { name: "Treatment Control System", quantity: 1, unitPrice: 48000, total: 48000 },
        { name: "Monitoring Equipment", quantity: 10, unitPrice: 1200, total: 12000 },
        { name: "Installation & Setup", quantity: 1, unitPrice: 7300, total: 7300 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059953",
      serviceOrderQuotationDescription: "Theatre Stage Lighting Chester",
      createdOn: "27.03.2024 15:55:50",
      soldToParty: "Cheshire Arts Council Chester CH1 2HJ",
      status: "Quote Sent to Customer",
      externalReference: "820029012",
      quotationValidFrom: "27.03.2024",
      quotationValidTo: "24.09.2024",
      location: { lat: 53.1906, lng: -2.8906, name: "Chester Cathedral" },
      id: "3200059953",
      customerName: "Cheshire Arts Council",
      customerEmail: "lighting@cheshirearts.co.uk",
      customerPhone: "+44 1244 890 1234",
      templateType: "entertainment",
      createdBy: "Jonathan Miller",
      createdAt: "2024-03-27T15:55:50Z",
      updatedAt: "2024-03-27T15:55:50Z",
      totalAmount: 28900,
      items: [
        { name: "Stage LED System", quantity: 30, unitPrice: 650, total: 19500 },
        { name: "Dimmer Control", quantity: 1, unitPrice: 7400, total: 7400 },
        { name: "Installation Service", quantity: 1, unitPrice: 2000, total: 2000 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059967",
      serviceOrderQuotationDescription: "Data Centre UPS Lancaster",
      createdOn: "28.03.2024 12:40:35",
      soldToParty: "North Lancashire Tech Lancaster LA1 1RH",
      status: "Quote Sent to Customer",
      externalReference: "820030123",
      quotationValidFrom: "28.03.2024",
      quotationValidTo: "25.09.2024",
      location: { lat: 54.0465, lng: -2.8007, name: "Lancaster Castle" },
      id: "3200059967",
      customerName: "North Lancashire Tech",
      customerEmail: "power@northlancs.co.uk",
      customerPhone: "+44 1524 901 2345",
      templateType: "data_centre",
      createdBy: "Victoria Brown",
      createdAt: "2024-03-28T12:40:35Z",
      updatedAt: "2024-03-28T12:40:35Z",
      totalAmount: 52800,
      items: [
        { name: "UPS System 100kVA", quantity: 2, unitPrice: 18000, total: 36000 },
        { name: "Battery Bank", quantity: 1, unitPrice: 12800, total: 12800 },
        { name: "Installation Service", quantity: 1, unitPrice: 4000, total: 4000 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059971",
      serviceOrderQuotationDescription: "Golf Course Irrigation Bournemouth",
      createdOn: "29.03.2024 14:25:20",
      soldToParty: "South Coast Leisure Bournemouth BH1 1BB",
      status: "Quote Sent to Customer",
      externalReference: "820031234",
      quotationValidFrom: "29.03.2024",
      quotationValidTo: "26.09.2024",
      location: { lat: 50.7192, lng: -1.8808, name: "Bournemouth Pier" },
      id: "3200059971",
      customerName: "South Coast Leisure",
      customerEmail: "irrigation@southcoastleisure.co.uk",
      customerPhone: "+44 1202 012 3456",
      templateType: "irrigation",
      createdBy: "Alexander Wilson",
      createdAt: "2024-03-29T14:25:20Z",
      updatedAt: "2024-03-29T14:25:20Z",
      totalAmount: 41200,
      items: [
        { name: "Irrigation Control System", quantity: 1, unitPrice: 28000, total: 28000 },
        { name: "Water Management Sensors", quantity: 50, unitPrice: 180, total: 9000 },
        { name: "Installation Service", quantity: 1, unitPrice: 4200, total: 4200 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059985",
      serviceOrderQuotationDescription: "Prison Security System Gloucester",
      createdOn: "30.03.2024 11:50:15",
      soldToParty: "West England Corrections Gloucester GL1 1UB",
      status: "Quote Sent to Customer",
      externalReference: "820032345",
      quotationValidFrom: "30.03.2024",
      quotationValidTo: "27.09.2024",
      location: { lat: 51.8642, lng: -2.2381, name: "Gloucester Cathedral" },
      id: "3200059985",
      customerName: "West England Corrections",
      customerEmail: "security@wecorrections.co.uk",
      customerPhone: "+44 1452 123 4567",
      templateType: "security",
      createdBy: "Caroline Davis",
      createdAt: "2024-03-30T11:50:15Z",
      updatedAt: "2024-03-30T11:50:15Z",
      totalAmount: 94500,
      items: [
        { name: "Perimeter Security System", quantity: 1, unitPrice: 65000, total: 65000 },
        { name: "Access Control Upgrade", quantity: 20, unitPrice: 1200, total: 24000 },
        { name: "Installation & Training", quantity: 1, unitPrice: 5500, total: 5500 }
      ]
    },
    {
      serviceOrderQuotationId: "3200059999",
      serviceOrderQuotationDescription: "Wind Farm Connection Derby",
      createdOn: "31.03.2024 16:35:45",
      soldToParty: "East Midlands Renewables Derby DE1 1NJ",
      status: "Quote Sent to Customer",
      externalReference: "820033456",
      quotationValidFrom: "31.03.2024",
      quotationValidTo: "28.09.2024",
      location: { lat: 52.9225, lng: -1.4746, name: "Derby Cathedral" },
      id: "3200059999",
      customerName: "East Midlands Renewables",
      customerEmail: "windfarm@emrenewables.co.uk",
      customerPhone: "+44 1332 234 5678",
      templateType: "renewable",
      createdBy: "Matthew Thompson",
      createdAt: "2024-03-31T16:35:45Z",
      updatedAt: "2024-03-31T16:35:45Z",
      totalAmount: 156800,
      items: [
        { name: "Grid Connection Equipment", quantity: 1, unitPrice: 120000, total: 120000 },
        { name: "Substation Upgrade", quantity: 1, unitPrice: 28800, total: 28800 },
        { name: "Installation & Commissioning", quantity: 1, unitPrice: 8000, total: 8000 }
      ]
    },
    {
      serviceOrderQuotationId: "3200060003",
      serviceOrderQuotationDescription: "Hospital Emergency Power Dundee",
      createdOn: "01.04.2024 13:20:30",
      soldToParty: "Tayside Healthcare Systems Dundee DD1 4HN",
      status: "Quote Sent to Customer",
      externalReference: "820034567",
      quotationValidFrom: "01.04.2024",
      quotationValidTo: "29.09.2024",
      location: { lat: 56.462, lng: -2.9707, name: "Dundee City Centre" },
      id: "3200060003",
      customerName: "Tayside Healthcare Systems",
      customerEmail: "emergency@taysidehealth.co.uk",
      customerPhone: "+44 1382 345 6789",
      templateType: "healthcare",
      createdBy: "Sophie Wilson",
      createdAt: "2024-04-01T13:20:30Z",
      updatedAt: "2024-04-01T13:20:30Z",
      totalAmount: 73400,
      items: [
        { name: "Emergency Generator 250kW", quantity: 1, unitPrice: 52000, total: 52000 },
        { name: "Automatic Transfer Switch", quantity: 1, unitPrice: 15400, total: 15400 },
        { name: "Installation Service", quantity: 1, unitPrice: 6000, total: 6000 }
      ]
    },
    {
      serviceOrderQuotationId: "3200060017",
      serviceOrderQuotationDescription: "University Lab Power Warwick",
      createdOn: "02.04.2024 09:45:55",
      soldToParty: "Midlands University Services Warwick CV34 6DB",
      status: "Quote Sent to Customer",
      externalReference: "820035678",
      quotationValidFrom: "02.04.2024",
      quotationValidTo: "30.09.2024",
      location: { lat: 52.2819, lng: -1.5849, name: "Warwick Castle" },
      id: "3200060017",
      customerName: "Midlands University Services",
      customerEmail: "labs@midlandsuni.co.uk",
      customerPhone: "+44 1926 456 7890",
      templateType: "education",
      createdBy: "James Anderson",
      createdAt: "2024-04-02T09:45:55Z",
      updatedAt: "2024-04-02T09:45:55Z",
      totalAmount: 36900,
      items: [
        { name: "Lab Power Distribution", quantity: 5, unitPrice: 5800, total: 29000 },
        { name: "Emergency Shutdown System", quantity: 1, unitPrice: 5900, total: 5900 },
        { name: "Installation Service", quantity: 1, unitPrice: 2000, total: 2000 }
      ]
    },
    {
      serviceOrderQuotationId: "3200060021",
      serviceOrderQuotationDescription: "Retail Lighting System Reading",
      createdOn: "03.04.2024 12:30:40",
      soldToParty: "Thames Valley Retail Reading RG1 2DB",
      status: "Quote Sent to Customer",
      externalReference: "820036789",
      quotationValidFrom: "03.04.2024",
      quotationValidTo: "01.10.2024",
      location: { lat: 51.4543, lng: -0.9781, name: "Reading Abbey" },
      id: "3200060021",
      customerName: "Thames Valley Retail",
      customerEmail: "lighting@tvretail.co.uk",
      customerPhone: "+44 118 567 8901",
      templateType: "retail",
      createdBy: "Emma Roberts",
      createdAt: "2024-04-03T12:30:40Z",
      updatedAt: "2024-04-03T12:30:40Z",
      totalAmount: 19600,
      items: [
        { name: "LED Track Lighting", quantity: 80, unitPrice: 185, total: 14800 },
        { name: "Dimming Control System", quantity: 1, unitPrice: 3800, total: 3800 },
        { name: "Installation Service", quantity: 1, unitPrice: 1000, total: 1000 }
      ]
    },
    {
      serviceOrderQuotationId: "3200060035",
      serviceOrderQuotationDescription: "Offshore Platform Power Aberdeen",
      createdOn: "04.04.2024 15:15:25",
      soldToParty: "North Sea Energy Aberdeen AB10 1XG",
      status: "Quote Sent to Customer",
      externalReference: "820037890",
      quotationValidFrom: "04.04.2024",
      quotationValidTo: "02.10.2024",
      location: { lat: 57.1497, lng: -2.0943, name: "Aberdeen Harbour" },
      id: "3200060035",
      customerName: "North Sea Energy",
      customerEmail: "offshore@northseaenergy.co.uk",
      customerPhone: "+44 1224 678 9012",
      templateType: "offshore",
      createdBy: "Robert MacLeod",
      createdAt: "2024-04-04T15:15:25Z",
      updatedAt: "2024-04-04T15:15:25Z",
      totalAmount: 189500,
      items: [
        { name: "Offshore Power Unit", quantity: 1, unitPrice: 145000, total: 145000 },
        { name: "Marine Protection System", quantity: 1, unitPrice: 32500, total: 32500 },
        { name: "Installation & Commissioning", quantity: 1, unitPrice: 12000, total: 12000 }
      ]
    },
    {
      serviceOrderQuotationId: "3200060049",
      serviceOrderQuotationDescription: "Shopping Mall HVAC Peterborough",
      createdOn: "05.04.2024 11:40:10",
      soldToParty: "East England Commercial Peterborough PE1 1LF",
      status: "Quote Sent to Customer",
      externalReference: "820038901",
      quotationValidFrom: "05.04.2024",
      quotationValidTo: "03.10.2024",
      location: { lat: 52.5695, lng: -0.2405, name: "Peterborough Cathedral" },
      id: "3200060049",
      customerName: "East England Commercial",
      customerEmail: "hvac@eastenglandcom.co.uk",
      customerPhone: "+44 1733 789 0123",
      templateType: "commercial",
      createdBy: "Helen Clarke",
      createdAt: "2024-04-05T11:40:10Z",
      updatedAt: "2024-04-05T11:40:10Z",
      totalAmount: 48200,
      items: [
        { name: "Central HVAC System", quantity: 1, unitPrice: 36000, total: 36000 },
        { name: "Zone Control Units", quantity: 8, unitPrice: 950, total: 7600 },
        { name: "Installation Service", quantity: 1, unitPrice: 4600, total: 4600 }
      ]
    },
    {
      serviceOrderQuotationId: "3200060053",
      serviceOrderQuotationDescription: "Marina Electrical Systems Falmouth",
      createdOn: "06.04.2024 14:55:45",
      soldToParty: "Cornwall Maritime Services Falmouth TR11 4AR",
      status: "Quote Sent to Customer",
      externalReference: "820039012",
      quotationValidFrom: "06.04.2024",
      quotationValidTo: "04.10.2024",
      location: { lat: 50.1531, lng: -5.0654, name: "Falmouth Harbour" },
      id: "3200060053",
      customerName: "Cornwall Maritime Services",
      customerEmail: "marina@cornwallmaritime.co.uk",
      customerPhone: "+44 1326 890 1234",
      templateType: "marine",
      createdBy: "David Cornwall",
      createdAt: "2024-04-06T14:55:45Z",
      updatedAt: "2024-04-06T14:55:45Z",
      totalAmount: 33700,
      items: [
        { name: "Marina Power Pedestals", quantity: 15, unitPrice: 1800, total: 27000 },
        { name: "Shore Power Connection", quantity: 1, unitPrice: 4700, total: 4700 },
        { name: "Installation Service", quantity: 1, unitPrice: 2000, total: 2000 }
      ]
    },
    {
      serviceOrderQuotationId: "3200060067",
      serviceOrderQuotationDescription: "Brewery Process Control Burton",
      createdOn: "07.04.2024 10:25:30",
      soldToParty: "Midlands Brewing Solutions Burton DE14 1JZ",
      status: "Quote Sent to Customer",
      externalReference: "820040123",
      quotationValidFrom: "07.04.2024",
      quotationValidTo: "05.10.2024",
      location: { lat: 52.8007, lng: -1.6489, name: "Burton upon Trent" },
      id: "3200060067",
      customerName: "Midlands Brewing Solutions",
      customerEmail: "process@midlandsbrewing.co.uk",
      customerPhone: "+44 1283 901 2345",
      templateType: "industrial",
      createdBy: "Timothy Wilson",
      createdAt: "2024-04-07T10:25:30Z",
      updatedAt: "2024-04-07T10:25:30Z",
      totalAmount: 58900,
      items: [
        { name: "Process Control System", quantity: 1, unitPrice: 42000, total: 42000 },
        { name: "Temperature Monitoring", quantity: 20, unitPrice: 650, total: 13000 },
        { name: "Installation & Programming", quantity: 1, unitPrice: 3900, total: 3900 }
      ]
    },
    {
      serviceOrderQuotationId: "3200060071",
      serviceOrderQuotationDescription: "Church Audio Visual System Winchester",
      createdOn: "08.04.2024 16:10:15",
      soldToParty: "Hampshire Heritage Trust Winchester SO23 9LS",
      status: "Quote Sent to Customer",
      externalReference: "820041234",
      quotationValidFrom: "08.04.2024",
      quotationValidTo: "06.10.2024",
      location: { lat: 51.0632, lng: -1.3080, name: "Winchester Cathedral" },
      id: "3200060071",
      customerName: "Hampshire Heritage Trust",
      customerEmail: "av@hampshireheritage.co.uk",
      customerPhone: "+44 1962 012 3456",
      templateType: "audio_visual",
      createdBy: "Margaret Thompson",
      createdAt: "2024-04-08T16:10:15Z",
      updatedAt: "2024-04-08T16:10:15Z",
      totalAmount: 22400,
      items: [
        { name: "Audio System", quantity: 1, unitPrice: 12000, total: 12000 },
        { name: "Visual Display System", quantity: 2, unitPrice: 3800, total: 7600 },
        { name: "Installation Service", quantity: 1, unitPrice: 2800, total: 2800 }
      ]
    },
    {
      serviceOrderQuotationId: "3200060085",
      serviceOrderQuotationDescription: "Fish Processing Plant Grimsby",
      createdOn: "09.04.2024 13:35:50",
      soldToParty: "Lincolnshire Food Processing Grimsby DN31 3EH",
      status: "Quote Sent to Customer",
      externalReference: "820042345",
      quotationValidFrom: "09.04.2024",
      quotationValidTo: "07.10.2024",
      location: { lat: 53.5668, lng: -0.0759, name: "Grimsby Docks" },
      id: "3200060085",
      customerName: "Lincolnshire Food Processing",
      customerEmail: "processing@lincsfood.co.uk",
      customerPhone: "+44 1472 123 4567",
      templateType: "food_processing",
      createdBy: "Andrew Fisher",
      createdAt: "2024-04-09T13:35:50Z",
      updatedAt: "2024-04-09T13:35:50Z",
      totalAmount: 44800,
      items: [
        { name: "Refrigeration Control", quantity: 1, unitPrice: 28000, total: 28000 },
        { name: "Processing Line Automation", quantity: 1, unitPrice: 12800, total: 12800 },
        { name: "Installation Service", quantity: 1, unitPrice: 4000, total: 4000 }
      ]
    },
    {
      serviceOrderQuotationId: "3200060099",
      serviceOrderQuotationDescription: "Racecourse Lighting Newmarket",
      createdOn: "10.04.2024 12:20:35",
      soldToParty: "Suffolk Racing Facilities Newmarket CB8 7DX",
      status: "Quote Sent to Customer",
      externalReference: "820043456",
      quotationValidFrom: "10.04.2024",
      quotationValidTo: "08.10.2024",
      location: { lat: 52.2434, lng: 0.4088, name: "Newmarket Racecourse" },
      id: "3200060099",
      customerName: "Suffolk Racing Facilities",
      customerEmail: "lighting@suffolkracing.co.uk",
      customerPhone: "+44 1638 234 5678",
      templateType: "sports",
      createdBy: "Charles Hamilton",
      createdAt: "2024-04-10T12:20:35Z",
      updatedAt: "2024-04-10T12:20:35Z",
      totalAmount: 67200,
      items: [
        { name: "Track Floodlighting", quantity: 12, unitPrice: 4500, total: 54000 },
        { name: "Control System", quantity: 1, unitPrice: 9200, total: 9200 },
        { name: "Installation Service", quantity: 1, unitPrice: 4000, total: 4000 }
      ]
    }
  ];

  // Ref to access map instance
  const mapRef = useRef(null);

  // Handle URL parameters for initial location and template duplication
  useEffect(() => {
    const lat = searchParams?.get('lat');
    const lng = searchParams?.get('lng');
    const duplicateTemplateId = searchParams?.get('duplicate_template');

    if (lat && lng) {
      const coordinates = {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      };
      setSelectedLocation(coordinates);
      setIsLocationModalOpen(true);
    }

    // Store template ID for duplication workflow if present
    if (duplicateTemplateId) {
      sessionStorage.setItem('duplicateTemplateId', duplicateTemplateId);
    }
  }, [searchParams]);

  // Handle zip code search location found
  const handleLocationFound = useCallback((location) => {
    if (mapRef?.current && location?.lat && location?.lng) {
      // Update map view to show the found location
      mapRef?.current?.setView([location?.lat, location?.lng], 12);
      
      // Set temporary marker for the searched location
      setSelectedLocation(location);
      
      // Show success notification
      setSearchNotification({
        type: 'success',
        message: `Found: ${location?.zipcode || location?.name}`
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setSearchNotification(null);
      }, 3000);
    } else {
      // Handle invalid location data
      setSearchNotification({
        type: 'error',
        message: 'Invalid location data received'
      });
      
      setTimeout(() => {
        setSearchNotification(null);
      }, 3000);
    }
  }, []);

  // Handle search error
  const handleSearchError = useCallback((errorMessage) => {
    setSearchNotification({
      type: 'error',
      message: errorMessage
    });
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setSearchNotification(null);
    }, 3000);
  }, []);

  // Filter quotations based on current filters
  useEffect(() => {
    let filtered = quotations;

    if (filters?.status) {
      filtered = filtered?.filter(q => q?.status === filters?.status);
    }

    if (filters?.templateType) {
      filtered = filtered?.filter(q => q?.templateType === filters?.templateType);
    }

    if (filters?.user) {
      filtered = filtered?.filter(q => q?.createdBy === filters?.user);
    }

    if (filters?.dateFrom) {
      filtered = filtered?.filter(q => new Date(q.createdAt) >= new Date(filters.dateFrom));
    }

    if (filters?.dateTo) {
      filtered = filtered?.filter(q => new Date(q.createdAt) <= new Date(filters.dateTo));
    }

    // Only set filtered quotations if filters are active
    const hasActiveFilters = Object.values(filters)?.some(value => value && value !== '');
    setFilteredQuotations(hasActiveFilters ? filtered : null);
  }, [filters]);

  // Handle toggle between map and table view
  const handleToggleView = useCallback(() => {
    setShowTableView(!showTableView);
  }, [showTableView]);

  // Handle map marker clicks
  const handleMarkerClick = useCallback((quotationId, action, location) => {
    if (action === 'view' && quotationId) {
      navigate(`/quotation-details?id=${quotationId}`);
    } else if (action === 'create' && location?.lat && location?.lng) {
      const params = new URLSearchParams();
      params?.set('lat', location?.lat?.toString());
      params?.set('lng', location?.lng?.toString());
      navigate(`/create-quotation?${params?.toString()}`);
    }
  }, [navigate]);

  // Handle map clicks for location selection
  const handleMapClick = useCallback((location) => {
    setSelectedLocation(location);
    setIsLocationModalOpen(true);
  }, []);

  // Handle location confirmation
  const handleLocationConfirm = useCallback((location) => {
    setIsLocationModalOpen(false);
    setSelectedLocation(null);

    if (location?.lat && location?.lng) {
      const params = new URLSearchParams();
      params?.set('lat', location?.lat?.toString());
      params?.set('lng', location?.lng?.toString());
      
      // Check if this is part of a template duplication workflow
      const duplicateTemplateId = sessionStorage.getItem('duplicateTemplateId');
      if (duplicateTemplateId) {
        params?.set('duplicate_template', duplicateTemplateId);
      // Clear from session storage after use
        sessionStorage.removeItem('duplicateTemplateId');
      }
      
      navigate(`/create-quotation?${params?.toString()}`);
    }
  }, [navigate]);

  // Handle location modal cancel
  const handleLocationCancel = useCallback(() => {
    setIsLocationModalOpen(false);
    setSelectedLocation(null);
  }, []);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    setFilters({
      status: '',
      templateType: '',
      user: '',
      dateFrom: '',
      dateTo: ''
    });
  }, []);

  // Handle create quotation from summary card
  const handleCreateQuotation = useCallback(() => {
    navigate('/create-quotation');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 h-screen">
        <div className="relative h-full">
          {/* View Toggle Button - Top right */}
          <div className="absolute top-4 right-4 z-50 pointer-events-auto">
            <button
              onClick={handleToggleView}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center space-x-2"
            >
              <Icon name={showTableView ? "Map" : "Table"} size={16} />
              <span className="text-sm font-medium">
                {showTableView ? "Map View" : "Table View"}
              </span>
            </button>
          </div>

          {showTableView ? (
            // Table View
            (<div className="h-full overflow-hidden">
              <QuotationTable
                quotations={filteredQuotations || quotations}
                onViewDetails={(id) => navigate(`/quotation-details?id=${id}`)}
              />
            </div>)
          ) : (
            // Map View (existing content)
            (<>
              {/* Map Container with ZipCodeSearch inside */}
              <MapContainer
                ref={mapRef}
                quotations={quotations}
                filteredQuotations={filteredQuotations}
                onMarkerClick={handleMarkerClick}
                onMapClick={handleMapClick}
                selectedLocation={selectedLocation}
              >
                {/* ZipCodeSearch as child of MapContainer */}
                <ZipCodeSearch 
                  onLocationFound={handleLocationFound}
                  onSearchError={handleSearchError}
                />
                
                {/* Search Notification */}
                {searchNotification && (
                  <div 
                    className={`mt-3 px-4 py-2 rounded-lg shadow-md flex items-center space-x-2 ${
                      searchNotification?.type === 'success' ?'bg-green-100 border border-green-200 text-green-800' :'bg-red-100 border border-red-200 text-red-800'
                    }`}
                  >
                    <Icon 
                      name={searchNotification?.type === 'success' ? "CheckCircle" : "AlertCircle"} 
                      size={16} 
                    />
                    <span className="text-sm font-medium">
                      {searchNotification?.message}
                    </span>
                  </div>
                )}
              </MapContainer>
              {/* Filter Panel */}
              <FilterPanel
                isOpen={isFilterPanelOpen}
                onToggle={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                quotations={quotations}
              />
              {/* Quotation Summary Card - Desktop Only */}
              <div className="hidden lg:block">
                <QuotationSummaryCard
                  quotations={quotations}
                  filteredQuotations={filteredQuotations}
                  onCreateQuotation={handleCreateQuotation}
                />
              </div>
              {/* Map Legend - Desktop Only */}
              <div className="hidden md:block">
                <MapLegend
                  quotations={filteredQuotations || quotations}
                />
              </div>
              {/* Quick Action Floating Button - Mobile Only */}
              <QuickActionFloatingButton coordinates={selectedLocation} />
              {/* Location Confirmation Modal */}
              <LocationConfirmationModal
                isOpen={isLocationModalOpen}
                location={selectedLocation}
                onConfirm={handleLocationConfirm}
                onCancel={handleLocationCancel}
              />
            </>)
          )}
        </div>
      </main>
    </div>
  );
};

export default MapView;