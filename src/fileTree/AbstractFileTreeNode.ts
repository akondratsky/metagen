import { FileTreeObject } from '~/FileTreeObject';

export abstract class AbstractFileTreeNode {
  constructor(
    public readonly directory: string,
    public readonly name: string,
  ){} 

  abstract isDirectory: boolean;
  abstract [Symbol.iterator](): Iterator<AbstractFileTreeNode>;
  abstract toJson(): FileTreeObject;
}

