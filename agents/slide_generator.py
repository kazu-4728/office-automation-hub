#!/usr/bin/env python3
"""
Slide Generation Agent - Automated presentation creation
Generates professional presentations from data and content
"""

import json
import sys
import os
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
import random

class SlideGenerator:
    """Automated slide generation agent"""
    
    def __init__(self, config: Dict[str, Any] = None):
        self.config = config or {}
        self.templates = {
            'professional': self._get_professional_template(),
            'corporate': self._get_corporate_template(),
            'creative': self._get_creative_template(),
            'minimal': self._get_minimal_template()
        }
        
    def generate_presentation(self, data: Dict[str, Any], options: Dict[str, Any] = None) -> Dict[str, Any]:
        """Generate a presentation from data"""
        options = options or {}
        
        try:
            template = options.get('template', 'professional')
            slides_config = self.templates.get(template, self.templates['professional'])
            
            presentation = {
                'title': data.get('title', 'Automated Presentation'),
                'subtitle': data.get('subtitle', f'Generated on {datetime.now().strftime("%Y-%m-%d")}'),
                'template': template,
                'timestamp': datetime.now().isoformat(),
                'slides': []
            }
            
            # Generate slides based on data
            presentation['slides'].extend([
                self._create_title_slide(data, slides_config),
                self._create_agenda_slide(data, slides_config),
                *self._create_content_slides(data, slides_config, options),
                self._create_summary_slide(data, slides_config),
                self._create_closing_slide(data, slides_config)
            ])
            
            # Add charts if data contains metrics
            if 'metrics' in data or 'statistics' in data:
                presentation['slides'].insert(-2, self._create_charts_slide(data, slides_config))
            
            return {
                'status': 'completed',
                'presentation': presentation,
                'slide_count': len(presentation['slides']),
                'estimated_duration': len(presentation['slides']) * 2  # 2 minutes per slide
            }
            
        except Exception as e:
            return {
                'status': 'failed',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
    
    def _get_professional_template(self) -> Dict[str, Any]:
        """Professional template configuration"""
        return {
            'name': 'Professional',
            'colors': {
                'primary': '#1E3A8A',  # Dark blue
                'secondary': '#3B82F6',  # Light blue
                'accent': '#F59E0B',  # Orange
                'background': '#FFFFFF',
                'text': '#1F2937'
            },
            'fonts': {
                'title': 'Arial',
                'body': 'Calibri'
            },
            'layout': 'clean'
        }
    
    def _get_corporate_template(self) -> Dict[str, Any]:
        """Corporate template configuration"""
        return {
            'name': 'Corporate',
            'colors': {
                'primary': '#111827',  # Dark gray
                'secondary': '#6B7280',  # Gray
                'accent': '#10B981',  # Green
                'background': '#F9FAFB',
                'text': '#111827'
            },
            'fonts': {
                'title': 'Helvetica',
                'body': 'Arial'
            },
            'layout': 'structured'
        }
    
    def _get_creative_template(self) -> Dict[str, Any]:
        """Creative template configuration"""
        return {
            'name': 'Creative',
            'colors': {
                'primary': '#7C3AED',  # Purple
                'secondary': '#EC4899',  # Pink
                'accent': '#F59E0B',  # Orange
                'background': '#FEF3C7',
                'text': '#1F2937'
            },
            'fonts': {
                'title': 'Impact',
                'body': 'Comic Sans MS'
            },
            'layout': 'dynamic'
        }
    
    def _get_minimal_template(self) -> Dict[str, Any]:
        """Minimal template configuration"""
        return {
            'name': 'Minimal',
            'colors': {
                'primary': '#000000',
                'secondary': '#6B7280',
                'accent': '#EF4444',
                'background': '#FFFFFF',
                'text': '#000000'
            },
            'fonts': {
                'title': 'Georgia',
                'body': 'Times New Roman'
            },
            'layout': 'simple'
        }
    
    def _create_title_slide(self, data: Dict[str, Any], template: Dict[str, Any]) -> Dict[str, Any]:
        """Create title slide"""
        return {
            'type': 'title',
            'layout': 'title_slide',
            'content': {
                'title': data.get('title', 'Presentation Title'),
                'subtitle': data.get('subtitle', ''),
                'author': data.get('author', ''),
                'date': datetime.now().strftime('%B %d, %Y')
            },
            'design': template
        }
    
    def _create_agenda_slide(self, data: Dict[str, Any], template: Dict[str, Any]) -> Dict[str, Any]:
        """Create agenda slide"""
        sections = data.get('sections', [])
        if not sections:
            sections = ['Introduction', 'Main Content', 'Analysis', 'Conclusions']
        
        return {
            'type': 'agenda',
            'layout': 'bullet_points',
            'content': {
                'title': 'Agenda',
                'items': sections
            },
            'design': template
        }
    
    def _create_content_slides(self, data: Dict[str, Any], template: Dict[str, Any], options: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Create content slides from data"""
        slides = []
        max_slides = options.get('max_slides', 10)
        
        # Process text content
        if 'content' in data:
            content = data['content']
            if isinstance(content, str):
                # Split long content into multiple slides
                chunks = self._split_content(content, 500)  # 500 chars per slide
                for i, chunk in enumerate(chunks[:max_slides-5]):  # Reserve 5 for other slides
                    slides.append({
                        'type': 'content',
                        'layout': 'title_and_content',
                        'content': {
                            'title': f'Content {i+1}',
                            'text': chunk
                        },
                        'design': template
                    })
            elif isinstance(content, list):
                for i, item in enumerate(content[:max_slides-5]):
                    slides.append({
                        'type': 'content',
                        'layout': 'title_and_content',
                        'content': {
                            'title': item.get('title', f'Section {i+1}'),
                            'text': item.get('text', ''),
                            'bullets': item.get('bullets', [])
                        },
                        'design': template
                    })
        
        # Process key points
        if 'key_points' in data:
            slides.append({
                'type': 'key_points',
                'layout': 'bullet_points',
                'content': {
                    'title': 'Key Points',
                    'items': data['key_points'][:7]  # Max 7 points
                },
                'design': template
            })
        
        # Process tables
        if 'tables' in data and data['tables']:
            for i, table in enumerate(data['tables'][:2]):  # Max 2 table slides
                slides.append({
                    'type': 'table',
                    'layout': 'table',
                    'content': {
                        'title': f'Table {i+1}',
                        'headers': table.get('headers', []),
                        'data': table.get('data', [])[:10]  # Max 10 rows
                    },
                    'design': template
                })
        
        return slides
    
    def _create_charts_slide(self, data: Dict[str, Any], template: Dict[str, Any]) -> Dict[str, Any]:
        """Create charts slide"""
        metrics = data.get('metrics', {}) or data.get('statistics', {})
        
        chart_data = []
        for key, value in list(metrics.items())[:4]:  # Max 4 metrics
            if isinstance(value, (int, float)):
                chart_data.append({
                    'label': key,
                    'value': value
                })
        
        return {
            'type': 'charts',
            'layout': 'charts',
            'content': {
                'title': 'Data Visualization',
                'charts': [
                    {
                        'type': 'bar',
                        'data': chart_data
                    }
                ]
            },
            'design': template
        }
    
    def _create_summary_slide(self, data: Dict[str, Any], template: Dict[str, Any]) -> Dict[str, Any]:
        """Create summary slide"""
        summary_points = data.get('summary', [])
        if not summary_points:
            summary_points = [
                'Key findings have been presented',
                'Data has been analyzed',
                'Recommendations provided'
            ]
        
        return {
            'type': 'summary',
            'layout': 'bullet_points',
            'content': {
                'title': 'Summary',
                'items': summary_points[:5]
            },
            'design': template
        }
    
    def _create_closing_slide(self, data: Dict[str, Any], template: Dict[str, Any]) -> Dict[str, Any]:
        """Create closing slide"""
        return {
            'type': 'closing',
            'layout': 'centered_text',
            'content': {
                'title': 'Thank You',
                'subtitle': data.get('closing_message', 'Questions?'),
                'contact': data.get('contact', '')
            },
            'design': template
        }
    
    def _split_content(self, text: str, chunk_size: int) -> List[str]:
        """Split long text into chunks"""
        words = text.split()
        chunks = []
        current_chunk = []
        current_size = 0
        
        for word in words:
            word_size = len(word) + 1
            if current_size + word_size > chunk_size:
                chunks.append(' '.join(current_chunk))
                current_chunk = [word]
                current_size = word_size
            else:
                current_chunk.append(word)
                current_size += word_size
        
        if current_chunk:
            chunks.append(' '.join(current_chunk))
        
        return chunks
    
    def save_presentation(self, presentation: Dict[str, Any], output_dir: str = 'outputs/slides'):
        """Save presentation data"""
        os.makedirs(output_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # Save presentation data as JSON
        json_file = os.path.join(output_dir, f'presentation_{timestamp}.json')
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(presentation, f, indent=2, ensure_ascii=False)
        
        # Generate PPTX structure (simplified - actual PPTX generation would use python-pptx)
        pptx_file = os.path.join(output_dir, f'presentation_{timestamp}.pptx')
        self._generate_pptx_placeholder(presentation, pptx_file)
        
        # Generate HTML preview
        html_file = os.path.join(output_dir, f'preview_{timestamp}.html')
        self._generate_html_preview(presentation, html_file)
        
        print(f"Presentation saved to {output_dir}")
        return {
            'json_file': json_file,
            'pptx_file': pptx_file,
            'html_preview': html_file,
            'slide_count': len(presentation['presentation']['slides'])
        }
    
    def _generate_pptx_placeholder(self, presentation: Dict[str, Any], output_file: str):
        """Generate PPTX placeholder (actual implementation would use python-pptx)"""
        # This is a placeholder - actual PPTX generation requires python-pptx library
        with open(output_file, 'wb') as f:
            f.write(b'PPTX_PLACEHOLDER')
        
    def _generate_html_preview(self, presentation: Dict[str, Any], output_file: str):
        """Generate HTML preview of presentation"""
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>{presentation['presentation']['title']}</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 20px; }}
                .slide {{ border: 1px solid #ccc; padding: 20px; margin: 20px 0; min-height: 400px; }}
                .title {{ font-size: 24px; font-weight: bold; margin-bottom: 10px; }}
                .subtitle {{ font-size: 18px; color: #666; }}
                .content {{ margin-top: 20px; }}
                ul {{ margin-left: 20px; }}
            </style>
        </head>
        <body>
            <h1>Presentation Preview</h1>
        """
        
        for i, slide in enumerate(presentation['presentation']['slides'], 1):
            html_content += f"""
            <div class="slide">
                <div class="title">Slide {i}: {slide.get('type', '').title()}</div>
                <div class="content">
            """
            
            content = slide.get('content', {})
            if 'title' in content:
                html_content += f"<h2>{content['title']}</h2>"
            if 'subtitle' in content:
                html_content += f"<p class='subtitle'>{content['subtitle']}</p>"
            if 'text' in content:
                html_content += f"<p>{content['text']}</p>"
            if 'items' in content:
                html_content += "<ul>"
                for item in content['items']:
                    html_content += f"<li>{item}</li>"
                html_content += "</ul>"
            
            html_content += """
                </div>
            </div>
            """
        
        html_content += """
        </body>
        </html>
        """
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html_content)


def main():
    """Main execution function"""
    # Get configuration from environment or arguments
    config = {
        'input_data': os.environ.get('INPUT_DATA', ''),
        'template': os.environ.get('TEMPLATE', 'professional'),
        'max_slides': int(os.environ.get('MAX_SLIDES', '15')),
        'output_format': os.environ.get('OUTPUT_FORMAT', 'pptx')
    }
    
    # Load input data
    if len(sys.argv) > 1:
        # Load from file
        with open(sys.argv[1], 'r', encoding='utf-8') as f:
            input_data = json.load(f)
    elif config['input_data']:
        # Load from environment
        input_data = json.loads(config['input_data'])
    else:
        # Default demo data
        input_data = {
            'title': 'Demo Presentation',
            'subtitle': 'Automated Slide Generation',
            'author': 'AI Agent',
            'sections': ['Introduction', 'Analysis', 'Results', 'Conclusions'],
            'content': [
                {'title': 'Introduction', 'text': 'This is an automated presentation.'},
                {'title': 'Key Features', 'bullets': ['Automated generation', 'Multiple templates', 'Data visualization']}
            ],
            'key_points': ['Point 1', 'Point 2', 'Point 3'],
            'summary': ['Successfully generated presentation', 'All data processed'],
            'metrics': {'Score': 95, 'Completion': 100, 'Quality': 88}
        }
    
    # Initialize generator
    generator = SlideGenerator(config)
    
    # Generate presentation
    print(f"Generating presentation with template: {config['template']}")
    options = {
        'template': config['template'],
        'max_slides': config['max_slides']
    }
    
    result = generator.generate_presentation(input_data, options)
    
    if result['status'] == 'completed':
        # Save presentation
        output_info = generator.save_presentation(result)
        
        # Output summary
        print("\n=== Presentation Generated ===")
        print(f"Slides created: {output_info['slide_count']}")
        print(f"Template used: {config['template']}")
        print(f"Output saved to: {output_info['pptx_file']}")
        print(f"Preview available at: {output_info['html_preview']}")
        
        # Return results for GitHub Actions
        print(f"::set-output name=presentation_file::{output_info['pptx_file']}")
        print(f"::set-output name=preview_file::{output_info['html_preview']}")
    else:
        print(f"Error generating presentation: {result.get('error')}")
        sys.exit(1)


if __name__ == '__main__':
    main()