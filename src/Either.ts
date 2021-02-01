type f<T, U> = (x: T) => U;

class Either<L, R> {
  static ofLeft = <T>(value: T) => new Either<T, never>({ status: 'Left', value });
  static ofRight = <T>(value: T) => new Either<never, T>({ status: 'Right', value });
  constructor(
    private readonly _obj: { status: 'Left', value: L }|{ status: 'Right', value: R }
  ) {}
  public map = <T>(fn: f<R, T>): Either<L, T>=> { // Either<L, never>|Either<never, R> としない
    return this._obj.status === 'Left'
      ? Either.ofLeft(this._obj.value)
      : Either.ofRight(fn(this._obj.value));
  }
  public bind = <T>(fn: f<R, T>): L|T => {
    return this._obj.status === 'Left'
      ? this._obj.value
      : fn(this._obj.value);
  }
}

Either.ofRight(123)
  .map((x: number) => x * 2)
  .map((x: number) => console.log(x))
  ;

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
  .map(console.log)
  ;
