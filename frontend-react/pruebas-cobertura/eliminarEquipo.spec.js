
import {
  eliminarEquipoYInscripciones
} from '../src/logica/eliminarEquipo.js'

describe('Cobertura de eliminación de equipos', () => {

  const equipos = [
    { id: 1, nombre: 'Equipo A' },
    { id: 2, nombre: 'Equipo B' }
  ]

  const inscripciones = [
    { id: 1, tipo: 'equipo', participanteId: 1 },
    { id: 2, tipo: 'equipo', participanteId: 2 },
    { id: 3, tipo: 'jugador', participanteId: 1 }
  ]

  it('Elimina solamente el equipo seleccionado', () => {
    const resultado = eliminarEquipoYInscripciones(
      equipos,
      inscripciones,
      1
    )

    expect(resultado.equiposRestantes.length).toBe(1)
    expect(resultado.equiposRestantes[0].id).toBe(2)
    expect(resultado.inscripcionesRestantes.length).toBe(2)
    expect(resultado.inscripcionesCanceladas).toBe(1)
  })

  it('Conserva los datos si el equipo no existe', () => {
    const resultado = eliminarEquipoYInscripciones(
      equipos,
      inscripciones,
      999
    )

    expect(resultado.equiposRestantes.length).toBe(2)
    expect(resultado.inscripcionesRestantes.length).toBe(3)
    expect(resultado.inscripcionesCanceladas).toBe(0)
  })

  it('Elimina varias inscripciones del mismo equipo', () => {
    const registros = [
      { id: 1, tipo: 'equipo', participanteId: 1 },
      { id: 2, tipo: 'equipo', participanteId: 1 },
      { id: 3, tipo: 'jugador', participanteId: 1 }
    ]

    const resultado = eliminarEquipoYInscripciones(
      equipos,
      registros,
      1
    )

    expect(resultado.inscripcionesCanceladas).toBe(2)
    expect(resultado.inscripcionesRestantes.length).toBe(1)
    expect(resultado.inscripcionesRestantes[0].tipo).toBe('jugador')
    expect(registros.length).toBe(3)
  })

})
