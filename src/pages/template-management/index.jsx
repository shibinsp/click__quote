import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import TemplateCard from './components/TemplateCard';
import TemplateCreationPanel from './components/TemplateCreationPanel';
import TemplateFilters from './components/TemplateFilters';
import TemplateStats from './components/TemplateStats';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const TemplateManagement = () => {
  const navigate = useNavigate();
  const [userRole] = useState('Admin'); // Mock user role
  const [isCreationPanelOpen, setIsCreationPanelOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    sortBy: 'name'
  });

  // Mock templates data
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: "Standard Quotation Template",
      description: "Standard template for quotations based on technical field specifications with OBJECT_ID, POSTING_DATE, customer details, and datetime ranges as per SAP field requirements",
      type: "default",
      category: "standard",
      usageCount: 156,
      lastModified: "2024-09-24T14:59:07Z",
      createdBy: "system",
      fields: [
        { 
          id: 1, 
          label: "Quotation Number (OBJECT_ID)", 
          type: "text", 
          required: true, 
          maxLength: 10,
          dataType: "CHAR",
          technicalName: "OBJECT_ID"
        },
        { 
          id: 2, 
          label: "Creation Date (POSTING_DATE)", 
          type: "date", 
          required: true, 
          format: "DD.MM.YYYY",
          dataType: "DATS",
          technicalName: "POSTING_DATE",
          fieldLength: 8
        },
        { 
          id: 3, 
          label: "Quotation Description (DESCRIPTION)", 
          type: "text", 
          required: true, 
          maxLength: 40,
          dataType: "CHAR",
          technicalName: "DESCRIPTION",
          fieldLength: 40
        },
        { 
          id: 4, 
          label: "Customer Name (CUSTOMER_NAME)", 
          type: "text", 
          required: true, 
          maxLength: 80,
          dataType: "CHAR",
          technicalName: "CUSTOMER_NAME",
          fieldLength: 80
        },
        { 
          id: 5, 
          label: "Site Address (SITE_ADDRESS)", 
          type: "text", 
          required: true, 
          maxLength: 80,
          dataType: "CHAR",
          technicalName: "SITE_ADDRESS",
          fieldLength: 80
        },
        { 
          id: 6, 
          label: "Total Load - Required Power (ZZFLD000002)", 
          type: "number", 
          required: true, 
          dataType: "DEC", 
          precision: 14,
          technicalName: "ZZFLD000002",
          fieldLength: 14
        },
        { 
          id: 7, 
          label: "Quotation Start Date", 
          type: "datetime-local", 
          required: true, 
          format: "DD.MM.YYYY HH:MM:SS",
          dataType: "DEC",
          fieldLength: 15
        },
        { 
          id: 8, 
          label: "Quotation End Date", 
          type: "datetime-local", 
          required: true, 
          format: "DD.MM.YYYY HH:MM:SS",
          dataType: "DEC",
          fieldLength: 15
        }
      ]
    },
    {
      id: 2,
      name: "Household Electrical Package",
      description: "Comprehensive template for residential electrical installations including wiring, outlets, and fixtures",
      type: "default",
      category: "household",
      usageCount: 89,
      lastModified: "2024-09-18T14:15:00Z",
      createdBy: "system",
      fields: [
        { id: 1, label: "Quotation Number (OBJECT_ID)", type: "text", required: true, maxLength: 10 },
        { id: 2, label: "Creation Date (POSTING_DATE)", type: "date", required: true, format: "DD.MM.YYYY" },
        { id: 3, label: "Quotation Description", type: "text", required: true, maxLength: 40 },
        { id: 4, label: "Customer Name", type: "text", required: true, maxLength: 80 },
        { id: 5, label: "Site Address", type: "text", required: true, maxLength: 80 },
        { id: 6, label: "Total Load (Required Power)", type: "number", required: true, dataType: "decimal", precision: 14 },
        { id: 7, label: "Property Type", type: "select", required: true },
        { id: 8, label: "Number of Rooms", type: "number", required: true },
        { id: 9, label: "Quotation Start Date", type: "datetime-local", required: true, format: "DD.MM.YYYY HH:MM:SS" },
        { id: 10, label: "Quotation End Date", type: "datetime-local", required: true, format: "DD.MM.YYYY HH:MM:SS" }
      ]
    },
    {
      id: 3,
      name: "Industrial Equipment Quote",
      description: "Template for heavy-duty industrial electrical equipment quotations with compliance requirements",
      type: "default",
      category: "industrial",
      usageCount: 67,
      lastModified: "2024-09-15T09:45:00Z",
      createdBy: "system",
      fields: [
        { id: 1, label: "Quotation Number (OBJECT_ID)", type: "text", required: true, maxLength: 10 },
        { id: 2, label: "Creation Date (POSTING_DATE)", type: "date", required: true, format: "DD.MM.YYYY" },
        { id: 3, label: "Quotation Description", type: "text", required: true, maxLength: 40 },
        { id: 4, label: "Customer Name", type: "text", required: true, maxLength: 80 },
        { id: 5, label: "Site Address", type: "text", required: true, maxLength: 80 },
        { id: 6, label: "Total Load (Required Power)", type: "number", required: true, dataType: "decimal", precision: 14 },
        { id: 7, label: "Equipment Type", type: "select", required: true },
        { id: 8, label: "Voltage Requirements", type: "text", required: true },
        { id: 9, label: "Safety Compliance", type: "checkbox", required: true },
        { id: 10, label: "Quotation Start Date", type: "datetime-local", required: true, format: "DD.MM.YYYY HH:MM:SS" },
        { id: 11, label: "Quotation End Date", type: "datetime-local", required: true, format: "DD.MM.YYYY HH:MM:SS" }
      ]
    },
    {
      id: 4,
      name: "LED Lighting Solutions",
      description: "Specialized template for LED lighting installations in commercial and residential spaces",
      type: "default",
      category: "lighting",
      usageCount: 134,
      lastModified: "2024-09-22T16:20:00Z",
      createdBy: "system",
      fields: [
        { id: 1, label: "Quotation Number (OBJECT_ID)", type: "text", required: true, maxLength: 10 },
        { id: 2, label: "Creation Date (POSTING_DATE)", type: "date", required: true, format: "DD.MM.YYYY" },
        { id: 3, label: "Quotation Description", type: "text", required: true, maxLength: 40 },
        { id: 4, label: "Customer Name", type: "text", required: true, maxLength: 80 },
        { id: 5, label: "Site Address", type: "text", required: true, maxLength: 80 },
        { id: 6, label: "Total Load (Required Power)", type: "number", required: true, dataType: "decimal", precision: 14 },
        { id: 7, label: "Space Type", type: "select", required: true },
        { id: 8, label: "Square Footage", type: "number", required: true },
        { id: 9, label: "Light Fixture Count", type: "number", required: true },
        { id: 10, label: "Quotation Start Date", type: "datetime-local", required: true, format: "DD.MM.YYYY HH:MM:SS" },
        { id: 11, label: "Quotation End Date", type: "datetime-local", required: true, format: "DD.MM.YYYY HH:MM:SS" }
      ]
    },
    {
      id: 5,
      name: "Cable & Wiring Installation",
      description: "Template for cable installation projects including underground and overhead wiring systems",
      type: "default",
      category: "cables",
      usageCount: 78,
      lastModified: "2024-09-19T11:30:00Z",
      createdBy: "system",
      fields: [
        { id: 1, label: "Quotation Number (OBJECT_ID)", type: "text", required: true, maxLength: 10 },
        { id: 2, label: "Creation Date (POSTING_DATE)", type: "date", required: true, format: "DD.MM.YYYY" },
        { id: 3, label: "Quotation Description", type: "text", required: true, maxLength: 40 },
        { id: 4, label: "Customer Name", type: "text", required: true, maxLength: 80 },
        { id: 5, label: "Site Address", type: "text", required: true, maxLength: 80 },
        { id: 6, label: "Total Load (Required Power)", type: "number", required: true, dataType: "decimal", precision: 14 },
        { id: 7, label: "Cable Type", type: "select", required: true },
        { id: 8, label: "Installation Method", type: "select", required: true },
        { id: 9, label: "Distance (meters)", type: "number", required: true },
        { id: 10, label: "Quotation Start Date", type: "datetime-local", required: true, format: "DD.MM.YYYY HH:MM:SS" },
        { id: 11, label: "Quotation End Date", type: "datetime-local", required: true, format: "DD.MM.YYYY HH:MM:SS" }
      ]
    },
    {
      id: 6,
      name: "Custom Solar Panel Quote",
      description: "Custom template created for solar panel installation quotations with battery backup options",
      type: "custom",
      category: "custom",
      usageCount: 23,
      lastModified: "2024-09-21T13:45:00Z",
      createdBy: "current_user",
      fields: [
        { id: 1, label: "Quotation Number (OBJECT_ID)", type: "text", required: true, maxLength: 10 },
        { id: 2, label: "Creation Date (POSTING_DATE)", type: "date", required: true, format: "DD.MM.YYYY" },
        { id: 3, label: "Quotation Description", type: "text", required: true, maxLength: 40 },
        { id: 4, label: "Customer Name", type: "text", required: true, maxLength: 80 },
        { id: 5, label: "Site Address", type: "text", required: true, maxLength: 80 },
        { id: 6, label: "Total Load (Required Power)", type: "number", required: true, dataType: "decimal", precision: 14 },
        { id: 7, label: "Panel Count", type: "number", required: true },
        { id: 8, label: "System Capacity (kW)", type: "number", required: true },
        { id: 9, label: "Battery Backup", type: "checkbox", required: false },
        { id: 10, label: "Installation Angle", type: "number", required: true },
        { id: 11, label: "Quotation Start Date", type: "datetime-local", required: true, format: "DD.MM.YYYY HH:MM:SS" },
        { id: 12, label: "Quotation End Date", type: "datetime-local", required: true, format: "DD.MM.YYYY HH:MM:SS" }
      ]
    },
    {
      id: 7,
      name: "Emergency Generator Setup",
      description: "Custom template for emergency generator installation and maintenance quotations",
      type: "custom",
      category: "industrial",
      usageCount: 12,
      lastModified: "2024-09-17T08:20:00Z",
      createdBy: "current_user",
      fields: [
        { id: 1, label: "Quotation Number (OBJECT_ID)", type: "text", required: true, maxLength: 10 },
        { id: 2, label: "Creation Date (POSTING_DATE)", type: "date", required: true, format: "DD.MM.YYYY" },
        { id: 3, label: "Quotation Description", type: "text", required: true, maxLength: 40 },
        { id: 4, label: "Customer Name", type: "text", required: true, maxLength: 80 },
        { id: 5, label: "Site Address", type: "text", required: true, maxLength: 80 },
        { id: 6, label: "Total Load (Required Power)", type: "number", required: true, dataType: "decimal", precision: 14 },
        { id: 7, label: "Generator Capacity", type: "number", required: true },
        { id: 8, label: "Fuel Type", type: "select", required: true },
        { id: 9, label: "Auto-Start Feature", type: "checkbox", required: false },
        { id: 10, label: "Quotation Start Date", type: "datetime-local", required: true, format: "DD.MM.YYYY HH:MM:SS" },
        { id: 11, label: "Quotation End Date", type: "datetime-local", required: true, format: "DD.MM.YYYY HH:MM:SS" }
      ]
    }
  ]);

  // Filter and sort templates
  const filteredTemplates = templates?.filter(template => {
      const matchesSearch = template?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
                           template?.description?.toLowerCase()?.includes(filters?.search?.toLowerCase());
      const matchesType = filters?.type === 'all' || template?.type === filters?.type;
      const matchesCategory = filters?.category === 'all' || template?.category === filters?.category;
      
      return matchesSearch && matchesType && matchesCategory;
    })?.sort((a, b) => {
      switch (filters?.sortBy) {
        case 'usage':
          return b?.usageCount - a?.usageCount;
        case 'recent':
          return new Date(b.lastModified) - new Date(a.lastModified);
        case 'created':
          return new Date(b.lastModified) - new Date(a.lastModified);
        case 'name':
        default:
          return a?.name?.localeCompare(b?.name);
      }
    });

  const handleUseTemplate = (template) => {
    navigate(`/create-quotation?template=${template?.id}`);
  };

  const handleEditTemplate = (template) => {
    if (template?.type === 'default') return; // Can't edit default templates
    setEditingTemplate(template);
    setIsCreationPanelOpen(true);
  };

  const handleDuplicateTemplate = (template) => {
    // Navigate to map view with template parameter for duplication workflow
    const params = new URLSearchParams();
    params?.set('duplicate_template', template?.id?.toString());
    navigate(`/map-view?${params?.toString()}`);
  };

  const handleDeleteTemplate = (template) => {
    if (template?.type === 'default') return; // Can't delete default templates
    setTemplateToDelete(template);
    setDeleteModalOpen(true);
  };

  const confirmDelete = (templateId) => {
    setTemplates(prev => prev?.filter(t => t?.id !== templateId));
    setDeleteModalOpen(false);
    setTemplateToDelete(null);
  };

  const handleSaveTemplate = (templateData) => {
    if (editingTemplate) {
      // Update existing template
      setTemplates(prev => prev?.map(t => 
        t?.id === editingTemplate?.id ? { ...templateData, id: editingTemplate?.id } : t
      ));
      setEditingTemplate(null);
    } else {
      // Create new template
      setTemplates(prev => [...prev, templateData]);
    }
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      category: 'all',
      sortBy: 'name'
    });
  };

  const handleCreateNew = () => {
    setEditingTemplate(null);
    setIsCreationPanelOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2 animate-fade-in">
              <span>Home</span>
              <Icon name="ChevronRight" size={14} />
              <span className="text-foreground">Template Management</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground animate-fade-in" style={{animationDelay: '0.1s'}}>Template Management</h1>
            <p className="text-muted-foreground mt-2 animate-slide-in-right" style={{animationDelay: '0.2s'}}>
              Create, manage, and organize quotation templates for streamlined workflow
            </p>
          </div>

          {/* Template Statistics */}
          <div className="animate-bounce-in" style={{animationDelay: '0.3s'}}>
            <TemplateStats templates={templates} userRole={userRole} />
          </div>

          {/* Template Filters */}
          <div className="animate-slide-in-right card-modern" style={{animationDelay: '0.4s'}}>
            <TemplateFilters
              filters={filters}
              onFiltersChange={setFilters}
              onCreateNew={handleCreateNew}
              onClearFilters={handleClearFilters}
              templateCount={filteredTemplates?.length}
            />
          </div>

          {/* Templates Grid */}
          {filteredTemplates?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in" style={{animationDelay: '0.5s'}}>
              {filteredTemplates?.map((template, index) => (
                <div key={template?.id} className="animate-bounce-in hover-lift" style={{animationDelay: `${0.6 + index * 0.1}s`}}>
                  <TemplateCard
                    template={template}
                    onUseTemplate={handleUseTemplate}
                    onEditTemplate={handleEditTemplate}
                    onDuplicateTemplate={handleDuplicateTemplate}
                    onDeleteTemplate={handleDeleteTemplate}
                    userRole={userRole}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 animate-fade-in" style={{animationDelay: '0.5s'}}>
              <Icon name="FileText" size={64} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-6">
                {filters?.search || filters?.type !== 'all' || filters?.category !== 'all' ?'Try adjusting your filters to see more templates' :'Create your first custom template to get started'
                }
              </p>
              {(!filters?.search && filters?.type === 'all' && filters?.category === 'all') && (
                <Button
                  variant="default"
                  onClick={handleCreateNew}
                  iconName="Plus"
                  iconPosition="left"
                  className="animate-bounce-in hover-lift"
                  style={{animationDelay: '0.7s'}}
                >
                  Create Your First Template
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      {/* Template Creation Panel */}
      <TemplateCreationPanel
        isOpen={isCreationPanelOpen}
        onClose={() => {
          setIsCreationPanelOpen(false);
          setEditingTemplate(null);
        }}
        onSaveTemplate={handleSaveTemplate}
        editingTemplate={editingTemplate}
      />
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        template={templateToDelete}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setTemplateToDelete(null);
        }}
      />
    </div>
  );
};

export default TemplateManagement;