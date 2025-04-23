# Movielandia24 API

<div align="center">
  <h3>A comprehensive movie database REST API built with NestJS and Prisma</h3>
  
  <p>
    <a href="#description">Description</a> •
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#api-documentation">API</a> •
    <a href="#testing">Testing</a>
  </p>
</div>

## Description

Movielandia24 is a feature-rich REST API that powers a modern movie database platform. Built with NestJS and Prisma ORM, it offers a robust backend solution for managing:

- Movies and TV series data
- User accounts and authentication
- Reviews and ratings
- Forum discussions
- Personalized watchlists
- Actor and crew information

## Features

- 🎬 **Comprehensive Media Management**

    - Movies, TV series, episodes tracking
    - Actor and crew information
    - Genre categorization
    - Media metadata management

- 👥 **User Features**

    - JWT-based authentication
    - User profiles and preferences
    - Watchlists and favorites
    - Rating and review system

- 💬 **Community Features**

    - Forum system with categories
    - Topic discussions
    - User messaging
    - Follow system

- 🛠 **Technical Features**
    - RESTful API architecture
    - Swagger/OpenAPI documentation
    - Comprehensive test coverage
    - Email notifications via Resend
    - Caching system
    - Pagination and filtering

## Tech Stack

- **Core Framework**: [NestJS](https://nestjs.com/)
- **Database & ORM**:
    - [Prisma](https://www.prisma.io/) (ORM)
    - SQLite (Development)
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger/OpenAPI
- **Email Service**: Resend
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

3. Set up environment variables:
   Create a `.env` file in the root directory:

    ```env
    DATABASE_URL="file:./prisma/database/movielandia24.db"
    AUTH_SECRET="your-auth-secret-key"
    RESEND_API_KEY="your-resend-api-key"
    FRONTEND_URL="http://localhost:3000"
    ```

4. Set up the database:

    ```bash
    # Generate Prisma client
    npm run prisma:generate

    # Run migrations
    npm run migrate:dev

    # Seed the database
    npm run prisma:seed
    ```

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Documentation

- Access Swagger UI: `http://localhost:3000/api`
- Download OpenAPI spec: `http://localhost:3000/api-json`

## Database Management

```bash
# Open Prisma Studio (database GUI)
npm run prisma:studio

# Create a new migration
npm run migrate:dev:create

# Reset database (caution: deletes all data)
npm run migrate:reset
```

## Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Generate test coverage
npm run test:cov
```

## Project Structure

```
├── prisma/               # Database configuration and migrations
├── src/
│   ├── auth/            # Authentication module
│   ├── modules/         # Feature modules (movies, users, etc.)
│   ├── email/           # Email service and templates
│   └── utils/           # Utility functions and helpers
└── test/                # Test configurations and e2e tests
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
