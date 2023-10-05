import { describe, test, expect } from 'bun:test';
import { parseTemplateName } from './parseTemplateName';

describe('parseTemplateName', () => {
  test.each([
    [
      '{a}{{b}}',
      [
        { token: 'a', isNode: true },
        { token: '{b}', isNode: false },
      ]
    ],
    [
      '{{{a}}}',
      [
        { token: '{', isNode: false },
        { token: 'a', isNode: true },
        { token: '}', isNode: false }
      ]
    ],
    [
      '{a}',
      [{ token: 'a', isNode: true }],
    ],
    [
      '{{a',
      [{ token: '{a', isNode: false }]
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
