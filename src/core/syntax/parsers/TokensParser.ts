export class TokensParser {
  /**
   * Parses meta template name and finds expression tokens in it, returns array of text and expression tokens
   * @param {string} name Meta template name
   */
  public parse(name: string): Array<{ token: string, isExpression: boolean }> {
    const SINGLE_OPEN = '\\{';
    const SINGLE_CLOSE = '\\}';
    const DOUBLE_OPEN = '\\{\\{';
    const DOUBLE_CLOSE = '\\}\\}';
    const TEXT_SYMBOLS = '[^\\{\\}]+';
    const EXPRESSION = '(' + SINGLE_OPEN + TEXT_SYMBOLS + '[' + SINGLE_CLOSE + '])';
    const TEXT = '(' + TEXT_SYMBOLS + '|' + DOUBLE_OPEN + '|' + DOUBLE_CLOSE + ')+';
    const LEXIS = EXPRESSION + '|' + TEXT + '|' + SINGLE_OPEN + '|' + SINGLE_CLOSE;
    const EXPRESSION_REGEX = '^' + EXPRESSION + '$';

    const lexisRegex = new RegExp(LEXIS, 'g');
    const unpairedTokenRegex = new RegExp('^(' + SINGLE_OPEN + '|' + SINGLE_CLOSE + ')$');

    const tokens = name.match(lexisRegex);

    if (!tokens || !tokens.length) {
      throw new Error('Invalid argument');
    }

    const result = tokens.map((token) => {
      if (unpairedTokenRegex.test(token)) {
        throw new Error(`Unpaired token has been met: "${name}"`);
      }

      const isExpression = new RegExp(EXPRESSION_REGEX, 'g').test(token);

      return {
        token: isExpression
          ? token.substring(1, token.length - 1)
          : token.replaceAll('{{', '{').replaceAll('}}', '}'),
        isExpression,
      };
    });

    return result;
  }
}