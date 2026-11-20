
import { solicitar } from './api'

// Servicio para comunicarse con Registration
export const inscripcionesService = {

  // Listar inscripciones
  listar: () => solicitar('/registrations'),

  // Buscar inscripción por ID
  obtener: (id) => solicitar(`/registrations/${id}`),

  // Crear inscripción
  crear: (inscripcion) =>
    solicitar('/registrations', {
      method: 'POST',
      body: JSON.stringify(inscripcion)
    }),

  // Actualizar inscripción
  actualizar: (id, inscripcion) =>
    solicitar(`/registrations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(inscripcion)
    }),

  // Eliminar inscripción
  eliminar: (id) =>
    solicitar(`/registrations/${id}`, {
      method: 'DELETE'
    })
}
