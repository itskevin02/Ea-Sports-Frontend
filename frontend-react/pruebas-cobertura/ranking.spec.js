
import {
  ordenarRanking,
  calcularPuntos
} from '../src/logica/ranking.js'

describe('Cobertura del ranking', () => {

  it('Ordena los participantes por puntos', () => {
    const participantes = [
      { nombre: 'Equipo A', puntos: 3, diferencia: 1 },
      { nombre: 'Equipo B', puntos: 9, diferencia: 2 }
    ]

    const resultado = ordenarRanking(participantes)

    expect(resultado[0].nombre).toBe('Equipo B')
    expect(resultado[1].nombre).toBe('Equipo A')
  })

  it('Desempata utilizando la diferencia de puntos', () => {
    const participantes = [
      { nombre: 'Equipo A', puntos: 6, diferencia: 2 },
      { nombre: 'Equipo B', puntos: 6, diferencia: 5 }
    ]

    const resultado = ordenarRanking(participantes)

    expect(resultado[0].nombre).toBe('Equipo B')
  })

  it('Calcula los puntos de las victorias', () => {
    const resultados = [
      'victoria',
      'derrota',
      'victoria'
    ]

    expect(calcularPuntos(resultados)).toBe(6)
  })

  it('Permite utilizar puntos personalizados', () => {
    const resultados = [
      'victoria',
      'derrota'
    ]

    expect(calcularPuntos(resultados, 5, 1)).toBe(6)
  })

    it('No suma puntos por resultados distintos a victoria o derrota', () => {
    const resultados = [
        'empate',
        'victoria'
    ]

    const puntos = calcularPuntos(resultados)

    expect(puntos).toBe(3)
    })

})
