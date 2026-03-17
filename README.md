# Bergentrukung

Nuxt 4 storefront using `@sidebase/nuxt-auth` with the local provider.

## Setup

Install dependencies:

```bash
npm install
```

Create an `.env` file from `.env template` and fill in the database, Stripe, and auth values.

## Auth

Authentication is email/password based and backed by the local Nuxt API:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/auth/session`

Passwords are stored in `users.pwd_hash`. Sessions are represented by signed bearer tokens generated from `auth_secret`.

## Development

```bash
npm run dev
```

## Production

```bash
npm run build
npm run preview
```
