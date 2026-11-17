
import { useState } from 'react'
import { useAuth } from '../auth/useAuth'

function Login({ onLogin }) {
  const { login } = useAuth()

  const [form, setForm] = useState({
    username: '',
    password: ''
  })

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

  return (
    <div className="row justify-content-center py-5">
      <div className="col-12 col-sm-10 col-md-7 col-lg-5">

        <div className="card bg-dark text-white border-secondary">
          <div className="card-body p-4">

            <h2 className="h4 mb-4">
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

                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  value={form.password}
                  onChange={cambiar}
                  autoComplete="current-password"
                  required
                />
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

          </div>
        </div>

      </div>
    </div>
  )
}

export default Login
