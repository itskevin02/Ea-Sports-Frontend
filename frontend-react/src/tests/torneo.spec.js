
import React from 'react'

import {
  render,
  screen,
  fireEvent,
  cleanup
} from '@testing-library/react'

import { TarjetaTorneo } from '../components/TarjetaTorneo'
import { Torneos } from '../pages/Torneos'

afterEach(() => {
  cleanup()
})

const torneoMock = {
  id: 1,
  nombre: 'Copa EA Sports FC 24',
  juego: 'EA Sports FC',
  plataforma: 'PC',
  estado: 'Abierto',
  inscritos: 20,
  cupos: 32,
  descripcion: 'Torneo de prueba',
  imagen: '/torneo-prueba.png'
}

describe('Pruebas unitarias de Torneos', () => {

  it('01. Muestra correctamente los datos del torneo', () => {

    render(<TarjetaTorneo torneo={torneoMock} />)

    expect(
      screen.getByText('Copa EA Sports FC 24')
    ).not.toBeNull()

    expect(
      screen.getByText('Juego: EA Sports FC')
    ).not.toBeNull()

    expect(
      screen.getByText('Abierto')
    ).not.toBeNull()

    expect(
      screen.getByText('Cupos: 20/32')
    ).not.toBeNull()

  })

  it('02. Filtra los torneos segun la busqueda y el estado', () => {

    render(<Torneos />)

    const buscador = screen.getByPlaceholderText(
      'Buscar por nombre o juego...'
    )

    fireEvent.change(buscador, {
      target: { value: 'Madden' }
    })

    expect(
      screen.getByText('Liga Madden NFL Master')
    ).not.toBeNull()

    expect(
      screen.queryByText('Copa EA Sports FC 26')
    ).toBeNull()

    const selectorEstado = screen.getByLabelText(
      'Filtrar por estado'
    )

    fireEvent.change(selectorEstado, {
      target: { value: 'Abierto' }
    })

    expect(
      screen.getByText(
        'No se encontraron torneos con esos criterios.'
      )
    ).not.toBeNull()

  })

  it('03. Ejecuta la funcion al presionar Ver Detalle', () => {

    const funcionDetalle = jasmine.createSpy('funcionDetalle')

    render(
      <TarjetaTorneo
        torneo={torneoMock}
        onVerDetalle={funcionDetalle}
      />
    )

    const boton = screen.getByRole('button', {
      name: 'Ver Detalle'
    })

    fireEvent.click(boton)

    expect(funcionDetalle).toHaveBeenCalledWith(torneoMock)

  })

  it('04. Filtra los torneos por juego', () => {

    render(<Torneos />)

    const selectorJuego = screen.getByLabelText(
      'Filtrar por juego'
    )

    fireEvent.change(selectorJuego, {
      target: { value: 'Fortnite' }
    })

    expect(
      screen.getByText('Copa Fortnite Dúos')
    ).not.toBeNull()

    expect(
      screen.queryByText('Liga VALORANT')
    ).toBeNull()

  })

  it('05. Filtra torneos por rango de fechas', () => {

    render(<Torneos />)

    fireEvent.change(
      screen.getByLabelText('Fecha de inicio desde'),
      { target: { value: '2026-11-15' } }
    )

    fireEvent.change(
      screen.getByLabelText('Fecha de inicio hasta'),
      { target: { value: '2026-11-20' } }
    )

    expect(
      screen.getByText('Copa EA Sports FC 26')
    ).not.toBeNull()

    expect(
      screen.getByText('Championship Apex Legends')
    ).not.toBeNull()

    expect(
      screen.queryByText('Liga Madden NFL Master')
    ).toBeNull()

  })

  it('06. Rechaza un rango de fechas incorrecto', () => {

    render(<Torneos />)

    fireEvent.change(
      screen.getByLabelText('Fecha de inicio desde'),
      { target: { value: '2026-12-31' } }
    )

    fireEvent.change(
      screen.getByLabelText('Fecha de inicio hasta'),
      { target: { value: '2026-11-01' } }
    )

    expect(
      screen.getByText(
        /La fecha inicial no puede ser posterior/
      )
    ).not.toBeNull()

  })

})
