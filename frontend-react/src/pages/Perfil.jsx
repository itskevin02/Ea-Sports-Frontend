
import { useState, useEffect } from 'react'

import validarPerfil from '../logica/validarPerfil'
import { torneosData } from '../data/torneos'

// Recuperar listas guardadas en el navegador
function cargarRegistros(clave) {
  try {
    const datos = localStorage.getItem(clave)

    if (datos) {
      const lista = JSON.parse(datos)

      if (Array.isArray(lista)) {
        return lista
      }
    }
  } catch {
    return []
  }

  return []
}

// Cargar los perfiles registrados
function cargarJugadores() {
  const datos = localStorage.getItem('esports_jugadores')

  if (datos !== null) {
    return cargarRegistros('esports_jugadores')
  }

  // Compatibilidad con el perfil de la EP1
  try {
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

  // Jugador que estamos consultando
  const perfilActual = jugadores.find(
    (jugador) => jugador.id === idSeleccionado
  )

  // Leer equipos e inscripciones actuales
  const equipos = cargarRegistros('esports_equipos')
  const inscripciones = cargarRegistros('esports_inscripciones_ep2')

  // Obtener los equipos a los que pertenece el jugador
  const equiposJugador = perfilActual
    ? equipos.filter((equipo) => {

        const esCapitan =
          String(equipo.capitanId) ===
          String(perfilActual.id)

        const esIntegrante =
          Array.isArray(equipo.integrantes) &&
          equipo.integrantes.some(
            (integrante) =>
              String(integrante.id) ===
              String(perfilActual.id)
          )

        return esCapitan || esIntegrante
      })
    : []

  // Obtener las inscripciones del jugador
  const historialTorneos = perfilActual
    ? inscripciones.filter((inscripcion) => {

        // Una inscripción individual
        const inscripcionIndividual =
          inscripcion.tipo === 'jugador' &&
          String(inscripcion.participanteId) ===
          String(perfilActual.id)

        // Una inscripción realizada mediante su equipo
        const inscripcionEquipo =
          inscripcion.tipo === 'equipo' &&
          equiposJugador.some(
            (equipo) =>
              String(equipo.id) ===
              String(inscripcion.participanteId)
          )

        const torneo = torneosData.find(
          (registro) =>
            Number(registro.id) ===
            Number(inscripcion.torneoId)
        )

        // Respetar la privacidad de torneos abiertos
        const inscripcionesCerradas =
          torneo &&
          (
            torneo.estado === 'Cerrado' ||
            torneo.estado === 'En curso' ||
            torneo.estado === 'Finalizado'
          )

        return (
          (inscripcionIndividual || inscripcionEquipo) &&
          inscripcionesCerradas
        )
      })
    : []

  // Consultar sanciones asociadas al perfil
  const sancionesJugador =
    perfilActual && Array.isArray(perfilActual.sanciones)
      ? perfilActual.sanciones
      : []

  // Guardar los perfiles
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

    const apodoExiste = jugadores.some(
      (jugador) =>
        jugador.apodo.toLowerCase() === apodo.toLowerCase() &&
        (modo === 'nuevo' || jugador.id !== idSeleccionado)
    )

    if (apodoExiste) {
      nuevosErrores.apodo = 'El apodo ya está registrado.'
    }

    const correoExiste = jugadores.some(
      (jugador) =>
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

      const jugadoresActualizados = jugadores.map(
        (jugador) =>
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

      <h2 className="mb-4">
        Perfil del jugador
      </h2>

      {/* SELECCIÓN DE PERFIL */}
      <div className="card mb-4">
        <div className="card-body">

          <h3 className="h5 mb-3">
            Perfiles registrados
          </h3>

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
                  <option value="">
                    No hay perfiles registrados
                  </option>
                )}

                {jugadores.map((jugador) => (
                  <option
                    key={jugador.id}
                    value={jugador.id}
                  >
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

        {/* FORMULARIO DE PERFIL */}
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

                    <label
                      htmlFor="apodo"
                      className="form-label"
                    >
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

                    <label
                      htmlFor="correo"
                      className="form-label"
                    >
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

        {/* DATOS DEL JUGADOR */}
        <div className="col-12 col-lg-6">
          <div className="card h-100">
            <div className="card-body">

              <h3 className="h5 mb-3">
                Datos del jugador
              </h3>

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

        {/* EQUIPOS DEL JUGADOR */}
        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-body">

              <h3 className="h5 mb-3">
                Equipos del jugador
              </h3>

              {equiposJugador.length === 0 ? (

                <p className="text-secondary mb-0">
                  Este jugador no pertenece a ningún
                  equipo registrado.
                </p>

              ) : (

                <ul className="mb-0">

                  {equiposJugador.map((equipo) => (
                    <li key={equipo.id}>
                      {equipo.nombre} — {equipo.juego}
                    </li>
                  ))}

                </ul>

              )}

            </div>
          </div>
        </div>

        {/* HISTORIAL DEL JUGADOR */}
        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-body">

              <h3 className="h5 mb-3">
                Historial de torneos
              </h3>

              {historialTorneos.length === 0 ? (

                <p className="text-secondary mb-0">
                  Todavía no hay participaciones visibles
                  en torneos con inscripciones cerradas.
                </p>

              ) : (

                <ul className="mb-0">

                  {historialTorneos.map((registro) => (
                    <li key={registro.id}>
                      {registro.torneo} — Inscripción registrada
                    </li>
                  ))}

                </ul>

              )}

            </div>
          </div>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-body">

              <h3 className="h5 mb-3">
                Estadísticas
              </h3>

              <p className="text-secondary mb-0">
                Todavía no existen resultados de partidas
                registrados para este jugador.
              </p>

            </div>
          </div>
        </div>

        {/* SANCIONES */}
        <div className="col-12 col-md-6">
          <div className="card h-100">
            <div className="card-body">

              <h3 className="h5 mb-3">
                Sanciones
              </h3>

              {sancionesJugador.length > 0 ? (

                <ul className="mb-0">

                  {sancionesJugador.map((sancion, indice) => (
                    <li key={indice}>
                      {sancion.estado} —{' '}
                      {sancion.descripcion || 'Sin descripción'}
                    </li>
                  ))}

                </ul>

              ) : perfilActual?.sancionActiva === true ? (

                <p className="text-danger mb-0">
                  Este jugador tiene una sanción activa.
                </p>

              ) : (

                <p className="text-secondary mb-0">
                  No hay sanciones registradas
                  para este jugador.
                </p>

              )}

            </div>
          </div>
        </div>

      </div>

      <p className="text-white-50 small mt-4">
        La información de equipos e inscripciones se obtiene
        de los registros guardados en este navegador.
        Las estadísticas deportivas se mostrarán
        cuando existan resultados registrados.
      </p>

    </div>
  )
}

export default Perfil
