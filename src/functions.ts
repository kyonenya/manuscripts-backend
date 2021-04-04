/**
 * K-combinator (tap)
 * (T -> *) -> T -> T
 */
export const tap = <T>(fn: (x: T) => unknown) => (a: T): T => {
  fn(a);
  return a;
};
