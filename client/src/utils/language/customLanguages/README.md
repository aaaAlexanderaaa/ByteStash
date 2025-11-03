# Custom Language Syntax Highlighting

## ✅ SSOT Architecture (Single Source of Truth)

This directory implements a **Single Source of Truth** architecture for custom language definitions.
All syntax rules are defined once in `languageDefinitions.ts` and automatically used by both:
- **Edit Mode** - Monaco Editor (advanced tokenizer)
- **View Mode** - CustomSyntaxHighlighter (regex-based renderer)

This ensures **perfect consistency** between editing and viewing modes with **zero maintenance overhead**.

---

## 📝 How to Modify Highlighting

### ✅ EASY WAY - Edit Keywords, Functions, Operators

**To change what words are highlighted (keywords, functions, operators, etc.):**

👉 **ONLY edit this ONE file:**
```
client/src/utils/language/customLanguages/languageDefinitions.ts
```

Both **edit mode** (Monaco) and **view mode** (CustomSyntaxHighlighter) automatically use these definitions.

#### Example: Add a new SPL command

```typescript
// In languageDefinitions.ts
export const splunkDefinition = {
  keywords: [
    'search', 'stats', 'eval',
    'mynewcommand',  // ← Add here!
    // ...
  ],
};
```

That's it! Both modes will now highlight `mynewcommand` as a keyword.

---

### 🔧 ADVANCED - Modify Tokenization Logic

**To change HOW highlighting works (regex patterns, state machines, etc.):**

