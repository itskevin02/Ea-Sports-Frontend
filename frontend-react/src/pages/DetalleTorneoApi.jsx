
import { useState, useEffect } from 'react'
import { torneosService } from '../services/torneos'

function DetalleTorneoApi({ torneoId, onVolver }) {

  const [torneo, setTorneo] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    async function cargarTorneo() {
      try {
        setCargando(true)
        setError('')

        const datos = await torneosService.obtener(torneoId)
        setTorneo(datos)

      } catch (err) {
        setError(err.message)

      } finally {
        setCargando(false)
      }
    }

    cargarTorneo()

  }, [torneoId])

  if (cargando) {
    return (
      <div className="alert alert-info">
        Cargando detalle del torneo...
      </div>
    )
  }

  if (error || !torneo) {
    return (
      <div>
        <div className="alert alert-danger">
          {error || 'No se encontró el torneo.'}
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={onVolver}
        >
          Volver a Torneos
        </button>
      </div>
    )
  }

  return (
    <div>

      <h2 className="h4 mb-4">
        Detalle del Torneo
      </h2>

      <div className="card">
        <div className="card-body">

          <h3 className="h4 mb-4">
            {torneo.nombre}
          </h3>

          {torneo.imagen && (
            <img
              src={torneo.imagen}
              alt={torneo.nombre}
              className="img-fluid rounded mb-4"
              style={{
                maxHeight: '300px',
                objectFit: 'cover'
              }}
            />
          )}

          <p>
            <strong>ID del torneo:</strong> {torneo.id}
          </p>

          <p>
            <strong>Juego asociado:</strong> ID {torneo.juegoId}
          </p>

          <p>
            <strong>Plataforma:</strong> {torneo.plataforma}
          </p>

          <p>
            <strong>Ubicación:</strong> {torneo.ubicacion}
          </p>

          <p>
            <strong>Estado:</strong> {torneo.estado}
          </p>

          <p>
            <strong>Equipos permitidos:</strong>{' '}
            {torneo.cantidadEquipos}
          </p>

          <p>
            <strong>Fecha de inicio:</strong>{' '}
            {torneo.fechaInicio}
          </p>

          <p>
            <strong>Cierre de inscripción:</strong>{' '}
            {torneo.fechaCierre}
          </p>

          <hr />

          <h4 className="h5">
            Descripción
          </h4>

          <p>{torneo.descripcion}</p>

        </div>
      </div>

      <div className="text-center mt-4">
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={onVolver}
        >
          Volver a Torneos
        </button>
      </div>

    </div>
  )
}

export default DetalleTorneoApi
