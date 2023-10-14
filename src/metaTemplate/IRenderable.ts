import { FileTreeObject } from '~/FileTreeObject';
import { AbstractFileTreeNode } from '~/fileTree/AbstractFileTreeNode';
import { JsonObject } from '~/json';

export interface IRenderable {
  renderToNodes(outputDir: string, payload: JsonObject): AbstractFileTreeNode | AbstractFileTreeNode[];
  renderToJson(outputDir: string, payload: JsonObject): FileTreeObject | FileTreeObject[];
}
