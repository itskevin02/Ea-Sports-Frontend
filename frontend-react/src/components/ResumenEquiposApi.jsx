
import { useState, useEffect } from 'react'

import { equiposService } from '../services/equipos'
import { juegosService } from '../services/juegos'
import { inscripcionesService } from '../services/inscripciones'

function ResumenEquiposApi() {

  // Datos del servidor
  const [equipos, setEquipos] = useState([])
  const [juegos, setJuegos] = useState([])

  // Estados de carga
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Datos del formulario
  const [formulario, setFormulario] = useState({
    nombre: '',
    coach: '',
    juegoId: '',
    estado: 'ACTIVO'
  })

  // Estados para crear, editar y eliminar
  const [editandoId, setEditandoId] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [eliminandoId, setEliminandoId] = useState(null)

  // Mensajes
  const [mensaje, setMensaje] = useState('')
  const [errorFormulario, setErrorFormulario] = useState('')

  // Cargar los equipos y juegos desde Gateway
  useEffect(() => {

    async function cargarDatos() {

      try {
        setCargando(true)
        setError('')

        const datosEquipos = await equiposService.listar()
        const datosJuegos = await juegosService.listar()

        setEquipos(datosEquipos)
        setJuegos(datosJuegos)

      } catch (err) {
        setError(err.message)

      } finally {
        setCargando(false)
      }
    }

    cargarDatos()

  }, [])

  // Cambiar los campos del formulario
  function cambiarCampo(evento) {

    const { name, value } = evento.target

    setFormulario({
      ...formulario,
      [name]: value
    })

    setErrorFormulario('')
    setMensaje('')
  }

  // Limpiar el formulario
  function limpiarFormulario() {

    setFormulario({
      nombre: '',
      coach: '',
      juegoId: '',
      estado: 'ACTIVO'
    })

    setEditandoId(null)
  }

  // Seleccionar equipo para editar
  function iniciarEdicion(equipo) {

    setEditandoId(equipo.id)

    setFormulario({
      nombre: equipo.nombre,
      coach: equipo.coach,
      juegoId: String(equipo.juegoId),
      estado: equipo.estado
    })

    setErrorFormulario('')
    setMensaje('')
  }

  // Cancelar la edición
  function cancelarEdicion() {

    limpiarFormulario()
    setErrorFormulario('')
    setMensaje('')
  }

  // Crear o editar equipo
  async function guardarEquipo(evento) {

    evento.preventDefault()

    setErrorFormulario('')
    setMensaje('')

    const nombre = formulario.nombre.trim()
    const coach = formulario.coach.trim()

    // Validar nombre
    if (nombre === '') {
      setErrorFormulario(
        'El nombre del equipo es obligatorio.'
      )
      return
    }

    // Validar coach
    if (coach === '') {
      setErrorFormulario(
        'El coach del equipo es obligatorio.'
      )
      return
    }

    // Validar videojuego
    if (formulario.juegoId === '') {
      setErrorFormulario(
        'Debes seleccionar un videojuego.'
      )
      return
    }

    // Evitar nombres repetidos
    const nombreRepetido = equipos.some(
      (equipo) =>
        equipo.nombre.toLowerCase() === nombre.toLowerCase() &&
        Number(equipo.id) !== Number(editandoId)
    )

    if (nombreRepetido) {
      setErrorFormulario(
        'Ya existe un equipo con ese nombre.'
      )
      return
    }

    // Preparar los datos para Team
    const datosEquipo = {
      nombre: nombre,
      coach: coach,
      juegoId: Number(formulario.juegoId),
      estado: formulario.estado
    }

    try {
      setGuardando(true)

      if (editandoId !== null) {

        // Actualizar equipo
        await equiposService.actualizar(
          editandoId,
          datosEquipo
        )

        setMensaje(
          `Equipo "${nombre}" actualizado correctamente.`
        )

      } else {

        // Crear equipo
        await equiposService.crear(datosEquipo)

        setMensaje(
          `Equipo "${nombre}" creado correctamente en el servidor.`
        )
      }

      // Consultar nuevamente los equipos
      const datosActualizados = await equiposService.listar()

      setEquipos(datosActualizados)
      limpiarFormulario()

    } catch (err) {
      setErrorFormulario(err.message)

    } finally {
      setGuardando(false)
    }
  }

  // Eliminar equipo desde el servidor
  async function eliminarEquipo(equipo) {

    if (guardando || eliminandoId !== null) {
      return
    }

    const confirmar = window.confirm(
      `¿Deseas eliminar el equipo "${equipo.nombre}"?`
    )

    if (!confirmar) {
      return
    }

    setErrorFormulario('')
    setMensaje('')

    try {
      setEliminandoId(equipo.id)

      // Consultar inscripciones existentes
      const inscripciones = await inscripcionesService.listar()

      // Verificar si tiene inscripciones
      const tieneInscripciones = inscripciones.some(
        (inscripcion) =>
          Number(inscripcion.equipoId) === Number(equipo.id)
      )

      if (tieneInscripciones) {
        setErrorFormulario(
          'No puedes eliminar este equipo porque tiene ' +
          'inscripciones registradas. Primero debes cancelarlas.'
        )
        return
      }

      // Eliminar mediante Team
      await equiposService.eliminar(equipo.id)

      // Actualizar listado
      const datosActualizados = await equiposService.listar()

      setEquipos(datosActualizados)

      // Limpiar si era el equipo seleccionado
      if (Number(editandoId) === Number(equipo.id)) {
        limpiarFormulario()
      }

      setMensaje(
        `Equipo "${equipo.nombre}" eliminado correctamente.`
      )

    } catch (err) {
      setErrorFormulario(err.message)

    } finally {
      setEliminandoId(null)
    }
  }

  return (
    <section className="card mb-4 shadow-sm">

      <div className="card-body p-4">

        <h3 className="h5 mb-3">
          Equipos registrados en el servidor
        </h3>

        <p className="text-secondary mb-4">
          Información obtenida desde Team y Game mediante Gateway.
        </p>

        {/* ESTADO DE CARGA */}
        {cargando && (
          <div className="alert alert-info">
            Cargando equipos del servidor...
          </div>
        )}

        {/* ERROR DE CONEXION */}
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {!cargando && !error && (
          <>

            {/* CONTADOR */}
            <div className="border rounded-3 p-3 mb-4">

              <p className="mb-1">
                Total de equipos registrados
              </p>

              <h4 className="mb-0">
                {equipos.length}
              </h4>

            </div>

            {/* FORMULARIO */}
            <div className="border border-secondary rounded-3 p-4 mb-4 bg-body-tertiary">

              <h4 className="h5 mb-2 text-dark">
                {editandoId !== null
                  ? `Editar equipo N° ${editandoId}`
                  : 'Crear equipo con API (EP3)'}
              </h4>

              <p className="text-secondary mb-4">
                {editandoId !== null
                  ? 'Modifica los datos y guarda los cambios.'
                  : 'Completa los datos para registrar un equipo.'}
              </p>

              <form onSubmit={guardarEquipo} noValidate>

                <div className="row g-4 text-start">

                  {/* NOMBRE */}
                  <div className="col-12 col-md-4">

                    <label
                      htmlFor="nombreEquipoApi"
                      className="form-label fw-semibold d-block text-start text-dark"
                    >
                      Nombre del equipo
                    </label>

                    <input
                      type="text"
                      id="nombreEquipoApi"
                      name="nombre"
                      className="form-control form-control-lg bg-white border border-2 border-secondary text-dark"
                      placeholder="Ej.: Equipo Prueba EP3"
                      value={formulario.nombre}
                      onChange={cambiarCampo}
                      disabled={guardando}
                    />

                    <small className="text-secondary d-block mt-2 text-start">
                      Ingresa un nombre que no esté registrado.
                    </small>

                  </div>

                  {/* COACH */}
                  <div className="col-12 col-md-4">

                    <label
                      htmlFor="coachEquipoApi"
                      className="form-label fw-semibold d-block text-start text-dark"
                    >
                      Coach
                    </label>

                    <input
                      type="text"
                      id="coachEquipoApi"
                      name="coach"
                      className="form-control form-control-lg bg-white border border-2 border-secondary text-dark"
                      placeholder="Ej.: Coach Principal"
                      value={formulario.coach}
                      onChange={cambiarCampo}
                      disabled={guardando}
                    />

                    <small className="text-secondary d-block mt-2 text-start">
                      Escribe el nombre del entrenador.
                    </small>

                  </div>

                  {/* VIDEOJUEGO */}
                  <div className="col-12 col-md-4">

                    <label
                      htmlFor="juegoEquipoApi"
                      className="form-label fw-semibold d-block text-start text-dark"
                    >
                      Videojuego
                    </label>

                    <select
                      id="juegoEquipoApi"
                      name="juegoId"
                      className="form-select form-select-lg bg-white border border-2 border-secondary text-dark"
                      value={formulario.juegoId}
                      onChange={cambiarCampo}
                      disabled={guardando}
                    >

                      <option value="">
                        Selecciona un videojuego
                      </option>

                      {juegos.map((juego) => (
                        <option key={juego.id} value={juego.id}>
                          {juego.nombre}
                        </option>
                      ))}

                    </select>

                    <small className="text-secondary d-block mt-2 text-start">
                      Selecciona un juego registrado en la API.
                    </small>

                  </div>

                  {/* ESTADO DEL EQUIPO */}
                  {editandoId !== null && (

                    <div className="col-12 col-md-4">

                      <label
                        htmlFor="estadoEquipoApi"
                        className="form-label fw-semibold d-block text-start text-dark"
                      >
                        Estado del equipo
                      </label>

                      <select
                        id="estadoEquipoApi"
                        name="estado"
                        className="form-select form-select-lg bg-white border border-2 border-secondary text-dark"
                        value={formulario.estado}
                        onChange={cambiarCampo}
                        disabled={guardando}
                      >
                        <option value="ACTIVO">ACTIVO</option>
                        <option value="INACTIVO">INACTIVO</option>
                      </select>

                    </div>

                  )}

                </div>

                {/* BOTONES */}
                <div className="d-flex justify-content-center gap-2 mt-4">

                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-2"
                    disabled={guardando || eliminandoId !== null}
                  >
                    {guardando
                      ? 'Guardando...'
                      : editandoId !== null
                        ? 'Guardar cambios'
                        : 'Crear equipo en el servidor'}
                  </button>

                  {editandoId !== null && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={cancelarEdicion}
                      disabled={guardando || eliminandoId !== null}
                    >
                      Cancelar edición
                    </button>
                  )}

                </div>

              </form>

            </div>

            {/* MENSAJES */}
            {errorFormulario && (
              <div className="alert alert-danger" role="alert">
                {errorFormulario}
              </div>
            )}

            {mensaje && (
              <div className="alert alert-success" role="status">
                {mensaje}
              </div>
            )}

            {/* LISTADO DE EQUIPOS */}
            <h4 className="h5 mb-3">
              Listado de equipos del servidor
            </h4>

            {equipos.length === 0 ? (

              <div className="alert alert-info">
                No hay equipos registrados en el servidor.
              </div>

            ) : (

              <div className="table-responsive">

                <table className="table table-dark table-striped align-middle">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Equipo</th>
                      <th>Coach</th>
                      <th>Juego</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>

                    {equipos.map((equipo) => {

                      const juego = juegos.find(
                        (item) =>
                          Number(item.id) === Number(equipo.juegoId)
                      )

                      return (
                        <tr key={equipo.id}>

                          <td>{equipo.id}</td>
                          <td>{equipo.nombre}</td>
                          <td>{equipo.coach}</td>

                          <td>
                            {juego
                              ? juego.nombre
                              : `Juego ID ${equipo.juegoId}`}
                          </td>

                          <td>{equipo.estado}</td>

                          <td>
                            <div className="d-flex justify-content-center gap-2">

                              <button
                                type="button"
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => iniciarEdicion(equipo)}
                                disabled={guardando || eliminandoId !== null}
                              >
                                Editar
                              </button>

                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => eliminarEquipo(equipo)}
                                disabled={guardando || eliminandoId !== null}
                              >
                                {eliminandoId === equipo.id
                                  ? 'Eliminando...'
                                  : 'Eliminar'}
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

          </>
        )}

      </div>

    </section>
  )
}

export default ResumenEquiposApi
