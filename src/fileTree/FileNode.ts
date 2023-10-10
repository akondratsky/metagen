import { AbstractFileTreeNode } from './AbstractFileTreeNode';

export class FileNode extends AbstractFileTreeNode {
  public readonly isDirectory = false;
  public content: string = '';

  public *[Symbol.iterator](): Iterator<AbstractFileTreeNode> {
    yield this;
  }
}
