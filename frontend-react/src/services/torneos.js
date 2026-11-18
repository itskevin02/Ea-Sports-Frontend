
import { solicitar } from './api'

export const torneosService = {

  listar: () => solicitar('/tournaments'),

  obtener: (id) => solicitar(`/tournaments/${id}`)

}
