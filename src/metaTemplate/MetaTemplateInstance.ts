import { Payload } from '~/payload';

/**
 * Instances are created by meta templates after parsing MetaGen syntax
 */
export class MetaTemplateInstance {
  constructor(
    public name: string,
    public payload: Payload,
  ) {}
}
