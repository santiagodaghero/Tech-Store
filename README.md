# TechStore Agency 🚀

Landing page de una agencia tech ficticia con dashboard de estadísticas en tiempo real, conectado a una API REST construida con Python y Flask.

## Stack

`HTML` `CSS` `JavaScript` `Python` `Flask` `Chart.js`

## Estructura del proyecto

```
techstore-agency/
│
├── index.html              ← estructura HTML
│
├── css/
│   └── styles.css          ← todos los estilos
│
├── js/
│   └── dashboard.js        ← gráficos, KPIs y polling
│
├── backend/
│   └── app.py              ← API REST con Flask
│
└── README.md
```

## Secciones de la landing

- **Header** — navegación fija con blur
- **Hero** — título, subtítulo y cards de stats flotantes
- **Servicios** — grilla de 4 servicios con hover
- **Dashboard** — KPIs en vivo + gráfico de barras + gráfico de dona
- **Testimonios** — 3 cards de clientes
- **Footer** — links y contacto

## Cómo correr el proyecto

### Fase 1 — Solo frontend (sin Python)

Abrí `index.html` directamente en el browser.
Los datos del dashboard son mockeados en JS y se actualizan cada 5 segundos simulando datos en vivo.

### Fase 2 — Con backend Flask

**1. Instalar dependencias Python:**
```bash
pip install flask flask-cors
```

**2. Correr el servidor:**
```bash
cd backend
python app.py
```

La API queda disponible en `http://localhost:5000`

**3. Conectar el frontend:**

En `js/dashboard.js`, buscá el bloque marcado con `TODO` y reemplazá `fetchMockStats()` por:

```javascript
async function fetchStats() {
  try {
    const response = await fetch('http://localhost:5000/api/stats');
    const data     = await response.json();
    updateKPIs(data);
  } catch (error) {
    console.error('No se pudo conectar con Flask:', error);
  }
}
fetchStats();
setInterval(fetchStats, 5000);
```

## Endpoints de la API

| Método | Ruta                      | Descripción                        |
|--------|---------------------------|------------------------------------|
| GET    | `/api/health`             | Estado del servidor                |
| GET    | `/api/stats`              | KPIs principales (se actualiza c/llamada) |
| GET    | `/api/projects-by-month`  | Datos para el gráfico de barras    |
| GET    | `/api/technologies`       | Datos para el gráfico de dona      |

### Ejemplo de respuesta — `/api/stats`

```json
{
  "completed_projects": 148,
  "active_clients": 37,
  "dev_hours": 12400,
  "satisfaction": 98.5,
  "updated_at": "2026-05-09T10:30:00"
}
```

## Flujo del proyecto

```
Python + Flask  →  API REST  →  JavaScript fetch  →  Landing page
```
