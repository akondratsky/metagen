import { JsonObject } from '~/json';
import { ITextNode } from './ITextNode';
import { PayloadUtil } from '~/PayloadUtil';

/**
 * Interpolates name from the given payload
 * @example '{value}'
 */
export class InterpolationNode implements ITextNode {
  constructor(
    private readonly path: string,
  ) {}

  private interpolatedText: string | null = null;

  public interpolate(payload: JsonObject) {
    this.interpolatedText = String(PayloadUtil.getValue(payload, this.path));
  }

  public get text() {
    if (this.interpolatedText === null) {
      throw new Error('InterpolationNode: payload value was not provided');
    }
    return this.interpolatedText;
  }
}
