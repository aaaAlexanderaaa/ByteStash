import * as monaco from 'monaco-editor';
import { esqlDefinition } from './languageDefinitions';

/**
 * Elasticsearch Query Language (ES|QL) syntax highlighting
 * Provides syntax highlighting for Elasticsearch query DSL and ES|QL
 * 
 * NOTE: Language definitions (keywords, functions, etc.) are imported from
 * languageDefinitions.ts to maintain a Single Source of Truth (SSOT).
 */

export const elasticsearchLanguageConfig: monaco.languages.ILanguageExtensionPoint = {
  id: 'esql',
  extensions: ['.es', '.esql'],
  aliases: ['Elasticsearch', 'ES|QL', 'ESQL', 'esql'],
};

export const elasticsearchMonarchLanguage: monaco.languages.IMonarchLanguage = {
  defaultToken: '',
  tokenPostfix: '.esql',
  ignoreCase: false,
  
  // Import from SSOT (languageDefinitions.ts)
  keywords: esqlDefinition.keywords,
  typeKeywords: esqlDefinition.typeKeywords,
  operators: [...esqlDefinition.operators, '==', '!=', '<', '>', '<=', '>=', '=~', '!~'],
  functions: esqlDefinition.functions,
  constants: esqlDefinition.constants,
  
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  
  tokenizer: {
    root: [
      // Comments (SQL-style and # style)
      [/#.*$/, 'comment'],
      [/\/\/.*$/, 'comment'],
      [/\/\*/, 'comment', '@comment'],
      
      // Pipe delimiter (ES|QL uses pipes like SPL)
      [/\|/, 'delimiter.pipe'],
      
      // Field names and identifiers (can include dots for nested fields)
      [/[a-zA-Z_][\w.]*/, {
        cases: {
          '@keywords': 'keyword',
          '@typeKeywords': 'type',
          '@operators': 'operator.word',
          '@functions': 'function',
          '@constants': 'constant',
          '@default': 'identifier'
        }
      }],
      
      // Strings (double quotes)
      [/"([^"\\]|\\.)*$/, 'string.invalid'],
      [/"/, 'string', '@string_double'],
      
      // Strings (single quotes)
      [/'([^'\\]|\\.)*$/, 'string.invalid'],
      [/'/, 'string', '@string_single'],
      
      // Backtick identifiers (for field names with special chars)
      [/`/, 'identifier', '@identifier_backtick'],
      
      // Numbers
      [/\d+(\.\d+)?([eE][+-]?\d+)?/, 'number'],
      
      // Operators
      [/@symbols/, {
        cases: {
          '@operators': 'operator',
          '@default': 'delimiter'
        }
      }],
      
      // Brackets and parentheses
      [/[[\]()]/, 'delimiter.bracket'],
      [/[{}]/, 'delimiter.curly'],
      
      // Whitespace
      { include: '@whitespace' },
      
      // Comma
      [/,/, 'delimiter.comma'],
    ],
    
    comment: [
      [/[^/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[/*]/, 'comment']
    ],
    
    string_double: [
      [/[^\\"]+/, 'string'],
      [/\\./, 'string.escape'],
      [/"/, 'string', '@pop']
    ],
    
    string_single: [
      [/[^\\']+/, 'string'],
      [/\\./, 'string.escape'],
      [/'/, 'string', '@pop']
    ],
    
    identifier_backtick: [
      [/[^`]+/, 'identifier'],
      [/`/, 'identifier', '@pop']
    ],
    
    whitespace: [
      [/[ \t\r\n]+/, 'white'],
    ],
  }
};

export function registerElasticsearchLanguage(): void {
  monaco.languages.register(elasticsearchLanguageConfig);
  monaco.languages.setMonarchTokensProvider('esql', elasticsearchMonarchLanguage);
  
  // Configure enhanced theme colors for ES|QL
  monaco.editor.defineTheme('esql-theme-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
      { token: 'function', foreground: 'DCDCAA' },
      { token: 'type', foreground: '4EC9B0' },
      { token: 'operator', foreground: 'D4D4D4' },
      { token: 'operator.word', foreground: 'C586C0', fontStyle: 'bold' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'identifier', foreground: '9CDCFE' },
      { token: 'delimiter.pipe', foreground: 'FF79C6', fontStyle: 'bold' },
      { token: 'delimiter.bracket', foreground: 'FFD700' },
      { token: 'delimiter.curly', foreground: 'DA70D6' },
      { token: 'delimiter.comma', foreground: 'D4D4D4' },
      { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
      { token: 'constant', foreground: '4FC1FF' },
    ],
    colors: {}
  });

  monaco.editor.defineTheme('esql-theme-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
      { token: 'function', foreground: '795E26' },
      { token: 'type', foreground: '267F99' },
      { token: 'string', foreground: 'A31515' },
      { token: 'number', foreground: '098658' },
      { token: 'delimiter.pipe', foreground: 'AF00DB', fontStyle: 'bold' },
      { token: 'comment', foreground: '008000', fontStyle: 'italic' },
    ],
    colors: {}
  });
  
  // Register auto-completion
  monaco.languages.registerCompletionItemProvider('esql', {
    provideCompletionItems: () => {
      const suggestions: monaco.languages.CompletionItem[] = [
        ...elasticsearchMonarchLanguage.keywords!.map((keyword: string) => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          detail: 'ES|QL command'
        })),
        ...elasticsearchMonarchLanguage.functions!.map((func: string) => ({
          label: func,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: `${func}()`,
          detail: 'ES|QL function'
        }))
      ];
      return { suggestions };
    }
  });
}

