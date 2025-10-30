# Test Custom Languages

## Quick Test Guide

To test the new custom language support, follow these steps:

### 1. Start the Development Server

```bash
cd client
npm start
```

### 2. Test Splunk SPL

1. Create a new snippet
2. Select "splunk" as the language
3. Paste this test code:

```spl
index=main sourcetype=access_combined
| stats count by status, method
| where count > 100
| eval percentage=round(count/total*100, 2)
| sort -count
| head 10
```

**Expected**: Syntax highlighting for commands (`stats`, `eval`, `where`), functions (`round`, `count`), and pipe delimiters.

### 3. Test Elasticsearch ES|QL

1. Create a new snippet
2. Select "elasticsearch" as the language
3. Paste this test code:

```esql
FROM logs-*
| WHERE @timestamp > NOW() - 24 HOURS
| STATS count = COUNT(*), avg_duration = AVG(duration) BY status
| EVAL duration_seconds = duration / 1000
| SORT count DESC
| LIMIT 10
```

**Expected**: Highlighting for keywords (`FROM`, `WHERE`, `STATS`), functions (`NOW`, `COUNT`, `AVG`), and pipe delimiters.

### 4. Test Fish Shell

1. Create a new snippet
2. Select "fish" as the language
3. Paste this test code:

```fish
function greet
    set name $argv[1]
    if test -z "$name"
        set name "World"
    end
    echo "Hello, $name!"
end

for file in *.txt
    echo "Processing $file"
    cat $file | string upper | string trim
end
```

**Expected**: Highlighting for keywords (`function`, `if`, `for`), variables (`$name`, `$argv`), and built-in commands.

### 5. Test File Upload

Create test files with the new extensions:

**test.spl**:
```spl
search index=main | stats count
```

**test.fish**:
```fish
echo "Hello from Fish!"
```

**test.esql**:
```esql
FROM my_index | LIMIT 10
```

Upload these files and verify they're auto-detected with the correct language.

### 6. Test New Built-in Languages

Try selecting these newly added languages:
- MySQL
- PostgreSQL
- Redis
- F#
- Clojure
- Elixir
- Haskell
- Fish

Verify they appear in the language dropdown.

### 7. Test Auto-completion (Optional)

In the editor, type:
- Splunk: `st` then press Ctrl+Space (should suggest `stats`, `streamstats`, etc.)
- Elasticsearch: `FR` then Ctrl+Space (should suggest `FROM`)
- Fish: `fun` then Ctrl+Space (should suggest `function`, `functions`)

## Troubleshooting

### Languages don't appear in dropdown
- Check browser console for errors
- Verify `initializeMonaco()` is being called
- Check that language files are being imported

### No syntax highlighting
- Check that Monaco editor is initializing correctly
- Verify the language ID matches between selection and Monaco

### TypeScript Build Errors
The project has pre-existing TypeScript configuration issues that are unrelated to the custom language additions. The application should work in development mode despite these errors.

## Files Modified

- ✅ `client/src/utils/language/customLanguages/splunk.ts` (NEW)
- ✅ `client/src/utils/language/customLanguages/elasticsearch.ts` (NEW)
- ✅ `client/src/utils/language/customLanguages/fish.ts` (NEW)
- ✅ `client/src/utils/language/languageUtils.ts` (MODIFIED)
- ✅ `client/src/utils/fileUploadUtils.ts` (MODIFIED)

## Success Criteria

✅ All 3 custom languages appear in language selection dropdown
✅ Syntax highlighting works in editor (Monaco)
✅ File upload auto-detects language from extension
✅ New built-in languages (MySQL, PostgreSQL, Redis, etc.) are available
✅ No runtime errors in browser console
✅ Existing snippets continue to work

Total languages supported: **70+** (up from ~50)

