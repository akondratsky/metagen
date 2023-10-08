import { describe, test, expect } from 'bun:test';
import { parseTemplateName } from './parseTemplateName';

describe('parseTemplateName', () => {
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
    const actual = parseTemplateName(input);
    expect(actual).toEqual(expected);
  });

  test.each([
    '{a',
    '{a{a}',
    'aaa}}}',
    '{abc{sfd}as}'
  ])('throws an error for "%s"', (input) => {
    expect(() => parseTemplateName(input)).toThrow();
  });
});
