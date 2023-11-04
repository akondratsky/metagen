import type { PayloadObject } from '../../Payload';
import { PayloadUtil } from '../../PayloadUtil';

/**
 * Includes or excludes file from the output using the boolean value
 * @example '{#includeif isPublic}'
 */
export class ConditionNode {
  constructor(
    private readonly path: string,
  ) {}

  public checkCondition(payload: PayloadObject) {
    return Boolean(PayloadUtil.getValue(payload, this.path));
  }
}
