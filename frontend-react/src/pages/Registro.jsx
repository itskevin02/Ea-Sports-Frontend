
import { useState } from 'react'

import { useAuth } from '../auth/useAuth'
import { authService } from '../services/auth'

function Registro({ onRegistro, onVolver }) {

  const { login } = useAuth()

  const [formulario, setFormulario] = useState({
    username: '',
    password: '',
    confirmarPassword: ''
  })

  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [cuentaCreada, setCuentaCreada] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  function cambiarCampo(evento) {
    setFormulario({
      ...formulario,
      [evento.target.name]: evento.target.value
    })

    setError('')
  }

  async function registrar(evento) {
    evento.preventDefault()

    if (guardando) {
      return
    }

    setError('')

    const username = formulario.username.trim()
    const password = formulario.password

    if (!/^[a-zA-Z0-9_]{4,30}$/.test(username)) {
      setError(
        'El usuario debe tener entre 4 y 30 caracteres. ' +
        'Solo se permiten letras, números y guion bajo.'
      )
      return
    }

    if (password.length < 8 || password.length > 72) {
      setError('La contraseña debe tener entre 8 y 72 caracteres.')
      return
    }

    if (password !== formulario.confirmarPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    try {
      setGuardando(true)

      if (!cuentaCreada) {
        await authService.registrar({
          username: username,
          password: password
        })

        setCuentaCreada(true)
      }

      const usuario = await login({
        username: username,
        password: password
      })

      onRegistro(usuario)

    } catch (err) {
      setError(err.message)

    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="row justify-content-center py-5">

      <div className="col-12 col-sm-10 col-md-7 col-lg-5">

        <div className="card bg-dark text-white border-secondary">

          <div className="card-body p-4">

            <h2 className="h4 text-center mb-3">
              Crear cuenta de jugador
            </h2>

            <p className="text-white-50 text-center mb-4">
              Regístrate para participar en eSports Arena Manager.
            </p>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {cuentaCreada && (
              <div className="alert alert-info">
                Tu cuenta fue creada. Si hubo un problema al
                iniciar sesión, puedes intentar nuevamente.
              </div>
            )}

            <form onSubmit={registrar} noValidate>

              <div className="mb-3">

                <label htmlFor="registroUsername" className="form-label">
                  Nombre de usuario
                </label>

                <input
                  id="registroUsername"
                  name="username"
                  className="form-control"
                  value={formulario.username}
                  onChange={cambiarCampo}
                  disabled={cuentaCreada || guardando}
                  placeholder="Ej.: jugador2026"
                  autoComplete="username"
                />

                <small className="text-white-50">
                  Entre 4 y 30 caracteres, sin espacios.
                </small>
              </div>

              <div className="mb-3">

                <label htmlFor="registroPassword" className="form-label">
                  Contraseña
                </label>

                <input
                  id="registroPassword"
                  name="password"
                  type={mostrarPassword ? 'text' : 'password'}
                  className="form-control"
                  value={formulario.password}
                  onChange={cambiarCampo}
                  autoComplete="new-password"
                />

                <small className="text-white-50">
                  Mínimo 8 caracteres.
                </small>
              </div>

              <div className="mb-3">

                <label htmlFor="registroConfirmar" className="form-label">
                  Confirmar contraseña
                </label>

                <input
                  id="registroConfirmar"
                  name="confirmarPassword"
                  type={mostrarPassword ? 'text' : 'password'}
                  className="form-control"
                  value={formulario.confirmarPassword}
                  onChange={cambiarCampo}
                  autoComplete="new-password"
                />
              </div>

              <div className="form-check mb-4">

                <input
                  id="mostrarRegistroPassword"
                  type="checkbox"
                  className="form-check-input"
                  checked={mostrarPassword}
                  onChange={(evento) =>
                    setMostrarPassword(evento.target.checked)
                  }
                />

                <label
                  htmlFor="mostrarRegistroPassword"
                  className="form-check-label"
                >
                  Mostrar contraseñas
                </label>

              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={guardando}
              >
                {guardando
                  ? 'Registrando...'
                  : cuentaCreada
                    ? 'Volver a intentar ingreso'
                    : 'Crear cuenta'}
              </button>

              <button
                type="button"
                className="btn btn-outline-light w-100 mt-3"
                onClick={onVolver}
                disabled={guardando}
              >
                Ya tengo una cuenta
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Registro
