import fs from 'node:fs';
import { join } from 'node:path';
import { AbstractMetaTemplate } from './AbstractMetaTemplate';
import { FileMetaTemplate } from './FileMetaTemplate';
import { DirectoryNode } from '~/fileTree';

/**
 * Implements meta template for folders.
 * Generates list of folders to creates, renders file meta templates in it.
 */
export class FolderMetaTemplate extends AbstractMetaTemplate {
  public render(): DirectoryNode {
    const output = new DirectoryNode(this.folder, this.name);
    const directory = join(this.folder, this.name);
    
    this.getInstances().forEach(({ name, payload }) => {
      const currentFolder = join(this.folder, name);

      fs.readdirSync(directory).forEach((templateFilename) => {
        if (fs.statSync(join(directory, templateFilename)).isDirectory()) {
          const directoryTemplateOutput = new FolderMetaTemplate(currentFolder, templateFilename, payload).render();
          output.addNodes(directoryTemplateOutput)
        } else {
          const files = new FileMetaTemplate(currentFolder, templateFilename, payload).render();
          output.addNodes(...files);
        }
      });
    });

    return output;
  }
}
