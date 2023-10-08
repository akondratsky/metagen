import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import { compile } from 'handlebars';
import { AbstractMetaTemplate } from './AbstractMetaTemplate';

export class FileMetaTemplate extends AbstractMetaTemplate {
  public render() {
    const template = compile(readFileSync(join(this.folder, this.name), 'utf-8'));
    const instances = this.getInstances();
    // TODO: create files here
  }
}