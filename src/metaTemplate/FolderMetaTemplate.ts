import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { AbstractMetaTemplate } from './AbstractMetaTemplate';
import { FileMetaTemplate } from './FileMetaTemplate';

/**
 * Implements meta template for folders.
 * Generates list of folders to creates, renders file meta templates in it.
 */
export class FolderMetaTemplate extends AbstractMetaTemplate {
  public render() {
    const templateDirectory = join(this.folder, this.name);
    const childrenDirectories: string[] = [];
    const childrenFiles: string[] = [];

    readdirSync(templateDirectory).forEach((filename) => {
      statSync(filename).isDirectory()
        ? childrenDirectories.push(filename)
        : childrenFiles.push(filename);
    });
    
    this.getInstances().forEach(({ name, payload }) => {
      const currentFolder = join(this.folder, name);
      childrenDirectories.forEach((childDirectory) => {
        new FolderMetaTemplate(currentFolder, childDirectory, payload).render();
      });
      childrenFiles.forEach((childFilename) => {
        new FileMetaTemplate(currentFolder, childFilename, payload).render();
      });
    });
  }
}
