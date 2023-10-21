import type { JsonObject } from './core';

export const directory = (name: string, ...objects: JsonObject[]): JsonObject => ({
  name,
  isDirectory: true,
  children: objects,
});

export const file = (name: string, content: string): JsonObject => ({
  isDirectory: false,
  name,
  content,
});


export const sortChildren = (children: JsonObject[]) => children.sort((a, b) => {
  return (a.name as string).localeCompare(b.name as string);
});

export const sortTreeRecursively = (tree: JsonObject): JsonObject => {
  console.log('sorting: ', tree.name);
  const result: JsonObject = {
    isDirectory: tree.isDirectory,
    name: tree.name  
  };

  if (!tree.isDirectory) {
    result.content = tree.content;
  } else {
    const sorted = sortChildren(tree.children as JsonObject[]);
    result.children = sorted.map(child => sortTreeRecursively(child));
  }

  return result;
};