import { PayloadUtil } from '../../PayloadUtil';
import type { PayloadObject } from '../../Payload';
import type { ITextNode } from './ITextNode';

/**
 * Interpolates name from the given payload
 * @example '{value}'
 */
export class InterpolationNode implements ITextNode {
  constructor(
    private readonly path: string,
  ) {}

  private interpolatedText: string | null = null;

  public interpolate(payload: PayloadObject) {
    this.interpolatedText = String(PayloadUtil.getValue(payload, this.path));
  }

  public get text() {
    if (this.interpolatedText === null) {
      throw new Error('InterpolationNode: payload value was not provided');
    }
    return this.interpolatedText;
  }
}
