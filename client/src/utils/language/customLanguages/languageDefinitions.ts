/**
 * Shared language definitions for custom languages
 * 
 * This is the SINGLE SOURCE OF TRUTH for keywords, functions, operators, etc.
 * Both Monaco Editor (edit mode) and CustomSyntaxHighlighter (view mode) use these.
 * 
 * TO MODIFY HIGHLIGHTING: Just edit the arrays below!
 */

// ============================================================================
// SPLUNK SPL (Search Processing Language)
// ============================================================================

export const splunkDefinition = {
  // Transforming search commands (highlighted as keywords)
  keywords: [
    // Core search commands
    'search', 'where', 'table', 'fields', 'rename', 'sort', 'head', 'tail', 'dedup',
    'return', 'format', 'rex', 'erex', 'extract', 'kvform', 'multikv', 'xmlkv', 'spath',
    
    // Statistical commands
    'stats', 'chart', 'timechart', 'streamstats', 'eventstats', 'sistats', 'sitimechart',
    'sichart', 'top', 'rare', 'sirare', 'sitop', 'contingency', 'correlate',
    
    // Grouping & time
    'bin', 'bucket', 'autoregress', 'delta', 'accum', 'streamstats',
    
    // Multivalue
    'makemv', 'mvexpand', 'mvzip', 'mvcombine', 'nomv',
    
    // Lookup & join
    'lookup', 'inputlookup', 'outputlookup', 'join', 'append', 'appendcols', 'appendpipe',
    'selfjoin', 'set', 'diff', 'union',
    
    // Subsearch & control
    'map', 'foreach', 'return', 'format',
    
    // Filling & formatting
    'fillnull', 'filldown', 'makecontinuous', 'untable', 'xyseries', 'transpose',
    
    // Advanced analytics
    'predict', 'x11', 'trendline', 'outlier', 'cluster', 'kmeans', 'anomalies',
    'anomalydetection', 'anomalousvalue',
    
    // Transforming
    'convert', 'eval', 'replace', 'addinfo', 'addtotals', 'addcoltotals',
    
    // Geo & time
    'geostats', 'geom', 'iplocation', 'localize', 'reltime', 'gentimes', 'timewrap',
    
    // Other commands
    'collect', 'overlap', 'transaction', 'metadata', 'typelearner', 'typer',
    'rest', 'savedsearch', 'script', 'crawl', 'fieldformat', 'gauge',
    'makeresults', 'sendemail'
  ],

  // Built-in modifiers and clause keywords
  builtins: [
    'as', 'by', 'over', 'span', 'limit', 'useother', 'usenull', 'otherstr',
    'cont', 'bins', 'start', 'end', 'aligntime', 'dedup_splitvals',
    'allnum', 'sep', 'delim', 'keepevents', 'maxsuppress', 'maxpause',
    'maxspan', 'startswith', 'endswith', 'maxevents', 'unroll'
  ],

  // Field names (common)
  commonFields: [
    'index', 'source', 'sourcetype', 'host', '_time', '_raw', '_indextime',
    'splunk_server', 'tag', 'eventtype', 'linecount', 'punct', 'timestartpos',
    'timeendpos', 'date_hour', 'date_mday', 'date_minute', 'date_month',
    'date_second', 'date_wday', 'date_year', 'date_zone'
  ],

  // Logical operators (word form)
  operators: [
    'AND', 'OR', 'NOT', 'XOR'
  ],

  // Comparison operators
  comparisonOperators: [
    'IN', 'LIKE'
  ],

  // Statistical and evaluation functions (all lowercase for SPL convention)
  functions: [
    // Aggregate/Stats functions
    'avg', 'c', 'count', 'dc', 'distinct_count', 'earliest', 'earliest_time',
    'estdc', 'estdc_error', 'exactperc', 'first', 'last', 'latest',
    'latest_time', 'list', 'max', 'mean', 'median', 'min', 'mode',
    'perc', 'percentile', 'range', 'rate', 'stdev', 'stdevp', 'sum',
    'sumsq', 'upperperc', 'values', 'var', 'varp', 'per_day', 'per_hour',
    'per_minute', 'per_second',
    
    // String/Text functions
    'substr', 'len', 'lower', 'upper', 'trim', 'ltrim', 'rtrim', 'replace',
    'split', 'spath', 'urldecode', 'tostring', 'printf', 'tonumber', 'md5',
    'sha1', 'sha256', 'sha512', 'json_object', 'json_array', 'json_extract',
    'json_extract_exact', 'mvzip', 'mvjoin', 'mvindex', 'mvcount', 'mvfilter',
    'mvappend', 'mvdedup', 'mvsort', 'mvfind', 'mvrange',
    
    // Time functions
    'now', 'time', 'relative_time', 'strftime', 'strptime',
    
    // Math functions
    'abs', 'ceil', 'floor', 'round', 'sqrt', 'exp', 'ln', 'log', 'pow',
    'exact', 'random', 'sigfig', 'pi', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
    'atan2', 'cosh', 'sinh', 'tanh', 'hypot', 'degrees', 'radians',
    
    // Eval/Conditional functions
    'if', 'case', 'match', 'like', 'searchmatch', 'cidrmatch', 'validate',
    'commands', 'typeof', 'isnull', 'isnotnull', 'isnum', 'isint', 'isstr',
    'isbool', 'coalesce', 'null', 'nullif', 'true', 'false', 'tonum', 'tobool',
    
    // Multi-value aggregation
    'mv_to_json_array', 'mvmap'
  ],

  // Time modifiers (for search time range)
  timeModifiers: [
    'earliest', 'latest', 'starttime', 'endtime', 'startdaysago', 'enddaysago',
    'startminutesago', 'endminutesago', 'starthoursago', 'endhoursago',
    'startmonthsago', 'endmonthsago', 'starttimeu', 'endtimeu'
  ],
};

