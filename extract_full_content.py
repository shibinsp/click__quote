import docx
from docx import Document
import json
import re

def extract_all_content():
    # Load the document
    doc_path = r'quotaion template.docx'
    doc = Document(doc_path)
    
    print('=== EXTRACTING ALL DOCUMENT CONTENT ===')
    
    # Get all paragraphs with their text and formatting
    all_content = []
    for i, paragraph in enumerate(doc.paragraphs):
        text = paragraph.text.strip()
        if text:  # Only non-empty paragraphs
            # Check for formatting in runs
            is_bold = any(run.bold for run in paragraph.runs if run.bold)
            is_italic = any(run.italic for run in paragraph.runs if run.italic)
            
            all_content.append({
                'index': i,
                'text': text,
                'is_bold': is_bold,
                'is_italic': is_italic,
                'length': len(text)
            })
    
    print(f'Total non-empty paragraphs: {len(all_content)}')
    
    # Print all content with line numbers
    for i, para in enumerate(all_content):
        formatting = ""
        if para['is_bold']:
            formatting += " [BOLD]"
        if para['is_italic']:
            formatting += " [ITALIC]"
        print(f'{i+1:3d}: {para["text"]}{formatting}')
    
    print(f'\nTotal paragraphs: {len(all_content)}')
    print(f'Total characters: {sum(p["length"] for p in all_content)}')
    
    # Now organize into 14 pages based on content and logical breaks
    pages = {}
    
    # Define page break indicators and content distribution
    page_indicators = [
        # Page 1: Header and introduction
        ["Registered Office", "Dear Ali", "Site Address"],
        # Page 2: Summary and cost breakdown
        ["Summary of Your Request", "How much is it going to cost"],
        # Page 3: Price options and details
        ["Price excluding VAT", "Price including VAT", "Provisional Price"],
        # Page 4: Acceptance and payment terms
        ["Acceptance", "Payment Terms", "Invoicing"],
        # Page 5: Your responsibilities
        ["Your Responsibilities", "Generic Responsibilities"],
        # Page 6: Safety and compliance
        ["Safety", "Health and Safety", "Compliance"],
        # Page 7: Technical specifications
        ["Technical", "Specification", "Equipment"],
        # Page 8: Additional information
        ["Additional Information", "Drawing Schedule", "Job Specific"],
        # Pages 9-14: Additional content or appendices
    ]
    
    # Initialize all 14 pages
    for i in range(1, 15):
        pages[str(i)] = []
    
    # Distribute content across pages
    current_page = 1
    content_per_page = len(all_content) // 8  # Distribute main content across first 8 pages
    
    for i, content in enumerate(all_content):
        text = content['text']
        
        # Check for specific page indicators
        if any("Registered Office" in text or "Company:" in text for indicator in [text]):
            current_page = 1
        elif any(keyword in text for keyword in ["Summary of Your Request", "New service"]):
            current_page = 2
        elif any(keyword in text for keyword in ["How much is it going to cost", "Price excluding VAT"]):
            current_page = 3
        elif any(keyword in text for keyword in ["Provisional Price", "attention to the provisional"]):
            current_page = 4
        elif any(keyword in text for keyword in ["Acceptance", "signed copy"]):
            current_page = 5
        elif any(keyword in text for keyword in ["Your Responsibilities", "Job Specific Responsibilities"]):
            current_page = 6
        elif any(keyword in text for keyword in ["Generic Responsibilities", "Section  Information"]):
            current_page = 7
        elif any(keyword in text for keyword in ["Drawing Schedule", "Job Specific Information"]):
            current_page = 8
        
        # Add content to current page
        if current_page <= 8:
            pages[str(current_page)].append(content)
        
        # Move to next page after certain amount of content
        if len(pages[str(current_page)]) >= content_per_page and current_page < 8:
            current_page += 1
    
    # Save structured data
    structured_data = {
        'total_paragraphs': len(all_content),
        'total_characters': sum(p["length"] for p in all_content),
        'pages': pages
    }
    
    with open('complete_docx_content.json', 'w', encoding='utf-8') as f:
        json.dump(structured_data, f, indent=2, ensure_ascii=False)
    
    print(f'\n=== PAGE DISTRIBUTION ===')
    for page_num in range(1, 15):
        page_content = pages[str(page_num)]
        print(f'Page {page_num}: {len(page_content)} paragraphs')
        if page_content:
            print(f'  First: {page_content[0]["text"][:50]}...')
            if len(page_content) > 1:
                print(f'  Last: {page_content[-1]["text"][:50]}...')
    
    print('\nComplete content saved to complete_docx_content.json')
    return structured_data

if __name__ == "__main__":
    extract_all_content()