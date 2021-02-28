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
});
