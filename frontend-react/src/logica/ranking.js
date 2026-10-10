
function ordenarRanking(participantes) {
  const rankingOrdenado = participantes.slice()

  rankingOrdenado.sort((a, b) => {
    if (b.puntos !== a.puntos) {
      return b.puntos - a.puntos
    }

    return b.diferencia - a.diferencia
  })

  return rankingOrdenado
}

function calcularPuntos(resultados, puntosVictoria = 3, puntosDerrota = 0) {
  let puntos = 0

  for (const resultado of resultados) {
    if (resultado === 'victoria') {
      puntos += puntosVictoria
    } else if (resultado === 'derrota') {
      puntos += puntosDerrota
    }
  }

  return puntos
}

export {
  ordenarRanking,
  calcularPuntos
}
