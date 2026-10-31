import type { Messages } from '..'

export const auth: Messages['auth'] = {
  meta: {
    title: 'Iniciar sesión',
    description:
      'Inicia sesión para guardar tu progreso y seguir practicando la comunicación compasiva.',
  },
  welcomingIn: 'Abriéndote la puerta...',
  protectedLoading: 'Preparando tu espacio...',
  headings: {
    signIn: {
      title: 'Iniciar sesión',
      subtitle: 'Tus conversaciones y tu progreso se guardan en tu cuenta',
    },
    signUp: {
      title: 'Crea tu cuenta',
      subtitle: 'Tu práctica es solo tuya',
    },
    resetRequest: {
      title: 'Restablece tu contraseña',
      subtitle: 'Te enviaremos un código por correo para crear una nueva',
    },
    resetVerify: {
      title: 'Elige una contraseña nueva',
      subtitle: 'Escribe el código que te enviamos y tu nueva contraseña',
    },
  },
  welcome: {
    signIn:
      'Las conversaciones de práctica se guardan en tu cuenta, así que puedes volver a ellas. ¿Primera vez por aquí? Crea una cuenta abajo, solo lleva un momento.',
    signUp:
      'Qué bien que estés aquí. Con una cuenta puedes ensayar cualquier escenario tantas veces como quieras.',
    resetRequest:
      'Le pasa a todo el mundo. Dame la dirección con la que te registraste y te enviaré un código para que vuelvas a tu práctica.',
    resetVerify:
      'Ya casi está. Escribe el código que te llegó, elige una contraseña nueva y retomas donde lo dejaste.',
  },
  errors: {
    codeMismatch:
      'Ese código no coincide o ha caducado. Puedes enviarte uno nuevo.',
    wrongCredentials:
      'Ese correo y esa contraseña no coinciden con ninguna cuenta. Revísalos, o crea una cuenta nueva abajo.',
    tooManyAttempts:
      'Demasiados intentos por ahora. Espera un momento y vuelve a intentarlo.',
    passwordTooShort: 'Elige una contraseña de al menos 8 caracteres.',
    accountExists:
      'Ya existe una cuenta con este correo. Prueba a iniciar sesión.',
    signUpFailed:
      'No pudimos crear tu cuenta. Puede que ese correo ya tenga una, o que la contraseña tenga menos de 8 caracteres.',
    resetRequestFailed:
      'No pudimos iniciar el restablecimiento ahora mismo. Vuelve a intentarlo en un momento.',
    resetVerifyFailed:
      'No pudimos actualizar tu contraseña. Puede que el código no coincida o que haya caducado. Puedes enviarte uno nuevo.',
    signInFailed:
      'No pudimos iniciar tu sesión. Revisa tu correo y tu contraseña. Si no recuerdas bien la contraseña, puedes restablecerla.',
  },
  codeSent:
    'Si esa dirección tiene una cuenta, el código ya va en camino. Puede tardar un momento en llegar.',
  submit: {
    waiting: 'Un momento...',
    signUp: 'Crear cuenta',
    resetRequest: 'Enviarme un código',
    resetVerify: 'Guardar contraseña y entrar',
    signIn: 'Entrar',
  },
  github: {
    connecting: 'Conectando...',
    continue: 'Continuar con GitHub',
  },
  orWithEmail: 'o con tu correo',
  fields: {
    email: 'Correo electrónico',
    emailPlaceholder: 'tu@ejemplo.com',
    password: 'Contraseña',
    createPasswordPlaceholder: 'Crea una contraseña',
    passwordPlaceholder: 'Escribe tu contraseña',
    passwordHint: 'Al menos 8 caracteres, por seguridad',
    forgotPassword: '¿Olvidaste tu contraseña?',
    code: 'Código de tu correo',
    codePlaceholder: '12345678',
    newPassword: 'Contraseña nueva',
    newPasswordPlaceholder: 'Elige una contraseña nueva',
  },
  switchMode: {
    haveAccount: '¿Ya tienes una cuenta? ',
    signIn: 'Inicia sesión',
    newHere: '¿Primera vez con la comunicación compasiva? ',
    createAccount: 'Crea una cuenta',
  },
  reset: {
    noCode: '¿No te llegó el código?',
    sendAnother: 'Enviar otro',
    backToSignIn: 'Volver a iniciar sesión',
  },
}
