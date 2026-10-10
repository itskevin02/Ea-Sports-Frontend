
import React from 'react'

import {
  render,
  screen,
  cleanup
} from '@testing-library/react'

import TablaRanking from '../components/TablaRanking'

afterEach(() => {
  cleanup()
})

describe('Pruebas de TablaRanking', () => {

  it('muestra una fila por participante y respeta el orden recibido', () => {

    // Los participantes se entregan en este orden
    const participantes = [
      {
        nombre: 'Equipo A',
        puntos: 3,
        diferencia: 1
      },
      {
        nombre: 'Equipo B',
        puntos: 9,
        diferencia: 5
      },
      {
        nombre: 'Equipo C',
        puntos: 6,
        diferencia: 2
      }
    ]

    render(
      <TablaRanking participantes={participantes} />
    )

    // Una fila de encabezado y tres participantes
    const filas = screen.getAllByRole('row')

    expect(filas.length).toBe(4)

    // Verificar que mantiene el orden recibido
    expect(filas[1].textContent).toContain('Equipo A')
    expect(filas[2].textContent).toContain('Equipo B')
    expect(filas[3].textContent).toContain('Equipo C')

    // Verificar los puntos
    expect(filas[1].textContent).toContain('3')
    expect(filas[2].textContent).toContain('9')
    expect(filas[3].textContent).toContain('6')

  })

})
