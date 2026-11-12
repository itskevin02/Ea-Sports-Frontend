
const API_URL = import.meta.env.VITE_API_URL


export async function solicitar(ruta, opciones = {}) {

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...opciones
  })

  
  if (!respuesta.ok) {
    const cuerpo = await respuesta.json().catch(() => ({}))

    throw new Error(
      cuerpo.mensaje || `Error ${respuesta.status}`
    )
  }


  return respuesta.status === 204
    ? null
    : respuesta.json()
}
