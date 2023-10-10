import fs from 'node:fs';
import { join } from 'node:path';
import { AbstractMetaTemplate } from './AbstractMetaTemplate';
import { FileMetaTemplate } from './FileMetaTemplate';
import { DirectoryNode } from '~/fileTree';
import { JsonObject } from '~/json';

/**
 * Implements meta template for folders.
 * Generates list of folders to creates, renders file meta templates in it.
 */
export class FolderMetaTemplate extends AbstractMetaTemplate {
  public render(payload: JsonObject): DirectoryNode {
    const output = new DirectoryNode(this.folder, this.name);
    const directory = join(this.folder, this.name);
    
    this.getInstances(payload).forEach(({ name, payload: instancePayload }) => {
      const currentFolder = join(this.folder, name);

      fs.readdirSync(directory).forEach((templateFilename) => {
        if (fs.statSync(join(directory, templateFilename)).isDirectory()) {
          const directoryTemplate = new FolderMetaTemplate(currentFolder, templateFilename);
          output.addNodes(...directoryTemplate.render(instancePayload))
        } else {
          const fileTemplate = new FileMetaTemplate(currentFolder, templateFilename);
          output.addNodes(...fileTemplate.render(instancePayload));
        }
      });
    });

    return output;
  }
}
