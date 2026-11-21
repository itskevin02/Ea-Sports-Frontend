
import ResumenEquiposApi from '../components/ResumenEquiposApi'

function Equipos() {

  return (
    <div>

      <h2 className="mb-3">
        Gestión de Equipos
      </h2>

      <p className="text-white-50 mb-4">
        Crea, consulta, edita y elimina equipos
        registrados en eSports Arena Manager.
      </p>

      <ResumenEquiposApi />

    </div>
  )
}

export default Equipos
