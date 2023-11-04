export type TreeFile = {
  isDirectory: false;
  name: string;
  content: Buffer;
};

export type TreeDirectory = {
  isDirectory: true;
  name: string;
  children: TreeObject[];
}

export type TreeObject = TreeFile | TreeDirectory;