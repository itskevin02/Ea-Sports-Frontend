
import validarPerfil from './validarPerfil'

function registrarJugador(jugadores, apodo, correo) {
  const apodoLimpio = apodo.trim()
  const correoLimpio = correo.trim()

  const errores = validarPerfil(
    apodoLimpio,
    correoLimpio,
    '',
    '',
    false
  )

  const apodoRepetido = jugadores.some((jugador) =>
    jugador.apodo.toLowerCase() === apodoLimpio.toLowerCase()
  )

  const correoRepetido = jugadores.some((jugador) =>
    jugador.correo.toLowerCase() === correoLimpio.toLowerCase()
  )

  if (apodoRepetido) {
    errores.apodo = 'Este apodo ya está registrado.'
  }

  if (correoRepetido) {
    errores.correo = 'Este correo ya está registrado.'
  }

  if (Object.keys(errores).length > 0) {
    return {
      jugadores: jugadores,
      errores: errores
    }
  }

  const nuevoId = jugadores.length > 0
    ? Math.max(...jugadores.map((jugador) => jugador.id)) + 1
    : 1

  const nuevoJugador = {
    id: nuevoId,
    apodo: apodoLimpio,
    correo: correoLimpio
  }

  return {
    jugadores: [...jugadores, nuevoJugador],
    errores: {}
  }
}

export default registrarJugador
