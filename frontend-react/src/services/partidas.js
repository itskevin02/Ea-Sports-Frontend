import { solicitar } from './api'

export const partidasService = {
  listar: () => solicitar('/matches'),

  obtener: (id) => solicitar(`/matches/${id}`),

  crear: (partida) => solicitar('/matches', {
    method: 'POST',
    body: JSON.stringify(partida)
  })
}
