import { AbstractNode, ConditionNode, InterpolationNode, IterationNode, TextNode } from '..';
import { TokensParser } from './TokensParser';

export class NodesParser {
  private readonly tokensParser = new TokensParser();

  /** parses meta template name and returns array of syntax nodes */
  public parse(name: string): AbstractNode[] {
    return this.tokensParser.parse(name).map(({ token, isExpression }) => {
      if (!isExpression) {
        return new TextNode(token);
      }

      const KEYWORD = '#(includeif|each)';
      const VAR_NAME = '[a-z]{1}[a-z0-9]*';
      const INDEX = '(\\[[0-9]+\\])';
      const VARIABLE = `${VAR_NAME}(${INDEX}|(\\.${VAR_NAME}))*`;
      const VALIDATION_REGEX = `^( )*(${KEYWORD}( )+)?${VARIABLE}( )*$`;

      const isValid = new RegExp(VALIDATION_REGEX, 'i').test(token);
      
      if (!isValid) {
        throw new Error(`Invalid token "${token}" in template name "${name}"`);
      }

      const statement = token.trim().replace(/ +/g, ' ').split(' ');

      if (statement.length === 1) {
        return new InterpolationNode(statement[0]);
      }

      const [operator, path] = statement;
      if (operator === '#includeif') {
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