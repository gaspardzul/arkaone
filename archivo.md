Prompt para generar proyecto base ArkaOne
Quiero que generes un monorepo llamado arkaone con pnpm workspaces que contenga frontend (React puro, TypeScript,
TailwindCSS, PWA) y backend (NestJS, TypeScript, PostgreSQL, Prisma) en el mismo repositorio. Debe ser fácil de instalar
con docker compose up -d, y fácil de ejecutar en local.
REQUISITOS GLOBALES
- Monorepo con pnpm workspaces.
- package.json raíz con workspaces a apps/* y packages/*.
- Eslint + Prettier configurados a nivel raíz.
- GitHub Actions CI: lint, typecheck, test, build de ambos apps y docker images.
- Husky + lint-staged + commitlint.
- Licencia AGPL-3.0 y archivos de comunidad (CODE_OF_CONDUCT.md, CONTRIBUTING.md).
- README con instrucciones claras.
ESTRUCTURA DEL REPO
apps/frontend → React + TS + Tailwind + PWA (sin frameworks).
apps/backend → NestJS + Prisma + PostgreSQL.
packages/ui → componentes compartidos.
packages/config → configuraciones ESLint/Prettier.
infra/docker → Dockerfile.frontend, Dockerfile.backend, docker-compose.yml, Caddyfile.
BACKEND (NestJS)
- NestJS + TypeScript, Prisma ORM, PostgreSQL.
- Autenticación con JWT (login, me, refresh).
- Modelos iniciales: Church, User, Member, Meeting, Attendance, Ministry, FollowUpTask, Offering.
- CRUD básicos con validaciones.
- Configuración con @nestjs/config, class-validator.
- Logger con Pino.
- Scripts para migraciones y seed inicial.
FRONTEND (React Puro + TS + Tailwind + PWA)
- Bundling con Vite.
- React Router para navegación.
- Zustand para estado global.
- TailwindCSS + shadcn/ui.
- PWA con manifest y service worker (Workbox).
- Pantallas iniciales: Login, Miembros, Reuniones/Asistencia, Ministerios, Seguimientos, Reportes básicos.
INFRA: DOCKER COMPOSE Y PROXY
- Contenedores: db (Postgres), redis, backend, frontend, proxy (Caddy).
- Variables .env para configurar conexiones y secrets JWT.
- Caddyfile para reverse proxy (frontend y backend).
CALIDAD Y DX
- ESLint/Prettier compartidos en packages/config.
- Scripts raíz: setup, dev, build, docker up/down.
- Tests básicos en backend (supertest) y frontend (Vitest + RTL).
ENTREGABLES CLAVE
- pnpm setup crea DB y usuario admin.
- pnpm dev levanta backend en :3000 y frontend en :5173.
- Usuario admin inicial: admin@arkaone.local / changeme.
- CRUD básicos funcionales.
- docker compose up -d levanta todo con proxy.
- Frontend instalable como PWA.
ESTILO Y BRANDING MÍNIMO
- Nombre: ArkaOne.
- Paleta azul/gris sobria.
- Layout con SideNav + TopBar, tarjetas modernas.
Generar todo el código y configuraciones para que el proyecto sea clonable y ejecutable siguiendo los pasos del README.