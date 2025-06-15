# MemoryOS - Sistema de Gestión de Memoria Personal con IA

![MemoryOS](https://img.shields.io/badge/MemoryOS-v1.0.0-blue)
![Python](https://img.shields.io/badge/Python-3.10+-green)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Flask](https://img.shields.io/badge/Flask-1.1.2-red)

**MemoryOS** es una aplicación web freemium que actúa como "extensión del cerebro" para gestionar memoria personal, recordatorios inteligentes y almacenamiento de conocimientos críticos con asistencia de IA.

## 🎯 Características Principales

### **FREEMIUM (Gratis)**
- ✅ **Recordatorios Inteligentes** con spaced repetition
- ✅ **Memory Vault Básico** (hasta 100 memorias)
- ✅ **Dashboard Personal** con métricas
- ✅ **Búsqueda semántica** básica
- ✅ **Categorización automática** con tags

### **PREMIUM ($5/mes)**
- 🚀 **IA Avanzada** (OpenAI/Mistral integration)
- 🚀 **Memorias ilimitadas**
- 🚀 **Almacenamiento multimedia**
- 🚀 **Encriptación end-to-end**
- 🚀 **Reconocimiento de voz**
- 🚀 **OCR para documentos**

## 🛠️ Stack Tecnológico

### **Frontend**
- **React** 18.2.0 + **Vite** 4.4.8
- **React Router DOM** 6.30.1
- **Bootstrap** 5.3.6 + **Bootstrap Icons** 1.13.1
- **Estado Global:** useReducer + Context API

### **Backend**
- **Python** 3.10+ + **Flask** 1.1.2
- **SQLAlchemy** + **Flask-JWT-Extended**
- **PostgreSQL** (producción) / **SQLite** (desarrollo)

### **Despliegue**
- **Render.com** (Backend + Database)
- **Render.com** (Frontend estático)
- **GitHub** para CI/CD

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Python 3.10+
- Node.js 16+
- Git

### **1. Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/memoryos.git
cd memoryos
```

### **2. Configurar Backend (Python/Flask)**
```bash
# Entrar al directorio backend
cd backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate     # Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# Inicializar base de datos
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### **3. Configurar Frontend (React/Vite)**
```bash
# Entrar al directorio frontend
cd frontend

# Instalar dependencias de Node.js
npm install

# Configurar variables de entorno
echo "VITE_API_URL=http://localhost:5000" > .env.local
```

### **4. Ejecutar en Desarrollo**
```bash
# Terminal 1 - Backend (Puerto 5000)
cd backend && python app.py

# Terminal 2 - Frontend (Puerto 5173)
cd frontend && npm run dev
```

La aplicación estará disponible en:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

## 📁 Estructura del Proyecto

```
memoryos/
├── frontend/                    # Frontend React
│   ├── src/
│   │   ├── components/          # Componentes reutilizables
│   │   ├── pages/               # Páginas principales
│   │   ├── services/            # APIs y servicios
│   │   ├── hooks/               # Custom hooks
│   │   ├── store/               # Estado global
│   │   └── styles/              # CSS y estilos
│   ├── index.html               # HTML principal
│   ├── package.json             # Dependencias Node
│   └── vite.config.js          # Configuración Vite
├── backend/                     # Backend Flask
│   ├── models/                  # Modelos SQLAlchemy
│   ├── routes/                  # Blueprints de Flask
│   ├── services/                # Servicios de datos
│   ├── utils/                   # Utilidades
│   ├── app.py                   # Aplicación Flask
│   └── requirements.txt         # Dependencias Python
├── migrations/                  # Migraciones de BD
├── README.md                    # Documentación
└── render.yaml                 # Configuración despliegue
```

## 🔐 Autenticación

El sistema utiliza **JWT con httpOnly cookies** para máxima seguridad:

- ✅ Tokens JWT seguros
- ✅ httpOnly cookies (anti-XSS)
- ✅ Refresh tokens automáticos
- ✅ Middleware de autenticación
- ✅ Validación de roles (free/premium)

## 📊 Modelos de Datos

### **User Model**
```python
- id, email, password, name
- subscription_type (free/premium)
- created_at, is_active
- relationships: memories[], reminders[]
```

### **Memory Model**
```python
- id, title, content, memory_type
- tags[], importance_level (1-5)
- is_encrypted, media_url
- created_at, updated_at, last_accessed
```

### **Reminder Model**
```python
- id, title, description, reminder_type
- trigger_date, repeat_pattern
- is_completed, memory_id (FK)
```

## 🔌 API Endpoints

### **Autenticación**
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Usuario actual
- `POST /api/auth/refresh` - Refrescar token

### **Memorias**
- `GET /api/memories` - Listar memorias
- `POST /api/memories` - Crear memoria
- `GET /api/memories/{id}` - Obtener memoria
- `PUT /api/memories/{id}` - Actualizar memoria
- `DELETE /api/memories/{id}` - Eliminar memoria
- `GET /api/memories/stats` - Estadísticas

### **Recordatorios**
- `GET /api/reminders` - Listar recordatorios
- `POST /api/reminders` - Crear recordatorio
- `PUT /api/reminders/{id}` - Actualizar recordatorio
- `DELETE /api/reminders/{id}` - Eliminar recordatorio
- `POST /api/reminders/{id}/complete` - Marcar completado
- `GET /api/reminders/upcoming` - Próximos recordatorios
- `GET /api/reminders/overdue` - Recordatorios vencidos

### **Usuario**
- `GET /api/users/profile` - Perfil de usuario
- `PUT /api/users/profile` - Actualizar perfil
- `POST /api/users/change-password` - Cambiar contraseña
- `GET /api/users/subscription` - Info de suscripción
- `POST /api/users/subscription/upgrade` - Upgrade a Premium
- `GET /api/users/dashboard` - Datos del dashboard

## 🌟 Funcionalidades Destacadas

### **1. Sistema de Recordatorios Inteligentes**
- Spaced repetition para aprendizaje
- Recordatorios contextuales
- Patrones de repetición personalizables
- Notificaciones push

### **2. Memory Vault Avanzado**
- Categorización automática
- Búsqueda semántica
- Niveles de importancia (1-5)
- Tags inteligentes
- Encriptación (Premium)

### **3. Dashboard Inteligente**
- Métricas de memoria y aprendizaje
- Timeline de actividades
- Recordatorios próximos y vencidos
- Estadísticas de uso

### **4. IA Assistant (Premium)**
- Integración OpenAI/Mistral
- Generación automática de recordatorios
- Resúmenes inteligentes
- Análisis de contenido

## 🚀 Despliegue en Producción

### **Render.com (Recomendado)**
1. Conectar repositorio de GitHub
2. Configurar variables de entorno
3. Deploy automático con `render.yaml`

### **Variables de Entorno Requeridas**
```bash
FLASK_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET_KEY=your-jwt-secret
OPENAI_API_KEY=your-openai-key
VITE_API_URL=https://your-backend.onrender.com
```

## 🧪 Testing

```bash
# Backend tests
python -m pytest tests/

# Frontend tests
npm run test

# Linting
npm run lint
```

## 📈 Roadmap

- [ ] **v1.1** - Integración Stripe para pagos
- [ ] **v1.2** - App móvil (React Native)
- [ ] **v1.3** - Integración con calendarios externos
- [ ] **v1.4** - API pública para desarrolladores
- [ ] **v2.0** - Funciones avanzadas de IA

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙋‍♂️ Soporte

- 📧 Email: support@memoryos.app
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/memoryos/issues)
- 📖 Docs: [Documentación](https://docs.memoryos.app)

---

**MemoryOS** - Tu extensión digital del cerebro 🧠✨ 