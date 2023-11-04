import { MetaTemplateCore } from '../src/core';
import { describe, test, expect } from 'bun:test';
import { join } from 'node:path';
import { FsTreeReader } from '../src/FsTreeReader';
import { directory, file, sortChildren } from './fixtures.test';


describe('MetaTemplateCore integration tests', () => {
  const fsTreeReader = new FsTreeReader();

  /**
   * {person}.hbs
   * file.hbs
   */
  test('./template1-simple-interpolation', () => {
    const templatePath = join(import.meta.dir, '../integration', 'template1-simple-interpolation');
    const inputTree = fsTreeReader.read(templatePath);

    const template = new MetaTemplateCore(inputTree);

    const output = template.renderObject({
      person: 'ivan',
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
  test('./template2-iteration-inclusion', () => {
    const templatePath = join(import.meta.dir, '../integration', 'template2-iteration-inclusion');
    const inputTree = fsTreeReader.read(templatePath);

    const template = new MetaTemplateCore(inputTree);

    const output = template.renderObject({
      persons: [
        { name: 'ivan', isMusician: true, song: 'strangers in the night' },
        { name: 'anatoliy', isMusician: false },
        { name: 'john', isMusician: true, song: 'venom' },
      ],
      title: 'list of musicians',
    });

    expect(sortChildren(output)).toEqual(sortChildren(
      [
        directory('ivan notes',
          file('strangers in the night.hbs', 'la-la-la!'),
        ),
        directory('john notes',
          file('venom.hbs', 'la-la-la!'),
        ),
        file('musicians.hbs', 'list of musicians\nivan\nanatoliy\njohn\n'),
      ],
    ));
  });

  // /**
  //  * {#each persons}
  //  * └── {#each skills}{skillName}.txt
  //  * index.txt
  //  */
  test('./template3-iteration-render', () => {
    const templatePath = join(import.meta.dir, '../integration', 'template3-iteration-render');
    const inputTree = fsTreeReader.read(templatePath);
    const template = new MetaTemplateCore(inputTree);

    const output = template.renderObject({
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
        },
      ],
    });

    expect(sortChildren(output)).toEqual(sortChildren([
      directory('John',
        file('fly.txt', 'Mr/Ms Johnson has mastered his/her skill: fly'),
        file('flee.txt', 'Mr/Ms Johnson has mastered his/her skill: flee'),
      ),
      directory('Isabella',
        file('dance.txt', 'Mr/Ms Sold has mastered his/her skill: dance'),
        file('swim.txt', 'Mr/Ms Sold has mastered his/her skill: swim'),
      ),
      file('index.txt', '-'),
    ]));
  });

  test('./template4-iteration-index', () => {
    const templatePath = join(import.meta.dir, '../integration', 'template4-iteration-index');
    const inputTree = fsTreeReader.read(templatePath);

    const template = new MetaTemplateCore(inputTree);

    const output = template.renderObject({
      obj: {
        arr: [{ value: '42' }],
      },
    });

    expect(output).toEqual([
      file('42.txt', ''),
    ]);
  });

  test('./template5-iteration-strings', () => {
    const templatePath = join(import.meta.dir, '../integration', 'template5-iteration-strings');
    const inputTree = fsTreeReader.read(templatePath);
    const template = new MetaTemplateCore(inputTree);

    const output = template.renderObject({
      names: ['alex', 'john', 'optimus prime'],
    });

    expect(sortChildren(output)).toEqual(sortChildren([
      file('alex', ''),
      file('john', ''),
      file('optimus prime', ''),
    ]));
  });

  test('./template6-copy-directive', () => {
    const templatePath = join(import.meta.dir, '../integration', 'template6-copy-directive');
    const inputTree = fsTreeReader.read(templatePath);
    const template = new MetaTemplateCore(inputTree);

    const output = template.renderObject({
      value: 'test failed',
    });

    expect(output).toEqual([
      file('file.hbs', '{{value}}'),
    ]);
  });
});
