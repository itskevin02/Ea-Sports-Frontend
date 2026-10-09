
import { useState, useEffect } from 'react'

import {
  cuposDisponibles as calcularCuposDisponibles,
  inscripcionFueraDePlazo,
  equipoCompleto
} from '../logica/validarInscripcion'

// Torneos de ejemplo para la EP2
// Se integrarán con los torneos de Martín más adelante
const torneosEjemplo = [
  {
    id: 1,
    nombre: 'Copa Fortnite Dúos',
    juego: 'Fortnite',
    estado: 'Abierto',
    cupoMaximo: 16,
    inscritos: 8,
    fechaCierre: '2026-12-20',
    integrantesMinimos: 2
  },
  {
    id: 2,
    nombre: 'Copa EA Sports FC 24',
    juego: 'EA Sports FC',
    estado: 'Abierto',
    cupoMaximo: 32,
    inscritos: 20,
    fechaCierre: '2026-11-10',
    integrantesMinimos: 1
  },
  {
    id: 3,
    nombre: 'Liga VALORANT',
    juego: 'VALORANT',
    estado: 'Abierto',
    cupoMaximo: 8,
    inscritos: 8,
    fechaCierre: '2026-12-15',
    integrantesMinimos: 5
  },
  {
    id: 4,
    nombre: 'Torneo Counter-Strike 2',
    juego: 'Counter-Strike 2',
    estado: 'Abierto',
    cupoMaximo: 12,
    inscritos: 4,
    fechaCierre: '2026-09-30',
    integrantesMinimos: 5
  }
]

// Jugadores de ejemplo para realizar pruebas
const jugadoresEjemplo = [
  { id: 9001, apodo: 'Jugador01' },
  { id: 9002, apodo: 'Jugador02' },
  { id: 9003, apodo: 'Jugador03' },
  { id: 9004, apodo: 'Jugador04' },
  { id: 9005, apodo: 'Jugador05' },
  { id: 9006, apodo: 'Jugador06' }
]

function cargarDatos(clave) {
  try {
    const datos = localStorage.getItem(clave)

    if (datos) {
      const lista = JSON.parse(datos)
      return Array.isArray(lista) ? lista : []
    }
  } catch {
    return []
  }

  return []
}

