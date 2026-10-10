
import { tieneSancionActiva } from './sanciones'

describe('Validaciones de sanciones', () => {

  it('bloquea sanciones vigentes y permite las cumplidas', () => {

    const fechaActual = '2026-10-09'

    const jugadorSancionado = {
      apodo: 'Jugador01',
      sanciones: [
        {
          estado: 'Vigente',
          fechaFin: '2026-10-15'
        }
      ]
    }

    const jugadorCumplido = {
      apodo: 'Jugador02',
      sanciones: [
        {
          estado: 'Cumplida',
          fechaFin: '2026-10-05'
        }
      ]
    }

    const jugadorSinSancion = {
      apodo: 'Jugador03',
      sanciones: []
    }

    const jugadorSancionVencida = {
      apodo: 'Jugador04',
      sanciones: [
        {
          estado: 'Vigente',
          fechaFin: '2026-10-01'
        }
      ]
    }

    expect(
      tieneSancionActiva(jugadorSancionado, fechaActual)
    ).toBe(true)

    expect(
      tieneSancionActiva(jugadorCumplido, fechaActual)
    ).toBe(false)

    expect(
      tieneSancionActiva(jugadorSinSancion, fechaActual)
    ).toBe(false)

    expect(
      tieneSancionActiva(jugadorSancionVencida, fechaActual)
    ).toBe(false)

  })

})
