/**
 * Represents a successful result containing a value.
 * @template T The type of the successful value.
 */
export type Ok<T> = {
  kind: 'ok';
  value: T;
};

/**
 * Represents an error result containing an error.
 * @template E The type of the error.
 */
export type Err<E> = {
  kind: 'err';
  error: E;
};

/**
 * Represents a result that can be either successful (Ok) or an error (Err).
 * @template T The type of the successful value.
 * @template E The type of the error.
 */
export type Result<T, E> = Ok<T> | Err<E>;

/**
 * Creates a successful result.
 * @template T The type of the successful value.
 * @param value The value to wrap in a successful result.
 * @returns An Ok result containing the value.
 *
 * @example
 * const result = ok(42);
 * // result is now a successful Result containing 42
 */
export function ok<T>(value: T): Ok<T> {
  return {kind: 'ok', value};
}

/**
 * Creates an error result.
 * @template E The type of the error.
 * @param error The error to wrap in an error result.
 * @returns An Err result containing the error.
 *
 * @example
 * const result = err(new Error("Something went wrong"));
 * // result is now an error Result containing the error
 */
export function err<E>(error: E): Err<E> {
  return {kind: 'err', error};
}

/**
 * Checks if a result is successful.
 * @template T The type of the successful value.
 * @template E The type of the error.
 * @param result The result to check.
 * @returns True if the result is Ok, false otherwise.
 *
 * @example
 * const result = ok(42);
 * if (isOk(result)) {
 *   console.log("The result is successful");
 * }
 */
export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.kind === 'ok';
}

/**
 * Checks if a result is an error.
 * @template T The type of the successful value.
 * @template E The type of the error.
 * @param result The result to check.
 * @returns True if the result is Err, false otherwise.
 *
 * @example
 * const result = err(new Error("Something went wrong"));
 * if (isErr(result)) {
 *   console.log("The result is an error");
 * }
 */
export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result.kind === 'err';
}

/**
 * Maps a Result<T, E> to Result<U, E> by applying a function to a contained Ok value,
 * leaving an Err value untouched.
 * @template T The type of the original successful value.
 * @template U The type of the new successful value.
 * @template E The type of the error.
 * @param result The result to map.
 * @param f The function to apply to the successful value.
 * @returns A new Result with the mapped value if Ok, or the original error if Err.
 *
 * @example
 * const result = ok(5);
 * const mappedResult = map(result, x => x * 2);
 * // mappedResult is now ok(10)
 *
 * @example
 * const result = err("error");
 * const mappedResult = map(result, x => x * 2);
 * // mappedResult is still err("error")
 */
export function map<T, U, E>(
  result: Result<T, E>,
  f: (value: T) => U
): Result<U, E>;

export function map<T, U, E>(
  result: Result<T, E>,
  f: (value: T) => Promise<U>
): Promise<Result<U, E>>;

export function map<T, U, E>(
  result: Result<T, E>,
  f: (value: T) => U | Promise<U>
): Result<U, E> | Promise<Result<U, E>> {
  if (isOk(result)) {
    const res = f(result.value);
    if (res instanceof Promise) {
      return res.then(ok);
    } else {
      return ok(res);
    }
  } else {
    return result;
  }
}

/**
 * Maps a Result<T, E> to Result<T, F> by applying a function to a contained Err value,
 * leaving an Ok value untouched.
 * @template T The type of the successful value.
 * @template E The type of the original error.
 * @template F The type of the new error.
 * @param result The result to map.
 * @param f The function to apply to the error value.
 * @returns A new Result with the mapped error if Err, or the original value if Ok.
 *
 * @example
 * const result = err("error");
 * const mappedResult = mapErr(result, e => new Error(e));
 * // mappedResult is now err(new Error("error"))
 *
 * @example
 * const result = ok(5);
 * const mappedResult = mapErr(result, e => new Error(e));
 * // mappedResult is still ok(5)
 */
export function mapErr<T, E, F>(result: Result<T, E>, f: (error: E) => F): Result<T, F> {
  return isErr(result) ? err(f(result.error)) : result;
}

