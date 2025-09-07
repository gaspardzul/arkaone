# Changelog

Todos los cambios notables a este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Sistema completo de gestión de iglesias
- Autenticación JWT con refresh tokens
- CRUD completo para todas las entidades principales
- PWA con service worker y manifest
- Docker Compose para desarrollo y producción
- CI/CD con GitHub Actions
- Componentes UI compartidos con TailwindCSS

## [1.0.0] - 2024-01-XX

### Added
- **Backend NestJS**
  - API REST completa con Swagger documentation
  - Autenticación JWT con Passport
  - Base de datos PostgreSQL con Prisma ORM
  - Modelos: Church, User, Member, Meeting, Attendance, Ministry, FollowUpTask, Offering
  - Validación con class-validator
  - Logging con Pino
  - Seed script para datos iniciales

- **Frontend React**
  - Aplicación SPA con React 18 y TypeScript
  - Routing con React Router
  - Estado global con Zustand
  - UI moderna con TailwindCSS
  - Componentes accesibles y responsivos
  - PWA con soporte offline

- **Infraestructura**
  - Docker Compose con PostgreSQL, Redis, Caddy
  - Dockerfiles optimizados para producción
  - Reverse proxy con Caddy
  - Variables de entorno configurables

- **DevOps**
  - Monorepo con pnpm workspaces
  - ESLint y Prettier configurados
  - Husky hooks para pre-commit y commit-msg
  - GitHub Actions para CI/CD
  - Construcción automática de imágenes Docker

- **Funcionalidades**
  - Dashboard con estadísticas
  - Gestión de miembros con información completa
  - Programación y seguimiento de reuniones
  - Control de asistencia a reuniones
  - Organización de ministerios
  - Tareas de seguimiento pastoral
  - Registro de ofrendas y finanzas
  - Reportes básicos
  - Configuración del sistema

### Security
- Autenticación segura con JWT
- Validación de entrada en todas las APIs
- Headers de seguridad configurados
- Conexiones HTTPS en producción
- Variables de entorno para secretos

### Documentation
- README completo con instrucciones de setup
- Código de conducta y guías de contribución
- Documentación de API con Swagger
- Comentarios en código crítico
- Plantillas para issues y PRs
