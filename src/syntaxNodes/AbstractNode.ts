import { ConditionNode } from './ConditionNode';
import { InterpolationNode } from './InterpolationNode';
import { IterationNode } from './IterationNode';
import { TextNode } from './TextNode';

export type AbstractNode = ConditionNode | InterpolationNode | IterationNode | TextNode;
