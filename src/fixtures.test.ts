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
