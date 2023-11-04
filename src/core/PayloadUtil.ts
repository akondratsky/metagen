import get from 'lodash/get';
import merge from 'lodash/merge';

import { PayloadObject, PayloadValue } from './Payload';

export const PayloadUtil = {
  /** Returns value from payload by path */
  getValue(payload: PayloadObject, path: string): PayloadValue {
    return structuredClone(get(payload, path));
  },

  /** Return array of payloads, taken from current payload by path */
  getPayloads(payload: PayloadObject, path: string): PayloadValue[] {
    const payloads = get(payload, path);
    if (!Array.isArray(payloads)) {
      throw new Error(`Payload value by path "${path}" is not array of objects:\n ${JSON.stringify(payloads)}`);
    }
    return structuredClone(payloads) as PayloadObject[];
  },

  merge(payloadA: PayloadObject, payloadB: PayloadObject): PayloadObject {
    return merge(
      structuredClone(payloadA),
      structuredClone(payloadB),
    ) as PayloadObject;
  },

  clone(payload: PayloadObject): PayloadObject {
    return structuredClone(payload);
  },
} as const;
