import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { Tree } from './core/Tree.js';

export class FsTreeReader {
  public read(filePath: string): Tree {
    if (!existsSync(filePath)) {
      throw new Error(`FsTreeReader: "${filePath}" does not exist`);
    }

    const { base: name } = path.parse(filePath);

    const isDirectory = statSync(filePath).isDirectory();

    if (isDirectory) {
      const directory = new Tree.Directory(name);
      readdirSync(filePath).forEach((childPath) => {
        directory.children.push(
          this.read(path.join(filePath, childPath)),
        );
      });
      return directory;
    } else {
      const file = new Tree.File(name);
      file.content = readFileSync(filePath);
      return file;
    }
  }
}
