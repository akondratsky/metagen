import { Payload } from '../payload/Payload';
import { ITextNode } from './ITextNode';

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
    this.interpolatedText = String(payload.getValue(this.path));
  }

  public get text() {
    if (this.interpolatedText === null) {
      throw new Error('InterpolationNode: payload value was not provided');
    }
    return this.interpolatedText;
  }
}
