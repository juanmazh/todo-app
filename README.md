# 📝 Todo App

Aplicación moderna de gestión de tareas construida con **React**, **TypeScript** y **Supabase**. Interfaz con animaciones, autenticación de usuarios y sincronización en la nube.

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.78.0-3ECF8E?logo=supabase)
![Vite](https://img.shields.io/badge/Vite-6.0.1-646CFF?logo=vite)

## ✨ Características

### 🎨 Interfaz de Usuario
- **Diseño moderno** con gradientes y efectos visuales
- **Animaciones fluidas** con Framer Motion
- **Diseño responsive** para móviles, tablets y desktop
- **Tema consistente** con variables CSS personalizables

### 🔐 Autenticación
- **Registro e inicio de sesión** con Supabase Auth
- **Sesiones persistentes** con refresh automático de tokens
- **Autenticación basada en username** (derivado a email automáticamente)
- **Protección de rutas** - acceso solo para usuarios autenticados

### 📋 Gestión de Tareas
- ✅ **Crear** tareas con título, descripción, prioridad y categoría
- ✏️ **Editar** tareas existentes
- 🗑️ **Eliminar** tareas
- ✅ **Marcar como completadas/pendientes**
- 🔍 **Búsqueda en tiempo real** por título y descripción
- 📊 **Filtros múltiples**:
  - Por estado (Todas, Pendientes, Completadas)
  - Por prioridad (Alta, Media, Baja)
  - Por categoría
- 📈 **Estadísticas** de tareas completadas y pendientes

### 🔒 Seguridad
- **Row Level Security (RLS)** en Supabase
- **Aislamiento de datos** por usuario
- **Validación de sesión** en cada operación
- **Políticas de seguridad** que filtran automáticamente los datos

## 🛠️ Stack Tecnológico

### Frontend
- **React 19.1.1** - Biblioteca de interfaz de usuario
- **TypeScript 5.6.2** - Tipado estático para mayor seguridad
- **Vite 6.0.1** - Build tool rápido y moderno
- **Framer Motion 12.23.15** - Animaciones y transiciones
- **Lucide React 0.544.0** - Iconos modernos y consistentes

### Backend y Base de Datos
- **Supabase** - Backend as a Service (BaaS)
  - **Supabase Auth** - Autenticación de usuarios
  - **PostgreSQL** - Base de datos relacional
  - **Row Level Security (RLS)** - Seguridad a nivel de fila
  - **REST API** - API automática generada

## 📁 Estructura del Proyecto

```
todo-app/
├── client/                          # Aplicación React frontend
│   ├── src/
│   │   ├── components/             # Componentes React
│   │   │   ├── Auth.tsx           # Componente de autenticación
│   │   │   ├── TodoForm.tsx       # Formulario de tareas
│   │   │   ├── TodoList.tsx       # Lista de tareas
│   │   │   ├── TodoItem.tsx       # Item individual de tarea
│   │   │   ├── FilterBar.tsx      # Barra de filtros
│   │   │   └── Footer.tsx         # Pie de página
│   │   ├── config/
│   │   │   └── supabase.ts        # Configuración de Supabase
│   │   ├── services/
│   │   │   ├── authService.ts     # Servicio de autenticación
│   │   │   └── todoService.ts     # Servicio de tareas
│   │   ├── types/
│   │   │   └── Todo.ts            # Tipos TypeScript
│   │   ├── constants/
│   │   │   └── categories.ts     # Categorías predefinidas
│   │   ├── App.tsx                # Componente principal
│   │   └── main.tsx               # Punto de entrada
│   ├── public/                     # Archivos estáticos
│   ├── env.example                 # Ejemplo de variables de entorno
│   ├── vite.config.ts              # Configuración de Vite
│   └── package.json
├── database/
│   └── setup.sql                   # Script SQL para configurar Supabase
├── DEPLOY.md                       # Guía de despliegue
├── render.yaml                     # Configuración para Render
├── package.json                    # Configuración del proyecto
└── README.md                       # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** 16.0.0 o superior
- **npm** 8.0.0 o superior
- Una cuenta en [Supabase](https://supabase.com) (gratis)

### Paso 1: Clonar el Repositorio

```bash
git clone <tu-repositorio>
cd todo-app
```

### Paso 2: Instalar Dependencias

```bash
npm run install-all
```

Esto instalará las dependencias tanto en la raíz como en la carpeta `client/`.

### Paso 3: Configurar Supabase

1. **Crear un proyecto en Supabase**
   - Ve a [Supabase Dashboard](https://supabase.com/dashboard)
   - Crea un nuevo proyecto
   - Espera a que se inicialice (toma unos minutos)

2. **Configurar la base de datos**
   - Ve a **SQL Editor** en tu proyecto de Supabase
   - Copia y ejecuta el contenido de `database/setup.sql`
   - Esto creará la tabla `todos` y las políticas RLS necesarias

3. **Configurar autenticación**
   - Ve a **Authentication** → **Settings**
   - Asegúrate de que **"Enable signups"** esté activado
   - Si usas el dominio por defecto `todo-app.local`, déjalo vacío en **"Allowed email domains"**
   - O añade `todo-app.local` a los dominios permitidos

### Paso 4: Configurar Variables de Entorno

1. **Copiar el archivo de ejemplo**
   ```bash
   cd client
   cp env.example .env
   ```

2. **Obtener las credenciales de Supabase**
   - Ve a **Settings** → **API** en tu proyecto de Supabase
   - Copia la **Project URL** (será tu `VITE_SUPABASE_URL`)
   - Copia la **anon public** key (será tu `VITE_SUPABASE_KEY`)

3. **Editar el archivo `.env`**
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_KEY=tu-anon-key-aqui
   VITE_USERNAME_EMAIL_DOMAIN=todo-app.local
   ```

   ⚠️ **Importante**: 
   - Usa la **anon key** (pública), NUNCA la **service_role key**
   - El archivo `.env` está en `.gitignore` y no se subirá al repositorio

### Paso 5: Ejecutar la Aplicación

```bash
# Desde la raíz del proyecto
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Ejecutar aplicación en modo desarrollo
npm run client       # Alias para npm run dev

# Producción
npm run build        # Construir aplicación para producción
npm start           # Previsualizar build de producción

# Utilidades
npm run install-all  # Instalar todas las dependencias
npm run lint         # Ejecutar linter (desde client/)
```

## 🗄️ Base de Datos

### Esquema de la Tabla `todos`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único (generado automáticamente) |
| `title` | VARCHAR(255) | Título de la tarea (requerido) |
| `description` | TEXT | Descripción opcional de la tarea |
| `completed` | BOOLEAN | Estado de completado (default: false) |
| `priority` | VARCHAR(10) | Prioridad: 'low', 'medium', 'high' (default: 'medium') |
| `category` | VARCHAR(50) | Categoría de la tarea (default: 'general') |
| `user_id` | UUID | ID del usuario propietario (FK a auth.users) |
| `created_at` | TIMESTAMP | Fecha de creación (automático) |
| `updated_at` | TIMESTAMP | Fecha de última actualización (automático) |

### Row Level Security (RLS)

Las políticas RLS aseguran que:
- Cada usuario solo puede **ver** sus propias tareas
- Cada usuario solo puede **crear** tareas para sí mismo
- Cada usuario solo puede **actualizar** sus propias tareas
- Cada usuario solo puede **eliminar** sus propias tareas

Las consultas se filtran automáticamente por `auth.uid()`, por lo que no necesitas filtrar manualmente en tu código.

## 🚀 Despliegue

Esta aplicación es una **SPA (Single Page Application)** que se puede desplegar en cualquier servicio de hosting estático.

### Opción 1: Render (Recomendado)

1. Conecta tu repositorio a Render
2. Crea un nuevo **Static Site**
3. Configura:
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`
4. Añade las variables de entorno en **Environment**
5. El archivo `render.yaml` ya está configurado como referencia

### Opción 2: Netlify

1. Conecta tu repositorio a Netlify
2. Configura:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
3. Añade las variables de entorno en **Site settings** → **Environment variables**

### Opción 3: Vercel

1. Conecta tu repositorio a Vercel
2. Configura:
   - **Framework Preset**: Other
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Añade las variables de entorno en **Settings** → **Environment Variables**

### Variables de Entorno en Producción

Asegúrate de configurar estas variables en tu plataforma de hosting:

- `VITE_SUPABASE_URL` - URL de tu proyecto Supabase
- `VITE_SUPABASE_KEY` - Clave pública (anon key)
- `VITE_USERNAME_EMAIL_DOMAIN` - Dominio para emails derivados (opcional)

⚠️ **NUNCA** uses la `service_role` key en el cliente. Solo usa la `anon` key pública.

Para más detalles, consulta `DEPLOY.md`.

## 🎨 Personalización

### Colores y Tema

Los colores se definen en variables CSS en `client/src/App.css`:

```css
:root {
  --primary-color: #6366f1;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --danger-color: #ef4444;
  /* ... más variables */
}
```

### Categorías

Las categorías predefinidas están en `client/src/constants/categories.ts`. Puedes modificarlas según tus necesidades.

### Animaciones

Las animaciones se configuran usando **Framer Motion** en los componentes React. Puedes ajustar las transiciones en cada componente.

## 🔒 Seguridad

- ✅ **Autenticación** manejada por Supabase Auth
- ✅ **Row Level Security (RLS)** activado en todas las tablas
- ✅ **Sesiones seguras** con refresh tokens automáticos
- ✅ **Políticas RLS** que filtran datos por usuario automáticamente
- ✅ **Validación de datos** en el cliente
- ✅ **HTTPS** obligatorio en producción

## 📝 Notas Importantes

### Sistema de Username

La aplicación convierte automáticamente usernames a emails:
- Usuario: `demo` → Email: `demo@todo-app.local`
- Esto permite usar usernames simples mientras Supabase Auth requiere emails

### Configuración de Dominios Permitidos

Si cambias el dominio en `VITE_USERNAME_EMAIL_DOMAIN`, asegúrate de añadirlo en **Supabase Dashboard** → **Authentication** → **Settings** → **Allowed email domains**.

### Políticas RLS

Las políticas RLS se aplican automáticamente. No necesitas filtrar por `user_id` en tus queries - Supabase lo hace por ti usando `auth.uid()`.

### Sesiones

La sesión de Supabase se maneja automáticamente. No necesitas gestionar tokens manualmente - el cliente de Supabase lo hace por ti.

## 🐛 Solución de Problemas

### Error: "No se puede conectar con el servidor"

Este error indica que el navegador está usando código antiguo en caché:

1. **Limpia el caché del navegador** (`Ctrl + Shift + Delete`)
2. **Usa una ventana de incógnito** (`Ctrl + Shift + N`)
3. **Verifica que tienes el archivo `.env`** en `client/.env`
4. **Reinicia el servidor de desarrollo**

### Error: "Faltan las variables de entorno"

1. Verifica que el archivo `.env` existe en `client/.env` (no en la raíz)
2. Verifica que las variables empiezan con `VITE_`
3. Reinicia el servidor de desarrollo después de crear/editar `.env`

### Error: "Invalid login credentials"

- Verifica que el usuario existe
- Si es un nuevo registro, asegúrate de que "Enable signups" esté activado en Supabase
- Verifica que el dominio del email está permitido en Supabase

## 🤝 Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🎯 Próximas Mejoras

- [ ] Sincronización en tiempo real con Supabase Realtime
- [ ] Notificaciones push
- [ ] Exportar/importar tareas (JSON, CSV)
- [ ] Temas personalizables (claro/oscuro)
- [ ] Modo offline con sincronización
- [ ] Integración con calendarios
- [ ] Colaboración en tiempo real (compartir tareas)
- [ ] Adjuntos de archivos
- [ ] Fechas de vencimiento
- [ ] Recordatorios

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:

- Abre un [Issue](https://github.com/tu-usuario/todo-app/issues) en el repositorio
- Contacta al desarrollador: juanmazh.dev@gmail.com

---

**¡Disfruta organizando tus tareas! 🎉**

Desarrollado con ❤️ usando React, TypeScript y Supabase
