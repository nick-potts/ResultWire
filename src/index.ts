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
 * **ok**
 *
 * Creates a new `Ok` result.
 *
 * @param value - The value to wrap in an `Ok` result.
 * @returns An `Ok` result containing the provided value.
 *
 * **Example:**
 * ```typescript
 * const result = ok(42); // Result&lt;number, unknown&gt;
 * ```
 */
export function ok<T>(value: T): Ok<T> {
  return { kind: 'ok', value };
}

/**
 * **err**
 *
 * Creates a new `Err` result.
 *
 * @param error - The error to wrap in an `Err` result.
 * @returns An `Err` result containing the provided error.
 *
 * **Example:**
 * ```typescript
 * const result = err(&#x27;Something went wrong&#x27;); // Result&lt;unknown, string&gt;
 * ```
 */
export function err<E>(error: E): Err<E> {
  return { kind: 'err', error };
}

/**
 * **isOk**
 *
 * Checks if a `Result` is `Ok`.
 *
 * @param result - The `Result` to check.
 * @returns `true` if the `Result` is `Ok`, `false` otherwise.
 *
 * **Example:**
 * ```typescript
 * const result = ok(42);
 * const isOkResult = isOk(result); // true
 * ```
 */
export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.kind === 'ok';
}

/**
 * **isErr**
 *
 * Checks if a `Result` is `Err`.
 *
 * @param result - The `Result` to check.
 * @returns `true` if the `Result` is `Err`, `false` otherwise.
 *
 * **Example:**
 * ```typescript
 * const result = err(&#x27;Something went wrong&#x27;);
 * const isErrResult = isErr(result); // true
 * ```
 */
export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result.kind === 'err';
}

/**
 * **map**
 *
 * Maps a function over the value of an `Ok` result.
 *
 * @param result - The `Result` to map over.
 * @param f - The function to apply to the value of the `Ok` result.
 * @returns A new `Result` with the result of applying the function to the value of the original `Ok` result, or the original `Err` result.
 *
 * **Example:**
 * ```typescript
 * const result = ok(42);
 * const mappedResult = map(result, (value) =&gt; value * 2); // Result&lt;number, unknown&gt;
 * ```
 */
export function map<T, U, E>(
  result: Result<T, E>,
  f: (value: T) => U,
): Result<U, E> {
  return isOk(result)
    ? ok(f(result.value))
    : result;
}

/**
 * **mapErr**
 *
 * Maps a function over the error of an `Err` result.
 *
 * @param result - The `Result` to map over.
 * @param f - The function to apply to the error of the `Err` result.
 * @returns A new `Result` with the result of applying the function to the error of the original `Err` result, or the original `Ok` result.
 *
 * **Example:**
 * ```typescript
 * const result = err(&#x27;Something went wrong&#x27;);
 * const mappedResult = mapErr(result, (error) =&gt; new Error(error)); // Result&lt;unknown, Error&gt;
 * ```
 */
export function mapErr<T, E, F>(
  result: Result<T, E>,
  f: (error: E) => F,
): Result<T, F> {
  return isErr(result)
    ? err(f(result.error))
    : result;
}

/**
 * **unwrapOr**
 *
 * Unwraps a `Result`, returning the value if it's `Ok`, or a default value if it's `Err`.
 *
 * @param result - The `Result` to unwrap.
 * @param defaultValue - The default value to return if the `Result` is `Err`.
 * @returns The value of the `Ok` result, or the default value.
 *
 * **Example:**
 * ```typescript
 * const result = ok(42);
 * const unwrappedResult = unwrapOr(result, 0); // 42
 * ```
 */
export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return isOk(result)
    ? result.value :
    defaultValue;
}

/**
 * **andThen**
 *
 * Chains a function that returns a `Result` to the value of an `Ok` result.
 *
 * @param result - The `Result` to chain from.
 * @param f - The function to chain, which takes the value of the `Ok` result and returns a new `Result`.
 * @returns The `Result` returned by the chained function, or the original `Err` result.
 *
 * **Example:**
 * ```typescript
 * const result = ok(42);
 * const chainedResult = andThen(result, (value) =&gt; ok(value * 2)); // Result&lt;number, unknown&gt;
 * ```
 */
export function andThen<T, U, E>(
  result: Result<T, E>,
  f: (value: T) => Result<U, E>,
): Result<U, E> {
  return isOk(result)
    ? f(result.value)
    : result;
}

/**
 * **asyncAndThen**
 *
 * Asynchronously chains a function that returns a `Promise<Result>` to the value of an `Ok` result.
 *
 * @param result - The `Result` to chain from.
 * @param f - The asynchronous function to chain, which takes the value of the `Ok` result and returns a new `Promise<Result>`.
 * @returns A `Promise` that resolves to the `Result` returned by the chained function, or the original `Err` result.
 *
 * **Example:**
 * ```typescript
 * const result = ok(42);
 * const chainedResult = await asyncAndThen(result, async (value) =&gt; ok(value * 2)); // Result&lt;number, unknown&gt;
 * ```
 */
