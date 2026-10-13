
import { equipoCompleto } from '../logica/validarInscripcion'

function FormularioInscripcion({
  tipo,
  equipoSeleccionado,
  integrantesMinimos,
  onConfirmar,
  children,
  puedeConfirmar = true,
  mensajeBloqueo = ''
}) {

  const esInscripcionEquipo = tipo === 'equipo'

  const faltaSeleccionarEquipo =
    esInscripcionEquipo && !equipoSeleccionado

  const equipoIncompleto =
    esInscripcionEquipo &&
    equipoSeleccionado &&
    !equipoCompleto(
      equipoSeleccionado,
      integrantesMinimos
    )

  // El botón se bloquea si no se cumplen los requisitos
  const bloquearInscripcion =
    !puedeConfirmar ||
    faltaSeleccionarEquipo ||
    equipoIncompleto

  // Mensaje que verá el usuario
  let aviso = mensajeBloqueo

  if (!aviso && faltaSeleccionarEquipo) {
    aviso = 'Selecciona un equipo para continuar.'
  }

  if (!aviso && equipoIncompleto) {
    aviso =
      'El equipo no tiene la cantidad mínima de integrantes.'
  }

  return (
    <form onSubmit={onConfirmar} noValidate>

      {children}

      {aviso && (
        <p className="text-secondary mt-3 mb-0">
          {aviso}
        </p>
      )}

      <button
        type="submit"
        className="btn btn-primary mt-4"
        disabled={bloquearInscripcion}
      >
        Confirmar inscripción
      </button>

    </form>
  )
}

export default FormularioInscripcion
