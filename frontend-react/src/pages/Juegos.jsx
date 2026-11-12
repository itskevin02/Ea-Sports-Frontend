
import { useState, useEffect } from 'react'
import { juegosService } from '../services/juegos'

function Juegos() {

  const formularioVacio = {
    nombre: '',
    genero: '',
    modalidad: '',
    jugadoresPorEquipo: '',
    estado: 'ACTIVO'
  }

  const [juegos, setJuegos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [form, setForm] = useState(formularioVacio)
  const [idEdicion, setIdEdicion] = useState(null)
  const [guardando, setGuardando] = useState(false)

  // Cargar los juegos desde Spring Boot
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

  // Actualizar los campos del formulario
  function cambiar(evento) {
    setForm({
      ...form,
      [evento.target.name]: evento.target.value
    })
  }

  // Crear o actualizar un juego
  async function guardar(evento) {
    evento.preventDefault()

    setError('')
    setMensaje('')
    setGuardando(true)

    const datos = {
      nombre: form.nombre,
      genero: form.genero,
      modalidad: form.modalidad,
      jugadoresPorEquipo: Number(form.jugadoresPorEquipo),
      estado: form.estado
    }

    try {

      if (idEdicion === null) {

        const nuevo = await juegosService.crear(datos)

        setJuegos([...juegos, nuevo])
        setMensaje('Videojuego registrado correctamente.')

      } else {

        const actualizado = await juegosService.actualizar(
          idEdicion,
          datos
        )

        setJuegos(juegos.map((juego) =>
          juego.id === idEdicion ? actualizado : juego
        ))

        setMensaje('Videojuego actualizado correctamente.')
      }

      setForm(formularioVacio)
      setIdEdicion(null)

    } catch (err) {
      setError(err.message)

    } finally {
      setGuardando(false)
    }
  }

  // Cargar los datos del juego que se editará
  function editar(juego) {
    setForm({
      nombre: juego.nombre,
      genero: juego.genero,
      modalidad: juego.modalidad,
      jugadoresPorEquipo: String(juego.jugadoresPorEquipo),
      estado: juego.estado
    })

    setIdEdicion(juego.id)
    setError('')
    setMensaje('')
  }

  // Cancelar la edición
  function cancelarEdicion() {
    setForm(formularioVacio)
    setIdEdicion(null)
    setError('')
  }

  // Eliminar un juego del backend
  async function eliminar(id) {
    setError('')
    setMensaje('')

    try {
      await juegosService.eliminar(id)

      setJuegos(juegos.filter((juego) => juego.id !== id))
      setMensaje('Videojuego eliminado correctamente.')

      if (idEdicion === id) {
        cancelarEdicion()
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

      {/* FORMULARIO */}
      <div className="card bg-dark text-white border-secondary mb-4">
        <div className="card-body">

          <h3 className="h5 mb-3">
            {idEdicion === null
              ? 'Registrar videojuego'
              : 'Editar videojuego'}
          </h3>

          <form onSubmit={guardar}>
            <div className="row g-3">

              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="nombre">
                  Nombre
                </label>

                <input
                  id="nombre"
                  name="nombre"
                  className="form-control"
                  value={form.nombre}
                  onChange={cambiar}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="genero">
                  Género
                </label>

                <input
                  id="genero"
                  name="genero"
                  className="form-control"
                  value={form.genero}
                  onChange={cambiar}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="modalidad">
                  Modalidad
                </label>

                <input
                  id="modalidad"
                  name="modalidad"
                  className="form-control"
                  value={form.modalidad}
                  onChange={cambiar}
                  required
                />
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label" htmlFor="jugadores">
                  Jugadores por equipo
                </label>

                <input
                  id="jugadores"
                  name="jugadoresPorEquipo"
                  type="number"
                  min="1"
                  className="form-control"
                  value={form.jugadoresPorEquipo}
                  onChange={cambiar}
                  required
                />
              </div>

              <div className="col-12 col-md-3">
                <label className="form-label" htmlFor="estado">
                  Estado
                </label>

                <select
                  id="estado"
                  name="estado"
                  className="form-select"
                  value={form.estado}
                  onChange={cambiar}
                >
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                </select>
              </div>

              <div className="col-12 d-flex gap-2">

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={guardando}
                >
                  {guardando
                    ? 'Guardando...'
                    : idEdicion === null
                      ? 'Registrar juego'
                      : 'Guardar cambios'}
                </button>

                {idEdicion !== null && (
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
      </div>

      {/* MENSAJES */}
      {mensaje && (
        <div className="alert alert-success">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
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

                  <div className="d-flex gap-2 mt-3">

                    <button
                      type="button"
                      className="btn btn-warning btn-sm"
                      onClick={() => editar(juego)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminar(juego.id)}
                    >
                      Eliminar
                    </button>

                  </div>

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
