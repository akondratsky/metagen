import type { TreeDirectory, TreeFile } from '../src/core/index.js';
import type { TreeObject } from '../src/core/index.js';


export const directory = (name: string, ...objects: TreeObject[]): TreeDirectory => ({
  name,
  isDirectory: true,
  children: objects,
});


export const file = (name: string, content: string | Buffer): TreeFile => ({
  isDirectory: false,
  name,
  content: typeof content === 'string' ? Buffer.from(content) : content,
});


export const sortChildren = (children: TreeObject[]) => children.sort((a, b) => {
  return (a.name as string).localeCompare(b.name as string);
});


export const sortTreeRecursively = (tree: TreeObject): TreeObject => {
  const result = {
    isDirectory: tree.isDirectory,
    name: tree.name,
  };

  if (!tree.isDirectory) {
    (result as TreeFile).content = tree.content;
  } else {
    const sorted = sortChildren(tree.children);
    (result as TreeDirectory).children = sorted.map(child => sortTreeRecursively(child));
  }

  return result as TreeObject;
};
