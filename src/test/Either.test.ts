import assert from 'assert';
import { Either } from '../Either';

describe('Either', () => {
  it('map', () => {
      Either.ofRight(123)
        .map((x: number) => x * 2)
        .map(x => assert.strictEqual(x, 246))
        ;
  });
  it('bind', () => {
    const decode = (url: string): Either<string, string> => {
      try {
        return Either.ofRight(decodeURIComponent(url));
      } catch (err) {
        return Either.ofLeft(`${err}`);
      }
    };
    Either.ofRight('valid%3Fid%3D')
      .map((x: string) => x + '123')
      .bind(decode)
      .map(x => assert.strictEqual(x, 'valid?id=123'));
      ;
  });
  it('map then', () => {
    const lazyDouble = (x: number): Promise<number> => new Promise((resolve, reject) => resolve(x * 2));
    Either.ofRight(123)
      .map(lazyDouble)
      .map(x => x.then(x => x))
      .map(x => x.then(x => assert.strictEqual(x, 246)))
      ;
  });
  it('bind then', () => {
    const lazyDecode = async (url: string): Promise<Either<string, string>> => {
      const promisedDecode = (url: string): Promise<string> => new Promise((resolve, reject) => resolve(decodeURIComponent(url)));
      try {
        const result = await promisedDecode(url);
        return Either.ofRight(result);
      } catch (err) {
        return Either.ofLeft(`${err}`);
      }
    };
    Either.ofRight('valid%3Fid%3D')
      .map(lazyDecode)
      .map(x => x.then(x => assert.strictEqual(x, 'valid?id=123')))
      ;
    Either.ofRight('invalid3s%%F%')
      .map(lazyDecode)
//      .mapLeft(x => x.then(x => assert.strictEqual(x, 'valid?id=123')))
      ;
  });
});
