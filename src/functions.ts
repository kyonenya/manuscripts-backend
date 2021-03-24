export const tap = (fn: Function) => (x: any) => {
  fn(x);
  return x;
};
