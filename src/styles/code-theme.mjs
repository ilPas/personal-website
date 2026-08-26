/**
 * Tema del codice, tarato sulla scena scura.
 *
 * Resta volutamente senza tinta: l'accento cambia con il mood, un tema
 * colorato litigherebbe con tre mood su quattro. I token si distinguono
 * per peso e corsivo, come nel resto della tipografia.
 */

export const codeTheme = {
  name: 'scena',
  type: 'dark',
  fg: '#c9cbd6',
  bg: '#0b0b0f',
  settings: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#5f6170', fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'storage.type', 'keyword.control', 'keyword.operator.new'], settings: { foreground: '#ffffff', fontStyle: 'bold' } },
    { scope: ['entity.name.tag', 'entity.name.function', 'support.function'], settings: { foreground: '#ecedf1', fontStyle: 'bold' } },
    { scope: ['string', 'string.quoted', 'punctuation.definition.string'], settings: { foreground: '#a8abba' } },
    { scope: ['constant.numeric', 'constant.language', 'constant.character'], settings: { foreground: '#a8abba' } },
    { scope: ['entity.other.attribute-name', 'support.type.property-name'], settings: { foreground: '#a8abba', fontStyle: 'italic' } },
    { scope: ['variable', 'variable.parameter', 'meta.definition.variable'], settings: { foreground: '#ecedf1' } },
    { scope: ['punctuation', 'keyword.operator', 'meta.brace'], settings: { foreground: '#6f7180' } },
    { scope: ['entity.name.type', 'support.class', 'support.type'], settings: { foreground: '#ecedf1' } },
    { scope: ['invalid'], settings: { foreground: '#ffffff', fontStyle: 'underline' } },
  ],
};
