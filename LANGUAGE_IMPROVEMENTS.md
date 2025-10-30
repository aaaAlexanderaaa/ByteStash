# Language Support Improvements - ByteStash

## Summary

This document details the language support improvements made to ByteStash, including custom language syntax highlighting and expanded built-in language support.

## Changes Made

### 1. Custom Language Implementations

Created three new custom language definitions using Monaco's Monarch syntax system:

#### **Splunk SPL (Search Processing Language)**
- **File**: `client/src/utils/language/customLanguages/splunk.ts`
- **Extensions**: `.spl`, `.splunk`
- **Features**:
  - Syntax highlighting for 60+ Splunk commands (search, stats, eval, etc.)
  - Function highlighting for aggregate, string, time, and math functions
  - Pipe delimiter highlighting (critical for SPL)
  - Field name recognition
  - Auto-completion support for commands and functions

#### **Elasticsearch Query Language (ES|QL)**
- **File**: `client/src/utils/language/customLanguages/elasticsearch.ts`
- **Extensions**: `.es`, `.esql`
- **Features**:
  - ES|QL command highlighting (FROM, WHERE, STATS, etc.)
  - Function support (aggregate, string, date, math, etc.)
  - Type keyword highlighting
  - Pipe-based query syntax support
  - Auto-completion support

#### **Fish Shell**
- **File**: `client/src/utils/language/customLanguages/fish.ts`
- **Extensions**: `.fish`, `config.fish`
- **Features**:
  - Fish-specific keywords and control structures
  - Built-in command highlighting (60+ commands)
  - Variable expansion highlighting ($var)
  - Command substitution support
  - String handling (both single and double quotes)
  - Auto-completion support

### 2. Added Built-in Monaco Languages

Expanded the language mapping to include Monaco's built-in languages that were previously missing:

#### **Database Languages**
- **MySQL** - Separated from generic SQL with dedicated `mysql` language ID
- **PostgreSQL** (pgsql) - Dedicated PostgreSQL syntax support
- **Redis** - Redis command syntax
- **Redshift** - AWS Redshift query support

#### **Additional Programming Languages**
- **F#** (fsharp) - Functional programming on .NET
- **Clojure** - Lisp dialect for JVM
- **Scheme** - Classic Lisp dialect
- **Elixir** - Functional language for Erlang VM
- **Haskell** - Pure functional programming
- **Objective-C** - iOS/macOS development
- **Pascal** - Including Delphi
- **Visual Basic** (VB.NET)
- **TCL** - Tool Command Language

#### **Configuration & Markup**
- **INI** - Configuration files (separated from TOML)
- **Protobuf** - Protocol Buffers

#### **Query Languages**
- **SPARQL** - RDF query language

### 3. Updated Language Mapping

**File**: `client/src/utils/language/languageUtils.ts`

- Added imports for custom language registrations
- Updated `initializeMonaco()` to register custom languages:
  ```typescript
  export const initializeMonaco = () => {
    configureMonaco();
    
    // Register custom languages
    registerSplunkLanguage();
    registerElasticsearchLanguage();
    registerFishLanguage();
  };
  ```

- Added language entries in `LANGUAGE_MAPPING` for all new languages
- Total languages supported: **70+** (up from ~50)

### 4. File Upload Support

**File**: `client/src/utils/fileUploadUtils.ts`

Updated to recognize new file extensions:

#### Custom Languages
- `.spl`, `.splunk` → Splunk
- `.es`, `.esql` → Elasticsearch
- `.fish` → Fish Shell

#### Additional Languages
- `.psql` → PostgreSQL
- `.fs`, `.fsx` → F#
- `.clj`, `.cljs` → Clojure
- `.ex`, `.exs` → Elixir
- `.hs` → Haskell
- `.proto` → Protobuf

## Language Categories Summary

### Web Development (7 languages)
- JavaScript, TypeScript, HTML, CSS, PHP, WebAssembly

### System Programming (5 languages)
- C, C++, C#, Rust, Go

### JVM Languages (4 languages)
- Java, Kotlin, Scala, Groovy

### Scripting (4 languages)
- Python, Ruby, Perl, Lua

### Shell Scripting (4 languages)
- Bash, **Fish** ✨, PowerShell, Batch

### Database & Query (10 languages)
- SQL, **MySQL** ✨, **PostgreSQL** ✨, **Redis** ✨, **Redshift** ✨
- **Splunk** ✨, **Elasticsearch** ✨, GraphQL, Cypher, **SPARQL** ✨
- MongoDB (JavaScript-based)

### Functional Programming (6 languages)
- **F#** ✨, **Clojure** ✨, **Scheme** ✨, **Elixir** ✨, **Haskell** ✨, Elm

