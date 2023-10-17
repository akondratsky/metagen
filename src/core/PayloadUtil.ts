import get from 'lodash/get';
import merge from 'lodash/merge';

import { JsonObject, JsonValue } from './json';

export const PayloadUtil = {
  /** Returns value from payload by path */
  getValue(payload: JsonObject, path: string): JsonValue {
    return structuredClone(get(payload, path));
  },

  /** Return array of payloads, taken from current payload by path */
  getPayloads(payload: JsonObject, path: string): JsonValue[] {
    const payloads = get(payload, path);
    if (!Array.isArray(payloads)) {
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

