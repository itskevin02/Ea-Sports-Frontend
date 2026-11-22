
import React from 'react'

import {
  render,
  screen,
  fireEvent,
  cleanup
} from '@testing-library/react'

import ResumenUsuariosApi from '../components/ResumenUsuariosApi'

let usuariosPrueba = []
let sancionesPrueba = []

function respuestaApi(datos, estado = 200) {
  return {
    ok: true,
    status: estado,
    json: () => Promise.resolve(datos)
  }
}

function simularPeticion(url, opciones = {}) {

  // Crear usuario
  if (
    url.endsWith('/users') &&
    opciones.method === 'POST'
  ) {
    const datos = JSON.parse(opciones.body)

    const nuevoUsuario = {
      id: usuariosPrueba.length + 1,
      ...datos
    }

    usuariosPrueba.push(nuevoUsuario)

    return Promise.resolve(
      respuestaApi(nuevoUsuario, 201)
    )
  }

  if (
    url.includes('/users/') &&
    opciones.method === 'PUT'
  ) {
    const id = Number(url.split('/').pop())
    const datos = JSON.parse(opciones.body)

    usuariosPrueba = usuariosPrueba.map((usuario) =>
      usuario.id === id
        ? { id, ...datos }
        : usuario
    )

    const actualizado = usuariosPrueba.find(
      (usuario) => usuario.id === id
    )

    return Promise.resolve(
      respuestaApi(actualizado)
    )
  }

  if (
    url.includes('/users/') &&
    opciones.method === 'DELETE'
  ) {
    const id = Number(url.split('/').pop())

    usuariosPrueba = usuariosPrueba.filter(
      (usuario) => usuario.id !== id
    )

    return Promise.resolve(
      respuestaApi(null, 204)
    )
  }

  if (url.endsWith('/users')) {
    return Promise.resolve(
      respuestaApi([...usuariosPrueba])
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

describe('Pruebas de usuarios API EP3', () => {

  beforeEach(() => {

    usuariosPrueba = [
      {
        id: 1,
        nombre: 'Usuario Inicial',
        correo: 'inicial@ejemplo.com',
        nickname: 'jugadorInicial',
        rol: 'USUARIO',
        estado: 'ACTIVO'
      }
    ]

    sancionesPrueba = []

    spyOn(window, 'fetch').and.callFake(
      (url, opciones) =>
        simularPeticion(url, opciones)
    )
  })

  afterEach(() => {
    cleanup()
  })

  it('01. Consulta usuarios desde la API', async () => {

    render(<ResumenUsuariosApi />)

    expect(
      await screen.findByText('Usuario Inicial')
    ).not.toBeNull()

    expect(
      screen.getByText('Usuarios registrados: 1')
    ).not.toBeNull()

  })

  it('02. Registra un usuario correctamente', async () => {

    render(<ResumenUsuariosApi />)

    await screen.findByText('Usuario Inicial')

    fireEvent.change(
      screen.getByLabelText('Nombre'),
      { target: { value: 'Usuario Nuevo' } }
    )

    fireEvent.change(
      screen.getByLabelText('Correo electrónico'),
      { target: { value: 'nuevo@ejemplo.com' } }
    )

    fireEvent.change(
      screen.getByLabelText('Nickname'),
      { target: { value: 'jugadorNuevo' } }
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Registrar usuario'
      })
    )

    expect(
      await screen.findByText('Usuario Nuevo')
    ).not.toBeNull()

    expect(usuariosPrueba.length).toBe(2)
    expect(usuariosPrueba[1].rol).toBe('USUARIO')
    expect(usuariosPrueba[1].estado).toBe('ACTIVO')

  })

  it('03. Rechaza los campos vacios', async () => {

    render(<ResumenUsuariosApi />)

    await screen.findByText('Usuario Inicial')

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Registrar usuario'
      })
    )

    expect(
      await screen.findByText(
        'Debes completar todos los campos.'
      )
    ).not.toBeNull()

    expect(usuariosPrueba.length).toBe(1)

  })

  it('04. Permite editar un usuario', async () => {

    render(<ResumenUsuariosApi />)

    await screen.findByText('Usuario Inicial')

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Editar'
      })
    )

    fireEvent.change(
      screen.getByLabelText('Nombre'),
      { target: { value: 'Usuario Editado' } }
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Guardar cambios'
      })
    )

    expect(
      await screen.findByText('Usuario Editado')
    ).not.toBeNull()

    expect(usuariosPrueba[0].id).toBe(1)
    expect(usuariosPrueba[0].rol).toBe('USUARIO')
    expect(usuariosPrueba[0].estado).toBe('ACTIVO')

  })

  it('05. Rechaza un nickname repetido', async () => {

    render(<ResumenUsuariosApi />)

    await screen.findByText('Usuario Inicial')

    fireEvent.change(
      screen.getByLabelText('Nombre'),
      { target: { value: 'Segundo Usuario' } }
    )

    fireEvent.change(
      screen.getByLabelText('Correo electrónico'),
      { target: { value: 'segundo@ejemplo.com' } }
    )

    fireEvent.change(
      screen.getByLabelText('Nickname'),
      { target: { value: 'jugadorInicial' } }
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Registrar usuario'
      })
    )

    expect(
      await screen.findByText(
        'Ya existe un usuario con ese nickname.'
      )
    ).not.toBeNull()

    expect(usuariosPrueba.length).toBe(1)

  })

  it('06. Permite eliminar un usuario sin sanciones', async () => {

    spyOn(window, 'confirm').and.returnValue(true)

    render(<ResumenUsuariosApi />)

    await screen.findByText('Usuario Inicial')

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Eliminar'
      })
    )

    expect(
      await screen.findByText(
        'Usuario "jugadorInicial" eliminado correctamente.'
      )
    ).not.toBeNull()

    expect(usuariosPrueba.length).toBe(0)

    expect(
      screen.queryByText('Usuario Inicial')
    ).toBeNull()

  })

  it('07. Impide eliminar un usuario con sanciones', async () => {

    sancionesPrueba = [
      {
        id: 1,
        usuarioId: 1,
        motivo: 'Conducta inapropiada',
        severidad: 'LEVE',
        estado: 'ACTIVA'
      }
    ]

    spyOn(window, 'confirm').and.returnValue(true)

    render(<ResumenUsuariosApi />)

    await screen.findByText('Usuario Inicial')

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Eliminar'
      })
    )

    expect(
      await screen.findByText(
        'No se puede eliminar este usuario porque tiene sanciones registradas.'
      )
    ).not.toBeNull()

    expect(usuariosPrueba.length).toBe(1)

  })

})
