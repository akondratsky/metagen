import { MetaGenerator } from '~/MetaGenerator';
import { describe, test, expect, spyOn, jest } from 'bun:test';
import { directory, file } from './fixtures';
import { logger } from '~/logger';
import fs from 'node:fs';
import { FsTreeReader } from '~/FsTreeReader';


spyOn(logger, 'error').mockImplementation(jest.fn());

process.chdir(import.meta.dir);

describe('MetaGenerator', () => {
  test('generates json output', () =>{
    const generator = new MetaGenerator('./template1');
    const outputs = generator.generate({
      destination: '.',
      payload: { person: 'john' },
      isDryRun: true,
    });

    expect(outputs.json).toEqual([
      file('john.hbs', 'john content'),
      file('file.hbs', ''),
    ]);
  });

  test('checks if destination is a folder', () => {
    const generator = new MetaGenerator('./template1');
    expect(
      () => generator.generate({ destination: './fixtures.ts', payload:  {} })
    ).toThrow('MetaGenerator destination path is not a folder: ./fixtures.ts');
  });

  test('checks if destination folder exists', () => {
    const generator = new MetaGenerator('./template1');

    expect(
      () => generator.generate({ destination: './non-existing-folder', payload:  {} })
    ).toThrow('MetaGenerator destination path does not exist: ./non-existing-folder')
  });

  test('writes files to output', () => {
    const destination = './test_output';

    if (fs.existsSync(destination)) {
      fs.rmSync(destination, { force: true, recursive: true });
    }
    fs.mkdirSync(destination);

    const generator = new MetaGenerator('./template2');
    generator.generate({
      destination,
      payload: {
        title: 'helloworld',
        persons: [{ name: 'romeo', isMusician: true }, { name: 'juliette' }],
        song: 'jingle bells',
      },
    });

    const output = new FsTreeReader()
      .read(destination)
      .toJson();

    fs.rmSync(destination, { force: true, recursive: true });

    expect(output).toEqual(
      directory('test_output',
        file('musicians.hbs', 'helloworld\nromeo\njuliette\n'),
        directory('romeo notes', 
          file('jingle bells.hbs', 'la-la-la!'),
        ),
      ),
    );
  });
});