/**
 * @fileoverview
 * Why did I put all the methods (both for files and content) into the root Tree class? In the TypeScript language
 * there is no method overrides which may implement different methods for different argument types. It means, that we
 * need to figure out the type of out object and switch methods manually. 
 */
import { JsonObject } from '~/core/json';

export class Tree {
  constructor(
    public name: string,
    public readonly isDirectory: boolean,
  ) {}

  #children: Tree[] = [];
  #content: string = '';

  public static Directory = class TreeDirectory extends Tree {
    constructor (name: string) {
      super(name, true);
    }
  }

  public static File = class TreeFile extends Tree {
    constructor (name: string) {
      super(name, false);
    }
  }

  public static TypeError = class NodeTypeError extends Error {
    constructor(node: Tree) {
      super(`Incorrect operation: ${node.name} is a ${node.isDirectory ? 'directory' : 'file'}`);
    }
  }

  public get children() {
    if (!this.isDirectory) {
      throw new Tree.TypeError(this);
    }
    return this.#children;
  }

  public set children(children: Tree[]) {
    if (!this.isDirectory) {
      throw new Tree.TypeError(this);
    }
    this.#children = children;
  }

  public set content(content: string) {
    if (this.isDirectory) {
      throw new Tree.TypeError(this);
    }
    this.#content = content;
  }

  public get content(): string {
    if (this.isDirectory) {
      throw new Tree.TypeError(this);
    }
    return this.#content;
  }

  public toJson(): JsonObject {
    return {
      isDirectory: this.isDirectory,
      name: this.name,
      ...(this.isDirectory ? {
        children: this.children.map(child => child.toJson()),
      } : {
        content: this.content,
      }),
    }
  }
}
