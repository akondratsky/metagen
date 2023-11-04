import { ITextNode } from './ITextNode';

/**
 * Regular text node
 * @example 'filename.ext'
 */
export class TextNode implements ITextNode {
  constructor(
    public readonly text: string,
  ) {}
}
