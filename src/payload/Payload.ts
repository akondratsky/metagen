import { get, merge } from 'lodash';
import type { JsonObject, JsonValue } from '~/json';

/**
 * Template payload used to render filenames from meta templates and files content from templates
 */
export class Payload {
  constructor(
    private readonly payload: JsonObject | Payload
  ) {
    if (typeof payload !== 'object') {
      throw new Error(`Incorrect payload type: ${payload}`);
    }
    this.payload = structuredClone(payload instanceof Payload ? payload.getValue() as JsonObject : payload);
  }

  public getValue(path?: string): JsonValue {
    return path
      ? get(this.payload, path)
      : this.payload;
  }


  public getPayloads(path: string): Array<Payload> {
    const list = get(this.payload, path);
    if (!Array.isArray(list)) {
      throw new Error(`Payload value by path "${path}" is not array`);
    }
    return list.map(payload => new Payload(payload as JsonObject));
  }

  /** Returns result of merging current payload with another */
  public merge(payload: Payload): Payload {
    return new Payload(merge(
      structuredClone(this.getValue()),
      structuredClone(payload.getValue()
    ) as JsonObject));
  }
}


