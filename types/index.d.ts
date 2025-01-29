export interface Item {
  title: string | undefined;
  link: string;
}

export interface Feed {
  title: string;
  items: Item[];
}
