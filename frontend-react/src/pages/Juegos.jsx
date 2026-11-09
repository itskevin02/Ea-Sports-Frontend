
import { useState, useEffect } from 'react'
import { juegosService } from '../services/juegos'

function Juegos() {

  const [juegos, setJuegos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  // Cargar los juegos desde Spring Boot
  useEffect(() => {

    async function cargarJuegos() {
      try {
        setCargando(true)
        setError('')

        const datos = await juegosService.listar()
        setJuegos(datos)

      } catch (error) {
        setError(error.message)

      } finally {
        setCargando(false)
      }
    }

    cargarJuegos()

  }, [])

  return (
    <div className="container">

      <h2 className="h4 mb-4">
        Juegos disponibles
      </h2>

      {cargando && (
        <div className="alert alert-info">
          Cargando videojuegos...
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          Error al cargar los videojuegos: {error}
        </div>
      )}

      {!cargando && !error && juegos.length === 0 && (
        <div className="alert alert-secondary">
          No hay videojuegos registrados.
        </div>
      )}

      {!cargando && !error && juegos.length > 0 && (
        <div className="row g-3">

          {juegos.map((juego) => (
            <div className="col-12 col-md-6 col-lg-4" key={juego.id}>

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

                  <p className="mb-0">
                    Estado: {juego.estado}
                  </p>

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
