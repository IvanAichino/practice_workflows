# TypeScript REST API - Feriados Argentinos

Una API REST completa desarrollada en TypeScript que integra con la API pública de Argentina Datos para obtener información sobre feriados argentinos del año 2025.

## 🚀 Características

- **Servidor HTTP**: Express.js con TypeScript y tipado estricto
- **API REST**: Endpoints bien estructurados con validación de entrada
- **Integración Externa**: Consulta automática a la API de Argentina Datos
- **Logging Estructurado**: Sistema de logging con Winston (JSON/pretty format)
- **Testing Completo**: Unit tests e integration tests con Jest (+80% coverage)
- **Validación**: Middleware de validación con Joi
- **Rate Limiting**: Protección contra spam y abuse
- **Health Checks**: Endpoints para monitoreo del servicio
- **CORS & Security**: Configuración segura con Helmet
- **Arquitectura Modular**: Separación clara de responsabilidades

## 📋 Requisitos

- Node.js >= 18.0.0
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd typescript-rest-api
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## 📚 API Endpoints

### Feriados

#### `GET /api/feriados`
Obtiene la lista de feriados argentinos del 2025.

**Query Parameters:**
- `mes` (opcional): Filtrar por mes (1-12)
- `tipo` (opcional): Filtrar por tipo de feriado

**Ejemplo:**
```bash
curl http://localhost:3000/api/feriados?mes=1
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "motivo": "Año Nuevo",
      "tipo": "feriado",
      "fecha": "2025-01-01",
      "diaSemana": "Miércoles",
      "mes": "Enero",
      "esTraslado": false
    }
  ],
  "message": "Found 1 holidays",
  "timestamp": "2025-01-08T12:00:00.000Z",
  "requestId": "req-uuid"
}
```

#### `GET /api/feriados/stats`
Obtiene estadísticas de los feriados.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "total": 19,
    "porTipo": {
      "feriado": 15,
      "día no laborable": 4
    },
    "porMes": {
      "Enero": 1,
      "Febrero": 2,
      "..."
    },
    "traslados": 3
  }
}
```

### Health Check

#### `GET /health`
Verificación básica del estado del servicio.

#### `GET /health/detailed`
Verificación detallada incluyendo dependencias externas.

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor con hot reload
npm run build        # Compilar TypeScript
npm start           # Ejecutar versión compilada

# Testing
npm test            # Ejecutar tests
npm run test:watch  # Tests en modo watch
npm run test:coverage # Reporte de cobertura

# Code Quality
npm run lint        # Linter
npm run lint:fix    # Fix automático de linting
npm run format      # Formatear código
npm run format:check # Verificar formato
```

## 🏗️ Estructura del Proyecto

```
src/
├── config/          # Configuración (logger, environment)
├── controllers/     # Controladores de rutas
├── middleware/      # Middleware personalizado
├── routes/          # Definición de rutas
├── services/        # Lógica de negocio
├── types/          # Definiciones TypeScript
├── utils/          # Utilidades y helpers
└── __tests__/      # Tests organizados por módulos
```

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `ARGENTINA_DATOS_API_URL` | URL base de la API externa | `https://api.argentinadatos.com/v1` |
| `LOG_LEVEL` | Nivel de logging | `info` |
| `LOG_FORMAT` | Formato de logs | `json` |
| `RATE_LIMIT_WINDOW_MS` | Ventana de rate limit | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | Máximo requests por ventana | `100` |

### Logging

El sistema de logging utiliza Winston con dos formatos:
- **Development**: Pretty format con colores
- **Production**: JSON estructurado

Los logs se guardan en:
- `logs/error.log`: Solo errores
- `logs/combined.log`: Todos los logs

## 🔒 Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configuración cross-origin
- **Rate Limiting**: Protección contra abuse
- **Validación**: Joi schemas para input validation
- **Request ID**: Tracking de requests para auditoría

## 🐳 Docker (Opcional)

```dockerfile
# Dockerfile básico
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

## 📊 Monitoreo

- **Health Checks**: `/health` y `/health/detailed`
- **Request Logging**: Todos los requests son loggeados
- **Error Tracking**: Errores centralizados con stack traces
- **Performance**: Tracking de duración de requests

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

MIT License - ver archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Para reportar bugs o solicitar features, crear un issue en el repositorio.

---

**Desarrollado con ❤️ usando TypeScript, Express.js y las mejores prácticas de desarrollo.**