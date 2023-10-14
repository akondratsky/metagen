import { join } from 'node:path';
import type { JsonObject } from '~/json';

type FilePath = {
  dir: string;
  name: string;
};

type MetaTemplateInstanceParams = {
  template: FilePath;
  output: FilePath;
  payload: JsonObject;
}

/**
 * Instances are created by meta templates after parsing MetaGen syntax
 */
export class MetaTemplateInstance {
  constructor(params: MetaTemplateInstanceParams) {
    this.template = params.template;
    this.output = params.output;
    this.payload = params.payload;
  }

  public readonly template: FilePath;
  public readonly output: FilePath;
  public readonly payload: JsonObject;

  public get outputPath() {
    return join(this.output.dir, this.output.name);
  }
}
