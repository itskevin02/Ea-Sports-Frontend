
import { useState, useEffect } from 'react'

import { torneosService } from '../services/torneos'
import { equiposService } from '../services/equipos'
import { inscripcionesService } from '../services/inscripciones'

function ResumenInscripcionesApi() {

  const [torneos, setTorneos] = useState([])
  const [equipos, setEquipos] = useState([])
  const [inscripciones, setInscripciones] = useState([])

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    async function cargarDatos() {

      try {
        setCargando(true)
        setError('')

        const datosTorneos = await torneosService.listar()
        const datosEquipos = await equiposService.listar()
        const datosInscripciones =
          await inscripcionesService.listar()

        setTorneos(datosTorneos)
        setEquipos(datosEquipos)
        setInscripciones(datosInscripciones)

      } catch (err) {

        setError(err.message)

      } finally {

        setCargando(false)
      }
    }

    cargarDatos()

  }, [])

  return (
    <section className="card mb-4">

      <div className="card-body">

        <h3 className="h5 mb-3">
          Inscripciones registradas en el servidor
        </h3>

        <p className="text-secondary">
          Información obtenida desde Tournament, Team
          y Registration mediante Gateway.
        </p>

        {/* ESTADO DE CARGA */}
        {cargando && (
          <div className="alert alert-info">
            Cargando inscripciones del servidor...
          </div>
        )}

        {/* ERROR DE CONEXIÓN */}
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* DATOS RECIBIDOS */}
        {!cargando && !error && (

          <>

            <div className="row g-3 mb-4">

              <div className="col-12 col-md-4">
                <div className="border rounded p-3">
                  <p className="mb-1">Torneos</p>
                  <h4 className="mb-0">
                    {torneos.length}
                  </h4>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="border rounded p-3">
                  <p className="mb-1">Equipos</p>
                  <h4 className="mb-0">
                    {equipos.length}
                  </h4>
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="border rounded p-3">
                  <p className="mb-1">Inscripciones</p>
                  <h4 className="mb-0">
                    {inscripciones.length}
                  </h4>
                </div>
              </div>

            </div>

            {inscripciones.length === 0 ? (

              <div className="alert alert-info">
                No hay inscripciones registradas
                en el servidor.
              </div>

            ) : (

              <div className="table-responsive">

                <table className="table table-dark table-striped">

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Torneo</th>
                      <th>Equipo</th>
                      <th>Estado</th>
                    </tr>
                  </thead>

                  <tbody>

                    {inscripciones.map((inscripcion) => {

                      const torneo = torneos.find(
                        (item) =>
                          Number(item.id) ===
                          Number(inscripcion.torneoId)
                      )

                      const equipo = equipos.find(
                        (item) =>
                          Number(item.id) ===
                          Number(inscripcion.equipoId)
                      )

                      return (
                        <tr key={inscripcion.id}>

                          <td>{inscripcion.id}</td>

                          <td>
                            {torneo
                              ? torneo.nombre
                              : `Torneo ID ${inscripcion.torneoId}`}
                          </td>

                          <td>
                            {equipo
                              ? equipo.nombre
                              : `Equipo ID ${inscripcion.equipoId}`}
                          </td>

                          <td>{inscripcion.estado}</td>

                        </tr>
                      )
                    })}

                  </tbody>

                </table>

              </div>

            )}

          </>

        )}

      </div>

    </section>
  )
}

export default ResumenInscripcionesApi
