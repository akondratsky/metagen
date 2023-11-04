import {
  AbstractNode,
  ConditionNode,
  ITextNode,
  InterpolationNode,
  IterationNode,
  NodesParser,
  TextNode,
  TemplatingFlagNode,
} from './syntax';
import { Tree } from './Tree';
import type { PayloadObject } from './Payload';
import { PayloadUtil } from './PayloadUtil';
import hbs from 'handlebars';
import { logger } from '../logger';
import { TreeConverter } from './TreeConverter';
import type { TreeObject } from './TreeObject';

type Template = {
  filename: string;
  payload: PayloadObject;
};

type RenderMethod = (payload: PayloadObject) => Buffer;

/**
 * Renders Tree objects with payload
 */
export class MetaTemplateCore {
  constructor(
    private readonly metaTemplate: Tree,
  ) {}

  private readonly nodesParser = new NodesParser();
  private readonly treeConverter = new TreeConverter();


  public renderTree(payload: PayloadObject): Tree[] {
    if (this.metaTemplate.isDirectory) {
      const result: Tree[] = [];
      this.metaTemplate.children.forEach((child) => {
        result.push(...this.renderMetaTemplate(child, payload));
      });
      return result;
    }
    return this.renderMetaTemplate(this.metaTemplate, payload);
  }

  public renderObject(payload: PayloadObject): TreeObject[] {
    return this.treeConverter.toObject(
      this.renderTree(payload),
    );
  }

  private renderMetaTemplate(metaTemplate: Tree, metaPayload: PayloadObject): Tree[] {
    logger.debug(`rendering meta template "${metaTemplate.name}"`);

    const result: Tree[] = [];
    const nodes = this.nodesParser.parse(metaTemplate.name);

    logger.debug(`generating template instances for meta template "${metaTemplate.name}":`);
    const templates = this.getTemplatesByNodes(nodes, metaPayload);

    if (metaTemplate.isDirectory) {
      logger.debug(`meta template "${metaTemplate.name}" is a directory, iterating children...`);
      templates.forEach(({ filename, payload }) => {
        const directory = new Tree.Directory(filename);
        metaTemplate.children.forEach((childMetaTemplate) => {
          logger.debug(`"${metaTemplate.name}" meta template, child found: "${childMetaTemplate.name}"`);
          directory.children.push(
            ...this.renderMetaTemplate(childMetaTemplate, payload),
          );
        });
        result.push(directory);
      });
    } else {
      logger.debug(`meta template "${metaTemplate.name}" is a file, rendering...`);
      const render = this.getRenderMethod(metaTemplate, [...nodes]);

      templates.forEach(({ filename, payload }) => {
        logger.debug(`rendering "${filename}" with payload ${JSON.stringify(payload)}`);
        const file = new Tree.File(filename);
        file.content = render(payload);
        result.push(file);
      });
    }

    return result;
  }

  /**
   * Get method (use handlebars or copy) to render template content
   */
  private getRenderMethod(metaTemplate: Tree, nodes: AbstractNode[]): RenderMethod {
    const templatingFlagNode = nodes.find(node => node instanceof TemplatingFlagNode) as TemplatingFlagNode;

    const isCopy = Boolean(templatingFlagNode && !templatingFlagNode.useHbs);

    logger.debug(`handlebars templating ${isCopy ? 'disabled' : 'enabled'}`);

    if (isCopy) {
      return () => metaTemplate.content;
    }

    const renderTemplate = hbs.compile(metaTemplate.content.toString());

    return (payload: PayloadObject) => Buffer.from(renderTemplate(payload));
  }

  /**
   * Get number of instances for some meta template with some payload
   */
  private getTemplatesByNodes(nodes: AbstractNode[], payload: PayloadObject): Template[] {
    let nodeIndex = 0;

    // this list mutates in this method, copying it:
    const nodesList = [...nodes];

    do {
      const node = nodesList[nodeIndex];

      if (node instanceof TemplatingFlagNode) {
        nodesList.splice(nodeIndex, 1);
        continue;
      }

      if (node instanceof IterationNode) {
        nodesList.splice(nodeIndex, 1);
        const payloads = PayloadUtil.getPayloads(payload, node.iterator);
        const templates: Template[] = [];

        payloads.forEach((currentPayload) => {
          if (typeof currentPayload === 'object') {
            // render #each instance separately according to the payload
            const templatePayload = PayloadUtil.merge(payload, currentPayload as PayloadObject);
            templates.push(...this.getTemplatesByNodes(nodesList, templatePayload));
          } else {
            // replace with text node from array
            const textNode = new TextNode(String(currentPayload));
            templates.push(...this.getTemplatesByNodes([textNode, ...nodesList], payload));
          }
        });

        return templates;
      }

      if (node instanceof ConditionNode) {
        nodesList.splice(nodeIndex, 1);
        if (node.checkCondition(payload)) {
          return this.getTemplatesByNodes(nodesList, payload);
        } else {
          return [];
        }
      }

      if (node instanceof InterpolationNode) {
        node.interpolate(payload);
      }

      // TextNode does not require special action

      nodeIndex++;
      continue;
    } while (nodeIndex < nodesList.length);

    const filename = (nodesList as ITextNode[])
      .map(({ text }) => text)
      .join('');

    logger.debug(`- "${filename}" with payload "${JSON.stringify(payload)}"`);
    return [{ filename, payload }];
  }
}