export async function asyncAndThen<T, U, E>(
  result: Result<T, E>,
  f: (value: T) => Promise<Result<U, E>>,
): Promise<Result<U, E>> {
  return isOk(result)
    ? await f(result.value)
    : result;
}

/**
 * **orElse**
 *
 * Chains a function that returns a `Result` to the error of an `Err` result.
 *
 * @param result - The `Result` to chain from.
 * @param f - The function to chain, which takes the error of the `Err` result and returns a new `Result`.
 * @returns The `Result` returned by the chained function, or the original `Ok` result.
 *
 * **Example:**
 * ```typescript
 * const result = err(&#x27;Something went wrong&#x27;);
 * const chainedResult = orElse(result, (error) =&gt; ok(&#x27;Default value&#x27;)); // Result&lt;string, unknown&gt;
 * ```
 */
export function orElse<T, E, F>(
  result: Result<T, E>,
  f: (error: E) => Result<T, F>,
): Result<T, F> {
  return isErr(result)
    ? f(result.error)
    : result;
}

/**
 * **match**
 *
 * Matches a `Result` against two functions, one for `Ok` and one for `Err`.
 *
 * @param result - The `Result` to match.
 * @param okFn - The function to apply if the `Result` is `Ok`.
 * @param errFn - The function to apply if the `Result` is `Err`.
 * @returns The value returned by the matched function.
 *
 * **Example:**
 * ```typescript
 * const result = ok(42);
 * const matchedResult = match(result, (value) =&gt; value * 2, (error) =&gt; 0); // 84
 * ```
 */
export function match<T, E, U>(
  result: Result<T, E>,
  okFn: (value: T) => U,
  errFn: (error: E) => U,
): U {
  return isOk(result)
    ? okFn(result.value)
    : errFn(result.error);
}

export async function asyncMatch<T, E, U>(
  result: Result<T, E>,
  okFn: (value: T) => Promise<U>,
  errFn: (error: E) => Promise<U>,
): Promise<U> {
  return isOk(result)
    ? await okFn(result.value)
    : await errFn(result.error);
}

/**
 * **asyncMap**
 *
 * Asynchronously maps a function over the value of an `Ok` result.
 *
 * @param result - The `Result` to map over.
 * @param f - The asynchronous function to apply to the value of the `Ok` result.
 * @returns A `Promise` that resolves to a new `Result` with the result of applying the function to the value of the original `Ok` result, or the original `Err` result.
 *
 * **Example:**
 * ```typescript
 * const result = ok(42);
 * const mappedResult = await asyncMap(result, async (value) =&gt; value * 2); // Result&lt;number, unknown&gt;
 * ```
 */
export async function asyncMap<T, U, E>(
  result: Result<T, E>,
  f: (value: T) => Promise<U>,
): Promise<Result<U, E>> {
  return isOk(result)
    ? ok(await f(result.value))
    : result;
}

/**
 * **fromThrowable**
 *
 * Executes a function that may throw an error and returns the result as a `Result`.
 *
 * @param f - The function to execute.
 * @returns An `Ok` result containing the return value of the function if it succeeds, or an `Err` result containing the thrown error.
 *
 * **Example:**
 * ```typescript
 * const result = fromThrowable(() =&gt; {
 *   // Code that may throw an error
 * });
 * ```
 */
export function fromThrowable<T>(f: () => T): Result<T, unknown> {
  try {
    return ok(f());
  } catch (e) {
    return err(e);
  }
}

/**
 * **combine**
 *
 * Combines an array of `Result`s into a single `Result`.
 *
 * @param results - The array of `Result`s to combine.
 * @returns An `Ok` result containing an array of all the values from the input `Result`s if they are all `Ok`, or the first `Err` result encountered.
 *
 * **Example:**
 * ```typescript
 * const results = [ok(1), ok(2), ok(3)];
 * const combinedResult = combine(results); // Result&lt;[number, number, number], unknown&gt;
 * ```
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
 * **combineWithAllErrors**
 *
 * Combines an array of `Result`s into a single `Result`, collecting all errors.
 *
 * @param results - The array of `Result`s to combine.
 * @returns An `Ok` result containing an array of all the values from the input `Result`s if they are all `Ok`, or an `Err` result containing an array of all the errors.
 *
 * **Example:**
 * ```typescript
 * const results = [ok(1), err(&#x27;Error 1&#x27;), ok(3), err(&#x27;Error 2&#x27;)];
 * const combinedResult = combineWithAllErrors(results); // Result&lt;[number, number], string[]&gt;
 * ```
 */
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
  return errors.length === 0
    ? ok(values)
    : err(errors);
}

/**
 * **safeUnwrap**
 *
 * Unwraps a `Result`, throwing an error if it's `Err`.
 *
 * @param result - The `Result` to unwrap.
 * @returns The value of the `Ok` result.
 * @throws An error if the `Result` is `Err`.
 *
 * **Example:**
 * ```typescript
 * const result = ok(42);
 * const unwrappedResult = safeUnwrap(result); // 42
 * ```
 */
export function safeUnwrap<T, E>(result: Result<T, E>): T {
  if (isErr(result)) {
    throw new Error('Attempted to unwrap an Err value');
  }
  return result.value;
}
