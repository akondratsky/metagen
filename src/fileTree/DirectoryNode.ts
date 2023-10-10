import { AbstractFileTreeNode } from './AbstractFileTreeNode';

export class DirectoryNode extends AbstractFileTreeNode {
  public readonly isDirectory: boolean = true;
  private readonly children: AbstractFileTreeNode[] = [];

  public addNodes(...nodes: AbstractFileTreeNode[]) {
    this.children.push(...nodes);
  }

  public *[Symbol.iterator](): Iterator<AbstractFileTreeNode> {
    yield this;
    for (const node of this.children) {
      yield* node;
    }
  }
}