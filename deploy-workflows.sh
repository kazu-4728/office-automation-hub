#!/bin/bash
# Auto-generated GitHub Actions Deployment Script
# This script will automatically deploy all workflows

echo "🚀 Starting automated workflow deployment..."

# Check if gh CLI is available
if ! command -v gh &> /dev/null; then
    echo "📦 Installing GitHub CLI..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install gh
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
        sudo apt update
        sudo apt install gh
    fi
fi

# Authenticate if needed
if ! gh auth status &> /dev/null; then
    echo "🔐 Please authenticate with GitHub..."
    gh auth login
fi

# Deploy workflows using gh CLI
echo "📝 Creating workflow files..."

echo "Creating agent-main.yml..."
gh api repos/kazu-4728/office-automation-hub/contents/.github/workflows/agent-main.yml \
  --method PUT \
  --field message="🚀 Deploy agent-main.yml" \
  --field content="$(echo 'name: 🤖 AI Agent Main Controller

on:
  # Issues-based task triggering
  issues:
    types: [opened, edited, labeled]
  
  # Pull request-based task triggering
  pull_request:
    types: [opened, edited, labeled]
  
  # Repository dispatch for external triggers
  repository_dispatch:
    types: [agent-task, scrape-request, pdf-process, slide-generate]
  
  # Schedule for periodic tasks
  schedule:
    - cron: '\''0 */6 * * *'\''  # Every 6 hours
  
  # Manual trigger
  workflow_dispatch:
    inputs:
      task_type:
        description: '\''Task Type'\''
        required: true
        default: '\''status'\''
        type: choice
        options:
        - status
        - scraping
        - pdf-ocr
        - slide-generation
        - data-processing
        - full-pipeline
      target_url:
        description: '\''Target URL (for scraping)'\''
        required: false
        type: string
      output_format:
        description: '\''Output Format'\''
        required: false
        default: '\''json'\''
        type: choice
        options:
        - json
        - csv
        - pdf
        - pptx
        - markdown
      parameters:
        description: '\''Additional Parameters (JSON)'\''
        required: false
        type: string
        default: '\''{}'\''

env:
  AGENT_VERSION: "2.0.0"
  PYTHON_VERSION: "3.11"
  NODE_VERSION: "20"

