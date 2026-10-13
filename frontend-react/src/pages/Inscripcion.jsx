
import { useState, useEffect } from 'react'

import { torneosData } from '../data/torneos'

import {
  cuposDisponibles as calcularCuposDisponibles,
  inscripcionFueraDePlazo,
  equipoCompleto
} from '../logica/validarInscripcion'

import { tieneSancionActiva } from '../logica/sanciones'

import FormularioInscripcion from '../components/FormularioInscripcion'

// Jugadores de ejemplo cuando todavía no hay perfiles
const jugadoresEjemplo = [
  { id: 9001, apodo: 'Jugador01' },
  { id: 9002, apodo: 'Jugador02' },
  { id: 9003, apodo: 'Jugador03' },
  { id: 9004, apodo: 'Jugador04' },
  { id: 9005, apodo: 'Jugador05' },
  { id: 9006, apodo: 'Jugador06' }
]

const claveInscripciones = 'esports_inscripciones_ep2'

// Leer registros guardados
function cargarDatos(clave) {
  try {
    const datos = localStorage.getItem(clave)

    if (datos) {
      const registros = JSON.parse(datos)

      if (Array.isArray(registros)) {
        return registros
      }
    }
  } catch {
    return []
  }

  return []
}

// Cargar jugadores registrados
function cargarJugadores() {
  const jugadores = cargarDatos('esports_jugadores')

  if (jugadores.length > 0) {
    return jugadores
  }

  return jugadoresEjemplo
}

