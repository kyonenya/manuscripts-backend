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
  public awaitMap = <T>(fn: f<R, T>) => {
    if (!(this._obj.value instanceof Promise)) return this;
    return this._obj.status === 'Left' 
      ? 123
      : Either.ofRight(this._obj.value.then(v => fn(v)));
  }
  public awaitBind = <T>(fn: f<R, T>) => {
    if (!(this._obj.value instanceof Promise)) return this;
    return this._obj.value
      .then(value => value._obj.status === 'Left'
        ? value
        : fn(value)
      )
      .then(x => console.log(x))
  };
  public mapLeft = <T>(fn: f<L, T>): Either<T, R>=> {
    return this._obj.status === 'Left'
      ? Either.ofLeft(fn(this._obj.value))
      : Either.ofRight(this._obj.value);
  };
  public flatten = (): Either<L, R> => {
    if (!(this._obj.value instanceof Either) || this._obj.status === 'Left') {
      return this;
    }
    return this._obj.value._obj.status === 'Left'
      ? Either.ofLeft(this._obj.value._obj.value)
      : Either.ofRight (this._obj.value._obj.value);
  }
  public bind = <T, U>(fn: f<R, Either<T, U>>): L|Either<T, U> => {
    return this._obj.status === 'Left'
      ? this._obj.value
      : fn(this._obj.value);
  };
}
