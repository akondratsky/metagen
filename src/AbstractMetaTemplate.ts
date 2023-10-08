import { Payload } from '~/Payload';
import {
  AbstractNode,
  ConditionNode,
  ITextNode,
  InterpolationNode,
  IterationNode,
  TextNode
} from '~/nodes';
import { MetaTemplateInstance } from '~/MetaTemplateInstance';

/**
 * Meta template is a file with a special name, which is used to create one or multiple files
 * according to the MetaGen syntax.
 */
export class AbstractMetaTemplate {
  constructor(
    /** current template (file or folder) name */
    private name: string,
    /** root payload for this meta template */
    private payload: Payload,
  ) {}

  private parseName(): AbstractNode[] {
    return this.parseNameTokens().map(({ token, isExpression }) => {
      const isValid = /^( )*(#(if|each)( )+)?[a-z](\.?[a-z0-9])*( )*$/.test(token);
      if (!isValid) {
        // TODO: more detailed error
        throw new Error(`Invalid token: "${token}"`);
      }

      if (!isExpression) {
        return new TextNode(token);
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


  /** Returns number of particular templates for this meta template: name and payload */
  private getInstances(nodes: AbstractNode[], payload: Payload): MetaTemplateInstance[] {
    let nodeIndex = 0;

    do {
      const node = nodes[nodeIndex];

      if (node instanceof IterationNode) {
        nodes.splice(nodeIndex, 1);
        const payloads = payload.getList(node.iterator);
        return payloads.reduce((templates, currPayload) => {
          templates.push(...this.getInstances(nodes, currPayload))
          return templates;
        }, [] as MetaTemplateInstance[]);
      }

      if (node instanceof ConditionNode) {
        nodes.splice(nodeIndex, 1);
        if (node.checkCondition(payload)) {
          return this.getInstances(nodes, payload);
        }
      }

      if (node instanceof InterpolationNode) {
        node.interpolate(payload);
      }

      // TextNode does not require special action
      
      nodeIndex++;
      continue;
    } while (nodeIndex < nodes.length);

    const templateName = (nodes as ITextNode[])
      .map(({ text }) => text)
      .join('');

    return [new MetaTemplateInstance(templateName, payload)];
  }

  private parseNameTokens(): Array<{ token: string, isExpression: boolean }> {
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

    const tokens = this.name.match(lexisRegex);

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
}