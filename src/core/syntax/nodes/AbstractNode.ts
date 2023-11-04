import { ConditionNode } from './ConditionNode';
import { TemplatingFlagNode } from './TemplatingFlagNode';
import { InterpolationNode } from './InterpolationNode';
import { IterationNode } from './IterationNode';
import { TextNode } from './TextNode';

export type AbstractNode = TemplatingFlagNode | ConditionNode | InterpolationNode | IterationNode | TextNode;
