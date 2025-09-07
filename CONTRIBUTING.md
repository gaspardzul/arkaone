# Guía de Contribución

¡Gracias por tu interés en contribuir a ArkaOne! Esta guía te ayudará a comenzar.

## Código de Conducta

Este proyecto y todos los participantes están gobernados por el [Código de Conducta de ArkaOne](CODE_OF_CONDUCT.md). Al participar, se espera que mantengas este código.

## ¿Cómo puedo contribuir?

### Reportar Bugs

Los bugs se rastrean como [issues de GitHub](https://github.com/arkaone/arkaone/issues). Crea un issue y proporciona la siguiente información:

* **Usa un título claro y descriptivo** para el issue que identifique el problema.
* **Describe los pasos exactos para reproducir el problema** con el mayor detalle posible.
* **Proporciona ejemplos específicos** para demostrar los pasos.
* **Describe el comportamiento que observaste** después de seguir los pasos.
* **Explica qué comportamiento esperabas ver** y por qué.
* **Incluye capturas de pantalla y GIFs animados** si es posible.

### Sugerir Mejoras

Las mejoras también se rastrean como [issues de GitHub](https://github.com/arkaone/arkaone/issues). Crea un issue y proporciona la siguiente información:

* **Usa un título claro y descriptivo** para el issue que identifique la sugerencia.
* **Proporciona una descripción paso a paso de la mejora sugerida** con el mayor detalle posible.
* **Proporciona ejemplos específicos** para demostrar los pasos.
* **Describe el comportamiento actual** y **explica qué comportamiento esperarías ver**.
* **Explica por qué esta mejora sería útil** para la mayoría de usuarios de ArkaOne.

### Tu Primera Contribución de Código

¿No estás seguro por dónde empezar a contribuir a ArkaOne? Puedes comenzar buscando estos issues:

* [Beginner issues](https://github.com/arkaone/arkaone/labels/beginner) - issues que solo deberían requerir unas pocas líneas de código.
* [Help wanted issues](https://github.com/arkaone/arkaone/labels/help%20wanted) - issues que deberían ser un poco más involucrados que los issues de `beginner`.

### Pull Requests

El proceso descrito aquí tiene varios objetivos:

- Mantener la calidad de ArkaOne
- Solucionar problemas que son importantes para los usuarios
- Involucrar a la comunidad en el trabajo hacia la mejor ArkaOne posible
- Habilitar un sistema sostenible para que los mantenedores de ArkaOne revisen contribuciones

Sigue estos pasos para enviar tu contribución:

1. Sigue todas las instrucciones en [la plantilla](PULL_REQUEST_TEMPLATE.md)
2. Sigue las [guías de estilo](#guías-de-estilo)
3. Después de enviar tu pull request, verifica que todas las [verificaciones de estado](https://help.github.com/articles/about-status-checks/) estén pasando

## Guías de Estilo

### Mensajes de Commit de Git

* Usa el tiempo presente ("Agrega función" no "Agregó función")
* Usa el modo imperativo ("Mueve cursor a..." no "Mueve cursor a...")
* Limita la primera línea a 72 caracteres o menos
* Referencia issues y pull requests liberalmente después de la primera línea
* Sigue [Conventional Commits](https://www.conventionalcommits.org/)

Ejemplos:
```
feat: agregar autenticación de dos factores
fix: corregir error en validación de email
docs: actualizar guía de instalación
```

### Guía de Estilo de JavaScript/TypeScript

* Usa 2 espacios para indentación
* Usa comillas simples para strings
* Usa punto y coma al final de las declaraciones
* Sigue las reglas de ESLint configuradas en el proyecto

### Guía de Estilo de CSS

* Usa 2 espacios para indentación
* Usa TailwindCSS para estilos cuando sea posible
* Sigue las convenciones de nomenclatura BEM para CSS personalizado

## Configuración del Entorno de Desarrollo

### Prerrequisitos

- Node.js 18+
- pnpm 8+
- Docker y Docker Compose
- PostgreSQL (para desarrollo local)

### Configuración

1. Clona el repositorio:
```bash
git clone https://github.com/arkaone/arkaone.git
cd arkaone
```

2. Instala las dependencias:
```bash
pnpm install
```

3. Configura las variables de entorno:
```bash
cp apps/backend/.env.example apps/backend/.env
```

4. Inicia la base de datos:
```bash
docker-compose up -d db redis
```

5. Ejecuta las migraciones:
```bash
pnpm --filter backend db:push
pnpm --filter backend db:seed
```

6. Inicia el servidor de desarrollo:
```bash
pnpm dev
```

### Ejecutar Tests

```bash
# Todos los tests
pnpm test

# Solo backend
pnpm --filter backend test

# Solo frontend
pnpm --filter frontend test
```

### Construir para Producción

```bash
pnpm build
```

## Estructura del Proyecto

```
arkaone/
├── apps/
│   ├── backend/          # API NestJS
│   └── frontend/         # App React
├── packages/
│   ├── config/          # Configuración compartida
│   └── ui/              # Componentes UI compartidos
├── infra/
│   └── docker/          # Archivos Docker
└── .github/
    └── workflows/       # GitHub Actions
```

## Licencia

Al contribuir a ArkaOne, aceptas que tus contribuciones serán licenciadas bajo su [Licencia AGPL-3.0](LICENSE).
