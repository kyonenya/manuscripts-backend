type f<T, U> = (x: T) => U;
type TEither<L, R> = Either<L, undefined> | Either<undefined, R>;

class Either<L = undefined, R = undefined> {
  constructor(
    private readonly lr: Left<L>|Right<R>
  ) {}
  public map = <T>(fn: f<R, T>): TEither<L, T> => {
    return this.lr instanceof Left
      ? ofLeft(this.lr.value)
      : ofRight(fn(this.lr.value));
  }
  public isLeft = () => this.lr instanceof Left;
  public isRight = () => this.lr instanceof Right;
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

ofRight(123)
  .map((x: number) => x * 2)
  .map((x: number) => console.log(x))
  ;