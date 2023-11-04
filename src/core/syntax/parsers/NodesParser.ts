import { logger } from '../../../logger';
import { AbstractNode, ConditionNode, InterpolationNode, IterationNode, TextNode } from '..';
import { TemplatingFlagNode } from '../nodes/TemplatingFlagNode';
import { TokensParser } from './TokensParser';

export class NodesParser {
  private readonly tokensParser = new TokensParser();

  private validationError(name: string, token: string) {
    const message = `Invalid token "${token}" in template name "${name}"`
    logger.error(message);
    return new Error(message);
  }

  /** parses meta template name and returns array of syntax nodes */
  public parse(name: string): AbstractNode[] {
    return this.tokensParser.parse(name).map(({ token, isExpression }) => {
      logger.debug(`mapping token to a node: "${token}"`)

      if (!isExpression) {
        return new TextNode(token);
      }

      const OPERATOR = '#(includeif|each)';
      const VAR_NAME = '[a-z]{1}[a-z0-9]*';
      const INDEX = '(\\[[0-9]+\\])';
      const VARIABLE = `${VAR_NAME}(${INDEX}|(\\.${VAR_NAME}))*`;
      const EXPRESSION = `(${OPERATOR}( )+)?${VARIABLE}`;
      const KEYWORD = '#copy';
      // can start and end with spaces
      const VALIDATION_REGEX = `^( )*(${KEYWORD}|${EXPRESSION})( )*$`;

      const isValid = new RegExp(VALIDATION_REGEX, 'i').test(token);
      if (!isValid) {
        throw this.validationError(name, token);
      }

      const statement = token.trim().replace(/ +/g, ' ').split(' ');

      if (statement.length === 1) {
        if (statement[0] === '#copy') {
          return new TemplatingFlagNode();
        }
        return new InterpolationNode(statement[0]);
      }

      const [operator, path] = statement;
      if (operator === '#includeif') {
        return new ConditionNode(path);
      }
      if (operator === '#each') {
        return new IterationNode(path);
      }

      throw this.validationError(name, token);
    });
  }
}
