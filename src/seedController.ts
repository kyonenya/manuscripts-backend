import { RequestHandler } from 'express';
import { getClient } from './postgres';
import * as entriesRepository from './entriesRepository';
import * as tagsRepository from './tagsRepository';

export const importEntries: RequestHandler = (req, res) => {
  
};
