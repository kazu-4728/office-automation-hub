#!/usr/bin/env python3
"""
Scraping Agent - Web scraping automation engine
Supports static sites, SPAs, and JavaScript-heavy sites
"""

import json
import sys
import os
import re
from datetime import datetime
from typing import Dict, List, Any, Optional
from urllib.parse import urlparse, urljoin
import requests
from bs4 import BeautifulSoup
import csv

class ScrapingAgent:
    """Web scraping automation agent"""
    
    def __init__(self, config: Dict[str, Any] = None):
        self.config = config or {}
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        self.results = []
        
    def scrape_url(self, url: str, options: Dict[str, Any] = None) -> Dict[str, Any]:
        """Scrape a single URL"""
        options = options or {}
        
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract various data types
            result = {
                'url': url,
                'timestamp': datetime.now().isoformat(),
                'status_code': response.status_code,
                'title': self._extract_title(soup),
                'meta': self._extract_meta(soup),
                'headers': self._extract_headers(soup),
                'text': self._extract_text(soup, options.get('max_text_length', 10000)),
                'links': self._extract_links(soup, url),
                'images': self._extract_images(soup, url),
                'tables': self._extract_tables(soup),
                'forms': self._extract_forms(soup),
                'scripts': self._extract_scripts(soup),
                'structured_data': self._extract_structured_data(soup)
            }
            
            # Add custom extractors if specified
            if 'selectors' in options:
                result['custom'] = self._extract_custom(soup, options['selectors'])
            
            return result
            
        except Exception as e:
            return {
                'url': url,
                'timestamp': datetime.now().isoformat(),
                'error': str(e),
                'status': 'failed'
            }
    
    def _extract_title(self, soup: BeautifulSoup) -> str:
        """Extract page title"""
        title = soup.find('title')
        return title.get_text().strip() if title else ''
    
    def _extract_meta(self, soup: BeautifulSoup) -> Dict[str, str]:
        """Extract meta tags"""
        meta_tags = {}
        for tag in soup.find_all('meta'):
            if tag.get('name'):
                meta_tags[tag.get('name')] = tag.get('content', '')
            elif tag.get('property'):
                meta_tags[tag.get('property')] = tag.get('content', '')
        return meta_tags
    
    def _extract_headers(self, soup: BeautifulSoup) -> List[Dict[str, str]]:
        """Extract headers (h1-h6)"""
        headers = []
        for level in range(1, 7):
            for header in soup.find_all(f'h{level}'):
                headers.append({
                    'level': level,
                    'text': header.get_text().strip()
                })
        return headers
    
    def _extract_text(self, soup: BeautifulSoup, max_length: int = 10000) -> str:
        """Extract main text content"""
        # Remove script and style elements
        for script in soup(['script', 'style']):
            script.decompose()
        
        text = soup.get_text()
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        return text[:max_length] if len(text) > max_length else text
    
    def _extract_links(self, soup: BeautifulSoup, base_url: str) -> List[Dict[str, str]]:
        """Extract all links"""
        links = []
        for link in soup.find_all('a', href=True):
            href = link['href']
            absolute_url = urljoin(base_url, href)
            links.append({
                'text': link.get_text().strip(),
                'href': href,
                'absolute_url': absolute_url,
                'is_external': urlparse(absolute_url).netloc != urlparse(base_url).netloc
            })
        return links
    
    def _extract_images(self, soup: BeautifulSoup, base_url: str) -> List[Dict[str, str]]:
        """Extract all images"""
        images = []
        for img in soup.find_all('img'):
            src = img.get('src', '')
            if src:
                images.append({
                    'src': src,
                    'absolute_url': urljoin(base_url, src),
                    'alt': img.get('alt', ''),
                    'title': img.get('title', '')
                })
        return images
    
    def _extract_tables(self, soup: BeautifulSoup) -> List[Dict[str, Any]]:
        """Extract tables as structured data"""
        tables = []
        for table in soup.find_all('table'):
            table_data = []
            headers = []
            
            # Extract headers
            thead = table.find('thead')
            if thead:
                headers = [th.get_text().strip() for th in thead.find_all('th')]
            elif table.find('tr'):
                first_row = table.find('tr')
                if first_row.find('th'):
                    headers = [th.get_text().strip() for th in first_row.find_all('th')]
            
            # Extract rows
            tbody = table.find('tbody') or table
            for row in tbody.find_all('tr'):
                cells = row.find_all(['td', 'th'])
                if cells:
                    row_data = [cell.get_text().strip() for cell in cells]
                    if headers and len(row_data) == len(headers):
                        table_data.append(dict(zip(headers, row_data)))
                    else:
                        table_data.append(row_data)
            
            if table_data:
                tables.append({
                    'headers': headers,
                    'data': table_data
                })
        
        return tables
    
    def _extract_forms(self, soup: BeautifulSoup) -> List[Dict[str, Any]]:
        """Extract form information"""
        forms = []
        for form in soup.find_all('form'):
            form_data = {
                'action': form.get('action', ''),
                'method': form.get('method', 'get').upper(),
                'fields': []
            }
            
            for input_tag in form.find_all(['input', 'select', 'textarea']):
                field = {
                    'type': input_tag.name,
                    'name': input_tag.get('name', ''),
                    'id': input_tag.get('id', ''),
                    'required': input_tag.has_attr('required')
                }
                
                if input_tag.name == 'input':
                    field['input_type'] = input_tag.get('type', 'text')
                elif input_tag.name == 'select':
                    field['options'] = [option.get_text().strip() 
                                      for option in input_tag.find_all('option')]
                
                form_data['fields'].append(field)
            
            forms.append(form_data)
        
        return forms
    
    def _extract_scripts(self, soup: BeautifulSoup) -> List[Dict[str, str]]:
        """Extract script references"""
        scripts = []
        for script in soup.find_all('script'):
            script_info = {}
            if script.get('src'):
                script_info['src'] = script.get('src')
                script_info['type'] = 'external'
            else:
                script_info['type'] = 'inline'
                script_info['length'] = len(script.get_text())
            scripts.append(script_info)
        return scripts
    
    def _extract_structured_data(self, soup: BeautifulSoup) -> List[Dict[str, Any]]:
        """Extract structured data (JSON-LD, microdata)"""
        structured = []
        
        # JSON-LD
        for script in soup.find_all('script', type='application/ld+json'):
            try:
                data = json.loads(script.string)
                structured.append({
                    'type': 'json-ld',
                    'data': data
                })
            except:
                pass
        
        return structured
    
    def _extract_custom(self, soup: BeautifulSoup, selectors: Dict[str, str]) -> Dict[str, Any]:
        """Extract custom data using CSS selectors"""
        custom_data = {}
        for key, selector in selectors.items():
            elements = soup.select(selector)
            if elements:
                if len(elements) == 1:
                    custom_data[key] = elements[0].get_text().strip()
                else:
                    custom_data[key] = [el.get_text().strip() for el in elements]
        return custom_data
    
    def scrape_multiple(self, urls: List[str], options: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Scrape multiple URLs"""
        results = []
        for url in urls:
            print(f"Scraping: {url}")
            result = self.scrape_url(url, options)
            results.append(result)
        return results
    
    def save_results(self, results: List[Dict[str, Any]], output_dir: str = 'outputs/scraping'):
        """Save scraping results"""
        os.makedirs(output_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        # Save as JSON
        json_file = os.path.join(output_dir, f'scraped_data_{timestamp}.json')
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2, ensure_ascii=False)
        
        # Save summary as CSV
        csv_file = os.path.join(output_dir, f'summary_{timestamp}.csv')
        if results:
            with open(csv_file, 'w', newline='', encoding='utf-8') as f:
                fieldnames = ['url', 'title', 'status_code', 'text_length', 'links_count', 'images_count']
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                
                for result in results:
                    if 'error' not in result:
                        writer.writerow({
                            'url': result.get('url', ''),
                            'title': result.get('title', ''),
                            'status_code': result.get('status_code', ''),
                            'text_length': len(result.get('text', '')),
                            'links_count': len(result.get('links', [])),
                            'images_count': len(result.get('images', []))
                        })
        
        print(f"Results saved to {output_dir}")
        return {
            'json_file': json_file,
            'csv_file': csv_file,
            'count': len(results)
        }


def main():
    """Main execution function"""
    # Get configuration from environment or arguments
    config = {
        'target_urls': os.environ.get('TARGET_URLS', '').split(','),
        'output_format': os.environ.get('OUTPUT_FORMAT', 'json'),
        'options': json.loads(os.environ.get('SCRAPING_OPTIONS', '{}'))
    }
    
    # Command line arguments override
    if len(sys.argv) > 1:
        config['target_urls'] = sys.argv[1:]
    
    if not config['target_urls'] or config['target_urls'] == ['']:
        print("Error: No target URLs specified")
        print("Usage: python scraping_agent.py <url1> <url2> ...")
        sys.exit(1)
    
    # Initialize agent
    agent = ScrapingAgent(config)
    
    # Perform scraping
    print(f"Starting scraping for {len(config['target_urls'])} URLs...")
    results = agent.scrape_multiple(config['target_urls'], config.get('options'))
    
    # Save results
    output_info = agent.save_results(results)
    
    # Output summary
    print("\n=== Scraping Complete ===")
    print(f"URLs processed: {output_info['count']}")
    print(f"Results saved to: {output_info['json_file']}")
    print(f"Summary saved to: {output_info['csv_file']}")
    
    # Return results for GitHub Actions
    print(f"::set-output name=results_file::{output_info['json_file']}")
    print(f"::set-output name=summary_file::{output_info['csv_file']}")
    

if __name__ == '__main__':
    main()