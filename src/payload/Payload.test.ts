import { Payload } from './Payload';
import { describe, it, expect } from 'bun:test';

describe('Payload', () => {
  describe('getValue()', () => {
    it('returns root value if path is not provided', () => {
      const testObject = { a: 42 };
      const payload = new Payload(testObject);
      expect(payload.getValue()).toEqual(testObject);
    });

    it('clones payload in constructor', () => {
      const testObject = { a: 42 };
      const payload = new Payload(testObject);
      expect(payload.getValue()).not.toBe(testObject);
    });

    it('returns value by path', () => {
      const testObject = {
        a: 42,
        b: { c: 'test_string' }
      };
      const payload = new Payload(testObject);
      expect(payload.getValue('b.c')).toBe('test_string');
    });
  });

  describe('getPayloads()', () => {
    it('returns array of payloads by path', () => {
      const testObject = {
        persons: [
          { name: 'a' },
          { name: 'b' },
        ],
      };
      const payloads = new Payload(testObject).getPayloads('persons');
      expect(payloads).toBeArrayOfSize(2);
      expect(payloads[0].getValue()).toEqual(testObject.persons[0]);
      expect(payloads[1].getValue()).toEqual(testObject.persons[1]);
    });

    it('throws an error if value is not array', () => {
      const testObject = { persons: 'text_value' };
      const payload = new Payload(testObject);
      expect(() => payload.getPayloads('persons')).toThrow();
    });
  });

  describe('merge()', () => {
    it('returns two merged payloads', () => {
      const payloadA = new Payload({ a: 'value1' });
      const payloadB = new Payload({ b: 'value2' });
      expect(payloadA.merge(payloadB).getValue()).toEqual({
        a: 'value1',
        b: 'value2',
      });
    });
  });
});