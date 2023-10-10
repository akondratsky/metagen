import { FileObject } from '~/FileTreeObject';
import { AbstractFileTreeNode } from './AbstractFileTreeNode';

export class FileNode extends AbstractFileTreeNode {
  public readonly isDirectory = false;
  public content: string = '';

  public *[Symbol.iterator](): Iterator<AbstractFileTreeNode> {
    yield this;
  }

  public toJson(): FileObject {
    return {
      isDirectory: false,
      content: this.content,
      name: this.name,
    };
  }
}
