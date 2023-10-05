const SINGLE_OPEN = '\\{';
const SINGLE_CLOSE = '\\}';
const TEXT_SYMBOLS = '[^\\}\\{]+';
const DOUBLE_OPEN = '\\{\\{';
const DOUBLE_CLOSE = '\\}\\}';
const NODE = '(' + SINGLE_OPEN + TEXT_SYMBOLS + SINGLE_CLOSE + ')';
const TEXT = '(' + TEXT_SYMBOLS + '|' + DOUBLE_OPEN + '|' + DOUBLE_CLOSE + ')+';
const LEXIS = NODE + '|' + TEXT + '|' + SINGLE_OPEN + '|' + SINGLE_CLOSE;

const lexis = new RegExp(LEXIS, 'g');
const nodeRegex = new RegExp(NODE, 'g');
const unpairedTokenRegex = new RegExp('^(' + SINGLE_OPEN + '|' + SINGLE_CLOSE + ')$');


/**
 * @typedef {Object} Sequence
 * @property {string} token
 * @property {boolean} isNode
 * 
 * @param {string} name
 * @returns {Sequence[]}
 */
export const parseTemplateName = (name) => {
  const result = name.match(lexis).map((token) => {
    if (unpairedTokenRegex.test(token)) {
      throw new Error('');
    }

    const isNode = nodeRegex.test(token);
    return {
      token: isNode
        ? token.substring(1, token.length - 1)
        : token.replaceAll('{{', '{').replaceAll('}}', '}'),
      isNode
    };
  });

  return result;
};
