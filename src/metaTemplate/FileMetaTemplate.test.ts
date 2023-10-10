import { FileMetaTemplate } from './FileMetaTemplate';
import { describe, test, expect, spyOn } from 'bun:test';

import fs from 'node:fs';
import { Payload } from '~/payload';
import { PayloadObject } from '~/payload/types';

const readFileSyncStub = spyOn(fs, 'readFileSync');



describe('FileMetaTemplate', () => {
  describe('render()', () => {
    type FileMetaTemplateTestCase = {
      templateName: string;
      template: string;
      payload: PayloadObject;
      output: Array<{ name: string, content: string }>
    };

    const testCases: FileMetaTemplateTestCase[] = [
      {
        templateName: 'filename',
        template: '{{value}}',
        payload: { value: 42 },
        output: [{ name: 'filename', content: '42' }]
      },
      {
        // test case #1
        templateName: '{#each persons}{name}.txt',
        template: '{{name}} content',
        payload: { persons: [{ name: 'ivan' }, { name: 'anatoliy' }] },
        output: [
          { name: 'ivan.txt', content: 'ivan content' },
          { name: 'anatoliy.txt', content: 'anatoliy content' },
        ],
      },
      {
        // test case #2
        templateName: '{#each persons}{#include musician}{name}.txt',
        template: '{{name}} {{#if musician}}is a musician{{/if}}',
        payload: {
          persons: [{ name: 'ivan', musician: true }, { name: 'anatoliy', musician: false }]
        },
        output: [{ name: 'ivan.txt', content: 'ivan is a musician' }]
      },
      {
        // test case #1
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
        const files = new FileMetaTemplate('root', templateName, new Payload(payload)).render();
        expect(files).toBeArrayOfSize(output.length);
        output.forEach(({ name, content }, index) => {
          expect(files[index].name).toBe(name);
          expect(files[index].content).toBe(content);
        });
      })
    });
  });
});
