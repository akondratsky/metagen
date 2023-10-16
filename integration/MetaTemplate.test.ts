import { JsonObject, MetaTemplateCore, Tree } from '~/core';
import { describe, test, expect } from 'bun:test';
import { FsTreeReader } from '~/FsTreeReader';
import { join } from 'node:path';

const directory = (name: string, ...objects: JsonObject[]): JsonObject => ({
  name,
  isDirectory: true,
  children: objects,
});
const file = (name: string, content: string): JsonObject => ({
  isDirectory: false,
  name,
  content,
});

const toJson = (trees: Tree[]) => trees.map(tree => tree.toJson());

describe('MetaTemplate', () => {
  const fsTreeReader = new FsTreeReader();

  /**
   * {person}.hbs
   * file.hbs
   */
  test('./template1', () => {
    const templatePath = join(import.meta.dir, 'template1');
    const inputTree = fsTreeReader.read(templatePath);

    const template = new MetaTemplateCore(inputTree);

    const output = template.renderJson({
      person: 'ivan'
    });


    expect(output).toEqual([
      file('ivan.hbs', 'ivan content'),
      file('file.hbs', ''),
    ]);
  });

  /**
   * {#each persons}{#include isMusician}{name} notes
   * └── {song}.hbs
   * musicians.hbs
   */
  test('./template2', () => {
    const templatePath = join(import.meta.dir, 'template2');
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

    expect(output).toEqual([
      file('musicians.hbs', 'list of musicians\nivan\nanatoliy\njohn\n'),
      directory('ivan notes',
        file('strangers in the night.hbs', 'la-la-la!')
      ),
      directory('john notes',
          file('venom.hbs', 'la-la-la!')
      ),
    ]);
  });

  // /**
  //  * {#each persons}
  //  * └── {#each skills}{skillName}.txt
  //  * index.txt
  //  */
  test('./template3', () => {
    const templatePath = join(import.meta.dir, 'template3');
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
});
