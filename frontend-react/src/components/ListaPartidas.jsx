
import { useState } from 'react'

function ListaPartidas({ partidas = [] }) {

  // Ronda que queremos visualizar
  const [rondaSeleccionada, setRondaSeleccionada] = useState('Todas')

  // Obtener las rondas existentes
  const rondas = [...new Set(
    partidas.map((partida) => partida.ronda)
  )]

  // Filtrar partidas según la ronda seleccionada
  const partidasFiltradas = partidas.filter((partida) => {
    return rondaSeleccionada === 'Todas' ||
      partida.ronda === rondaSeleccionada
  })

  return (
    <div className="card">
      <div className="card-body">

        <h3 className="h5 mb-3">
          Calendario de Partidas
        </h3>

        <p className="text-secondary">
          Consulta los enfrentamientos, horarios
          y estados de las partidas del torneo.
        </p>

        {partidas.length === 0 ? (

          <div className="alert alert-secondary mb-0">
            Todavía no hay partidas programadas
            para este torneo.
          </div>

        ) : (

          <>
            {/* SELECCIONAR RONDA */}
            <div className="mb-3">

              <label
                htmlFor="filtroRonda"
                className="form-label"
              >
                Seleccionar ronda
              </label>

              <select
                id="filtroRonda"
                className="form-select"
                value={rondaSeleccionada}
                onChange={(evento) =>
                  setRondaSeleccionada(evento.target.value)
                }
              >

                <option value="Todas">
                  Todas las rondas
                </option>

                {rondas.map((ronda) => (
                  <option key={ronda} value={ronda}>
                    {ronda}
                  </option>
                ))}

              </select>

            </div>

            {/* TABLA DE PARTIDAS */}
            <div className="table-responsive">

              <table className="table table-striped align-middle">

                <thead>
                  <tr>
                    <th>Ronda</th>
                    <th>Participante 1</th>
                    <th>Participante 2</th>
                    <th>Horario</th>
                    <th>Estado</th>
                  </tr>
                </thead>

                <tbody>

                  {partidasFiltradas.map((partida) => (
                    <tr key={partida.id}>

                      <td>{partida.ronda}</td>

                      <td>
                        {partida.participanteA ||
                          'Participante por definir'}
                      </td>

                      <td>
                        {partida.participanteB ||
                          'Participante por definir'}
                      </td>

                      <td>
                        {partida.horario || 'Por programar'}
                      </td>

                      <td>
                        {partida.estado || 'Pendiente'}
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </>

        )}

      </div>
    </div>
  )
}

export default ListaPartidas
