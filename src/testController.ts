import { Request, Response } from 'express';
import fetch from 'node-fetch';

export const testCreate = (req: Request, res: Response) => {
  fetch('http://localhost:3000/api/entries/create', {
    method: 'POST',
    body: JSON.stringify({
      text: '本文',
      tags: ['タグ1', 'タグ2'],
   }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });
}
