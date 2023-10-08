import { Payload } from '../Payload';
import { ITextNode } from './ITextNode';
import { TextNode } from './TextNode';

/**
 * Interpolates name from the given payload
 * @example '{value}'
 */
export class InterpolationNode implements ITextNode {
  constructor(
    private readonly path: string,
  ) {}

  private interpolatedText: string | null = null;

  public interpolate(payload: Payload) {
    this.interpolatedText = ''
  }

  public get text() {
    if (this.interpolatedText === null) {
      throw new Error('InterpolationNode: payload value was not provided');
    }
    return this.interpolatedText;
  }
}
