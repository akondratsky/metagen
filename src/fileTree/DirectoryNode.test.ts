import { DirectoryNode } from './DirectoryNode';
import { describe, it, expect } from 'bun:test';
import { FileNode } from './FileNode';

describe('DirectoryNode', () => {
  it('has isDirectory flag', () => {
    const node = new DirectoryNode('folder', 'name');
    expect(node.isDirectory).toBe(true);
  });

  it('iterates its children recursively', () => {
    const node = new DirectoryNode('folder', 'name');
    const childFile1 = new FileNode('folder/name', 'filename1');
    const childDir = new DirectoryNode('folder/name', 'folder2');
    const childFile2 = new FileNode('folder/name/folder2', 'filename2');
    childDir.addNodes(childFile2)
    node.addNodes(childFile1, childDir);

    
    expect([...node]).toEqual([
      node,
      childFile1,
      childDir,
      childFile2,
    ]);
  });

  it('converts to JSON object', () => {
    const node = new DirectoryNode('folder', 'name');
    const childFile1 = new FileNode('folder/name', 'filename1');
    childFile1.content = 'filename1content';
    const childDir = new DirectoryNode('folder/name', 'folder2');
    const childFile2 = new FileNode('folder/name/folder2', 'filename2');
    childFile2.content = 'filename2content';
    childDir.addNodes(childFile2)
    node.addNodes(childFile1, childDir);

    expect(node.toJson()).toEqual({
      isDirectory: true,
      name: 'name',
      children: [
        {
          isDirectory: false,
          name: 'filename1',
          content: 'filename1content',
        },
        {
          isDirectory: true,
          name: 'folder2',
          children: [
            {
              isDirectory: false,
              name: 'filename2',
              content: 'filename2content'
            }
          ]
        },
      ]
    })
  });
});
