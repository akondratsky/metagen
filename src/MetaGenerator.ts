import { FsTreeReader } from '~/FsTreeReader';
import { JsonArray, JsonObject, MetaTemplateCore, Tree } from '~/core';
import fs from 'node:fs';
import { join } from 'node:path';
import { logger } from './logger';

type Options = {
  destination: string;
  payload: JsonObject;
  isDryRun?: boolean;
  isVerbose?: boolean;
};

type Output = {
  trees: Tree[];
  json: JsonObject[];
};


export class MetaGenerator {
  constructor(
    private readonly templatePath: string,
  ) {}

  private readonly fsTreeReader = new FsTreeReader();

  private error(msg: string) {
    logger.error(msg);
    return new Error(msg);
  }
  
  public generate({ destination, payload, isDryRun, isVerbose, }: Options): Output {
    logger.isVerbose = isVerbose ?? false;

    if (!fs.existsSync(destination)) {
      throw this.error(`MetaGenerator destination path does not exist: ${destination}`);
    }

    if (!fs.statSync(destination).isDirectory()) {
      throw this.error(`MetaGenerator destination path is not a folder: ${destination}`);
    }

    const templateTree = this.fsTreeReader.read(this.templatePath);
    const template = new MetaTemplateCore(templateTree);
    const trees = template.renderTree(payload);
    const json = Tree.toJson(trees) as JsonObject[];
    
    if (!isDryRun) {
      logger.debug(`writing result to the disk`);
      trees.forEach(output => this.writeTree(output, destination));
    }

    return { trees, json };
  }

  private writeTree(node: Tree, destination: string) {
    const filename = join(destination, node.name);
    logger.debug(`writing ${filename}`);
    
    if (node.isDirectory) {
      logger.debug(`creating directory ${filename}`);
      fs.mkdirSync(filename);
      node.children.forEach((child) => {
        this.writeTree(child, filename);
      });
    } else {
      logger.debug(`writing the file ${filename}`);
      fs.writeFileSync(filename, node.content);
    }
  }
}