export abstract class AbstractFileTreeNode {
  constructor(
    public readonly folder: string,
    public readonly name: string,
  ){} 

  abstract isDirectory: boolean;
  abstract [Symbol.iterator](): Iterator<AbstractFileTreeNode>;
}
