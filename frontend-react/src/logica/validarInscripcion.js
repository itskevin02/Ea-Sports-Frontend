
function cuposDisponibles(cupoMaximo, inscritos, inscritosLocales = 0) {
  const disponibles = cupoMaximo - inscritos - inscritosLocales

  if (disponibles < 0) {
    return 0
  }

  return disponibles
}

function inscripcionFueraDePlazo(fechaActual, fechaCierre) {
  return fechaActual > fechaCierre
}

function equipoCompleto(equipo, cantidadMinima) {
  if (!equipo || !Array.isArray(equipo.integrantes)) {
    return false
  }

  return equipo.integrantes.length >= cantidadMinima
}

export {
  cuposDisponibles,
  inscripcionFueraDePlazo,
  equipoCompleto
}
