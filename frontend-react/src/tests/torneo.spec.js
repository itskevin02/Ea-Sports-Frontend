
import React from 'react'

import {
  render,
  screen,
  fireEvent,
  cleanup
} from '@testing-library/react'

import { TarjetaTorneo } from '../components/TarjetaTorneo'
import { Torneos } from '../pages/Torneos'

const torneosPrueba = [
  {
    id: 1,
    nombre: 'Torneo de Prueba EP3',
    ubicacion: 'Online',
    cantidadEquipos: 8,
    estado: 'Abierto',
    juegoId: 1,
    plataforma: 'PC',
    fechaInicio: '2026-12-15',
    fechaCierre: '2026-12-10',
    descripcion: 'Torneo para las pruebas',
    imagen: ''
  },
  {
    id: 2,
    nombre: 'Liga de Prueba EP3',
    ubicacion: 'Online',
    cantidadEquipos: 16,
    estado: 'Finalizado',
    juegoId: 2,
    plataforma: 'PS5',
    fechaInicio: '2026-12-22',
    fechaCierre: '2026-12-20',
    descripcion: 'Segunda competencia de prueba',
    imagen: ''
  }
]

function respuestaApi(datos) {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(datos)
  }
}

describe('Pruebas de Torneos EP3', () => {

  beforeEach(() => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve(respuestaApi(torneosPrueba))
    )
  })

  afterEach(() => {
    cleanup()
  })

  it('01. Muestra los datos de un torneo del backend', () => {

    render(
      <TarjetaTorneo torneo={torneosPrueba[0]} />
    )

    expect(
      screen.getByText('Torneo de Prueba EP3')
    ).not.toBeNull()

    expect(
      screen.getByText('Juego: ID 1')
    ).not.toBeNull()

    expect(
      screen.getByText('Equipos permitidos: 8')
    ).not.toBeNull()

  })

  it('02. Carga torneos desde la API REST', async () => {

    render(<Torneos />)

    await screen.findByText('Torneo de Prueba EP3')

    expect(
      screen.getByText('Liga de Prueba EP3')
    ).not.toBeNull()

    expect(
      screen.getByText('Torneos encontrados: 2')
    ).not.toBeNull()

    expect(window.fetch).toHaveBeenCalled()

  })

  it('03. Filtra torneos por nombre', async () => {

    render(<Torneos />)

    await screen.findByText('Torneo de Prueba EP3')

    const buscador = screen.getByPlaceholderText(
      'Buscar por nombre o juego...'
    )

    fireEvent.change(buscador, {
      target: { value: 'Torneo de Prueba' }
    })

    expect(
      screen.getByText('Torneo de Prueba EP3')
    ).not.toBeNull()

    expect(
      screen.queryByText('Liga de Prueba EP3')
    ).toBeNull()

  })

  it('04. Filtra torneos por estado', async () => {

    render(<Torneos />)

    await screen.findByText('Torneo de Prueba EP3')

    const selector = screen.getByLabelText(
      'Filtrar por estado'
    )

    fireEvent.change(selector, {
      target: { value: 'Finalizado' }
    })

    expect(
      screen.getByText('Liga de Prueba EP3')
    ).not.toBeNull()

    expect(
      screen.queryByText('Torneo de Prueba EP3')
    ).toBeNull()

  })

  it('05. Filtra torneos por juego', async () => {

    render(<Torneos />)

    await screen.findByText('Torneo de Prueba EP3')

    const selector = screen.getByLabelText(
      'Filtrar por juego'
    )

    fireEvent.change(selector, {
      target: { value: 'Juego ID 2' }
    })

    expect(
      screen.getByText('Liga de Prueba EP3')
    ).not.toBeNull()

    expect(
      screen.queryByText('Torneo de Prueba EP3')
    ).toBeNull()

  })

  it('06. Filtra torneos por rango de fechas', async () => {

    render(<Torneos />)

    await screen.findByText('Torneo de Prueba EP3')

    fireEvent.change(
      screen.getByLabelText('Fecha de inicio desde'),
      { target: { value: '2026-12-10' } }
    )

    fireEvent.change(
      screen.getByLabelText('Fecha de inicio hasta'),
      { target: { value: '2026-12-20' } }
    )

    expect(
      screen.getByText('Torneo de Prueba EP3')
    ).not.toBeNull()

    expect(
      screen.queryByText('Liga de Prueba EP3')
    ).toBeNull()

  })

  it('07. Rechaza un rango de fechas incorrecto', async () => {

    render(<Torneos />)

    await screen.findByText('Torneo de Prueba EP3')

    fireEvent.change(
      screen.getByLabelText('Fecha de inicio desde'),
      { target: { value: '2026-12-31' } }
    )

    fireEvent.change(
      screen.getByLabelText('Fecha de inicio hasta'),
      { target: { value: '2026-12-01' } }
    )

    expect(
      screen.getByText(
        /La fecha inicial no puede ser posterior/
      )
    ).not.toBeNull()

  })

  it('08. Muestra el mensaje cuando no hay torneos', async () => {

    window.fetch.and.returnValue(
      Promise.resolve(respuestaApi([]))
    )

    render(<Torneos />)

    expect(
      await screen.findByText(
        'No hay torneos registrados en el servidor.'
      )
    ).not.toBeNull()

  })

  it('09. Muestra un error si falla la conexion', async () => {

    window.fetch.and.returnValue(
      Promise.reject(new Error('Error de prueba'))
    )

    render(<Torneos />)

    expect(
      await screen.findByText(
        'No se pudo conectar con el servidor.'
      )
    ).not.toBeNull()

  })

  it('10. Ejecuta la funcion al presionar Ver Detalle', () => {

    const funcionDetalle = jasmine.createSpy('funcionDetalle')

    render(
      <TarjetaTorneo
        torneo={torneosPrueba[0]}
        onVerDetalle={funcionDetalle}
      />
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Ver Detalle'
      })
    )

    expect(funcionDetalle).toHaveBeenCalledWith(
      torneosPrueba[0]
    )

  })

})