function cargarJugadores() {
  const jugadores = cargarDatos('esports_jugadores')

  return jugadores.length > 0
    ? jugadores
    : jugadoresEjemplo
}

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
    () => cargarDatos('esports_inscripciones')
  )

  const [torneoId, setTorneoId] = useState('')
  const [tipo, setTipo] = useState('')
  const [participanteId, setParticipanteId] = useState('')

  const [error, setError] = useState('')
  const [confirmacion, setConfirmacion] = useState(null)

  // Obtener el torneo seleccionado
  const torneoSeleccionado = torneosEjemplo.find(
    (torneo) => torneo.id === Number(torneoId)
  )

  // Filtrar los equipos del juego seleccionado
  const equiposDelJuego = equipos.filter(
    (equipo) =>
      torneoSeleccionado &&
      equipo.juego === torneoSeleccionado.juego
  )

  // Contar las inscripciones locales del torneo
  const inscritosLocales = inscripciones.filter(
    (registro) =>
      torneoSeleccionado &&
      registro.torneoId === torneoSeleccionado.id
  ).length

  // Primera función probada con Jasmine
  const cuposDisponibles = torneoSeleccionado
    ? calcularCuposDisponibles(
        torneoSeleccionado.cupoMaximo,
        torneoSeleccionado.inscritos,
        inscritosLocales
      )
    : 0

  // Guardar inscripciones en localStorage
  useEffect(() => {
    localStorage.setItem(
      'esports_inscripciones',
      JSON.stringify(inscripciones)
    )
  }, [inscripciones])

  function cambiarTorneo(evento) {
    setTorneoId(evento.target.value)
    setTipo('')
    setParticipanteId('')
    setError('')
    setConfirmacion(null)
  }

  function cambiarTipo(evento) {
    setTipo(evento.target.value)
    setParticipanteId('')
    setError('')
    setConfirmacion(null)
  }

  function confirmarInscripcion(evento) {
    evento.preventDefault()

    setError('')
    setConfirmacion(null)

    if (!torneoSeleccionado) {
      setError('Debes seleccionar un torneo.')
      return
    }

    if (torneoSeleccionado.estado !== 'Abierto') {
      setError('Este torneo no está abierto para inscripciones.')
      return
    }

    // Segunda función probada con Jasmine
    if (
      inscripcionFueraDePlazo(
        obtenerFechaActual(),
        torneoSeleccionado.fechaCierre
      )
    ) {
      setError('El plazo de inscripción de este torneo terminó.')
      return
    }

    if (cuposDisponibles <= 0) {
      setError('No quedan cupos disponibles para este torneo.')
      return
    }

    if (tipo === '') {
      setError('Debes seleccionar un tipo de participante.')
      return
    }

    if (participanteId === '') {
      setError('Debes seleccionar un participante.')
      return
    }

    const idSeleccionado = Number(participanteId)

    let participante = null
    let nombreParticipante = ''

    if (tipo === 'equipo') {
      participante = equipos.find(
        (equipo) => equipo.id === idSeleccionado
      )

      if (!participante) {
        setError('No se encontró el equipo seleccionado.')
        return
      }

      if (!participante.activo) {
        setError('El equipo está inactivo y no puede inscribirse.')
        return
      }

      if (participante.sancionActiva === true) {
        setError('El equipo tiene una sanción vigente.')
        return
      }

      // Tercera función probada con Jasmine
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

      if (torneoSeleccionado.integrantesMinimos > 1) {
        setError('Este torneo requiere inscripción por equipo.')
        return
      }

      if (participante.sancionActiva === true) {
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

    setInscripciones([
      ...inscripciones,
      nuevaInscripcion
    ])

    setConfirmacion(nuevaInscripcion)
  }

  return (
    <div>
      <h2 className="mb-3">Inscripción a Torneos</h2>

      <p className="text-white-50 mb-4">
        Selecciona un torneo e inscribe a un jugador o equipo.
      </p>

      <div className="alert alert-info">
        Los torneos y algunos jugadores son datos de prueba
        para la EP2. Las inscripciones y equipos creados
        se guardan en este navegador.
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h3 className="h5 mb-4">
            Formulario de inscripción
          </h3>

          <form onSubmit={confirmarInscripcion} noValidate>
            <div className="row g-3">

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

                  {torneosEjemplo.map((torneo) => (
                    <option key={torneo.id} value={torneo.id}>
                      {torneo.nombre}
                    </option>
                  ))}
                </select>
              </div>

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

              {torneoSeleccionado && (
                <div className="col-12">
                  <div className="border rounded p-3 bg-light">
                    <h4 className="h6">
                      Requisitos del torneo
                    </h4>

                    <p className="mb-1">
                      Juego: {torneoSeleccionado.juego}
                    </p>

                    <p className="mb-1">
                      Cupos disponibles: {cuposDisponibles}
                    </p>

                    <p className="mb-1">
                      Cierre de inscripción:{' '}
                      {torneoSeleccionado.fechaCierre}
                    </p>

                    <p className="mb-0">
                      Integrantes mínimos por equipo:{' '}
                      {torneoSeleccionado.integrantesMinimos}
                    </p>
                  </div>
                </div>
              )}

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

            <button
              type="submit"
              className="btn btn-primary mt-4"
            >
              Confirmar inscripción
            </button>
          </form>

          {error && (
            <div className="alert alert-danger mt-3">
              {error}
            </div>
          )}
        </div>
      </div>

      {confirmacion && (
        <div className="alert alert-success">
          <h3 className="h5">
            Inscripción realizada correctamente
          </h3>

          <p className="mb-1">
            Torneo: {confirmacion.torneo}
          </p>

          <p className="mb-1">
            Participante: {confirmacion.participante}
          </p>

          <p className="mb-1">
            Tipo: {confirmacion.tipo}
          </p>

          <p className="mb-0">
            Fecha: {confirmacion.fecha}
          </p>
        </div>
      )}

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
