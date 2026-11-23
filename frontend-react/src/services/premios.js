import { solicitar } from './api'

export const premiosService = {

  listar: () => solicitar('/prizes'),

  obtener: (id) => solicitar(`/prizes/${id}`)
}
