import { AbstractNode } from './AbstractNode';

/**
 * Allows to create multiple files from the given payload
 * @example '{#each modules}'
 */
export class IterationNode {
  constructor(
    private readonly path: string,
  ) {}

  get iterator() {
    return this.path;
  }
}