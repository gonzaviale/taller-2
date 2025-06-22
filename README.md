# Proyecto Taller 2

Proyecto que consta de un backend desarrollado en Node.js con TypeScript, Express y Sequelize, utilizando FakeStoreAPI.com como API externa y Swagger para la documentación. El frontend está desarrollado en Angular.

## Requisitos previos

- Node.js (versión recomendada: 16.x o superior)
- MySQL (instalado y configurado)
- Angular CLI (para el frontend)

## Configuración de la base de datos

1. Asegúrate de tener MySQL instalado en tu sistema
2. Crea una base de datos llamada `taller2`:

```sql
CREATE DATABASE taller2;
```

## Backend

### Configuración del entorno

Crea un archivo `.env` en la raíz del proyecto backend con el siguiente contenido:

```
# BASE DE DATOS
DB_HOST=localhost
DB_PORT=3306
DB_NAME=taller2
DB_USER=tuusuario
DB_PASS=tupassword
DB_DIALECT=mysql

# SERVER
PORT=3000

# JWT
JWT_SECRET=tuclavesecreta
```

Asegúrate de reemplazar `tuusuario` y `tupassword` con tus credenciales de MySQL.

### Instalación y ejecución

1. Navega a la carpeta del backend:

```bash
cd backend
```

2. Instala las dependencias:

```bash
npm install
```

3. Para ejecutar el proyecto en modo desarrollo:

```bash
npm run dev
```

4. Para compilar el proyecto:

```bash
npm run build
```

5. Para ejecutar el proyecto compilado:

```bash
npm start
```

### Documentación API

Una vez que el servidor esté en ejecución, puedes acceder a la documentación Swagger en:

```
http://localhost:3000/api-docs/#/
```

## Frontend (Angular)

### Instalación y ejecución

1. Navega a la carpeta del frontend:

```bash
cd frontend
```

2. Instala las dependencias:

```bash
npm install
```

3. Ejecuta la aplicación en modo desarrollo:

```bash
ng serve -o
```

La aplicación se abrirá automáticamente en tu navegador en `http://localhost:4200`.

## Estructura del proyecto

- `backend/`: Contiene el código del servidor Node.js con TypeScript, Express y Sequelize
  - `src/`: Código fuente del backend
  - `dist/`: Código compilado (generado al ejecutar `npm run build`)
  
- `frontend/`: Contiene la aplicación Angular

## Tecnologías utilizadas

### Backend
- Node.js con TypeScript
- Express
- Sequelize (ORM para MySQL)
- Swagger para documentación API
- FakeStoreAPI.com como API externa

### Frontend
- Angular

## Notas adicionales

- Asegúrate de que el servidor MySQL esté en ejecución antes de iniciar el backend
- La API externa FakeStoreAPI.com se utiliza para obtener datos de productos
- Para cualquier problema de conexión con la base de datos, verifica las credenciales en tu archivo `.env`
