import { describe, test, expect } from 'bun:test';
import { join } from 'node:path';
import { Tree } from './core';
import { FsTreeReader } from './FsTreeReader';
import { sortTreeRecursively } from './fixtures.test';

describe('FsTreeReader', () => {
  const fsTreeReader = new FsTreeReader();
  
  describe('read()', () => {
    test('./template1/{person}.hbs', () => {
      const tree = fsTreeReader.read(
        join(import.meta.dir, '../integration', './template1/{person}.hbs'),
      );
      expect(tree.toJson()).toEqual({
        isDirectory: false,
        name: '{person}.hbs',
        content: '{{ person }} content',
      })
    });

    test('./template2', () => {
      const root = fsTreeReader.read(
        join(import.meta.dir, '../integration', 'template2')
      ) as Tree;

      const actual = sortTreeRecursively(root.toJson());

        console.log('------------')

      const expected = sortTreeRecursively({
        name: "template2",
        isDirectory: true,
        children: [
          {
            name: "{#each persons}{#includeif isMusician}{name} notes",
            isDirectory: true,
            children: [
              {
                name: "{song}.hbs",
                isDirectory: false,
                content: "la-la-la!"
              }
            ]
          },
          {
            name: "musicians.hbs",
            isDirectory: false,
            content: "{{title}}\n{{#each persons}}\n{{this.name}}\n{{/each}}"
          }, 
        ]
      });

      expect(actual).toEqual(expected);
    });

  });
});