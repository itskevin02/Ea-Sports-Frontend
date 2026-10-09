
function actualizarJugador(jugadores, id, apodo, correo) {
  return jugadores.map((jugador) =>
    jugador.id === id
      ? { ...jugador, apodo, correo }
      : jugador
  )
}

function eliminarJugador(jugadores, id) {
  return jugadores.filter((jugador) => jugador.id !== id)
}

export { actualizarJugador, eliminarJugador }
