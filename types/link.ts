export type Folder = {
  id: number;
  name: string;
};

export type Link = {
  id: number;
  title: string;
  url: string;
  description: string;
  folderId: number;
};
