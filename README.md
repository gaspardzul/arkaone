# ArkaOne

Sistema de control de iglesias moderno y completo desarrollado como monorepo con React y NestJS.

## 🚀 Características

- **Frontend**: React + TypeScript + TailwindCSS + PWA
- **Backend**: NestJS + Prisma + PostgreSQL
- **Monorepo**: pnpm workspaces
- **Docker**: Configuración completa con docker-compose
- **CI/CD**: GitHub Actions
- **Calidad**: ESLint, Prettier, Husky, Tests

## 📋 Requisitos

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Docker y Docker Compose (para desarrollo con contenedores)

## 🛠️ Instalación y Configuración

### Desarrollo Local

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd arkaone
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Configurar variables de entorno**
```bash
cp apps/backend/.env.example apps/backend/.env
# Editar las variables según tu configuración
```

4. **Configurar base de datos y datos iniciales**
```bash
pnpm setup
```

5. **Iniciar desarrollo**
```bash
pnpm dev
```

El backend estará disponible en `http://localhost:3000` y el frontend en `http://localhost:5173`.

### Con Docker

1. **Levantar todos los servicios**
```bash
pnpm docker:up
```

2. **Configurar base de datos (primera vez)**
```bash
docker compose exec backend pnpm db:setup
docker compose exec backend pnpm seed
```

La aplicación estará disponible en `http://localhost` (proxy Caddy).

## 🏗️ Estructura del Proyecto

```
arkaone/
├── apps/
│   ├── backend/          # API NestJS
│   └── frontend/         # App React
├── packages/
│   ├── config/           # Configuraciones ESLint/Prettier
│   └── ui/               # Componentes compartidos
├── infra/
│   └── docker/           # Dockerfiles y configuración
├── .github/
│   └── workflows/        # GitHub Actions
└── docs/                 # Documentación
```

## 👤 Usuario Inicial

- **Email**: admin@arkaone.local
- **Password**: changeme

## 📱 PWA

La aplicación frontend es una Progressive Web App (PWA) que se puede instalar en dispositivos móviles y de escritorio.

## 🧪 Testing

```bash
# Ejecutar todos los tests
pnpm test

# Tests del backend
pnpm --filter backend test

# Tests del frontend
pnpm --filter frontend test
```

## 🔧 Scripts Disponibles

- `pnpm setup` - Configuración inicial completa
- `pnpm dev` - Desarrollo local
- `pnpm build` - Build de producción
- `pnpm test` - Ejecutar tests
- `pnpm lint` - Linting
- `pnpm format` - Formateo de código
- `pnpm docker:up` - Levantar con Docker
- `pnpm docker:down` - Parar contenedores

## 🤝 Contribuir

Ver [CONTRIBUTING.md](./CONTRIBUTING.md) para detalles sobre cómo contribuir al proyecto.

## 📄 Licencia

Este proyecto está bajo la licencia AGPL-3.0. Ver [LICENSE](./LICENSE) para más detalles.

## 📞 Soporte

Para reportar bugs o solicitar características, por favor crea un issue en GitHub.
