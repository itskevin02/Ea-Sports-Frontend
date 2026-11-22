
import React from 'react'

import {
  render,
  screen,
  cleanup
} from '@testing-library/react'

import { AuthContext } from '../auth/useAuth'
import Perfil from '../pages/Perfil'

describe('Pruebas de Mi Perfil API EP3', () => {

  let sesionAnterior

  beforeEach(() => {

    sesionAnterior = localStorage.getItem(
      'esports_sesion_ep3'
    )

    // Sesion de prueba con vencimiento futuro
    const datosToken = btoa(JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + 3600
    }))

    localStorage.setItem(
      'esports_sesion_ep3',
      JSON.stringify({
        token: `prueba.${datosToken}.firma`,
        usuario: {
          authId: 2,
          username: 'jugadorPrueba',
          rol: 'USUARIO'
        }
      })
    )

  })

  afterEach(() => {

    cleanup()

    if (sesionAnterior === null) {
      localStorage.removeItem('esports_sesion_ep3')
    } else {
      localStorage.setItem(
        'esports_sesion_ep3',
        sesionAnterior
      )
    }

  })

  function mostrarPerfil() {

    return render(
      <AuthContext.Provider
        value={{
          usuario: {
            authId: 2,
            username: 'jugadorPrueba',
            rol: 'USUARIO'
          },
          autenticado: true
        }}
      >
        <Perfil />
      </AuthContext.Provider>
    )
  }

  // PRUEBA 01
  it('Muestra el perfil vinculado desde User', async () => {

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          id: 1,
          authId: 2,
          nombre: 'Jugador Vinculado',
          correo: 'jugador@ejemplo.com',
          nickname: 'jugadorEP3',
          estado: 'ACTIVO'
        })
      })
    )

    mostrarPerfil()

    expect(
      await screen.findByText('Jugador Vinculado')
    ).not.toBeNull()

    expect(
      screen.getByText('jugadorEP3')
    ).not.toBeNull()

    expect(
      screen.getByText('jugador@ejemplo.com')
    ).not.toBeNull()

    expect(window.fetch).toHaveBeenCalled()
  })

  // PRUEBA 02
  it('Muestra un aviso si no encuentra el perfil', async () => {

    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({
          mensaje: 'El perfil no existe'
        })
      })
    )

    mostrarPerfil()

    expect(
      await screen.findByText(/No se pudo cargar el perfil/)
    ).not.toBeNull()

    expect(
      screen.getByText(/un administrador debe asociarlo/)
    ).not.toBeNull()

  })

})
