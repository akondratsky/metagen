import { join } from 'node:path';
import fs from 'node:fs';
import hbs from 'handlebars';
import { FileNode } from '~/fileTree';
import { JsonObject } from '~/json';
import { AbstractMetaTemplate } from './AbstractMetaTemplate';

export class FileMetaTemplate extends AbstractMetaTemplate {
  public render(payload: JsonObject): FileNode[] {
    const renderTemplate = hbs.compile(fs.readFileSync(join(this.folder, this.name), 'utf-8'));

    return this.getInstances(payload).map(({ name, payload: instancePayload }) => {
      const file = new FileNode(this.folder, name);
      file.content = renderTemplate(instancePayload);
      return file;
    });
  }
}
