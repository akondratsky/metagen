import {
  AbstractNode,
  ConditionNode,
  ITextNode,
  InterpolationNode,
  IterationNode,
  NodesParser,
  TextNode,
  HbsFlagNode
} from './syntax';
import { Tree } from './Tree';
import type { JsonObject } from './json';
import { PayloadUtil } from './PayloadUtil';
import hbs from 'handlebars';
import { logger } from '../logger';

type Template = {
  filename: string;
  payload: JsonObject;
}

export class MetaTemplateCore {
  constructor(
    private readonly metaTemplate: Tree,
  ) {}

  private readonly nodesParser = new NodesParser();


  public renderTree(payload: JsonObject): Tree[] {
    if (this.metaTemplate.isDirectory) {
      const result: Tree[] = [];
      this.metaTemplate.children.forEach((child) => {
        result.push(...this.renderMetaTemplate(child, payload));
      });
      return result;
    }
    return this.renderMetaTemplate(this.metaTemplate, payload);
  }

  public renderJson(payload: JsonObject): Array<JsonObject> {
    return this.renderTree(payload).map(tree => tree.toJson());
  }

  private renderMetaTemplate(metaTemplate: Tree, metaPayload: JsonObject): Tree[] {
    logger.debug(`rendering meta template "${metaTemplate.name}"`);

    const result: Tree[] = [];
    const nodes = this.nodesParser.parse(metaTemplate.name);
    const isHbs = nodes.some(node => node instanceof HbsFlagNode);

    logger.debug(`handlebars templating ${isHbs ? 'enabled' : 'disabled'}`);
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
      const render = isHbs
        ? hbs.compile(metaTemplate.content)
        : () => metaTemplate.content;

      templates.forEach(({ filename, payload }) => {
        logger.debug(`rendering "${filename}" with payload ${JSON.stringify(payload)}`)
        const file = new Tree.File(filename);
        file.content = render(payload)
        result.push(file);
      });
    }

    return result;
  }

  private getTemplatesByNodes(nodes: AbstractNode[], payload: JsonObject): Template[] {
    let nodeIndex = 0;

    do {
      const node = nodes[nodeIndex];

      if (node instanceof HbsFlagNode) {
        nodes.splice(nodeIndex, 1);
        continue;
      }

      if (node instanceof IterationNode) {
        nodes.splice(nodeIndex, 1);
        const payloads = PayloadUtil.getPayloads(payload, node.iterator);
        const templates: Template[] = [];

        payloads.forEach((currentPayload) => {
          if (typeof currentPayload === 'object') {
            const templatePayload = PayloadUtil.merge(payload, currentPayload as JsonObject);
            templates.push(...this.getTemplatesByNodes([...nodes], templatePayload));
          } else {
            const currentNode = new TextNode(String(currentPayload));
            templates.push(...this.getTemplatesByNodes([currentNode, ...nodes], payload));
          }
        });

        return templates;
      }

      if (node instanceof ConditionNode) {
        nodes.splice(nodeIndex, 1);
        if (node.checkCondition(payload)) {
          return this.getTemplatesByNodes([...nodes], payload);
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
    } while (nodeIndex < nodes.length);

    const filename = (nodes as ITextNode[])
      .map(({ text }) => text)
      .join('');

    logger.debug(`- "${filename}" with payload "${JSON.stringify(payload)}"`)
    return [{ filename, payload }];
  }
}