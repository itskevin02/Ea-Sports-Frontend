
const CLAVE_JUGADORES = 'esports_jugadores'

function cargarJugadores(almacenamiento) {
  try {
    const datos = almacenamiento.getItem(CLAVE_JUGADORES)

    if (datos) {
      const lista = JSON.parse(datos)
      return Array.isArray(lista) ? lista : []
    }
  } catch {
    return []
  }

  return []
}

function guardarJugadores(jugadores, almacenamiento) {
  almacenamiento.setItem(
    CLAVE_JUGADORES,
    JSON.stringify(jugadores)
  )
}

export { cargarJugadores, guardarJugadores }
