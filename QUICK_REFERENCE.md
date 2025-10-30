# Quick Reference - Custom Languages

## Language Selection

When creating or editing a snippet, select from these languages in the dropdown:

| Display Name | Language ID | File Extensions |
|--------------|-------------|-----------------|
| **splunk spl** | `spl` | `.spl`, `.splunk` |
| **elasticsearch** | `esql` | `.es`, `.esql` |
| **fish** | `fish` | `.fish` |

## Comment Syntax

All three languages now support `#` comments:

```spl
# This is a comment in Splunk SPL
index=main | stats count
```

```esql
# This is a comment in ES|QL
FROM logs-* | LIMIT 10
```

```fish
# This is a comment in Fish
echo "Hello, World!"
```

## Syntax Highlighting Colors

### Dark Mode

| Token Type | Color | Style |
|------------|-------|-------|
| Keywords | Blue (#569CD6) | Bold |
| Functions | Yellow (#DCDCAA) | Normal |
| Variables | Light Blue (#9CDCFE) | Normal |
| Strings | Orange (#CE9178) | Normal |
| Numbers | Light Green (#B5CEA8) | Normal |
| **Pipe Delimiters** \| | **Hot Pink (#FF79C6)** | **Bold** |
| Brackets [ ] ( ) | Gold (#FFD700) | Normal |
| Comments # | Green (#6A9955) | Italic |
| Operators AND, OR | Purple (#C586C0) | Bold |

### Light Mode

| Token Type | Color | Style |
|------------|-------|-------|
| Keywords | Blue (#0000FF) | Bold |
| Functions | Brown (#795E26) | Normal |
| Variables | Dark Blue (#001080) | Normal |
| Strings | Red (#A31515) | Normal |
| Numbers | Green (#098658) | Normal |
| **Pipe Delimiters** \| | **Purple (#AF00DB)** | **Bold** |
| Comments # | Green (#008000) | Italic |

## Code Examples

### Splunk SPL

```spl
# Analyze web access logs
index=web sourcetype=access_combined
| stats count by status, method
| where count > 100
| eval percentage=round(count/total*100, 2)
| sort -count
| head 10
```

**Highlighted Features**:
- Keywords: `stats`, `where`, `eval`, `sort`, `head`
- Functions: `count`, `round`
- Variables: `status`, `method`, `total`, `percentage`
- Pipe delimiters: `|`
- Comments: `#`

### Elasticsearch ES|QL

```esql
# Query logs from last 24 hours
FROM logs-*
| WHERE @timestamp > NOW() - 24 HOURS
| STATS count = COUNT(*), avg_duration = AVG(duration) BY status
| EVAL duration_seconds = duration / 1000
| SORT count DESC
| LIMIT 10
```

**Highlighted Features**:
- Keywords: `FROM`, `WHERE`, `STATS`, `EVAL`, `SORT`, `LIMIT`
- Functions: `NOW`, `COUNT`, `AVG`
- Field names: `@timestamp`, `status`, `duration`
- Pipe delimiters: `|`
- Comments: `#`

### Fish Shell

```fish
# Define a greeting function
function greet
    set name $argv[1]
    
    if test -z "$name"
        set name "World"
    end
    
    echo "Hello, $name!"
end

# Use the function
greet Alice
```

**Highlighted Features**:
- Keywords: `function`, `if`, `end`
- Built-ins: `set`, `test`, `echo`
- Variables: `$name`, `$argv`
- Function definitions: `greet`
- Comments: `#`

## Auto-completion

Press `Ctrl+Space` (or `Cmd+Space` on Mac) to trigger auto-completion:

### SPL
- Type `st` → suggests `stats`, `streamstats`, `stdev`, etc.
- Type `ev` → suggests `eval`, `eventstats`, etc.

### ES|QL  
- Type `FR` → suggests `FROM`
- Type `WH` → suggests `WHERE`

### Fish
- Type `fun` → suggests `function`, `functions`
- Type `set` → suggests `set`, `set_color`

## File Upload

Upload files with these extensions to auto-detect the language:

- `.spl` or `.splunk` → Automatically detected as **Splunk SPL**
- `.es` or `.esql` → Automatically detected as **Elasticsearch**
- `.fish` → Automatically detected as **Fish Shell**

## Tips

1. **Pipe delimiters stand out**: The `|` character is highlighted in hot pink to make query pipelines easier to read

2. **Comments are your friend**: Use `#` for inline documentation in all three languages

3. **Case sensitivity**: 
   - SPL: Case-insensitive
   - ES|QL: Keywords are case-insensitive, but field names are case-sensitive
   - Fish: Case-sensitive

4. **Theme switching**: Toggle between dark and light modes in settings - both themes are fully optimized

## Troubleshooting

**Problem**: Text appears all black (no colors)
- **Solution**: Make sure the language is set to `spl`, `esql`, or `fish` (not `plaintext`)

**Problem**: Comments not highlighted
- **Solution**: Ensure you're using `#` at the start of the line or after whitespace

**Problem**: Language not in dropdown
- **Solution**: Refresh the page - custom languages register on initialization

## Shortcuts

| Action | Shortcut |
|--------|----------|
| Trigger auto-complete | `Ctrl+Space` / `Cmd+Space` |
| Comment line | `Ctrl+/` / `Cmd+/` |
| Format code | `Shift+Alt+F` / `Shift+Opt+F` |
| Find | `Ctrl+F` / `Cmd+F` |

---

**Need more help?** Check out:
- `LANGUAGE_OPTIMIZATIONS.md` - Full optimization guide
- `LANGUAGE_IMPROVEMENTS.md` - Implementation details
- `TEST_CUSTOM_LANGUAGES.md` - Testing instructions

