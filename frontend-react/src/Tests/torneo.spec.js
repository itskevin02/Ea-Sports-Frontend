import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Navbar } from '../Components/Navbar'
import { TarjetaTorneo } from '../Components/TarjetaTorneo'
import { Torneos } from '../Pages/Torneos'

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

  it('01. Muestra correctamente la barra de navegacion', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    )
    const enlaceInicio = screen.getByRole('link', { name: 'EA Sports' })
    const enlaceTorneos = screen.getByRole('link', { name: 'Torneos' })
    expect(enlaceInicio.getAttribute('href')).toBe('/')
    expect(enlaceTorneos.getAttribute('href')).toBe('/torneos')
  })

  it('02. Muestra correctamente los datos del torneo', () => {
    render(<TarjetaTorneo torneo={torneoMock} />)
    expect(screen.getByText('Copa EA Sports FC 24')).not.toBeNull()
    expect(screen.getByText('Abierto')).not.toBeNull()
    expect(screen.getByText('Cupos: 20/32')).not.toBeNull()
  })

  it('03. Filtra los torneos segun la busqueda y el estado', () => {
    render(<Torneos />)
    const buscador = screen.getByPlaceholderText('Buscar por nombre o juego...')
    fireEvent.change(buscador, { target: { value: 'Madden' } })
    
    expect(screen.getByText('Liga Madden NFL Master')).not.toBeNull()
    expect(screen.queryByText('Copa EA Sports FC 24')).toBeNull()

    const selectorEstado = screen.getByRole('combobox')
    fireEvent.change(selectorEstado, { target: { value: 'Abierto' } })
    
    expect(screen.getByText('No se encontraron torneos con esos criterios.')).not.toBeNull()
  })

})