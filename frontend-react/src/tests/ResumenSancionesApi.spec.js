
import React from 'react'

import {
  render,
  screen,
  fireEvent,
  cleanup
} from '@testing-library/react'

import ResumenSancionesApi from '../components/ResumenSancionesApi'

const usuariosPrueba = [
  {
    id: 2,
    nombre: 'Usuario Prueba EP3',
    correo: 'usuarioep3@ejemplo.com',
    nickname: 'jugadorEP3Test',
    rol: 'USUARIO',
    estado: 'ACTIVO'
  }
]

let sancionesPrueba = []

function respuestaApi(datos, estado = 200) {
  return {
    ok: true,
    status: estado,
    json: () => Promise.resolve(datos)
  }
}

function simularPeticion(url, opciones = {}) {

  if (url.endsWith('/users')) {
    return Promise.resolve(
      respuestaApi(usuariosPrueba)
    )
  }

  if (
    url.endsWith('/sanctions') &&
    opciones.method === 'POST'
  ) {

    const datos = JSON.parse(opciones.body)

    const nuevaSancion = {
      id: sancionesPrueba.length + 1,
      ...datos
    }

    sancionesPrueba.push(nuevaSancion)

    return Promise.resolve(
      respuestaApi(nuevaSancion, 201)
    )
  }

  if (
    url.includes('/sanctions/') &&
    opciones.method === 'PUT'
  ) {

    const id = Number(url.split('/').pop())
    const datos = JSON.parse(opciones.body)

    sancionesPrueba = sancionesPrueba.map((sancion) =>
      sancion.id === id
        ? { id, ...datos }
        : sancion
    )

    const actualizada = sancionesPrueba.find(
      (sancion) => sancion.id === id
    )

    return Promise.resolve(
      respuestaApi(actualizada)
    )
  }

  if (url.endsWith('/sanctions')) {
    return Promise.resolve(
      respuestaApi([...sancionesPrueba])
    )
  }

  return Promise.reject(
    new Error('Ruta no simulada')
  )
}

describe('Pruebas de sanciones API EP3', () => {

  beforeEach(() => {

    sancionesPrueba = [
      {
        id: 1,
        usuarioId: 2,
        motivo: 'Conducta violenta',
        severidad: 'LEVE',
        estado: 'ACTIVA'
      }
    ]

    spyOn(window, 'fetch').and.callFake(
      (url, opciones) =>
        simularPeticion(url, opciones)
    )
  })

  afterEach(() => {
    cleanup()
  })

  it('01. Consulta las sanciones desde la API', async () => {

    render(<ResumenSancionesApi />)

    expect(
      await screen.findByText('Conducta violenta')
    ).not.toBeNull()

    expect(
      screen.getByText('ACTIVA')
    ).not.toBeNull()

    expect(
      screen.getByText('Sanciones registradas: 1')
    ).not.toBeNull()

  })

  it('02. Rechaza el formulario sin motivo', async () => {

    render(<ResumenSancionesApi />)

    await screen.findByRole('option', {
      name: 'jugadorEP3Test'
    })

    fireEvent.change(
      screen.getByLabelText('Usuario'),
      { target: { value: '2' } }
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Aplicar sanción'
      })
    )

    expect(
      await screen.findByText(
        'Debes completar todos los campos.'
      )
    ).not.toBeNull()

  })

  it('03. Registra una sancion mediante API', async () => {

    sancionesPrueba = []

    render(<ResumenSancionesApi />)

    await screen.findByRole('option', {
      name: 'jugadorEP3Test'
    })

    fireEvent.change(
      screen.getByLabelText('Usuario'),
      { target: { value: '2' } }
    )

    fireEvent.change(
      screen.getByLabelText('Motivo'),
      { target: { value: 'Motivo de prueba' } }
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Aplicar sanción'
      })
    )

    expect(
      await screen.findByText(
        'Sanción registrada correctamente.'
      )
    ).not.toBeNull()

    expect(
      screen.getByText('Motivo de prueba')
    ).not.toBeNull()

    expect(sancionesPrueba.length).toBe(1)
    expect(sancionesPrueba[0].estado).toBe('ACTIVA')

  })

  it('04. Impide repetir una sancion activa', async () => {

    render(<ResumenSancionesApi />)

    await screen.findByRole('option', {
      name: 'jugadorEP3Test'
    })

    fireEvent.change(
      screen.getByLabelText('Usuario'),
      { target: { value: '2' } }
    )

    fireEvent.change(
      screen.getByLabelText('Motivo'),
      { target: { value: 'Otra sanción' } }
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Aplicar sanción'
      })
    )

    expect(
      await screen.findByText(
        'Este usuario ya tiene una sanción activa.'
      )
    ).not.toBeNull()

    expect(sancionesPrueba.length).toBe(1)

  })

  it('05. Permite levantar una sancion activa', async () => {

    spyOn(window, 'confirm').and.returnValue(true)

    render(<ResumenSancionesApi />)

    await screen.findByText('Conducta violenta')

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Levantar sanción'
      })
    )

    expect(
      await screen.findByText(
        'La sanción fue levantada correctamente.'
      )
    ).not.toBeNull()

    expect(
      screen.getByText('LEVANTADA')
    ).not.toBeNull()

    expect(sancionesPrueba[0].estado).toBe('LEVANTADA')

  })

})
