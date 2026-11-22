
import { useState } from 'react'

import { useAuth } from '../auth/useAuth'
import Registro from './Registro'

function Login({ onLogin }) {

  const { login } = useAuth()

  const [form, setForm] = useState({
    username: '',
    password: ''
  })

  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [mostrarRegistro, setMostrarRegistro] = useState(false)

  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  function cambiar(evento) {
    setForm({
      ...form,
      [evento.target.name]: evento.target.value
    })
  }

  async function entrar(evento) {
    evento.preventDefault()

    setError('')
    setEnviando(true)

    try {
      const usuario = await login(form)
      onLogin(usuario)

    } catch (err) {
      setError(err.message)

    } finally {
      setEnviando(false)
    }
  }

  if (mostrarRegistro) {
    return (
      <Registro
        onRegistro={onLogin}
        onVolver={() => setMostrarRegistro(false)}
      />
    )
  }

  return (
    <div className="row justify-content-center py-5">

      <div className="col-12 col-sm-10 col-md-7 col-lg-5">

        <div className="card bg-dark text-white border-secondary">

          <div className="card-body p-4">

            <h2 className="h4 text-center mb-4">
              Iniciar sesión
            </h2>

            <form onSubmit={entrar}>

              <div className="mb-3">

                <label htmlFor="username" className="form-label">
                  Usuario
                </label>

                <input
                  id="username"
                  name="username"
                  className="form-control"
                  value={form.username}
                  onChange={cambiar}
                  autoComplete="username"
                  required
                />

              </div>

              <div className="mb-3">

                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>

                <div className="input-group">

                  <input
                    id="password"
                    name="password"
                    type={mostrarPassword ? 'text' : 'password'}
                    className="form-control"
                    value={form.password}
                    onChange={cambiar}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="btn btn-outline-light"
                    onClick={() =>
                      setMostrarPassword(!mostrarPassword)
                    }
                    aria-pressed={mostrarPassword}
                    aria-label={
                      mostrarPassword
                        ? 'Ocultar contraseña'
                        : 'Mostrar contraseña'
                    }
                  >
                    {mostrarPassword ? 'Ocultar' : 'Mostrar'}
                  </button>

                </div>

              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={enviando}
              >
                {enviando ? 'Ingresando...' : 'Entrar'}
              </button>

            </form>

            <hr className="border-secondary my-4" />

            <p className="text-center text-white-50 mb-2">
              ¿Todavía no tienes una cuenta?
            </p>

            <button
              type="button"
              className="btn btn-outline-primary w-100"
              onClick={() => setMostrarRegistro(true)}
            >
              Registrarse como jugador
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Login
