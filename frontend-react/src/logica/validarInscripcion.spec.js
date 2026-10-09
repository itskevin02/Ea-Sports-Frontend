
import {
  cuposDisponibles,
  inscripcionFueraDePlazo,
  equipoCompleto
} from './validarInscripcion'

describe('Validaciones de inscripcion a torneos', () => {

  it('calcula los cupos disponibles sin devolver valores negativos', () => {

    const resultado1 = cuposDisponibles(16, 8, 2)
    expect(resultado1).toBe(6)

    const resultado2 = cuposDisponibles(8, 8, 0)
    expect(resultado2).toBe(0)

    const resultado3 = cuposDisponibles(8, 10, 2)
    expect(resultado3).toBe(0)

  })

  it('detecta cuando una inscripcion esta fuera de plazo', () => {

    const antesDelCierre = inscripcionFueraDePlazo(
      '2026-10-09',
      '2026-10-15'
    )
    expect(antesDelCierre).toBe(false)

    const mismoDiaDelCierre = inscripcionFueraDePlazo(
      '2026-10-15',
      '2026-10-15'
    )
    expect(mismoDiaDelCierre).toBe(false)

    const despuesDelCierre = inscripcionFueraDePlazo(
      '2026-10-16',
      '2026-10-15'
    )
    expect(despuesDelCierre).toBe(true)

  })

  it('valida que un equipo tenga los integrantes necesarios', () => {

    const equipoIncompleto = {
      nombre: 'Equipo A',
      integrantes: [
        { id: 1, nombre: 'Jugador 1' }
      ]
    }

    const equipoCompletoEjemplo = {
      nombre: 'Equipo B',
      integrantes: [
        { id: 1, nombre: 'Jugador 1' },
        { id: 2, nombre: 'Jugador 2' },
        { id: 3, nombre: 'Jugador 3' },
        { id: 4, nombre: 'Jugador 4' },
        { id: 5, nombre: 'Jugador 5' }
      ]
    }

    expect(equipoCompleto(equipoIncompleto, 2)).toBe(false)

    expect(equipoCompleto(equipoCompletoEjemplo, 5)).toBe(true)

    expect(equipoCompleto(equipoCompletoEjemplo, 6)).toBe(false)

    expect(equipoCompleto(null, 5)).toBe(false)

  })

})
