
import {
  actualizarJugador,
  eliminarJugador
} from './gestionarJugadores'

describe('Actualización y eliminación de jugadores', () => {

  it('actualiza un jugador y elimina el registro seleccionado', () => {
    const jugadores = [
      {
        id: 1,
        apodo: 'Kevin02',
        correo: 'kevin02@ejemplo.com'
      },
      {
        id: 2,
        apodo: 'Kevin03',
        correo: 'kevin03@ejemplo.com'
      }
    ]

    const actualizados = actualizarJugador(
      jugadores,
      2,
      'KevinPro',
      'kevinpro@ejemplo.com'
    )

    expect(actualizados.length).toBe(2)
    expect(actualizados[1].apodo).toBe('KevinPro')
    expect(actualizados[1].correo).toBe('kevinpro@ejemplo.com')

    // El primer jugador debe conservar sus datos
    expect(actualizados[0]).toEqual(jugadores[0])

    // El arreglo original no debe modificarse
    expect(jugadores[1].apodo).toBe('Kevin03')

    const restantes = eliminarJugador(actualizados, 2)

    expect(restantes.length).toBe(1)
    expect(restantes[0].id).toBe(1)
    expect(restantes[0].apodo).toBe('Kevin02')
  })

})
