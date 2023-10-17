import { describe, it, expect, spyOn, jest, afterAll, beforeAll } from 'bun:test';
import { ConditionNode, InterpolationNode, IterationNode, TextNode } from '..';
import { NodesParser } from './NodesParser';
import { HbsFlagNode } from '../nodes/HbsFlagNode';
import { logger } from '~/logger';


describe('NodesParser', () => {
  beforeAll(() => {
    spyOn(logger, 'error').mockImplementation(jest.fn());
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  const nodesParser = new NodesParser();

  describe('parseName()', () => {
    describe('validates expressions', () => {
      it.each(
        [
          '{a}',
          '{#includeif condition}',
          '{#each array}',
          '{skillName}',
          '{obj.arr[0].value}',
          '{#hbs}gg'
        ]
      )('valid expression: "%s"', (name) => {
        expect(() => nodesParser.parse(name)).not.toThrow();
      });
      it.each(
        ['{42}', '{#abracadabra}']
      )('invalid expression: "%s"', (name) => {
        expect(() => nodesParser.parse(name)).toThrow();
      });
    });

    describe('return nodes of correct type', () => {
      it('TextNode for simple text node "42"', () => {
        const [node] = nodesParser.parse('42');
        expect(node).toBeInstanceOf(TextNode);
      });
  
      it('ConditionalNode for expressions "{#includeif condition}"', () => {
        const [node] = nodesParser.parse('{#includeif condition}');
        expect(node).toBeInstanceOf(ConditionNode);
      });
  
      it('InterpolationNode for expression "{value}"', () => {
        const [node] = nodesParser.parse('{value}');
        expect(node).toBeInstanceOf(InterpolationNode);
      });
  
      it('IterationNode for expression "{#each array}"', () => {
        const [node] = nodesParser.parse('{#each array}');
        expect(node).toBeInstanceOf(IterationNode);
      })
    });

    describe('returns correctly created nodes', () => {
      it('TextNode', () => {
        const [node] = nodesParser.parse('42') as TextNode[];
        expect(node.text).toBe('42');
      });

      it('ConditionNode', () => {
        const [node] = nodesParser.parse('{#includeif condition}') as ConditionNode[];
        expect(node.checkCondition({ condition: true })).toBe(true);
      });

      it('InterpolationNode', () => {
        const [node] = nodesParser.parse('{value}') as InterpolationNode[];
        node.interpolate({ value: '77' });
        expect(node.text).toBe('77');
      });

      it('IterationNode', () => {
        const [node] = nodesParser.parse('{#each table.persons}') as IterationNode[];
        expect(node.iterator).toBe('table.persons');
      });
    });

    it('parses complex names', () => {
      const [hbs, iteration, condition, interpolation, text] = nodesParser.parse('{#hbs}{#each persons}{#includeif musician}{name}42');
      expect(hbs).toBeInstanceOf(HbsFlagNode);
      expect(iteration).toBeInstanceOf(IterationNode);
      expect(condition).toBeInstanceOf(ConditionNode);
      expect(interpolation).toBeInstanceOf(InterpolationNode);
      expect(text).toBeInstanceOf(TextNode);
    });
  });


});