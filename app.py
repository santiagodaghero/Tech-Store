# ════════════════════════════════════════════
# TECHSTORE AGENCY — app.py
# API REST con Flask
# ─────────────────────────────────────────
# Índice:
# 1. Imports y configuración
# 2. Datos simulados
# 3. Endpoint: GET /api/health
# 4. Endpoint: GET /api/stats
# 5. Endpoint: GET /api/projects-by-month
# 6. Endpoint: GET /api/technologies
# 7. Arrancar el servidor
#
# Para instalar dependencias:
#   pip install flask flask-cors
#
# Para correr el servidor:
#   python app.py
#
# La API quedará disponible en:
#   http://localhost:5000
# ════════════════════════════════════════════

import random
from datetime import datetime
from flask import Flask, jsonify
from flask_cors import CORS


# ────────────────────────────────────────
# 1. CONFIGURACIÓN
# ────────────────────────────────────────

app = Flask(__name__)

# CORS permite que el navegador (JavaScript)
# pueda hacer fetch a esta API desde otra
# "dirección" (en este caso localhost:5500 o
# el archivo HTML abierto directamente).
CORS(app)


# ────────────────────────────────────────
# 2. DATOS SIMULADOS
# Acá están los valores base del negocio.
# En un proyecto real vendrían de una
# base de datos (PostgreSQL, MySQL, etc.)
# ────────────────────────────────────────

BASE_STATS = {
    "completed_projects": 148,
    "active_clients":     37,
    "dev_hours":          12400,
    "satisfaction":       98.5,
}

PROJECTS_BY_MONTH = {
    "labels": ["May", "Jun", "Jul", "Ago", "Sep", "Oct",
               "Nov", "Dic", "Ene", "Feb", "Mar", "Abr"],
    "data":   [10, 8, 12, 9, 14, 11, 16, 13, 15, 12, 18, 14],
    "target": [10, 10, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16],
}

TECHNOLOGIES = {
    "labels": ["React", "Python", "Node.js", "Flutter", "Otros"],
    "data":   [28, 22, 18, 16, 16],
    "colors": ["#6c63ff", "#ff6b6b", "#00d4aa", "#ffbb33", "#555566"],
}


# ────────────────────────────────────────
# 3. GET /api/health
# Endpoint de "salud" del servidor.
# Útil para verificar que Flask está
# corriendo antes de tocar el frontend.
# Probalo en el browser:
#   http://localhost:5000/api/health
# ────────────────────────────────────────

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status":    "ok",
        "message":   "TechStore API corriendo correctamente",
        "timestamp": datetime.now().isoformat(),
    })


# ────────────────────────────────────────
# 4. GET /api/stats
# Devuelve los KPIs principales.
# Agrega una variación aleatoria pequeña
# para simular datos "en vivo".
#
# Respuesta ejemplo:
# {
#   "completed_projects": 148,
#   "active_clients": 37,
#   "dev_hours": 12400,
#   "satisfaction": 98.5,
#   "updated_at": "2026-05-09T10:30:00"
# }
# ────────────────────────────────────────

@app.route("/api/stats", methods=["GET"])
def get_stats():
    # random.randint(-1, 1) agrega ±1 al valor base
    # para simular que los números cambian en vivo
    stats = {
        "completed_projects": BASE_STATS["completed_projects"] + random.randint(-1, 1),
        "active_clients":     BASE_STATS["active_clients"]     + random.randint(-1, 1),
        "dev_hours":          BASE_STATS["dev_hours"],
        "satisfaction":       round(
            BASE_STATS["satisfaction"] + random.uniform(-0.2, 0.2), 1
        ),
        "updated_at": datetime.now().isoformat(),
    }
    return jsonify(stats)


# ────────────────────────────────────────
# 5. GET /api/projects-by-month
# Datos para el gráfico de barras.
#
# Respuesta ejemplo:
# {
#   "labels": ["May", "Jun", ...],
#   "data":   [10, 8, 12, ...],
#   "target": [10, 10, 12, ...]
# }
# ────────────────────────────────────────

@app.route("/api/projects-by-month", methods=["GET"])
def get_projects_by_month():
    return jsonify(PROJECTS_BY_MONTH)


# ────────────────────────────────────────
# 6. GET /api/technologies
# Datos para el gráfico de dona.
#
# Respuesta ejemplo:
# {
#   "labels": ["React", "Python", ...],
#   "data":   [28, 22, 18, ...],
#   "colors": ["#6c63ff", ...]
# }
# ────────────────────────────────────────

@app.route("/api/technologies", methods=["GET"])
def get_technologies():
    return jsonify(TECHNOLOGIES)


# ────────────────────────────────────────
# 7. ARRANCAR EL SERVIDOR
# debug=True → reinicia automáticamente
# cuando guardás cambios en el código.
# ────────────────────────────────────────

if __name__ == "__main__":
    app.run(debug=True, port=5000)
