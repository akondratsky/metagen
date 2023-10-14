import { join } from 'node:path';
import fs from 'node:fs';
import hbs from 'handlebars';
import { FileNode } from '~/fileTree';
import { JsonObject } from '~/json';
import { FileObject } from '~/FileTreeObject';
import { AbstractMetaTemplate } from './AbstractMetaTemplate';

export class FileMetaTemplate extends AbstractMetaTemplate {
  public renderToNodes(outputDir: string, payload: JsonObject): FileNode[] {
    const renderTemplate = hbs.compile(fs.readFileSync(join(this.directory, this.name), 'utf-8'));

    return this.getInstances(outputDir, payload).map(({ template, output, payload: filePayload }) => {
      const file = new FileNode(output.dir, output.name);
      file.content = renderTemplate(filePayload);
      return file;
    });
  }

  public renderToJson(outputDir: string, payload: JsonObject): FileObject[] {
    return this.renderToNodes(outputDir, payload)
      .map(node => node.toJson());
  }
}
