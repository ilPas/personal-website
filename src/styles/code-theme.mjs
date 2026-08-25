/**
 * Tema neutro per l'evidenziazione del codice.
 *
 * PLACEHOLDER, coerente con il resto: finché non c'è una direzione visiva
 * il codice resta in scala di grigi e distingue i token con peso e corsivo
 * invece che con la tinta. Da rivedere insieme alla palette.
 */

const scopes = (fg, dim, faint) => [
  { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: faint, fontStyle: 'italic' } },
  { scope: ['keyword', 'storage', 'storage.type', 'keyword.control', 'keyword.operator.new'], settings: { foreground: fg, fontStyle: 'bold' } },
  { scope: ['entity.name.tag', 'entity.name.function', 'support.function'], settings: { foreground: fg, fontStyle: 'bold' } },
  { scope: ['string', 'string.quoted', 'punctuation.definition.string'], settings: { foreground: dim } },
  { scope: ['constant.numeric', 'constant.language', 'constant.character'], settings: { foreground: dim } },
  { scope: ['entity.other.attribute-name', 'support.type.property-name'], settings: { foreground: dim, fontStyle: 'italic' } },
  { scope: ['variable', 'variable.parameter', 'meta.definition.variable'], settings: { foreground: fg } },
  { scope: ['punctuation', 'keyword.operator', 'meta.brace'], settings: { foreground: faint } },
  { scope: ['entity.name.type', 'support.class', 'support.type'], settings: { foreground: fg } },
  { scope: ['invalid'], settings: { foreground: fg, fontStyle: 'underline' } },
];

export const codeThemeLight = {
  name: 'neutro-chiaro',
  type: 'light',
  fg: '#1f1f1f',
  bg: '#f6f6f6',
  settings: scopes('#111111', '#3f3f3f', '#767676'),
};

export const codeThemeDark = {
  name: 'neutro-scuro',
  type: 'dark',
  fg: '#e6e6e6',
  bg: '#151515',
  settings: scopes('#fafafa', '#c2c2c2', '#8a8a8a'),
};
