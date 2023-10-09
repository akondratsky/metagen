import { FolderMetaTemplate } from '~/metaTemplate/FolderMetaTemplate';
import { describe, it } from 'bun:test';
import { join } from 'node:path';
import { Payload } from '~/payload';

describe.skip('Integration case #1', () => {
  it('works', () => {
    const template = new FolderMetaTemplate(join(__dirname, 'template'), '', new Payload({
      person: 'ivan'
    }));

    console.log(template.render());
  });
});