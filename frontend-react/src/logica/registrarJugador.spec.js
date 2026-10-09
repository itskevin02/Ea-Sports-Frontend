
import registrarJugador from './registrarJugador'

describe('Registro de jugadores', () => {

  it('registra jugadores y rechaza datos duplicados', () => {
    const jugadores = []

    const primerRegistro = registrarJugador(
      jugadores,
      'Kevin02',
      'kevin02@ejemplo.com'
    )

    expect(primerRegistro.errores).toEqual({})
    expect(primerRegistro.jugadores.length).toBe(1)
    expect(primerRegistro.jugadores[0].id).toBe(1)
    expect(primerRegistro.jugadores[0].apodo).toBe('Kevin02')

    const apodoRepetido = registrarJugador(
      primerRegistro.jugadores,
      'Kevin02',
      'otro@ejemplo.com'
    )

    expect(apodoRepetido.errores.apodo).toBe(
      'Este apodo ya está registrado.'
    )

    expect(apodoRepetido.jugadores.length).toBe(1)

    const correoRepetido = registrarJugador(
      primerRegistro.jugadores,
      'Kevin03',
      'kevin02@ejemplo.com'
    )

    expect(correoRepetido.errores.correo).toBe(
      'Este correo ya está registrado.'
    )

    expect(correoRepetido.jugadores.length).toBe(1)

    const segundoRegistro = registrarJugador(
      primerRegistro.jugadores,
      'Kevin03',
      'kevin03@ejemplo.com'
    )

    expect(segundoRegistro.errores).toEqual({})
    expect(segundoRegistro.jugadores.length).toBe(2)
    expect(segundoRegistro.jugadores[1].id).toBe(2)
  })

})
