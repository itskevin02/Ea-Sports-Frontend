
import { solicitar } from './api'

// Servicio para comunicarse con la API de juegos
export const juegosService = {

  // Obtener todos los juegos
  listar: () => solicitar('/games'),

  // Obtener un juego por ID
  obtener: (id) => solicitar(`/games/${id}`),

  // Crear un nuevo juego
  crear: (juego) =>
    solicitar('/games', {
      method: 'POST',
      body: JSON.stringify(juego)
    }),

  // Actualizar un juego
  actualizar: (id, juego) =>
    solicitar(`/games/${id}`, {
      method: 'PUT',
      body: JSON.stringify(juego)
    }),

  // Eliminar un juego
  eliminar: (id) =>
    solicitar(`/games/${id}`, {
      method: 'DELETE'
    })
}
