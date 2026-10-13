
function eliminarEquipoYInscripciones(equipos, inscripciones, idEquipo) {

  // Eliminar solamente el equipo seleccionado
  const equiposRestantes = equipos.filter(
    (equipo) =>
      String(equipo.id) !== String(idEquipo)
  )

  // Cancelar sus inscripciones en los torneos
  const inscripcionesRestantes = inscripciones.filter(
    (registro) =>
      !(
        registro.tipo === 'equipo' &&
        String(registro.participanteId) === String(idEquipo)
      )
  )

  const inscripcionesCanceladas =
    inscripciones.length - inscripcionesRestantes.length

  return {
    equiposRestantes,
    inscripcionesRestantes,
    inscripcionesCanceladas
  }
}

export { eliminarEquipoYInscripciones }
