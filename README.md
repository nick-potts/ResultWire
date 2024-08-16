# [ResultWire](https://github.com/nick-potts/ResultWire)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/nick-potts/ResultWire/blob/master/LICENSE)
[![CI](https://github.com/nick-potts/ResultWire/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/nick-potts/ResultWire/actions/workflows/ci.yml)
[![Tree Shakable](https://deno.bundlejs.com/badge?q=resultwire&treeshake=[*])](https://bundlejs.com/?q=resultwire&treeshake=[*])

This library provides a minimal Result type and utility functions that can be sent from server to client with the design being inspired by Rust's Result<T, E> enum. It aims to provide better error handling in TypeScript by representing operations that might fail in a type-safe manner.

## Why another error-as-value library?

ResultWire doesn't use classes, and instead uses plain objects. This means that it can be sent from server to client, and the helper methods can check the actual objects contents, instead of relying on instanceOf methods. Specifically, this library is designed to be used with Remix's turbo-stream. The ```Result``` type and its variants (```Ok```, ```Err```) can be serialized and deserialized over the network, making it suitable for use in client-server communication.

## Installation

```bash
npm install resultwire
```

## Usage

```typescript
import { ok, err, Result, ... } from 'resultwire'
```

## API

## Table of Contents

- [Types](#types)
  - [Ok](#ok)
  - [Err](#err)
  - [Result](#result)
- [Functions](#functions)
  - [ok](#ok-1)
  - [err](#err-1)
  - [isOk](#isok)
  - [isErr](#iserr)
  - [map](#map)
  - [mapErr](#maperr)
  - [unwrapOr](#unwrapor)
  - [andThen](#andthen)
  - [asyncAndThen](#asyncandthen)
  - [orElse](#orelse)
  - [match](#match)
  - [asyncMatch](#asyncmatch)
  - [asyncMap](#asyncmap)
  - [fromThrowable](#fromthrowable)
  - [fromPromise](#frompromise)
  - [combine](#combine)
  - [combineWithAllErrors](#combinewithallerrors)
  - [unsafeUnwrap](#unsafeunwrap)

## Types

### Ok

Represents a successful value wrapped in an ```Ok``` variant.

### Err

Represents an error value wrapped in an ```Err``` variant.

### Result

A union type that represents either an ```Ok``` value or an ```Err``` value.

## Functions

### ok

Creates a new ```Ok``` result.

**Example:**
```typescript
const result = ok(42);
```

### err

Creates a new ```Err``` result.

**Example:**
```typescript
const result = err('Something went wrong');
```

### isOk

Checks if a ```Result``` is ```Ok```.

**Example:**
```typescript
const result = ok(42);
const isOkResult = isOk(result); // true
```

### isErr

Checks if a ```Result``` is ```Err```.

**Example:**
```typescript
const result = err('Something went wrong');
const isErrResult = isErr(result); // true
```

### map

Maps a function over the value of an ```Ok``` result.

**Example:**
```typescript
const result = ok(42);
const mappedResult = map(result, (value) => value * 2);
```

### mapErr

Maps a function over the error of an ```Err``` result.

**Example:**
```typescript
const result = err('Something went wrong');
const mappedResult = mapErr(result, (error) => new Error(error));
```

### unwrapOr

Unwraps a ```Result```, returning the value if it's ```Ok```, or a default value if it's ```Err```.

**Example:**
```typescript
const result = ok(42);
const unwrappedResult = unwrapOr(result, 0); // 42
```

### andThen

Chains a function that returns a ```Result``` to the value of an ```Ok``` result.

**Example:**
```typescript
const result = ok(42);
const chainedResult = andThen(result, (value) => ok(value * 2));
```

### asyncAndThen

Asynchronously chains a function that returns a ```Promise<Result>``` to the value of an ```Ok``` result.

**Example:**
```typescript
const result = ok(42);
const chainedResult = await asyncAndThen(result, async (value) => ok(value * 2));
```

### orElse

Chains a function that returns a ```Result``` to the error of an ```Err``` result.

**Example:**
```typescript
const result = err('Something went wrong');
const chainedResult = orElse(result, (error) => ok('Default value'));
```

### match

Matches a ```Result``` against two functions, one for ```Ok``` and one for ```Err```.

**Example:**
```typescript
const result = ok(42);
const matchedResult = match(result, (value) => value * 2, (error) => 0); // 84
```

### asyncMatch

Asynchronously matches a ```Result``` against two functions, one for ```Ok``` and one for ```Err```.

**Example:**
```typescript
const result = ok(42);
const matchedResult = await asyncMatch(result, async (value) => value * 2, async (error) => 0); // 84
```

### asyncMap

Asynchronously maps a function over the value of an ```Ok``` result.

**Example:**
```typescript
const result = ok(42);
const mappedResult = await asyncMap(result, async (value) => value * 2);
```

### fromThrowable

Executes a function that may throw an error and returns the result as a ```Result```.

**Example:**
```typescript
const result = fromThrowable(() => {
  // Code that may throw an error
});
```

### fromPromise

Converts a ```Promise``` into a ```Promise<Result>```.

**Example:**
```typescript
const promise = Promise.resolve(42);
const result = await fromPromise(promise);
```

### combine

Combines an array of ```Result```s into a single ```Result```.

**Example:**
```typescript
const results = [ok(1), ok(2), ok(3)];
const combinedResult = combine(results);
```

### combineWithAllErrors

Combines an array of ```Result```s into a single ```Result```, collecting all errors.

**Example:**
```typescript
const results = [ok(1), err('Error 1'), ok(3), err('Error 2')];
const combinedResult = combineWithAllErrors(results);
```

### unsafeUnwrap

Unwraps a ```Result```, throwing an error if it's ```Err```.

**Example:**
```typescript
const result = ok(42);
const unwrappedResult = unsafeUnwrap(result); // 42
```
