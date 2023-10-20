import { expect } from 'bun:test';
import sortBy from 'lodash/sortBy';
import type { JsonArray, JsonObject } from './core';

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


export const sortChildren = (children: JsonObject[]) => sortBy(children as JsonObject[], child => child.name);

export const sortTreeRecursively = (tree: JsonObject): JsonObject => {
  const result: JsonObject = {
    isDirectory: tree.isDirectory,
    name: tree.name  
  };

  if (!tree.isDirectory) {
    result.content = tree.content;
  } else {
    result.children = sortChildren(tree.children as JsonObject[]).map(child => sortTreeRecursively(child));
  }

  return result;
};