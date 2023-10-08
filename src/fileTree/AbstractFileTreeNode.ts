import { IFileTreeNode } from './IFileTreeNode';

export abstract class AbstractFileTreeNode implements IFileTreeNode {
  constructor(
    public readonly folder: string,
    public readonly name: string,
  ){} 

  abstract isDirectory: boolean;
  abstract [Symbol.iterator](): Iterator<IFileTreeNode>;
}
