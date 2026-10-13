
import { obtenerInscritosActuales } from '../logica/contarInscripciones'

// Obtener fecha actual en formato YYYY-MM-DD
function obtenerFechaActual() {
  const fecha = new Date()

  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')

  return `${anio}-${mes}-${dia}`
}

function InicioComplementos({ torneos = [], onVerDetalle }) {

  const fechaActual = obtenerFechaActual()

  // Buscar torneos con inscripciones disponibles
  const proximosCierres = torneos
    .filter((torneo) => {

      const inscritos = obtenerInscritosActuales(torneo)

      return (
        torneo.estado === 'Abierto' &&
        torneo.fechaCierre &&
        torneo.fechaCierre >= fechaActual &&
        inscritos < torneo.cupos
      )
    })
    .sort((a, b) =>
      a.fechaCierre.localeCompare(b.fechaCierre)
    )
    .slice(0, 3)

  return (
    <>

      {/* PRÓXIMOS CIERRES DE INSCRIPCIÓN */}
      <section className="mb-5">

        <h2 className="inicio-seccion-titulo mb-2">
          Próximos cierres de inscripción
        </h2>

        <p className="inicio-seccion-descripcion mb-4">
          Revisa los torneos que pronto dejarán
          de recibir participantes.
        </p>

        {proximosCierres.length === 0 ? (

          <div className="alert alert-secondary">
            Actualmente no hay torneos con inscripciones
            abiertas y cupos disponibles.
          </div>

        ) : (

          <div className="row g-3">

            {proximosCierres.map((torneo) => (

              <div
                className="col-12 col-md-4"
                key={torneo.id}
              >

                <div className="card h-100">
                  <div className="card-body d-flex flex-column">

                    <h3 className="h6 fw-bold">
                      {torneo.nombre}
                    </h3>

                    <p className="text-secondary small">
                      {torneo.juego}
                    </p>

                    <p className="mb-2">
                      <strong>Fecha de cierre:</strong>{' '}
                      {torneo.fechaCierre}
                    </p>

                    <p className="text-secondary small">
                      Inscripciones disponibles
                    </p>

                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm mt-auto"
                      onClick={() => {
                        if (onVerDetalle) {
                          onVerDetalle(torneo)
                        }
                      }}
                    >
                      Ver torneo
                    </button>

                  </div>
                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* VIDEO DE PRESENTACIÓN */}
      <section className="mb-5">

        <h2 className="inicio-seccion-titulo mb-2">
          Vive la emoción de los eSports
        </h2>

        <p className="inicio-seccion-descripcion mb-4">
          Revive el FNCS Global Championship 2024,
          una competencia internacional de Fortnite
          en modalidad dúos.
        </p>

        <div className="card shadow-sm">
          <div className="card-body">

            <h3 className="h5 mb-3">
              Tráiler oficial FNCS Global Championship 2024
            </h3>

            {/* REPRODUCTOR DE YOUTUBE */}
            
        <div className="ratio ratio-16x9">
          <iframe
            src="https://www.youtube.com/embed/0611X-8GTGo"
            title="Tráiler oficial FNCS Global Championship 2024"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              border: 0,
              borderRadius: '8px'
            }}
          />
        </div>


            {/* DESCRIPCIÓN */}
            <p className="text-secondary mt-3 mb-3">
              Transmisión oficial de Fortnite Competitive.
              Se utiliza como referencia del ambiente
              competitivo de los torneos en dúos.
            </p>

            <p className="text-secondary small">
              Este video es material de referencia y
              no corresponde a un torneo organizado
              por eSports Arena Manager.
            </p>

            {/* ENLACE AL VIDEO ORIGINAL */}
            <a
              href="https://www.youtube.com/watch?v=0611X-8GTGo"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary"
            >
              Ver video en YouTube
            </a>

            <p className="text-secondary small mt-3 mb-0">
              Si el reproductor no carga, utiliza
              el botón para abrir la transmisión
              directamente en YouTube.
            </p>

          </div>
        </div>

      </section>

    </>
  )
}

export default InicioComplementos
