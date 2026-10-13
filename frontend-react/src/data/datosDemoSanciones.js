
// Jugadores utilizados para demostrar las sanciones
const jugadoresDemo = [
  {
    id: 9001,
    apodo: 'JugadorSancionado',
    correo: 'sancionado@ejemplo.com',
    esEjemplo: true,
    sanciones: [
      {
        id: 1,
        estado: 'Vigente',
        descripcion: 'Conducta antideportiva',
        fechaFin: '2026-12-31'
      }
    ]
  },
  {
    id: 9002,
    apodo: 'JugadorCumplido',
    correo: 'cumplido@ejemplo.com',
    esEjemplo: true,
    sanciones: [
      {
        id: 2,
        estado: 'Cumplida',
        descripcion: 'Abandono de partida',
        fechaFin: '2026-09-30'
      }
    ]
  },
  {
    id: 9003,
    apodo: 'JugadorSinSancion',
    correo: 'sinsancion@ejemplo.com',
    esEjemplo: true,
    sanciones: []
  }
]

// Equipo utilizado para demostrar sanciones
const equiposDemo = [
  {
    id: 9101,
    nombre: 'Equipo Demo Sancionado',
    juego: 'Fortnite',
    capitanId: 9002,
    integrantes: [
      {
        id: 9002,
        nombre: 'JugadorCumplido',
        rol: 'Capitán'
      },
      {
        id: 9003,
        nombre: 'JugadorSinSancion',
        rol: 'Integrante'
      }
    ],
    activo: true,
    esEjemplo: true,
    sanciones: [
      {
        id: 3,
        estado: 'Vigente',
        descripcion: 'Incumplimiento de reglas',
        fechaFin: '2026-12-31'
      }
    ]
  }
]

// Recuperar registros del navegador
function cargarDatos(clave) {
  try {
    const datos = localStorage.getItem(clave)

    if (datos === null) {
      return []
    }

    const registros = JSON.parse(datos)

    if (Array.isArray(registros)) {
      return registros
    }
  } catch {
    // No modificar registros con datos incorrectos
  }

  return null
}

// Agregar ejemplos sin duplicarlos
function agregarEjemplos(clave, ejemplos, campoNombre) {

  const registros = cargarDatos(clave)

  if (registros === null) {
    return
  }

  const nuevos = ejemplos.filter((ejemplo) => {

    return !registros.some((registro) => {

      return (
        Number(registro.id) === ejemplo.id ||
        String(registro[campoNombre]).toLowerCase() ===
          ejemplo[campoNombre].toLowerCase()
      )

    })
  })

  if (nuevos.length > 0) {

    localStorage.setItem(
      clave,
      JSON.stringify([...registros, ...nuevos])
    )

  }
}

// Cargar ejemplos solamente una vez
function inicializarDatosDemoSanciones() {

  // Jugadores de demostración
  const claveJugadoresDemo =
    'esports_jugadores_demo_inicializados'

  if (localStorage.getItem(claveJugadoresDemo) !== 'si') {

    const jugadores = cargarDatos('esports_jugadores')

    if (jugadores !== null) {

      agregarEjemplos(
        'esports_jugadores',
        jugadoresDemo,
        'apodo'
      )

      localStorage.setItem(claveJugadoresDemo, 'si')
    }
  }

  // Equipo de demostración
  const claveEquiposDemo =
    'esports_equipos_demo_inicializados'

  if (localStorage.getItem(claveEquiposDemo) !== 'si') {

    const equipos = cargarDatos('esports_equipos')

    if (equipos !== null) {

      agregarEjemplos(
        'esports_equipos',
        equiposDemo,
        'nombre'
      )

      localStorage.setItem(claveEquiposDemo, 'si')
    }
  }
}

export { inicializarDatosDemoSanciones }
