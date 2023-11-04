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
        expect(() => node.content = Buffer.from('value')).toThrow();
      })
    });
  });

  describe('File', () => {
    it('works with content', () => {
      const node = new Tree.File('name');
      
      expect(() => {
        node.content = Buffer.from('content');
      }).not.toThrow();
      expect(node.content.toString()).toBe('content');
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
});
