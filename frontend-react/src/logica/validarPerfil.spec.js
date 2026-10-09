
import validarPerfil from '../logica/validarPerfil'

describe('Validaciones del perfil del jugador', () => {

  it('rechaza datos incorrectos del perfil', () => {
    const errores = validarPerfil(
      'Ke',
      'correo-invalido',
      '123',
      '456'
    )

    expect(errores.apodo).toBe(
      'El apodo debe tener al menos 3 caracteres.'
    )

    expect(errores.correo).toBe(
      'El correo electrónico no tiene un formato válido.'
    )

    expect(errores.contrasena).toBe(
      'La contraseña debe tener al menos 6 caracteres.'
    )

    expect(errores.confirmarContrasena).toBe(
      'La confirmación no coincide con la contraseña.'
    )
  })

})
