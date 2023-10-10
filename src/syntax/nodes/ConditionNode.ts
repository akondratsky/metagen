import { JsonObject } from '~/json';
import { PayloadUtil } from '~/PayloadUtil';

/**
 * Includes or excludes file from the output using the boolean value
 * @example '{#include isPublic}'
 */
export class ConditionNode {
  constructor(
    private readonly path: string,
  ) {}

  public checkCondition(payload: JsonObject) {
    return Boolean(PayloadUtil.getValue(payload, this.path));
  }
}