import { solicitar } from './api'

export const sancionesService = {

  listar: () => solicitar('/sanctions'),

  obtener: (id) => solicitar(`/sanctions/${id}`),

  crear: (sancion) =>
    solicitar('/sanctions', {
      method: 'POST',
      body: JSON.stringify(sancion)
    }),

  actualizar: (id, sancion) =>
    solicitar(`/sanctions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sancion)
    }),

  eliminar: (id) =>
    solicitar(`/sanctions/${id}`, {
      method: 'DELETE'
    })
}
