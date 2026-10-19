
import {
  actualizarJugador,
  eliminarJugador
} from '../src/logica/gestionarJugadores.js'

describe('Cobertura de gestión de jugadores', () => {

  const jugadores = [
    { id: 1, apodo: 'Jugador1', correo: 'uno@gmail.com' },
    { id: 2, apodo: 'Jugador2', correo: 'dos@gmail.com' }
  ]

  it('Actualiza los datos del jugador seleccionado', () => {
    const resultado = actualizarJugador(
      jugadores,
      1,
      'Kevin02',
      'kevin@gmail.com'
    )

    expect(resultado[0].apodo).toBe('Kevin02')
    expect(resultado[0].correo).toBe('kevin@gmail.com')
    expect(resultado[1].apodo).toBe('Jugador2')
  })

  it('Conserva los jugadores si el ID no existe', () => {
    const resultado = actualizarJugador(
      jugadores,
      999,
      'Nuevo',
      'nuevo@gmail.com'
    )

    expect(resultado).toEqual(jugadores)
  })

  it('Elimina solamente el jugador seleccionado', () => {
    const resultado = eliminarJugador(jugadores, 1)

    expect(resultado.length).toBe(1)
    expect(resultado[0].id).toBe(2)
  })

  it('Conserva la lista si el jugador no existe', () => {
    const resultado = eliminarJugador(jugadores, 999)

    expect(resultado.length).toBe(2)
    expect(jugadores.length).toBe(2)
  })

})
