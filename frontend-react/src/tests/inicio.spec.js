import React from 'react'

import {
  render,
  screen,
  fireEvent,
  cleanup
} from '@testing-library/react'

import { Inicio } from '../pages/Inicio'

// Torneo ficticio para las pruebas
const torneosPrueba = [
  {
    id: 1,
    nombre: 'Torneo de Prueba EP3',
    ubicacion: 'Online',
    cantidadEquipos: 8,
    estado: 'Abierto',
    juegoId: 1,
    plataforma: 'PC',
    fechaInicio: '2099-12-15',
    fechaCierre: '2099-12-10',
    descripcion: 'Torneo para pruebas de Inicio',
    imagen: ''
  }
]

// Videojuego ficticio
const juegosPrueba = [
  {
    id: 1,
    nombre: 'EA Sports FC 26'
  }
]

// Equipos ficticios
const equiposPrueba = [
  {
    id: 1,
    nombre: 'Equipo A'
  },
  {
    id: 2,
    nombre: 'Equipo B'
  }
]

// Inscripciones ficticias
const inscripcionesPrueba = [
  {
    id: 1,
    equipoId: 1,
    torneoId: 1,
    estado: 'ACTIVA'
  },
  {
    id: 2,
    equipoId: 2,
    torneoId: 1,
    estado: 'ACTIVA'
  },
  {
    id: 3,
    equipoId: 1,
    torneoId: 2,
    estado: 'ACTIVA'
  }
]

// Simular una respuesta correcta de la API
function respuestaApi(datos) {

  return {
    ok: true,
    status: 200,
    json: () => Promise.resolve(datos)
  }
}

// Simular las respuestas de los microservicios
function simularPeticion(url) {

  // Tournament
  if (url.endsWith('/tournaments')) {

    return Promise.resolve(
      respuestaApi(torneosPrueba)
    )
  }

  // Game
  if (url.endsWith('/games')) {

    return Promise.resolve(
      respuestaApi(juegosPrueba)
    )
  }

  // Team
  if (url.endsWith('/teams')) {

    return Promise.resolve(
      respuestaApi(equiposPrueba)
    )
  }

  // Registration
  if (url.endsWith('/registrations')) {

    return Promise.resolve(
      respuestaApi(inscripcionesPrueba)
    )
  }

  return Promise.reject(
    new Error('Ruta no simulada')
  )
}

