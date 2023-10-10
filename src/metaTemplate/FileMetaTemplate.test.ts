import { FileMetaTemplate } from './FileMetaTemplate';
import { describe, test, expect, spyOn } from 'bun:test';

import fs from 'node:fs';
import { JsonObject } from '~/json';

const readFileSyncStub = spyOn(fs, 'readFileSync');



describe('FileMetaTemplate', () => {
  describe('renderToNodes()', () => {
    type FileMetaTemplateTestCase = {
      templateName: string;
      template: string;
      payload: JsonObject;
      output: Array<{ name: string, content: string }>
    };

    const testCases: FileMetaTemplateTestCase[] = [
      {
        // test case #1
        templateName: 'filename',
        template: '{{value}}',
        payload: { value: 42 },
        output: [{ name: 'filename', content: '42' }]
      },
      {
        // test case #2
        templateName: '{#each persons}{name}.txt',
        template: '{{name}} content',
        payload: { persons: [{ name: 'ivan' }, { name: 'anatoliy' }] },
        output: [
          { name: 'ivan.txt', content: 'ivan content' },
          { name: 'anatoliy.txt', content: 'anatoliy content' },
        ],
      },
      {
        // test case #3
        templateName: '{#each persons}{#include musician}{name}.txt',
        template: '{{name}} {{#if musician}}is a musician{{/if}}',
        payload: {
          persons: [{ name: 'ivan', musician: true }, { name: 'anatoliy', musician: false }]
        },
        output: [{ name: 'ivan.txt', content: 'ivan is a musician' }]
      },
      {
        // test case #4
        templateName: '{#each a}{#each b}{name}.txt',
        template: '{{name}}',
        payload: {
          a: [
            { b: [{ name: '1' }, { name: '2' }] },
            { b: [{ name: '3' }, { name: '4' }] }
          ]
        },
        output: [
          { name: '1.txt', content: '1' },
          { name: '2.txt', content: '2' },
          { name: '3.txt', content: '3' },
          { name: '4.txt', content: '4' },
        ]
      },
    ];

    testCases.forEach(({ templateName, template, output, payload }) => {
      test(templateName, () => {
        readFileSyncStub.mockReturnValue(template);
        const fileNodes = new FileMetaTemplate('root', templateName).renderToNodes(payload);
        expect(fileNodes).toBeArrayOfSize(output.length);
        output.forEach(({ name, content }, index) => {
          expect(fileNodes[index].name).toBe(name);
          expect(fileNodes[index].content).toBe(content);
        });
      })
    });
  });

  describe('renderToJson()', () => {
    test('{#each a}{#each b}{name}.txt', () => {
      readFileSyncStub.mockReturnValue('{{name}}');

      const payload = {
        a: [
          { b: [{ name: '1' }, { name: '2' }] },
          { b: [{ name: '3' }, { name: '4' }] }
        ]
      };

      const fileNodes = new FileMetaTemplate('root', '{#each a}{#each b}{name}.txt').renderToJson(payload);
      
      expect(fileNodes).toEqual([
        { isDirectory: false, name: '1.txt', content: '1' },
        { isDirectory: false, name: '2.txt', content: '2' },
        { isDirectory: false, name: '3.txt', content: '3' },
        { isDirectory: false, name: '4.txt', content: '4' },
      ])
    })
  });
});
