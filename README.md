# TeachFlow

TeachFlow is a teacher work-management application for tasks, academic dates,
document templates, generated documents, reminders, notifications, and account
settings.

## Stack

- React 19, TypeScript, Vite, TanStack Start and TanStack Router
- Better Auth with PostgreSQL/Kysely in deployed environments
- PGlite for local preview development when `DATABASE_URL` is not configured
- Zod validation and parameterized SQL
- PDF, DOCX, XLSX, and PPTX document generation
- Vercel/Nitro deployment

## Local development

Requirements: Node.js 22 or newer and npm.

```bash
npm ci
npm run dev
```

The development server listens on `http://localhost:8080`.

Useful checks:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

`npm test` includes authentication, application-data, migration-helper, and
DOCX/XLSX/PDF/PPTX export tests.

Before a production deployment, validate the deployment environment without
printing secret values:

```bash
npm run check:production-env
```

Use [`.env.example`](.env.example) as the variable-name checklist. Keep the
real values in Vercel or another secret manager; do not commit a populated
`.env` file.

## Environment configuration

Do not commit `.env` files or secret values. The application uses these values
when deployed:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string. Required for persistent production data. |
| `BETTER_AUTH_URL` | Public application URL used by Better Auth. |
| `BETTER_AUTH_SECRET` | Production session/signing secret. Generate and store it securely. |
| `GROK_AUTH_ISSUER` | Federated authentication issuer. |
| `GROK_AUTH_CLIENT_ID` | Federated authentication client ID. |
| `GROK_AUTH_CLIENT_SECRET` | Federated authentication client secret. |
| `GROK_PROJECT_ID` | Deployment identity used for auth audience isolation. |
| `GROK_GATE_ORIGIN` | Optional preview/auth gate origin. |
| `VITE_AUTH_ENABLED` | Client auth presentation flag. It must not be used as server authorization. |

Production must use a real `DATABASE_URL`. Without it, the app uses an
ephemeral PGlite database intended for local preview only.

## Database and migrations

`migrations/0001_auth.sql` creates the Better Auth tables and
`migrations/0002_teachflow.sql` creates the application schema. The nested
`migrations/auth/0001_auth.sql` file is the source copy used for drift checks;
the root copy is the one applied by the migration runner.

With `DATABASE_URL` configured, `npm run db:migrate` applies pending migrations
transactionally and records them in `_migrations`. Without it, PGlite applies
the root migrations automatically for local preview.

Never run destructive migrations against production without a verified backup.

## Deployment

The project is configured for Vercel. Configure production environment values in
Vercel, verify the authentication callback URLs, and deploy from a clean
checkout using the committed lockfile. The build command is:

```bash
npm run build
```

The build performs the application build and then runs database migrations when
`DATABASE_URL` is present.

## Current verification status

- TypeScript: passing
- ESLint: passing with no warnings
- Automated tests: 64 passing
- Production build: passing
- Homepage and login routes: browser-verified locally
- Document exports: DOCX, XLSX, PDF, and PPTX tests passing

Still requiring real-environment verification:

- PostgreSQL/Neon connectivity and migration execution
- Production Better Auth/OAuth credentials and callback flows
- Vercel deployment and rollback procedure
- Database backup and restore
- Four npm audit findings affecting export dependencies; upgrades require
  compatibility testing before adoption
