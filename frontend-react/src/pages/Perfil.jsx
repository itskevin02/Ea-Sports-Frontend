
import { useState } from 'react'

import { useAuth } from '../auth/useAuth'
import PerfilEp2 from './PerfilEp2'

function Perfil() {

  const { usuario } = useAuth()

  const [mostrarAnterior, setMostrarAnterior] = useState(false)

  return (
    <div>

      <h2 className="mb-3">
        Mi cuenta
      </h2>

      <p className="text-white-50 mb-4">
        Consulta los datos de tu sesión
        en eSports Arena Manager.
      </p>

      {/* DATOS DE LA SESION */}
      <div className="card mb-4">

        <div className="card-body p-4">

          <h3 className="h5 mb-4">
            Información de la cuenta
          </h3>

          <div className="row g-3">

            <div className="col-12 col-md-6">

              <div className="border rounded-3 p-3">

                <p className="text-secondary mb-2">
                  Nombre de usuario
                </p>

                <h4 className="h5 mb-0">
                  {usuario?.username || 'No disponible'}
                </h4>

              </div>

            </div>

            <div className="col-12 col-md-6">

              <div className="border rounded-3 p-3">

                <p className="text-secondary mb-2">
                  Rol de la cuenta
                </p>

                <h4 className="h5 mb-0">
                  {usuario?.rol || 'No disponible'}
                </h4>

              </div>

            </div>

          </div>

          <p className="text-secondary small mt-4 mb-0">
            Esta información corresponde a la cuenta
            que inició sesión mediante Auth.
          </p>

        </div>

      </div>

      {/* ACLARACION SOBRE LOS DATOS */}
      <div className="alert alert-info">

        Los perfiles de jugadores todavía no están
        vinculados automáticamente con las cuentas
        de inicio de sesión.

      </div>

      {/* DATOS ANTERIORES DE EP2 */}
      {usuario?.rol === 'ADMIN' && (

        <div className="card mb-4">

          <div className="card-body">

            <h3 className="h5 mb-3">
              Perfiles anteriores de EP2
            </h3>

            <p className="text-secondary">
              Consulta los perfiles de jugadores
              guardados anteriormente en este navegador.
            </p>

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => setMostrarAnterior(!mostrarAnterior)}
            >
              {mostrarAnterior
                ? 'Ocultar perfiles anteriores'
                : 'Mostrar perfiles anteriores'}
            </button>

          </div>

        </div>

      )}

      {usuario?.rol === 'ADMIN' && mostrarAnterior && (
        <PerfilEp2 />
      )}

    </div>
  )
}

export default Perfil
