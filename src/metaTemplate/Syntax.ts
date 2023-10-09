import { AbstractNode, ConditionNode, InterpolationNode, IterationNode, TextNode } from '~/syntaxNodes';

export class Syntax {
  public static parseNameTokens(name: string): Array<{ token: string, isExpression: boolean }> {
    const SINGLE_OPEN = '\\{';
    const SINGLE_CLOSE = '\\}';
    const TEXT_SYMBOLS = '[^\\}\\{]+';
    const DOUBLE_OPEN = '\\{\\{';
    const DOUBLE_CLOSE = '\\}\\}';
    const EXPRESSION = '(' + SINGLE_OPEN + TEXT_SYMBOLS + SINGLE_CLOSE + ')';
    const TEXT = '(' + TEXT_SYMBOLS + '|' + DOUBLE_OPEN + '|' + DOUBLE_CLOSE + ')+';
    const LEXIS = EXPRESSION + '|' + TEXT + '|' + SINGLE_OPEN + '|' + SINGLE_CLOSE;

    const lexisRegex = new RegExp(LEXIS, 'g');
    const expressionRegex = new RegExp(EXPRESSION, 'g');
    const unpairedTokenRegex = new RegExp('^(' + SINGLE_OPEN + '|' + SINGLE_CLOSE + ')$');

    const tokens = name.match(lexisRegex);

    if (!tokens || !tokens.length) {
      throw new Error('Invalid argument');
    }

    const result = tokens.map((token) => {
      if (unpairedTokenRegex.test(token)) {
        throw new Error('');
      }

      const isExpression = expressionRegex.test(token);
      return {
        token: isExpression
          ? token.substring(1, token.length - 1)
          : token.replaceAll('{{', '{').replaceAll('}}', '}'),
        isExpression,
      };
    });

    return result;
  }

  /** parses meta template name and returns array of syntax nodes */
  public static parseName(name: string): AbstractNode[] {
    return Syntax.parseNameTokens(name).map(({ token, isExpression }) => {
      if (!isExpression) {
        return new TextNode(token);
      }

      const isValid = /^( )*(#(if|each)( )+)?[a-z](\.?[a-z0-9])*( )*$/.test(token);
      if (!isValid) {
        // TODO: more detailed error
        throw new Error(`Invalid token: "${token}"`);
      }

      const statement = token.trim().replace(/ +/g, ' ').split(' ');

      if (statement.length === 1) {
        return new InterpolationNode(statement[0]);
      }

      const [operator, path] = statement;
      if (operator === '#if') {
        return new ConditionNode(path);
      }
      if (operator === '#each') {
        return new IterationNode(path);
      }

      // TODO: more detailed error
      throw new Error(`Unhandled error during token processing: "${token}"`);
    });
  }
}