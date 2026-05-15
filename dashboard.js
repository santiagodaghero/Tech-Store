/* ════════════════════════════════════════════
   TECHSTORE AGENCY — dashboard.js
   ─────────────────────────────────────────
   Índice:
   1. Scroll animations
   2. Datos mockeados
   3. animateValue()  — contador animado
   4. updateKPIs()    — actualiza las tarjetas
   5. Gráfico barras  — proyectos por mes
   6. Gráfico dona    — tecnologías
   7. Polling (mock → Flask cuando esté listo)
════════════════════════════════════════════ */


/* ────────────────────────────────────────
   1. SCROLL ANIMATIONS
   Observa cada elemento con clase .fade-in
   y agrega .visible cuando entra al viewport.
───────────────────────────────────────── */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));


/* ────────────────────────────────────────
   2. DATOS MOCKEADOS
   Simulan la respuesta de la API Flask.
   Cuando el backend esté listo, estos
   valores vendrán del fetch real.
───────────────────────────────────────── */
const MOCK_STATS = {
  completed_projects: 148,
  active_clients:     37,
  dev_hours:          12400,
  satisfaction:       98.5,
};

const MOCK_PROJECTS_BY_MONTH = {
  labels: ['May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr'],
  data:   [10, 8, 12, 9, 14, 11, 16, 13, 15, 12, 18, 14],
  target: [10, 10, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16],
};

const MOCK_TECHNOLOGIES = {
  labels: ['React', 'Python', 'Node.js', 'Flutter', 'Otros'],
  data:   [28, 22, 18, 16, 16],
  colors: ['#6c63ff', '#ff6b6b', '#00d4aa', '#ffbb33', '#555566'],
};


/* ────────────────────────────────────────
   3. animateValue()
   Anima un número desde `start` hasta `end`
   con easing cúbico durante `duration` ms.
   Parámetros:
     el       → elemento del DOM a actualizar
     start    → número inicial
     end      → número final
     duration → duración en milisegundos
───────────────────────────────────────── */
function animateValue(el, start, end, duration) {
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cúbico
    const current  = Math.round(start + (end - start) * eased);

    el.textContent = current.toLocaleString();

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}


/* ────────────────────────────────────────
   4. updateKPIs()
   Recibe el objeto `data` y actualiza
   cada tarjeta del dashboard.

   Estructura esperada de `data`:
   {
     completed_projects : number,
     active_clients     : number,
     dev_hours          : number,
     satisfaction       : number   (ej: 98.5)
   }
───────────────────────────────────────── */
function updateKPIs(data) {
  // Proyectos completados
  const projEl = document.getElementById('kpi-projects');
  animateValue(projEl, parseInt(projEl.textContent) || 0, data.completed_projects, 800);

  // Clientes activos
  const clientEl = document.getElementById('kpi-clients');
  animateValue(clientEl, parseInt(clientEl.textContent) || 0, data.active_clients, 800);

  // Horas de desarrollo → formato "12.4k"
  document.getElementById('kpi-hours').textContent =
    (data.dev_hours / 1000).toFixed(1) + 'k';

  // Satisfacción → formato "98.5%"
  document.getElementById('kpi-sat').textContent =
    data.satisfaction.toFixed(1) + '%';

  // Timestamp de última actualización
  const now = new Date();
  document.getElementById('timestamp').textContent =
    'Última actualización: ' +
    now.toLocaleTimeString('es-AR', {
      hour:   '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
}


/* ────────────────────────────────────────
   5. GRÁFICO: PROYECTOS POR MES (barras)
   Barras violeta + línea punteada de objetivo.
───────────────────────────────────────── */
new Chart(document.getElementById('projectsChart').getContext('2d'), {
  type: 'bar',
  data: {
    labels: MOCK_PROJECTS_BY_MONTH.labels,
    datasets: [
      {
        label:           'Proyectos',
        data:            MOCK_PROJECTS_BY_MONTH.data,
        backgroundColor: 'rgba(108, 99, 255, 0.75)',
        borderWidth:     0,
        borderRadius:    6,
        borderSkipped:   false,
      },
      {
        label:       'Objetivo',
        data:        MOCK_PROJECTS_BY_MONTH.target,
        type:        'line',           // dataset mixto dentro de un gráfico bar
        borderColor: 'rgba(108, 99, 255, 0.35)',
        borderWidth: 2,
        borderDash:  [6, 4],           // línea punteada
        pointRadius: 0,
        fill:        false,
        tension:     0.4,
      },
    ],
  },
  options: {
    responsive:          true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },      // usamos leyenda custom en HTML
    },
    scales: {
      x: {
        ticks: {
          color:    '#5a5a78',
          font:     { family: 'DM Sans', size: 11 },
          autoSkip: false,             // muestra todos los meses
        },
        grid:   { color: 'rgba(255, 255, 255, 0.04)' },
        border: { color: 'transparent' },
      },
      y: {
        min: 0,
        max: 22,
        ticks: {
          color:    '#5a5a78',
          font:     { family: 'DM Sans', size: 11 },
          stepSize: 4,
        },
        grid:   { color: 'rgba(255, 255, 255, 0.06)' },
        border: { color: 'transparent' },
      },
    },
  },
});


/* ────────────────────────────────────────
   6. GRÁFICO: TECNOLOGÍAS (dona)
───────────────────────────────────────── */
new Chart(document.getElementById('techChart').getContext('2d'), {
  type: 'doughnut',
  data: {
    labels: MOCK_TECHNOLOGIES.labels,
    datasets: [{
      data:            MOCK_TECHNOLOGIES.data,
      backgroundColor: MOCK_TECHNOLOGIES.colors,
      borderColor:     '#1c1c28',      // color del fondo de la card
      borderWidth:     4,
      hoverOffset:     8,
    }],
  },
  options: {
    responsive:          true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.raw}%`,
        },
      },
    },
  },
});


/* ────────────────────────────────────────
   7. POLLING CADA 5 SEGUNDOS

   ══ TODO: REEMPLAZAR CUANDO FLASK ESTÉ LISTO ══
   Eliminar fetchMockStats() y usar esto:

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
   ═══════════════════════════════════════════

   Por ahora usamos datos mock con pequeña
   variación aleatoria para simular "en vivo".
───────────────────────────────────────── */

// Agrega ±1 aleatoriamente a un número
function jitter(n) {
  return n + Math.floor(Math.random() * 3 - 1);
}

function fetchMockStats() {
  updateKPIs({
    completed_projects: jitter(MOCK_STATS.completed_projects),
    active_clients:     jitter(MOCK_STATS.active_clients),
    dev_hours:          MOCK_STATS.dev_hours,
    satisfaction:       parseFloat(
      (MOCK_STATS.satisfaction + (Math.random() * 0.4 - 0.2)).toFixed(1)
    ),
  });
}

// Carga inicial
fetchMockStats();

// Luego cada 5 segundos
setInterval(fetchMockStats, 5000);

const navToggle = document.getElementById('navToggle')
const navLinks = document.getElementById('navLinks')

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active')
  navLinks.classList.toggle('open')
})

// Cerrar el menú al clickear un link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active')
    navLinks.classList.remove('open')
  })
})