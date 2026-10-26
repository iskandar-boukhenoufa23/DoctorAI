# Doctor AI frontend

The frontend is a Next.js 16 application using React 19, Tailwind CSS 4, Clerk UI components, and Lucide icons. It currently provides the Doctor AI landing page and sign-in/sign-up controls.

> This interface is an educational prototype, not a medical service. It does not provide diagnosis or replace professional care. Do not enter real patient information.

## Requirements

- Node.js 22 or newer
- pnpm 12 (the package manager version is specified in `package.json`)
- Clerk development credentials for the authentication UI

## Configure

Provide your Clerk development credentials through the frontend environment. The public publishable key can use the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` variable; keep the Clerk secret key private. Do not commit local environment files or secrets.

The backend API runs separately from this app. Although the Dockerfile accepts `NEXT_PUBLIC_API_URL` as a build argument, the current frontend source does not call that API yet.

## Run locally

From this directory:

```powershell
pnpm install
pnpm dev -- --port 3001
```

Open `http://localhost:3001`. Port 3001 avoids the NestJS backend's default port 3000.

## Production build

```powershell
pnpm build
pnpm start -- --port 3001
```

## Available scripts

- `pnpm dev` starts the Next.js development server.
- `pnpm build` creates a production build.
- `pnpm start` serves the production build.

The landing page references image assets in `public/`. Keep any referenced assets available there for the page to render correctly.
