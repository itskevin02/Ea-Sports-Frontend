
function LlaveTorneo({ partidas = [] }) {
  return (
    <div className="card">
      <div className="card-body">

        <h3 className="h5 mb-3">
          Llaves del Torneo
        </h3>

        <p className="text-secondary">
          Enfrentamientos y participantes de cada ronda.
        </p>

        {partidas.length === 0 ? (
          <p className="text-secondary">
            Todavía no hay partidas programadas.
          </p>
        ) : (
          <div className="row g-3">

            {partidas.map((partida) => (
              <div
                className="col-12 col-md-6"
                key={partida.id}
              >
                <div className="border rounded p-3">

                  <h4 className="h6 mb-3">
                    {partida.ronda}
                  </h4>

                  <div className="mb-2">
                    <strong>Participante 1:</strong>

                    <p className="mb-0">
                      {partida.participanteA ||
                        'Participante por definir'}
                    </p>
                  </div>

                  <div className="mb-2">
                    <strong>Participante 2:</strong>

                    <p className="mb-0">
                      {partida.participanteB ||
                        'Participante por definir'}
                    </p>
                  </div>

                  <p className="text-secondary mb-0">
                    Estado: {partida.estado}
                  </p>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  )
}

export default LlaveTorneo
