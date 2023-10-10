import { TokensParser } from './TokensParser';
import { describe, test, expect } from 'bun:test';

describe('TokenParser', () => {
  const tokenParser = new TokensParser();
  describe('parse()', () => {
    test('splits "{#each persons}{#include musician}{name}42"', () => {
      const actual = tokenParser.parse('{#each persons}{#include musician}{name}42');
      expect(actual).toEqual([
        { token: '#each persons', isExpression: true },
        { token: '#include musician', isExpression: true },
        { token: 'name', isExpression: true },
        { token: '42', isExpression: false },
      ]);
    });

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
      [
        '{skillName}',
        [{ token: 'skillName', isExpression: true }]
      ]
    ])('splits "%s"', (input, expected) => {
      const actual = tokenParser.parse(input);
      expect(actual).toEqual(expected);
    });

    test.each([
      '{a',
      '{a{a}',
      'aaa}}}',
      '{abc{sfd}as}'
    ])('throws an error for "%s"', (input) => {
      expect(() => tokenParser.parse(input)).toThrow();
    });
  });
});