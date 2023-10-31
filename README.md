<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<h1 align="center">
  Firewood API
</h1>

## Description

Firewood API is a REST API for the firewood app, which allows users to perform the following actions:
- Register.
- Login.
- Handle suppliers.
- Handle buyings.
- Handle inventory
- Handle sales.

## Technologies
- NestJS.
- TypeORM.
- PostgreSQL.
- JWT Authentication.
- Swagger for documentation.
- Bcrypt for password encryption.
- Passport for authentication.
- Cloudinary for image storage.
- Multer for image upload.
- Jest for testing.
- Docker for database containerization.

## Installation

### Up the database container
```bash
$ docker-compose up -d
```

### Create a .env file based on .env.example

### Install dependencies
```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Documentation

### Swagger
```bash
http:localhost:3000/api/docs
```
