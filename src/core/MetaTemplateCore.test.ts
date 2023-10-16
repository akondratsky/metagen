import { describe, test, expect, spyOn } from 'bun:test';
import { MetaTemplateCore } from './MetaTemplateCore';
import { JsonObject } from './json';
import { Tree } from './Tree';


describe('MetaTemplateCore', () => {
  describe('rendering files', () => {

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
        templateName: '{#each persons}{#includeif musician}{name}.txt',
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
        const templateTree = new Tree.File(templateName);
        templateTree.content = templateContent;

        const metaTemplate = new MetaTemplateCore(templateTree);

        const fileNodes = metaTemplate.renderJson(payload);

        expect(fileNodes).toBeArrayOfSize(expectedNodes.length);

        expectedNodes.forEach(({ name, content }, index) => {
          expect(fileNodes[index].name).toBe(name);
          expect(fileNodes[index].content).toBe(content);
          expect(fileNodes[index].isDirectory).toBe(false);
        });
      });
    });

    test('{#each a}{#each b}{name}.txt', () => {
      const payload = {
        a: [
          { b: [{ name: '1' }, { name: '2' }] },
          { b: [{ name: '3' }, { name: '4' }] }
        ]
      };
      const inputFile = new Tree.File('{#each a}{#each b}{name}.txt');
      inputFile.content = '{{name}}';

      const metaTemplate = new MetaTemplateCore(inputFile);
      const fileNodes = metaTemplate.renderJson(payload);

      expect(fileNodes).toEqual([
        { isDirectory: false, name: '1.txt', content: '1' },
        { isDirectory: false, name: '2.txt', content: '2' },
        { isDirectory: false, name: '3.txt', content: '3' },
        { isDirectory: false, name: '4.txt', content: '4' },
      ])
    })
  });

  describe('template name rules', () => {
    describe('text', () => {
      test('"regular_file"', () => {
        const templateTree = new Tree.File('regular_file');
        const template = new MetaTemplateCore(templateTree);

        const output = template.renderJson({});
        expect(output).toEqual([{
          isDirectory: false,
          name: 'regular_file',
          content: '',
        }]);
      });
    });
  
    describe('interpolation', () => {
      test('{name}', () => {
        const templateTree = new Tree.File('{name}');
        const template = new MetaTemplateCore(templateTree);

        const output = template.renderJson({ name: 'ivan' });
        expect(output).toEqual([{
          isDirectory: false,
          name: 'ivan',
          content: ''
        }]);
      });
    });
  
    describe('condition', () => {
      test('"{#includeif condition}file", condition: true', () => {
        const templateTree = new Tree.File('{#includeif condition}file');
        const template = new MetaTemplateCore(templateTree);
        const output = template.renderJson({ condition: true });
        expect(output).toEqual([{
          isDirectory: false,
          name: 'file',
          content: '',
        }]);
      });
  
      test('"{#includeif condition}file", condition: false', () => {
        const templateTree = new Tree.File('{#includeif condition}file');
        const template = new MetaTemplateCore(templateTree);
        const output = template.renderJson({ condition: false });
        expect(output).toEqual([]);
      });
    });
  
    describe('iterations', () => {
      const persons = [{ name: 'ivan' }, { name: 'anatoliy' }];
      
      test('{#each persons}{name}42', () => {
        const templateTree = new Tree.File('{#each persons}{name}42')
        templateTree.content = '{{name}}';

        const template = new MetaTemplateCore(templateTree);
        const output = template.renderJson({ persons });

        expect(output).toEqual([
          { isDirectory: false, name: 'ivan42', content: 'ivan'},
          { isDirectory: false, name: 'anatoliy42', content: 'anatoliy'},
        ]);
      });
  
  
      test('"{#each persons}{#each skills}{name}_{skillName}"', () => {
        const templateTree = new Tree.File('{#each persons}{#each skills}{name} - {skillName}');

        const template = new MetaTemplateCore(templateTree);

        const persons = [{
          name: 'me',
          skills: [{ skillName: 'eat' }, { skillName: 'sleep' }],
        }, {
          name: 'moms friend son',
          skills: [{ skillName: 'be rich'}, { skillName: 'travel' }],
        }];

        const output = template.renderJson({ persons });

        expect(output).toEqual([
          { isDirectory: false, content: '', name: 'me - eat' },
          { isDirectory: false, content: '', name: 'me - sleep' },
          { isDirectory: false, content: '', name: 'moms friend son - be rich' },
          { isDirectory: false, content: '', name: 'moms friend son - travel' },
        ])
      });
    });
  });
});
