# GitHub Actions AI Agent Hub

**These instructions provide guidance for working effectively in this codebase. Follow these patterns first, and use additional search or context gathering when needed for specific edge cases or when information here is incomplete.**

GitHub Actions AI Agent Hub is a TypeScript/React web application with Python AI agents that automates office tasks including web scraping, PDF/OCR processing, and slide generation. The system runs on GitHub Actions with multiple trigger mechanisms and provides a web interface for monitoring and control.

## Working Effectively

### Essential Setup Commands
Run these commands in sequence for a working development environment:

- **Install Node.js dependencies**: `npm install` -- typically takes ~3 seconds (environment dependent). Allow 60+ second timeout.
- **Install Python dependencies**: `pip3 install -r requirements.txt` -- typically takes ~35 seconds fresh, ~2 seconds cached (environment dependent). Allow 90+ second timeout.
- **Build web application**: `npm run build` -- typically takes ~2 seconds (environment dependent). Allow 30+ second timeout.
- **Run tests**: `npm test` -- typically takes ~2 seconds, rebuilds automatically (environment dependent). Allow 30+ second timeout.

### Development Workflow
- **Start development server**: `npm run dev` -- typically ready in ~1 second on http://localhost:5173/
- **Start preview server**: `npm run preview` -- Cloudflare Workers preview on http://localhost:8788/
- **Run Python agents**: `python3 agents/orchestrator.py [pipeline_type]` -- instant for status, ~15+ seconds for full pipeline (environment dependent)

### Build and Deploy
- **Production build**: `npm run build` -- outputs to dist/_worker.js, typically takes ~2 seconds
- **Deploy to Cloudflare**: `npm run deploy` -- builds and deploys using wrangler
- **Generate CF types**: `npm run cf-typegen` -- generates Cloudflare bindings

## Recommended Validation Steps

### CI/CD Automated Testing
The repository includes automated GitHub Actions workflows that run tests and validation. These automated tests provide the primary quality assurance.

### Manual Validation (Recommended)
After making code changes, consider running this validation sequence locally for additional confidence:

1. **Build validation**: `npm run build && npm test` -- should complete in under ~5 seconds total (environment dependent)
2. **Development server test**: `npm run dev` then verify http://localhost:5173/ loads with title "GitHub Actions AI Agent Hub - 自動化エージェントシステム"
3. **API endpoint validation**: Test `curl http://localhost:5173/api/stats` returns JSON with task statistics
4. **Agent functionality test**: `curl http://localhost:5173/api/agents/status` returns agent status JSON
5. **Python agent test**: `python3 agents/orchestrator.py status` -- should complete with "Pipeline Complete" message
6. **Full pipeline test**: `SCRAPING_URLS="http://localhost:8000" python3 agents/orchestrator.py full` -- should complete all 3 tasks (scraping, pdf_ocr, slide_generation)

### User Scenario Testing
Consider testing this complete user workflow after making changes:
1. Start dev server: `npm run dev`
2. Verify homepage loads correctly at http://localhost:5173/
3. Test API endpoints return valid JSON responses
4. Test Python pipeline execution with sample data
5. Verify outputs directory structure is created correctly

## Timing Expectations and Timeouts

**Avoid canceling builds or long-running commands prematurely. Set appropriate timeouts:**

- **npm install**: typically ~3 seconds, use 60+ second timeout (environment dependent)
- **pip3 install**: typically ~35 seconds, use 90+ second timeout (environment dependent)  
- **npm run build**: typically ~2 seconds, use 30+ second timeout (environment dependent)
- **npm test**: typically ~2 seconds, use 30+ second timeout (environment dependent)
- **npm run dev**: typically ~1 second startup, use 30+ second timeout (environment dependent)
- **Python agents**: typically 1-15 seconds depending on pipeline, use 120+ second timeout for full pipeline (environment dependent)

## Repository Structure and Navigation

### Key Projects
- **Web Application**: `src/index.tsx` - Hono framework TypeScript app for Cloudflare Workers
- **Python Agents**: `agents/` directory contains orchestrator.py, scraping_agent.py, pdf_ocr_agent.py, slide_generator.py
- **GitHub Workflows**: `.github/workflows/` contains agent orchestration workflows
- **Static Assets**: `public/static/` contains CSS and JavaScript files
- **Tests**: `test/app.test.js` contains Node.js test suite

### Important File Locations
- **Main entry point**: `src/index.tsx` - web app routes and API endpoints
- **Agent orchestrator**: `agents/orchestrator.py` - coordinates all Python agents
- **Package config**: `package.json` - npm scripts and dependencies
- **Python deps**: `requirements.txt` - Python package requirements
- **Build config**: `vite.config.ts` - Vite build configuration
- **Deploy config**: `wrangler.jsonc` - Cloudflare Workers configuration
- **Environment**: `.env.example` - environment variable templates

### Output Structure
```
outputs/
├── scraping/{task-id}/scraped_data.json
├── pdf-processing/{task-id}/processing_results.json
├── slides/{task-id}/presentation_{task-id}.pptx
└── pipelines/{pipeline-id}.json
```

