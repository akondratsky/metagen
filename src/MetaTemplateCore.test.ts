import { MetaTemplateCore } from './core';
import { describe, test, expect } from 'bun:test';
import { join } from 'node:path';
import { FsTreeReader } from './FsTreeReader';
import { directory, file, sortChildren } from './fixtures.test';


describe('MetaTemplate', () => {
  const fsTreeReader = new FsTreeReader();

  /**
   * {person}.hbs
   * file.hbs
   */
  test('./template1', () => {
    const templatePath = join(import.meta.dir, '../integration', 'template1');
    const inputTree = fsTreeReader.read(templatePath);

    const template = new MetaTemplateCore(inputTree);

    const output = template.renderJson({
      person: 'ivan'
    });


    expect(sortChildren(output)).toEqual(sortChildren([
      file('ivan.hbs', 'ivan content'),
      file('file.hbs', ''),
    ]));
  });

  /**
   * {#each persons}{#includeif isMusician}{name} notes
   * └── {song}.hbs
   * musicians.hbs
   */
  test('./template2', () => {
    const templatePath = join(import.meta.dir, '../integration', 'template2');
    const inputTree = fsTreeReader.read(templatePath);

    const template = new MetaTemplateCore(inputTree);

    const output = template.renderJson({
      persons: [
        { name: 'ivan', isMusician: true, song: 'strangers in the night' },
        { name: 'anatoliy', isMusician: false },
        { name: 'john', isMusician: true, song: 'venom' },
      ],
      title: 'list of musicians'
    });

    expect(sortChildren(output)).toEqual(sortChildren(
      [
        directory('ivan notes',
          file('strangers in the night.hbs', 'la-la-la!')
        ),
        directory('john notes',
          file('venom.hbs', 'la-la-la!')
        ),
        file('musicians.hbs', 'list of musicians\nivan\nanatoliy\njohn\n'),
      ]
    ));
  });

  // /**
  //  * {#each persons}
  //  * └── {#each skills}{skillName}.txt
  //  * index.txt
  //  */
  test('./template3', () => {
    const templatePath = join(import.meta.dir, '../integration', 'template3');
    const inputTree = fsTreeReader.read(templatePath);
    const template = new MetaTemplateCore(inputTree);

    const output = template.renderJson({
      persons: [
        {
          name: 'John',
          surname: 'Johnson',
          skills: [{ skillName: 'fly' }, { skillName: 'flee' }],
        },
        {
          name: 'Isabella',
          surname: 'Sold',
          skills: [{ skillName: 'dance' }, { skillName: 'swim' }],
        }
      ]
    });

    expect(output).toEqual([
      directory('John',
        file('fly.txt', 'Mr/Ms Johnson has mastered his/her skill: fly'),
        file('flee.txt', 'Mr/Ms Johnson has mastered his/her skill: flee'),
      ),
      directory('Isabella',
        file('dance.txt', 'Mr/Ms Sold has mastered his/her skill: dance'),
        file('swim.txt', 'Mr/Ms Sold has mastered his/her skill: swim'),
      ),
      file('index.txt', '-'),
    ])
  });

  test('./template4', () => {
    const templatePath = join(import.meta.dir, '../integration', 'template4');
    const inputTree = fsTreeReader.read(templatePath);

    const template = new MetaTemplateCore(inputTree);

    const output = template.renderJson({
      obj: {
        arr: [{ value: '42' }]
      }
    });

    expect(output).toEqual([
      file('42.txt', ''),
    ]);
  });

  test('./template5', () => {
    const templatePath = join(import.meta.dir, '../integration', 'template5');
    const inputTree = fsTreeReader.read(templatePath);
    const template = new MetaTemplateCore(inputTree);

    const output = template.renderJson({
      names: ['alex', 'john', 'optimus prime'],
    });

    expect(sortChildren(output)).toEqual(sortChildren([
      file('alex', ''),
      file('john', ''),
      file('optimus prime', ''),
    ]));
  });

  test('./template6', () => {
    const templatePath = join(import.meta.dir, '../integration', 'template6');
    const inputTree = fsTreeReader.read(templatePath);
    const template = new MetaTemplateCore(inputTree);

    const output = template.renderJson({
      value: 'test failed',
    });

    expect(output).toEqual([
      file('file.hbs', '{{value}}'),
    ]);
  });
});
