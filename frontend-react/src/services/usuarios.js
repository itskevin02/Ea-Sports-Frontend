
import { solicitar } from './api'

export const usuariosService = {

  listar: () => solicitar('/users'),

  obtener: (id) => solicitar(`/users/${id}`),

  miPerfil: () => solicitar('/users/mi-perfil'),

  crear: (usuario) =>
    solicitar('/users', {
      method: 'POST',
      body: JSON.stringify(usuario)
    }),

  actualizar: (id, usuario) =>
    solicitar(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(usuario)
    }),

  eliminar: (id) =>
    solicitar(`/users/${id}`, {
      method: 'DELETE'
    })
}
