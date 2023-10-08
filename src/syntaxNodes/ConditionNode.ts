import { Payload } from '../Payload';
import { AbstractNode } from './AbstractNode';

/**
 * Includes or excludes file from the output using the boolean value
 * @example '{#if isPublic}'
 */
export class ConditionNode {
  constructor(
    private readonly path: string,
  ) {}

  public checkCondition(payload: Payload) {
    return true;
  }
}