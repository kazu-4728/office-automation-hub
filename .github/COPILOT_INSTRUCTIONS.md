# GitHub Copilot & Copilot Coding Agent Onboarding

## Purpose and Scope

This repository is a **GitHub Actions AI Agent Hub** for office automation tasks. It orchestrates AI-powered workflows for:
- Web scraping and data extraction
- PDF processing and OCR
- Automated slide generation
- Data processing pipelines
- Full automation workflows

The system is designed to run on GitHub Actions with various trigger mechanisms (Issues, API calls, scheduled runs, manual execution).

## Recommended Workflows

### How to Ask the Agent

When working with GitHub Copilot Coding Agent, use clear, specific prompts that reference the project context:

1. **Be specific about the task type**: Mention whether you're working on scraping, PDF processing, slide generation, or orchestration
2. **Reference existing patterns**: Point to similar workflows or agents in the codebase
3. **Specify the trigger method**: Whether the feature should work via Issues, API, or manual workflow dispatch

### Example Prompts for Common Tasks

#### Create Feature Branch
```
Create a new feature branch for adding email notification support to the PDF processing workflow. The feature should:
- Send notifications when PDF processing completes
- Include processing summary and output file links
- Use GitHub Secrets for email configuration
- Follow the existing agent pattern in agents/pdf_ocr_agent.py
```

#### Update README
```
Update the README.md to document the new email notification feature for PDF processing. Include:
- Configuration instructions using GitHub Secrets
- Example API payload for triggering notifications
- Add it to the existing workflow configuration section
```

#### Add Tests
```
Add tests for the email notification functionality in PDF processing:
- Test email configuration validation
- Test notification payload generation
- Mock email sending to avoid actual sends in tests
- Follow the existing test patterns in the test/ directory
```

#### Add New Agent Type
```
Create a new agent for Excel/CSV data processing following the existing agent pattern:
- Create agents/excel_agent.py following the structure of scraping_agent.py
- Add corresponding workflow in .github/workflows/task-excel.yml
- Integrate with the orchestrator.py for pipeline support
- Use environment variables for configuration like existing agents
```

#### Modify Workflows
```
Modify the agent-main.yml workflow to support batch processing:
- Add input parameter for batch_size
- Update the orchestrator to handle multiple URLs/files
- Ensure proper error handling for batch failures
- Maintain backward compatibility with single-item processing
```

## Contributor Checklist

Before submitting changes:

- [ ] **Git Remote Check**: Run `./scripts/ensure_git_remote.sh` to make sure the `origin` remote points to this repository before pushing changes (especially in Copilot Chat sessions).
- [ ] **Environment Variables**: Use `.env.example` as reference and ensure all new secrets are documented
- [ ] **GitHub Secrets**: No hardcoded credentials - use `${{ secrets.SECRET_NAME }}` pattern
- [ ] **Workflow Testing**: Test workflow changes using workflow_dispatch before PR
- [ ] **Agent Pattern**: New agents should follow the existing structure (input validation, error handling, output formatting)
- [ ] **Documentation**: Update README.md for user-facing changes
- [ ] **Backward Compatibility**: Ensure existing API endpoints and triggers continue working
- [ ] **Output Structure**: Maintain consistent output format in `outputs/` directory structure
- [ ] **Error Handling**: Include proper error messages and status reporting
- [ ] **Dependencies**: Update requirements.txt for Python deps, package.json for Node.js deps

## Secrets Management

### Required GitHub Secrets

The following secrets should be configured in repository settings for full functionality:

- `OPENAI_API_KEY`: OpenAI API access for AI-powered features
- `SMTP_SERVER`: Email server for notifications (optional)
- `SMTP_USERNAME`: Email authentication (optional)
- `SMTP_PASSWORD`: Email authentication (optional)

### Adding New Secrets

1. Use descriptive names with clear purpose
2. Document in `.env.example` with placeholder values
3. Reference in workflows using `${{ secrets.SECRET_NAME }}`
4. Validate presence in agent code before use
5. Update this documentation when adding new secrets

## MCP Integration Configuration

Refer to the [`copilot-coding-agent.yml`](./copilot-coding-agent.yml) file for MCP (Model Context Protocol) integration settings.

### MCP Placeholders and Setup

- `MCP_ENDPOINT`: Set to your MCP server endpoint URL
- `MCP_API_KEY`: Authentication key for MCP server access
- Configure these as GitHub Secrets for production use
- Use localhost endpoints for development/testing

### Enabling MCP Integration

1. Configure MCP server endpoint in repository secrets
2. Update `copilot-coding-agent.yml` enabled flag to `true`
3. Test connection using the provided diagnostic endpoints
4. Monitor MCP server logs for integration issues

## FAQ

### Q: How do I test a new workflow without affecting production?
A: Use `workflow_dispatch` with test parameters, or create a feature branch and test the workflow there before merging.

### Q: Why is my agent not receiving the expected input data?
A: Check the workflow input mapping in `agent-main.yml` and ensure your agent follows the expected input structure from the orchestrator.

### Q: How do I add support for a new file format?
A: Create a new agent following the pattern in `agents/`, add a corresponding workflow in `.github/workflows/`, and integrate with `orchestrator.py`.

### Q: Can I trigger workflows from external systems?
A: Yes, use the repository_dispatch API with proper authentication. See the API examples in README.md.

### Q: How do I handle sensitive data in processing?
A: Use GitHub Secrets for credentials, avoid logging sensitive data, and ensure output files don't contain secrets.

### Q: Why are my workflow runs failing with "missing secrets"?
A: The `agent.yml` workflow includes preflight checks for required secrets. Ensure OPENAI_API_KEY is configured, or use `run_mode: housekeeping-only` for non-AI tasks.

## Git Remote Setup for Copilot

Copilot Chat/Coding Agent sessions may start without a configured git remote. To avoid push failures when creating pull requests:

1. Run `./scripts/ensure_git_remote.sh` after opening a session. The script will add or update the `origin` remote to `https://github.com/kazu-4728/office-automation-hub.git`.
2. Confirm the remote is set with `git remote -v`.
3. Proceed with the usual commit and push flow.

Running the script is idempotent, so it is safe to execute multiple times in the same session.

## Contact and Ownership

- **Repository Owner**: kazu-4728
- **Primary Contact**: Create an issue in this repository for questions or support
- **Discussions**: Use [GitHub Discussions](https://github.com/kazu-4728/office-automation-hub/discussions) for community questions
- **Issues**: Report bugs or feature requests via [GitHub Issues](https://github.com/kazu-4728/office-automation-hub/issues)

## Additional Resources

- [Main Documentation](../README.md)
- [Workflow Configuration Examples](../docs/)
- [Agent Development Guide](../agents/)
- [MIT License](../LICENSE)

---

*This guide is maintained as part of the repository documentation. Please keep it updated when adding new features or changing workflows.*