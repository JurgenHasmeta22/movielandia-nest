# Movielandia24 (NestJS + Inertia)

<div align="center">
  <h3>A full-stack movie platform built with NestJS, Inertia.js, React and Prisma</h3>

  <p>
    <a href="#description">Description</a> •
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#api-documentation">API</a> •
    <a href="#testing">Testing</a>
  </p>
</div>

## Description

Movielandia24 is a feature-rich movie and series platform with server-driven pages powered by Inertia.

It combines:

- NestJS backend modules (controllers, services, auth, validation)
- Inertia middleware to serve React pages from Nest routes
- React + TypeScript page components in `resources/js/pages`
- Prisma ORM for database access

It manages:

- Movies and TV series metadata
- Actor and crew catalogs
- User accounts, authentication and profile data
- Reviews, ratings and favorites
- Community forum content and messaging

## Features

- 🎬 **Media Management**
    - Movies, series, seasons and episodes
    - Actor and crew profiles
    - Genre browsing and filtering

- 👥 **User Features**
    - Session/JWT-backed authentication flows
    - Profiles, favorites, reviews and lists
    - Follow and messaging features

- 💬 **Community**
    - Forum categories and topics
    - User-generated discussion content

- 🛠 **Platform**
    - Inertia + React rendering from Nest controllers
    - REST API endpoints and Swagger docs
    - Prisma migrations and seed scripts
    - Jest unit/e2e tests

## Tech Stack

- **Backend**: [NestJS](https://nestjs.com/)
- **Frontend Adapter**: [Inertia.js](https://inertiajs.com/) (`inertia-nestjs`, `@inertiajs/react`)
- **Frontend UI**: React 19 + TypeScript + Tailwind CSS
- **Database/ORM**: [Prisma](https://www.prisma.io/) + SQLite (dev)
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest

## Getting Started

### Prerequisites

- Node.js (>= 20.0.0)
- npm (>= 10.0.0)
- Git

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/JurgenHasmeta22/movielandia-nest.git
    cd movielandia-nest
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create `.env`:

    ```env
    DATABASE_URL="file:./prisma/database/movielandia24.db"
    AUTH_SECRET="your-auth-secret-key"
    RESEND_API_KEY="your-resend-api-key"
    FRONTEND_URL="http://localhost:3000"
    ```

4. Prepare database:

    ```bash
    npm run prisma:generate
    npm run migrate:dev
    npm run prisma:seed
    ```

### Run in Development

Start Nest server:

```bash
npm run start:dev
```

In another terminal, build frontend assets in watch mode:

```bash
npm run dev:client
```

Application URL: `http://localhost:3000`

### Production Build

```bash
npm run build:all
npm run start:prod
```

## Architecture

- `src/`
    - NestJS modules (`src/modules/*`)
    - Auth and middleware (`src/auth`, `src/inertia`)
    - Shared utilities and providers
- `resources/js/`
    - Inertia React pages (`pages/`)
    - Layouts and reusable components
- `prisma/`
    - Schema, migrations and seed scripts
- `bootstrap/ssr/`
    - SSR bootstrap/runtime assets

## API Documentation

- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/api-json`

## Database Management

```bash
# Prisma Studio
npm run prisma:studio

# Create a migration
npm run migrate:dev:create

# Reset development database
npm run migrate:reset
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## Project Structure

```
├── prisma/               # Database config, schema, migrations, seed data
├── resources/js/         # Inertia React pages, layouts, components
├── src/                  # NestJS application modules and middleware
├── bootstrap/ssr/        # SSR runtime/bootstrap output
└── test/                 # E2E tests and test config
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m "Add some amazing feature"`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
