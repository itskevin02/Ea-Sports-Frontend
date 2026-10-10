
import {
  ordenarRanking,
  calcularPuntos
} from './ranking'

describe('Pruebas de Ranking', () => {

  it('ordena por puntos y desempata por diferencia de puntaje', () => {

    const participantes = [
      { nombre: 'Equipo A', puntos: 6, diferencia: 2 },
      { nombre: 'Equipo B', puntos: 9, diferencia: 3 },
      { nombre: 'Equipo C', puntos: 6, diferencia: 5 },
      { nombre: 'Equipo D', puntos: 3, diferencia: 1 }
    ]

    const resultado = ordenarRanking(participantes)

    expect(resultado[0].nombre).toBe('Equipo B')
    expect(resultado[1].nombre).toBe('Equipo C')
    expect(resultado[2].nombre).toBe('Equipo A')
    expect(resultado[3].nombre).toBe('Equipo D')

  })

  it('calcula los puntos por victorias y derrotas', () => {

    const resultados = [
      'victoria',
      'victoria',
      'derrota'
    ]

    const puntos = calcularPuntos(resultados, 3, 1)

    expect(puntos).toBe(7)

    const puntosSinDerrota = calcularPuntos(resultados, 3, 0)

    expect(puntosSinDerrota).toBe(6)

    const sinPartidas = calcularPuntos([], 3, 1)

    expect(sinPartidas).toBe(0)

  })

})
