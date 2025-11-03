# 📝 TO-DO App

Una aplicación moderna de gestión de tareas construida con **React**, **TypeScript** y **Supabase**. Diseñada con una interfaz visual atractiva, animaciones suaves y funcionalidades completas para la gestión de tareas.

## ✨ Características

- 🎨 **Interfaz moderna y atractiva** con gradientes y animaciones
- 📱 **Diseño responsive** que funciona en todos los dispositivos
- ⚡ **Animaciones fluidas** con Framer Motion
- 🔍 **Búsqueda y filtrado** avanzado de tareas
- 🏷️ **Categorización** de tareas por tipo
- ⭐ **Sistema de prioridades** (Alta, Media, Baja)
- ✅ **CRUD completo** para gestión de tareas
- 🔐 **Autenticación de usuarios** con Supabase Auth
- 💾 **Base de datos en la nube** con Supabase
- 🔒 **Seguridad Row Level Security (RLS)** para proteger datos de usuarios

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Vite** - Herramienta de construcción rápida
- **Framer Motion** - Animaciones y transiciones
- **Lucide React** - Iconos modernos

### Backend y Base de Datos
- **Supabase** - Backend as a Service (BaaS)
  - Autenticación de usuarios
  - Base de datos PostgreSQL
  - Row Level Security (RLS)
  - API REST automática

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Una cuenta en [Supabase](https://supabase.com) (gratis)

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd todo-app
   ```

2. **Instalar dependencias**
   ```bash
   npm run install-all
   ```

3. **Configurar Supabase**
   - Crea un proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
   - Ejecuta el script SQL en `database/setup.sql` en el SQL Editor de Supabase
   - Esto creará la tabla `todos` y las políticas RLS necesarias

4. **Configurar variables de entorno**
   - Copia `client/env.example` a `client/.env`
   - Obtén tus credenciales desde Supabase Dashboard → Settings → API
   - Configura las variables:
     ```env
     VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
     VITE_SUPABASE_KEY=tu-anon-key-aqui
     VITE_USERNAME_EMAIL_DOMAIN=todo-app.local
     ```

5. **Ejecutar la aplicación en desarrollo**
   ```bash
   npm run dev
   ```

6. **Construir para producción**
   ```bash
   npm run build
   ```

## 📁 Estructura del Proyecto

```
todo-app/
├── client/                # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── services/       # Servicios de Supabase
│   │   ├── config/         # Configuración de Supabase
│   │   ├── types/          # Tipos TypeScript
│   │   ├── constants/      # Constantes
│   │   ├── App.tsx         # Componente principal
│   │   └── main.tsx        # Punto de entrada
│   ├── public/             # Archivos estáticos
│   └── package.json
├── database/               # Scripts SQL para Supabase
│   └── setup.sql           # Script de configuración de BD
├── package.json            # Configuración del proyecto
├── render.yaml             # Configuración para Render
└── README.md
```

## 🎯 Funcionalidades

### Gestión de Tareas
- ✅ **Crear** nuevas tareas con título, descripción, prioridad y categoría
- ✏️ **Editar** tareas existentes
- 🗑️ **Eliminar** tareas
- ✅ **Marcar como completadas** o pendientes

### Filtrado y Búsqueda
- 🔍 **Búsqueda por texto** en título y descripción
- 📊 **Filtro por estado** (Todas, Pendientes, Completadas)
- ⭐ **Filtro por prioridad** (Alta, Media, Baja)
- 🏷️ **Filtro por categoría**

### Autenticación
- 🔐 **Registro de usuarios** con username y contraseña
- 🔑 **Inicio de sesión** seguro
- 👤 **Sesiones persistentes** con Supabase Auth
- 🚪 **Cierre de sesión**

### Interfaz de Usuario
- 🎨 **Diseño moderno** con gradientes y sombras
- 📱 **Responsive design** para móviles y desktop
- ⚡ **Animaciones suaves** en todas las interacciones
- 🎭 **Estados visuales** claros para diferentes prioridades
- 📊 **Estadísticas** de tareas completadas y pendientes

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Ejecutar cliente en modo desarrollo
npm run client       # Alias para npm run dev

# Producción
npm run build        # Construir cliente para producción
npm start           # Previsualizar build de producción

# Utilidades
npm run install-all  # Instalar todas las dependencias
npm run lint         # Ejecutar linter
```

## 🗄️ Base de Datos

La aplicación utiliza **Supabase (PostgreSQL)** como base de datos. La tabla `todos` incluye:

- `id` - Identificador único (UUID)
- `title` - Título de la tarea
- `description` - Descripción opcional
- `completed` - Estado de completado (boolean)
- `priority` - Prioridad (low, medium, high)
- `category` - Categoría de la tarea
- `user_id` - ID del usuario propietario (UUID, referencia a auth.users)
- `created_at` - Fecha de creación
- `updated_at` - Fecha de última actualización

### Seguridad RLS

Las políticas de Row Level Security (RLS) aseguran que:
- Cada usuario solo puede ver sus propias tareas
- Los usuarios solo pueden crear, editar y eliminar sus propias tareas
- Las consultas se filtran automáticamente por `auth.uid()`

## 🚀 Despliegue

### Desarrollo Local
```bash
npm run dev
```

### Producción (Static Hosting)

La aplicación se puede desplegar en cualquier servicio de hosting estático:

#### Netlify
1. Conecta tu repositorio
2. Configura:
   - Build command: `npm run build`
   - Publish directory: `client/dist`
3. Añade las variables de entorno en Site settings

#### Vercel
1. Conecta tu repositorio
2. Framework preset: Other
3. Build command: `npm run build`
4. Output directory: `client/dist`
5. Añade las variables de entorno

#### Render (Static)
1. Crea un nuevo Static Site
2. Conecta tu repositorio
3. Build command: `cd client && npm install && npm run build`
4. Publish directory: `client/dist`
5. Añade las variables de entorno (ver `render.yaml`)

### Variables de Entorno en Producción

Asegúrate de configurar estas variables en tu plataforma de hosting:

- `VITE_SUPABASE_URL` - URL de tu proyecto Supabase
- `VITE_SUPABASE_KEY` - Clave pública (anon key) de Supabase
- `VITE_USERNAME_EMAIL_DOMAIN` - Dominio para emails derivados (opcional)

⚠️ **Importante**: NUNCA uses la `service_role` key en el cliente. Solo usa la `anon` key pública.

## 🔒 Seguridad

- ✅ Autenticación manejada por Supabase Auth
- ✅ Row Level Security (RLS) activado en todas las tablas
- ✅ Sesiones seguras con refresh tokens automáticos
- ✅ Políticas RLS que filtran datos por usuario automáticamente
- ✅ Validación de datos en el cliente y servidor

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

### Animaciones
Las animaciones se configuran usando Framer Motion en los componentes React.

## 📝 Notas Importantes

- La aplicación convierte usernames a emails automáticamente (ej: `demo` → `demo@todo-app.local`)
- Configura el dominio permitido en Supabase Dashboard → Authentication → Settings si usas un dominio personalizado
- Las políticas RLS se aplican automáticamente - no necesitas filtrar por usuario en tus queries
- La sesión de Supabase se maneja automáticamente - no necesitas gestionar tokens manualmente

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🎯 Próximas Mejoras

- [ ] Sincronización en tiempo real con Supabase Realtime
- [ ] Notificaciones push
- [ ] Exportar/importar tareas
- [ ] Temas personalizables (claro/oscuro)
- [ ] Modo offline con sincronización
- [ ] Integración con calendarios
- [ ] Colaboración en tiempo real (compartir tareas)
- [ ] Adjuntos de archivos

## 📞 Soporte

Si tienes preguntas o necesitas ayuda, no dudes en abrir un issue en el repositorio o contactarme al correo juanmazh.dev@gmail.com.

---

**¡Disfruta organizando tus tareas! 🎉**
