
function eliminarInscripcionDeLista(inscripciones, idInscripcion) {

  return inscripciones.filter(
    (registro) =>
      String(registro.id) !== String(idInscripcion)
  )

}

export { eliminarInscripcionDeLista }
