import { useState, useEffect } from 'react'

import { torneosService } from '../services/torneos'
import { juegosService } from '../services/juegos'
import { equiposService } from '../services/equipos'
import { inscripcionesService } from '../services/inscripciones'

import './Inicio.css'
import InicioComplementos from '../components/InicioComplementos'

function obtenerFechaActual() {

  const fecha = new Date()

  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')

  return `${anio}-${mes}-${dia}`
}

export function Inicio({
  onNavegar,
  onVerDetalle,
  esAdmin = false
}) {

  const [torneos, setTorneos] = useState([])
  const [equipos, setEquipos] = useState(null)
  const [inscripciones, setInscripciones] = useState(null)

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [avisoJuegos, setAvisoJuegos] = useState('')
  const [avisoEquipos, setAvisoEquipos] = useState('')
  const [avisoInscripciones, setAvisoInscripciones] = useState('')

  const fechaActual = obtenerFechaActual()

  useEffect(() => {

    async function cargarDatos() {

      try {

        setCargando(true)
        setError('')
        setAvisoJuegos('')

        const datosTorneos = await torneosService.listar()

        let datosJuegos = []

        try {

          datosJuegos = await juegosService.listar()

        } catch {

          setAvisoJuegos(
            'No se pudieron cargar los nombres de los juegos.'
          )
        }

        const torneosCompletos = datosTorneos.map((torneo) => {

          const juegoEncontrado = datosJuegos.find(
            (juego) =>
              Number(juego.id) === Number(torneo.juegoId)
          )

          return {
            ...torneo,
            juego: juegoEncontrado
              ? juegoEncontrado.nombre
              : `Juego ID ${torneo.juegoId}`
          }
        })

        setTorneos(torneosCompletos)

      } catch (err) {

        setError(err.message)

      } finally {

        setCargando(false)
      }
    }

    async function cargarEquipos() {

      try {

        setAvisoEquipos('')

        const datosEquipos = await equiposService.listar()

        setEquipos(datosEquipos)

      } catch {

        setEquipos(null)

        setAvisoEquipos(
          'No se pudieron cargar los equipos.'
        )
      }
    }

    async function cargarInscripciones() {

      try {

        setAvisoInscripciones('')

        const datosInscripciones =
          await inscripcionesService.listar()

        setInscripciones(datosInscripciones)

      } catch {

        setInscripciones(null)

        setAvisoInscripciones(
          'No se pudieron cargar las inscripciones.'
        )
      }
    }

    cargarDatos()
    cargarEquipos()
    cargarInscripciones()

  }, [])

  const torneosDisponibles = torneos.filter((torneo) => {

    return (
      torneo.estado.toLowerCase() === 'abierto' &&
      torneo.fechaCierre >= fechaActual
    )
  })

  const destacados = torneosDisponibles.slice(0, 3)

  const imagenPortada =
    `${import.meta.env?.BASE_URL || '/'}torneos/fc26.jpg`

  return (
    <div className="inicio">

      {/* PORTADA PRINCIPAL */}
      <section className="inicio-hero mb-4">

        <div className="row align-items-center g-4">

          <div className="col-12 col-lg-7">

            <span className="inicio-etiqueta">
              ESPORTS ARENA MANAGER
            </span>

            <h1 className="inicio-titulo mt-3">
              Tu próxima competencia
              <span> comienza aquí.</span>
            </h1>

            <p className="inicio-descripcion mt-3">
              Explora torneos de videojuegos, crea tu equipo
              y participa en nuevas competencias desde
              una sola plataforma.
            </p>

            <div className="d-flex flex-wrap gap-3 mt-4">

              <button
                type="button"
                className="btn btn-primary px-4 py-2"
                onClick={() => onNavegar('torneos')}
              >
                Explorar torneos
              </button>

              <button
                type="button"
                className="btn btn-outline-light px-4 py-2"
                onClick={() => onNavegar('inscripcion')}
              >
                Inscribirme
              </button>

            </div>

          </div>

          <div className="col-12 col-lg-5">

            <div className="inicio-portada-imagen">

              <img
                src={imagenPortada}
                alt="Competencias de videojuegos"
              />

              <div className="inicio-portada-texto">
                <span>
                  COMPITE • PARTICIPA • GANA
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ESTADISTICAS */}
      <section className="mb-5">

        <div className="row g-3">

          {/* TORNEOS REGISTRADOS */}
          <div className="col-12 col-sm-6 col-lg-3">

            <div className="inicio-estadistica">

              <p>Torneos registrados</p>

              <h2>{torneos.length}</h2>

              <small>
                Registrados en el servidor
              </small>

            </div>

          </div>

          {/* TORNEOS DISPONIBLES */}
          <div className="col-12 col-sm-6 col-lg-3">

            <div className="inicio-estadistica">

              <p>Torneos disponibles</p>

              <h2>{torneosDisponibles.length}</h2>

              <small>
                Abiertos dentro del plazo
              </small>

            </div>

          </div>

          {/* EQUIPOS DESDE TEAM */}
          <div className="col-12 col-sm-6 col-lg-3">

            <div className="inicio-estadistica">

              <p>Equipos registrados</p>

              <h2>
                {equipos === null
                  ? '—'
                  : equipos.length}
              </h2>

              <small>
                {avisoEquipos ||
                  'Registrados en el servidor'}
              </small>

            </div>

          </div>

          {/* INSCRIPCIONES DESDE REGISTRATION */}
          <div className="col-12 col-sm-6 col-lg-3">

            <div className="inicio-estadistica">

              <p>Inscripciones registradas</p>

              <h2>
                {inscripciones === null
                  ? '—'
                  : inscripciones.length}
              </h2>

              <small>
                {avisoInscripciones ||
                  'Registradas en el servidor'}
              </small>

            </div>

          </div>

        </div>

      </section>

      {/* TORNEOS DESTACADOS */}
      <section className="mb-5">

        <div className="d-flex justify-content-between align-items-center gap-3 mb-4 flex-wrap">

          <div>

            <h2 className="inicio-seccion-titulo">
              Torneos destacados
            </h2>

            <p className="inicio-seccion-descripcion mb-0">
              Competiciones abiertas que todavía están
              dentro del plazo de inscripción.
            </p>

          </div>

          <button
            type="button"
            className="btn btn-outline-light"
            onClick={() => onNavegar('torneos')}
          >
            Ver todos los torneos
          </button>

        </div>

        {/* ESTADO DE CARGA */}
        {cargando && (
          <div className="alert alert-info">
            Cargando torneos...
          </div>
        )}

        {/* ERROR DEL SERVIDOR */}
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* AVISO SI GAME NO RESPONDE */}
        {avisoJuegos && !error && (
          <div className="alert alert-warning">
            {avisoJuegos} Se mostrarán sus identificadores.
          </div>
        )}

        {/* RESULTADOS */}
        {!cargando && !error && (

          destacados.length === 0 ? (

            <div className="inicio-mensaje">
              Actualmente no hay torneos abiertos
              dentro del plazo de inscripción.
              Puedes revisar el catálogo completo.
            </div>

          ) : (

            <div className="row g-4">

              {destacados.map((torneo) => (

                <div
                  className="col-12 col-md-6 col-lg-4"
                  key={torneo.id}
                >

                  <div className="inicio-torneo">

                    {torneo.imagen ? (

                      <img
                        src={torneo.imagen}
                        alt={torneo.nombre}
                        className="inicio-torneo-imagen"
                      />

                    ) : (

                      <div
                        className="inicio-torneo-imagen bg-secondary d-flex align-items-center justify-content-center"
                      >
                        Imagen no disponible
                      </div>

                    )}

                    <div className="inicio-torneo-contenido">

                      <span className="badge bg-success mb-2">
                        Torneo abierto
                      </span>

                      <h3 className="h5">
                        {torneo.nombre}
                      </h3>

                      <p className="inicio-torneo-juego">
                        {torneo.juego}
                      </p>

                      <div className="inicio-torneo-info">

                        <span>
                          Equipos permitidos
                        </span>

                        <strong>
                          {torneo.cantidadEquipos}
                        </strong>

                      </div>

                      <div className="inicio-torneo-info">

                        <span>
                          Fecha de inicio
                        </span>

                        <strong>
                          {torneo.fechaInicio}
                        </strong>

                      </div>

                      <div className="inicio-torneo-info">

                        <span>
                          Cierre de inscripción
                        </span>

                        <strong>
                          {torneo.fechaCierre}
                        </strong>

                      </div>

                      <button
                        type="button"
                        className="btn btn-primary w-100 mt-3"
                        onClick={() => onVerDetalle(torneo)}
                      >
                        Ver detalles
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )
        )}

      </section>

      {/* PROXIMOS CIERRES Y VIDEO */}
      <InicioComplementos
        torneos={torneos}
        onVerDetalle={onVerDetalle}
      />

      {/* ACCESOS RAPIDOS */}
      <section className="mb-4">

        <h2 className="inicio-seccion-titulo mb-4">
          Gestiona tu experiencia
        </h2>

        <div className="row g-3">

          {/* GESTION DE EQUIPOS */}
          <div className="col-12 col-md-4">

            <div className="inicio-acceso">

              <div className="inicio-acceso-icono">
                <span>01</span>
              </div>

              <h3 className="h5">
                Gestión de equipos
              </h3>

              <p>
                Crea y administra equipos registrados
                en la plataforma.
              </p>

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => onNavegar('equipos')}
              >
                Administrar equipos
              </button>

            </div>

          </div>

          {/* PERFIL */}
          <div className="col-12 col-md-4">

            <div className="inicio-acceso">

              <div className="inicio-acceso-icono">
                <span>02</span>
              </div>

              <h3 className="h5">
                Mi perfil
              </h3>

              <p>
                Consulta tus datos como jugador
                y mantén tu información actualizada.
              </p>

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => onNavegar('perfil')}
              >
                Ir a mi perfil
              </button>

            </div>

          </div>

          {/* SOLO PARA ADMINISTRADORES */}
          {esAdmin && (

            <div className="col-12 col-md-4">

              <div className="inicio-acceso">

                <div className="inicio-acceso-icono">
                  <span>03</span>
                </div>

                <h3 className="h5">
                  Administración
                </h3>

                <p>
                  Consulta y administra los registros
                  disponibles en la plataforma.
                </p>

                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => onNavegar('administracion')}
                >
                  Panel de administración
                </button>

              </div>

            </div>

          )}

        </div>

      </section>

      {/* PIE DE PAGINA */}
      <footer className="inicio-footer">
        eSports Arena Manager — Plataforma de gestión de torneos
      </footer>

    </div>
  )
}
