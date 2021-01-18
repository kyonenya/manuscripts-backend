import { v4 as uuidv4 } from 'uuid';

export class Entry {
  public readonly text: string;
  public readonly starred: boolean;
  public readonly uuid: string;
  public readonly created_at?: string;
  public readonly modified_at?: string;

  constructor({ text, starred, uuid, created_at, modified_at}: {
    text: string,
    starred: boolean,
    uuid: string,
    created_at?: string, // 2020-11-19T11:48:24.000Z
    modified_at?: string,
  }) {
    this.text = text;
    this.starred = starred;
    this.uuid = uuid;
    this.created_at = created_at;
    this.modified_at = modified_at;
  }
}
