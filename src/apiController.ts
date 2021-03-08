import { RequestHandler } from 'express';
import createError from 'http-errors';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { pool } from './postgres';
import * as apiRequest from './apiRequest';
import * as entriesRepository from './entriesRepository';
import * as tagsRepository from './tagsRepository';

export const readAllEntries: RequestHandler = async (req, res) => {
  return pipe(
    E.right(req),
    E.chain(apiRequest.limitQuery),
    TE.fromEither,
    TE.chain(entriesRepository.selectAll(await pool.connect())),
    TE.map(data => res.json(data)),
  )();
};

export const readOneEntry: RequestHandler = async (req, res) => {
  const dbInvoker = entriesRepository.selectOne(await pool.connect());

  const uuid = apiRequest.uuidParams(req);
  const data = await dbInvoker({ uuid });
  res.json(data);
};

export const createNewEntry: RequestHandler = async (req, res) => {
  const dbInvoker = entriesRepository.insertOne(await pool.connect());

  const entry = apiRequest.entitize(req.body);
  const result = await dbInvoker(entry);
  res.json(result);
}

export const updateEntry: RequestHandler = async (req, res) => {
  const dbInvoker = entriesRepository.updateOne(await pool.connect());

  const entry = apiRequest.entitize(req.body);
  const result = await dbInvoker(entry);
  res.json(result);
};

export const deleteEntry: RequestHandler = async (req, res) => {
  const entriesInvoker = entriesRepository.deleteOne(await pool.connect());
  const tagsInvoker = tagsRepository.deleteAll(await pool.connect());

  const uuid = apiRequest.uuidParams(req);
  Promise.all([entriesInvoker({ uuid }), tagsInvoker({ uuid })])
    .then(results => {
      console.log(results);
      res.json(results[0]);
    })
    ;
};
