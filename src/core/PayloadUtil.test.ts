import { PayloadUtil } from './PayloadUtil.js';
import { describe, it, expect } from 'bun:test';

describe('PayloadUtil', () => {
  describe('getValue()', () => {
    it('returns value by path', () => {
      const payload = { a: { b: { c: 42 } } };
      expect(PayloadUtil.getValue(payload, 'a.b')).toEqual(payload.a.b);
    });

    it('returns cloned value', () => {
      const payload = { a: { b: { c: 42 } } };
      expect(PayloadUtil.getValue(payload, 'a.b')).not.toBe(payload.a.b);
    });
  });

  describe('getPayloads()', () => {
    it('throws an error if value by path is not an array', () => {
      const payload = { a: 'value' };
      expect(() => PayloadUtil.getPayloads(payload, 'a')).toThrow();
    });

    it('not throws an error if one of value in the array by path is not an object', () => {
      const payload = { a: ['value'] };
      expect(() => PayloadUtil.getPayloads(payload, 'a')).not.toThrow();
    });

    it('returns array of payloads by path', () => {
      const payload = { a: [{ b: 1 }, { b: 2 }] };
      expect(PayloadUtil.getPayloads(payload, 'a')).toEqual(payload.a);
    });

    it('returns cloned parts of the payload', () => {
      const payload = { a: [{ b: 1 }, { b: 2 }] };
      const payloads = PayloadUtil.getPayloads(payload, 'a');
      expect(payloads).not.toBe(payload.a);
      expect(payloads[0]).not.toBe(payload.a[0]);
    });
  });

  describe('merge()', () => {
    it('merges two payloads', () => {
      const payloadA = { a: 'a', c: 42 };
      const payloadB = { b: 'b', c: 42 };
      const merged = PayloadUtil.merge(payloadA, payloadB);
      expect(merged).toEqual({ a: 'a', b: 'b', c: 42 });
    });

    it('returns new object', () => {
      const payloadA = { a: 'a', c: 42 };
      const payloadB = { b: 'b', c: 42 };
      const merged = PayloadUtil.merge(payloadA, payloadB);
      expect(merged).not.toBe(payloadA);
      expect(merged).not.toBe(payloadB);
    });
  });

  describe('clone()', () => {
    it('returns copy of an object', () => {
      const payload = { a: 42 };
      const cloned = PayloadUtil.clone(payload);
      expect(cloned).not.toBe(payload);
      expect(cloned).toEqual(payload);
    });
  });
});
