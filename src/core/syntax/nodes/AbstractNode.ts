import { ConditionNode } from './ConditionNode';
import { CopyFlagNode } from './CopyFlagNode';
import { InterpolationNode } from './InterpolationNode';
import { IterationNode } from './IterationNode';
import { TextNode } from './TextNode';

export type AbstractNode =  CopyFlagNode | ConditionNode | InterpolationNode | IterationNode | TextNode;
