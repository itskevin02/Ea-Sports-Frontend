
import { leerSesion, borrarSesion } from './sesion'

const API_URL = import.meta.env.VITE_API_URL

const MENSAJES = {
  400: 'Revisa los datos ingresados.',
  401: 'Debes iniciar sesión nuevamente.',
  403: 'No tienes permiso para esta acción.',
  404: 'No se encontró el recurso solicitado.',
  500: 'Ocurrió un problema en el servidor.'
}

export async function solicitar(ruta, opciones = {}) {

  const sesion = leerSesion()

  const headers = {
    'Content-Type': 'application/json',
    ...opciones.headers
  }

  if (sesion?.token && ruta !== '/auth/login') {
    headers.Authorization = `Bearer ${sesion.token}`
  }

  let respuesta

  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      ...opciones,
      headers
    })

  } catch (error) {

    if (error.name === 'AbortError') {
      throw error
    }

    throw new Error('No se pudo conectar con el servidor.')
  }

  if (
    respuesta.status === 401 &&
    sesion?.token &&
    ruta !== '/auth/login'
  ) {
    borrarSesion()
    window.dispatchEvent(new Event('sesion-expirada'))
  }

  if (!respuesta.ok) {

    const cuerpo = await respuesta.json().catch(() => ({}))

    const error = new Error(
      cuerpo.mensaje ||
      cuerpo.error ||
      MENSAJES[respuesta.status] ||
      `Error ${respuesta.status}`
    )

    error.status = respuesta.status

    throw error
  }

  return respuesta.status === 204
    ? null
    : respuesta.json()
}
