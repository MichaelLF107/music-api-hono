## Music API

Music information API made with Hono and Prisma

## Requirements

- Latest version of [Bun](https://bun.sh/)
- Prisma CLI

## Instalation

1. Clone the repository
```bash
git clone https://github.com/MichaelLF107/music-api-hono.git
```

2. Install project dependencies
```bash
bun install
```

3. Create the .env file with the following variables
```bash
DATABASE_URL= * url of your sqlite database *
SECRET_KEY= * your jwt secret *
```

4. Run database migrations
```bash
prisma migrate dev
```

## Usage

Start the development server
```bash
bun run dev
```

The server will run on `http://localhost:3000`
