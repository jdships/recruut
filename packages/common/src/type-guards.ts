import type { Maybe } from './maybe';

export type IsDefinedGuard<T> = Exclude<T, undefined | null>;

export function isDefined<T>(val: Maybe<T>): val is IsDefinedGuard<T> {
  return (
    typeof val !== 'undefined' &&
    val !== undefined &&
    val !== null &&
    val !== Infinity
  );
}

export function isString<T>(obj: T): boolean {
  return (
    obj !== null &&
    typeof obj !== 'undefined' &&
    Object.prototype.toString.call(obj) === '[object String]'
  );
}
