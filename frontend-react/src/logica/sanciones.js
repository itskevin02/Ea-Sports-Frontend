
function tieneSancionActiva(participante, fechaActual) {

  if (!participante) {
    return false
  }

  // Compatibilidad con registros anteriores
  if (participante.sancionActiva === true) {
    return true
  }

  if (!Array.isArray(participante.sanciones)) {
    return false
  }

  // Comprobar sanciones vigentes
  return participante.sanciones.some((sancion) => {
    return (
      sancion.estado === 'Vigente' &&
      fechaActual <= sancion.fechaFin
    )
  })
}

// Buscar integrantes sancionados dentro de un equipo
function obtenerIntegranteSancionado(
  equipo,
  jugadores,
  fechaActual
) {

  if (!equipo || !Array.isArray(jugadores)) {
    return null
  }

  const integrantes = Array.isArray(equipo.integrantes)
    ? equipo.integrantes
    : []

  // Identificadores de los integrantes
  const idsIntegrantes = integrantes.map(
    (integrante) => String(integrante.id)
  )

  // Incluir al capitán
  if (
    equipo.capitanId !== undefined &&
    equipo.capitanId !== null
  ) {
    idsIntegrantes.push(String(equipo.capitanId))
  }

  // Buscar jugador sancionado por su ID
  const sancionado = jugadores.find((jugador) => {
    return (
      idsIntegrantes.includes(String(jugador.id)) &&
      tieneSancionActiva(jugador, fechaActual)
    )
  })

  return sancionado || null
}

export {
  tieneSancionActiva,
  obtenerIntegranteSancionado
}
