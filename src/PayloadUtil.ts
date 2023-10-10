import { get, merge } from 'lodash';
import { JsonObject, JsonValue } from '~/json';

export const PayloadUtil = {
  /** Returns value from payload by path */
  getValue(payload: JsonObject, path: string): JsonValue {
    return structuredClone(get(payload, path));
  },

  /** Return array of payloads, taken from current payload by path */
  getPayloads(payload: JsonObject, path: string): JsonObject[] {
    const payloads = get(payload, path);
    if (!Array.isArray(payloads) || payloads.some(pld => typeof pld !== 'object')) {
      throw new Error(`Payload value by path "${path}" is not array of objects:\n ${JSON.stringify(payloads)}`);
    }
    return structuredClone(payloads) as JsonObject[];
  },

  merge(payloadA: JsonObject, payloadB: JsonObject): JsonObject {
    return merge(
      structuredClone(payloadA),
      structuredClone(payloadB),
    ) as JsonObject;
  },

  clone(payload: JsonObject): JsonObject {
    return structuredClone(payload);
  },
} as const;

