
import React from 'react'

import {
  render,
  screen,
  fireEvent,
  cleanup
} from '@testing-library/react'

import { TarjetaTorneo } from '../components/TarjetaTorneo'
import { Torneos } from '../pages/Torneos'

// Limpiar después de cada prueba
afterEach(() => {
  cleanup()
})

// Datos de ejemplo para las pruebas
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

  // PRUEBA 1: Mostrar información del torneo
  it('01. Muestra correctamente los datos del torneo', () => {

    render(<TarjetaTorneo torneo={torneoMock} />)

    // Verificar nombre del torneo
    expect(
      screen.getByText('Copa EA Sports FC 24')
    ).not.toBeNull()

    // Verificar videojuego
    expect(
      screen.getByText('Juego: EA Sports FC')
    ).not.toBeNull()

    // Verificar estado
    expect(
      screen.getByText('Abierto')
    ).not.toBeNull()

    // Verificar cupos
    expect(
      screen.getByText('Cupos: 20/32')
    ).not.toBeNull()

  })

  // PRUEBA 2: Filtrar torneos
  it('02. Filtra los torneos segun la busqueda y el estado', () => {

    render(<Torneos />)

    const buscador = screen.getByPlaceholderText(
      'Buscar por nombre o juego...'
    )

    // Buscar un torneo de Madden
    fireEvent.change(buscador, {
      target: { value: 'Madden' }
    })

    expect(
      screen.getByText('Liga Madden NFL Master')
    ).not.toBeNull()

    // Comprobar que FC26 no aparece en los resultados
    expect(
      screen.queryByText('Copa EA Sports FC 26')
    ).toBeNull()

    // Filtrar por estado
    const selectorEstado = screen.getByRole('combobox')

    fireEvent.change(selectorEstado, {
      target: { value: 'Abierto' }
    })

    // Madden no está abierto
    expect(
      screen.getByText(
        'No se encontraron torneos con esos criterios.'
      )
    ).not.toBeNull()

  })

  // PRUEBA 3: Botón Ver Detalle
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

    // Simular clic en el botón
    fireEvent.click(boton)

    // Verificar que se ejecutó la función
    expect(funcionDetalle).toHaveBeenCalledWith(torneoMock)

  })

})
