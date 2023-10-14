import { FileTreeObject } from '~/FileTreeObject';
import { JsonObject } from '~/json';
import { AbstractFileTreeNode } from '~/fileTree/AbstractFileTreeNode';
import { AbstractMetaTemplate } from './AbstractMetaTemplate';
import fs from 'node:fs';
import { DirectoryMetaTemplate } from '.';
import { FileMetaTemplate } from './FileMetaTemplate';
import { DirectoryNode } from '~/fileTree';
import { join } from 'node:path';

export class MetaTemplate {
  constructor(
    private readonly templatePath: string,
  ) {}

  private isDirectory(filePath: string) {
    return fs.statSync(filePath).isDirectory();
  }

  public renderToJson(payload: JsonObject): FileTreeObject[] {
    const nodes = this.renderToNodes(payload);
    return nodes.map(n => n.toJson());
  }

  public renderToNodes(payload: JsonObject): AbstractFileTreeNode[] {
    const nodes: AbstractFileTreeNode[] = [];
    const outputDir = '.';

    if (this.isDirectory(this.templatePath)) {
      fs.readdirSync(this.templatePath).forEach((templateName) => {
        const MetaTemplateImpl = this.isDirectory(join(this.templatePath, templateName))
          ? DirectoryMetaTemplate
          : FileMetaTemplate;
        const template = new MetaTemplateImpl(this.templatePath, templateName);
        nodes.push(...template.renderToNodes(outputDir, payload));
      });
    } else {
      const template = new FileMetaTemplate('.', this.templatePath);
      nodes.push(...template.renderToNodes(outputDir, payload));
    }

    return nodes;
  }
}