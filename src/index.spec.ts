import {
  ok,
  err,
  isOk,
  isErr,
  map,
  mapErr,
  unwrapOr,
  andThen,
  orElse,
  match,
  asyncAndThen,
  asyncMatch,
  asyncMap,
  fromThrowable,
  combine,
  combineWithAllErrors,
  safeUnwrap,
} from './index';

import {expect} from 'expect';

describe('Result', () => {
  it('should create an Ok result', () => {
    const result = ok(42);
    expect(result).toEqual({ kind: 'ok', value: 42 });
  });

  it('should create an Err result', () => {
    const result = err('Something went wrong');
    expect(result).toEqual({ kind: 'err', error: 'Something went wrong' });
  });

  it('should check if a Result is Ok', () => {
    const okResult = ok(42);
    const errResult = err('Something went wrong');
    expect(isOk(okResult)).toBe(true);
    expect(isOk(errResult)).toBe(false);
  });

  it('should check if a Result is Err', () => {
    const okResult = ok(42);
    const errResult = err('Something went wrong');
    expect(isErr(okResult)).toBe(false);
    expect(isErr(errResult)).toBe(true);
  });

  it('should map a function over the value of an Ok result', () => {
    const result = ok(42);
    const mappedResult = map(result, (value) => value * 2);
    expect(mappedResult).toEqual({ kind: 'ok', value: 84 });
  });

  it('should not map a function over the value of an Err result', () => {
    const result = err('Something went wrong');
    const mappedResult = map(result, () => {
      throw new Error('Should not be called')
    });
    expect(mappedResult).toEqual({ kind: 'err', error: 'Something went wrong' });
  });

  it('should map a function over the error of an Err result', () => {
    const result = err('Something went wrong');
    const mappedResult = mapErr(result, (error) => new Error(error));
    expect(mappedResult).toEqual({
      kind: 'err',
      error: new Error('Something went wrong'),
    });
  });

  it('should not map a function over the error of an Ok result', () => {
    const result = ok(42)
    const mappedResult = mapErr(result, () => {
      throw new Error('Should not be called')
    });
    expect(mappedResult).toEqual({ kind: 'ok', value: 42 });
  });

  it('should unwrap a Result, returning the value if it\'s Ok', () => {
    const result = ok(42);
    const unwrappedResult = unwrapOr(result, 0);
    expect(unwrappedResult).toBe(42);
  });

  it('should unwrap a Result, returning the default value if it\'s Err', () => {
    const result = err('Something went wrong');
    const unwrappedResult = unwrapOr(result, 0);
    expect(unwrappedResult).toBe(0);
  });

  it('should chain a function that returns a Result to the value of an Ok result', () => {
    const result = ok(42);
    const chainedResult = andThen(result, (value) => ok(value * 2));
    expect(chainedResult).toEqual({ kind: 'ok', value: 84 });
  });

  it('should not chain a function to the value of an Err result', () => {
    const result = err('Something went wrong');
    const chainedResult = andThen(result, () => {
      throw new Error('Should not be called');
    });
    expect(chainedResult).toEqual({ kind: 'err', error: 'Something went wrong' });
  });

  it('should apply a function to the value of an Ok result', () => {
    const result = ok(42);
    const appliedResult = orElse(result, () => ok(0));
    expect(appliedResult).toEqual({ kind: 'ok', value: 42 });
  });

  it('should apply a function to the error of an Err result', () => {
    const result = err('Something went wrong');
    const appliedResult = orElse(result, () => ok(0));
    expect(appliedResult).toEqual({ kind: 'ok', value: 0 });
  });

  it('should match the Ok variant of a Result', () => {
    const result = ok(42);
    const matchedValue = match(
      result,
      (value) => value * 2,
      () => 0,
    );
    expect(matchedValue).toBe(84);
  });

  it('should match the Err variant of a Result', () => {
    const result = err('Something went wrong');
    const matchedValue = match(
      result,
      () => {
        throw new Error('Should not be called');
      },
      () => 0,
    );
    expect(matchedValue).toBe(0);
  });

  it('should async chain a function that returns a Promise<Result> to the value of an Ok result', async () => {
    const result = ok(42);
    const chainedResult = await asyncAndThen(result, async (value) =>
      Promise.resolve(ok(value * 2)),
    );
    expect(chainedResult).toEqual({ kind: 'ok', value: 84 });
  });

  it('should not async chain a function to the value of an Err result', async () => {
    const result = err('Something went wrong');
    const chainedResult = await asyncAndThen(result, async () => {
      throw new Error('Should not be called');
      }
    );
    expect(chainedResult).toEqual({ kind: 'err', error: 'Something went wrong' });
  });

  it('should async match the Ok variant of a Result', async () => {
    const result = ok(42);
    const matchedValue = await asyncMatch(
      result,
      async (value) => Promise.resolve(value * 2),
      async () => Promise.resolve(0),
    );
    expect(matchedValue).toBe(84);
  });

  it('should async match the Err variant of a Result', async () => {
    const result = err('Something went wrong');
    const matchedValue = await asyncMatch(
      result,
      async () => {
        throw new Error('Should not be called');
      },
      async () => Promise.resolve(0),
    );
    expect(matchedValue).toBe(0);
  });

  it('should async map a function over the value of an Ok result', async () => {
    const result = ok(42);
    const mappedResult = await asyncMap(result, async (value) =>
      Promise.resolve(value * 2),
    );
    expect(mappedResult).toEqual({ kind: 'ok', value: 84 });
  });

  it('should not async map a function over the value of an Err result', async () => {
    const result = err('Something went wrong');
    const mappedResult = await asyncMap(result, async () => {
      throw new Error('Should not be called');
      },
    );
    expect(mappedResult).toEqual({ kind: 'err', error: 'Something went wrong' });
  });

  it('should create an Ok result from a throwable function', () => {
    const result = fromThrowable(() => 42);
    expect(result).toEqual({ kind: 'ok', value: 42 });
  });

  it('should create an Err result from a throwable function', () => {
    const result = fromThrowable(() => {
      throw new Error('Something went wrong');
    });
    expect(result.kind).toEqual('err');
  });

  it('should combine an array of Results into a single Result', () => {
    const results = [ok(1), ok(2), ok(3)];
    const combinedResult = combine(results);
    expect(combinedResult).toEqual({ kind: 'ok', value: [1, 2, 3] });
  });

  it('should return an Err result if any of the Results in the array are Err', () => {
    const results = [ok(1), err('Something went wrong'), ok(3)];
    const combinedResult = combine(results);
    expect(combinedResult).toEqual({
      kind: 'err',
      error: 'Something went wrong',
    });
  });

  it('should combine an array of Results into a single Result with all errors', () => {
    const results = [ok(1), err('Error 1'), ok(3), err('Error 2')];
    const combinedResult = combineWithAllErrors(results);
    expect(combinedResult).toEqual({
      kind: 'err',
      error: ['Error 1', 'Error 2'],
    });
  });

  it('should return an Ok result with all values if all Results in the array are Ok', () => {
    const results = [ok(1), ok(2), ok(3)];
    const combinedResult = combineWithAllErrors(results);
    expect(combinedResult).toEqual({ kind: 'ok', value: [1, 2, 3] });
  });

  it('should safely unwrap an Ok result', () => {
    const result = ok(42);
    const unwrappedResult = safeUnwrap(result);
    expect(unwrappedResult).toBe(42);
  });

  it('should throw an error when unwrapping an Err result', () => {
    const result = err('Something went wrong');
    expect(() => safeUnwrap(result)).toThrowError(
      'Attempted to unwrap an Err value',
    );
  });
});
