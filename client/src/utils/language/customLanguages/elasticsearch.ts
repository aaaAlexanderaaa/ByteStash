import * as monaco from 'monaco-editor';

/**
 * Elasticsearch Query Language (ES|QL) syntax highlighting
 * Provides syntax highlighting for Elasticsearch query DSL and ES|QL
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
  
  // ES|QL commands
  keywords: [
    'FROM', 'WHERE', 'LIMIT', 'SORT', 'STATS', 'BY', 'AS',
    'KEEP', 'DROP', 'RENAME', 'EVAL', 'ROW', 'SHOW', 'ENRICH',
    'DISSECT', 'GROK', 'MV_EXPAND', 'INLINESTATS', 'LOOKUP',
    'WITH', 'METADATA', 'INFO', 'FUNCTIONS', 'ASC', 'DESC',
    'NULLS', 'FIRST', 'LAST'
  ],
  
  // Data types
  typeKeywords: [
    'boolean', 'byte', 'short', 'integer', 'long', 'unsigned_long',
    'float', 'double', 'half_float', 'scaled_float',
    'keyword', 'text', 'date', 'date_nanos', 'ip', 'version',
    'binary', 'geo_point', 'geo_shape', 'point', 'shape',
    'null'
  ],
  
  // Logical operators
  operators: [
    'AND', 'OR', 'NOT', 'IN', 'LIKE', 'RLIKE', 'IS', 'IS NOT',
    '==', '!=', '<', '>', '<=', '>=', '=~', '!~'
  ],

  // Functions
  functions: [
    // Aggregate functions
    'AVG', 'COUNT', 'COUNT_DISTINCT', 'MAX', 'MIN', 'SUM', 'MEDIAN',
    'PERCENTILE', 'VALUES', 'TOP', 'WEIGHTED_AVG',
    
    // String functions
    'CONCAT', 'LEFT', 'RIGHT', 'LENGTH', 'LOCATE', 'LTRIM', 'RTRIM', 'TRIM',
    'REPLACE', 'SUBSTRING', 'UPPER', 'LOWER', 'STARTS_WITH', 'ENDS_WITH',
    'SPLIT', 'REVERSE',
    
    // Type conversion functions
    'TO_STRING', 'TO_BOOLEAN', 'TO_CARTESIANPOINT', 'TO_DATETIME',
    'TO_DEGREES', 'TO_DOUBLE', 'TO_GEOPOINT', 'TO_GEOSHAPE', 'TO_INTEGER',
    'TO_IP', 'TO_LONG', 'TO_RADIANS', 'TO_UNSIGNED_LONG', 'TO_VERSION',
    
    // Date functions
    'NOW', 'DATE_EXTRACT', 'DATE_FORMAT', 'DATE_PARSE', 'DATE_TRUNC',
    'DATEPART', 'AUTO_BUCKET',
    
    // Math functions
    'ABS', 'ACOS', 'ASIN', 'ATAN', 'ATAN2', 'CBRT', 'CEIL', 'COS', 'COSH',
    'E', 'EXP', 'FLOOR', 'LOG', 'LOG10', 'PI', 'POW', 'ROUND', 'SIGNUM',
    'SIN', 'SINH', 'SQRT', 'TAN', 'TANH', 'TAU',
    
    // Conditional functions
    'CASE', 'COALESCE', 'GREATEST', 'LEAST', 'NULLIF',
    
    // IP functions
    'CIDR_MATCH',
    
    // Multi-value functions
    'MV_AVG', 'MV_CONCAT', 'MV_COUNT', 'MV_DEDUPE', 'MV_FIRST', 'MV_LAST',
    'MV_MAX', 'MV_MEDIAN', 'MV_MIN', 'MV_SORT', 'MV_SLICE', 'MV_SUM', 'MV_ZIP',
    
    // Other functions
    'LENGTH', 'BUCKET', 'IS_FINITE', 'IS_INFINITE', 'IS_NAN'
  ],
  
  // Constants
  constants: [
    'true', 'false', 'null', 'NULL', 'TRUE', 'FALSE'
  ],
  
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

