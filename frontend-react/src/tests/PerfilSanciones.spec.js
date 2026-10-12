
import React from 'react'

import {
  render,
  screen,
  fireEvent,
  cleanup
} from '@testing-library/react'

import Perfil from '../pages/Perfil'

describe('Pruebas de sanciones en Perfil', () => {

  let jugadoresAnteriores

  beforeEach(() => {

    // Guardar los datos actuales del navegador
    jugadoresAnteriores = localStorage.getItem(
      'esports_jugadores'
    )

    // Jugadores ficticios para la prueba
    const jugadoresPrueba = [
      {
        id: 9001,
        apodo: 'JugadorSancionado',
        correo: 'sancionado@ejemplo.com',
        sanciones: [
          {
            id: 1,
            estado: 'Vigente',
            descripcion: 'Conducta antideportiva',
            fechaFin: '2026-12-31'
          }
        ]
      },
      {
        id: 9002,
        apodo: 'JugadorCumplido',
        correo: 'cumplido@ejemplo.com',
        sanciones: [
          {
            id: 2,
            estado: 'Cumplida',
            descripcion: 'Abandono de partida',
            fechaFin: '2026-09-30'
          }
        ]
      }
    ]

    localStorage.setItem(
      'esports_jugadores',
      JSON.stringify(jugadoresPrueba)
    )

  })

  afterEach(() => {

    cleanup()

    // Restaurar los datos anteriores
    if (jugadoresAnteriores === null) {
      localStorage.removeItem('esports_jugadores')
    } else {
      localStorage.setItem(
        'esports_jugadores',
        jugadoresAnteriores
      )
    }

  })

  it('muestra las sanciones del jugador seleccionado', () => {

    render(<Perfil />)

    // Primer jugador: sanción vigente
    expect(
      screen.getByText(/Conducta antideportiva/)
    ).not.toBeNull()

    // Cambiar al segundo jugador
    const selector = screen.getByLabelText(
      'Seleccionar jugador'
    )

    fireEvent.change(selector, {
      target: { value: '9002' }
    })

    // La sanción anterior ya no debe aparecer
    expect(
      screen.queryByText(/Conducta antideportiva/)
    ).toBeNull()

    // Debe aparecer la sanción cumplida
    expect(
      screen.getByText(/Abandono de partida/)
    ).not.toBeNull()

  })

})
