# GitHub Actions AI Agent Hub

**ALWAYS follow these instructions first and fallback to additional search and context gathering only if the information in these instructions is incomplete or found to be in error.**

GitHub Actions AI Agent Hub is a TypeScript/React web application with Python AI agents that automates office tasks including web scraping, PDF/OCR processing, and slide generation. The system runs on GitHub Actions with multiple trigger mechanisms and provides a web interface for monitoring and control.

## Working Effectively

### Essential Setup Commands
Run these commands in exact sequence for a working development environment:

- **Install Node.js dependencies**: `npm install` -- takes 3 seconds. NEVER CANCEL.
- **Install Python dependencies**: `pip3 install -r requirements.txt` -- takes 35 seconds. NEVER CANCEL. Set timeout to 90+ seconds.
- **Build web application**: `npm run build` -- takes 2 seconds. NEVER CANCEL.
- **Run tests**: `npm test` -- takes 2 seconds, rebuilds automatically. NEVER CANCEL.

### Development Workflow
- **Start development server**: `npm run dev` -- ready in ~1 second on http://localhost:5173/
- **Start preview server**: `npm run preview` -- Cloudflare Workers preview on http://localhost:8788/
- **Run Python agents**: `python3 agents/orchestrator.py [pipeline_type]` -- instant for status, 15+ seconds for full pipeline

### Build and Deploy
- **Production build**: `npm run build` -- outputs to dist/_worker.js, takes 2 seconds
- **Deploy to Cloudflare**: `npm run deploy` -- builds and deploys using wrangler
- **Generate CF types**: `npm run cf-typegen` -- generates Cloudflare bindings

## Critical Validation Requirements

### MANUAL VALIDATION REQUIREMENT
After ANY code changes, ALWAYS run this complete validation sequence:

1. **Build validation**: `npm run build && npm test` -- must pass in under 5 seconds total
2. **Development server test**: `npm run dev` then verify http://localhost:5173/ loads with title "GitHub Actions AI Agent Hub - 自動化エージェントシステム"
3. **API endpoint validation**: Test `curl http://localhost:5173/api/stats` returns JSON with task statistics
4. **Agent functionality test**: `curl http://localhost:5173/api/agents/status` returns agent status JSON
5. **Python agent test**: `python3 agents/orchestrator.py status` -- must complete with "Pipeline Complete" message
6. **Full pipeline test**: `SCRAPING_URLS="https://example.com" python3 agents/orchestrator.py full` -- must complete all 3 tasks (scraping, pdf_ocr, slide_generation)

### User Scenario Testing
ALWAYS test this complete user workflow after making changes:
1. Start dev server: `npm run dev`
2. Verify homepage loads correctly at http://localhost:5173/
3. Test API endpoints return valid JSON responses
4. Test Python pipeline execution with sample data
5. Verify outputs directory structure is created correctly

## Timing Expectations and Timeouts

**NEVER CANCEL builds or long-running commands. Set appropriate timeouts:**

- **npm install**: 3 seconds typical, use 60+ second timeout
- **pip3 install**: 35 seconds typical, use 90+ second timeout  
- **npm run build**: 2 seconds typical, use 30+ second timeout
- **npm test**: 2 seconds typical, use 30+ second timeout
- **npm run dev**: 1 second startup, use 30+ second timeout
- **Python agents**: 1-15 seconds depending on pipeline, use 120+ second timeout for full pipeline

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
Set these in `.env` for local development or GitHub Secrets for production:
- `OPENAI_API_KEY` - Required for AI-powered features
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
2. **Build validation**: `npm run build` must succeed in under 5 seconds
3. **Test validation**: `npm test` must pass in under 5 seconds
4. **Manual scenario testing**: Complete the user scenario testing workflow above
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
npm install                    # 3 seconds
pip3 install -r requirements.txt  # 35 seconds
npm run build                  # 2 seconds
npm test                      # 2 seconds

# Development workflow
npm run dev                   # Start dev server
# Verify http://localhost:5173/ in browser
python3 agents/orchestrator.py status  # Test agents

# Full validation
SCRAPING_URLS="https://example.com" python3 agents/orchestrator.py full
# Should complete with "Pipeline Complete" message and create outputs/
```

## Troubleshooting

### Common Issues
- **"Missing secrets" in workflows**: Configure OPENAI_API_KEY in repository settings or use `run_mode: housekeeping-only`
- **Build failures**: Ensure Node.js 20+ and run `npm install` first
- **Python import errors**: Run `pip3 install -r requirements.txt` and check Python 3.11+ version
- **Git push failures**: Run `./scripts/ensure_git_remote.sh` to configure remote

### Performance Notes
- Web application builds are very fast (under 2 seconds)
- Python dependency installation is the longest step (35 seconds)
- All operations complete in under 2 minutes total
- Development server starts instantly and supports hot reload

Remember: ALWAYS validate your changes using the complete user scenario testing workflow. The goal is working, functional code that follows the established patterns and passes all validation steps.