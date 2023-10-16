import { FsTreeReader } from './FsTreeReader';
import { JsonObject, MetaTemplateCore, Tree } from './core';

export class MetaGenerator {
  constructor(
    private readonly templatePath: string,
  ) {}

  private readonly fsTreeReader = new FsTreeReader();
  private outputs: Tree[] = [];
  

  public generate(dest: string, payload: JsonObject) {
    const templateTree = this.fsTreeReader.read(this.templatePath);
    const template = new MetaTemplateCore(templateTree);
    const output = template.renderTree(payload);
    console.log(output);
  }
}