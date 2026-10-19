
import {
  cuposDisponibles,
  inscripcionFueraDePlazo,
  equipoCompleto
} from '../src/logica/validarInscripcion.js'

describe('Validaciones de inscripción', () => {

  it('Calcula correctamente los cupos disponibles', () => {
    expect(cuposDisponibles(10, 4)).toBe(6)
    expect(cuposDisponibles(10, 12)).toBe(0)
  })

  it('Comprueba las fechas de inscripción', () => {
    expect(
      inscripcionFueraDePlazo('2026-10-19', '2026-10-18')
    ).toBeTrue()

    expect(
      inscripcionFueraDePlazo('2026-10-18', '2026-10-19')
    ).toBeFalse()
  })

  it('Comprueba la cantidad de integrantes de un equipo', () => {
    const equipo = {
      integrantes: [{ id: 1 }, { id: 2 }]
    }

    expect(equipoCompleto(equipo, 2)).toBeTrue()
    expect(equipoCompleto(equipo, 3)).toBeFalse()
    expect(equipoCompleto(null, 2)).toBeFalse()
  })

})
