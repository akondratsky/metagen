/**
 * Template payload used to render filenames from meta templates and files content from templates
 */
export class Payload {
  public getList(path: string): Array<Payload> {
    return [this];
  }
  /** Returns result of merging current payload with another */
  public merge(payload: Payload): Payload {
    return this;
  }
}