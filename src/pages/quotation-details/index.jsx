import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import LocationBreadcrumb from '../../components/ui/LocationBreadcrumb';
import QuotationHeader from './components/QuotationHeader';
import QuotationDocument from './components/QuotationDocument';
import AdminApprovalPanel from './components/AdminApprovalPanel';
import QuotationMetadata from './components/QuotationMetadata';
import ActivityHistory from './components/ActivityHistory';

const QuotationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [quotation, setQuotation] = useState(null);
  const [userRole, setUserRole] = useState('User');
  const [loading, setLoading] = useState(true);

  // Mock quotation data
  const mockQuotation = {
    id: "6503098260/3500196138",
    objectId: "6503098260",
    postingDate: "24.09.2024",
    description: "UK Power Networks Connection Quotation",
    customerName: "Property Developer Ltd",
    siteAddress: "Elephant Road / London SE17 1AY",
    totalLoad: "150.0000000000",
    quotationStartDate: "24.09.2024 15:04:29",
    quotationEndDate: "24.10.2024 23:59:59",
    status: "submitted",
    createdAt: "2024-09-24T15:04:29Z",
    updatedAt: "2024-09-24T15:04:29Z",
    validUntil: "2024-10-24T23:59:59Z",
    customerEmail: "connections@propertydeveloper.com",
    customerPhone: "0208 123 4567",
    templateName: "UK Power Networks Connection Template",
    templateType: "ukpn",
    invoiceAddress: {
      companyName: "",
      contactName: "",
      address: "",
      telephone: "",
      email: ""
    },
    siteContact: {
      companyName: "",
      contactName: "",
      address: "",
      telephone: "",
      email: ""
    },
    acceptance: {
      acceptanceText: "I accept UK Power Networks\' Quote for carrying out the DNO Works in accordance with the option I have chosen overleaf.",
      termsText: "To accept the Quote, the signed Acceptance Form and payment in cleared funds must reach UK Power Networks by 5pm on 17 March 2025. Acceptance Forms and payments received after this date may be returned and you will need to request a new Quote.",
      signature: {
        signed: "",
        date: "",
        printName: "",
        agentActingOnBehalfOf: "",
        telephone: "",
        email: ""
      }
    },
    connectionOptions: {
      optionA: {
        description: "UK Power Networks carries out all of the regulation \"contestable\" and \"non-contestable\" work required for your connection",
        priceExclVat: 53043.95,
        priceInclVat: 63652.74,
        applicable: true
      },
      optionB: {
        description: "UK Power Networks carries out all the \"non-contestable\" work and the \"contestable closing point\". The ICP carries out all other requested \"contestable\" work",
        priceExclVat: 0,
        priceInclVat: 0,
        applicable: false
      },
      optionC: {
        description: "UK Power Networks carries out the \"non-contestable\" works only. The ICP carries out all of the works classified as \"contestable\"",
        priceExclVat: 5396.82,
        priceInclVat: 6476.18,
        applicable: true
      }
    },
    selectedOption: null,
    paymentMethod: null,
    returnAddress: {
      company: "UK Power Networks (Operations) Ltd",
      department: "ConnectionsFinance",
      address: "3rd Floor, Energy House, Hazelwick Avenue, Three Bridges, Crawley, RH10 1EX",
      email: "ConnectionAcceptance@ukpowernetworks.co.uk"
    },
    paymentDetails: {
      online: "Available via customer portal",
      phone: "0808 175 2600 / 0203 282 0610",
      cheque: "Payable to UK Power Networks",
      bacs: {
        account: "HSBC Bank Plc",
        sortCode: "40 05 30",
        accountNumber: "02302594",
        reference: "3500196138"
      }
    },
    location: {
      lat: 51.4944,
      lng: -0.0880,
      address: "Elephant Road, London SE17 1AY"
    },
    createdBy: {
      name: "Connection Team",
      role: "UKPN Representative",
      email: "connections@ukpowernetworks.co.uk"
    }
  };

  const mockActivityHistory = [
    {
      type: "created",
      description: "Connection quotation generated from UK Power Networks template",
      user: "Connection Team",
      userRole: "UKPN Representative",
      timestamp: "2024-09-24T15:04:29Z",
      comment: null
    },
    {
      type: "calculated",
      description: "Pricing options calculated based on connection requirements",
      user: "System",
      userRole: "Automated Process",
      timestamp: "2024-09-24T15:04:30Z",
      comment: "Option A and C available for this connection type"
    },
    {
      type: "submitted",
      description: "Quotation ready for customer selection",
      user: "Connection Team",
      userRole: "UKPN Representative",
      timestamp: "2024-09-24T15:04:29Z",
      comment: "Customer to select preferred option and payment method"
    }
  ];

  useEffect(() => {
    // Simulate loading quotation data
    const loadQuotation = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setQuotation(mockQuotation);
        
        // Mock user role - in real app, get from auth context
        const mockUserRole = Math.random() > 0.5 ? 'Admin' : 'User';
        setUserRole(mockUserRole);
      } catch (error) {
        console.error('Error loading quotation:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuotation();
  }, [id]);

  const handleBack = () => {
    // Navigate back to previous page or dashboard
    if (location?.state?.from) {
      navigate(location?.state?.from);
    } else {
      navigate('/dashboard');
    }
  };

  const handleEdit = () => {
    navigate(`/create-quotation?edit=${quotation?.id}`, {
      state: { quotation, returnTo: `/quotation-details/${quotation?.id}` }
    });
  };

  const handleDuplicate = () => {
    navigate('/create-quotation', {
      state: { 
        duplicateFrom: quotation?.id,
        templateStructure: {
          templateName: quotation?.templateName,
          templateType: quotation?.templateType,
          items: quotation?.items?.map(item => ({
            name: item?.name,
            description: item?.description,
            specifications: item?.specifications,
            quantity: 0,
            unitPrice: item?.unitPrice
          }))
        }
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleApprove = async (comment) => {
    // Mock approval action
    console.log('Approving quotation with comment:', comment);
    setQuotation(prev => ({
      ...prev,
      status: 'accepted',
      updatedAt: new Date()?.toISOString()
    }));
  };

  const handleReject = async (comment) => {
    // Mock rejection action
    console.log('Rejecting quotation with comment:', comment);
    setQuotation(prev => ({
      ...prev,
      status: 'rejected',
      updatedAt: new Date()?.toISOString()
    }));
  };

  const handleRequestChanges = async (comment) => {
    // Mock request changes action
    console.log('Requesting changes with comment:', comment);
    setQuotation(prev => ({
      ...prev,
      status: 'under_review',
      updatedAt: new Date()?.toISOString()
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading quotation details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-lg font-medium text-foreground mb-2">Quotation not found</p>
              <p className="text-muted-foreground mb-4">The requested quotation could not be loaded.</p>
              <button
                onClick={handleBack}
                className="text-primary hover:underline"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LocationBreadcrumb 
            coordinates={quotation?.location}
            locationName={quotation?.location?.address}
            onMapReturn={() => navigate('/map-view')}
          />

          <QuotationHeader
            quotation={quotation}
            userRole={userRole}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onPrint={handlePrint}
            onBack={handleBack}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <QuotationDocument quotation={quotation} />
              
              {userRole === 'Admin' && (
                <AdminApprovalPanel
                  quotation={quotation}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onRequestChanges={handleRequestChanges}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <QuotationMetadata quotation={quotation} />
              <ActivityHistory activities={mockActivityHistory} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationDetails;