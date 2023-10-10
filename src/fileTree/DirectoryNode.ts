import { DirectoryObject } from '~/FileTreeObject';
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

  public toJson(): DirectoryObject {
    return {
      isDirectory: true,
      name: this.name,
      children: this.children.map(child => child.toJson()),
    };
  }
}