// Normalizar nombres de videojuegos
function normalizarJuego(juego) {
  return String(juego || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

// Obtener fecha actual
function obtenerFechaActual() {
  const fecha = new Date()

  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')

  return `${anio}-${mes}-${dia}`
}

function Inscripcion() {

  const [jugadores] = useState(cargarJugadores)

  // Consultar los equipos registrados en el navegador
  const equipos = cargarDatos('esports_equipos')

  const [inscripciones, setInscripciones] = useState(
    () => cargarDatos(claveInscripciones)
  )

  const [torneoId, setTorneoId] = useState('')
  const [tipo, setTipo] = useState('')
  const [participanteId, setParticipanteId] = useState('')

  const [error, setError] = useState('')
  const [confirmacion, setConfirmacion] = useState(null)

  // Obtener torneo seleccionado
  const torneoSeleccionado = torneosData.find(
    (torneo) => String(torneo.id) === torneoId
  )

  // Filtrar los equipos por videojuego
  const equiposDelJuego = equipos.filter((equipo) => {

    if (!torneoSeleccionado) {
      return false
    }

    return (
      normalizarJuego(equipo.juego) ===
      normalizarJuego(torneoSeleccionado.juego)
    )
  })

  // Equipo seleccionado
  const equipoSeleccionado = equiposDelJuego.find(
    (equipo) => String(equipo.id) === participanteId
  )

  // Jugador seleccionado
  const jugadorSeleccionado = jugadores.find(
    (jugador) => String(jugador.id) === participanteId
  )

  // Participante que se desea inscribir
  const participanteSeleccionado =
    tipo === 'equipo'
      ? equipoSeleccionado
      : tipo === 'jugador'
        ? jugadorSeleccionado
        : null

  // Contar las inscripciones realizadas desde el navegador
  const inscritosLocales = inscripciones.filter(
    (registro) =>
      torneoSeleccionado &&
      Number(registro.torneoId) === torneoSeleccionado.id
  ).length

  // Calcular cupos disponibles
  const cuposDisponibles = torneoSeleccionado
    ? calcularCuposDisponibles(
        torneoSeleccionado.cupos,
        torneoSeleccionado.inscritos,
        inscritosLocales
      )
    : 0

  // Comprobar si el participante ya está inscrito
  const participanteRepetido = inscripciones.some(
    (registro) =>
      torneoSeleccionado &&
      Number(registro.torneoId) === torneoSeleccionado.id &&
      registro.tipo === tipo &&
      String(registro.participanteId) === participanteId
  )

  // Revisar los requisitos antes de habilitar el botón
  let mensajeBloqueo = ''

  if (!torneoSeleccionado) {

    mensajeBloqueo = 'Primero selecciona un torneo.'

  } else if (torneoSeleccionado.estado !== 'Abierto') {

    mensajeBloqueo =
      'Este torneo no está abierto para inscripciones.'

  } else if (
    inscripcionFueraDePlazo(
      obtenerFechaActual(),
      torneoSeleccionado.fechaCierre
    )
  ) {

    mensajeBloqueo =
      'El plazo de inscripción de este torneo terminó.'

  } else if (cuposDisponibles <= 0) {

    mensajeBloqueo =
      'No quedan cupos disponibles para este torneo.'

  } else if (tipo === '') {

    mensajeBloqueo =
      'Selecciona un tipo de participante.'

  } else if (
    tipo === 'jugador' &&
    torneoSeleccionado.integrantesMinimos > 1
  ) {

    mensajeBloqueo =
      'Este torneo requiere inscripción por equipo.'

  } else if (participanteId === '') {

    mensajeBloqueo =
      'Selecciona un jugador o equipo para continuar.'

  } else if (!participanteSeleccionado) {

    mensajeBloqueo =
      'No se encontró el participante seleccionado.'

  } else if (
    tipo === 'equipo' &&
    !participanteSeleccionado.activo
  ) {

    mensajeBloqueo =
      'El equipo está inactivo y no puede inscribirse.'

  } else if (
    tieneSancionActiva(
      participanteSeleccionado,
      obtenerFechaActual()
    )
  ) {

    mensajeBloqueo =
      'El participante tiene una sanción vigente.'

  } else if (
    tipo === 'equipo' &&
    !equipoCompleto(
      participanteSeleccionado,
      torneoSeleccionado.integrantesMinimos
    )
  ) {

    mensajeBloqueo =
      'El equipo no tiene la cantidad mínima de integrantes.'

  } else if (participanteRepetido) {

    mensajeBloqueo =
      'Este participante ya está inscrito en el torneo.'
  }

  const puedeConfirmar = mensajeBloqueo === ''

  // Guardar inscripciones en el navegador
  useEffect(() => {
    localStorage.setItem(
      claveInscripciones,
      JSON.stringify(inscripciones)
    )
  }, [inscripciones])

  // Cambiar torneo
  function cambiarTorneo(evento) {
    setTorneoId(evento.target.value)
    setTipo('')
    setParticipanteId('')
    setError('')
    setConfirmacion(null)
  }

  // Cambiar tipo de participante
  function cambiarTipo(evento) {
    setTipo(evento.target.value)
    setParticipanteId('')
    setError('')
    setConfirmacion(null)
  }

  // Cambiar participante
  function cambiarParticipante(evento) {
    setParticipanteId(evento.target.value)
    setError('')
    setConfirmacion(null)
  }

  // Confirmar inscripción
  function confirmarInscripcion(evento) {
    evento.preventDefault()

    setError('')
    setConfirmacion(null)

    // Validar todos los requisitos
    if (!puedeConfirmar) {
      setError(mensajeBloqueo)
      return
    }

    if (!torneoSeleccionado || !participanteSeleccionado) {
      setError('Debes seleccionar un participante válido.')
      return
    }

    // Comprobar el videojuego del equipo
    if (
      tipo === 'equipo' &&
      normalizarJuego(participanteSeleccionado.juego) !==
      normalizarJuego(torneoSeleccionado.juego)
    ) {
      setError(
        'El equipo no corresponde al juego del torneo.'
      )
      return
    }

    const idSeleccionado = Number(participanteId)

    const nombreParticipante =
      tipo === 'equipo'
        ? participanteSeleccionado.nombre
        : participanteSeleccionado.apodo

    // Evitar una inscripción duplicada
    const yaInscrito = inscripciones.some(
      (registro) =>
        Number(registro.torneoId) === torneoSeleccionado.id &&
        registro.tipo === tipo &&
        Number(registro.participanteId) === idSeleccionado
    )

    if (yaInscrito) {
      setError(
        'Este participante ya está inscrito en el torneo.'
      )
      return
    }

    // Generar identificador
    const nuevoId = inscripciones.length > 0
      ? Math.max(
          ...inscripciones.map((registro) => registro.id)
        ) + 1
      : 1

    const nuevaInscripcion = {
      id: nuevoId,
      torneoId: torneoSeleccionado.id,
      torneo: torneoSeleccionado.nombre,
      tipo: tipo,
      participanteId: idSeleccionado,
      participante: nombreParticipante,
      fecha: obtenerFechaActual()
    }

    // Registrar la inscripción
    setInscripciones([
      ...inscripciones,
      nuevaInscripcion
    ])

    setConfirmacion(nuevaInscripcion)

    // Limpiar participante seleccionado
    setParticipanteId('')
  }

  return (
    <div>

      <h2 className="mb-3">
        Inscripción a Torneos
      </h2>

      <p className="text-white-50 mb-4">
        Selecciona un torneo e inscribe a un jugador o equipo.
      </p>

      <div className="alert alert-info">
        Las inscripciones se guardan en este navegador.
        Los torneos se obtienen del catálogo compartido
        de eSports Arena Manager.
      </div>

      {/* FORMULARIO */}
      <div className="card mb-4">
        <div className="card-body">

          <h3 className="h5 mb-4">
            Formulario de inscripción
          </h3>

          <FormularioInscripcion
            tipo={tipo}
            equipoSeleccionado={equipoSeleccionado}
            integrantesMinimos={
              torneoSeleccionado?.integrantesMinimos ?? 1
            }
            onConfirmar={confirmarInscripcion}
            puedeConfirmar={puedeConfirmar}
            mensajeBloqueo={mensajeBloqueo}
          >

            <div className="row g-3">

              {/* SELECCIONAR TORNEO */}
              <div className="col-12 col-md-6">

                <label
                  htmlFor="torneoInscripcion"
                  className="form-label"
                >
                  Torneo
                </label>

                <select
                  id="torneoInscripcion"
                  className="form-select"
                  value={torneoId}
                  onChange={cambiarTorneo}
                >

                  <option value="">
                    Selecciona un torneo
                  </option>

                  {torneosData.map((torneo) => (
                    <option
                      key={torneo.id}
                      value={torneo.id}
                    >
                      {torneo.nombre}
                    </option>
                  ))}

                </select>

                <small className="text-secondary">
                  Selecciona el torneo en el que deseas participar.
                </small>

              </div>

              {/* SELECCIONAR TIPO */}
              <div className="col-12 col-md-6">

                <label
                  htmlFor="tipoParticipante"
                  className="form-label"
                >
                  Tipo de participante
                </label>

                <select
                  id="tipoParticipante"
                  className="form-select"
                  value={tipo}
                  onChange={cambiarTipo}
                >

                  <option value="">
                    Selecciona una opción
                  </option>

                  <option value="jugador">
                    Jugador
                  </option>

                  <option value="equipo">
                    Equipo
                  </option>

                </select>

              </div>

              {/* REQUISITOS DEL TORNEO */}
              {torneoSeleccionado && (

                <div className="col-12">

                  <div className="border rounded p-3 bg-light">

                    <h4 className="h6">
                      Requisitos del torneo
                    </h4>

                    <p className="mb-1">
                      <strong>Nombre:</strong>{' '}
                      {torneoSeleccionado.nombre}
                    </p>

                    <p className="mb-1">
                      <strong>Juego:</strong>{' '}
                      {torneoSeleccionado.juego}
                    </p>

                    <p className="mb-1">
                      <strong>Estado:</strong>{' '}
                      {torneoSeleccionado.estado}
                    </p>

                    <p className="mb-1">
                      <strong>Cupos disponibles:</strong>{' '}
                      {cuposDisponibles}
                    </p>

                    <p className="mb-1">
                      <strong>Cierre de inscripción:</strong>{' '}
                      {torneoSeleccionado.fechaCierre}
                    </p>

                    <p className="mb-0">
                      <strong>Integrantes mínimos:</strong>{' '}
                      {torneoSeleccionado.integrantesMinimos}
                    </p>

                  </div>

                </div>
              )}

              {/* SELECCIONAR PARTICIPANTE */}
              {tipo !== '' && (

                <div className="col-12">

                  <label
                    htmlFor="participanteInscripcion"
                    className="form-label"
                  >
                    {tipo === 'equipo'
                      ? 'Seleccionar equipo'
                      : 'Seleccionar jugador'}
                  </label>

                  <select
                    id="participanteInscripcion"
                    className="form-select"
                    value={participanteId}
                    onChange={cambiarParticipante}
                  >

                    <option value="">
                      {tipo === 'equipo'
                        ? 'Selecciona un equipo'
                        : 'Selecciona un jugador'}
                    </option>

                    {tipo === 'equipo'
                      ? equiposDelJuego.map((equipo) => (

                          <option
                            key={equipo.id}
                            value={equipo.id}
                          >
                            {equipo.nombre}
                          </option>

                        ))
                      : jugadores.map((jugador) => (

                          <option
                            key={jugador.id}
                            value={jugador.id}
                          >
                            {jugador.apodo}
                          </option>

                        ))}

                  </select>

                  {/* MENSAJE SI NO APARECEN EQUIPOS */}
                  {tipo === 'equipo' &&
                    equiposDelJuego.length === 0 && (

                      <div className="alert alert-warning mt-3 mb-0">

                        {equipos.length === 0 ? (

                          <span>
                            No hay equipos registrados.
                            Primero crea uno en Gestión de Equipos.
                          </span>

                        ) : (

                          <div>

                            <p className="mb-2">
                              Tienes {equipos.length} equipo(s)
                              registrados, pero ninguno corresponde
                              al videojuego{' '}
                              <strong>
                                {torneoSeleccionado?.juego}
                              </strong>.
                            </p>

                            <small>
                              Revisa el juego asignado a tus equipos
                              en Gestión de Equipos.
                            </small>

                          </div>

                        )}

                      </div>

                    )}

                </div>

              )}

            </div>

          </FormularioInscripcion>

          {/* ERRORES DE INSCRIPCIÓN */}
          {error && (
            <div className="alert alert-danger mt-3">
              {error}
            </div>
          )}

        </div>
      </div>

      {/* CONFIRMACIÓN */}
      {confirmacion && (

        <div className="alert alert-success">

          <h3 className="h5">
            Inscripción realizada correctamente
          </h3>

          <p className="mb-1">
            <strong>Torneo:</strong>{' '}
            {confirmacion.torneo}
          </p>

          <p className="mb-1">
            <strong>Participante:</strong>{' '}
            {confirmacion.participante}
          </p>

          <p className="mb-1">
            <strong>Tipo:</strong>{' '}
            {confirmacion.tipo}
          </p>

          <p className="mb-0">
            <strong>Fecha:</strong>{' '}
            {confirmacion.fecha}
          </p>

        </div>

      )}

      {/* LISTADO DE INSCRIPCIONES */}
      <div className="card">
        <div className="card-body">

          <h3 className="h5 mb-3">
            Inscripciones realizadas
          </h3>

          <p className="text-secondary">
            Total de inscripciones: {inscripciones.length}
          </p>

          {inscripciones.length === 0 ? (

            <p className="text-secondary">
              Todavía no existen inscripciones registradas.
            </p>

          ) : (

            <div className="table-responsive">

              <table className="table table-striped align-middle">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Torneo</th>
                    <th>Tipo</th>
                    <th>Participante</th>
                    <th>Fecha</th>
                  </tr>
                </thead>

                <tbody>

                  {inscripciones.map((registro) => (

                    <tr key={registro.id}>

                      <td>{registro.id}</td>
                      <td>{registro.torneo}</td>
                      <td>{registro.tipo}</td>
                      <td>{registro.participante}</td>
                      <td>{registro.fecha}</td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>
      </div>

    </div>
  )
}

export default Inscripcion
