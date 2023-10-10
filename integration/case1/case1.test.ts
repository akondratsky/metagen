import { FolderMetaTemplate } from '~/metaTemplate';
import { describe, it } from 'bun:test';
import { join } from 'node:path';
import { Payload } from '~/payload';

describe('integration test case #1', () => {
  it('works', () => {
    const template = new FolderMetaTemplate(import.meta.dir, 'template', new Payload({
      person: 'ivan'
    }));

    const files = template.render();

  });
});