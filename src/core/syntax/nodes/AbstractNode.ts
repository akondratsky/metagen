import { ConditionNode } from './ConditionNode';
import { HbsFlagNode } from './HbsFlagNode';
import { InterpolationNode } from './InterpolationNode';
import { IterationNode } from './IterationNode';
import { TextNode } from './TextNode';

export type AbstractNode =  HbsFlagNode | ConditionNode | InterpolationNode | IterationNode | TextNode;
