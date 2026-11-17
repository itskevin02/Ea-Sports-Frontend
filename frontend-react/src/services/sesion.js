
const CLAVE = 'esports_sesion_ep3'

export function obtenerVencimiento(sesion) {
  try {
    const parte = sesion.token.split('.')[1]
    const base64 = parte.replace(/-/g, '+').replace(/_/g, '/')
    const datos = JSON.parse(atob(base64))

    return typeof datos.exp === 'number'
      ? datos.exp * 1000
      : 0

  } catch {
    return 0
  }
}

export function leerSesion() {
  try {
    const texto = localStorage.getItem(CLAVE)

    if (!texto) {
      return null
    }

    const sesion = JSON.parse(texto)

    if (!sesion?.token || !sesion?.usuario ||
        obtenerVencimiento(sesion) <= Date.now()) {
      borrarSesion()
      return null
    }

    return sesion

  } catch {
    borrarSesion()
    return null
  }
}

export function guardarSesion(sesion) {
  if (!sesion?.token || !sesion?.usuario ||
      obtenerVencimiento(sesion) <= Date.now()) {
    throw new Error('El servidor devolvió una sesión no válida.')
  }

  localStorage.setItem(CLAVE, JSON.stringify(sesion))
}

export function borrarSesion() {
  localStorage.removeItem(CLAVE)
}
