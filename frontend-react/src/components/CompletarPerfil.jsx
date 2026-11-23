
import { useState } from 'react'

import { usuariosService } from '../services/usuarios'

function CompletarPerfil({ onCompletado }) {

  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    nickname: ''
  })

  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState('')

  function cambiarCampo(evento) {
    setFormulario({
      ...formulario,
      [evento.target.name]: evento.target.value
    })

    setError('')
  }

  async function guardarPerfil(evento) {
    evento.preventDefault()

    if (guardando) {
      return
    }

    setError('')

    const nombre = formulario.nombre.trim()
    const correo = formulario.correo.trim()
    const nickname = formulario.nickname.trim()

    if (!nombre || !correo || !nickname) {
      setError('Debes completar todos los campos.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setError('Ingresa un correo electrónico válido.')
      return
    }

    if (
      nickname.length < 3 ||
      nickname.length > 30 ||
      /\s/.test(nickname)
    ) {
      setError(
        'El nickname debe tener entre 3 y 30 caracteres, sin espacios.'
      )
      return
    }

    try {
      setGuardando(true)

      const perfil = await usuariosService.registrarPerfil({
        nombre: nombre,
        correo: correo,
        nickname: nickname
      })

      onCompletado(perfil)

    } catch (err) {
      setError(err.message)

    } finally {
      setGuardando(false)
    }
  }

  return (
    <div>

      <div className="alert alert-info">
        Tu cuenta ya está creada. Completa tu perfil
        para utilizar eSports Arena Manager.
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={guardarPerfil} noValidate>

        <div className="mb-3">

          <label htmlFor="perfilNombreNuevo" className="form-label">
            Nombre
          </label>

          <input
            id="perfilNombreNuevo"
            name="nombre"
            className="form-control"
            value={formulario.nombre}
            onChange={cambiarCampo}
            placeholder="Ej.: Juan Pérez"
          />

        </div>

        <div className="mb-3">

          <label htmlFor="perfilCorreoNuevo" className="form-label">
            Correo electrónico
          </label>

          <input
            id="perfilCorreoNuevo"
            name="correo"
            type="email"
            className="form-control"
            value={formulario.correo}
            onChange={cambiarCampo}
            placeholder="Ej.: jugador@correo.com"
          />

        </div>

        <div className="mb-3">

          <label htmlFor="perfilNicknameNuevo" className="form-label">
            Nickname
          </label>

          <input
            id="perfilNicknameNuevo"
            name="nickname"
            className="form-control"
            value={formulario.nickname}
            onChange={cambiarCampo}
            placeholder="Ej.: jugadorPro"
          />

        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={guardando}
        >
          {guardando ? 'Guardando...' : 'Completar mi perfil'}
        </button>

      </form>

    </div>
  )
}

export default CompletarPerfil
