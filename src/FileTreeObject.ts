type NameField = {
  name: string;
};

export type DirectoryObject = NameField & {
  isDirectory: true,
  children: FileTreeObject[]
};

export type FileObject = NameField & {
  isDirectory: false,
  content: string;
};

export type FileTreeObject = FileObject | DirectoryObject;