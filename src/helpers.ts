import { Err, Ok, Result } from './result';

export function ok<T>(value: T): Ok<T> {
  return { kind: 'ok', value };
}

export function err<E>(error: E): Err<E> {
  return { kind: 'err', error };
}

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.kind === 'ok';
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result.kind === 'err';
}

export function map<T, U, E>(
  result: Result<T, E>,
  f: (value: T) => U,
): Result<U, E> {
  return isOk(result) ? ok(f(result.value)) : result;
}

export function mapErr<T, E, F>(
  result: Result<T, E>,
  f: (error: E) => F,
): Result<T, F> {
  return isErr(result) ? err(f(result.error)) : result;
}

export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return isOk(result) ? result.value : defaultValue;
}

export function andThen<T, U, E>(
  result: Result<T, E>,
  f: (value: T) => Result<U, E>,
): Result<U, E> {
  return isOk(result) ? f(result.value) : result;
}

export async function asyncAndThen<T, U, E>(
  result: Result<T, E>,
  f: (value: T) => Promise<Result<U, E>>,
): Promise<Result<U, E>> {
  return isOk(result) ? await f(result.value) : result;
}

export function orElse<T, E, F>(
  result: Result<T, E>,
  f: (error: E) => Result<T, F>,
): Result<T, F> {
  return isErr(result) ? f(result.error) : result;
}

export function match<T, E, U>(
  result: Result<T, E>,
  okFn: (value: T) => U,
  errFn: (error: E) => U,
): U {
  return isOk(result) ? okFn(result.value) : errFn(result.error);
}

export async function asyncMap<T, U, E>(
  result: Result<T, E>,
  f: (value: T) => Promise<U>,
): Promise<Result<U, E>> {
  return isOk(result) ? ok(await f(result.value)) : result;
}

export function fromThrowable<T>(f: () => T): Result<T, unknown> {
  try {
    return ok(f());
  } catch (e) {
    return err(e);
  }
}

export function combine<T, E>(results: Result<T, E>[]): Result<T[], E> {
  const values: T[] = [];
  for (const result of results) {
    if (isErr(result)) {
      return result;
    }
    values.push(result.value);
  }
  return ok(values);
}

export function combineWithAllErrors<T, E>(
  results: Result<T, E>[],
): Result<T[], E[]> {
  const values: T[] = [];
  const errors: E[] = [];
  for (const result of results) {
    if (isOk(result)) {
      values.push(result.value);
    } else {
      errors.push(result.error);
    }
  }
  return errors.length === 0 ? ok(values) : err(errors);
}

export function safeUnwrap<T, E>(result: Result<T, E>): T {
  if (isErr(result)) {
    throw new Error('Attempted to unwrap an Err value');
  }
  return result.value;
}
