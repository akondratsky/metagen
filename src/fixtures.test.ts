import type { PayloadObject } from './core';

export const directory = (name: string, ...objects: PayloadObject[]): PayloadObject => ({
  name,
  isDirectory: true,
  children: objects,
});

export const file = (name: string, content: string): any => ({
  isDirectory: false,
  name,
  content: Buffer.from(content),
});


export const sortChildren = (children: any[]) => children.sort((a, b) => {
  return (a.name as string).localeCompare(b.name as string);
});

export const sortTreeRecursively = (tree: any): any => {
  console.log('sorting: ', tree.name);
  const result: PayloadObject = {
    isDirectory: tree.isDirectory,
    name: tree.name  
  };

  if (!tree.isDirectory) {
    result.content = tree.content;
  } else {
    const sorted = sortChildren(tree.children);
    result.children = sorted.map(child => sortTreeRecursively(child));
  }

  return result;
};