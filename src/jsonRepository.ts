import fs from 'fs';
import path from 'path';
import { Entry } from './entryEntity';

type jsonEntry = {
  modifiedDate: string,
  creationDate: string,
  text: string,
  tags: string[],
  uuid: string,
  starred: boolean,
};

const entitize = (row: jsonEntry) => {
  return new Entry({
    text: unescape(row.text.replace(/\\\./g, '.')),
    starred: row.starred,
    uuid: row.uuid,
    tags: row.tags,
    created_at: row.creationDate,
    modified_at: row.modifiedDate,
  });
};

export const readAll = async (filePath: string): Promise<Entry[]> => {
  const json = await fs.promises.readFile(filePath, 'utf-8');
  const jsonEntries: jsonEntry[] = JSON.parse(json).entries;
  return jsonEntries.map(entry => entitize(entry));
};
