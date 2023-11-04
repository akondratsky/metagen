import { describe, it, expect } from 'bun:test';
import { TreeConverter } from './TreeConverter';
import { Tree } from './Tree';

describe('TreeConverter', () => {
  describe('toObject()', () => {
    it('converts single file into the TreeObject', () => {
      const file = new Tree.File('filename');
      file.content = Buffer.from('123');
      const converter = new TreeConverter();

      const actual = converter.toObject(file);

      expect(actual).toEqual({
        isDirectory: false,
        name: 'filename',
        content: Buffer.from('123'),
      });
    });

    it('converts multiple files into the TreeObject[]', () => {
      const file1 = new Tree.File('filename1');
      file1.content = Buffer.from('content1');
      const file2 = new Tree.File('filename2');
      file2.content = Buffer.from('content2');

      const converter = new TreeConverter();

      const actual = converter.toObject([file1, file2]);

      expect(actual).toEqual([
        {
          isDirectory: false,
          name: 'filename1',
          content: Buffer.from('content1'),
        }, {
          isDirectory: false,
          name: 'filename2',
          content: Buffer.from('content2'),
        },
      ]);
    });

    it('converts directories', () => {
      const directory = new Tree.Directory('dirname');
      const file = new Tree.File('filename');
      file.content = Buffer.from('file_content');
      directory.children.push(file);
      const converter = new TreeConverter();
      const actual = converter.toObject(directory);
      expect(actual).toEqual({
        isDirectory: true,
        name: 'dirname',
        children: [{
          isDirectory: false,
          name: 'filename',
          content: Buffer.from('file_content')
        }],
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
  

      const treeConverter = new TreeConverter();

      const actual = treeConverter.toList([root1, root2, root3], './output')
  
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
