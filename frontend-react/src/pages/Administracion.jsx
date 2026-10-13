
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

import { tieneSancionActiva } from '../logica/sanciones'

// Obtener la fecha actual
function obtenerFechaActual() {
  const fecha = new Date()

  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')

  return `${anio}-${mes}-${dia}`
}

function Administracion() {

  // Jugadores guardados en el navegador
  const [jugadores, setJugadores] = useState(
    () => cargarJugadores(localStorage)
  )

  // Formulario de jugadores
  const [formulario, setFormulario] = useState({
    apodo: '',
    correo: ''
  })

  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')
  const [modo, setModo] = useState('nuevo')
  const [idEditando, setIdEditando] = useState(null)

  // Formulario de sanciones
  const [idJugadorSancion, setIdJugadorSancion] = useState(null)
  const [motivoSancion, setMotivoSancion] = useState('')
  const [fechaFinSancion, setFechaFinSancion] = useState('')
  const [errorSancion, setErrorSancion] = useState('')
  const [mensajeSancion, setMensajeSancion] = useState('')

  // Jugador al que se desea aplicar una sanción
  const jugadorSeleccionado = jugadores.find(
    (jugador) => jugador.id === idJugadorSancion
  )

  // Guardar jugadores y sanciones en localStorage
  useEffect(() => {
    guardarJugadores(jugadores, localStorage)
  }, [jugadores])

  // Cambiar campos del formulario
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

  // Limpiar formulario de jugadores
  function limpiarFormulario() {
    setFormulario({
      apodo: '',
      correo: ''
    })

    setErrores({})
    setModo('nuevo')
    setIdEditando(null)
  }

  // Registrar o actualizar un jugador
  function guardarJugador(evento) {
    evento.preventDefault()

    const apodo = formulario.apodo.trim()
    const correo = formulario.correo.trim()

    // Registrar jugador
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
      limpiarFormulario()
      setMensaje('Jugador registrado correctamente.')
      return
    }

    // Validar datos al editar
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

    // Actualizar sin perder las sanciones
    const jugadoresActualizados = actualizarJugador(
      jugadores,
      idEditando,
      apodo,
      correo
    )

    setJugadores(jugadoresActualizados)
    limpiarFormulario()
    setMensaje('Jugador actualizado correctamente.')
  }

  // Editar jugador seleccionado
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

  // Eliminar un jugador
  function eliminarJugador(jugador) {

    // Evitar eliminar jugadores vinculados a equipos
    let equipos = []

    try {
      const datos = localStorage.getItem('esports_equipos')
      equipos = datos ? JSON.parse(datos) : []
    } catch {
      equipos = []
    }

    if (!Array.isArray(equipos)) {
      equipos = []
    }

    const perteneceAEquipo = equipos.some((equipo) => {

      const esCapitan =
        String(equipo.capitanId) === String(jugador.id)

      const esIntegrante =
        Array.isArray(equipo.integrantes) &&
        equipo.integrantes.some(
          (integrante) =>
            String(integrante.id) === String(jugador.id)
        )

      return esCapitan || esIntegrante
    })

    if (perteneceAEquipo) {
      setMensaje(
        'No puedes eliminar este jugador porque pertenece ' +
        'a un equipo. Primero debes retirarlo del equipo.'
      )
      return
    }

    // Evitar eliminar participantes con inscripciones
    let inscripciones = []

    try {
      const datos = localStorage.getItem(
        'esports_inscripciones_ep2'
      )

      inscripciones = datos ? JSON.parse(datos) : []
    } catch {
      inscripciones = []
    }

    if (!Array.isArray(inscripciones)) {
      inscripciones = []
    }

    const tieneInscripcion = inscripciones.some(
      (inscripcion) =>
        inscripcion.tipo === 'jugador' &&
        String(inscripcion.participanteId) === String(jugador.id)
    )

    if (tieneInscripcion) {
      setMensaje(
        'No puedes eliminar este jugador porque tiene ' +
        'inscripciones registradas.'
      )
      return
    }

    const confirmar = window.confirm(
      `¿Estás seguro de eliminar a ${jugador.apodo}?`
    )

    if (!confirmar) {
      return
    }

    const jugadoresActualizados = eliminarJugadorDeLista(
      jugadores,
      jugador.id
    )

    setJugadores(jugadoresActualizados)

    if (idJugadorSancion === jugador.id) {
      cancelarSancion()
    }

    limpiarFormulario()
    setMensaje('Jugador eliminado correctamente.')
  }

  // Seleccionar jugador para sancionar
  function abrirSancion(jugador) {
    setIdJugadorSancion(jugador.id)
    setMotivoSancion('')
    setFechaFinSancion('')
    setErrorSancion('')
    setMensajeSancion('')
  }

  // Cancelar formulario de sanción
  function cancelarSancion() {
    setIdJugadorSancion(null)
    setMotivoSancion('')
    setFechaFinSancion('')
    setErrorSancion('')
  }

  // Aplicar sanción
  function aplicarSancion(evento) {
    evento.preventDefault()

    setErrorSancion('')
    setMensajeSancion('')

    if (!jugadorSeleccionado) {
      setErrorSancion('Debes seleccionar un jugador.')
      return
    }

    if (
      tieneSancionActiva(
        jugadorSeleccionado,
        obtenerFechaActual()
      )
    ) {
      setErrorSancion(
        'Este jugador ya tiene una sanción vigente.'
      )
      return
    }

    if (motivoSancion.trim() === '') {
      setErrorSancion(
        'Debes ingresar el motivo de la sanción.'
      )
      return
    }

    if (fechaFinSancion === '') {
      setErrorSancion(
        'Debes seleccionar la fecha de término.'
      )
      return
    }

    if (fechaFinSancion < obtenerFechaActual()) {
      setErrorSancion(
        'La fecha de término no puede ser anterior a hoy.'
      )
      return
    }

    // Historial de sanciones anteriores
    const sancionesAnteriores =
      Array.isArray(jugadorSeleccionado.sanciones)
        ? jugadorSeleccionado.sanciones
        : []

    const nuevoId = sancionesAnteriores.length > 0
      ? Math.max(
          ...sancionesAnteriores.map(
            (sancion) => Number(sancion.id) || 0
          )
        ) + 1
      : 1

    // Nueva sanción
    const nuevaSancion = {
      id: nuevoId,
      estado: 'Vigente',
      descripcion: motivoSancion.trim(),
      fechaFin: fechaFinSancion
    }

    const jugadoresActualizados = jugadores.map((jugador) => {

      if (jugador.id === jugadorSeleccionado.id) {
        return {
          ...jugador,
          sancionActiva: false,
          sanciones: [
            ...sancionesAnteriores,
            nuevaSancion
          ]
        }
      }

      return jugador
    })

    setJugadores(jugadoresActualizados)

    setMensajeSancion(
      `Sanción aplicada correctamente a ${jugadorSeleccionado.apodo}.`
    )

    cancelarSancion()
  }

  // Levantar sanción y conservar historial
  function levantarSancion(jugador) {

    const confirmar = window.confirm(
      `¿Deseas levantar la sanción de ${jugador.apodo}?`
    )

    if (!confirmar) {
      return
    }

    const fechaActual = obtenerFechaActual()

    const jugadoresActualizados = jugadores.map((registro) => {

      if (registro.id !== jugador.id) {
        return registro
      }

      const sanciones = Array.isArray(registro.sanciones)
        ? registro.sanciones
        : []

      const sancionesActualizadas = sanciones.map((sancion) => {

        const estaVigente =
          sancion.estado === 'Vigente' &&
          fechaActual <= sancion.fechaFin

        return estaVigente
          ? { ...sancion, estado: 'Levantada' }
          : sancion
      })

      return {
        ...registro,
        sancionActiva: false,
        sanciones: sancionesActualizadas
      }
    })

    setJugadores(jugadoresActualizados)

    setMensajeSancion(
      `La sanción de ${jugador.apodo} fue levantada correctamente.`
    )

    cancelarSancion()
  }

  return (
    <div>

      <h2 className="mb-3">
        Panel de Administración
      </h2>

      <p className="text-white-50 mb-4">
        Gestiona los jugadores registrados y sus sanciones.
      </p>

      {/* REGISTRAR Y EDITAR JUGADORES */}
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
            <div className="alert alert-info mt-3 mb-0">
              {mensaje}
            </div>
          )}

        </div>
      </div>

      {/* LISTADO DE JUGADORES */}
      <div className="card mb-4">
        <div className="card-body">

          <h3 className="h5 mb-3">
            Jugadores registrados
          </h3>

          <p className="text-secondary">
            Total de jugadores: {jugadores.length}
          </p>

          {mensajeSancion && (
            <div className="alert alert-success">
              {mensajeSancion}
            </div>
          )}

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
                    <th scope="col">Sanción</th>
                    <th scope="col">Acciones</th>
                  </tr>
                </thead>

                <tbody>

                  {jugadores.map((jugador) => {

                    const sancionado = tieneSancionActiva(
                      jugador,
                      obtenerFechaActual()
                    )

                    return (
                      <tr key={jugador.id}>

                        <td>{jugador.id}</td>

                        <td>{jugador.apodo}</td>

                        <td>{jugador.correo}</td>

                        <td>

                          <span
                            className={`badge ${
                              sancionado
                                ? 'bg-danger'
                                : 'bg-success'
                            }`}
                          >
                            {sancionado
                              ? 'Sancionado'
                              : 'Sin sanción vigente'}
                          </span>

                        </td>

                        <td>

                          <div className="d-flex flex-wrap gap-2">

                            <button
                              type="button"
                              className="btn btn-warning btn-sm"
                              onClick={() => editarJugador(jugador)}
                            >
                              Editar
                            </button>

                            {sancionado ? (

                              <button
                                type="button"
                                className="btn btn-outline-success btn-sm"
                                onClick={() => levantarSancion(jugador)}
                              >
                                Levantar sanción
                              </button>

                            ) : (

                              <button
                                type="button"
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => abrirSancion(jugador)}
                              >
                                Sancionar
                              </button>

                            )}

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
                    )
                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>
      </div>

      {/* FORMULARIO PARA APLICAR SANCIONES */}
      {jugadorSeleccionado && (

        <div className="card mb-4" id="gestionSanciones">
          <div className="card-body">

            <h3 className="h5 mb-3">
              Aplicar sanción
            </h3>

            <p className="text-secondary">
              Jugador seleccionado:{' '}
              <strong>
                {jugadorSeleccionado.apodo}
              </strong>
            </p>

            <form onSubmit={aplicarSancion} noValidate>

              <div className="row g-3">

                <div className="col-12 col-md-6">

                  <label
                    htmlFor="motivoSancion"
                    className="form-label"
                  >
                    Motivo de la sanción
                  </label>

                  <input
                    type="text"
                    id="motivoSancion"
                    className="form-control"
                    placeholder="Ej: Conducta antideportiva"
                    value={motivoSancion}
                    onChange={(evento) => {
                      setMotivoSancion(evento.target.value)
                      setErrorSancion('')
                    }}
                  />

                </div>

                <div className="col-12 col-md-6">

                  <label
                    htmlFor="fechaFinSancion"
                    className="form-label"
                  >
                    Fecha de término
                  </label>

                  <input
                    type="date"
                    id="fechaFinSancion"
                    className="form-control"
                    min={obtenerFechaActual()}
                    value={fechaFinSancion}
                    onChange={(evento) => {
                      setFechaFinSancion(evento.target.value)
                      setErrorSancion('')
                    }}
                  />

                </div>

              </div>

              {errorSancion && (
                <div className="alert alert-danger mt-3">
                  {errorSancion}
                </div>
              )}

              <div className="d-flex flex-wrap gap-2 mt-4">

                <button
                  type="submit"
                  className="btn btn-danger"
                >
                  Aplicar sanción
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelarSancion}
                >
                  Cancelar
                </button>

              </div>

            </form>

          </div>
        </div>

      )}

    </div>
  )
}

export default Administracion
