import { solicitar } from './api'

export const resultadosService = {
  listar: () => solicitar('/results'),

  obtener: (id) => solicitar(`/results/${id}`),

  crear: (resultado) => solicitar('/results', {
    method: 'POST',
    body: JSON.stringify(resultado)
  }),

  actualizar: (id, resultado) => solicitar(`/results/${id}`, {
    method: 'PUT',
    body: JSON.stringify(resultado)
  })
}
