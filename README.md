# [ResultWire](https://github.com/nick-potts/ResultWire)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/nick-potts/ResultWire/blob/master/LICENSE)
[![CI](https://github.com/nick-potts/ResultWire/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/nick-potts/ResultWire/actions/workflows/ci.yml)
[![npm](https://img.shields.io/badge/npm-0.1.0-orange.svg)](https://www.npmjs.com/package/resultwire)
[![NPM downloads](http://img.shields.io/npm/dm/ResultWire.svg?style=flat-square)](http://www.npmtrends.com/resultwire)
[![Percentage of issues still open](http://isitmaintained.com/badge/open/nick-potts/ResultWire.svg)](http://isitmaintained.com/project/nick-potts/ResultWire "Percentage of issues still open")


This library provides a minimal Result type and utility functions that can be sent over the wire with the design being inspired by Rust's Result<T, E> enum. It aims to provide better error handling in TypeScript by representing operations that might fail in a type-safe manner.

## Serialization

This library is designed to be used with Remix's turbo-stream. The ```Result``` type and its variants (```Ok```, ```Err```) can be serialized and deserialized over the wire, making it suitable for use in client-server communication.

## Installation

```bash
npm install resultwire
```

## Usage

```typescript
import { ok, err, Result, ... } from 'resultwire'
```

## API

### Result Type

```typescript
export type Ok<T> = {
  kind: 'ok';
  value: T;
};

export type Err<E> = {
  kind: 'err';
  error: E;
};

export type Result<T, E> = Ok<T> | Err<E>;
```

The ```Result<T, E>``` type represents the result of an operation that may succeed with a value of type ```T``` or fail with an error of type ```E```.

### Functions

#### ```ok(value: T): Ok<T>```

Creates a new ```Ok``` result.

**Example:**

```typescript
const result = ok(42); // Ok<number>
```

#### ```err<E>(error: E): Err<E>```

Creates a new ```Err``` result.

**Example:**

```typescript
const result = err('Something went wrong'); // Err<string>
```

#### ```isOk<T, E>(result: Result<T, E>): result is Ok<T>```

Checks if a ```Result``` is ```Ok```.

**Example:**

```typescript
const result = ok(42);
const isOkResult = isOk(result); // true
```

#### ```isErr<T, E>(result: Result<T, E>): result is Err<E>```

Checks if a ```Result``` is ```Err```.

**Example:**

```typescript
const result = err('Something went wrong');
const isErrResult = isErr(result); // true
```

#### ```map<T, U, E>(result: Result<T, E>, f: (value: T) => U): Result<U, E>```

Maps a function over the value of an ```Ok``` result.

**Example:**

```typescript
const result = ok(42);
const mappedResult = map(result, (value) => value * 2); // Result<number, unknown>
```

#### ```mapErr<T, E, F>(result: Result<T, E>, f: (error: E) => F): Result<T, F>```

Maps a function over the error of an ```Err``` result.

**Example:**

```typescript
const result = err('Something went wrong');
const mappedResult = mapErr(result, (error) => new Error(error)); // Result<unknown, Error>
```

#### ```unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T```

Unwraps a ```Result```, returning the value if it's ```Ok```, or a default value if it's ```Err```.

**Example:**

```typescript
const result = ok(42);
const unwrappedResult = unwrapOr(result, 0); // 42
```

#### ```andThen<T, U, E>(result: Result<T, E>, f: (value: T) => Result<U, E>): Result<U, E>```

Chains a function that returns a ```Result``` to the value of an ```Ok``` result.

**Example:**

```typescript
const result = ok(42);
const chainedResult = andThen(result, (value) => ok(value * 2)); // Result<number, unknown>
```

#### ```asyncAndThen<T, U, E>(result: Result<T, E>, f: (value: T) => Promise<Result<U, E>>): Promise<Result<U, E>>```

Asynchronously chains a function that returns a ```Promise<Result>``` to the value of an ```Ok``` result.

**Example:**

```typescript
const result = ok(42);
const chainedResult = await asyncAndThen(result, async (value) => ok(value * 2)); // Result<number, unknown>
```

#### ```orElse<T, E, F>(result: Result<T, E>, f: (error: E) => Result<T, F>): Result<T, F>```

Chains a function that returns a ```Result``` to the error of an ```Err``` result.

**Example:**

```typescript
const result = err('Something went wrong');
const chainedResult = orElse(result, (error) => ok('Default value')); // Result<string, unknown>
```

#### ```match<T, E, U>(result: Result<T, E>, okFn: (value: T) => U, errFn: (error: E) => U): U```

Matches a ```Result``` against two functions, one for ```Ok``` and one for ```Err```.

**Example:**

```typescript
const result = ok(42);
const matchedResult = match(result, (value) => value * 2, (error) => 0); // 84
```

#### ```asyncMatch<T, E, U>(result: Result<T, E>, okFn: (value: T) => Promise<U>, errFn: (error: E) => Promise<U>): Promise<U>```

Asynchronously matches a ```Result``` against two functions, one for ```Ok``` and one for ```Err```.

**Example:**

```typescript
const result = ok(42);
const matchedResult = await asyncMatch(result, (value) => Promise.resolve(value * 2), (error) => Promise.resolve(0)); // 84
```

#### ```asyncMap<T, U, E>(result: Result<T, E>, f: (value: T) => Promise<U>): Promise<Result<U, E>>```

Asynchronously maps a function over the value of an ```Ok``` result.

**Example:**

```typescript
const result = ok(42);
const mappedResult = await asyncMap(result, async (value) => value * 2); // Result<number, unknown>
```

#### ```fromThrowable<T>(f: () => T): Result<T, unknown>```

Executes a function that may throw an error and returns the result as a ```Result```.

**Example:**

```typescript
const result = fromThrowable(() => {
  // Code that may throw an error
});
```

#### ```combine<T, E>(results: Result<T, E>[]): Result<T[], E>```

Combines an array of ```Result```s into a single ```Result```.

**Example:**

```typescript
const results = [ok(1), ok(2), ok(3)];
const combinedResult = combine(results); // Result<[number, number, number], unknown>
```

#### ```combineWithAllErrors<T, E>(results: Result<T, E>[]): Result<T[], E[]>```

Combines an array of ```Result```s into a single ```Result```, collecting all errors.

**Example:**

```typescript
const results = [ok(1), err('Error 1'), ok(3), err('Error 2')];
const combinedResult = combineWithAllErrors(results); // Result<[number, number], string[]>
```

#### ```safeUnwrap<T, E>(result: Result<T, E>): T```

Unwraps a ```Result```, throwing an error if it's ```Err```.

**Example:**

```typescript
const result = ok(42);
const unwrappedResult = safeUnwrap(result); // 42
```





