
function ListaParticipantes({
  estado,
  participantes = [],
  totalInscritos = 0
}) {

  // Comprobar si el torneo permite ver participantes
  const inscripcionesCerradas =
    estado === 'Cerrado' ||
    estado === 'En curso' ||
    estado === 'Finalizado'

  return (
    <div className="card mb-4">
      <div className="card-body">

        <h3 className="h5 mb-3">
          Participantes inscritos
        </h3>

        {!inscripcionesCerradas ? (

          <div className="alert alert-warning mb-0">
            El torneo debe estar cerrado para poder
            ver a los jugadores y equipos.
          </div>

        ) : participantes.length === 0 ? (

          <p className="text-secondary mb-0">
            {totalInscritos > 0
              ? 'Todavía no está disponible el listado de los participantes iniciales.'
              : 'Todavía no existen participantes inscritos.'}
          </p>

        ) : (

          <>
            <p className="text-secondary">
              Participantes identificados: {participantes.length}
            </p>

            <div className="table-responsive">

              <table className="table table-striped align-middle">

                <thead>
                  <tr>
                    <th>N.º</th>
                    <th>Participante</th>
                    <th>Tipo</th>
                  </tr>
                </thead>

                <tbody>

                  {participantes.map((participante, indice) => (
                    <tr key={`${participante.tipo}-${participante.id}`}>

                      <td>{indice + 1}</td>

                      <td>{participante.nombre}</td>

                      <td>
                        {participante.tipo === 'equipo'
                          ? 'Equipo'
                          : 'Jugador'}
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

export default ListaParticipantes
