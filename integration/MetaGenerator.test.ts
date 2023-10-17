import { MetaGenerator } from '~/MetaGenerator';
import { describe, test, expect, spyOn, jest } from 'bun:test';
import { file } from './fixtures';
import { logger } from '~/logger';

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


});