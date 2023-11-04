export class Tree {
  constructor(
    public name: string,
    public readonly isDirectory: boolean,
  ) { }

  #children: Tree[] = [];
  #content: Buffer = Buffer.from([]);

  public static Directory = class TreeDirectory extends Tree {
    constructor(name: string) {
      super(name, true);
    }
  }

  public static File = class TreeFile extends Tree {
    constructor(name: string) {
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

  public set content(content: Buffer) {
    if (this.isDirectory) {
      throw new Tree.TypeError(this);
    }
    this.#content = content;
  }

  public get content(): Buffer {
    if (this.isDirectory) {
      throw new Tree.TypeError(this);
    }
    return this.#content;
  }


}
