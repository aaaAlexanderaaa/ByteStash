# Syntax Highlighting Fix for Custom Languages

## Problem

Custom languages (Splunk SPL, Elasticsearch, Fish Shell) had syntax highlighting working in **edit mode** but NOT in **view mode**.

## Root Cause

ByteStash uses two different syntax highlighting systems:

1. **Monaco Editor** (edit mode) - Supports custom language definitions via Monarch
2. **Prism** via react-syntax-highlighter (view mode) - Does NOT support custom Monaco languages

When custom languages like `spl`, `esql`, and `fish` were registered with Monaco, they worked in edit mode. However, in view mode, Prism didn't recognize these custom language IDs and fell back to plain text (no highlighting).

## Solution

Created a new helper function `getPrismLanguage()` that maps custom Monaco languages to appropriate Prism fallback languages:

- `spl` (Splunk) → `javascript` (similar syntax structure)
- `esql` (Elasticsearch) → `sql` (query language)
- `fish` (Fish Shell) → `bash` (shell scripting)

## Files Modified

### 1. `client/src/utils/language/languageUtils.ts`
- Added `getPrismLanguage()` function to handle custom language mapping

### 2. View Mode Components (use Prism)
Updated to use `getPrismLanguage()` instead of `getMonacoLanguage()`:
- `client/src/components/editor/FullCodeBlock.tsx`
- `client/src/components/editor/PreviewCodeBlock.tsx`
- `client/src/components/snippets/embed/EmbedCodeView.tsx`

### 3. Edit Mode Components (use Monaco)
No changes needed - already working correctly:
- `client/src/components/editor/CodeEditor.tsx`

## Testing

1. Start the application: `docker-compose up -d --build`
2. Create a snippet with language `spl`, `splunk`, `esql`, or `fish`
3. Verify syntax highlighting works in both:
   - Edit mode (Monaco) - Full custom syntax highlighting
   - View mode (Prism) - Fallback syntax highlighting (JavaScript/SQL/Bash)

## Trade-offs

While this provides basic syntax highlighting in view mode, it's not as accurate as the Monaco custom definitions. Future improvements could include:

1. **Option 1**: Create custom Prism language definitions (more work, better accuracy)
2. **Option 2**: Use Monaco for view mode as well (heavier, but consistent)
3. **Option 3**: Keep current approach (good enough for most use cases)

The current solution (Option 3) provides the best balance of effort vs. benefit.

## Application URLs

- Main App: http://localhost:5001
- Username: `admin123`
- Password: `admin123`

