
import {
  obtenerIntegranteSancionado
} from '../logica/sanciones'

describe('Validación de sanciones en equipos', () => {

  const fechaActual = '2026-10-12'

  it('Bloquea un equipo con un integrante sancionado', () => {

    const equipo = {
      capitanId: 1,
      integrantes: [
        { id: 1 },
        { id: 2 }
      ]
    }

    const jugadores = [
      {
        id: 1,
        apodo: 'CapitanCL',
        sanciones: []
      },
      {
        id: 2,
        apodo: 'Shadow99',
        sanciones: [
          {
            estado: 'Vigente',
            fechaFin: '2026-12-31'
          }
        ]
      }
    ]

    const resultado = obtenerIntegranteSancionado(
      equipo,
      jugadores,
      fechaActual
    )

    expect(resultado.apodo).toBe('Shadow99')
  })

  it('Detecta sanciones del capitán', () => {

    const equipo = {
      capitanId: 10,
      integrantes: [
        { id: 20 }
      ]
    }

    const jugadores = [
      {
        id: 10,
        apodo: 'CapitanPro',
        sanciones: [
          {
            estado: 'Vigente',
            fechaFin: '2026-12-31'
          }
        ]
      },
      {
        id: 20,
        apodo: 'JugadorLibre',
        sanciones: []
      }
    ]

    const resultado = obtenerIntegranteSancionado(
      equipo,
      jugadores,
      fechaActual
    )

    expect(resultado.apodo).toBe('CapitanPro')
  })

  it('Permite equipos con sanciones vencidas', () => {

    const equipo = {
      capitanId: 1,
      integrantes: [
        { id: 1 },
        { id: 2 }
      ]
    }

    const jugadores = [
      {
        id: 1,
        apodo: 'CapitanCL',
        sanciones: []
      },
      {
        id: 2,
        apodo: 'Shadow99',
        sanciones: [
          {
            estado: 'Vigente',
            fechaFin: '2026-09-30'
          }
        ]
      }
    ]

    const resultado = obtenerIntegranteSancionado(
      equipo,
      jugadores,
      fechaActual
    )

    expect(resultado).toBeNull()
  })

})
