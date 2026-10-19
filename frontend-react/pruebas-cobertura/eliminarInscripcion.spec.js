
import {
  eliminarInscripcionDeLista
} from '../src/logica/eliminarInscripcion.js'

describe('Cobertura de eliminación de inscripciones', () => {

  const inscripciones = [
    { id: 1, participante: 'Jugador 1' },
    { id: 2, participante: 'Jugador 2' },
    { id: 3, participante: 'Equipo 1' }
  ]

  it('Elimina la inscripción seleccionada', () => {
    const resultado = eliminarInscripcionDeLista(
      inscripciones,
      1
    )

    expect(resultado.length).toBe(2)
    expect(resultado.some(registro => registro.id === 1)).toBeFalse()
  })

  it('Conserva las inscripciones si el ID no existe', () => {
    const resultado = eliminarInscripcionDeLista(
      inscripciones,
      999
    )

    expect(resultado.length).toBe(3)
  })

  it('No modifica la lista original', () => {
    const resultado = eliminarInscripcionDeLista(
      inscripciones,
      2
    )

    expect(inscripciones.length).toBe(3)
    expect(resultado.length).toBe(2)
  })

})
