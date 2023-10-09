import { get, merge } from 'lodash';
import type { PayloadObject, PayloadValue } from './types';

/**
 * Template payload used to render filenames from meta templates and files content from templates
 */
export class Payload {
  constructor(
    private readonly payload: PayloadObject | Payload
  ) { }

  public getValue(path?: string): PayloadValue {
    return path
      ? get(this.payload, path)
      : this.payload;
  }


  public getPayloads(path: string): Array<Payload> {
    const list = get(this.payload, path);
    if (!Array.isArray(list)) {
      throw new Error(`Payload value by path "${path}" is not array`);
    }
    return list.map(p => new Payload(p));
  }

  /** Returns result of merging current payload with another */
  public merge(payload: Payload): Payload {
    return new Payload(merge(this.getValue(), payload.getValue() as PayloadObject));
  }
}


