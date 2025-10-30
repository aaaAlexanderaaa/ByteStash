import * as monaco from 'monaco-editor';

/**
 * Splunk SPL (Search Processing Language) syntax highlighting
 * Provides syntax highlighting for Splunk queries and search commands
 */

export const splunkLanguageConfig: monaco.languages.ILanguageExtensionPoint = {
  id: 'spl',
  extensions: ['.spl', '.splunk'],
  aliases: ['Splunk', 'SPL', 'spl'],
};

export const splunkMonarchLanguage: monaco.languages.IMonarchLanguage = {
  defaultToken: '',
  tokenPostfix: '.spl',
  
  // Splunk search commands
  keywords: [
    'search', 'stats', 'eval', 'where', 'table', 'sort', 'head', 'tail',
    'fields', 'dedup', 'rename', 'rex', 'transaction', 'chart', 'timechart',
    'top', 'rare', 'streamstats', 'eventstats', 'bin', 'bucket', 'return',
    'append', 'appendcols', 'appendpipe', 'join', 'lookup', 'inputlookup',
    'outputlookup', 'makeresults', 'map', 'foreach', 'if', 'case', 'coalesce',
    'mvexpand', 'spath', 'xmlkv', 'extract', 'multikv', 'makemv', 'nomv',
    'replace', 'fillnull', 'filldown', 'makecontinuous', 'autoregress',
    'delta', 'trendline', 'outlier', 'cluster', 'kmeans', 'anomalies',
    'predict', 'x11', 'timewrap', 'untable', 'xyseries', 'addinfo',
    'addtotals', 'addcoltotals', 'accum', 'strcat', 'convert', 'format',
    'mvcombine', 'mvzip', 'reverse', 'sendemail', 'collect', 'overlap',
    'selfjoin', 'set', 'diff', 'union', 'metadata', 'typelearner', 'typer'
  ],
  
  // Logical and comparison operators
  operators: [
    'AND', 'OR', 'NOT', 'XOR', 'IN', 'LIKE',
    '=', '!=', '<', '>', '<=', '>=', '==', '<>'
  ],
  
  // Statistical and evaluation functions
  functions: [
    // Aggregate functions
    'avg', 'count', 'dc', 'distinct_count', 'earliest', 'earliest_time',
    'estdc', 'estdc_error', 'exactperc', 'first', 'last', 'latest',
    'latest_time', 'list', 'max', 'mean', 'median', 'min', 'mode',
    'perc', 'percentile', 'range', 'rate', 'stdev', 'stdevp', 'sum',
    'sumsq', 'upperperc', 'values', 'var', 'varp',
    
    // String functions
    'substr', 'len', 'lower', 'upper', 'trim', 'ltrim', 'rtrim', 'replace',
    'split', 'spath', 'urldecode', 'tostring', 'printf', 'tonumber',
    
    // Time functions
    'now', 'time', 'relative_time', 'strftime', 'strptime',
    
    // Math functions
    'abs', 'ceil', 'floor', 'round', 'sqrt', 'exp', 'ln', 'log', 'pow',
    'exact', 'random', 'sigfig',
    
    // Eval functions
    'if', 'case', 'match', 'like', 'searchmatch', 'cidrmatch', 'validate',
    'mvcount', 'mvindex', 'mvfilter', 'mvfind', 'mvjoin', 'mvappend',
    'mvdedup', 'mvsort', 'mvzip', 'commands', 'typeof', 'isnull', 'isnotnull',
    'isnum', 'isint', 'isstr', 'isbool', 'coalesce', 'null', 'nullif', 'true', 'false'
  ],
  
  // Field modifiers and special terms
  builtins: [
    'as', 'by', 'over', 'span', 'limit', 'useother', 'usenull',
    'cont', 'bins', 'start', 'end', 'aligntime', 'dedup_splitvals'
  ],
  
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  
  tokenizer: {
    root: [
      // Pipe delimiter (most important in Splunk)
      [/\|/, 'delimiter.pipe'],
      
      // Comments (backticks)
      [/```.*$/, 'comment'],
      
      // Field names with special characters (e.g., host::source)
      [/[a-zA-Z_][a-zA-Z0-9_]*::[a-zA-Z_][a-zA-Z0-9_]*/, 'variable.special'],
      
      // Keywords and functions
      [/[a-zA-Z_][\w]*/, {
        cases: {
          '@keywords': 'keyword',
          '@operators': 'operator.word',
          '@functions': 'function',
          '@builtins': 'type',
          '@default': 'identifier'
        }
      }],
      
      // Strings (double quotes)
      [/"([^"\\]|\\.)*$/, 'string.invalid'],
      [/"/, 'string', '@string_double'],
      
      // Strings (single quotes - less common in SPL)
      [/'([^'\\]|\\.)*$/, 'string.invalid'],
      [/'/, 'string', '@string_single'],
      
      // Field wildcards
      [/\*/, 'variable.wildcard'],
      
      // Numbers (including decimals and scientific notation)
      [/\d+(\.\d+)?([eE][+-]?\d+)?/, 'number'],
      
      // Operators and symbols
      [/@symbols/, {
        cases: {
          '@operators': 'operator',
          '@default': 'delimiter'
        }
      }],
      
      // Brackets and parentheses
      [/[[\]()]/, 'delimiter.bracket'],
      
      // Comments (# at start of line or after whitespace)
      [/#.*$/, 'comment'],
      
      // Whitespace
      { include: '@whitespace' },
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
    
    whitespace: [
      [/[ \t\r\n]+/, 'white'],
    ],
  }
};

export function registerSplunkLanguage(): void {
  monaco.languages.register(splunkLanguageConfig);
  monaco.languages.setMonarchTokensProvider('spl', splunkMonarchLanguage);
  
  // Configure enhanced theme colors for SPL
  monaco.editor.defineTheme('spl-theme-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
      { token: 'function', foreground: 'DCDCAA' },
      { token: 'variable', foreground: '9CDCFE' },
      { token: 'variable.special', foreground: '4FC1FF', fontStyle: 'bold' },
      { token: 'variable.wildcard', foreground: 'C586C0' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'operator', foreground: 'D4D4D4' },
      { token: 'operator.word', foreground: 'C586C0', fontStyle: 'bold' },
      { token: 'delimiter.pipe', foreground: 'FF79C6', fontStyle: 'bold' },
      { token: 'delimiter.bracket', foreground: 'FFD700' },
      { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
      { token: 'type', foreground: '4EC9B0' },
    ],
    colors: {}
  });

  monaco.editor.defineTheme('spl-theme-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
      { token: 'function', foreground: '795E26' },
      { token: 'variable', foreground: '001080' },
      { token: 'variable.special', foreground: '0070C1', fontStyle: 'bold' },
      { token: 'string', foreground: 'A31515' },
      { token: 'number', foreground: '098658' },
      { token: 'operator', foreground: '000000' },
      { token: 'delimiter.pipe', foreground: 'AF00DB', fontStyle: 'bold' },
      { token: 'comment', foreground: '008000', fontStyle: 'italic' },
    ],
    colors: {}
  });
  
  // Register auto-completion for common commands
  monaco.languages.registerCompletionItemProvider('spl', {
    provideCompletionItems: () => {
      const suggestions: monaco.languages.CompletionItem[] = [
        ...splunkMonarchLanguage.keywords!.map((keyword: string) => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          detail: 'Splunk command'
        })),
        ...splunkMonarchLanguage.functions!.map((func: string) => ({
          label: func,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: `${func}()`,
          detail: 'Splunk function'
        }))
      ];
      return { suggestions };
    }
  });
}

