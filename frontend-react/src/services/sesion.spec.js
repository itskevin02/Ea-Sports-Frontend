
import {
  leerSesion,
  guardarSesion,
  borrarSesion
} from './sesion'

function sesionDePrueba(exp) {
  const datos = btoa(JSON.stringify({ exp }))

  return {
    token: `e30.${datos}.firma`,
    usuario: {
      username: 'adminPrueba',
      rol: 'ADMIN'
    }
  }
}

describe('Sesión JWT', () => {

  beforeEach(() => {
    borrarSesion()
  })

  afterEach(() => {
    borrarSesion()
  })

  it('guarda y recupera una sesión válida', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600

    guardarSesion(sesionDePrueba(exp))

    expect(leerSesion().usuario.username).toBe('adminPrueba')
  })

  it('descarta una sesión vencida', () => {
    const exp = Math.floor(Date.now() / 1000) - 60

    localStorage.setItem(
      'esports_sesion_ep3',
      JSON.stringify(sesionDePrueba(exp))
    )

    expect(leerSesion()).toBeNull()
  })

  it('borra la sesión al cerrar', () => {
    const exp = Math.floor(Date.now() / 1000) + 3600

    guardarSesion(sesionDePrueba(exp))
    borrarSesion()

    expect(leerSesion()).toBeNull()
  })

  it('descarta datos inválidos', () => {
    localStorage.setItem('esports_sesion_ep3', 'invalido')

    expect(leerSesion()).toBeNull()
  })

})
