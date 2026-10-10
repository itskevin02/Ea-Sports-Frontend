
import { equipoCompleto } from '../logica/validarInscripcion'

function FormularioInscripcion({
  tipo,
  equipoSeleccionado,
  integrantesMinimos,
  onConfirmar,
  children
}) {

  // Comprobar si la inscripción es por equipo
  const esInscripcionEquipo = tipo === 'equipo'

  // Comprobar si todavía no se seleccionó un equipo
  const faltaSeleccionarEquipo =
    esInscripcionEquipo && !equipoSeleccionado

  // Comprobar si el equipo seleccionado está incompleto
  const equipoIncompleto =
    esInscripcionEquipo &&
    equipoSeleccionado &&
    !equipoCompleto(
      equipoSeleccionado,
      integrantesMinimos
    )

  // Bloquear el botón cuando corresponda
  const bloquearInscripcion =
    faltaSeleccionarEquipo || equipoIncompleto

  return (
    <form onSubmit={onConfirmar} noValidate>

      {children}

      {/* No se ha seleccionado un equipo */}
      {faltaSeleccionarEquipo && (
        <p className="text-secondary mt-3 mb-0">
          Selecciona un equipo para continuar
          con la inscripción.
        </p>
      )}

      {/* El equipo seleccionado no cumple los requisitos */}
      {equipoIncompleto && (
        <p className="text-danger mt-3 mb-0">
          El equipo no tiene la cantidad mínima
          de integrantes para participar en este torneo.
        </p>
      )}

      {/* Confirmar inscripción */}
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
