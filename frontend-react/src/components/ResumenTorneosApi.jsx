
import { useState, useEffect } from 'react'

import { torneosService } from '../services/torneos'
import { juegosService } from '../services/juegos'

const formularioVacio = {
  nombre: '',
  modalidad: 'Online',
  lugar: '',
  juegoId: '',
  plataforma: '',
  cantidadEquipos: '',
  fechaCierre: '',
  fechaInicio: '',
  descripcion: '',
  imagen: ''
}

const plataformas = [
  'PC',
  'PlayStation 5',
  'Xbox Series X/S',
  'Nintendo Switch',
  'Multiplataforma'
]

function obtenerModalidad(ubicacion) {

  if (ubicacion === 'Online') {
    return {
      modalidad: 'Online',
      lugar: ''
    }
  }

  if (ubicacion?.startsWith('Presencial - ')) {
    return {
      modalidad: 'Presencial',
      lugar: ubicacion.replace('Presencial - ', '')
    }
  }

  return {
    modalidad: 'Presencial',
    lugar: ubicacion === 'Presencial' ? '' : (ubicacion || '')
  }
}

function ResumenTorneosApi() {

  const [torneos, setTorneos] = useState([])
  const [juegos, setJuegos] = useState([])

  const [formulario, setFormulario] = useState({
    ...formularioVacio
  })

  const [editandoId, setEditandoId] = useState(null)

  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [cerrandoId, setCerrandoId] = useState(null)

  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  async function cargarDatos() {

    try {
      setCargando(true)
      setError('')

      const datosJuegos = await juegosService.listar()
      const datosTorneos = await torneosService.listar()

      setJuegos(datosJuegos)
      setTorneos(datosTorneos)

    } catch (err) {
      setError(err.message)

    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  function cambiarCampo(evento) {

    const { name, value } = evento.target

    setFormulario({
      ...formulario,
      [name]: value
    })

    setError('')
    setMensaje('')
  }

  function limpiarFormulario() {
    setFormulario({ ...formularioVacio })
    setEditandoId(null)
  }

  function iniciarEdicion(torneo) {

    const ubicacion = obtenerModalidad(torneo.ubicacion)

    setEditandoId(torneo.id)

    setFormulario({
      nombre: torneo.nombre,
      modalidad: ubicacion.modalidad,
      lugar: ubicacion.lugar,
      juegoId: String(torneo.juegoId),
      plataforma: torneo.plataforma,
      cantidadEquipos: String(torneo.cantidadEquipos),
      fechaCierre: torneo.fechaCierre,
      fechaInicio: torneo.fechaInicio,
      descripcion: torneo.descripcion,
      imagen: torneo.imagen || ''
    })

    setError('')
    setMensaje('')
  }

  function cancelarEdicion() {
    limpiarFormulario()
    setError('')
    setMensaje('')
  }

  function nombreJuego(id) {

    const juego = juegos.find(
      (item) => Number(item.id) === Number(id)
    )

    return juego ? juego.nombre : `Juego ID ${id}`
  }

  async function guardarTorneo(evento) {

    evento.preventDefault()

    if (guardando || cargando || cerrandoId !== null) {
      return
    }

    setError('')
    setMensaje('')

    const nombre = formulario.nombre.trim()
    const lugar = formulario.lugar.trim()
    const descripcion = formulario.descripcion.trim()
    const equipos = Number(formulario.cantidadEquipos)

    if (
      !nombre ||
      !formulario.juegoId ||
      !formulario.plataforma ||
      !formulario.cantidadEquipos ||
      !formulario.fechaCierre ||
      !formulario.fechaInicio ||
      !descripcion
    ) {
      setError('Debes completar todos los campos obligatorios.')
      return
    }

    if (formulario.modalidad === 'Presencial' && !lugar) {
      setError('Debes indicar el lugar del torneo presencial.')
      return
    }

    if (!Number.isInteger(equipos) || equipos <= 0) {
      setError('La cantidad de equipos debe ser un entero mayor a cero.')
      return
    }

    if (formulario.fechaInicio <= formulario.fechaCierre) {
      setError(
        'La fecha de inicio debe ser posterior al cierre de inscripción.'
      )
      return
    }

    const juegoExiste = juegos.some(
      (juego) => Number(juego.id) === Number(formulario.juegoId)
    )

    if (!juegoExiste) {
      setError('Selecciona un videojuego registrado.')
      return
    }

    const nombreRepetido = torneos.some(
      (torneo) =>
        torneo.nombre.toLowerCase() === nombre.toLowerCase() &&
        Number(torneo.id) !== Number(editandoId)
    )

    if (nombreRepetido) {
      setError('Ya existe un torneo con ese nombre.')
      return
    }

    const torneoActual = torneos.find(
      (torneo) => Number(torneo.id) === Number(editandoId)
    )

    if (editandoId !== null && !torneoActual) {
      setError('No se encontró el torneo que deseas modificar.')
      return
    }

    if (
      torneoActual &&
      ['en curso', 'finalizado'].includes(
        torneoActual.estado.toLowerCase()
      )
    ) {
      setError('No se pueden editar torneos en curso o finalizados.')
      return
    }

    const ubicacion = formulario.modalidad === 'Online'
      ? 'Online'
      : `Presencial - ${lugar}`

    const datos = {
      nombre: nombre,
      ubicacion: ubicacion,
      juegoId: Number(formulario.juegoId),
      plataforma: formulario.plataforma,
      cantidadEquipos: equipos,
      fechaCierre: formulario.fechaCierre,
      fechaInicio: formulario.fechaInicio,
      descripcion: descripcion,
      imagen: formulario.imagen.trim(),
      estado: torneoActual ? torneoActual.estado : 'Abierto'
    }

    try {
      setGuardando(true)

      if (editandoId === null) {
        await torneosService.crear(datos)
        setMensaje('Torneo creado correctamente.')

      } else {
        await torneosService.actualizar(editandoId, datos)
        setMensaje('Torneo actualizado correctamente.')
      }

      limpiarFormulario()
      await cargarDatos()

    } catch (err) {
      setError(err.message)

    } finally {
      setGuardando(false)
    }
  }

  async function cerrarTorneo(torneo) {

    if (guardando || cerrandoId !== null) {
      return
    }

    if (torneo.estado.toLowerCase() !== 'abierto') {
      return
    }

    const confirmar = window.confirm(
      `¿Deseas cerrar el torneo "${torneo.nombre}"?`
    )

    if (!confirmar) {
      return
    }

    setError('')
    setMensaje('')

    try {
      setCerrandoId(torneo.id)

      await torneosService.actualizar(torneo.id, {
        ...torneo,
        estado: 'Cerrado'
      })

      await cargarDatos()
      limpiarFormulario()

      setMensaje('Torneo cerrado correctamente.')

    } catch (err) {
      setError(err.message)

    } finally {
      setCerrandoId(null)
    }
  }

  return (
    <section className="card bg-dark text-white border-secondary mb-4">

      <div className="card-body p-4">

        <h3 className="h4 mb-3">
          Gestión de torneos
        </h3>

        <p className="text-white-50 mb-4">
          Crea y administra los torneos disponibles
          para los jugadores y visitantes.
        </p>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="alert alert-success">
            {mensaje}
          </div>
        )}

        {cargando && (
          <div className="alert alert-info">
            Cargando información...
          </div>
        )}

        <div className="border border-secondary rounded-3 p-3 mb-4">

          <h4 className="h5 mb-3">
            {editandoId === null
              ? 'Crear nuevo torneo'
              : `Editar torneo N° ${editandoId}`}
          </h4>

          <form onSubmit={guardarTorneo} noValidate>

            <div className="row g-3">

              {/* NOMBRE */}
              <div className="col-12 col-md-6">
                <label htmlFor="nombreTorneo" className="form-label">
                  Nombre del torneo
                </label>

                <input
                  id="nombreTorneo"
                  name="nombre"
                  className="form-control"
                  placeholder="Ej.: Copa eSports 2026"
                  value={formulario.nombre}
                  onChange={cambiarCampo}
                />
              </div>

              {/* JUEGO */}
              <div className="col-12 col-md-6">
                <label htmlFor="juegoTorneo" className="form-label">
                  Videojuego
                </label>

                <select
                  id="juegoTorneo"
                  name="juegoId"
                  className="form-select"
                  value={formulario.juegoId}
                  onChange={cambiarCampo}
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
              </div>

              {/* MODALIDAD */}
              <div className="col-12 col-md-6">
                <label htmlFor="modalidadTorneo" className="form-label">
                  Modalidad del torneo
                </label>

                <select
                  id="modalidadTorneo"
                  name="modalidad"
                  className="form-select"
                  value={formulario.modalidad}
                  onChange={cambiarCampo}
                >
                  <option value="Online">
                    Online
                  </option>
                  <option value="Presencial">
                    Presencial
                  </option>
                </select>
              </div>

              {/* LUGAR SOLO SI ES PRESENCIAL */}
              {formulario.modalidad === 'Presencial' && (
                <div className="col-12 col-md-6">
                  <label htmlFor="lugarTorneo" className="form-label">
                    Lugar del evento
                  </label>

                  <input
                    id="lugarTorneo"
                    name="lugar"
                    className="form-control"
                    placeholder="Ej.: Gimnasio Municipal de Valparaíso"
                    value={formulario.lugar}
                    onChange={cambiarCampo}
                  />
                </div>
              )}

              {/* PLATAFORMA */}
              <div className="col-12 col-md-6">
                <label htmlFor="plataformaTorneo" className="form-label">
                  Plataforma
                </label>

                <select
                  id="plataformaTorneo"
                  name="plataforma"
                  className="form-select"
                  value={formulario.plataforma}
                  onChange={cambiarCampo}
                >
                  <option value="">
                    Selecciona una plataforma
                  </option>

                  {formulario.plataforma &&
                    !plataformas.includes(formulario.plataforma) && (
                      <option value={formulario.plataforma}>
                        {formulario.plataforma}
                      </option>
                    )}

                  {plataformas.map((plataforma) => (
                    <option key={plataforma} value={plataforma}>
                      {plataforma}
                    </option>
                  ))}
                </select>
              </div>

              {/* CANTIDAD DE EQUIPOS */}
              <div className="col-12 col-md-6">
                <label htmlFor="equiposTorneo" className="form-label">
                  Cantidad máxima de equipos
                </label>

                <input
                  id="equiposTorneo"
                  name="cantidadEquipos"
                  type="number"
                  min="1"
                  step="1"
                  className="form-control"
                  value={formulario.cantidadEquipos}
                  onChange={cambiarCampo}
                />
              </div>

              {/* FECHAS */}
              <div className="col-12 col-md-6">
                <label htmlFor="cierreTorneo" className="form-label">
                  Cierre de inscripción
                </label>

                <input
                  id="cierreTorneo"
                  name="fechaCierre"
                  type="date"
                  className="form-control"
                  value={formulario.fechaCierre}
                  onChange={cambiarCampo}
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="inicioTorneo" className="form-label">
                  Inicio del torneo
                </label>

                <input
                  id="inicioTorneo"
                  name="fechaInicio"
                  type="date"
                  className="form-control"
                  value={formulario.fechaInicio}
                  onChange={cambiarCampo}
                />
              </div>

              {/* DESCRIPCIÓN */}
              <div className="col-12">
                <label htmlFor="descripcionTorneo" className="form-label">
                  Descripción
                </label>

                <textarea
                  id="descripcionTorneo"
                  name="descripcion"
                  rows="3"
                  className="form-control"
                  placeholder="Describe el torneo y sus reglas generales"
                  value={formulario.descripcion}
                  onChange={cambiarCampo}
                />
              </div>

              {/* IMAGEN */}
              <div className="col-12">
                <label htmlFor="imagenTorneo" className="form-label">
                  URL de imagen (opcional)
                </label>

                <input
                  id="imagenTorneo"
                  name="imagen"
                  type="url"
                  className="form-control"
                  placeholder="https://ejemplo.com/torneo.jpg"
                  value={formulario.imagen}
                  onChange={cambiarCampo}
                />
              </div>

              <div className="col-12">
                <p className="text-white-50 small">
                  Los torneos nuevos comienzan en estado Abierto.
                  Puedes cerrarlos desde el listado.
                </p>
              </div>

              {/* BOTONES */}
              <div className="col-12 d-flex flex-wrap gap-2">

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={guardando || cargando || cerrandoId !== null}
                >
                  {guardando
                    ? 'Guardando...'
                    : editandoId === null
                      ? 'Crear torneo'
                      : 'Guardar cambios'}
                </button>

                {editandoId !== null && (
                  <button
                    type="button"
                    className="btn btn-outline-light"
                    onClick={cancelarEdicion}
                  >
                    Cancelar
                  </button>
                )}

              </div>

            </div>

          </form>

        </div>

        {/* TORNEOS REGISTRADOS */}
        <h4 className="h5 mb-3">
          Torneos registrados: {torneos.length}
        </h4>

        {!cargando && torneos.length === 0 && (
          <div className="alert alert-secondary">
            No hay torneos registrados.
          </div>
        )}

        {torneos.length > 0 && (
          <div className="table-responsive">

            <table className="table table-dark table-striped align-middle">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Torneo</th>
                  <th>Juego</th>
                  <th>Modalidad / Lugar</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {torneos.map((torneo) => {

                  const estado = torneo.estado.toLowerCase()

                  const bloqueado =
                    estado === 'en curso' ||
                    estado === 'finalizado'

                  return (
                    <tr key={torneo.id}>

                      <td>{torneo.id}</td>
                      <td>{torneo.nombre}</td>
                      <td>{nombreJuego(torneo.juegoId)}</td>
                      <td>{torneo.ubicacion}</td>
                      <td>{torneo.estado}</td>

                      <td>
                        <div className="d-flex flex-wrap gap-2">

                          <button
                            type="button"
                            className="btn btn-warning btn-sm"
                            onClick={() => iniciarEdicion(torneo)}
                            disabled={guardando || cerrandoId !== null || bloqueado}
                          >
                            Editar
                          </button>

                          {estado === 'abierto' && (
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={() => cerrarTorneo(torneo)}
                              disabled={guardando || cerrandoId !== null}
                            >
                              {cerrandoId === torneo.id
                                ? 'Cerrando...'
                                : 'Cerrar'}
                            </button>
                          )}

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

    </section>
  )
}

export default ResumenTorneosApi
