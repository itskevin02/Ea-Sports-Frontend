
import { useState, useEffect } from 'react'

import { torneosData } from '../data/torneos'

import {
  cuposDisponibles as calcularCuposDisponibles,
  inscripcionFueraDePlazo,
  equipoCompleto
} from '../logica/validarInscripcion'

import { tieneSancionActiva } from '../logica/sanciones'

import FormularioInscripcion from '../components/FormularioInscripcion'

// Jugadores de ejemplo
const jugadoresEjemplo = [
  { id: 9001, apodo: 'Jugador01' },
  { id: 9002, apodo: 'Jugador02' },
  { id: 9003, apodo: 'Jugador03' },
  { id: 9004, apodo: 'Jugador04' },
  { id: 9005, apodo: 'Jugador05' },
  { id: 9006, apodo: 'Jugador06' }
]

const claveInscripciones = 'esports_inscripciones_ep2'

// Cargar datos guardados
function cargarDatos(clave) {
  try {
    const datos = localStorage.getItem(clave)

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

// Cargar jugadores registrados
function cargarJugadores() {
  const jugadores = cargarDatos('esports_jugadores')

  if (jugadores.length > 0) {
    return jugadores
  }

  return jugadoresEjemplo
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

  const [equipos] = useState(
    () => cargarDatos('esports_equipos')
  )

  const [inscripciones, setInscripciones] = useState(
    () => cargarDatos(claveInscripciones)
  )

  const [torneoId, setTorneoId] = useState('')
  const [tipo, setTipo] = useState('')
  const [participanteId, setParticipanteId] = useState('')

  const [error, setError] = useState('')
  const [confirmacion, setConfirmacion] = useState(null)

  // Torneo seleccionado
  const torneoSeleccionado = torneosData.find(
    (torneo) => torneo.id === Number(torneoId)
  )

  // Equipos del juego correspondiente
  const equiposDelJuego = equipos.filter(
    (equipo) =>
      torneoSeleccionado &&
      equipo.juego === torneoSeleccionado.juego
  )

  // Equipo seleccionado para la inscripción
  const equipoSeleccionado = equipos.find(
    (equipo) =>
      String(equipo.id) === participanteId
  )

  // Cantidad de inscripciones locales
  const inscritosLocales = inscripciones.filter(
    (registro) =>
      torneoSeleccionado &&
      registro.torneoId === torneoSeleccionado.id
  ).length

  // Calcular cupos disponibles
  const cuposDisponibles = torneoSeleccionado
    ? calcularCuposDisponibles(
        torneoSeleccionado.cupos,
        torneoSeleccionado.inscritos,
        inscritosLocales
      )
    : 0

  // Guardar inscripciones
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

  // Confirmar inscripción
  function confirmarInscripcion(evento) {
    evento.preventDefault()

    setError('')
    setConfirmacion(null)

    // Validar torneo
    if (!torneoSeleccionado) {
      setError('Debes seleccionar un torneo.')
      return
    }

    if (torneoSeleccionado.estado !== 'Abierto') {
      setError(
        'Este torneo no está abierto para inscripciones.'
      )
      return
    }

    // Validar fecha
    if (
      inscripcionFueraDePlazo(
        obtenerFechaActual(),
        torneoSeleccionado.fechaCierre
      )
    ) {
      setError(
        'El plazo de inscripción de este torneo terminó.'
      )
      return
    }

    // Validar cupos
    if (cuposDisponibles <= 0) {
      setError(
        'No quedan cupos disponibles para este torneo.'
      )
      return
    }

    // Validar tipo
    if (tipo === '') {
      setError(
        'Debes seleccionar un tipo de participante.'
      )
      return
    }

    // Validar participante
    if (participanteId === '') {
      setError('Debes seleccionar un participante.')
      return
    }

    const idSeleccionado = Number(participanteId)

    let participante = null
    let nombreParticipante = ''

    // Inscripción por equipo
    if (tipo === 'equipo') {

      participante = equipos.find(
        (equipo) => equipo.id === idSeleccionado
      )

      if (!participante) {
        setError('No se encontró el equipo seleccionado.')
        return
      }

      if (participante.juego !== torneoSeleccionado.juego) {
        setError(
          'El equipo no corresponde al juego del torneo.'
        )
        return
      }

      if (!participante.activo) {
        setError(
          'El equipo está inactivo y no puede inscribirse.'
        )
        return
      }

      // Validar sanciones
      if (
        tieneSancionActiva(
          participante,
          obtenerFechaActual()
        )
      ) {
        setError('El equipo tiene una sanción vigente.')
        return
      }

      // Validar integrantes del equipo
      if (
        !equipoCompleto(
          participante,
          torneoSeleccionado.integrantesMinimos
        )
      ) {
        setError(
          'El equipo no tiene la cantidad mínima de integrantes.'
        )
        return
      }

      nombreParticipante = participante.nombre

    } else if (tipo === 'jugador') {

      participante = jugadores.find(
        (jugador) => jugador.id === idSeleccionado
      )

      if (!participante) {
        setError('No se encontró el jugador seleccionado.')
        return
      }

      // No permitir jugadores individuales en torneos de equipo
      if (torneoSeleccionado.integrantesMinimos > 1) {
        setError(
          'Este torneo requiere inscripción por equipo.'
        )
        return
      }

      // Validar sanciones del jugador
      if (
        tieneSancionActiva(
          participante,
          obtenerFechaActual()
        )
      ) {
        setError('El jugador tiene una sanción vigente.')
        return
      }

      nombreParticipante = participante.apodo

    } else {
      setError('El tipo de participante no es válido.')
      return
    }

    // Evitar inscripciones duplicadas
    const inscripcionRepetida = inscripciones.some(
      (registro) =>
        registro.torneoId === torneoSeleccionado.id &&
        registro.tipo === tipo &&
        registro.participanteId === idSeleccionado
    )

    if (inscripcionRepetida) {
      setError(
        'Este participante ya está inscrito en el torneo.'
      )
      return
    }

    // Generar nuevo ID
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

    // Guardar nueva inscripción
    setInscripciones([
      ...inscripciones,
      nuevaInscripcion
    ])

    setConfirmacion(nuevaInscripcion)
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

              {/* TIPO DE PARTICIPANTE */}
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

              {/* SELECCIONAR JUGADOR O EQUIPO */}
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
                    onChange={(evento) => {
                      setParticipanteId(evento.target.value)
                      setError('')
                      setConfirmacion(null)
                    }}
                  >
                    <option value="">
                      Selecciona un participante
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

                  {tipo === 'equipo' &&
                    equiposDelJuego.length === 0 && (
                      <small className="text-danger">
                        No tienes equipos registrados
                        para este juego. Primero crea uno
                        en Gestión de Equipos.
                      </small>
                    )}

                </div>
              )}

            </div>

            {/* El botón Confirmar inscripción
                lo agrega FormularioInscripcion */}

          </FormularioInscripcion>

          {/* MENSAJES DE ERROR */}
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

      {/* INSCRIPCIONES REGISTRADAS */}
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
