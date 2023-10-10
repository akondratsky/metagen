import { IFileTreeNode } from './IFileTreeNode';
import { AbstractFileTreeNode } from './AbstractFileTreeNode';

export class DirectoryNode extends AbstractFileTreeNode {
  public readonly isDirectory: boolean = true;
  private readonly children: IFileTreeNode[] = [];

  public addNodes(...nodes: IFileTreeNode[]) {
    this.children.push(...nodes);
  }

  public *[Symbol.iterator](): Iterator<IFileTreeNode> {
    yield this;
    for (const node of this.children) {
      yield* node;
    }
  }
}