// ============================================================================
// ELASTICSEARCH ES|QL
// ============================================================================

export const esqlDefinition = {
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
    'AND', 'OR', 'NOT', 'IN', 'LIKE', 'RLIKE', 'IS', 'IS NOT'
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
};

// ============================================================================
// FISH SHELL
// ============================================================================

export const fishDefinition = {
  // Fish keywords and control structures
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
    'fish_clipboard_copy', 'fish_clipboard_paste', 'fish_git_prompt', 'fish_hg_prompt',
    'fish_vcs_prompt', 'fish_svn_prompt', 'fish_is_root_user', 'fish_delta', 'fish_title',
    
    // Process
    'kill', 'killall', 'pgrep', 'pkill', 'ps',
    
    // File operations
    'ls', 'cat', 'cp', 'mv', 'rm', 'mkdir', 'rmdir', 'touch', 'chmod', 'chown',
    
    // Text processing
    'grep', 'sed', 'awk', 'cut', 'sort', 'uniq', 'head', 'tail', 'wc', 'tr',
    
    // Other common commands
    'find', 'which', 'whereis', 'file', 'realpath', 'basename', 'dirname', 'emit'
  ],

  // Set scopes/flags
  setScopes: [
    '-l', '--local', '-g', '--global', '-U', '--universal', '-x', '--export',
    '-u', '--unexport', '-e', '--erase', '-q', '--query', '-n', '--names',
    '-S', '--show', '-L', '--long', '-a', '--append', '-p', '--prepend',
    '--path', '--unpath'
  ],

  // Test operators (used with 'test' or '[')
  testOperators: [
    '-a', '-b', '-c', '-d', '-e', '-f', '-g', '-h', '-k', '-p', '-r', '-s',
    '-t', '-u', '-w', '-x', '-L', '-O', '-G', '-N', '-S',
    '-eq', '-ne', '-lt', '-le', '-gt', '-ge',
    '-nt', '-ot', '-ef',
    '-z', '-n'
  ],
};

/**
 * Helper function to create regex pattern from keyword array
 * Escapes special regex characters and creates word boundary pattern
 */
export function keywordsToRegex(keywords: string[]): RegExp {
  const escaped = keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`\\b(${escaped.join('|')})\\b`);
}

/**
 * Helper function to create case-insensitive regex
 */
export function keywordsToRegexCaseInsensitive(keywords: string[]): RegExp {
  const escaped = keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`\\b(${escaped.join('|')})\\b`, 'i');
}

