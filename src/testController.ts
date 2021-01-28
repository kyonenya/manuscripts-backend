import { Request, Response, RequestHandler } from 'express';
import * as apiRequest from './apiRequest';
import fetch from 'node-fetch';

export const testCreate = (req: Request, res: Response) => {
  return fetch('http://localhost:3000/api/entries/create', {
    method: 'POST',
    body: JSON.stringify({
      text: '本文',
      tags: ['タグ1', 'タグ2'],
   }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  .then(response => response.json())
  .then(data => console.log(data));
}

export const testUpdate: RequestHandler = (req, res) => {
  const { uuid } = apiRequest.uuidParams(req);
  return fetch('http://localhost:3000/api/entries/${uuid}', {
    method: 'PUT',
    body: JSON.stringify({
      text: '更新された本文',
      tags: ['更新されたタグ1', '更新されたタグ2'],
      starred: true,
      uuid: '16798e99c8dc49b59af62353c26313b8',
   }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  .then(response => response.json())
  .then(data => console.log(data));
};

export const testDelete: RequestHandler = (req, res) => {
  const { uuid } = apiRequest.uuidParams(req);
  return fetch(`http://localhost:3000/api/entries/${uuid}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  .then(response => response.json())
  .then(data => console.log(data));
};
