import { get, merge } from 'lodash';
import type { PayloadObject, PayloadValue } from './types';

/**
 * Template payload used to render filenames from meta templates and files content from templates
 */
export class Payload {
  constructor(
    private readonly payload: PayloadObject | Payload
  ) {
    if (typeof payload !== 'object') {
      throw new Error(`Incorrect payload type: ${payload}`);
    }
    this.payload = structuredClone(payload instanceof Payload ? payload.getValue() as PayloadObject : payload);
  }

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
    return list.map(payload => new Payload(payload as PayloadObject));
  }

  /** Returns result of merging current payload with another */
  public merge(payload: Payload): Payload {
    return new Payload(merge(
      structuredClone(this.getValue()),
      structuredClone(payload.getValue()
    ) as PayloadObject));
  }
}


