import { describe, test, expect } from 'bun:test';
import { join } from 'node:path';

import { Tree } from '../src/core/index.js';
import { FsTreeReader } from '../src/FsTreeReader.js';
import { sortTreeRecursively } from './fixtures.test.js';
import { TreeConverter } from '../src/core/TreeConverter.js';

describe('FsTreeReader', () => {
  const fsTreeReader = new FsTreeReader();
  const treeConverter = new TreeConverter();

  describe('read()', () => {
    test('./template1-simple-interpolation/{person}.hbs', () => {
      const tree = fsTreeReader.read(
        join(import.meta.dir, '../integration', './template1-simple-interpolation/{person}.hbs'),
      );
      expect(treeConverter.toObject(tree)).toEqual({
        isDirectory: false,
        name: '{person}.hbs',
        content: Buffer.from('{{ person }} content'),
      });
    });

    test('./template2-iteration-inclusion', () => {
      const root = fsTreeReader.read(
        join(import.meta.dir, '../integration', 'template2-iteration-inclusion'),
      ) as Tree;

      const actual = sortTreeRecursively(
        treeConverter.toObject(root),
      );

      const expected = sortTreeRecursively({
        name: 'template2-iteration-inclusion',
        isDirectory: true,
        children: [
          {
            name: '{#each persons}{#includeif isMusician}{name} notes',
            isDirectory: true,
            children: [
              {
                name: '{song}.hbs',
                isDirectory: false,
                content: Buffer.from('la-la-la!'),
              },
            ],
          },
          {
            name: 'musicians.hbs',
            isDirectory: false,
            content: Buffer.from('{{title}}\n{{#each persons}}\n{{this.name}}\n{{/each}}'),
          },
        ],
      });

      expect(actual).toEqual(expected);
    });
  });
});
