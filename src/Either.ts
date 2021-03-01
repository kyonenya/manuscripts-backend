type f<T, U> = (x: T) => U;

export class Either<L, R> {
  static ofLeft  = <T>(value: T) => new Either<T, never>({ status: 'Left', value });
  static ofRight = <T>(value: T) => new Either<never, T>({ status: 'Right', value });
  constructor(
    private readonly _obj: { status: 'Left', value: L }|{ status: 'Right', value: R }
  ) {}
  public map = <T>(fn: f<R, T>): Either<L, T>=> { // Either<L, never>|Either<never, R> としない
    return this._obj.status === 'Left'
      ? Either.ofLeft(this._obj.value)
      : Either.ofRight(fn(this._obj.value));
  };
  public asyncMap = <T>(fn: f<R, Promise<T>>): EitherP<L, T> => {
    return this._obj.status === 'Left'
      ? EitherP.ofLeft(Promise.resolve(this._obj.value))
      : EitherP.ofRight(fn(this._obj.value));
  };
  public mapLeft = <T>(fn: f<L, T>): Either<T, R>=> {
    return this._obj.status === 'Left'
      ? Either.ofLeft(fn(this._obj.value))
      : Either.ofRight(this._obj.value);
  };
  public bind = <T, U>(fn: f<R, Either<T, U>>): L|Either<T, U> => {
    return this._obj.status === 'Left'
      ? this._obj.value
      : fn(this._obj.value);
  };
  public asyncBind = <T, U>(fn: f<R, Promise<Either<T, U>>>) => {
    if (this._obj.status === 'Left') {
      return EitherP.ofLeft(Promise.resolve(this._obj.value));
    }
    return fn(this._obj.value);
  };
}

export class EitherP<L, R> {
  static ofRight = <T>(value: Promise<T>) => new EitherP<never, T>({ status: 'Right', value });
  static ofLeft  = <T>(value: Promise<T>) => new EitherP<T, never>({ status: 'Left', value });
  constructor(
    private readonly _obj: { status: 'Left', value: Promise<L> }|{ status: 'Right', value: Promise<R> }
  ) {}
  public map = <T>(fn: f<R, T>): EitherP<L, T> => {
    return this._obj.status === 'Left'
      ? EitherP.ofLeft(this._obj.value)
      : EitherP.ofRight(this._obj.value.then(value => fn(value)));
  };
}
