import { container } from 'tsyringe';
import { describe, it, expect } from 'bun:test';
import { ConditionNode, InterpolationNode, IterationNode, TextNode } from '~/syntaxNodes';
import { NodesParser } from './NodesParser';
import { Payload } from '~/payload';

describe('NodesParser', () => {
  const nodesParser = container.resolve(NodesParser);

  describe('parseName()', () => {
    describe('validates expressions', () => {
      it.each(
        ['{a}', '{#if condition}', '{#each array}', '{skillName}']
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
  
      it('ConditionalNode for expressions "{#if condition}"', () => {
        const [node] = nodesParser.parse('{#if condition}');
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
        const [node] = nodesParser.parse('{#if condition}') as ConditionNode[];
        const payload = new Payload({ condition: true });
        expect(node.checkCondition(payload)).toBe(true);
      });

      it('InterpolationNode', () => {
        const [node] = nodesParser.parse('{value}') as InterpolationNode[];
        const payload = new Payload({ value: '77' });
        node.interpolate(payload);
        expect(node.text).toBe('77');
      });

      it('IterationNode', () => {
        const [node] = nodesParser.parse('{#each table.persons}') as IterationNode[];
        expect(node.iterator).toBe('table.persons');
      });
    });

    it('parses complex names', () => {
      const [iteration, condition, interpolation, text] = nodesParser.parse('{#each persons}{#if musician}{name}42');
      expect(iteration).toBeInstanceOf(IterationNode);
      expect(condition).toBeInstanceOf(ConditionNode);
      expect(interpolation).toBeInstanceOf(InterpolationNode);
      expect(text).toBeInstanceOf(TextNode);
    });
  });


});