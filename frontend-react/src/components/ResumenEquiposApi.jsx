import { useEffect, useState } from 'react'

import { useAuth } from '../auth/useAuth'
import { equiposService } from '../services/equipos'
import { juegosService } from '../services/juegos'
import { inscripcionesService } from '../services/inscripciones'

const formularioVacio = {
  nombre: '',
  coach: '',
  juegoId: '',
  estado: 'ACTIVO'
}

function ResumenEquiposApi() {

  const { usuario } = useAuth()

  const esAdmin = usuario?.rol === 'ADMIN'
  const puedeCrear = Boolean(usuario?.authId)

  const [equipos, setEquipos] = useState([])
  const [juegos, setJuegos] = useState([])

  const [formulario, setFormulario] = useState({
    ...formularioVacio
  })

  const [editandoId, setEditandoId] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [eliminandoId, setEliminandoId] = useState(null)

  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  function esPropietario(equipo) {

    return (
      usuario?.authId != null &&
      equipo.authId != null &&
      Number(usuario.authId) === Number(equipo.authId)
    )
  }

  function puedeAdministrar(equipo) {
    return esAdmin || esPropietario(equipo)
  }

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

  function iniciarEdicion(equipo) {

    if (!puedeAdministrar(equipo)) {
      setError('No puedes editar un equipo ajeno.')
      return
    }

    setEditandoId(equipo.id)

    setFormulario({
      nombre: equipo.nombre,
      coach: equipo.coach,
      juegoId: String(equipo.juegoId),
      estado: equipo.estado
    })

    setError('')
    setMensaje('')
  }

  async function guardarEquipo(evento) {

    evento.preventDefault()

    if (!puedeCrear || guardando) {
      return
    }

    setError('')
    setMensaje('')

    const nombre = formulario.nombre.trim()
    const coach = formulario.coach.trim()
    const juegoId = Number(formulario.juegoId)

    if (!nombre || !coach || !formulario.juegoId) {
      setError('Debes completar todos los campos obligatorios.')
      return
    }

    const juegoExiste = juegos.some(
      (juego) => Number(juego.id) === juegoId
    )

    if (!juegoExiste) {
      setError('Selecciona un videojuego válido.')
      return
    }

    const repetido = equipos.some(
      (equipo) =>
        equipo.nombre.toLowerCase() === nombre.toLowerCase() &&
        Number(equipo.id) !== Number(editandoId)
    )

    if (repetido) {
      setError('Ya existe un equipo con ese nombre.')
      return
    }

    if (editandoId !== null) {

      const equipoActual = equipos.find(
        (equipo) => Number(equipo.id) === Number(editandoId)
      )

      if (!equipoActual || !puedeAdministrar(equipoActual)) {
        setError('No tienes permiso para editar este equipo.')
        return
      }
    }

    const datos = {
      nombre: nombre,
      coach: coach,
      juegoId: juegoId,
      estado: formulario.estado
    }

    try {
      setGuardando(true)

      if (editandoId === null) {

        await equiposService.crear(datos)
        setMensaje('Equipo creado correctamente.')

      } else {

        await equiposService.actualizar(editandoId, datos)
        setMensaje('Equipo actualizado correctamente.')
      }

      const actualizados = await equiposService.listar()
      setEquipos(actualizados)

      limpiarFormulario()

    } catch (err) {
      setError(err.message)

    } finally {
      setGuardando(false)
    }
  }

  async function eliminarEquipo(equipo) {

    if (!puedeAdministrar(equipo)) {
      setError('No puedes eliminar un equipo ajeno.')
      return
    }

    if (guardando || eliminandoId !== null) {
      return
    }

    const confirmar = window.confirm(
      `¿Deseas eliminar el equipo "${equipo.nombre}"?`
    )

    if (!confirmar) {
      return
    }

    setError('')
    setMensaje('')

    try {
      setEliminandoId(equipo.id)

      const inscripciones = await inscripcionesService.listar()

      const tieneInscripciones = inscripciones.some(
        (inscripcion) =>
          Number(inscripcion.equipoId) === Number(equipo.id)
      )

      if (tieneInscripciones) {
        setError(
          'Este equipo tiene inscripciones. ' +
          'Debes cancelarlas antes de eliminarlo.'
        )
        return
      }

      await equiposService.eliminar(equipo.id)

      const actualizados = await equiposService.listar()
      setEquipos(actualizados)

      if (Number(editandoId) === Number(equipo.id)) {
        limpiarFormulario()
      }

      setMensaje('Equipo eliminado correctamente.')

    } catch (err) {
      setError(err.message)

    } finally {
      setEliminandoId(null)
    }
  }

  function nombreJuego(juegoId) {

    const juego = juegos.find(
      (item) => Number(item.id) === Number(juegoId)
    )

    return juego ? juego.nombre : `Juego ID ${juegoId}`
  }

  return (
    <section className="card mb-4 shadow-sm">

      <div className="card-body p-4">

        <h3 className="h5 mb-3">
          Equipos registrados en el servidor
        </h3>

        <p className="text-secondary mb-4">
          Consulta los equipos disponibles. Cada jugador
          puede administrar solamente sus propios equipos.
        </p>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="alert alert-success" role="status">
            {mensaje}
          </div>
        )}

        {cargando && (
          <div className="alert alert-info">
            Cargando equipos...
          </div>
        )}

        {!cargando && (
          <>

            <div className="border rounded-3 p-3 mb-4">

              <p className="mb-1">
                Total de equipos registrados
              </p>

              <h4 className="mb-0">
                {equipos.length}
              </h4>

            </div>

            {puedeCrear && (

              <div className="border border-secondary rounded-3 p-4 mb-4 bg-body-tertiary formulario-ep3">

                <h4 className="h5 mb-3 text-dark">
                  {editandoId === null
                    ? 'Crear equipo con API (EP3)'
                    : `Editar equipo N° ${editandoId}`}
                </h4>

                <form onSubmit={guardarEquipo} noValidate>

                  <div className="row g-3 text-start">

                    <div className="col-12 col-md-4">

                      <label
                        htmlFor="nombreEquipoApi"
                        className="form-label text-dark"
                      >
                        Nombre del equipo
                      </label>

                      <input
                        id="nombreEquipoApi"
                        name="nombre"
                        className="form-control"
                        value={formulario.nombre}
                        onChange={cambiarCampo}
                        disabled={guardando}
                      />

                    </div>

                    <div className="col-12 col-md-4">

                      <label
                        htmlFor="coachEquipoApi"
                        className="form-label text-dark"
                      >
                        Coach
                      </label>

                      <input
                        id="coachEquipoApi"
                        name="coach"
                        className="form-control"
                        value={formulario.coach}
                        onChange={cambiarCampo}
                        disabled={guardando}
                      />

                    </div>

                    <div className="col-12 col-md-4">

                      <label
                        htmlFor="juegoEquipoApi"
                        className="form-label text-dark"
                      >
                        Videojuego
                      </label>

                      <select
                        id="juegoEquipoApi"
                        name="juegoId"
                        className="form-select"
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

                    </div>

                    {editandoId !== null && (

                      <div className="col-12 col-md-4">

                        <label
                          htmlFor="estadoEquipoApi"
                          className="form-label text-dark"
                        >
                          Estado del equipo
                        </label>

                        <select
                          id="estadoEquipoApi"
                          name="estado"
                          className="form-select"
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

                  <div className="d-flex justify-content-center gap-2 mt-4">

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={guardando || eliminandoId !== null}
                    >
                      {guardando
                        ? 'Guardando...'
                        : editandoId === null
                          ? 'Crear equipo en el servidor'
                          : 'Guardar cambios'}
                    </button>

                    {editandoId !== null && (

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={limpiarFormulario}
                        disabled={guardando}
                      >
                        Cancelar edición
                      </button>

                    )}

                  </div>

                </form>

              </div>

            )}

            {!puedeCrear && (
              <div className="alert alert-info">
                Inicia sesión para crear un equipo.
              </div>
            )}

            <h4 className="h5 mb-3">
              Listado de equipos del servidor
            </h4>

            {equipos.length === 0 ? (

              <div className="alert alert-info">
                No hay equipos registrados.
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
                      <th>Propiedad</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>

                    {equipos.map((equipo) => (

                      <tr key={equipo.id}>

                        <td>{equipo.id}</td>
                        <td>{equipo.nombre}</td>
                        <td>{equipo.coach}</td>
                        <td>{nombreJuego(equipo.juegoId)}</td>
                        <td>{equipo.estado}</td>

                        <td>
                          {esPropietario(equipo)
                            ? 'Mi equipo'
                            : equipo.authId == null
                              ? 'Sin propietario asignado'
                              : 'Otro jugador'}
                        </td>

                        <td>

                          {puedeAdministrar(equipo) ? (

                            <div className="d-flex flex-wrap gap-2">

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

                          ) : (
                            <span className="text-secondary">
                              Solo consulta
                            </span>
                          )}

                        </td>

                      </tr>

                    ))}

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
