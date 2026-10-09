
import {
  cargarJugadores,
  guardarJugadores
} from './almacenamientoJugadores'

describe('Persistencia de jugadores', () => {

  it('guarda y recupera jugadores usando un mock', () => {
    let datosGuardados = null

    const almacenamientoMock = {
      getItem: jasmine.createSpy('getItem').and.callFake((clave) => {
        if (clave === 'esports_jugadores') {
          return datosGuardados
        }

        return null
      }),

      setItem: jasmine.createSpy('setItem').and.callFake((clave, valor) => {
        if (clave === 'esports_jugadores') {
          datosGuardados = valor
        }
      })
    }

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

    // Guardar los jugadores en el almacenamiento simulado
    guardarJugadores(jugadores, almacenamientoMock)

    expect(almacenamientoMock.setItem).toHaveBeenCalledWith(
      'esports_jugadores',
      JSON.stringify(jugadores)
    )

    // Recuperar los jugadores guardados
    const jugadoresRecuperados = cargarJugadores(
      almacenamientoMock
    )

    expect(almacenamientoMock.getItem).toHaveBeenCalledWith(
      'esports_jugadores'
    )

    expect(jugadoresRecuperados).toEqual(jugadores)
    expect(jugadoresRecuperados.length).toBe(2)
  })

})
