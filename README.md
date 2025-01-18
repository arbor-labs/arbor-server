# Web3 NestJS + GraphQL Template

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository. This also includes the added bells and whistles:

- TypeORM for working with a SQL database
- GraphQL support
- Viem with custom scalars for Ethereum addresses and hashes
- A pretty logger
- A generic pagination and sorting service that can be applied to any entity
- Base entities setup using UUID strings as IDs
- A decimal transformer
- An optional but non-null decorator
- TSConfig/ESLint/Prettier wrangling
- Husky pre-commit hooks and conventional commit messages

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

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
