
import { useState, useEffect } from 'react'
import validarPerfil from '../logica/validarPerfil'

const equiposJugador = [
  { id: 1, nombre: 'Equipo 1', juego: 'Counter-Strike 2' },
  { id: 2, nombre: 'Equipo 2', juego: 'VALORANT' }
]

const historialTorneos = [
  { id: 1, torneo: 'Torneo 1', resultado: 'Participación registrada' },
  { id: 2, torneo: 'Torneo 2', resultado: 'Participación registrada' }
]

const estadisticas = {
  victorias: 12,
  derrotas: 5
}

const sanciones = [
  { id: 1, estado: 'Cumplida', descripcion: 'Sanción 1' }
]

// Recupera los jugadores guardados en el navegador
function cargarJugadores() {
  try {
    const datos = localStorage.getItem('esports_jugadores')

    if (datos !== null) {
      const lista = JSON.parse(datos)
      return Array.isArray(lista) ? lista : []
    }

    // Recupera el perfil anterior si existe
    const perfilAnterior = localStorage.getItem('esports_perfil')

    if (perfilAnterior) {
      const perfil = JSON.parse(perfilAnterior)

      if (perfil && perfil.apodo && perfil.correo) {
        return [{
          id: 1,
          apodo: perfil.apodo,
          correo: perfil.correo
        }]
      }
    }
  } catch {
    return []
  }

  return []
}

