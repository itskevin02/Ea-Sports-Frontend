
import ResumenInscripcionesApi from '../components/ResumenInscripcionesApi'

function Inscripcion() {

  return (
    <div>

      <h2 className="mb-3">
        Inscripción a Torneos
      </h2>

      <p className="text-white-50 mb-4">
        Selecciona un torneo, inscribe a tu equipo
        y administra las inscripciones registradas
        en el servidor.
      </p>

      {/* INSCRIPCIONES REALES - EP3 */}
      <ResumenInscripcionesApi />

    </div>
  )
}

export default Inscripcion
