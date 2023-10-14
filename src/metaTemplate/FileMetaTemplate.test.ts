import { FileMetaTemplate } from './FileMetaTemplate';
import { describe, test, expect, spyOn } from 'bun:test';

import fs from 'node:fs';
import { JsonObject } from '~/json';

const readFileSyncStub = spyOn(fs, 'readFileSync');



describe('FileMetaTemplate', () => {
  describe('renderToNodes()', () => {
    type FileMetaTemplateTestCase = {
      templateName: string;
      templateContent: string;
      payload: JsonObject;
      expectedNodes: Array<{ name: string, content: string }>
    };

    const testCases: FileMetaTemplateTestCase[] = [
      {
        // test case #1
        templateName: 'filename',
        templateContent: '{{value}}',
        payload: { value: 42 },
        expectedNodes: [{ name: 'filename', content: '42' }]
      },
      {
        // test case #2
        templateName: '{#each persons}{name}.txt',
        templateContent: '{{name}} content',
        payload: { persons: [{ name: 'ivan' }, { name: 'anatoliy' }] },
        expectedNodes: [
          { name: 'ivan.txt', content: 'ivan content' },
          { name: 'anatoliy.txt', content: 'anatoliy content' },
        ],
      },
      {
        // test case #3
        templateName: '{#each persons}{#include musician}{name}.txt',
        templateContent: '{{name}} {{#if musician}}is a musician{{/if}}',
        payload: {
          persons: [{ name: 'ivan', musician: true }, { name: 'anatoliy', musician: false }]
        },
        expectedNodes: [{ name: 'ivan.txt', content: 'ivan is a musician' }]
      },
      {
        // test case #4
        templateName: '{#each a}{#each b}{name}.txt',
        templateContent: '{{name}}',
        payload: {
          a: [
            { b: [{ name: '1' }, { name: '2' }] },
            { b: [{ name: '3' }, { name: '4' }] }
          ]
        },
        expectedNodes: [
          { name: '1.txt', content: '1' },
          { name: '2.txt', content: '2' },
          { name: '3.txt', content: '3' },
          { name: '4.txt', content: '4' },
        ]
      },
    ];

    testCases.forEach(({ templateName, templateContent, expectedNodes, payload }) => {
      test(templateName, () => {
        readFileSyncStub.mockReturnValue(templateContent);

        const fileNodes = new FileMetaTemplate('./template', templateName).renderToNodes('./output', payload);

        expect(fileNodes).toBeArrayOfSize(expectedNodes.length);

        expectedNodes.forEach(({ name, content }, index) => {
          expect(fileNodes[index].name).toBe(name);
          expect(fileNodes[index].content).toBe(content);
          expect(fileNodes[index].dir).toBe('./output');
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
      const metaTemplate = new FileMetaTemplate('root', '{#each a}{#each b}{name}.txt');
      const fileNodes = metaTemplate.renderToJson('./expectedNodes', payload);
      
      expect(fileNodes).toEqual([
        { isDirectory: false, name: '1.txt', content: '1' },
        { isDirectory: false, name: '2.txt', content: '2' },
        { isDirectory: false, name: '3.txt', content: '3' },
        { isDirectory: false, name: '4.txt', content: '4' },
      ])
    })
  });
});
