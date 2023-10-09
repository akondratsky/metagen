import { Payload } from '~/payload';
import {
  AbstractNode,
  ConditionNode,
  ITextNode,
  InterpolationNode,
  IterationNode,
  TextNode
} from '~/syntaxNodes';
import { IFileTreeNode } from '~/fileTree';
import { MetaTemplateInstance } from './MetaTemplateInstance';
import { container, inject } from 'tsyringe';
import { NodesParser } from './syntax/NodesParser';

/**
 * Meta template is a file with a special name, which is used to create one or multiple files
 * according to the MetaGen syntax.
 */
export abstract class AbstractMetaTemplate {
  constructor(
    /** parent folder for this meta template */
    protected folder: string,
    /** current meta template (file or folder) name */
    protected name: string,
    /** root payload for this meta template */
    private payload: Payload,
  ) {}

  private readonly nodesParser = container.resolve(NodesParser);

  abstract render(): IFileTreeNode | IFileTreeNode[];

  /** Returns list of particular templates for this meta template: name and payload */
  protected getInstances() {
    const nodes = this.nodesParser.parse(this.name);
    return this.getInstancesFromNodes(nodes, this.payload);
  }

  /** recursively goes through list of nodes and creates list of meta template instances */
  private getInstancesFromNodes(nodes: AbstractNode[], payload: Payload): MetaTemplateInstance[] {
    let nodeIndex = 0;

    do {
      const node = nodes[nodeIndex];

      if (node instanceof IterationNode) {
        nodes.splice(nodeIndex, 1);
        const payloads = payload.getPayloads(node.iterator);
        return payloads.reduce((templates, currPayload) => {
          templates.push(...this.getInstancesFromNodes([...nodes], payload.merge(currPayload)));
          return templates;
        }, [] as MetaTemplateInstance[]);
      }

      if (node instanceof ConditionNode) {
        nodes.splice(nodeIndex, 1);
        if (node.checkCondition(payload)) {
          return this.getInstancesFromNodes([...nodes], payload);
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

    const templateName = (nodes as ITextNode[])
      .map(({ text }) => text)
      .join('');

    return [new MetaTemplateInstance(templateName, payload)];
  }
}