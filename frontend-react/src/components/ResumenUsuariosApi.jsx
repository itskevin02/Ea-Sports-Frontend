
import { useState, useEffect } from 'react'

import { usuariosService } from '../services/usuarios'
import { sancionesService } from '../services/sanciones'

function ResumenUsuariosApi() {

  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [eliminandoId, setEliminandoId] = useState(null)

  const [editandoId, setEditandoId] = useState(null)

  const [errorCarga, setErrorCarga] = useState('')
  const [errorFormulario, setErrorFormulario] = useState('')
  const [mensaje, setMensaje] = useState('')

  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    nickname: ''
  })

  async function cargarUsuarios() {

    try {
      setCargando(true)
      setErrorCarga('')

      const datos = await usuariosService.listar()
      setUsuarios(datos)

    } catch (err) {
      setErrorCarga(err.message)
      setUsuarios([])

    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarUsuarios()
  }, [])

  function cambiarCampo(evento) {

    const { name, value } = evento.target

    setFormulario({
      ...formulario,
      [name]: value
    })

    setErrorFormulario('')
    setMensaje('')
  }

  function limpiarFormulario() {

    setFormulario({
      nombre: '',
      correo: '',
      nickname: ''
    })

    setEditandoId(null)
  }

  function iniciarEdicion(usuario) {

    setEditandoId(usuario.id)

    setFormulario({
      nombre: usuario.nombre,
      correo: usuario.correo,
      nickname: usuario.nickname
    })

    setErrorFormulario('')
    setMensaje('')
  }

  function cancelarEdicion() {

    limpiarFormulario()
    setErrorFormulario('')
    setMensaje('')
  }

  async function guardarUsuario(evento) {

    evento.preventDefault()

    if (guardando || eliminandoId !== null) {
      return
    }

    setErrorFormulario('')
    setMensaje('')

    const nombre = formulario.nombre.trim()
    const correo = formulario.correo.trim()
    const nickname = formulario.nickname.trim()

    if (!nombre || !correo || !nickname) {
      setErrorFormulario('Debes completar todos los campos.')
      return
    }

    if (!correo.includes('@') || !correo.includes('.')) {
      setErrorFormulario(
        'Ingresa un correo electrónico válido.'
      )
      return
    }

    const nicknameRepetido = usuarios.some(
      (usuario) =>
        usuario.nickname.toLowerCase() ===
          nickname.toLowerCase() &&
        Number(usuario.id) !== Number(editandoId)
    )

    if (nicknameRepetido) {
      setErrorFormulario(
        'Ya existe un usuario con ese nickname.'
      )
      return
    }

    const correoRepetido = usuarios.some(
      (usuario) =>
        usuario.correo.toLowerCase() ===
          correo.toLowerCase() &&
        Number(usuario.id) !== Number(editandoId)
    )

    if (correoRepetido) {
      setErrorFormulario(
        'Ya existe un usuario con ese correo.'
      )
      return
    }

    let datosUsuario = {
      nombre: nombre,
      correo: correo,
      nickname: nickname,
      rol: 'USUARIO',
      estado: 'ACTIVO'
    }

    if (editandoId !== null) {

      const usuarioActual = usuarios.find(
        (usuario) =>
          Number(usuario.id) === Number(editandoId)
      )

      if (!usuarioActual) {
        setErrorFormulario('No se encontró el usuario.')
        return
      }

      datosUsuario = {
        ...datosUsuario,
        rol: usuarioActual.rol,
        estado: usuarioActual.estado
      }
    }

    try {
      setGuardando(true)

      if (editandoId !== null) {

        await usuariosService.actualizar(
          editandoId,
          datosUsuario
        )

      } else {

        await usuariosService.crear(datosUsuario)
      }

      const datosActualizados = await usuariosService.listar()
      setUsuarios(datosActualizados)

      const mensajeExito = editandoId !== null
        ? `Usuario "${nickname}" actualizado correctamente.`
        : `Usuario "${nickname}" registrado correctamente.`

      limpiarFormulario()
      setMensaje(mensajeExito)

    } catch (err) {
      setErrorFormulario(err.message)

    } finally {
      setGuardando(false)
    }
  }

  async function eliminarUsuario(usuario) {

    if (guardando || eliminandoId !== null) {
      return
    }

    const confirmar = window.confirm(
      `¿Deseas eliminar al usuario "${usuario.nickname}"?`
    )

    if (!confirmar) {
      return
    }

    setErrorFormulario('')
    setMensaje('')

    try {
      setEliminandoId(usuario.id)

      const sanciones = await sancionesService.listar()

      const tieneSanciones = sanciones.some(
        (sancion) =>
          Number(sancion.usuarioId) === Number(usuario.id)
      )

      if (tieneSanciones) {

        setErrorFormulario(
          'No se puede eliminar este usuario porque ' +
          'tiene sanciones registradas.'
        )

        return
      }

      await usuariosService.eliminar(usuario.id)

      const datosActualizados = await usuariosService.listar()
      setUsuarios(datosActualizados)

      if (Number(editandoId) === Number(usuario.id)) {
        limpiarFormulario()
      }

      setMensaje(
        `Usuario "${usuario.nickname}" eliminado correctamente.`
      )

    } catch (err) {

      setErrorFormulario(
        'No se pudo comprobar o completar la eliminación: ' +
        err.message
      )

    } finally {
      setEliminandoId(null)
    }
  }

  return (
    <section className="card mb-4">

      <div className="card-body p-4">

        <h3 className="h4 text-center mb-2">
          Gestión de usuarios
        </h3>

        <p className="text-secondary text-center mb-4">
          Crea, consulta, edita y elimina usuarios
          registrados en el sistema.
        </p>

        {/* FORMULARIO */}
        <div
          className="border rounded-3 p-4 mb-4"
          style={{ backgroundColor: '#f8f9fa' }}
        >

          <h4 className="h5 text-center text-dark mb-2">
            {editandoId !== null
              ? `Editar usuario N° ${editandoId}`
              : 'Registrar nuevo usuario'}
          </h4>

          <p className="text-secondary text-center mb-4">
            {editandoId !== null
              ? 'Modifica los datos y guarda los cambios.'
              : 'Completa los datos para registrar un usuario.'}
          </p>

          <form onSubmit={guardarUsuario} noValidate>

            <div className="row g-3 text-start">

              {/* NOMBRE */}
              <div className="col-12 col-md-4">

                <label
                  htmlFor="usuarioApiNombre"
                  className="form-label fw-semibold text-dark"
                >
                  Nombre
                </label>

                <input
                  id="usuarioApiNombre"
                  type="text"
                  name="nombre"
                  className="form-control form-control-lg bg-white border border-2 border-secondary text-dark"
                  placeholder="Ej.: Juan Pérez"
                  value={formulario.nombre}
                  onChange={cambiarCampo}
                  disabled={guardando}
                />

                <small className="text-secondary">
                  Ingresa el nombre del usuario.
                </small>

              </div>

              {/* CORREO */}
              <div className="col-12 col-md-4">

                <label
                  htmlFor="usuarioApiCorreo"
                  className="form-label fw-semibold text-dark"
                >
                  Correo electrónico
                </label>

                <input
                  id="usuarioApiCorreo"
                  type="email"
                  name="correo"
                  className="form-control form-control-lg bg-white border border-2 border-secondary text-dark"
                  placeholder="Ej.: usuario@correo.com"
                  value={formulario.correo}
                  onChange={cambiarCampo}
                  disabled={guardando}
                />

                <small className="text-secondary">
                  Debe contener un correo válido.
                </small>

              </div>

              {/* NICKNAME */}
              <div className="col-12 col-md-4">

                <label
                  htmlFor="usuarioApiNickname"
                  className="form-label fw-semibold text-dark"
                >
                  Nickname
                </label>

                <input
                  id="usuarioApiNickname"
                  type="text"
                  name="nickname"
                  className="form-control form-control-lg bg-white border border-2 border-secondary text-dark"
                  placeholder="Ej.: jugadorPro123"
                  value={formulario.nickname}
                  onChange={cambiarCampo}
                  disabled={guardando}
                />

                <small className="text-secondary">
                  Debe ser diferente al de otros usuarios.
                </small>

              </div>

            </div>

            {/* BOTONES DEL FORMULARIO */}
            <div className="d-flex justify-content-center gap-2 mt-4">

              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={
                  guardando ||
                  cargando ||
                  eliminandoId !== null ||
                  !!errorCarga
                }
              >
                {guardando
                  ? 'Guardando...'
                  : editandoId !== null
                    ? 'Guardar cambios'
                    : 'Registrar usuario'}
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
        {errorCarga && (
          <div className="alert alert-danger" role="alert">
            No se pudieron cargar los usuarios: {errorCarga}
          </div>
        )}

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

        {/* LISTADO */}
        <div className="d-flex justify-content-between align-items-center gap-2 mb-3 flex-wrap">

          <h4 className="h5 mb-0">
            Usuarios registrados: {usuarios.length}
          </h4>

          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={cargarUsuarios}
            disabled={cargando || guardando || eliminandoId !== null}
          >
            Actualizar listado
          </button>

        </div>

        {cargando ? (

          <p>Cargando usuarios...</p>

        ) : errorCarga ? (

          <p>No se pudo consultar el listado del servidor.</p>

        ) : usuarios.length === 0 ? (

          <p>No existen usuarios registrados en el servidor.</p>

        ) : (

          <div className="table-responsive">

            <table className="table table-dark table-striped align-middle">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Nickname</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>

                {usuarios.map((usuario) => (

                  <tr key={usuario.id}>

                    <td>{usuario.id}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.nickname}</td>
                    <td>{usuario.rol}</td>
                    <td>{usuario.estado}</td>

                    <td>
                      <div className="d-flex gap-2">

                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => iniciarEdicion(usuario)}
                          disabled={
                            guardando ||
                            eliminandoId !== null ||
                            cargando
                          }
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => eliminarUsuario(usuario)}
                          disabled={
                            guardando ||
                            eliminandoId !== null ||
                            cargando
                          }
                        >
                          {eliminandoId === usuario.id
                            ? 'Eliminando...'
                            : 'Eliminar'}
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

    </section>
  )
}

export default ResumenUsuariosApi