describe('Pruebas de Inicio EP3', () => {

  beforeEach(() => {

    // Evitar peticiones reales al backend
    spyOn(window, 'fetch').and.callFake(
      (url) => simularPeticion(url)
    )

  })

  afterEach(() => {
    cleanup()
  })

  // PRUEBA 01
  it('01. Carga torneos y nombres de juegos desde la API', async () => {

    render(
      <Inicio
        onNavegar={() => {}}
        onVerDetalle={() => {}}
      />
    )

    // El torneo aparece en destacados y proximos cierres
    const torneos = await screen.findAllByText(
      'Torneo de Prueba EP3'
    )

    expect(torneos.length).toBe(2)

    // El juego aparece con su nombre real
    const juegos = screen.getAllByText(
      'EA Sports FC 26'
    )

    expect(juegos.length).toBe(2)

    expect(window.fetch).toHaveBeenCalled()

  })

  // PRUEBA 02
  it('02. Permite navegar y abrir el detalle del torneo', async () => {

    const navegar = jasmine.createSpy('navegar')
    const verDetalle = jasmine.createSpy('verDetalle')

    render(
      <Inicio
        onNavegar={navegar}
        onVerDetalle={verDetalle}
      />
    )

    await screen.findAllByText(
      'Torneo de Prueba EP3'
    )

    // Boton principal del catalogo
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Explorar torneos'
      })
    )

    expect(navegar).toHaveBeenCalledWith('torneos')

    // Abrir desde torneos destacados
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Ver detalles'
      })
    )

    expect(verDetalle).toHaveBeenCalledWith(
      jasmine.objectContaining({
        id: 1,
        juego: 'EA Sports FC 26'
      })
    )

    // Abrir desde proximos cierres
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Ver torneo'
      })
    )

    expect(verDetalle).toHaveBeenCalledTimes(2)

  })

  // PRUEBA 03
  it('03. Muestra un mensaje cuando no existen torneos', async () => {

    window.fetch.and.callFake((url) => {

      if (url.endsWith('/tournaments')) {

        return Promise.resolve(
          respuestaApi([])
        )
      }

      return simularPeticion(url)
    })

    render(
      <Inicio
        onNavegar={() => {}}
        onVerDetalle={() => {}}
      />
    )

    expect(
      await screen.findByText(
        /Actualmente no hay torneos abiertos dentro del plazo/
      )
    ).not.toBeNull()

    expect(
      screen.queryByText('Torneo de Prueba EP3')
    ).toBeNull()

  })

  // PRUEBA 04
  it('04. Mantiene los torneos visibles si Game falla', async () => {

    window.fetch.and.callFake((url) => {

      if (url.endsWith('/games')) {

        return Promise.reject(
          new Error('Game no disponible')
        )
      }

      return simularPeticion(url)
    })

    render(
      <Inicio
        onNavegar={() => {}}
        onVerDetalle={() => {}}
      />
    )

    const torneos = await screen.findAllByText(
      'Torneo de Prueba EP3'
    )

    expect(torneos.length).toBe(2)

    expect(
      screen.getByText(
        /No se pudieron cargar los nombres de los juegos/
      )
    ).not.toBeNull()

    expect(
      screen.getAllByText('Juego ID 1').length
    ).toBe(2)

  })

  // PRUEBA 05
  it('05. Muestra un error si Tournament no responde', async () => {

    window.fetch.and.callFake((url) => {

      if (url.endsWith('/tournaments')) {

        return Promise.reject(
          new Error('Tournament no disponible')
        )
      }

      return simularPeticion(url)
    })

    render(
      <Inicio
        onNavegar={() => {}}
        onVerDetalle={() => {}}
      />
    )

    expect(
      await screen.findByText(
        'No se pudo conectar con el servidor.'
      )
    ).not.toBeNull()

    expect(
      screen.queryByText('Torneo de Prueba EP3')
    ).toBeNull()

  })

  // PRUEBA 06
  it('06. Restringe el acceso a administracion por rol', () => {

    const navegar = jasmine.createSpy('navegar')

    const { rerender } = render(
      <Inicio
        onNavegar={navegar}
        onVerDetalle={() => {}}
        esAdmin={false}
      />
    )

    // Un usuario normal no ve el acceso
    expect(
      screen.queryByRole('button', {
        name: 'Panel de administración'
      })
    ).toBeNull()

    // El administrador si puede verlo
    rerender(
      <Inicio
        onNavegar={navegar}
        onVerDetalle={() => {}}
        esAdmin={true}
      />
    )

    const boton = screen.getByRole('button', {
      name: 'Panel de administración'
    })

    expect(boton).not.toBeNull()

    fireEvent.click(boton)

    expect(navegar).toHaveBeenCalledWith(
      'administracion'
    )

  })

  // PRUEBA 07
  it('07. Muestra equipos e inscripciones desde la API', async () => {

    render(
      <Inicio
        onNavegar={() => {}}
        onVerDetalle={() => {}}
      />
    )

    // Esperar a que se carguen los contadores
    expect(
      await screen.findByText('2')
    ).not.toBeNull()

    expect(
      await screen.findByText('3')
    ).not.toBeNull()

    // Verificar los nombres de las estadisticas
    expect(
      screen.getByText('Equipos registrados')
    ).not.toBeNull()

    expect(
      screen.getByText('Inscripciones registradas')
    ).not.toBeNull()

    // Verificar las consultas realizadas
    expect(window.fetch).toHaveBeenCalled()

  })

})
