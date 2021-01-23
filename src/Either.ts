type f<T, U> = (x: T) => U;
type TEither<L, R> = Either<L, undefined> | Either<undefined, R>;

class Either<L = undefined, R = undefined> {
  private left?: Left<L>;
  private right?: Right<R>;
  constructor(lr: Left<L>|Right<R>) {
    if (lr instanceof Left) this.left = lr;
    if (lr instanceof Right) this.right = lr;
  }
  public map = <T>(fn: f<R, T>): TEither<L, T> => {
    return this.left
      ? ofLeft(this.left.value)
      : ofRight(fn(this.right!.value));
  }
  public isLeft = () => this.left !== null;
  public isRight = () => this.right !== null;
}

const ofRight = <T>(val: T) => new Either(new Right(val));
const ofLeft = <T>(val: T) => new Either(new Left(val));
const fromNullable = <T>(val: T) => val === null || val === undefined
  ? ofLeft(val)
  : ofRight(val);

class Left<T> {
  public readonly status = 'Left';
  constructor(
    public readonly value: T,
  ){}
}

class Right<T> {
  public readonly status = 'Right';
  constructor(
    public readonly value: T,
  ){}
}
