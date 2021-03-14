import { RequestHandler } from 'express';

/**
 * allow cors
 * @url https://qiita.com/hirohero/items/886733f50f37404235db
 */
export const allowCors: RequestHandler = (req, res, next) => {
  res
    .header('Access-Control-Allow-Origin', req.headers.origin)
    .header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    )
    .header(
      'Access-Control-Allow-Headers',
      'X-Requested-With, X-HTTP-Method-Override, Origin, Authorization, Accept, Content-Type'
    )
    .header('Access-Control-Allow-Credentials', 'true')
    .header('Access-Control-Max-Age', '86400');
  next();
};
