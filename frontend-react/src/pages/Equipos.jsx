
import { useState, useEffect } from 'react'

const juegos = [
  'Counter-Strike 2',
  'VALORANT',
  'Fortnite',
  'FC26',
  'EA Sports FC',
  'Madden NFL',
  'Apex Legends'
]

// Jugadores de ejemplo para probar mientras se integran los perfiles
const jugadoresEjemplo = [
  { id: 9001, apodo: 'Jugador01' },
  { id: 9002, apodo: 'Jugador02' },
  { id: 9003, apodo: 'Jugador03' },
  { id: 9004, apodo: 'Jugador04' },
  { id: 9005, apodo: 'Jugador05' },
  { id: 9006, apodo: 'Jugador06' }
]

function cargarJugadores() {
  try {
    const datos = localStorage.getItem('esports_jugadores')

    if (datos) {
      const lista = JSON.parse(datos)

      if (Array.isArray(lista) && lista.length > 0) {
        return {
          lista: lista,
          sonEjemplo: false
        }
      }
    }
  } catch {
    // Si no existen perfiles, se usan jugadores de ejemplo
  }

  return {
    lista: jugadoresEjemplo,
    sonEjemplo: true
  }
}

function cargarEquipos() {
  try {
    const datos = localStorage.getItem('esports_equipos')

    if (datos) {
      const lista = JSON.parse(datos)
      return Array.isArray(lista) ? lista : []
    }
  } catch {
    return []
  }

  return []
}

