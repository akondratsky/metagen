import { Payload } from '../payload/Payload';
import { AbstractNode } from './AbstractNode';

/**
 * Includes or excludes file from the output using the boolean value
 * @example '{#include isPublic}'
 */
export class ConditionNode {
  constructor(
    private readonly path: string,
  ) {}

  public checkCondition(payload: Payload) {
    return Boolean(payload.getValue(this.path));
  }
}