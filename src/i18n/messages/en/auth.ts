/**
 * English copy for signing in, signing up and resetting a password.
 */
export const auth = {
  meta: {
    title: 'Sign in',
    description:
      'Sign in to save your progress and keep practicing compassionate communication.',
  },
  welcomingIn: 'Welcoming you in...',
  protectedLoading: 'Getting your space ready...',
  headings: {
    signIn: {
      title: 'Sign in',
      subtitle: 'Your conversations and progress are saved to your account',
    },
    signUp: {
      title: 'Create Your Account',
      subtitle: 'Your practice stays private to you',
    },
    resetRequest: {
      title: 'Reset your password',
      subtitle: 'We will email you a code to set a new one',
    },
    resetVerify: {
      title: 'Choose a new password',
      subtitle: 'Enter the code we emailed you, and your new password',
    },
  },
  welcome: {
    signIn:
      'Practice conversations are saved to your account, so you can come back to them. New here? Create an account at the bottom, it only takes a moment.',
    signUp:
      "Glad you're here. Once you have an account, you can rehearse any scenario as many times as you like.",
    resetRequest:
      "It happens to everyone. Give me the address you signed up with and I'll send you a code so you can get back to your practice.",
    resetVerify:
      "Almost there. Pop in the code from your inbox, choose a new password, and you're back where you left off.",
  },
  /** Friendly wording for sign in failures, never the raw server codes. */
  errors: {
    codeMismatch:
      'That code did not match, or it has expired. You can send yourself a new one.',
    wrongCredentials:
      "That email and password don't match an account. Please double-check them, or create a new account below.",
    tooManyAttempts:
      'Too many attempts for now. Please wait a moment and try again.',
    passwordTooShort: 'Please choose a password with at least 8 characters.',
    accountExists:
      'An account with this email already exists. Try signing in instead.',
    signUpFailed:
      "We couldn't create your account. That email may already have one, or the password may be under 8 characters.",
    resetRequestFailed:
      "We couldn't start the reset just now. Please try again in a moment.",
    resetVerifyFailed:
      "We couldn't update your password. The code may not match, or it may have expired. You can send yourself a new one.",
    signInFailed:
      "We couldn't sign you in. Please check your email and password. If you are not sure of your password, you can reset it.",
  },
  codeSent:
    'If that address has an account, a code is on its way. It can take a moment to arrive.',
  submit: {
    waiting: 'Please wait...',
    signUp: 'Create Account',
    resetRequest: 'Email me a code',
    resetVerify: 'Update password and sign in',
    signIn: 'Sign In',
  },
  github: {
    connecting: 'Connecting...',
    continue: 'Continue with GitHub',
  },
  orWithEmail: 'or with email',
  fields: {
    email: 'Email Address',
    emailPlaceholder: 'you@example.com',
    password: 'Password',
    createPasswordPlaceholder: 'Create a password',
    passwordPlaceholder: 'Enter your password',
    passwordHint: 'Minimum 8 characters for security',
    forgotPassword: 'Forgot your password?',
    code: 'Code from your email',
    codePlaceholder: '12345678',
    newPassword: 'New Password',
    newPasswordPlaceholder: 'Choose a new password',
  },
  switchMode: {
    // Each prompt is followed by its action button, as one line.
    haveAccount: 'Already have an account? ',
    signIn: 'Sign in',
    newHere: 'New to compassionate communication? ',
    createAccount: 'Create account',
  },
  reset: {
    // noCode is followed by the sendAnother button, as one line.
    noCode: 'Code did not arrive?',
    sendAnother: 'Send another',
    backToSignIn: 'Back to sign in',
  },
}
