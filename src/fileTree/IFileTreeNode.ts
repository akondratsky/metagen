export interface IFileTreeNode extends Iterable<IFileTreeNode> {
  readonly isDirectory: boolean;
  readonly folder: string;
  readonly name: string;
};
