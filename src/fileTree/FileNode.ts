import { AbstractFileTreeNode } from './AbstractFileTreeNode';
import { IFileTreeNode } from './IFileTreeNode';

export class FileNode extends AbstractFileTreeNode {
  public readonly isDirectory = false;
  public content: string = '';

  public *[Symbol.iterator](): Iterator<IFileTreeNode> {
    yield this;
  }
}