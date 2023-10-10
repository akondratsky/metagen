import { FileMetaTemplate } from './FileMetaTemplate';
import { describe, it, expect, spyOn } from 'bun:test';

import fs from 'node:fs';
import { Payload } from '~/payload';

const readFileSyncStub = spyOn(fs, 'readFileSync');

readFileSyncStub.mockReturnValue('777');

describe('FileMetaTemplate', () => {
  describe('render()', () => {
    it('renders content with handlebars', () => {
      readFileSyncStub.mockReturnValue('{{value}}');
      const payload = new Payload({
        value: '42'
      });
      const files = new FileMetaTemplate('root', 'name', payload).render();

      files.forEach((file) => {
        expect(file.content).toBe('42');
      });
    });

    describe('cases', () => {
      it('{#each persons}{name}', () => {
        readFileSyncStub.mockReturnValue('{{name}} content');
        const payload = new Payload({
          persons: [{ name: 'ivan' }, { name: 'anatoliy' }]
        });
        const files = new FileMetaTemplate('root', '{#each persons}{name}.txt', payload).render();
        expect(files).toBeArrayOfSize(2);
        expect(files[0].name).toBe('ivan.txt');
        expect(files[1].name).toBe('anatoliy.txt');
        expect(files[0].content).toBe('ivan content');
        expect(files[1].content).toBe('anatoliy content');
      });

      it('{#each persons}{#if musician}{name}', () => {
        readFileSyncStub.mockReturnValue(`{{name}} {{#if musician}}is a musician{{/if}}`);
        const payload = new Payload({
          persons: [{ name: 'ivan', musician: true }, { name: 'anatoliy', musician: false }]
        });
        const files = new FileMetaTemplate('root', '{#each persons}{#include musician}{name}.txt', payload).render();
        expect(files).toBeArrayOfSize(1);
        expect(files[0].name).toBe('ivan.txt');
        expect(files[0].content).toBe('ivan is a musician');
      });
    });
  });
});
