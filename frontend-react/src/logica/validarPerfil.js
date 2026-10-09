
function validarPerfil(
  apodo,
  correo,
  contrasena,
  confirmarContrasena,
  validarContrasena = true
) {
  const errores = {}

  if (apodo === '') {
    errores.apodo = 'El apodo es obligatorio.'
  } else if (apodo.includes(' ')) {
    errores.apodo = 'El apodo no puede contener espacios.'
  } else if (apodo.length < 3) {
    errores.apodo = 'El apodo debe tener al menos 3 caracteres.'
  }

  const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (correo === '') {
    errores.correo = 'El correo electrónico es obligatorio.'
  } else if (!formatoCorreo.test(correo)) {
    errores.correo = 'El correo electrónico no tiene un formato válido.'
  }

  if (validarContrasena) {
    if (contrasena.length < 6) {
      errores.contrasena = 'La contraseña debe tener al menos 6 caracteres.'
    }

    if (confirmarContrasena !== contrasena) {
      errores.confirmarContrasena =
        'La confirmación no coincide con la contraseña.'
    }
  }

  return errores
}

export default validarPerfil
