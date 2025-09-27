import OpenAI from 'openai';

export class CodexService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  /**
   * Generate code using GPT-4 (Codex successor)
   * @param prompt - The code generation prompt
   * @param language - Programming language (optional)
   * @param maxTokens - Maximum tokens for response
   * @returns Generated code
   */
  async generateCode(
    prompt: string, 
    language?: string,
    maxTokens: number = 1000
  ): Promise<{
    code: string;
    explanation: string;
    language: string;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }> {
    try {
      const systemPrompt = `You are an expert programmer. Generate clean, well-commented code based on the user's request.
${language ? `The code should be in ${language}.` : 'Choose the most appropriate programming language.'}
Provide both the code and a brief explanation of what it does.

Format your response as:
LANGUAGE: [programming language]
CODE:
\`\`\`[language]
[your code here]
\`\`\`
EXPLANATION:
[brief explanation]`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: maxTokens,
        temperature: 0.2,
      });

      const response = completion.choices[0]?.message?.content || '';
      
      // Parse the response
      const languageMatch = response.match(/LANGUAGE:\s*(.+)/i);
      const codeMatch = response.match(/CODE:\s*```\w*\n([\s\S]*?)\n```/i);
      const explanationMatch = response.match(/EXPLANATION:\s*([\s\S]*?)$/i);

      const detectedLanguage = languageMatch?.[1]?.trim() || language || 'text';
      const generatedCode = codeMatch?.[1]?.trim() || response;
      const explanation = explanationMatch?.[1]?.trim() || 'Code generated successfully.';

      return {
        code: generatedCode,
        explanation: explanation,
        language: detectedLanguage,
        usage: {
          prompt_tokens: completion.usage?.prompt_tokens || 0,
          completion_tokens: completion.usage?.completion_tokens || 0,
          total_tokens: completion.usage?.total_tokens || 0,
        }
      };
    } catch (error) {
      throw new Error(`Codex API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Explain existing code
   * @param code - The code to explain
   * @param language - Programming language
   * @returns Code explanation
   */
  async explainCode(
    code: string, 
    language?: string
  ): Promise<{
    explanation: string;
    complexity: string;
    improvements: string[];
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }> {
    try {
      const prompt = `Analyze the following ${language || ''} code and provide:
1. A clear explanation of what it does
2. Complexity assessment (Simple/Medium/Complex)
3. Potential improvements or optimizations

Code:
\`\`\`${language || ''}
${code}
\`\`\`

Format your response as:
EXPLANATION:
[detailed explanation]

COMPLEXITY: [Simple/Medium/Complex]

IMPROVEMENTS:
- [improvement 1]
- [improvement 2]
- [improvement 3]`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.3,
      });

      const response = completion.choices[0]?.message?.content || '';
      
      // Parse the response
      const explanationMatch = response.match(/EXPLANATION:\s*([\s\S]*?)(?=COMPLEXITY:|$)/i);
      const complexityMatch = response.match(/COMPLEXITY:\s*(.+)/i);
      const improvementsMatch = response.match(/IMPROVEMENTS:\s*([\s\S]*?)$/i);

      const explanation = explanationMatch?.[1]?.trim() || 'Unable to analyze code.';
      const complexity = complexityMatch?.[1]?.trim() || 'Unknown';
      
      // Parse improvements
      const improvementsText = improvementsMatch?.[1]?.trim() || '';
      const improvements = improvementsText
        .split('\n')
        .map(line => line.replace(/^-\s*/, '').trim())
        .filter(line => line.length > 0);

      return {
        explanation,
        complexity,
        improvements,
        usage: {
          prompt_tokens: completion.usage?.prompt_tokens || 0,
          completion_tokens: completion.usage?.completion_tokens || 0,
          total_tokens: completion.usage?.total_tokens || 0,
        }
      };
    } catch (error) {
      throw new Error(`Codex API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert code from one language to another
   * @param code - Source code
   * @param fromLanguage - Source language
   * @param toLanguage - Target language
   * @returns Converted code
   */
  async convertCode(
    code: string,
    fromLanguage: string,
    toLanguage: string
  ): Promise<{
    convertedCode: string;
    notes: string;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }> {
    try {
      const prompt = `Convert the following ${fromLanguage} code to ${toLanguage}. 
Maintain the same functionality and add comments where necessary.

Source code (${fromLanguage}):
\`\`\`${fromLanguage}
${code}
\`\`\`

Format your response as:
CONVERTED_CODE:
\`\`\`${toLanguage}
[converted code here]
\`\`\`
NOTES:
[any important notes about the conversion]`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 1200,
        temperature: 0.2,
      });

      const response = completion.choices[0]?.message?.content || '';
      
      // Parse the response
      const codeMatch = response.match(/CONVERTED_CODE:\s*```\w*\n([\s\S]*?)\n```/i);
      const notesMatch = response.match(/NOTES:\s*([\s\S]*?)$/i);

      const convertedCode = codeMatch?.[1]?.trim() || response;
      const notes = notesMatch?.[1]?.trim() || 'Code converted successfully.';

      return {
        convertedCode,
        notes,
        usage: {
          prompt_tokens: completion.usage?.prompt_tokens || 0,
          completion_tokens: completion.usage?.completion_tokens || 0,
          total_tokens: completion.usage?.total_tokens || 0,
        }
      };
    } catch (error) {
      throw new Error(`Codex API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate unit tests for given code
   * @param code - Code to test
   * @param language - Programming language
   * @param framework - Testing framework (optional)
   * @returns Generated unit tests
   */
  async generateTests(
    code: string,
    language: string,
    framework?: string
  ): Promise<{
    tests: string;
    framework: string;
    coverage: string[];
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }> {
    try {
      const frameworkHint = framework ? ` using ${framework}` : '';
      const prompt = `Generate comprehensive unit tests for the following ${language} code${frameworkHint}.
Include test cases for normal operation, edge cases, and error conditions.

Code to test:
\`\`\`${language}
${code}
\`\`\`

Format your response as:
FRAMEWORK: [testing framework used]
TESTS:
\`\`\`${language}
[test code here]
\`\`\`
COVERAGE:
- [test case 1]
- [test case 2]
- [test case 3]`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.3,
      });

      const response = completion.choices[0]?.message?.content || '';
      
      // Parse the response
      const frameworkMatch = response.match(/FRAMEWORK:\s*(.+)/i);
      const testsMatch = response.match(/TESTS:\s*```\w*\n([\s\S]*?)\n```/i);
      const coverageMatch = response.match(/COVERAGE:\s*([\s\S]*?)$/i);

      const detectedFramework = frameworkMatch?.[1]?.trim() || framework || 'Standard';
      const tests = testsMatch?.[1]?.trim() || response;
      
      // Parse coverage
      const coverageText = coverageMatch?.[1]?.trim() || '';
      const coverage = coverageText
        .split('\n')
        .map(line => line.replace(/^-\s*/, '').trim())
        .filter(line => line.length > 0);

      return {
        tests,
        framework: detectedFramework,
        coverage,
        usage: {
          prompt_tokens: completion.usage?.prompt_tokens || 0,
          completion_tokens: completion.usage?.completion_tokens || 0,
          total_tokens: completion.usage?.total_tokens || 0,
        }
      };
    } catch (error) {
      throw new Error(`Codex API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}