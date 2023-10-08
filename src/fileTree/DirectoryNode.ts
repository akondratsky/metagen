import { IFileTreeNode } from './IFileTreeNode';
import { FileNode } from './FileNode';
import { AbstractFileTreeNode } from './AbstractFileTreeNode';

export class DirectoryNode extends AbstractFileTreeNode {
  public readonly isDirectory: boolean = true;
  private readonly children: IFileTreeNode[] = [];

  public addNode(node: IFileTreeNode) {
    this.children.push(node);
  }

  public *[Symbol.iterator](): Iterator<IFileTreeNode> {
    yield this;
    for (const node of this.children) {
      yield* node;
    }
  }
}