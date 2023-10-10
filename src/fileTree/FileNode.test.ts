import { FileNode } from './FileNode';
import { describe, it, expect } from 'bun:test';

describe('FileNode', () => {
  it('has isDirectory flag', () => {
    const node = new FileNode('folder', 'name');
    expect(node.isDirectory).toBe(false);
  });

  it('has content field', () => {
    const node = new FileNode('folder', 'name');
    node.content = '42';
    expect(node.content).toBe('42');
  });

  it('when iterated, returns self', () => {
    const node = new FileNode('folder', 'name');
    expect([...node]).toEqual([node]);
  });
});
