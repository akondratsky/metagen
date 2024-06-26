import { describe, test, expect, spyOn, jest, afterAll, beforeAll } from 'bun:test';
import fs from 'node:fs';
import { directory, file, sortChildren, sortTreeRecursively } from './fixtures.test.js';

import { MetaGenerator } from '../src/MetaGenerator.js';
import { logger } from '../src/logger.js';
import { FsTreeReader } from '../src/FsTreeReader.js';
import { TreeConverter } from '../src/core/TreeConverter.js';


process.chdir('./integration');

describe('MetaGenerator', () => {
  beforeAll(() => {
    spyOn(logger, 'error').mockImplementation(jest.fn());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });


  test('generates json output', () => {
    const generator = new MetaGenerator('./template1-simple-interpolation');
    const outputs = generator.generate({
      destination: '.',
      payload: { person: 'john' },
      isDryRun: true,
    });

    expect(sortChildren(outputs.json)).toEqual(sortChildren([
      file('john.hbs', 'john content'),
      file('file.hbs', ''),
    ]));
  });

  test('checks if destination is a folder', () => {
    const generator = new MetaGenerator('./template1-simple-interpolation');
    expect(
      () => generator.generate({ destination: './stub.txt', payload: {} }),
    ).toThrow('MetaGenerator: destination path is not a folder: "./stub.txt"');
  });

  test('checks if destination folder exists', () => {
    const generator = new MetaGenerator('./template1-simple-interpolation');

    expect(
      () => generator.generate({ destination: './non-existing-folder', payload: {} }),
    ).toThrow('MetaGenerator: destination path does not exist: "./non-existing-folder"');
  });

  test('writes files to output', () => {
    const destination = './test_output';

    if (fs.existsSync(destination)) {
      fs.rmSync(destination, { force: true, recursive: true });
    }
    fs.mkdirSync(destination);

    const generator = new MetaGenerator('./template2-iteration-inclusion');
    generator.generate({
      destination,
      payload: {
        title: 'helloworld',
        persons: [{ name: 'romeo', isMusician: true }, { name: 'juliette' }],
        song: 'jingle bells',
      },
    });

    const outputTree = new FsTreeReader()
      .read(destination);

    const output = new TreeConverter().toObject(outputTree);

    fs.rmSync(destination, { force: true, recursive: true });

    expect(sortTreeRecursively(output)).toEqual(sortTreeRecursively(
      directory('test_output',
        file('musicians.hbs', 'helloworld\nromeo\njuliette\n'),
        directory('romeo notes',
          file('jingle bells.hbs', 'la-la-la!'),
        ),
      ),
    ));
  });
});
