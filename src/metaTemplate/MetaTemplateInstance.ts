import type { JsonObject } from '~/json';

/**
 * Instances are created by meta templates after parsing MetaGen syntax
 */
export class MetaTemplateInstance {
  constructor(
    public name: string,
    public payload: JsonObject,
  ) {}
}
