#!/usr/bin/env python3
"""
Agent Orchestrator - Coordinates multiple agents for complete automation pipelines
"""

import json
import sys
import os
from datetime import datetime
from typing import Dict, List, Any, Optional
import subprocess
import time

# Import agents
from scraping_agent import ScrapingAgent
from pdf_ocr_agent import PDFOCRAgent
from slide_generator import SlideGenerator


class AgentOrchestrator:
    """Orchestrates multiple agents for complex automation tasks"""
    
    def __init__(self, config: Dict[str, Any] = None):
        self.config = config or {}
        self.agents = {
            'scraping': ScrapingAgent(),
            'pdf_ocr': PDFOCRAgent(),
            'slide_gen': SlideGenerator()
        }
        self.pipeline_results = []
        
    def execute_pipeline(self, pipeline_config: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a complete automation pipeline"""
        
        pipeline_id = f"pipeline_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        print(f"Starting pipeline: {pipeline_id}")
        
        results = {
            'pipeline_id': pipeline_id,
            'started_at': datetime.now().isoformat(),
            'tasks': [],
            'status': 'running'
        }
        
        try:
            # Determine pipeline type
            pipeline_type = pipeline_config.get('type', 'full')
            
            if pipeline_type == 'full':
                results['tasks'] = self._execute_full_pipeline(pipeline_config)
            elif pipeline_type == 'scraping_to_slides':
                results['tasks'] = self._execute_scraping_to_slides(pipeline_config)
            elif pipeline_type == 'pdf_to_slides':
                results['tasks'] = self._execute_pdf_to_slides(pipeline_config)
            else:
                results['tasks'] = self._execute_custom_pipeline(pipeline_config)
            
            results['status'] = 'completed'
            results['completed_at'] = datetime.now().isoformat()
            
        except Exception as e:
            results['status'] = 'failed'
            results['error'] = str(e)
            results['failed_at'] = datetime.now().isoformat()
        
        return results
    
    def _execute_full_pipeline(self, config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Execute full automation pipeline: Scraping -> PDF/OCR -> Slides"""
        tasks = []
        
        # Step 1: Web Scraping
        if 'scraping_targets' in config:
            print("Step 1: Web Scraping")
            scraping_result = self._run_scraping(config['scraping_targets'])
            tasks.append(scraping_result)
            
            # Use scraped data for next steps
            config['scraped_data'] = scraping_result.get('output', {})
        
        # Step 2: PDF/OCR Processing
        if 'pdf_files' in config:
            print("Step 2: PDF/OCR Processing")
            pdf_result = self._run_pdf_ocr(config['pdf_files'], config.get('ocr_options', {}))
            tasks.append(pdf_result)
            
            # Use extracted text for slide generation
            config['pdf_data'] = pdf_result.get('output', {})
        
        # Step 3: Slide Generation
        print("Step 3: Slide Generation")
        slide_data = self._prepare_slide_data(config)
        slide_result = self._run_slide_generation(slide_data, config.get('slide_options', {}))
        tasks.append(slide_result)
        
        return tasks
    
    def _execute_scraping_to_slides(self, config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Execute scraping to slides pipeline"""
        tasks = []
        
        # Scraping
        print("Scraping websites...")
        scraping_result = self._run_scraping(config.get('urls', []))
        tasks.append(scraping_result)
        
        # Process scraped data and generate slides
        if scraping_result['status'] == 'completed':
            print("Generating slides from scraped data...")
            slide_data = {
                'title': config.get('title', 'Web Scraping Results'),
                'content': self._format_scraped_data(scraping_result['output'])
            }
            slide_result = self._run_slide_generation(slide_data, config.get('slide_options', {}))
            tasks.append(slide_result)
        
        return tasks
    
    def _execute_pdf_to_slides(self, config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Execute PDF to slides pipeline"""
        tasks = []
        
        # PDF Processing
        print("Processing PDF files...")
        pdf_result = self._run_pdf_ocr(config.get('pdf_files', []), config.get('ocr_options', {}))
        tasks.append(pdf_result)
        
        # Generate slides from PDF content
        if pdf_result['status'] == 'completed':
            print("Generating slides from PDF content...")
            slide_data = {
                'title': config.get('title', 'PDF Analysis Results'),
                'content': self._format_pdf_data(pdf_result['output'])
            }
            slide_result = self._run_slide_generation(slide_data, config.get('slide_options', {}))
            tasks.append(slide_result)
        
        return tasks
    
    def _execute_custom_pipeline(self, config: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Execute custom pipeline based on configuration"""
        tasks = []
        
        for task in config.get('tasks', []):
            task_type = task.get('type')
            
            if task_type == 'scraping':
                result = self._run_scraping(task.get('targets', []))
            elif task_type == 'pdf_ocr':
                result = self._run_pdf_ocr(task.get('files', []), task.get('options', {}))
            elif task_type == 'slide_generation':
                result = self._run_slide_generation(task.get('data', {}), task.get('options', {}))
            else:
                result = {'type': task_type, 'status': 'skipped', 'reason': 'Unknown task type'}
            
            tasks.append(result)
        
        return tasks
    
    def _run_scraping(self, urls: List[str]) -> Dict[str, Any]:
        """Run scraping agent"""
        try:
            start_time = time.time()
            agent = self.agents['scraping']
            results = agent.scrape_multiple(urls)
            output_info = agent.save_results(results)
            
            return {
                'type': 'scraping',
                'status': 'completed',
                'duration': f"{time.time() - start_time:.2f}s",
                'urls_processed': len(urls),
                'output': output_info
            }
        except Exception as e:
            return {
                'type': 'scraping',
                'status': 'failed',
                'error': str(e)
            }
    
    def _run_pdf_ocr(self, files: List[str], options: Dict[str, Any]) -> Dict[str, Any]:
        """Run PDF/OCR agent"""
        try:
            start_time = time.time()
            agent = self.agents['pdf_ocr']
            results = agent.process_batch(files, options)
            output_info = agent.save_results(results)
            summary = agent.generate_summary(results)
            
            return {
                'type': 'pdf_ocr',
                'status': 'completed',
                'duration': f"{time.time() - start_time:.2f}s",
                'files_processed': len(files),
                'summary': summary,
                'output': output_info
            }
        except Exception as e:
            return {
                'type': 'pdf_ocr',
                'status': 'failed',
                'error': str(e)
            }
    
    def _run_slide_generation(self, data: Dict[str, Any], options: Dict[str, Any]) -> Dict[str, Any]:
        """Run slide generation agent"""
        try:
            start_time = time.time()
            agent = self.agents['slide_gen']
            result = agent.generate_presentation(data, options)
            
            if result['status'] == 'completed':
                output_info = agent.save_presentation(result)
                
                return {
                    'type': 'slide_generation',
                    'status': 'completed',
                    'duration': f"{time.time() - start_time:.2f}s",
                    'slides_created': result['slide_count'],
                    'output': output_info
                }
            else:
                return {
                    'type': 'slide_generation',
                    'status': 'failed',
                    'error': result.get('error', 'Unknown error')
                }
        except Exception as e:
            return {
                'type': 'slide_generation',
                'status': 'failed',
                'error': str(e)
            }
    
    def _prepare_slide_data(self, config: Dict[str, Any]) -> Dict[str, Any]:
        """Prepare data for slide generation from various sources"""
        slide_data = {
            'title': config.get('presentation_title', 'Automated Report'),
            'subtitle': f"Generated on {datetime.now().strftime('%Y-%m-%d')}",
            'author': config.get('author', 'AI Agent'),
            'sections': [],
            'content': [],
            'key_points': [],
            'metrics': {}
        }
        
        # Add scraped data if available
        if 'scraped_data' in config:
            scraped = config['scraped_data']
            if isinstance(scraped, dict):
                slide_data['sections'].append('Web Scraping Results')
                slide_data['content'].append({
                    'title': 'Scraped Data',
                    'text': f"Processed {scraped.get('count', 0)} URLs"
                })
        
        # Add PDF data if available
        if 'pdf_data' in config:
            pdf = config['pdf_data']
            if isinstance(pdf, dict):
                slide_data['sections'].append('PDF Analysis')
                slide_data['metrics']['PDF Pages'] = pdf.get('total_pages', 0)
                slide_data['metrics']['Text Characters'] = pdf.get('total_text_chars', 0)
        
        # Add custom content
        if 'custom_content' in config:
            slide_data['content'].extend(config['custom_content'])
        
        return slide_data
    
    def _format_scraped_data(self, data: Any) -> List[Dict[str, Any]]:
        """Format scraped data for slide generation"""
        formatted = []
        
        if isinstance(data, dict):
            formatted.append({
                'title': 'Scraping Summary',
                'bullets': [
                    f"URLs processed: {data.get('count', 0)}",
                    f"Output file: {data.get('json_file', 'N/A')}",
                    'Status: Completed'
                ]
            })
        
        return formatted
    
    def _format_pdf_data(self, data: Any) -> List[Dict[str, Any]]:
        """Format PDF data for slide generation"""
        formatted = []
        
        if isinstance(data, dict):
            formatted.append({
                'title': 'PDF Processing Summary',
                'bullets': [
                    f"Files processed: {data.get('count', 0)}",
                    f"Text extracted to: {data.get('text_dir', 'N/A')}",
                    f"Tables extracted to: {data.get('tables_dir', 'N/A')}"
                ]
            })
        
        return formatted


def main():
    """Main execution function for orchestrator"""
    # Get configuration from environment or arguments
    config = {
        'pipeline_type': os.environ.get('PIPELINE_TYPE', 'full'),
        'scraping_targets': os.environ.get('SCRAPING_URLS', '').split(','),
        'pdf_files': os.environ.get('PDF_FILES', '').split(','),
        'presentation_title': os.environ.get('PRESENTATION_TITLE', 'Automated Report'),
        'template': os.environ.get('TEMPLATE', 'professional')
    }
    
    # Parse command line for pipeline configuration
    if len(sys.argv) > 1:
        if sys.argv[1] == '--config':
            with open(sys.argv[2], 'r') as f:
                config = json.load(f)
        else:
            config['pipeline_type'] = sys.argv[1]
    
    # Initialize orchestrator
    orchestrator = AgentOrchestrator(config)
    
    # Prepare pipeline configuration
    pipeline_config = {
        'type': config['pipeline_type'],
        'scraping_targets': [url for url in config['scraping_targets'] if url],
        'pdf_files': [f for f in config['pdf_files'] if f],
        'presentation_title': config['presentation_title'],
        'slide_options': {
            'template': config['template'],
            'max_slides': 15
        }
    }
    
    # Execute pipeline
    print(f"=== Starting {config['pipeline_type']} Pipeline ===")
    results = orchestrator.execute_pipeline(pipeline_config)
    
    # Save results
    output_dir = 'outputs/pipelines'
    os.makedirs(output_dir, exist_ok=True)
    
    results_file = os.path.join(output_dir, f"{results['pipeline_id']}.json")
    with open(results_file, 'w') as f:
        json.dump(results, f, indent=2)
    
    # Output summary
    print(f"\n=== Pipeline Complete ===")
    print(f"Pipeline ID: {results['pipeline_id']}")
    print(f"Status: {results['status']}")
    print(f"Tasks executed: {len(results['tasks'])}")
    
    for task in results['tasks']:
        print(f"  - {task['type']}: {task['status']}")
    
    print(f"\nResults saved to: {results_file}")
    
    # Set output for GitHub Actions when available
    github_output = os.environ.get('GITHUB_OUTPUT')
    if github_output:
        with open(github_output, 'a') as output_file:
            output_file.write(f"pipeline_id={results['pipeline_id']}\n")
            output_file.write(f"results_file={results_file}\n")
            output_file.write(f"status={results['status']}\n")
    else:
        print('GITHUB_OUTPUT is not set. Skipping GitHub Actions output export.')

    # Exit with appropriate code
    sys.exit(0 if results['status'] == 'completed' else 1)


if __name__ == '__main__':
    main()