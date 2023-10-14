import {
  AbstractNode,
  ConditionNode,
  ITextNode,
  InterpolationNode,
  IterationNode,
  NodesParser,
} from '~/syntax';
import type { JsonObject } from '~/json';
import { PayloadUtil } from '~/PayloadUtil';
import { AbstractFileTreeNode } from '~/fileTree/AbstractFileTreeNode';
import { FileTreeObject } from '~/FileTreeObject';
import { MetaTemplateInstance } from './MetaTemplateInstance';


/**
 * Meta template is a file with a special name, which is used to create one or multiple files
 * according to the MetaGen syntax.
 * 
 * Responsibility: get instances, render them
 */
export abstract class AbstractMetaTemplate {
  constructor(
    /** parent folder for this meta template */
    protected directory: string,
    /** current meta template (file or folder) name */
    protected name: string,
  ) {}


  private readonly nodesParser = new NodesParser();

  abstract renderToNodes(outputDir: string, payload: JsonObject): AbstractFileTreeNode | AbstractFileTreeNode[];
  abstract renderToJson(outputDir: string, payload: JsonObject): FileTreeObject | FileTreeObject[];


  /** Returns list of particular templates for this meta template: name and payload */
  protected getInstances(outputDir: string, payload: JsonObject): MetaTemplateInstance[] {
    const nodes = this.nodesParser.parse(this.name);
    return this.getInstancesFromNodes(outputDir, nodes, payload);
  }


  /** recursively goes through list of nodes and creates list of meta template instances */
  private getInstancesFromNodes(outputDir: string, nodes: AbstractNode[], payload: JsonObject): MetaTemplateInstance[] {
    let nodeIndex = 0;

    do {
      const node = nodes[nodeIndex];

      if (node instanceof IterationNode) {
        nodes.splice(nodeIndex, 1);
        const payloads = PayloadUtil.getPayloads(payload, node.iterator);
        return payloads.reduce((templates, currPayload) => {
          const templatePayload = PayloadUtil.merge(payload, currPayload);
          templates.push(...this.getInstancesFromNodes(outputDir, [...nodes], templatePayload));
          return templates;
        }, [] as MetaTemplateInstance[]);
      }

      if (node instanceof ConditionNode) {
        nodes.splice(nodeIndex, 1);
        if (node.checkCondition(payload)) {
          return this.getInstancesFromNodes(outputDir, [...nodes], payload);
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

    return [
      new MetaTemplateInstance({
        template: {
          dir: this.directory,
          name: this.name,
        },
        output: {
          dir: outputDir,
          name: templateName,
        },
        payload:PayloadUtil.clone(payload)
      }),
    ];
  }
}