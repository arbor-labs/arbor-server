# Arbor Server

## Description

This is the backend server built with [NestJS](https://nestjs.com) powering the Arbor Protocol's [dApp UI](https://arbor.audio).

## Installation

```bash
pnpm install
```

## Running the app

First, copy `.env.example -> .env`.

```bash
# development mode
$ pnpm run dev

# start without watcher
$ pnpm run start

# production mode
$ pnpm run start:prod

# lint with ESLint
$ pnpm lint

# format with Prettier
$ pnpm format
```

## Running tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
