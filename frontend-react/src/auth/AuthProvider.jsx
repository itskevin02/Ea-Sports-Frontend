
import { useState, useEffect } from 'react'

import { AuthContext } from './useAuth'
import { authService } from '../services/auth'

import {
  leerSesion,
  guardarSesion,
  borrarSesion,
  obtenerVencimiento
} from '../services/sesion'

function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion)

  async function login(credenciales) {
    const datos = await authService.login(credenciales)

    guardarSesion(datos)
    setSesion(datos)

    return datos.usuario
  }

  function logout() {
    borrarSesion()
    setSesion(null)
  }

  useEffect(() => {
    function alExpirar() {
      setSesion(null)
    }

    window.addEventListener('sesion-expirada', alExpirar)

    return () => {
      window.removeEventListener('sesion-expirada', alExpirar)
    }
  }, [])

  useEffect(() => {
    if (!sesion) {
      return
    }

    const tiempoRestante = Math.max(
      0,
      obtenerVencimiento(sesion) - Date.now()
    )

    const temporizador = setTimeout(() => {
      borrarSesion()
      setSesion(null)
    }, tiempoRestante)

    return () => clearTimeout(temporizador)
  }, [sesion])

  const valor = {
    usuario: sesion?.usuario ?? null,
    autenticado: sesion !== null,
    login,
    logout
  }

  return (
    <AuthContext value={valor}>
      {children}
    </AuthContext>
  )
}

export default AuthProvider
