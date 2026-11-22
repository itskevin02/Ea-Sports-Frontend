
import { useState } from 'react'

import ResumenUsuariosApi from '../components/ResumenUsuariosApi'
import ResumenSancionesApi from '../components/ResumenSancionesApi'
import AdministracionEp2 from './AdministracionEp2'

function Administracion() {

  const [mostrarEp2, setMostrarEp2] = useState(false)

  return (
    <div>

      <h2 className="mb-3">
        Panel de Administración
      </h2>

      <p className="text-white-50 mb-4">
        Gestiona los usuarios y las sanciones
        registrados en el servidor.
      </p>

      {/* GESTION REAL MEDIANTE API */}
      <ResumenUsuariosApi />

      <ResumenSancionesApi />

      {/* ACCESO A LOS DATOS ANTERIORES */}
      <div className="card mb-4">

        <div className="card-body text-center">

          <h3 className="h5 mb-3">
            Registros anteriores de EP2
          </h3>

          <p className="text-secondary">
            Los jugadores y sanciones anteriores
            están guardados en este navegador.
            Todavía no están integrados con
            los microservicios.
          </p>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setMostrarEp2(!mostrarEp2)}
          >
            {mostrarEp2
              ? 'Ocultar registros anteriores'
              : 'Mostrar registros anteriores'}
          </button>

        </div>

      </div>

      {/* ADMINISTRACION ANTIGUA */}
      {mostrarEp2 && (
        <AdministracionEp2 />
      )}

    </div>
  )
}

export default Administracion
