import { join } from 'node:path';
import fs from 'node:fs';
import hbs from 'handlebars';
import { FileNode } from '~/fileTree';
import { AbstractMetaTemplate } from './AbstractMetaTemplate';

export class FileMetaTemplate extends AbstractMetaTemplate {
  public render(): FileNode[] {
    const renderTemplate = hbs.compile(fs.readFileSync(join(this.folder, this.name), 'utf-8'));

    return this.getInstances().map(({ name, payload }) => {
      const file = new FileNode(this.folder, name);
      file.content = renderTemplate(payload.getValue());
      return file;
    });
  }
}
