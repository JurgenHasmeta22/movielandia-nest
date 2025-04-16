<p align="center">
  <h1 align="center">Movielandia24 API</h1>
  <p align="center">A comprehensive movie database REST API built with NestJS</p>
</p>

## Description

Movielandia24 is a feature-rich REST API for a movie database application built with NestJS and Prisma ORM. It provides comprehensive endpoints for managing movies, series, actors, user accounts, reviews, ratings, and more.

## Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: SQLite (can be configured for other databases)
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger/OpenAPI
- **Email Service**: Resend
- **Testing**: Jest

## Prerequisites

- Node.js (>= 20.0.0)
- npm (>= 10.0.0)

## Installation

```bash
# Clone the repository
$ git clone https://github.com/JurgenHasmeta22/movielandia-nest.git

# Navigate to the project directory
$ cd movielandia-nest

# Install dependencies
$ npm install
```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-auth-secret-key"
RESEND_API_KEY="your-resend-api-key"
FRONTEND_URL="http://localhost:3000"
```

## Database Setup

```bash
# Generate Prisma client
$ npm run prisma:generate

# Run database migrations
$ npm run migrate:dev

# Seed the database with initial data
$ npm run prisma:seed
```

## Running the Application

```bash
# Development mode
$ npm run start

# Watch mode (recommended for development)
$ npm run start:dev

# Production mode
$ npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Documentation

Swagger documentation is available at `http://localhost:3000/api` when the application is running.

## Testing

```bash
# Unit tests
$ npm run test

# E2E tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

## Database Management

```bash
# Open Prisma Studio (database GUI)
$ npm run prisma:studio

# Create a new migration
$ npm run migrate:dev:create

# Reset the database
$ npm run migrate:reset
```