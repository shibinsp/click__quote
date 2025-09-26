import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const QuotationDocument = ({ quotation }) => {
  const [selectedOption, setSelectedOption] = useState(quotation?.selectedOption || null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(quotation?.paymentMethod || null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // New state for editable template sections
  const [invoiceAddress, setInvoiceAddress] = useState(quotation?.invoiceAddress || {
    companyName: "",
    contactName: "",
    address: "",
    telephone: "",
    email: ""
  });
  
  const [siteContact, setSiteContact] = useState(quotation?.siteContact || {
    companyName: "",
    contactName: "",
    address: "",
    telephone: "",
    email: ""
  });
  
  const [acceptance, setAcceptance] = useState(quotation?.acceptance || {
    acceptanceText: "I accept UK Power Networks' Quote for carrying out the DNO Works in accordance with the option I have chosen overleaf.",
    termsText: "To accept the Quote, the signed Acceptance Form and payment in cleared funds must reach UK Power Networks by 5pm on 17 March 2025. Acceptance Forms and payments received after this date may be returned and you will need to request a new Quote.",
    signature: {
      signed: "",
      date: "",
      printName: "",
      agentActingOnBehalfOf: "",
      telephone: "",
      email: ""
    }
  });
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    })?.format(amount);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleEditTemplate = () => {
    setIsEditMode(!isEditMode);
  };
  
  const handleSaveTemplate = () => {
    setIsEditMode(false);
    // Here you would save the template data to your backend
    console.log('Saving template data:', { invoiceAddress, siteContact, acceptance });
  };
  
  const updateInvoiceAddress = (field, value) => {
    setInvoiceAddress(prev => ({ ...prev, [field]: value }));
  };
  
  const updateSiteContact = (field, value) => {
    setSiteContact(prev => ({ ...prev, [field]: value }));
  };
  
  const updateAcceptanceSignature = (field, value) => {
    setAcceptance(prev => ({
      ...prev,
      signature: { ...prev?.signature, [field]: value }
    }));
  };
  
  const updateAcceptanceText = (field, value) => {
    setAcceptance(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      {/* Edit Template Button */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">UK Power Networks Quotation Template</h2>
        <div className="flex space-x-2">
          {isEditMode && (
            <button
              onClick={handleSaveTemplate}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <Icon name="Save" size={16} className="inline mr-1" />
              Save Template
            </button>
          )}
          <button
            onClick={handleEditTemplate}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              isEditMode 
                ? 'bg-gray-600 text-white hover:bg-gray-700' :'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Icon name={isEditMode ? "X" : "Edit"} size={16} className="inline mr-1" />
            {isEditMode ? 'Cancel Edit' : 'Edit Template'}
          </button>
        </div>
      </div>
      {/* UK Power Networks Header */}
      <div className="relative bg-white p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          {/* UK Power Networks Logo */}
          <img 
            src="/assets/images/image.png" 
            alt="UK Power Networks Logo" 
            className="w-20 h-20 object-contain bg-white border border-gray-300 rounded-lg p-1"
            onError={(e) => {
              console.log('Logo failed to load:', e.target.src);
              e.target.style.display = 'block';
              e.target.style.backgroundColor = '#f3f4f6';
              e.target.style.border = '2px dashed #d1d5db';
            }}
          />
          {/* Company Name and Title */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-red-600">UK Power Networks</h1>
            </div>
            <p className="text-gray-600 text-sm">Delivering your electricity</p>
            <h2 className="text-lg font-semibold text-gray-800 mt-2">UK Power Networks - Quotation Document</h2>
          </div>
          {/* Additional Brand Image */}
          <div className="flex-shrink-0">
            <img 
              src="/assets/images/image.png" 
              alt="Brand Image" 
              className="w-28 h-20 object-contain rounded-lg shadow-sm border border-gray-200 bg-white p-2"
              onError={(e) => {
                console.log('Brand image failed to load:', e.target.src);
                e.target.style.display = 'block';
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.border = '2px dashed #d1d5db';
              }}
            />
          </div>
        </div>
        
        {/* Job Reference Section */}
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="font-medium text-gray-700">Job Reference:</label>
              <input 
                type="text" 
                value={quotation?.id || ''} 
                className="w-full mt-1 px-2 py-1 border rounded text-sm"
                readOnly
              />
            </div>
            <div>
              <label className="font-medium text-gray-700">Site Address:</label>
              <input 
                type="text" 
                value={quotation?.siteAddress || ''} 
                className="w-full mt-1 px-2 py-1 border rounded text-sm"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Editable Form Section */}
      <div className="p-8 bg-white">
        {/* New Editable Template Sections */}
        
        {/* The Invoice Address Section */}
        <div className="mb-8 p-6 border-2 border-ukpn-red rounded-lg bg-red-50">
          <h3 className="text-xl font-bold text-ukpn-red mb-4 border-b-2 border-ukpn-red pb-2">
            The Invoice Address
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name / Company name:
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  value={invoiceAddress?.companyName}
                  onChange={(e) => updateInvoiceAddress('companyName', e?.target?.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ukpn-red focus:border-ukpn-red"
                  placeholder="Enter company name"
                />
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[38px]">
                  {invoiceAddress?.companyName || "Not specified"}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact name:
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  value={invoiceAddress?.contactName}
                  onChange={(e) => updateInvoiceAddress('contactName', e?.target?.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ukpn-red focus:border-ukpn-red"
                  placeholder="Enter contact name"
                />
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[38px]">
                  {invoiceAddress?.contactName || "Not specified"}
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address:
              </label>
              {isEditMode ? (
                <textarea
                  value={invoiceAddress?.address}
                  onChange={(e) => updateInvoiceAddress('address', e?.target?.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ukpn-red focus:border-ukpn-red"
                  placeholder="Enter full address"
                />
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[76px]">
                  {invoiceAddress?.address || "Not specified"}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telephone:
              </label>
              {isEditMode ? (
                <input
                  type="tel"
                  value={invoiceAddress?.telephone}
                  onChange={(e) => updateInvoiceAddress('telephone', e?.target?.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ukpn-red focus:border-ukpn-red"
                  placeholder="Enter telephone number"
                />
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[38px]">
                  {invoiceAddress?.telephone || "Not specified"}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email:
              </label>
              {isEditMode ? (
                <input
                  type="email"
                  value={invoiceAddress?.email}
                  onChange={(e) => updateInvoiceAddress('email', e?.target?.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ukpn-red focus:border-ukpn-red"
                  placeholder="Enter email address"
                />
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[38px]">
                  {invoiceAddress?.email || "Not specified"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Your Site Contact Section */}
        <div className="mb-8 p-6 border-2 border-ukpn-red rounded-lg bg-red-50">
          <h3 className="text-xl font-bold text-ukpn-red mb-4 border-b-2 border-ukpn-red pb-2">
            Your Site Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name / Company name:
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  value={siteContact?.companyName}
                  onChange={(e) => updateSiteContact('companyName', e?.target?.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ukpn-red focus:border-ukpn-red"
                  placeholder="Enter company name"
                />
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[38px]">
                  {siteContact?.companyName || "Not specified"}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact name:
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  value={siteContact?.contactName}
                  onChange={(e) => updateSiteContact('contactName', e?.target?.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ukpn-red focus:border-ukpn-red"
                  placeholder="Enter contact name"
                />
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[38px]">
                  {siteContact?.contactName || "Not specified"}
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address:
              </label>
              {isEditMode ? (
                <textarea
                  value={siteContact?.address}
                  onChange={(e) => updateSiteContact('address', e?.target?.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ukpn-red focus:border-ukpn-red"
                  placeholder="Enter full address"
                />
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[76px]">
                  {siteContact?.address || "Not specified"}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telephone:
              </label>
              {isEditMode ? (
                <input
                  type="tel"
                  value={siteContact?.telephone}
                  onChange={(e) => updateSiteContact('telephone', e?.target?.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ukpn-red focus:border-ukpn-red"
                  placeholder="Enter telephone number"
                />
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[38px]">
                  {siteContact?.telephone || "Not specified"}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email:
              </label>
              {isEditMode ? (
                <input
                  type="email"
                  value={siteContact?.email}
                  onChange={(e) => updateSiteContact('email', e?.target?.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ukpn-red focus:border-ukpn-red"
                  placeholder="Enter email address"
                />
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[38px]">
                  {siteContact?.email || "Not specified"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Your Acceptance Section */}
        <div className="mb-8 p-6 border-2 border-ukpn-red rounded-lg bg-red-50">
          <h3 className="text-xl font-bold text-ukpn-red mb-4 border-b-2 border-ukpn-red pb-2">
            Your Acceptance
          </h3>
          
          {/* Acceptance Text */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Acceptance Statement:
            </label>
            {isEditMode ? (
              <textarea
                value={acceptance?.acceptanceText}
                onChange={(e) => updateAcceptanceText('acceptanceText', e?.target?.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ukpn-red focus:border-ukpn-red"
                placeholder="Enter acceptance statement"
              />
            ) : (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[76px] text-sm">
                {acceptance?.acceptanceText}
              </div>
            )}
          </div>

          {/* Terms Text */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Terms and Conditions:
            </label>
            {isEditMode ? (
              <textarea
                value={acceptance?.termsText}
                onChange={(e) => updateAcceptanceText('termsText', e?.target?.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ukpn-red focus:border-ukpn-red"
                placeholder="Enter terms and conditions"
              />
            ) : (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[100px] text-sm">
                {acceptance?.termsText}
              </div>
            )}
          </div>

          {/* Signature Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Signed:
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  value={acceptance?.signature?.signed}
                  onChange={(e) => updateAcceptanceSignature('signed', e?.target?.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ukpn-red focus:border-ukpn-red"
                  placeholder="Signature"
                />
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[38px]">
                  {acceptance?.signature?.signed || "Not signed"}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date:
              </label>
              {isEditMode ? (
                <input
                  type="date"
                  value={acceptance?.signature?.date}
                  onChange={(e) => updateAcceptanceSignature('date', e?.target?.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ukpn-red focus:border-ukpn-red"
                />
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[38px]">
                  {acceptance?.signature?.date || "Not specified"}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Print name:
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  value={acceptance?.signature?.printName}
                  onChange={(e) => updateAcceptanceSignature('printName', e?.target?.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ukpn-red focus:border-ukpn-red"
                  placeholder="Print name"
                />
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[38px]">
                  {acceptance?.signature?.printName || "Not specified"}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agent acting on behalf of:
              </label>
              {isEditMode ? (
                <input
                  type="text"
                  value={acceptance?.signature?.agentActingOnBehalfOf}
                  onChange={(e) => updateAcceptanceSignature('agentActingOnBehalfOf', e?.target?.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ukpn-red focus:border-ukpn-red"
                  placeholder="Agent acting on behalf of"
                />
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[38px]">
                  {acceptance?.signature?.agentActingOnBehalfOf || "Not specified"}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telephone:
              </label>
              {isEditMode ? (
                <input
                  type="tel"
                  value={acceptance?.signature?.telephone}
                  onChange={(e) => updateAcceptanceSignature('telephone', e?.target?.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ukpn-red focus:border-ukpn-red"
                  placeholder="Telephone number"
                />
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[38px]">
                  {acceptance?.signature?.telephone || "Not specified"}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email:
              </label>
              {isEditMode ? (
                <input
                  type="email"
                  value={acceptance?.signature?.email}
                  onChange={(e) => updateAcceptanceSignature('email', e?.target?.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ukpn-red focus:border-ukpn-red"
                  placeholder="Email address"
                />
              ) : (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 min-h-[38px]">
                  {acceptance?.signature?.email || "Not specified"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Return Instructions */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Return Instructions</h3>
          <p className="text-sm text-blue-800 mb-3">Please return your completed form by post or email:</p>
          <div className="text-sm text-blue-800">
            <p className="font-medium">{quotation?.returnAddress?.company}</p>
            <p>{quotation?.returnAddress?.department}</p>
            <p>{quotation?.returnAddress?.address}</p>
            <p>Email: {quotation?.returnAddress?.email}</p>
          </div>
        </div>

        {/* Connection Options Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Please indicate which option you accept (Please tick one only)
          </h3>
          
          <div className="space-y-4">
            {/* Option A */}
            <div className={`border-2 rounded-lg p-4 transition-colors ${
              selectedOption === 'A' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}>
              <div className="flex items-start space-x-4">
                <input
                  type="radio"
                  name="connectionOption"
                  value="A"
                  checked={selectedOption === 'A'}
                  onChange={() => handleOptionSelect('A')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <p className="font-bold text-gray-900">Option A:</p>
                      <p className="text-sm text-gray-700 mt-1">
                        {quotation?.connectionOptions?.optionA?.description}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-900">Price excluding VAT</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(quotation?.connectionOptions?.optionA?.priceExclVat)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-900">Price including VAT</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(quotation?.connectionOptions?.optionA?.priceInclVat)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Option B */}
            <div className={`border-2 rounded-lg p-4 opacity-60 ${
              quotation?.connectionOptions?.optionB?.applicable ? 'border-gray-200' : 'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-start space-x-4">
                <input
                  type="radio"
                  name="connectionOption"
                  value="B"
                  disabled={!quotation?.connectionOptions?.optionB?.applicable}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <p className="font-bold text-gray-900">Option B:</p>
                      <p className="text-sm text-gray-700 mt-1">
                        {quotation?.connectionOptions?.optionB?.description}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-900">Price excluding VAT</p>
                      <p className="text-lg font-bold text-red-500">Not Applicable</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-900">Price including VAT</p>
                      <p className="text-lg font-bold text-red-500">Not Applicable</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Option C */}
            <div className={`border-2 rounded-lg p-4 transition-colors ${
              selectedOption === 'C' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}>
              <div className="flex items-start space-x-4">
                <input
                  type="radio"
                  name="connectionOption"
                  value="C"
                  checked={selectedOption === 'C'}
                  onChange={() => handleOptionSelect('C')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <p className="font-bold text-gray-900">Option C:</p>
                      <p className="text-sm text-gray-700 mt-1">
                        {quotation?.connectionOptions?.optionC?.description}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-900">Price excluding VAT</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(quotation?.connectionOptions?.optionC?.priceExclVat)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-900">Price including VAT</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(quotation?.connectionOptions?.optionC?.priceInclVat)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Profile Section */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Profile</h3>
          <p className="text-sm text-gray-700 mb-4">
            VAT is payable on all standard rate connection charges where applicable. 
            Payment is due within 30 days of invoice date.
          </p>
        </div>

        {/* Payment Methods */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Please indicate your method of payment
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Online Payment */}
            <div className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-colors ${
              selectedPaymentMethod === 'online' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`} onClick={() => handlePaymentMethodSelect('online')}>
              <input
                type="radio"
                name="paymentMethod"
                value="online"
                checked={selectedPaymentMethod === 'online'}
                onChange={() => handlePaymentMethodSelect('online')}
                className="mb-2"
              />
              <div>
                <Icon name="Globe" size={24} className="mx-auto mb-2" />
                <p className="font-bold text-gray-900">Online</p>
                <p className="text-sm text-gray-600 mt-2">
                  {quotation?.paymentDetails?.online}
                </p>
                {/* QR Code placeholder */}
                <div className="w-16 h-16 bg-gray-200 mx-auto mt-2 rounded flex items-center justify-center">
                  <Icon name="QrCode" size={20} />
                </div>
              </div>
            </div>

            {/* Phone Payment */}
            <div className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-colors ${
              selectedPaymentMethod === 'phone' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`} onClick={() => handlePaymentMethodSelect('phone')}>
              <input
                type="radio"
                name="paymentMethod"
                value="phone"
                checked={selectedPaymentMethod === 'phone'}
                onChange={() => handlePaymentMethodSelect('phone')}
                className="mb-2"
              />
              <div>
                <Icon name="Phone" size={24} className="mx-auto mb-2" />
                <p className="font-bold text-gray-900">Phone</p>
                <p className="text-sm text-gray-600 mt-2 font-mono">
                  {quotation?.paymentDetails?.phone}
                </p>
              </div>
            </div>

            {/* Cheque Payment */}
            <div className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-colors ${
              selectedPaymentMethod === 'cheque' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`} onClick={() => handlePaymentMethodSelect('cheque')}>
              <input
                type="radio"
                name="paymentMethod"
                value="cheque"
                checked={selectedPaymentMethod === 'cheque'}
                onChange={() => handlePaymentMethodSelect('cheque')}
                className="mb-2"
              />
              <div>
                <Icon name="FileText" size={24} className="mx-auto mb-2" />
                <p className="font-bold text-gray-900">Cheque</p>
                <p className="text-sm text-gray-600 mt-2">
                  {quotation?.paymentDetails?.cheque}
                </p>
              </div>
            </div>

            {/* BACS/CHAPS Payment */}
            <div className={`border-2 rounded-lg p-4 text-center cursor-pointer transition-colors ${
              selectedPaymentMethod === 'bacs' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            }`} onClick={() => handlePaymentMethodSelect('bacs')}>
              <input
                type="radio"
                name="paymentMethod"
                value="bacs"
                checked={selectedPaymentMethod === 'bacs'}
                onChange={() => handlePaymentMethodSelect('bacs')}
                className="mb-2"
              />
              <div>
                <Icon name="CreditCard" size={24} className="mx-auto mb-2" />
                <p className="font-bold text-gray-900">BACS/CHAPS</p>
                <div className="text-xs text-gray-600 mt-2 text-left">
                  <p>Account: {quotation?.paymentDetails?.bacs?.account}</p>
                  <p>Sort Code: {quotation?.paymentDetails?.bacs?.sortCode}</p>
                  <p>Account Number: {quotation?.paymentDetails?.bacs?.accountNumber}</p>
                  <p>UK Power Networks Ref: {quotation?.paymentDetails?.bacs?.reference}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Field Summary */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-bold text-yellow-900 mb-3">Technical Field Summary (SAP Integration)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-yellow-800">OBJECT_ID:</span>
              <p className="text-yellow-700">{quotation?.objectId}</p>
            </div>
            <div>
              <span className="font-medium text-yellow-800">POSTING_DATE:</span>
              <p className="text-yellow-700">{quotation?.postingDate}</p>
            </div>
            <div>
              <span className="font-medium text-yellow-800">CUSTOMER_NAME:</span>
              <p className="text-yellow-700">{quotation?.customerName}</p>
            </div>
            <div>
              <span className="font-medium text-yellow-800">SITE_ADDRESS:</span>
              <p className="text-yellow-700">{quotation?.siteAddress}</p>
            </div>
            <div>
              <span className="font-medium text-yellow-800">ZZFLD000002 (Total Load):</span>
              <p className="text-yellow-700">{quotation?.totalLoad} kW</p>
            </div>
            <div>
              <span className="font-medium text-yellow-800">Start Date:</span>
              <p className="text-yellow-700">{quotation?.quotationStartDate}</p>
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-green-900">Form Completion Status</h3>
              <p className="text-sm text-green-700 mt-1">
                Selected Option: {selectedOption ? `Option ${selectedOption}` : 'Not selected'}
              </p>
              <p className="text-sm text-green-700">
                Payment Method: {selectedPaymentMethod ? selectedPaymentMethod?.charAt(0)?.toUpperCase() + selectedPaymentMethod?.slice(1) : 'Not selected'}
              </p>
            </div>
            <button
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedOption && selectedPaymentMethod
                  ? 'bg-green-600 text-white hover:bg-green-700' :'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!selectedOption || !selectedPaymentMethod}
            >
              Submit Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationDocument;