
import { useEffect, useState } from 'react'

import { useAuth } from '../auth/useAuth'
import { usuariosService } from '../services/usuarios'

import PerfilEp2 from './PerfilEp2'

function Perfil() {

  const { usuario } = useAuth()

  const [perfil, setPerfil] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const [mostrarAnterior, setMostrarAnterior] = useState(false)

  // Consultar el perfil real desde User
  useEffect(() => {

    let activo = true

    setPerfil(null)
    setError('')
    setCargando(false)

    if (!usuario?.authId) {
      return
    }

    setCargando(true)

    usuariosService.miPerfil()
      .then((datos) => {

        if (activo) {
          setPerfil(datos)
        }

      })
      .catch((err) => {

        if (activo) {
          setError(err.message)
        }

      })
      .finally(() => {

        if (activo) {
          setCargando(false)
        }

      })

    return () => {
      activo = false
    }

  }, [usuario?.authId])

  return (
    <div>

      <h2 className="mb-3">
        Mi cuenta
      </h2>

      <p className="text-white-50 mb-4">
        Consulta los datos de tu cuenta y tu perfil
        en eSports Arena Manager.
      </p>

      {/* CUENTA DE AUTH */}
      <div className="card bg-dark text-white border-secondary mb-4">

        <div className="card-body p-4">

          <h3 className="h5 mb-4">
            Información de la cuenta
          </h3>

          <div className="row g-3">

            <div className="col-12 col-md-6">

              <div className="border border-secondary rounded-3 p-3">

                <p className="text-white-50 mb-2">
                  Nombre de usuario
                </p>

                <h4 className="h5 mb-0">
                  {usuario?.username || 'No disponible'}
                </h4>

              </div>

            </div>

            <div className="col-12 col-md-6">

              <div className="border border-secondary rounded-3 p-3">

                <p className="text-white-50 mb-2">
                  Rol de la cuenta
                </p>

                <h4 className="h5 mb-0">
                  {usuario?.rol || 'No disponible'}
                </h4>

              </div>

            </div>

          </div>

          <p className="text-white-50 small mt-3 mb-0">
            Cuenta autenticada mediante Auth.
          </p>

        </div>

      </div>

      {/* PERFIL VINCULADO DESDE USER */}
      <div className="card bg-dark text-white border-secondary mb-4">

        <div className="card-body p-4">

          <h3 className="h5 mb-3">
            Mi perfil de jugador
          </h3>

          {!usuario?.authId ? (

            <div className="alert alert-warning mb-0">
              Tu sesión no contiene el identificador de Auth.
              Cierra sesión y vuelve a iniciar sesión.
            </div>

          ) : cargando ? (

            <p className="text-white-50 mb-0">
              Cargando perfil del servidor...
            </p>

          ) : error ? (

            <div className="alert alert-info mb-0">

              <p className="mb-2">
                No se pudo cargar el perfil: {error}
              </p>

              <p className="mb-0">
                Si todavía no tienes un perfil vinculado,
                un administrador debe asociarlo con tu cuenta.
              </p>

            </div>

          ) : perfil ? (

            <div className="row g-3">

              <div className="col-12 col-md-6">

                <div className="border border-secondary rounded-3 p-3">

                  <p className="text-white-50 mb-2">
                    Nombre
                  </p>

                  <p className="fw-bold mb-0">
                    {perfil.nombre}
                  </p>

                </div>

              </div>

              <div className="col-12 col-md-6">

                <div className="border border-secondary rounded-3 p-3">

                  <p className="text-white-50 mb-2">
                    Nickname
                  </p>

                  <p className="fw-bold mb-0">
                    {perfil.nickname}
                  </p>

                </div>

              </div>

              <div className="col-12 col-md-6">

                <div className="border border-secondary rounded-3 p-3">

                  <p className="text-white-50 mb-2">
                    Correo
                  </p>

                  <p className="fw-bold mb-0">
                    {perfil.correo}
                  </p>

                </div>

              </div>

              <div className="col-12 col-md-6">

                <div className="border border-secondary rounded-3 p-3">

                  <p className="text-white-50 mb-2">
                    Estado del perfil
                  </p>

                  <p className="fw-bold mb-0">
                    {perfil.estado}
                  </p>

                </div>

              </div>

            </div>

          ) : (

            <p className="text-white-50 mb-0">
              No hay información de perfil para mostrar.
            </p>

          )}

        </div>

      </div>

      {/* VERSION ANTERIOR DE EP2 */}
      {usuario?.rol === 'ADMIN' && (

        <div className="card bg-dark text-white border-secondary mb-4">

          <div className="card-body p-4">

            <h3 className="h5 mb-3">
              Perfiles anteriores de EP2
            </h3>

            <p className="text-white-50">
              Puedes consultar los perfiles antiguos
              guardados en este navegador.
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
