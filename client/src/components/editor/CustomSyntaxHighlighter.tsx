import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { splunkDefinition, esqlDefinition, fishDefinition } from '../../utils/language/customLanguages/languageDefinitions';

interface CustomSyntaxHighlighterProps {
  code: string;
  language: 'spl' | 'esql' | 'fish';
  showLineNumbers?: boolean;
  customStyle?: React.CSSProperties;
}

/**
 * Simple regex-based syntax highlighter for custom languages (SPL, ESQL, Fish)
 * Matches the logic from Monaco Editor for consistency
 */
export const CustomSyntaxHighlighter: React.FC<CustomSyntaxHighlighterProps> = ({
  code,
  language,
  showLineNumbers = true,
  customStyle = {},
}) => {
  const { theme } = useTheme();
  const [effectiveTheme, setEffectiveTheme] = React.useState<'light' | 'dark'>(
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme
  );

  React.useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        setEffectiveTheme(mediaQuery.matches ? 'dark' : 'light');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      setEffectiveTheme(theme);
    }
  }, [theme]);

  const isDark = effectiveTheme === 'dark';
  const backgroundColor = isDark ? '#1E1E1E' : '#ffffff';

  const highlightLine = (line: string, lang: 'spl' | 'esql' | 'fish'): React.ReactNode => {
    // Check if line is a comment first (consume entire line)
    // User wants # as comments for all languages
    if (/^\s*#/.test(line)) {
      return <span className="token comment">{line}</span>;
    }

    const tokens: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;

    const patterns = getPatterns(lang);

    while (remaining.length > 0) {
      let matched = false;

      for (const [className, regex] of patterns) {
        const match = remaining.match(regex);
        if (match && match.index === 0) {
          tokens.push(
            <span key={key++} className={`token ${className}`}>
              {match[0]}
            </span>
          );
          remaining = remaining.slice(match[0].length);
          matched = true;
          break;
        }
      }

      if (!matched) {
        tokens.push(remaining[0]);
        remaining = remaining.slice(1);
        key++;
      }
    }

    return <>{tokens}</>;
  };

  const lines = code.split('\n');

  return (
    <pre
      className="custom-syntax-highlighter"
      style={{
        ...customStyle,
        backgroundColor,
        margin: 0,
        padding: '1rem',
        fontSize: '13px',
        lineHeight: '19px',
        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
        overflow: 'auto',
      }}
    >
      <style>
        {`
          .custom-syntax-highlighter .token.comment { color: ${isDark ? '#6A9955' : '#008000'}; font-style: italic; }
          .custom-syntax-highlighter .token.keyword { color: ${isDark ? '#569CD6' : '#0000FF'}; font-weight: bold; }
          .custom-syntax-highlighter .token.function { color: ${isDark ? '#DCDCAA' : '#795E26'}; }
          .custom-syntax-highlighter .token.string { color: ${isDark ? '#CE9178' : '#A31515'}; }
          .custom-syntax-highlighter .token.number { color: ${isDark ? '#B5CEA8' : '#098658'}; }
          .custom-syntax-highlighter .token.operator { color: ${isDark ? '#D4D4D4' : '#000000'}; }
          .custom-syntax-highlighter .token.variable { color: ${isDark ? '#9CDCFE' : '#001080'}; }
          .custom-syntax-highlighter .token.builtin { color: ${isDark ? '#4EC9B0' : '#267F99'}; }
          .custom-syntax-highlighter .token.pipe { color: ${isDark ? '#FF79C6' : '#AF00DB'}; font-weight: bold; }
          .custom-syntax-highlighter .line-number {
            display: inline-block;
            width: 3em;
            margin-right: 1em;
            text-align: right;
            color: ${isDark ? '#858585' : '#237893'};
            user-select: none;
          }
        `}
      </style>
      <code>
        {lines.map((line, i) => (
          <div key={i}>
            {showLineNumbers && <span className="line-number">{i + 1}</span>}
            {highlightLine(line, language)}
            {'\n'}
          </div>
        ))}
      </code>
    </pre>
  );
};

