//type eitherable = 'Right'|'Left';
type f<T, U> = (x: T) => U;

class Either<T> {
  constructor(
    private _status: 'Right'|'Left',
    private _value: T,
  ) {}
  public map = (fn: Function): any => this.isLeft()
    ? this
    : ofRight(fn(this._value));
  public mapLeft = (fn: Function): any => this.isLeft()
    ? ofLeft(fn(this._value))
    : this;
  public getOrElse = <U>(other: U) => this.isLeft()
    ? other
    : this._value;
  public isLeft = () => this._status === 'Left';
  public isRight = () => this._status === 'Right';
}

const ofRight = <T>(val: T) => new Either('Right', val);
const ofLeft = <T>(val: T) => new Either('Left', val);
const fromNullable = <T>(val: T) => val === null || val === undefined
  ? ofLeft(val)
  : ofRight(val);
const tryCatch = (fn: Function, onError: Function) => {
  try {
    return ofRight(fn());
  } catch (err) {
    return ofLeft(onError(err));
  }
};

const decode = (url: string) => tryCatch(() => decodeURIComponent(url), (e: any) => e.toString());

//console.log(decode('valid%3Fid%3D')); // Right('valid%3Fid%3D')
//console.log(decode('invalid3s%%F%')); // Left(URIError: ...)

//console.log(fromNullable(null).map((x: any) => x + 3));
//console.log(fromNullable(null).getOrElse('Error!'));
//console.log(fromNullable(2).map((x: number) => x + 5));
