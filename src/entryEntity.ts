import { v4 as uuidv4 } from 'uuid';

export class Entry {
  public readonly text: string;
  public readonly starred: boolean;
  public readonly uuid: string;
  public readonly tags: string[]|null;
  public readonly created_at?: string;
  public readonly modified_at?: string;

  constructor({ text, starred, uuid, tags, created_at, modified_at}: {
    text: string,
    starred?: boolean,
    uuid?: string,
    tags: string[]|null,
    created_at?: string, // 2020-11-19T11:48:24.000Z
    modified_at?: string,
  }) {
    this.text = text;
    this.starred = starred ?? false;
    this.uuid = uuid ?? uuidv4().replace(/-/g, '');
    this.tags = tags;
    this.created_at = created_at;
    this.modified_at = modified_at;
  }
}
