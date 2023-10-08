/**
 * Implements meta template for folders.
 * Generates list of folders to creates, renders file meta templates in it.
 */
export class FolderMetaTemplate {
  constructor(
    /** name of current folder */
    private readonly name: string,
    /** parent folder for this folder */
    private readonly folder: string,
  ) {}

  public render() {
  }
}