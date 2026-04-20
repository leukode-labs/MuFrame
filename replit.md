# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### MuFrame (`artifacts/uomo-ecommerce`)
- Cloned from: https://github.com/shakti177/uomo-ecommerce-website-reactjs
- React + Vite web app (migrated from Create React App)
- Preview path: `/` (root)
- Key dependencies: React 19, Redux Toolkit, react-redux, react-router-dom, MUI v6, @react-three/fiber v9, @react-three/drei v10, Swiper, react-hot-toast, react-icons
- Features: Home page with 3D shirt model (WebGL), product listings, shopping cart, wishlist, blog, contact, authentication pages

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/uomo-ecommerce run dev` — run ecommerce frontend locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