You need to edit **TWO files** (but it's rare to need this):

#### 1. Edit Mode (Monaco Editor)
**Files:**
- `splunk.ts` - For Splunk SPL
- `elasticsearch.ts` - For Elasticsearch ES|QL
- `fish.ts` - For Fish shell

**What to change:**
- `tokenizer` object - State machine rules
- Regex patterns for special cases
- State transitions

#### 2. View Mode (Custom Highlighter)
**File:**
- `../../../components/editor/CustomSyntaxHighlighter.tsx`

**What to change:**
- `getPatterns()` function
- Regex patterns array
- Pattern order

---

## 📂 File Structure

```
customLanguages/
├── README.md                    ← You are here
├── languageDefinitions.ts       ← 📝 EDIT THIS for keywords/functions
├── splunk.ts                    ← Monaco tokenizer (advanced)
├── elasticsearch.ts             ← Monaco tokenizer (advanced)
├── fish.ts                      ← Monaco tokenizer (advanced)
└── index.ts                     ← Export file

../../components/editor/
└── CustomSyntaxHighlighter.tsx  ← View mode highlighter (advanced)
```

---

## 🎯 What's Automatically Synced

When you edit `languageDefinitions.ts`, these automatically update in **both modes**:

### Splunk SPL
- ✅ Keywords (search commands like `stats`, `eval`, `where`)
- ✅ Operators (logical like `AND`, `OR`, `NOT`)
- ✅ Functions (like `count`, `avg`, `sum`)
- ✅ Builtins (modifiers like `as`, `by`, `span`)
- ✅ Time modifiers (`earliest`, `latest`)

### Elasticsearch ES|QL
- ✅ Keywords (commands like `FROM`, `WHERE`, `STATS`)
- ✅ Functions (like `COUNT`, `AVG`, `TO_STRING`)
- ✅ Operators (logical like `AND`, `OR`, `NOT`)
- ✅ Type keywords (like `integer`, `long`, `boolean`)
- ✅ Constants (`true`, `false`, `null`)

### Fish Shell
- ✅ Keywords (control flow like `function`, `if`, `for`)
- ✅ Builtins (commands like `set`, `echo`, `string`)
- ✅ Set scopes/flags (like `-g`, `--global`, `-x`)
- ✅ Test operators (like `-eq`, `-f`, `-d`)

---

## 🔧 What Requires Manual Sync

These need to be updated in **both Monaco files AND CustomSyntaxHighlighter**:

### Rarely Changed:
- Comment syntax patterns (e.g., `#` vs `//` vs `/* */`)
- String quote styles (single vs double quotes)
- Number formats (hex, octal, binary patterns)
- Special syntax (like SPL subsearches `[...]`, macros `` `...` ``)

### Why Not Auto-Synced?
Monaco uses **state-based tokenization** (complex), while CustomSyntaxHighlighter uses **simple regex matching**. The logic is fundamentally different, so complex patterns can't be auto-generated.

---

## 🚀 Quick Start Examples

### Add a New Function to SPL

```typescript
// client/src/utils/language/customLanguages/languageDefinitions.ts

export const splunkDefinition = {
  functions: [
    'avg', 'count', 'dc',
    'my_custom_function',  // ← Add your function here
    // ...
  ],
};
```

### Add a New Keyword to Fish

```typescript
// client/src/utils/language/customLanguages/languageDefinitions.ts

export const fishDefinition = {
  keywords: [
    'function', 'end', 'if',
    'my_new_keyword',  // ← Add your keyword here
    // ...
  ],
};
```

### Add a New Command to ES|QL

```typescript
// client/src/utils/language/customLanguages/languageDefinitions.ts

export const esqlDefinition = {
  keywords: [
    'FROM', 'WHERE', 'STATS',
    'MY_NEW_COMMAND',  // ← Add your command here
    // ...
  ],
};
```

---

## ✨ Testing Your Changes

After editing `languageDefinitions.ts`:

1. **Rebuild** the app:
   ```bash
   docker-compose down
   docker-compose up --build
   ```

2. **Test Edit Mode**:
   - Click "New Snippet" or edit existing snippet
   - Monaco editor should show your new keywords highlighted

3. **Test View Mode**:
   - View the snippet (not editing)
   - Preview card and full view should show same highlighting

4. **Both should match!** ✓

---

## 📋 Checklist

**For 90% of changes (just adding/removing keywords):**
- [ ] Edit `languageDefinitions.ts`
- [ ] Rebuild and test
- [ ] Done! ✓

**For complex changes (new syntax patterns):**
- [ ] Edit `languageDefinitions.ts` (if adding keywords)
- [ ] Edit Monaco file (`splunk.ts` / `elasticsearch.ts` / `fish.ts`)
- [ ] Edit `CustomSyntaxHighlighter.tsx` (`getPatterns` function)
- [ ] Rebuild and test both modes
- [ ] Verify highlighting matches between edit and view

---

## 💡 Pro Tips

1. **Keep it simple**: Only add keywords to `languageDefinitions.ts` unless you need special syntax
2. **Test both modes**: Always check edit mode and view mode look the same
3. **Comments first**: In both systems, comments are matched first to prevent internal highlighting
4. **Alphabetize**: Keep keyword lists alphabetized for easy maintenance
5. **Group by category**: Use comments to group related keywords (like "// String functions")

---

## ❓ Common Questions

**Q: I added a keyword but it's not highlighting?**
A: Make sure you rebuilt the Docker container. Changes require a rebuild.

**Q: Why do I need to edit tokenizer for special syntax?**
A: The tokenizer handles complex state-based patterns (like SPL subsearches `[...]`). Simple keywords use the shared definitions, complex syntax needs custom logic.

**Q: How do I change colors?**
A: Edit the theme definitions in Monaco files (`spl-theme-dark`, etc.) and CSS in `CustomSyntaxHighlighter.tsx`.

**Q: Can I add a completely new custom language?**
A: Yes! Follow the pattern of existing languages:
1. Add definition to `languageDefinitions.ts`
2. Create Monaco tokenizer file
3. Update `CustomSyntaxHighlighter.tsx` 
4. Add to `languageUtils.ts`

---

## 📚 More Info

See `ARCHITECTURE.md` in this directory for detailed technical analysis, design decisions, and implementation details.

---

## ✅ Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| **languageDefinitions.ts** | ✅ Complete | SSOT for all custom languages |
| **Monaco Integration** | ✅ Complete | splunk.ts, elasticsearch.ts, fish.ts import from SSOT |
| **View Mode Integration** | ✅ Complete | FullCodeBlock & PreviewCodeBlock use CustomSyntaxHighlighter |
| **Helper Functions** | ✅ Complete | isCustomLanguage() added to languageUtils.ts |
| **Documentation** | ✅ Complete | README.md and ARCHITECTURE.md |

**Last Updated**: November 1, 2025  
**Architecture**: Single Source of Truth (SSOT)  
**Maintenance**: Low - edit one file for all modes

