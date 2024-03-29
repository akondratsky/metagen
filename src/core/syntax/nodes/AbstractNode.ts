import { ConditionNode } from './ConditionNode.js';
import { TemplatingFlagNode } from './TemplatingFlagNode.js';
import { InterpolationNode } from './InterpolationNode.js';
import { IterationNode } from './IterationNode.js';
import { TextNode } from './TextNode.js';

export type AbstractNode = TemplatingFlagNode | ConditionNode | InterpolationNode | IterationNode | TextNode;
