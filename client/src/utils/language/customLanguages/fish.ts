import * as monaco from 'monaco-editor';

/**
 * Fish Shell syntax highlighting
 * Provides syntax highlighting for Fish (Friendly Interactive Shell) scripts
 */

export const fishLanguageConfig: monaco.languages.ILanguageExtensionPoint = {
  id: 'fish',
  extensions: ['.fish'],
  aliases: ['Fish', 'fish', 'fish-shell'],
  filenames: ['config.fish'],
};

export const fishMonarchLanguage: monaco.languages.IMonarchLanguage = {
  defaultToken: '',
  tokenPostfix: '.fish',
  
  // Fish-specific keywords and control structures
  keywords: [
    'function', 'end', 'if', 'else', 'switch', 'case', 'for', 'in', 'while',
    'begin', 'break', 'continue', 'return', 'and', 'or', 'not', 'builtin',
    'command', 'eval', 'exec', 'time'
  ],
  
  // Fish built-in commands
  builtins: [
    // Variable and environment
    'set', 'set_color', 'read', 'export', 'path',
    
    // Functions
    'functions', 'funced', 'funcsave', 'source',
    
    // Completions and abbreviations
    'complete', 'abbr',
    
    // Key bindings and command line
    'bind', 'commandline', 'fish_key_reader',
    
    // String and list operations
    'string', 'contains', 'count', 'argparse',
    
    // Math and random
    'math', 'random',
    
    // Status and type
    'status', 'type', 'isatty',
    
    // IO
    'echo', 'printf', 'test',
    
    // Job control
    'bg', 'fg', 'jobs', 'disown', 'wait',
    
    // History
    'history',
    
    // Directory navigation
    'cd', 'pushd', 'popd', 'dirs', 'prevd', 'nextd', 'pwd',
    
    // Help and documentation
    'help', 'apropos', 'man',
    
    // Fish specific
    'fish', 'fish_add_path', 'fish_config', 'fish_indent', 'fish_prompt',
    'fish_right_prompt', 'fish_mode_prompt', 'fish_greeting', 'fish_update_completions',
    
    // Process
    'kill', 'killall', 'pgrep', 'pkill', 'ps',
    
    // File operations
    'ls', 'cat', 'cp', 'mv', 'rm', 'mkdir', 'rmdir', 'touch', 'chmod', 'chown',
    
    // Text processing
    'grep', 'sed', 'awk', 'cut', 'sort', 'uniq', 'head', 'tail', 'wc', 'tr',
    
    // Other common commands
    'find', 'which', 'whereis', 'file', 'realpath', 'basename', 'dirname'
  ],
  
  // Test operators (used with 'test' or '[')
  testOperators: [
    '-a', '-b', '-c', '-d', '-e', '-f', '-g', '-h', '-k', '-p', '-r', '-s',
    '-t', '-u', '-w', '-x', '-L', '-O', '-G', '-N', '-S',
    '-eq', '-ne', '-lt', '-le', '-gt', '-ge',
    '-nt', '-ot', '-ef',
    '-z', '-n'
  ],
  
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  
  tokenizer: {
    root: [
      // Comments
      [/#.*$/, 'comment'],
      
      // Shebang
      [/^#!.*$/, 'comment.shebang'],
      
      // Function definitions
      [/(function)\s+([a-zA-Z_][\w-]*)/, ['keyword', 'function.definition']],
      
      // Keywords
      [/\b(function|end|if|else|switch|case|for|in|while|begin|break|continue|return|and|or|not|builtin|command|eval|exec|time)\b/, 'keyword'],
      
      // Built-in commands
      [/\b[a-zA-Z_][\w-]*/, {
        cases: {
          '@builtins': 'type.builtin',
          '@default': 'identifier'
        }
      }],
      
      // Variables
      [/\$\$/, 'variable.predefined'], // Process ID
      [/\$status\b/, 'variable.predefined'], // Exit status
      [/\$argv\b/, 'variable.predefined'], // Arguments
      [/\$\w+/, 'variable'],
      [/\$\{[^}]+\}/, 'variable'],
      
      // Command substitution
      [/\(/, 'delimiter.parenthesis', '@commandSubstitution'],
      
      // Strings (double quotes - allow variable expansion)
      [/"/, 'string', '@stringDouble'],
      
      // Strings (single quotes - no variable expansion)
      [/'/, 'string', '@stringSingle'],
      
      // Numbers
      [/\b\d+(\.\d+)?\b/, 'number'],
      
      // Test operators
      [/-[a-zA-Z]{1,2}\b/, {
        cases: {
          '@testOperators': 'operator.test',
          '@default': 'operator'
        }
      }],
      
      // Operators and redirects
      [/>>|<<|>&|&>|>|<|&|\|/, 'operator'],
      
      // Pipe
      [/\|/, 'delimiter.pipe'],
      
      // Semicolon
      [/;/, 'delimiter.semicolon'],
      
      // Brackets
      [/[[\]{}]/, 'delimiter.bracket'],
      
      // Backslash continuation
      [/\\$/, 'operator.continuation'],
      
      { include: '@whitespace' },
    ],
    
    commandSubstitution: [
      [/\)/, 'delimiter.parenthesis', '@pop'],
      { include: 'root' }
    ],
    
    stringDouble: [
      [/[^\\"$]+/, 'string'],
      [/\$\w+/, 'variable'],
      [/\$\{[^}]+\}/, 'variable'],
      [/\\./, 'string.escape'],
      [/"/, 'string', '@pop']
    ],
    
    stringSingle: [
      [/[^\\']+/, 'string'],
      [/\\./, 'string.escape'],
      [/'/, 'string', '@pop']
    ],
    
    whitespace: [
      [/[ \t\r\n]+/, 'white'],
    ],
  }
};

export function registerFishLanguage(): void {
  monaco.languages.register(fishLanguageConfig);
  monaco.languages.setMonarchTokensProvider('fish', fishMonarchLanguage);
  
  // Configure enhanced theme colors for Fish
  monaco.editor.defineTheme('fish-theme-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
      { token: 'type.builtin', foreground: '4EC9B0' },
      { token: 'function.definition', foreground: 'DCDCAA', fontStyle: 'bold' },
      { token: 'variable', foreground: '9CDCFE' },
      { token: 'variable.predefined', foreground: '4FC1FF', fontStyle: 'bold' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'string.escape', foreground: 'D7BA7D' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'operator', foreground: 'D4D4D4' },
      { token: 'operator.test', foreground: 'C586C0' },
      { token: 'operator.continuation', foreground: 'D4D4D4' },
      { token: 'delimiter.pipe', foreground: 'FF79C6', fontStyle: 'bold' },
      { token: 'delimiter.semicolon', foreground: 'D4D4D4' },
      { token: 'delimiter.bracket', foreground: 'FFD700' },
      { token: 'delimiter.parenthesis', foreground: 'DA70D6' },
      { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
      { token: 'comment.shebang', foreground: '6A9955', fontStyle: 'italic bold' },
    ],
    colors: {}
  });

  monaco.editor.defineTheme('fish-theme-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
      { token: 'type.builtin', foreground: '267F99' },
      { token: 'function.definition', foreground: '795E26', fontStyle: 'bold' },
      { token: 'variable', foreground: '001080' },
      { token: 'variable.predefined', foreground: '0070C1', fontStyle: 'bold' },
      { token: 'string', foreground: 'A31515' },
      { token: 'number', foreground: '098658' },
      { token: 'delimiter.pipe', foreground: 'AF00DB', fontStyle: 'bold' },
      { token: 'comment', foreground: '008000', fontStyle: 'italic' },
    ],
    colors: {}
  });
  
  // Register auto-completion
  monaco.languages.registerCompletionItemProvider('fish', {
    provideCompletionItems: () => {
      const suggestions: monaco.languages.CompletionItem[] = [
        ...fishMonarchLanguage.keywords!.map((keyword: string) => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          detail: 'Fish keyword'
        })),
        ...fishMonarchLanguage.builtins!.map((builtin: string) => ({
          label: builtin,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: builtin,
          detail: 'Fish built-in command'
        }))
      ];
      return { suggestions };
    }
  });
}

