import { ITextNode } from './ITextNode.js';

/**
 * Regular text node
 * @example 'filename.ext'
 */
export class TextNode implements ITextNode {
  constructor(
    public readonly text: string,
  ) {}
}
