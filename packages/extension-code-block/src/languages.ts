export type LanguageItem = {
  name: string;
  value: string;
  alias?: string[];
};

export const languages = [
  { name: '普通文本', value: 'plaintext', alias: ['text', 'txt'] },
  { name: 'CSS', value: 'css', alias: [] },
  { name: 'Java', value: 'java', alias: ['jsp'] },
  {
    name: 'JavaScript',
    value: 'javascript',
    alias: ['js', 'jsx', 'mjs', 'cjs'],
  },
  { name: 'JSON', value: 'json', alias: [] },
  { name: 'SQL', value: 'sql', alias: [] },
  { name: 'TypeScript/Javascript', value: 'typescript', alias: ['ts', 'tsx'] },
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
