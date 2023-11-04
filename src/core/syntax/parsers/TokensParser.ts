import { logger } from '../../../logger';

export class TokensParser {
  /**
   * Parses meta template name and finds expression tokens in it, returns array of text and expression tokens
   * @param {string} name Meta template name
   */
  public parse(name: string): { token: string, isExpression: boolean }[] {
    logger.debug(`parsing name for tokens: "${name}"`);

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
      logger.error(`No tokens parsed in the name: "${name}"`);
      throw new Error('Invalid argument');
    }

    const result = tokens.map((token) => {
      if (unpairedTokenRegex.test(token)) {
        logger.error(`Unpaired token has been met in the name: "${name}"`);
        throw new Error(`Unpaired token has been met in the name: "${name}"`);
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