/**
 * Unwraps a result, yielding the content of an Ok. Else, it returns the provided default value.
 * @template T The type of the successful value.
 * @template E The type of the error.
 * @param result The result to unwrap.
 * @param defaultValue The default value to return if the result is an error.
 * @returns The value if Ok, or the default value if Err.
 *
 * @example
 * const result = ok(5);
 * const value = unwrapOr(result, 0);
 * // value is 5
 *
 * @example
 * const result = err("error");
 * const value = unwrapOr(result, 0);
 * // value is 0
 */
export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return isOk(result) ? result.value : defaultValue;
}

/**
 * Calls the provided function with the contained value (if Ok),
 * or returns the error (if Err).
 * @template T The type of the original successful value.
 * @template U The type of the new successful value.
 * @template E The type of the error.
 * @param result The result to chain.
 * @param f The function to apply to the successful value.
 * @returns A new Result from the applied function if Ok, or the original error if Err.
 *
 * @example
 * const divide = (x: number): Result<number, string> =>
 *   x === 0 ? err("Division by zero") : ok(10 / x);
 *
 * const result = ok(2);
 * const chainedResult = andThen(result, divide);
 * // chainedResult is ok(5)
 *
 * const result2 = ok(0);
 * const chainedResult2 = andThen(result2, divide);
 * // chainedResult2 is err("Division by zero")
 */
export function andThen<T, U, E>(
  result: Result<T, E>,
  f: (value: T) => Result<U, E>
): Result<U, E>;

export function andThen<T, U, E>(
  result: Result<T, E>,
  f: (value: T) => Promise<Result<U, E>>
): Promise<Result<U, E>>;

export function andThen<T, U, E>(
  result: Result<T, E>,
  f: (value: T) => Result<U, E> | Promise<Result<U, E>>
): Result<U, E> | Promise<Result<U, E>> {
  if (isOk(result)) {
    const res = f(result.value);
    if (res instanceof Promise) {
      return res;
    } else {
      return res;
    }
  } else {
    return result;
  }
}

/**
 * Calls the provided function with the contained error (if Err),
 * or returns the success value (if Ok).
 * @template T The type of the successful value.
 * @template E The type of the original error.
 * @template F The type of the new error.
 * @param result The result to transform.
 * @param f The function to apply to the error value.
 * @returns A new Result from the applied function if Err, or the original value if Ok.
 *
 * @example
 * const result = err("error");
 * const transformedResult = orElse(result, e => ok(e.length));
 * // transformedResult is ok(5)
 *
 * const result2 = ok(10);
 * const transformedResult2 = orElse(result2, e => ok(e.length));
 * // transformedResult2 is still ok(10)
 */
export function orElse<T, E, F>(result: Result<T, E>, f: (error: E) => Result<T, F>): Result<T, F> {
  return isErr(result) ? f(result.error) : result;
}

/**
 * Applies the provided function to the contained value (if Ok) or the contained error (if Err).
 * @template T The type of the successful value.
 * @template E The type of the error.
 * @template U The type of the result of both functions.
 * @param result The result to match against.
 * @param okFn The function to apply if the result is Ok.
 * @param errFn The function to apply if the result is Err.
 * @returns The result of applying the appropriate function.
 *
 * @example
 * const result = ok(5);
 * const matched = match(
 *   result,
 *   value => `Success: ${value}`,
 *   error => `Error: ${error}`
 * );
 * // matched is "Success: 5"
 *
 * @example
 * const result = err("Something went wrong");
 * const matched = match(
 *   result,
 *   value => `Success: ${value}`,
 *   error => `Error: ${error}`
 * );
 * // matched is "Error: Something went wrong"
 */
export function match<T, E, U>(
  result: Result<T, E>,
  okFn: (value: T) => U,
  errFn: (error: E) => U
): U;

export function match<T, E, U>(
  result: Result<T, E>,
  okFn: (value: T) => Promise<U>,
  errFn: (error: E) => Promise<U>
): Promise<U>;

export function match<T, E, U>(
  result: Result<T, E>,
  okFn: (value: T) => U | Promise<U>,
  errFn: (error: E) => U | Promise<U>
): U | Promise<U> {
  if (isOk(result)) {
    const res = okFn(result.value);
    if (res instanceof Promise) {
      return res;
    } else {
      return res;
    }
  } else {
    const res = errFn(result.error);
    if (res instanceof Promise) {
      return res;
    } else {
      return res;
    }
  }
}

/**
 * Wraps a function that might throw an error in a Result.
 * @template T The return type of the function.
 * @template R The type of the error.
 * @param f The function to wrap.
 * @returns A Result containing either the function's return value or the caught error.
 *
 * @example
 * const dangerousFunction = () => {
 *   if (Math.random() < 0.5) throw new Error("Bad luck");
 *   return "Success!";
 * };
 *
 * const result = fromThrowable(dangerousFunction);
 * // result is either ok("Success!") or err(Error("Bad luck"))
 */
export function fromThrowable<T, R>(f: () => T): Result<T, R>;
export function fromThrowable<T, R>(f: () => Promise<T>): Promise<Result<T, R>>;
export function fromThrowable<T, R>(f: () => T | Promise<T>): Result<T, R> | Promise<Result<T, R>> {
  try {
    const result = f();
    if (result instanceof Promise) {
      return result.then(ok).catch(err);
    } else {
      return ok(result);
    }
  } catch (e) {
    return err(e as R);
  }
}

/**
 * Converts a Promise into a Result.
 * @template T The type of the successful value.
 * @template E The type of the error.
 * @param promise The promise to convert.
 * @returns A Promise that resolves to a Result.
 *
 * @example
 * const asyncOperation = () => Promise.resolve(42);
 * const result = await fromPromise(asyncOperation());
 * // result is ok(42)
 *
 * @example
 * const failingAsyncOperation = () => Promise.reject(new Error("Failed"));
 * const result = await fromPromise(failingAsyncOperation());
 * // result is err(Error("Failed"))
 */
export function fromPromise<T, E>(promise: Promise<T>): Promise<Result<T, E>> {
  return promise.then(ok).catch((error) => err(error));
}

/**
 * Combines an array of Results into a single Result containing an array of values.
 * If any Result is an Err, the first Err encountered is returned.
 * @template T The type of the successful values.
 * @template E The type of the errors.
 * @param results An array of Results to combine.
 * @returns A Result containing either an array of all successful values or the first error encountered.
 *
 * @example
 * const results = [ok(1), ok(2), ok(3)];
 * const combined = combine(results);
 * // combined is ok([1, 2, 3])
 *
 * @example
 * const results = [ok(1), err("error"), ok(3)];
 * const combined = combine(results);
 * // combined is err("error")
 */
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

/**
 * Combines an array of Results into a single Result containing an array of values.
 * If any Results are Err, all errors are collected into an array.
 * @template T The type of the successful values.
 * @template E The type of the errors.
 * @param results An array of Results to combine.
 * @returns A Result containing either an array of all successful values or an array of all errors.
 *
 * @example
 * const results = [ok(1), ok(2), ok(3)];
 * const combined = combineWithAllErrors(results);
 * // combined is ok([1, 2, 3])
 *
 * @example
 * const results = [ok(1), err("error1"), ok(3), err("error2")];
 * const combined = combineWithAllErrors(results);
 * // combined is err(["error1", "error2"])
 */
export function combineWithAllErrors<T, E>(results: Result<T, E>[]): Result<T[], E[]> {
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

/**
 * Unwraps a Result, yielding the content of an Ok. Throws an error if the value is an Err.
 * @template T The type of the successful value.
 * @template E The type of the error.
 * @param result The result to unwrap.
 * @returns The value if Ok.
 * @throws Error if the result is an Err.
 *
 * @example
 * const result = ok(5);
 * const value = unsafeUnwrap(result);
 * // value is 5
 *
 * @example
 * const result = err("error");
 * const value = unsafeUnwrap(result);
 * // Throws an Error: "Attempted to unwrap an Err value"
 */
export function unsafeUnwrap<T, E>(result: Result<T, E>): T {
  if (isErr(result)) {
    throw new Error('Attempted to unwrap an Err value');
  }
  return result.value;
}
