import { join } from 'node:path';
import fs from 'node:fs';
import hbs from 'handlebars';
import { FileNode } from '~/fileTree';
import { JsonObject } from '~/json';
import { FileObject } from '~/FileTreeObject';
import { AbstractMetaTemplate } from './AbstractMetaTemplate';

export class FileMetaTemplate extends AbstractMetaTemplate {
  public renderToNodes(payload: JsonObject): FileNode[] {
    const renderTemplate = hbs.compile(fs.readFileSync(join(this.directory, this.name), 'utf-8'));

    return this.getInstances(payload).map(({ name, payload: instancePayload }) => {
      const file = new FileNode(this.directory, name);
      file.content = renderTemplate(instancePayload);
      return file;
    });
  }

  public renderToJson(payload: JsonObject): FileObject[] {
    return this.renderToNodes(payload)
      .map(node => node.toJson());
  }
}
