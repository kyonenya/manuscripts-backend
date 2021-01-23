type f<T, U> = (x: T) => U;
type _ = undefined;

class Either<L, R> {
  constructor(
    private readonly lr: Left<L>|Right<R>
  ) {}
  public map = <T>(fn: f<R, T>): this | Either<undefined, T> => { // 返り値をthis型でごまかす
    return this.lr instanceof Left
      ? this
      : ofRight(fn(this.lr.value));
  }
  public isLeft = () => this.lr instanceof Left;
  public isRight = () => this.lr instanceof Right;
}

const ofRight = <T>(val: T) => new Either<undefined, T>(new Right(val)); // genericsをつけてnewする
const ofLeft = <T>(val: T) => new Either<T, undefined>(new Left(val));
const fromNullable = <T>(val: T) => (val === null || val === undefined)
  ? ofLeft(val)
  : ofRight(val);

class Left<T> {
  constructor(
    public readonly value: T,
  ){}
}

class Right<T> {
  constructor(
    public readonly value: T,
  ){}
}

ofRight(1234)
  .map((x: number) => x * 2)
  .map((x: number) => console.log(x))
  ;
