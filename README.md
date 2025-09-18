# 📝 TO-DO App

Una aplicación moderna de gestión de tareas construida con **Node.js**, **Express**, **React** y **TypeScript**. Diseñada con una interfaz visual atractiva, animaciones suaves y funcionalidades completas para la gestión de tareas.

## ✨ Características

- 🎨 **Interfaz moderna y atractiva** con gradientes y animaciones
- 📱 **Diseño responsive** que funciona en todos los dispositivos
- ⚡ **Animaciones fluidas** con Framer Motion
- 🔍 **Búsqueda y filtrado** avanzado de tareas
- 🏷️ **Categorización** de tareas por tipo
- ⭐ **Sistema de prioridades** (Alta, Media, Baja)
- ✅ **CRUD completo** para gestión de tareas
- 💾 **Base de datos SQLite** para persistencia
- 🚀 **API REST** bien estructurada

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **SQLite3** - Base de datos ligera
- **UUID** - Generación de IDs únicos
- **CORS** - Manejo de políticas de origen cruzado

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Vite** - Herramienta de construcción rápida
- **Framer Motion** - Animaciones y transiciones
- **Lucide React** - Iconos modernos
- **Axios** - Cliente HTTP

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd todo-app
   ```

2. **Instalar dependencias del servidor**
   ```bash
   npm install
   ```

3. **Instalar dependencias del cliente**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Configurar variables de entorno**
   ```bash
   # Crear archivo .env en la raíz del proyecto
   PORT=5000
   NODE_ENV=development
   ```

5. **Ejecutar la aplicación**
   ```bash
   # Ejecutar servidor y cliente simultáneamente
   npm run dev
   
   # O ejecutar por separado:
   # Terminal 1: npm run server
   # Terminal 2: npm run client
   ```

6. **Acceder a la aplicación**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Estructura del Proyecto

```
todo-app/
├── server/                 # Backend
│   ├── index.js           # Servidor principal
│   ├── routes/            # Rutas de la API
│   │   └── todos.js       # Rutas de tareas
│   └── database/          # Configuración de base de datos
│       ├── init.js        # Inicialización de DB
│       └── connection.js  # Conexión a DB
├── client/                # Frontend
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── services/      # Servicios API
│   │   ├── types/         # Tipos TypeScript
│   │   ├── App.tsx        # Componente principal
│   │   └── App.css        # Estilos principales
│   └── package.json
├── package.json           # Dependencias del servidor
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

### Interfaz de Usuario
- 🎨 **Diseño moderno** con gradientes y sombras
- 📱 **Responsive design** para móviles y desktop
- ⚡ **Animaciones suaves** en todas las interacciones
- 🎭 **Estados visuales** claros para diferentes prioridades
- 📊 **Estadísticas** de tareas completadas y pendientes

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Ejecutar servidor y cliente
npm run server       # Solo servidor
npm run client       # Solo cliente

# Producción
npm run build        # Construir cliente para producción
npm start           # Ejecutar servidor en producción

# Utilidades
npm run install-all # Instalar todas las dependencias
```

## 🗄️ Base de Datos

La aplicación utiliza **SQLite** como base de datos, que se crea automáticamente al iniciar el servidor. La tabla `todos` incluye:

- `id` - Identificador único (UUID)
- `title` - Título de la tarea
- `description` - Descripción opcional
- `completed` - Estado de completado (boolean)
- `priority` - Prioridad (low, medium, high)
- `category` - Categoría de la tarea
- `created_at` - Fecha de creación
- `updated_at` - Fecha de última actualización

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

## 🚀 Despliegue

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
# Construir el cliente
npm run build

# Ejecutar en producción
npm start
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🎯 Próximas Mejoras

- [ ] Autenticación de usuarios
- [ ] Sincronización en tiempo real
- [ ] Notificaciones push
- [ ] Exportar/importar tareas
- [ ] Temas personalizables
- [ ] Modo offline
- [ ] Integración con calendarios
- [ ] Colaboración en tiempo real

## 📞 Soporte

Si tienes preguntas o necesitas ayuda, no dudes en abrir un issue en el repositorio.

---

**¡Disfruta organizando tus tareas! 🎉**
