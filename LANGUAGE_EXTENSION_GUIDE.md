# Language Extension Guide for ByteStash

## Table of Contents
1. [Current System Overview](#current-system-overview)
2. [Understanding Monaco Editor Language Support](#understanding-monaco-editor-language-support)
3. [Built-in Monaco Languages](#built-in-monaco-languages)
4. [Adding Custom Languages](#adding-custom-languages)
5. [Implementation Plan for Extensible Languages](#implementation-plan)
6. [Specific Language Examples](#specific-language-examples)
7. [User-Installable Language System](#user-installable-language-system)

---

## Current System Overview

ByteStash currently uses **two** different syntax highlighting systems:

### 1. Monaco Editor (for editing)
- Location: `client/src/components/editor/CodeEditor.tsx`
- Used for: Active code editing
- Package: `monaco-editor@0.52.0` with `@monaco-editor/react@4.6.0`
- Purpose: Full-featured code editor with IntelliSense, syntax highlighting, etc.

### 2. React Syntax Highlighter (for preview/display)
- Location: `client/src/components/editor/PreviewCodeBlock.tsx`, `FullCodeBlock.tsx`
- Used for: Read-only code display/preview
- Package: `react-syntax-highlighter@15.6.1` (using Prism)
- Purpose: Lightweight syntax highlighting for display

### 3. Language Mapping System
- Location: `client/src/utils/language/languageUtils.ts`
- **Hardcoded** mapping of ~50+ languages
- Maps custom language names → Monaco language IDs
- Maps custom language names → Prism language IDs

**Current Issue**: All languages are hardcoded. To add a new language, you must:
1. Edit `languageUtils.ts`
2. Hope that Monaco/Prism already support it
3. Rebuild the application

---

## Understanding Monaco Editor Language Support

Monaco Editor is the same editor engine used by VS Code. It has **three levels** of language support:

### Level 1: Basic Registration (Monarch)
Simple syntax highlighting using Monaco's Monarch syntax definition language.

```typescript
import * as monaco from 'monaco-editor';

monaco.languages.register({ id: 'myLanguage' });

monaco.languages.setMonarchTokensProvider('myLanguage', {
  tokenizer: {
    root: [
      [/\[.*?\]/, 'custom-bracket'],
      [/\b(SELECT|FROM|WHERE)\b/, 'keyword'],
      [/".*?"/, 'string'],
      [/\d+/, 'number'],
    ]
  }
});
```

**Pros**: Easy to implement, no external dependencies
**Cons**: Basic syntax highlighting only, no semantic features

### Level 2: TextMate Grammar (Advanced)
Uses TextMate grammar files (.tmLanguage.json) for sophisticated syntax highlighting.

**Requires**:
- `monaco-textmate` package
- `vscode-oniguruma` package (regex engine)
- TextMate grammar files (.tmLanguage.json or .plist)

```typescript
import { loadWASM } from 'vscode-oniguruma';
import { Registry } from 'monaco-textmate';
import { wireTmGrammars } from 'monaco-editor-textmate';

// Load WASM regex engine
await loadWASM(onigWasmPath);

// Create grammar registry
const registry = new Registry({
  getGrammarDefinition: async (scopeName) => {
    return {
      format: 'json',
      content: await (await fetch(grammarPath)).text()
    };
  }
});

// Wire it up to Monaco
await wireTmGrammars(monaco, registry, grammars);
```

**Pros**: Same highlighting as VS Code, very accurate
**Cons**: More complex setup, requires WASM, larger bundle size

### Level 3: Language Server Protocol (LSP)
Full language support with autocomplete, diagnostics, go-to-definition, etc.

**Not recommended for ByteStash** - overkill for a snippet manager.

---

## Built-in Monaco Languages

Monaco Editor (version 0.52.0) includes these languages **by default**:

**Core Languages** (always loaded):
- `plaintext`, `javascript`, `typescript`, `css`, `html`, `json`

**Available Languages** (can be imported):
- `abap`, `apex`, `azcli`, `bat`, `bicep`, `cameligo`, `clojure`, `coffee`
- `cpp`, `csharp`, `csp`, `dart`, `dockerfile`, `ecl`, `elixir`, `flow9`
- `fsharp`, `go`, `graphql`, `handlebars`, `hcl`, `html`, `ini`, `java`
- `julia`, `kotlin`, `less`, `lexon`, `lua`, `m3`, `markdown`, `mips`
- `msdax`, `mysql`, `objective-c`, `pascal`, `pascaligo`, `perl`, `pgsql`
- `php`, `pla`, `postiats`, `powerquery`, `powershell`, `proto`, `pug`
- `python`, `qsharp`, `r`, `razor`, `redis`, `redshift`, `restructuredtext`
- `ruby`, `rust`, `sb`, `scala`, `scheme`, `scss`, `shell`, `solidity`
- `sophia`, `sparql`, `sql`, `st`, `swift`, `systemverilog`, `tcl`
- `twig`, `typescript`, `vb`, `wgsl`, `xml`, `yaml`

**Missing Languages** (not in Monaco):
- ❌ Splunk SPL
- ❌ Elasticsearch Query Language (ES|QL)
- ❌ Fish shell (generic `shell` exists but not fish-specific)
- ❌ Many other specialized query/domain-specific languages

---

## Adding Custom Languages

### Approach 1: Simple Monarch Syntax (Recommended for Most Cases)

**Example: Adding Splunk SPL**

```typescript
// client/src/utils/language/customLanguages/splunk.ts
import * as monaco from 'monaco-editor';

export function registerSplunkLanguage() {
  monaco.languages.register({ id: 'splunk' });
  
  monaco.languages.setMonarchTokensProvider('splunk', {
    // Keywords
    keywords: [
      'search', 'stats', 'eval', 'where', 'table', 'sort', 'head', 'tail',
      'fields', 'dedup', 'rename', 'rex', 'transaction', 'chart', 'timechart',
      'top', 'rare', 'streamstats', 'eventstats', 'bin', 'bucket', 'return',
      'append', 'appendcols', 'join', 'lookup', 'inputlookup', 'outputlookup',
      'makeresults', 'map', 'foreach', 'if', 'case', 'coalesce', 'mvexpand'
    ],
    
    // Operators
    operators: [
      '=', '!=', '<', '>', '<=', '>=', 'AND', 'OR', 'NOT', 'IN', 'LIKE'
    ],
    
    // Functions
    functions: [
      'avg', 'count', 'sum', 'min', 'max', 'list', 'values', 'dc', 'distinct_count',
      'earliest', 'latest', 'range', 'stdev', 'var', 'median', 'mode', 'perc',
      'upper', 'lower', 'substr', 'trim', 'replace', 'split', 'len', 'tonumber',
      'tostring', 'strftime', 'strptime', 'now', 'relative_time', 'round', 'ceil', 'floor'
    ],

    // Tokenizer rules
    tokenizer: {
      root: [
        // Keywords
        [/\b(search|stats|eval|where|table|sort|head|tail|fields|dedup|rename|rex|transaction|chart|timechart|top|rare|streamstats|eventstats|bin|bucket|return|append|appendcols|join|lookup|inputlookup|outputlookup|makeresults|map|foreach|if|case|coalesce|mvexpand)\b/, 'keyword'],
        
        // Functions
        [/\b(avg|count|sum|min|max|list|values|dc|distinct_count|earliest|latest|range|stdev|var|median|mode|perc|upper|lower|substr|trim|replace|split|len|tonumber|tostring|strftime|strptime|now|relative_time|round|ceil|floor)\b/, 'function'],
        
        // Field names (starting with _ or alphanumeric)
        [/\b[a-zA-Z_][a-zA-Z0-9_]*/, 'variable'],
        
        // Strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/"/, 'string', '@string_double'],
        
        // Numbers
        [/\d+(\.\d+)?/, 'number'],
        
        // Operators
        [/[=!<>]=?/, 'operator'],
        [/\|/, 'delimiter.pipe'],
        
        // Comments
        [/```.*$/, 'comment'],
      ],
      
      string_double: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"/, 'string', '@pop']
      ],
    }
  });

  // Define theme colors for the tokens
  monaco.editor.defineTheme('splunk-theme', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
      { token: 'function', foreground: 'DCDCAA' },
      { token: 'variable', foreground: '9CDCFE' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'operator', foreground: 'D4D4D4' },
      { token: 'delimiter.pipe', foreground: 'C586C0', fontStyle: 'bold' },
      { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
    ],
    colors: {}
  });
}
```

### Approach 2: TextMate Grammar (For Complex Languages)

For languages with existing VS Code extensions, you can extract their TextMate grammars:

1. Find the VS Code extension (e.g., "Splunk Search Syntax Highlighter")
2. Download the .vsix file
3. Extract the `syntaxes/*.tmLanguage.json` file
4. Load it using `monaco-textmate`

**Example Setup**:

```typescript
// client/src/utils/language/textmateLoader.ts
import { loadWASM } from 'vscode-oniguruma';
import { Registry } from 'monaco-textmate';
import { wireTmGrammars } from 'monaco-editor-textmate';
import * as monaco from 'monaco-editor';

export async function loadTextMateGrammar(
  languageId: string,
  scopeName: string,
  grammarUrl: string
) {
  // Load WASM (only once)
  await loadWASM('/path/to/onig.wasm');
  
  const registry = new Registry({
    getGrammarDefinition: async (scopeName) => {
      const response = await fetch(grammarUrl);
      return {
        format: 'json',
        content: await response.text()
      };
    }
  });

  const grammars = new Map();
  grammars.set(languageId, scopeName);

  await wireTmGrammars(monaco, registry, grammars);
}
```

---

## Implementation Plan

### Phase 1: Extend Built-in Language List

**Goal**: Add languages that Monaco already supports but ByteStash doesn't list.

1. Update `languageUtils.ts` to include all Monaco built-in languages
2. Add missing languages like:
   - `redis`, `solidity`, `sparql`, `pgsql`, `mysql` (separate from generic `sql`)
   - `scheme`, `tcl`, `vb`, `proto`, `razor`

**Effort**: Low (1-2 hours)
**Files to modify**: `client/src/utils/language/languageUtils.ts`

### Phase 2: Add Simple Custom Languages (Monarch)

**Goal**: Add common missing languages using simple Monarch syntax.

**Priority Languages**:
1. **Splunk SPL** - Search Processing Language
2. **Elasticsearch Query DSL** - Query syntax
3. **Fish Shell** - Friendly shell
4. **Kusto Query Language (KQL)** - Azure Data Explorer
5. **LogQL** - Grafana Loki query language

**Implementation**:
- Create `client/src/utils/language/customLanguages/` directory
- One file per language (e.g., `splunk.ts`, `elasticsearch.ts`, `fish.ts`)
- Register during Monaco initialization in `languageUtils.ts`

**Effort**: Medium (4-8 hours for 5 languages)

### Phase 3: User-Installable Language System

**Goal**: Allow users to add custom languages via UI without code changes.

**Architecture**:
```
client/src/
  ├── utils/language/
  │   ├── languageUtils.ts           # Core language system
  │   ├── customLanguages/           # Built-in custom languages
  │   │   ├── splunk.ts
  │   │   ├── elasticsearch.ts
  │   │   └── fish.ts
  │   ├── userLanguages/             # User-defined languages
  │   │   ├── languageRegistry.ts    # Load/save user languages
  │   │   └── languageDefinition.ts  # Type definitions
  │   └── monarchEditor/             # UI for editing Monarch syntax
  │       └── LanguageEditorModal.tsx
```

**Features**:
1. **UI for adding languages** - Modal dialog with Monarch syntax editor
2. **localStorage persistence** - Save user language definitions
3. **Import/Export** - Share language definitions as JSON
4. **Language marketplace** (future) - Community-contributed definitions

**Effort**: High (16-24 hours)

---

## Specific Language Examples

### 1. Splunk SPL (Search Processing Language)

```typescript
// client/src/utils/language/customLanguages/splunk.ts
import * as monaco from 'monaco-editor';

export const splunkLanguageConfig = {
  id: 'splunk',
  extensions: ['.spl', '.splunk'],
  aliases: ['Splunk', 'SPL'],
  mimetypes: ['text/x-splunk'],
};

export const splunkMonarchLanguage = {
  defaultToken: '',
  tokenPostfix: '.spl',
  
  keywords: [
    'search', 'stats', 'eval', 'where', 'table', 'sort', 'head', 'tail',
    'fields', 'dedup', 'rename', 'rex', 'transaction', 'chart', 'timechart'
  ],
  
  operators: ['=', '!=', '<', '>', '<=', '>=', 'AND', 'OR', 'NOT'],
  
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  
  tokenizer: {
    root: [
      [/\|/, 'delimiter.pipe'],
      [/[a-z_$][\w$]*/, {
        cases: {
          '@keywords': 'keyword',
          '@default': 'identifier'
        }
      }],
      [/"([^"\\]|\\.)*$/, 'string.invalid'],
      [/"/, 'string', '@string'],
      [/\d+/, 'number'],
      { include: '@whitespace' },
    ],
    
    string: [
      [/[^\\"]+/, 'string'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop']
    ],
    
    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/```.*$/, 'comment'],
    ],
  }
};

export function registerSplunkLanguage() {
  monaco.languages.register(splunkLanguageConfig);
  monaco.languages.setMonarchTokensProvider('splunk', splunkMonarchLanguage);
}
```

### 2. Elasticsearch Query DSL

```typescript
// client/src/utils/language/customLanguages/elasticsearch.ts
import * as monaco from 'monaco-editor';

export const elasticsearchLanguageConfig = {
  id: 'elasticsearch',
  extensions: ['.es'],
  aliases: ['Elasticsearch', 'ES', 'ESQL'],
};

export const elasticsearchMonarchLanguage = {
  keywords: [
    'FROM', 'WHERE', 'LIMIT', 'SORT', 'STATS', 'BY', 'AS',
    'KEEP', 'DROP', 'RENAME', 'EVAL', 'ROW', 'SHOW', 'ENRICH',
    'DISSECT', 'GROK', 'MV_EXPAND'
  ],
  
  typeKeywords: [
    'boolean', 'integer', 'long', 'double', 'keyword', 'text', 'date', 'ip'
  ],
  
  operators: [
    'AND', 'OR', 'NOT', 'IN', 'LIKE', 'RLIKE', 'IS', 'NULL', 'IS NOT NULL'
  ],

  functions: [
    'AVG', 'COUNT', 'MAX', 'MIN', 'SUM', 'MEDIAN', 'PERCENTILE',
    'CONCAT', 'LENGTH', 'SUBSTRING', 'UPPER', 'LOWER', 'TRIM',
    'TO_STRING', 'TO_INTEGER', 'TO_DOUBLE', 'TO_BOOLEAN', 'TO_DATETIME',
    'NOW', 'DATE_EXTRACT', 'DATE_FORMAT', 'DATE_PARSE', 'DATE_TRUNC'
  ],
  
  tokenizer: {
    root: [
      [/[A-Z_]+/, {
        cases: {
          '@keywords': 'keyword',
          '@typeKeywords': 'type',
          '@operators': 'operator',
          '@functions': 'function',
          '@default': 'identifier'
        }
      }],
      [/[a-z_][\w]*/, 'identifier'],
      [/"([^"\\]|\\.)*"/, 'string'],
      [/'([^'\\]|\\.)*'/, 'string'],
      [/\d+(\.\d+)?/, 'number'],
      [/[|,]/, 'delimiter'],
      [/[ \t\r\n]+/, 'white'],
      [/\/\/.*$/, 'comment'],
    ]
  }
};

export function registerElasticsearchLanguage() {
  monaco.languages.register(elasticsearchLanguageConfig);
  monaco.languages.setMonarchTokensProvider('elasticsearch', elasticsearchMonarchLanguage);
}
```

### 3. Fish Shell

```typescript
// client/src/utils/language/customLanguages/fish.ts
import * as monaco from 'monaco-editor';

export const fishLanguageConfig = {
  id: 'fish',
  extensions: ['.fish'],
  aliases: ['Fish', 'fish'],
  filenames: ['config.fish'],
};

export const fishMonarchLanguage = {
  keywords: [
    'function', 'end', 'if', 'else', 'switch', 'case', 'for', 'in', 'while',
    'begin', 'break', 'continue', 'return', 'and', 'or', 'not', 'set', 'set_color',
    'echo', 'read', 'test', 'source', 'complete', 'abbr', 'alias', 'funced',
    'funcsave', 'bind', 'commandline', 'contains', 'count', 'argparse',
    'string', 'math', 'random', 'path', 'status', 'type', 'command'
  ],
  
  builtins: [
    'cd', 'pushd', 'popd', 'dirs', 'prevd', 'nextd', 'pwd', 'ls', 'cat',
    'grep', 'sed', 'awk', 'cut', 'sort', 'uniq', 'head', 'tail', 'wc',
    'fg', 'bg', 'jobs', 'disown', 'wait', 'kill', 'killall'
  ],
  
  tokenizer: {
    root: [
      // Comments
      [/#.*$/, 'comment'],
      
      // Function definitions
      [/(function)\s+([a-zA-Z_][\w-]*)/, ['keyword', 'function']],
      
      // Keywords
      [/\b(function|end|if|else|switch|case|for|in|while|begin|break|continue|return|and|or|not|set|echo|read|test|source)\b/, 'keyword'],
      
      // Variables
      [/\$[a-zA-Z_][\w]*/, 'variable'],
      [/\$\(/, 'variable', '@commandSubstitution'],
      
      // Strings
      [/"/, 'string', '@stringDouble'],
      [/'/, 'string', '@stringSingle'],
      
      // Numbers
      [/\d+/, 'number'],
      
      // Operators
      [/[|&;()<>]/, 'operator'],
      
      // Identifiers
      [/[a-zA-Z_][\w-]*/, {
        cases: {
          '@builtins': 'type',
          '@default': 'identifier'
        }
      }],
    ],
    
    commandSubstitution: [
      [/\)/, 'variable', '@pop'],
      { include: 'root' }
    ],
    
    stringDouble: [
      [/[^\\"$]+/, 'string'],
      [/\$[a-zA-Z_][\w]*/, 'variable'],
      [/\\./, 'string.escape'],
      [/"/, 'string', '@pop']
    ],
    
    stringSingle: [
      [/[^\\']+/, 'string'],
      [/\\./, 'string.escape'],
      [/'/, 'string', '@pop']
    ],
  }
};

export function registerFishLanguage() {
  monaco.languages.register(fishLanguageConfig);
  monaco.languages.setMonarchTokensProvider('fish', fishMonarchLanguage);
}
```

---

## User-Installable Language System

### Architecture Design

#### 1. Language Definition Format (JSON)

```json
{
  "id": "splunk",
  "name": "Splunk SPL",
  "extensions": [".spl", ".splunk"],
  "aliases": ["Splunk", "SPL"],
  "monarchDefinition": {
    "keywords": ["search", "stats", "eval"],
    "operators": ["=", "!=", "AND", "OR"],
    "tokenizer": {
      "root": [
        ["\\|", "delimiter.pipe"],
        ["[a-z_$][\\w$]*", { "cases": { "@keywords": "keyword", "@default": "identifier" } }]
      ]
    }
  },
  "author": "Community",
  "version": "1.0.0",
  "description": "Syntax highlighting for Splunk Search Processing Language"
}
```

#### 2. Language Registry (LocalStorage)

```typescript
// client/src/utils/language/userLanguages/languageRegistry.ts
import * as monaco from 'monaco-editor';

export interface UserLanguageDefinition {
  id: string;
  name: string;
  extensions: string[];
  aliases: string[];
  monarchDefinition: monaco.languages.IMonarchLanguage;
  author?: string;
  version?: string;
  description?: string;
}

const STORAGE_KEY = 'bytestash_user_languages';

export class UserLanguageRegistry {
  private languages: Map<string, UserLanguageDefinition> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  // Load user languages from localStorage
  loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const languages: UserLanguageDefinition[] = JSON.parse(stored);
        languages.forEach(lang => {
          this.registerLanguage(lang);
        });
      }
    } catch (error) {
      console.error('Failed to load user languages:', error);
    }
  }

  // Save user languages to localStorage
  saveToStorage(): void {
    try {
      const languages = Array.from(this.languages.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(languages));
    } catch (error) {
      console.error('Failed to save user languages:', error);
    }
  }

  // Register a new user language
  registerLanguage(lang: UserLanguageDefinition): void {
    // Register with Monaco
    monaco.languages.register({
      id: lang.id,
      extensions: lang.extensions,
      aliases: lang.aliases,
    });

    // Set Monarch tokenizer
    monaco.languages.setMonarchTokensProvider(lang.id, lang.monarchDefinition);

    // Store in registry
    this.languages.set(lang.id, lang);
    this.saveToStorage();
  }

  // Remove a user language
  removeLanguage(id: string): void {
    this.languages.delete(id);
    this.saveToStorage();
    // Note: Monaco doesn't support unregistering languages
    // The language will remain until page reload
  }

  // Get all user languages
  getAllLanguages(): UserLanguageDefinition[] {
    return Array.from(this.languages.values());
  }

  // Export language definition
  exportLanguage(id: string): string | null {
    const lang = this.languages.get(id);
    if (!lang) return null;
    return JSON.stringify(lang, null, 2);
  }

  // Import language definition
  importLanguage(json: string): boolean {
    try {
      const lang: UserLanguageDefinition = JSON.parse(json);
      
      // Validate required fields
      if (!lang.id || !lang.name || !lang.monarchDefinition) {
        throw new Error('Invalid language definition');
      }

      this.registerLanguage(lang);
      return true;
    } catch (error) {
      console.error('Failed to import language:', error);
      return false;
    }
  }

  // Export all languages
  exportAll(): string {
    return JSON.stringify(this.getAllLanguages(), null, 2);
  }

  // Import multiple languages
  importAll(json: string): number {
    try {
      const languages: UserLanguageDefinition[] = JSON.parse(json);
      let count = 0;
      
      languages.forEach(lang => {
        try {
          this.registerLanguage(lang);
          count++;
        } catch (error) {
          console.error(`Failed to import ${lang.id}:`, error);
        }
      });

      return count;
    } catch (error) {
      console.error('Failed to import languages:', error);
      return 0;
    }
  }
}

// Global singleton
export const userLanguageRegistry = new UserLanguageRegistry();
```

#### 3. Language Editor Modal UI

```typescript
// client/src/components/settings/LanguageEditorModal.tsx
import React, { useState } from 'react';
import { Modal } from '../common/modals/Modal';
import { UserLanguageDefinition, userLanguageRegistry } from '../../utils/language/userLanguages/languageRegistry';

interface LanguageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageEditorModal: React.FC<LanguageEditorModalProps> = ({ isOpen, onClose }) => {
  const [languages, setLanguages] = useState(userLanguageRegistry.getAllLanguages());
  const [editingLanguage, setEditingLanguage] = useState<UserLanguageDefinition | null>(null);
  const [importJson, setImportJson] = useState('');

  const handleAddLanguage = () => {
    const newLang: UserLanguageDefinition = {
      id: 'custom-language',
      name: 'Custom Language',
      extensions: ['.custom'],
      aliases: ['Custom'],
      monarchDefinition: {
        tokenizer: {
          root: [
            [/[a-zA-Z_]\w*/, 'identifier'],
            [/"[^"]*"/, 'string'],
            [/\d+/, 'number'],
          ]
        }
      }
    };
    setEditingLanguage(newLang);
  };

  const handleSaveLanguage = (lang: UserLanguageDefinition) => {
    userLanguageRegistry.registerLanguage(lang);
    setLanguages(userLanguageRegistry.getAllLanguages());
    setEditingLanguage(null);
  };

  const handleDeleteLanguage = (id: string) => {
    if (confirm(`Delete language "${id}"? (Will take effect after page reload)`)) {
      userLanguageRegistry.removeLanguage(id);
      setLanguages(userLanguageRegistry.getAllLanguages());
    }
  };

  const handleImport = () => {
    if (userLanguageRegistry.importLanguage(importJson)) {
      setLanguages(userLanguageRegistry.getAllLanguages());
      setImportJson('');
      alert('Language imported successfully!');
    } else {
      alert('Failed to import language. Check the JSON format.');
    }
  };

  const handleExport = (id: string) => {
    const json = userLanguageRegistry.exportLanguage(id);
    if (json) {
      // Copy to clipboard or download
      navigator.clipboard.writeText(json);
      alert('Language definition copied to clipboard!');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Custom Language Manager">
      <div className="space-y-4">
        {/* Language List */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Installed Custom Languages</h3>
          {languages.length === 0 ? (
            <p className="text-gray-500">No custom languages installed</p>
          ) : (
            <ul className="space-y-2">
              {languages.map(lang => (
                <li key={lang.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <strong>{lang.name}</strong> ({lang.id})
                    {lang.description && <p className="text-sm text-gray-600">{lang.description}</p>}
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => setEditingLanguage(lang)} className="btn-secondary">Edit</button>
                    <button onClick={() => handleExport(lang.id)} className="btn-secondary">Export</button>
                    <button onClick={() => handleDeleteLanguage(lang.id)} className="btn-danger">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add New Language */}
        <button onClick={handleAddLanguage} className="btn-primary">
          + Add New Language
        </button>

        {/* Import Language */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Import Language</h3>
          <textarea
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            placeholder="Paste language JSON here..."
            className="w-full h-32 p-2 border rounded font-mono text-sm"
          />
          <button onClick={handleImport} className="btn-primary mt-2">Import</button>
        </div>

        {/* Editor Modal (nested) */}
        {editingLanguage && (
          <LanguageDefinitionEditor
            language={editingLanguage}
            onSave={handleSaveLanguage}
            onCancel={() => setEditingLanguage(null)}
          />
        )}
      </div>
    </Modal>
  );
};
```

#### 4. Integration with Settings

Update `SettingsModal.tsx` to include a "Custom Languages" tab or section.

---

## Recommended Approach

### Short-term (Immediate): Add Built-in Custom Languages

1. **Create custom language directory**: `client/src/utils/language/customLanguages/`
2. **Add priority languages**:
   - `splunk.ts` - Splunk SPL
   - `elasticsearch.ts` - Elasticsearch Query DSL
   - `fish.ts` - Fish Shell
   - `kql.ts` - Kusto Query Language (Azure)
   - `logql.ts` - LogQL (Grafana Loki)

3. **Update languageUtils.ts**:
```typescript
// Import custom languages
import { registerSplunkLanguage } from './customLanguages/splunk';
import { registerElasticsearchLanguage } from './customLanguages/elasticsearch';
import { registerFishLanguage } from './customLanguages/fish';

export const initializeMonaco = () => {
  configureMonaco();
  
  // Register custom languages
  registerSplunkLanguage();
  registerElasticsearchLanguage();
  registerFishLanguage();
  // ... more custom languages
};

// Update LANGUAGE_MAPPING
const LANGUAGE_MAPPING: LanguageMapping = {
  // ... existing languages ...
  
  // Custom languages
  splunk: {
    aliases: ['spl', 'splunk-query'],
    monacoAlias: 'splunk',
    label: 'splunk'
  },
  elasticsearch: {
    aliases: ['es', 'esql', 'es-query'],
    monacoAlias: 'elasticsearch',
    label: 'elasticsearch'
  },
  fish: {
    aliases: ['fish-shell'],
    monacoAlias: 'fish',
    label: 'fish'
  },
};
```

**Effort**: ~8 hours
**Benefit**: Immediate support for most-requested languages

### Medium-term: User-Installable Language System

1. **Implement UserLanguageRegistry** (see above)
2. **Create LanguageEditorModal UI**
3. **Add to SettingsModal**
4. **Create documentation with examples**
5. **Build a language definition library** (GitHub repo with community contributions)

**Effort**: ~24 hours
**Benefit**: Users can add any language without code changes

### Long-term: Language Marketplace

1. **Public repository** of language definitions
2. **One-click install** from marketplace
3. **Rating/review system** for quality
4. **Automatic updates** for language definitions
5. **VS Code extension converter** - automatically convert VS Code language extensions to ByteStash format

**Effort**: ~40+ hours
**Benefit**: Unlimited language support via community

---

## Quick Start: Adding Your First Custom Language

### Example: Adding Fish Shell

1. **Create the language file**:

```bash
mkdir -p client/src/utils/language/customLanguages
touch client/src/utils/language/customLanguages/fish.ts
```

2. **Define the language** (use the Fish example from above)

3. **Register it in languageUtils.ts**:

```typescript
// At the top
import { registerFishLanguage } from './customLanguages/fish';

// In initializeMonaco()
export const initializeMonaco = () => {
  configureMonaco();
  registerFishLanguage();
};

// In LANGUAGE_MAPPING
fish: {
  aliases: ['fish-shell'],
  monacoAlias: 'fish',
  label: 'fish'
},
```

4. **Rebuild and test**:

```bash
cd client
npm run build
# Or for development
npm start
```

---

## Resources

### Monaco Editor Documentation
- **Official Docs**: https://microsoft.github.io/monaco-editor/
- **Monarch Language**: https://microsoft.github.io/monaco-editor/monarch.html
- **API Reference**: https://microsoft.github.io/monaco-editor/api/index.html

### TextMate Grammars
- **VS Code Extension Marketplace**: https://marketplace.visualstudio.com/vscode
- **TextMate Language Grammars**: https://macromates.com/manual/en/language_grammars
- **Splunk Extension**: https://marketplace.visualstudio.com/items?itemName=Splunk.splunk-search-syntax

### Community Resources
- **Monaco Languages Repo**: https://github.com/microsoft/monaco-languages
- **Monaco Editor Samples**: https://github.com/microsoft/monaco-editor-samples
- **Monarch Language Examples**: https://github.com/microsoft/monaco-editor/tree/main/src/basic-languages

---

## Next Steps

1. **Decide on approach**: Quick win (built-in customs) or full system (user-installable)?
2. **Prioritize languages**: Which languages do you need first?
3. **Prototype**: Start with one language (e.g., Splunk) to validate the approach
4. **Iterate**: Add more languages based on feedback
5. **Document**: Create user-facing documentation on how to add languages

Would you like me to implement any of these approaches for you?

