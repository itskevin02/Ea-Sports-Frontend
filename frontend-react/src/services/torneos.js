
import { solicitar } from './api'

export const torneosService = {

  listar: () => solicitar('/tournaments'),

  obtener: (id) => solicitar(`/tournaments/${id}`),

  crear: (torneo) => solicitar('/tournaments', {
    method: 'POST',
    body: JSON.stringify(torneo)
  }),

  actualizar: (id, torneo) =>
    solicitar(`/tournaments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(torneo)
    }),

  eliminar: (id) => solicitar(`/tournaments/${id}`, {
    method: 'DELETE'
  })

}
