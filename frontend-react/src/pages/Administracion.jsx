
import { useState, useEffect } from 'react'
import validarPerfil from '../logica/validarPerfil'
import registrarJugador from '../logica/registrarJugador'

import {
  actualizarJugador,
  eliminarJugador as eliminarJugadorDeLista
} from '../logica/gestionarJugadores'

import {
  cargarJugadores,
  guardarJugadores
} from '../logica/almacenamientoJugadores'

function Administracion() {
  const [jugadores, setJugadores] = useState(
    () => cargarJugadores(localStorage)
  )

  const [formulario, setFormulario] = useState({
    apodo: '',
    correo: ''
  })

  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')
  const [modo, setModo] = useState('nuevo')
  const [idEditando, setIdEditando] = useState(null)

  // Guardar los jugadores en el navegador
  useEffect(() => {
    guardarJugadores(jugadores, localStorage)
  }, [jugadores])

  function cambiarCampo(evento) {
    const { name, value } = evento.target

    setFormulario({
      ...formulario,
      [name]: value
    })

    setErrores({
      ...errores,
      [name]: ''
    })

    setMensaje('')
  }

  function limpiarFormulario() {
    setFormulario({
      apodo: '',
      correo: ''
    })

    setErrores({})
    setModo('nuevo')
    setIdEditando(null)
  }

  function guardarJugador(evento) {
    evento.preventDefault()

    const apodo = formulario.apodo.trim()
    const correo = formulario.correo.trim()

    // Registrar un nuevo jugador
    if (modo === 'nuevo') {
      const resultado = registrarJugador(
        jugadores,
        apodo,
        correo
      )

      setErrores(resultado.errores)

      if (Object.keys(resultado.errores).length > 0) {
        setMensaje('')
        return
      }

      setJugadores(resultado.jugadores)
      setMensaje('Jugador registrado correctamente.')
      limpiarFormulario()
      return
    }

    // Validar los datos antes de editar
    const nuevosErrores = validarPerfil(
      apodo,
      correo,
      '',
      '',
      false
    )

    const apodoRepetido = jugadores.some((jugador) =>
      jugador.apodo.toLowerCase() === apodo.toLowerCase() &&
      jugador.id !== idEditando
    )

    const correoRepetido = jugadores.some((jugador) =>
      jugador.correo.toLowerCase() === correo.toLowerCase() &&
      jugador.id !== idEditando
    )

    if (apodoRepetido) {
      nuevosErrores.apodo = 'Este apodo ya está registrado.'
    }

    if (correoRepetido) {
      nuevosErrores.correo = 'Este correo ya está registrado.'
    }

    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      setMensaje('')
      return
    }

    // Actualizar el jugador seleccionado
    const jugadoresActualizados = actualizarJugador(
      jugadores,
      idEditando,
      apodo,
      correo
    )

    setJugadores(jugadoresActualizados)
    setMensaje('Jugador actualizado correctamente.')
    limpiarFormulario()
  }

  function editarJugador(jugador) {
    setFormulario({
      apodo: jugador.apodo,
      correo: jugador.correo
    })

    setModo('editar')
    setIdEditando(jugador.id)
    setErrores({})
    setMensaje('')
  }

  function cancelarEdicion() {
    limpiarFormulario()
    setMensaje('')
  }

  function eliminarJugador(jugador) {
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar a ${jugador.apodo}?`
    )

    if (!confirmar) {
      return
    }

    // Eliminar solamente el jugador seleccionado
    const jugadoresActualizados = eliminarJugadorDeLista(
      jugadores,
      jugador.id
    )

    setJugadores(jugadoresActualizados)
    limpiarFormulario()
    setMensaje('Jugador eliminado correctamente.')
  }

  return (
    <div>
      <h2 className="mb-3">
        Panel de Administración
      </h2>

      <p className="text-white-50 mb-4">
        Gestiona los jugadores registrados en eSports Arena Manager.
      </p>

      <div className="card mb-4">
        <div className="card-body">
          <h3 className="h5 mb-4">
            {modo === 'editar'
              ? 'Editar jugador'
              : 'Registrar nuevo jugador'}
          </h3>

          <form onSubmit={guardarJugador} noValidate>
            <div className="row g-3">

              <div className="col-12 col-md-6">
                <label
                  htmlFor="adminApodo"
                  className="form-label"
                >
                  Apodo
                </label>

                <input
                  type="text"
                  id="adminApodo"
                  name="apodo"
                  className="form-control"
                  value={formulario.apodo}
                  onChange={cambiarCampo}
                />

                <small className="text-secondary">
                  Mínimo 3 caracteres y sin espacios.
                </small>

                {errores.apodo && (
                  <p className="text-danger mt-1">
                    {errores.apodo}
                  </p>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label
                  htmlFor="adminCorreo"
                  className="form-label"
                >
                  Correo electrónico
                </label>

                <input
                  type="email"
                  id="adminCorreo"
                  name="correo"
                  className="form-control"
                  value={formulario.correo}
                  onChange={cambiarCampo}
                />

                {errores.correo && (
                  <p className="text-danger mt-1">
                    {errores.correo}
                  </p>
                )}
              </div>

            </div>

            <div className="d-flex flex-wrap gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-primary"
              >
                {modo === 'editar'
                  ? 'Guardar cambios'
                  : 'Registrar jugador'}
              </button>

              {modo === 'editar' && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelarEdicion}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>

          {mensaje && (
            <p className="text-success mt-3 mb-0">
              {mensaje}
            </p>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 className="h5 mb-3">
            Jugadores registrados
          </h3>

          <p className="text-secondary">
            Total de jugadores: {jugadores.length}
          </p>

          {jugadores.length === 0 ? (
            <p className="text-secondary">
              No existen jugadores registrados.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead>
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Apodo</th>
                    <th scope="col">Correo</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {jugadores.map((jugador) => (
                    <tr key={jugador.id}>
                      <td>{jugador.id}</td>
                      <td>{jugador.apodo}</td>
                      <td>{jugador.correo}</td>

                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="btn btn-warning btn-sm"
                            onClick={() => editarJugador(jugador)}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => eliminarJugador(jugador)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Administracion
