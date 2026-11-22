
import { useState, useEffect } from 'react'

import { usuariosService } from '../services/usuarios'
import { sancionesService } from '../services/sanciones'

function ResumenSancionesApi() {

  const [usuarios, setUsuarios] = useState([])
  const [sanciones, setSanciones] = useState([])

  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)

  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  const [formulario, setFormulario] = useState({
    usuarioId: '',
    motivo: '',
    severidad: 'LEVE'
  })

  async function cargarDatos() {

    try {
      setCargando(true)
      setError('')

      const datosUsuarios = await usuariosService.listar()
      const datosSanciones = await sancionesService.listar()

      setUsuarios(datosUsuarios)
      setSanciones(datosSanciones)

    } catch (err) {

      setError(
        'No se pudieron cargar los datos: ' + err.message
      )

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

  async function guardarSancion(evento) {

    evento.preventDefault()

    if (guardando || cargando) {
      return
    }

    setError('')
    setMensaje('')

    if (
      formulario.usuarioId === '' ||
      formulario.motivo.trim() === ''
    ) {
      setError('Debes completar todos los campos.')
      return
    }

    const usuarioId = Number(formulario.usuarioId)

    const usuarioExiste = usuarios.some(
      (usuario) => Number(usuario.id) === usuarioId
    )

    if (!usuarioExiste) {
      setError('Debes seleccionar un usuario válido.')
      return
    }

    const tieneSancionActiva = sanciones.some(
      (sancion) =>
        Number(sancion.usuarioId) === usuarioId &&
        sancion.estado === 'ACTIVA'
    )

    if (tieneSancionActiva) {

      setError(
        'Este usuario ya tiene una sanción activa.'
      )

      return
    }

    const nuevaSancion = {
      usuarioId: usuarioId,
      motivo: formulario.motivo.trim(),
      severidad: formulario.severidad,
      estado: 'ACTIVA'
    }

    try {
      setGuardando(true)

      await sancionesService.crear(nuevaSancion)

      const datosActualizados =
        await sancionesService.listar()

      setSanciones(datosActualizados)

      setFormulario({
        usuarioId: '',
        motivo: '',
        severidad: 'LEVE'
      })

      setMensaje('Sanción registrada correctamente.')

    } catch (err) {

      setError(err.message)

    } finally {
      setGuardando(false)
    }
  }

  async function levantarSancion(sancion) {

    if (guardando || cargando) {
      return
    }

    const confirmar = window.confirm(
      '¿Deseas levantar esta sanción?'
    )

    if (!confirmar) {
      return
    }

    setError('')
    setMensaje('')

    const datosActualizados = {
      usuarioId: sancion.usuarioId,
      motivo: sancion.motivo,
      severidad: sancion.severidad,
      estado: 'LEVANTADA'
    }

    try {
      setGuardando(true)

      await sancionesService.actualizar(
        sancion.id,
        datosActualizados
      )

      const nuevasSanciones =
        await sancionesService.listar()

      setSanciones(nuevasSanciones)

      setMensaje('La sanción fue levantada correctamente.')

    } catch (err) {

      setError(err.message)

    } finally {
      setGuardando(false)
    }
  }

  return (
    <section className="card mb-4">

      <div className="card-body p-4">

        <h3 className="h4 text-center mb-2">
          Gestión de sanciones
        </h3>

        <p className="text-secondary text-center mb-4">
          Registra y administra sanciones de usuarios
          mediante el servidor.
        </p>

        {/* FORMULARIO */}
        <div
          className="border rounded-3 p-4 mb-4"
          style={{ backgroundColor: '#f8f9fa' }}
        >

          <h4 className="h5 text-dark text-center mb-3">
            Aplicar nueva sanción
          </h4>

          <form onSubmit={guardarSancion} noValidate>

            <div className="row g-3 text-start">

              {/* USUARIO */}
              <div className="col-12 col-md-4">

                <label
                  htmlFor="sancionApiUsuario"
                  className="form-label fw-semibold text-dark"
                >
                  Usuario
                </label>

                <select
                  id="sancionApiUsuario"
                  name="usuarioId"
                  className="form-select form-select-lg bg-white border border-2 border-secondary text-dark"
                  value={formulario.usuarioId}
                  onChange={cambiarCampo}
                  disabled={guardando || cargando}
                >

                  <option value="">
                    Selecciona un usuario
                  </option>

                  {usuarios.map((usuario) => (
                    <option
                      key={usuario.id}
                      value={usuario.id}
                    >
                      {usuario.nickname}
                    </option>
                  ))}

                </select>

                <small className="text-secondary">
                  Selecciona un usuario registrado en User.
                </small>

              </div>

              {/* MOTIVO */}
              <div className="col-12 col-md-4">

                <label
                  htmlFor="sancionApiMotivo"
                  className="form-label fw-semibold text-dark"
                >
                  Motivo
                </label>

                <input
                  id="sancionApiMotivo"
                  type="text"
                  name="motivo"
                  className="form-control form-control-lg bg-white border border-2 border-secondary text-dark"
                  placeholder="Ej.: Conducta inapropiada"
                  value={formulario.motivo}
                  onChange={cambiarCampo}
                  disabled={guardando || cargando}
                />

                <small className="text-secondary">
                  Explica brevemente el motivo.
                </small>

              </div>

              {/* SEVERIDAD */}
              <div className="col-12 col-md-4">

                <label
                  htmlFor="sancionApiSeveridad"
                  className="form-label fw-semibold text-dark"
                >
                  Severidad
                </label>

                <select
                  id="sancionApiSeveridad"
                  name="severidad"
                  className="form-select form-select-lg bg-white border border-2 border-secondary text-dark"
                  value={formulario.severidad}
                  onChange={cambiarCampo}
                  disabled={guardando || cargando}
                >

                  <option value="LEVE">LEVE</option>
                  <option value="MEDIA">MEDIA</option>
                  <option value="GRAVE">GRAVE</option>

                </select>

              </div>

            </div>

            <div className="text-center mt-4">

              <button
                type="submit"
                className="btn btn-danger px-4"
                disabled={guardando || cargando || usuarios.length === 0}
              >
                {guardando
                  ? 'Guardando...'
                  : 'Aplicar sanción'}
              </button>

            </div>

          </form>

        </div>

        {/* MENSAJES */}
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

        {/* LISTADO */}
        <div className="d-flex justify-content-between align-items-center gap-2 mb-3 flex-wrap">

          <h4 className="h5 mb-0">
            Sanciones registradas: {sanciones.length}
          </h4>

          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={cargarDatos}
            disabled={cargando || guardando}
          >
            Actualizar listado
          </button>

        </div>

        {cargando ? (

          <p>Cargando sanciones...</p>

        ) : sanciones.length === 0 ? (

          <p>No existen sanciones registradas en el servidor.</p>

        ) : (

          <div className="table-responsive">

            <table className="table table-dark table-striped align-middle">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Motivo</th>
                  <th>Severidad</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>

                {sanciones.map((sancion) => {

                  const usuario = usuarios.find(
                    (item) =>
                      Number(item.id) === Number(sancion.usuarioId)
                  )

                  return (
                    <tr key={sancion.id}>

                      <td>{sancion.id}</td>

                      <td>
                        {usuario
                          ? usuario.nickname
                          : `Usuario ID ${sancion.usuarioId}`}
                      </td>

                      <td>{sancion.motivo}</td>
                      <td>{sancion.severidad}</td>
                      <td>{sancion.estado}</td>

                      <td>

                        {sancion.estado === 'ACTIVA' ? (

                          <button
                            type="button"
                            className="btn btn-outline-success btn-sm"
                            onClick={() => levantarSancion(sancion)}
                            disabled={guardando}
                          >
                            Levantar sanción
                          </button>

                        ) : (

                          <span className="text-secondary">
                            Sin acciones
                          </span>

                        )}

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

export default ResumenSancionesApi