function Perfil() {
  const [jugadores, setJugadores] = useState(cargarJugadores)

  const [idSeleccionado, setIdSeleccionado] = useState(
    jugadores.length > 0 ? jugadores[0].id : null
  )

  const [modo, setModo] = useState(
    jugadores.length > 0 ? 'ver' : 'nuevo'
  )

  const [formulario, setFormulario] = useState({
    apodo: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: ''
  })

  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')

  const perfilActual = jugadores.find(
    (jugador) => jugador.id === idSeleccionado
  )

  // Guarda la lista completa de jugadores
  useEffect(() => {
    localStorage.setItem(
      'esports_jugadores',
      JSON.stringify(jugadores)
    )
  }, [jugadores])

  function limpiarFormulario() {
    setFormulario({
      apodo: '',
      correo: '',
      contrasena: '',
      confirmarContrasena: ''
    })

    setErrores({})
    setMensaje('')
  }

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

  function nuevoPerfil() {
    limpiarFormulario()
    setModo('nuevo')
  }

  function seleccionarJugador(evento) {
    setIdSeleccionado(Number(evento.target.value))
    limpiarFormulario()
    setModo('ver')
  }

  function editarPerfil() {
    if (!perfilActual) return

    setFormulario({
      apodo: perfilActual.apodo,
      correo: perfilActual.correo,
      contrasena: '',
      confirmarContrasena: ''
    })

    setErrores({})
    setMensaje('')
    setModo('editar')
  }

  function cancelarEdicion() {
    limpiarFormulario()
    setModo(jugadores.length > 0 ? 'ver' : 'nuevo')
  }

  function guardarPerfil(evento) {
    evento.preventDefault()

    const apodo = formulario.apodo.trim()
    const correo = formulario.correo.trim()

    const nuevosErrores = validarPerfil(
      apodo,
      correo,
      formulario.contrasena,
      formulario.confirmarContrasena,
      modo === 'nuevo'
    )

    // Comprobar que el apodo no esté repetido
    const apodoExiste = jugadores.some((jugador) =>
      jugador.apodo.toLowerCase() === apodo.toLowerCase() &&
      (modo === 'nuevo' || jugador.id !== idSeleccionado)
    )

    if (apodoExiste) {
      nuevosErrores.apodo = 'El apodo ya está registrado.'
    }

    // Comprobar que el correo no esté repetido
    const correoExiste = jugadores.some((jugador) =>
      jugador.correo.toLowerCase() === correo.toLowerCase() &&
      (modo === 'nuevo' || jugador.id !== idSeleccionado)
    )

    if (correoExiste) {
      nuevosErrores.correo = 'El correo ya está registrado.'
    }

    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      setMensaje('')
      return
    }

    if (modo === 'nuevo') {
      const nuevoId = jugadores.length > 0
        ? Math.max(...jugadores.map((jugador) => jugador.id)) + 1
        : 1

      const nuevoJugador = {
        id: nuevoId,
        apodo,
        correo
      }

      setJugadores([...jugadores, nuevoJugador])
      setIdSeleccionado(nuevoId)
      setMensaje('Nuevo perfil registrado correctamente.')
    } else {
      const jugadoresActualizados = jugadores.map((jugador) =>
        jugador.id === idSeleccionado
          ? { ...jugador, apodo, correo }
          : jugador
      )

      setJugadores(jugadoresActualizados)
      setMensaje('Cambios guardados correctamente.')
    }

    setFormulario({
      apodo: '',
      correo: '',
      contrasena: '',
      confirmarContrasena: ''
    })

    setModo('ver')
  }

  return (
    <div>
      <h2 className="mb-4">Perfil del jugador</h2>

      <div className="card mb-4">
        <div className="card-body">
          <h3 className="h5 mb-3">Perfiles registrados</h3>

          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-8">
              <label
                htmlFor="seleccionarPerfil"
                className="form-label"
              >
                Seleccionar jugador
              </label>

              <select
                id="seleccionarPerfil"
                className="form-select"
                value={idSeleccionado ?? ''}
                onChange={seleccionarJugador}
                disabled={jugadores.length === 0}
              >
                {jugadores.length === 0 && (
                  <option value="">No hay perfiles registrados</option>
                )}

                {jugadores.map((jugador) => (
                  <option key={jugador.id} value={jugador.id}>
                    {jugador.apodo}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4">
              <button
                type="button"
                className="btn btn-success w-100"
                onClick={nuevoPerfil}
              >
                + Registrar nuevo perfil
              </button>
            </div>
          </div>

          <p className="text-secondary small mt-3 mb-0">
            Perfiles registrados: {jugadores.length}
          </p>
        </div>
      </div>

      <div className="row g-4">

        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="h5 mb-4">
                {modo === 'nuevo'
                  ? 'Registrar nuevo perfil'
                  : modo === 'editar'
                    ? 'Editar datos del perfil'
                    : 'Información del perfil'}
              </h3>

              {modo !== 'ver' ? (
                <form onSubmit={guardarPerfil} noValidate>

                  <div className="mb-3">
                    <label htmlFor="apodo" className="form-label">
                      Apodo
                    </label>

                    <input
                      type="text"
                      id="apodo"
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

                  <div className="mb-3">
                    <label htmlFor="correo" className="form-label">
                      Correo electrónico
                    </label>

                    <input
                      type="email"
                      id="correo"
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

                  {modo === 'nuevo' && (
                    <>
                      <div className="mb-3">
                        <label
                          htmlFor="contrasena"
                          className="form-label"
                        >
                          Contraseña
                        </label>

                        <input
                          type="password"
                          id="contrasena"
                          name="contrasena"
                          className="form-control"
                          value={formulario.contrasena}
                          onChange={cambiarCampo}
                        />

                        <small className="text-secondary">
                          Mínimo 6 caracteres.
                        </small>

                        {errores.contrasena && (
                          <p className="text-danger mt-1">
                            {errores.contrasena}
                          </p>
                        )}
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="confirmarContrasena"
                          className="form-label"
                        >
                          Confirmar contraseña
                        </label>

                        <input
                          type="password"
                          id="confirmarContrasena"
                          name="confirmarContrasena"
                          className="form-control"
                          value={formulario.confirmarContrasena}
                          onChange={cambiarCampo}
                        />

                        {errores.confirmarContrasena && (
                          <p className="text-danger mt-1">
                            {errores.confirmarContrasena}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  <div className="d-flex flex-wrap gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      {modo === 'nuevo'
                        ? 'Registrar perfil'
                        : 'Guardar cambios'}
                    </button>

                    {(modo === 'editar' ||
                      (modo === 'nuevo' && jugadores.length > 0)) && (
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
              ) : (
                <p className="text-secondary">
                  Selecciona un jugador para consultar sus datos
                  o presiona Editar datos para modificarlos.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="h5 mb-3">Datos del jugador</h3>

              {perfilActual ? (
                <>
                  <p>
                    <strong>ID:</strong> {perfilActual.id}
                  </p>

                  <p>
                    <strong>Apodo:</strong> {perfilActual.apodo}
                  </p>

                  <p>
                    <strong>Correo:</strong> {perfilActual.correo}
                  </p>

                  {modo === 'ver' && (
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={editarPerfil}
                    >
                      Editar datos
                    </button>
                  )}
                </>
              ) : (
                <p className="text-secondary">
                  Todavía no se han registrado perfiles.
                </p>
              )}

              {mensaje && (
                <p className="text-success mt-3">
                  {mensaje}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="h5">Equipos del jugador</h3>

              <ul className="mb-0">
                {equiposJugador.map((equipo) => (
                  <li key={equipo.id}>
                    {equipo.nombre} - {equipo.juego}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="h5">Historial de torneos</h3>

              <ul className="mb-0">
                {historialTorneos.map((registro) => (
                  <li key={registro.id}>
                    {registro.torneo}: {registro.resultado}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="h5">Estadísticas</h3>

              <p>Victorias: {estadisticas.victorias}</p>

              <p className="mb-0">
                Derrotas: {estadisticas.derrotas}
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h3 className="h5">Sanciones</h3>

              <ul className="mb-0">
                {sanciones.map((sancion) => (
                  <li key={sancion.id}>
                    {sancion.estado}: {sancion.descripcion}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>

      <p className="text-white-50 small mt-4">
        Los equipos, historial, estadísticas y sanciones
        todavía son datos de demostración de la EP1.
        Los vincularemos a cada jugador cuando integremos
        los módulos del equipo.
      </p>
    </div>
  )
}

export default Perfil
