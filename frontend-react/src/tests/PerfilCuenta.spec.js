
import React from 'react'

import {
  render,
  screen,
  cleanup
} from '@testing-library/react'

import { AuthContext } from '../auth/useAuth'
import Perfil from '../pages/Perfil'

function mostrarPerfil(usuario) {
  return render(
    <AuthContext.Provider
      value={{
        usuario: usuario,
        autenticado: true
      }}
    >
      <Perfil />
    </AuthContext.Provider>
  )
}

describe('Pruebas de Perfil EP3', () => {

  afterEach(() => {
    cleanup()
  })

  it('Muestra los datos del administrador', () => {

    mostrarPerfil({
      username: 'adminLocal',
      rol: 'ADMIN'
    })

    expect(
      screen.getByText('adminLocal')
    ).not.toBeNull()

    expect(
      screen.getByText('ADMIN')
    ).not.toBeNull()

    expect(
      screen.getByRole('button', {
        name: 'Mostrar perfiles anteriores'
      })
    ).not.toBeNull()

  })

  it('Oculta los perfiles antiguos al usuario normal', () => {

    mostrarPerfil({
      username: 'usuarioPrueba',
      rol: 'USUARIO'
    })

    expect(
      screen.getByText('usuarioPrueba')
    ).not.toBeNull()

    expect(
      screen.queryByRole('button', {
        name: 'Mostrar perfiles anteriores'
      })
    ).toBeNull()

  })

})
