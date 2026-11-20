import React from 'react'

import {
  render,
  screen,
  fireEvent,
  cleanup
} from '@testing-library/react'

import { TarjetaTorneo } from '../components/TarjetaTorneo'
import { Torneos } from '../pages/Torneos'
import DetalleTorneoApi from '../pages/DetalleTorneoApi'

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

const juegosPrueba = [
  {
    id: 1,
    nombre: 'EA Sports FC 26'
  },
  {
    id: 2,
    nombre: 'Rocket League'
  }
]

function respuestaApi(datos) {
  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(datos)
  }
}

function respuestaError(mensaje) {
  return {
    ok: false,
    status: 404,
    json: () => Promise.resolve({ mensaje })
  }
}

function simularPeticion(
  url,
  torneos = torneosPrueba,
  juegos = juegosPrueba
) {

  if (url.endsWith('/tournaments')) {
    return Promise.resolve(respuestaApi(torneos))
  }

  if (url.endsWith('/games')) {
    return Promise.resolve(respuestaApi(juegos))
  }

  if (url.includes('/tournaments/')) {

    const id = Number(url.split('/').pop())
    const torneo = torneos.find((t) => t.id === id)

    return Promise.resolve(
      torneo
        ? respuestaApi(torneo)
        : respuestaError('No se encontró el torneo.')
    )
  }

  if (url.includes('/games/')) {

    const id = Number(url.split('/').pop())
    const juego = juegos.find((j) => j.id === id)

    return Promise.resolve(
      juego
        ? respuestaApi(juego)
        : respuestaError('No se encontró el videojuego.')
    )
  }

  return Promise.reject(
    new Error('Ruta no simulada en la prueba')
  )
}

describe('Pruebas de Torneos EP3', () => {

  beforeEach(() => {

    spyOn(window, 'fetch').and.callFake((url) =>
      simularPeticion(url)
    )

  })

  afterEach(() => {
    cleanup()
  })

  it('01. Muestra el nombre real del videojuego', () => {

    const torneo = {
      ...torneosPrueba[0],
      juego: 'EA Sports FC 26'
    }

    render(<TarjetaTorneo torneo={torneo} />)

    expect(
      screen.getByText('Torneo de Prueba EP3')
    ).not.toBeNull()

    expect(
      screen.getByText('Juego: EA Sports FC 26')
    ).not.toBeNull()

    expect(
      screen.getByText('Equipos permitidos: 8')
    ).not.toBeNull()

  })

  it('02. Carga torneos y juegos desde la API', async () => {

    render(<Torneos />)

    await screen.findByText('Juego: EA Sports FC 26')

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

  it('05. Filtra por nombre real del juego', async () => {

    render(<Torneos />)

    await screen.findByText('Torneo de Prueba EP3')

    const selector = screen.getByLabelText(
      'Filtrar por juego'
    )

    fireEvent.change(selector, {
      target: { value: 'Rocket League' }
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

  it('08. Muestra un mensaje si no hay torneos', async () => {

    window.fetch.and.callFake((url) =>
      simularPeticion(url, [], juegosPrueba)
    )

    render(<Torneos />)

    expect(
      await screen.findByText(
        'No hay torneos registrados en el servidor.'
      )
    ).not.toBeNull()

  })

  it('09. Muestra error si falla Tournament', async () => {

    window.fetch.and.callFake((url) => {

      if (url.endsWith('/tournaments')) {
        return Promise.reject(
          new Error('Servidor apagado')
        )
      }

      return simularPeticion(url)
    })

    render(<Torneos />)

    expect(
      await screen.findByText(
        'No se pudo conectar con el servidor.'
      )
    ).not.toBeNull()

  })

  it('10. Ejecuta la funcion Ver Detalle', () => {

    const funcionDetalle = jasmine.createSpy(
      'funcionDetalle'
    )

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

  it('11. El detalle obtiene el nombre del juego', async () => {

    render(
      <DetalleTorneoApi
        torneoId={1}
        onVolver={() => {}}
      />
    )

    expect(
      await screen.findByText('Torneo de Prueba EP3')
    ).not.toBeNull()

    expect(
      screen.getByText(/EA Sports FC 26/)
    ).not.toBeNull()

  })

  it('12. Muestra error si el torneo no existe', async () => {

    render(
      <DetalleTorneoApi
        torneoId={999}
        onVolver={() => {}}
      />
    )

    expect(
      await screen.findByText(
        'No se encontró el torneo.'
      )
    ).not.toBeNull()

  })

  it('13. Mantiene torneos visibles si Game falla', async () => {

    window.fetch.and.callFake((url) => {

      if (url.endsWith('/games')) {
        return Promise.reject(
          new Error('Game no disponible')
        )
      }

      return simularPeticion(url)
    })

    render(<Torneos />)

    await screen.findByText('Torneo de Prueba EP3')

    expect(
      screen.getByText('Juego: ID 1')
    ).not.toBeNull()

    expect(
      screen.getByText(
        /No se pudieron cargar los nombres de los juegos/
      )
    ).not.toBeNull()

  })

})
