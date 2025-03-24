export type LanguageItem = {
  name: string;
  value: string;
  alias?: string[];
};

export const languages = [
  { name: '普通文本', value: 'plaintext', alias: ['text', 'txt'] },
  { name: 'AppleScript', value: 'applescript', alias: ['osascript'] },
  { name: 'Bash', value: 'bash', alias: ['sh'] },
  { name: 'C', value: 'c', alias: ['h'] },
  {
    name: 'C++',
    value: 'cpp',
    alias: ['cc', 'c++', 'h++', 'hpp', 'hh', 'hxx', 'cxx'],
  },
  { name: 'C#', value: 'csharp', alias: ['cs', 'c#'] },
  { name: 'CSS', value: 'css', alias: [] },
  { name: 'Dart', value: 'dart', alias: [] },
  { name: 'Diff', value: 'diff', alias: ['patch'] },
  { name: 'Django', value: 'django', alias: ['jinja'] },
  { name: 'Erlang', value: 'erlang', alias: ['erl'] },
  { name: 'Erlang REPL', value: 'erlang-repl', alias: [] },
  { name: 'Excel formulae', value: 'excel', alias: ['xlsx', 'xls'] },
  { name: 'Go', value: 'go', alias: ['golang'] },
  { name: 'Golo', value: 'golo', alias: [] },
  { name: 'Gradle', value: 'gradle', alias: [] },
  { name: 'Java', value: 'java', alias: ['jsp'] },
  {
    name: 'JavaScript',
    value: 'javascript',
    alias: ['js', 'jsx', 'mjs', 'cjs'],
  },
  { name: 'JSON', value: 'json', alias: [] },
  { name: 'Kotlin', value: 'kotlin', alias: ['kt', 'kts'] },
  { name: 'LaTeX', value: 'latex', alias: ['tex'] },
  { name: 'Lua', value: 'lua', alias: [] },
  { name: 'Markdown', value: 'markdown', alias: ['md', 'mkdown', 'mkd'] },
  { name: 'Nginx', value: 'nginx', alias: ['nginxconf'] },
  {
    name: 'Objective-C',
    value: 'objectivec',
    alias: ['mm', 'objc', 'obj-c', 'obj-c++', 'objective-c++'],
  },
  { name: 'Perl', value: 'perl', alias: ['pl', 'pm'] },
  { name: 'PostgreSQL', value: 'pgsql', alias: ['postgres', 'postgresql'] },
  { name: 'PHP', value: 'php', alias: ['php'] },
  { name: 'Python profiler', value: 'profile', alias: [] },
  { name: 'Python', value: 'python', alias: ['py', 'gyp', 'ipython'] },
  { name: 'Python REPL', value: 'python-repl', alias: ['pycon'] },
  {
    name: 'Ruby',
    value: 'ruby',
    alias: ['rb', 'gemspec', 'podspec', 'thor', 'irb'],
  },
  { name: 'Oracle Rules Language', value: 'ruleslanguage', alias: [] },
  { name: 'Rust', value: 'rust', alias: ['rs'] },
  { name: 'Scala', value: 'scala', alias: [] },
  { name: 'SCSS', value: 'scss', alias: [] },
  { name: 'SQL', value: 'sql', alias: [] },
  { name: 'Swift', value: 'swift', alias: [] },
  { name: 'TypeScript', value: 'typescript', alias: ['ts', 'tsx'] },
  {
    name: 'HTML, XML',
    value: 'xml',
    alias: [
      'html',
      'xhtml',
      'rss',
      'atom',
      'xjb',
      'xsd',
      'xsl',
      'plist',
      'wsf',
      'svg',
    ],
  },
  { name: 'YAML', value: 'yaml', alias: ['yml'] },
  { name: 'Zephir', value: 'zephir', alias: ['zep'] },
];

export const getLanguageByValueOrAlias = (
  valueOrAlias: string,
): LanguageItem | null => {
  if (!valueOrAlias) {
    return null;
  }
  const v = valueOrAlias.toLocaleLowerCase();
  return languages.find(
    language => language.value === v || language.alias.includes(v),
  );
};

export const getLanguageByValue = (value: string): LanguageItem | null => {
  if (!value) {
    return null;
  }
  return languages.find(language => language.value === value);
};
