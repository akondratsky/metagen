import { FsTreeReader } from './FsTreeReader';
import { PayloadObject, MetaTemplateCore, Tree } from './core';
import fs from 'node:fs';
import path from 'node:path';
import { logger } from './logger';
import { TreeConverter } from './core/TreeConverter';
import { TreeObject } from './core/TreeObject';

type Options = {
  /** output folder */
  destination: string;
  /** payload (context) to render templates in JSON format */
  payload: PayloadObject;
  /** dry run mode */
  isDryRun?: boolean;
  /** enable debugging mode (detailed output) */
  isVerbose?: boolean;
  /** disable console output */
  isSilent?: boolean;
};

type Output = {
  trees: Tree[];
  json: TreeObject[];
};


export class MetaGenerator {
  constructor(
    /** Meta template folder */
    private readonly templatePath: string,
  ) {}

  private readonly fsTreeReader = new FsTreeReader();
  private readonly treeConverter = new TreeConverter();

  private error(msg: string) {
    logger.error(msg);
    return new Error(msg);
  }

  public generate({ destination, payload, isDryRun, isVerbose, isSilent }: Options): Output {
    logger.isVerbose = isVerbose ?? false;
    logger.isSilent = isSilent ?? false;

    if (!fs.existsSync(destination)) {
      throw this.error(`MetaGenerator: destination path does not exist: "${destination}"`);
    }

    if (!fs.statSync(destination).isDirectory()) {
      throw this.error(`MetaGenerator: destination path is not a folder: "${destination}"`);
    }

    const templateTree = this.fsTreeReader.read(this.templatePath);
    const template = new MetaTemplateCore(templateTree);
    const trees = template.renderTree(payload);
    const json = this.treeConverter.toObject(trees);
    const files = this.treeConverter.toList(trees, destination);

    logger.info('Next files will be created:\n');
    files.forEach(logger.info);

    if (!isDryRun) {
      logger.debug('writing result to the disk');
      trees.forEach(output => this.writeTree(output, destination));
    }

    return { trees, json };
  }


  protected writeTree(node: Tree, destination: string) {
    const filename = path.join(destination, node.name);
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
