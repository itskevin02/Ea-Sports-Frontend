
import { useState, useEffect } from 'react'
import { torneosService } from '../services/torneos'
import { juegosService } from '../services/juegos'
import { TarjetaTorneo } from '../components/TarjetaTorneo'

function nombreJuego(torneo) {
  if (torneo.juego) {
    return torneo.juego
  }

  if (torneo.juegoId) {
    return `Juego ID ${torneo.juegoId}`
  }

  return 'Sin juego asociado'
}

export const Torneos = ({ onVerDetalle }) => {

  const [torneos, setTorneos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [avisoJuegos, setAvisoJuegos] = useState('')

  const [busqueda, setBusqueda] = useState('')
  const [juegoFiltro, setJuegoFiltro] = useState('Todos')
  const [estadoFiltro, setEstadoFiltro] = useState('Todos')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  useEffect(() => {

    async function cargarTorneos() {
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
            (juego) => juego.id === torneo.juegoId
          )

          return {
            ...torneo,
            juego: juegoEncontrado
              ? juegoEncontrado.nombre
              : null
          }
        })

        setTorneos(torneosCompletos)

      } catch (err) {
        setError(err.message)

      } finally {
        setCargando(false)
      }
    }

    cargarTorneos()

  }, [])

  const juegos = [
    ...new Set(torneos.map((torneo) => nombreJuego(torneo)))
  ]

  const fechasInvalidas =
    fechaDesde !== '' &&
    fechaHasta !== '' &&
    fechaDesde > fechaHasta

  const torneosFiltrados = torneos.filter((torneo) => {

    const juego = nombreJuego(torneo)

    const coincideTexto =
      torneo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      juego.toLowerCase().includes(busqueda.toLowerCase())

    const coincideJuego =
      juegoFiltro === 'Todos' ||
      juego === juegoFiltro

    const coincideEstado =
      estadoFiltro === 'Todos' ||
      torneo.estado.toLowerCase() === estadoFiltro.toLowerCase()

    const coincideDesde =
      fechaDesde === '' ||
      torneo.fechaInicio >= fechaDesde

    const coincideHasta =
      fechaHasta === '' ||
      torneo.fechaInicio <= fechaHasta

    return (
      !fechasInvalidas &&
      coincideTexto &&
      coincideJuego &&
      coincideEstado &&
      coincideDesde &&
      coincideHasta
    )
  })

  function limpiarFiltros() {
    setBusqueda('')
    setJuegoFiltro('Todos')
    setEstadoFiltro('Todos')
    setFechaDesde('')
    setFechaHasta('')
  }

  return (
    <div>

      <h2 className="h4 mb-4 border-bottom pb-2">
        Torneos Disponibles
      </h2>

      {/* FILTROS DE BUSQUEDA */}
      <div className="card mb-4 formulario-ep3">
        <div className="card-body">

          <h3 className="h5 mb-3">
            Buscar y filtrar torneos
          </h3>

          <div className="row g-3">

            <div className="col-12 col-lg-6">
              <label
                htmlFor="buscarTorneo"
                className="form-label"
              >
                Buscar torneo
              </label>

              <input
                type="text"
                id="buscarTorneo"
                className="form-control"
                placeholder="Buscar por nombre o juego..."
                value={busqueda}
                onChange={(evento) =>
                  setBusqueda(evento.target.value)
                }
              />
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label
                htmlFor="filtroJuego"
                className="form-label"
              >
                Filtrar por juego
              </label>

              <select
                id="filtroJuego"
                className="form-select"
                value={juegoFiltro}
                onChange={(evento) =>
                  setJuegoFiltro(evento.target.value)
                }
              >
                <option value="Todos">
                  Todos los juegos
                </option>

                {juegos.map((juego) => (
                  <option key={juego} value={juego}>
                    {juego}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label
                htmlFor="filtroEstado"
                className="form-label"
              >
                Filtrar por estado
              </label>

              <select
                id="filtroEstado"
                className="form-select"
                value={estadoFiltro}
                onChange={(evento) =>
                  setEstadoFiltro(evento.target.value)
                }
              >
                <option value="Todos">
                  Todos los estados
                </option>
                <option value="Abierto">
                  Abiertos
                </option>
                <option value="Cerrado">
                  Cerrados
                </option>
                <option value="En curso">
                  En curso
                </option>
                <option value="Finalizado">
                  Finalizados
                </option>
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label
                htmlFor="fechaDesde"
                className="form-label"
              >
                Fecha de inicio desde
              </label>

              <input
                type="date"
                id="fechaDesde"
                className="form-control"
                value={fechaDesde}
                onChange={(evento) =>
                  setFechaDesde(evento.target.value)
                }
              />
            </div>

            <div className="col-12 col-md-6">
              <label
                htmlFor="fechaHasta"
                className="form-label"
              >
                Fecha de inicio hasta
              </label>

              <input
                type="date"
                id="fechaHasta"
                className="form-control"
                value={fechaHasta}
                onChange={(evento) =>
                  setFechaHasta(evento.target.value)
                }
              />
            </div>

            {fechasInvalidas && (
              <div className="col-12">
                <div
                  className="alert alert-danger mb-0"
                  role="alert"
                >
                  La fecha inicial no puede ser posterior
                  a la fecha final.
                </div>
              </div>
            )}

            <div className="col-12 text-end">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={limpiarFiltros}
              >
                Limpiar filtros
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ESTADO DE CARGA */}
      {cargando && (
        <div className="alert alert-info">
          Cargando torneos...
        </div>
      )}

      {/* ERROR DE CONEXION */}
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
        <>
          <p className="text-white-50 mb-3">
            Torneos encontrados: {torneosFiltrados.length}
          </p>

          <div className="row">
            {torneosFiltrados.length > 0 ? (

              torneosFiltrados.map((torneo) => (
                <TarjetaTorneo
                  key={torneo.id}
                  torneo={torneo}
                  onVerDetalle={onVerDetalle}
                />
              ))

            ) : (
              <div className="col-12">
                <div className="alert alert-secondary text-center">
                  {torneos.length === 0
                    ? 'No hay torneos registrados en el servidor.'
                    : 'No se encontraron torneos con esos criterios.'}
                </div>
              </div>
            )}
          </div>
        </>
      )}

    </div>
  )
}
