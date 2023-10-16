import { describe, test, expect } from 'bun:test';
import { join } from 'node:path';
import { Tree } from '~/core';
import { FsTreeReader } from '~/FsTreeReader';

describe('FsTreeReader', () => {
  const fsTreeReader = new FsTreeReader();
  
  describe('read()', () => {
    test('./template1/{person}.hbs', () => {
      const tree = fsTreeReader.read(
        join(import.meta.dir, './template1/{person}.hbs'),
      );
      expect(tree.toJson()).toEqual({
        isDirectory: false,
        name: '{person}.hbs',
        content: '{{ person }} content',
      })
    });

    test('./template2', () => {
      const root = fsTreeReader.read(
        join(import.meta.dir, 'template2')
      ) as Tree;
      expect(root.toJson()).toEqual({
        name: "template2",
        isDirectory: true,
        children: [
          {
            name: "musicians.hbs",
            isDirectory: false,
            content: "{{title}}\n{{#each persons}}\n{{this.name}}\n{{/each}}"
          }, {
            name: "{#each persons}{#include isMusician}{name} notes",
            isDirectory: true,
            children: [
              {
                name: "{song}.hbs",
                isDirectory: false,
                content: "la-la-la!"
              }
            ]
          }
        ]
      });
    });
  });
});