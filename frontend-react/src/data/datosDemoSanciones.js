
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

// Recuperar registros sin perder los existentes
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
    // No modificar los datos si existe un error
  }

  return null
}

// Agregar ejemplos solamente si no existen
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

function inicializarDatosDemoSanciones() {
  agregarEjemplos(
    'esports_jugadores',
    jugadoresDemo,
    'apodo'
  )

  agregarEjemplos(
    'esports_equipos',
    equiposDemo,
    'nombre'
  )
}

export { inicializarDatosDemoSanciones }
