import path from 'node:path';
import { Tree } from './Tree.js';
import { TreeDirectory, TreeFile, TreeObject } from './TreeObject.js';


type ObjectResult<T extends Tree | Tree[]> = T extends Tree ? TreeObject : TreeObject[];


export class TreeConverter {
  public toObject<T extends Tree | Tree[]>(
    trees: T,
  ): ObjectResult<T> {
    if (Array.isArray(trees)) {
      return trees.map(tree => this.toObject(tree)) as ObjectResult<T>;
    }

    if (trees.isDirectory) {
      return {
        isDirectory: true,
        name: trees.name,
        children: trees.children.map(child => this.toObject(child)),
      } as TreeDirectory as ObjectResult<T>;
    } else {
      return {
        isDirectory: false,
        name: trees.name,
        content: trees.content,
      } as TreeFile as ObjectResult<T>;
    }
  }


  public toList(trees: Tree[], destination: string): string[] {
    const getFiles = (tree: Tree, destination: string): string[] => {
      const currentPath = path.join(destination, tree.name);
      const files = [];
      if (tree.isDirectory) {
        files.push(currentPath + path.sep);
        tree.children.forEach((child) => {
          files.push(...getFiles(child, currentPath));
        });
      } else {
        files.push(currentPath);
      }
      return files;
    };

    return trees.reduce((list, tree) => {
      list.push(...getFiles(tree, destination));
      return list;
    }, [] as string[]);
  }
}
