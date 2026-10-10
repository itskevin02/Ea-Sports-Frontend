
function obtenerInscritosActuales(torneo) {
  let inscritosLocales = 0

  try {
    const datos = localStorage.getItem(
      'esports_inscripciones_ep2'
    )

    if (datos) {
      const inscripciones = JSON.parse(datos)

      if (Array.isArray(inscripciones)) {
        inscritosLocales = inscripciones.filter(
          (inscripcion) =>
            Number(inscripcion.torneoId) === Number(torneo.id)
        ).length
      }
    }
  } catch {
    inscritosLocales = 0
  }

  return torneo.inscritos + inscritosLocales
}

export { obtenerInscritosActuales }
