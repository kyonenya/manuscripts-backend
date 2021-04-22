import { Response } from 'express';
import { Boom } from '@hapi/boom';

export const json = (res: Response) => (result: unknown): void => {
  res.json(result);
};

export const error = (res: Response) => (err: Boom | Error): void => {
  if (err instanceof Boom) {
    res.status(err.output.statusCode).json({
      error: err.output.payload,
    });
    return;
  }
  res.status(500).json({
    error: {
      name: err.name,
      message: err.message,
    },
  });
};
