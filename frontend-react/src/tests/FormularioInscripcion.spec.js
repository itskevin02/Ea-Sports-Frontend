
import React from 'react'

import {
  render,
  screen,
  fireEvent,
  cleanup
} from '@testing-library/react'

import FormularioInscripcion from '../components/FormularioInscripcion'

afterEach(() => {
  cleanup()
})

describe('Pruebas de FormularioInscripcion', () => {

  it('bloquea equipos incompletos y ejecuta el envio cuando estan completos', () => {

    const manejarInscripcion = jasmine.createSpy(
      'manejarInscripcion'
    ).and.callFake((evento) => {
      evento.preventDefault()
    })

    const equipoIncompleto = {
      integrantes: [
        { id: 1, nombre: 'Jugador 1' }
      ]
    }

    const equipoCompleto = {
      integrantes: [
        { id: 1, nombre: 'Jugador 1' },
        { id: 2, nombre: 'Jugador 2' }
      ]
    }

    const { rerender } = render(
      <FormularioInscripcion
        tipo="equipo"
        equipoSeleccionado={equipoIncompleto}
        integrantesMinimos={2}
        onConfirmar={manejarInscripcion}
      >
        <p>Formulario de prueba</p>
      </FormularioInscripcion>
    )

    const boton = screen.getByRole('button', {
      name: 'Confirmar inscripción'
    })

    // El equipo incompleto no puede enviar
    expect(boton.disabled).toBe(true)

    fireEvent.click(boton)

    expect(manejarInscripcion).not.toHaveBeenCalled()

    // Actualizamos el componente con un equipo completo
    rerender(
      <FormularioInscripcion
        tipo="equipo"
        equipoSeleccionado={equipoCompleto}
        integrantesMinimos={2}
        onConfirmar={manejarInscripcion}
      >
        <p>Formulario de prueba</p>
      </FormularioInscripcion>
    )

    const botonHabilitado = screen.getByRole('button', {
      name: 'Confirmar inscripción'
    })

    expect(botonHabilitado.disabled).toBe(false)

    fireEvent.click(botonHabilitado)

    expect(manejarInscripcion).toHaveBeenCalledTimes(1)

  })

})
