import fs from 'fs';
import path from 'path';
import { Entry } from './entryEntity';

type jsonEntry = {
  modifiedDate: string;
  creationDate: string;
  text: string | null;
  tags: string[];
  uuid: string;
  starred: boolean;
};

export const unescape = (text: string | null) => text
  ? text
    .replace(/\\n/g, '\n') // "\\n" -> "\n"
    .replace(/\\/g, '') // "\." -> "."
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // ゼロ幅スペースを削除
  : '';

const entitize = (row: jsonEntry) => {
  return new Entry({
    text: unescape(row.text),
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
  return jsonEntries.filter(entry => entry.text !== undefined)
    .map((entry) => entitize(entry));
};