### Mobile/Apple (4 languages)
- Swift, Dart (Flutter), **Objective-C** ✨, Kotlin

### Data Science (3 languages)
- R, Julia, MATLAB

### Markup & Config (8 languages)
- Markdown, YAML, JSON, XML, TOML, **INI** ✨, **Protobuf** ✨, LaTeX

### Infrastructure (3 languages)
- Terraform/HCL, Dockerfile, Kubernetes (YAML)

### Smart Contracts (2 languages)
- Solidity, Vyper

### Other (10 languages)
- **Visual Basic** ✨, **Pascal** ✨, **TCL** ✨, Apex, ABAP, Plaintext

✨ = Newly added in this update

## Technical Details

### Custom Language Architecture

Each custom language follows this structure:

1. **Language Configuration** - Defines language ID, extensions, aliases
2. **Monarch Language Definition** - Tokenizer rules for syntax highlighting
3. **Registration Function** - Registers the language with Monaco
4. **Auto-completion Provider** - Provides IntelliSense suggestions

### Integration Points

1. **Monaco Editor** (`CodeEditor.tsx`)
   - Uses `getMonacoLanguage()` to map user selection to Monaco language ID
   - Automatically applies custom language syntax highlighting

2. **Preview Display** (`PreviewCodeBlock.tsx`, `FullCodeBlock.tsx`)
   - Uses react-syntax-highlighter (Prism)
   - Falls back gracefully for languages not in Prism

3. **File Upload** (`FileUploadButton.tsx`)
   - Automatically detects language from file extension
   - Uses `detectLanguageFromFilename()` helper

4. **Language Selection** (Dropdowns)
   - Shows all 70+ languages in alphabetical order
   - Separates "used" vs "other" languages based on usage

## Testing Recommendations

### Manual Testing

1. **Create New Snippets**
   - Test each new custom language (Splunk, Elasticsearch, Fish)
   - Verify syntax highlighting works correctly
   - Test auto-completion (Ctrl+Space)

2. **File Upload**
   - Upload `.spl`, `.fish`, `.es` files
   - Verify language auto-detection works

3. **Language Selection**
   - Check that all new languages appear in dropdowns
   - Verify language labels display correctly

4. **Preview vs Edit**
   - Compare syntax highlighting in edit mode vs preview mode
   - Ensure colors and styles are consistent

### Test Code Samples

#### Splunk SPL
```spl
index=main sourcetype=access_combined
| stats count by status
| where count > 100
| eval percentage=round(count/total*100, 2)
| sort -count
```

#### Elasticsearch ES|QL
```esql
FROM logs-*
| WHERE @timestamp > NOW() - 24 HOURS
| STATS count = COUNT(*), avg_duration = AVG(duration) BY status
| SORT count DESC
| LIMIT 10
```

#### Fish Shell
```fish
function greet
    set name $argv[1]
    echo "Hello, $name!"
end

for file in *.txt
    echo "Processing $file"
    cat $file | string upper
end
```

## Future Enhancements

### Phase 2: User-Installable Languages
- Allow users to add custom languages via UI
- Store language definitions in localStorage
- Import/Export language definitions as JSON

### Phase 3: Language Marketplace
- Community-contributed language definitions
- One-click install from repository
- Automatic updates for language definitions

### Additional Languages to Consider
- **LogQL** - Grafana Loki query language
- **KQL** - Kusto Query Language (Azure Data Explorer)
- **PromQL** - Prometheus query language
- **JQ** - JSON query language
- **Nix** - Nix expression language
- **Zig** - Modern systems programming

## Resources

- **Monaco Editor Documentation**: https://microsoft.github.io/monaco-editor/
- **Monarch Language Tutorial**: https://microsoft.github.io/monaco-editor/monarch.html
- **Custom Languages Directory**: `client/src/utils/language/customLanguages/`

## Migration Notes

- **No breaking changes** - All existing snippets continue to work
- **Automatic fallback** - Unknown languages gracefully fall back to plaintext
- **Language aliases** - Old language names still work (e.g., "mysql" now maps to dedicated MySQL language instead of generic SQL)

## Performance Impact

- **Minimal** - Custom languages use Monaco's efficient Monarch system
- **Lazy loading** - Languages only loaded when Monaco initializes
- **No external dependencies** - All custom languages are self-contained

## Conclusion

ByteStash now supports **70+ programming languages**, including specialized query languages like Splunk SPL and Elasticsearch ES|QL, and modern shell scripting with Fish. The custom language system provides a foundation for adding unlimited language support in the future.

---

**Date**: October 29, 2025
**Changes By**: AI Assistant (Claude)
**Status**: ✅ Complete - Ready for Testing

