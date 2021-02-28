type f<T, U> = (x: T) => U;

export class Either<L, R> {
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
//  public awaitMap = <T>(fn: f<R, T>): Either<L, T> => {
//    const resolved = this._obj.then(x => x);
//  }
  public bind = <T>(fn: f<R, T>): L|T => {
    return this._obj.status === 'Left'
      ? this._obj.value
      : fn(this._obj.value);
  }
}

export class EitherP<L, R> {
  
}