jobs:
  agent-orchestrator:
    name: 🎯 Agent Task Orchestrator
    runs-on: ubuntu-latest
    timeout-minutes: 60
    
    outputs:
      task-id: ${{ steps.generate-task-id.outputs.task_id }}
      task-type: ${{ steps.parse-task.outputs.task_type }}
      should-proceed: ${{ steps.parse-task.outputs.should_proceed }}
    
    steps:
    - name: 📥 Checkout Repository
      uses: actions/checkout@v4
      with:
        token: ${{ secrets.GITHUB_TOKEN }}
        fetch-depth: 0

    - name: 🆔 Generate Task ID
      id: generate-task-id
      run: |
        TASK_ID="task-$(date +%Y%m%d-%H%M%S)-$(echo $RANDOM | md5sum | head -c 8)"
        echo "task_id=$TASK_ID" >> $GITHUB_OUTPUT
        echo "Generated Task ID: $TASK_ID"

    - name: 🔍 Parse Task Request
      id: parse-task
      run: |
        echo "Parsing task request..."
        
        # Initialize variables
        TASK_TYPE="status"
        SHOULD_PROCEED="false"
        
        # Check trigger source
        if [ "${{ github.event_name }}" = "workflow_dispatch" ]; then
          TASK_TYPE="${{ github.event.inputs.task_type }}"
          SHOULD_PROCEED="true"
          echo "Manual trigger detected: $TASK_TYPE"
          
        elif [ "${{ github.event_name }}" = "issues" ]; then
          # Parse issue title and body for tasks
          ISSUE_TITLE="${{ github.event.issue.title }}"
          echo "Issue trigger: $ISSUE_TITLE"
          
          if [[ "$ISSUE_TITLE" == *"[SCRAPE]"* ]]; then
            TASK_TYPE="scraping"
            SHOULD_PROCEED="true"
          elif [[ "$ISSUE_TITLE" == *"[PDF]"* ]]; then
            TASK_TYPE="pdf-ocr"
            SHOULD_PROCEED="true"
          elif [[ "$ISSUE_TITLE" == *"[SLIDE]"* ]]; then
            TASK_TYPE="slide-generation"
            SHOULD_PROCEED="true"
          elif [[ "$ISSUE_TITLE" == *"[AGENT]"* ]]; then
            TASK_TYPE="full-pipeline"
            SHOULD_PROCEED="true"
          fi
          
        elif [ "${{ github.event_name }}" = "repository_dispatch" ]; then
          TASK_TYPE="${{ github.event.client_payload.task_type }}"
          SHOULD_PROCEED="true"
          echo "Repository dispatch: $TASK_TYPE"
          
        elif [ "${{ github.event_name }}" = "schedule" ]; then
          TASK_TYPE="status"
          SHOULD_PROCEED="true"
          echo "Scheduled maintenance task"
        fi
        
        echo "task_type=$TASK_TYPE" >> $GITHUB_OUTPUT
        echo "should_proceed=$SHOULD_PROCEED" >> $GITHUB_OUTPUT
        echo "Final Task Type: $TASK_TYPE, Proceed: $SHOULD_PROCEED"

    - name: 🚀 Setup Agent Environment
      if: steps.parse-task.outputs.should_proceed == '\''true'\''
      run: |
        echo "Setting up agent environment..."
        
        # Create agent workspace
        mkdir -p /tmp/agent-workspace
        cd /tmp/agent-workspace
        
        # Setup Python environment
        python3 -m pip install --upgrade pip
        
        # Install core dependencies
        pip install requests beautifulsoup4 selenium pandas numpy
        pip install PyPDF2 pdf2image pytesseract pillow
        pip install python-pptx jinja2 markdown
        pip install asyncio aiohttp lxml cssselect
        
        # Install additional tools based on task type
        TASK_TYPE="${{ steps.parse-task.outputs.task_type }}"
        
        if [[ "$TASK_TYPE" == "scraping" || "$TASK_TYPE" == "full-pipeline" ]]; then
          pip install scrapy playwright
          playwright install chromium
        fi
        
        if [[ "$TASK_TYPE" == "pdf-ocr" || "$TASK_TYPE" == "full-pipeline" ]]; then
          sudo apt-get update
          sudo apt-get install -y tesseract-ocr tesseract-ocr-jpn poppler-utils
        fi
        
        if [[ "$TASK_TYPE" == "slide-generation" || "$TASK_TYPE" == "full-pipeline" ]]; then
          pip install reportlab matplotlib seaborn plotly
        fi
        
        echo "Agent environment setup completed"

    - name: 📊 Agent Status Report
      run: |
        echo "## 🤖 Agent Status Report - $(date)" >> $GITHUB_STEP_SUMMARY
        echo "- **Task ID**: ${{ steps.generate-task-id.outputs.task_id }}" >> $GITHUB_STEP_SUMMARY
        echo "- **Task Type**: ${{ steps.parse-task.outputs.task_type }}" >> $GITHUB_STEP_SUMMARY
        echo "- **Trigger**: ${{ github.event_name }}" >> $GITHUB_STEP_SUMMARY
        echo "- **Repository**: ${{ github.repository }}" >> $GITHUB_STEP_SUMMARY
        echo "- **Agent Version**: ${{ env.AGENT_VERSION }}" >> $GITHUB_STEP_SUMMARY
        echo "- **Status**: ✅ Active and Ready" >> $GITHUB_STEP_SUMMARY

  execute-scraping-task:
    name: 🕷️ Execute Scraping Task
    needs: agent-orchestrator
    if: needs.agent-orchestrator.outputs.should-proceed == '\''true'\'' && (needs.agent-orchestrator.outputs.task-type == '\''scraping'\'' || needs.agent-orchestrator.outputs.task-type == '\''full-pipeline'\'')
    uses: ./.github/workflows/task-scraping.yml
    with:
      task-id: ${{ needs.agent-orchestrator.outputs.task-id }}
      target-url: ${{ github.event.inputs.target_url || github.event.issue.body || '\''https://example.com'\'' }}
    secrets: inherit

  execute-pdf-ocr-task:
    name: 📄 Execute PDF/OCR Task
    needs: [agent-orchestrator, execute-scraping-task]
    if: always() && needs.agent-orchestrator.outputs.should-proceed == '\''true'\'' && (needs.agent-orchestrator.outputs.task-type == '\''pdf-ocr'\'' || needs.agent-orchestrator.outputs.task-type == '\''full-pipeline'\'')
    uses: ./.github/workflows/task-pdf-ocr.yml
    with:
      task-id: ${{ needs.agent-orchestrator.outputs.task-id }}
      input-source: ${{ needs.execute-scraping-task.result || '\''manual'\'' }}
    secrets: inherit

  execute-slide-generation-task:
    name: 🎨 Execute Slide Generation Task
    needs: [agent-orchestrator, execute-pdf-ocr-task]
    if: always() && needs.agent-orchestrator.outputs.should-proceed == '\''true'\'' && (needs.agent-orchestrator.outputs.task-type == '\''slide-generation'\'' || needs.agent-orchestrator.outputs.task-type == '\''full-pipeline'\'')
    uses: ./.github/workflows/task-slide-gen.yml
    with:
      task-id: ${{ needs.agent-orchestrator.outputs.task-id }}
      data-source: ${{ needs.execute-pdf-ocr-task.result || '\''manual'\'' }}
    secrets: inherit

  finalize-task:
    name: 🎯 Finalize Task
    needs: [agent-orchestrator, execute-scraping-task, execute-pdf-ocr-task, execute-slide-generation-task]
    if: always() && needs.agent-orchestrator.outputs.should-proceed == '\''true'\''
    runs-on: ubuntu-latest
    
    steps:
    - name: 📥 Checkout Repository
      uses: actions/checkout@v4

    - name: 📝 Generate Final Report
      run: |
        echo "## 🎯 Task Execution Report" >> $GITHUB_STEP_SUMMARY
        echo "**Task ID**: ${{ needs.agent-orchestrator.outputs.task-id }}" >> $GITHUB_STEP_SUMMARY
        echo "**Completed**: $(date)" >> $GITHUB_STEP_SUMMARY
        echo "" >> $GITHUB_STEP_SUMMARY
        echo "### Results Summary:" >> $GITHUB_STEP_SUMMARY
        
        if [[ "${{ needs.execute-scraping-task.result }}" == "success" ]]; then
          echo "✅ Scraping: Completed successfully" >> $GITHUB_STEP_SUMMARY
        elif [[ "${{ needs.execute-scraping-task.result }}" == "failure" ]]; then
          echo "❌ Scraping: Failed" >> $GITHUB_STEP_SUMMARY
        else
          echo "⏭️ Scraping: Skipped" >> $GITHUB_STEP_SUMMARY
        fi
        
        if [[ "${{ needs.execute-pdf-ocr-task.result }}" == "success" ]]; then
          echo "✅ PDF/OCR: Completed successfully" >> $GITHUB_STEP_SUMMARY
        elif [[ "${{ needs.execute-pdf-ocr-task.result }}" == "failure" ]]; then
          echo "❌ PDF/OCR: Failed" >> $GITHUB_STEP_SUMMARY
        else
          echo "⏭️ PDF/OCR: Skipped" >> $GITHUB_STEP_SUMMARY
        fi
        
        if [[ "${{ needs.execute-slide-generation-task.result }}" == "success" ]]; then
          echo "✅ Slide Generation: Completed successfully" >> $GITHUB_STEP_SUMMARY
        elif [[ "${{ needs.execute-slide-generation-task.result }}" == "failure" ]]; then
          echo "❌ Slide Generation: Failed" >> $GITHUB_STEP_SUMMARY
        else
          echo "⏭️ Slide Generation: Skipped" >> $GITHUB_STEP_SUMMARY
        fi

    - name: 📤 Upload Results
      uses: actions/upload-artifact@v4
      with:
        name: agent-results-${{ needs.agent-orchestrator.outputs.task-id }}
        path: outputs/
        retention-days: 30' | base64)"

echo "Creating task-pdf-ocr.yml..."
gh api repos/kazu-4728/office-automation-hub/contents/.github/workflows/task-pdf-ocr.yml \
  --method PUT \
  --field message="🚀 Deploy task-pdf-ocr.yml" \
  --field content="$(echo 'name: 📄 PDF Processing & OCR Engine

on:
  workflow_call:
    inputs:
      task-id:
        required: true
        type: string
      input-source:
        required: false
        type: string
        default: '\''manual'\''
      pdf-url:
        required: false
        type: string
      processing-mode:
        required: false
        type: string
        default: '\''full'\''
      ocr-language:
        required: false
        type: string
        default: '\''jpn+eng'\''
      output-format:
        required: false
        type: string
        default: '\''json'\''

jobs:
  pdf-processing-engine:
    name: 📄 PDF & OCR Processing Engine
    runs-on: ubuntu-latest
    timeout-minutes: 45
    
    outputs:
      status: ${{ steps.pdf-processing.outputs.status }}
      output-file: ${{ steps.pdf-processing.outputs.output_file }}
      text-summary: ${{ steps.pdf-processing.outputs.text_summary }}
    
    steps:
    - name: 📥 Checkout Repository
      uses: actions/checkout@v4

    - name: 🐍 Setup Python Environment
      uses: actions/setup-python@v4
      with:
        python-version: '\''3.11'\''
        cache: '\''pip'\''

    - name: 🛠️ Install PDF/OCR Dependencies
      run: |
        # System dependencies
        sudo apt-get update
        sudo apt-get install -y tesseract-ocr tesseract-ocr-jpn tesseract-ocr-eng
        sudo apt-get install -y poppler-utils ghostscript
        sudo apt-get install -y imagemagick
        
        # Configure ImageMagick policy for PDF processing
        sudo sed -i '\''s/rights="none" pattern="PDF"/rights="read|write" pattern="PDF"/'\'' /etc/ImageMagick-6/policy.xml
        
        # Python dependencies
        pip install --upgrade pip
        pip install PyPDF2 pymupdf pdf2image pytesseract
        pip install pillow opencv-python numpy pandas
        pip install pdfplumber tabula-py camelot-py[cv]
        pip install reportlab weasyprint
        pip install requests beautifulsoup4 lxml

    - name: 📁 Create Output Directories
      run: |
        mkdir -p outputs/pdf-processing/${{ inputs.task-id }}
        mkdir -p outputs/pdf-processing/${{ inputs.task-id }}/images
        mkdir -p outputs/pdf-processing/${{ inputs.task-id }}/text
        mkdir -p outputs/pdf-processing/${{ inputs.task-id }}/tables
        mkdir -p outputs/raw-data/${{ inputs.task-id }}

    - name: 📄 Execute PDF Processing & OCR
      id: pdf-processing
      run: |
        cat > pdf_processor.py << '\''EOF'\''
        import os
        import json
        import sys
        import requests
        import fitz  # PyMuPDF
        import pandas as pd
        import numpy as np
        from PIL import Image
        import pytesseract
        from pdf2image import convert_from_path
        import pdfplumber
        import cv2
        from datetime import datetime
        import re
        from urllib.parse import urlparse
        import base64
        
        class PDFProcessor:
            def __init__(self, task_id, ocr_language='\''jpn+eng'\''):
                self.task_id = task_id
                self.ocr_language = ocr_language
                self.output_dir = f"outputs/pdf-processing/{task_id}"
                self.processed_data = {
                    '\''task_id'\'': task_id,
                    '\''timestamp'\'': datetime.now().isoformat(),
                    '\''documents'\'': [],
                    '\''summary'\'': {}
                }
                
            def download_pdf(self, url):
                """Download PDF from URL"""
                try:
                    response = requests.get(url, timeout=30)
                    response.raise_for_status()
                    
                    filename = os.path.basename(urlparse(url).path) or '\''downloaded.pdf'\''
                    if not filename.endswith('\''.pdf'\''):
                        filename += '\''.pdf'\''
                    
                    filepath = os.path.join(self.output_dir, filename)
                    
                    with open(filepath, '\''wb'\'') as f:
                        f.write(response.content)
                    
                    return filepath
                except Exception as e:
                    print(f"Error downloading PDF: {e}")
                    return None
            
            def extract_text_pymupdf(self, pdf_path):
                """Extract text using PyMuPDF"""
                text_data = []
                
                try:
                    doc = fitz.open(pdf_path)
                    
                    for page_num in range(len(doc)):
                        page = doc.load_page(page_num)
                        text = page.get_text()
                        
                        # Extract images from page
                        image_list = page.get_images()
                        images = []
                        
                        for img_index, img in enumerate(image_list):
                            xref = img[0]
                            pix = fitz.Pixmap(doc, xref)
                            
                            if pix.n - pix.alpha < 4:  # GRAY or RGB
                                img_filename = f"page_{page_num+1}_img_{img_index+1}.png"
                                img_path = os.path.join(self.output_dir, '\''images'\'', img_filename)
                                pix.save(img_path)
                                images.append({
                                    '\''filename'\'': img_filename,
                                    '\''path'\'': img_path,
                                    '\''width'\'': pix.width,
                                    '\''height'\'': pix.height
                                })
                            
                            pix = None
                        
                        text_data.append({
                            '\''page'\'': page_num + 1,
                            '\''text'\'': text,
                            '\''images'\'': images,
                            '\''char_count'\'': len(text)
                        })
                    
                    doc.close()
                    return text_data
                    
                except Exception as e:
                    print(f"Error extracting text with PyMuPDF: {e}")
                    return []
            
            def extract_text_pdfplumber(self, pdf_path):
                """Extract text and tables using pdfplumber"""
                structured_data = []
                
                try:
                    with pdfplumber.open(pdf_path) as pdf:
                        for page_num, page in enumerate(pdf.pages):
                            page_data = {
                                '\''page'\'': page_num + 1,
                                '\''text'\'': page.extract_text() or '\'''\'',
                                '\''tables'\'': [],
                                '\''metadata'\'': {
                                    '\''width'\'': page.width,
                                    '\''height'\'': page.height
                                }
                            }
                            
                            # Extract tables
                            tables = page.extract_tables()
                            for table_index, table in enumerate(tables):
                                if table:
                                    table_data = {
                                        '\''table_index'\'': table_index + 1,
                                        '\''data'\'': table,
                                        '\''rows'\'': len(table),
                                        '\''columns'\'': len(table[0]) if table else 0
                                    }
                                    page_data['\''tables'\''].append(table_data)
                                    
                                    # Save table as CSV
                                    if table:
                                        df = pd.DataFrame(table[1:], columns=table[0])
                                        csv_filename = f"page_{page_num+1}_table_{table_index+1}.csv"
                                        csv_path = os.path.join(self.output_dir, '\''tables'\'', csv_filename)
                                        df.to_csv(csv_path, index=False)
                                        table_data['\''csv_file'\''] = csv_filename
                            
                            structured_data.append(page_data)
                    
                    return structured_data
                    
                except Exception as e:
                    print(f"Error extracting structured data: {e}")
                    return []
            
            def perform_ocr(self, pdf_path):
                """Perform OCR on PDF pages"""
                ocr_results = []
                
                try:
                    # Convert PDF to images
                    pages = convert_from_path(pdf_path, dpi=300)
                    
                    for page_num, page_image in enumerate(pages):
                        # Save original image
                        img_filename = f"page_{page_num+1}_original.png"
                        img_path = os.path.join(self.output_dir, '\''images'\'', img_filename)
                        page_image.save(img_path)
                        
                        # Convert PIL Image to OpenCV format
                        open_cv_image = np.array(page_image)
                        open_cv_image = cv2.cvtColor(open_cv_image, cv2.COLOR_RGB2BGR)
                        
                        # Image preprocessing for better OCR
                        gray = cv2.cvtColor(open_cv_image, cv2.COLOR_BGR2GRAY)
                        
                        # Apply noise reduction
                        denoised = cv2.medianBlur(gray, 5)
                        
                        # Apply thresholding
                        thresh = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
                        
                        # Save processed image
                        processed_filename = f"page_{page_num+1}_processed.png"
                        processed_path = os.path.join(self.output_dir, '\''images'\'', processed_filename)
                        cv2.imwrite(processed_path, thresh)
                        
                        # Perform OCR with different configurations
                        ocr_configs = [
                            '\''--oem 3 --psm 6'\'',  # Default
                            '\''--oem 3 --psm 4'\'',  # Single column text
                            '\''--oem 3 --psm 1'\'',  # Automatic page segmentation with OSD
                        ]
                        
                        best_result = ""
                        best_confidence = 0
                        
                        for config in ocr_configs:
                            try:
                                # OCR with confidence scores
                                data = pytesseract.image_to_data(
                                    thresh, 
                                    lang=self.ocr_language, 
                                    config=config,
                                    output_type=pytesseract.Output.DICT
                                )
                                
                                # Calculate average confidence
                                confidences = [int(conf) for conf in data['\''conf'\''] if int(conf) > 0]
                                avg_confidence = sum(confidences) / len(confidences) if confidences else 0
                                
                                # Extract text
                                text = pytesseract.image_to_string(
                                    thresh, 
                                    lang=self.ocr_language, 
                                    config=config
                                )
                                
                                if avg_confidence > best_confidence and len(text.strip()) > len(best_result.strip()):
                                    best_result = text
                                    best_confidence = avg_confidence
                                    
                            except Exception as e:
                                print(f"OCR config {config} failed: {e}")
                                continue
                        
                        ocr_results.append({
                            '\''page'\'': page_num + 1,
                            '\''text'\'': best_result,
                            '\''confidence'\'': best_confidence,
                            '\''original_image'\'': img_filename,
                            '\''processed_image'\'': processed_filename,
                            '\''char_count'\'': len(best_result)
                        })
                        
                        # Save individual page text
                        text_filename = f"page_{page_num+1}_ocr.txt"
                        text_path = os.path.join(self.output_dir, '\''text'\'', text_filename)
                        with open(text_path, '\''w'\'', encoding='\''utf-8'\'') as f:
                            f.write(best_result)
                    
                    return ocr_results
                    
                except Exception as e:
                    print(f"Error performing OCR: {e}")
                    return []
            
            def process_pdf(self, pdf_path, mode='\''full'\''):
                """Main PDF processing function"""
                print(f"Processing PDF: {pdf_path}")
                print(f"Processing mode: {mode}")
                
                document_data = {
                    '\''filename'\'': os.path.basename(pdf_path),
                    '\''filepath'\'': pdf_path,
                    '\''processing_mode'\'': mode,
                    '\''timestamp'\'': datetime.now().isoformat()
                }
                
                # Extract basic text with PyMuPDF
                print("Extracting text with PyMuPDF...")
                pymupdf_data = self.extract_text_pymupdf(pdf_path)
                document_data['\''pymupdf_extraction'\''] = pymupdf_data
                
                # Extract structured data with pdfplumber
                if mode in ['\''full'\'', '\''structured'\'']:
                    print("Extracting structured data with pdfplumber...")
                    structured_data = self.extract_text_pdfplumber(pdf_path)
                    document_data['\''structured_extraction'\''] = structured_data
                
                # Perform OCR
                if mode in ['\''full'\'', '\''ocr'\'']:
                    print("Performing OCR...")
                    ocr_data = self.perform_ocr(pdf_path)
                    document_data['\''ocr_extraction'\''] = ocr_data
                
                # Combine all text for analysis
                all_text = ""
                
                # Combine PyMuPDF text
                for page_data in pymupdf_data:
                    all_text += page_data['\''text'\''] + "\n"
                
                # Add OCR text if available
                if '\''ocr_extraction'\'' in document_data:
                    for page_data in document_data['\''ocr_extraction'\'']:
                        all_text += page_data['\''text'\''] + "\n"
                
                # Text analysis
                document_data['\''analysis'\''] = {
                    '\''total_characters'\'': len(all_text),
                    '\''total_words'\'': len(all_text.split()),
                    '\''total_lines'\'': len(all_text.splitlines()),
                    '\''page_count'\'': len(pymupdf_data),
                    '\''has_images'\'': any(page['\''images'\''] for page in pymupdf_data),
                    '\''has_tables'\'': '\''structured_extraction'\'' in document_data and any(
                        page['\''tables'\''] for page in document_data['\''structured_extraction'\'']
                    )
                }
                
                # Save combined text
                combined_text_path = os.path.join(self.output_dir, '\''text'\'', '\''combined_text.txt'\'')
                with open(combined_text_path, '\''w'\'', encoding='\''utf-8'\'') as f:
                    f.write(all_text)
                
                document_data['\''combined_text_file'\''] = '\''combined_text.txt'\''
                
                return document_data
            
            def find_pdfs_in_scraping_data(self):
                """Find PDF links in scraping results"""
                pdf_urls = []
                
                try:
                    scraping_file = f"outputs/scraping/{self.task_id}/detailed_data.json"
                    if os.path.exists(scraping_file):
                        with open(scraping_file, '\''r'\'', encoding='\''utf-8'\'') as f:
                            scraping_data = json.load(f)
                        
                        for page_data in scraping_data:
                            for link in page_data.get('\''content'\'', {}).get('\''links'\'', []):
                                if link['\''url'\''].lower().endswith('\''.pdf'\''):
                                    pdf_urls.append(link['\''url'\''])
                
                except Exception as e:
                    print(f"Error finding PDFs in scraping data: {e}")
                
                return pdf_urls
            
            def run_processing(self, pdf_url=None, input_source='\''manual'\'', mode='\''full'\''):
                """Main processing execution"""
                print(f"Starting PDF processing task: {self.task_id}")
                
                pdf_files = []
                
                # Determine PDF sources
                if pdf_url:
                    print(f"Processing PDF from URL: {pdf_url}")
                    downloaded_path = self.download_pdf(pdf_url)
                    if downloaded_path:
                        pdf_files.append(downloaded_path)
                
                elif input_source != '\''manual'\'':
                    print("Looking for PDFs in scraping results...")
                    pdf_urls = self.find_pdfs_in_scraping_data()
                    
                    for url in pdf_urls[:5]:  # Limit to 5 PDFs
                        downloaded_path = self.download_pdf(url)
                        if downloaded_path:
                            pdf_files.append(downloaded_path)
                
                # Process each PDF
                for pdf_file in pdf_files:
                    try:
                        document_data = self.process_pdf(pdf_file, mode)
                        self.processed_data['\''documents'\''].append(document_data)
                    except Exception as e:
                        print(f"Error processing {pdf_file}: {e}")
                
                # Generate summary
                self.processed_data['\''summary'\''] = {
                    '\''total_documents'\'': len(self.processed_data['\''documents'\'']),
                    '\''total_pages'\'': sum(doc['\''analysis'\'']['\''page_count'\''] for doc in self.processed_data['\''documents'\'']),
                    '\''total_characters'\'': sum(doc['\''analysis'\'']['\''total_characters'\''] for doc in self.processed_data['\''documents'\'']),
                    '\''documents_with_images'\'': sum(1 for doc in self.processed_data['\''documents'\''] if doc['\''analysis'\'']['\''has_images'\'']),
                    '\''documents_with_tables'\'': sum(1 for doc in self.processed_data['\''documents'\''] if doc['\''analysis'\'']['\''has_tables'\'']),
                    '\''processing_completed'\'': datetime.now().isoformat()
                }
                
                return self.processed_data
            
            def save_results(self, output_format='\''json'\''):
                """Save processing results"""
                base_path = f"outputs/pdf-processing/{self.task_id}"
                
                if output_format == '\''json'\'':
                    output_file = f"{base_path}/processing_results.json"
                    with open(output_file, '\''w'\'', encoding='\''utf-8'\'') as f:
                        json.dump(self.processed_data, f, ensure_ascii=False, indent=2)
                
                # Always save summary
                summary_file = f"{base_path}/summary.json"
                with open(summary_file, '\''w'\'', encoding='\''utf-8'\'') as f:
                    json.dump(self.processed_data['\''summary'\''], f, indent=2)
                
                return output_file, self.processed_data['\''summary'\'']
        
        # Execute PDF processing
        def main():
            processor = PDFProcessor(
                task_id="${{ inputs.task-id }}",
                ocr_language="${{ inputs.ocr-language }}"
            )
            
            results = processor.run_processing(
                pdf_url="${{ inputs.pdf-url }}" if "${{ inputs.pdf-url }}" else None,
                input_source="${{ inputs.input-source }}",
                mode="${{ inputs.processing-mode }}"
            )
            
            if results['\''documents'\'']:
                output_file, summary = processor.save_results("${{ inputs.output-format }}")
                print(f"PDF processing completed successfully!")
                print(f"Output file: {output_file}")
                print(f"Summary: {json.dumps(summary, indent=2)}")
                
                # Set GitHub Action outputs
                print(f"::set-output name=status::success")
                print(f"::set-output name=output_file::{output_file}")
                print(f"::set-output name=text_summary::{json.dumps(summary)}")
            else:
                print("PDF processing failed - no documents processed")
                print(f"::set-output name=status::failed")
        
        if __name__ == "__main__":
            main()
        EOF
        
        python pdf_processor.py

    - name: 📊 Generate PDF Processing Report
      run: |
        echo "## 📄 PDF Processing Report" >> $GITHUB_STEP_SUMMARY
        echo "- **Task ID**: ${{ inputs.task-id }}" >> $GITHUB_STEP_SUMMARY
        echo "- **Input Source**: ${{ inputs.input-source }}" >> $GITHUB_STEP_SUMMARY
        echo "- **Processing Mode**: ${{ inputs.processing-mode }}" >> $GITHUB_STEP_SUMMARY
        echo "- **OCR Language**: ${{ inputs.ocr-language }}" >> $GITHUB_STEP_SUMMARY
        echo "- **Status**: ${{ steps.pdf-processing.outputs.status }}" >> $GITHUB_STEP_SUMMARY
        
        if [ -f "outputs/pdf-processing/${{ inputs.task-id }}/summary.json" ]; then
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "### Processing Results:" >> $GITHUB_STEP_SUMMARY
          cat outputs/pdf-processing/${{ inputs.task-id }}/summary.json | jq -r '\''
            "- **Documents Processed**: " + (.total_documents | tostring) + "\n" +
            "- **Total Pages**: " + (.total_pages | tostring) + "\n" +
            "- **Total Characters**: " + (.total_characters | tostring) + "\n" +
            "- **Documents with Images**: " + (.documents_with_images | tostring) + "\n" +
            "- **Documents with Tables**: " + (.documents_with_tables | tostring)
          '\'' >> $GITHUB_STEP_SUMMARY
        fi

    - name: 📤 Upload PDF Processing Results
      uses: actions/upload-artifact@v4
      if: steps.pdf-processing.outputs.status == '\''success'\''
      with:
        name: pdf-processing-results-${{ inputs.task-id }}
        path: outputs/pdf-processing/${{ inputs.task-id }}/
        retention-days: 30

    - name: 💾 Commit Results to Repository
      if: steps.pdf-processing.outputs.status == '\''success'\''
      run: |
        git config --local user.email "action@github.com"
        git config --local user.name "GitHub Action"
        
        if [ -n "$(git status --porcelain)" ]; then
          git add outputs/
          git commit -m "📄 Add PDF processing results for task ${{ inputs.task-id }}"
          git push
        fi' | base64)"

echo "Creating task-scraping.yml..."
gh api repos/kazu-4728/office-automation-hub/contents/.github/workflows/task-scraping.yml \
  --method PUT \
  --field message="🚀 Deploy task-scraping.yml" \
  --field content="$(echo 'name: 🕷️ Scraping & Data Extraction Engine

on:
  workflow_call:
    inputs:
      task-id:
        required: true
        type: string
      target-url:
        required: true
        type: string
      scraping-mode:
        required: false
        type: string
        default: '\''smart'\''
      output-format:
        required: false
        type: string
        default: '\''json'\''
      depth-limit:
        required: false
        type: string
        default: '\''1'\''

jobs:
  scraping-engine:
    name: 🌐 Web Scraping Engine
    runs-on: ubuntu-latest
    timeout-minutes: 30
    
    outputs:
      status: ${{ steps.scrape-execution.outputs.status }}
      output-file: ${{ steps.scrape-execution.outputs.output_file }}
      data-summary: ${{ steps.scrape-execution.outputs.data_summary }}
    
    steps:
    - name: 📥 Checkout Repository
      uses: actions/checkout@v4

    - name: 🐍 Setup Python Environment
      uses: actions/setup-python@v4
      with:
        python-version: '\''3.11'\''
        cache: '\''pip'\''

    - name: 🛠️ Install Scraping Dependencies
      run: |
        pip install --upgrade pip
        pip install requests beautifulsoup4 selenium pandas numpy lxml
        pip install playwright asyncio aiohttp cssselect
        pip install scrapy fake-useragent
        
        # Install browser for Playwright
        playwright install chromium

    - name: 📁 Create Output Directory
      run: |
        mkdir -p outputs/scraping/${{ inputs.task-id }}
        mkdir -p outputs/raw-data/${{ inputs.task-id }}

    - name: 🚀 Execute Scraping Task
      id: scrape-execution
      run: |
        cat > scraper.py << '\''EOF'\''
        import requests
        import json
        import pandas as pd
        import asyncio
        import aiohttp
        from bs4 import BeautifulSoup
        from playwright.async_api import async_playwright
        from urllib.parse import urljoin, urlparse
        import re
        import os
        import sys
        from datetime import datetime
        
        class SmartScraper:
            def __init__(self, task_id, target_url, mode='\''smart'\'', depth=1):
                self.task_id = task_id
                self.target_url = target_url
                self.mode = mode
                self.depth = int(depth)
                self.session = requests.Session()
                self.session.headers.update({
                    '\''User-Agent'\'': '\''Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'\''
                })
                self.scraped_data = []
                self.links_found = []
                
            def extract_text_content(self, soup):
                """Extract clean text content from BeautifulSoup object"""
                # Remove script and style elements
                for script in soup(["script", "style"]):
                    script.extract()
                
                # Extract text
                text = soup.get_text()
                
                # Clean up text
                lines = (line.strip() for line in text.splitlines())
                chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
                text = '\'' '\''.join(chunk for chunk in chunks if chunk)
                
                return text
            
            def extract_structured_data(self, soup, url):
                """Extract structured data from webpage"""
                data = {
                    '\''url'\'': url,
                    '\''title'\'': soup.title.string if soup.title else '\'''\'',
                    '\''timestamp'\'': datetime.now().isoformat(),
                    '\''content'\'': {},
                    '\''metadata'\'': {}
                }
                
                # Extract headings
                headings = []
                for i in range(1, 7):
                    headings.extend([h.get_text().strip() for h in soup.find_all(f'\''h{i}'\'')])
                data['\''content'\'']['\''headings'\''] = headings
                
                # Extract paragraphs
                paragraphs = [p.get_text().strip() for p in soup.find_all('\''p'\'')]
                data['\''content'\'']['\''paragraphs'\''] = paragraphs
                
                # Extract lists
                lists = []
                for ul in soup.find_all(['\''ul'\'', '\''ol'\'']):
                    items = [li.get_text().strip() for li in ul.find_all('\''li'\'')]
                    lists.extend(items)
                data['\''content'\'']['\''lists'\''] = lists
                
                # Extract tables
                tables = []
                for table in soup.find_all('\''table'\''):
                    table_data = []
                    for row in table.find_all('\''tr'\''):
                        row_data = [cell.get_text().strip() for cell in row.find_all(['\''td'\'', '\''th'\''])]
                        table_data.append(row_data)
                    if table_data:
                        tables.append(table_data)
                data['\''content'\'']['\''tables'\''] = tables
                
                # Extract links
                links = []
                for a in soup.find_all('\''a'\'', href=True):
                    link_url = urljoin(url, a['\''href'\''])
                    link_text = a.get_text().strip()
                    if link_text and link_url.startswith('\''http'\''):
                        links.append({'\''url'\'': link_url, '\''text'\'': link_text})
                data['\''content'\'']['\''links'\''] = links[:50]  # Limit to 50 links
                
                # Extract images
                images = []
                for img in soup.find_all('\''img'\'', src=True):
                    img_url = urljoin(url, img['\''src'\''])
                    img_alt = img.get('\''alt'\'', '\'''\'')
                    images.append({'\''url'\'': img_url, '\''alt'\'': img_alt})
                data['\''content'\'']['\''images'\''] = images[:20]  # Limit to 20 images
                
                # Extract metadata
                for meta in soup.find_all('\''meta'\''):
                    if meta.get('\''name'\''):
                        data['\''metadata'\''][meta['\''name'\'']] = meta.get('\''content'\'', '\'''\'')
                    elif meta.get('\''property'\''):
                        data['\''metadata'\''][meta['\''property'\'']] = meta.get('\''content'\'', '\'''\'')
                
                # Text content
                data['\''content'\'']['\''full_text'\''] = self.extract_text_content(soup)
                
                return data
            
            async def scrape_with_playwright(self, url):
                """Scrape JavaScript-heavy sites with Playwright"""
                async with async_playwright() as p:
                    browser = await p.chromium.launch()
                    page = await browser.new_page()
                    
                    try:
                        await page.goto(url, wait_until='\''networkidle'\'')
                        content = await page.content()
                        soup = BeautifulSoup(content, '\''html.parser'\'')
                        data = self.extract_structured_data(soup, url)
                        
                        # Extract additional JavaScript-generated content
                        js_data = {}
                        
                        # Try to extract JSON-LD structured data
                        try:
                            json_ld = await page.evaluate('\'''\'''\''
                                () => {
                                    const scripts = document.querySelectorAll('\''script[type="application/ld+json"]'\'');
                                    return Array.from(scripts).map(script => JSON.parse(script.textContent));
                                }
                            '\'''\'''\'')
                            if json_ld:
                                js_data['\''json_ld'\''] = json_ld
                        except:
                            pass
                        
                        # Extract dynamic content
                        try:
                            dynamic_text = await page.evaluate('\''() => document.body.innerText'\'')
                            js_data['\''dynamic_text'\''] = dynamic_text[:5000]  # Limit text length
                        except:
                            pass
                        
                        data['\''javascript_content'\''] = js_data
                        
                    except Exception as e:
                        print(f"Error scraping {url} with Playwright: {e}")
                        return None
                    finally:
                        await browser.close()
                
                return data
            
            def scrape_basic(self, url):
                """Basic scraping with requests"""
                try:
                    response = self.session.get(url, timeout=30)
                    response.raise_for_status()
                    
                    soup = BeautifulSoup(response.content, '\''html.parser'\'')
                    return self.extract_structured_data(soup, url)
                    
                except Exception as e:
                    print(f"Error scraping {url}: {e}")
                    return None
            
            async def run_scraping(self):
                """Main scraping execution"""
                print(f"Starting scraping task: {self.task_id}")
                print(f"Target URL: {self.target_url}")
                print(f"Mode: {self.mode}, Depth: {self.depth}")
                
                urls_to_scrape = [self.target_url]
                scraped_urls = set()
                
                for current_depth in range(self.depth):
                    if not urls_to_scrape:
                        break
                        
                    current_urls = urls_to_scrape.copy()
                    urls_to_scrape = []
                    
                    for url in current_urls:
                        if url in scraped_urls:
                            continue
                            
                        print(f"Scraping (depth {current_depth + 1}): {url}")
                        
                        # Choose scraping method based on mode
                        if self.mode == '\''playwright'\'' or (self.mode == '\''smart'\'' and '\''spa'\'' in url.lower()):
                            data = await self.scrape_with_playwright(url)
                        else:
                            data = self.scrape_basic(url)
                        
                        if data:
                            self.scraped_data.append(data)
                            scraped_urls.add(url)
                            
                            # Extract links for next depth level
                            if current_depth < self.depth - 1:
                                for link in data['\''content'\'']['\''links'\'']:
                                    link_url = link['\''url'\'']
                                    # Only add links from same domain
                                    if urlparse(link_url).netloc == urlparse(self.target_url).netloc:
                                        if link_url not in scraped_urls:
                                            urls_to_scrape.append(link_url)
                
                return self.scraped_data
            
            def save_results(self, output_format='\''json'\''):
                """Save scraping results"""
                if not self.scraped_data:
                    return None
                
                base_path = f"outputs/scraping/{self.task_id}"
                
                if output_format == '\''json'\'':
                    output_file = f"{base_path}/scraped_data.json"
                    with open(output_file, '\''w'\'', encoding='\''utf-8'\'') as f:
                        json.dump(self.scraped_data, f, ensure_ascii=False, indent=2)
                
                elif output_format == '\''csv'\'':
                    output_file = f"{base_path}/scraped_data.csv"
                    
                    # Flatten data for CSV
                    flattened_data = []
                    for item in self.scraped_data:
                        flat_item = {
                            '\''url'\'': item['\''url'\''],
                            '\''title'\'': item['\''title'\''],
                            '\''timestamp'\'': item['\''timestamp'\''],
                            '\''headings_count'\'': len(item['\''content'\'']['\''headings'\'']),
                            '\''paragraphs_count'\'': len(item['\''content'\'']['\''paragraphs'\'']),
                            '\''links_count'\'': len(item['\''content'\'']['\''links'\'']),
                            '\''images_count'\'': len(item['\''content'\'']['\''images'\'']),
                            '\''text_length'\'': len(item['\''content'\'']['\''full_text'\'']),
                            '\''full_text_preview'\'': item['\''content'\'']['\''full_text'\''][:500]
                        }
                        flattened_data.append(flat_item)
                    
                    df = pd.DataFrame(flattened_data)
                    df.to_csv(output_file, index=False)
                
                # Always save detailed JSON for processing
                detailed_file = f"{base_path}/detailed_data.json"
                with open(detailed_file, '\''w'\'', encoding='\''utf-8'\'') as f:
                    json.dump(self.scraped_data, f, ensure_ascii=False, indent=2)
                
                # Generate summary
                summary = {
                    '\''task_id'\'': self.task_id,
                    '\''target_url'\'': self.target_url,
                    '\''total_pages'\'': len(self.scraped_data),
                    '\''total_text_length'\'': sum(len(item['\''content'\'']['\''full_text'\'']) for item in self.scraped_data),
                    '\''total_links'\'': sum(len(item['\''content'\'']['\''links'\'']) for item in self.scraped_data),
                    '\''total_images'\'': sum(len(item['\''content'\'']['\''images'\'']) for item in self.scraped_data),
                    '\''completion_time'\'': datetime.now().isoformat()
                }
                
                summary_file = f"{base_path}/summary.json"
                with open(summary_file, '\''w'\'') as f:
                    json.dump(summary, f, indent=2)
                
                return output_file, summary
        
        # Execute scraping
        async def main():
            scraper = SmartScraper(
                task_id="${{ inputs.task-id }}",
                target_url="${{ inputs.target-url }}",
                mode="${{ inputs.scraping-mode }}",
                depth="${{ inputs.depth-limit }}"
            )
            
            results = await scraper.run_scraping()
            
            if results:
                output_file, summary = scraper.save_results("${{ inputs.output-format }}")
                print(f"Scraping completed successfully!")
                print(f"Output file: {output_file}")
                print(f"Summary: {json.dumps(summary, indent=2)}")
                
                # Set GitHub Action outputs
                print(f"::set-output name=status::success")
                print(f"::set-output name=output_file::{output_file}")
                print(f"::set-output name=data_summary::{json.dumps(summary)}")
            else:
                print("Scraping failed - no data extracted")
                print(f"::set-output name=status::failed")
        
        if __name__ == "__main__":
            asyncio.run(main())
        EOF
        
        python scraper.py

    - name: 📊 Generate Scraping Report
      run: |
        echo "## 🕷️ Scraping Task Report" >> $GITHUB_STEP_SUMMARY
        echo "- **Task ID**: ${{ inputs.task-id }}" >> $GITHUB_STEP_SUMMARY
        echo "- **Target URL**: ${{ inputs.target-url }}" >> $GITHUB_STEP_SUMMARY
        echo "- **Mode**: ${{ inputs.scraping-mode }}" >> $GITHUB_STEP_SUMMARY
        echo "- **Depth**: ${{ inputs.depth-limit }}" >> $GITHUB_STEP_SUMMARY
        echo "- **Status**: ${{ steps.scrape-execution.outputs.status }}" >> $GITHUB_STEP_SUMMARY
        
        if [ -f "outputs/scraping/${{ inputs.task-id }}/summary.json" ]; then
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "### Results Summary:" >> $GITHUB_STEP_SUMMARY
          cat outputs/scraping/${{ inputs.task-id }}/summary.json | jq -r '\''
            "- **Pages Scraped**: " + (.total_pages | tostring) + "\n" +
            "- **Total Text Length**: " + (.total_text_length | tostring) + " characters\n" +
            "- **Links Found**: " + (.total_links | tostring) + "\n" +
            "- **Images Found**: " + (.total_images | tostring) + "\n" +
            "- **Completion Time**: " + .completion_time
          '\'' >> $GITHUB_STEP_SUMMARY
        fi

    - name: 📤 Upload Scraping Results
      uses: actions/upload-artifact@v4
      if: steps.scrape-execution.outputs.status == '\''success'\''
      with:
        name: scraping-results-${{ inputs.task-id }}
        path: outputs/scraping/${{ inputs.task-id }}/
        retention-days: 30

    - name: 💾 Commit Results to Repository
      if: steps.scrape-execution.outputs.status == '\''success'\''
      run: |
        git config --local user.email "action@github.com"
        git config --local user.name "GitHub Action"
        
        if [ -n "$(git status --porcelain)" ]; then
          git add outputs/
          git commit -m "🕷️ Add scraping results for task ${{ inputs.task-id }}"
          git push
        fi' | base64)"

echo "Creating task-slide-gen.yml..."
gh api repos/kazu-4728/office-automation-hub/contents/.github/workflows/task-slide-gen.yml \
  --method PUT \
  --field message="🚀 Deploy task-slide-gen.yml" \
  --field content="$(echo 'name: 🎨 Slide Generation Engine

on:
  workflow_call:
    inputs:
      task-id:
        required: true
        type: string
      data-source:
        required: false
        type: string
        default: '\''manual'\''
      template-type:
        required: false
        type: string
        default: '\''professional'\''
      slide-count:
        required: false
        type: string
        default: '\''10'\''
      language:
        required: false
        type: string
        default: '\''ja'\''
      theme:
        required: false
        type: string
        default: '\''modern'\''

jobs:
  slide-generation-engine:
    name: 🎨 Slide Generation Engine
    runs-on: ubuntu-latest
    timeout-minutes: 30
    
    outputs:
      status: ${{ steps.slide-generation.outputs.status }}
      output-file: ${{ steps.slide-generation.outputs.output_file }}
      slide-summary: ${{ steps.slide-generation.outputs.slide_summary }}
    
    steps:
    - name: 📥 Checkout Repository
      uses: actions/checkout@v4

    - name: 🐍 Setup Python Environment
      uses: actions/setup-python@v4
      with:
        python-version: '\''3.11'\''
        cache: '\''pip'\''

    - name: 🛠️ Install Slide Generation Dependencies
      run: |
        pip install --upgrade pip
        pip install python-pptx jinja2 pillow
        pip install matplotlib seaborn plotly pandas numpy
        pip install requests beautifulsoup4 markdown
        pip install reportlab weasyprint
        pip install openai anthropic  # For AI-powered content generation

    - name: 📁 Create Output Directories
      run: |
        mkdir -p outputs/slides/${{ inputs.task-id }}
        mkdir -p outputs/slides/${{ inputs.task-id }}/images
        mkdir -p outputs/slides/${{ inputs.task-id }}/charts
        mkdir -p templates/slides

    - name: 🎨 Execute Slide Generation
      id: slide-generation
      run: |
        cat > slide_generator.py << '\''EOF'\''
        import os
        import json
        import sys
        from datetime import datetime
        from pptx import Presentation
        from pptx.util import Inches, Pt
        from pptx.dml.color import RGBColor
        from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
        from pptx.enum.shapes import MSO_SHAPE
        import matplotlib.pyplot as plt
        import seaborn as sns
        import pandas as pd
        import numpy as np
        from PIL import Image
        import re
        import textwrap
        
        class SlideGenerator:
            def __init__(self, task_id, template_type='\''professional'\'', theme='\''modern'\'', language='\''ja'\''):
                self.task_id = task_id
                self.template_type = template_type
                self.theme = theme
                self.language = language
                self.output_dir = f"outputs/slides/{task_id}"
                
                # Theme colors
                self.themes = {
                    '\''modern'\'': {
                        '\''primary'\'': RGBColor(41, 128, 185),      # Blue
                        '\''secondary'\'': RGBColor(52, 73, 94),      # Dark Blue
                        '\''accent'\'': RGBColor(231, 76, 60),        # Red
                        '\''background'\'': RGBColor(255, 255, 255),  # White
                        '\''text'\'': RGBColor(44, 62, 80)            # Dark Gray
                    },
                    '\''corporate'\'': {
                        '\''primary'\'': RGBColor(34, 49, 63),        # Navy
                        '\''secondary'\'': RGBColor(93, 109, 126),    # Gray
                        '\''accent'\'': RGBColor(255, 193, 7),        # Gold
                        '\''background'\'': RGBColor(248, 249, 250),  # Light Gray
                        '\''text'\'': RGBColor(33, 37, 41)            # Black
                    },
                    '\''creative'\'': {
                        '\''primary'\'': RGBColor(155, 89, 182),      # Purple
                        '\''secondary'\'': RGBColor(52, 152, 219),    # Blue
                        '\''accent'\'': RGBColor(46, 204, 113),       # Green
                        '\''background'\'': RGBColor(255, 255, 255),  # White
                        '\''text'\'': RGBColor(44, 62, 80)            # Dark Gray
                    }
                }
                
                self.current_theme = self.themes.get(theme, self.themes['\''modern'\''])
                self.presentation = Presentation()
                self.slide_layouts = self.presentation.slide_layouts
                
                # Content data
                self.content_data = []
                self.processed_text = ""
                self.slide_data = []
                
            def load_data_sources(self, data_source):
                """Load data from various sources"""
                sources_loaded = []
                
                # Load scraping data
                scraping_file = f"outputs/scraping/{self.task_id}/detailed_data.json"
                if os.path.exists(scraping_file):
                    try:
                        with open(scraping_file, '\''r'\'', encoding='\''utf-8'\'') as f:
                            scraping_data = json.load(f)
                        
                        for page in scraping_data:
                            content = page.get('\''content'\'', {})
                            self.processed_text += content.get('\''full_text'\'', '\'''\'') + "\n"
                            
                            # Extract structured content
                            self.content_data.append({
                                '\''type'\'': '\''web_page'\'',
                                '\''title'\'': page.get('\''title'\'', '\'''\''),
                                '\''url'\'': page.get('\''url'\'', '\'''\''),
                                '\''headings'\'': content.get('\''headings'\'', []),
                                '\''paragraphs'\'': content.get('\''paragraphs'\'', []),
                                '\''lists'\'': content.get('\''lists'\'', []),
                                '\''tables'\'': content.get('\''tables'\'', [])
                            })
                        
                        sources_loaded.append('\''scraping'\'')
                        print(f"Loaded scraping data: {len(scraping_data)} pages")
                    except Exception as e:
                        print(f"Error loading scraping data: {e}")
                
                # Load PDF processing data
                pdf_file = f"outputs/pdf-processing/{self.task_id}/processing_results.json"
                if os.path.exists(pdf_file):
                    try:
                        with open(pdf_file, '\''r'\'', encoding='\''utf-8'\'') as f:
                            pdf_data = json.load(f)
                        
                        for doc in pdf_data.get('\''documents'\'', []):
                            # Combine text from all extraction methods
                            text_content = ""
                            
                            # PyMuPDF text
                            for page in doc.get('\''pymupdf_extraction'\'', []):
                                text_content += page.get('\''text'\'', '\'''\'') + "\n"
                            
                            # OCR text
                            for page in doc.get('\''ocr_extraction'\'', []):
                                text_content += page.get('\''text'\'', '\'''\'') + "\n"
                            
                            self.processed_text += text_content
                            
                            # Extract structured content
                            self.content_data.append({
                                '\''type'\'': '\''pdf_document'\'',
                                '\''filename'\'': doc.get('\''filename'\'', '\'''\''),
                                '\''text'\'': text_content,
                                '\''pages'\'': doc.get('\''analysis'\'', {}).get('\''page_count'\'', 0),
                                '\''tables'\'': doc.get('\''structured_extraction'\'', [])
                            })
                        
                        sources_loaded.append('\''pdf'\'')
                        print(f"Loaded PDF data: {len(pdf_data.get('\''documents'\'', []))} documents")
                    except Exception as e:
                        print(f"Error loading PDF data: {e}")
                
                return sources_loaded
            
            def analyze_content(self, max_slides=10):
                """Analyze content and create slide structure"""
                print(f"Analyzing content for {max_slides} slides...")
                
                # Basic content analysis
                words = self.processed_text.split()
                sentences = re.split(r'\''[.!?]+'\'', self.processed_text)
                
                # Extract key topics (simple keyword extraction)
                word_freq = {}
                for word in words:
                    word_clean = re.sub(r'\''[^\w]'\'', '\'''\'', word.lower())
                    if len(word_clean) > 3:  # Skip short words
                        word_freq[word_clean] = word_freq.get(word_clean, 0) + 1
                
                # Get top keywords
                top_keywords = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:20]
                
                # Generate slide structure
                slides = []
                
                # Title slide
                slides.append({
                    '\''type'\'': '\''title'\'',
                    '\''title'\'': '\''データ分析結果'\'' if self.language == '\''ja'\'' else '\''Data Analysis Results'\'',
                    '\''subtitle'\'': f'\''Task ID: {self.task_id}'\'',
                    '\''content'\'': []
                })
                
                # Overview slide
                slides.append({
                    '\''type'\'': '\''overview'\'',
                    '\''title'\'': '\''概要'\'' if self.language == '\''ja'\'' else '\''Overview'\'',
                    '\''content'\'': [
                        f"処理されたデータソース: {len(self.content_data)}" if self.language == '\''ja'\'' else f"Processed data sources: {len(self.content_data)}",
                        f"総文字数: {len(self.processed_text):,}" if self.language == '\''ja'\'' else f"Total characters: {len(self.processed_text):,}",
                        f"主要キーワード数: {len(top_keywords)}" if self.language == '\''ja'\'' else f"Key keywords: {len(top_keywords)}"
                    ]
                })
                
                # Key findings slides
                remaining_slides = max_slides - len(slides) - 1  # Reserve 1 for conclusion
                
                # Group content by type
                web_content = [item for item in self.content_data if item['\''type'\''] == '\''web_page'\'']
                pdf_content = [item for item in self.content_data if item['\''type'\''] == '\''pdf_document'\'']
                
                slides_per_type = remaining_slides // 2 if web_content and pdf_content else remaining_slides
                
                # Web content slides
                if web_content:
                    for i, content in enumerate(web_content[:slides_per_type]):
                        slides.append({
                            '\''type'\'': '\''content'\'',
                            '\''title'\'': content.get('\''title'\'', f'\''Webページ {i+1}'\'' if self.language == '\''ja'\'' else f'\''Web Page {i+1}'\''),
                            '\''content'\'': [
                                f"URL: {content.get('\''url'\'', '\'''\'')}",
                                f"見出し数: {len(content.get('\''headings'\'', []))}" if self.language == '\''ja'\'' else f"Headings: {len(content.get('\''headings'\'', []))}",
                                f"段落数: {len(content.get('\''paragraphs'\'', []))}" if self.language == '\''ja'\'' else f"Paragraphs: {len(content.get('\''paragraphs'\'', []))}",
                            ] + content.get('\''headings'\'', [])[:5]  # Show first 5 headings
                        })
                
                # PDF content slides
                if pdf_content:
                    for i, content in enumerate(pdf_content[:slides_per_type]):
                        slides.append({
                            '\''type'\'': '\''content'\'',
                            '\''title'\'': content.get('\''filename'\'', f'\''PDF文書 {i+1}'\'' if self.language == '\''ja'\'' else f'\''PDF Document {i+1}'\''),
                            '\''content'\'': [
                                f"ページ数: {content.get('\''pages'\'', 0)}" if self.language == '\''ja'\'' else f"Pages: {content.get('\''pages'\'', 0)}",
                                f"文字数: {len(content.get('\''text'\'', '\'''\'')):,}" if self.language == '\''ja'\'' else f"Characters: {len(content.get('\''text'\'', '\'''\'')):,}",
                                "主要内容:" if self.language == '\''ja'\'' else "Main content:",
                            ] + content.get('\''text'\'', '\'''\'').split('\''\n'\'')[:5]  # Show first 5 lines
                        })
                
                # Keywords slide
                if len(slides) < max_slides:
                    slides.append({
                        '\''type'\'': '\''chart'\'',
                        '\''title'\'': '\''主要キーワード'\'' if self.language == '\''ja'\'' else '\''Key Keywords'\'',
                        '\''content'\'': top_keywords[:10],
                        '\''chart_type'\'': '\''bar'\''
                    })
                
                # Conclusion slide
                slides.append({
                    '\''type'\'': '\''conclusion'\'',
                    '\''title'\'': '\''まとめ'\'' if self.language == '\''ja'\'' else '\''Conclusion'\'',
                    '\''content'\'': [
                        f"分析完了: {datetime.now().strftime('\''%Y-%m-%d %H:%M'\'')}",
                        f"データソース: {len(self.content_data)}個",
                        f"生成スライド: {len(slides)}枚",
                        "詳細な分析結果は添付データをご確認ください。" if self.language == '\''ja'\'' else "Please refer to attached data for detailed analysis."
                    ]
                })
                
                self.slide_data = slides[:max_slides]
                return self.slide_data
            
            def create_chart(self, data, chart_type='\''bar'\'', title='\''Chart'\''):
                """Create chart for slides"""
                plt.style.use('\''seaborn-v0_8'\'')
                fig, ax = plt.subplots(figsize=(10, 6))
                
                if chart_type == '\''bar'\'' and isinstance(data, list):
                    # Keyword frequency chart
                    words = [item[0] for item in data[:10]]
                    counts = [item[1] for item in data[:10]]
                    
                    bars = ax.bar(words, counts, color='\''#2980b9'\'', alpha=0.8)
                    ax.set_title(title, fontsize=16, fontweight='\''bold'\'')
                    ax.set_xlabel('\''Keywords'\'', fontsize=12)
                    ax.set_ylabel('\''Frequency'\'', fontsize=12)
                    
                    # Rotate x-axis labels
                    plt.xticks(rotation=45, ha='\''right'\'')
                    
                    # Add value labels on bars
                    for bar in bars:
                        height = bar.get_height()
                        ax.text(bar.get_x() + bar.get_width()/2., height,
                               f'\''{int(height)}'\'', ha='\''center'\'', va='\''bottom'\'')
                
                plt.tight_layout()
                
                # Save chart
                chart_filename = f"chart_{len(os.listdir(os.path.join(self.output_dir, '\''charts'\''))) + 1}.png"
                chart_path = os.path.join(self.output_dir, '\''charts'\'', chart_filename)
                plt.savefig(chart_path, dpi=300, bbox_inches='\''tight'\'')
                plt.close()
                
                return chart_path
            
            def add_title_slide(self, slide_data):
                """Add title slide"""
                slide_layout = self.slide_layouts[0]  # Title slide layout
                slide = self.presentation.slides.add_slide(slide_layout)
                
                title = slide.shapes.title
                subtitle = slide.placeholders[1]
                
                title.text = slide_data['\''title'\'']
                subtitle.text = slide_data['\''subtitle'\'']
                
                # Style title
                title_font = title.text_frame.paragraphs[0].font
                title_font.size = Pt(44)
                title_font.color.rgb = self.current_theme['\''primary'\'']
                title_font.bold = True
                
                # Style subtitle
                subtitle_font = subtitle.text_frame.paragraphs[0].font
                subtitle_font.size = Pt(24)
                subtitle_font.color.rgb = self.current_theme['\''secondary'\'']
            
            def add_content_slide(self, slide_data):
                """Add content slide"""
                slide_layout = self.slide_layouts[1]  # Title and content layout
                slide = self.presentation.slides.add_slide(slide_layout)
                
                title = slide.shapes.title
                content = slide.placeholders[1]
                
                title.text = slide_data['\''title'\'']
                
                # Add content
                text_frame = content.text_frame
                text_frame.clear()
                
                for item in slide_data['\''content'\'']:
                    if item.strip():
                        p = text_frame.paragraphs[0] if len(text_frame.paragraphs) == 1 and not text_frame.paragraphs[0].text else text_frame.add_paragraph()
                        p.text = str(item)[:200] + "..." if len(str(item)) > 200 else str(item)  # Limit text length
                        p.font.size = Pt(18)
                        p.font.color.rgb = self.current_theme['\''text'\'']
                
                # Style title
                title_font = title.text_frame.paragraphs[0].font
                title_font.size = Pt(32)
                title_font.color.rgb = self.current_theme['\''primary'\'']
                title_font.bold = True
            
            def add_chart_slide(self, slide_data):
                """Add slide with chart"""
                slide_layout = self.slide_layouts[5]  # Title and content layout
                slide = self.presentation.slides.add_slide(slide_layout)
                
                title = slide.shapes.title
                title.text = slide_data['\''title'\'']
                
                # Create and add chart
                chart_path = self.create_chart(
                    slide_data['\''content'\''], 
                    slide_data.get('\''chart_type'\'', '\''bar'\''),
                    slide_data['\''title'\'']
                )
                
                # Add chart image to slide
                left = Inches(1)
                top = Inches(2)
                width = Inches(8)
                height = Inches(5)
                
                slide.shapes.add_picture(chart_path, left, top, width, height)
                
                # Style title
                title_font = title.text_frame.paragraphs[0].font
                title_font.size = Pt(32)
                title_font.color.rgb = self.current_theme['\''primary'\'']
                title_font.bold = True
            
            def generate_presentation(self, max_slides=10):
                """Generate complete presentation"""
                print(f"Generating presentation with {max_slides} slides...")
                
                # Analyze content and create slide structure
                slides = self.analyze_content(max_slides)
                
                # Generate slides
                for slide_data in slides:
                    slide_type = slide_data['\''type'\'']
                    
                    if slide_type == '\''title'\'':
                        self.add_title_slide(slide_data)
                    elif slide_type in ['\''overview'\'', '\''content'\'', '\''conclusion'\'']:
                        self.add_content_slide(slide_data)
                    elif slide_type == '\''chart'\'':
                        self.add_chart_slide(slide_data)
                
                # Save presentation
                output_filename = f"presentation_{self.task_id}.pptx"
                output_path = os.path.join(self.output_dir, output_filename)
                self.presentation.save(output_path)
                
                # Generate summary
                summary = {
                    '\''task_id'\'': self.task_id,
                    '\''presentation_file'\'': output_filename,
                    '\''slide_count'\'': len(slides),
                    '\''template_type'\'': self.template_type,
                    '\''theme'\'': self.theme,
                    '\''language'\'': self.language,
                    '\''data_sources'\'': len(self.content_data),
                    '\''total_text_length'\'': len(self.processed_text),
                    '\''generation_time'\'': datetime.now().isoformat()
                }
                
                # Save summary
                summary_file = os.path.join(self.output_dir, '\''summary.json'\'')
                with open(summary_file, '\''w'\'', encoding='\''utf-8'\'') as f:
                    json.dump(summary, f, ensure_ascii=False, indent=2)
                
                return output_path, summary
        
        # Execute slide generation
        def main():
            generator = SlideGenerator(
                task_id="${{ inputs.task-id }}",
                template_type="${{ inputs.template-type }}",
                theme="${{ inputs.theme }}",
                language="${{ inputs.language }}"
            )
            
            # Load data sources
            sources = generator.load_data_sources("${{ inputs.data-source }}")
            
            if not sources and "${{ inputs.data-source }}" != '\''manual'\'':
                print("No data sources found, creating sample presentation...")
                generator.processed_text = "Sample content for presentation generation demonstration."
                generator.content_data = [
                    {
                        '\''type'\'': '\''sample'\'',
                        '\''title'\'': '\''Sample Data'\'',
                        '\''content'\'': '\''This is a sample presentation generated without input data.'\''
                    }
                ]
            
            # Generate presentation
            try:
                output_file, summary = generator.generate_presentation(int("${{ inputs.slide-count }}"))
                
                print(f"Slide generation completed successfully!")
                print(f"Output file: {output_file}")
                print(f"Summary: {json.dumps(summary, indent=2)}")
                
                # Set GitHub Action outputs
                print(f"::set-output name=status::success")
                print(f"::set-output name=output_file::{output_file}")
                print(f"::set-output name=slide_summary::{json.dumps(summary)}")
                
            except Exception as e:
                print(f"Slide generation failed: {e}")
                print(f"::set-output name=status::failed")
        
        if __name__ == "__main__":
            main()
        EOF
        
        python slide_generator.py

    - name: 📊 Generate Slide Report
      run: |
        echo "## 🎨 Slide Generation Report" >> $GITHUB_STEP_SUMMARY
        echo "- **Task ID**: ${{ inputs.task-id }}" >> $GITHUB_STEP_SUMMARY
        echo "- **Data Source**: ${{ inputs.data-source }}" >> $GITHUB_STEP_SUMMARY
        echo "- **Template**: ${{ inputs.template-type }}" >> $GITHUB_STEP_SUMMARY
        echo "- **Theme**: ${{ inputs.theme }}" >> $GITHUB_STEP_SUMMARY
        echo "- **Language**: ${{ inputs.language }}" >> $GITHUB_STEP_SUMMARY
        echo "- **Status**: ${{ steps.slide-generation.outputs.status }}" >> $GITHUB_STEP_SUMMARY
        
        if [ -f "outputs/slides/${{ inputs.task-id }}/summary.json" ]; then
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "### Generation Results:" >> $GITHUB_STEP_SUMMARY
          cat outputs/slides/${{ inputs.task-id }}/summary.json | jq -r '\''
            "- **Slide Count**: " + (.slide_count | tostring) + "\n" +
            "- **Data Sources**: " + (.data_sources | tostring) + "\n" +
            "- **Text Length**: " + (.total_text_length | tostring) + " characters\n" +
            "- **Generation Time**: " + .generation_time
          '\'' >> $GITHUB_STEP_SUMMARY
        fi

    - name: 📤 Upload Slide Generation Results
      uses: actions/upload-artifact@v4
      if: steps.slide-generation.outputs.status == '\''success'\''
      with:
        name: slide-generation-results-${{ inputs.task-id }}
        path: outputs/slides/${{ inputs.task-id }}/
        retention-days: 30

    - name: 💾 Commit Results to Repository
      if: steps.slide-generation.outputs.status == '\''success'\''
      run: |
        git config --local user.email "action@github.com"
        git config --local user.name "GitHub Action"
        
        if [ -n "$(git status --porcelain)" ]; then
          git add outputs/
          git commit -m "🎨 Add slide generation results for task ${{ inputs.task-id }}"
          git push
        fi' | base64)"

echo "✅ Deployment complete!"
echo "🎉 GitHub Actions workflows are now active!"