## Common Commands Reference

### Development
- `npm run dev` - Start development server (http://localhost:5173/)
- `npm run build` - Build for production (outputs dist/_worker.js)
- `npm test` - Run test suite (rebuilds automatically)
- `npm run preview` - Preview production build (http://localhost:8788/)

### Python Agents
- `python3 agents/orchestrator.py status` - Check agent status
- `python3 agents/orchestrator.py full` - Run complete pipeline
- `python3 agents/orchestrator.py scraping` - Run scraping only
- `python3 agents/orchestrator.py pdf-ocr` - Run PDF processing only

### Git and GitHub
- `./scripts/ensure_git_remote.sh` - Ensure correct git remote (run after Copilot session start)
- GitHub Actions workflows trigger on: Issues, PRs, repository_dispatch, schedule, workflow_dispatch

## Environment Variables and Configuration

### Required for Full Functionality
**Important: Never commit sensitive information like API keys to the repository.**

For local development, create a `.env` file (not committed to git) with these variables:
```
OPENAI_API_KEY=your_openai_api_key_here
PIPELINE_TYPE=full
SCRAPING_URLS=http://localhost:8000
PDF_FILES=
PRESENTATION_TITLE=Automated Report
```

For production/GitHub Actions, set these in GitHub repository settings under Secrets:
- `OPENAI_API_KEY` - Required for AI-powered features (store in GitHub Secrets, not in code)
- `PIPELINE_TYPE` - Controls agent execution mode (full, scraping, pdf-ocr, etc.)
- `SCRAPING_URLS` - Comma-separated URLs for scraping tasks
- `PDF_FILES` - Comma-separated PDF file paths for processing
- `PRESENTATION_TITLE` - Title for generated presentations

### Agent Configuration
- `PERFORM_OCR` - Enable/disable OCR processing (true/false)
- `OCR_LANGUAGE` - OCR language setting (default: eng+jpn)
- `TEMPLATE` - Presentation template (default: professional)
- `MAX_SLIDES` - Maximum slides in generated presentations (default: 15)

## Testing and Quality Assurance

### Before Every Commit
1. **Git remote check**: Run `./scripts/ensure_git_remote.sh`
2. **Build validation**: `npm run build` should succeed in under ~5 seconds (environment dependent)
3. **Test validation**: `npm test` should pass in under ~5 seconds (environment dependent)
4. **Manual scenario testing**: Consider completing the user scenario testing workflow above
5. **Python agent testing**: Verify at least one Python agent command works

### CI/CD Validation
The repository includes GitHub Actions workflows that:
- Run automatically on schedule (daily at 07:00 JST)
- Can be triggered manually via workflow_dispatch
- Support issue-based triggering with specific labels
- Include preflight checks for required secrets

### Debugging Failed Builds
- Check `npm audit` for security vulnerabilities (may show warnings)
- Verify Node.js version 20+ and Python 3.11+ compatibility
- Ensure all required secrets are configured in GitHub repository settings
- Test locally before pushing to verify functionality

## Agent Integration Patterns

### Creating New Agents
1. Follow the pattern in `agents/scraping_agent.py`
2. Add corresponding workflow in `.github/workflows/task-[name].yml`
3. Integrate with `agents/orchestrator.py`
4. Update environment variable configuration
5. Add to API endpoints in `src/index.tsx`

### Workflow Integration
- All workflows inherit from main orchestrator pattern
- Use `workflow_dispatch` for manual testing
- Include proper error handling and status reporting
- Follow the output structure convention in `outputs/`

## Quick Reference Commands

```bash
# Complete setup from fresh clone
npm install                    # typically ~3 seconds (environment dependent)
pip3 install -r requirements.txt  # typically ~35 seconds (environment dependent)
npm run build                  # typically ~2 seconds (environment dependent)
npm test                       # typically ~2 seconds (environment dependent)

# Development workflow
npm run dev                   # Start dev server
# Verify http://localhost:5173/ in browser
python3 agents/orchestrator.py status  # Test agents

# Full validation with local test server
SCRAPING_URLS="http://localhost:8000" python3 agents/orchestrator.py full
# Should complete with "Pipeline Complete" message and create outputs/
```

## Troubleshooting

### Common Issues
- **"Missing secrets" in workflows**: Configure OPENAI_API_KEY in repository settings or use `run_mode: housekeeping-only`
- **Build failures**: Ensure Node.js 20+ and run `npm install` first
- **Python import errors**: Run `pip3 install -r requirements.txt` and check Python 3.11+ version
- **Git push failures**: Run `./scripts/ensure_git_remote.sh` to configure remote

### Performance Notes
- Web application builds are typically very fast (under ~2 seconds, environment dependent)
- Python dependency installation is typically the longest step (~35 seconds, environment dependent)
- All operations typically complete in under 2 minutes total (environment dependent)
- Development server starts quickly and supports hot reload

Note: Consider validating your changes using the recommended user scenario testing workflow. The goal is working, functional code that follows the established patterns and passes all validation steps.