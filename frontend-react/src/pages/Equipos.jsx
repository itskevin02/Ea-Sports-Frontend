
import { useState, useEffect } from 'react'

import {
  eliminarEquipoYInscripciones
} from '../logica/eliminarEquipo'

// Juegos disponibles
const juegos = [
  'Counter-Strike 2',
  'VALORANT',
  'Fortnite',
  'EA Sports FC',
  'Madden NFL',
  'Apex Legends'
]

// Jugadores de ejemplo
const jugadoresEjemplo = [
  { id: 9001, apodo: 'Jugador01' },
  { id: 9002, apodo: 'Jugador02' },
  { id: 9003, apodo: 'Jugador03' },
  { id: 9004, apodo: 'Jugador04' },
  { id: 9005, apodo: 'Jugador05' },
  { id: 9006, apodo: 'Jugador06' }
]

// Recuperar jugadores
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
    // Utilizar jugadores de ejemplo
  }

  return {
    lista: jugadoresEjemplo,
    sonEjemplo: true
  }
}

// Recuperar equipos
function cargarEquipos() {
  try {
    const datos = localStorage.getItem('esports_equipos')

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

  const [idEquipoSeleccionado, setIdEquipoSeleccionado] =
    useState(null)

  const [idJugadorAgregar, setIdJugadorAgregar] = useState('')

  // Equipo que estamos administrando
  const equipoActual = equipos.find(
    (equipo) =>
      String(equipo.id) === String(idEquipoSeleccionado)
  )

  // Guardar equipos al modificarlos
  useEffect(() => {
    localStorage.setItem(
      'esports_equipos',
      JSON.stringify(equipos)
    )
  }, [equipos])

  // Actualizar formulario
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

  // Crear un equipo
  function crearEquipo(evento) {
    evento.preventDefault()

    const nombre = formulario.nombre.trim()
    const nuevosErrores = {}

    // Validar nombre
    if (nombre === '') {
      nuevosErrores.nombre =
        'El nombre del equipo es obligatorio.'
    } else {
      const nombreRepetido = equipos.some(
        (equipo) =>
          equipo.nombre.toLowerCase() === nombre.toLowerCase()
      )

      if (nombreRepetido) {
        nuevosErrores.nombre =
          'Este nombre de equipo ya existe.'
      }
    }

    // Validar juego
    if (formulario.juego === '') {
      nuevosErrores.juego =
        'Debes seleccionar un juego.'
    }

    // Validar capitán
    if (formulario.capitanId === '') {
      nuevosErrores.capitanId =
        'Debes seleccionar un capitán.'
    }

    setErrores(nuevosErrores)

    if (Object.keys(nuevosErrores).length > 0) {
      setMensaje('')
      return
    }

    const capitan = jugadores.find(
      (jugador) =>
        String(jugador.id) === formulario.capitanId
    )

    if (!capitan) {
      setMensaje('No se encontró el capitán seleccionado.')
      return
    }

    // Crear ID que no esté en uso
    const nuevoId = equipos.length > 0
      ? Math.max(...equipos.map((equipo) => Number(equipo.id))) + 1
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

    setEquipos([
      ...equipos,
      nuevoEquipo
    ])

    setIdEquipoSeleccionado(nuevoId)

    setFormulario({
      nombre: '',
      juego: '',
      capitanId: ''
    })

    setErrores({})
    setMensaje('Equipo creado correctamente.')
  }

  // Agregar un jugador al equipo
  function agregarJugador() {
    if (!equipoActual) {
      setMensaje('Debes seleccionar un equipo.')
      return
    }

    if (idJugadorAgregar === '') {
      setMensaje('Debes seleccionar un jugador.')
      return
    }

    const jugadorRepetido = equipoActual.integrantes.some(
      (integrante) =>
        String(integrante.id) === idJugadorAgregar
    )

    if (jugadorRepetido) {
      setMensaje('El jugador ya pertenece a este equipo.')
      return
    }

    const jugador = jugadores.find(
      (registro) =>
        String(registro.id) === idJugadorAgregar
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

  // Quitar un integrante
  function quitarJugador(idJugador) {
    if (!equipoActual) {
      return
    }

    if (
      String(equipoActual.capitanId) === String(idJugador)
    ) {
      setMensaje('No puedes quitar al capitán del equipo.')
      return
    }

    const equiposActualizados = equipos.map((equipo) =>
      equipo.id === equipoActual.id
        ? {
            ...equipo,
            integrantes: equipo.integrantes.filter(
              (integrante) =>
                String(integrante.id) !== String(idJugador)
            )
          }
        : equipo
    )

    setEquipos(equiposActualizados)
    setMensaje('Jugador eliminado del equipo.')
  }

  // Activar o desactivar equipo
  function cambiarEstadoEquipo() {
    if (!equipoActual) {
      return
    }

    const equiposActualizados = equipos.map((equipo) =>
      equipo.id === equipoActual.id
        ? {
            ...equipo,
            activo: !equipo.activo
          }
        : equipo
    )

    setEquipos(equiposActualizados)
    setMensaje('Estado del equipo actualizado.')
  }

  // NUEVO: eliminar equipo y cancelar inscripciones
  function eliminarEquipo() {
    if (!equipoActual) {
      return
    }

    const claveInscripciones = 'esports_inscripciones_ep2'
    const claveEquipos = 'esports_equipos'
    const claveDemo = 'esports_equipos_demo_inicializados'

    let inscripciones = []
    let datosInscripciones

    try {
      datosInscripciones = localStorage.getItem(
        claveInscripciones
      )

      if (datosInscripciones !== null) {
        inscripciones = JSON.parse(datosInscripciones)

        if (!Array.isArray(inscripciones)) {
          throw new Error('Inscripciones no válidas')
        }
      }
    } catch {
      setMensaje(
        'No se pudieron leer las inscripciones. ' +
        'No se eliminó ningún equipo.'
      )
      return
    }

    const resultado = eliminarEquipoYInscripciones(
      equipos,
      inscripciones,
      equipoActual.id
    )

    // Solicitar confirmación al usuario
    const confirmado = window.confirm(
      `¿Deseas eliminar el equipo "${equipoActual.nombre}"?\n\n` +
      `Se cancelarán ${resultado.inscripcionesCanceladas} inscripción(es) ` +
      'de este equipo.\n\n' +
      'Esta acción no se puede deshacer.'
    )

    if (!confirmado) {
      return
    }

    // Conservar los datos anteriores por seguridad
    const datosEquipos = localStorage.getItem(claveEquipos)
    const datosDemo = localStorage.getItem(claveDemo)

    try {
      // Cancelar inscripciones del equipo
      localStorage.setItem(
        claveInscripciones,
        JSON.stringify(resultado.inscripcionesRestantes)
      )

      // Eliminarlo del registro de equipos
      localStorage.setItem(
        claveEquipos,
        JSON.stringify(resultado.equiposRestantes)
      )

      // Evitar que un equipo demo eliminado reaparezca
      if (equipoActual.esEjemplo === true) {
        localStorage.setItem(claveDemo, 'si')
      }

    } catch {
      // Intentar restaurar los registros anteriores
      try {
        if (datosInscripciones === null) {
          localStorage.removeItem(claveInscripciones)
        } else {
          localStorage.setItem(
            claveInscripciones,
            datosInscripciones
          )
        }

        if (datosEquipos === null) {
          localStorage.removeItem(claveEquipos)
        } else {
          localStorage.setItem(claveEquipos, datosEquipos)
        }

        if (datosDemo === null) {
          localStorage.removeItem(claveDemo)
        } else {
          localStorage.setItem(claveDemo, datosDemo)
        }
      } catch {
        // Si falla la restauración, informar al usuario
      }

      setMensaje(
        'No fue posible guardar la eliminación. ' +
        'Revisa los registros antes de volver a intentarlo.'
      )
      return
    }

    // Actualizar la pantalla
    setEquipos(resultado.equiposRestantes)
    setIdEquipoSeleccionado(null)
    setIdJugadorAgregar('')

    setMensaje(
      `Equipo "${equipoActual.nombre}" eliminado. ` +
      `Inscripciones canceladas: ${resultado.inscripcionesCanceladas}.`
    )
  }

  return (
    <div>

      <h2 className="mb-3">
        Gestión de Equipos
      </h2>

      <p className="text-white-50 mb-4">
        Crea equipos y administra sus integrantes.
      </p>

      {datosJugadores.sonEjemplo && (
        <div className="alert alert-info">
          Se están utilizando jugadores de ejemplo.
          Cuando existan perfiles registrados, podrás
          seleccionar esos jugadores.
        </div>
      )}

      {/* FORMULARIO PARA CREAR EQUIPOS */}
      <div className="card mb-4">
        <div className="card-body">

          <h3 className="h5 mb-4">
            Crear nuevo equipo
          </h3>

          <form onSubmit={crearEquipo} noValidate>

            <div className="row g-3">

              {/* NOMBRE */}
              <div className="col-12 col-md-4">

                <label
                  htmlFor="nombreEquipo"
                  className="form-label"
                >
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

              {/* JUEGO */}
              <div className="col-12 col-md-4">

                <label
                  htmlFor="juegoEquipo"
                  className="form-label"
                >
                  Juego principal
                </label>

                <select
                  id="juegoEquipo"
                  name="juego"
                  className="form-select"
                  value={formulario.juego}
                  onChange={cambiarCampo}
                >

                  <option value="">
                    Selecciona un juego
                  </option>

                  {juegos.map((juego) => (
                    <option
                      key={juego}
                      value={juego}
                    >
                      {juego === 'EA Sports FC'
                        ? 'EA Sports FC 26'
                        : juego}
                    </option>
                  ))}

                </select>

                {errores.juego && (
                  <p className="text-danger mt-1">
                    {errores.juego}
                  </p>
                )}

              </div>

              {/* CAPITÁN */}
              <div className="col-12 col-md-4">

                <label
                  htmlFor="capitanEquipo"
                  className="form-label"
                >
                  Capitán
                </label>

                <select
                  id="capitanEquipo"
                  name="capitanId"
                  className="form-select"
                  value={formulario.capitanId}
                  onChange={cambiarCampo}
                >

                  <option value="">
                    Selecciona un capitán
                  </option>

                  {jugadores.map((jugador) => (
                    <option
                      key={jugador.id}
                      value={jugador.id}
                    >
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

            <button
              type="submit"
              className="btn btn-primary mt-4"
            >
              Crear equipo
            </button>

          </form>

        </div>
      </div>

      {/* TABLA DE EQUIPOS REGISTRADOS */}
      <div className="card mb-4">
        <div className="card-body">

          <h3 className="h5 mb-3">
            Equipos registrados
          </h3>

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

                      <td>
                        {equipo.juego === 'EA Sports FC'
                          ? 'EA Sports FC 26'
                          : equipo.juego}
                      </td>

                      <td>
                        {equipo.integrantes.length}
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            equipo.activo
                              ? 'bg-success'
                              : 'bg-secondary'
                          }`}
                        >
                          {equipo.activo
                            ? 'Activo'
                            : 'Inactivo'}
                        </span>
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

      {/* ADMINISTRAR INTEGRANTES */}
      {equipoActual && (

        <div className="card mb-4">
          <div className="card-body">

            <h3 className="h5 mb-3">
              Integrantes de {equipoActual.nombre}
            </h3>

            <p>
              Estado:{' '}
              <strong>
                {equipoActual.activo
                  ? 'Activo'
                  : 'Inactivo'}
              </strong>
            </p>

            {/* ACTIVAR, DESACTIVAR O ELIMINAR */}
            <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={cambiarEstadoEquipo}
              >
                {equipoActual.activo
                  ? 'Desactivar equipo'
                  : 'Activar equipo'}
              </button>

              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={eliminarEquipo}
              >
                Eliminar equipo
              </button>

            </div>

            {/* AGREGAR JUGADOR */}
            <div className="row g-3 align-items-end mb-4">

              <div className="col-12 col-md-8">

                <label
                  htmlFor="agregarJugador"
                  className="form-label"
                >
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

                  <option value="">
                    Selecciona un jugador
                  </option>

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
                  onClick={agregarJugador}
                >
                  Agregar jugador
                </button>

              </div>

            </div>

            {/* TABLA DE INTEGRANTES */}
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

                  {equipoActual.integrantes.map((integrante) => {

                    const esCapitan =
                      String(integrante.id) ===
                      String(equipoActual.capitanId)

                    return (
                      <tr key={integrante.id}>

                        <td>
                          {integrante.nombre}
                        </td>

                        <td>
                          {esCapitan
                            ? 'Capitán'
                            : 'Integrante'}
                        </td>

                        <td>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            disabled={esCapitan}
                            onClick={() =>
                              quitarJugador(integrante.id)
                            }
                          >
                            Quitar
                          </button>
                        </td>

                      </tr>
                    )
                  })}

                </tbody>

              </table>

            </div>

          </div>
        </div>
      )}

      {/* MENSAJES */}
      {mensaje && (

        <div
          className="alert alert-secondary"
          role="status"
        >
          {mensaje}
        </div>

      )}

    </div>
  )
}

export default Equipos