function Equipos() {
  const [datosJugadores] = useState(cargarJugadores)
  const jugadores = datosJugadores.lista

  const [equipos, setEquipos] = useState(cargarEquipos)

  const [formulario, setFormulario] = useState({
    nombre: '',
    juego: '',
    capitanId: ''
  })

  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')
  const [idEquipoSeleccionado, setIdEquipoSeleccionado] = useState(null)
  const [idJugadorAgregar, setIdJugadorAgregar] = useState('')

  const equipoActual = equipos.find(
    (equipo) => equipo.id === idEquipoSeleccionado
  )

  useEffect(() => {
    localStorage.setItem(
      'esports_equipos',
      JSON.stringify(equipos)
    )
  }, [equipos])

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

  function crearEquipo(evento) {
    evento.preventDefault()

    const nombre = formulario.nombre.trim()
    const nuevosErrores = {}

    if (nombre === '') {
      nuevosErrores.nombre = 'El nombre del equipo es obligatorio.'
    } else {
      const nombreRepetido = equipos.some((equipo) =>
        equipo.nombre.toLowerCase() === nombre.toLowerCase()
      )

      if (nombreRepetido) {
        nuevosErrores.nombre = 'Este nombre de equipo ya existe.'
      }
    }

    if (formulario.juego === '') {
      nuevosErrores.juego = 'Debes seleccionar un juego.'
    }

    if (formulario.capitanId === '') {
      nuevosErrores.capitanId = 'Debes seleccionar un capitán.'
    }

    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      setMensaje('')
      return
    }

    const capitan = jugadores.find(
      (jugador) => jugador.id === Number(formulario.capitanId)
    )

    if (!capitan) {
      setMensaje('No se encontró el jugador seleccionado.')
      return
    }

    const nuevoId = equipos.length > 0
      ? Math.max(...equipos.map((equipo) => equipo.id)) + 1
      : 1

    const nuevoEquipo = {
      id: nuevoId,
      nombre: nombre,
      juego: formulario.juego,
      capitanId: capitan.id,
      integrantes: [
        {
          id: capitan.id,
          nombre: capitan.apodo,
          rol: 'Capitán'
        }
      ],
      activo: true
    }

    setEquipos([...equipos, nuevoEquipo])
    setIdEquipoSeleccionado(nuevoId)

    setFormulario({
      nombre: '',
      juego: '',
      capitanId: ''
    })

    setErrores({})
    setMensaje('Equipo creado correctamente.')
  }

  function agregarJugador() {
    if (!equipoActual) {
      setMensaje('Debes seleccionar un equipo.')
      return
    }

    if (idJugadorAgregar === '') {
      setMensaje('Debes seleccionar un jugador.')
      return
    }

    const idJugador = Number(idJugadorAgregar)

    const jugadorRepetido = equipoActual.integrantes.some(
      (integrante) => integrante.id === idJugador
    )

    if (jugadorRepetido) {
      setMensaje('El jugador ya pertenece a este equipo.')
      return
    }

    const jugador = jugadores.find(
      (registro) => registro.id === idJugador
    )

    if (!jugador) {
      setMensaje('No se encontró el jugador seleccionado.')
      return
    }

    const equiposActualizados = equipos.map((equipo) =>
      equipo.id === equipoActual.id
        ? {
            ...equipo,
            integrantes: [
              ...equipo.integrantes,
              {
                id: jugador.id,
                nombre: jugador.apodo,
                rol: 'Integrante'
              }
            ]
          }
        : equipo
    )

    setEquipos(equiposActualizados)
    setIdJugadorAgregar('')
    setMensaje('Jugador agregado correctamente.')
  }

  function quitarJugador(idJugador) {
    if (!equipoActual) return

    if (equipoActual.capitanId === idJugador) {
      setMensaje('No puedes quitar al capitán del equipo.')
      return
    }

    const equiposActualizados = equipos.map((equipo) =>
      equipo.id === equipoActual.id
        ? {
            ...equipo,
            integrantes: equipo.integrantes.filter(
              (integrante) => integrante.id !== idJugador
            )
          }
        : equipo
    )

    setEquipos(equiposActualizados)
    setMensaje('Jugador eliminado del equipo.')
  }

  function cambiarEstadoEquipo() {
    if (!equipoActual) return

    const equiposActualizados = equipos.map((equipo) =>
      equipo.id === equipoActual.id
        ? { ...equipo, activo: !equipo.activo }
        : equipo
    )

    setEquipos(equiposActualizados)
    setMensaje('Estado del equipo actualizado.')
  }

  return (
    <div>
      <h2 className="mb-3">Gestión de Equipos</h2>

      <p className="text-white-50 mb-4">
        Crea equipos y administra sus integrantes.
      </p>

      {datosJugadores.sonEjemplo && (
        <div className="alert alert-info">
          Se están utilizando jugadores de ejemplo.
          Al integrar Perfil, se podrán seleccionar
          los jugadores registrados en la plataforma.
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <h3 className="h5 mb-4">Crear nuevo equipo</h3>

          <form onSubmit={crearEquipo} noValidate>
            <div className="row g-3">

              <div className="col-12 col-md-4">
                <label htmlFor="nombreEquipo" className="form-label">
                  Nombre del equipo
                </label>

                <input
                  type="text"
                  id="nombreEquipo"
                  name="nombre"
                  className="form-control"
                  value={formulario.nombre}
                  onChange={cambiarCampo}
                />

                <small className="text-secondary">
                  El nombre debe ser único.
                </small>

                {errores.nombre && (
                  <p className="text-danger mt-1">
                    {errores.nombre}
                  </p>
                )}
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor="juegoEquipo" className="form-label">
                  Juego principal
                </label>

                <select
                  id="juegoEquipo"
                  name="juego"
                  className="form-select"
                  value={formulario.juego}
                  onChange={cambiarCampo}
                >
                  <option value="">Selecciona un juego</option>

                  {juegos.map((juego) => (
                    <option key={juego} value={juego}>
                      {juego}
                    </option>
                  ))}
                </select>

                {errores.juego && (
                  <p className="text-danger mt-1">
                    {errores.juego}
                  </p>
                )}
              </div>

              <div className="col-12 col-md-4">
                <label htmlFor="capitanEquipo" className="form-label">
                  Capitán
                </label>

                <select
                  id="capitanEquipo"
                  name="capitanId"
                  className="form-select"
                  value={formulario.capitanId}
                  onChange={cambiarCampo}
                >
                  <option value="">Selecciona un capitán</option>

                  {jugadores.map((jugador) => (
                    <option key={jugador.id} value={jugador.id}>
                      {jugador.apodo}
                    </option>
                  ))}
                </select>

                {errores.capitanId && (
                  <p className="text-danger mt-1">
                    {errores.capitanId}
                  </p>
                )}
              </div>

            </div>

            <button type="submit" className="btn btn-primary mt-4">
              Crear equipo
            </button>
          </form>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h3 className="h5 mb-3">Equipos registrados</h3>

          <p className="text-secondary">
            Total de equipos: {equipos.length}
          </p>

          {equipos.length === 0 ? (
            <p className="text-secondary">
              Todavía no existen equipos registrados.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Equipo</th>
                    <th>Juego</th>
                    <th>Integrantes</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {equipos.map((equipo) => (
                    <tr key={equipo.id}>
                      <td>{equipo.id}</td>
                      <td>{equipo.nombre}</td>
                      <td>{equipo.juego}</td>
                      <td>{equipo.integrantes.length}</td>
                      <td>
                        {equipo.activo ? 'Activo' : 'Inactivo'}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            setIdEquipoSeleccionado(equipo.id)
                            setIdJugadorAgregar('')
                            setMensaje('')
                          }}
                        >
                          Administrar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {equipoActual && (
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="h5 mb-3">
              Integrantes de {equipoActual.nombre}
            </h3>

            <p>
              Estado: <strong>
                {equipoActual.activo ? 'Activo' : 'Inactivo'}
              </strong>
            </p>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm mb-4"
              onClick={cambiarEstadoEquipo}
            >
              {equipoActual.activo
                ? 'Desactivar equipo'
                : 'Activar equipo'}
            </button>

            <div className="row g-3 align-items-end mb-4">
              <div className="col-12 col-md-8">
                <label htmlFor="agregarJugador" className="form-label">
                  Seleccionar jugador
                </label>

                <select
                  id="agregarJugador"
                  className="form-select"
                  value={idJugadorAgregar}
                  onChange={(evento) =>
                    setIdJugadorAgregar(evento.target.value)
                  }
                >
                  <option value="">Selecciona un jugador</option>

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
                  onClick={agregarJugador}
                >
                  Agregar jugador
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>Jugador</th>
                    <th>Rol</th>
                    <th>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {equipoActual.integrantes.map((integrante) => (
                    <tr key={integrante.id}>
                      <td>{integrante.nombre}</td>
                      <td>{integrante.rol}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          disabled={
                            integrante.id === equipoActual.capitanId
                          }
                          onClick={() => quitarJugador(integrante.id)}
                        >
                          Quitar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {mensaje && (
        <div className="alert alert-secondary">
          {mensaje}
        </div>
      )}
    </div>
  )
}

export default Equipos
