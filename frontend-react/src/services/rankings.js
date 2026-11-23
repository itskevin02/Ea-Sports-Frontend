import { solicitar } from './api'

export const rankingsService = {

  listar: () => solicitar('/rankings'),

  obtener: (id) => solicitar(`/rankings/${id}`)
}
