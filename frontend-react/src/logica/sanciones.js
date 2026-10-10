
function tieneSancionActiva(participante, fechaActual) {
  if (!participante) {
    return false
  }

  // Compatibilidad con los registros actuales
  if (participante.sancionActiva === true) {
    return true
  }

  if (!Array.isArray(participante.sanciones)) {
    return false
  }

  // Revisar las sanciones del participante
  return participante.sanciones.some((sancion) => {
    return (
      sancion.estado === 'Vigente' &&
      fechaActual <= sancion.fechaFin
    )
  })
}

export { tieneSancionActiva }
