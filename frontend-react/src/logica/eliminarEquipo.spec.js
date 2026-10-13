
import {
  eliminarEquipoYInscripciones
} from './eliminarEquipo'

describe('Eliminar equipo e inscripciones', () => {

  const equipos = [
    { id: 1, nombre: 'Clarence' },
    { id: 2, nombre: 'Wolf' }
  ]

  const inscripciones = [
    {
      id: 1,
      torneoId: 4,
      tipo: 'equipo',
      participanteId: 1
    },
    {
      id: 2,
      torneoId: 3,
      tipo: 'equipo',
      participanteId: 1
    },
    {
      id: 3,
      torneoId: 4,
      tipo: 'equipo',
      participanteId: 2
    },
    {
      id: 4,
      torneoId: 1,
      tipo: 'jugador',
      participanteId: 1
    }
  ]

  it('elimina el equipo y cancela sus inscripciones', () => {

    const resultado = eliminarEquipoYInscripciones(
      equipos,
      inscripciones,
      1
    )

    expect(resultado.equiposRestantes.length).toBe(1)
    expect(resultado.equiposRestantes[0].nombre).toBe('Wolf')
    expect(resultado.inscripcionesCanceladas).toBe(2)

  })

  it('conserva las inscripciones de otros participantes', () => {

    const resultado = eliminarEquipoYInscripciones(
      equipos,
      inscripciones,
      1
    )

    expect(resultado.inscripcionesRestantes.length).toBe(2)

    expect(
      resultado.inscripcionesRestantes.some(
        (registro) =>
          registro.tipo === 'equipo' &&
          registro.participanteId === 2
      )
    ).toBe(true)

    expect(
      resultado.inscripcionesRestantes.some(
        (registro) =>
          registro.tipo === 'jugador' &&
          registro.participanteId === 1
      )
    ).toBe(true)

  })

})
