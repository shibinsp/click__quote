import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Edit3, Save, FileText, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const MultiPageTemplateEditor = ({ quotation }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [pageData, setPageData] = useState({
    1: {
      title: "UK Power Networks - Quotation Document",
      content: [
        { type: 'header', text: 'Registered Office\tCompany:', bold: false, italic: false },
        { type: 'text', text: 'Newington House\tUK Power Networks 237 Southwark Bridge Road (Operations) Limited London SE1 6NP', bold: false, italic: false },
        { type: 'text', text: 'Registered in England and Wales No: 3870728', bold: false, italic: false },
        { type: 'text', text: 'Date: 18 September 2024', bold: false, italic: false },
        { type: 'text', text: 'Our Ref: 8500308260 / QID 3500196138', bold: false, italic: false },
        { type: 'text', text: 'Customer Ref:', bold: false, italic: false },
        { type: 'text', text: 'Mahad Ali', bold: false, italic: false },
        { type: 'text', text: 'Ms. UK Power Op', bold: false, italic: false },
        { type: 'text', text: 'Fletcher Hs Cooper Standard Hs', bold: false, italic: false },
        { type: 'text', text: 'Cross Point Business Park, Redgrave Close', bold: false, italic: false },
        { type: 'text', text: 'COVENTRY', bold: false, italic: false },
        { type: 'text', text: 'CV2 2UU', bold: false, italic: false },
        { type: 'greeting', text: 'Dear Ali', bold: false, italic: false },
        { type: 'address', text: 'Site Address: Elephant Road / London SE17 1AY', bold: false, italic: false },
        { type: 'paragraph', text: 'I am writing to you on behalf of London Power Networks plc the licensed distributor of electricity for the above address trading as and referred to in the Quote as "UK Power Networks". Thank you for your recent enquiry regarding the above site. I am pleased to be able to provide you with this Quote to carry out the work requested.', bold: false, italic: false },
        { type: 'paragraph', text: 'The Works will enable the provision of an import capacity of 555.000 kVA,. and a maximum export capacity of KW.', bold: false, italic: false }
      ]
    },
    2: {
      title: "Summary of Your Request",
      content: [
        { type: 'header', text: 'Summary of Your Request', bold: false, italic: false },
        { type: 'text', text: 'New services for 6 onsite commercial units within archways.', bold: false, italic: false },
        { type: 'paragraph', text: 'UK Power Networks would like to carry out all of the requested work for you. However, other companies can do some or all of the work for you; these are known as Independent Connection Providers (ICPs). You can approach NERS accredited ICPs directly, or you can approach an Independent Distribution Network Operator (IDNO) to request this work and they will arrange for an ICP to carry out the Contestable Works. To find out more about which ICPs work in our area and what work they can undertake please click here.', bold: true, italic: false },
        { type: 'paragraph', text: 'To give you as much choice as possible we are able to offer you the following options for getting your work done:', bold: true, italic: false },
        { type: 'header', text: 'How much is it going to cost?', bold: false, italic: false },
        { type: 'table-header', text: 'Price excluding VAT\tPrice including VAT', bold: false, italic: false },
        { type: 'table-row', text: '£51,043.55\t£63,652.74', bold: false, italic: false },
        { type: 'table-row', text: 'Not Applicable\tNot Applicable', bold: false, italic: false },
        { type: 'table-row', text: '£5,396.82\t£6,476.18', bold: false, italic: false },
        { type: 'paragraph', text: 'A short guide is available to help you understand the three different Prices (options A, B and C). To see this guide please click here.', bold: false, italic: false }
      ]
    },
    3: {
      title: "Provisional Price and Terms",
      content: [
        { type: 'header', text: 'Provisional Price', bold: false, italic: false },
        { type: 'paragraph', text: 'I would like to draw to your attention to the provisional nature of the Quote. At the date of issue, the detailed design', bold: false, italic: false },
        { type: 'paragraph', text: 'and/or the procurement process is not complete and the proposed design is dependent on securing Consents and Land Rights that have not yet been obtained from third parties. We will notify you in writing if the Works, the completion date or the Price need to be adjusted once the detailed design and the procurement process is complete and the Consents and Land Rights have been obtained.', bold: false, italic: false },
        { type: 'header', text: 'Terms and Conditions', bold: false, italic: false },
        { type: 'paragraph', text: 'The Quote is subject to version 7 (September 2016) of our Terms and Conditions For Connection and Diversionary Works (the "Terms and Conditions") which you can view here. Alternatively, please let me know if you would like me to send you a copy in the post. The Terms and Conditions create legally binding obligations and, amongst other things, contain caps and exclusions on UK Power Networks\' liability to you and grounds for variation and termination. Therefore, it is important that you take the time to read and understand them. They also contain definitions of terms used in this document and in the linked pages on our website, which you may find helpful such as "DNO" and "DNO Works".', bold: true, italic: false }
      ]
    },
    4: {
      title: "Special Conditions",
      content: [
        { type: 'header', text: 'Special Conditions', bold: false, italic: false },
        { type: 'paragraph', text: 'The Quote is subject to and conditional upon the following conditions:-', bold: false, italic: false },
        { type: 'bullet', text: 'You are under an obligation to provide the required Planning Permissions (if applicable) for Your Works, associated plans, reports and documents with the Planning Permission (for example landscaping plans) and to keep the DNO informed of any changes to the same throughout the Works.', bold: false, italic: false },
        { type: 'bullet', text: 'All onsite groundworks are the responsibility of the customer', bold: false, italic: false },
        { type: 'bullet', text: 'the customer is to provide access and on-site parking', bold: false, italic: false },
        { type: 'bullet', text: 'it is assumed all works are within site boundary.', bold: false, italic: false },
        { type: 'bullet', text: 'This quotation is provisional based on the completion of works under 820005221', bold: false, italic: false },
        { type: 'header', text: 'Compliance with Engineering Recommendations P28, P29 and G5/5', bold: false, italic: false },
        { type: 'paragraph', text: 'If this Quote provides for export capacity (that may include install solar panels or battery storage) or import capacity with disturbing loads (that may include electric vehicle charging), you will be responsible for compliance with Engineering Recommendations P28, P29 and G5/5. More information about these Recommendations can be found here.', bold: false, italic: false },
        { type: 'paragraph', text: 'You may be asked to demonstrate compliance with Engineering Recommendations P28, P29 and/or G5/5.', bold: false, italic: false },
        { type: 'paragraph', text: 'UK Power Networks may refuse to allow connection of generation to our network where compliance cannot be demonstrated. Where the installation needs to be Witness Tested compliance reports will need to be provided in advance of booking a date for the Witness Test to be undertaken.', bold: false, italic: false }
      ]
    },
    5: {
      title: "Connection Timeline and Dependencies",
      content: [
        { type: 'header', text: 'When can you expect your electricity connection?', bold: false, italic: false },
        { type: 'paragraph', text: 'Once you have accepted the Quote we will call you to discuss a programme of Works. Subject to the terms of the Quote, the DNO Works referred to in the Quote will be completed on or before 31 January 2025.', bold: false, italic: false },
        { type: 'paragraph', text: 'We will try to meet your requested dates wherever possible but the completion date will be dependent on: The date that the Quote is accepted;', bold: false, italic: false },
        { type: 'bullet', text: 'How much of the Works you wish UK Power Networks to complete;', bold: false, italic: false },
        { type: 'bullet', text: 'Any further discussions we may have with you regarding the programming of the DNO Works;', bold: false, italic: false },
        { type: 'bullet', text: 'The completion of work by other people or companies that must be done before we can complete our DNO Works;', bold: false, italic: false },
        { type: 'bullet', text: 'Approval of your design and programme for the Contestable Works by UK Power Networks (if applicable);', bold: false, italic: false },
        { type: 'bullet', text: 'Obtaining full access to the Site;', bold: false, italic: false },
        { type: 'bullet', text: 'UK Power Networks obtaining all necessary Consents and Land Rights in a timely manner;', bold: false, italic: false },
        { type: 'paragraph', text: 'Any delay to the Works due to: unplanned outages (i.e. breakdown or failure of electric power); or availability of planned outages (i.e. temporary suspension or withdrawal of electric power) to carry out certain works on UK Power Networks\' distribution system;', bold: false, italic: false },
        { type: 'paragraph', text: 'Please read the details in this section in conjunction with our Terms and Conditions. Please let me know if you think we can improve the information we have provided.', bold: false, italic: false }
      ]
    },
    6: {
      title: "Acceptance Process",
      content: [
        { type: 'paragraph', text: 'If you would like to accept the Quote you will need to ensure that the requested payment is in UK Power Networks\' nominated bank account in full and cleared funds and that we have received your signed Acceptance Form from section 5 below by 5pm on 17 March 2025.', bold: false, italic: false },
        { type: 'header', text: 'Acceptance Form', bold: false, italic: false },
        { type: 'paragraph', text: 'Email: ConnectionAcceptance@ukpowernetworks.co.uk', bold: true, italic: false },
        { type: 'paragraph', text: 'To accept the Quote, the signed Acceptance Form and payment in cleared funds must reach UK Power Networks by 5pm on 17 March 2025. Acceptance Forms and payments received after this date may be returned and you will need to request a new Quote.', bold: false, italic: false },
        { type: 'reference', text: 'Job Reference: 8500308260 / 3500196138', bold: false, italic: false },
        { type: 'header', text: 'Acceptance Form Part 2', bold: false, italic: false },
        { type: 'subheader', text: 'Land Rights', bold: false, italic: false },
        { type: 'paragraph', text: 'If you are appointing a Solicitor to complete any legal work associated with acquiring substation sites and easements work, please provide UK Power Networks with their details by completing the table below.', bold: false, italic: false },
        { type: 'paragraph', text: 'Please also provide us with the name and address of the owner of any affected land.', bold: false, italic: false },
        { type: 'reference', text: 'Job Reference: 8500308260 / 3500196138', bold: false, italic: false }
      ]
    },
    7: {
      title: "Your Responsibilities",
      content: [
        { type: 'header', text: 'Your Responsibilities', bold: false, italic: false },
        { type: 'subheader', text: 'Job Specific Responsibilities', bold: false, italic: false },
        { type: 'subheader', text: 'Generic Responsibilities Applicable to all Quotes', bold: false, italic: false },
        { type: 'paragraph', text: 'Before you decide to proceed it is very important that you read the information in this section in conjunction with our Terms and Conditions. Please let me know if you think we can improve the information we have provided.', bold: false, italic: false },
        { type: 'paragraph', text: 'You must ensure that you have obtained all necessary consents, permissions and approvals required for Your Works including but not limited to planning permission, building regulations approval, listed building consent, conservation area consent, scheduled monument consent, and any other statutory consents.', bold: false, italic: false },
        { type: 'paragraph', text: 'You must provide safe access to the Site for UK Power Networks personnel and contractors at all reasonable times during normal working hours and at such other times as may be agreed.', bold: false, italic: false }
      ]
    },
    8: {
      title: "Information and Drawing Schedule",
      content: [
        { type: 'header', text: 'Section  Information to Help You Plan For Your Work', bold: false, italic: false },
        { type: 'subheader', text: 'Drawing Schedule', bold: false, italic: false },
        { type: 'paragraph', text: 'The table below shows a summary of the standard drawings that may be useful for the Quote, along with hyperlinks to the drawings that are currently applicable. Our drawings are revised periodically so the links in the table below may not work in the future if the drawings are superseded. However the latest versions of all of our standard drawings can be found here. If you have not used our G81 web pages before you will be asked to register your credentials for future logins and updates.', bold: false, italic: false },
        { type: 'subheader', text: 'Job Specific Information', bold: false, italic: false },
        { type: 'subheader', text: 'Generic Information Applicable to all Quotes', bold: false, italic: false },
        { type: 'paragraph', text: 'If you are unhappy with our service please follow our Complaints Procedure Specific to Commercial and Industrial Projects which can be found here. This document details your right to contact Ofgem for a formal determination if we have been unable to resolve the matter to your satisfaction.', bold: false, italic: false },
        { type: 'paragraph', text: 'All electrical installation work must be carried out by a competent person in accordance with the current edition of the IET Wiring Regulations (BS 7671) and must be tested and certified accordingly.', bold: false, italic: false },
        { type: 'paragraph', text: 'You must ensure that all equipment connected to our network complies with the relevant British Standards and European Norms.', bold: false, italic: false }
      ]
    },
    9: {
      title: "Safety and Compliance Requirements",
      content: [
        { type: 'header', text: 'Safety and Compliance Requirements', bold: false, italic: false },
        { type: 'paragraph', text: 'All work must be carried out in accordance with the Health and Safety at Work etc. Act 1974 and all other relevant health and safety legislation.', bold: false, italic: false },
        { type: 'paragraph', text: 'You must ensure that all personnel working on the Site are competent and appropriately trained for the work they are undertaking.', bold: false, italic: false },
        { type: 'paragraph', text: 'Risk assessments and method statements must be prepared for all work activities and copies provided to UK Power Networks upon request.', bold: false, italic: false },
        { type: 'paragraph', text: 'All excavation work must be carried out in accordance with HSE guidance HSG47 "Avoiding danger from underground services".', bold: false, italic: false },
        { type: 'paragraph', text: 'You must ensure that appropriate insurance cover is in place for all work activities as specified in our Terms and Conditions.', bold: false, italic: false }
      ]
    },
    10: {
      title: "Technical Standards and Specifications",
      content: [
        { type: 'header', text: 'Technical Standards and Specifications', bold: false, italic: false },
        { type: 'paragraph', text: 'All equipment and materials used must comply with the relevant British Standards, European Norms, and UK Power Networks\' technical specifications.', bold: false, italic: false },
        { type: 'paragraph', text: 'Cable installation must be in accordance with UK Power Networks\' standard drawings and specifications.', bold: false, italic: false },
        { type: 'paragraph', text: 'All jointing and termination work must be carried out by personnel approved by UK Power Networks.', bold: false, italic: false },
        { type: 'paragraph', text: 'Testing and commissioning must be carried out in accordance with UK Power Networks\' procedures and witnessed by our representatives where required.', bold: false, italic: false },
        { type: 'paragraph', text: 'All protection settings and control schemes must be approved by UK Power Networks before energisation.', bold: false, italic: false }
      ]
    },
    11: {
      title: "Environmental and Planning Considerations",
      content: [
        { type: 'header', text: 'Environmental and Planning Considerations', bold: false, italic: false },
        { type: 'paragraph', text: 'All work must be carried out with due regard to environmental protection and sustainability.', bold: false, italic: false },
        { type: 'paragraph', text: 'Any work affecting protected species or habitats must be carried out under appropriate licences and with ecological supervision where required.', bold: false, italic: false },
        { type: 'paragraph', text: 'Noise and dust control measures must be implemented to minimise impact on local residents and businesses.', bold: false, italic: false },
        { type: 'paragraph', text: 'All waste materials must be disposed of in accordance with current waste management regulations.', bold: false, italic: false },
        { type: 'paragraph', text: 'Traffic management plans must be agreed with the relevant highway authority where work affects public highways.', bold: false, italic: false }
      ]
    },
    12: {
      title: "Quality Assurance and Documentation",
      content: [
        { type: 'header', text: 'Quality Assurance and Documentation', bold: false, italic: false },
        { type: 'paragraph', text: 'All work must be subject to appropriate quality assurance procedures and documentation.', bold: false, italic: false },
        { type: 'paragraph', text: 'As-built drawings must be provided showing the final installation details and any deviations from the original design.', bold: false, italic: false },
        { type: 'paragraph', text: 'Test certificates and commissioning records must be provided for all electrical installations.', bold: false, italic: false },
        { type: 'paragraph', text: 'Operation and maintenance manuals must be provided for all installed equipment.', bold: false, italic: false },
        { type: 'paragraph', text: 'All documentation must be provided in both hard copy and electronic format as specified by UK Power Networks.', bold: false, italic: false }
      ]
    },
    13: {
      title: "Warranty and Maintenance",
      content: [
        { type: 'header', text: 'Warranty and Maintenance', bold: false, italic: false },
        { type: 'paragraph', text: 'All equipment and workmanship must be warranted for a minimum period of 12 months from the date of commissioning.', bold: false, italic: false },
        { type: 'paragraph', text: 'Defects liability period shall commence from the date of successful commissioning and acceptance by UK Power Networks.', bold: false, italic: false },
        { type: 'paragraph', text: 'Maintenance requirements and schedules must be agreed with UK Power Networks before commissioning.', bold: false, italic: false },
        { type: 'paragraph', text: 'Emergency contact details must be provided for 24/7 response to equipment failures or safety issues.', bold: false, italic: false },
        { type: 'paragraph', text: 'Spare parts availability and support arrangements must be confirmed for all installed equipment.', bold: false, italic: false }
      ]
    },
    14: {
      title: "Contact Information and Final Notes",
      content: [
        { type: 'header', text: 'Contact Information', bold: false, italic: false },
        { type: 'paragraph', text: 'For technical queries regarding this quotation, please contact our Engineering team.', bold: false, italic: false },
        { type: 'paragraph', text: 'For commercial and contractual matters, please contact our Commercial team.', bold: false, italic: false },
        { type: 'paragraph', text: 'For emergency situations affecting the electricity network, please call our 24-hour emergency number.', bold: false, italic: false },
        { type: 'header', text: 'Final Notes', bold: false, italic: false },
        { type: 'paragraph', text: 'This quotation is valid for 90 days from the date of issue.', bold: false, italic: false },
        { type: 'paragraph', text: 'UK Power Networks reserves the right to review and amend this quotation if circumstances change.', bold: false, italic: false },
        { type: 'paragraph', text: 'Thank you for choosing UK Power Networks for your electricity connection requirements.', bold: false, italic: false },
        { type: 'reference', text: 'Document Reference: UKPN-QUO-2024-8500308260', bold: false, italic: false }
      ]
    }
  });

  const totalPages = 14;

  const handleEditTemplate = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveTemplate = () => {
    setIsEditing(false);
    console.log('Saving template data:', pageData);
  };

  const handleDownloadPDF = async () => {
    try {
      console.log('Starting PDF generation...');
      console.log('Page data:', pageData);
      console.log('Total pages:', totalPages);
      
      // Create a temporary container for all pages
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '794px'; // A4 width in pixels (210mm)
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.fontSize = '12px';
      tempContainer.style.lineHeight = '1.4';
      tempContainer.style.color = '#000';
      
      document.body.appendChild(tempContainer);

      // Generate content for all pages
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const currentPageData = pageData[pageNum];
        console.log(`Processing page ${pageNum}:`, currentPageData);
        
        if (!currentPageData || !currentPageData.content || currentPageData.content.length === 0) {
          console.log(`Skipping page ${pageNum} - no content`);
          continue;
        }

        // Create page container
        const pageContainer = document.createElement('div');
        pageContainer.style.pageBreakAfter = pageNum < totalPages ? 'always' : 'auto';
        pageContainer.style.padding = '40px';
        pageContainer.style.minHeight = '1000px'; // A4 height in pixels
        pageContainer.style.width = '100%';
        pageContainer.style.boxSizing = 'border-box';

        // Add UK Power Networks header
        const header = document.createElement('div');
        header.style.textAlign = 'center';
        header.style.marginBottom = '30px';
        header.style.borderBottom = '3px solid #dc2626';
        header.style.paddingBottom = '20px';
        
        const headerTitle = document.createElement('h1');
        headerTitle.style.margin = '0 0 5px 0';
        headerTitle.style.fontSize = '24px';
        headerTitle.style.fontWeight = 'bold';
        headerTitle.style.color = '#dc2626';
        headerTitle.textContent = 'UK Power Networks';
        
        const headerSubtitle = document.createElement('p');
        headerSubtitle.style.margin = '0 0 15px 0';
        headerSubtitle.style.fontSize = '12px';
        headerSubtitle.style.color = '#666';
        headerSubtitle.textContent = 'Delivering your electricity';
        
        const pageTitle = document.createElement('h2');
        pageTitle.style.margin = '0';
        pageTitle.style.fontSize = '16px';
        pageTitle.style.fontWeight = '600';
        pageTitle.style.color = '#333';
        pageTitle.textContent = currentPageData.title;
        
        header.appendChild(headerTitle);
        header.appendChild(headerSubtitle);
        header.appendChild(pageTitle);
        pageContainer.appendChild(header);

        // Add page content
        const contentContainer = document.createElement('div');
        contentContainer.style.marginTop = '20px';
        
        currentPageData.content.forEach((item, index) => {
          console.log(`Processing item ${index}:`, item);
          
          const element = document.createElement('div');
          element.style.marginBottom = '12px';
          element.style.lineHeight = '1.6';
          element.style.wordWrap = 'break-word';
          
          // Apply styling based on content type
          switch (item.type) {
            case 'header':
              element.style.fontSize = '16px';
              element.style.fontWeight = 'bold';
              element.style.color = '#dc2626';
              element.style.borderBottom = '2px solid #ccc';
              element.style.paddingBottom = '8px';
              element.style.marginBottom = '16px';
              element.style.marginTop = '20px';
              break;
            case 'subheader':
              element.style.fontSize = '14px';
              element.style.fontWeight = '600';
              element.style.color = '#333';
              element.style.marginTop = '18px';
              element.style.marginBottom = '10px';
              break;
            case 'paragraph':
              element.style.textAlign = 'justify';
              element.style.marginBottom = '12px';
              element.style.fontSize = '12px';
              break;
            case 'text':
              element.style.marginBottom = '8px';
              element.style.fontSize = '12px';
              break;
            case 'greeting':
              element.style.fontWeight = '500';
              element.style.marginBottom = '15px';
              element.style.fontSize = '12px';
              break;
            case 'address':
              element.style.fontWeight = '500';
              element.style.backgroundColor = '#f9f9f9';
              element.style.padding = '12px';
              element.style.borderRadius = '4px';
              element.style.marginBottom = '15px';
              element.style.fontSize = '12px';
              break;
            case 'bullet':
              element.style.marginLeft = '25px';
              element.style.position = 'relative';
              element.style.fontSize = '12px';
              element.innerHTML = '• ' + (item.text || '');
              break;
            case 'table-header':
              element.style.fontWeight = 'bold';
              element.style.backgroundColor = '#f3f4f6';
              element.style.padding = '10px';
              element.style.border = '1px solid #d1d5db';
              element.style.borderRadius = '4px';
              element.style.fontSize = '12px';
              break;
            case 'table-row':
              element.style.padding = '8px 10px';
              element.style.borderBottom = '1px solid #e5e7eb';
              element.style.fontSize = '12px';
              break;
            case 'reference':
              element.style.fontSize = '10px';
              element.style.color = '#666';
              element.style.fontFamily = 'monospace';
              element.style.backgroundColor = '#f9f9f9';
              element.style.padding = '8px';
              element.style.borderRadius = '3px';
              element.style.marginTop = '15px';
              break;
            default:
              element.style.fontSize = '12px';
              break;
          }

          // Apply bold and italic formatting
          if (item.bold) element.style.fontWeight = 'bold';
          if (item.italic) element.style.fontStyle = 'italic';

          // Handle table formatting for tab-separated content
          if (item.text && item.text.includes('\t')) {
            const parts = item.text.split('\t');
            element.innerHTML = parts.map(part => 
              `<span style="display: inline-block; min-width: 250px; vertical-align: top; padding-right: 20px;">${part}</span>`
            ).join('');
          } else if (item.type !== 'bullet') {
            element.textContent = item.text || '';
          }

          contentContainer.appendChild(element);
        });

        pageContainer.appendChild(contentContainer);
        tempContainer.appendChild(pageContainer);
      }

      console.log('Generated HTML content for PDF:', tempContainer.innerHTML.substring(0, 500) + '...');

      // Configure PDF options with better settings
      const opt = {
        margin: [15, 15, 15, 15],
        filename: 'UK_Power_Networks_Quotation_Template.pdf',
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { 
          scale: 1.5,
          useCORS: true,
          letterRendering: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: true,
          width: 794,
          height: 1123
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };

      // Generate and download PDF
      console.log('Generating PDF with html2pdf...');
      const pdfBlob = await html2pdf().set(opt).from(tempContainer).outputPdf('blob');
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'UK_Power_Networks_Quotation_Template.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('PDF generated and downloaded successfully!');
      
      // Clean up
      document.body.removeChild(tempContainer);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please check the console for details.');
    }
  };

  const updateContentItem = (pageNum, itemIndex, newText) => {
    setPageData(prev => ({
      ...prev,
      [pageNum]: {
        ...prev[pageNum],
        content: prev[pageNum].content.map((item, index) => 
          index === itemIndex ? { ...item, text: newText } : item
        )
      }
    }));
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderContentItem = (item, itemIndex, pageNum) => {
    const baseClasses = "mb-3 leading-relaxed";
    const typeClasses = {
      header: "text-lg font-bold text-ukpn-red border-b border-gray-300 pb-2",
      subheader: "text-md font-semibold text-gray-800 mt-4",
      paragraph: "text-gray-700 text-justify",
      text: "text-gray-700",
      greeting: "text-gray-700 font-medium",
      address: "text-gray-800 font-medium bg-gray-50 p-2 rounded",
      bullet: "text-gray-700 ml-4 relative before:content-['•'] before:absolute before:-ml-4",
      'table-header': "font-bold text-gray-800 bg-gray-100 p-2 rounded border",
      'table-row': "text-gray-700 p-2 border-b",
      reference: "text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded"
    };

    const className = `${baseClasses} ${typeClasses[item.type] || typeClasses.text} ${
      item.bold ? 'font-bold' : ''
    } ${item.italic ? 'italic' : ''}`;

    if (isEditing) {
      return (
        <textarea
          key={itemIndex}
          value={item.text}
          onChange={(e) => updateContentItem(pageNum, itemIndex, e.target.value)}
          className={`${className} w-full border border-gray-300 rounded p-2 resize-none`}
          rows={Math.max(2, Math.ceil(item.text.length / 80))}
        />
      );
    }

    return (
      <div key={itemIndex} className={className}>
        {item.text.includes('\t') ? (
          <div className="grid grid-cols-2 gap-4">
            {item.text.split('\t').map((part, i) => (
              <div key={i}>{part}</div>
            ))}
          </div>
        ) : (
          item.text
        )}
      </div>
    );
  };

  const renderPage = () => {
    const currentPageData = pageData[currentPage];
    
    if (!currentPageData) {
      return (
        <div className="text-center text-gray-500">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p>Page {currentPage} content not available</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Page Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <img src="/ukpnicon.png" alt="UK Power Networks" className="h-12 mr-3" />
            <div>
              <h1 className="text-xl font-bold text-ukpn-red">UK Power Networks</h1>
              <p className="text-sm text-gray-600">Delivering your electricity</p>
            </div>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">{currentPageData.title}</h2>
        </div>

        {/* Page Content */}
        <div className="space-y-2">
          {currentPageData.content.map((item, index) => 
            renderContentItem(item, index, currentPage)
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* Header with Edit Controls */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            UK Power Networks Template - Page {currentPage} of {totalPages}
          </h2>
          <p className="text-sm text-gray-600">14-Page Quotation Template</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Download size={16} className="mr-1" />
            Download PDF
          </button>
          {isEditing && (
            <button
              onClick={handleSaveTemplate}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <Save size={16} className="mr-1" />
              Save Template
            </button>
          )}
          <button
            onClick={handleEditTemplate}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              isEditing 
                ? 'bg-gray-600 text-white hover:bg-gray-700' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            <Edit3 size={16} className="mr-1" />
            {isEditing ? 'Cancel Edit' : 'Edit Template'}
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div className="p-8 min-h-[600px] bg-white">
        {renderPage()}
      </div>

      {/* Navigation Controls */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            currentPage === 1
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          <ChevronLeft size={16} className="mr-1" />
          Previous Page
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Page</span>
          <select
            value={currentPage}
            onChange={(e) => setCurrentPage(parseInt(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            {Array.from({ length: totalPages }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-600">of {totalPages}</span>
        </div>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            currentPage === totalPages
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          Next Page
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default MultiPageTemplateEditor;