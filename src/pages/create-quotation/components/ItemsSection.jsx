import React from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ItemsSection = ({ selectedTemplate, items, onItemsChange, errors }) => {
  const getTemplateItems = (templateId) => {
    const templateItems = {
      'transformer-basic': [
        { id: 1, name: 'Distribution Transformer 100kVA', category: 'Transformer', unitPrice: 15000 },
        { id: 2, name: 'High Voltage Bushings', category: 'Accessories', unitPrice: 800 },
        { id: 3, name: 'Oil Level Indicator', category: 'Accessories', unitPrice: 250 },
        { id: 4, name: 'Pressure Relief Valve', category: 'Safety', unitPrice: 450 },
        { id: 5, name: 'Installation Kit', category: 'Installation', unitPrice: 1200 }
      ],
      'household-starter': [
        { id: 1, name: 'Circuit Breaker Panel 200A', category: 'Panel', unitPrice: 350 },
        { id: 2, name: 'GFCI Outlets (Pack of 10)', category: 'Outlets', unitPrice: 120 },
        { id: 3, name: 'LED Light Fixtures', category: 'Lighting', unitPrice: 85 },
        { id: 4, name: 'Electrical Wire 12 AWG (500ft)', category: 'Wiring', unitPrice: 180 },
        { id: 5, name: 'Wire Nuts Assortment', category: 'Accessories', unitPrice: 25 },
        { id: 6, name: 'Electrical Conduit (10ft)', category: 'Conduit', unitPrice: 45 },
        { id: 7, name: 'Junction Boxes (Pack of 5)', category: 'Boxes', unitPrice: 35 },
        { id: 8, name: 'Voltage Tester', category: 'Tools', unitPrice: 65 }
      ],
      'commercial-lighting': [
        { id: 1, name: 'LED Panel Lights 2x4ft', category: 'Lighting', unitPrice: 125 },
        { id: 2, name: 'Emergency Exit Signs', category: 'Safety', unitPrice: 95 },
        { id: 3, name: 'Motion Sensor Switches', category: 'Controls', unitPrice: 75 },
        { id: 4, name: 'Dimmer Controls', category: 'Controls', unitPrice: 85 },
        { id: 5, name: 'Track Lighting System', category: 'Lighting', unitPrice: 280 },
        { id: 6, name: 'Pendant Light Fixtures', category: 'Lighting', unitPrice: 150 },
        { id: 7, name: 'Recessed Can Lights', category: 'Lighting', unitPrice: 45 },
        { id: 8, name: 'Lighting Control Panel', category: 'Controls', unitPrice: 650 },
        { id: 9, name: 'Ballasts for Fluorescent', category: 'Components', unitPrice: 35 },
        { id: 10, name: 'Wire Management System', category: 'Installation', unitPrice: 120 },
        { id: 11, name: 'Occupancy Sensors', category: 'Controls', unitPrice: 90 },
        { id: 12, name: 'Installation Labor', category: 'Service', unitPrice: 1200 }
      ],
      'industrial-power': [
        { id: 1, name: 'Motor Control Center', category: 'Control', unitPrice: 8500 },
        { id: 2, name: 'Variable Frequency Drives', category: 'Drives', unitPrice: 2200 },
        { id: 3, name: 'Power Distribution Unit', category: 'Distribution', unitPrice: 3500 },
        { id: 4, name: 'Industrial Contactors', category: 'Controls', unitPrice: 180 },
        { id: 5, name: 'Overload Relays', category: 'Protection', unitPrice: 125 },
        { id: 6, name: 'Disconnect Switches', category: 'Safety', unitPrice: 350 },
        { id: 7, name: 'Current Transformers', category: 'Measurement', unitPrice: 280 },
        { id: 8, name: 'Power Cables 480V', category: 'Cables', unitPrice: 450 },
        { id: 9, name: 'Cable Trays System', category: 'Support', unitPrice: 680 },
        { id: 10, name: 'Grounding Equipment', category: 'Safety', unitPrice: 320 },
        { id: 11, name: 'Surge Protection Device', category: 'Protection', unitPrice: 550 },
        { id: 12, name: 'Metering Equipment', category: 'Measurement', unitPrice: 750 },
        { id: 13, name: 'Control Wiring', category: 'Wiring', unitPrice: 380 },
        { id: 14, name: 'Installation & Testing', category: 'Service', unitPrice: 4500 },
        { id: 15, name: 'Commissioning Service', category: 'Service', unitPrice: 2800 }
      ],
      'maintenance-kit': [
        { id: 1, name: 'Digital Multimeter', category: 'Tools', unitPrice: 150 },
        { id: 2, name: 'Wire Strippers Set', category: 'Tools', unitPrice: 85 },
        { id: 3, name: 'Electrical Tape Assortment', category: 'Supplies', unitPrice: 35 },
        { id: 4, name: 'Fuse Assortment Kit', category: 'Components', unitPrice: 120 },
        { id: 5, name: 'Replacement Breakers', category: 'Components', unitPrice: 180 },
        { id: 6, name: 'Wire Connectors Kit', category: 'Supplies', unitPrice: 65 },
        { id: 7, name: 'Insulation Tester', category: 'Tools', unitPrice: 280 },
        { id: 8, name: 'Safety Equipment Kit', category: 'Safety', unitPrice: 220 },
        { id: 9, name: 'Spare Parts Assortment', category: 'Components', unitPrice: 350 },
        { id: 10, name: 'Maintenance Manual & Log', category: 'Documentation', unitPrice: 45 }
      ]
    };

    return templateItems?.[templateId] || [];
  };

  const templateItems = getTemplateItems(selectedTemplate?.id);

  const handleQuantityChange = (itemId, quantity) => {
    const updatedItems = items?.map(item => 
      item?.id === itemId 
        ? { ...item, quantity: parseInt(quantity) || 0 }
        : item
    );
    onItemsChange(updatedItems);
  };

  const handleUnitPriceChange = (itemId, unitPrice) => {
    const updatedItems = items?.map(item => 
      item?.id === itemId 
        ? { ...item, unitPrice: parseFloat(unitPrice) || 0 }
        : item
    );
    onItemsChange(updatedItems);
  };

  const calculateItemTotal = (quantity, unitPrice) => {
    return (quantity || 0) * (unitPrice || 0);
  };

  const calculateSubTotal = () => {
    return items?.reduce((total, item) => total + calculateItemTotal(item?.quantity, item?.unitPrice), 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.08; // 8% tax rate
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateSubTotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const addCustomItem = () => {
    const newItem = {
      id: Date.now(),
      name: '',
      category: 'Custom',
      quantity: 1,
      unitPrice: 0,
      isCustom: true
    };
    onItemsChange([...items, newItem]);
  };

  const removeItem = (itemId) => {
    const updatedItems = items?.filter(item => item?.id !== itemId);
    onItemsChange(updatedItems);
  };

  const handleCustomItemNameChange = (itemId, name) => {
    const updatedItems = items?.map(item => 
      item?.id === itemId 
        ? { ...item, name }
        : item
    );
    onItemsChange(updatedItems);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Package" size={20} className="text-primary" />
          <h3 className="text-lg font-medium text-foreground">Quotation Items</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={addCustomItem}
          iconName="Plus"
          iconPosition="left"
        >
          Add Custom Item
        </Button>
      </div>
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">Item Name</th>
                <th className="text-left p-4 font-medium text-foreground">Category</th>
                <th className="text-center p-4 font-medium text-foreground w-24">Qty</th>
                <th className="text-right p-4 font-medium text-foreground w-32">Unit Price</th>
                <th className="text-right p-4 font-medium text-foreground w-32">Total</th>
                <th className="text-center p-4 font-medium text-foreground w-16">Action</th>
              </tr>
            </thead>
            <tbody>
              {items?.map((item, index) => (
                <tr key={item?.id} className="border-t border-border">
                  <td className="p-4">
                    {item?.isCustom ? (
                      <Input
                        type="text"
                        placeholder="Enter item name"
                        value={item?.name}
                        onChange={(e) => handleCustomItemNameChange(item?.id, e?.target?.value)}
                        className="min-w-48"
                      />
                    ) : (
                      <div>
                        <div className="font-medium text-foreground">{item?.name}</div>
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-sm px-2 py-1 bg-muted rounded-md text-muted-foreground">
                      {item?.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <Input
                      type="number"
                      min="0"
                      value={item?.quantity || ''}
                      onChange={(e) => handleQuantityChange(item?.id, e?.target?.value)}
                      className="w-20 text-center"
                    />
                  </td>
                  <td className="p-4">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item?.unitPrice || ''}
                      onChange={(e) => handleUnitPriceChange(item?.id, e?.target?.value)}
                      className="w-28 text-right"
                    />
                  </td>
                  <td className="p-4 text-right font-medium text-foreground">
                    ${calculateItemTotal(item?.quantity, item?.unitPrice)?.toFixed(2)}
                  </td>
                  <td className="p-4 text-center">
                    {item?.isCustom && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item?.id)}
                        className="text-error hover:text-error hover:bg-error/10"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="border-t border-border bg-muted/50">
          <div className="p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium text-foreground">${calculateSubTotal()?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tax (8%):</span>
              <span className="font-medium text-foreground">${calculateTax(calculateSubTotal())?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-border">
              <span className="text-lg font-semibold text-foreground">Grand Total:</span>
              <span className="text-lg font-bold text-primary">${calculateGrandTotal()?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      {errors?.items && (
        <div className="text-sm text-error">{errors?.items}</div>
      )}
    </div>
  );
};

export default ItemsSection;