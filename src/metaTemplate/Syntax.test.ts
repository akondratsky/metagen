import { Syntax } from './Syntax';
import { describe, test, expect } from 'bun:test';

describe('Syntax', () => {
  describe('parseNameTokens', () => {
    test.each([
      [
        '{a}{{b}}',
        [
          { token: 'a', isExpression: true },
          { token: '{b}', isExpression: false },
        ]
      ],
      [
        '{{{a}}}',
        [
          { token: '{', isExpression: false },
          { token: 'a', isExpression: true },
          { token: '}', isExpression: false }
        ]
      ],
      [
        '{a}',
        [{ token: 'a', isExpression: true }],
      ],
      [
        '{{a',
        [{ token: '{a', isExpression: false }]
      ],
    ])('splits "%s"', (input, expected) => {
      const actual = Syntax.parseNameTokens(input);
      expect(actual).toEqual(expected);
    });

    test.each([
      '{a',
      '{a{a}',
      'aaa}}}',
      '{abc{sfd}as}'
    ])('throws an error for "%s"', (input) => {
      expect(() => Syntax.parseNameTokens(input)).toThrow();
    });
  });

  describe('parseName', () => {

  });
});