import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuotationPreview = ({ 
  selectedTemplate, 
  customerData, 
  items, 
  locationData, 
  onClose 
}) => {
  const calculateSubTotal = () => {
    return items?.reduce((total, item) => total + ((item?.quantity || 0) * (item?.unitPrice || 0)), 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.08; // 8% tax rate
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateSubTotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const quotationNumber = `CQ-${Date.now()?.toString()?.slice(-6)}`;
  const currentDate = new Date();
  const validUntilDate = new Date(currentDate.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days from now

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-modal p-4">
      <div className="bg-card rounded-lg shadow-elevation-2 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Quotation Preview</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Preview Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="bg-white border border-border rounded-lg p-8 space-y-8">
            {/* Company Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-lg">
                  <Icon name="Zap" size={24} color="white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Click & Quote</h1>
                  <p className="text-muted-foreground">Electrical Solutions</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-xl font-semibold text-foreground">QUOTATION</h2>
                <p className="text-sm text-muted-foreground">#{quotationNumber}</p>
              </div>
            </div>

            {/* Company & Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-foreground mb-3">From:</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Click & Quote LLC</p>
                  <p>123 Electric Avenue</p>
                  <p>New York, NY 10001</p>
                  <p>Phone: (555) 123-4567</p>
                  <p>Email: info@clickquote.com</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3">To:</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{customerData?.name || 'Customer Name'}</p>
                  {customerData?.company && <p>{customerData?.company}</p>}
                  <p>{customerData?.address || 'Customer Address'}</p>
                  <p>{customerData?.city && customerData?.state && customerData?.zipCode ? 
                    `${customerData?.city}, ${customerData?.state} ${customerData?.zipCode}` : 
                    'City, State ZIP'}</p>
                  <p>Phone: {customerData?.phone || 'Phone Number'}</p>
                  <p>Email: {customerData?.email || 'email@example.com'}</p>
                </div>
              </div>
            </div>

            {/* Quotation Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Date:</p>
                <p className="font-medium text-foreground">{formatDate(currentDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valid Until:</p>
                <p className="font-medium text-foreground">{formatDate(validUntilDate)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Template:</p>
                <p className="font-medium text-foreground">{selectedTemplate?.name || 'Custom'}</p>
              </div>
            </div>

            {/* Location Information */}
            {locationData?.name && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">Installation Location:</h3>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="font-medium text-foreground">{locationData?.name}</p>
                  {locationData?.coordinates && (
                    <p className="text-sm text-muted-foreground font-mono">
                      Coordinates: {locationData?.coordinates?.lat?.toFixed(6)}, {locationData?.coordinates?.lng?.toFixed(6)}
                    </p>
                  )}
                  {locationData?.description && (
                    <p className="text-sm text-muted-foreground mt-2">{locationData?.description}</p>
                  )}
                </div>
              </div>
            )}

            {/* Items Table */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Items & Services:</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 font-medium text-foreground">Description</th>
                      <th className="text-center p-3 font-medium text-foreground w-20">Qty</th>
                      <th className="text-right p-3 font-medium text-foreground w-28">Unit Price</th>
                      <th className="text-right p-3 font-medium text-foreground w-28">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items?.map((item, index) => (
                      <tr key={item?.id} className="border-t border-border">
                        <td className="p-3">
                          <div className="font-medium text-foreground">{item?.name}</div>
                          <div className="text-sm text-muted-foreground">{item?.category}</div>
                        </td>
                        <td className="p-3 text-center text-foreground">{item?.quantity || 0}</td>
                        <td className="p-3 text-right text-foreground">${(item?.unitPrice || 0)?.toFixed(2)}</td>
                        <td className="p-3 text-right font-medium text-foreground">
                          ${((item?.quantity || 0) * (item?.unitPrice || 0))?.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-80 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium text-foreground">${calculateSubTotal()?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tax (8%):</span>
                  <span className="font-medium text-foreground">${calculateTax(calculateSubTotal())?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-lg font-semibold text-foreground">Total Amount:</span>
                  <span className="text-lg font-bold text-primary">${calculateGrandTotal()?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="pt-6 border-t border-border">
              <h3 className="font-semibold text-foreground mb-3">Terms & Conditions:</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• This quotation is valid for 30 days from the date of issue.</p>
                <p>• Prices are subject to change without notice after the validity period.</p>
                <p>• Installation and delivery charges may apply based on location.</p>
                <p>• Payment terms: 50% advance, 50% on completion.</p>
                <p>• All electrical work will be performed according to local electrical codes.</p>
                <p>• Warranty: 1 year on products, 6 months on installation services.</p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Thank you for choosing Click & Quote for your electrical needs.
              </p>
              <p className="text-sm text-muted-foreground">
                For questions about this quotation, please contact us at (555) 123-4567
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close Preview
          </Button>
          <Button
            variant="default"
            iconName="Download"
            iconPosition="left"
          >
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuotationPreview;