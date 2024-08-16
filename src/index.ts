export type Ok<T> = {
  kind: 'ok';
  value: T;
};

export type Err<E> = {
  kind: 'err';
  error: E;
};

export type Result<T, E> = Ok<T> | Err<E>;

/**
 * Creates a new `Ok` result.
 *
 * @param value - The value to wrap in an `Ok` result.
 * @returns An `Ok` result containing the provided value.
 *
 * The `ok` function is used to create a new `Result` instance representing a successful operation.
 * It takes a value of type `T` and returns an `Ok` result wrapping that value.
 *
 * Example usage:
 * ```typescript
 * const result = ok(42);
 * ```
 */
export function ok<T>(value: T): Ok<T> {
  return {kind: 'ok', value};
}

/**
 * Creates a new `Err` result.
 *
 * @param error - The error to wrap in an `Err` result.
 * @returns An `Err` result containing the provided error.
 *
 * The `err` function is used to create a new `Result` instance representing an error or failure.
 * It takes an error value of type `E` and returns an `Err` result wrapping that error.
 *
 * Example usage:
 * ```typescript
 * const result = err(&#x27;Something went wrong&#x27;);
 * ```
 */
export function err<E>(error: E): Err<E> {
  return {kind: 'err', error};
}

/**
 * Checks if a `Result` is `Ok`.
 *
 * @param result - The `Result` to check.
 * @returns `true` if the `Result` is `Ok`, `false` otherwise.
 *
 * The `isOk` function is a type guard that checks if a given `Result` is an `Ok` instance.
 * It takes a `Result` and returns `true` if the `Result` is an `Ok`, and `false` otherwise.
 *
 * Example usage:
 * ```typescript
 * const result = ok(42);
 * if (isOk(result)) {
 *   console.log(result.value);
 * }
 * ```
 */
export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.kind === 'ok';
}

/**
 * Checks if a `Result` is `Err`.
 *
 * @param result - The `Result` to check.
 * @returns `true` if the `Result` is `Err`, `false` otherwise.
 *
 * The `isErr` function is a type guard that checks if a given `Result` is an `Err` instance.
 * It takes a `Result` and returns `true` if the `Result` is an `Err`, and `false` otherwise.
 *
 * Example usage:
 * ```typescript
 * const result = err(&#x27;Something went wrong&#x27;);
 * if (isErr(result)) {
 *   console.error(result.error);
 * }
 * ```
 */
export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result.kind === 'err';
}

/**
 * Maps a function over the value of an `Ok` result.
 *
 * @param result - The `Result` to map over.
 * @param f - The function to apply to the value of the `Ok` result.
 * @returns A new `Result` with the mapped value if the input is `Ok`, or the original `Err` result.
 *
 * The `map` function allows you to transform the value inside an `Ok` result by applying a given function to it.
 * If the input `Result` is an `Ok`, it applies the provided function to the wrapped value and returns a new `Ok` result with the mapped value.
 * If the input `Result` is an `Err`, it returns the `Err` result unchanged.
 *
 * Example usage:
 * ```typescript
 * const result = ok(42);
 * const mappedResult = map(result, value =&gt; value * 2);
 * ```
 */
export function map<T, U, E>(result: Result<T, E>, f: (value: T) => U): Result<U, E> {
  return isOk(result) ? ok(f(result.value)) : result;
}

/**
 * Maps a function over the error of an `Err` result.
 *
 * @param result - The `Result` to map over.
 * @param f - The function to apply to the error of the `Err` result.
 * @returns A new `Result` with the mapped error if the input is `Err`, or the original `Ok` result.
 *
 * The `mapErr` function allows you to transform the error inside an `Err` result by applying a given function to it.
 * If the input `Result` is an `Err`, it applies the provided function to the wrapped error and returns a new `Err` result with the mapped error.
 * If the input `Result` is an `Ok`, it returns the `Ok` result unchanged.
 *
 * Example usage:
 * ```typescript
 * const result = err(&#x27;Something went wrong&#x27;);
 * const mappedResult = mapErr(result, error =&gt; new Error(error));
 * ```
 */
export function mapErr<T, E, F>(result: Result<T, E>, f: (error: E) => F): Result<T, F> {
  return isErr(result) ? err(f(result.error)) : result;
}

/**
 * Unwraps a `Result`, returning the value if it's `Ok`, or a default value if it's `Err`.
 *
 * @param result - The `Result` to unwrap.
 * @param defaultValue - The default value to return if the `Result` is `Err`.
 * @returns The value of the `Ok` result, or the provided default value if the `Result` is `Err`.
 *
 * The `unwrapOr` function allows you to extract the value from an `Ok` result, or return a default value if the `Result` is an `Err`.
 * If the input `Result` is an `Ok`, it returns the wrapped value.
 * If the input `Result` is an `Err`, it returns the provided default value.
 *
 * Example usage:
 * ```typescript
 * const result = ok(42);
 * const value = unwrapOr(result, 0);
 * ```
 */
export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return isOk(result) ? result.value : defaultValue;
}

/**
 * Chains a function that returns a `Result` to the value of an `Ok` result.
 *
 * @param result - The `Result` to chain from.
 * @param f - The function to chain, which takes the value of the `Ok` result and returns a new `Result`.
 * @returns The `Result` returned by the chained function if the input is `Ok`, or the original `Err` result.
 *
 * The `andThen` function allows you to chain multiple operations that return `Result`s.
 * If the input `Result` is an `Ok`, it applies the provided function to the wrapped value, which should return another `Result`.
 * If the input `Result` is an `Err`, it returns the `Err` result unchanged.
 *
 * Example usage:
 * ```typescript
 * const result = ok(42);
 * const chainedResult = andThen(result, value =&gt; ok(value * 2));
 * ```
 */
export function andThen<T, U, E>(result: Result<T, E>, f: (value: T) => Result<U, E>): Result<U, E> {
  return isOk(result) ? f(result.value) : result;
}

/**
 * Asynchronously chains a function that returns a `Promise<Result>` to the value of an `Ok` result.
 *
 * @param result - The `Result` to chain from.
 * @param f - The asynchronous function to chain, which takes the value of the `Ok` result and returns a new `Promise<Result>`.
 * @returns A `Promise` that resolves to the `Result` returned by the chained function if the input is `Ok`, or the original `Err` result.
 *
 * The `asyncAndThen` function is similar to `andThen`, but it allows you to chain asynchronous operations that return `Promise<Result>`s.
 * If the input `Result` is an `Ok`, it applies the provided asynchronous function to the wrapped value, which should return a `Promise<Result>`.
 * If the input `Result` is an `Err`, it returns a `Promise` that resolves to the `Err` result.
 *
 * Example usage:
 * ```typescript
 * const result = ok(42);
 * const chainedResult = await asyncAndThen(result, async value =&gt; ok(value * 2));
 * ```
 */
export async function asyncAndThen<T, U, E>(
  result: Result<T, E>,
  f: (value: T) => Promise<Result<U, E>>
): Promise<Result<U, E>> {
  return isOk(result) ? await f(result.value) : result;
}

/**
 * Chains a function that returns a `Result` to the error of an `Err` result.
 *
 * @param result - The `Result` to chain from.
 * @param f - The function to chain, which takes the error of the `Err` result and returns a new `Result`.
 * @returns The `Result` returned by the chained function if the input is `Err`, or the original `Ok` result.
 *
 * The `orElse` function allows you to chain a fallback operation to an `Err` result.
 * If the input `Result` is an `Err`, it applies the provided function to the wrapped error, which should return another `Result`.
 * If the input `Result` is an `Ok`, it returns the `Ok` result unchanged.
 *
 * Example usage:
 * ```typescript
 * const result = err(&#x27;Something went wrong&#x27;);
 * const chainedResult = orElse(result, error =&gt; ok(&#x27;Fallback value&#x27;));
 * ```
 */
export function orElse<T, E, F>(result: Result<T, E>, f: (error: E) => Result<T, F>): Result<T, F> {
  return isErr(result) ? f(result.error) : result;
}

/**
 * Matches a `Result` against two functions, one for `Ok` and one for `Err`.
 *
 * @param result - The `Result` to match.
 * @param okFn - The function to apply if the `Result` is `Ok`.
 * @param errFn - The function to apply if the `Result` is `Err`.
 * @returns The value returned by the matched function.
 *
 * The `match` function allows you to handle both the `Ok` and `Err` cases of a `Result` separately.
 * It takes two functions as arguments: one for handling the `Ok` case and one for handling the `Err` case.
 * If the input `Result` is an `Ok`, it applies the `okFn` to the wrapped value and returns the result.
 * If the input `Result` is an `Err`, it applies the `errFn` to the wrapped error and returns the result.
 *
 * Example usage:
 * ```typescript
 * const result = ok(42);
 * const value = match(
 *   result,
 *   value =&gt; value * 2,
 *   error =&gt; 0
 * );
 * ```
 */
export function match<T, E, U>(result: Result<T, E>, okFn: (value: T) => U, errFn: (error: E) => U): U {
  return isOk(result) ? okFn(result.value) : errFn(result.error);
}

/**
 * Asynchronously matches a `Result` against two functions, one for `Ok` and one for `Err`.
 *
 * @param result - The `Result` to match.
 * @param okFn - The asynchronous function to apply if the `Result` is `Ok`.
 * @param errFn - The asynchronous function to apply if the `Result` is `Err`.
 * @returns A `Promise` that resolves to the value returned by the matched function.
 *
 * The `asyncMatch` function is similar to `match`, but it allows you to handle both the `Ok` and `Err` cases asynchronously.
 * It takes two asynchronous functions as arguments: one for handling the `Ok` case and one for handling the `Err` case.
 * If the input `Result` is an `Ok`, it applies the `okFn` to the wrapped value and returns a `Promise` that resolves to the result.
 * If the input `Result` is an `Err`, it applies the `errFn` to the wrapped error and returns a `Promise` that resolves to the result.
 *
 * Example usage:
 * ```typescript
 * const result = ok(42);
 * const value = await asyncMatch(
 *   result,
 *   async value =&gt; value * 2,
 *   async error =&gt; 0
 * );
 * ```
 */
