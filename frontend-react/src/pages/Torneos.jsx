
import { useState } from 'react'
import { torneosData } from '../data/torneos'
import { TarjetaTorneo } from '../components/TarjetaTorneo'

export const Torneos = ({ onVerDetalle }) => {

  const [busqueda, setBusqueda] = useState('')
  const [juegoFiltro, setJuegoFiltro] = useState('Todos')
  const [estadoFiltro, setEstadoFiltro] = useState('Todos')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')

  // Juegos disponibles para el filtro
  const juegos = [
    ...new Set(torneosData.map((torneo) => torneo.juego))
  ]

  // Validar las fechas ingresadas
  const fechasInvalidas =
    fechaDesde !== '' &&
    fechaHasta !== '' &&
    fechaDesde > fechaHasta

  // Aplicar los filtros
  const torneosFiltrados = torneosData.filter((torneo) => {

    const coincideTexto =
      torneo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      torneo.juego.toLowerCase().includes(busqueda.toLowerCase())

    const coincideJuego =
      juegoFiltro === 'Todos' ||
      torneo.juego === juegoFiltro

    const coincideEstado =
      estadoFiltro === 'Todos' ||
      torneo.estado === estadoFiltro

    // El rango utiliza la fecha de inicio del torneo
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

  // Restablecer los filtros
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

      {/* FILTROS DE BÚSQUEDA */}
      <div className="card mb-4">
        <div className="card-body">

          <h3 className="h5 mb-3">
            Buscar y filtrar torneos
          </h3>

          <div className="row g-3">

            {/* BUSCADOR */}
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

            {/* FILTRAR JUEGO */}
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

            {/* FILTRAR ESTADO */}
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

            {/* FECHA DESDE */}
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

            {/* FECHA HASTA */}
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

            {/* MENSAJE DE FECHAS INVÁLIDAS */}
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

            {/* LIMPIAR FILTROS */}
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

      {/* RESULTADOS */}
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
              No se encontraron torneos con esos criterios.
            </div>

          </div>

        )}

      </div>

    </div>
  )
}
