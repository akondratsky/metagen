import fs from 'node:fs';
import { join, parse } from 'node:path';
import { AbstractMetaTemplate } from './AbstractMetaTemplate';
import { FileMetaTemplate } from './FileMetaTemplate';
import { DirectoryNode } from '~/fileTree';
import { JsonObject } from '~/json';
import { DirectoryObject, FileTreeObject } from '~/FileTreeObject';
import { AbstractFileTreeNode } from '~/fileTree/AbstractFileTreeNode';

/**
 * Implements meta template for folders.
 * Generates list of folders to creates, renders file meta templates in it.
 */
export class DirectoryMetaTemplate extends AbstractMetaTemplate {
  public renderToNodes(outputDir: string, payload: JsonObject): AbstractFileTreeNode[] {


    const resultNodes: AbstractFileTreeNode[] = [];    

    const templateDir = join(this.directory, this.name);
    const instances = this.getInstances(outputDir, payload);
    const childTemplateNames = fs.readdirSync(templateDir);

    instances.forEach((instance) => {
      const instanceDirectory = new DirectoryNode(instance.output.dir, instance.output.name);
    
      childTemplateNames.forEach((childTemplateName) => {
        const childTemplatePath = join(templateDir, childTemplateName);
        const isChildDirectory = fs.statSync(childTemplatePath).isDirectory();

        if (isChildDirectory) {
          const childTemplate = new DirectoryMetaTemplate(templateDir, childTemplateName);
          instanceDirectory.addNodes(
            ...childTemplate.renderToNodes(instance.outputPath, instance.payload),
          );
        } else {
          const fileTemplate = new FileMetaTemplate(templateDir, childTemplateName);
          const fileNodes = fileTemplate.renderToNodes(instance.outputPath, instance.payload)
          instanceDirectory.addNodes(...fileNodes);
        }
      });

      resultNodes.push(instanceDirectory);
    });

    return resultNodes;
  }

  public renderToJson(outputDir: string, payload: JsonObject): FileTreeObject[] {
    return this.renderToNodes(outputDir, payload).map(n => n.toJson());
  }
}
