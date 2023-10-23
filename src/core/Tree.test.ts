import { describe, it, expect } from 'bun:test';
import { Tree } from './Tree';

describe('Tree', () => {
  describe('Directory', () => {
    it('works with children', () => {
      const node = new Tree.Directory('name');
      const children = [new Tree.File('file')];
      
      expect(() => {
        node.children = children;
      }).not.toThrow();
      expect(node.children).toBe(children);
    });

    describe('throws an error when content', () => {
      const node = new Tree.Directory('name');

      it('is read', () => {
        expect(() => node.content).toThrow();
      });
      it('is written', () => {
        expect(() => node.content = 'value').toThrow();
      })
    });
  });

  describe('File', () => {
    it('works with content', () => {
      const node = new Tree.File('name');
      
      expect(() => {
        node.content = 'content';
      }).not.toThrow();
      expect(node.content).toBe('content');
    });

    describe('throws an error when children', () => {
      const node = new Tree.File('name');

      it('is read', () => {
        expect(() => node.children).toThrow();
      });
      it('is written', () => {
        expect(() => node.children = []).toThrow();
      })
    });
  });


  describe('toList()', () => {
    it('converts trees into the list of files and folders', () => {
      const root1 = new Tree.Directory('root1');
      const subDir = new Tree.Directory('subDir');
      subDir.children.push(new Tree.File('subDirChild'));
      root1.children.push(
        new Tree.File('sub1'),
        new Tree.File('sub2'),
        subDir,
      );
  
      const root2 = new Tree.Directory('root2');
      root2.children.push(
        new Tree.File('sub3'),
      );
      const root3 = new Tree.File('root3');
  
      const actual = Tree.toList([root1, root2, root3], './output')
  
      expect(actual).toEqual([
        'output/root1/',
        'output/root1/sub1',
        'output/root1/sub2',
        'output/root1/subDir/',
        'output/root1/subDir/subDirChild',
        'output/root2/',
        'output/root2/sub3',
        'output/root3',
      ]);
    });
  });

  
});