function getPatterns(lang: 'spl' | 'esql' | 'fish'): [string, RegExp][] {
  if (lang === 'spl') {
    // Build patterns from shared definition (case-insensitive for SPL)
    const keywordPattern = new RegExp(`^(${splunkDefinition.keywords.join('|')})\\b`, 'i');
    const builtinPattern = new RegExp(`^(${splunkDefinition.builtins.join('|')})\\b`, 'i');
    const functionPattern = new RegExp(`^(${splunkDefinition.functions.join('|')})(?=\\s*\\()`, 'i');
    const operatorPattern = new RegExp(`^(${splunkDefinition.operators.join('|')})\\b`, 'i');
    
    return [
      // Comments (``` triple backticks - # handled in highlightLine)
      ['comment', /^`{3}[\s\S]*?`{3}/],
      // Strings
      ['string', /^"(?:[^"\\]|\\.)*"/],
      ['string', /^'(?:[^'\\]|\\.)*'/],
      // Pipe
      ['pipe', /^\|/],
      // Commands (after checking for pipe/bracket context in highlightLine)
      ['keyword', keywordPattern],
      // Functions (followed by parenthesis)
      ['function', functionPattern],
      ['function', /^[a-zA-Z_]\w*(?=\s*\()/],
      // Builtins and operators
      ['builtin', builtinPattern],
      ['builtin', operatorPattern],
      // Numbers
      ['number', /^\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/],
      // Variables (before =)
      ['variable', /^[\w.]+(?=\s*=)/],
      // Operators
      ['operator', /^=/],
    ];
  } else if (lang === 'esql') {
    // Build patterns from shared definition
    const keywordPattern = new RegExp(`^(${esqlDefinition.keywords.join('|')})\\b`);
    const operatorPattern = new RegExp(`^(${esqlDefinition.operators.join('|')})\\b`);
    const constantPattern = new RegExp(`^(${esqlDefinition.constants.join('|')})\\b`);
    
    return [
      ['comment', /^\/\*[\s\S]*?\*\//],
      ['comment', /^\/\/.*/],
      ['comment', /^#.*/],
      ['string', /^"""[\s\S]*?"""/],
      ['string', /^"(?:[^"\\]|\\.)*"/],
      ['string', /^'(?:[^'\\]|\\.)*'/],
      ['pipe', /^\|/],
      ['keyword', keywordPattern],
      ['function', /^[A-Z_][A-Z0-9_]*(?=\s*\()/],
      ['constant', constantPattern],
      ['operator', operatorPattern],
      ['number', /^\d+[kmgtKMGT]b?\b/],
      ['number', /^\d+[smhd]\b/],
      ['number', /^0x[0-9a-fA-F]+\b/],
      ['number', /^\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/],
      ['operator', /^!=|^==|^>=|^<=|^<>|^=~|^!~|^&&|^\|\||^[+\-*/%=]/],
    ];
  } else { // fish
    // Build patterns from shared definition
    const keywordPattern = new RegExp(`^(${fishDefinition.keywords.join('|')})\\b`);
    const builtinPattern = new RegExp(`^(${fishDefinition.builtins.join('|')})\\b`);
    
    return [
      ['comment', /^#!.*/],
      ['comment', /^#.*/],
      ['string', /^"(?:[^"\\$]|\\.|\$(?:\w+|\{[^}]+\}))*"/],
      ['string', /^'(?:[^'\\]|\\.)*'/],
      ['variable', /^\$\w+\[[^\]]+\]/],
      ['variable', /^\$\$|\$(?:status|argv|history|HOME|PWD|USER|hostname|version|fish_pid)\b/],
      ['variable', /^\$\{[^}]+\}/],
      ['variable', /^\$\w+/],
      ['pipe', /^\|/],
      ['keyword', keywordPattern],
      ['builtin', builtinPattern],
      ['number', /^0x[0-9a-fA-F]+\b/],
      ['number', /^0o[0-7]+\b/],
      ['number', /^0b[01]+\b/],
      ['number', /^\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/],
      ['operator', /^>>?&?|^<&?|^&&|^\|\||^==|^!=|^<=?|^>=?|^[+\-*/%]/],
    ];
  }
}

