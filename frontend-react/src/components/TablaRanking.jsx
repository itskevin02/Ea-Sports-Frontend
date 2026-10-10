
function TablaRanking({ participantes = [] }) {

  return (
    <div className="card">
      <div className="card-body">

        <h3 className="h5 mb-3">
          Tabla de posiciones
        </h3>

        <p className="text-secondary">
          Clasificación de los participantes según
          los resultados registrados.
        </p>

        {participantes.length === 0 ? (

          <p className="text-secondary text-center">
            Todavía no existen resultados registrados.
          </p>

        ) : (

          <div className="table-responsive">

            <table className="table table-striped align-middle">

              <thead>
                <tr>
                  <th>Posición</th>
                  <th>Participante</th>
                  <th>Puntos</th>
                  <th>Diferencia</th>
                </tr>
              </thead>

              <tbody>

                {participantes.map((participante, indice) => (
                  <tr key={participante.nombre}>

                    <td>{indice + 1}</td>

                    <td>{participante.nombre}</td>

                    <td>{participante.puntos}</td>

                    <td>
                      {participante.diferencia > 0
                        ? `+${participante.diferencia}`
                        : participante.diferencia}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>
    </div>
  )
}

export default TablaRanking
