
import { solicitar } from './api'

export const equiposService = {

  listar: () => solicitar('/teams'),

  obtener: (id) => solicitar(`/teams/${id}`),

  crear: (equipo) =>
    solicitar('/teams', {
      method: 'POST',
      body: JSON.stringify(equipo)
    }),

  actualizar: (id, equipo) =>
    solicitar(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(equipo)
    }),

  eliminar: (id) =>
    solicitar(`/teams/${id}`, {
      method: 'DELETE'
    })
}