export async function asyncMatch<T, E, U>(
  result: Result<T, E>,
  okFn: (value: T) => Promise<U>,
  errFn: (error: E) => Promise<U>
): Promise<U> {
  return isOk(result) ? await okFn(result.value) : await errFn(result.error);
}

/**
 * Asynchronously maps a function over the value of an `Ok` result.
 *
 * @param result - The `Result` to map over.
 * @param f - The asynchronous function to apply to the value of the `Ok` result.
 * @returns A `Promise` that resolves to a new `Result` with the mapped value if the input is `Ok`, or the original `Err` result.
 *
 * The `asyncMap` function is similar to `map`, but it allows you to apply an asynchronous function to the value of an `Ok` result.
 * If the input `Result` is an `Ok`, it applies the provided asynchronous function to the wrapped value and returns a `Promise` that resolves to a new `Ok` result with the mapped value.
 * If the input `Result` is an `Err`, it returns a `Promise` that resolves to the `Err` result unchanged.
 *
 * Example usage:
 * ```typescript
 * const result = ok(42);
 * const mappedResult = await asyncMap(result, async value =&gt; value * 2);
 * ```
 */
export async function asyncMap<T, U, E>(
  result: Result<T, E>,
  f: (value: T) => Promise<U>
): Promise<Result<U, E>> {
  return isOk(result) ? ok(await f(result.value)) : result;
}

/**
 * Executes a function that may throw an error and returns the result as a `Result`.
 *
 * @param f - The function to execute.
 * @returns An `Ok` result containing the return value of the function if it succeeds, or an `Err` result containing the thrown error.
 *
 * The `fromThrowable` function allows you to execute a function that may throw an error and convert the result into a `Result`.
 * It takes a function `f` as an argument, which can be either synchronous or asynchronous.
 * If the function `f` executes successfully without throwing an error, it returns an `Ok` result containing the return value of the function.
 * If the function `f` throws an error, it returns an `Err` result containing the thrown error.
 *
 * Example usage:
 * ```typescript
 * const result = fromThrowable(() =&gt; {
 *   // Code that may throw an error
 *   return 42;
 * });
 * ```
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

/*
* Converts a Promise into a Promise<Result>.
*
* @param promise - The Promise to convert.
* @returns A Promise that resolves to an Ok result containing the resolved value of the input Promise, or an Err result containing the rejection reason.
*
* The fromPromise function allows you to convert a Promise into a Promise<Result>.
* It takes a Promise as an argument and returns a new Promise that resolves to a Result.
* If the input Promise resolves successfully, the returned Promise resolves to an Ok result containing the resolved value.
* If the input Promise rejects, the returned Promise resolves to an Err result containing the rejection reason.
*
* Example usage:
* typescript * const promise = Promise.resolve(42); * const resultPromise = fromPromise(promise); *
*/
export function fromPromise<T, E>(promise: Promise<T>): Promise<Result<T, E>> {
  return promise.then(ok).catch((error) => err(error));
}

/*
* Combines an array of Results into a single Result.
*
* @param results - The array of Results to combine.
* @returns An Ok result containing an array of the values from the input Results if they are all Ok, or the first Err result encountered.
*
* The combine function allows you to combine multiple Results into a single Result.
* It takes an array of Results as an argument and returns a new Result.
* If all the input Results are Ok, it returns an Ok result containing an array of the values from the input Results.
* If any of the input Results is an Err, it returns the first Err result encountered.
*
* Example usage:
* typescript * const results = [ok(1), ok(2), ok(3)]; * const combinedResult = combine(results); *
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

/*
* Combines an array of Results into a single Result, collecting all errors.
*
* @param results - The array of Results to combine.
* @returns An Ok result containing an array of the values from the input Results if they are all Ok, or an Err result containing an array of all the errors.
*
* The combineWithAllErrors function is similar to combine, but it collects all the errors from the input Results instead of returning the first Err encountered.
* It takes an array of Results as an argument and returns a new Result.
* If all the input Results are Ok, it returns an Ok result containing an array of the values from the input Results.
* If any of the input Results is an Err, it returns an Err result containing an array of all the errors from the input Results.
*
* Example usage:
* typescript * const results = [ok(1), err('Error 1'), ok(3), err('Error 2')]; * const combinedResult = combineWithAllErrors(results); *
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

/*
* Unwraps a Result, throwing an error if it's Err.
*
* @param result - The Result to unwrap.
* @returns The value of the Ok result.
* @throws An error if the Result is Err.
*
* The unsafeUnwrap function allows you to extract the value from an Ok result, but throws an error if the Result is an Err.
* It takes a Result as an argument and returns the value wrapped inside the Ok result.
* If the input Result is an Err, it throws an error.
*
* Note: Use this function with caution, as it may throw an error if the Result is an Err.
*
* Example usage:
* typescript * const result = ok(42); * const value = unsafeUnwrap(result); *
*/
export function unsafeUnwrap<T, E>(result: Result<T, E>): T {
  if (isErr(result)) {
    throw new Error('Attempted to unwrap an Err value');
  }
  return result.value;
}
