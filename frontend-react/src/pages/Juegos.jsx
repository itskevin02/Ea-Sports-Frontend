import { useState, useEffect } from 'react'

import { juegosService } from '../services/juegos'
import { useAuth } from '../auth/useAuth'

const generos = [
  'Deportes',
  'Carreras',
  'Acción',
  'Estrategia',
  'Lucha',
  'Disparos',
  'MOBA',
  'Battle Royale',
  'Otro'
]

const modalidades = [
  'Online',
  'Offline',
  'Ambas'
]

const formularioVacio = {
  nombre: '',
  genero: '',
  modalidad: '',
  jugadoresPorEquipo: '',
  estado: 'ACTIVO',
  imagen: ''
}

function Juegos() {

  const { usuario } = useAuth()
  const esAdmin = usuario?.rol === 'ADMIN'

  const [juegos, setJuegos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)

  const [formulario, setFormulario] = useState({
    ...formularioVacio
  })

  const [editandoId, setEditandoId] = useState(null)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {

    async function cargarJuegos() {

      try {
        setCargando(true)
        setError('')

        const datos = await juegosService.listar()
        setJuegos(datos)

      } catch (err) {
        setError(err.message)

      } finally {
        setCargando(false)
      }
    }

    cargarJuegos()

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

  function iniciarEdicion(juego) {

    if (!esAdmin) {
      return
    }

    setEditandoId(juego.id)

    setFormulario({
      nombre: juego.nombre,
      genero: juego.genero,
      modalidad: juego.modalidad,
      jugadoresPorEquipo: String(juego.jugadoresPorEquipo),
      estado: juego.estado,
      imagen: juego.imagen || ''
    })

    setError('')
    setMensaje('')
  }

  async function guardarJuego(evento) {

    evento.preventDefault()

    if (!esAdmin || guardando) {
      return
    }

    setError('')
    setMensaje('')

    const nombre = formulario.nombre.trim()
    const cantidad = Number(formulario.jugadoresPorEquipo)
    const imagen = formulario.imagen.trim()

    if (
      !nombre ||
      !formulario.genero ||
      !formulario.modalidad ||
      !formulario.jugadoresPorEquipo
    ) {
      setError('Debes completar todos los campos.')
      return
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      setError(
        'Los jugadores por equipo deben ser un entero mayor a cero.'
      )
      return
    }

    if (
      imagen &&
      !imagen.startsWith('https://') &&
      !imagen.startsWith('http://')
    ) {
      setError('La imagen debe tener una URL http:// o https://.')
      return
    }

    if (imagen.length > 1000) {
      setError('La URL de imagen es demasiado larga.')
      return
    }

    const datosJuego = {
      nombre: nombre,
      genero: formulario.genero,
      modalidad: formulario.modalidad,
      jugadoresPorEquipo: cantidad,
      estado: formulario.estado,
      imagen: imagen
    }

    try {
      setGuardando(true)

      if (editandoId === null) {

        const nuevo = await juegosService.crear(datosJuego)

        setJuegos((actuales) => [...actuales, nuevo])
        setMensaje('Videojuego registrado correctamente.')

      } else {

        const actualizado = await juegosService.actualizar(
          editandoId,
          datosJuego
        )

        setJuegos((actuales) =>
          actuales.map((juego) =>
            juego.id === editandoId ? actualizado : juego
          )
        )

        setMensaje('Videojuego actualizado correctamente.')
      }

      limpiarFormulario()

    } catch (err) {
      setError(err.message)

    } finally {
      setGuardando(false)
    }
  }

  async function eliminarJuego(juego) {

    if (!esAdmin || guardando) {
      return
    }

    const confirmar = window.confirm(
      `¿Deseas eliminar el videojuego "${juego.nombre}"?`
    )

    if (!confirmar) {
      return
    }

    try {
      setError('')
      setMensaje('')

      await juegosService.eliminar(juego.id)

      setJuegos((actuales) =>
        actuales.filter((item) => item.id !== juego.id)
      )

      setMensaje('Videojuego eliminado correctamente.')

      if (editandoId === juego.id) {
        limpiarFormulario()
      }

    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>

      <h2 className="h4 mb-4">
        Juegos disponibles
      </h2>

      {/* FORMULARIO SOLO PARA ADMIN */}
      {esAdmin && (

        <div className="card bg-dark text-white border-secondary mb-4">
          <div className="card-body">

            <h3 className="h5 mb-3">
              {editandoId === null
                ? 'Registrar videojuego'
                : 'Editar videojuego'}
            </h3>

            <form onSubmit={guardarJuego} noValidate>
              <div className="row g-3">

                {/* NOMBRE */}
                <div className="col-12 col-md-6">

                  <label htmlFor="nombreJuego" className="form-label">
                    Nombre
                  </label>

                  <input
                    id="nombreJuego"
                    name="nombre"
                    className="form-control"
                    placeholder="Ej.: EA Sports FC"
                    value={formulario.nombre}
                    onChange={cambiarCampo}
                  />

                </div>

                {/* GENERO */}
                <div className="col-12 col-md-6">

                  <label htmlFor="generoJuego" className="form-label">
                    Género
                  </label>

                  <select
                    id="generoJuego"
                    name="genero"
                    className="form-select"
                    value={formulario.genero}
                    onChange={cambiarCampo}
                  >

                    <option value="">
                      Selecciona un género
                    </option>

                    {formulario.genero &&
                      !generos.includes(formulario.genero) && (
                        <option value={formulario.genero}>
                          {formulario.genero}
                        </option>
                      )}

                    {generos.map((genero) => (
                      <option key={genero} value={genero}>
                        {genero}
                      </option>
                    ))}

                  </select>

                </div>

                {/* MODALIDAD */}
                <div className="col-12 col-md-6">

                  <label htmlFor="modalidadJuego" className="form-label">
                    Modalidad del videojuego
                  </label>

                  <select
                    id="modalidadJuego"
                    name="modalidad"
                    className="form-select"
                    value={formulario.modalidad}
                    onChange={cambiarCampo}
                  >

                    <option value="">
                      Selecciona una modalidad
                    </option>

                    {formulario.modalidad &&
                      !modalidades.includes(formulario.modalidad) && (
                        <option value={formulario.modalidad}>
                          {formulario.modalidad}
                        </option>
                      )}

                    {modalidades.map((modalidad) => (
                      <option key={modalidad} value={modalidad}>
                        {modalidad}
                      </option>
                    ))}

                  </select>

                </div>

                {/* JUGADORES POR EQUIPO */}
                <div className="col-12 col-md-3">

                  <label htmlFor="jugadoresJuego" className="form-label">
                    Jugadores por equipo
                  </label>

                  <input
                    id="jugadoresJuego"
                    name="jugadoresPorEquipo"
                    type="number"
                    min="1"
                    step="1"
                    className="form-control"
                    value={formulario.jugadoresPorEquipo}
                    onChange={cambiarCampo}
                  />

                </div>

                {/* ESTADO */}
                <div className="col-12 col-md-3">

                  <label htmlFor="estadoJuego" className="form-label">
                    Estado
                  </label>

                  <select
                    id="estadoJuego"
                    name="estado"
                    className="form-select"
                    value={formulario.estado}
                    onChange={cambiarCampo}
                  >

                    <option value="ACTIVO">
                      Activo
                    </option>

                    <option value="INACTIVO">
                      Inactivo
                    </option>

                  </select>

                </div>

                {/* IMAGEN POR URL */}
                <div className="col-12">

                  <label htmlFor="imagenJuego" className="form-label">
                    URL de imagen (opcional)
                  </label>

                  <input
                    id="imagenJuego"
                    name="imagen"
                    type="url"
                    className="form-control"
                    placeholder="https://ejemplo.com/juego.jpg"
                    value={formulario.imagen}
                    onChange={cambiarCampo}
                  />

                  <small className="text-white-50">
                    Utiliza una URL pública de imagen JPG, PNG o WebP.
                  </small>

                  {formulario.imagen.startsWith('http') && (
                    <div className="mt-3">

                      <p className="mb-2">
                        Vista previa de la imagen
                      </p>

                      <img
                        src={formulario.imagen}
                        alt="Vista previa del videojuego"
                        className="img-fluid rounded"
                        style={{
                          width: '300px',
                          maxHeight: '180px',
                          objectFit: 'cover'
                        }}
                      />

                    </div>
                  )}

                </div>

                {/* BOTONES */}
                <div className="col-12 d-flex flex-wrap gap-2">

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={guardando}
                  >
                    {guardando
                      ? 'Guardando...'
                      : editandoId === null
                        ? 'Registrar juego'
                        : 'Guardar cambios'}
                  </button>

                  {editandoId !== null && (
                    <button
                      type="button"
                      className="btn btn-outline-light"
                      onClick={() => {
                        limpiarFormulario()
                        setError('')
                      }}
                    >
                      Cancelar
                    </button>
                  )}

                </div>

              </div>
            </form>

          </div>
        </div>
      )}

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

      {cargando && (
        <div className="alert alert-info">
          Cargando videojuegos...
        </div>
      )}

      {!cargando && !error && juegos.length === 0 && (
        <div className="alert alert-secondary">
          No hay videojuegos registrados.
        </div>
      )}

      {/* LISTADO DE VIDEOJUEGOS */}
      {!cargando && juegos.length > 0 && (

        <div className="row g-3">

          {juegos.map((juego) => (

            <div
              className="col-12 col-md-6 col-lg-4"
              key={juego.id}
            >

              <div className="card bg-dark text-white border-secondary h-100">

                {/* IMAGEN */}
                {juego.imagen ? (
                  <img
                    src={juego.imagen}
                    className="card-img-top"
                    alt={juego.nombre}
                    style={{
                      height: '180px',
                      width: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div
                    className="bg-secondary text-white d-flex align-items-center justify-content-center"
                    style={{ height: '180px' }}
                  >
                    Imagen no disponible
                  </div>
                )}

                <div className="card-body">

                  <h3 className="h5">
                    {juego.nombre}
                  </h3>

                  <p>Género: {juego.genero}</p>
                  <p>Modalidad: {juego.modalidad}</p>

                  <p>
                    Jugadores por equipo: {juego.jugadoresPorEquipo}
                  </p>

                  <p>Estado: {juego.estado}</p>

                  {esAdmin && (
                    <div className="d-flex gap-2 mt-3">

                      <button
                        type="button"
                        className="btn btn-warning btn-sm"
                        onClick={() => iniciarEdicion(juego)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => eliminarJuego(juego)}
                      >
                        Eliminar
                      </button>

                    </div>
                  )}

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  )
}

export default Juegos
