
import React from 'react'

import {
  render,
  screen,
  cleanup
} from '@testing-library/react'

import LlaveTorneo from '../components/LlaveTorneo'

afterEach(() => {
  cleanup()
})

describe('Pruebas de LlaveTorneo', () => {

  it('muestra participante por definir cuando falta un rival', () => {

    const partidas = [
      {
        id: 1,
        ronda: 'Semifinal 1',
        participanteA: 'Equipo Azul',
        participanteB: null,
        estado: 'Programada'
      }
    ]

    const { rerender } = render(
      <LlaveTorneo partidas={partidas} />
    )

    // Debe aparecer el participante ya conocido
    expect(
      screen.getByText('Equipo Azul')
    ).not.toBeNull()

    // Debe mostrar el mensaje si falta el rival
    expect(
      screen.getByText('Participante por definir')
    ).not.toBeNull()

    // Ahora asignamos el rival
    const partidasActualizadas = [
      {
        id: 1,
        ronda: 'Semifinal 1',
        participanteA: 'Equipo Azul',
        participanteB: 'Equipo Rojo',
        estado: 'Programada'
      }
    ]

    rerender(
      <LlaveTorneo partidas={partidasActualizadas} />
    )

    expect(
      screen.getByText('Equipo Rojo')
    ).not.toBeNull()

    expect(
      screen.queryByText('Participante por definir')
    ).toBeNull()

  })

})
