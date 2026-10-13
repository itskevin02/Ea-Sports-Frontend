
import {
  eliminarInscripcionDeLista
} from '../logica/eliminarInscripcion'

describe('Eliminación de inscripciones', () => {

  const inscripciones = [
    {
      id: 1,
      torneoId: 1,
      tipo: 'jugador',
      participanteId: 10,
      participante: 'Kevin02'
    },
    {
      id: 2,
      torneoId: 1,
      tipo: 'jugador',
      participanteId: 20,
      participante: 'JugadorCumplido'
    },
    {
      id: 3,
      torneoId: 4,
      tipo: 'equipo',
      participanteId: 30,
      participante: 'Equipo Fortnite'
    }
  ]

  it('01. Elimina solamente la inscripción seleccionada', () => {

    const resultado = eliminarInscripcionDeLista(
      inscripciones,
      1
    )

    expect(resultado.length).toBe(2)

    expect(
      resultado.some((registro) => registro.id === 1)
    ).toBeFalse()

    expect(
      resultado.some((registro) => registro.id === 2)
    ).toBeTrue()

  })

  it('02. Permite eliminar inscripciones de equipos', () => {

    const resultado = eliminarInscripcionDeLista(
      inscripciones,
      3
    )

    expect(resultado.length).toBe(2)

    expect(
      resultado.some((registro) => registro.id === 3)
    ).toBeFalse()

  })

  it('03. No elimina registros cuando el ID no existe', () => {

    const resultado = eliminarInscripcionDeLista(
      inscripciones,
      999
    )

    expect(resultado.length).toBe(3)

  })

  it('04. Conserva la lista original', () => {

    const resultado = eliminarInscripcionDeLista(
      inscripciones,
      1
    )

    expect(inscripciones.length).toBe(3)
    expect(resultado.length).toBe(2)

  })

})
