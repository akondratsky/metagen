import { inject, injectable } from 'tsyringe';
import { AbstractNode, ConditionNode, InterpolationNode, IterationNode, TextNode } from '~/syntaxNodes';
import { TokensParser } from './TokensParser';

@injectable()
export class NodesParser {
  constructor(
    @inject(TokensParser) private readonly tokensParser: TokensParser,
  ) { }

  /** parses meta template name and returns array of syntax nodes */
  public parse(name: string): AbstractNode[] {
    return this.tokensParser.parse(name).map(({ token, isExpression }) => {
      if (!isExpression) {
        return new TextNode(token);
      }

      const isValid = /^( )*(#(include|each)( )+)?[a-z](\.?[a-z0-9])*( )*$/i.test(token);
      if (!isValid) {
        throw new Error(`Invalid token "${token}" in template name "${name}"`);
      }

      const statement = token.trim().replace(/ +/g, ' ').split(' ');

      if (statement.length === 1) {
        return new InterpolationNode(statement[0]);
      }

      const [operator, path] = statement;
      if (operator === '#include') {
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